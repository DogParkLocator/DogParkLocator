(function() {
  'use strict';

  angular.module('parks')
  .directive('map', Map);

  let $ = angular.element;

  function Map() {
    return {
      restrict: 'E',  // map tag
      templateUrl: 'views/map.template.html',
      link: initMap
    };

    function initMap(scope, element, attributes, controller) {
      console.log("adding a map");
      // geolocation? for now, start with center on iron yard
      // otherwise grab center from scope
      let theIronYard = {lat: 38.899, lng: -77.032};
      let barkMap = new google.maps.Map(document.querySelector('.barkMap'), {
        zoom: 12,
        center: theIronYard
      });
      // Following pin is for testing only!! Should be removed for product deployment
      let newBarkPin = new google.maps.Marker({
        position: theIronYard,
        map: barkMap,
        title: 'The Iron Yard is a sample dog park'
      });
      // geocoding for address location
      let barkFinder = new google.maps.Geocoder();
      document.getElementById('findBark').addEventListener('click', function() {
        findTheBark(barkFinder, barkMap);
      });
    }

    function findTheBark(barkFinder, barkMap) {
      let bark = document.getElementById('bark').value;
      barkFinder.geocode({'address': bark}, function(results, status) {
        if (status === 'OK') {
          barkMap.setCenter(results[0].geometry.location);
          let barkPin = new google.maps.Marker({
            map: barkMap,
            position: results[0].geometry.location
          });
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    }
  }
})();
