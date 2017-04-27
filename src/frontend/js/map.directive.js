(function() {
  'use strict';

  angular.module('parks')
  .directive('map', Map);

  let $ = angular.element;

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
      console.log('park center: ', scope.center);

      let parkMap = new google.maps.Map(document.querySelector('.parkMap'), {
        zoom: 11,
        center: scope.center // The Iron Yard---change to geolocation before deployment?
      });

      let parkMarkers = [];
      let parkFinder = new google.maps.Geocoder();

      // Pin for testing. Remove for product deployment
      let sampleParkMarker = new google.maps.Marker({
        title: 'The Iron Yard is a dog park',
        map: parkMap,
        position: scope.center // The Iron Yard
      });

      // attach parkFinder functionality to the 'Find the Bark' button
      document.getElementById('findPark').addEventListener('click', function() {
        let parkAddress = document.getElementById('parkAddress').value;
        // !!!!!!!!!! fix Object--existing park? !!!!!!!!!!!!!!!!!!!!!!
        findThePark(parkAddress); // find the park adds a park marker... we want this?
        // make the marker a different color to indicate not a new object yet?
      });

      // removes all parkMarkers from the map
      function clearParkMarkers() {
        parkMarkers.forEach(function deleteMarkers(parkMarker) {
          parkMarker.setMap(null);
        });
        parkMarkers = [];
      }

      // adds all parks to the map when array of parkObjects changes
      scope.$watch('parkObjects', function addAllParksToMap() {
        clearParkMarkers();
        let parkMapBounds = new google.maps.LatLngBounds();
        console.log('adding all parks to map', scope.parkObjects);
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
              console.log('park location', parkLocation);
              let parkMarker = new google.maps.Marker({
                title: parkObject.name,
                map: parkMap,
                position: parkLocation
              });
              parkMarker.data = parkObject;
              console.log('park marker\'s park data', parkMarker.data);

              let contentString = "<section class='parks-list panel panel-default'><header class='panel-heading'><main><strong>Bark</strong><p>" + parkObject.name + "</p></main><main class='address'><strong>Address</strong><ul><li>" + parkObject.street + "</li><li>" + parkObject.city + ", " + parkObject.state + " " +  parkObject.zipcode + "</li></ul></main></header><article class='panel-body'><main><strong>Description</strong><p>" + parkObject.description + "</p></main><main><likes park='park'></likes></main></article></section>";

              let parkInfoWindow = new google.maps.InfoWindow({
                content: contentString
              });

              parkMarker.addListener('click', function parkClick(event) {
                console.log('park marker clicked', parkMarker);
                parkInfoWindow.open(parkMap, parkMarker);
              });
              console.log('new park marker', parkMarker);
              parkMarkers.push(parkMarker);
              parkMapBounds.extend(parkLocation);
            }
          });
        }

        if (parkMarkers.length > 0) {
          console.log('park map bounds', parkMapBounds);
          parkMap.fitBounds(parkMapBounds);
          parkMap.panToBounds(parkMapBounds);
        }
      });

      // find park by address or name
      function findThePark(parkAddress) {
        parkFinder.geocode({'address': parkAddress}, function(results, status) {
          if (status === 'OK') {
            console.log('geocoding location results: ', results[0].geometry.location);
            let parkMarker = new google.maps.Marker({
              title: 'new dog park: ' + parkAddress,
              map: parkMap,
              position: results[0].geometry.location
            });
            parkMap.setCenter(results[0].geometry.location);
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
    } // initMap
  }
})();
