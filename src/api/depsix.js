import request from "@/utils/request";

// 获取询盘搜索条件
export function getInquiryItem() {
  return request({
    url: "/hxindex/Sixdepart/allcondition",
    method: "POST",
  });
}

// 获取询盘搜索结果
export function getInquiryResult(data) {
  return request({
    url: "/hxindex/Sixdepart/countlist",
    method: "POST",
    data
  });
}