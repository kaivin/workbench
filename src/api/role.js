import request from "@/utils/request";
// 获取角色列表接口
export function getDataList() {
  return request({
    url: "/hxindex/Role/index",
    method: "POST"
  });
}
// 角色添加接口
export function roleAdd(data) {
  return request({
    url: "/hxindex/Role/add",
    method: "POST",
    data
  });
}
// 角色编辑接口
export function roleEdit(data) {
  return request({
    url: "/hxindex/Role/edit",
    method: "POST",
    data
  });
}
// 角色删除接口
export function roleDelete(data) {
  return request({
    url: "/hxindex/Role/delete",
    method: "POST",
    data
  });
}
// 获取当前角色已分配权限接口
export function rolePermited(data) {
  return request({
    url: "/hxindex/Role/rolepermit",
    method: "POST",
    data
  });
}
// 获取当前登陆用户可分配权限接口
export function rolePermiting() {
  return request({
    url: "/hxindex/Role/userrolepermit",
    method: "POST"
  });
}
// 角色分配权限保存接口
export function rolePermit(data) {
  return request({
    url: "/hxindex/Role/getpermit",
    method: "POST",
    data
  });
}
// 获取当前角色已分配用户接口
export function roleUser(data) {
  return request({
    url: "/hxindex/Role/roleuser",
    method: "POST",
    data
  });
}
// 角色分配用户保存接口
export function roleAllotUser(data) {
  return request({
    url: "/hxindex/Role/getuser",
    method: "POST",
    data
  });
}
// 当前角色已分配论坛分类操作权限接口动作
export function roleAllotedPostPermit(data) {
  return request({
    url: "/hxindex/Role/roletypepermit",
    method: "POST",
    data
  });
}
// 当前角色分配论坛分类操作权限保存动作
export function roleAllotPostPermit(data) {
  return request({
    url: "/hxindex/Role/gettypepermit",
    method: "POST",
    data
  });
}
// 获取当前选中论坛分类下可供分配的操作权限列表数据
export function canAllotPostPermit(data) {
  return request({
    url: "/hxindex/Role/getroletypepermit",
    method: "POST",
    data
  });
}
// 获取当前登陆用户可读的论坛分类
export function userCanAllotPost() {
  return request({
    url: "/hxindex/Role/mytypelist",
    method: "POST"
  });
}
// 获取当前登陆用户所有可分配论坛分类操作的权限
export function userCanAllotPostAllPermit() {
  return request({
    url: "/hxindex/Role/myalltypepermit",
    method: "POST"
  });
}
// 获取当前登陆用户所有可分配工单权限
export function getWorkOrder(data) {
  return request({
    url: "/hxindex/Role/getroleworktypepermit",
    method: "POST",
    data,
  });
}
// 获取当前角色已分配的工单权限
export function roleWorkOrder(data) {
  return request({
    url: "/hxindex/Role/roleworktypepermit",
    method: "POST",
    data,
  });
}
// 保存当前已分配工单权限
export function roleAllotWorkOrder(data) {
  return request({
    url: "/hxindex/Role/getworktypepermit",
    method: "POST",
    data,
  });
}
// 获取当前登录用户有权限的工单权限数据
export function userCanAllotWorkOrderAllPermit() {
  return request({
    url: "/hxindex/Role/myallworktypepermit",
    method: "POST",
  });
}