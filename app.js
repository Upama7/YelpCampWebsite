const express = require ('express');
const path = require('path')
const mongoose = require ("mongoose");
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utilities/ExpressError');
const methodOverride = require('method-override');


const campgrounds = require('./routes/campgrounds');
//taking all campground routes and making a single route and exporting in main app.js file to make file look more clear
const reviews = require('./routes/reviews');


mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;

db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))) //join path for validateform to boilerplate


//flash 

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

// //validate review form 
// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     }  else {
//         next();
//     }
// }


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//router handler
//campground router and name that we want to preffix with 
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews/', reviews)


app.get('/', (req, res) => {
    res.render('home')
});




//404 route
//route to display status code for error hadelling
//for invalid routes or for any unhadle error
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
    // res.send("404!!!!")
});

//error handler route
//middlewear error handleing 
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err });
    // res.send('Oh boy, something went wrong!')
})


//listener route
app.listen(3000, () => {
    console.log('Serving on port 3000')
});