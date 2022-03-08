import {
    getInquiryItem,
    getInquiryResult,
    getIntentionPhone,
    getIntentionResult

} from '@/api/depsix'

const state = {}
const mutations = {}
const actions = {
    // 获取询盘搜索条件
    inquiryItemAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInquiryItem().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取询盘搜索结果
    inquirySearchAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getInquiryResult(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 询盘意向电话
    intentionPhone({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getIntentionPhone(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 询盘意向搜索
    intentionSearch({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getIntentionResult(data).then(response => {
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
