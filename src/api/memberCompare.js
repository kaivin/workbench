import request from "@/utils/request";
// 中文成员询盘、成交排行情况
export function getInquiryRank(data) {
    return request({
      url: "/hxindex/Api/chinapersoncountdefault",
      method: "POST",
      data
    });
}
// 英文成员询盘、成交排行情况
export function getEnInquiryRank(data) {
  return request({
    url: "/hxindex/Api/enpersoncountdefault",
    method: "POST",
    data
  });
}