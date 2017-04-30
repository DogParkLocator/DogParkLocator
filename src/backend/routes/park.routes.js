const parksRouter = require('express').Router();
const Park = require('../models/Park.model.js');
const NodeGeocoder = require('node-geocoder');
let geocoder = NodeGeocoder();

/**
* Provides an address string from a dogParkObject
* @param  {Object} parkObject an object conforming to specs in Park.model.js
* @return {String}            the address as a single string
*/
function addressString(parkObject) {
  return parkObject.street + ', ' + parkObject.city + ', ' + parkObject.state + ' ' + parkObject.zipcode;
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
    res.json(park);
  })
  .catch(function handleIssues(err) {
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
      zipcode: req.query.query
    })
    .then(function returnMatchingParks(parks) {
      if (!Array.isArray(allParks)) {
        let ourError = new Error('Parks is not an array');
        ourError.status = 500;
        return next(ourError);
      }
      console.log('parks successfully retrieved: ', parks);
      res.json(parks);
    })
    .catch(function handleIssues(err) {
      let ourError = new Error('Error finding parks with matching zipcode: ', req.query.query);
      ourError.status = err.status;
      return next(ourError);
    });
  }
  else {
    Park.find()
    .then(function returnAllParks(allParks) {
      if (!Array.isArray(allParks)) {
        let ourError = new Error('Parks is not an array');
        ourError.status = 500;
        return next(ourError);
      }
      res.json(allParks);
    })
    .catch(function handleIssues(err) {
      let ourError = new Error('Unable to retieve parks');
      ourError.status = err.status;
      return next(ourError);
    });
  }
});

/**
* finds the park with the id matching the argument passed in req
* @param  {Object}   req  the request object received from the frontend
* @param  {Object}   res  the response object to return to the frontend
* @param  {Function} next the middleware to proceed to next, if called
* @return {Void}
*/
parksRouter.patch('/:id', function updateAPark(req, res, next) {
  Park.findById({_id: req.params.id})
  .then(function updateThePark(park) {
    if (!park) {
      let ourError = new Error('park to update not found, id: ', req.params.id);
      ourError.status = 404;
      return next(ourError);
    }
    let updateInfo = req.body;
    park.update({$set: updateInfo})
    .then(function updateSuccess(parkResponse) {
      console.log('successfully updated park: ', park.name, req.body, parkResponse);
      res.json(parkResponse);
    })
    .catch(function handleError(err) {
      let ourError = new Error('problem updating park with the id: ', req.params.id);
      ourError.status = err.status;
      return next(ourError);
    });
  })
  .catch(function handleIssues(err) {
    let ourError = new Error('There was an error finding the park to update with id:', req.params.id);
    ourError.status = err.status;
    return next(ourError);
  });
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
    err.status = 422;
    return next(err);
  }
  let theParkCreated = new Park({
    name: req.body.name || 'Dog Park',
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
    zipcode: req.body.zipcode,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    description: req.body.description || '',
    openHour: req.body.openHour || 'sunrise',
    closeHour: req.body.closeHour || 'sunset',
    likes: req.body.likes || 0,
    dislikes: req.body.dislikes || 0
  });
  if (!theParkCreated.latitude || !theParkCreated.longitude) {
    geocoder.geocode(addressString(theParkCreated))
    .then(function setParkLatLng(geocodeRes) {
      if (geocodeRes) {
        theParkCreated.latitude = geocodeRes[0].latitude;
        theParkCreated.longitude = geocodeRes[0].longitude;
        theParkCreated.save()
        .then(function sendBackTheResponse(park) {
          console.log('park successfully saved: ', park);
          res.json(park);
        })
        .catch(function handleIssues(err) {
          let ourError = new Error('unable to save park', theParkCreated);
          ourError.status = err.status;
          next(ourError);
        });
      }
      else {
        let ourError = new Error('geocoding response is empty! ', geocodeRes);
        ourError.status = 500;
        next(ourError);
      }
    })
    .catch(function handleIssues(err) {
      let ourError = new Error('unable to geocode park', theParkCreated);
      ourError.status = err.status;
      next(ourError);
    });
  }
  else {
    console.log('not geocoding: the park already has a lat and long: ', theParkCreated);
    theParkCreated.save()
    .then(function sendBackTheResponse(park) {
      console.log('park successfully saved: ', park);
      res.json(park);
    })
    .catch(function handleIssues(err) {
      let ourError = new Error('unable to save park', theParkCreated);
      ourError.status = err.status;
      next(ourError);
    });
  }
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
    .then(function deletionSuccess(parkDeleted) {
      console.log('park successfully deleted: ', parkDeleted);
      res.json(park);
    })
    .catch(function handleError(err) {
      let ourError = new Error('problem deleting park: ', park);
      ourError.status = err.status;
      return next(ourError);
    });
  })
  .catch(function handleIssues(err) {
    let ourError = new Error('There was an error finding the park with id: ', req.params.id);
    ourError.status = err.status;
    return next(ourError);
  });
});

module.exports = parksRouter;
