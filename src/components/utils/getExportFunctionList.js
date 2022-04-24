const fs = require('fs')
const ref = require('ref-napi')
const StructType = require('ref-struct-napi')
const ArrayType = require('ref-array-napi')

const CHAR = ref.types.uchar
const BYTE = ref.types.uchar
const WORD = ref.types.uint16
const DWORD = ref.types.uint32
const LONG = ref.types.int32
const ULONG = ref.types.uint32
const ULONGLONG = ref.types.uint64
const BOOL = ref.types.bool

const IMAGE_NT_OPTIONAL_HDR32_MAGIC = 0x10b
const IMAGE_DIRECTORY_ENTRY_EXPORT = 0
const IMAGE_NUMBEROF_DIRECTORY_ENTRIES = 16

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

const IMAGE_IMPORT_DESCRIPTOR = StructType({
  OriginalFirstThunk: DWORD,
  TimeDateStamp: DWORD,
  ForwarderChain: DWORD,
  Name: DWORD,
  FirstThunk: DWORD
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

function getDosHeader (buffer) {
  return new IMAGE_DOS_HEADER(buffer.slice(0, IMAGE_DOS_HEADER.size))
}

function getFileHeader (buffer) {
  const dosHeader = getDosHeader(buffer)
  return new IMAGE_FILE_HEADER(buffer.slice(dosHeader.e_lfanew + 4, dosHeader.e_lfanew + 4 + IMAGE_FILE_HEADER.size))
}

function isBit32 (buffer) {
  return getFileHeader(buffer).Machine === 0x14c
}

function getNTHeader (buffer) {
  const dosHeader = getDosHeader(buffer)
  if (isBit32(buffer)) {
    return new IMAGE_NT_HEADERS32(buffer.slice(dosHeader.e_lfanew, dosHeader.e_lfanew + IMAGE_NT_HEADERS32.size))
  } else {
    return new IMAGE_NT_HEADERS64(buffer.slice(dosHeader.e_lfanew, dosHeader.e_lfanew + IMAGE_NT_HEADERS64.size))
  }
}

function getOptionalHeader (buffer) {
  const ntHeader = getNTHeader(buffer)
  return ntHeader.OptionalHeader
}

function getSectionHeader (buffer, index = 0) {
  const dosHeader = getDosHeader(buffer)
  const IMAGE_NT_HEADER_SIZE = isBit32(buffer) ? IMAGE_NT_HEADERS32.size : IMAGE_NT_HEADERS64.size
  return new IMAGE_SECTION_HEADER(buffer.slice(dosHeader.e_lfanew + IMAGE_NT_HEADER_SIZE + index * IMAGE_SECTION_HEADER.size, dosHeader.e_lfanew + IMAGE_NT_HEADER_SIZE + IMAGE_SECTION_HEADER.size + (index + 1) * IMAGE_SECTION_HEADER.size))
}

function rvaToFa (buffer, rva) {
  const fileHeader = getFileHeader(buffer)
  const optionalHeader = getOptionalHeader(buffer)

  if (rva < optionalHeader.SizeOfHeaders) {
    return rva
  }

  for (let i = 0; i < fileHeader.NumberOfSections; i++) {
    var sectionHeader = getSectionHeader(buffer, i)
    if (rva >= sectionHeader.VirtualAddress && rva < sectionHeader.VirtualAddress + sectionHeader.SizeOfRawData) {
      var ans = rva - sectionHeader.VirtualAddress + sectionHeader.PointerToRawData
      // console.log('rva:', rva, '\tans:', ans)
      return ans
    }
  }
}

function getDataDirectory (buffer, index) {
  const ntHeader = getNTHeader(buffer)
  const dataDirectory = ntHeader.OptionalHeader.DataDirectory
  const dataDirectoryRva = dataDirectory[index].VirtualAddress
  // console.log('dataDirectoryRva:', dataDirectoryRva)
  return rvaToFa(buffer, dataDirectoryRva)
}

function getExportFunctionList (filePath = 'D:\\hi.dll') {
  var names = []

  fs.readFile(filePath, (err, data) => {
    if (err) throw err
    const exportDirectoryStart = getDataDirectory(data, IMAGE_DIRECTORY_ENTRY_EXPORT)
    const exportDirectory = new IMAGE_EXPORT_DIRECTORY(data.slice(exportDirectoryStart, exportDirectoryStart + IMAGE_EXPORT_DIRECTORY.size))

    var numberOfFunctions = exportDirectory.NumberOfFunctions
    console.log('numberOfFunctions:', numberOfFunctions)
    console.log('functionAddress:', exportDirectory.AddressOfFunctions)
    const functions = []
    for (let i = 0; i < numberOfFunctions; i++) {
      const functionStart = rvaToFa(data, exportDirectory.AddressOfFunctions + i * 4)
      const func = data.slice(functionStart, functionStart + 4).readInt32LE().toString(16)
      functions.push(func)
    }
    // console.log('functions:', functions)

    const numberOfNames = exportDirectory.NumberOfNames
    // console.log('numberOfNames:', numberOfNames)
    // console.log('nameAddress:', exportDirectory.AddressOfNames)
    const addressOfNames = []
    for (let i = 0; i < exportDirectory.NumberOfNames; i++) {
      const nameStart = rvaToFa(data, exportDirectory.AddressOfNames + i * 4)
      // console.log('nameStart:', nameStart)
      const nameAddress = data.slice(nameStart, nameStart + 4).readInt32LE()
      addressOfNames.push(nameAddress)
    }
    // console.log('addressOfNames:', addressOfNames)

    for (let i = 0; i < addressOfNames.length; i++) {
      const nameStart = rvaToFa(data, addressOfNames[i])
      const name = ref.readCString(data, nameStart)
      names.push(name)
    }
    // console.log('names:', names)
  })
  return names
}

exports.getExportFunctionList = getExportFunctionList
module.exports = {
  getExportFunctionList1: getExportFunctionList
}
