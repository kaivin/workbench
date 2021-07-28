import request from "@/utils/request";
// 获取权限列表数据接口
export function getDataList() {
  return request({
    url: "/hxindex/Permit/index",
    method: "POST"
  });
}
// 添加权限接口
export function permitAdd(data) {
  return request({
    url: "/hxindex/Permit/add",
    method: "POST",
    data
  });
}
// 编辑权限接口
export function permitEdit(data) {
  return request({
    url: "/hxindex/Permit/edit",
    method: "POST",
    data
  });
}
// 删除权限接口
export function permitDelete(data) {
  return request({
    url: "/hxindex/Permit/delete",
    method: "POST",
    data
  });
}