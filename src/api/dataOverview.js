import request from "@/utils/request";

// 中文统计总览
export function getChinacountnew(data) {
  return request({
    url: "/hxindex/Api/chinacountnew",
    method: "POST",
    data
  });
}
// 英文统计总览
export function getEncountnew(data) {
  return request({
    url: "/hxindex/Api/encountnew",
    method: "POST",
    data
  });
}