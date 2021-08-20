import { 
    getSalesList,
    getSalesSearchList,
    getSalesWaitDistribu,
    getSalesAllDistribuList,
    getSalesPublicData,
    getSalesWaitFortis,
    getSalesInquiryFortis,
    getSalesMonthEndFeedback,
    getSalesNofeedback,
    getSalesWaitAddingFortis,
    getSalesInquiryfeedback,
    getSalesDataAnalysis,
    getSalesAnalysisCondition,
    getSalesDetails,
    getSalesDetailsModify

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
    //业务员英文询盘-等待处理询盘
    getSalesWaitFortisAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getSalesWaitFortis(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    //业务员英文询盘-已处理询盘
    getSalesInquiryFortisAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getSalesInquiryFortis(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },    
    //业务员英文询盘-月底前需要反馈的询盘
    getSalesMonthEndFeedbackAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getSalesMonthEndFeedback(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },   
    //业务员英文询盘-未反馈询盘 
    getSalesNofeedbackAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getSalesNofeedback(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }, 
    //业务员英文询盘-等待添加富通id
    getSalesWaitAddingFortisAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getSalesWaitAddingFortis(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },  
    //业务员英文询盘-已做反馈询盘
    getSalesInquiryfeedbackAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getSalesInquiryfeedback(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },  
    //公共数据
    getSalesPublicDataAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            getSalesPublicData().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },    
    // 数据分析查询条件
    getSalesAnalysisConditionAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            getSalesAnalysisCondition().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },   
    //数据分析
    getSalesDataAnalysisAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getSalesDataAnalysis(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }, 
    //业务员英文询盘-详情
    getSalesDetailsAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getSalesDetails(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }, 
    //业务员英文询盘-详情
    getSalesDetailsModifyAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getSalesDetailsModify(data).then(response => {
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
