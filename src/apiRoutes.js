const express = require('express');
const User = require('./models/user');
const Course = require('./models/course');
const Review = require('./models/review');
const authenticateUser = require('./middleware/authenticate');

const router = express.Router();


//Route to get current user
router.get('/users', authenticateUser, (req, res, next) => {
   User.findById(res.locals.user._id, (err, user) => {
       if(err) return next(err);
       res.json(user);
   });
});


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

//Route to create a new course
router.post('/courses', authenticateUser, (req, res, next) => {
    if (req.body.title &&
        req.body.description && 
        req.body.steps) {
            courseData = {
                user: res.locals.user._id,
                title: req.body.title,
                description: req.body.description,
                steps: req.body.steps.map(step => {
                    return (!step.stepNumber) ?
                    {
                        title: step.title,
                        description: step.description
                    }
                    :
                    {
                        stepNumber: step.stepNumber,
                        title: step.title,
                        description: step.description
                    } 
                }),
            };

            if (req.body.estimatedTime) {
                courseData.estimatedTime = req.body.estimatedTime;
            } else if (req.body.materialsNeeded) {
                courseData.materialsNeeded = req.body.materialsNeeded;
            }

            Course.create(courseData, function(error, course) {
                if (error) {
                    return next(error);
                } else {
                    res.location('/');
                    res.status(201);
                    return res.end();
                }
            })
        } else {
            const err = new Error("Course title, description, and steps required");
            err.status = 400;
            return next(err);
        }
});

//Route to get a specific course
router.get('/courses/:courseID', (req, res, next) => {
    return Course.findById(req.params.courseID)
                .populate({path: 'user', select: "fullName"})
                .populate({path: 'reviews', populate: [{path: "user", select: "fullName"}]})
                .exec( (err, course, user, reviews) => {
                        if(err) return next(err);
                        res.json(course);
                    })
});

module.exports = router;