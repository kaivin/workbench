import { 
    getSalesList,
    getSalesSearchList,
    getSalesWaitDistribu,
    getSalesAllDistribuList
} from '@/api/Sales'

const state = {}
const mutations = {}
const actions = {
    // 获取业务员英文询盘-首页-个人询盘列表
    getSalesListAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getSalesList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
   // 产品类型列表数据获取接口
   getSalesSearchListAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            getSalesSearchList().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    //业务员英文询盘-等待分配询盘列表
    getSalesWaitDistribuAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getSalesWaitDistribu(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    //业务员英文询盘-所有已分配询盘列表
    getSalesAllDistribuListAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getSalesAllDistribuList(data).then(response => {
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
