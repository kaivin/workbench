import request from "@/utils/request";

// 获取渠道列表
export function getDepfiveCondition(data) {
  return request({
    url: "/hxindex/Fivedepart/getcondition",
    method: "POST",
    data
  });
}

// 获取渠道分析数据
export function getDepfiveSourceData(data) {
  return request({
    url: "/hxindex/Fivedepart/chinasourcedefault",
    method: "POST",
    data
  });
}

// 获取成交积分趋势
export function getDepfiveScoreTrend(data) {
  return request({
    url: "/hxindex/Fivedepart/scoretrend",
    method: "POST",
    data
  });
}

// 询盘意向统计分析
export function getDepfiveIntentionCount(data) {
  return request({
    url: "/hxindex/Fivedepart/Intentioncount",
    method: "POST",
    data
  });
}

// 获取英文渠道列表
export function getDepfiveEnCondition(data) {
  return request({
    url: "/hxindex/Fivedepart/getencondition",
    method: "POST",
    data
  });
}

// 获取英文渠道分析数据
export function getDepfiveEnSourceData(data) {
  return request({
    url: "/hxindex/Fivedepart/ensourcecount",
    method: "POST",
    data
  });
}

// 获取英文成交积分数据
export function getDepfiveEnScoreData(data) {
  return request({
    url: "/hxindex/Fivedepart/enscorecount",
    method: "POST",
    data
  });
}


export function getDepfiveDomainData(data) {
  return request({
    url: "/hxindex/Fivedepart/domaincount",
    method: "POST",
    data
  });
}

export function getDepfiveExport(data) {
  return request({
    url: "/hxindex/Fivedepart/exportlink",
    method: "POST",
    data,
    headers:{
      isFile:true,
    }
  });
}

// 获取日期下拉
export function getDepfiveTime(data) {
  return request({
    url: "/hxindex/Fivedepart/gettime",
    method: "POST",
    data
  });
}

// 添加设备相关数据
export function addDepfiveUrl(data) {
  return request({
    url: "/hxindex/Fivedepart/addurl",
    method: "POST",
    data
  });
}
