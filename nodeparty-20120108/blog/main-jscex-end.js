var express = require("express");
var app = express.createServer();
var cache = require("./lib/cache");
var db = require("./lib/db");

app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("view options", { layout: false });

var Jscex = require("./lib/jscex");
var Jscexify = Jscex.Async.Jscexify;

cache.getAsync = Jscexify.fromCallback(cache.get);
cache.setAsync = Jscexify.fromCallback(cache.set);

db.getCategoryAsync = Jscexify.fromStandard(db.getCategory);
db.getPostAsync = Jscexify.fromStandard(db.getPost);
db.getPostIDsAsync = Jscexify.fromStandard(db.getPostIDs);

app.getAsync = function (path, handler) {
    app.get(path, function (req, res, next) {
        var t = handler(req, res);
        t.addEventListener("failure", function () {
            next(t.error);
        });
        t.start();
    });
}

var getCategoryAsync = eval(Jscex.compile("async", function (id) {
    var key = "cat_" + id;
    var cat = $await(cache.getAsync(key));
    if (cat) return cat;
    
    cat = $await(db.getCategoryAsync(id));
    $await(cache.setAsync(key, cat));
    return cat;
}));

var getPostAsync = eval(Jscex.compile("async", function (id) {
    var key = "post_" + id;
    var post = $await(cache.getAsync(key));
    if (post) return post;
    
    post = $await(db.getPostAsync(id));
    $await(cache.setAsync(key, post));
    return post;
}));

app.getAsync("/", eval(Jscex.compile("async", function (req, res) {
    var time = new Date();
    
    var postIds = $await(db.getPostIDsAsync());
    var posts = [];
    for (var i = 0; i < postIds.length; i++) {
        var p = $await(getPostAsync(postIds[i]));
        p.categories = [];
        
        for (var j = 0; j < p.categoryIds.length; j++) {
            var cat = $await(getCategoryAsync(p.categoryIds[j]));
            p.categories.push(cat);
        }

        posts.push(p);
    }
    
    console.log(new Date() - time);
    res.render("index", { posts: posts });
})));

app.listen(8080);
console.log("It's working.");