<template>
  <div class="home">
    <el-container style="border: 1px solid #eee">
      <el-aside
        width="200px"
        style="background-color: rgb(238, 241, 246)"
      >
        <el-menu
          :default-openeds="['3']"
          :default-active="'1-' + menuIndex"
        >
          <el-submenu index="1">
            <template #title><i class="el-icon-setting"></i>DLL RUN</template>
            <el-menu-item-group
              v-for="(item, index) in insertItemList[0]"
              :key="index"
            >
              <el-menu-item
                @click="selectMenu(0, index)"
                :index="'1-' + index"
              >{{ item }}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- <el-submenu index="2">
            <template #title><i class="el-icon-rank"></i>CTRL FLOW</template>
            <el-menu-item-group
              v-for="(item, index) in insertItemList[1]"
              :key="index"
            >
              <el-menu-item
                @click="selectMenu(1, index)"
                :index="'2-' + index"
              >{{ item }}</el-menu-item>
            </el-menu-item-group>
          </el-submenu> -->
          <el-submenu index="3">
            <template #title><i class="el-icon-menu"></i>OTHERS</template>
            <el-menu-item-group
              v-for="(item, index) in insertItemList[2]"
              :key="index"
            >
              <el-menu-item
                @click="selectMenu(2, index)"
                :index="'3-' + index"
              >{{ item }}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <el-row
            v-if="menuGroup === 0"
            style="margin-top: 20px"
          >
            <el-col :span="4">
              <el-button
                type="primary"
                v-on:click="openFile"
              >Open</el-button>
            </el-col>
            <el-col :span="10">
              <el-input
                v-model="words"
                clearable
                v-on:keyup.enter="showFun"
                type="text"
                @clear="cleanInput"
              />
            </el-col>
            <el-col :span="10">
              <el-dropdown split-button>
                <span class="el-dropdown-link">
                  {{ funList[funIndex] }}
                </span>
                <template #dropdown>
                  <el-dropdown-menu
                    v-for="(item, index) in funList"
                    :key="index"
                  >
                    <el-dropdown-item @click="insertItemRun(item)">{{
                      item
                    }}</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-col>
          </el-row>
          <el-row
            type="flex"
            v-if="menuGroup == 2 && menuIndex == 0"
            style="margin-top: 20px;justify-content:space-around"
          >
            <el-col :span="6">
              <el-select
                v-model="messageType"
                clearable
                placeholder="type"
              >
                <el-option
                  v-for="item in messageTypeList"
                  :key="item"
                  :value="item"
                  :label="item"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select
                v-model="messageTitle"
                clearable
                placeholder="title"
              >
                <el-option
                  v-for="item in varList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select
                v-model="messageMessage"
                clearable
                placeholder="message"
              >
                <el-option
                  v-for="item in varList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-button
                type="primary"
                @click="insertMessagePop"
              >Insert</el-button>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <el-table
            v-show="seqData.length > 0"
            ref="multipleTable"
            :data="seqData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            default-expand-all
            row-key="id"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          >
            <el-table-column
              type="selection"
              width="30"
            > </el-table-column>
            <el-table-column
              prop="name"
              label="name"
              width="160"
            >
            </el-table-column>
            <el-table-column
              prop="type"
              label="type"
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="param.paramList"
              label="param"
              width="420"
            >
              <template #default="scope">
                <el-select
                  v-model="scope.row.param.paramList"
                  multiple
                  clearable
                  filterable
                  allow-create
                  default-first-option
                  placeholder="return & param"
                  style="width:100%"
                >
                  <el-option
                    v-for="item in varList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"
                  >
                    <el-row
                      type="flex"
                      class="row-bg"
                      v-if="menuGroup==0&&menuIndex>0"
                      justify="space-between"
                    >
                      <el-col :span="5">
                        <div>{{ item.name }}</div>
                      </el-col>
                      <el-col :span="5">
                        <el-checkbox
                          v-model="scope.row.param.argObj[item.name]"
                          @click="clickCheckBox"
                          @change="changeCheckBox(scope.row)"
                        >result</el-checkbox>
                      </el-col>
                      <el-col
                        :span="14"
                        v-if="menuGroup==0&&menuIndex>1&&scope.row.param.argObj[item.name]"
                      >
                        <el-select
                          v-model="scope.row.param.argList"
                          clearable
                          multiple
                          filterable
                          allow-create
                          placeholder="value to compare"
                        >
                          <el-option
                            v-for="item in varList"
                            :key="item.name"
                            :label="item.name"
                            :value="item.name"
                          ></el-option>
                        </el-select>
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
            <!-- <el-button @click="insertItemCombination">Combine</el-button> -->
            <el-button @click="run">Run</el-button>
            <el-button @click="importSeqFile">Import</el-button>
            <el-button @click="exportSeqFile">Export</el-button>
          </div>
          <el-table
            v-show="resultList.length > 0"
            :data="resultList"
            tooltip-effect="dark"
            style="width: 100%;margin:top: 20px"
          >
            <el-table-column
              prop="runNumber"
              label="number"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="name"
              label="name"
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="type"
              label="type"
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="result"
              label="result"
              width="180"
            >
            </el-table-column>
          </el-table>
          <!-- <el-button @click="test">Test</el-button> -->
          <el-button v-if="showReport" @click="report">Report</el-button>
        </el-main>
      </el-container>
      <el-container style="border: 1px solid #eee; margin-right: 0;overscroll-behavior: none;">
        <el-aside width="500">
          <div style="text-align:center;margin-top: 20px;font-size:20px;bold">
            Variable List
          </div>
          <el-table
            :data="varList"
            style="margin-right: 0; width: 100%;"
          >
            <el-table-column
              label="name"
              width="150"
              align="center"
            >
              <template #default="scope">
                <el-input
                  v-model="scope.row.name"
                  type="text"
                  v-on:keyup.enter="addVar"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="type"
              width="140"
              align="center"
            >
              <template #default="scope">
                <!-- <el-input
                  v-model="scope.row.type"
                  type="text"
                  @input="valChange(scope.row)"
                  v-on:keyup.enter="addVar"
                ></el-input> -->
                <el-autocomplete
                  v-model="scope.row.type"
                  :fetch-suggestions="querySearchValType"
                  clearable
                  placeholder="int"
                  @select="handleSelect"
                  @input="valChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="value"
              label="value"
              align="center"
              width="170"
            >
              <template #default="scope">
                <el-input
                  v-model="scope.row.valstr"
                  type="text"
                  @input="valChange(scope.row)"
                  v-on:keyup.enter="addVar"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column width="30">
              <template #default="scope">
                <i
                  class="el-icon-circle-close"
                  @click="deleteVal(scope.$index)"
                  style="font-size: 20px"
                ></i>
              </template>
            </el-table-column>
          </el-table>
          <!-- <el-button @click="addVar">Add</el-button> -->
          <i
            class="el-icon-circle-plus-outline"
            @click="addVar"
            style="font-size: 30px"
          ></i>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// import getExportFunctionList1 from '@/components/utils/getExportFunctionList.js'
const require = window.require
// const { CHAR, BYTE, WORD, DWORD, LONG, ULONG, ULONGLONG, BOOL } = require('./getExportFunctionList.js')
const { dialog } = require('electron').remote
const ffi = require('ffi-napi')
const ref = require('ref-napi')
const StructType = require('ref-struct-napi')
const ArrayType = require('ref-array-napi')
const IntArray = ArrayType('int')
const LongArray = ArrayType('long')
const ShortArray = ArrayType('short')
const FloatArray = ArrayType('float')
const DoubleArray = ArrayType('double')
const { ipcRenderer } = require('electron')
const fs = require('fs')
const xlsx = require('node-xlsx')
const uuid = require('uuid')

const IMAGE_NT_OPTIONAL_HDR32_MAGIC = 0x10b
const IMAGE_DIRECTORY_ENTRY_EXPORT = 0
const IMAGE_NUMBEROF_DIRECTORY_ENTRIES = 16

const CHAR = ref.types.uchar
const BYTE = ref.types.uchar
const WORD = ref.types.uint16
const DWORD = ref.types.uint32
const LONG = ref.types.int32
const ULONG = ref.types.uint32
const ULONGLONG = ref.types.uint64
const BOOL = ref.types.bool

const IMAGE_DOS_HEADER = StructType({
  e_magic: WORD,
  e_cblp: WORD,
  e_cp: WORD,
  e_crlc: WORD,
  e_cparhdr: WORD,
  e_minalloc: WORD,
  e_maxalloc: WORD,
  e_ss: WORD,
  e_sp: WORD,
  e_csum: WORD,
  e_ip: WORD,
  e_cs: WORD,
  e_lfarlc: WORD,
  e_ovno: WORD,
  e_res: ArrayType(WORD, 4),
  e_oemid: WORD,
  e_oeminfo: WORD,
  e_res2: ArrayType(WORD, 10),
  e_lfanew: LONG
})

const IMAGE_FILE_HEADER = StructType({
  Machine: WORD,
  NumberOfSections: WORD,
  TimeDateStamp: DWORD,
  PointerToSymbolTable: DWORD,
  NumberOfSymbols: DWORD,
  SizeOfOptionalHeader: WORD,
  Characteristics: WORD
})

const IMAGE_DATA_DIRECTORY = StructType({
  VirtualAddress: DWORD,
  Size: DWORD
})

const IMAGE_OPTIONAL_HEADER32 = StructType({
  Magic: WORD,
  MajorLinkerVersion: BYTE,
  MinorLinkerVersion: BYTE,
  SizeOfCode: DWORD,
  SizeOfInitializedData: DWORD,
  SizeOfUninitializedData: DWORD,
  AddressOfEntryPoint: DWORD,
  BaseOfCode: DWORD,
  BaseOfData: DWORD,
  ImageBase: DWORD,
  SectionAlignment: DWORD,
  FileAlignment: DWORD,
  MajorOperatingSystemVersion: WORD,
  MinorOperatingSystemVersion: WORD,
  MajorImageVersion: WORD,
  MinorImageVersion: WORD,
  MajorSubsystemVersion: WORD,
  MinorSubsystemVersion: WORD,
  Win32VersionValue: DWORD,
  SizeOfImage: DWORD,
  SizeOfHeaders: DWORD,
  CheckSum: DWORD,
  Subsystem: WORD,
  DllCharacteristics: WORD,
  SizeOfStackReserve: DWORD,
  SizeOfStackCommit: DWORD,
  SizeOfHeapReserve: DWORD,
  SizeOfHeapCommit: DWORD,
  LoaderFlags: DWORD,
  NumberOfRvaAndSizes: DWORD,
  DataDirectory: ArrayType(IMAGE_DATA_DIRECTORY, IMAGE_NUMBEROF_DIRECTORY_ENTRIES)
})

const IMAGE_OPTIONAL_HEADER64 = StructType({
  Magic: WORD,
  MajorLinkerVersion: BYTE,
  MinorLinkerVersion: BYTE,
  SizeOfCode: DWORD,
  SizeOfInitializedData: DWORD,
  SizeOfUninitializedData: DWORD,
  AddressOfEntryPoint: DWORD,
  BaseOfCode: DWORD,
  ImageBase: ULONGLONG,
  SectionAlignment: DWORD,
  FileAlignment: DWORD,
  MajorOperatingSystemVersion: WORD,
  MinorOperatingSystemVersion: WORD,
  MajorImageVersion: WORD,
  MinorImageVersion: WORD,
  MajorSubsystemVersion: WORD,
  MinorSubsystemVersion: WORD,
  Win32VersionValue: DWORD,
  SizeOfImage: DWORD,
  SizeOfHeaders: DWORD,
  CheckSum: DWORD,
  Subsystem: WORD,
  DllCharacteristics: WORD,
  SizeOfStackReserve: ULONGLONG,
  SizeOfStackCommit: ULONGLONG,
  SizeOfHeapReserve: ULONGLONG,
  SizeOfHeapCommit: ULONGLONG,
  LoaderFlags: DWORD,
  NumberOfRvaAndSizes: DWORD,
  DataDirectory: ArrayType(IMAGE_DATA_DIRECTORY, IMAGE_NUMBEROF_DIRECTORY_ENTRIES)
})

const IMAGE_NT_HEADERS32 = StructType({
  Signature: DWORD,
  FileHeader: IMAGE_FILE_HEADER,
  OptionalHeader: IMAGE_OPTIONAL_HEADER32
})

const IMAGE_NT_HEADERS64 = StructType({
  Signature: DWORD,
  FileHeader: IMAGE_FILE_HEADER,
  OptionalHeader: IMAGE_OPTIONAL_HEADER64
})

const IMAGE_SECTION_HEADER = StructType({
  Name: ArrayType(BYTE, 8),
  PhysicalAddress: DWORD,
  VirtualAddress: DWORD,
  SizeOfRawData: DWORD,
  PointerToRawData: DWORD,
  PointerToRelocations: DWORD,
  PointerToLinenumbers: DWORD,
  NumberOfRelocations: WORD,
  NumberOfLinenumbers: WORD,
  Characteristics: DWORD
})

const IMAGE_EXPORT_DIRECTORY = StructType({
  Characteristics: DWORD,
  TimeDateStamp: DWORD,
  MajorVersion: WORD,
  MinorVersion: WORD,
  Name: DWORD,
  Base: DWORD,
  NumberOfFunctions: DWORD,
  NumberOfNames: DWORD,
  AddressOfFunctions: DWORD,
  AddressOfNames: DWORD,
  AddressOfNameOrdinals: DWORD
})

export default {
  name: 'TodoList',
  data () {
    return {
      words: 'd:/hi.dll',
      funParam: '',
      insertItemList: [
        [
          'Direct Call',
          'Pass & Fail',
          'String Value',
          'Numeric Limit',
          'M-num Limit'
        ],
        [
          'If',
          'If-OK',
          'Else-if',
          'Else',
          'For-init',
          'For-condition',
          'For-increment',
          'For-main',
          'Break',
          'Goto'
        ],
        ['Message Pop']
      ],
      menuIndex: 0,
      funList: ['testint'],
      funIndex: 0,
      seqData: [],
      showReport: false,
      multipleSelection: [],
      varList: [
        {
          name: 'runNumber',
          type: 'int',
          value: 1,
          valstr: '1'
        },
        {
          name: 'var0',
          type: 'short*',
          value: ref.alloc('short'),
          valstr: '1'
        },
        {
          name: 'var1',
          type: 'char*',
          value: Buffer.from('TCPIP0::192.168.19.3::INSTR\0'),
          valstr: 'TCPIP0::192.168.19.3::INSTR'
        },
        { name: 'var2', type: 'long*', value: ref.alloc('long'), valstr: '5' },
        { name: 'var3', type: 'int*', value: ref.alloc('int'), valstr: '0' },
        {
          name: 'var4',
          type: 'long[]',
          value: new LongArray(5),
          valstr: '0,0,0,0,0'
        },
        { name: 'comp', type: '<', value: 100, valstr: '100' }
        // { name: 'var3', type: 'char*', value: Buffer.from('\0'.repeat(64)), valstr: '' },
        // { name: 'var4', type: 'char*', value: Buffer.from('result string.' + '\0'.repeat(64)), valstr: 'result string.' }
      ],
      varListMax: 7,
      varTypes: [
        'char', 'short', 'long', 'int', 'long long', 'float', 'double', 'char*', 'short*', 'long*', 'int*', 'long long*', 'float*', 'double*', 'string', 'short[]', 'long[]', 'int[]', 'long long[]', 'float[]', 'double[]', '>', '>=', '<', '<=', '=='
      ],
      resultList: [],
      menuGroup: 0,
      messageTypeList: ['none', 'info', 'warning', 'error'],
      messageType: 'none',
      messageTitle: '',
      messageMessage: '',
      messageButton: []
    }
  },
  methods: {
    showTr (row, index) {
      console.log(index)
      const show = (row.row._parent ? (row.row._parent._expanded && row.row._parent._show) : true)
      row.row._show = show
      return show ? '' : 'display:none;'
    },
    getRunNumber () {
      return this.varList.find(i => i.name === 'runNumber').value || 1
    },
    importSeqFile () {
      dialog
        .showOpenDialog({
          title: '导入',
          buttonLabel: '导入',
          filters: [{ name: 'File Type', extensions: ['json', 'zztms'] }]
        })
        .then(result => {
          console.log(result.filePaths)
          const fileString = fs.readFileSync(result.filePaths[0], 'utf8')
          console.log(fileString)
          const data = JSON.parse(fileString)
          this.seqData.push(...data.seqData)
          this.varList.push(...data.varList)
          alert('导入成功')
        })
        .catch(err => {
          console.log(err)
          alert('导入失败\n', err)
        })
    },
    exportSeqFile () {
      dialog
        .showSaveDialog({
          title: '导出',
          buttonLabel: '保存',
          filters: [{ name: '文件类型', extensions: ['json', 'zztms'] }]
        })
        .then(result => {
          console.log(result)
          const data = {
            seqData: this.seqData,
            varList: this.varList
          }
          fs.writeFileSync(result.filePath, JSON.stringify(data))
          alert('导出成功')
        })
        .catch(err => {
          console.log(err)
          alert('导出失败\n', err)
        })
    },
    deleteVal (varIndex) {
      console.log('delete:', varIndex)
      this.varList.splice(varIndex, 1)
    },
    insertMessagePop () {
      this.seqData.push({
        id: uuid(),
        name: this.messageType + this.seqData.length,
        type: 'MessagePop',
        result: -1,
        param: {
          type: this.messageType,
          title: this.messageTitle,
          msg: this.messageMessage,
          button: this.messageButton,
          paramList: this.messageButton
        }
      })
    },
    changeCheckBox (row) {
      console.log(row)
    },
    clickCheckBox (e) {
      e.stopPropagation()
    },
    report () {
      const reportData = [{
        name: 'report',
        data: [
          ['runNumber', 'name', 'type', 'result']
        ]
      }]
      this.resultList.forEach(i => reportData[0].data.push([i.runNumber, i.name, i.type, i.result]))
      console.log(reportData)
      dialog
        .showSaveDialog({
          title: '导出报表',
          buttonLabel: '保存',
          filters: [{ name: '文件类型', extensions: ['xlsx'] }]
        })
        .then(result => {
          console.log(result)
          fs.writeFileSync(result.filePath, xlsx.build(reportData))
          alert('导出成功')
        })
        .catch(err => {
          console.log(err)
          alert('导出失败\n', err)
        })
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
        case 'char': {
          console.log('char')
          if (!isNaN(Number(row.valstr))) {
            console.log('changing...')
            row.value = Number(row.valstr) && 0xff
          } else {
            console.log('error char')
          }
          break
        }
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
            console.log(typeof row.value, row.value)
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
        case '>=':
        case '>':
        case '==':
        case '<=':
        case '<': {
          console.log('compare')
          row.value = Number(row.valstr)
          break
        }
        default: {
          console.log('default', row.type)
          // change input box border color to red
          break
        }
      }
    },
    // createFilter (queryString) {
    //   return (item) => {
    //     return item.value.toUpperCase().match(queryString.toUpperCase());
    //   }
    // },
    querySearchValType (queryString, cb) {
      const createFilter = (queryString) => {
        return (item) => {
          return item.value.indexOf(queryString) > -1
        }
      }
      let results = this.varTypes.toString().split(',').map(i => { return { value: i } })
      results = queryString
        ? results.filter(createFilter(queryString))
        : results
      cb(results)
    },
    handleSelect (item) {
      console.log(item)
    },
    addVar () {
      this.varList.push({
        name: 'var' + this.varListMax,
        type: 'int',
        value: 0,
        valstr: '0'
      })
      this.varListMax++
    },
    selectMenu (group, index) {
      console.log('click menu:\t', group, index)
      this.menuGroup = group
      this.menuIndex = index
    },
    type2realType (type) {
      switch (type) {
        case 'int[]':
          return IntArray
        case 'long[]':
          return LongArray
        case 'short[]':
          return ShortArray
        case 'float[]':
          return FloatArray
        case 'double[]':
          return DoubleArray
        default:
          return type
      }
    },
    run () {
      this.resultList = []
      for (let runnumber = 1; runnumber <= this.getRunNumber(); runnumber++) {
        for (const item of this.multipleSelection) {
          if (item.type === 'Direct Call' || item.type === 'Pass & Fail' || item.type === 'String Value' || item.type === 'Numeric Limit' || item.type === 'M-num Limit') {
            console.log('seq:', item)
            const funName = item.param.func
            let retType = 'void'
            if (item.param.paramList[0] !== 'void') {
              retType = this.varList.find(i => i.name === item.param.paramList[0])
                .type
            }
            const paramType = item.param.paramList
              .slice(1)
              .map(i =>
                this.type2realType(this.varList.find(j => j.name === i).type)
              )
            console.log('run:\t', funName, retType, paramType)
            const dll = ffi.Library(item.param.path, {
              [funName]: [retType, paramType]
            })
            const params = item.param.paramList
              .slice(1)
              .map(i => this.varList.find(j => j.name === i).value)
            console.log('dllFuncParams', params)
            const dllResult = dll[funName](...params)
            console.log('dllResult:', dllResult)
            if (item.param.paramList[0] !== 'void') {
              const p0 = this.varList.find(
                i => i.name === item.param.paramList[0]
              )
              console.log('p0:', p0)
              if (this.isnums(p0.type)) {
                console.log('isnum')
                p0.valstr = String(dllResult)
                p0.value = Number(dllResult)
              } else if (p0.type === 'string' || p0.type === 'char*') {
                p0.value = p0.valstr = String(dllResult)
              }
            }
            console.log(dllResult)
            for (const it of this.varList) {
              if (this.ispointers(it.type)) {
                it.valstr = String(it.value.deref())
              } else if (it.type === 'char*' || it.type === 'string') {
                it.valstr = ref.readCString(it.value, 0)
              } else if (this.isarrays(it.type)) {
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
                console.log('pass&fail argObj:', ao)
                for (const i in ao) {
                  console.log(i, ao[i])
                  if (ao[i]) {
                    const varResult = this.varList.find(j => j.name === i)
                    console.log('varResult:', varResult)
                    item.result = Number(
                      this.val2result(varResult.type, varResult.value)
                    )
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
                    item.result = Number(
                      ref.readCString(
                        this.varList.find(j => j.name === i).value,
                        0
                      ) ===
                      ref.readCString(
                        this.varList.find(j => j.name === item.param.argList[0])
                          .value,
                        0
                      )
                    )
                    break
                  }
                }
              } catch (error) {
                console.log(error)
              }
            } else if (item.type === 'Numeric Limit') {
              try {
                const ao = item.param.argObj
                const al = item.param.argList
                console.log('argObj:', ao, 'argList:', al)
                for (const i in ao) {
                  if (ao[i]) {
                    const varResult = this.varList.find(j => j.name === i).value
                    const tvCompare = []
                    console.log('length:', al.length)
                    for (let i = 0; i < al.length; i++) {
                      console.log(al[i])
                      tvCompare.push(this.varList.find(j => j.name === al[i]))
                    }
                    console.log('varResult,tvCompare:', varResult, tvCompare)
                    let resultCompare = true
                    for (const tv of tvCompare) {
                      console.log('tv:', tv)
                      resultCompare =
                        resultCompare && eval(varResult + tv.type + tv.value)
                    }
                    item.result = Number(resultCompare)
                    break
                  }
                }
              } catch (error) {
                console.log(error)
              }
            } else if (item.type === 'M-num Limit') {
              try {
                const ao = item.param.argObj
                const al = item.param.argList
                const aol = []
                let argn = 0
                const arga = []
                console.log('ao:', ao)
                for (const i in ao) {
                  if (ao[i]) {
                    aol.push(i)
                  }
                }
                console.log('aol:', aol)
                for (const item of aol) {
                  const n = this.varList.find(j => j.name === item)
                  console.log('number:', n)
                  if (this.isints(n.type)) {
                    argn = n.value
                  }
                  if (
                    n.type === 'int*' ||
                    n.type === 'short*' ||
                    n.type === 'long*'
                  ) {
                    argn = n.value.deref()
                  }
                  if (this.isarrays(n.type)) {
                    arga.length = 0
                    for (let i = 0; i < n.value.length; i++) {
                      arga.push(n.value[i])
                    }
                  }
                }
                console.log('argn,arga:', argn, arga)
                const tvCompare = []
                for (let i = 0; i < al.length; i++) {
                  console.log('ali:', al[i])
                  tvCompare.push(this.varList.find(j => j.name === al[i]))
                }
                let resultCompare = true
                for (let i = 0; i < argn; i++) {
                  for (const tv of tvCompare) {
                    console.log('tvi:', tv, i)
                    resultCompare =
                      resultCompare && eval(arga[i] + tv.type + tv.value)
                  }
                }
                item.result = Number(resultCompare)
              } catch (error) {
                console.log(error)
              }
            }
          } else if (item.type === 'MessagePop') {
            dialog
              .showMessageBox({
                type: item.param.type,
                title: this.varList.find(i => i.name === item.param.title).valstr,
                message: this.varList.find(i => i.name === item.param.msg).valstr,
                buttons: item.param.paramList
              })
              .then(res => {
                console.log(res.response)
                item.result = res.response
              })
          }
          this.resultList.push({ runNumber: runnumber, ...item })
        }
        this.showReport = true
      }
    },
    isints (s) {
      return s === 'int' ||
              s === 'long' ||
              s === 'short' ||
              s === 'long long'
    },
    isnums (s) {
      return s === 'int' ||
              s === 'long' ||
              s === 'short' ||
              s === 'long long' ||
              s === 'float' ||
              s === 'double'
    },
    ispointers (s) {
      return s === 'int*' ||
              s === 'short*' ||
              s === 'long*' ||
              s === 'long long*' ||
              s === 'float*' ||
              s === 'double*'
    },
    isarrays (s) {
      return s === 'int[]' ||
              s === 'short[]' ||
              s === 'long[]' ||
              s === 'long long[]' ||
              s === 'float[]' ||
              s === 'double[]'
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
      console.log('data:', this.$data)
      try {
        console.log('runNumber:', this.varList.find(i => i.name === 'runNumber').value)
        console.log(process.cwd(), __dirname, __filename, process)
        console.log(this.getExportFunctionList('d:/Math.dll'))
      } catch (err) {
        console.log('testerror:\n', err)
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
      dialog
        .showOpenDialog({
          properties: ['openFile']
        })
        .then(result => {
          // console.log(result.canceled)
          console.log('open:\t', result.filePaths)
          this.words = result.filePaths[0].replace('\\', '/')
          this.showFun()
        })
        .catch(err => {
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
      // const output = execSync('d:/pefile.exe exports "' + w + '"')
      // const ans = output.toString()
      // const tempList = JSON.parse(ans)
      // for (const p of tempList) {
      //   this.funList.push(p[1])
      // }
      const tempList = this.getExportFunctionList(w)
      console.log('funlist:\t', tempList)
      this.funList = tempList
      console.log('insert ', this.funList.length, ' functions')
    },
    insertItemRun (functionName) {
      const functionType = this.insertItemList[0][this.menuIndex]
      this.seqData.push({
        id: uuid(), // this.words+functionName+functionType+this.seqData.length +new Date().getTime(),
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
    insertItemCombination () {
      console.log(this.multipleSelection)
      const seqNameList = []
      const seqListCombination = []
      for (const item of this.multipleSelection) {
        seqNameList.push(item.name)
        seqListCombination.push(item)
      }
      this.seqData.push({
        id: uuid(),
        name: 'seqCombination' + this.seqData.length,
        type: 'Combination',
        result: -1,
        hasChildren: true,
        param: {
          paramList: seqNameList,
          argObj: {},
          argList: []
        },
        children: seqListCombination
      })
    },
    deleteItem () {
      const idList = this.multipleSelection.map(i => i.id)
      idList.forEach(id => {
        console.log(id)
        this.seqData = this.seqData.filter(item => item.id !== id)
      })
    },
    getDosHeader (buffer) {
      return new IMAGE_DOS_HEADER(buffer.slice(0, IMAGE_DOS_HEADER.size))
    },

    getFileHeader (buffer) {
      const dosHeader = this.getDosHeader(buffer)
      return new IMAGE_FILE_HEADER(buffer.slice(dosHeader.e_lfanew + 4, dosHeader.e_lfanew + 4 + IMAGE_FILE_HEADER.size))
    },

    isBit32 (buffer) {
      return this.getFileHeader(buffer).Machine === 0x14c
    },

    getNTHeader (buffer) {
      const dosHeader = this.getDosHeader(buffer)
      if (this.isBit32(buffer)) {
        return new IMAGE_NT_HEADERS32(buffer.slice(dosHeader.e_lfanew, dosHeader.e_lfanew + IMAGE_NT_HEADERS32.size))
      } else {
        return new IMAGE_NT_HEADERS64(buffer.slice(dosHeader.e_lfanew, dosHeader.e_lfanew + IMAGE_NT_HEADERS64.size))
      }
    },

    getOptionalHeader (buffer) {
      const ntHeader = this.getNTHeader(buffer)
      return ntHeader.OptionalHeader
    },

    getSectionHeader (buffer, index = 0) {
      const dosHeader = this.getDosHeader(buffer)
      const IMAGE_NT_HEADER_SIZE = this.isBit32(buffer) ? IMAGE_NT_HEADERS32.size : IMAGE_NT_HEADERS64.size
      return new IMAGE_SECTION_HEADER(buffer.slice(dosHeader.e_lfanew + IMAGE_NT_HEADER_SIZE + index * IMAGE_SECTION_HEADER.size, dosHeader.e_lfanew + IMAGE_NT_HEADER_SIZE + IMAGE_SECTION_HEADER.size + (index + 1) * IMAGE_SECTION_HEADER.size))
    },

    rvaToFa (buffer, rva) {
      const fileHeader = this.getFileHeader(buffer)
      const optionalHeader = this.getOptionalHeader(buffer)

      if (rva < optionalHeader.SizeOfHeaders) {
        return rva
      }

      for (let i = 0; i < fileHeader.NumberOfSections; i++) {
        var sectionHeader = this.getSectionHeader(buffer, i)
        if (rva >= sectionHeader.VirtualAddress && rva < sectionHeader.VirtualAddress + sectionHeader.SizeOfRawData) {
          var ans = rva - sectionHeader.VirtualAddress + sectionHeader.PointerToRawData
          // console.log('rva:', rva, '\tans:', ans)
          return ans
        }
      }
    },

    getDataDirectory (buffer, index) {
      const ntHeader = this.getNTHeader(buffer)
      const dataDirectory = ntHeader.OptionalHeader.DataDirectory
      const dataDirectoryRva = dataDirectory[index].VirtualAddress
      // console.log('dataDirectoryRva:', dataDirectoryRva)
      return this.rvaToFa(buffer, dataDirectoryRva)
    },

    getExportFunctionList (filePath = 'D:\\hi.dll') {
      const names = []
      const data = fs.readFileSync(filePath)
      const exportDirectoryStart = this.getDataDirectory(data, IMAGE_DIRECTORY_ENTRY_EXPORT)
      const exportDirectory = new IMAGE_EXPORT_DIRECTORY(data.slice(exportDirectoryStart, exportDirectoryStart + IMAGE_EXPORT_DIRECTORY.size))

      const numberOfFunctions = exportDirectory.NumberOfFunctions
      console.log('numberOfFunctions:', numberOfFunctions)
      console.log('functionAddress:', exportDirectory.AddressOfFunctions)
      const functions = []
      for (let i = 0; i < numberOfFunctions; i++) {
        const functionStart = this.rvaToFa(data, exportDirectory.AddressOfFunctions + i * 4)
        const func = data.slice(functionStart, functionStart + 4).readInt32LE().toString(16)
        functions.push(func)
      }
      // console.log('functions:', functions)

      const addressOfNames = []
      for (let i = 0; i < exportDirectory.NumberOfNames; i++) {
        const nameStart = this.rvaToFa(data, exportDirectory.AddressOfNames + i * 4)
        // console.log('nameStart:', nameStart)
        const nameAddress = data.slice(nameStart, nameStart + 4).readInt32LE()
        addressOfNames.push(nameAddress)
      }
      // console.log('addressOfNames:', addressOfNames)

      for (let i = 0; i < addressOfNames.length; i++) {
        const nameStart = this.rvaToFa(data, addressOfNames[i])
        const name = ref.readCString(data, nameStart)
        names.push(name)
      }
      console.log('names:', names)
      return names
    }
  }
}
const Test = () => {
  try {
    console.log(process.cwd(), __dirname, __filename, process)
    // console.log(getExportFunctionList1('d:/Math.dll'))
    // console.log(getExportFunctionList('d:/Math.dll'))
  } catch (err) {
    console.log('testerror:\n', err)
  }
}
ipcRenderer.on('menu', (event, arg) => {
  console.log('menu click1:', event, arg)
  if (arg === 'Test') {
    Test()
  }
})
</script>
