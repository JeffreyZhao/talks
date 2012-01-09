var rl = require('readline').createInterface(process.stdin, process.stdout)
  , fs = require('fs')
  , path = require('path')
  , util = require('util')

function copyFileByPump (file, remainFiles, destDir) {
  var destFile = path.join(destDir, file)
    , streamIn = fs.createReadStream(file)
    , streamOut = fs.createWriteStream(destFile)
  util.pump(streamIn, streamOut, function (err) {
    if (err) {
      console.log('ERROR!!!');
      copyDir(root, remainFiles, destDir)
    } else {
      console.log('done.');
      copyDir(root, remainFiles, destDir)
    }
  });
}

function copyFileByPipe (file, remainFiles, destDir) {
  var destFile = path.join(destDir, file)
    , streamIn = fs.createReadStream(file)
    , streamOut = fs.createWriteStream(destFile)

  streamIn.pipe(streamOut);

  var onError, onClose;
  var cleanUp = function () {
    streamIn.removeListener("error", onError);
    streamOut.removeListener("error", onError);
    streamOut.removeListener("close", onClose);
  };
  onError = function (err) {
    cleanUp();
    console.log("ERROR!!!");
    copyDir(root, remainFiles, destDir);
  };
  onClose = function () {
    cleanUp();
    console.log('done.');
    copyDir(root, remainFiles, destDir);
  };

  streamIn.on("error", onError);
  streamOut.on("error", onError);
  streamOut.on("close", onClose);
}

function copyFileByLoop (file, root, remainFiles, destDir) {
  var destFile = path.join(destDir, file)
  fs.open(path.join(root, file), 'r', function(err, fdIn) {
    if (err) {
      console.log('ERROR!!!');
      return copyDir(root, remainFiles, destDir)
    }
    fs.open(destFile, 'w', function(err, fdOut) {
      if (err) {
      console.log(err);
        console.log('ERROR!!!');
        return copyDir(root, remainFiles, destDir)
      }
      var bs = 10240
        , buffer = new Buffer(bs)
      function readcb (err, bytesRead) {
        if (err) {
          console.log('ERROR!!!');
          return copyDir(root, remainFiles, destDir)
        } else if (bytesRead <= 0) {
          fs.close(fdIn, function() {
            fs.close(fdOut, function() {
              console.log('done.')
              copyDir(root, remainFiles, destDir)
            })
          })
        } else {
          fs.write(fdOut, buffer, 0, bytesRead, null, writecb);
        }
      }
      function writecb (err, written) {
        if (err) {
          console.log('ERROR!!!');
          return copyDir(root, remainFiles, destDir)
        } else {
          fs.read(fdIn, buffer, 0, bs, null, readcb)
        }
      }
      fs.read(fdIn, buffer, 0, bs, null, readcb)
    })
  })
}

function copyDir (root, files, destDir) {
  if (!Array.isArray(files)) {
    return copyDir(root, [files], destDir)
  } else if (!files.length) {
    rl.close()
    process.stdin.destroy()
    return
  }

  var firstFile = files[0]
    , remainFiles = files.slice(1)
    , destFile = path.join(destDir, firstFile)
  fs.stat(path.join(root, firstFile), function(err, stat) {
    if (stat.isFile()) {
      path.exists(destFile, function(exists) {
        if (exists) {
          rl.question('File "' + destFile + '" exists, overwrite? > ', function (answer) {
            if (answer.match(/yes/i) || answer.match(/y/i)) {
              util.print('Copying "' + path.join(root, firstFile) + '" to "' + destFile + '" ... ');
              // copyFileByPump(firstFile, root, remainFiles, destDir);
              // copyFileByPipe(firstFile, root, remainFiles, destDir);
              copyFileByLoop(firstFile, root, remainFiles, destDir);
            } else if (answer.match(/no/i) || answer.match(/n/i)) {
              copyDir(root, remainFiles, destDir)
            } else {
              copyDir(root, files, destDir)
            }
          });
        } else {
          util.print('Copying "' + path.join(root, firstFile) + '" to "' + destFile + '" ... ');
          // copyFileByPump(firstFile, root, remainFiles, destDir);
          // copyFileByPipe(firstFile, root, remainFiles, destDir);
          copyFileByLoop(firstFile, root, remainFiles, destDir);
        }
      })
    } else if (stat.isDirectory()) {
      fs.readdir(path.join(root, firstFile), function(err, dirFiles) {
        var next = function() {
          copyDir(root, dirFiles.map(function(file) {
            return path.join(firstFile, file)
          }).concat(remainFiles), destDir)
        }
        path.exists(destFile, function(exists) {
          if (!exists) {
            fs.mkdir(destFile, function(err) {
              next()
            })
          } else {
            next()
          }
        })
      })
    }
  })
}

var src = process.argv[2]
  , dest = process.argv[3]
if (dest) {
  path.exists(dest, function(exists) {
    if (!exists) {
      fs.mkdir(dest, function(err) {
        copyDir(src, '.', dest)
      })
    } else {
      fs.stat(dest, function(err, stat) {
        if (err || !stat.isDirectory()) {
          console.log('error on destDir')
        } else {
          copyDir(path.dirname(src), path.basename(src), dest)
        }
      })
    }
  })
} else {
  console.log('usage: node copy-dir.js origDir destDir')
}