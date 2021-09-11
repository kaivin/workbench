import request from "@/utils/request";
// 部门成交——积分列表
export function EndeparDealList(data) {
  return request({
    url: "/hxindex/Encompare/lists",
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
// 部门成交——积分添加
export function EndeparDealListAdd(data) {
    return request({
      url: "/hxindex/Encompare/targetadd",
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
// 部门成交——积分列表删除
export function EndeparDealDel(data) {
    return request({
      url: "/hxindex/Encompare/targetdelete",
      method: "POST",
      data
    });
  }