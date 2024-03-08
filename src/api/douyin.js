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