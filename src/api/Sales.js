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
export function getSalesDetails() {
}
//业务员英文询盘-详情修改
export function getSalesDetailsModify() {
}
//业务员英文询盘-确认阅读提醒
export function getSalesConfirmrRemind() {
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
export function getSalesDistribuSalesman() {
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
export function getSalesWithdrawDistribuSalesman() {
}
//业务员英文询盘-业务员数据统计
export function getSalesSalesmanData() {
}
//业务员英文询盘-等待处理询盘
export function getSalesWaitFortis() {
}
//业务员英文询盘-已处理询盘
export function getSalesInquiryFortis() {
}
//业务员英文询盘-已做反馈询盘
export function getSalesInquiryfeedback() {
}
//业务员英文询盘-未反馈询盘
export function getSalesNofeedback() {
}
//业务员英文询盘-等待添加富通id
export function getSalesWaitAddingFortis() {
}
//业务员英文询盘-月底前需要反馈的询盘
export function getSalesMonthEndFeedback() {
}
//数据分析查询条件
export function getSalesAnalysisCondition() {
}
//数据分析
export function getSalesDataAnalysis() {
}
//公共数据
export function getSalesPublicData() {
}