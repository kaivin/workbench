import { 
    workOrderInfo,
} from '@/api/worksaccpet'

const state = {}
const mutations = {}
const actions = {
    // 工单详情信息数据
    workOrderInfoAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            workOrderInfo(data).then(response => {
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
