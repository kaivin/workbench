import Cookies from 'js-cookie'
import { 
  webMsgAllList,
  webMsgUntreatedList,
  webMsgPendingList,
  webMsgProcessedList,
  webMsgStarList,
  webMsgSpamList,
  webMsgTestList,
  webMsgPromotePendingList,
  webMsgPromoteProcessedList,
  webMsgFilterSpamList,
  webMsgRecycleList,
  webMsgInitData,
  webMsgSearchSystemList,
  webMsgUserPermitFieldList,
  webMsgAllotToPending,
  webMsgDelete,
  webMsgRecycleDelete,
  webMsgEdit,
  webMsgRecycleBack,
  webMsgFilterBack,
  webMsgPromotePending,
  webMsgPromoteProcessed,
  webMsgSyncPlatMsg,
  webMsgPermitFieldList,
  webMsgPermitFieldAllotedRoleList,
  webMsgPermitFieldAllotRole,
  webMsgWhiteIpList,
  webMsgWhiteIpAdd,
  webMsgWhiteIpEdit,
  webMsgWhiteIpDelete,
  webMsgRevoke,
  deleteHistoryFilterMsg,
  deleteHistoryRecycleMsg
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
  // 留言系统全部留言信息数据
  webMsgAllListAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
        webMsgAllList(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 留言系统未处理留言信息数据
  webMsgUntreatedListAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
        webMsgUntreatedList(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 留言系统个人待处理留言信息数据
  webMsgPendingListAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
        webMsgPendingList(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 留言系统个人已处理留言信息数据
  webMsgProcessedListAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
        webMsgProcessedList(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 留言系统加星标留言信息数据
  webMsgStarListAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
        webMsgStarList(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 留言系统垃圾留言信息数据
  webMsgSpamListAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
        webMsgSpamList(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 留言系统测试留言信息数据
  webMsgTestListAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
        webMsgTestList(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 留言系统推广待处理留言信息数据
  webMsgPromotePendingListAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
        webMsgPromotePendingList(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 留言系统推广已处理留言信息数据
  webMsgPromoteProcessedListAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
        webMsgPromoteProcessedList(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 留言系统已过滤垃圾留言信息数据
  webMsgFilterSpamListAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
        webMsgFilterSpamList(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 留言系统回收站留言信息数据
  webMsgRecycleListAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
        webMsgRecycleList(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 留言系统初始化信息数据
  webMsgInitDataAction({ commit, state }) {
    return new Promise((resolve, reject) => {
      webMsgInitData().then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 留言系统下拉框选择数据
  webMsgSearchSystemListAction({ commit, state }) {
    return new Promise((resolve, reject) => {
      webMsgSearchSystemList().then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
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
  // 留言系统留言添加到个人待处理
  webMsgAllotToPendingAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      webMsgAllotToPending(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 留言系统留言删除
  webMsgDeleteAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      webMsgDelete(data).then(response => {
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
  // 留言系统留言修改
  webMsgEditAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      webMsgEdit(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 留言系统回收站撤回还原留言
  webMsgRecycleBackAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      webMsgRecycleBack(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 留言系统过滤信息还原
  webMsgFilterBackAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      webMsgFilterBack(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 留言系统留言修改为推广待处理
  webMsgPromotePendingAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      webMsgPromotePending(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 推广待处理撤回
  webMsgRevokeAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      webMsgRevoke(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 留言系统留言修改为推广已处理
  webMsgPromoteProcessedAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      webMsgPromoteProcessed(data).then(response => {
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




  // 留言表系统权限字段列表数据
  webMsgPermitFieldListAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      webMsgPermitFieldList(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 留言表系统权限字段已分配角色
  webMsgPermitFieldAllotedRoleListAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      webMsgPermitFieldAllotedRoleList(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 留言表系统权限字段角色分配
  webMsgPermitFieldAllotRoleAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      webMsgPermitFieldAllotRole(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },

  
  // 留言表系统ip白名单列表数据
  webMsgWhiteIpListAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      webMsgWhiteIpList(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 留言表系统ip白名单添加
  webMsgWhiteIpAddAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      webMsgWhiteIpAdd(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 留言表系统ip白名单修改
  webMsgWhiteIpEditAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      webMsgWhiteIpEdit(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 留言表系统ip白名单删除
  webMsgWhiteIpDeleteAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      webMsgWhiteIpDelete(data).then(response => {
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
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
