(function() {
  'use strict';

  angular.module('parks')
  .controller('LoginController', LoginController);

  LoginController.$inject = ['$scope'];

  function LoginController($scope){
    let vm = this;

    window.onSignIn = function onSignIn(googleUser){
      localStorage.setItem('token', googleUser.Zi.access_token);
      $scope.$apply();
    };

    vm.signOut = function signOut(){
      let auth2 = gapi.auth2.getAuthInstance();
      console.log(gapi);
      auth2.signOut().then(function (){
        localStorage.removeItem('token');
        console.log('user signed out.');
        $scope.$apply();
      });
    };

    vm.isLoggedIn = function isLoggedIn(){
      return !!localStorage.getItem('token');
    };
  }
}());
