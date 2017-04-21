(function() {
  'use strict';

  angular.module('parks', ['ui-router'])
  .config(routerConfig)
  /* .run(setupAuthCheck)*/;


  routerConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routerConfig($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.when('', '/');

      // $urlRouterProvider.otherwise('/not-found'); // for the 404 page

      $stateProvider
      .state({
          name: 'home',
          url: '/',
          templateUrl: 'views/home.template.html',
          controller: 'ParksController',
          controllerAs: 'parksCtrl'
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
          name: '404-not-found',
          url: '/not-found',
          templateUrl: 'views/not-found.template.html'
      });

      // setupAuthCheck.$inject = ['$rootScope', '$state', 'UserService'];

      // function setupAuthCheck($rootScope, $state, UserService) {
      //     // event handler here
      //     //   $on()  ==> addEventListener()
      //     $rootScope.$on('$stateChangeStart', function checkLoginStatus(eventObj, toState) {
      //         if (toState.restricted && !UserService.isLoggedIn()) {
      //             eventObj.preventDefault();
      //             $state.go('login');
      //         }
      //         else {
      //             $state.go(toState);
      //         }
      //     });
      // }
    }
}());
