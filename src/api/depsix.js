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

// 询盘意向头部电话
export function getIntentionPhone(data) {
  return request({
    url: "/hxindex/Sixdepart/Intentioncondition",
    method: "POST",
    data
  });
}

// 询盘意向搜索结果
export function getIntentionResult(data) {
  return request({
    url: "/hxindex/Sixdepart/Intentioncount",
    method: "POST",
    data
  });
}

