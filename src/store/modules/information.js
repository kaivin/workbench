import { getDataList, postAdd,postEdit,postDelete,userCanPostPermit } from '@/api/information'

const state = {}
const mutations = {}
const actions = {
    // 获取帖子类型列表数据接口
    postListAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            getDataList().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 添加帖子类型动作
    postAddAction({ commit }, data){
        return new Promise((resolve, reject) => {
            postAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 编辑帖子类型动作
    postEditAction({ commit }, data){
        return new Promise((resolve, reject) => {
            postEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 删除帖子类型动作
    postDeleteAction({ commit }, data){
        return new Promise((resolve, reject) => {
            postDelete(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 获取所选帖子类型当前登录用户可分配的帖子权限（角色分配帖子权限时使用）
    userCanPostPermitAction({ commit }, data){
        return new Promise((resolve, reject) => {
            userCanPostPermit(data).then(response => {
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
