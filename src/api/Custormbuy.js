import request from "@/utils/request";
// 中文成交详情列表
export function getCustormbuyList(data) {
  return request({
    url: "/hxindex/Custormbuy/index",
    method: "POST",
    data
  });
}
// 中文成交详情导入
export function setExportLink(data) {
  return request({
    url: "/hxindex/Custormbuy/exportlink",
    method: "POST",
    data,
    headers:{
      isFile:true,
    }
  });
}
// 英文成交详情列表
export function getCustormenbuyList(data) {
  return request({
    url: "/hxindex/Custormenbuy/index",
    method: "POST",
    data
  });
}
// 英文成交详情导入
export function setExportLinken(data) {
  return request({
    url: "/hxindex/Custormenbuy/exportlink",
    method: "POST",
    data,
    headers:{
      isFile:true,
    }
  });
}
