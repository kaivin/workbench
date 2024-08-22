import request from "@/utils/request";

// 获取花费明细
export function getExpenseData(data) {
  return request({
    url: "/hxindex/Encount/chmoneylist",
    method: "POST",
    data
  });
}
// 导入数据
export function getExpenseAdd(data) {
  return request({
    url: "/hxindex/Encount/chexportlinkgroup",
    method: "POST",
    data,
    headers:{
      isFile:true,
    }
  });
}

// 获取小组询盘质量
export function getXunQualityData(data) {
  return request({
    url: "/hxindex/Encount/groupcount",
    method: "POST",
    data
  });
}
// 获取小组成交周期
export function getGroupDealCycleData(data) {
  return request({
    url: "/hxindex/Encount/cjcount",
    method: "POST",
    data
  });
}
// 获取成交产品
export function getDealProductData(data) {
  return request({
    url: "/hxindex/Encount/cjcountthree",
    method: "POST",
    data
  });
}
// 获取个人成交周期
export function getPersonalDealCycleData(data) {
  return request({
    url: "/hxindex/Encount/cjcountfour",
    method: "POST",
    data
  });
}
// 未来成交预期
export function getFutureDealData(data) {
  return request({
    url: "/hxindex/Encount/cjcountfive",
    method: "POST",
    data
  });
}