var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    flash       = require("connect-flash");
    seedDB      = require("./seeds");
// seedDB();

// connect mongoose to DB
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false});
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");


// passport configuration
app.use(require("express-session")({
    secret: "sanket is best",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
// =======
// ROUTES
// =======

app.get("/", function(req, res){
   res.render("landing");
});

// INDEX - to show all the campgrounds
app.get("/campgrounds", function(req, res){
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
app.get("/campgrounds/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// CREATE - add a new campground to DB
app.post("/campgrounds", isLoggedIn, function(req, res){
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
app.get("/campgrounds/:id", function(req, res){
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
app.get("/campgrounds/:id/edit", checkCampgroundOwnership, function(req, res){
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
app.put("/campgrounds/:id", checkCampgroundOwnership, function(req, res){
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
app.delete("/campgrounds/:id", checkCampgroundOwnership, function(req, res){
    // find the campground and delete it
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});

// ================
// COMMENTS ROUTES
// ================


// NEW - to show the form to add new comments
app.get("/campgrounds/:id/comments/new", isLoggedIn,  function(req, res){
    Campground.findById(req.params.id, function(err, foundCamp){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: foundCamp});
        }
    })
});

// CREATE - to handle the new comments added
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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
app.get("/campgrounds/:id/comments/:comment_id/edit", checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.render("back");
        }else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    })
   
});

// UPDATE - to update the comment
app.put("/campgrounds/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.render("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// DELETE - to delete the comment
app.delete("/campgrounds/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.render("back");
        }else{
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});



// ============
// AUTH ROUTES
// ============

// to show the register form
app.get("/register", function(req, res){
    res.render("register");
});

// to handle the register request 
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message );
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "welcome to yelpcamp "+ user.username);
            res.redirect("/campgrounds");
        });
    })
});

// to show login form
app.get("/login", function(req, res){
    res.render("login");
});

// to handle login request
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect:"/login"
}),function(req, res){
});

// logout route
app.get("/logout", function(req, res){
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

// port on which server is started
app.listen(3000, function(){
    console.log("server is started at port 3000..");
});
