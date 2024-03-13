import {
    getDouyinData,
    getDouyinScore,
    dyKeywordList,
    dyKeywordAdd,
    dyKeywordDel,
    getDouyinCount,
    getDouyinDepartlist,
    getDouyinTime

} from '@/api/douyin'

const state = {}
const mutations = {}
const actions = {
    // 获取抖音结果
    getDouyinResData({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getDouyinData(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取抖音t统计结果
    getDouyinScoreData({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getDouyinScore(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取抖音统计结果
    getDouyinKeywordList({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            dyKeywordList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 关键词添加
    douyinKeywordAdd({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            dyKeywordAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 关键词删除
    douyinKeywordDel({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            dyKeywordDel(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 部门列表
    douyinDepartlist({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getDouyinDepartlist(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 账号统计
    douyinCountData({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getDouyinCount(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取日期
    douyinCountTime({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getDouyinTime(data).then(response => {
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
