//route for reviews remove app and use router

const express = require ('express');
const router = express.Router({mergeParams: true});
//mergeparams give access to the id on preffix with other id 

const Campground = require('../models/campground');
const Review = require('../models/review') //adding review mdel on this file

const { reviewSchema } = require ('../schemas.js'); //joii schema


const ExpressError = require('../utilities/ExpressError');
const catchAsync = require('../utilities/catchAsync');

//validate form 
const validateReview = (req, res, next) => {
    
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }  else {
        next();
    }
}



router.post('/', validateReview, catchAsync(async (req, res) => {
    // res.send('YOU MADE IT!!')
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${campground._id}`);
}))


//route to delet review
router.delete('/:reviewId', catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    //using pull operator to pull review from reviews
    //reviewId gonna pull anything out of reviews
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId}})  
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    // res.send("DELETE ME!!")
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;
