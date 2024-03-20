import {
    getKSData,
    getKSTime,
    getKSScore,
    getKSdepartgroup,
    getKSDepartlist,
    getKSEachLine,
    getKSAccountLine,
    getKSPersonalCount,
    getKSCount
} from '@/api/kuaishou'

const state = {}
const mutations = {}
const actions = {
    // 获取抖音结果
    getKSResData({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getKSData(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取日期
    getKSResTime({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getKSTime(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取统计结果
    getKSScoreData({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getKSScore(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 部门列表
    KSDepartlist({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getKSDepartlist(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 账号统计
    KSdepartgroup({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getKSdepartgroup(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取每个图表曲线
    KSEachLine({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getKSEachLine(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取账号图表曲线
    KSAccountLine({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getKSAccountLine(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取个人账号图表曲线
    KSPersonalCountLine({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getKSPersonalCount(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 快手账号统计
    KSCountData({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getKSCount(data).then(response => {
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
