const mongoose = require('mongoose');

// Connecting to MongoDB
mongoose.connect('mongodb://localhost/courses')
    .then(() => console.log('Connected...'))
    .catch(err => console.error('Connection failed...', err));

// Defining a schema 
const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        //match: /pattern/
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network'],
        lovercase: true,
        trim: true
    },
    author: [String],
    tags: {
        type: Array,
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'A course should have at least one tag.'
        }
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function() { return this.isPublished; },
        min: 10,
        max: 200,
        get: v => Math.round(v),
        set: v => Math.round(v)
    }
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse(){
    const course = new Course({
        name: 'Node Course',
        category: 'web',
        author: 'MarizzaMil',
        tags: ['frontend'],
        isPublished: true,
        price: 15.8
    });
    
    try{
        const result = await course.save();
        console.log(result);
    }
    catch (ex){
        for (field in ex.errors)
            console.log(ex.errors[field].message)
    }
}

async function getCourses(){

    const courses = await Course
        .find({author: 'MarizzaMil',  isPublished: true})
        .limit(10)
        .sort({name: 1})
        .select({name: 1, tags: 1})
    console.log(courses);
}

async function updateCourse(id){
    const course = await Course.findByIdAndUpdate(id, {
        $set: {
            author: 'Jason',
            isPublished: false
        }
    }, {new: true});
    console.log(course);
}

async function removeCourse(id){
    const course = await Course.findByIdAndRemove(id);
    console.log(course);
}

createCourse();
//getCourses();
//updateCourse('');
//removeCourse('');