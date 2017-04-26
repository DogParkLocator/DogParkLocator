Park(function() {
  'use strict';

  angular.module('parks')
  .directive('map', Map);

  let $ = angular.element;
  let vm = this;

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

    function initMap(scope, element, attributes, controller) {
      console.log('adding a map');

      let parkMap = new google.maps.Map(document.querySelector('.parkMap'), {
        zoom: 11,
        center: scope.center // The Iron Yard
        // Change center to scope.center or geolocation before deployment
      });

      let parkMarkers = [];
      let parkBounds = new google.maps.LatLngBounds();
      let parkFinder = new google.maps.Geocoder();

      // Pin for testing. Remove for product deployment
      let sampleParkMarker = new google.maps.Marker({
        title: 'The Iron Yard is a dog park',
        map: parkMap,
        position: scope.center // The Iron Yard
      });

      // attach parkFinder functionality to the page button
      document.getElementById('findPark').addEventListener('click', function() {
        let parkAddress = document.getElementById('parkAddress').value;
        // !!!!!!!!!! fix Object--existing park? !!!!!!!!!!!!!!!!!!!!!!
        findThePark(parkAddress); // find the park adds a park marker... we want this?
      });

      // removes all parkMarkers from the map
      function clearParkMarkers() {
        parkMarkers.forEach(function deleteMarkers(parkMarker) {
          parkMarker.setMap(null);
        });
        parkMarkers = [];
      }

      // adds all parks to the map
      function addAllParksToMap() {
        scope.parkObjects.forEach(addParkMarker(parkObject));
      }

      // adds a marker to the map for the park passed as argument
      function addParkMarker(parkObject) {
        let parkMarker = new google.maps.Marker({
          title: parkObject.name,
          map: parkMap,
          position: {'lat': parkObject.latitude, 'lng': parkObject.longitude}
        });
        parkBounds.extend(google.maps.LatLng(location));
      }

      // find park by address or name
      function findThePark(parkAddress) {
        parkFinder.geocode({'address': parkAddress}, function(results, status) {
          if (status === 'OK') {
            // !!!!!!!!!! fix Object--existing park? !!!!!!!!!!!!!!!!!
            let newParkObject = {name: 'new dog park'};
            addParkMarker(newParkObject, results[0].geometry.location);
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
    } // initMap
  }
})();
