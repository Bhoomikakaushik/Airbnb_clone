const express = require("express");
const router = express.Router({mergeParams: true});

const Review = require("../models/reviews.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js")
//middleware for reviews server side validation
const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }
    else{
        next();
    }
}

//Reviews
router.post("/", isLoggedIn,validateReview, wrapAsync( reviewController.createReview ))

//Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview))

module.exports = router;