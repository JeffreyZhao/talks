var fs = require("fs");
var path = require("path");
var util = require("util");
var _ = require("underscore")

var Jscex = require("./jscex");
var Async = Jscex.Async;
var Task = Async.Task;
var Jscexify = Async.Jscexify;

// path bindings
path.existsAsync = Jscexify.fromCallback(path.exists);

// util bindings
util.pumpAsync = Jscexify.fromStandard(util.pump);

// fs bindings
fs.mkdirAsync = Jscexify.fromStandard(fs.mkdir);
fs.readdirAsync = Jscexify.fromStandard(fs.readdir);
fs.statAsync = Jscexify.fromStandard(fs.stat);

var copyDirAsync = eval(Jscex.compile("async", function (srcDir, targetDir, agent) {
    var exists = $await(path.existsAsync(targetDir));
    if (!exists) {
        $await(fs.mkdirAsync(targetDir));
    }
    
    var files = $await(fs.readdirAsync(srcDir));
    for (var i = 0; i < files.length; i++) {
        var srcPath = path.join(srcDir, files[i]);
        var targetPath = path.join(targetDir, files[i]);
        
        var stat = $await(fs.statAsync(srcPath));
        if (stat.isFile()) {
            agent.post({ src: srcPath, target: targetPath });
        } else {
            $await(copyDirAsync(srcPath, targetPath, agent));
        }
    }
}));

var copyFileAsync = eval(Jscex.compile("async", function (agent) {
    while (true) {
        var copy;
        try {
            copy = $await(agent.receive());
        } catch (ex) {
            return;
        }
        
        console.log(util.format('Copying "%s" to "%s"', copy.src, copy.target));
        
        var streamIn = fs.createReadStream(copy.src);
        var streamOut = fs.createWriteStream(copy.target);
        $await(util.pumpAsync(streamIn, streamOut));
    }
}));

var agent = new Async.Agent();
copyDirAsync(process.argv[2], process.argv[3], agent).start();

var numWorkers = parseInt(process.argv[4] || "3", 10);

Task.whenAll(_.range(numWorkers).map(function () {
    return copyFileAsync(agent);
})).start();