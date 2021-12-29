const path = require("path")

function resolve(dir) {
  return path.join(__dirname, dir)
}

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  publicPath: process.env.NODE_ENV === "development" ? "/" : "./", // 部署应用包时的基本 URL
  assetsDir: "static",
  devServer: {},
  chainWebpack: (config) => {
    // 解析 share--如遇到 share 不能被解析时可以用
    // config.module.rule("js").include.add(resolve("../share")).add(resolve("src"))
    // config.module.rule("vue").include.add(resolve("../share")).add(resolve("src"))
  },
}
