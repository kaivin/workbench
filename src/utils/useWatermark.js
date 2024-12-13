const useWatermark = () => {
  const defaultSettings = {
    watermark_id: 'wm_div_id', // 水印总体的id
    watermark_prefix: 'mask_div_id', // 小水印的id前缀
    watermark_txt: '测试水印', // 水印的内容
    watermark_x: 40, // 水印起始位置x轴坐标
    watermark_y: 40, // 水印起始位置Y轴坐标
    watermark_rows: 0, // 水印行数
    watermark_cols: 0, // 水印列数
    watermark_x_space: 100, // 水印x轴间隔
    watermark_y_space: 100, // 水印y轴间隔
    watermark_font: '微软雅黑', // 水印字体
    watermark_color: 'black', // 水印字体颜色
    watermark_fontsize: '18px', // 水印字体大小
    watermark_alpha: 0.15, // 水印透明度，要求设置在大于等于0.005
    watermark_width: 100, // 水印宽度
    watermark_height: 100, // 水印长度
    watermark_angle: 15, // 水印倾斜度数
    watermark_parent_width: 0, // 水印的总体宽度（默认值：body的scrollWidth和clientWidth的较大值）
    watermark_parent_height: 0, // 水印的总体高度（默认值：body的scrollHeight和clientHeight的较大值）
    watermark_parent_node: null, // 水印插件挂载的父元素element,不输入则默认挂在body上
    monitor: true, // monitor 是否监控， true: 不可删除水印; false: 可删水印。
    autoSpace: false // 是否自适应水印间距，true: 行和列分别平分显示不完整个水印的剩余空间；false: 起始位置、轴间距按配置设置，列和行末显示不完整的水印
  }

  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

  let globalSetting
  let forceRemove = false
  // 监听dom是否被移除或者改变属性的回调函数
  const domChangeCallback = function (records) {
    if (forceRemove) {
      forceRemove = false
      return
    }
    if ((globalSetting && records.length === 1) || (records.length === 1 && records[0].removedNodes.length >= 1)) {
      loadMark(globalSetting)
    }
  }

  const hasObserver = MutationObserver !== undefined
  let watermarkDom = hasObserver ? new MutationObserver(domChangeCallback) : null
  const option = {
    'childList': true,
    'attributes': true,
    'subtree': true,
    'attributeFilter': ['style'],
    'attributeOldValue': true
  }
  const loadMark = settings => {
    const resultOptions = defaultSettings
    if (settings) {
      for (const key in settings) {
        if (settings[key] && resultOptions[key] && settings[key] === resultOptions[key]) continue
        /* veronic: resolution of watermark_angle=0 not in force*/ else if (settings[key] || settings[key] === 0 || settings[key] === null) resultOptions[key] = settings[key]
      }
    }
    globalSetting = resultOptions
    /* 如果元素存在则移除*/
    const watermark_element = document.getElementById(resultOptions.watermark_id)
    watermark_element && watermark_element.parentNode && watermark_element.parentNode.removeChild(watermark_element)

    /* 如果设置水印挂载的父元素的id*/
    const watermark_parent_element = resultOptions.watermark_parent_node && document.getElementById(resultOptions.watermark_parent_node)
    const watermark_hook_element = watermark_parent_element || document.body

    /* 获取页面宽度*/
    // var page_width = Math.max(watermark_hook_element.scrollWidth,watermark_hook_element.clientWidth) - resultOptions.watermark_width/2;
    const page_width = Math.max(watermark_hook_element.scrollWidth, watermark_hook_element.clientWidth)
    /* 获取页面最大长度*/
    // var page_height = Math.max(watermark_hook_element.scrollHeight,watermark_hook_element.clientHeight,document.documentElement.clientHeight)-resultOptions.watermark_height/2;
    const page_height = Math.max(watermark_hook_element.scrollHeight, watermark_hook_element.clientHeight)

    const parentEle = watermark_hook_element

    let page_offsetTop = 0
    let page_offsetLeft = 0
    if (resultOptions.watermark_parent_width || resultOptions.watermark_parent_height) {
      /* 指定父元素同时指定了宽或高*/
      if (parentEle) {
        page_offsetTop = parentEle.offsetTop || 0
        page_offsetLeft = parentEle.offsetLeft || 0
        resultOptions.watermark_x = resultOptions.watermark_x + page_offsetLeft
        resultOptions.watermark_y = resultOptions.watermark_y + page_offsetTop
      }
    } else {
      if (parentEle) {
        page_offsetTop = 0 // parentEle.offsetTop || 0
        page_offsetLeft = 0 // parentEle.offsetLeft || 0
      }
    }

    /* 创建水印外壳div*/
    let otdiv = document.getElementById(resultOptions.watermark_id)
    let shadowRoot = null

    if (!otdiv) {
      otdiv = document.createElement('div')
      /* 创建shadow dom*/
      otdiv.id = resultOptions.watermark_id
      otdiv.setAttribute('style', 'pointer-events: none !important; display: block !important; position: absolute; left:0; top:0; width: 100%; height: 100%; overflow: hidden;')
      /* 判断浏览器是否支持attachShadow方法*/
      if (typeof otdiv.attachShadow === 'function') {
        /* createShadowRoot Deprecated. Not for use in new websites. Use attachShadow*/
        shadowRoot = otdiv.attachShadow({ mode: 'open' })
      } else {
        shadowRoot = otdiv
      }
      /* 将shadow dom随机插入body内的任意位置*/
      const nodeList = watermark_hook_element.children
      const index = Math.floor(Math.random() * (nodeList.length - 1))
      if (nodeList[index]) {
        watermark_hook_element.insertBefore(otdiv, nodeList[index])
      } else {
        watermark_hook_element.appendChild(otdiv)
      }
    } else if (otdiv.shadowRoot) {
      shadowRoot = otdiv.shadowRoot
    }
    if (resultOptions.autoSpace) {
      /* 三种情况下会重新计算水印列数和x方向水印间隔：1、水印列数设置为0，2、水印宽度大于页面宽度，3、水印宽度小于于页面宽度*/
      resultOptions.watermark_cols = Math.floor((page_width - resultOptions.watermark_x) / (resultOptions.watermark_width + resultOptions.watermark_x_space))
      const temp_watermark_x_space = Math.floor((page_width - resultOptions.watermark_x - resultOptions.watermark_width * resultOptions.watermark_cols) / resultOptions.watermark_cols)
      resultOptions.watermark_x_space = temp_watermark_x_space ? resultOptions.watermark_x_space : temp_watermark_x_space

      /* 三种情况下会重新计算水印行数和y方向水印间隔：1、水印行数设置为0，2、水印长度大于页面长度，3、水印长度小于于页面长度*/
      resultOptions.watermark_rows = Math.floor((page_height - resultOptions.watermark_y) / (resultOptions.watermark_height + resultOptions.watermark_y_space))
      const temp_watermark_y_space = Math.floor((page_height - resultOptions.watermark_y - resultOptions.watermark_height * resultOptions.watermark_rows) / resultOptions.watermark_rows)
      resultOptions.watermark_y_space = temp_watermark_y_space ? resultOptions.watermark_y_space : temp_watermark_y_space
    } else {
      // 向上取整
      resultOptions.watermark_cols = Math.ceil((page_width - resultOptions.watermark_x) / (resultOptions.watermark_width + resultOptions.watermark_x_space))
      resultOptions.watermark_rows = Math.ceil((page_height - resultOptions.watermark_y) / (resultOptions.watermark_height + resultOptions.watermark_y_space))
    }
    let allWatermarkWidth
    let allWatermarkHeight

    if (watermark_parent_element) {
      allWatermarkWidth = resultOptions.watermark_x + resultOptions.watermark_width * resultOptions.watermark_cols + resultOptions.watermark_x_space * (resultOptions.watermark_cols - 1)
      allWatermarkHeight = resultOptions.watermark_y + resultOptions.watermark_height * resultOptions.watermark_rows + resultOptions.watermark_y_space * (resultOptions.watermark_rows - 1)
    } else {
      allWatermarkWidth = page_offsetLeft + resultOptions.watermark_x + resultOptions.watermark_width * resultOptions.watermark_cols + resultOptions.watermark_x_space * (resultOptions.watermark_cols - 1)
      allWatermarkHeight = page_offsetTop + resultOptions.watermark_y + resultOptions.watermark_height * resultOptions.watermark_rows + resultOptions.watermark_y_space * (resultOptions.watermark_rows - 1)
    }

    let x
    let y
    for (let i = 0; i < resultOptions.watermark_rows; i++) {
      if (watermark_parent_element) {
        y = page_offsetTop + resultOptions.watermark_y + (resultOptions.watermark_y_space + resultOptions.watermark_height) * i
      } else {
        if (resultOptions.autoSpace) {
          y = resultOptions.watermark_y + (page_height - allWatermarkHeight) / 2 + (resultOptions.watermark_y_space + resultOptions.watermark_height) * i
        } else {
          y = resultOptions.watermark_y + (resultOptions.watermark_y_space + resultOptions.watermark_height) * i
        }
      }
      for (let j = 0; j < resultOptions.watermark_cols; j++) {
        if (watermark_parent_element) {
          x = page_offsetLeft + resultOptions.watermark_x + (page_width - allWatermarkWidth) / 2 + (resultOptions.watermark_width + resultOptions.watermark_x_space) * j
        } else {
          if (resultOptions.autoSpace) {
            x = resultOptions.watermark_x + (page_width - allWatermarkWidth) / 2 + (resultOptions.watermark_width + resultOptions.watermark_x_space) * j
          } else {
            x = resultOptions.watermark_x + (resultOptions.watermark_width + resultOptions.watermark_x_space) * j
          }
        }
        const mask_div = document.createElement('div')
        const son_div = document.createElement('div')
        son_div.innerHTML = defaultSettings.watermark_txt
        son_div.style.fontSize = resultOptions.watermark_fontsize
        son_div.style.fontFamily = resultOptions.watermark_font
        son_div.style.color = resultOptions.watermark_color
        son_div.style.overflow = 'hidden'
        son_div.style.textAlign = 'center'
        son_div.style.width = resultOptions.watermark_width + 'px'
        son_div.style.height = resultOptions.watermark_height + 'px'
        son_div.style.display = 'block'

        mask_div.appendChild(son_div)
        /* 设置水印相关属性start*/
        mask_div.id = resultOptions.watermark_prefix + i + j
        /* 设置水印div倾斜显示*/
        mask_div.style.transform = 'rotate(-' + resultOptions.watermark_angle + 'deg)'
        mask_div.style.visibility = ''
        mask_div.style.position = 'absolute'
        /* 选不中*/
        mask_div.style.left = x + 'px'
        mask_div.style.top = y + 'px'
        mask_div.style.overflow = 'hidden'
        mask_div.style.zIndex = '9999999'
        mask_div.style.opacity = resultOptions.watermark_alpha.toString()
        mask_div.style.width = resultOptions.watermark_width + 'px'
        mask_div.style.height = resultOptions.watermark_height + 'px'
        mask_div.style.display = 'block'
        mask_div.style['-ms-user-select'] = 'none'
        /* 设置水印相关属性end*/
        shadowRoot.appendChild(mask_div)
      }
    }

    // monitor 是否监控， true: 不可删除水印; false: 可删水印。
    if (resultOptions.monitor && hasObserver) {
      watermarkDom.observe(watermark_hook_element, option)
      if (resultOptions.watermark_id) {
        watermarkDom.observe(document.getElementById(resultOptions.watermark_id)?.shadowRoot, option)
      }
    }
  }
  /* 移除水印*/
  const removeMark = () => {
    /* 移除水印*/
    const watermark_element = document.getElementById(globalSetting.watermark_id)
    const _parentElement = watermark_element?.parentNode
    _parentElement?.removeChild(watermark_element)
    // :ambulance: remove()
    // minotor 这个配置有些冗余
    // 如果用 MutationObserver 来监听dom变化防止删除水印
    // remove() 方法里用 MutationObserver 的 disconnect() 解除监听即可
    watermarkDom.disconnect()
  }
  const removeWatermark = () => {
    forceRemove = true
    removeMark()
  }
  // 监听dom是否被移除或者改变属性的回调函数
  const callback = function (records) {
    if ((globalSetting && records.length === 1) || (records.length === 1 && records[0].removedNodes.length >= 1)) {
      loadMark(globalSetting)
      return
    }
    // 监听父节点的尺寸是否发生了变化, 如果发生改变, 则进行重新绘制
    const watermark_parent_element = defaultSettings.watermark_parent_node && document.getElementById(defaultSettings.watermark_parent_node)
    if (watermark_parent_element) {
      const newWidth = parseInt(getComputedStyle(watermark_parent_element).getPropertyValue('width'))
      const newHeight = parseInt(getComputedStyle(watermark_parent_element).getPropertyValue('height'))
      if (newWidth !== recordOldValue.width || newHeight !== recordOldValue.height) {
        recordOldValue.width = newWidth
        recordOldValue.height = newHeight
        loadMark(globalSetting)
      }
    }
  }
  watermarkDom = new MutationObserver(callback)
  const recordOldValue = {
    width: 0,
    height: 0
  }
  const loadWatermark = settings => {
    loadMark(settings)
    window.addEventListener('resize', () => {
      loadMark(settings)
    })
  }
  return {
    loadWatermark,
    removeWatermark
  }
}
export default useWatermark
