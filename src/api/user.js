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
// 个人中心修改入职时间
export function cometimeEdit(data) {
  return request({
    url: "/hxindex/User/persontime",
    method: "POST",
    data
  });
}

// 获取品牌数据
export function getBrandList() {
  return request({
    url: "/hxindex/User/brandlist",
    method: "POST"
  });
}
// 切换登陆用户
export function changeUserLogin(data) {
  return request({
    url: "/hxindex/User/tabuser",
    method: "POST",
    data,
  });
}
// 个人其他信息列表
export function userPersonother(data) {
  return request({
    url: "/hxindex/User/personother",
    method: "POST",
    data,
  });
}
// 个人其他信息列表 获取用户
export function getUserPersonother() {
  return request({
    url: "/hxindex/User/getuser",
    method: "POST",
    
  });
}
// 个人其他信息列表 添加
export function userPersonotherAdd(data) {
  return request({
    url: "/hxindex/User/personotheradd",
    method: "POST",
    data
  });
}
// 个人其他信息列表 修改
export function userPersonotherEdit(data) {
  return request({
    url: "/hxindex/User/personotheredit",
    method: "POST",
    data
  });
}
// 个人其他信息列表 导入
export function userPersonotherExportlink(data) {
  return request({
    url: "/hxindex/User/exportlink",
    method: "POST",
    data,
    headers:{
      isFile:true,
    }
  });
}

// 可操作的账号资源
export function getAccountList() {
  return request({
    url: "/hxindex/Api/getsalesuser",
    method: "POST",
  });
}

// 转移资源
export function transAccount(data) {
  return request({
    url: "/hxindex/User/usermove",
    method: "POST",
    data
  });
}

// 获取要转移资源的用户的询盘
export function getMoveInqury(data) {
  return request({
    url: "/hxindex/User/userxun",
    method: "POST",
    data
  });
}