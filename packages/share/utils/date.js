/**
 * 日期时间格式库
 * @author zhoufei
 */

function zeroize (n) {
  return Number(n) >= 10 ? n : '0' + n
}

/**
 * new Date
 * @param date
 */
function newDate (date = new Date()) {
  if (Object.prototype.toString.call(date) === '[object Date]') {
    return date
  } else if (Number(date)) {
    return new Date(Number(date))
  } else if (typeof date === 'string') {
    // 在ios上必须要用 YYYY/MM/DD 的格式
    date = date.replace(new RegExp(/-/gm), '/')
    // 在ie浏览器中还必须补零 new Date('2020-01')可以， new Date('2020/1')不可以
    return new Date(date)
  } else {
    return new Date(date)
  }
}

function isEmpty (v) {
  return v === '' || v === undefined || v === null
}

/**
 * 按所给的时间格式输出指定的时间
 * @param {Date|Number|String} data
 * @param {string} format 格式化字符串
 * @return {string} 格式化的时间
 * @example formatDate(new Date(1409894060000), 'yyyy-MM-dd HH:mm:ss 星期w') ==> "2014-09-05 13:14:20 星期五"
 * 格式说明
  对于 2014.09.05 13:14:20
  yyyy: 年份，2014
  yy: 年份，14
  MM: 月份，补满两位，09
  M: 月份, 9
  dd: 日期，补满两位，05
  d: 日期, 5
  HH: 24制小时，补满两位，13
  H: 24制小时，13
  hh: 12制小时，补满两位，01
  h: 12制小时，1
  mm: 分钟，补满两位，14
  m: 分钟，14
  ss: 秒，补满两位，20
  s: 秒，20
*/
function formatDate (date, format = 'yyyy/MM/dd HH:mm') {
  if (isEmpty(date)) return '-'
  if (date) var tmpDate = newDate(date)
  if (String(tmpDate) === 'Invalid Date') return date
  date = tmpDate
  var y = date.getFullYear()
  var obj = {
    M: date.getMonth() + 1, // 0 ~ 11
    d: date.getDate(), // 1 ~ 31
    H: date.getHours(), // 0 ~ 23
    h: date.getHours() % 12,
    m: date.getMinutes(), // 0 ~ 59
    s: date.getSeconds(), // 0 ~ 59
    w: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()] // 0 ~ 6
  }
  format = format.replace(/yy(yy)?/, function (_, v) {
    return v ? y + '' : (y + '').slice(-2)
  })
  for (var key in obj) {
    // format = format.replace(new RegExp(`${key}(${key})?`), (_, v) => v ? zeroize(obj[key]) : obj[key])
    var reg = new RegExp(key + '(' + key + ')?')
    format = format.replace(reg, function (_, v) {
      return v ? zeroize(obj[key]) : obj[key]
    })
  }
  return format
}

/**
 * 格式化时间，转化为几分钟前，几秒钟前
 * @param {date|number|string} date 时间
 */
function howLongAgoFormat (date) {
  var mistiming = Math.round((Date.now() - newDate(date).getTime()) / 1000)
  if (mistiming < 0) {
    throw new Error('传入的时间大于当前时间了')
  }
  if (mistiming < 1) return '刚刚'
  var arrr = ['年', '个月', '星期', '天', '小时', '分钟', '秒']
  var arrn = [31536000, 2592000, 604800, 86400, 3600, 60, 1]
  for (var i = 0; i < arrn.length; i++) {
    var inm = Math.floor(mistiming / arrn[i])
    if (inm !== 0) {
      return inm + arrr[i] + '前'
    }
  }
}

/**
 * 得到00:00点的日期 2020/1/2 13:00:01 ==> 2020/1/2 00:00:00
 * @param {*} date
 */
function get00Date (date) {
  const rDate = newDate(date)
  // 时 分 秒 豪秒
  rDate.setHours(0)
  rDate.setMinutes(0)
  rDate.setSeconds(0)
  rDate.setMilliseconds(0)

  return rDate
}

/**
 * 转换为最近时间
 * @param {*} date
 * @param {*} simplify 是否简化
 */
function toLastTime (date, simplify) {
  const rDate = newDate(date)
  if (String(rDate) === 'Invalid Date') return date
  const timestamp = rDate.getTime()
  const currDate = new Date()
  // 当天时间00点时间戳
  const curr00Date = get00Date(currDate)
  const curr00DTimestamp = curr00Date.getTime()
  // 一天时间戳
  const dayTimestamp = 24 * 60 * 60 * 1000
  //  大于这个时间戳就可以显示前面的
  const arr = [
    {
      fmt: 'HH:mm',
      val: curr00DTimestamp
    },
    {
      fmt: '昨天 HH:mm',
      val: curr00DTimestamp - dayTimestamp
    },
    {
      fmt: '星期w HH:mm',
      fmtS: '星期w',
      val: curr00DTimestamp - dayTimestamp * currDate.getDay() // 获取到周一的时间戳
    }
  ]

  for (var i = 0; i < arr.length; i++) {
    if (timestamp >= arr[i].val) {
      return formatDate(
        rDate,
        simplify ? arr[i].fmtS || arr[i].fmt : arr[i].fmt
      )
    }
  }
  return formatDate(rDate, simplify ? 'yyyy/MM/dd' : 'yyyy年MM月dd日 HH:mm')
}

export { newDate, formatDate, howLongAgoFormat, toLastTime }
