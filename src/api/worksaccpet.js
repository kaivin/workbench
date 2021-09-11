import request from "@/utils/request";
// 工单详情信息数据
export function workOrderInfo(data) {
  return request({
    url: "/hxindex/Worksaccpet/workinfo",
    method: "POST",
    data,
  });
}