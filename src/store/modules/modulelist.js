import { 
    homePageModuleList,
    homePageModuleAllotedRoleList,
    homePageModuleAllotRole,
    getPermitModuleList,
   } from '@/api/modulelist'
const state = {}
const mutations = {}
  
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
