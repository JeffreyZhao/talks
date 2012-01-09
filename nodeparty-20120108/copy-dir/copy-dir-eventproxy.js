/**
 * Module dependencies.
 */

var fs = require('fs');
var path = require('path');
var util = require('util');
var EventProxy = require("eventproxy").EventProxy;
var rl = require("readline").createInterface(process.stdin, process.stdout);

if (process.argv.length < 4) {
  console.log('Usage: node copy-dir.js <fromdir> <todir>');
  process.exit(1);
}
var Next = function () {
  EventProxy.call(this);
  this.seq = [];
  var self = this;
  this.status = "ready";
  this.on("next", function () {
    if (self.status === "ready") {
      var callback = self.seq.shift();
      if (callback) {
        self.status = "pending";
        callback(function () {
          self.status = "ready";
          self.fire("next");
        });
      }
    }
  });
};
util.inherits(Next, EventProxy);

Next.prototype.await = function (callback) {
  this.seq.push(callback);
  return this;
};
Next.prototype.next = Next.prototype.start = function () {
  this.fire("next");
  return this;
};

function CopyDir(fromdir, todir) {
  this.next = new Next();
  this.ep = new EventProxy();
  this.from = fromdir;
  this.to = todir;
};

CopyDir.prototype.start = function () {
  var self = this;
  console.log('Start copy folder "%s" to "%s".', self.from, self.to);
  path.exists(self.to, function (exists) {
    if (exists) {
      self.copydir();
    } else {
      fs.mkdir(self.to, function (err) {
        self.copydir();
      });
    }
  });
};

CopyDir.prototype.copydir = function () {
  var self = this;
  fs.readdir(self.from, function (err, files) {
    if (err) {
      self.ep.emit("error", err);
    } else {
      self.ep.after("done", files.length, function () {
        console.log('Copy folder "%s" to "%s" ... done.', self.from, self.to);
        self.ep.emit("end");
      });

      files.forEach(function (file, index) {
        var from = path.resolve(self.from, file);
        var to = path.resolve(self.to, file);
        fs.stat(from, function (err, fromStats) {
          if (fromStats.isFile()) {
            // нд╪Ч
            path.exists(to, function (exists) {
              if (exists) {
                self.next.await(function (next) {
                  var callback = function () {
                    rl.question('File "' + to + '" exists, overwrite? >', function (answer) {
                      if (/^(?:yes|y)$/i.test(answer)) {
                        self.copy(from, to, true, next);
                      } else if (/^(?:no|n)$/i.test(answer)) {
                        self.copy(from, to, false, next);
                      } else {
                        callback();
                      }
                    });
                  };
                  callback();
                }).start();
              } else {
                self.copy(from, to, true);
              }
            });
          } else if (fromStats.isDirectory()) {
            // д©б╪
            var cd = new CopyDir(from, to);
            cd.ep.on("end", function () {
              self.ep.emit("done");
            });
            cd.start();
          }
        });
      });
    }
  });
};

CopyDir.prototype.copy = function (from, to, overwrite, next) {
  var self = this;
  if (overwrite) {
    util.print('Copying file "' + from + '" to "' + to + '" ... ');
    self._copyByReadWrite(from, to, overwrite, next);
  } else {
    self.ep.emit("done");
    next && next();
  }
};

CopyDir.prototype._copy = function (from, to, overwrite, next) {
  var self = this;
  fs.readFile(from, function (err, data) {
    if (err) {
      console.log('ERROR!!!');
      self.ep.emit("done");
      next && next();
    } else {
      fs.writeFile(to, data, function (err) {
        if (err) {
          console.log('ERROR!!!');
        } else {
          console.log('done.');
        }
        self.ep.emit("done");
        next && next();
      });
    }
  });
};

CopyDir.prototype._copyByPump = function (from, to, overwrite, next) {
  var self = this;
  var streamIn = fs.createReadStream(from);
  var streamOut = fs.createWriteStream(to);
  util.pump(streamIn, streamOut, function (err) {
    if (err) {
      console.log('ERROR!!!');
    } else {
      console.log('done.');
    }
    self.ep.emit("done");
    next && next();
  });
};

CopyDir.prototype._copyByPipe = function (from, to, overwrite, next) {
  var self = this;
  var streamIn = fs.createReadStream(from);
  var streamOut = fs.createWriteStream(to);
  self.ep.once("streamerror", function () {
    console.log('ERROR!!!');
    self.ep.emit("done");
    next && next();
  });
  streamIn.on("error", function () {
    self.ep.fire("streamerror");
  });
  streamOut.on("error", function () {
    self.ep.fire("streamerror");
  });
  streamOut.on("close", function () {
    console.log('done.');
    self.ep.emit("done");
    next && next();
  });
  streamIn.pipe(streamOut);
};

CopyDir.prototype._copyByReadWrite = function (from, to, overwrite, next) {
  var self = this;
  var ep = new EventProxy();
  ep.once("copyerror", function () {
    console.log('ERROR!!!');
    self.ep.emit("done");
    next && next();
  });

  ep.assign("fdIn", "fdOut", function (fdIn, fdOut) {
    var bs = 10240,
      buffer = new Buffer(bs);
    ep.bind("write", function (bytesRead) {
      fs.write(fdOut, buffer, 0, bytesRead, null, function (err, written) {
        if (err) {
          ep.fire("copyerror");
        } else {
          ep.fire("read");
        }
      });
    });
    ep.bind("read", function () {
      fs.read(fdIn, buffer, 0, bs, null, function (err, bytesRead) {
        if (err) {
          ep.fire("copyerror");
        } else if (bytesRead <= 0) {
          fs.close(fdIn, function() {
            fs.close(fdOut, function() {
              console.log('done.');
              self.ep.emit("done");
              next && next();
            });
          });
        } else {
          ep.fire("write", bytesRead);
        }
      });
    });
    ep.fire("read");
  });
  fs.open(from, 'r', function (err, fdIn) {
    if (err) {
      ep.fire("copyerror");
    } else {
      ep.fire("fdIn", fdIn);
    }
  });
  fs.open(to, 'w', function (err, fdOut) {
    if (err) {
      ep.fire("copyerror");
    } else {
      ep.fire("fdOut", fdOut);
    }
  });
};

var fromdir = path.resolve(process.argv[2]);
var todir = path.resolve(process.argv[3]);

var copyworker = new CopyDir(fromdir, todir);
copyworker.start();

copyworker.ep.bind("end", function () {
  process.exit(0);
});