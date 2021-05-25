<template>
  <div class="item">
    <el-row>
      <el-col :span="20">
      <!-- <span v-show="!isActive" v-on:click="activeItem">{{ item }}</span>
      <span v-show="isActive">
        <input v-model="content" v-on:blur="inactiveItem" type="text" />
      </span> -->
        <el-button >{{item}}</el-button>
      </el-col>
      <el-col :span="2"><el-button v-on:click="$emit('deleteItem', index)">Delete</el-button></el-col>
      <el-col :span="2"><el-button type="primary" v-on:click="$emit('runItem', index)">Run</el-button></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'TodoListItem',
  props: ['item', 'index'],
  data () {
    return {
      content: '',
      isActive: false
    }
  },
  methods: {
    activeItem () {
      this.isActive = true
      this.content = this.item
    },
    inactiveItem () {
      this.$emit('modifyItem', this.content, this.index)
      this.isActive = false
    }
  }
}
</script>
