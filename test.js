const jpeg = require('jpeg-js')
const fs = require('fs')
const sq = require('./src/quantization/UniformQuant')
const gif = require('./src/GIFStream')
const file = process.argv[2]
const buf = fs.readFileSync(file)

const bitmap = jpeg.decode(buf)

console.log(bitmap.data.length)
console.log(bitmap.width)
console.log(bitmap.height)

let startAt = Date.now()
gif.GIFStream.encode('result.gif', bitmap.data, bitmap.width, bitmap.height, {method: 'uniform'})
console.log(`Structed GIF Encoder has taken ${Date.now() - startAt} ms`)

// gif-encoder lib
const GifEncoder = require('gif-encoder')
const image = jpeg.decode(buf, true)

startAt = Date.now()
const gifEncoder = new GifEncoder(image.width, image.height)
const gifFile = fs.createWriteStream('gif-encoder.gif')
gifEncoder.pipe(gifFile)
gifEncoder.writeHeader()
gifEncoder.addFrame(image.data)
gifEncoder.finish()
console.log(`gif-encoder has taken ${Date.now() - startAt} ms`)
