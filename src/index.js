const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { close, open, utimes } = require("fs");

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

const touch = (path, callback) => {
  const time = new Date();
  utimes(path, time, time, err => {
    if (err) {
      return open(path, "w", (err, fd) => {
        err ? callback(err) : close(fd, callback);
      });
    }
    callback();
  });
};

walk(path.join(__dirname, "../images/source"), function(err, result) {
  result.forEach(sourcePath => {
    const pathes = sourcePath.split("/");
    const filename = pathes[pathes.length - 1];
    const resultPath = sourcePath.replace("images/source", "images/result");
    const resultFolder = resultPath
      .split("/")
      .reduce((acc, cur, idx, arr) => {
        if (arr.length - 1 !== idx) acc.push(cur);

        return acc;
      }, [])
      .join("/");
    fs.mkdirSync(resultFolder, { recursive: true });

    // const fd = fs.openSync(resultPath, "w+");

    if (/\.(gif|jpe?g|tiff|png|webp|bmp)$/i.test(filename)) {
      const transformer = sharp()
        .extract({
          left: 0,
          top: 256,
          width: 1080,
          height: 2280 - 256 - 126
        })
        .on("info", function(info) {
          console.log("Image height is " + info.height);
        });

      const readStream = fs.createReadStream(sourcePath);
      // var mtime = parseInt(new Date().getTime() / 1000);
      // fs.futimesSync(fd, mtime, mtime);

      // touch(resultPath, () => {
      const writeStream = fs.createWriteStream(resultPath);
      readStream.pipe(transformer).pipe(writeStream);
      // });
    }
  });
});
