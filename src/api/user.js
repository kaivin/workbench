import request from "@/utils/request";
// 获取用户列表接口
export function getUserList(data) {
  return request({
    url: "/hxindex/User/index",
    method: "POST",
    data
  });
}
// 用户添加接口
export function userAdd(data) {
  return request({
    url: "/hxindex/User/add",
    method: "POST",
    data
  });
}
// 用户编辑接口
export function userEdit(data) {
  return request({
    url: "/hxindex/User/edit",
    method: "POST",
    data
  });
}
// 用户删除接口
export function userDelete(data) {
  return request({
    url: "/hxindex/User/delete",
    method: "POST",
    data
  });
}
// 用户显示隐藏接口
export function userShowHide(data) {
  return request({
    url: "/hxindex/User/showhide",
    method: "POST",
    data
  });
}
// 用户密码重置接口
export function userResetPwd(data) {
  return request({
    url: "/hxindex/User/resetpwd",
    method: "POST",
    data
  });
}
// 获取用户已分配角色数据接口
export function userAllotedRole(data) {
  return request({
    url: "/hxindex/User/userrole",
    method: "POST",
    data
  });
}
// 获取当前登录用户可分配角色数据接口
export function userCanAllotRole() {
  return request({
    url: "/hxindex/User/getuserrole",
    method: "POST"
  });
}
// 给用户分配角色接口
export function userAllotRole(data) {
  return request({
    url: "/hxindex/User/getrole",
    method: "POST",
    data
  });
}
// 获取当前登录用户可看到的部门数据接口
export function userCanDepart() {
  return request({
    url: "/hxindex/User/userdepart",
    method: "POST"
  });
}
// 个人修改用户名接口
export function userNameEdit(data) {
  return request({
    url: "/hxindex/User/personuser",
    method: "POST",
    data
  });
}
// 个人修改密码接口
export function pwdEdit(data) {
  return request({
    url: "/hxindex/User/personpwd",
    method: "POST",
    data
  });
}
// 个人修改联系方式接口
export function contactEdit(data) {
  return request({
    url: "/hxindex/User/personset",
    method: "POST",
    data
  });
}
