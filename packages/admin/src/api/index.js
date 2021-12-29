import { http } from "@/utils"

/**
 * 获取扶持主题列表
 * @param {*} keyword  查询关键字-主题名
 */
export function getThemeList(keyword) {
  return http.post("/api-backstand/foundation/selelctSupportList", {
    name: keyword || "",
  })
}

/**
 *
 * 获取 资助方式
 */
export function getPolicyFundingList() {
  return http.post("/api-backstand/policy/selectPolicyFundingList")
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return http.get("/api-user/users/currentAdmin")
}
