(function() {
  'use strict';
  let expect = chai.expect;

  describe('Parks Controller', function(){
    let ParksController;
    let mockParksService = {};

    beforeEach(module('parks'));
    beforeEach(module(function($provide){
      $provide.value('ParksService', mockParksService);
    }));
    beforeEach(inject(function($controller){
      mockParksService.getAllParks = function getAllParks(){
        return Promise.resolve([{
          name: 'South Run Dog Park',
          street: '7550 Reservation Dr',
          city: 'Springfield',
          state: 'Va',
          zipcode: '22153',
          likes: 5,
          dislikes: 0
        }]);
      };
      mockParksService.createPark = function createPark(park){
        mockParksService.createPark.numTimesCalled++;
        return Promise.resolve();
      };
      mockParksService.createPark.numTimesCalled = 0;
      ParksController = $controller('ParksController');
    }));
    it('should confirm data types', function(){
      expect(ParksController.park).to.be.an('object');
      expect(ParksController.parks).to.be.an('array');
      expect(ParksController.createPark).to.be.a('function');
      expect(ParksController.deleteAPark).to.be.a('function');
      expect(ParksController.getAllParks).to.be.a('function');
    });
    it('should call the createPark function when adding a new park', function(){
      ParksController.createPark({});
      expect(mockParksService.createPark.numTimesCalled).to.equal(1);
    });
  });

}());
