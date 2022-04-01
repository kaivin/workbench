import { getWebserverList, webserverAdd,webserverEdit,webserverDelete,webserverSelectData,webserverEditInfo } from '@/api/webserver'

const state = {}
const mutations = {}

const actions = {
  // 服务器管理服务器列表数据获取动作
  webserverListAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
        getWebserverList(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 服务器添加动作
  webserverAddAction({ commit }, data){
    return new Promise((resolve, reject) => {
        webserverAdd(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 服务器编辑动作
  webserverEditAction({ commit }, data){
    return new Promise((resolve, reject) => {
        webserverEdit(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 服务器删除动作
  webserverDeleteAction({ commit }, data){
    return new Promise((resolve, reject) => {
        webserverDelete(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 服务器添加编辑获取系统选择数据动作
  webserverSelectDataAction({ commit }){
    return new Promise((resolve, reject) => {
        webserverSelectData().then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 根据服务器ID获取服务器相关详细信息
  webserverEditInfoAction({ commit },data){
    return new Promise((resolve, reject) => {
        webserverEditInfo(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
