(function() {
  'use strict';

  angular.module('parks')
  .directive('panel', panel);

  function panel(){
    let $ = angular.element;
    return{
      templateUrl: 'views/parks-list.template.html',
      restrict: 'E',
      link: setUpCollapse,
      
      scope:{
        panel: '='
      }
    };


    function setUpCollapse(scope, element){
      $(element)
      .find('header')
      .on('click', function hidePanelBody() {
        $element.find('main').toggleClass('hidden');
      });
    }
  }
}());
