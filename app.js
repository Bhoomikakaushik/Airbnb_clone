if(process.env.NODE_env != "production"){
    require("dotenv").config();
}
//console.log(process.env)

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path")

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

const methodOverride = require("method-override");
const ejs_mate = require("ejs-mate");
//const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
//const Listing = require("./models/listing.js");

// const {listingSchema, reviewSchema} = require("./schema.js");
// const Review = require("./models/reviews.js");

//authentication access
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const GoogleStrategy = require("passport-google-oauth2").Strategy;


//routes
const reviewRouter = require("./routes/review.js");
const listingRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");
// const { profile } = require("console");




main()
.then(() => {
    console.log("connected to db")
}).catch((err) => {
    console.log(err);
})

async function main(){
    await mongoose.connect(dbUrl);
}

const port = 8080;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejs_mate )
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})

store.on("error" , () => {
    console.log("ERROR in Mongo Session Store", err);
})

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized : true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

// app.get("/" , (req, res) => {
//     res.send(" hiii! I am the root")
// })



app.use( session(sessionOptions));
app.use(flash());

//authentication
//app.use(require("express-session"))
app.use(passport.initialize());
app.use(passport.session());//users can still logged in as they browse our site
passport.use(new LocalStrategy(User.authenticate()));

passport.use( new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/google/callback",
    } ,
    async (accessToken , refreshToken , profile, done ) => {
        try {
            let user = await User.findOne({ googleId: profile.id });

            if (!user) {
                user = new User({
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                });

                await user.save();
            }

            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }
))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res , next ) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;//stores the info of current user which is logged in
    // console.log(res.locals);
    next();
});

// app.get("/demouser" ,async (req,res) => {
//     let fakeUser  =new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// })


//Express router
app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);


// app.get("/testListing" ,(req, res) => {
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description : "By the forest",
//         price: 34576,
//         location : "Georgia , US",
//         country : "US",
//     });

//     sampleListing.save()
//     .then( () => {
//         console.log("sample was saved")
//     })
//     .catch((err) => {
//         console.log(err)
//     })
    
//     res.send("succesful testing")
    
// })


// for all undefined routes
app.all("*" , (req, res,next) => {
    next(new ExpressError(404 , "Page Not Found !!"));
})

app.use((err,req , res ,next) => {
    let {statusCode = 500, message = "Something went wrong !" } = err; //deconstructing from err
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs" , {err})
    
})

app.listen(port , () => {
    console.log(`server is starting at port ${port} `);
})