<template>
  <div class="home">
    <el-container style="border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1']">
          <el-submenu index="1">
            <template #title><i class="el-icon-setting"></i>DLL RUN</template>
            <el-menu-item-group v-for="(item, index) in insertItemList[0]" :key="index">
              <el-menu-item @click="insertTest(0, index)">{{item}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template #title><i class="el-icon-rank"></i>CONTROL FLOW</template>
            <el-menu-item-group v-for="(item, index) in insertItemList[1]" :key="index">
              <el-menu-item @click="insertTest(1, index)">{{item}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template #title><i class="el-icon-menu"></i>OTHERS</template>
            <el-menu-item-group v-for="(item, index) in insertItemList[2]" :key="index">
              <el-menu-item @click="insertTest(2, index)">{{item}}</el-menu-item>
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
          </div>
        </el-main>
      </el-container>
      <el-container style="border: 1px solid #eee">
        <el-aside>
        <div style="text-align:center;margin-top: 20px;">Variable List</div>
        <el-table
          :data="varList"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="name"
            width="100">
            <template #default="scope">
            <el-input v-model="scope.row.name" type='text'></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="type"
            width="100">
            <template #default="scope">
            <el-input v-model="scope.row.type" type='text' @input="valChange(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="value"
            label="value">
            <template #default="scope">
            <el-input v-model="scope.row.valstr" type='text' @input="valChange(scope.row)"></el-input>
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
var LongArray = ArrayType('long')
var DoubleArray = ArrayType('double')
const { ipcRenderer } = require('electron')
const exec = require('child_process').exec
const execSync = window.require('child_process').execSync

export default {
  name: 'TodoList',
  data () {
    return {
      words: 'd:\\hi.dll',
      funParam: '',
      insertItemList: [
        ['Direct Call', 'Pass & Fail', 'String Value', 'Numeric Limit', 'M-num Limit'],
        ['If', 'If-OK', 'Else-if', 'Else', 'For-init', 'For-condition', 'For-increment', 'For-main', 'Break', 'Goto'],
        ['Message Pop', 'Label assignment']
      ],
      typeIndex: 0,
      funList: ['Select'],
      funIndex: 0,
      seqData: [],
      multipleSelection: [],
      varList: [
        { name: 'var0', type: 'int', value: 1, valstr: '1' },
        { name: 'var1', type: 'int', value: 2, valstr: '2' }
      ],
      varTypeOptions: [
        { value: 'int', label: 'int' },
        { value: 'float', label: 'float' },
        { value: 'string', label: 'string' },
        { value: 'int*', label: 'int*' },
        { value: 'float*', label: 'float*' }
      ]
    }
  },
  methods: {
    valChange (row) {
      console.log(row)
      switch (row.type) {
        case 'int': {
          console.log('int')
          if (Number(row.valstr)) {
            console.log('changing...')
            row.value = Number(row.valstr) & 0x7fffffff
          } else {
            console.log('error int')
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
    insertTest (group, index) {
      console.log('click:\t', group, index)
      if (group === 0) {
        this.typeIndex = index
      }
    },
    run () {
      for (const item of this.multipleSelection) {
        console.log(item)
        if (item.type === 'Direct Call') {
          console.log(item.param)
          const funName = item.param.func
          let retType = 'void'
          if (item.param.paramList[0] === 'void') {
            retType = 'void'
          } else {
            retType = this.varList.find(i => i.name === item.param.paramList[0]).type
          }
          const paramType = item.param.paramList.slice(1).map(i => this.varList.find(j => j.name === i).type)
          const params = item.param.paramList.slice(1).map(i => this.varList.find(j => j.name === i).value)
          const dll = ffi.Library(item.param.path, { [funName]: [retType, paramType] })
          const dllResult = dll[funName](...params)
          console.log(dllResult)
        }
      }
    },
    test () {
      console.log('testing...', __dirname, resolve('./'), process.cwd())
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
      console.log('clean input')
      this.words = ''
      this.funList = []
    },
    showFun () {
      const w = this.words
      console.log('insert:\t', w)
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
    insertItemRun (functionName) {
      const functionType = this.insertItemList[0][this.typeIndex]
      this.seqData.push({
        id: this.words + functionName + functionType + new Date().getTime(),
        name: functionType + this.seqData.length,
        type: functionType,
        result: -1,
        param: {
          path: this.words,
          func: functionName,
          paramList: ['void'],
          argList: []
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
