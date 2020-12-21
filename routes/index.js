var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

router.get("/", function(req, res){
    res.render("landing");
 });
 
 // ============
 // AUTH ROUTES
 // ============
 
 // to show the register form
 router.get("/register", function(req, res){
     res.render("register");
 });
 
 // to handle the register request 
 router.post("/register", function(req, res){
     var newUser = new User({username: req.body.username});
     User.register(newUser, req.body.password, function(err, user){
         if(err){
             req.flash("error", err.message );
             return res.render("register");
         }
         passport.authenticate("local")(req, res, function(){
             req.flash("success", "welcome to InstaCamp "+ user.username);
             res.redirect("/campgrounds");
         });
     })
 });
 
 // to show login form
 router.get("/login", function(req, res){
     res.render("login");
 });
 
 // to handle login request
 router.post("/login", passport.authenticate("local", {
     successRedirect: "/campgrounds",
     failureRedirect:"/login"
 }),function(req, res){
 });
 
 // logout route
 router.get("/logout", function(req, res){
     req.logout();
     req.flash("success", "You have successfully logout!");
     res.redirect("/campgrounds");
 });
 
 // middle ware
 function isLoggedIn(req, res, next){
     if(req.isAuthenticated()){
         return next();
     }
     req.flash("error", "You need to login first!");
     res.redirect("/login");
 }
 
 // ==============
 // Authorization
 // ==============
 
 // for campgrounds
 function checkCampgroundOwnership(req, res, next){
     // check if user is loggedin
     if(req.isAuthenticated()){
         // found the campground
         Campground.findById(req.params.id, function(err, foundCampground){
             if(err){
                 req.flash("error", "Campground not found!");
                 res.render("back");
             }else{
                 // check if user own a campground
                 if(foundCampground.author.id.equals(req.user._id)){
                     next();
                 }else{
                     req.flash("error", "You don't have permission!");
                     res.redirect("back");
                 }
             }
         })
     }else{
         req.flash("error", "You need to login!")
         res.redirect("back");
     }
 }
 
 // for comments
 function checkCommentOwnership(req, res, next){
     // check if user login
     if(req.isAuthenticated()){
         // found the comment
         Comment.findById(req.params.comment_id, function(err, foundComment){
             if(err){
                 res.render("back");
             }else{
                 // check if user own a comment
                 if(foundComment.author.id.equals(req.user._id)){
                     next();
                 }else{
                     req.flash("error", "You don't have permission!");
                     res.redirect("back");
                 }
             }
         });
     }else{
         req.flash("error", "You need to login!");
         res.render("back");
     }
 }

 module.exports = router;