var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name:"rocks sky",
        image:"https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTF8fGNhbXBpbmd8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name:"granite hills",
        image:"https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTJ8fGNhbXBpbmd8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name:"hamershire",
        image:"https://images.unsplash.com/photo-1525811902-f2342640856e?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTN8fGNhbXBpbmd8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
]

function seedDB(){
    // remove all the campgrounds
    Campground.remove({}, function(err){
        // if(err){
        //     console.log(err);
        // }
        // console.log("all campgrounds are removed");
        // // add a campgrounds
        // data.forEach(function(seed){
        //     Campground.create(seed, function(err, campground){
        //         if(err){
        //             console.log(err);
        //         }else{
        //             console.log("campground created");
        //             // create the comments for each campground
        //             Comment.create({
        //                 text:"This place is grate. but i wish there was internet",
        //                 author: "hormonie granger"
        //             }, function(err, comment){
        //                 if(err){
        //                     console.log(err);
        //                 }else{
        //                     // save it to th campground comments array
        //                     campground.comments.push(comment);
        //                     campground.save();
        //                     console.log("created a comment");
        //                 }
        //             })
        //         }
        //     });
        // })
    });
}

module.exports = seedDB;
