import request from "@/utils/request";
// 中文季度目标列表
export function chScoreList(data) {
  return request({
    url: "/hxindex/Ownpush/chscoretargetlist",
    method: "POST",
    data
  });
}

// 中文季度目标添加
export function chScoreAdd(data) {
  return request({
    url: "/hxindex/Ownpush/chscoretargetadd",
    method: "POST",
    data
  });
}

// 中文季度目标修改
export function chScoreEdit(data) {
  return request({
    url: "/hxindex/Ownpush/chscoretargetedit",
    method: "POST",
    data
  });
}

// 中文季度目标删除
export function chScoreDelete(data) {
  return request({
    url: "/hxindex/Ownpush/chscoretargetdelete",
    method: "POST",
    data
  });
}

// 获取中文季度目标
export function getChScore(data) {
  return request({
    url: "/hxindex/Ownpush/getchinascoretarget",
    method: "POST",
    data
  });
}

// 英文季度目标列表
export function enScoreList(data) {
  return request({
    url: "/hxindex/Ownpush/enscoretargetlist",
    method: "POST",
    data
  });
}

// 英文季度目标添加
export function enScoreAdd(data) {
  return request({
    url: "/hxindex/Ownpush/enscoretargetadd",
    method: "POST",
    data
  });
}

// 英文季度目标修改
export function enScoreEdit(data) {
  return request({
    url: "/hxindex/Ownpush/enscoretargetedit",
    method: "POST",
    data
  });
}

// 英文季度目标删除
export function enScoreDelete(data) {
  return request({
    url: "/hxindex/Ownpush/enscoretargetdelete",
    method: "POST",
    data
  });
}

// 获取英文季度目标
export function getEnScore(data) {
  return request({
    url: "/hxindex/Ownpush/getenscoretarget",
    method: "POST",
    data
  });
}