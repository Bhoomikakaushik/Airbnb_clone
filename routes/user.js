require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

const userController = require("../controllers/users.js")

//render signup form
router.get("/signup",userController.renderSignUpForm)

//signup functionality
router.post("/signup", wrapAsync(userController.signup));

//render login form
router.get("/login" ,userController.renderLoginForm)

//login functionality
router.post("/login", passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}) , userController.login)

//login with google
router.get("/auth/google" , passport.authenticate("google" , {scope: ["profile" , "email"]}))
router.get("/auth/google/callback" , passport.authenticate("google" , {failureRedirect : "/"}),(req,res) => {
    req.flash("success","Welcome back to Wandelust!");
    res.redirect("/listings")
})

router.get("/logout" , userController.logout)

module.exports  = router;