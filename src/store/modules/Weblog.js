import { 
  getloglist,
  getlists,
  getlogSpidertype
 } from '@/api/Weblog'

const state = {}
const mutations = {}

const actions = {
  // 获取当前网站的日志文件列表
  getloglistAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
        getloglist(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 获取当前日志文件的抓取详情
  getlistsAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
        getlists(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 常用蜘蛛列表
  getlogSpidertypeAction({ commit, state }) {
    return new Promise((resolve, reject) => {
        getlogSpidertype().then(response => {
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
