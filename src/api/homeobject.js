import request from "@/utils/request";
// 中文日询盘
export function getDayNum() {
    return request({
      url: "/hxindex/Api/chinadaytargetnew",
      method: "POST"
    });
  }
// 中文月成交积分统计
export function getDealNumTarget() {
  return request({
    url: "/hxindex/Api/chinadepartscore",
    method: "POST"
  });
}

// 中文日目标
export function getDayTarget() {
  return request({
    url: "/hxindex/Api/chinadaytarget",
    method: "POST"
  });
}

// 中文日目标完成情况
export function getDayFinish() {
  return request({
    url: "/hxindex/Api/chinadaytargetmonth",
    method: "POST"
  });
}
// 部门月成交完成情况
export function getDepYearFinish() {
  return request({
    url: "/hxindex/Api/chinadepartscoreyear",
    method: "POST"
  });
}

// 英文日询盘
export function getEnDayNum() {
  return request({
    url: "/hxindex/Api/endaytargetnew",
    method: "POST"
  });
}
// 英文月成交积分统计
export function getEnDealNumTarget() {
return request({
  url: "/hxindex/Api/endepartscorenew",
  method: "POST"
});
}

// 英文日目标
export function getEnDayTarget() {
return request({
  url: "/hxindex/Api/endaytargetnew",
  method: "POST"
});
}

// 英文日目标完成情况
export function getEnDayFinish() {
  return request({
    url: "/hxindex/Api/endaytargetmonth",
    method: "POST"
  });
}

// 英文部门月成交完成情况
export function getEnDepYearFinish() {
  return request({
    url: "/hxindex/Api/endepartscoreyear",
    method: "POST"
  });
}