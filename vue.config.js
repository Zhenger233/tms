module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      externals: ['ffi-napi', 'ref-napi', 'ref-array-napi', 'node-xlsx', 'ref-struct-napi'],
      builderOptions: {
        extraResources: {
          from: 'src/assets/',
          to: './'
        },
        win: {
          target: [
            {
              target: 'nsis',
              arch: ['x64', 'ia32']
            }
          ]
        }
      }
    }
  }
}
