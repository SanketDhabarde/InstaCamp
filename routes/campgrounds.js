var express= require("express");
var router = express.Router();
var Campground = require("../models/campground");

// INDEX - to show all the campgrounds
router.get("/campgrounds", function(req, res){
    //retrive the campgrounds from the DB
    Campground.find({}, function(err, allCampgrounds){
        if(err)
        {
            console.log("error");
        }else{
            //show all the campgrounds on campgrounds page
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// NEW - to show the form to add new campgrounds
router.get("/campgrounds/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// CREATE - add a new campground to DB
router.post("/campgrounds", isLoggedIn, function(req, res){
   var name = req.body.name;
   var price = req.body.price;
   var image = req.body.image;
   var description = req.body.description;
   var author ={
       id: req.user._id,
       username: req.user.username
   }
   var newCampground = {name:name, price:price, image:image, description: description, author: author};
    // create the new campground
    Campground.create(newCampground, function(err, newlyCampground){
        if(err){
            console.log("something went wrong");
        }else{
            // redirect to campgrounds
            res.redirect("/campgrounds");
        }
    });
});

// SHOW - shows the information about specific campground
router.get("/campgrounds/:id", function(req, res){
    //find the campground with id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            //render the show page
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT - sow the form to edit particular campground
router.get("/campgrounds/:id/edit", checkCampgroundOwnership, function(req, res){
    // find the campground from DB that you want to edit
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log("error!!");
        }else{
            // render the edit form
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

// UPDATE - update the info of campgrounds
router.put("/campgrounds/:id", checkCampgroundOwnership, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var updatedCampground = {name:name, price: price, image:image, description: description};
    Campground.findByIdAndUpdate(req.params.id, updatedCampground, function(err, updateCampground){
        if(err){
            console.log("error");
        }else{
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

// DELETE - to delete the campground
router.delete("/campgrounds/:id", checkCampgroundOwnership, function(req, res){
    // find the campground and delete it
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
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

module.exports = router;