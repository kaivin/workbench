import {
    getDouyinData

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
    }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
