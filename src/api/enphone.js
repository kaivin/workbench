import request from "@/utils/request";
// 获取中文电话列表数据接口
export function getPhoneList() {
  return request({
    url: "/hxindex/Enphone/phonelist",
    method: "POST"
  });
}
// 添加中文电话接口
export function phoneAdd(data) {
  return request({
    url: "/hxindex/Enphone/phoneadd",
    method: "POST",
    data
  });
}
// 编辑中文电话接口
export function phoneEdit(data) {
  return request({
    url: "/hxindex/Enphone/phoneedit",
    method: "POST",
    data
  });
}
// 删除中文电话接口
export function phoneDelete(data) {
  return request({
    url: "/hxindex/Enphone/phonedelete",
    method: "POST",
    data
  });
}
// 获取电话添加编辑是需要的系统数据接口
export function phoneAddEditData() {
  return request({
    url: "/hxindex/Enphone/getuserdepart",
    method: "POST"
  });
}
// 电话分配可读角色
export function phoneAllotReadRole(data) {
  return request({
    url: "/hxindex/Enphone/getenphonereadrole",
    method: "POST",
    data
  });
}
// 电话已分配可读角色
export function phoneAllotedReadRole(data) {
  return request({
    url: "/hxindex/Enphone/enphonereadrole",
    method: "POST",
    data
  });
}
// 电话分配可写角色
export function phoneAllotWriteRole(data) {
  return request({
    url: "/hxindex/Enphone/getenphonewriterole",
    method: "POST",
    data
  });
}
// 电话已分配可写角色
export function phoneAllotedWriteRole(data) {
  return request({
    url: "/hxindex/Enphone/enphonewriterole",
    method: "POST",
    data
  });
}
// 电话绑定域名
export function phoneAllotDomain(data) {
  return request({
    url: "/hxindex/Enphone/getphonedomain",
    method: "POST",
    data
  });
}
// 电话已绑定域名
export function phoneAllotedDomain(data) {
  return request({
    url: "/hxindex/Enphone/hasphonedomain",
    method: "POST",
    data
  });
}
// 当前登录用户可操作的域名
export function userCanAllotDomain() {
  return request({
    url: "/hxindex/Enphone/domainlist",
    method: "POST"
  });
}

// 产品类型列表数据获取接口
export function getProductTypeList() {
    return request({
      url: "/hxindex/Enphone/producttypelist",
      method: "POST"
    });
  }
  // 产品类型添加接口
  export function productTypeAdd(data) {
    return request({
      url: "/hxindex/Enphone/producttypeadd",
      method: "POST",
      data
    });
  }
  // 产品类型编辑接口
  export function productTypeEdit(data) {
    return request({
      url: "/hxindex/Enphone/producttypeedit",
      method: "POST",
      data
    });
  }
  // 产品类型删除接口
  export function productTypeDelete(data) {
    return request({
      url: "/hxindex/Enphone/producttypedelete",
      method: "POST",
      data
    });
  }

// 产品列表数据获取接口
export function getProductList(data) {
  return request({
    url: "/hxindex/Enphone/productlist",
    method: "POST",
    data
  });
}
// 产品添加接口
export function productAdd(data) {
  return request({
    url: "/hxindex/Enphone/productadd",
    method: "POST",
    data
  });
}
// 产品编辑接口
export function productEdit(data) {
  return request({
    url: "/hxindex/Enphone/productedit",
    method: "POST",
    data
  });
}
// 产品删除接口
export function productDelete(data) {
  return request({
    url: "/hxindex/Enphone/productdelete",
    method: "POST",
    data
  });
}
// 获取产品添加编辑时需要的系统数据
export function productAddEditData() {
  return request({
    url: "/hxindex/Enphone/getproducttypelevel",
    method: "POST",
  });
}

// 询盘字段分配角色
export function cluesAllotRole(data) {
  return request({
    url: "/hxindex/Enphone/getrole",
    method: "POST",
    data
  });
}
// 询盘字段已分配角色
export function cluesAllotedRole(data) {
  return request({
    url: "/hxindex/Enphone/tablerole",
    method: "POST",
    data
  });
}
// 询盘字段列表数据获取接口
export function getCluesList() {
  return request({
    url: "/hxindex/Enphone/enxunfield",
    method: "POST"
  });
}
// 询盘系统页面默认电话列表数据获取动作
export function cluesPhoneIndexData() {
  return request({
    url: "/hxindex/Enphone/phoneindex",
    method: "POST"
  });
}
// 询盘系统页面当前电话搜索条件数据获取动作
export function cluesCurrentPhoneSearchData(data) {
  return request({
    url: "/hxindex/Enphone/listcondition",
    method: "POST",
    data
  });
}
// 询盘系统页面当前电话询盘数据获取动作
export function cluesCurrentPhoneData(data) {
  return request({
    url: "/hxindex/Enphone/lists",
    method: "POST",
    data
  });
}
// 询盘系统页面当前电话询盘数据获电商人员编辑动作
export function cluesCurrentPhoneDataEleEdit(data) {
  return request({
    url: "/hxindex/Enphone/otheredit",
    method: "POST",
    data
  });
}
// 询盘系统页面当前电话询盘数据获电商人员批量编辑动作
export function cluesCurrentPhoneDataEleEditPage(data) {
  return request({
    url: "/hxindex/Enphone/othereditall",
    method: "POST",
    data
  });
}
// 询盘系统页面当前电话询盘数据删除动作
export function cluesCurrentPhoneDataDelete(data) {
  return request({
    url: "/hxindex/Enphone/delete",
    method: "POST",
    data
  });
}
// 询盘系统页面当前电话询盘获取当前登录用户可操作的字段动作
export function cluesCurrentPhoneUserCanEditField() {
  return request({
    url: "/hxindex/Enphone/myfield",
    method: "POST"
  });
}
// 询盘系统页面搜索询盘页查询条件数据获取动作
export function cluesSearchSelectData() {
  return request({
    url: "/hxindex/Enphone/searchcondition",
    method: "POST"
  });
}
// 询盘系统页面搜索询盘页获取当前分类下的产品动作
export function getCurrentCateProductList(data) {
  return request({
    url: "/hxindex/Enphone/getproduct",
    method: "POST",
    data
  });
}
// 询盘系统页面搜索询盘页获取搜索结果动作
export function getCurrentCluesSearchList(data) {
  return request({
    url: "/hxindex/Enphone/search",
    method: "POST",
    data
  });
}
// 询盘系统页面搜索询盘页批量标记为A
export function currentCluesSetALevel(data) {
  return request({
    url: "/hxindex/Enphone/custormgivea",
    method: "POST",
    data
  });
}


// 询盘添加编辑时获取系统数据
export function cluesAddEditData() {
  return request({
    url: "/hxindex/Enphone/getalldata",
    method: "POST"
  });
}
// 询盘添加保存数据
export function cluesAdd(data) {
  return request({
    url: "/hxindex/Enphone/add",
    method: "POST",
    data
  });
}
// 询盘编辑保存数据
export function cluesEdit(data) {
  return request({
    url: "/hxindex/Enphone/edit",
    method: "POST",
    data
  });
}
// 询盘编辑获取询盘初始化信息数据
export function initCluesEditInfo(data) {
  return request({
    url: "/hxindex/Enphone/editini",
    method: "POST",
    data
  });
}
// 根据询盘链接页面获取页面绑定电话动作
export function cluesUrlGetPhone(data) {
  return request({
    url: "/hxindex/Enphone/getphone",
    method: "POST",
    data
  });
}
// 询盘修改添加的地区验证
export function cluesRegionValid(data) {
  return request({
    url: "/hxindex/Enphone/getcity",
    method: "POST",
    data
  });
}

// 询盘统计获取搜索条件数据
export function cluesAnalysisSystemData() {
  return request({
    url: "/hxindex/Enphone/allcondition",
    method: "POST"
  });
}
// 询盘统计获取搜索结果数据
export function cluesAnalysisResultData(data) {
  return request({
    url: "/hxindex/Enphone/countlist",
    method: "POST",
    data
  });
}