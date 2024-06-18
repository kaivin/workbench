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
export function userCanAllotDomain(data) {
  return request({
    url: "/hxindex/Enphone/domainlist",
    method: "POST",
    data
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

// 业务员数据统计初始化页面信息东西
export function cluesAnalysisInitSystemData(data) {
  return request({
    url: "/hxindex/Enphone/phonecount",
    method: "POST",
    data
  });
}
// 修改客服内部提醒
export function customerWarnEdit(data) {
  return request({
    url: "/hxindex/Enphone/custormwarnsub",
    method: "POST",
    data
  });
}
// 确认阅读客服内部提醒
export function customerWarnIsRead(data) {
  return request({
    url: "/hxindex/Enphone/custormwarnread",
    method: "POST",
    data
  });
}
// 确认阅读业务员提醒
export function salesmanWarnIsRead(data) {
  return request({
    url: "/hxindex/Enphone/saleswarnread",
    method: "POST",
    data
  });
}
// 客服修改历史
export function customerEditHistoryLog(data) {
  return request({
    url: "/hxindex/Enphone/enxunlog",
    method: "POST",
    data
  });
}
// 询盘级别修改记录
export function Custormeditlog(data) {
  return request({
    url: "/hxindex/Enphone/custormeditlog",
    method: "POST",
    data
  });
}
// 部门月度日目标列表
export function Entargetlist(data) {
  return request({
    url: "/hxindex/Enphone/targetlist",
    method: "POST",
    data
  });
}
// 查看所有询盘信息
export function allCluesData(data) {
  return request({
    url: "/hxindex/Enphone/lookall",
    method: "POST",
    data
  });
}
// 英文询盘本月日标添加/修改-选择部门
export function EndeparChoose(data) {
  return request({
    url: "/hxindex/Enphone/enphonedepart",
    method: "POST",
    data
  });
}
// 英文询盘本月日标添加
export function EntargetlistAdd(data) {
  return request({
    url: "/hxindex/Enphone/entargetadd",
    method: "POST",
    data
  });
}
// 英文询盘本月日标修改
export function EntargetlistEdit(data) {
  return request({
    url: "/hxindex/Enphone/entargetedit",
    method: "POST",
    data
  });
}
// 英文询盘本月日标删除
export function EntargetlistDel(data) {
  return request({
    url: "/hxindex/Enphone/entargetdelete",
    method: "POST",
    data
  });
}
// 查看所有未分配询盘信息
export function allUnAllotCluesData(data) {
  return request({
    url: "/hxindex/Enphone/lookwaitdealall",
    method: "POST",
    data
  });
}
//填写国家自动获取大洲和时差
export function getcontient(data) {
  return request({
    url: "/hxindex/Enphone/getcontient",
    method: "POST",
    data
  });
}
//电话首页-左侧电话括号小数字
export function getLeftPhoto() {
  return request({
    url: "/hxindex/Enphone/leftnumber",
    method: "POST"
  });
}
// 选择电话获取当前电话下的业务员
export function getCurrentPhoneUser(data) {
  return request({
    url: "/hxindex/Enphone/getbranduser",
    method: "POST",
    data,
  });
}
// 电话首页-部门搜索
export function cluesPhoneIndexSearchData(data) {
  return request({
    url: "/hxindex/Enphone/phoneindexsearch",
    method: "POST",
    data,
  });
}
// 新增/修改询盘用户输入input框的下拉数据获取
export function inputKeywordList(data) {
  return request({
    url: "/hxindex/Enphone/getkeyword",
    method: "POST",
    data,
  });
}

// 获取询盘搜索条件
export function getInquiryItem() {
  return request({
    url: "/hxindex/Enphone/allcondition",
    method: "POST",
  });
}

// 获取询盘搜索结果
export function getInquiryResult(data) {
  return request({
    url: "/hxindex/Enphone/countlist",
    method: "POST",
    data
  });
}

// 导出数据
export function exportSearchData(data){
  return request({
    url: "/hxindex/Enphone/search_export",
    method: "POST",
    data
  });
}

// 英文延时反馈
export function enphoneFeedback(data){
  return request({
    url: "/hxindex/Enphone/askfeedback",
    method: "POST",
    data
  });
}

// 英文五天未反馈
export function enphoneFiveXun(data){
  return request({
    url: "/hxindex/Enphone/fivexun",
    method: "POST",
    data
  });
}

// 电话绑定url
export function enphoneFenurl(data){
  return request({
    url: "/hxindex/Enphone/fenurl",
    method: "POST",
    data
  });
}
// 电话已绑定的url
export function enphoneHasfenurl(data){
  return request({
    url: "/hxindex/Enphone/hasfenurl",
    method: "POST",
    data
  });
}