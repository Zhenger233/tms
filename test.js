const ffi = require('ffi-napi')
const ref = require('ref-napi')
const dllPath = 'd:\\hi.dll'
const funName = 'testint'
const retType = 'int'
const paramType = ['int']
const dll = ffi.Library(dllPath, { [funName]: [retType, paramType] })
const params = []
var p1 = Buffer.from('TCPIP0::192.168.19.3::INSTR\0')
var p2 = -1
var p3 = ref.alloc('int')
var p4 = ref.alloc('float')
params.push(p2)
try {
  const result = dll[funName](...params)
  console.log(result)
} catch (error) {
  console.log('\n!!!!!!\n', error, '\n!!!!!!')
}

// const dll = ffi.Library('D:\\word\\Tencent Files\\2042712521\\FileRecv\\demodll\\demodll.dll', {
//   PassAmplitude: ['int', ['char*', 'double', 'int*']],
//   GetPTPeak: ['int', ['char*', 'float*']],
//   GetPeriod: ['int', ['char*', 'float*']],
//   test: ['float', ['char*']]
// })
// const str1 = Buffer.from('TCPIP0::192.168.2.3::INSTR')
// const double1 = 0.0
// const int1 = ref.alloc('int')
// const float1 = ref.alloc('float')
// const result = dll.PassAmplitude(str1, double1, int1)
// console.log(result)
// console.log('--------------\n')
// result = dll.GetPTPeak(result, str1, float1)
// console.log(result, ref.readCString(str1), float1.deref())
// console.log('--------------\n')
// result = dll.GetPeriod(result, str1, float1)
// console.log(result, ref.readCString(str1), float1.deref())
