(function() {
  'use strict';

  angular.module('parks')
  .directive('map', Map);

  let $ = angular.element;

  Map.$inject = ['$compile', '$rootScope'];

  /**
   * Map directive constructor
   * @param  {Object} $compile   an angular built-in service that precompiles a web-content controlled by the directive
   * @param  {Object} $rootScope an angular built-in service that provides access to the most global scope
   * @return {Object}            provides parameters for the behavior of the directive
   */
  function Map($compile, $rootScope) {
    return {
      restrict: 'E',
      templateUrl: 'views/map.template.html',
      link: initMap,
      scope: {
        parkObjects: '=',
        center: '=',
        park: '=?park'
      }
    };

    /**
    * creates a new google map, and adds pins for all parks
    * @param  {Object} scope data passed through html
    * @return {void}
    */
    function initMap(scope) {
      let parkMap = new google.maps.Map(document.querySelector('.parkMap'), {
        zoom: 11,
        center: scope.center // The Iron Yard---change to geolocation before deployment?
      });
      let parkMarkers = [];
      let parkFinder = new google.maps.Geocoder();

      /**
      * removes all parkMarkers from the map, and from the parkMarkers[]
      * @return {void}
      */
      function clearParkMarkers() {
        parkMarkers.forEach(function deleteMarkers(parkMarker) {
          parkMarker.setMap(null);
        });
        parkMarkers = [];
      }

      /**
       * adds all parks as park markers to the map when the array of parkObjects on scope changes
       * @return {void}
       */
      scope.$watch('parkObjects', function addAllParksToMap() {
        clearParkMarkers();
        let parkMapBounds = new google.maps.LatLngBounds();
        if (scope.parkObjects.length === 0) {
          console.log('stopped adding pins because no parks');
        }
        else {
          /**
           * adds a park marker to the map for each park object in parkObjects[] on scope
           * @param {Object} parkObject an object conforming to the spec in Park.model.js.
           */
          scope.parkObjects.forEach(function addMarker(parkObject) {
            if (!parkObject.latitude || !parkObject.longitude) {
              console.error('park does not have a latitude or longitude', parkObject);
            }
            else {
              console.log('adding park marker for: ', parkObject);
              let parkLocation = new google.maps.LatLng(parkObject.latitude, parkObject.longitude);
              let parkMarker = new google.maps.Marker({
                title: parkObject.name,
                map: parkMap,
                position: parkLocation,
                icon: '/img/dogParkMapMarker.png',
                animation: google.maps.Animation.DROP
              });
              parkMarker.data = parkObject;

              let markerScope = $rootScope.$new(true);
              markerScope.park = parkObject;

              let element = $compile("<marker-content park='park'></marker-content>")(markerScope);

              /**
               * Creates an info window when a park marker is clicked. Populates the info window with data from the parkObject the parkMarker represents
               * @param  {Object} event an event object
               * @return {void}
               */
              parkMarker.addListener('click', function parkClick(event) {
                let parkInfoWindow = new google.maps.InfoWindow({
                  content: element[0].outerHTML
                });
                parkInfoWindow.open(parkMap, parkMarker);
              });

              parkMarkers.push(parkMarker);
              parkMapBounds.extend(parkLocation);
            }
          });
        }
        if (parkMarkers.length > 0) {
          parkMap.fitBounds(parkMapBounds);
          parkMap.panToBounds(parkMapBounds);
        }
      });
    } // initMap
  }
})();
