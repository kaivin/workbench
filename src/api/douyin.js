import request from "@/utils/request";

// 获取询盘搜索条件
export function getDouyinData(data) {
  return request({
    url: "/hxindex/Douyin/index",
    method: "POST",
    data
  });
}

// 获取部门统计情况
export function getDouyinScore(data) {
  return request({
    url: "/hxindex/Douyin/departscore",
    method: "POST",
    data
  });
}

// 关键词列表
export function dyKeywordList(data) {
  return request({
    url: "/hxindex/Douyin/wordlist",
    method: "POST",
    data
  });
}

// 关键词添加
export function dyKeywordAdd(data) {
  return request({
    url: "/hxindex/Douyin/wordadd",
    method: "POST",
    data
  });
}

// 关键词删除
export function dyKeywordDel(data) {
  return request({
    url: "/hxindex/Douyin/worddel",
    method: "POST",
    data
  });
}

// 抖音账号统计
export function getDouyinCount(data) {
  return request({
    url: "/hxindex/Douyin/doucounttwo",
    method: "POST",
    data
  });
}

// 抖音账号统计
export function getDouyinDepartlist(data) {
  return request({
    url: "/hxindex/Douyin/departlist",
    method: "POST",
    data
  });
}

// 获取日期
export function getDouyinTime(data) {
  return request({
    url: "/hxindex/Douyin/getnumber",
    method: "POST",
    data
  });
}

// 获取账号图表
export function getDouyinEachLine(data) {
  return request({
    url: "/hxindex/Douyin/dinfo",
    method: "POST",
    data
  });
}

// 获取部门图表
export function getDouyinAccountLine(data) {
  return request({
    url: "/hxindex/Douyin/departinfo",
    method: "POST",
    data
  });
}

// 获取账号统计
export function getDouyinPersonalCount(data) {
  return request({
    url: "/hxindex/Douyin/personcount",
    method: "POST",
    data
  });
}

// 抖音账号统计
export function getDouyinDepartgroup(data) {
  return request({
    url: "/hxindex/Douyin/departgroup",
    method: "POST",
    data
  });
}

// 抖音账号统计
export function getDouyinTotalCount(data) {
  return request({
    url: "/hxindex/Douyin/doucount",
    method: "POST",
    data
  });
}

// 抖音关键词详情
export function getDouyinWordInfo(data) {
  return request({
    url: "/hxindex/Douyin/wordinfo",
    method: "POST",
    data
  });
}

// 抖音关键词详情
export function getDouyinCountInfo(data) {
  return request({
    url: "/hxindex/Douyin/doucountinfo",
    method: "POST",
    data
  });
}