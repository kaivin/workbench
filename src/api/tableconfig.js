import request from "@/utils/request";
// 获取帖子类型列表数据接口
export function getDataList() {
  return request({
    url: "/hxindex/Tableconfig/index",
    method: "POST"
  });
}
// 给帖子各个属性字段分配角色
export function AllotRole(data) {
  return request({
    url: "/hxindex/Tableconfig/getrole",
    method: "POST",
    data
  });
}
// 获取帖子各个属性字段已分配角色
export function AllotedRole(data) {
  return request({
    url: "/hxindex/Tableconfig/tablerole",
    method: "POST",
    data
  });
}