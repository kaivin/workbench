import request from "@/utils/request";
// 获取帖子类型列表数据接口
export function getDataList() {
  return request({
    url: "/hxindex/Information/index",
    method: "POST"
  });
}
// 添加帖子类型接口
export function postAdd(data) {
  return request({
    url: "/hxindex/Information/add",
    method: "POST",
    data
  });
}
// 编辑帖子类型接口
export function postEdit(data) {
  return request({
    url: "/hxindex/Information/edit",
    method: "POST",
    data
  });
}
// 删除帖子类型接口
export function postDelete(data) {
  return request({
    url: "/hxindex/Information/delete",
    method: "POST",
    data
  });
}
// 获取所选帖子类型当前登录用户可分配的帖子权限（角色分配帖子权限时使用）
export function userCanPostPermit(data) {
  return request({
    url: "/hxindex/Information/gettypepermit",
    method: "POST",
    data
  });
}