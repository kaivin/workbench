import request from "@/utils/request";
// 获取业务员英文询盘-首页-个人询盘列表
export function getSalesList(data) {
  return request({
    url: "/hxindex/Sales/index",
    method: "POST",
    data
  });
}
// 产品类型列表数据获取接口
export function getSalesSearchList() {
  return request({
    url: "/hxindex/Sales/indexcondition",
    method: "POST"
  });
}
//业务员英文询盘-详情
export function getSalesDetails(data) {
  return request({
    url: "/hxindex/Sales/phoneinfo",
    method: "POST",
    data
  });
}
//业务员英文询盘-详情修改
export function getSalesDetailsModify(data) {
  return request({
    url: "/hxindex/Sales/phoneinfosub",
    method: "POST",
    data
  });
}
//业务员英文询盘-确认阅读提醒
export function getSalesConfirmrRemind(data) {
  return request({
    url: "/hxindex/Sales/warnread",
    method: "POST",
    data
  });
}
//业务员英文询盘-等待分配询盘列表
export function getSalesWaitDistribu(data) {
  return request({
    url: "/hxindex/Sales/waitphone",
    method: "POST",
    data
  });
}
//业务员英文询盘-询盘分配给具体的业务员
export function getSalesDistribuSalesman(data) {
  return request({
    url: "​/hxindex​/Sales​/dealphone",
    method: "POST",
    data
  });
}
//业务员英文询盘-所有已分配询盘列表
export function getSalesAllDistribuList(data) {
  return request({
    url: "/hxindex/Sales/allphone",
    method: "POST",
    data
  });
}
//业务员英文询盘-询盘分配给具体的业务员撤回
export function getSalesWithdrawDistribuSalesman(data) {
  return request({
    url: "/hxindex/Sales/phonecancel",
    method: "POST",
    data
  });
}
//业务员英文询盘-业务员数据统计
export function getSalesSalesmanData(data) {
  return request({
    url: "/hxindex/Sales/phonecount",
    method: "POST",
    data
  });
}
//业务员英文询盘-等待处理询盘
export function getSalesWaitFortis(data) {
  return request({
    url: "/hxindex/Sales/waitdeal",
    method: "POST",
    data
  });
}
//业务员英文询盘-已处理询盘
export function getSalesInquiryFortis(data) {
  return request({
    url: "/hxindex/Sales/hasdeal",
    method: "POST",
    data
  });
}
//业务员英文询盘-已做反馈询盘
export function getSalesInquiryfeedback(data) {
  return request({
    url: "/hxindex/Sales/hassay",
    method: "POST",
    data
  });
}
//业务员英文询盘-未反馈询盘
export function getSalesNofeedback(data) {
  return request({
    url: "/hxindex/Sales/hasnosay",
    method: "POST",
    data
  });
}
//业务员英文询盘-等待添加富通id
export function getSalesWaitAddingFortis(data) {
  return request({
    url: "/hxindex/Sales/waitftword",
    method: "POST",
    data
  });
}
//业务员英文询盘-月底前需要反馈的询盘
export function getSalesMonthEndFeedback(data) {
  return request({
    url: "/hxindex/Sales/monthsay",
    method: "POST",
    data
  });
}
// 数据分析查询条件
export function getSalesAnalysisCondition() {
  return request({
    url: "/hxindex/Sales/searchcondition",
    method: "POST"
  });
}
//数据分析
export function getSalesDataAnalysis(data) {
  return request({
    url: "/hxindex/Sales/search",
    method: "POST",
    data
  });
}
//公共数据
export function getSalesPublicData() {
  return request({
    url: "/hxindex/Sales/phoneindex",
    method: "POST"
  });
}