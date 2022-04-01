import { getDataList, AllotRole,AllotedRole } from '@/api/tableconfig'

const state = {}
const mutations = {}
const actions = {
    // 获取帖子各个属性字段数据
    tableConfigListAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            getDataList().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 给帖子各个属性字段分配角色
    tableConfigAllotRoleAction({ commit }, data){
        return new Promise((resolve, reject) => {
          AllotRole(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 获取帖子各个属性字段已分配角色
    tableConfigAllotedRoleAction({ commit }, data){
        return new Promise((resolve, reject) => {
          AllotedRole(data).then(response => {
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
