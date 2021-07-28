import request from "@/utils/request";
// 获取菜单列表数据接口
export function getDataList() {
  return request({
    url: "/hxindex/Menu/index",
    method: "POST"
  });
}
// 添加菜单接口
export function menuAdd(data) {
  return request({
    url: "/hxindex/Menu/add",
    method: "POST",
    data
  });
}
// 编辑菜单接口
export function menuEdit(data) {
  return request({
    url: "/hxindex/Menu/edit",
    method: "POST",
    data
  });
}
// 删除菜单接口
export function menuDelete(data) {
  return request({
    url: "/hxindex/Menu/delete",
    method: "POST",
    data
  });
}