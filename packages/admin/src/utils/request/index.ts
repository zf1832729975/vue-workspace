import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosInstance,
  // AxiosPromise,
} from "axios"
import { Message, Loading } from "element-ui"

// @ts-ignore
import qs from "qs"

// function createHttp(axios) {}

interface ResponseDta<T = any> {
  /** code 值 0 代表正常 */
  code: number
  /** 数据值 */
  data: T
  msg: string
}

// interface HttpPromise<T = ResponseDta> extends AxiosPromise<T> {}

export interface ResponsePromise<T = any> extends Promise<ResponseDta<T>> {}

interface ResponseFile extends AxiosResponse<Blob> {
  /** 文件名 */
  fileName: string
}

export interface ResponseFilePromise extends Promise<ResponseFile> {}

interface HttpInstance<T = any> extends AxiosInstance {
  (config: AxiosRequestConfig): ResponsePromise<T>
  (url: string, config?: AxiosRequestConfig): ResponsePromise<T>
}

// 创建axios实例
// @ts-ignore
const service: HttpInstance = axios.create({
  withCredentials: true,
  baseURL: "/api-backstand",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
  },
  timeout: 30000, // 请求超时时间
})

service.interceptors.response.use(
  function responseHandler(response: AxiosResponse<ResponseDta>) {
    const remote = response.data
    // 文件下载
    if (response.config.responseType === "blob") {
      return remote
      // if (response.data.type === "application/json") {
      //   const fileReader = new FileReader();
      //   fileReader.readAsText(response.data);
      //   return new Promise((resolve, reject) => {
      //     fileReader.onload = function () {
      //       const resData = JSON.parse(this.result);
      //       Notification({
      //         title: "下载失败",
      //         message: resData.msg,
      //         type: "error",
      //         duration: 2000,
      //         response,
      //       });
      //       return reject(resData);
      //     };
      //   });
    }

    // 正常
    if (Number(remote.code) === 0) {
      return remote
    }
    Message.error(remote.msg)
    return Promise.reject(remote)
  },

  function errorHandler(error) {
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
    } else {
      msg = "请求无响应"
    }

    Message.error(msg)

    error.message = msg
    return Promise.reject(error)
  }
)

/**
 * blob 数据保存为文件
 * @param {*} blobData blob数据
 * @param {string} fileName 保存文件名、在mac上，文件名必须要写后缀，要不然下载会有问题、在window上可以忽略
 */
export function blobSaveFile(blobData: BlobPart, fileName: string) {
  // const contentType = mimeType[extension]
  // if (contentType === undefined) {
  //   console.warn(`没有找到${extension}类型的文件`)
  // }
  fileName = decodeURI(fileName)

  const blob = new Blob([blobData] /* , { type: contentType } */)

  // if ("msSaveOrOpenBlob" in window.navigator) {
  //   // ie使用的下载方式
  //   return window.navigator.msSaveOrOpenBlob(blob, fileName);
  // }
  // @ts-ignore
  if (window.navigator.msSaveOrOpenBlob) {
    // ie使用的下载方式
    // @ts-ignore
    return window.navigator.msSaveOrOpenBlob(blob, fileName)
  }

  const objectUrl = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = objectUrl
  // 注意、在mac上，文件名必须要写后缀，要不然下载会有问题、在window上可以忽略
  a.download = fileName

  // 下面这个写法兼容火狐
  a.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }))
  // window.URL.revokeObjectURL(blob);
  window.URL.revokeObjectURL(objectUrl)
}

const http = {
  request<T>(axiosConfig: AxiosRequestConfig): ResponseFilePromise | ResponsePromise<T> {
    return service(axiosConfig)
  },
  get<T = any>(url: string, params?: object, config?: AxiosRequestConfig): ResponsePromise<T> {
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
  post<T = any>(url: string, data?: object, config?: AxiosRequestConfig): ResponsePromise<T> {
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
  postJson<T = any>(url: string, data?: object, config?: AxiosRequestConfig): ResponsePromise<T> {
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
  postForm<T>(url: string, data?: object): ResponsePromise<T> {
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
  downloadFile(config: AxiosRequestConfig): ResponseFilePromise {
    // @ts-ignore
    return service({
      // 1s
      timeout: 60 * 1000,
      ...config,
      responseType: "blob",
    })
  },
  /** 下载文件并保存 */
  downloadFileSava(config: AxiosRequestConfig, defaultFileName?: string): ResponseFilePromise {
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

export declare type Http = typeof http

export default http
