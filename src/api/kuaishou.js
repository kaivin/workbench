import request from "@/utils/request";

// 获取询盘搜索条件
export function getKuaishouData(data) {
  return request({
    url: "/hxindex/Kuaishou/index",
    method: "POST",
    data
  });
}

// 获取部门统计情况
export function getKuaishouScore(data) {
  return request({
    url: "/hxindex/Kuaishou/departscore",
    method: "POST",
    data
  });
}

// 关键词列表
export function ksKeywordList(data) {
  return request({
    url: "/hxindex/Kuaishou/wordlist",
    method: "POST",
    data
  });
}

// 关键词添加
export function ksKeywordAdd(data) {
  return request({
    url: "/hxindex/Kuaishou/wordadd",
    method: "POST",
    data
  });
}

// 关键词删除
export function ksKeywordDel(data) {
  return request({
    url: "/hxindex/Kuaishou/worddel",
    method: "POST",
    data
  });
}

// 抖音账号统计
export function getKuaishouCount(data) {
  return request({
    url: "/hxindex/Kuaishou/doucounttwo",
    method: "POST",
    data
  });
}

// 抖音账号统计
export function getKuaishouDepartlist(data) {
  return request({
    url: "/hxindex/Kuaishou/departlist",
    method: "POST",
    data
  });
}

// 获取日期
export function getKuaishouTime(data) {
  return request({
    url: "/hxindex/Kuaishou/getnumber",
    method: "POST",
    data
  });
}

// 获取账号图表
export function getKuaishouEachLine(data) {
  return request({
    url: "/hxindex/Kuaishou/dinfo",
    method: "POST",
    data
  });
}

// 获取部门图表
export function getKuaishouAccountLine(data) {
  return request({
    url: "/hxindex/Kuaishou/departinfo",
    method: "POST",
    data
  });
}

// 获取账号统计
export function getKuaishouPersonalCount(data) {
  return request({
    url: "/hxindex/Kuaishou/personcount",
    method: "POST",
    data
  });
}

// 抖音账号统计
export function getKuaishouDepartgroup(data) {
  return request({
    url: "/hxindex/Kuaishou/departgroup",
    method: "POST",
    data
  });
}

// 抖音账号统计
export function getKuaishouTotalCount(data) {
  return request({
    url: "/hxindex/Kuaishou/doucount",
    method: "POST",
    data
  });
}

// 抖音关键词详情
export function getKuaishouWordInfo(data) {
  return request({
    url: "/hxindex/Kuaishou/wordinfo",
    method: "POST",
    data
  });
}

// 抖音关键词详情
export function getKuaishouCountInfo(data) {
  return request({
    url: "/hxindex/Kuaishou/doucountinfo",
    method: "POST",
    data
  });
}

// 抖音账号列表
export function getKuaishouAccountList(data) {
  return request({
    url: "/hxindex/Kuaishou/dyaccount",
    method: "POST",
    data
  });
}

// 抖音账号列表
export function kuaishouAccountAdd(data) {
  return request({
    url: "/hxindex/Kuaishou/dyadd",
    method: "POST",
    data
  });
}

// 抖音账号列表
export function kuaishouAccountEdit(data) {
  return request({
    url: "/hxindex/Kuaishou/dyedit",
    method: "POST",
    data
  });
}