(function() {
  'use strict';

  angular.module('parks')
  .directive('addPark', addPark);

  function addPark(){
    let $ = angular.element;
    console.log("Hello");
    return{
      templateUrl: 'views/add-park.template.html',
      restrict: 'E',
      link: setUpCollapse,
      scope:{
        panel: '='
      }
    };


    function setUpCollapse(scope, element){
      console.log('sfgsdgs');
      $(element)
      .find('header')
      .on('click', function hidePanelBody() {
        console.log($(element));
        $element.find('main').toggleClass('hidden');
      });
    }
  }
}());
