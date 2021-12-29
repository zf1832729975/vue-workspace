import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"

import { http, isEmpty, formatDate } from "./utils"

import * as api from "./api"

// 样式
import "@project/share/styles/index.scss"

// 过滤器
Vue.filter("formatDate", function (date, format) {
  if (isEmpty(date)) return "-"
  return formatDate(date, format)
})

// 原型方法
Vue.prototype.$http = http
Vue.prototype.$jsonCopy = (data) => JSON.parse(JSON.stringify(data))
Vue.prototype.$api = api

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app")
