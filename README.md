# tms

### ready stuffs

find mu_visual_cpp_build_tools_2015_update_3_x64.iso and install.

```
npm install -g @vue/cli-init
vue init simulatedgreg/electron-vue tms
npm i @vue/cli ffi-napi@2.5.0 ref-napi electron-rebuild ref-array-napi ref-struct-napi
vue add electron-builder element-plus
```

```shell
npm i
.\node_modules\.bin\electron-rebuild.cmd
```

### Compiles and hot-reloads for development

```
vue-cli-service electron:serve
```

### Compiles and minifies for production

```
vue-cli-service electron:build
```

### Configuration

```javascript
//background.js
app.allowRendererProcessReuse = false
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true
webSecurity: false,
nodeIntegration: true,
enableRemoteModule: true,
contextIsolation: false
```

### DLL format, generate and call

```c
__declspec(dllexport) void testmnl(short* errOccurred, long* errCode, char* errMsg, int* n, long* array);
```

```bash
g++ C:\Users\Zhenger\Desktop\ts\try\add.cpp -shared -fPIC -o d:\hi.dll
```

```javascript
const ffi = require('ffi-napi')
const ref = require('ref-napi')
const ArrayType = require('ref-array-napi')
var LongArray = ArrayType('long')
var testFun = ffi.Library('D:\\hi.dll', {
  testmnl: ['void', ['short*', 'long*', 'char*', 'int*', LongArray]]
})
var shorta = ref.alloc('short')
var longa = ref.alloc('long')
var stringa = Buffer.alloc(1024)
var inta = ref.alloc('int')
var longarraya = new LongArray(5)
testFun.testmnl(shorta, longa, stringa, inta, longarraya)
console.log(shorta.deref(), longa.deref(), ref.readCString(stringa, 0), inta.deref(), longarraya)
testFun = undefined
```

### Miscellaneous

eslint config

components import export

element use

table select

dll edit and call

### Todo

循环

~~导出序列文件时保存变量~~

~~变量类型下拉框~~

~~变量列表无限拉长~~

序列复制粘贴

~~32位~~

程序使用指引

图标
