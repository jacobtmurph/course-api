# course-api

A RESTful, authenticated course-rating API build in Express &amp; MongoDB.

# Installation
This package and it's dependancies can be installed via the `npm i` command, and run via `npm start.`

## To add some example data & users, navigate to the `seed data` directory and run the following commands:

```
mongoimport --db course-api --collection courses --type=json --jsonArray --file courses.json
mongoimport --db course-api --collection users --type=json --jsonArray --file users.json
mongoimport --db course-api --collection reviews --type=json --jsonArray --file reviews.json
```

# Authentication

This API uses user-authentication via HTTP Authentication Headers and static methods on the `User` model. Please note the following routes require authentication:

`GET - /api/users`: Returns the current authenticated user's data.

`POST - /api/courses`: Creates &amp; stores a new Course to the database.

`PUT - /api/courses/{course ID}`: Updates data on a given a course.

`POST - /api/courses/{course ID}/reviews`: Creates a new review and connects it to the related course via deep population.

# Creating Data for the API

## Creating a new user

Before testing out the api, it's reccomended you create a new user via the `/api/users` POST route. The following fields are required in the `request` body (in `application/json` format) to do so

`fullName`: The first & last name of the user.

`email`: the email address for the account. (This is a unique field).

`password`: The password you wish the user to use. (The password is hashed before being saved).

## Creating a new Course

To create a new course object, the following are required in the `request` body (`application/json` format).

`title`: The title of the course

`description`: Some basic details on the course.

`steps`: An `Array` of `Objects`, with the following fields required:

  `title`: The title of the step.
  
  `description`: Details about the step.
   The 'step' objects may also have the following optional field:
    
    `stepNumber`: The number of the step in relation to the other steps to take.
    
### A `course` may also have the following optional fields:
`estimatedTime`: The time estimated to complete a course.

`materialsNeeded`: The needed resources to complete the course.

## Creating a new Review
To create a new review object, only one field is required:

`rating`: a number between 1 & 5 to show how good a given course is.

Aditionally, you may add a `review` field to the `request` body, with a longer text review of a course.
