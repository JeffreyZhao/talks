var express = require("express");
var app = express.createServer();
var cache = require("./lib/cache");
var db = require("./lib/db");

app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("view options", { layout: false });

var getCategory = function (id, callback) {
    var key = "cat_" + id;
    cache.get(key, function (cat) {
        if (cat) {
            return callback(null, cat);
        }
        
        db.getCategory(id, function (err, cat) {
            if (err) {
                return callback(err);
            }
            
            cache.set(key, cat, function () {
                callback(null, cat);
            });
        });
    })
}

var getPost = function (id, callback) {
    var key = "post_" + id;
    cache.get(key, function (post) {
        if (post) {
            return callback(null, post);
        }
        
        db.getPost(id, function (err, post) {
            if (err) {
                return callback(err);
            }
            
            cache.set(key, post, function () {
                callback(null, post);
            });
        });
    })
}

var getCategoryList = function (ids, callback) {
    var get = function (ids, categories) {
        if (ids.length <= 0) {
            return callback(null, categories);
        }
        
        getCategory(ids.shift(), function (err, cat) {
            if (err) {
                return callback(err);
            }
            
            categories.push(cat);
            get(ids, categories);
        });
    };
    
    get(ids, []);
}

var getFullPost = function (id, callback) {
    getPost(id, function (err, post) {
        if (err) {
            return callback(err);
        }
        
        getCategoryList(post.categoryIds, function (err, categories) {
            if (err) {
                return callback(err);
            }
            
            post.categories = categories;
            callback(null, post);
        });
    });
}

app.get("/", function (req, res, next) {
    
    var time = new Date();
    
    var get = function (ids, posts) {
        if (ids.length <= 0) {
            console.log(new Date() - time);
            return res.render("index", { posts: posts });
        }
        
        getFullPost(ids.shift(), function (err, p) {
            if (err) {
                return next(err);
            }
            
            posts.push(p);
            get(ids, posts);
        });
    }
    
    db.getPostIDs(function (err, ids) {
        if (err) {
            return next(err);
        }
        
        get(ids, []);
    });
})

app.listen(8080);
console.log("It's working.");
