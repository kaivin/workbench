import {
    getDepcomIntentioncount,
    getDepcomMsgtype,
    getDepcomCondition,
    getDepcomCountryXun,
    getDepcomContinent,
    getDepcomChDepart,
    getDepcomChCount

} from '@/api/depcomm'

const state = {}
const mutations = {}
const actions = {
    // 获取询盘意向统计结果
    depcomIntentionCountAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getDepcomIntentioncount(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 询盘条件
    depcomConditionAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getDepcomCondition(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 询盘类型统计
    depcomMsgtypeAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getDepcomMsgtype(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 大洲获取
    depcomContinentAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getDepcomContinent(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 大洲小时询盘量
    depcomCountryXunAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getDepcomCountryXun(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 中文部门获取
    depcomChDepartAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getDepcomChDepart(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 中文询盘分析
    depcomChCountAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getDepcomChCount(data).then(response => {
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
