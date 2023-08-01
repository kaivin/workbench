import request from "@/utils/request";

// 获取指定菜单下的所有权限数据
export function getMenuPermit(data) {
  return request({
    url: "/hxindex/Api/getmenupermit",
    method: "POST",
    data
  });
}
//用户头像上传
export function setUserHeadimg(data) {
  return request({
    url: "/hxindex/User/headimg",
    method: "POST",
    data
  });
}
// 根据用户id获取用户详细信息
export function getUserInfo(data) {
  return request({
    url: "/hxindex/Api/getpersoninfo",
    method: "POST",
    data
  });
}
// 根据当前登录用户获取其可分配的用户数据，角色分配用户时使用
export function getUser() {
  return request({
    url: "/hxindex/Api/getmyuser",
    method: "POST",
  });
}
// 获取职位数据
export function getWorkName() {
  return request({
    url: "/hxindex/Api/getworkname",
    method: "POST",
  });
}
// 获取职称数据
export function getPostionName() {
  return request({
    url: "/hxindex/Api/getpostion",
    method: "POST",
  });
}
// 用户登陆获取权限菜单
export function getRoute() {
    return request({
      url: "/hxindex/Api/getmenu",
      method: "POST",
    });
}
// 获取登陆用户指定菜单页面操作按钮权限
export function getMenuButtonPermit(data) {
    return request({
      url: "/hxindex/Api/currentmenupermit",
      method: "POST",
      data
    });
}
// 获取最新消息
export function getNewPostArticle() {
    return request({
      url: "/hxindex/Api/articleindex",
      method: "POST",
    });
}
// 文件上传
export function fileUpload(data) {
    return request({
      url: "/hxindex/Api/uping",
      method: "POST",
      data,
      headers:{
        isFile:true,
      }
    });
}
// 获取中文统计数据
export function cnCluesStatData(data) {
  return request({
    url: "/hxindex/Api/chinacount",
    method: "POST",
    data,
  });
}
// 获取英文统计数据
export function enCluesStatData(data) {
  return request({
    url: "/hxindex/Api/encount",
    method: "POST",
    data,
  });
}
// 获取业务员统计数据
export function salesmanStatData() {
  return request({
    url: "/hxindex/Api/salescount",
    method: "POST",
  });
}
// 获取中文地区统计数据
export function cnCluesRegionStatData(data) {
  return request({
    url: "/hxindex/Api/chinamapcount",
    method: "POST",
    data
  });
}
// 获取英文地区统计数据
export function enCluesRegionStatData(data) {
  return request({
    url: "/hxindex/Api/enmapcount",
    method: "POST",
    data
  });
}
// 意见反馈
export function getAddsay(data) {
  return request({
    url: "/hxindex/Api/addsay",
    method: "POST",
    data
  });
}
// 意见反馈
export function clearCache(data) {
  return request({
    url: "/hxindex/Api/deltecache",
    method: "POST",
    data
  });
}
//首页中文成交统计接口
export function departScore(data) {
  return request({
    url: "hxindex/Api/chinadepartscore",
    method: "POST",
    data
  });
}
//首页英文成交统计接口
export function endepartScore(data) {
  return request({
    url: "/hxindex/Api/endepartscore",
    method: "POST",
    data
  });
}
//清除首页数据
export function clearHomeCache(data) {
  return request({
    url: "/hxindex/Api/delteindexcache",
    method: "POST",
    data
  });
}
//首页英文询盘日目标接口
export function getEndaytarget(data) {
  return request({
    url: "/hxindex/Api/endaytarget",
    method: "POST",
    data
  });
}
//首页中文询盘日目标接口
export function getChinadaytarget(data) {
  return request({
    url: "/hxindex/Api/chinadaytarget",
    method: "POST",
    data
  });
}
//首页中文统计(部门分析默认页面接口)
export function getChinadepartcountdefault() {
  return request({
    url: "/hxindex/Api/chinadepartcountdefault",
    method: "POST",
  });
}
//首页中文统计(部门分析) 
export function getChinadepartcount(data) {
  return request({
    url: "/hxindex/Api/chinadepartcount",
    method: "POST",
    data
  });
}
//首页英文统计(部门分析默认页面接口)
export function getendepartcountdefault() {
  return request({
    url: "/hxindex/Api/endepartcountdefault",
    method: "POST",
  });
}
//首页英文统计(部门分析) 
export function getendepartcount(data) {
  return request({
    url: "/hxindex/Api/endepartcount",
    method: "POST",
    data
  });
}
//首页中文统计总览
export function getChinacountnew() {
  return request({
    url: "/hxindex/Api/chinacountnew",
    method: "POST",
  });
}
//首页日目标展示-中文成交统计接口
export function getChinadepartscorenew(data) {
  return request({
    url: "/hxindex/Api/chinadepartscorenew",
    method: "POST",
    data
  });
}
//首页中文成交统计年度完成情况接口
export function getChinadepartscoreyear(data) {
  return request({
    url: "/hxindex/Api/chinadepartscoreyear",
    method: "POST",
    data
  });
}
//首页中文目标展示(中文日目标接口)
export function getChinadaytargetnew(data) {
  return request({
    url: "/hxindex/Api/chinadaytargetnew",
    method: "POST",
    data
  });
}
//首页中文目标月度完成次数统计(中文日目标接口)
export function getChinadaytargetmonth(data) {
  return request({
    url: "/hxindex/Api/chinadaytargetmonth",
    method: "POST",
    data
  });
}
//首页英文统计总览
export function getEncountnew() {
  return request({
    url: "/hxindex/Api/encountnew",
    method: "POST",
  });
}
//首页日目标展示-英文成交统计接口
export function getEndepartscorenew(data) {
  return request({
    url: "/hxindex/Api/endepartscorenew",
    method: "POST",
    data
  });
}
//首页英文成交统计年度完成情况接口
export function getEndepartscoreyear(data) {
  return request({
    url: "/hxindex/Api/endepartscoreyear",
    method: "POST",
    data
  });
}
//首页英文目标展示(英文日目标接口)
export function getEndaytargetnew(data) {
  return request({
    url: "/hxindex/Api/endaytargetnew",
    method: "POST",
    data
  });
}
//首页英文目标月度完成次数统计(英文日目标接口)
export function getEndaytargetmonth(data) {
  return request({
    url: "/hxindex/Api/endaytargetmonth",
    method: "POST",
    data
  });
}
// 获取中文部门
export function getCnDepart() {
  return request({
    url: "/hxindex/Api/chinareaddepartlist",
    method: "POST"
  });
}

// 中文数据分析那里获取中文部门
export function getCnDepartAnalysis() {
  return request({
    url: "/hxindex/Api/chinacountdepart",
    method: "POST"
  });
}

// 获取中文部门下的组员​
export function getCnPersonlist(data) {
  return request({
    url: "/hxindex/Api/chinapersonlist",
    method: "POST",
    data
  });
}
// 首页中文统计(组员分析详情页)
export function getCnPersoncountinfo(data) {
  return request({
    url: "/hxindex/Api/chinapersoncountinfo",
    method: "POST",
    data
  });
}
// 首页中文统计(组员分析对比) 
export function getCnPersoncountCompare(data) {
  return request({
    url: "/hxindex/Api/chinapersoncountcompare",
    method: "POST",
    data
  });
}
// 组员个人历史成就
export function getPersonHistory(data) {
  return request({
    url: "/hxindex/Api/personhistory",
    method: "POST",
    data
  });
}
// 获取英文部门
export function getEnDepart() {
  return request({
    url: "/hxindex/Api/enreaddepartlist",
    method: "POST"
  });
}
// 获取英文部门下的组员​
export function getEnPersonlist(data) {
  return request({
    url: "/hxindex/Api/enpersonlist",
    method: "POST",
    data
  });
}
// 首页英文统计(组员分析详情页)
export function getEnPersoncountinfo(data) {
  return request({
    url: "/hxindex/Api/enpersoncountinfo",
    method: "POST",
    data
  });
}
// 首页英文统计(组员分析对比) 
export function getEnPersoncountCompare(data) {
  return request({
    url: "/hxindex/Api/enpersoncountcompare",
    method: "POST",
    data
  });
}
//首页中文统计（中文产品列表）（中文产品分析）
export function getChinaproductlist() {
  return request({
    url: "/hxindex/Api/chinaproductlist",
    method: "POST",
  });
}
// 首页中文统计(添加关注产品)（中文产品分析）
export function getChinaAddfocusproduct(data) {
  return request({
    url: "/hxindex/Api/addfocusproduct",
    method: "POST",
    data
  });
}
// 首页中文统计（添加关注单个产品）（产品分析）
export function getChinaAddfocusproductone(data) {
  return request({
    url: "/hxindex/Api/addfocusproductone",
    method: "POST",
    data
  });
}
// 首页中文统计（取消关注单个产品）（产品分析）
export function getChinafocusproductcancel(data) {
  return request({
    url: "/hxindex/Api/focusproductcancel",
    method: "POST",
    data
  });
}
// 首页中文统计(产品分析默认-顶部我的关注产品) （中文产品分析）
export function getChinaproductFocus() {
  return request({
    url: "/hxindex/Api/chinaproductfocus",
    method: "POST",
  });
}
// 首页中文统计（地区列表、产品分类）（中文产品分析）
export function getChinaprovince() {
  return request({
    url: "/hxindex/Api/chinaprovince",
    method: "POST",
  });
}
// 首页中文统计（产品分析默认-底部产品询盘 积分 百万）（中文产品分析）
export function getChinaproductcountfooter(data) {
  return request({
    url: "/hxindex/Api/chinaproductcountfooter",
    method: "POST",
    data
  });
}
// 首页中文统计（点击产品类型获取产品列表）（中文产品分析）
export function getchinaproduct(data) {
  return request({
    url: "/hxindex/Api/getchinaproduct",
    method: "POST",
    data
  });
}
// 首页中文统计（总览）（中文产品分析）
export function getChinaproductinfocount(data) {
  return request({
    url: "/hxindex/Api/chinaproductinfocount",
    method: "POST",
    data
  });
}
// 首页中文统计（产品对比）（中文产品分析）
export function getChinaproductcompare(data) {
  return request({
    url: "/hxindex/Api/chinaproductcompare",
    method: "POST",
    data
  });
}
// 首页中文统计（单个产品部门对比）（中文产品分析）
export function getChinaproductdepartcompare(data) {
  return request({
    url: "/hxindex/Api/chinaproductdepartcompare",
    method: "POST",
    data
  });
}
// 首页中文统计（单个产品时间范围数据对比）（中文产品分析）
export function getChinaproducttimecompare(data) {
  return request({
    url: "/hxindex/Api/chinaproducttimecompare",
    method: "POST",
    data
  });
}
// 首页中文|英文统计（个人月产品分析）（个人->产品分析）
export function getPersonproductinfo(data) {
  return request({
    url: "/hxindex/Api/personproductinfo",
    method: "POST",
    data
  });
}
//首页英文统计（英文产品列表）（英文产品分析）
export function getEnproductlist() {
  return request({
    url: "/hxindex/Api/enproductlist",
    method: "POST",
  });
}
// 首页英文统计(添加关注产品)（英文产品分析）
export function getEnAddenfocusproduct(data) {
  return request({
    url: "/hxindex/Api/addenfocusproduct",
    method: "POST",
    data
  });
}
// 首页英文统计(产品分析默认-顶部我的关注产品) （英文产品分析）
export function getEnproductfocus() {
  return request({
    url: "/hxindex/Api/enproductfocus",
    method: "POST",
  });
}
// 首页英文统计（地区列表、产品分类）（英文产品分析）
export function getEnprovince() {
  return request({
    url: "/hxindex/Api/enprovince",
    method: "POST",
  });
}
// 首页英文统计（产品分析默认-底部产品询盘 积分 百万）（英文产品分析）
export function getEnproductcountfooter(data) {
  return request({
    url: "/hxindex/Api/enproductcountfooter",
    method: "POST",
    data
  });
}
// 首页英文统计（点击产品类型获取产品列表）（英文产品分析）
export function getEnproduct(data) {
  return request({
    url: "/hxindex/Api/getenproduct",
    method: "POST",
    data
  });
}
// 首页英文统计（总览）（英文产品分析）
export function getEnproductinfocount(data) {
  return request({
    url: "/hxindex/Api/enproductinfocount",
    method: "POST",
    data
  });
}
// 首页英文统计（产品对比）（英文产品分析）
export function getEnproductcompare(data) {
  return request({
    url: "/hxindex/Api/enproductcompare",
    method: "POST",
    data
  });
}
// 首页英文统计（单个产品部门对比）（英文产品分析）
export function getEnproductdepartcompare(data) {
  return request({
    url: "/hxindex/Api/enproductdepartcompare",
    method: "POST",
    data
  });
}
// 首页英文统计（单个产品时间范围数据对比）（英文产品分析）
export function getEnproducttimecompare(data) {
  return request({
    url: "/hxindex/Api/enproducttimecompare",
    method: "POST",
    data
  });
}
// 首页中文统计（添加关注单个产品）（产品分析）
export function getEnAddfocusproductone(data) {
  return request({
    url: "/hxindex/Api/addenfocusproductone",
    method: "POST",
    data
  });
}
// 首页中文统计（取消关注单个产品）（产品分析）
export function getEnfocusproductcance(data) {
  return request({
    url: "/hxindex/Api/enfocusproductcancel",
    method: "POST",
    data
  });
}


// 搜索词指数
export const base = {
  productType: (data) => request({
    url: "/hxindex/Api/getproducttype",
    method: "POST",
    data
  })
}
