
(function() {
  'use strict';

  angular.module('parks', ['ui.router'])
  .config(routerConfig);

  routerConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routerConfig($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('', '/');

    $urlRouterProvider.otherwise('/not-found');

    $stateProvider
    .state({
      name: 'home',
      url: '/',
      templateUrl: 'views/home.template.html',
      controller: 'ParksController',
      controllerAs: 'parksCtrl'
    })
    .state({
      name: 'about',
      url: '/about',
      templateUrl: 'views/about-us.template.html'
    })
    .state({
      name: 'map',
      url: '/map',
      templateUrl: 'views/map.template.html',
      controller: 'MapController',
      controllerAs: 'mapCtrl'
    })
    .state({
      name: 'parks-list',
      url: '/parks-list',// $stateParams will call function
      templateUrl: 'views/parks-list.template.html',
      controller: 'ParksController',
      controllerAs: 'parksCtrl'
    })
    .state({
      name: 'add-park',
      url: '/add-park',
      templateUrl: 'views/add-park.template.html',
      controller: 'ParksController',
      controllerAs: 'parksCtrl'
    })
    .state({
      name: 'not-found',
      url: '/not-found',
      templateUrl: 'views/not-found.template.html'
    });

  }
}());
