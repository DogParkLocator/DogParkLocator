(function() {
  'use strict';

  angular.module('parks')
  .factory('ParksService', ParksService);

  ParksService.$inject = ['$http'];

  function ParksService($http, ParksService){

    function getAllParks(){
    return $http({
      url: 'https://findthebark.herokuapp.com/dog-parks',
      method: 'GET'
      })
      .then(function handleResponse(response){
        return response.data;
      });
    }



    return {
      getAllParks: getAllParks
    };

  }

}());
