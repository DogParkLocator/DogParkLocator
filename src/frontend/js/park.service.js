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
      return $http({
        url: '/dog-parks',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        params: params
      })
      .then(function handleResponse(response) {
        return response.data;
      });
    }

    function updateLikes(park) {
      if (typeof(park._id) !== 'string' || !park._id.length) {
        return Promise.reject('Problem liking park: no park specified, or invalid id');
      }

      if (typeof(park.likes) !== 'number') {
        return Promise.reject('Problem liking park: park.likes is NaN');
      }
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
      .then(function handleResponse(response) {
        return response.data;
      });
    }

    function updateDislikes(park) {
      if (typeof(park._id) !== 'string' || !park._id.length) {
        return Promise.reject('Problem disliking park: no park specified, or invalid id');
      }
      if (typeof(park.dislikes) !== 'number') {
        return Promise.reject('Problem disliking park: park.likes is NaN');
      }
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
      .then(function handleResponse(response) {
        return response.data;
      });
    }

    function createPark(park) {
      if (!park.name || !park.street || !park.city || !park.state || !park.zipcode) {
        return Promise.reject('required fields not filled out');
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
      .then(function handleResponse(response) {
        return response.data;
      });
    }

    function deleteAPark(id) {
      if (typeof(id) !== 'string' || !id.length) {
        return Promise.reject('invalid id for park to delete');
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
