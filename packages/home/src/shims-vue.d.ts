import Vue from "vue"
import { Http } from "./utils/request/index.d"

import * as api from "./api"

declare module "*.vue" {
  export default Vue
}

declare type Api = typeof api

declare module "vue/types/vue" {
  interface Vue {
    /** axios 请求方法 */
    $http: Http
    /** json 拷贝 */
    $jsonCopy: <T>(data: T) => T

    /** 处理文件路径问题、拼接完整的文件路径 */
    $resolvePath: (path: string) => string

    $api: Api
  }
}
