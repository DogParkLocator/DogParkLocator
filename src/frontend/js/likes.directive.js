(function() {
  'use strict';

  angular.module('parks')
  .directive('likes', Likes);

  Likes.$inject = ['ParksService'];
  let $ = angular.element;

  function Likes(){
    return{
      templateUrl: 'views/park-likes.template.html',
      restrict: 'E',
      link: likes,
      scope: {
        park: '='
      }
    };

    function likes(scope, element){
      $(element)
      .find('.glyphicon-thumbs-up')
      .on('click', function incrementLikes(){
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
      });

      $(element)
      .find('.glyphicon-thumbs-down')
      .on('click', function incrementDislikes(){
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
    }
  }
}
());
