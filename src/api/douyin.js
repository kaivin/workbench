import request from "@/utils/request";

// 获取询盘搜索条件
export function getDouyinData(data) {
  return request({
    url: "/hxindex/Douyin/index",
    method: "POST",
    data
  });
}