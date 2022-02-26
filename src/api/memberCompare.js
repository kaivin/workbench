import request from "@/utils/request";
// 英文成员询盘、成交排行情况
export function getEnpersoncountdefault(data) {
  return request({
    url: "/hxindex/Api/enpersoncountdefault",
    method: "POST",
    data
  });
}
// 首页中文统计(组员分析默认页)//yearuser-本年的组员信息 monthselectuser-时间范围内的组员信息 
export function getChinapersoncountdefault(data) {
  return request({
    url: "/hxindex/Api/chinapersoncountdefault",
    method: "POST",
    data
  });
}