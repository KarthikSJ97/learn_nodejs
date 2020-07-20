const mongoose = require('mongoose');
const objectId = require('mongodb').ObjectID;

//Connect to MongoDB database
mongoose.connect('mongodb://localhost/mongo-exercises')
.then(() => { console.log('Connected to MongoDB...') })
.catch((error) => { console.log(`Some error occurred...${error}`)});

//Generate schema for course document
const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    tags: [String],
    price: Number
});

//Generate course model with the course schema properties as mentioned
const Course = mongoose.model('courses', courseSchema);

//**********Exercise 1 **********/

//Async function to get all the backend courses based on the filters
//This function is required only to fetch the data
async function getBackendCourses()  {
    return await Course.find({ isPublished : true, tags: 'backend' })
      .sort({ name: 1 })
      .select({ name: 1, author: 1 });
}

//Async function to display the backend courses
//This function is required to structure the code and maintain Single Responsibility Principle
async function displayBackendCourese() {
    const courses = await getBackendCourses();
    console.log(courses);
}

//Function call
displayBackendCourese();

//**********Exercise 2 **********/

//Async function to get all the published based on the filters applied
async function getPublishedCourses() {

    //This way, we can use the in operator
    // return await Course.find({ isPublished: true, tags: { $in: ['frontend', 'backend'] } })
    // .sort('-price')
    // .select('name author');

    //This way, we can use the or operator
    return await Course.find({ isPublished: true })
      .or([ {tags: 'frontend'}, {tags: 'backend'} ])
      .sort('-price')
      .select('name author');
}

//Async function to display the published frontend and backend courses
async function displayPublishedCourses() {
    const publishedCourses = await getPublishedCourses();
    console.log(publishedCourses);
}

//Function call
displayPublishedCourses();

//**********Exercise 3 **********/

//Fetch courses by the name regex & price >= 15$
async function getCourses() {
    return await Course.find({ isPublished: true })
        .or([ { price: { $gte: 15} }, { name: /.*by.*/i } ])
        .sort('-price')
      .select('name author price');
}

//Display the courses
async function displayCourses() {
    const courses = await getCourses();
    console.log(courses);
}

//Function call
displayCourses();


// Updating a document - query first
async function updateCourse(id) {
    const course = await Course.findById( id ).exec();
    // console.log(course);
    if(!course) { return console.log(`Course with Id ${id} not found`); }
    course.isPublished = true;
    course.author = 'Karthik S J';
    const result = await course.save();
    console.log('result', result);
}

updateCourse('5a68fde3f09ad7646ddec17e');


//Updating a document - update first
async function updateCourseAndDisplay(id) {
    const course = await Course.findByIdAndUpdate(id, {
        $set: {
            author: 'KSJ',
            isPublished: false
        }
    }, { new: true });
    console.log('course', course);
}

updateCourseAndDisplay('5a68fde3f09ad7646ddec17e');


//Removing a document - remove first
async function removeCourse(id) {
    const result = await Course.deleteOne({ _id: id });
    console.log(result);
}

removeCourse('5a68fe2142ae6a6482c4c9cb');