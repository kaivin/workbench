import {
    getDayTarget,
    getDealNumTarget,
    getDayNum,
    getDayFinish,
    getDepYearFinish,
    getEnDayTarget,
    getEnDealNumTarget,
    getEnDayNum,
    getEnDayFinish,
    getEnDepYearFinish
} from '@/api/homeobject'

const state = {}
const mutations = {}
const actions = {
    // 获取中文日询盘
    postDayNum({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getDayNum(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 中文月成交积分统计
    postDealNum({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getDealNumTarget(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 中文日目标
    postDayTarget({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getDayTarget(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 中文日目标完成情况
    postDayFinish({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getDayFinish(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 部门年度月成交完成情况
    postDepFinish({ commit, state }) {
        return new Promise((resolve, reject) => {
            getDepYearFinish().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 获取英文日询盘
    postEnDayNum({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getEnDayNum(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 英文月成交积分统计
    postEnDealNum({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getEnDealNumTarget(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 英文日目标
    postEnDayTarget({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getEnDayTarget(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 英文日目标完成情况
    postEnDayFinish({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getEnDayFinish(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 英文部门年度月成交完成情况
    postEnDepFinish({ commit, state }) {
        return new Promise((resolve, reject) => {
            getEnDepYearFinish().then(response => {
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
