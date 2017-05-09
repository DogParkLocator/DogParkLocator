(function() {
  'use strict';

  angular.module('parks')
  .directive('markerContent', MarkerContent);

  let $ = angular.element;

  /**
   * the constructor for the directive that controls marker content
   * @return {Object} describes the behavior of the marker-content directive that controls the html within the marker-content.template.html. The park object on scope is the object for which the parkMarker content is being controlled
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
