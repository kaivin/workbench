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

// 英文成交详情列表2
export function getCustormenbuyListTwo(data) {
  return request({
    url: "/hxindex/Custormenbuy/indextwo",
    method: "POST",
    data
  });
}
// 英文成交详情导入2
export function setExportLinkenTwo(data) {
  return request({
    url: "/hxindex/Custormenbuy/exportlinktwo",
    method: "POST",
    data,
    headers:{
      isFile:true,
    }
  });
}

// 中文小组花费列表
export function getCustormbuyMoneylist(data) {
  return request({
    url: "/hxindex/Custormbuy/monelist",
    method: "POST",
    data
  });
}
// 中文小组花费导入
export function exportCustormbuyMoney(data) {
  return request({
    url: "/hxindex/Custormbuy/exportlinkgroup",
    method: "POST",
    data,
    headers:{
      isFile:true,
    }
  });
}

// 英文小组花费列表
export function getEnCustormbuyMoneylist(data) {
  return request({
    url: "/hxindex/Custormenbuy/monelist",
    method: "POST",
    data
  });
}
// 英文小组花费导入
export function exportEnCustormbuyMoney(data) {
  return request({
    url: "/hxindex/Custormenbuy/exportlinkgroup",
    method: "POST",
    data,
    headers:{
      isFile:true,
    }
  });
}