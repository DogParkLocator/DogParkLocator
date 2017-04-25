(function() {
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
        barkObjects: '=',
        center: '=',
        barkPins: '='
      }
    };

    function initMap(scope, element, attributes, controller) {
      console.log('adding a map');
      let barkMap = new google.maps.Map(document.querySelector('.barkMap'), {
        zoom: 11,
        center: {lat: 38.899, lng: -77.032} // The Iron Yard
        // Change center to scope.center or geolocation before deployment
      });

      let barkBounds = new google.maps.LatLngBounds();
      // barkFinder is a geocoder for address location
      let barkFinder = new google.maps.Geocoder();

      // Pin for testing. Remove for product deployment
      let sampleBarkMarker = new google.maps.Marker({
        title: 'The Iron Yard is a sample dog park',
        map: vm.barkMap,
        position: {lat: 38.899, lng: -77.032} // The Iron Yard
      });

      // attach barkFinder functionality to the page button
      document.getElementById('findBark').addEventListener('click', function() {
        let barkAddress = document.getElementById('barkAddress').value;
        findTheBark(barkAddress, barkObject);
      });

      // removes all barkMarkers from the map
      function clearBarkMarkers() {
        barkMarkers.forEach(function deleteMarkers(barkMarker) {
          barkMarker.setMap(null);
        });
        barkMarkers = [];
      }




      //fill latitude and longitude data for each barkObject
      barkObjects.forEach(function geocodeBarkObject(barkObject) {
        let barkLocation;
        barkFinder.geocode({'address': barkAddress}, function(results, status) {
          if (status === 'OK') {
            // add barkMarker to bounds? resize and recenter map appropriately?
            addBarkMarker(results[0].geometry.location)
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      });

      /**
       * Returns an address string for a barkObject
       * @param  {Object} barkObject Park object conforming to Park.model
       * @return {String}            Geocodable address string
       */
      function barkAddressString(barkObject) {
        return barkObject.street + ', ' + barkObject.city + ', ' + barkObject.state + ' ' + barkObject.zipcode;
      }

      /**
       * Returns the lat, long location of a park using the address
       * @param  {Object} barkObject a bark Object conforming to Park.model
       * @return {Object}            a location: {lat, long}
       */
      function getBarkLocation(barkObject) {
        barkFinder.geocode({'address': barkAddressString(barkObject)}, function(results, status) {
            if (status === 'OK') {
              addBarkMarker(results[0].geometry.location)
            } else {
              alert('Geocode was not successful for the following reason: ' + status);
            }
        });
      }

      // adds all barks to the map
      function addAllBarksToMap() {
        barkObjects.forEach
      }

      // adds a marker to the map for the park passed as argument
      function addBarkMarker(barkObject, location) {
        let barkMarker = new google.maps.Marker({
          title: barkObject.name,
          map: barkMap,
          position: location
        });
        barkBounds.extend(google.maps.LatLng(location));
      }

      // find bark by address or name
      function findTheBark(barkAddress) {
        barkFinder.geocode({'address': barkAddress}, function(results, status) {
          if (status === 'OK') {
            // add barkMarker to bounds? resize and recenter map appropriately?
            addBarkMarker(results[0].geometry.location)
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
    } // initMap
  }
})();
