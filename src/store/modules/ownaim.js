import {
    chScoreList,
    chScoreAdd,
    chScoreEdit,
    chScoreDelete,
    getChScore,
    enScoreList,
    enScoreAdd,
    enScoreEdit,
    enScoreDelete,
    getEnScore
} from '@/api/ownaim'

const state = {}
const mutations = {}
const actions = {
    // 中文季度目标列表
    getchScoreList({ commit, state },data) {
        return new Promise((resolve, reject) => {
            chScoreList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 中文季度目标添加
    addChScore({ commit, state },data) {
        return new Promise((resolve, reject) => {
            chScoreAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 中文季度目标修改
    editChScore({ commit, state },data) {
        return new Promise((resolve, reject) => {
            chScoreEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 中文季度目标删除
    deleteChScore({ commit, state },data) {
        return new Promise((resolve, reject) => {
            chScoreDelete(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 中文季度目标
    getChScore({ commit, state }) {
        return new Promise((resolve, reject) => {
            getChScore().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 英文季度目标列表
    getenScoreList({ commit, state },data) {
        return new Promise((resolve, reject) => {
            enScoreList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 英文季度目标添加
    addEnScore({ commit, state },data) {
        return new Promise((resolve, reject) => {
            enScoreAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 英文季度目标修改
    editEnScore({ commit, state },data) {
        return new Promise((resolve, reject) => {
            enScoreEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 英文季度目标删除
    deleteEnScore({ commit, state },data) {
        return new Promise((resolve, reject) => {
            enScoreDelete(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 英文季度目标
    getEnScore({ commit, state }) {
        return new Promise((resolve, reject) => {
            getEnScore().then(response => {
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
