const ffi = require('ffi-napi')
const ref = require('ref-napi')
const dll = ffi.Library('add.dll', {
  add: [ref.types.int, [ref.types.int]],
  hi: [ref.types.void, []]
})
const result = dll.hi()
const res = dll.add(3)
console.log(res)
