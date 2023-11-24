import request from "@/utils/request";

// 获取询盘意向相关分析
export function getDepcomIntentioncount(data) {
  return request({
    url: "/hxindex/Commdepart/Intentioncount",
    method: "POST",
    data
  });
}

// 获取询盘意向相关分析
export function getDepcomCondition(data) {
  return request({
    url: "/hxindex/Commdepart/getcondition",
    method: "POST",
    data
  });
}


// 获取询盘意向相关分析
export function getDepcomMsgtype(data) {
  return request({
    url: "/hxindex/Commdepart/msgtype",
    method: "POST",
    data
  });
}

// 大洲获取
export function getDepcomContinent(data) {
  return request({
    url: "/hxindex/Commdepart/getcontient",
    method: "POST",
    data
  });
}

// 大洲小时询盘
export function getDepcomCountryXun(data) {
  return request({
    url: "/hxindex/Commdepart/country_xun",
    method: "POST",
    data
  });
}

// 获取中文部门
export function getDepcomChDepart(data) {
  return request({
    url: "/hxindex/Commdepart/getchinadepart",
    method: "POST",
    data
  });
}

// 获取中文分析
export function getDepcomChCount(data) {
  return request({
    url: "/hxindex/Commdepart/chinacount",
    method: "POST",
    data
  });
}
