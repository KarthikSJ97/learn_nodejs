const Joi = require('joi');
const express = require('express');
const router = express.Router();

//List of courses
const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}
];

//List of courses
router.get('/', (req, res) => {
    return res.send(courses);
});

//Add a new course
router.post('/', (req, res) => {

    const { error } = validateCourse(req.body);
    if(error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.status(201).send(course);
});

//Update a course
router.put('/:id', (req, res) => {

    //Check if the course exists based on course Id
    var course = courses.find(courseObject => courseObject.id === parseInt(req.params.id));
    if(!course) {
        res.status(404).send(`course with id ${req.params.id} not found`);
        return;
    }

    //Object destructuring
    const { error } = validateCourse(req.body);
    if(error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    //Update the name of the course with the id passed as a param
    course.name = req.body.name;
    return res.send(course);

});

//Get course by course Id
router.get('/:id', (req, res) => {
    var course = courses.find(courseObject => courseObject.id === parseInt(req.params.id));
    if(!course) return res.status(404).send(`course with id ${req.params.id} not found`);
    res.send(course);
});

//Delete a course
router.delete('/:id', (req, res) => {
    
    //Check if course exists
    var course = courses.find(courseObject => courseObject.id === parseInt(req.params.id));
    if(!course) return res.status(404).send(`course with id ${req.params.id} not found`);

    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.status(204);
    return res.end();

});

//Validating the course name
function validateCourse(course) {

    //Validate the name sent in the request body
    var schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

module.exports = router;
