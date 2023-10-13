import {
    getDepfiveCondition,
    getDepfiveSourceData

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
    }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
