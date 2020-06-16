const Joi = require('joi');
const express = require('express');
const app = express();

//Used for parsing request body
app.use(express.json());

//List of courses
const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}
];

//Home
app.get('/', (req, res) => {
    res.send('Hello World !!!');
});

//List of courses
app.get('/api/courses', (req, res) => {
    return res.send(courses);
});

//Add a new course
app.post('/api/courses', (req, res) => {

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
app.put('/api/courses/:id', (req, res) => {

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
app.get('/api/courses/:id', (req, res) => {
    var course = courses.find(courseObject => courseObject.id === parseInt(req.params.id));
    if(!course) return res.status(404).send(`course with id ${req.params.id} not found`);
    res.send(course);
});

//Delete a course
app.delete('/api/courses/:id', (req, res) => {
    
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

//Passing route parameters (params & query)
app.get('/api/posts/:year/:month', (req, res) => {
    return res.send(req.query);
}); 

//Setting port number from environment variables, if not found use 8086
const port = process.env.PORT || 8086;
app.listen(port, () => console.log(`Listening to port ${port}...`));