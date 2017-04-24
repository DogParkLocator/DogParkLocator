(function() {
  'use strict';

  angular.module('parks', ['ui.router'])
  .config(routerConfig);

  routerConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routerConfig($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.when('', '/');

      $urlRouterProvider.otherwise('/not-found'); // for the 404 page

      $stateProvider
      .state({
          name: 'home',
          url: '/',
          templateUrl: 'views/map.template.html',
          controller: 'ParksController',
          controllerAs: 'parksCtrl'
      })
      .state({
          name: 'parks-list',
          url: '/parks-list',// $stateParams will call function
          templateUrl: 'views/parks-list.template.html',
          controller: 'ParksController',
          controllerAs: 'parksCtrl'
      });

    }
}());
//
//
// .state({
//     name: 'map',
//     url: '/map',
//     templateUrl: 'views/map.template.html',
//     controller: 'MapController',
//     controllerAs: 'mapCtrl'
// })
