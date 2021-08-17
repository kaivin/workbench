import { webMsgList } from '@/api/webmsg'

const state = {}
const mutations = {}

const actions = {
  // 留言系统留言信息数据
  webMsgListAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
        webMsgList(data).then(response => {
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
