import request from "@/utils/request";
// 获取工单系统标签列表
export function getWorkOrderTagList() {
  return request({
    url: "/hxindex/Works/index",
    method: "POST"
  });
}
// 工单标签添加
export function workOrderTagAdd(data) {
  return request({
    url: "/hxindex/Works/add",
    method: "POST",
    data
  });
}
// 工单标签编辑
export function workOrderTagEdit(data) {
  return request({
    url: "/hxindex/Works/edit",
    method: "POST",
    data
  });
}
// 工单标签删除
export function workOrderTagDelete(data) {
  return request({
    url: "/hxindex/Works/delete",
    method: "POST",
    data
  });
}

// 获取工单列表（发布方）
export function getWorkOrderList(data) {
  return request({
    url: "/hxindex/Works/worklist",
    method: "POST",
    data,
  });
}
// 获取工单发布人数据
export function issuerList() {
  return request({
    url: "/hxindex/Works/getuser",
    method: "POST",
  });
}
// 获取工单部门数据
export function departList() {
  return request({
    url: "/hxindex/Works/getdepart",
    method: "POST",
  });
}
// 获取工单系统标签数据
export function tagList() {
  return request({
    url: "/hxindex/Works/gettypetags",
    method: "POST",
  });
}
// 获取工单发布所需的系统数据
export function getSystemData() {
  return request({
    url: "/hxindex/Works/getalldata",
    method: "POST",
  });
}
// 工单发布
export function workOrderAdd(data) {
  return request({
    url: "/hxindex/Works/publishwork",
    method: "POST",
    data,
  });
}
// 工单修改
export function workOrderEdit(data) {
  return request({
    url: "/hxindex/Works/workedit",
    method: "POST",
    data,
  });
}
// 工单删除
export function workOrderDelete(data) {
  return request({
    url: "/hxindex/Works/workdelete",
    method: "POST",
    data,
  });
}
// 工单撤销
export function workOrderCancel(data) {
  return request({
    url: "/hxindex/Works/workcancel",
    method: "POST",
    data,
  });
}
// 工单确认完成
export function workOrderConfirm(data) {
  return request({
    url: "/hxindex/Works/workconfirm",
    method: "POST",
    data,
  });
}
// 工单审核驳回
export function workOrderRejected(data) {
  return request({
    url: "/hxindex/Works/noconfirm",
    method: "POST",
    data,
  });
}
// 工单编辑初始化信息数据
export function workOrderEditInitInfo(data) {
  return request({
    url: "/hxindex/Works/workeditini",
    method: "POST",
    data,
  });
}
// 工单统计数据
export function workOrderStatInfo(data) {
  return request({
    url: "/hxindex/Works/workcount",
    method: "POST",
    data,
  });
}
// 工单评价保存
export function workOrderEvaluateSave(data) {
  return request({
    url: "/hxindex/Works/addevaluation",
    method: "POST",
    data,
  });
}
// 字典表配置获取信息
export function buckleInitInfo() {
  return request({
    url: "/hxindex/Works/buckeinfo",
    method: "POST",
  });
}
// 字典表配置信息保存
export function buckleInfoSave(data) {
  return request({
    url: "/hxindex/Works/buckle",
    method: "POST",
    data,
  });
}
// 获取评论数据
export function commentInfoList(data) {
  return request({
    url: "/hxindex/Works/commentlist",
    method: "POST",
    data,
  });
}
// 删除评论数据
export function deleteCurrentComment(data) {
  return request({
    url: "/hxindex/Works/commentdelete",
    method: "POST",
    data,
  });
}
// 发布评论
export function addCommentInfo(data) {
  return request({
    url: "/hxindex/Works/addcomment",
    method: "POST",
    data,
  });
}