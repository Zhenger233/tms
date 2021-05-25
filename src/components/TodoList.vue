<template>
  <div class="home">
    <el-row>
      <el-col :span="2"><el-button v-on:click="openFile">open</el-button></el-col>
      <el-col :span="18"><el-input v-model="words" type="text" /></el-col>
      <el-col :span="2"><el-button v-on:click="cleanInput"> clean</el-button></el-col>
      <el-col :span="2"><el-button type="primary" v-on:click="showFun"> add</el-button></el-col>
    </el-row>
    <el-dropdown split-button>
      <span class="el-dropdown-link">
        add function:
      </span>
      <template #dropdown>
        <el-dropdown-menu v-for="(item, index) in funlist" :key="index">
          <el-dropdown-item @click="insertItem(item)">{{item}}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <ul>
      <li v-for="(item, index) in list" v-bind:key="index">
        <TodoListItem
          v-bind:item="item[0] + ' ' + item[1]"
          v-bind:index="index"
          v-on:deleteItem="deleteItem(index)"
          v-on:runItem="runItem(item)"
          v-on:modifyItem="modifyItem"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import TodoListItem from '@/components/TodoListItem.vue'
const { dialog } = window.require('electron').remote

export default {
  name: 'TodoList',
  components: {
    TodoListItem
  },
  data () {
    return {
      words: 'd:\\add.dll',
      list: [],
      dlllist: []
    }
  },
  methods: {
    openFile () {
      dialog.showOpenDialog({
        properties: ['openFile']
      }).then(result => {
        // console.log(result.canceled)
        console.log('open:\t', result.filePaths)
        this.words = result.filePaths
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
      this.funlist = []
      for (const p of tempList) {
        this.funlist.push(p[1])
        console.log('insert ', this.list.length)
      }
    },
    insertItem (item) {
      this.list.push([this.words, item])
    },
    deleteItem (index) {
      this.list.splice(index, 1)
      console.log('delete', this.list.length)
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
