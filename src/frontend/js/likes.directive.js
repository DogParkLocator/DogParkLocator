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
        console.log('thumbs-up clicked for: ', scope.park);
        ParksService.updateLikes(scope.park)
        .then(function showLikedSuccess(parkResponse){
          console.log('successfully liked park: ', parkResponse);
        })
        .catch(function showLikedError(err){
          console.error(err);
        });
      });

      $(element[0].querySelector('.glyphicon-thumbs-down'))
      .on('click', function incrementLikes() {
        console.log('thumbs-down clicked for: ', scope.park);
        ParksService.updateDislikes(scope.park)
        .then(function showDislikedSuccess(parkResponse){
          console.log('successfully disliked park: ', parkResponse);
        })
        .catch(function showDislikedError(err){
          console.error(err);
        });
      });
    }
  }
}());
