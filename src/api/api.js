import request from "@/utils/request";

// 获取指定菜单下的所有权限数据
export function getMenuPermit(data) {
  return request({
    url: "/hxindex/Api/getmenupermit",
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