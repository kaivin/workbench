import request from "@/utils/request";

// 获取工作类型
export function getVideoType(data) {
  return request({
    url: "/hxindex/videocount/typelist",
    method: "POST",
    data
  });
}

// 获取工作岗位
export function getVideoPost(data) {
  return request({
    url: "/hxindex/videocount/postlist",
    method: "POST",
    data
  });
}

// 记录列表
export function getRecordList(data) {
  return request({
    url: "/hxindex/videocount/wordlist",
    method: "POST",
    data
  });
}

// 记录详情
export function getRecordDetail(data) {
    return request({
      url: "/hxindex/videocount/saveword",
      method: "POST",
      data
    });
}

// 保存记录
export function saveRecord(data) {
    return request({
      url: "/hxindex/videocount/saveword",
      method: "POST",
      data
    });
}

// 删除记录
export function delRecord(data) {
  return request({
    url: "/hxindex/videocount/delword",
    method: "POST",
    data
  });
}


// 手动分配
export function seprateScore(data) {
    return request({
      url: "/hxindex/videocount/distribution",
      method: "POST",
      data
    });
}

// 组员列表
export function getUserList(data) {
  return request({
    url: "/hxindex/videocount/userlist",
    method: "POST",
    data
  });
}

// 统计数据
export function getCountData(data) {
  return request({
    url: "/hxindex/videocount/index",
    method: "POST",
    data
  });
}

// 统计个人占比数据
export function getPieCountData(data) {
  return request({
    url: "/hxindex/videocount/index_2",
    method: "POST",
    data
  });
}

// 工作内容统计
export function getDayWordList(data) {
  return request({
    url: "/hxindex/videocount/daywordlist",
    method: "POST",
    data
  });
}