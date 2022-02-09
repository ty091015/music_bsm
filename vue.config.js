module.exports = {
  devServer: {
    hotOnly: true,
    proxy: {
      "/api": {
        target: "http://localhost:6789", //代理接口
        changeOrigin: true,
        pathRewrite: {
          "^/api": "", //代理的路径
        },
      },
    },
  },
  lintOnSave: false
};
