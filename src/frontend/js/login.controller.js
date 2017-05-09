(function() {
  'use strict';

  angular.module('parks')
  .controller('LoginController', LoginController);

  LoginController.$inject = ['$scope'];

  function LoginController($scope){
    let vm = this;
    /**
     * Sign in function that pulls token from google and stashes it in local storage
     * @param  {Object} googleUser data available once signed in
     * @return {Void}            [description]
     */
    window.onSignIn = function onSignIn(googleUser){
      localStorage.setItem('token', googleUser.Zi.access_token);
      $scope.$apply();
    };
    /**
     * removes token from local storage on sign out
     */
    vm.signOut = function signOut(){
      let auth2 = gapi.auth2.getAuthInstance();
      console.log(gapi);
      auth2.signOut().then(function (){
        localStorage.removeItem('token');
        console.log('user signed out.');
        $scope.$apply();
      });
    };
    /**
     * checks to see if user is logged in
     * @return {Boolean} checks to see if token availbility is true
     */
    vm.isLoggedIn = function isLoggedIn(){
      return !!localStorage.getItem('token');
    };
  }
}());
