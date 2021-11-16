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