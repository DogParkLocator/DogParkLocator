const parksRouter = require('express').Router();
const Park = require('../models/Park.model.js');

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
      let err = new Error('job not found');
      err.status = 404;
      return next(err);
    }
    res.json({id: park._id, name: park.name, street: park.street, city: park.city, state: park.state, zipcode: park.zipcode, description: park.description, openHour: park.openHour, closeHour: park.closeHour, popularity: park.popularity});
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
      res.json(allParks.map(function(park) {
        return {id: park._id, name: park.name, street: park.street, city: park.city, state: park.state, zipcode: park.zipcode,
};
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
    let err = new Error('You must provide a name and complete address');
    err.status = 400;
    return next(err);
  }
  let theJobCreated = new Job({company: req.body.company, link: req.body.link, notes: req.body.notes, createTime: new Date()});
  theJobCreated.save()
  .then(function sendBackTheResponse(data) {
    res.json(data);
  })
  .catch(function handleIssues(err) {
    console.error(err);
    let ourError = new Error('unable to save job');
    ourError.status = 422;
    next(ourError);
  });
});

/**
* finds the job with the id matching the argument passed in req
* @param  {Object}   req  the request object received from the frontend
* @param  {Object}   res  the response object to return to the frontend
* @param  {Function} next the middleware to proceed to next, if called
* @return {Void}
*/
jobsRouter.delete('/:id', function deleteAJob(req, res, next) {
  Job.findById({_id: req.params.id})
  .then(function removeTheJob(job) {
    if (!job) {
      let err = new Error('job to delete not found');
      err.status = 404;
      return next(err);
    }
    job.remove();
    res.json(job);
  })
  .catch(function handleIssues(err) {
    console.error(err);
    let ourError = new Error('There was an error finding the job');
    ourError.status = err.status;
    return next(ourError);
  });
});

module.exports = jobsRouter;
