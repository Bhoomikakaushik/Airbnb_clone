const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");


module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.flash("error","you must be logged in ")
        return res.redirect("/login")
    }
    //console.log("middleware executed! user is logged in")
    next();
}

module.exports.isOwner =async (req , res , next ) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`)
    }

    next();
}

module.exports.isReviewAuthor = async (req , res , next) =>{
    let {id} = req.params;
    let {reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the author of this review");
        return res.redirect(`/listings/${id}`)
    }

    next();
}