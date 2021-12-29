import axios from "axios"
import { Message, Loading } from "element-ui"
import { getToken, blobSaveFile } from "@/utils"
import store from "@/store"
import router from "@/router"

import qs from "qs"

// 创建axios实例
// @ts-ignore
const service = axios.create({
  withCredentials: true,
  // baseURL: "/api-backstand",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
  },
  timeout: 30000, // 请求超时时间
})

service.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = "Bearer " + token
    }
    return config
  },
  (error) => Promise.reject(error)
)

service.interceptors.response.use(function responseHandler(response) {
  const remote = response.data
  // 文件下载
  if (response.config.responseType === "blob") {
    if (response.data.type === "application/json") {
      const fileReader = new FileReader()
      fileReader.readAsText(response.data)

      return new Promise((resolve, reject) => {
        fileReader.onload = function () {
          const resData = JSON.parse(this.result)
          Message.error("下载失败:" + resData.msg)
          return reject(resData)
        }
      })
    }
    // 获取文件名、如果生产环境获取不到，要让后端设置Access-Control-Expose-Headers https://www.jianshu.com/p/84d2f8b32842
    const disposition = response.headers["content-disposition"]
    if (disposition) response.fileName = decodeURIComponent(disposition.slice("attachment;filename=".length))
    return response
  }

  // /api-backstand 的要判断 code 是否为 0
  if (response.config.url.includes("/api-backstand") && remote.code != 0) {
    return errorHandler({ response })
  }

  return remote
}, errorHandler)

export function errorHandler(error) {
  let msg
  if (error.response) {
    if (!(msg = error.response.data.msg)) {
      switch (error.response.status) {
        case 400:
          msg = "请求错误(400)"
          break
        case 401:
          msg = "未授权，请重新登录(401)"
          break
        case 403:
          msg = "拒绝访问(403)"
          break
        case 404:
          msg = "请求路径未找到(404)"
          break
        case 408:
          msg = "请求超时(408)"
          break
        case 500:
          msg = "服务器错误(500)"
          break
        case 501:
          msg = "服务未实现(501)"
          break
        case 502:
          msg = "网关错误(502)"
          break
        case 503:
          msg = "服务不可用(503)"
          break
        case 504:
          msg = "网络超时(504)"
          break
        case 505:
          msg = "HTTP版本不受支持(505)"
          break
        default:
          msg = `连接出错(${error.response.status})！`
      }
    }
    if (error.response.status === 401) {
      store.commit("CLEAR_USER_INFO")
      router.push("/login")
    }
  } else {
    msg = "请求无响应"
  }

  Message.error(msg)

  error.message = msg
  return Promise.reject(error)
}

const http = {
  request(axiosConfig) {
    return service(axiosConfig)
  },
  get(url, params, config) {
    return service({
      ...config,
      url,
      method: "GET",
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { indices: false })
      },
    })
  },
  /** post application/x-www-form-urlencoded */
  post(url, data, config) {
    return service({
      url,
      data,
      method: "POST",
      ...config,
      transformRequest: [
        (data) => {
          return qs.stringify(data, { indices: false })
        },
      ],
    })
  },
  /** post application/json */
  postJson(url, data, config) {
    return service({
      method: "POST",
      url: url,
      data: data,
      ...config,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
  },
  /** post multipart/form-data */
  postForm(url, data) {
    return service({
      method: "POST",
      url,
      data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },
  /** 下载文件 responseType: "blob"  */
  downloadFile(config) {
    // @ts-ignore
    return service({
      // 1s
      timeout: 60 * 1000,
      ...config,
      responseType: "blob",
    })
  },
  /** 下载文件并保存 */
  downloadFileSava(config, defaultFileName) {
    const loadingInstance = Loading.service({
      fullscreen: true,
      text: "下载中",
      background: "rgba(0, 0, 0, 0.08)",
    })

    return http.downloadFile(config).then(
      (res) => {
        loadingInstance.close()
        const { data } = res
        const fileName = res.fileName || defaultFileName || ""
        blobSaveFile(data, fileName)
        return res
      },
      (err) => {
        loadingInstance.close()
        return err
      }
    )
  },
}

export default http
