(function() {
  'use strict';

  angular.module('parks')
  .directive('likes', likes);


  likes.$inject = ['ParksService'];

  function likes(){
    console.log("likes");
    let $ = angular.element;
    return{
      templateUrl: 'views/parks-like.template.html',
      restrict: 'E',
      link: likes,
      scope: {
        park: '='
      }
    };


    function likes(scope, element){
      $(element)
      .find('.glyphicon-thumbs-up')
      .on('click', function incrementText(){
        $(element).find('.likes');
        park.likes++;

        $http({
          url: '/dog-parks',
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          }
          .then(function handleResponse(response){
            return response.data;
          })

          // ???
          // use service

        });

        $(element)
        .find('.glyphicon-thumbs-down')
        .on('click', function incrementText(){
          $(element).find('.dislikes');
          park.dislikes++;

          $http({
            url: '/dog-parks',
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            }
            .then(function handleResponse(response){
              return response.data;
            })
            // ???
            // use service
          });
        });
      });
    }
  }
}());
