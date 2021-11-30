import Cookies from 'js-cookie';
import { 
    homePageModuleList,
    homePageModuleAllotedRoleList,
    homePageModuleAllotRole,
    getPermitModuleList,
   } from '@/api/modulelist'
const state = {
    ModuleList:Cookies.get('ModuleList') ? JSON.parse(Cookies.get('ModuleList')) : "",
}
const mutations = {
    SET_INFO: (state, data) => {
      state.ModuleList = data;
      var cookieData = JSON.stringify(data);
      if(cookieData!=undefined){
        Cookies.set('ModuleList', cookieData);
      }
    },
}
  
const actions = {
  // 首页模块列表
  homePageModuleListAction({ commit, state }) {
    return new Promise((resolve, reject) => {
        homePageModuleList().then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 首页模块已分配角色
  homePageModuleAllotedRoleListAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
        homePageModuleAllotedRoleList(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 首页模块角色分配
  homePageModuleAllotRoleAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
        homePageModuleAllotRole(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 获取当前登录用户有权限的模块
  getPermitModuleListAction({ commit, state }) {
    return new Promise((resolve, reject) => {
        getPermitModuleList().then(response => {
            commit('SET_INFO', response.data);
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 缓存当前登录用户有权限的模块
  getPermitModuleAction({ commit }) {
    return new Promise((resolve, reject) => {
        getPermitModuleList().then(response => {
            commit('SET_INFO', response.data);
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
