import request from "@/utils/request";
// 留言系统全部留言信息数据
export function webMsgAllList(data) {
  return request({
    url: "/hxindex/Webmsg/allmsg",
    method: "POST",
    data
  });
}
// 留言系统未处理留言信息数据
export function webMsgUntreatedList(data) {
  return request({
    url: "/hxindex/Webmsg/nodealmsg",
    method: "POST",
    data
  });
}
// 留言系统个人待处理留言信息数据
export function webMsgPendingList(data) {
  return request({
    url: "/hxindex/Webmsg/persondealmsg",
    method: "POST",
    data
  });
}
// 留言系统个人已处理留言信息数据
export function webMsgProcessedList(data) {
  return request({
    url: "/hxindex/Webmsg/hasdealmsg",
    method: "POST",
    data
  });
}
// 留言系统加星标留言信息数据
export function webMsgStarList(data) {
  return request({
    url: "/hxindex/Webmsg/hasstarmsg",
    method: "POST",
    data
  });
}
// 留言系统垃圾留言信息数据
export function webMsgSpamList(data) {
  return request({
    url: "/hxindex/Webmsg/rubblishmsg",
    method: "POST",
    data
  });
}
// 留言系统测试留言信息数据
export function webMsgTestList(data) {
  return request({
    url: "/hxindex/Webmsg/testmsg",
    method: "POST",
    data
  });
}
// 留言系统推广待处理留言信息数据
export function webMsgPromotePendingList(data) {
  return request({
    url: "/hxindex/Webmsg/pushwaitdeal",
    method: "POST",
    data
  });
}
// 留言系统推广待处理撤回
export function webMsgRevoke(data) {
  return request({
    url: "/hxindex/Webmsg/haswaitdealback",
    method: "POST",
    data
  });
}
// 留言系统推广已处理留言信息数据
export function webMsgPromoteProcessedList(data) {
  return request({
    url: "/hxindex/Webmsg/pushhasdeal",
    method: "POST",
    data
  });
}
// 留言系统已过滤垃圾留言信息数据
export function webMsgFilterSpamList(data) {
  return request({
    url: "/hxindex/Webmsg/filetermsg",
    method: "POST",
    data
  });
}
// 留言系统回收站留言信息数据
export function webMsgRecycleList(data) {
  return request({
    url: "/hxindex/Webmsg/deletemsg",
    method: "POST",
    data
  });
}
// 留言系统初始化信息数据
export function webMsgInitData() {
  return request({
    url: "/hxindex/Webmsg/msgindex",
    method: "POST"
  });
}
// 留言系统下拉框选择数据
export function webMsgSearchSystemList() {
  return request({
    url: "/hxindex/Webmsg/listcondition",
    method: "POST"
  });
}
// 留言系统当前登录用户拥有权限的字段
export function webMsgUserPermitFieldList() {
  return request({
    url: "/hxindex/Webmsg/myfield",
    method: "POST"
  });
}
// 留言系统留言添加到个人待处理
export function webMsgAllotToPending(data) {
  return request({
    url: "/hxindex/Webmsg/addpersondeal",
    method: "POST",
    data
  });
}
// 留言系统留言删除
export function webMsgDelete(data) {
  return request({
    url: "/hxindex/Webmsg/delete",
    method: "POST",
    data
  });
}
// 留言系统回收站留言删除
export function webMsgRecycleDelete(data) {
  return request({
    url: "/hxindex/Webmsg/deleteconfirm",
    method: "POST",
    data
  });
}
// 留言系统留言修改
export function webMsgEdit(data) {
  return request({
    url: "/hxindex/Webmsg/edit",
    method: "POST",
    data
  });
}
// 留言系统回收站留言还原
export function webMsgRecycleBack(data) {
  return request({
    url: "/hxindex/Webmsg/deleteback",
    method: "POST",
    data
  });
}
// 留言系统过滤信息还原
export function webMsgFilterBack(data) {
  return request({
    url: "/hxindex/Webmsg/filterback",
    method: "POST",
    data
  });
}
// 留言系统留言修改为推广待处理
export function webMsgPromotePending(data) {
  return request({
    url: "/hxindex/Webmsg/haswaitdealsub",
    method: "POST",
    data
  });
}
// 留言系统留言修改为推广已处理
export function webMsgPromoteProcessed(data) {
  return request({
    url: "/hxindex/Webmsg/hasdealsub",
    method: "POST",
    data
  });
}
// 留言系统同步第三方平台留言信息
export function webMsgSyncPlatMsg(data) {
  return request({
    url: "/hxindex/Webmsg/getmsg",
    method: "POST",
    data
  });
}


// 留言表系统权限字段列表数据
export function webMsgPermitFieldList() {
  return request({
    url: "/hxindex/Webmsg/msgfield",
    method: "POST"
  });
}
// 留言表系统权限字段已分配角色
export function webMsgPermitFieldAllotedRoleList(data) {
  return request({
    url: "/hxindex/Webmsg/tablerole",
    method: "POST",
    data
  });
}
// 留言表系统权限字段角色分配
export function webMsgPermitFieldAllotRole(data) {
  return request({
    url: "/hxindex/Webmsg/getrole",
    method: "POST",
    data
  });
}


// 留言表系统ip白名单列表数据
export function webMsgWhiteIpList(data) {
  return request({
    url: "/hxindex/Webmsg/whiteip",
    method: "POST",
    data
  });
}
// 留言表系统ip白名单添加
export function webMsgWhiteIpAdd(data) {
  return request({
    url: "/hxindex/Webmsg/addip",
    method: "POST",
    data
  });
}
// 留言表系统ip白名单修改
export function webMsgWhiteIpEdit(data) {
  return request({
    url: "/hxindex/Webmsg/editip",
    method: "POST",
    data
  });
}
// 留言表系统ip白名单删除
export function webMsgWhiteIpDelete(data) {
  return request({
    url: "/hxindex/Webmsg/ipdelete",
    method: "POST",
    data
  });
}
// 删除超过7天的已过滤垃圾信息
export function deleteHistoryFilterMsg() {
  return request({
    url: "/hxindex/Webmsg/deletefiltermsg",
    method: "POST",
  });
}
// 删除超过7天的回收站信息
export function deleteHistoryRecycleMsg() {
  return request({
    url: "/hxindex/Webmsg/deleterecyclemsg",
    method: "POST",
  });
}
// 删除超过5天的中文API留言信息
export function deleteCnApiMsg() {
  return request({
    url: "/hxindex/Webmsg/deleteapi",
    method: "POST",
  });
}