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