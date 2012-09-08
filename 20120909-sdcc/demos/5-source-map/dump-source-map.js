var sourceMap = require('source-map');
var SourceMapConsumer = sourceMap.SourceMapConsumer;

var fs = require("fs");
var mapContent = fs.readFileSync("./test.min.js.map", "utf8");
var consumer = new SourceMapConsumer(mapContent);

var json = JSON.stringify(consumer._generatedMappings, null, 4);
fs.writeFileSync("./test.min.js.map.dump", json, "utf8");
