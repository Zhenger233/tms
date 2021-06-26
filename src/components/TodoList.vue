<template>
  <div class="home">
    <el-container style="border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1']" default-active="1-2">
          <el-submenu index="1">
            <template #title><i class="el-icon-setting"></i>DLL RUN</template>
            <el-menu-item-group v-for="(item, index) in insertItemList[0]" :key="index">
              <el-menu-item @click="selectMenu(0, index)" :index="'1-'+index">{{item}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template #title><i class="el-icon-rank"></i>CTRL FLOW</template>
            <el-menu-item-group v-for="(item, index) in insertItemList[1]" :key="index">
              <el-menu-item @click="selectMenu(1, index)" :index="'2-'+index">{{item}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template #title><i class="el-icon-menu"></i>OTHERS</template>
            <el-menu-item-group v-for="(item, index) in insertItemList[2]" :key="index">
              <el-menu-item @click="selectMenu(2, index)" :index="'3-'+index">{{item}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <el-row style="margin-top:20px">
            <el-col :span="4"><el-button type="primary" v-on:click="openFile">Open</el-button></el-col>
            <el-col :span="10"><el-input v-model="words" clearable v-on:keyup.enter="showFun" type="text" @clear="cleanInput"/></el-col>
            <el-col :span="10">
              <el-dropdown split-button>
                <span class="el-dropdown-link">
                  {{funList[funIndex]}}
                </span>
                <template #dropdown>
                  <el-dropdown-menu v-for="(item, index) in funList" :key="index">
                    <el-dropdown-item @click="insertItemRun(item)">{{item}}</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <el-table
            v-show="seqData.length>0"
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
              prop="param.path"
              label="param"
              width="420">
              <template #default="scope">
                <el-select
                  v-model="scope.row.param.paramList"
                  multiple
                  clearable
                  filterable
                  allow-create
                  default-first-option
                  placeholder="return & param"
                  style="width:100%">
                  <el-option
                    v-for="item in varList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name">
                  <el-row type="flex" class="row-bg" v-if="dllTypeIndex>0" justify="space-between">
                    <el-col :span="7"><div >{{ item.name }}</div></el-col>
                    <el-col :span="3"><el-checkbox  v-model="scope.row.param.argObj[item.name]"  @click="clickCheckBox" @change="changeCheckBox(scope.row)">result</el-checkbox></el-col>
                    <el-col :span="10" v-if="dllTypeIndex>1&&scope.row.param.argObj[item.name]">
                      <el-select v-model="scope.row.param.argList[0]" clearable filterable allow-create placeholder="str to compare"><el-option
                      v-for="item in varList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"></el-option></el-select>
                    </el-col>
                  </el-row>
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 20px">
            <el-button @click="toggleSelection(seqData)">Toggle</el-button>
            <el-button @click="deleteItem">Delete</el-button>
            <el-button @click="test">Test</el-button>
            <el-button @click="run">Run</el-button>
            <el-button @click="report">Report</el-button>
          </div>
          <el-table
            v-show="resultList.length>0"
            :data="resultList"
            tooltip-effect="dark"
            style="width: 100%;margin:top: 20px">
            <el-table-column
              prop="name"
              label="name"
              width="180">
            </el-table-column>
            <el-table-column
              prop="type"
              label="type"
              width="180">
            </el-table-column>
            <el-table-column
              prop="result"
              label="result"
              width="180">
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
      <el-container style="border: 1px solid #eee">
        <el-aside>
        <div style="text-align:center;margin-top: 20px;">Variable List</div>
        <el-table
          :data="varList"
          style="width: 100%">
          <el-table-column
            label="name"
            width="100"
            align="center">
            <template #default="scope">
            <el-input v-model="scope.row.name" type='text' v-on:keyup.enter="addVar"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="type"
            width="100"
            align="center">
            <template #default="scope">
            <el-input v-model="scope.row.type" type='text' @input="valChange(scope.row)" v-on:keyup.enter="addVar"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="value"
            label="value"
            width="360">
            <template #default="scope">
            <el-input v-model="scope.row.valstr" type='text' @input="valChange(scope.row)" v-on:keyup.enter="addVar"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <el-button @click="addVar">Add</el-button>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// import TodoListItem from '@/components/TodoListItem.vue'
import { ElMessage } from 'element-plus'
const require = window.require
const { resolve } = require('path')
const { dialog } = require('electron').remote
const ffi = require('ffi-napi')
const ref = require('ref-napi')
const ArrayType = require('ref-array-napi')
const IntArray = ArrayType('int')
const LongArray = ArrayType('long')
const ShortArray = ArrayType('short')
const FloatArray = ArrayType('float')
const DoubleArray = ArrayType('double')
const { ipcRenderer } = require('electron')
const execSync = window.require('child_process').execSync

export default {
  name: 'TodoList',
  data () {
    return {
      words: 'd:/hi.dll',
      funParam: '',
      insertItemList: [
        ['Direct Call', 'Pass & Fail', 'String Value', 'Numeric Limit', 'M-num Limit'],
        ['If', 'If-OK', 'Else-if', 'Else', 'For-init', 'For-condition', 'For-increment', 'For-main', 'Break', 'Goto'],
        ['Message Pop', 'Label assignment']
      ],
      dllTypeIndex: 2,
      funList: ['tests'],
      funIndex: 0,
      seqData: [],
      multipleSelection: [],
      varList: [
        { name: 'var0', type: 'short*', value: ref.alloc('short'), valstr: '1' },
        { name: 'var1', type: 'char*', value: Buffer.from('TCPIP0::192.168.19.3::INSTR\0'), valstr: 'TCPIP0::192.168.19.3::INSTR' },
        { name: 'var2', type: 'long*', value: ref.alloc('long'), valstr: '5' },
        { name: 'var3', type: 'char*', value: Buffer.from('\0'.repeat(64)), valstr: '' },
        { name: 'var4', type: 'char*', value: Buffer.from('result string.' + '\0'.repeat(64)), valstr: 'result string.' }
      ],
      resultList: [],
      optionList: true
    }
  },
  methods: {
    changeCheckBox (row) {
      console.log(row)
    },
    clickCheckBox (e) {
      e.stopPropagation()
    },
    report () {
      console.log(this)
    },
    showVal (val) {
      return val
    },
    validArray (str) {
      const tempstr = str.replace(/，/g, ',').replace(/^[|]$/g, '')
      const temparray = JSON.parse(`[${tempstr}]`)
      if (Array.isArray(temparray)) {
        return temparray
      }
      return false
    },
    valChange (row) {
      switch (row.type) {
        case 'short': {
          console.log('short')
          if (!isNaN(Number(row.valstr))) {
            console.log('changing...')
            row.value = Number(row.valstr) & 0xffff
          } else {
            console.log('error short')
          }
          break
        }
        case 'long':
        case 'int': {
          console.log('int')
          if (!isNaN(Number(row.valstr))) {
            console.log('changing...')
            row.value = Number(row.valstr) & 0xffffffff
          } else {
            console.log('error int')
          }
          break
        }
        case 'long long': {
          console.log('long long')
          if (!isNaN(Number(row.valstr))) {
            console.log('changing...')
            row.value = Number(row.valstr) & 0xffffffffffffffff
          } else {
            console.log('error long long')
          }
          break
        }
        case 'float':
        case 'double': {
          console.log('double')
          if (!isNaN(Number(row.valstr))) {
            console.log('changing')
            row.value = Number(row.valstr)
          } else {
            console.log('error double')
          }
          break
        }
        case 'char*':
        case 'string': {
          console.log('string')
          row.value = Buffer.from(row.valstr + '\0'.repeat(256))
          break
        }
        case 'short*': {
          console.log('short*')
          if (!isNaN(Number(row.valstr))) {
            console.log('changing...', row.valstr)
            row.value = ref.alloc('short')
            row.value.writeInt16LE(Number(row.valstr) & 0xffff)
          } else {
            console.log('error short*')
          }
          break
        }
        case 'long*':
        case 'int*': {
          console.log('int*')
          if (!isNaN(Number(row.valstr))) {
            console.log('changing...', row.valstr)
            row.value = ref.alloc('int')
            row.value.writeInt32LE(Number(row.valstr) & 0xffffffff)
          } else {
            console.log('error int*')
          }
          break
        }
        case 'long long*': {
          console.log('long*')
          if (!isNaN(Number(row.valstr))) {
            console.log('changing')
            row.value = ref.alloc('long long')
            row.value.writeInt64LE(Number(row.valstr) & 0xffffffffffffffff)
          } else {
            console.log('error long long*')
          }
          break
        }
        case 'float*': {
          console.log('float*')
          if (!isNaN(Number(row.valstr))) {
            console.log('changing')
            row.value = ref.alloc('float')
            row.value.writeFloatLE(Number(row.valstr))
          } else {
            console.log('error float*')
          }
          break
        }
        case 'double*': {
          console.log('float*')
          if (!isNaN(Number(row.valstr))) {
            console.log('changing')
            row.value = ref.alloc('double')
            row.value.writeDoubleLE(Number(row.valstr))
          } else {
            console.log('error double*')
          }
          break
        }
        case 'int[]': {
          console.log('int[]')
          const valstr2array = this.validArray(row.valstr)
          if (valstr2array) {
            row.value = new IntArray(valstr2array)
          } else {
            console.log('error int[]')
          }
          break
        }
        case 'long[]': {
          console.log('long[]')
          const valstr2array = this.validArray(row.valstr)
          if (valstr2array) {
            console.log(valstr2array)
            row.value = new LongArray(valstr2array)
            console.log(typeof (row.value), row.value)
          } else {
            console.log('error long[]')
          }
          break
        }
        case 'short[]': {
          console.log('short[]')
          const valstr2array = this.validArray(row.valstr)
          if (valstr2array) {
            row.value = new ShortArray(valstr2array)
          } else {
            console.log('error short[]')
          }
          break
        }
        case 'float[]': {
          console.log('float[]')
          const valstr2array = this.validArray(row.valstr)
          if (valstr2array) {
            row.value = new FloatArray(valstr2array)
          } else {
            console.log('error float[]')
          }
          break
        }
        case 'double[]': {
          console.log('double[]')
          const valstr2array = this.validArray(row.valstr)
          if (valstr2array) {
            row.value = new DoubleArray(valstr2array)
          } else {
            console.log('error double[]')
          }
          break
        }
      }
    },
    addVar () {
      this.varList.push({
        name: 'var' + this.varList.length,
        type: 'int',
        value: 0,
        valstr: '0'
      })
    },
    selectMenu (group, index) {
      console.log('click:\t', group, index)
      // select insert dll type index
      if (group === 0) {
        this.dllTypeIndex = index
      }
    },
    type2realType (type) {
      switch (type) {
        case 'int[]': return IntArray
        case 'long[]': return LongArray
        case 'short[]': return ShortArray
        case 'float[]': return FloatArray
        case 'double[]': return DoubleArray
        default: return type
      }
    },
    run () {
      this.resultList = []
      for (const item of this.multipleSelection) {
        console.log(item)
        console.log(item.param)
        const funName = item.param.func
        let retType = 'void'
        if (item.param.paramList[0] !== 'void') {
          retType = this.varList.find(i => i.name === item.param.paramList[0]).type
        }
        const paramType = item.param.paramList.slice(1).map(i => this.type2realType(this.varList.find(j => j.name === i).type))
        console.log('run:\t', funName, retType, paramType)
        const dll = ffi.Library(item.param.path, { [funName]: [retType, paramType] })
        const params = item.param.paramList.slice(1).map(i => this.varList.find(j => j.name === i).value)
        console.log(params)
        const dllResult = dll[funName](...params)
        if (item.param.paramList[0] !== 'void') {
          const p0 = this.varList.find(i => i.name === item.param.paramList[0])
          if (p0.type === 'int' || p0.type === 'long' || p0.type === 'short' || p0.type === 'long long') {
            p0.valstr = String(dllResult)
            p0.value = Number(dllResult)
          } else if (p0.type === 'string' || p0.type === 'char*') {
            p0.value = p0.valstr = String(dllResult)
          }
        }
        console.log(dllResult)
        for (const it of this.varList) {
          if (it.type === 'int*' || it.type === 'short*' || it.type === 'long*' || it.type === 'long long*' || it.type === 'float*' || it.type === 'double*') {
            it.valstr = String(it.value.deref())
          } else if (it.type === 'char*' || it.type === 'string') {
            it.valstr = ref.readCString(it.value, 0)
          } else if (it.type === 'int[]' || it.type === 'short[]' || it.type === 'long[]' || it.type === 'long long[]' || it.type === 'float[]' || it.type === 'double[]') {
            it.valstr = JSON.stringify(it.value)
          }
        }
        if (item.type === 'Direct Call') {
          try {
            item.result = 1
          } catch (error) {
            console.log(error)
          }
        } else if (item.type === 'Pass & Fail') {
          try {
            const ao = item.param.argObj
            console.log(ao)
            for (const i in ao) {
              console.log(i, ao[i])
              if (ao[i]) {
                const varResult = this.varList.find(j => j.name === i)
                item.result = Number(this.val2result(varResult.type, varResult.value))
                break
              }
            }
          } catch (error) {
            console.log(error)
          }
        } else if (item.type === 'String Value') {
          try {
            const ao = item.param.argObj
            console.log(ao)
            for (const i in ao) {
              console.log(i, ao[i])
              if (ao[i]) {
                item.result = Number(ref.readCString(this.varList.find(j => j.name === i).value, 0) === ref.readCString(this.varList.find(j => j.name === item.param.argList[0]).value, 0))
                break
              }
            }
          } catch (error) {
            console.log(error)
          }
        }
        this.resultList.push(item)
      }
    },
    val2result (type, val) {
      console.log(type, val)
      switch (type) {
        case 'int':
        case 'short':
        case 'long':
        case 'long long':
        case 'float':
        case 'double':
          return val !== 0
        case 'int*':
        case 'short*':
        case 'long*':
        case 'long long*':
        case 'float*':
        case 'double*':
          return val.deref() !== 0
        case 'string':
        case 'char*':
          return ref.readCString(val) !== ''
        default:
          return false
      }
    },
    test () {
      console.log(this.$data)
      try {
        console.log(this.varList)
        ElMessage({
          showClose: true,
          message: 'test',
          type: 'success'
        })
        // const cmdStr = 'node D:\\project\\vscjs\\ts\\test\\test\\tms\\test.js'
        // const ans = execSync(cmdStr).toString()
        // console.log(ans)
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
        this.words = result.filePaths[0].replace('\\', '/')
        this.showFun()
      }).catch(err => {
        console.log('open file err:', err)
      })
    },
    cleanInput () {
      console.log('clean input')
      this.words = ''
      this.funList = []
    },
    showFun () {
      const w = this.words.replace('\\', '/')
      console.log('insert:\t', w)
      const output = execSync('d:\\pefile.exe exports "' + w + '"')
      const ans = output.toString()
      const tempList = JSON.parse(ans)
      console.log('funlist:\t', tempList)
      this.funList = []
      for (const p of tempList) {
        this.funList.push(p[1])
      }
      console.log('insert ', this.funList.length, ' functions')
    },
    insertItemRun (functionName) {
      const functionType = this.insertItemList[0][this.dllTypeIndex]
      this.seqData.push({
        id: this.words + functionName + functionType + new Date().getTime(),
        name: functionName + this.seqData.length,
        type: functionType,
        result: -1,
        param: {
          path: this.words,
          func: functionName,
          paramList: ['void'],
          argList: [],
          argObj: {}
        }
      })
    },
    deleteItem () {
      const idList = this.multipleSelection.map((i) => i.id)
      idList.forEach((id) => {
        console.log(id)
        this.seqData = this.seqData.filter((item) => item.id !== id)
      })
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
