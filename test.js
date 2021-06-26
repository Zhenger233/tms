const ffi = require('ffi-napi')
const ref = require('ref-napi')
const dllPath = 'd:\\hi.dll'
const funName = 'tests'
const retType = 'void'
const paramType = ['short*', 'long*', 'char*', 'char*']
const dll = ffi.Library(dllPath, { [funName]: [retType, paramType] })
const params = []
const p1 = ref.alloc('short')
const p2 = ref.alloc('long')
const p3 = Buffer.from('123' + '\0'.repeat(64))
const p4 = Buffer.from('123' + '\0'.repeat(64))
params.push(p1, p2, p3, p4)

const result = dll[funName](...params)
console.log(result, p1.deref(), p2.deref(), ref.readCString(p3), ref.readCString(p4))

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
