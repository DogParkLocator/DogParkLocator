(function() {
  'use strict';

  let expect = chai.expect;

  describe('Login Controller', function() {
    let LoginController;
    let window = {};

    beforeEach(module('parks'));

    beforeEach(inject(function($controller, $rootScope) {
      window.onSignIn = function onSignIn(googleUser){
        window.onSignIn.numTimesCalled++;
        localStorage.setItem('token', '12345');
        return;
      };

      window.onSignIn.numTimesCalled = 0;
      
      LoginController = $controller('LoginController', {$scope: $rootScope.$new()});
    }));

    afterEach(function(){
      localStorage.removeItem('token');
    });

    describe('onSignIn', function(){
      it('should be a function', function(){
        expect(window.onSignIn).to.be.a('function');
      });

      it('should log us is', function(){
        window.onSignIn();
        expect(window.onSignIn.numTimesCalled).to.equal(1);
        expect(localStorage.getItem('token')).to.equal('12345');
      });
    });
  });
}());
