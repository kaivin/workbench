import {CnscoreList,CnscoreSearch,CnscoreAdd,CnscoreEdit,CnscoreDel,} from '@/api/Chinauserscore'

const state = {}
const mutations = {}
const actions = {
    // 个人成交管理
    CnscoreListAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            CnscoreList().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 个人成交管理带分页查询
    CnscoreSearchAction({ commit }, data){
        return new Promise((resolve, reject) => {
            CnscoreSearch(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 个人成交添加
    CnscoreAddAction({ commit }, data){
        return new Promise((resolve, reject) => {
            CnscoreAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 个人成交修改
    CnscoreEditAction({ commit }, data){
        return new Promise((resolve, reject) => {
            CnscoreEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 个人成交删除
    CnscoreDelAction({ commit }, data){
        return new Promise((resolve, reject) => {
            CnscoreDel(data).then(response => {
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
