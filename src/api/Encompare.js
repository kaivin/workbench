import request from "@/utils/request";
// 部门成交——积分列表
export function EndeparDealList(data) {
  return request({
    url: "/hxindex/Encompare/lists",
    method: "POST",
    data
  });
}
// 小组成交——积分列表
export function EngroupDealList(data) {
  return request({
    url: "/hxindex/Encompare/grouplists",
    method: "POST",
    data
  });
}
// 部门成交——选择部门
export function EndeparDealListChoose(data) {
    return request({
      url: "/hxindex/Encompare/departlist",
      method: "POST",
      data
    });
  }
// 小组成交——选择部门
export function EngroupDealListChoose(data) {
  return request({
    url: "/hxindex/Encompare/grouplist",
    method: "POST",
    data
  });
}
// 部门成交——积分添加
export function EndeparDealListAdd(data) {
    return request({
      url: "/hxindex/Encompare/targetadd",
      method: "POST",
      data
    });
  }
// 小组成交——积分添加
export function EngroupDealListAdd(data) {
  return request({
    url: "/hxindex/Encompare/grouptargetadd",
    method: "POST",
    data
  });
}
// 部门成交——积分列表修改
export function EndeparDealEdit(data) {
    return request({
      url: "/hxindex/Encompare/targetedit",
      method: "POST",
      data
    });
  }
// 小组成交——积分列表修改
export function EngroupDealEdit(data) {
  return request({
    url: "/hxindex/Encompare/grouptargetedit",
    method: "POST",
    data
  });
}
// 部门成交——积分列表删除
export function EndeparDealDel(data) {
    return request({
      url: "/hxindex/Encompare/targetdelete",
      method: "POST",
      data
    });
  }
// 小组成交——积分列表删除
export function EngroupDealDel(data) {
  return request({
    url: "/hxindex/Encompare/grouptargetdelete",
    method: "POST",
    data
  });
}