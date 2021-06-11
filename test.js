const ffi = require('ffi-napi')
const ref = require('ref-napi')
const dll = ffi.Library('D:\\word\\Tencent Files\\2042712521\\FileRecv\\demodll\\demodll.dll', {
  PassAmplitude: ['int', ['char*', 'double', 'int*']],
  GetPTPeak: ['int', ['char*', 'float*']],
  GetPeriod: ['int', ['char*', 'float*']]
})
const str1 = Buffer.from('TCPIP0::192.168.4.3::INSTR')
const double1 = 0.0
const int1 = ref.alloc('int')
const float1 = ref.alloc('float')
let result = dll.PassAmplitude(str1, double1, int1)
console.log(result, ref.readCString(str1), double1, int1.deref())
console.log('--------------\n')
result = dll.GetPTPeak(result, str1, float1)
console.log(result, ref.readCString(str1), float1.deref())
console.log('--------------\n')
result = dll.GetPeriod(result, str1, float1)
console.log(result, ref.readCString(str1), float1.deref())
