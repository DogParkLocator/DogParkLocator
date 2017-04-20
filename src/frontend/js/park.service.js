(function() {
  'use strict';

  angular.module('parks')
  .factory('ParksService', ParksService);

  ParksService.$inject = ['$http'];

  function ParksService($http, ParksService){

    function getAllParks() {
      return $http({
        url: 'https://findthebark.herokuapp.com/dog-parks',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function handleResponse(response){
        return response.data;
      });
      // add catch
    }

    function getParkById(id) {
      return $http({
        url: 'https://findthebark.herokuapp.com/dog-parks' + id,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function handleResponse(response) {
        return response.data;
      });
      // add catch
    }

    return {
      getAllParks: getAllParks,
      getParkById: getParkById
    };
  }
}());
