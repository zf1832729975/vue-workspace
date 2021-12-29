export * from "./date"

/**
 * blob 数据保存为文件
 * @param {*} blobData blob数据
 * @param {string} fileName 保存文件名、在mac上，文件名必须要写后缀，要不然下载会有问题、在window上可以忽略
 */
export function blobSaveFile(blobData, fileName) {
  // const contentType = mimeType[extension]
  // if (contentType === undefined) {
  //   console.warn(`没有找到${extension}类型的文件`)
  // }
  fileName = decodeURI(fileName)

  const blob = new Blob([blobData] /* , { type: contentType } */)

  if ("msSaveOrOpenBlob" in window.navigator) {
    // ie使用的下载方式
    return window.navigator.msSaveOrOpenBlob(blob, fileName)
  }

  const objectUrl = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = objectUrl
  // 注意、在mac上，文件名必须要写后缀，要不然下载会有问题、在window上可以忽略
  a.download = fileName

  // 下面这个写法兼容火狐
  a.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }))
  window.URL.revokeObjectURL(objectUrl)
}

const _toString = Object.prototype.toString

export function isRegExp(v) {
  return _toString.call(v) === "[object RegExp]"
}

/**
 * 是否是原生Object对象
 * @param {any} obj
 */
export function isPlainObject(obj) {
  return _toString.call(obj) === "[object Object]"
}

export function isFormData(v) {
  return _toString.call(v) === "[object FormData]"
}

export function isObject(v) {
  return v !== null && typeof v === "object"
}

/**
 * 是否是空、
 * @param {*} v
 */
export function isEmpty(v) {
  return v === undefined || v === "" || v === null || (typeof v === "object" && !Object.keys(v).length)
}

export function isDef(v) {
  return v !== undefined && v !== null
}

/**
 * 遍历器
 * @param {Array|Object} obj
 * @param {(value: any, key: number|string ) => void} iterator
 */
export function forEach(obj, iterator) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const key = i
      iterator(obj[key], key)
    }
  } else {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      iterator(obj[key], key)
    }
  }
}

/**
 * 默认值合并
 * 对后端返回的数据进行合并,后端返回的是 '' null 进行合并，设置默认值
 */
export function defaultMerge(target, defautlObj) {
  target = target || {}
  for (let key in defautlObj) {
    const value = defautlObj[key]
    if (typeof value === "object" && value !== null) {
      // object
      if (!target[key]) target[key] = value.constructor()
      defaultMerge(target[key], value)
    } else if (isEmpty(target[key])) {
      target[key] = value
    }
  }
  return target
}

/**
 * 节流
 */
export function throttle(fn, interval = 200) {
  let timer = null
  return function () {
    if (timer === null) {
      const context = this
      let args = [...arguments]
      timer = setTimeout(function () {
        fn.apply(context, args)
        timer = null
      }, interval)
    }
  }
}

/*
 * 防抖
 * @param {function} fn
 * @param {number} delay 延迟
 */
export function debounce(fn, delay = 500) {
  let timeout = null
  return function () {
    if (timeout) clearTimeout(timeout)

    let context = this
    let args = [...arguments]

    timeout = setTimeout(function () {
      fn.apply(context, args)
      timeout = null
    }, delay)
  }
}

/**
 * 滚动到指定位置
 */
const cubic = (value) => Math.pow(value, 3)
// 慢慢变大，这是一个比率 0 ~ 1
const easeInOutCubic = (value) => (value < 0.5 ? cubic(value * 2) / 2 : 1 - cubic((1 - value) * 2) / 2)
export function scrollByTop(
  /** 滚动容器 */
  el,
  /** 需要滚动到的地址 */ toOffsetTop,
  callback
) {
  const beginTime = Date.now()
  const beginValue = el.scrollTop
  const len = toOffsetTop - el.scrollTop

  const rAF = window.requestAnimationFrame || ((func) => setTimeout(func, 16))
  const frameFunc = () => {
    const progress = (Date.now() - beginTime) / 500
    if (progress < 1) {
      const result = beginValue + len * easeInOutCubic(progress)
      // 100 ==> 1000
      // len = 900
      // 100 + 200 len *  900/200
      // 100 + 300 len *
      // 100 + 900 len * 1
      el.scrollTop = result

      rAF(frameFunc)
    } else {
      el.scrollTop = toOffsetTop
      callback && callback()
    }
  }
  rAF(frameFunc)
}
