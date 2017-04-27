const parksRouter = require('express').Router();
const Park = require('../models/Park.model.js');
const NodeGeocoder = require('node-geocoder');
let geocoder = NodeGeocoder();

/**
* Provides an address string from a dogParkObject
* @param  {Object} barkObject an object conforming to specs in Park.model.js
* @return {String}            the address as a single string
*/
function addressString(barkObject) {
  return barkObject.street + ', ' + barkObject.city + ', ' + barkObject.state + ' ' + barkObject.zipcode;
}

/**
* finds the park with the matching id
* @param  {Object}   req  the request object received from the frontend
* @param  {Object}   res  the response object to return to the frontend
* @param  {Function} next the middleware to proceed to next, if called
* @return {Void}
*/
parksRouter.get('/:id', function getAPark(req, res, next) {
  Park.findById(req.params.id)
  .then(function returnThePark(park) {
    if (!park) {
      let err = new Error('park not found');
      err.status = 404;
      return next(err);
    }
    res.json({id: park._id, name: park.name, street: park.street, city: park.city, state: park.state, zipcode: park.zipcode, description: park.description, hours: park.hours, popularity: park.popularity});
  })
  .catch(function handleIssues(err) {
    console.error(err);
    let ourError = new Error('There was an error finding the park matching id: ', req.params.id);
    ourError.status = err.status;
    return next(ourError);
  });
});

/**
* returns a JSON array of park objects and their respective property values.
* @param  {Object}   req  the request object received from the frontend
* @param  {Object}   res  the response object to return to the frontend
* @param  {Function} next the middleware to proceed to next, if called
* @return {Void}
*/
parksRouter.get('/', function getAllParks(req, res, next) {
  // need to expand to enable find by id
  if (Object.keys(req.query).length) {
    Park.find({
      zipcode: {$regex: req.query.query}
    })
    .then(function returnMatchingParks(data) {
      res.json(data);
    })
    .catch(function handleIssues(err) {
      console.error(err);
      let ourError = new Error('Error finding parks with matching zipcode: ', req.query.query);
      ourError.status = 422;
      return next(ourError);
    });
  }
  else {
    Park.find()
    .then(function returnAllParks(allParks) {
      if (!Array.isArray(allParks)) {
        let err = new Error('Parks is not an array');
        err.status = 500;
        return next(err);
      }
      res.json(allParks.map(function returnDetails(park) {
        return {id: park._id, name: park.name, street: park.street, city: park.city, state: park.state, zipcode: park.zipcode, latitude: park.latitude, longitude: park.longitude, description: park.description, openHour: park.openHour, closeHour: park.closeHour, likes: park.likes, dislikes: park.dislikes};
      }));
    })
    .catch(function handleIssues(err) {
      console.error(err);
      let ourError = new Error('Unable to retieve parks');
      ourError.status = 500;
      return next(ourError);
    });
  }
});

/** Adds a park to the database
* @param {Object}     req  the request object received from the frontend
* @param {Object}     res  the response object to return to the frontend
* @param {Function}   next the middleware to proceed to next, if called
* @return {void}
*/
parksRouter.post('/', function addAPark(req, res, next) {
  if(!req.body.name || !req.body.street || !req.body.city || !req.body.state || !req.body.zipcode) {
    // we need to provide this response to the user through html
    console.log("not all required fields have been provided", req);
    let err = new Error('You must provide a name and complete address');
    err.status = 400;
    return next(err);
  }

  let theParkCreated = new Park({name: req.body.name, street: req.body.street, city: req.body.city, state: req.body.state, zipcode: req.body.zipcode, latitude: req.body.latitude, longitude: req.body.longitude, description: req.body.description, openHour: req.body.openHour, closeHour: req.body.closeHour, popularity: req.body.popularity});

  if (!theParkCreated.latitude || !theParkCreated.longitude) {
    console.log('about to geocode: ', theParkCreated);
    geocoder.geocode(addressString(theParkCreated))
    .then(function setParkLatLng(res) {
      console.log('successfully geocoding: ', theParkCreated.name);
      console.log('geocoding response: ', res);
      theParkCreated.latitude = res[0].latitude;
      theParkCreated.longitude = res[0].longitude;
    })
    .catch(function handleIssues(err) {
      console.error(err);
      let ourError = new Error('unable to geocode park', theParkCreated.name);
      ourError.status = 422;
      next(ourError);
    });
  }
  else {
    console.log('not geocoding: the park already has a lat and long: ', theParkCreated);
  }

  theParkCreated.save()
  .then(function sendBackTheResponse(park) {
    console.log('park successfully saved: ', park);
    res.json(park);
  })
  .catch(function handleIssues(err) {
    console.error(err);
    let ourError = new Error('unable to save park', theParkCreated.name);
    ourError.status = 422;
    next(ourError);
  });
});

/**
* finds the park with the id matching the argument passed in req
* @param  {Object}   req  the request object received from the frontend
* @param  {Object}   res  the response object to return to the frontend
* @param  {Function} next the middleware to proceed to next, if called
* @return {Void}
*/
parksRouter.delete('/:id', function deleteAPark(req, res, next) {
  Park.findById({_id: req.params.id})
  .then(function removeThePark(park) {
    if (!park) {
      let ourError = new Error('park to delete not found');
      ourError.status = 404;
      return next(ourError);
    }
    park.remove()
    .then(function deletionSuccess() {
      res.json(park);
    })
    .catch(function handleError(err) {
      console.error(err);
      let ourError = new Error('problem deleting park: ', park);
      ourError.status = err.status;
      return next(ourError);
    });
  })
  .catch(function handleIssues(err) {
    console.error(err);
    let ourError = new Error('There was an error finding the park');
    ourError.status = err.status;
    return next(ourError);
  });
});

module.exports = parksRouter;
