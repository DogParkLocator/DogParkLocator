(function() {
  'use strict';

  describe('parks', function() {
    beforeEach(module('parks'));

    describe('parks controller', function(){
      var parksCtrl;
      mockParksService = {};

      beforeEach(module(function($provide) {
      $provide.value( 'parks', mockParksService );
    }));

     beforeEach(inject(function($controller, $q) {
       mockParksService.parks = function() {
         return $q.resolve({  name: 'Alex Britcliffe',
           street: '1234 Maple Street',
           city: 'Alexandria',
           state: 'VA',
           zipcode: 22314 });
       };

        parksCtrl = $controller('ParksController');
      }));
    });
  });
}());
