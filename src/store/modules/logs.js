import { getDataList, getActionList } from '@/api/logs'

const state = {}
const mutations = {}
const actions = {
    // 操作日志列表数据获取动作
    logsListAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getDataList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取所有操作动作
    logsActionAction({ commit },){
        return new Promise((resolve, reject) => {
            getActionList().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
