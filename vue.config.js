module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      externals: ['ffi-napi', 'ref-napi'],
      builderOptions: {
        extraResources: {
          from: 'src/assets/',
          to: './'
        }
      }
    }
  }
}
