import {
    getDouyinData,
    getDouyinScore

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
    }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
