(function() {
  'use strict';

  angular.module('parks')
  .controller('ParksController', ParksController);

  ParksController.$inject = ['ParksService'];

  function ParksController(ParksService) {
    let vm = this;
    vm.parks = [];
    vm.park = {};

    vm.getAllParks = function getAllParks() {
      ParksService.getAllParks()
      .then(function handleResponse(response){
        vm.parks = response;
      })
      .catch(function handleError(err){
        console.warn(err);
      });
    };

    vm.getAllParks();
  }
}());
