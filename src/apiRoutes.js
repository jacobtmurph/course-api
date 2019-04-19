const express = require('express');
const User = require('./models/user');

const router = express.Router();


//
router.post('/users', (req, res, next) => {
    if (req.body.fullName &&
        req.body.email &&
        req.body.password) {
           
            userData = {
                fullName: req.body.fullName,
                emailAddress: req.body.email,
                password: req.body.password
            };

            User.create(userData, function(error, user) {
                if (error) {
                    return next(error);
                } else {
                    res.location('/');
                    res.status(201);
                    return res.end();
                }
            });
    } else {
        const err = new Error('Full Name, Email, and Password are required');
        err.status = 400;
        return next(err);
    }
})

module.exports = router;