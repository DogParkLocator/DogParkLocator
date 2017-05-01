(function() {
  'use strict';

  angular.module('parks')
  .controller('ParksController', ParksController);

  ParksController.$inject = ['$state', 'ParksService'];

  function ParksController($state, ParksService) {
    let vm = this;
    vm.parks = [];
    vm.park = {};
    vm.searchProperty = 'zipcode';
    vm.searchValue = '';
    vm.center = {lat: 38.899, lng: -77.032}; // the iron yard location. Replace with geolocation, when implemented
    vm.message = '';
    vm.hasError = false;

    vm.createPark = function createPark(park) {
      vm.hasError = false;
      ParksService.createPark(park)
      .then(function showCreateSuccess(parkResponse) {
        console.log('created park: ', parkResponse);
        vm.park = {};
        $state.go('parks-list');
      })
      .catch(function showCreateError(err) {
        console.error(err);
        vm.message = 'There was a problem creating the new park. Please ensure all fields are correct.';
        vm.hasError = true;
      });
    };

    vm.deleteAPark = function deleteAPark(id) {
      vm.hasError = false;
      return ParksService.deleteAPark(id)
      .then(function deleteSuccess(parkResponse) {
        console.log('successfully deleted: ', parkResponse);
        // vm.getAllParks(); // this line not needed with location.reload()
        window.location.reload();
      })
      .catch(function showDeleteError(err) {
        vm.hasError = true;
        vm.message = 'There was a problem deleting the park';
        console.error(err);
      });
    };

    vm.getAllParks = function getAllParks(property, value) {
      vm.hasError = false;
      return ParksService.getAllParks(property, value)
      .then(function addParksToScope(parksResponse) {
        console.log('add parks to scope:', parksResponse);
        vm.parks = parksResponse;
        vm.searchProperty = 'zipcode';
        vm.searchValue = '';
        return vm.parks;
      })
      .catch(function handleError(err) {
        vm.hasError = true;
        if (property && value) {
          vm.message = 'There was a problem getting all parks for ' + property + ': ' + value;
        }
        else {
          vm.message = 'There was a problem getting all parks.';
        }
        console.error(err);
      });
    };
    vm.getAllParks();

    // vm. getParkById = function getParkById(id) {
    //   if (typeof(id) !== 'string' || id.length === 0) {
    //     return; // should add error log or return error
    //   }
    //   ParksService.getParkById(id)
    //   .then(function addParkToScope(park) {
    //     vm.park = park;
    //   })
    //   .catch(function handleError(err){
    //     console.error(err);
    //     if (err.status === 404) {
    //       vm.hasError = true;
    //       vm.errorMessage = 'Could not find the park with that id';
    //     }
    //     else {
    //       vm.hasError = true;
    //       vm.errorMessage = 'Unknown error from server';
    //     }
    //   });
    // };
  }
}());
