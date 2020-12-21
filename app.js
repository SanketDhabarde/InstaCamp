require('dotenv').config()
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
    
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");

// connect mongoose to DB
//mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false});
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false});
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

app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);

// port on which server is started
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server is started..");
});
