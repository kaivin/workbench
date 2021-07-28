import request from "@/utils/request";
// 获取服务器列表数据接口
export function getWebserverList(data) {
  return request({
    url: "/hxindex/Webserver/lists",
    method: "POST",
    data
  });
}
// 添加服务器接口
export function webserverAdd(data) {
  return request({
    url: "/hxindex/Webserver/add",
    method: "POST",
    data
  });
}
// 编辑服务器接口
export function webserverEdit(data) {
  return request({
    url: "/hxindex/Webserver/edit",
    method: "POST",
    data
  });
}
// 删除服务器接口
export function webserverDelete(data) {
  return request({
    url: "/hxindex/Webserver/delete",
    method: "POST",
    data
  });
}
// 获取服务器添加/编辑系统选择数据
export function webserverSelectData() {
  return request({
    url: "/hxindex/Webserver/getalldata",
    method: "POST"
  });
}
// 根据服务器ID获取服务器相关详细信息
export function webserverEditInfo(data) {
  return request({
    url: "/hxindex/Webserver/editini",
    method: "POST",
    data
  });
}