'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const jsonParser = require('body-parser').json;
const mongoose = require('mongoose');
const apiRoutes = require('./apiRoutes');

const app = express();

//mongodb connection
mongoose.connect("mongodb://localhost:27017/course-api", {useNewUrlParser: true});
const db = mongoose.connection;

//if database connection is successfull
db.on('connected', console.log.bind(console, `Successfully connected to the ${db.name} database.`));

//in the case of a mongo error
db.on('error', console.error.bind(console, 'connection error:'));


// set our port
app.set('port', process.env.PORT || 5000);

// morgan gives us http request logging
app.use(morgan('dev'));

// parse JSON requests
app.use(jsonParser());

// TODO add additional routes here
app.use('/api', apiRoutes);

// send a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Course Review API'
  });
});

// uncomment this route in order to test the global error handler
// app.get('/error', function (req, res) {
//   throw new Error('Test error');
// });

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found'
  })
})

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
