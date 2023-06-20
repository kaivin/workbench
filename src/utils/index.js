/**
 * Created by PanJiaChen on 16/11/18.
 */
export const pickerRangeOptions = {
  shortcuts: [{
    text: '今天',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      //start.setTime(start.getTime() - 3600 * 1000 * 24 * 9);
      picker.$emit('pick', [start, end]);
    }
  },{
    text: '昨天',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
      end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      end.setTime(end.getTime() + 3600 * 1000 * 24 * 1);
      picker.$emit('pick', [start, end]);
    }
  }, {
      text: '上月',
      onClick(picker) {
        var date = new Date();
        var year = date.getFullYear().toString();
        //获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
        var month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1).toString():(date.getMonth()+1).toString();
        var end = year + '-' + month + '-01';
        var start = '';
       
        if(month == '01'){
          start = (parseInt(year) - 1) + '-12-01';
        }else{
          start = parseInt(month) - 1>9 ? year + '-' + (parseInt(month) - 1)  + '-01':year + '-0' + (parseInt(month) - 1)  + '-01';
        }
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '本月',
      onClick(picker) {
        var date = new Date();
        var year = date.getFullYear().toString();
        //获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
        var month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1).toString():(date.getMonth()+1).toString();
        var end = '';
        var start = year + '-' + month + '-01';
        if(month == '12'){
          end = (parseInt(year) + 1) + '-01-01';
        }else{
          end = parseInt(month) + 1>9 ? year + '-' + (parseInt(month) + 1)  + '-01':year + '-0' + (parseInt(month) + 1)  + '-01';
        }
        picker.$emit('pick', [start, end]);
      }
    }]
}

/**
 * 日期选择：最近一个月、上月、本月
 */
 export const pickerDateRangeOptions = {
    shortcuts: [{
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            end.setTime(end.getTime());
            picker.$emit('pick', [start, end]);
          }
        }, {
            text: '上月',
            onClick(picker) {
              var date = new Date();
              var year = date.getFullYear().toString();
              //获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
              var month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1).toString():(date.getMonth()+1).toString();
              var endtime = year + '/' + month + '/01';
              endtime = new Date(endtime).getTime() - 1000*60*60*24;
              endtime = new Date(endtime).getDate();
              var start = '';
              var end = '';
              if(month == '01'){
                start = (parseInt(year) - 1) + '/12/01';
                end = (parseInt(year) - 1)+'/12/'+ endtime;
              }else{
                if(parseInt(month) - 1>9){
                  start = year + '/' + (parseInt(month) - 1)  + '/01';
                  end = parseInt(endtime) < 10 ? year + '/' + (parseInt(month) - 1)  + '/0'+endtime : year + '/' + (parseInt(month) - 1)  + '/'+endtime;
                }else{
                  start = year + '/0' + (parseInt(month) - 1)  + '/01';
                  end = parseInt(endtime) < 10 ? year + '/0' + (parseInt(month) - 1)  + '/0'+endtime : year + '/0' + (parseInt(month) - 1)  + '/'+endtime;
                }
                
              }
              
              picker.$emit('pick', [start, end]);
            }
        }, {
          text: '本月',
          onClick(picker) {
            var date = new Date();
            var year = date.getFullYear().toString();
            //获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
            var month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1).toString():(date.getMonth()+1).toString();
            var end = '';
            var endmonth = date.getMonth() + 1 == 12 ? 1 : date.getMonth()+2;
            endmonth = parseInt(endmonth) > 9 ? endmonth : '0' + endmonth;
            var endday = new Date(year + '/' + endmonth + '/01').getTime() - 1000*60*60*24;
            endday = new Date(endday).getDate();
            var start = year + '/' + month + '/01';
            end = parseInt(endday) < 10 ? year + '/' + month  + '/0' + endday : year + '/' + month  + '/' + endday;
            picker.$emit('pick', [start, end]);
          }
    }]
}

/**
 * 日期选择:今天、昨天、最近一个月、上月、本月(2)
 */
export const pickerDayRangeOptions = {
  shortcuts: [{
    text: '今天',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      //start.setTime(start.getTime() - 3600 * 1000 * 24 * 9);
      picker.$emit('pick', [start, end]);
    }
  },{
    text: '昨天',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
      end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
      picker.$emit('pick', [start, end]);
    }
  },{
    text: '最近一个月',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      end.setTime(end.getTime());
      picker.$emit('pick', [start, end]);
    }
  }, {
      text: '上月',
      onClick(picker) {
        var date = new Date();
        var year = date.getFullYear().toString();
        //获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
        var month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1).toString():(date.getMonth()+1).toString();
        var endtime = year + '/' + month + '/01';
        endtime = new Date(endtime).getTime() - 1000*60*60*24;
        endtime = new Date(endtime).getDate();
        var start = '';
        var end = '';
        if(month == '01'){
          start = (parseInt(year) - 1) + '-12-01';
          end = (parseInt(year) - 1)+'-12-'+ endtime;
        }else{
          if(parseInt(month) - 1>9){
            start = year + '-' + (parseInt(month) - 1)  + '-01';
            end = parseInt(endtime) < 10 ? year + '-' + (parseInt(month) - 1)  + '-0'+endtime : year + '-' + (parseInt(month) - 1)  + '-'+endtime;
          }else{
            start = year + '-0' + (parseInt(month) - 1)  + '-01';
            end = parseInt(endtime) < 10 ? year + '-0' + (parseInt(month) - 1)  + '-0'+endtime : year + '-0' + (parseInt(month) - 1)  + '-'+endtime;
          }
          
        }
        
        picker.$emit('pick', [start, end]);
      }
  }, {
    text: '本月',
    onClick(picker) {
      var date = new Date();
      var year = date.getFullYear().toString();
      //获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
      var month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1).toString():(date.getMonth()+1).toString();
      var end = '';
      var endmonth = date.getMonth() + 1 == 12 ? 1 : date.getMonth()+2;
      endmonth = parseInt(endmonth) > 9 ? endmonth : '0' + endmonth;
      var endday = new Date(year + '/' + endmonth + '/01').getTime() - 1000*60*60*24;
      endday = new Date(endday).getDate();
      var start = year + '-' + month + '-01';
      end = parseInt(endday) < 10 ? year + '-' + month  + '-0' + endday : year + '-' + month  + '-' + endday;
      picker.$emit('pick', [start, end]);
    }
  }]
}

/**
 * 日期选择：最近一个月、上月、本月
 */
 export const pickerDateRangeMonthOptions = {
    shortcuts: [{
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            end.setTime(end.getTime());
            picker.$emit('pick', [start, end]);
          }
        }, {
            text: '上月',
            onClick(picker) {
              var date = new Date();
              var year = date.getFullYear().toString();
              //获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
              var month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1).toString():(date.getMonth()+1).toString();
              var endtime = year + '/' + month + '/01';
              endtime = new Date(endtime).getTime() - 1000*60*60*24;
              endtime = new Date(endtime).getDate();
              var start = '';
              var end = '';
              if(month == '01'){
                start = (parseInt(year) - 1) + '/12/01';
                end = (parseInt(year) - 1)+'/12/'+ endtime;
              }else{
                if(parseInt(month) - 1>9){
                  start = year + '/' + (parseInt(month) - 1)  + '/01';
                  end = parseInt(endtime) < 10 ? year + '/' + (parseInt(month) - 1)  + '/0'+endtime : year + '/' + (parseInt(month) - 1)  + '/'+endtime;
                }else{
                  start = year + '/0' + (parseInt(month) - 1)  + '/01';
                  end = parseInt(endtime) < 10 ? year + '/0' + (parseInt(month) - 1)  + '/0'+endtime : year + '/0' + (parseInt(month) - 1)  + '/'+endtime;
                }
                
              }
              
              picker.$emit('pick', [start, end]);
            }
        }, {
          text: '本月',
          onClick(picker) {
            var date = new Date();
            var year = date.getFullYear().toString();
            //获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
            var month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1).toString():(date.getMonth()+1).toString();
            var end = '';
            var endmonth = date.getMonth() + 1 == 12 ? 1 : date.getMonth()+2;
            endmonth = parseInt(endmonth) > 9 ? endmonth : '0' + endmonth;
            var endday = new Date(year + '/' + endmonth + '/01').getTime() - 1000*60*60*24;
            endday = new Date(endday).getDate();
            var start = year + '/' + month + '/01';
            end = parseInt(endday) < 10 ? year + '/' + month  + '/0' + endday : year + '/' + month  + '/' + endday;
            picker.$emit('pick', [start, end]);
          }
    },{
      text: '今年至今',
      onClick(picker) {
        const end = new Date();
        const start = new Date(new Date().getFullYear(), 0);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '最近六个月',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 5);
        picker.$emit('pick', [start, end]);
      }
    }]
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
 export function parseTime(time, cFormat) {
    if (arguments.length === 0 || !time) {
      return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if ((typeof time === 'string')) {
        if ((/^[0-9]+$/.test(time))) {
          // support "1548221490638"
          time = parseInt(time)
        } else {
          // support safari
          // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
          time = time.replace(new RegExp(/-/gm), '/')
        }
      }
  
      if ((typeof time === 'number') && (time.toString().length === 10)) {
        time = time * 1000
      }
      date = new Date(time)
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
      const value = formatObj[key]
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
      return value.toString().padStart(2, '0')
    })
    return time_str
  }
  
  /**
   * @param {number} time
   * @param {string} option
   * @returns {string}
   */
  export function formatTime(time, option) {
    if (('' + time).length === 10) {
      time = parseInt(time) * 1000
    } else {
      time = +time
    }
    const d = new Date(time)
    const now = Date.now()
  
    const diff = (now - d) / 1000
  
    if (diff < 30) {
      return '刚刚'
    } else if (diff < 3600) {
      // less 1 hour
      return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
      return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
      return '1天前'
    }
    if (option) {
      return parseTime(time, option)
    } else {
      return (
        d.getMonth() +
        1 +
        '月' +
        d.getDate() +
        '日' +
        d.getHours() +
        '时' +
        d.getMinutes() +
        '分'
      )
    }
  }
  
  /**
   * @param {string} url
   * @returns {Object}
   */
  export function getQueryObject(url) {
    url = url == null ? window.location.href : url
    const search = url.substring(url.lastIndexOf('?') + 1)
    const obj = {}
    const reg = /([^?&=]+)=([^?&=]*)/g
    search.replace(reg, (rs, $1, $2) => {
      const name = decodeURIComponent($1)
      let val = decodeURIComponent($2)
      val = String(val)
      obj[name] = val
      return rs
    })
    return obj
  }
  
  /**
   * @param {string} input value
   * @returns {number} output value
   */
  export function byteLength(str) {
    // returns the byte length of an utf8 string
    let s = str.length
    for (var i = str.length - 1; i >= 0; i--) {
      const code = str.charCodeAt(i)
      if (code > 0x7f && code <= 0x7ff) s++
      else if (code > 0x7ff && code <= 0xffff) s += 2
      if (code >= 0xDC00 && code <= 0xDFFF) i--
    }
    return s
  }
  
  /**
   * @param {Array} actual
   * @returns {Array}
   */
  export function cleanArray(actual) {
    const newArray = []
    for (let i = 0; i < actual.length; i++) {
      if (actual[i]) {
        newArray.push(actual[i])
      }
    }
    return newArray
  }
  
  /**
   * @param {Object} json
   * @returns {Array}
   */
  export function param(json) {
    if (!json) return ''
    return cleanArray(
      Object.keys(json).map(key => {
        if (json[key] === undefined) return ''
        return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
      })
    ).join('&')
  }
  
  /**
   * @param {string} url
   * @returns {Object}
   */
  export function param2Obj(url) {
    const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
    if (!search) {
      return {}
    }
    const obj = {}
    const searchArr = search.split('&')
    searchArr.forEach(v => {
      const index = v.indexOf('=')
      if (index !== -1) {
        const name = v.substring(0, index)
        const val = v.substring(index + 1, v.length)
        obj[name] = val
      }
    })
    return obj
  }
  
  /**
   * @param {string} val
   * @returns {string}
   */
  export function html2Text(val) {
    const div = document.createElement('div')
    div.innerHTML = val
    return div.textContent || div.innerText
  }
  
  /**
   * Merges two objects, giving the last one precedence
   * @param {Object} target
   * @param {(Object|Array)} source
   * @returns {Object}
   */
  export function objectMerge(target, source) {
    if (typeof target !== 'object') {
      target = {}
    }
    if (Array.isArray(source)) {
      return source.slice()
    }
    Object.keys(source).forEach(property => {
      const sourceProperty = source[property]
      if (typeof sourceProperty === 'object') {
        target[property] = objectMerge(target[property], sourceProperty)
      } else {
        target[property] = sourceProperty
      }
    })
    return target
  }
  
  /**
   * @param {HTMLElement} element
   * @param {string} className
   */
  export function toggleClass(element, className) {
    if (!element || !className) {
      return
    }
    let classString = element.className
    const nameIndex = classString.indexOf(className)
    if (nameIndex === -1) {
      classString += '' + className
    } else {
      classString =
        classString.substr(0, nameIndex) +
        classString.substr(nameIndex + className.length)
    }
    element.className = classString
  }
  
  /**
   * @param {string} type
   * @returns {Date}
   */
  export function getTime(type) {
    if (type === 'start') {
      return new Date().getTime() - 3600 * 1000 * 24 * 90
    } else {
      return new Date(new Date().toDateString())
    }
  }
  
  /**
   * @param {Function} func
   * @param {number} wait
   * @param {boolean} immediate
   * @return {*}
   */
  export function debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result
  
    const later = function() {
      // 据上一次触发时间间隔
      const last = +new Date() - timestamp
  
      // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last)
      } else {
        timeout = null
        // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
        if (!immediate) {
          result = func.apply(context, args)
          if (!timeout) context = args = null
        }
      }
    }
  
    return function(...args) {
      context = this
      timestamp = +new Date()
      const callNow = immediate && !timeout
      // 如果延时不存在，重新设定延时
      if (!timeout) timeout = setTimeout(later, wait)
      if (callNow) {
        result = func.apply(context, args)
        context = args = null
      }
  
      return result
    }
  }
  
  /**
   * This is just a simple version of deep copy
   * Has a lot of edge cases bug
   * If you want to use a perfect deep copy, use lodash's _.cloneDeep
   * @param {Object} source
   * @returns {Object}
   */
  export function deepClone(source) {
    if (!source && typeof source !== 'object') {
      throw new Error('error arguments', 'deepClone')
    }
    const targetObj = source.constructor === Array ? [] : {}
    Object.keys(source).forEach(keys => {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    })
    return targetObj
  }
  
  /**
   * @param {Array} arr
   * @returns {Array}
   */
  export function uniqueArr(arr) {
    return Array.from(new Set(arr))
  }
  
  /**
   * @returns {string}
   */
  export function createUniqueString() {
    const timestamp = +new Date() + ''
    const randomNum = parseInt((1 + Math.random()) * 65536) + ''
    return (+(randomNum + timestamp)).toString(32)
  }
  
  /**
   * Check if an element has a class
   * @param {HTMLElement} elm
   * @param {string} cls
   * @returns {boolean}
   */
  export function hasClass(ele, cls) {
    return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
  }
  
  /**
   * Add class to element
   * @param {HTMLElement} elm
   * @param {string} cls
   */
  export function addClass(ele, cls) {
    if (!hasClass(ele, cls)) ele.className += ' ' + cls
  }
  
  /**
   * Remove class from element
   * @param {HTMLElement} elm
   * @param {string} cls
   */
  export function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
      const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
      ele.className = ele.className.replace(reg, ' ')
    }
  }
// 随机数
export function randomString(len) {
　　len = len || 32;
　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (var i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}
// 正序排列
export function sortByAsc(i){
  return function(a,b){
    return a[i] - b[i]
  }
}
// 倒序排列
export function sortByDesc(i){
  return function(a,b){
    return b[i] - a[i]
  }
}
// 部门、小组图表主题色添加
export function groupColor(groupArr){
  var colorArr = ["#2259e5","#3ebea7","#eca12d","#ee4747","#73c0de","#91cb74","#ff8d61","#9a60b4","#e522db","#e5d822"]
  groupArr.forEach(function(item,index){
    item.forEach(function(item1,index1){
      item1.color = colorArr[index]
    })
  });
  return groupArr;
}
// 日期对比情况下的两个数组的图表主题色添加
export function groupDateColor(groupArr){
  var colorArr = ["#2259e5","#3ebea7"]
  groupArr.forEach(function(item,index){
    item.forEach(function(item1,index1){
      item1.color = colorArr[index]
    })
  });
  return groupArr;
}
// 单一数组的图表主题色添加
export function singleArrColor(dataArr){
  var colorArr = ["#2259e5","#3ebea7","#eca12d","#ee4747","#73c0de","#91cb74","#ff8d61","#9a60b4","#e522db","#e5d822","#5470c6","#fc8452","#fac858","#ee6666"]
  dataArr.forEach(function(item,index){
    item.color = colorArr[index]
  });
  return dataArr;
}
// 单一数组的图表主题色添加
export function singleNewArrColor(dataArr){
  var colorArr = ["#2259e5","#3ebea7","#eca12d","#ee4747","#73c0de","#91cb74","#ff8d61","#9a60b4","#e522db","#e5d822"]
  var newData = [];
  dataArr.forEach(function(item,index){
    var itemData = {};
    itemData.color = colorArr[index];
    itemData.data = item;
    newData.push(itemData);
  });
  return newData;
}
// 组员的图表主题色添加
export function memberArrColor(dataArr){
  var colorArr = ["#2259e5","#3ebea7","#eca12d","#ee4747","#73c0de","#91cb74","#ff8d61","#9a60b4","#e522db","#e5d822"]
  var newData = [];
  dataArr.forEach(function(item,index){
    var itemData = {};
    itemData.name = item;
    itemData.memberColor = colorArr[index];
    newData.push(itemData);
  });
  return newData;
}
// 日期连接符转换方法
export function formatDate(date,oldVal,newVal){
  var dateStr = "";
  var timeStr = "";
  if(date.indexOf(" ")!=-1){
    dateStr = date.split(" ")[0];
    timeStr = date.split(" ")[1];
  }else{
    dateStr = date;
  }
  var dateArr = dateStr.split(oldVal);
  var newDate = "";
  if(dateArr.length==2){
    newDate = dateArr[0]+newVal+dateArr[1];
  }else{
    newDate = dateArr[0]+newVal+dateArr[1]+newVal+dateArr[2];
  }
  if(timeStr!=''){
    newDate = newDate + " " + timeStr;
  }
  return newDate;
}

// 数字三位分隔
export function numSeparate(val){
  var newNum = "" + val;
  var intNum = "";
  var floatNum = "";
  if(newNum.indexOf(".")!=-1){
    intNum = newNum.split(".")[0];
    floatNum = newNum.split(".")[1];
  }else{
    intNum = newNum;
  }
  intNum = intNum.split('').reverse().join('') // 翻转整数
  let temp = '' // 临时变量
  for (let i = 0; i < intNum.length; i++) {
    temp += intNum[i]
    if ((i + 1) % 3 === 0 && i !== intNum.length - 1) {
      temp += ',' // 每隔3个数字拼接一个逗号
    }
  }
  temp = temp.split('').reverse().join('') // 加完逗号之后翻转
  if(floatNum!=''){
    temp = temp + '.' + floatNum // 整数小数拼接
  }
  return temp // 返回
}

// 排名中，数值相同排名并列，按总数据量排名
export function rankingWithTotalItem(dataArr,key){
  let preValue = 0; // 预定义数值
  let ranking = 0; // 排名
  let same = 0; // 是否相同
  dataArr.forEach((item,index)=>{
      if(item[key]==preValue && ranking != 0){
          item.ranking = ranking;
          same++;
      }else{
          ranking = ranking + same;
          ranking++;
          preValue = item[key];
          same=0;
          item.ranking = ranking;
      }
  })
  return dataArr;
}


// 排名中，数值相同排名并列，按升序排名
export function rankingWithAsc(dataArr,key){
  let preValue = 0; // 预定义数值
  let ranking = 0; // 排名
  dataArr.forEach((item,index)=>{
      if(item[key]==preValue){
          item.ranking = ranking;
      }else{
          ranking++;
          preValue = item[key];
          item.ranking = ranking;
      }
  });
  return dataArr;
}

// 图标数据按日期进行排序

export function sortByDate(dataArr,key){
  return dataArr.sort(function(a,b){
    return Date.parse(a[key].replace(/-/g,'/'))-Date.parse(b[key].replace(/-/g,'/'));
  })
}
// 比较两个时间的大小
export function compareDate(date1,date2){
    var oDate1 = new Date(date1);
    var oDate2 = new Date(date2);
    if(oDate1.getTime() > oDate2.getTime()){
        return true; //第一个大
    } else {
        return false; //第二个大
    }
}