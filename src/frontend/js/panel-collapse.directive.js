(function() {
  'use strict';

  angular.module('parks')
  .directive('panel', panel);

  function panel(){
    let $ = angular.element;
    return{
      templateUrl: 'views/park.template.html',
      restrict: 'E',
      link: setUpCollapse,
      scope:{
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
  }
}());
