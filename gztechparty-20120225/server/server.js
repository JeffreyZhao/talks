var http = require("http"),
    url = require("url");

var buffer = new Buffer(100);
var interval = 100;
var port = 8123;

var download = function (request, response, second) {
    var contentLength = 1000 / interval * second * buffer.length;
    response.writeHead(200, { "Content-Length": contentLength.toString() });

    var loop = function (passed) {
        if (passed >= second * 1000) {
            response.end();
        } else {
            response.write(buffer);
            setTimeout(function () { loop(passed + interval); }, interval);
        }
    };

    loop(0);
}

var upload = function (request, response) {
    var length = 0;

    request.on("data", function (data) {
        length += data.length;
    });

    request.on("end", function () {
        response.end(length.toString());
    });
}

http.createServer(function (request, response) {
    
    var uri = url.parse(request.url, true);
    if (uri.pathname == "/download") {
        download(request, response, parseInt(uri.query["s"], 10));
    } else if (uri.pathname == "/upload") {
        upload(request, response);
    } else {
        response.end(request.url);
    }

}).listen(port);

console.log("Server started at " + port);