import request from "@/utils/request";
// 获取推广账户列表数据接口
export function getAccountList() {
  return request({
    url: "/hxindex/Ownpush/index",
    method: "POST"
  });
}// 获取推广账户列表数据接口
export function getAccountListAll() {
  return request({
    url: "/hxindex/Ownpush/pushaccount",
    method: "POST"
  });
}
// 添加推广账户接口
export function accountAdd(data) {
  return request({
    url: "/hxindex/Ownpush/pushadd",
    method: "POST",
    data
  });
}
// 编辑推广账户接口
export function accountEdit(data) {
  return request({
    url: "/hxindex/Ownpush/pushedit",
    method: "POST",
    data
  });
}
// 删除推广账户动作
export function accountDelete(data) {
  return request({
    url: "/hxindex/Ownpush/pushdelete",
    method: "POST",
    data
  });
}
// 添加|编辑时获取用户列表
export function userList() {
  return request({
    url: "/hxindex/Ownpush/mydepartuser",
    method: "POST"
  });
}

// 获取营销流程表列表数据接口
export function getCnProcessList(data) {
  return request({
    url: "/hxindex/Ownpush/process",
    method: "POST",
    data
  });
}
// 添加营销流程表动作
export function cnProcessAdd(data) {
  return request({
    url: "/hxindex/Ownpush/processadd",
    method: "POST",
    data
  });
}
// 编辑营销流程表动作
export function cnProcessEdit(data) {
  return request({
    url: "/hxindex/Ownpush/processedit",
    method: "POST",
    data
  });
}
// 删除营销流程表动作
export function cnProcessDelete(data) {
  return request({
    url: "/hxindex/Ownpush/processdelete",
    method: "POST",
    data
  });
}
// 营销流程表批量导入动作
export function cnProcessImport(data) {
  return request({
    url: "/hxindex/Ownpush/processaddall",
    method: "POST",
    data
  });
}

// 获取充值消费记录列表数据接口
export function getCnCostList(data) {
  return request({
    url: "/hxindex/Ownpush/moneylist",
    method: "POST",
    data
  });
}
// 添加充值消费记录动作
export function cnCostAdd(data) {
  return request({
    url: "/hxindex/Ownpush/moneyadd",
    method: "POST",
    data
  });
}
// 编辑充值消费记录动作
export function cnCostEdit(data) {
  return request({
    url: "/hxindex/Ownpush/moneyedit",
    method: "POST",
    data
  });
}
// 删除充值消费记录动作
export function cnCostDelete(data) {
  return request({
    url: "/hxindex/Ownpush/moneydelete",
    method: "POST",
    data
  });
}

// 获取推广渠道数据接口
export function getCnChannelList() {
  return request({
    url: "/hxindex/Ownpush/pushtype",
    method: "POST",
  });
}
// 添加推广渠道动作
export function cnChannelAdd(data) {
  return request({
    url: "/hxindex/Ownpush/pushtypeadd",
    method: "POST",
    data
  });
}
// 编辑推广渠道动作
export function cnChannelEdit(data) {
  return request({
    url: "/hxindex/Ownpush/pushtypeedit",
    method: "POST",
    data
  });
}
// 删除推广渠道动作
export function cnChannelDelete(data) {
  return request({
    url: "/hxindex/Ownpush/pushtypedelete",
    method: "POST",
    data
  });
}
// 消费记录列表
export function getExpenselog(data) {
  return request({
    url: "/hxindex/Ownpush/expenselog",
    method: "POST",
    data
  });
}
// 消费记录excel导入
export function getExpenseadd(data) {
  return request({
    url: "/hxindex/Ownpush/expenseadd",
    method: "POST",
    data,
    headers:{
      isFile:true,
    }
  });
}
// 部门统计分析
export function getOwnChinadepartcount(data) {
  return request({
    url: "/hxindex/Ownpush/chinadepartcount",
    method: "POST",
    data
  });
}
// 渠道列表
export function getOwnsource() {
  return request({
    url: "/hxindex/Ownpush/getsource",
    method: "POST",
  });
}
// 渠道统计分析
export function getOwnChinasourcecount(data) {
  return request({
    url: "/hxindex/Ownpush/chinasourcecount",
    method: "POST",
    data
  });
}
// 电商一部 （渠道统计分析默认页面）
export function getOwnChinasourcedefault(data) {
  return request({
    url: "/hxindex/Ownpush/chinasourcedefault",
    method: "POST",
    data
  });
}