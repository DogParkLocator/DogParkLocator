(function() {
  'use strict';

  angular.module('parks')
  .directive('add-park', add-park);

  function addPark(){
    let $ = angular.element;

    return{
      templateUrl: 'views/add-park.template.html',
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
