(function() {
  'use strict';

  angular.module('parks')
  .factory('ParksService', ParksService);

  ParksService.$inject = ['$http'];

  function ParksService($http, ParksService){

    function getAllParks() {
      return $http({
        url: '/dog-parks',
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

    function createPark(park) {
      if (typeof(park) !== 'object' || Object.keys(park).length === 0){
        return Promise.reject('You need to fill out all fields');
      }
      return $http({
        url: '/dog-parks',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          name: park.name,
          street: park.street,
          city: park.city,
          state: park.state,
          zipcode: park.zipcode,
          description: park.description
        }
      })
      .then(function handleResponse(response){
        return response.data;
      });
      // add catch
    }

    // function getParkById(id) {
    //   return $http({
    //     url: '/dog-parks' + id,
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }
    //   })
    //   .then(function handleResponse(response) {
    //     return response.data;
    //   });
    //   // add catch
    // }

    return {
      getAllParks: getAllParks,
      createPark: createPark
      // getParkById: getParkById
    };
  }
}());
