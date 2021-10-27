import {EnscoreList,EnscoreSearch,EnscoreAdd,EnscoreEdit,EnscoreDel,} from '@/api/Enuserscore'

const state = {}
const mutations = {}
const actions = {
    // 个人成交管理
    EnscoreListAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            EnscoreList().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 个人成交管理带分页查询
    EnscoreSearchAction({ commit }, data){
        return new Promise((resolve, reject) => {
            EnscoreSearch(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 个人成交添加
    EnscoreAddAction({ commit }, data){
        return new Promise((resolve, reject) => {
            EnscoreAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 个人成交修改
    EnscoreEditAction({ commit }, data){
        return new Promise((resolve, reject) => {
            EnscoreEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 个人成交删除
    EnscoreDelAction({ commit }, data){
        return new Promise((resolve, reject) => {
            EnscoreDel(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
