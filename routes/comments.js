var express= require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// NEW - to show the form to add new comments
router.get("/campgrounds/:id/comments/new", isLoggedIn,  function(req, res){
    Campground.findById(req.params.id, function(err, foundCamp){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: foundCamp});
        }
    })
});

// CREATE - to handle the new comments added
router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    // find the post which you want to associate comment
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            // create the comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    // add username and id to campground
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    // save the comment
                    comment.save();
                    // associate the comment with found campground
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+ campground._id);
                }
            });
        }
    });
});

// EDIT - to edit the comment
router.get("/campgrounds/:id/comments/:comment_id/edit", checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.render("back");
        }else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    })
   
});

// UPDATE - to update the comment
router.put("/campgrounds/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.render("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// DELETE - to delete the comment
router.delete("/campgrounds/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.render("back");
        }else{
            res.redirect("/campgrounds/"+ req.params.id);
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


// for comment authorization
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