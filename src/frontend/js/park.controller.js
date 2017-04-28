(function() {
  'use strict';

  angular.module('parks')
  .controller('ParksController', ParksController);

  ParksController.$inject = ['$state', '$scope', 'ParksService'];

  function ParksController($state, $scope, ParksService) {
    let vm = this;
    vm.parks = [];
    vm.park = {};
    vm.center = {lat: 38.899, lng: -77.032}; // the iron yard location (for testing only)
    vm.message = null;
    vm.hasError = false;

    vm.createPark = function createPark(park) {
      vm.hasError = false;
      ParksService.createPark(park)
      .then(function showCreateSuccess(parkResponse){
        console.log('created park: ', parkResponse);
        vm.park = {};
        $state.go('parks-list');
      })
      .catch(function showCreateError(err){
        console.error(err);
        vm.message = 'There was a problem creating the new park. Please ensure all fields are correct.';
        vm.hasError = true;
      });
    };

    vm.deleteAPark = function deleteAPark(id){
      vm.hasError = false;
      console.log('delete a park:', id);
      return ParksService.deleteAPark(id)
      .then(function showDeleteSuccess(){
        vm.message = 'The park has been deleted!';
        vm.hasError = false;
        vm.getAllParks()
        .then(function applyTheScope(data){
          vm.parks = data;
        });
      })
      .catch(function showDeleteError(err){
        console.warn(err);
        vm.message = 'There was a problem deleting the park!.';
        vm.hasError = true;

      });
    };
    
    vm.getAllParks = function getAllParks(){
      vm.hasError = false;
      return ParksService.getAllParks()
      .then(function addParksToScope(parks) {
        console.log('add parks to scope:', parks);
        vm.parks = parks;
        return parks;
      })
      .catch(function handleError(err){
        vm.hasError = true;
        vm.message = 'There was a problem getting all the parks!';
        console.error(err);
      });
    };
    vm.getAllParks();

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
