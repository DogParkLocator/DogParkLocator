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
    /**
     * Adds a new park from the user and adds a park to the bottom of the parks list page.
     * Uses ParkService for actual persistence of data.
     * @param  {Object} park User inputted data needed to create a park
     * @return {void}
     */
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
    /**
     * Deletes a park from our page
     * @param  {String} id The park ID to retrieve in order to delete
     * @return {void}
     */
    vm.deleteAPark = function deleteAPark(id) {
      vm.hasError = false;
      return ParksService.deleteAPark(id)
      .then(function deleteSuccess(parkResponse) {
        console.log('successfully deleted: ', parkResponse);
        // vm.getAllParks(); // this line not needed with location.reload()
        window.location.reload();
      })
      .catch(function showDeleteError(err) {
        vm.message = 'There was a problem deleting the park';
        vm.hasError = true;
        console.error(err);
      });
    };
    /**
     * Gets a list of all parks from the API
     * @param  {String} property criteria by which to search
     * @param  {String} value    search parameter
     * @return {Void}         
     */
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
          vm.hasError = true;
        }
        else {
          vm.message = 'There was a problem getting all parks.';
          vm.hasError = true;
        }
        console.error(err);
      });
    };
    vm.getAllParks();
  }
}());
