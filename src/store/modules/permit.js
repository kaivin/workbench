import { getDataList, permitAdd,permitEdit,permitDelete } from '@/api/permit'

const state = {}
const mutations = {}

const actions = {
  // 权限列表数据动作
  permitListAction({ commit, state }) {
    return new Promise((resolve, reject) => {
        getDataList().then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 添加权限动作
  permitAddAction({ commit }, data){
    return new Promise((resolve, reject) => {
        permitAdd(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 编辑权限动作
  permitEditAction({ commit }, data){
    return new Promise((resolve, reject) => {
        permitEdit(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 删除权限动作
  permitDeleteAction({ commit }, data){
    return new Promise((resolve, reject) => {
        permitDelete(data).then(response => {
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
