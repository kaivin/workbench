import { 
    deparDealList,
    deparDealListChoose,
    deparDealListAdd,
    deparDealEdit,
    deparDealDel,
    groupDealListChoose,
    groupDealList,
    groupDealListAdd,
    groupDealEdit,
    groupDealDel
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
    // 小组成交——积分列表
    groupDealListAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            groupDealList(data).then(response => {
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
    // 获取小组
    groupDealListChooseAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            groupDealListChoose(data).then(response => {
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
    // 小组成交——积分积分添加
    groupDealListAddAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            groupDealListAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 小组成交——积分列表修改
    groupDealEditAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            groupDealEdit(data).then(response => {
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
    groupDealDelAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            groupDealDel(data).then(response => {
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