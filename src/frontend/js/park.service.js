(function() {
  'use strict';

  angular.module('parks')
  .factory('ParksService', ParksService);

  ParksService.$inject = ['$http'];

  function ParksService($http, ParksService) {

    function getAllParks(property, value, sortBy = 'likes', ascending = false) {
      let params = {};
      params.sortBy = sortBy;
      params.ascending = ascending;
      params[property] = value;
      console.log('params: ', params);
      return $http({
        url: '/dog-parks',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        params: params
      })
      .then(function handleResponse(response){
        return response.data;
      });
    }

    function updateLikes(park) {
      if (!park || !park._id) {
        console.error('no park specified');
        return Promise.reject('Problem liking park: ', park);
      }
      else {
        return $http({
          url: '/dog-parks/' + park._id,
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
          },
          data: {
            likes: ++park.likes
          }
        })
        .then(function handleResponse(response){
          return response.data;
        });
      }
    }

    function updateDislikes(park) {
      if (typeof(park) !== 'object' || !park._id) {
        console.error('no park specified');
        return Promise.reject('Problem disliking park: ', park);
      }
      else {
        return $http({
          url: '/dog-parks/' + park._id,
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
          },
          data: {
            dislikes: ++park.dislikes
          }
        })
        .then(function handleResponse(response){
          return response.data;
        });
      }
    }

    function createPark(park) {
      if (typeof(park) !== 'object' || Object.keys(park).length === 0){
        console.error('required fields not filled out');
        return Promise.reject('You need to fill out all fields');
      }
      return $http({
        url: '/dog-parks',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        data: {
          name: park.name,
          street: park.street,
          city: park.city,
          state: park.state,
          zipcode: park.zipcode,
          latitude: park.latitude,
          longitude: park.longitude,
          description: park.description,
          openHour: park.openHour,
          closeHour: park.closeHour,
          likes: 0,
          dislikes: 0
        }
      })
      .then(function handleResponse(response){
        return response.data;
      });
    }

    function deleteAPark(id) {
      if(typeof(id) !== 'string' || !id.length) {
        return Promise.reject('ERROR!! problem with park id: ', id);
      }
      if(!localStorage.getItem('token')){
        return Promise.reject('You must be logged in to delete a park.');
      }
      return $http({
        url: '/dog-parks/' + id,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      })
      .then(function handleResponse(response) {
        return response.data;
      });
    }

    return {
      getAllParks: getAllParks,
      createPark: createPark,
      deleteAPark: deleteAPark,
      updateLikes: updateLikes,
      updateDislikes: updateDislikes
    };
  }
}());
