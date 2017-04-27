(function() {
  'use strict';

  angular.module('parks')
  .controller('ParksController', ParksController);

  ParksController.$inject = ['ParksService'];

  function ParksController(ParksService) {
    let vm = this;
    vm.parks = [];
    vm.park = {};
    vm.center = {lat: 38.899, lng: -77.032}; // the iron yard location (for testing only)
    vm.parkMarkerClicked = {}; // a google maps marker object
    // !!!!!!!!!!!!!!! how do we handle this? !!!!!!!!!!!!!!!!!!!!!!

    vm.getAllParks = function getAllParks(){
      ParksService.getAllParks()
      .then(function addParksToScope(parks) {
        vm.parks = parks;
      })
      .catch(function handleError(err){
        console.error(err);
      });
    };
    vm.getAllParks();

    vm.createPark = function createPark(park) {
      ParksService.createPark(park);
      vm.park = {};
      console.log('just added a park, here are all parks', vm.parks);
    };

    // function getParkById(id){
    //   if (typeof(id) !== 'string' || id.length === 0) {
    //     return; // should add error log or return error
    //   }
    //   ParksService.getParkById(id)
    //   .then(function addDataOnScope(park) {
    //     vm.park = park;
    //   })
    //   .catch(function handleError(err){
    //     console.warn(err);
    //     if (err.status === 404) {
    //       vm.hasError = true;
    //       vm.errorMessage = 'Could not find the park with that id';
    //     }
    //     else {
    //       vm.hasError = true;
    //       vm.errorMessage = 'Unknown error from server';
    //     }
    //   });
    // }
  }
}());
