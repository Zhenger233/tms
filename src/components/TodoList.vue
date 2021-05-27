<template>
  <div class="home">
    <el-row>
      <el-col :span="2"><el-button type="primary" v-on:click="openFile">Open</el-button></el-col>
      <el-col :span="10"><el-input v-model="words" v-on:keyup.enter="showFun" type="text" /></el-col>
      <el-col :span="2"><el-button v-on:click="cleanInput">Clean</el-button></el-col>
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
      <el-col :span="6">
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
        prop="path"
        label="path"
        width="120">
      </el-table-column>
      <el-table-column
        prop="func"
        label="func"
        width="120">
      </el-table-column>
      <el-table-column
        prop="type"
        label="type"
        width="120">
      </el-table-column>
      <el-table-column
        label="result"
        show-overflow-tooltip>
      </el-table-column>
    </el-table>

    <div style="margin-top: 20px">
      <el-button @click="toggleSelection(seqData)">Toggle</el-button>
      <el-button @click="deleteItem">Delete</el-button>
      <el-button @click="test">Test</el-button>
    </div>
<!--
    <li v-for="(item, index) in list" v-bind:key="index">
      <TodoListItem
        v-bind:item="item[0] + ' ' + item[1]"
        v-bind:index="index"
        v-on:deleteItem="deleteItem(index)"
        v-on:runItem="runItem(item)"
        v-on:modifyItem="modifyItem"
      />
    </li> -->
  </div>
</template>

<script>
// import TodoListItem from '@/components/TodoListItem.vue'
const { dialog } = window.require('electron').remote

export default {
  name: 'TodoList',
  // components: {
  //   TodoListItem
  // },
  data () {
    return {
      words: 'd:\\add.dll',
      typeList: [
        'Call',
        'Pass-Fail',
        'Str-Value',
        'Num-Limit',
        'M-Num-Limit'
      ],
      typeIndex: 0,
      list: [],
      funList: ['Select Function'],
      funIndex: 0,
      seqData: [],
      multipleSelection: []
    }
  },
  methods: {
    test () {
      const require = window.require
      const ffi = require('ffi-napi')
      const ref = require('ref-napi')
      const ArrayType = require('ref-array-napi')
      var LongArray = ArrayType('long')
      console.log('testing...')
      try {
        const ans = ffi.Library('D:\\project\\vscjs\\ts\\test\\test\\tms\\add.dll', { hi: [ref.types.void, []], add: ['int', ['int']] }).add(3)
        console.log(ans)
        var testFun = ffi.Library('D:\\hi.dll', {
          hi: ['void', []],
          add: ['int', ['int']],
          str: ['string', []],
          strc: ['void', ['char*']],
          tests: ['void', ['short*']],
          testpf: ['void', ['short*', 'long*', 'string', 'short*']],
          testmnl: ['void', ['short*', 'long*', 'char*', 'int*', LongArray]]
        })
        var shorta = ref.alloc('short')
        var longa = ref.alloc('long')
        var stringa = Buffer.alloc(1024)
        var inta = ref.alloc('int')
        var longarraya = new LongArray(5)
        testFun.testmnl(shorta, longa, stringa, inta, longarraya)
        console.log(shorta.deref(), longa.deref(), ref.readCString(stringa, 0), inta.deref(), longarraya)
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
      console.log(val.length)
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
        console.log(err)
      })
    },
    cleanInput () {
      this.words = ''
    },
    showFun () {
      const w = this.words
      console.log('insert:\t', w)
      const execSync = window.require('child_process').execSync
      const output = execSync('d:\\pefile.exe exports ' + w)
      const ans = output.toString()
      const tempList = JSON.parse(ans)
      console.log('list:\t', tempList)
      this.funList = []
      for (const p of tempList) {
        this.funList.push(p[1])
        console.log('insert ', this.funList.length)
      }
    },
    insertItem (item) {
      this.list.push([this.words, item])
      this.seqData.push({
        id: this.words + item + this.typeList[this.typeIndex] + new Date().getTime(),
        path: this.words,
        func: item,
        type: this.typeList[this.typeIndex]
      })
    },
    deleteItem () {
      const idList = this.multipleSelection.map((i) => i.id)
      idList.forEach((id) => {
        console.log(id)
        this.seqData = this.seqData.filter((item) => item.id !== id)
      })
      // this.list.splice(index, 1)
      // console.log('delete', this.list.length)
    },
    modifyItem (newContent, index) {
      this.list.splice(index, 1, newContent)
    },
    runItem (item) {
      console.log('I\'m here:\t', item)
      const ffi = window.require('ffi-napi')
      const ref = window.require('ref-napi')
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
    },
    handleCommand (command) {
      this.$message('click on item ' + command)
    }
  }
}
</script>
