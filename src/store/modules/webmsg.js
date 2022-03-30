import Cookies from 'js-cookie'
import { 
  webMsgUserPermitFieldList,
  webMsgRecycleDelete,
  webMsgSyncPlatMsg,
  deleteHistoryFilterMsg,
  deleteHistoryRecycleMsg,
  deleteCnApiMsg
 } from '@/api/webmsg'

const state = {
  msgPage: Cookies.get('msgPage') ? Cookies.get('msgPage') : 0,
}
const mutations = {
  SYNC_PLATMSG: (state, page) => {
    var pageIndex = parseInt(page) + 1;
    state.msgPage = pageIndex;
    Cookies.set('msgPage', pageIndex);
  },
}

const actions = {


  // 留言系统当前登录用户拥有权限的字段
  webMsgUserPermitFieldListAction({ commit, state }) {
    return new Promise((resolve, reject) => {
      webMsgUserPermitFieldList().then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 留言系统回收站留言删除
  webMsgRecycleDeleteAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      webMsgRecycleDelete(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 留言系统同步第三方平台留言信息
  webMsgSyncPlatMsgAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      webMsgSyncPlatMsg(data).then(response => {
        if(response.success!=0){
          commit('SYNC_PLATMSG',data.number)
        }
          resolve(response)
      }).catch(error => {
            reject(error)
      })
    })
  },
  // 删除超过7天的已过滤垃圾信息
  deleteHistoryFilterMsgAction({ commit, state }) {
    return new Promise((resolve, reject) => {
      deleteHistoryFilterMsg().then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 删除超过7天的回收站信息
  deleteHistoryRecycleMsgAction({ commit, state }) {
    return new Promise((resolve, reject) => {
      deleteHistoryRecycleMsg().then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 删除超过5天的中文API留言信息
  deleteCnApiMsgAction({ commit, state }) {
    return new Promise((resolve, reject) => {
      deleteCnApiMsg().then(response => {
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
