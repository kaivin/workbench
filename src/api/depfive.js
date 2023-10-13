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
