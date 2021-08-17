import request from "@/utils/request";
// 留言系统留言信息数据
export function webMsgList(data) {
  return request({
    url: "/hxindex/Webmsg/allmsg",
    method: "POST",
    data
  });
}