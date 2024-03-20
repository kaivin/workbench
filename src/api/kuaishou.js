import request from "@/utils/request";

// 快手排名列表
export function getKSData(data) {
  return request({
    url: "/hxindex/Kuaishou/index",
    method: "POST",
    data
  });
}

// 获取日期
export function getKSTime(data) {
  return request({
    url: "/hxindex/Kuaishou/getnumber",
    method: "POST",
    data
  });
}

// 获取部门统计情况
export function getKSScore(data) {
  return request({
    url: "/hxindex/Kuaishou/departscore",
    method: "POST",
    data
  });
}

// 个人账号列表
export function getKSdepartgroup(data) {
  return request({
    url: "/hxindex/Kuaishou/departgroup",
    method: "POST",
    data
  });
}

// 抖音账号统计
export function getKSDepartlist(data) {
  return request({
    url: "/hxindex/Kuaishou/departlist",
    method: "POST",
    data
  });
}

// 抖音账号统计
export function getKSCount(data) {
  return request({
    url: "/hxindex/Kuaishou/doucounttwo",
    method: "POST",
    data
  });
}

// 获取账号图表
export function getKSEachLine(data) {
  return request({
    url: "/hxindex/Kuaishou/dinfo",
    method: "POST",
    data
  });
}

// 获取部门图表
export function getKSAccountLine(data) {
  return request({
    url: "/hxindex/Kuaishou/departinfo",
    method: "POST",
    data
  });
}

// 获取账号统计
export function getKSPersonalCount(data) {
  return request({
    url: "/hxindex/Kuaishou/personcount",
    method: "POST",
    data
  });
}