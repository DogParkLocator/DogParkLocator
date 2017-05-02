
(function() {
  'use strict';

  let expect = chai.expect;

  describe('ParksService', function() {

    let ParksService;
    let $httpBackend;

    beforeEach(module('parks'));

    beforeEach(inject(function(_$httpBackend_, _ParksService_) {
      $httpBackend = _$httpBackend_;
      ParksService = _ParksService_;

      $httpBackend
      .whenPOST('/dog-parks')
      .respond({
        name: 'Alex',
        street: '923 Neal Drive',
        city: 'Alexandria',
        state: 'Virginia',
        zipcode: '22308',
        description: 'Lovely',
        likes: 0,
        dislikes: 0
      });
    }));

    describe('addPark', function() {

      it('should fail if park object is not provided', function (done){
        let result = ParksService.createPark([]);
        expect(result.then).to.be.a('function');
        expect(result.catch).to.be.a('function');
        result
        .then(function(){
          done('We should not resolve with a bad argument');
        })
        .catch(function(err){

          done();
        });
      });

      it('should add a park with correct information', function(done) {
          let result = ParksService.createPark({
            name: 'Alex',
            street: '923 Neal Drive',
            city: 'Alexandria',
            state: 'VA',
            zipcode: '22308',
            description: 'Lovely park.',
            likes: 0,
            dislikes: 0
          });
          expect(result.then).to.be.a('function');
          expect(result.catch).to.be.a('function');

          result
          .then(function(data) {
            expect(data).to.be.an('object');
            expect(data.name).to.be.a('string');
            expect(data.description).to.be.a('string');
            expect(data.street).to.be.a('string');
            expect(data.city).to.be.a('string');
            expect(data.state).to.be.a('string');
            expect(data.zipcode).to.be.a('string');
            expect(data.likes).to.be.a('number');
            expect(data.dislikes).to.be.a('number');
            done();
          })
          .catch(function(err){
            done(err);
          });

          $httpBackend.flush();
        });



    });
  });
}());
