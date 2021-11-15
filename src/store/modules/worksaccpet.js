import { 
    workOrderPublicData,
    receiveWorkOrderData,
    allotWorkOrderData,
    allotedWorkOrderData,
    personWorkOrderData,
    doingWorkOrderData,
    doneWorkOrderData,
    statWorkOrderData,
    receiveWorkOrder,
    backWorkOrder,
    workOrderUserList,
    confirmWorkOrder,
    undoWorkOrder,
    confirmDoneWorkOrder,
    workOrderInfo,
    workOrderNoAllotInfo,
    workOrderComment,
    workOrderpercenter,
    workOrderconfirmstart,
    workOrderEditscore,
    getpublishdepart,
    allaccpetwork,
    getworkAddfocus,
    getCancelworkfocus,
    getmyfocuswork,
} from '@/api/worksaccpet'

const state = {}
const mutations = {}
const actions = {
    // 工单公共数据
    workOrderPublicDataAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            workOrderPublicData().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 待接收工单数据
    receiveWorkOrderDataAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            receiveWorkOrderData().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 待分配工单数据
    allotWorkOrderDataAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            allotWorkOrderData().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 所有已分配工单数据
    allotedWorkOrderDataAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            allotedWorkOrderData(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 个人已分配工单数据
    personWorkOrderDataAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            personWorkOrderData(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 进行中工单数据
    doingWorkOrderDataAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            doingWorkOrderData(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 已完成工单数据-
    doneWorkOrderDataAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            doneWorkOrderData(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 数据统计
    statWorkOrderDataAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            statWorkOrderData(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 认领工单
    receiveWorkOrderAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            receiveWorkOrder(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 退回工单
    backWorkOrderAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            backWorkOrder(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 确认分配工单
    confirmWorkOrderAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            confirmWorkOrder(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 撤销分配工单
    undoWorkOrderAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            undoWorkOrder(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 提交审核工单
    confirmDoneWorkOrderAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            confirmDoneWorkOrder(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 工单负责人数据
    workOrderUserListAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            workOrderUserList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 工单详情信息数据
    workOrderNoAllotInfoAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            workOrderNoAllotInfo(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 工单详情信息数据
    workOrderInfoAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            workOrderInfo(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 工单详情评论
    workOrderCommentAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            workOrderComment(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 个人工单列表-负责人填写进度百分比（2021-10-13）
    workOrderpercenterAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            workOrderpercenter(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    //个人工单列表-负责人确认完成开始做工单（2021-10-13）
    workOrderconfirmstartAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            workOrderconfirmstart(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }, 
    //修改已分配工单积分（未完成的可以修改）
    workOrderEditscoreAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            workOrderEditscore(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }, 
    //有发布权限的部门列表
    getpublishdepartAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            getpublishdepart().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }, 
    //全部任务(所有已接受的工单列表)
    allaccpetworkAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            allaccpetwork(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }, 
    //添加关注工单
    getworkAddfocusAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getworkAddfocus(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }, 
    //取消关注工单
    getCancelworkfocusAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getCancelworkfocus(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }, 
    //我的关注工单
    getmyfocusworkAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getmyfocuswork(data).then(response => {
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
