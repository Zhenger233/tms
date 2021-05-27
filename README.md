# tms

### ready stuffs

find mu_visual_cpp_build_tools_2015_update_3_x64.iso and install.

```
npm i @vue/cli ffi-napi@2.5.0 ref-napi electron-rebuild
vue add electron-build element-plus
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

### DLL edit and call

```c
__declspec(dllexport) void testpf(short* errOccurred, long* errCode, char* errMsg, short* ans);
```

```javascript
const ffi = require('ffi-napi')
const ref = require('ref-napi')
var testFun = ffi.Library('D:\\hi.dll', {
  testpf: ['void', ['short*', 'long*', 'char*', 'short*']]
})
var shorta = ref.alloc('short')
var longa = ref.alloc('long')
var stringa = Buffer.alloc(1024)
var shortb = ref.alloc('short')
testFun.testpf(shorta, longa, stringa, shortb)
console.log(shorta.deref(), longa.deref(), ref.readCString(stringa, 0), shortb.deref())
testFun = undefined
```

### Miscellaneous

eslint config

components import export

element use

table select

dll edit and call
