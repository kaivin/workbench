import request from "@/utils/request";
// 获取网站基础选择条件数据
export function getWebsiteProperty() {
  return request({
    url: "/hxindex/Website/mycondition",
    method: "POST"
  });
}
// 获取网站数据列表
export function getWebsiteDataList(data) {
  return request({
    url: "/hxindex/Website/lists",
    method: "POST",
    data
  });
}
// 添加网站
export function websiteAdd(data) {
  return request({
    url: "/hxindex/Website/add",
    method: "POST",
    data
  });
}
// 编辑网站
export function websiteEdit(data) {
  return request({
    url: "/hxindex/Website/edit",
    method: "POST",
    data
  });
}
// 编辑网站获取网站修改系统数据
export function websiteEditSystemInfo() {
  return request({
    url: "/hxindex/Website/getalldata",
    method: "POST"
  });
}
// 编辑网站获取网站基本信息
export function websiteEditInfo(data) {
  return request({
    url: "/hxindex/Website/editini",
    method: "POST",
    data
  });
}

// 删除网站
export function websiteDelete(data) {
  return request({
    url: "/hxindex/Website/delete",
    method: "POST",
    data
  });
}

// 获取网站品牌数据列表
export function getWebsiteBrandDataList() {
  return request({
    url: "/hxindex/Website/brand",
    method: "POST"
  });
}
// 获取网站语言数据列表
export function getWebsiteLangDataList() {
  return request({
    url: "/hxindex/Website/language",
    method: "POST"
  });
}
// 获取网站host状态数据列表
export function getWebsiteHostDataList() {
  return request({
    url: "/hxindex/Website/hosting",
    method: "POST"
  });
}

// 获取网站标签属性数据列表
export function getWebsiteAttrDataList() {
  return request({
    url: "/hxindex/Website/attrlist",
    method: "POST"
  });
}
// 添加网站标签属性
export function websiteAttrAdd(data) {
  return request({
    url: "/hxindex/Website/attradd",
    method: "POST",
    data
  });
}
// 编辑网站标签属性
export function websiteAttrEdit(data) {
  return request({
    url: "/hxindex/Website/attredit",
    method: "POST",
    data
  });
}
// 删除网站标签属性
export function websiteAttrDelete(data) {
  return request({
    url: "/hxindex/Website/attrdelete",
    method: "POST",
    data
  });
}

// 获取网站日志数据列表
export function getWebsiteLogDataList(data) {
  return request({
    url: "/hxindex/Website/loglist",
    method: "POST",
    data
  });
}
// 添加网站日志
export function websiteLogAdd(data) {
  return request({
    url: "/hxindex/Website/logadd",
    method: "POST",
    data
  });
}
// 编辑网站日志
export function websiteLogEdit(data) {
  return request({
    url: "/hxindex/Website/logedit",
    method: "POST",
    data
  });
}
// 删除网站日志
export function websiteLogDelete(data) {
  return request({
    url: "/hxindex/Website/logdelete",
    method: "POST",
    data
  });
}
// 添加修改网站日志时获取系统标签
export function systemTagList() {
  return request({
    url: "/hxindex/Website/tags",
    method: "POST",
  });
}
// 修改网站日志时获取日志详情
export function websiteLogEditInfo(data) {
  return request({
    url: "/hxindex/Website/logeditini",
    method: "POST",
    data
  });
}
// 网站日志获取日志详情
export function websiteLogInfo(data) {
  return request({
    url: "/hxindex/Website/loginfo",
    method: "POST",
    data
  });
}
// 网站日志获取已读未读用户数据
export function websiteLogReadUser(data) {
  return request({
    url: "/hxindex/Website/getreaduser",
    method: "POST",
    data
  });
}

// 网站编辑页面字段权限列表
export function websiteFieldList() {
  return request({
    url: "/hxindex/Website/websitefield",
    method: "POST",
  });
}
// 网站属性字段可读权限已分配角色数据
export function websiteFieldAllotedReadPermit(data) {
  return request({
    url: "/hxindex/Website/fieldreadrole",
    method: "POST",
    data
  });
}
// 网站属性字段可写权限已分配角色数据
export function websiteFieldAllotedWritePermit(data) {
  return request({
    url: "/hxindex/Website/fieldwriterole",
    method: "POST",
    data
  });
}
// 网站属性字段可读权限分配角色
export function websiteFieldAllotReadPermit(data) {
  return request({
    url: "/hxindex/Website/getfieldreadrole",
    method: "POST",
    data
  });
}
// 网站属性字段可写权限分配角色
export function websiteFieldAllotWritePermit(data) {
  return request({
    url: "/hxindex/Website/getfieldwriterole",
    method: "POST",
    data
  });
}