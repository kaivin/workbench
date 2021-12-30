import {
    getInquiryRank,
    getEnInquiryRank
} from '@/api/memberCompare'

const state = {}
const mutations = {}
const actions = {
    // 获取中文成员询盘成交情况
    postInquiryRank({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getInquiryRank(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取英文成员询盘成交情况
    postEnInquiryRank({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getEnInquiryRank(data).then(response => {
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
