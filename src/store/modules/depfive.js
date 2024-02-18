import {
    getDepfiveCondition,
    getDepfiveSourceData,
    getDepfiveScoreTrend,
    getDepfiveIntentionCount,
    getDepfiveEnCondition,
    getDepfiveEnSourceData,
    getDepfiveEnScoreData

} from '@/api/depfive'

const state = {}
const mutations = {}
const actions = {
    // 获取询盘搜索条件
    depfiveConditionAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            getDepfiveCondition().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取询盘搜索结果
    depfiveSourceDataAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getDepfiveSourceData(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取成交积分趋势结果
    depfiveScoreTrendAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getDepfiveScoreTrend(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取询盘意向统计结果
    depfiveIntentionCountAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getDepfiveIntentionCount(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取英文询盘条件
    depfiveEnConditionAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getDepfiveEnCondition(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取英文渠道询盘
    depfiveEnSourceDataAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getDepfiveEnSourceData(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取英文成交积分询盘
    depfiveEnScoreDataAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getDepfiveEnScoreData(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
