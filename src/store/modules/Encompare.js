import { 
    EndeparDealList,
    EndeparDealListChoose,
    EndeparDealListAdd,
    EndeparDealEdit,
    EndeparDealDel,
    EngroupDealList,
    EngroupDealListChoose,
    EngroupDealListAdd,
    EngroupDealEdit,
    EngroupDealDel

} from '@/api/Encompare'


const state = {}
const mutations = {}
const actions = {
    // 部门成交——积分列表
    EndeparDealListAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            EndeparDealList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 小组成交——积分列表
    EngroupDealListAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            EngroupDealList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 部门成交——选择部门
    EndeparDealListChooseAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            EndeparDealListChoose(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 小组成交——选择部门
    EngroupDealListChooseAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            EngroupDealListChoose(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 部门成交——积分积分添加
    EndeparDealListAddAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            EndeparDealListAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 小组成交——积分积分添加
    EngroupDealListAddAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            EngroupDealListAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 部门成交——积分列表修改
    EndeparDealEditAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            EndeparDealEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 小组成交——积分列表修改
    EngroupDealEditAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            EngroupDealEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 部门成交——积分列表删除
    EndeparDealDelAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            EndeparDealDel(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 小组成交——积分列表删除
    EngroupDealDelAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            EngroupDealDel(data).then(response => {
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