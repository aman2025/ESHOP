const path = require("path");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const AutoDllPlugin = require("autodll-webpack-plugin");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  devServer: {
    hot: true,
    port: 8033,
    proxy: {
      "/api": {
        //代理地址
        target: "http://hope.0598qq.com/api", //需要代理的地址
        changeOrigin: true, //是否跨域
        secure: false,
        pathRewrite: {
          "^/api": "/" //本身的接口地址没有 '/api' 这种通用前缀，所以要rewrite，如果本身有则去掉
        }
      }
    },
    open: true,
    noInfo: false,
    overlay: {
      warnings: true,
      errors: true
    }
  },
  assetsDir: "h5",
  configureWebpack: config => {
    Object.assign(config.resolve.alias, {
      "@utils": resolve("src/utils"),
      "@libs": resolve("src/libs"),
      "@api": resolve("src/api"),
      "@components": resolve("src/components"),
      "@assets": resolve("src/assets"),
      "@css": resolve("src/assets/css"),
      "@images": resolve("src/assets/images"),
      "@views": resolve("src/views"),
      "@mixins": resolve("src/mixins")
    });

    if (process.env.NODE_ENV !== "production") {
      config.plugins.push(
        new HardSourceWebpackPlugin(),
        new AutoDllPlugin({
          inject: true,
          debug: true,
          filename: "[name]_[hash].js",
          path: "./dll" + Date.parse(new Date()),
          entry: {
            vendor_vue: ["vue", "vuex", "vue-router"],
            vendor_ui: ["vue-awesome-swiper", "vue-ydui"],
            vendor_tools: ["axios", "core-js"]
          }
        })
      );
    }
  },
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].VUE_APP_NAME = process.env.VUE_APP_NAME;
      return args;
    });
  }
};
