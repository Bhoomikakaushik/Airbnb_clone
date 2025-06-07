const Listing = require("../models/listing.js")

module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
        //console.log(res)
    res.render("listings/index.ejs", {allListings})    
}

module.exports.renderNewForm = (req , res) => { 
    // if(!req.isAuthenticated()){
    //     req.flash("error","you must be logged in to create listing")
    //     res.redirect("/login")
    // }
    res.render("listings/new.ejs")
}

module.exports.showListing = async (req , res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:({path:"author"})}).populate("owner");
    if(!listing){
        req.flash("error" , "Listing you requested does not exist");
        res.redirect("/listings")
    }
    // console.log(listing)
    res.render("listings/show.ejs",{listing})
}

module.exports.createListing = async (req , res) => {
    //let {title,description, image, price , location, country} = req.body;
    //one more way to access this by making an object
    // if( !req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing")
    // }
    let url = req.file.path;
    let filename = req.file.filename;
 
    let newListing = new Listing(req.body.listing);
    newListing.owner =  req.user._id;
    newListing.image = {url , filename}
    //console.log(newListing.owner)
    await newListing.save();
    req.flash("success" , "New Listing Created!");
    //console.log(listing)
    res.redirect("/listings")
}

module.exports.renderEditForm = async (req,res) => {

    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , "Listing you requested does not exist");
        res.redirect("/listings")
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/h_300,w_250")

    res.render("listings/edit.ejs",{listing, originalImageUrl})
}

module.exports.updateListing = async(req , res) => {
    // if( !req.body.listing){
    //  throw new ExpressError(400,"Send valid data for listing")
    // }
    let {id} = req.params;
    // let listing = await Listing.findById(id);
    // if(!listing.owner.equals(res.locals.currUser._id)){
    //     req.flash("error" , "You don't have permission to edit");
    //     return res.redirect(`/listings/${id}`)
    // }
    let partialUpdate = await Listing.findByIdAndUpdate(id , {...req.body.listing});

    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        partialUpdate.image = {url , filename}
        await partialUpdate.save();
    }
    
    req.flash("success" , "Listing Updated!");
    res.redirect(`/listings/${id}`)
}

module.exports.deleteListing = async(req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Deleted!");
    //console.log(deletedListing);
    res.redirect("/listings")
}