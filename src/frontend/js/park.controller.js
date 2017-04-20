(function() {
  'use strict';

  angular.module('parks')
  .controller('ParksController', ParksController);

  ParksController.$inject = ['ParksService'];

  function ParksController(ParksService) {
    let vm = this;
    vm.parks = [];
    vm.park = {};

    ParksService.getAllParks()
    .then(function addDataOnScope(parks) {
      vm.parks = parks;
    })
    .catch(function handleError(err){
      console.warn(err);
    });

    function getParkById(id){
      if (typeof(id) !== 'string' || id.length === 0) {
        return; // should add error log or return error
      }
      ParksService.getParkById(id)
      .then(function addDataOnScope(park) {
        vm.park = park;
      })
      .catch(function handleError(err){
        if (err.status === 404) {
          vm.hasError = true;
          vm.errorMessage = 'Could not find the park with that id';
        }
        else {
          vm.hasError = true;
          vm.errorMessage = 'Unknown error from server';
        }
      });
    }
  }
}());
