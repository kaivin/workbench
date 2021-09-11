import { 
    deparDealList,
    deparDealListChoose,
    deparDealListAdd,
    deparDealEdit,
    deparDealDel
} from '@/api/Compare'


const state = {}
const mutations = {}
const actions = {
    // 部门成交——积分列表
    deparDealListAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            deparDealList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 部门成交——选择部门
    deparDealListChooseAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            deparDealListChoose(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 部门成交——积分积分添加
    deparDealListAddAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            deparDealListAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 部门成交——积分列表修改
    deparDealEditAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            deparDealEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 部门成交——积分列表删除
    deparDealDelAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            deparDealDel(data).then(response => {
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