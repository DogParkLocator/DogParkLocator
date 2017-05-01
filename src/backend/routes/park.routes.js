const parksRouter = require('express').Router();
const Park = require('../models/Park.model.js');
const NodeGeocoder = require('node-geocoder');
let geocoder = NodeGeocoder();

/**
* Provides an address string from a dogParkObject. Name ommitted because geocoding fails if the park is not a 'Place' in google's databse.
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
  Park.findById({_id: req.params.id})
  .then(function returnThePark(park) {
    if (!park) {
      let err = new Error('park not found');
      err.status = 404;
      return next(err);
    }
    res.json(park);
  })
  .catch(function handleIssues(err) {
    let ourError = new Error('There was an error finding the park with matching id');
    ourError.status = err.status;
    return next(ourError);
  });
});

/**
* returns a JSON array of park objects and their respective property values. If given parameters through req.query, then only parks matching those parameters are returned.
* @param  {Object}   req  the request object received from the frontend
* @param  {Object}   res  the response object to return to the frontend
* @param  {Function} next the middleware to proceed to next, if called
* @return {Void}
*/
parksRouter.get('/', function getAllParks(req, res, next) {
  console.log('req.query: ', req.query);
  let queryParams = {};
  let sortParams = {};
  let keys = Object.keys(req.query);
  if (keys.length) {
    keys.forEach(function buildQueryObject(key) {
      if (['name', 'street', 'city', 'state', 'zipcode'].includes(key)) {
        queryParams[key] = {
          "$regex": req.query[key],
          "$options": "i"
        };
      }
      if (key === 'sortBy') {
        if (req.query.ascending) {
          sortParams[req.query[key]] = -1;
        }
        else {
          sortParams[req.query[key]] = 1;
        }
      }
    });
  }
  console.log('queryParams', queryParams);
  Park.find(queryParams).sort(sortParams)
  .then(function returnMatchingParks(parks) {
    if (!Array.isArray(parks)) {
      let ourError = new Error('Parks is not an array');
      ourError.status = 500;
      return next(ourError);
    }
    console.log('parks successfully retrieved: ', parks);
    res.json(parks);
  })
  .catch(function handleIssues(err) {
    console.error(err);
    let ourError = new Error('Error finding the matching parks');
    ourError.status = err.status;
    return next(ourError);
  });
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
      let ourError = new Error('park to update not found');
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
      console.error(err);
      let ourError = new Error('problem updating the park');
      ourError.status = err.status;
      return next(ourError);
    });
  })
  .catch(function handleIssues(err) {
    console.error(err);
    let ourError = new Error('There was an error finding the park to update');
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
          let ourError = new Error('unable to save the park');
          ourError.status = err.status;
          next(ourError);
        });
      }
      else {
        let ourError = new Error('geocoding response is empty!');
        ourError.status = 500;
        next(ourError);
      }
    })
    .catch(function handleIssues(err) {
      console.error(err);
      let ourError = new Error('unable to geocode the park');
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
      console.error(err);
      let ourError = new Error('unable to save the park', theParkCreated);
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
      let ourError = new Error('park to delete not found id');
      ourError.status = 404;
      return next(ourError);
    }
    park.remove()
    .then(function deletionSuccess(parkDeleted) {
      console.log('park successfully deleted: ', parkDeleted);
      res.json(park);
    })
    .catch(function handleError(err) {
      console.error(err);
      let ourError = new Error('problem deleting the park');
      ourError.status = err.status;
      return next(ourError);
    });
  })
  .catch(function handleIssues(err) {
    console.error(err);
    let ourError = new Error('problem finding the park');
    ourError.status = err.status;
    return next(ourError);
  });
});

module.exports = parksRouter;
