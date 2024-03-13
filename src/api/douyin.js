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
    url: "/hxindex/Douyin/doucount",
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