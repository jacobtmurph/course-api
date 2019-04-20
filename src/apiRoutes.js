const express = require('express');
const User = require('./models/user');
const Course = require('./models/course');

const router = express.Router();


//Route to create a new user
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
});

//Route to get all courses
router.get('/courses', (req, res, next) => {
    return Course.find({}, {title: true}, (err, results) => {
        if(err) return next(err);
        res.json(results);
    });
});

//Route to get a specific course
router.get('/courses/:courseID', (req, res, next) => {
    return Course.findById(req.params.courseID, (err, course) => {
        if(err) return next(err);
        res.json(course);
    })
});

module.exports = router;