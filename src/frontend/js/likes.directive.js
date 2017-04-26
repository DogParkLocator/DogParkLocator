(function() {
  'use strict';

  angular.module('parks')
  .directive('likes', likes);

  function likes(){
    let $ = angular.element;
    return{
      templateUrl: 'views/parks-like.template.html',
      restrict: 'E',
      link: addLikes, subtractLikes,
      scope: {
        park: '='
      }
    };


    function addLikes(scope, element){
      $(element)
      .find('.glyphicon-thumbs-up')
      .on('click', function incrementText(){
        park.likes++;
        $(element).find('.likes');
      });
    }

    function subtractLikes(scope, element){
      $(element)
      .find('.glyphicon-thumbs-down')
      .on('click', function incrementText(){
        park.dislikes++;
        $(element).find('.dislikes');
      });
    }
  }
}());
