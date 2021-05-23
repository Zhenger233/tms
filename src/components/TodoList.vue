<template>
  <div class="home">
    <div class="input-part">

      <button v-on:click="openFile">open</button>
      <input v-model="words" type="text" />
      <button v-on:click="cleanInput"> clean</button>
      <button v-on:click="insertItem"> insert</button>
    </div>
    <ul>
      <li v-for="(item, index) in list" v-bind:key="index">
        <TodoListItem
          v-bind:item="item"
          v-bind:index="index"
          v-on:deleteItem="deleteItem"
          v-on:runItem="runItem"
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
    insertItem () {
      // this.list.push(this.words)
      // test run
      const w = this.words
      console.log('insert:\t', w)
      const execSync = window.require('child_process').execSync
      const output = execSync('d:\\pefile.exe exports ' + w)
      const ans = output.toString()
      const tempList = JSON.parse(ans)
      console.log('list:\t', tempList)
      for (const p of tempList) {
        this.list.push(this.words + ' ' + p[1])
        this.dlllist.push(String(this.words))
        console.log('insert ', this.list.length)
      }
    },
    deleteItem (index) {
      this.list.splice(index, 1)
      console.log('delete', this.list.length)
    },
    modifyItem (newContent, index) {
      this.list.splice(index, 1, newContent)
    },
    runItem (index) {
      console.log('I\'m here:\t', this.list[index])
      const ffi = window.require('ffi-napi')
      const ref = window.require('ref-napi')
      const f1 = 'hi'
      console.log('require ok')
      const dllstr = this.dlllist[index]
      ffi.Library('d:\\add.dll', { hi: [ref.types.void, []] }).hi()
      eval('alert(ffi.Library(dllstr,  { add: [ref.types.int, [ref.types.int]] }).add(5))')
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
</script>
