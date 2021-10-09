import { getDataList, departAdd,departEdit,departDelete,departAllotedRole,departCanAllotRole,departAllotRole,departScore,departScoreAdd,departScoreEdit,departScoreDelete,getdepart } from '@/api/depart'

const state = {}
const mutations = {}
const actions = {
    // 部门列表数据获取动作
    departListAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            getDataList().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 添加部门动作
    departAddAction({ commit }, data){
        return new Promise((resolve, reject) => {
            departAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 编辑部门动作
    departEditAction({ commit }, data){
        return new Promise((resolve, reject) => {
            departEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 删除部门动作
    departDeleteAction({ commit }, data){
        return new Promise((resolve, reject) => {
            departDelete(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 获取部门已分配角色
    departAllotedRoleAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            departAllotedRole(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取当前登录用户可分配角色
    departCanAllotRoleAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            departCanAllotRole(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 给部门分配角色
    departAllotRoleAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            departAllotRole(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 部门月度积分设置列表
    departScoreAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            departScore(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 部门月度可用积分添加
    departScoreAddAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            departScoreAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 部门月度可用积分修改
    departScoreEditAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            departScoreEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 部门月度可用积分删除
    departScoreDeleteAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            departScoreDelete(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 部门月度积分设置列表-获取部门
    getdepartAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            getdepart().then(response => {
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
