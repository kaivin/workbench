import request from "@/utils/request";
// 获取帖子系统标签列表数据接口
export function getDataList() {
  return request({
    url: "/hxindex/Tags/index",
    method: "POST"
  });
}
// 添加帖子系统标签接口
export function tagsAdd(data) {
  return request({
    url: "/hxindex/Tags/add",
    method: "POST",
    data
  });
}
// 编辑帖子系统标签接口
export function tagsEdit(data) {
  return request({
    url: "/hxindex/Tags/edit",
    method: "POST",
    data
  });
}
// 删除帖子系统标签接口
export function tagsDelete(data) {
  return request({
    url: "/hxindex/Tags/delete",
    method: "POST",
    data
  });
}