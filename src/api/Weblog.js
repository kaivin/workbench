import request from "@/utils/request";
// 获取当前网站的日志文件列表
export function getloglist(data) {
  return request({
    url: "/hxindex/Weblog/getloglist",
    method: "POST",
    data
  });
}
// 获取当前日志文件的抓取详情
export function getlists(data) {
  return request({
    url: "/hxindex/Weblog/lists",
    method: "POST",
    data
  });
}
// 常用蜘蛛列表
export function getlogSpidertype() {
  return request({
    url: "/hxindex/Weblog/spidertype",
    method: "POST",
  });
}
// 检测蜘蛛真实性
export function getlogCheckspider(data) {
  return request({
    url: "/hxindex/Weblog/checkspider",
    method: "POST",
    data
  });
}