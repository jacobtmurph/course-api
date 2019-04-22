//Required imports
const express = require('express');
const User = require('./models/user');
const Course = require('./models/course');
const Review = require('./models/review');
const authenticateUser = require('./middleware/authenticate');

//Create an express Router
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
    //Check for required fields
    if (req.body.fullName &&
        req.body.email &&
        req.body.password) {
           //Set the data object for the new user
            userData = {
                fullName: req.body.fullName,
                emailAddress: req.body.email,
                password: req.body.password
            };

            //Create the new user Document
            User.create(userData, (error, user) => {
                if (error) {
                    return next(error);
                } else {
                    //Set the response location & status, then end the response
                    res.location('/');
                    res.status(201);
                    return res.end();
                }
            });
        //Return an Error if required data is missing
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
    //Check for required fields
    if (req.body.title &&
        req.body.description && 
        req.body.steps) {

            //Set the data object for the new Course
            courseData = {
                user: res.locals.user._id,
                title: req.body.title,
                description: req.body.description,
                //Map the given steps array to the Course's step array
                steps: req.body.steps.map(step => {
                    //If there's not a step number, return a step object with one omitted
                    return (!step.stepNumber) ?
                    {
                        title: step.title,
                        description: step.description
                    }
                    //If there's a step number, return a step object with it included
                    :
                    {
                        stepNumber: step.stepNumber,
                        title: step.title,
                        description: step.description
                    } 
                }),
            };

            //If an estimatedTime and/or materialsNeeded field is/are given, add them to the CourseData
            if (req.body.estimatedTime) {
                courseData.estimatedTime = req.body.estimatedTime;
            } else if (req.body.materialsNeeded) {
                courseData.materialsNeeded = req.body.materialsNeeded;
            }

            //Create the new course object
            Course.create(courseData, (error, course) => {
                if (error) {
                    error.status = 400;
                    return next(error);
                } else {
                     //Set the response location & status, then end the response 
                    res.location('/');
                    res.status(201);
                    return res.end();
                }
            });
        //Return an error if required fields are missing.
        } else {
            const err = new Error("Course title, description, and steps required");
            err.status = 400;
            return next(err);
        }
});

//Route to get a specific course
router.get('/courses/:courseID', (req, res, next) => {
    return Course.findById(req.params.courseID)
                //Return related user data in the results
                .populate({path: 'user', select: "fullName"})
                //Return related reviews & review data in the results
                .populate({path: 'reviews', populate: [{path: "user", select: "fullName"}]})
                .exec( (err, course, user, reviews) => {
                        if(err) return next(err);
                        res.json(course);
                    })
});

//Route to update a specific course
router.put('/courses/:courseID', authenticateUser, (req, res, next) => {
    //Make sure updated data is given 
     if (req.body.constructor === Object && Object.keys(req.body).length > 0) {
        //Then update the course accordingly
        return Course.findByIdAndUpdate(req.params.courseID, req.body, (err, results) => {
            if (err) {
                err.status = 400;
                return next(err)
            };
            //Set the response status & end the result.
            res.status(204);
            return res.end();
        });

    //If no data is given to update with, return an error.
    } else {
        const err = new Error("No updated data provided");
        err.status = 400;
        return next(err);
    }
});

//Route to create new reviews.
router.post('/courses/:courseID/reviews', authenticateUser, (req, res, next) => {
    //Make sure at least a rating is given
    if (req.body.rating) {

        //Set the object for the new Review
        reviewData = {
            user: res.locals.user._id,
            rating: req.body.rating,
        }
        //if a review string is given, add it to the Review data.
        if (req.body.review) {
            reviewData.review = req.body.review;
        }
        //Create the new review 
        Review.create(reviewData, (error, review) => {
            if (error) {
                error.status = 400;
                return next(error);
            } else {
                //Then add a reference to it (id) to the related course.
                return Course.findByIdAndUpdate(req.params.courseID, {$push: {reviews: review._id}}, (err, results) => {
                    if (err) {
                        err.status = 400;
                        return next(err);
                    } else {
                        //Set the response location & status, then end the response 
                        res.location(`/courses/${req.params.courseID}`);
                        res.status(201);
                        return res.end();
                    }
                });
            }
        });
    //If no rating is given, return an error
    } else {
        const err = new Error("Review rating is required.");
        err.status = 400;
        return next(err);
    }
})

//Export the router
module.exports = router;