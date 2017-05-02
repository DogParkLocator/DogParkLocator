(function() {
  'use strict';

  angular.module('parks')
  .directive('likes', Likes);

  Likes.$inject = ['ParksService'];
  let $ = angular.element;

  function Likes(ParksService) {
    return{
      templateUrl: 'views/park-likes.template.html',
      restrict: 'E',
      link: updateLikeDislike,
      scope: {
        park: '='
      }
    };

    function updateLikeDislike(scope, element) {
      $(element[0].querySelector('.glyphicon-thumbs-up'))
      .on('click', function incrementLikes() {
        ParksService.updateLikes(scope.park)
        .then(function showLikedSuccess(){
          console.log('successfully liked park: ', scope.park.name);
        })
        .catch(function showLikedError(err){
          console.error(err);
        });
      });

      $(element[0].querySelector('.glyphicon-thumbs-down'))
      .on('click', function incrementLikes() {
        ParksService.updateDislikes(scope.park)
        .then(function showDislikedSuccess(){
          console.log('successfully disliked park: ', scope.park.name);
        })
        .catch(function showDislikedError(err){
          console.error(err);
        });
      });
    }
  }
}());
