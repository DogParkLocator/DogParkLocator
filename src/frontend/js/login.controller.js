(function() {
  'use strict';

  angular.module('parks')
  .controller('LoginController', LoginController);

  function LoginController(){
    let vm = this;

    window.onSignIn = function onSignIn(googleUser){
      localStorage.setItem('token', googleUser.Zi.access_token);
    };

    vm.signOut = function signOut(){
      let auth2 = gapi.auth2.getAuthInstance();
      console.log(gapi);
      auth2.signOut().then(function (){
        localStorage.removeItem('token');
        console.log('user signed out.');
      });
    };
    vm.isLoggedIn = function isLoggedIn(){
      return !!localStorage.getItem('token');
    };
  }
}());
