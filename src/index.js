const sharp = require("sharp");
const fs = require("fs");

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
  __dirname + "/../images/source/origin.jpg"
);
const writeStream = fs.createWriteStream(
  __dirname + "/../images/result/result.jpg"
);

readStream.pipe(transformer).pipe(writeStream);
