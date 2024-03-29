﻿import request from "@/utils/request";
// 工单公共数据
export function workOrderPublicData() {
  return request({
    url: "/hxindex/Worksaccpet/commoncount",
    method: "POST",
  });
}
// 待接收工单数据
export function receiveWorkOrderData() {
    return request({
      url: "/hxindex/Worksaccpet/waitwork",
      method: "POST",
    });
}
  // 待分配工单数据
export function allotWorkOrderData() {
    return request({
      url: "/hxindex/Worksaccpet/waitdealwork",
      method: "POST",
    });
  }
  // 所有已分配工单数据
export function allotedWorkOrderData(data) {
    return request({
      url: "/hxindex/Worksaccpet/allwork",
      method: "POST",
      data
    });
  }
// 个人已分配工单数据
export function personWorkOrderData(data) {
    return request({
      url: "/hxindex/Worksaccpet/personwork",
      method: "POST",
      data
    });
}
// 进行中工单数据
export function doingWorkOrderData(data) {
    return request({
      url: "/hxindex/Worksaccpet/makeingwork",
      method: "POST",
      data
    });
}
// 已完成工单数据
export function doneWorkOrderData(data) {
    return request({
      url: "/hxindex/Worksaccpet/hasfinish",
      method: "POST",
      data
    });
}
// 数据统计
export function statWorkOrderData(data) {
    return request({
      url: "/hxindex/Worksaccpet/workcount",
      method: "POST",
      data,
    });
  }
  // 认领工单
  export function receiveWorkOrder(data) {
      return request({
        url: "/hxindex/Worksaccpet/confirmwork",
        method: "POST",
        data,
      });
    }
// 退回工单
export function backWorkOrder(data) {
    return request({
      url: "/hxindex/Worksaccpet/backwork",
      method: "POST",
      data,
    });
}
// 确认分配工单
export function confirmWorkOrder(data) {
    return request({
      url: "/hxindex/Worksaccpet/confirmdeal",
      method: "POST",
      data,
    });
}
// 撤销分配工单
export function undoWorkOrder(data) {
    return request({
      url: "/hxindex/Worksaccpet/workcancel",
      method: "POST",
      data,
    });
}
// 提交审核工单
export function confirmDoneWorkOrder(data) {
    return request({
      url: "/hxindex/Worksaccpet/confirmfinish",
      method: "POST",
      data,
    });
}
// 工单负责人数据
export function workOrderUserList() {
    return request({
      url: "/hxindex/Worksaccpet/getuser",
      method: "POST",
    });
}
// 工单详情信息数据
export function workOrderInfo(data) {
    return request({
      url: "/hxindex/Worksaccpet/workinfo",
      method: "POST",
      data,
    });
}
// 工单详情信息数据
export function workOrderNoAllotInfo(data) {
    return request({
      url: "/hxindex/Worksaccpet/waitworkinfo",
      method: "POST",
      data,
    });
}
// 工单详情评论
export function workOrderComment(data) {
    return request({
      url: "/hxindex/Worksaccpet/addcomment",
      method: "POST",
      data,
    });
}
//个人工单列表-负责人填写进度百分比（2021-10-13）
export function workOrderpercenter(data) {
  return request({
    url: "/hxindex/Worksaccpet/updatepercenter",
    method: "POST",
    data,
  });
}
//个人工单列表-负责人确认完成开始做工单（2021-10-13）
export function workOrderconfirmstart(data) {
  return request({
    url: "/hxindex/Worksaccpet/confirmstart",
    method: "POST",
    data,
  });
}
//修改已分配工单积分（未完成的可以修改）
export function workOrderEditscore(data) {
  return request({
    url: "/hxindex/Worksaccpet/editscore",
    method: "POST",
    data,
  });
}
//有发布权限的部门列表
export function getpublishdepart() {
  return request({
    url: "/hxindex/Worksaccpet/getpublishdepart",
    method: "POST",
  });
}
// 全部任务(所有已接受的工单列表)
export function allaccpetwork(data) {
  return request({
    url: "/hxindex/Worksaccpet/allaccpetwork",
    method: "POST",
    data,
  });
}
// 添加关注工单
export function getworkAddfocus(data) {
  return request({
    url: "/hxindex/Worksaccpet/workfocus",
    method: "POST",
    data,
  });
}
// 取消关注工单
export function getCancelworkfocus(data) {
  return request({
    url: "/hxindex/Worksaccpet/workfocuscancel",
    method: "POST",
    data,
  });
}
// 我的关注工单
export function getmyfocuswork(data) {
  return request({
    url: "/hxindex/Worksaccpet/myfocuswork",
    method: "POST",
    data,
  });
}
// 个人的好评列表
export function getGoodcomment(data) {
  return request({
    url: "/hxindex/Worksaccpet/goodcomment",
    method: "POST",
    data,
  });
}