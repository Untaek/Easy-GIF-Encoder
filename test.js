const jpeg = require('jpeg-js')
const fs = require('fs')
const sq = require('./src/quantization/UniformQuant')
const gif = require('./src/GIFStream')

const buf = fs.readFileSync('test_image.jpg')

const bitmap = jpeg.decode(buf)

console.log(bitmap.data.length)
console.log(bitmap.width)
console.log(bitmap.height)

const quant = new sq.UniformQuant().fromBuffer(bitmap.data, bitmap.width, bitmap.height)
const gifStream = new gif.GIFStream()

gifStream.gen(bitmap.width, bitmap.height)
gifStream.encode()
