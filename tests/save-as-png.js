const PNG = require("pngjs").PNG
const fs = require("fs")
function saveAsPNG(buffer, width, height, name) {
    var png = new PNG({
        width: width,
        height: height,
        bitDepth: 16,
        colorType: 2,
        inputColorType: 2,
        inputHasAlpha: false,
    })
    png.data = buffer
    png.pack().pipe(fs.createWriteStream(`output/${name}.png`))
}
module.exports = saveAsPNG
