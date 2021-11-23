import request from "@/utils/request";
// 中文小组默认展示统计
export function cnGroupDefault() {
  return request({
    url: "/hxindex/Api/chinagroupcountdefault",
    method: "POST"
  });
}
// 中文小组筛选展示统计
export function cnGroupFilter(data) {
  return request({
    url: "/hxindex/Api/chinagroupcount",
    method: "POST",
    data
  });
}