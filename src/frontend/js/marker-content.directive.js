(function() {
  'use strict';

  angular.module('parks')
  .directive('markerContent', MarkerContent);

  let $ = angular.element;

  /**
  * MarkerContent constructor
  */
  function MarkerContent() {
    return {
      restrict: 'E',
      templateUrl: 'views/marker-content.template.html',
      scope: {
        park: '='
      }
    };

  }
})();
