const express = require('express');
const auth = require('basic-auth');
const User = require('../models/user');

function authenticateUser(req, res, next) {
    const credentials =  auth(req);

    if (credentials) {
        User.authenticate(credentials.name, credentials.pass, function(error, user){
            if (error || !user) {
                var err = new Error("Wrong email or password provided");
                err.status = 401;
                return next(err);
            } else {
                res.locals.user = user;
                return next()
            };
        });
    } else {
        res.status(401).json({message: "Access Denied: No credentials provided"});
    }
};

module.exports = authenticateUser;