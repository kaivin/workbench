import {
    getEnpersoncountdefault,
    getChinapersoncountdefault
} from '@/api/memberCompare'

const state = {}
const mutations = {}
const actions = {
    // 获取英文成员询盘成交情况
    getEnpersoncountdefaultAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
          getEnpersoncountdefault(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 首页中文统计(组员分析默认页)//yearuser-本年的组员信息 monthselectuser-时间范围内的组员信息 
    getChinapersoncountdefaultAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getChinapersoncountdefault(data).then(response => {
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
