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


const gifStream = gif.GIFStream.encode('result.gif', bitmap.data, bitmap.width, bitmap.height, {method: 'uniform'})
