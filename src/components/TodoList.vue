<template>
  <div class="home">
    <el-container style="border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1']">
          <el-submenu index="1">
            <template #title><i class="el-icon-setting"></i>DLL RUN</template>
            <el-menu-item-group>
              <el-menu-item index="1-1">Direct Call</el-menu-item>
              <el-menu-item index="1-2">Pass & Fail</el-menu-item>
              <el-menu-item index="1-3">Numeric Limit</el-menu-item>
              <el-menu-item index="1-4">M-num Limit</el-menu-item>
              <el-menu-item index="1-5">String Value</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template #title><i class="el-icon-rank"></i>CONTROL FLOW</template>
            <el-menu-item-group>
              <el-menu-item index="2-1">If</el-menu-item>
              <el-menu-item index="2-2">If-OK</el-menu-item>
              <el-menu-item index="2-3">Else-if</el-menu-item>
              <el-menu-item index="2-4">Else</el-menu-item>
              <el-menu-item index="2-5">For-init</el-menu-item>
              <el-menu-item index="2-6">For-condition</el-menu-item>
              <el-menu-item index="2-7">For-increment</el-menu-item>
              <el-menu-item index="2-8">For-main</el-menu-item>
              <el-menu-item index="2-9">Break</el-menu-item>
              <el-menu-item index="2-10">Goto</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template #title><i class="el-icon-menu"></i>OTHERS</template>
            <el-menu-item-group>
              <el-menu-item index="3-1">Message Pop</el-menu-item>
              <el-menu-item index="3-2">Label Assignment</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <el-row style="margin-top:20px">
            <el-col :span="3"><el-button type="primary" v-on:click="openFile">Open</el-button></el-col>
            <el-col :span="7"><el-input v-model="words" v-on:keyup.enter="showFun" type="text" /></el-col>
            <el-col :span="3"><el-button v-on:click="cleanInput">Clean</el-button></el-col>
            <el-col :span="4">
              <el-dropdown split-button>
                <span class="el-dropdown-link">
                  {{typeList[typeIndex]}}
                </span>
                <template #dropdown>
                  <el-dropdown-menu v-for="(item, index) in typeList" :key="index">
                    <el-dropdown-item @click="changeType(index)">{{item}}</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-col>
            <el-col :span="7">
              <el-dropdown split-button>
                <span class="el-dropdown-link">
                  {{funList[funIndex]}}
                </span>
                <template #dropdown>
                  <el-dropdown-menu v-for="(item, index) in funList" :key="index">
                    <el-dropdown-item @click="insertItem(item)">{{item}}</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <el-table
            ref="multipleTable"
            :data="seqData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="name"
              label="name"
              width="120">
            </el-table-column>
            <el-table-column
              prop="type"
              label="type"
              width="120">
            </el-table-column>
            <el-table-column
              prop="err.errCode"
              label="error"
              width="120">
            </el-table-column>
            <el-table-column
              prop="param.path"
              label="param"
              width="120">
              <template #default="scope">
                <el-input v-model="scope.row.param.paramStr" type="text" />
              </template>
            </el-table-column>
            <el-table-column
              prop="result"
              label="result"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>

          <div style="margin-top: 20px">
            <el-button @click="toggleSelection(seqData)">Toggle</el-button>
            <el-button @click="deleteItem">Delete</el-button>
            <el-button @click="test">Test</el-button>
            <el-button @click="run">Run</el-button>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// import TodoListItem from '@/components/TodoListItem.vue'
const require = window.require
const { dialog } = require('electron').remote
const ffi = require('ffi-napi')
const ref = require('ref-napi')
const ArrayType = require('ref-array-napi')
var LongArray = ArrayType('long')
var DoubleArray = ArrayType('double')
const { ipcRenderer } = require('electron')
// const execSync = require('child_process').execSync
export default {
  name: 'TodoList',
  data () {
    return {
      words: 'd:\\hi.dll',
      funParam: '',
      typeList: [
        'Call',
        'Pass-Fail',
        'Str-Value',
        'Num-Lim-L',
        'Num-Lim-D',
        'M-Num-Lim-L',
        'M-Num-Lim-D'
      ],
      typeIndex: 0,
      funList: ['Select'],
      funIndex: 0,
      seqData: [],
      multipleSelection: []
    }
  },
  methods: {
    run () {
      for (const item of this.multipleSelection) {
        console.log(item)
        // item: type, path, func, param, result, err
        // switch (item.type) {
        //   case 'Call': {
        //     const f = ffi.Library(item.path, {
        //       [item.func]: ['void', ['short*', 'int*', 'char*']]
        //     })
        //     const shorta = ref.alloc('short')
        //     const inta = ref.alloc('int')
        //     const stringa = Buffer.alloc(1024)
        //     f[item.func](shorta, inta, stringa)
        //     item.result = [shorta.deref(), inta.deref(), ref.readCString(stringa)]
        //     break
        //   }
        //   case 'Pass-Fail': {
        //     const f = ffi.Library(item.path, {
        //       [item.func]: ['void', ['short*', 'int*', 'char*', 'short*']]
        //     })
        //     const shorta = ref.alloc('short')
        //     const inta = ref.alloc('int')
        //     const stringa = Buffer.alloc(1024)
        //     const shortb = ref.alloc('short')
        //     f[item.func](shorta, inta, stringa, shortb)
        //     item.result = [shorta.deref(), inta.deref(), ref.readCString(stringa), shortb.deref()]
        //     break
        //   }
        //   case 'Str-Value': {
        //     const f = ffi.Library(item.path, {
        //       [item.func]: ['void', ['short*', 'int*', 'char*', 'char*']]
        //     })
        //     const shorta = ref.alloc('short')
        //     const inta = ref.alloc('int')
        //     const stringa = Buffer.alloc(1024)
        //     const stringb = Buffer.alloc(1024)
        //     f[item.func](shorta, inta, stringa, stringb)
        //     item.result = [shorta.deref(), inta.deref(), ref.readCString(stringa), ref.readCString(stringb)]
        //     break
        //   }
        //   case 'Num-Lim-L': {
        //     const f = ffi.Library(item.path, {
        //       [item.func]: ['void', ['short*', 'int*', 'char*', 'long*']]
        //     })
        //     const shorta = ref.alloc('short')
        //     const inta = ref.alloc('int')
        //     const stringa = Buffer.alloc(1024)
        //     const longa = ref.alloc('long')
        //     f[item.func](shorta, inta, stringa, longa)
        //     item.result = [shorta.deref(), inta.deref(), ref.readCString(stringa), longa.deref()]
        //     break
        //   }
        //   case 'Num-Lim-D': {
        //     const f = ffi.Library(item.path, {
        //       [item.func]: ['void', ['short*', 'int*', 'char*', 'double*']]
        //     })
        //     const shorta = ref.alloc('short')
        //     const inta = ref.alloc('int')
        //     const stringa = Buffer.alloc(1024)
        //     const doublea = ref.alloc('double')
        //     f[item.func](shorta, inta, stringa, doublea)
        //     item.result = [shorta.deref(), inta.deref(), ref.readCString(stringa), doublea.deref()]
        //     break
        //   }
        //   case 'M-Num-Lim-L': {
        //     const f = ffi.Library(item.path, {
        //       [item.func]: ['void', ['short*', 'int*', 'char*', 'int*', LongArray]]
        //     })
        //     const shorta = ref.alloc('short')
        //     const inta = ref.alloc('int')
        //     const stringa = Buffer.alloc(1024)
        //     const intb = ref.alloc('int')
        //     const longarraya = new LongArray(10)
        //     f[item.func](shorta, inta, stringa, intb, longarraya)
        //     item.result = [shorta.deref(), inta.deref(), ref.readCString(stringa), intb.deref(), longarraya.toArray().slice(0, intb.deref())]
        //     break
        //   }
        //   case 'M-Num-Lim-D': {
        //     const f = ffi.Library(item.path, {
        //       [item.func]: ['void', ['short*', 'int*', 'char*', 'int*', DoubleArray]]
        //     })
        //     const shorta = ref.alloc('short')
        //     const inta = ref.alloc('int')
        //     const stringa = Buffer.alloc(1024)
        //     const intb = ref.alloc('int')
        //     const doublearraya = new DoubleArray(10)
        //     f[item.func](shorta, inta, stringa, intb, doublearraya)
        //     item.result = [shorta.deref(), inta.deref(), ref.readCString(stringa), intb.deref(), doublearraya.toArray().slice(0, intb.deref())]
        //     break
        //   }
        //   default:
        //     break
        // }
      }
    },
    test () {
      console.log('testing...')
      try {
        // const ans = ffi.Library('D:\\project\\vscjs\\ts\\test\\test\\tms\\add.dll', { hi: [ref.types.void, []], add: ['int', ['int']] }).add(3)
        // console.log(ans)
        // var testFun = ffi.Library('D:\\hi.dll', {
        //   hi: ['void', []],
        //   add: ['int', ['int']],
        //   str: ['string', []],
        //   strc: ['void', ['char*']],
        //   tests: ['void', ['short*']],
        //   testpf: ['void', ['short*', 'long*', 'string', 'short*']],
        //   testmnl: ['void', ['short*', 'long*', 'char*', 'int*', LongArray]]
        // })
        // var shorta = ref.alloc('short')
        // var longa = ref.alloc('long')
        // var stringa = Buffer.alloc(1024)
        // var inta = ref.alloc('int')
        // var longarraya = new LongArray(5)
        // testFun.testmnl(shorta, longa, stringa, inta, longarraya)
        // console.log(shorta.deref(), longa.deref(), ref.readCString(stringa, 0), inta.deref(), longarraya)
        // testFun = undefined
      } catch (err) {
        console.log('testerr:\n', err)
      }
    },
    toggleSelection (rows) {
      console.log('toggle', rows.length)
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    changeType (index) {
      this.typeIndex = index
    },
    handleSelectionChange (val) {
      console.log('select change:', val.length)
      this.multipleSelection = val
    },
    openFile () {
      dialog.showOpenDialog({
        properties: ['openFile']
      }).then(result => {
        // console.log(result.canceled)
        console.log('open:\t', result.filePaths)
        this.words = result.filePaths
        this.showFun()
      }).catch(err => {
        console.log('open file err:', err)
      })
    },
    cleanInput () {
      this.words = ''
      this.funList = []
    },
    showFun () {
      const w = this.words
      console.log('insert:\t', w)
      const execSync = window.require('child_process').execSync
      const output = execSync('d:\\pefile.exe exports ' + w)
      const ans = output.toString()
      const tempList = JSON.parse(ans)
      console.log('funlist:\t', tempList)
      this.funList = []
      for (const p of tempList) {
        this.funList.push(p[1])
      }
      console.log('insert ', this.funList.length)
    },
    insertItem (item) {
      const itemType = this.typeList[this.typeIndex]
      const type2param = {
        Call: [{}, {}],
        'Pass-Fail': [{ result: ref.alloc('short*') }, {}],
        'Str-Value': [{ result: Buffer.alloc(1024) }, { param: '' }],
        'Num-Lim-L': [{ result: ref.alloc('long*') }, { param: {} }],
        'Num-Lim-D': [{ result: ref.alloc('double*') }, { param: {} }],
        'M-Num-Lim-L': [{ resultN: ref.alloc('int*'), result: ref.alloc('long*') }, { param: [] }],
        'M-Num-Lim-D': [{ resultN: ref.alloc('int*'), result: ref.alloc('double*') }, { param: [] }]
      }
      this.seqData.push({
        id: this.words + item + itemType + new Date().getTime(),
        name: itemType + this.seqData.length,
        type: itemType,
        err: {
          errOccurred: 0,
          errCode: 0,
          errMsg: ''
        },
        result: -1,
        param: {
          path: this.words,
          func: item,
          paramI: {
            errOccurred: ref.alloc('short*'),
            errCode: ref.alloc('int*'),
            errMsg: Buffer.alloc(1024),
            ...type2param[itemType][0]
          },
          paramO: {
            ...type2param[itemType][1]
          },
          paramStr: ''
        }
      })
    },
    deleteItem () {
      const idList = this.multipleSelection.map((i) => i.id)
      idList.forEach((id) => {
        console.log(id)
        this.seqData = this.seqData.filter((item) => item.id !== id)
      })
    },
    runItem (item) {
      console.log('I\'m here:\t', item)
      const funName = item[1]
      console.log('require ok')
      const dllstr = item[0]
      switch (funName) {
        case 'hi':
          console.log('answer:\t', window.require('child_process').execSync('d:\\rundll32.exe ' + 'd:\\add.dll hi').toString())
          break
        default:
          console.log('console.log(ffi.Library(\'' + dllstr + '\', { ' + funName + ': [ref.types.void, [ref.types.int]] }).' + funName + '(1))')
          eval('console.log(ffi.Library(dllstr, { ' + funName + ': [ref.types.int, [ref.types.int]] }).' + funName + '(1))')
          break
      }
      // const dll = ffi.Library(dllstr, { [funName]: [ref.types.void, []] })
      // eval('dll.' + funName + '()')
      // eval('alert(ffi.Library(dllstr,  { add: [ref.types.int, [ref.types.int]] }).add(5))')
      // const paramsobj = { [f1]: [ref.types.void, []] }
      // console.log('run:\t', dllstr, paramsobj)
      // const dll = ffi.Library(dllstr, paramsobj)
      // console.log('dll length:\t', dll.length)
      // const tempstr = 'dll.' + f1 + '()'
      // console.log('eval str:\t', tempstr)
      // window.eval('dll.' + f1 + '()')

      // const execSync = window.require('child_process').execSync
      // const output = execSync('d:\\rundll32.exe ' + this.list[index] + ' 1')
      // const ans = output.toString()
      // console.log('answer:\t', ans)
    }
  }
}
ipcRenderer.on('menu', (event, arg) => {
  console.log('menu click:', arg)
  switch (arg) {
    case 'SequenceDll':
      // todo
      break
    case 'SequenceFlow':
      // todo
      break
    case 'SequenceOther':
      // todo
      break
    case 'SequenceCombination':
      // todo
      break
    case 'RunStep':
      // todo
      break
    case 'RunSelected':
      // todo
      break
    case 'RunAll':
      // todo
      break
    case 'About':
      // todo
      break
    default:
      console.log('command error!')
      break
  }
})
</script>
