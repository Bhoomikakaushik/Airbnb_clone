const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js")

const listingSchema = Schema({
    title : {
        type : String,
        required: true,
    },
    description : {
        type : String,
    },
    image : {

        filename: { type: String, default: "default Image" },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2t5JTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
        },

        // type: Object,
        // default: {
        //     filename: "default Image",
        //     url:"https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2t5JTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
        // },
        // set : (v) => {
        //     if( !v ||  v === ""){
        //         return {
        //             filename: "default Image",
        //             url : "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2t5JTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
        //         };
        //     }
        //     return v;
        // }
    },
    price : {
        type : Number,
    },
    location : {
        type : String,
    },
    country : {
        type : String
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner : {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

listingSchema.post("findOneAndDelete" , async (listing) => {
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}})
    }
})

const Listing = mongoose.model("Listing" , listingSchema);

module.exports = Listing;