const Listing = require("../models/listing.js")
const Review = require("../models/reviews.js")

module.exports.createReview = async (req , res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    // if(!listing){
    //     console.log("listing is not defined")
    // }
    newReview.author = req.user._id;
    // console.log(newReview)
    listing.reviews.push(newReview);    
    await newReview.save();
    await listing.save();
    req.flash("success" , "New Review Created!");

    //console.log("new review saved")
    res.redirect(`/listings/${listing._id}`)

}

module.exports.deleteReview = async (req,res) => {
    let {id,reviewId} = req.params;
    Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review Deleted!");
    res.redirect(`/listings/${id}`)
}