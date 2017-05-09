(function() {
  'use strict';

  angular.module('parks')
  .directive('likes', Likes);

  Likes.$inject = ['ParksService'];
  let $ = angular.element;

  /**
   * Likes directive constructor. Controls html pertaining to display of number of likes for each park
   * @param  {Object} ParksService handles communication with the parks API
   * @return {Object} Object whose properties and values describe the behavior of the directive. On scope is the park whose display of likes is controlled by this directive. The park-likes.template.html is the the html controlled by this directive. The updateLikeDislikes link is the function that interacts with the service to persist storage of the incremented likes and dislikes.
   */
  function Likes(ParksService) {
    return {
      templateUrl: 'views/park-likes.template.html',
      restrict: 'E',
      link: updateLikeDislike,
      scope: {
        park: '='
      }
    };
    /**
     * This function interacts with the ParksService to persist storage of the incremented likes and dislikes of the parkObject attached to the scope.
     * @param  {Object}  scope   contains the parkObject to which the directive applies
     * @param  {Object}  element the html element effected by the incremented value
     * @return {Void} 
     */
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
