import { 
    getWorkOrderTagList, 
    workOrderTagAdd,
    workOrderTagEdit,
    workOrderTagDelete,
    getWorkOrderList,
    issuerList,
    tagList,
    getSystemData,
    workOrderAdd,
    workOrderEdit,
    workOrderDelete,
    workOrderCancel,
    workOrderConfirm,
    workOrderRejected,
    workOrderEditInitInfo,
    departList,
    workOrderStatInfo,
    workOrderEvaluateSave,
    buckleInitInfo,
    buckleInfoSave,
    commentInfoList,
    deleteCurrentComment,
    addCommentInfo,
} from '@/api/works'

const state = {}
const mutations = {}
const actions = {
    // 获取工单系统标签列表
    workOrderTagsListAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            getWorkOrderTagList().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 工单标签添加
    workOrderTagAddAction({ commit }, data){
        return new Promise((resolve, reject) => {
            workOrderTagAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 工单标签编辑
    workOrderTagEditAction({ commit }, data){
        return new Promise((resolve, reject) => {
            workOrderTagEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 工单标签删除
    workOrderTagDeleteAction({ commit }, data){
        return new Promise((resolve, reject) => {
            workOrderTagDelete(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },


    // 获取工单系统标签列表
    workOrderListAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getWorkOrderList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取工单系统发布人数据
    issuerListAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            issuerList().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取工单系统部门数据
    departListAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            departList().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取工单系统系统标签数据
    tagListAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            tagList().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取工单发布所需的系统数据
    getSystemDataAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            getSystemData().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 工单发布
    workOrderAddAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            workOrderAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 工单修改
    workOrderEditAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            workOrderEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 工单删除
    workOrderDeleteAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            workOrderDelete(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 工单撤销
    workOrderCancelAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            workOrderCancel(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 工单确认完成
    workOrderConfirmAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            workOrderConfirm(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 工单审核驳回
    workOrderRejectedAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            workOrderRejected(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 工单编辑初始化信息数据
    workOrderEditInitInfoAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            workOrderEditInitInfo(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 工单统计数据
    workOrderStatInfoAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            workOrderStatInfo(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 评价保存
    workOrderEvaluateSaveAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            workOrderEvaluateSave(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 字典表配置获取信息
    buckleInitInfoAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            buckleInitInfo().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 字典表配置信息保存
    buckleInfoSaveAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            buckleInfoSave(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取评论数据
    commentInfoListAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            commentInfoList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 删除评论数据
    deleteCurrentCommentAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            deleteCurrentComment(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 发布评论
    addCommentInfoAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            addCommentInfo(data).then(response => {
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
