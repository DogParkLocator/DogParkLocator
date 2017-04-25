(function() {
  'use strict';

  describe('parks', function() {
    beforeEach(module('parks'));

    describe('ParksService', function() {
      var $httpBackend, ParksService;

      beforeEach(inject(function(_$httpBackend_) {
        $http = _$http_;

        $http
        .whenPost('/parks-list')
        .respond({
          name: 'Alex Britcliffe',
          street: '1234 Maple Street',
          city: 'Alexandria',
          state: 'VA',
          zipcode: 22314

        });
      }));

      it('should ...', function() {

      });

    }());
