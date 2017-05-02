(function() {
  'use strict';

  angular.module('parks')
  .directive('map', Map);

  let $ = angular.element;

  /**
  * Map directive constructor
  */
  function Map() {
    return {
      restrict: 'E',
      templateUrl: 'views/map.template.html',
      link: initMap,
      scope: {
        parkObjects: '=',
        center: '='
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
      * removes all parkMarkers from the map
      * @return {void}
      */
      function clearParkMarkers() {
        parkMarkers.forEach(function deleteMarkers(parkMarker) {
          parkMarker.setMap(null);
        });
        parkMarkers = [];
      }

      // adds all parks to the map when the array of parkObjects changes
      scope.$watch('parkObjects', function addAllParksToMap() {
        clearParkMarkers();
        let parkMapBounds = new google.maps.LatLngBounds();
        if (scope.parkObjects.length === 0) {
          console.log('stopped adding pins because no parks');
        }
        else {
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
              let contentString = "<section class='parks-list panel panel-default'><header class='panel-heading'><main><strong>Bark</strong><p>" + parkObject.name + "</p></main><main class='address'><strong>Address</strong><ul><li>" + parkObject.street + "</li><li>" + parkObject.city + ", " + parkObject.state + " " +  parkObject.zipcode + "</li></ul></main></header><article class='panel-body'><main><strong>Description</strong><p>" + parkObject.description + "</p></main><main><likes park='park'></likes></main></article></section>";
              let parkInfoWindow = new google.maps.InfoWindow({
                content: contentString
              });
              parkMarker.addListener('click', function parkClick(event) {
                console.log('park marker clicked', parkMarker);
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
