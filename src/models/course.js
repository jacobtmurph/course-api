const mongoose = require('mongoose');


const CourseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    estimatedTime: String,
    materialsNeeded: String,
    steps: [{
        stepNumber: Number,
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    }],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Review'
        }
    ]
});

const Course = mongoose.model('Course', CourseSchema, 'courses');
module.exports = Course;