import request from "@/utils/request";
// 获取操作日志列表数据接口
export function getDataList(data) {
  return request({
    url: "/hxindex/Logs/index",
    method: "POST",
    data
  });
}
// 获取所有动作数据接口
export function getActionList() {
  return request({
    url: "/hxindex/Logs/getallaction",
    method: "POST"
  });
}