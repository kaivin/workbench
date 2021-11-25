import { 
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
}
const mutations = {
  SET_PERMIT: (state, data) => {
    var permitData = [];
    data.data.forEach(function(item,index){
      permitData.push(item.action_route);
    });
    console.log(data)
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
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
