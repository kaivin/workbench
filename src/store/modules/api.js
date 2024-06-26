﻿import { 
  getMenuPermit,
  getUserInfo,
  setUserHeadimg,
  getUser,
  getWorkName,
  getPostionName,
  getRoute,
  getMenuButtonPermit,
  getNewPostArticle,
  fileUpload,
  cnCluesStatData,
  enCluesStatData,
  salesmanStatData,
  cnCluesRegionStatData,
  enCluesRegionStatData,
  getAddsay,
  clearCache,
  departScore,
  endepartScore,
  clearHomeCache,
  getEndaytarget,
  getChinadaytarget,
  getChinadepartcountdefault,
  getChinadepartcount,
  getendepartcountdefault,
  getendepartcount,
  getChinacountnew,
  getChinadepartscorenew,
  getChinadepartscoreyear,
  getChinadaytargetnew,
  getChinadaytargetmonth,
  getEncountnew,
  getEndepartscorenew,
  getEndepartscoreyear,
  getEndaytargetnew,
  getEndaytargetmonth,
  getCnDepart,
  getEnDepart,
  getCnPersonlist,
  getCnPersoncountinfo,
  getCnPersoncountCompare,
  getPersonHistory,
  getEnPersonlist,
  getEnPersoncountinfo,
  getEnPersoncountCompare,
  getChinaproductlist,
  getChinaproductFocus,
  getChinaAddfocusproduct,
  getChinaprovince,
  getChinaproductcountfooter,
  getchinaproduct,
  getChinaproductinfocount,
  getChinaproductcompare,
  getChinaproductdepartcompare,
  getChinaproducttimecompare,
  getChinaAddfocusproductone,
  getChinafocusproductcancel,
  getPersonproductinfo,
  getEnproductlist,
  getEnproductfocus,
  getEnAddenfocusproduct,
  getEnprovince,
  getEnproductcountfooter,
  getEnproduct,
  getEnproductinfocount,
  getEnproductcompare,
  getEnproductdepartcompare,
  getEnproducttimecompare,
  getEnAddfocusproductone,
  getEnfocusproductcance,
  getCnDepartAnalysis
} from '@/api/api'
//import { reject, resolve } from 'core-js/fn/promise';
import Cookies from 'js-cookie';
const state = {
    isArticleSearch: false,
    isArticleAdd: false,
    isWebsiteAdd: false,
    isWebserverAdd: false,
    isCnPhoneAdd:false,
    isCnCateAdd:false,
    isCnProductAdd:false,
    isEnPhoneAdd:false,
    isEnCateAdd:false,
    isEnProductAdd:false,
    isWebsiteAttrAdd:false,
    isInformationAdd:false,
    isTagAdd:false,
    isUserAdd:false,
    isDepartAdd:false,
    isRoleAdd:false,
    isMenuAdd:false,
    isPermitAdd:false,
    isPromotedAccountAdd:false,
    isPromotedChannelAdd:false,
    isCnProcessAdd:false,
    isCnMoneyAdd:false,
    isCnCluesAdd:false,
    isEnCluesAdd:false,
    isWebsiteLogAdd:false,
    isWebMsgIpAdd:false,
    iscompareListAdd:false,
    iscompareGroupListAdd:false,
    isEncompareListAdd:false,
    isEncompareGroupListAdd:false,
    isCntargetlistAdd:false,
    isEntargetlistAdd:false,
    isWorkOrderTagAdd:false,
    isWorkOrderAdd:false,
    isDepartScoreAdd:false,
    isResourceTypeAdd:false,
    isResourceAdd:false,
    isCnScoreAdd:false,
    isEnScoreAdd:false,
    isHomeCache:false,
    isNohomeCache:false,
    isCustormbuyFile:false,
    isUserbonusAdd:false,
    ischAimScoreAdd:false,
    isenAimScoreAdd:false,
    isselectuserAdd:false,
    isChinaQualityAdd:false,
    isEnPushCostAdd:false,
}
const mutations = {
  SET_PERMIT: (state, data) => {
    var permitData = [];
    data.data.forEach(function(item,index){
      permitData.push(item.action_route);
    });
    if(permitData.includes("Article_search")&&data.page==""){
      state.isArticleSearch = true;
    }else{
      state.isArticleSearch = false;
    }
    if(permitData.includes("Article_add")&&(data.page==""||data.page=="articleInfo")){
      state.isArticleAdd = true;
    }else{
      state.isArticleAdd = false;
    }
    if(permitData.includes("Website_add")&&data.page==""){
      state.isWebsiteAdd = true;
    }else{
      state.isWebsiteAdd = false;
    }
    if(permitData.includes("Webserver_add")&&data.page==""){
      state.isWebserverAdd = true;
    }else{
      state.isWebserverAdd = false;
    }
    if(permitData.includes("Enphone_phoneadd")&&data.page==""){
      state.isEnPhoneAdd = true;
    }else{
      state.isEnPhoneAdd = false;
    }
    if(permitData.includes("Enphone_producttypeadd")&&data.page==""){
      state.isEnCateAdd = true;
    }else{
      state.isEnCateAdd = false;
    }
    if(permitData.includes("Enphone_productadd")&&data.page==""){
      state.isEnProductAdd = true;
    }else{
      state.isEnProductAdd = false;
    }
    if(permitData.includes("Chinaphone_phoneadd")&&data.page==""){
      state.isCnPhoneAdd = true;
    }else{
      state.isCnPhoneAdd = false;
    }
    if(permitData.includes("Chinaphone_producttypeadd")&&data.page==""){
      state.isCnCateAdd = true;
    }else{
      state.isCnCateAdd = false;
    }
    if(permitData.includes("Chinaphone_productadd")&&data.page==""){
      state.isCnProductAdd = true;
    }else{
      state.isCnProductAdd = false;
    }
    if(permitData.includes("Website_attradd")&&data.page==""){
      state.isWebsiteAttrAdd = true;
    }else{
      state.isWebsiteAttrAdd = false;
    }
    if(permitData.includes("Information_add")&&data.page==""){
      state.isInformationAdd = true;
    }else{
      state.isInformationAdd = false;
    }
    if(permitData.includes("Tags_add")&&data.page==""){
      state.isTagAdd = true;
    }else{
      state.isTagAdd = false;
    }
    if(permitData.includes("User_add")&&data.page==""){
      state.isUserAdd = true;
    }else{
      state.isUserAdd = false;
    }
    if(permitData.includes("Depart_add")&&data.page==""){
      state.isDepartAdd = true;
    }else{
      state.isDepartAdd = false;
    }
    if(permitData.includes("Role_add")&&data.page==""){
      state.isRoleAdd = true;
    }else{
      state.isRoleAdd = false;
    }
    if(permitData.includes("Menu_add")&&data.page==""){
      state.isMenuAdd = true;
    }else{
      state.isMenuAdd = false;
    }
    if(permitData.includes("Permit_add")&&data.page==""){
      state.isPermitAdd = true;
    }else{
      state.isPermitAdd = false;
    }
    if(permitData.includes("Ownpush_pushadd")&&data.page==""){
      state.isPromotedAccountAdd = true;
    }else{
      state.isPromotedAccountAdd = false;
    }
    if(permitData.includes("Ownpush_pushtypeadd")&&data.page==""){
      state.isPromotedChannelAdd = true;
    }else{
      state.isPromotedChannelAdd = false;
    }
    if(permitData.includes("Ownpush_processadd")&&data.page==""){
      state.isCnProcessAdd = true;
    }else{
      state.isCnProcessAdd = false;
    }
    if(permitData.includes("Ownpush_moneyadd")&&data.page==""){
      state.isCnMoneyAdd = true;
    }else{
      state.isCnMoneyAdd = false;
    }
    if(permitData.includes("Chinaphone_add")&&data.page!="addEditClues"){
      state.isCnCluesAdd = true;
    }else{
      state.isCnCluesAdd = false;
    }
    if(permitData.includes("Enphone_add")&&data.page!="addEditEnClues"){
      state.isEnCluesAdd = true;
    }else{
      state.isEnCluesAdd = false;
    }
    if(permitData.includes("Website_logadd")&&data.page=="websiteLogList"){
      state.isWebsiteLogAdd = true;
    }else{
      state.isWebsiteLogAdd = false;
    }
    if(permitData.includes("Webmsg_addip")&&data.page==""){
      state.isWebMsgIpAdd = true;
    }else{
      state.isWebMsgIpAdd = false;
    }
    if(permitData.includes("Compare_lists")&&data.page==""){
      state.iscompareListAdd = true;
    }else{
      state.iscompareListAdd = false;
    }
    if(permitData.includes("Compare_grouptargetadd")&&data.page==""){
      state.iscompareGroupListAdd = true;
    }else{
      state.iscompareGroupListAdd = false;
    }
    if(permitData.includes("Encompare_lists")&&data.page==""){
      state.isEncompareListAdd = true;
    }else{
      state.isEncompareListAdd = false;
    }
    if(permitData.includes("Encompare_grouptargetadd")&&data.page==""){
      state.isEncompareGroupListAdd = true;
    }else{
      state.isEncompareGroupListAdd = false;
    }
    if(permitData.includes("Chinaphone_targetlist")&&data.page==""){
      state.isCntargetlistAdd = true;
    }else{
      state.isCntargetlistAdd = false;
    }
    if(permitData.includes("Enphone_targetlist")&&data.page==""){
      state.isEntargetlistAdd = true;
    }else{
      state.isEntargetlistAdd = false;
    }
    if(permitData.includes("Works_add")&&data.page==""){
      state.isWorkOrderTagAdd = true;
    }else{
      state.isWorkOrderTagAdd = false;
    }
    if(permitData.includes("Works_publishwork")&&data.page==""){
      state.isWorkOrderAdd = true;
    }else{
      state.isWorkOrderAdd = false;
    }
    if(permitData.includes("Depart_departscoreadd")&&data.page==""){
      state.isDepartScoreAdd = true;
    }else{
      state.isDepartScoreAdd = false;
    }
    if(permitData.includes("Resource_typeadd")&&data.page==""){
      state.isResourceTypeAdd = true;
    }else{
      state.isResourceTypeAdd = false;
    }
    if(permitData.includes("Resource_resourceadd")&&data.page==""){
      state.isResourceAdd = true;
    }else{
      state.isResourceAdd = false;
    }
    if(permitData.includes("Chinauserscore_userscoreadd")&&data.page==""){
      state.isCnScoreAdd = true;
    }else{
      state.isCnScoreAdd = false;
    }
    if(permitData.includes("Enuserscore_userscoreadd")&&data.page==""){
      state.isEnScoreAdd = true;
    }else{
      state.isEnScoreAdd = false;
    }
    if(permitData.includes("Home_index")&&data.page==""){
      state.isHomeCache = true;
    }else{
      state.isHomeCache = false;
    }
    if(!permitData.includes("Home_index")&&data.page==""){
      state.isNohomeCache = true;
    }else{
      state.isNohomeCache = false;
    }
    if(permitData.includes("Custormbuy_exportlink")&&data.page==""){
      state.isCustormbuyFile = true;
    }else{
      state.isCustormbuyFile = false;
    }
    if(permitData.includes("User_personotheradd")&&data.page==""){
      state.isUserbonusAdd = true;
    }else{
      state.isUserbonusAdd = false;
    }
    if(permitData.includes("Ownpush_chscoretargetadd")&&data.page==""){
      state.ischAimScoreAdd = true;
    }else{
      state.ischAimScoreAdd = false;
    }
    if(permitData.includes("Ownpush_enscoretargetadd")&&data.page==""){
      state.isenAimScoreAdd = true;
    }else{
      state.isenAimScoreAdd = false;
    }
    if(permitData.includes("Enquiries_selectuseradd")&&data.page==""){
      state.isselectuserAdd = true;
    }else{
      state.isselectuserAdd = false;
    }
    if(permitData.includes("Chinaphone_chinaqualityadd")&&data.page==""){
      state.isChinaQualityAdd = true;
    }else{
      state.isChinaQualityAdd = false;
    }
    if(permitData.includes("Ownpush_enpushcostadd")&&data.page==""){
      state.isEnPushCostAdd = true;
    }else{
      state.isEnPushCostAdd = false;
    }
  },
}

const actions = {
    // 获取指定菜单下所有的权限动作（角色分配权限时使用）
    menuPermitAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
          getMenuPermit(data).then(response => {
              resolve(response)
          }).catch(error => {
              reject(error)
          })
      })
    },
    
    //用户头像上传
    setUserHeadimgAction({rootState},data){
      return new Promise((resolve,reject)=>{
        setUserHeadimg(data).then(response=>{
          if(response.status){
            rootState.login.userInfo.headimg = data.headimg;
            Cookies.set('userInfo', JSON.stringify(rootState.login.userInfo));
          }
          resolve(response);
          
        }).catch(error=>{
          reject(error)
        })
      })
      
    },
    // 根据用户id获取用户详细信息
    userInfoAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getUserInfo(data).then(response => {
              resolve(response)
          }).catch(error => {
              reject(error)
          })
      })
    },
    // 根据当前登录用户获取其可分配用户动作
    getUserAction({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUser().then(response => {
              resolve(response)
          }).catch(error => {
              reject(error)
          })
      })
    },
    // 获取职位动作
    getWorkNameAction({ commit, state }) {
      return new Promise((resolve, reject) => {
        getWorkName().then(response => {
              resolve(response)
          }).catch(error => {
              reject(error)
          })
      })
    },
    // 获取职称动作
    getPostionNameAction({ commit, state }) {
      return new Promise((resolve, reject) => {
        getPostionName().then(response => {
              resolve(response)
          }).catch(error => {
              reject(error)
          })
      })
    },
    // 用户登陆获取权限菜单
    getRouteAction({ commit, state }) {
      return new Promise((resolve, reject) => {
        getRoute().then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取登陆用户指定菜单页面操作按钮权限数据动作
    getMenuButtonPermitAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        var id = ""+data.id;
        var page = "";
        var reqData = {id:""};
        if(id.indexOf("-")!=-1){
          reqData.id = parseInt(id.split("-")[1]);
          page = id.split("-")[0];
        }else{
          reqData.id = parseInt(id);
        }
        getMenuButtonPermit(reqData).then(response => {
          response.page = page;
          commit('SET_PERMIT',response);
          resolve(response);
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取最新消息
    getNewPostArticleAction({ commit, state }) {
      return new Promise((resolve, reject) => {
        getNewPostArticle().then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 文件上传
    fileUploadAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        fileUpload(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取中文统计数据
    cnCluesStatDataAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        cnCluesStatData(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取英文统计数据
    enCluesStatDataAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        enCluesStatData(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取业务员统计数据
    salesmanStatDataAction({ commit, state }) {
      return new Promise((resolve, reject) => {
        salesmanStatData().then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取中文地区统计数据
    cnCluesRegionStatDataAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        cnCluesRegionStatData(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取英文地区统计数据
    enCluesRegionStatDataAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        enCluesRegionStatData(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 意见反馈
    getAddsayAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getAddsay(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 意见反馈
    clearCacheAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        clearCache(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页中文成交统计接口
    departScoreAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        departScore(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页英文成交统计接口
    endepartScoreAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        endepartScore(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 清除首页数据
    clearHomeCacheAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        clearHomeCache(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页英文询盘日目标接口
    getEndaytargetAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getEndaytarget(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页中文询盘日目标接口
    getChinadaytargetAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getChinadaytarget(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页中文统计(部门分析默认页面接口)
    getChinadepartcountdefaultAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getChinadepartcountdefault(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页中文统计(部门分析) 
    getChinadepartcountAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getChinadepartcount(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页中文统计(部门分析默认页面接口)
    getendepartcountdefaultAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getendepartcountdefault(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页中文统计(部门分析) 
    getendepartcountAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getendepartcount(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //首页中文统计总览
    getChinacountnewAction({ commit, state }) {
      return new Promise((resolve, reject) => {
        getChinacountnew().then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //首页日目标展示-中文成交统计接口
    getChinadepartscorenewAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getChinadepartscorenew(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //首页中文成交统计年度完成情况接口
    getChinadepartscoreyearAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getChinadepartscoreyear(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //首页中文目标展示(中文日目标接口)
    getChinadaytargetnewAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getChinadaytargetnew(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //首页中文目标月度完成次数统计(中文日目标接口)
    getChinadaytargetmonthAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getChinadaytargetmonth(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //首页英文统计总览
    getEncountnewAction({ commit, state }) {
      return new Promise((resolve, reject) => {
        getEncountnew().then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //首页日目标展示-英文成交统计接口
    getEndepartscorenewAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getEndepartscorenew(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //首页英文成交统计年度完成情况接口
    getEndepartscoreyearAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getEndepartscoreyear(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //首页英文目标展示(英文日目标接口)
    getEndaytargetnewAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getEndaytargetnew(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //首页英文目标月度完成次数统计(英文日目标接口)
    getEndaytargetmonthAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getEndaytargetmonth(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取中文部门
    getCnDepartAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getCnDepart().then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取中文部门
    getCnDepartAnalysisAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getCnDepartAnalysis().then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取中文部门下的组员
    getCnPersonlistAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getCnPersonlist(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页中文统计(组员分析详情页)
    getCnPersoncountinfoAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getCnPersoncountinfo(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页中文统计(组员分析对比) 
    getCnPersoncountCompareAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getCnPersoncountCompare(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 组员个人历史成就
    getPersonHistoryAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getPersonHistory(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取英文部门
    getEnDepartAction({ commit, state }) {
      return new Promise((resolve, reject) => {
        getEnDepart().then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取英文部门下的组员​
    getEnPersonlistAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getEnPersonlist(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页英文统计(组员分析详情页)
    getEnPersoncountinfoAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getEnPersoncountinfo(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页英文统计(组员分析对比) 
    getEnPersoncountCompareAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getEnPersoncountCompare(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //首页中文统计（中文产品列表）（中文产品分析）
    getChinaproductlistAction({ commit, state }) {
      return new Promise((resolve, reject) => {
        getChinaproductlist().then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页中文统计(添加关注产品)（中文产品分析）
    getChinaAddfocusproductAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getChinaAddfocusproduct(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页中文统计(产品分析默认-顶部我的关注产品) （中文产品分析）
    getChinaproductFocusAction({ commit, state }) {
      return new Promise((resolve, reject) => {
        getChinaproductFocus().then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页中文统计（地区列表、产品分类）（中文产品分析）
    getChinaprovinceAction({ commit, state }) {
      return new Promise((resolve, reject) => {
        getChinaprovince().then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页中文统计（产品分析默认-底部产品询盘 积分 百万）（中文产品分析）
    getChinaproductcountfooterAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getChinaproductcountfooter(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页中文统计（点击产品类型获取产品列表）（产品分析）
    getChinaproductinfocountAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getChinaproductinfocount(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页中文统计（点击产品类型获取产品列表）（产品分析）
    getchinaproductAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getchinaproduct(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },    
    // 首页中文统计（产品对比）（中文产品分析）
    getChinaproductcompareAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getChinaproductcompare(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页中文统计（单个产品部门对比）（中文产品分析）
    getChinaproductdepartcompareAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getChinaproductdepartcompare(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页中文统计（添加关注单个产品）（产品分析）
    getChinaAddfocusproductoneAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getChinaAddfocusproductone(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页中文统计（取消关注单个产品）（产品分析）
    getChinafocusproductcancelAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getChinafocusproductcancel(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页中文统计（单个产品时间范围数据对比）（中文产品分析）
    getChinaproducttimecompareAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getChinaproducttimecompare(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页中文|英文统计（个人月产品分析）（个人->产品分析）
    getPersonproductinfoAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getPersonproductinfo(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //首页英文统计（英文产品列表）（英文产品分析）
    getEnproductlistAction({ commit, state }) {
      return new Promise((resolve, reject) => {
        getEnproductlist().then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页英文统计(添加关注产品)（英文产品分析）
    getEnAddenfocusproductAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getEnAddenfocusproduct(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页英文统计(产品分析默认-顶部我的关注产品) （英文产品分析）
    getEnproductfocusAction({ commit, state }) {
      return new Promise((resolve, reject) => {
        getEnproductfocus().then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页英文统计（地区列表、产品分类）（英文产品分析）
    getEnprovinceAction({ commit, state }) {
      return new Promise((resolve, reject) => {
        getEnprovince().then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页英文统计（产品分析默认-底部产品询盘 积分 百万）（英文产品分析）
    getEnproductcountfooterAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getEnproductcountfooter(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页英文统计（点击产品类型获取产品列表）（英文产品分析）
    getEnproductAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getEnproduct(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页英文统计（点击产品类型获取产品列表）（英文产品分析）
    getEnproductinfocountAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getEnproductinfocount(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }, 
    // 首页英文统计（产品对比）（英文产品分析）
    getEnproductcompareAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getEnproductcompare(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页英文统计（单个产品部门对比）（英文产品分析）
    getEnproductdepartcompareAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getEnproductdepartcompare(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页英文统计（单个产品时间范围数据对比）（英文产品分析）
    getEnproducttimecompareAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getEnproducttimecompare(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页英文统计（添加关注单个产品）（产品分析）
    getEnAddfocusproductoneAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getEnAddfocusproductone(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 首页英文统计（取消关注单个产品）（产品分析）
    getEnfocusproductcanceAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getEnfocusproductcance(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
