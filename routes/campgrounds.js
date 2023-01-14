//combine route for campground remove app.use and use router.use

const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const { campgroundSchema} = require ('../schemas.js'); //joi schema\
const { isLoggedIn } = require('../middleware');

const ExpressError = require('../utilities/ExpressError');
const Campground = require('../models/campground');


//validate form 
const validateCampground = (req, res, next) => {
    
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }  else {
        next();
    }
}


router.get('/', catchAsync( async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));


router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
});


router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    // try {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);

    //joi npm package
    // const campgroundSchema = Joi.object({
    //     campground: Joi.object({
    //         title: Joi.string().required(),
    //         price: Joi.number().required().min(0),
    //         image: Joi.string().required(),
    //         location: Joi.string().required(),
    //         description: Joi.string().required()
    //     }).required()
    // })
    // const { error } = campgroundSchema.validate(req.body);
    // if (error) {
    //     const msg = error.details.map(el => el.message).join(',')
    //     throw new ExpressError(msg, 400)
    // }
    // if(result.error) {
    //     throw new ExpressError(result.error.details, 400)
    // }
    // console.log(result);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`campgrounds/${campground._id}`)
    // } catch(e) {
    //     next(e)
    // }
}))


router.get('/:id', catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));


router.get('/:id/edit', isLoggedIn, catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground })
}));

router.put('/:id', isLoggedIn, validateCampground, catchAsync( async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:id', isLoggedIn, catchAsync( async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}));


module.exports = router;