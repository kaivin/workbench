import { 
    cluesPhoneIndexData,
} from '@/api/enphone'

const state = {
    customerTipsCount:0,
}
const mutations = {
    SET_COUNT: (state, count) => {
    state.customerTipsCount = count
  },
}
const actions = { 
    // 询盘系统页面默认电话列表数据获取动作
    cluesPhoneIndexDataAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            cluesPhoneIndexData().then(response => {
                commit('SET_COUNT',response.warningcount);
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
