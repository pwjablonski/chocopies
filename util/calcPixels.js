

var Jimp = require("jimp");


exports.getPixels = () =>{
  return Jimp.read(
  "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2Fpixil-frame-0.png?v=1588042676267"
  )
  .then(image => {
    var width = image.bitmap.width;
    var height = image.bitmap.height;
    var pixels = [];
    var filled = 0;
    var unfilled = 0;
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        var pixel = Jimp.intToRGBA(image.getPixelColor(x, y));
        var id = y * width + x;
        if (!(pixel.r === 255 && pixel.g === 255 && pixel.b === 255)) {
          filled++;
          pixels.push(true);
        } else {
          unfilled++;
          pixels.push(false);
        }
      }
    }
    return ({ filled, unfilled, height, width, data: pixels });
  })
}
