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
    app.get(path, function (req, res) {
        var t = handler(req, res);
        t.start();
    });
}

app.listen(8080);
console.log("It's working.");