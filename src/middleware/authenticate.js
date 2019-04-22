//Required imports.
const express = require('express');
const auth = require('basic-auth');
const User = require('../models/user');

function authenticateUser(req, res, next) {
    //Parse the authentication header
    const credentials =  auth(req);
    
    //if there are login credentials given
    if (credentials) {
        //Use the User model's authentication static method to check if the credientals mathch any documents
        User.authenticate(credentials.name, credentials.pass, function(error, user){
            if (error || !user) {
                var err = new Error("Wrong email or password provided");
                err.status = 401;
                return next(err);
            //If so
            } else {
                //Return the user to the response
                res.locals.user = user;
                return next()
            };
        });
    //If there are no credentials provided, return an Error.
    } else {
        res.status(401).json({message: "Access Denied: No credentials provided"});
    }
};

//Export the middleware
module.exports = authenticateUser;