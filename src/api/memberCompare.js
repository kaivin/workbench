import request from "@/utils/request";
// 中文成员询盘、成交排行情况
export function getInquiryRank() {
    return request({
      url: "/hxindex/Api/chinapersoncountdefault",
      method: "POST"
    });
}
// 英文成员询盘、成交排行情况
export function getEnInquiryRank() {
  return request({
    url: "/hxindex/Api/enpersoncountdefault",
    method: "POST"
  });
}