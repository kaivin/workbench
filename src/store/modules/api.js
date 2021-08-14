import { getMenuPermit,getUserInfo,getUser,getWorkName,getPostionName,getRoute,getMenuButtonPermit,getNewPostArticle,fileUpload} from '@/api/api'

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
}
const mutations = {
  SET_PERMIT: (state, data) => {
    console.log(data,"设置头部权限");
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
    if(permitData.includes("Chinaphone_add")&&data.page==""){
      state.isCnCluesAdd = true;
    }else{
      state.isCnCluesAdd = false;
    }
    if(permitData.includes("Enphone_add")&&data.page==""){
      state.isEnCluesAdd = true;
    }else{
      state.isEnCluesAdd = false;
    }
    if(permitData.includes("Website_logadd")&&data.page=="websiteLogList"){
      state.isWebsiteLogAdd = true;
    }else{
      state.isWebsiteLogAdd = false;
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
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
