import {
  getExpenseData,
  getExpenseAdd,
  getXunQualityData,
  getGroupDealCycleData,
  getDealProductData,
  getPersonalDealCycleData,
  getFutureDealData
} from '@/api/chinadeal'

const state = {}
const mutations = {}
const actions = {
  // 获取花费明细
  expenseData({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getExpenseData(data).then(response => {
              resolve(response)
          }).catch(error => {
              reject(error)
          })
      })
  },
  // 导入数据
  expenseAdd({ commit, state },data) {
    return new Promise((resolve, reject) => {
      getExpenseAdd(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 获取小组询盘质量
  xunQualityData({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getXunQualityData(data).then(response => {
              resolve(response)
          }).catch(error => {
              reject(error)
          })
      })
  },
  // 获取小组成交周期
  groupDealCycleData({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getGroupDealCycleData(data).then(response => {
              resolve(response)
          }).catch(error => {
              reject(error)
          })
      })
  },
  // 获取成交产品
  dealProductData({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getDealProductData(data).then(response => {
              resolve(response)
          }).catch(error => {
              reject(error)
          })
      })
  },
  // 获取个人成交周期
  personalDealCycleData({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getPersonalDealCycleData(data).then(response => {
              resolve(response)
          }).catch(error => {
              reject(error)
          })
      })
  },
  // 未来成交预期
  futureDealData({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getFutureDealData(data).then(response => {
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
