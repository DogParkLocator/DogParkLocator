(function() {
  'use strict';

  angular.module('parks')
  .directive('park', park);

  function park(){
    let $ = angular.element;
    return{
      templateUrl: 'views/park.template.html',
      restrict: 'E',
      link: setUpCollapse,
      scope: {
        park: '='
      }
    };

    function setUpCollapse(scope, element){
      $(element)
      .find('header')
      .on('click', function hidePanelBody() {
        $(element).find('article').toggleClass('hidden');
      });
    }

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
