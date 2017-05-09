(function() {
  'use strict';

  angular.module('parks')
  .factory('ParksService', ParksService);

  ParksService.$inject = ['$http'];

  /**
   * Creates a new park service singleton
   * @param {function} $http        the service for making ajax calls
   * @param {Object} ParksService   the service's API methods
   */
  function ParksService($http, ParksService) {
    /**
     * makes an http request for parks data from our API
     * @param  {String}  [sortBy='likes']  sorts parks according to likes
     * @param  {Boolean} [ascending=false] makes a decending order
     * @return {Promise}                   all pdark data requested from API
     */
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
        console.log(response);
        return response.data;
      });
    }
    /**
     * Updates likes data for each park in the API
     * @param  {Object} park data for each park
     * @return {Promise}       request to update likes data
     */
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
    /**
     * Updates dislikes data for each park
     * @param  {Object} park data for each park
     * @return {Promise}       request to update dislikes data
     */
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
    /**
     * Creates a new object containing data about new park to be saved to our API
     * @param  {Object} park user supplied data
     * @return {Promise}       request to post new park data to API
     */
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

    /**
     * delete data for park in API
     * @param  {String} id ID number associated with park
     * @return {$http}    request to delete park associated with id
     */
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
