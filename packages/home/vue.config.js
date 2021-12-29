/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  publicPath: process.env.NODE_ENV === "development" ? "/" : "./", // 部署应用包时的基本 URL
  assetsDir: "static",
  devServer: {},
}
