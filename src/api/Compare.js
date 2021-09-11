import request from "@/utils/request";
// 部门成交——积分列表
export function deparDealList(data) {
  return request({
    url: "/hxindex/Compare/lists",
    method: "POST",
    data
  });
}
// 部门成交——选择部门
export function deparDealListChoose(data) {
    return request({
      url: "/hxindex/Compare/departlist",
      method: "POST",
      data
    });
  }
// 部门成交——积分添加
export function deparDealListAdd(data) {
    return request({
      url: "/hxindex/compare/targetadd",
      method: "POST",
      data
    });
  }
// 部门成交——积分列表修改
export function deparDealEdit(data) {
    return request({
      url: "/hxindex/compare/targetedit",
      method: "POST",
      data
    });
  }
// 部门成交——积分列表删除
export function deparDealDel(data) {
    return request({
      url: "/hxindex/compare/targetdelete",
      method: "POST",
      data
    });
  }