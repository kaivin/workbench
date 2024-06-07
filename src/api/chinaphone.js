import request from "@/utils/request";
// 获取中文电话列表数据接口
export function getPhoneList() {
  return request({
    url: "/hxindex/Chinaphone/phonelist",
    method: "POST"
  });
}
// 添加中文电话接口
export function phoneAdd(data) {
  return request({
    url: "/hxindex/Chinaphone/phoneadd",
    method: "POST",
    data
  });
}
// 编辑中文电话接口
export function phoneEdit(data) {
  return request({
    url: "/hxindex/Chinaphone/phoneedit",
    method: "POST",
    data
  });
}
// 删除中文电话接口
export function phoneDelete(data) {
  return request({
    url: "/hxindex/Chinaphone/phonedelete",
    method: "POST",
    data
  });
}
// 获取电话添加编辑是需要的系统数据接口
export function phoneAddEditData() {
  return request({
    url: "/hxindex/Chinaphone/getuserdepart",
    method: "POST"
  });
}
// 电话分配可读角色
export function phoneAllotReadRole(data) {
  return request({
    url: "/hxindex/Chinaphone/getchinaphonereadrole",
    method: "POST",
    data
  });
}
// 电话已分配可读角色
export function phoneAllotedReadRole(data) {
  return request({
    url: "/hxindex/Chinaphone/chinaphonereadrole",
    method: "POST",
    data
  });
}
// 电话分配可写角色
export function phoneAllotWriteRole(data) {
  return request({
    url: "/hxindex/Chinaphone/getchinaphonewriterole",
    method: "POST",
    data
  });
}
// 电话已分配可写角色
export function phoneAllotedWriteRole(data) {
  return request({
    url: "/hxindex/Chinaphone/chinaphonewriterole",
    method: "POST",
    data
  });
}
// 电话绑定域名
export function phoneAllotDomain(data) {
  return request({
    url: "/hxindex/Chinaphone/getphonedomain",
    method: "POST",
    data
  });
}
// 电话已绑定域名
export function phoneAllotedDomain(data) {
  return request({
    url: "/hxindex/Chinaphone/hasphonedomain",
    method: "POST",
    data
  });
}
// 当前登录用户可操作的域名
export function userCanAllotDomain(data) {
  return request({
    url: "/hxindex/Chinaphone/domainlist",
    method: "POST",
    data
  });
}

// 电话绑定多媒体
export function phoneAllotVideo(data) {
  return request({
    url: "/hxindex/Chinaphone/getvideodomain",
    method: "POST",
    data
  });
}
// 电话已绑定多媒体
export function phoneAllotedVideo(data) {
  return request({
    url: "/hxindex/Chinaphone/hasphonevideo",
    method: "POST",
    data
  });
}

// 当前登录用户可操作的多媒体
export function userCanAllotVideo(data) {
  return request({
    url: "/hxindex/Chinaphone/videolist",
    method: "POST",
    data
  });
}

// 获取链接的多媒体信息
export function videoPhoneData(data) {
  return request({
    url: "/hxindex/Chinaphone/getvideophone",
    method: "POST",
    data
  });
}

// 产品类型列表数据获取接口
export function getProductTypeList() {
    return request({
      url: "/hxindex/Chinaphone/producttypelist",
      method: "POST"
    });
  }
  // 产品类型添加接口
  export function productTypeAdd(data) {
    return request({
      url: "/hxindex/Chinaphone/producttypeadd",
      method: "POST",
      data
    });
  }
  // 产品类型编辑接口
  export function productTypeEdit(data) {
    return request({
      url: "/hxindex/Chinaphone/producttypeedit",
      method: "POST",
      data
    });
  }
  // 产品类型删除接口
  export function productTypeDelete(data) {
    return request({
      url: "/hxindex/Chinaphone/producttypedelete",
      method: "POST",
      data
    });
  }

// 产品列表数据获取接口
export function getProductList(data) {
  return request({
    url: "/hxindex/Chinaphone/productlist",
    method: "POST",
    data
  });
}
// 产品添加接口
export function productAdd(data) {
  return request({
    url: "/hxindex/Chinaphone/productadd",
    method: "POST",
    data
  });
}
// 产品编辑接口
export function productEdit(data) {
  return request({
    url: "/hxindex/Chinaphone/productedit",
    method: "POST",
    data
  });
}
// 产品删除接口
export function productDelete(data) {
  return request({
    url: "/hxindex/Chinaphone/productdelete",
    method: "POST",
    data
  });
}
// 获取产品添加编辑时需要的系统数据
export function productAddEditData() {
  return request({
    url: "/hxindex/Chinaphone/getproducttypelevel",
    method: "POST",
  });
}

// 询盘字段分配角色
export function cluesAllotRole(data) {
  return request({
    url: "/hxindex/Chinaphone/getrole",
    method: "POST",
    data
  });
}
// 询盘字段已分配角色
export function cluesAllotedRole(data) {
  return request({
    url: "/hxindex/Chinaphone/tablerole",
    method: "POST",
    data
  });
}
// 询盘字段列表数据获取接口
export function getCluesList() {
  return request({
    url: "/hxindex/Chinaphone/chinaxunfield",
    method: "POST"
  });
}
// 电话首页-可读电话-可读部门
export function cluesdepartmentData() {
  return request({
    url: "/hxindex/Chinaphone/readdepart",
    method: "POST"
  });
}
// 询盘系统页面电话列表及询盘统计数字
export function cluesPhoneStatData() {
  return request({
    url: "/hxindex/Chinaphone/leftnumber",
    method: "POST",
  });
}
// 询盘系统页面默认电话列表数据获取动作
export function cluesPhoneIndexData(data) {
  return request({
    url: "/hxindex/Chinaphone/phoneindex",
    method: "POST",
    data
  });
}
// 询盘系统页面默认图表数据
export function cluesPhoneChartData(data) {
  return request({
    url: "/hxindex/Chinaphone/phoneindexsearch",
    method: "POST",
    data
  });
}
// 询盘系统页面当前电话搜索条件数据获取动作
export function cluesCurrentPhoneSearchData(data) {
  return request({
    url: "/hxindex/Chinaphone/listcondition",
    method: "POST",
    data
  });
}
// 询盘系统页面当前电话询盘数据获取动作
export function cluesCurrentPhoneData(data) {
  return request({
    url: "/hxindex/Chinaphone/lists",
    method: "POST",
    data
  });
}
// 询盘系统页面当前电话询盘数据获电商人员编辑动作
export function cluesCurrentPhoneDataEleEdit(data) {
  return request({
    url: "/hxindex/Chinaphone/otheredit",
    method: "POST",
    data
  });
}
// 询盘系统页面当前电话询盘数据获电商人员批量编辑动作
export function cluesCurrentPhoneDataEleEditPage(data) {
  return request({
    url: "/hxindex/Chinaphone/othereditall",
    method: "POST",
    data
  });
}
// 询盘系统页面当前电话询盘数据删除动作
export function cluesCurrentPhoneDataDelete(data) {
  return request({
    url: "/hxindex/Chinaphone/delete",
    method: "POST",
    data
  });
}
// 询盘系统页面当前电话询盘获取当前登录用户可操作的字段动作
export function cluesCurrentPhoneUserCanEditField() {
  return request({
    url: "/hxindex/Chinaphone/myfield",
    method: "POST"
  });
}
// 询盘系统页面搜索询盘页查询条件数据获取动作
export function cluesSearchSelectData() {
  return request({
    url: "/hxindex/Chinaphone/searchcondition",
    method: "POST"
  });
}
// 询盘系统页面搜索询盘页获取当前分类下的产品动作
export function getCurrentCateProductList(data) {
  return request({
    url: "/hxindex/Chinaphone/getproduct",
    method: "POST",
    data
  });
}
// 询盘系统页面搜索询盘页获取搜索结果动作
export function getCurrentCluesSearchList(data) {
  return request({
    url: "/hxindex/Chinaphone/search",
    method: "POST",
    data
  });
}
// 询盘系统页面搜索询盘页批量标记为A
export function currentCluesSetALevel(data) {
  return request({
    url: "/hxindex/Chinaphone/custormgivea",
    method: "POST",
    data
  });
}


// 询盘添加编辑时获取系统数据
export function cluesAddEditData() {
  return request({
    url: "/hxindex/Chinaphone/getalldata",
    method: "POST"
  });
}
// 询盘添加保存数据
export function cluesAdd(data) {
  return request({
    url: "/hxindex/Chinaphone/add",
    method: "POST",
    data
  });
}
// 询盘编辑保存数据
export function cluesEdit(data) {
  return request({
    url: "/hxindex/Chinaphone/edit",
    method: "POST",
    data
  });
}
// 询盘编辑获取询盘初始化信息数据
export function initCluesEditInfo(data) {
  return request({
    url: "/hxindex/Chinaphone/editini",
    method: "POST",
    data
  });
}
// 根据询盘链接页面获取页面绑定电话动作
export function cluesUrlGetPhone(data) {
  return request({
    url: "/hxindex/Chinaphone/getphone",
    method: "POST",
    data
  });
}
// 询盘修改添加的地区验证
export function cluesRegionValid(data) {
  return request({
    url: "/hxindex/Chinaphone/getcity",
    method: "POST",
    data
  });
}

// 询盘统计获取搜索条件数据
export function cluesAnalysisSystemData() {
  return request({
    url: "/hxindex/Chinaphone/allcondition",
    method: "POST"
  });
}
// 询盘统计获取搜索结果数据
export function cluesAnalysisResultData(data) {
  return request({
    url: "/hxindex/Chinaphone/countlist",
    method: "POST",
    data
  });
}
// 询盘级别修改记录
export function Custormeditlog(data) {
  return request({
    url: "/hxindex/Chinaphone/custormeditlog",
    method: "POST",
    data
  });
}
// 部门月度日目标列表
export function Cntargetlist(data) {
  return request({
    url: "/hxindex/Chinaphone/targetlist",
    method: "POST",
    data
  });
}
// 中文询盘本月日标添加/修改-选择部门
export function CndeparChoose(data) {
  return request({
    url: "/hxindex/Chinaphone/chinaphonedepart",
    method: "POST",
    data
  });
}
// 中文询盘本月日标添加
export function CntargetlistAdd(data) {
  return request({
    url: "/hxindex/Chinaphone/chinatargetadd",
    method: "POST",
    data
  });
}
// 中文询盘本月日标修改
export function CntargetlistEdit(data) {
  return request({
    url: "/hxindex/Chinaphone/chinatargetedit",
    method: "POST",
    data
  });
}
// 中文询盘本月日标删除
export function CntargetlistDel(data) {
  return request({
    url: "/hxindex/Chinaphone/chinatargetdelete",
    method: "POST",
    data
  });
}
// 填写关键词获取下拉
export function getkeyword(data) {
  return request({
    url: "/hxindex/Chinaphone/getkeyword",
    method: "POST",
    data
  });
}
// 中文询盘质量判定添加
export function chinaQualityAdd(data) {
  return request({
    url: "/hxindex/Chinaphone/chinaqualityadd",
    method: "POST",
    data
  });
}
// 中文询盘质量判定修改
export function chinaQualityEdit(data) {
  return request({
    url: "/hxindex/Chinaphone/chinaqualityedit",
    method: "POST",
    data
  });
}
// 质量判定条件列表
export function chinaQualityList(data) {
  return request({
    url: "/hxindex/Chinaphone/chinaqualitylist",
    method: "POST",
    data
  });
}
// 质量判定条件删除
export function chinaQualityDelete(data) {
  return request({
    url: "/hxindex/Chinaphone/chinaqualitydelete",
    method: "POST",
    data
  });
}
// 供选择的质量判定条件列表
export function chinaQualitySelect(data) {
  return request({
    url: "/hxindex/Chinaphone/chinaqualityselect",
    method: "POST",
    data
  });
}
// 中文询盘质量判定提交
export function chinaQualityConfirm(data) {
  return request({
    url: "/hxindex/Chinaphone/chinaqualityconfirm",
    method: "POST",
    data
  });
}
// 中文询盘质量判定修改
export function chinaQualityConfirmedit(data) {
  return request({
    url: "/hxindex/Chinaphone/chinaqualityconfirmedit",
    method: "POST",
    data
  });
}
// 已经选择的中文询盘质量判定
export function chinaQualityHasSelect(data) {
  return request({
    url: "/hxindex/Chinaphone/chinaqualityhasselect",
    method: "POST",
    data
  });
}
// 导出数据
export function exportSearchData(data){
  return request({
    url: "/hxindex/Chinaphone/searchexport",
    method: "POST",
    data
  });
}