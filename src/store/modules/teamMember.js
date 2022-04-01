import { cnGroupDefault,cnGroupFilter,enGroupDefault,enGroupFilter } from '@/api/teamMember'

const state = {}
const mutations = {}
const actions = {
    // 中文小组默认展示统计
    cnGroupDefaultAction({ commit, state }) {
        return new Promise((resolve, reject) => {
          cnGroupDefault().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 中文小组筛选展示统计
    cnGroupFilterAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
          cnGroupFilter(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 英文小组默认展示统计
    enGroupDefaultAction({ commit, state }) {
        return new Promise((resolve, reject) => {
          enGroupDefault().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 英文小组筛选展示统计
    enGroupFilterAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
          enGroupFilter(data).then(response => {
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
