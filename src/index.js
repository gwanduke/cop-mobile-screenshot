const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

fs.readdir(path.join(__dirname, "../images/source"), function(err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  files.forEach(filename => {
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

      const readStream = fs.createReadStream(
        path.join(__dirname, "../images/source", filename)
      );
      const writeStream = fs.createWriteStream(
        path.join(__dirname, "../images/result", filename)
      );

      readStream.pipe(transformer).pipe(writeStream);
    }
  });
});
