import request from "@/utils/request";
// 获取部门列表数据接口
export function getDataList() {
  return request({
    url: "/hxindex/Depart/index",
    method: "POST"
  });
}
// 添加部门接口
export function departAdd(data) {
  return request({
    url: "/hxindex/Depart/add",
    method: "POST",
    data
  });
}
// 编辑部门接口
export function departEdit(data) {
  return request({
    url: "/hxindex/Depart/edit",
    method: "POST",
    data
  });
}
// 删除部门接口
export function departDelete(data) {
  return request({
    url: "/hxindex/Depart/delete",
    method: "POST",
    data
  });
}
// 获取部门已分配角色数据接口
export function departAllotedRole(data) {
  return request({
    url: "/hxindex/Depart/departrole",
    method: "POST",
    data
  });
}
// 获取当前登录用户可分配角色数据接口
export function departCanAllotRole() {
  return request({
    url: "/hxindex/Depart/getuserrole",
    method: "POST"
  });
}
// 给部门分配角色接口
export function departAllotRole(data) {
  return request({
    url: "/hxindex/Depart/getdepartrole",
    method: "POST",
    data
  });
}
// 部门月度积分设置列表-获取部门
export function getdepart() {
  return request({
    url: "/hxindex/Depart/getdepart",
    method: "POST",
  });
}
// 部门月度积分设置列表
export function departScore(data) {
  return request({
    url: "/hxindex/Depart/departscore",
    method: "POST",
    data
  });
}
// 部门月度可用积分添加
export function departScoreAdd(data) {
  return request({
    url: "/hxindex/Depart/departscoreadd",
    method: "POST",
    data
  });
}
// 部门月度可用积分修改
export function departScoreEdit(data) {
  return request({
    url: "/hxindex/Depart/departscoreedit",
    method: "POST",
    data
  });
}
// 部门月度可用积分删除
export function departScoreDelete(data) {
  return request({
    url: "/hxindex/Depart/departscoredelete",
    method: "POST",
    data
  });
}