(function() {
  'use strict';

  angular.module('parks')
  .controller('ParksController', ParksController);

  ParksController.$inject = ['ParksService'];

  function ParksController(ParksService) {
    let vm = this;
    vm.parks = [];
    vm.park = {};


    vm.getAllParks = function getAllParks(park){
      ParksService.getAllParks(park)
      .then(function addDataOnScope(data) {
        vm.parks = data;
      })
      .catch(function handleError(err){
        console.warn(err);
      });
    };
    vm.getAllParks();

    vm.createPark = function createPark(park) {
      ParksService.createPark(park);
      vm.park = {};
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
