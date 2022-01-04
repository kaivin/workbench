import request from "@/utils/request";
// 中文月成交积分统计
export function getDealNumTarget(data) {
  return request({
    url: "/hxindex/Api/chinadepartscorenew",
    method: "POST",
    data
  });
}

// 中文日目标
export function getDayTarget(data) {
  return request({
    url: "/hxindex/Api/chinadaytargetnew",
    method: "POST",
    data
  });
}

// 中文日目标完成情况
export function getDayFinish(data) {
  return request({
    url: "/hxindex/Api/chinadaytargetmonth",
    method: "POST",
    data
  });
}
// 部门月成交完成情况
export function getDepYearFinish() {
  return request({
    url: "/hxindex/Api/chinadepartscoreyear",
    method: "POST"
  });
}

// 英文月成交积分统计
export function getEnDealNumTarget(data) {
return request({
  url: "/hxindex/Api/endepartscorenew",
  method: "POST",
  data
});
}

// 英文日目标
export function getEnDayTarget(data) {
return request({
  url: "/hxindex/Api/endaytargetnew",
  method: "POST",
  data
});
}

// 英文日目标完成情况
export function getEnDayFinish(data) {
  return request({
    url: "/hxindex/Api/endaytargetmonth",
    method: "POST",
    data
  });
}

// 英文部门月成交完成情况
export function getEnDepYearFinish() {
  return request({
    url: "/hxindex/Api/endepartscoreyear",
    method: "POST"
  });
}