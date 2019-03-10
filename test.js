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
const gifStream = gif.GIFStream.encode('result.gif', bitmap.data, bitmap.width, bitmap.height, {method: 'uniform'})
console.log(Date.now() - startAt)

startAt = Date.now()
let word = ""
let num = 1000
const a= ['1', 's', 'f', '3']
const b= []

// for(let i=0; i<10000000; i++){
//  word = a.map(v => `#${v}`).join("")
//  while(num){
//     b.push(num%2)
//     num = num >> 1   
//  }
// }
//  console.log(Date.now() - startAt)