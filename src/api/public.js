import request from "@/utils/request";

export function getMenuPermit(data) {
  return request({
    url: "/hxindex/Api/getmenupermit",
    method: "POST",
    data
  });
}
export function getUserInfo(data) {
  return request({
    url: "/hxindex/Api/getpersoninfo",
    method: "POST",
    data
  });
}
export function getUser() {
  return request({
    url: "/hxindex/Api/getmyuser",
    method: "POST",
  });
}
export function getWorkName() {
  return request({
    url: "/hxindex/Api/getworkname",
    method: "POST",
  });
}
export function getPostionName() {
  return request({
    url: "/hxindex/Api/getpostion",
    method: "POST",
  });
}