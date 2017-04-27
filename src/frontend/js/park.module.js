
(function() {
  'use strict';

  angular.module('parks', ['ui.router'])
  .config(routerConfig)
  .run(setupAuthCheck);

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
      name: 'parks-list',
      url: '/parks-list',
      templateUrl: 'views/parks-list.template.html',
      controller: 'ParksController',
      controllerAs: 'parksCtrl'
    })
    .state({
      name: 'add-park',
      url: '/add-park',
      templateUrl: 'views/add-park.template.html',
      controller: 'ParksController',
      controllerAs: 'parksCtrl',
      requiresLogin: true
    })
    .state({
      name: 'not-found',
      url: '/not-found',
      templateUrl: 'views/not-found.template.html'
    });
  }
  setupAuthCheck.$inject = ['$rootScope', '$state'];
  function setupAuthCheck($rootScope, $state) {


    $rootScope.$on('$stateChangeStart', function checkLoginStatus(eventObj, toState) {
      if ( toState.requiresLogin && !localStorage.getItem('token')) {
        eventObj.preventDefault();
        $state.go('home');
      }
    });

  }
}());
