(function() {
  'use strict';

  angular.module('parks')
  .directive('likes', Likes);

  Likes.$inject = ['ParksService'];
  let $ = angular.element;
  let vm = this;

  function Likes() {
    return{
      templateUrl: 'views/park-likes.template.html',
      restrict: 'E',
      link: updateLikes,
      scope: {
        park: '='
      }
    };

    function updateLikes(scope, element) {
      $(element.querySelector('.glyphicon-thumbs-up'))
      .on('click', function incrementLikes() {
        console.log('thumbs-up clicked');
        scope.park.likes++;
        ParksService.updateLikes(scope.park)
        .then(function showLikedSuccess(parkResponse){
          console.log('liked park: ', parkResponse);
        })
        .catch(function showLikedError(err){
          console.error(err);
        });
      });

      $(element.querySelector('.glyphicon-thumbs-down'))
      .on('click', function incrementDislikes() {
        console.log('thumbs-down clicked');
        scope.park.dislikes++;
        ParksService.updateDislikes(scope.park)
        .then(function showDislikedSuccess(parkResponse){
          console.log('disliked park: ', parkResponse);
        })
        .catch(function showDislikedError(err){
          console.error(err);
        });
      });
    }
  }
}());
