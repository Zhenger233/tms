module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      externals: ['ffi-napi', 'ref-napi']
    }
  },
  devServer: {
    host: 'localhost'
  }
}
