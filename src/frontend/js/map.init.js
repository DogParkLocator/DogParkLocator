(function() {
  'use strict';

  function initMap() {
    let mapCenterLatLng = {lat: -34.397, lng: 150.644};
    let map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: mapCenterLatLng
    });
    let geocoder = new google.maps.Geocoder();
    let newMarker = new google.maps.Marker({
      position: mapCenterLatLng,
      map: map,
      title: 'this is a sample dog park'
    });
    document.getElementById('submit').addEventListener('click', function() {
      geocodeAddress(geocoder, map);
    });
  }

  function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('address').value;
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === 'OK') {
        resultsMap.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
}());
