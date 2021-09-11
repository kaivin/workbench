import { 
    getPhoneList, 
    phoneAdd,
    phoneEdit,
    phoneDelete,
    phoneAddEditData,
    phoneAllotReadRole,
    phoneAllotedReadRole,
    phoneAllotWriteRole,
    phoneAllotedWriteRole,
    phoneAllotDomain,
    phoneAllotedDomain,
    userCanAllotDomain,
    getProductTypeList,
    productTypeAdd,
    productTypeEdit,
    productTypeDelete,
    getProductList,
    productAdd,
    productEdit,
    productDelete,
    productAddEditData,
    getCluesList,
    cluesAllotRole,
    cluesAllotedRole,
    cluesPhoneIndexData,
    cluesCurrentPhoneSearchData,
    cluesCurrentPhoneData,
    cluesCurrentPhoneDataEleEdit,
    cluesCurrentPhoneDataEleEditPage,
    cluesCurrentPhoneDataDelete,
    cluesCurrentPhoneUserCanEditField,
    cluesSearchSelectData,
    getCurrentCateProductList,
    getCurrentCluesSearchList,
    currentCluesSetALevel,
    cluesAddEditData,
    cluesAdd,
    cluesEdit,
    initCluesEditInfo,
    cluesUrlGetPhone,
    cluesAnalysisInitSystemData,
    customerWarnEdit,
    customerWarnIsRead,
    salesmanWarnIsRead,
    customerEditHistoryLog,
    Custormeditlog,
    Entargetlist,
    EndeparChoose,
    EntargetlistAdd,
    EntargetlistEdit,
    EntargetlistDel,
} from '@/api/enphone'

const state = {
    customerTipsCount:0,
}
const mutations = {
    SET_COUNT: (state, count) => {
    state.customerTipsCount = count
  },
}
const actions = {
    // 英文电话列表数据获取动作
    phoneListAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            getPhoneList().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 添加英文电话动作
    phoneAddAction({ commit }, data){
        return new Promise((resolve, reject) => {
            phoneAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 编辑英文电话动作
    phoneEditAction({ commit }, data){
        return new Promise((resolve, reject) => {
            phoneEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 删除英文电话动作
    phoneDeleteAction({ commit }, data){
        return new Promise((resolve, reject) => {
            phoneDelete(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 获取电话添加编辑时需要的系统数据
    phoneAddEditDataAction({ commit },){
        return new Promise((resolve, reject) => {
            phoneAddEditData().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 电话分配可读角色动作
    phoneAllotReadRoleAction({ commit },data){
        return new Promise((resolve, reject) => {
            phoneAllotReadRole(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 电话已分配可读角色
    phoneAllotedReadRoleAction({ commit },data){
        return new Promise((resolve, reject) => {
            phoneAllotedReadRole(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 电话分配可写角色动作
    phoneAllotWriteRoleAction({ commit },data){
        return new Promise((resolve, reject) => {
            phoneAllotWriteRole(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 电话已分配可写角色
    phoneAllotedWriteRoleAction({ commit },data){
        return new Promise((resolve, reject) => {
            phoneAllotedWriteRole(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 电话绑定域名动作
    phoneAllotDomainAction({ commit },data){
        return new Promise((resolve, reject) => {
            phoneAllotDomain(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 电话已绑定域名
    phoneAllotedDomainAction({ commit },data){
        return new Promise((resolve, reject) => {
            phoneAllotedDomain(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 当前登录用户可操作的域名
    userCanAllotDomainAction({ commit },data){
        return new Promise((resolve, reject) => {
            userCanAllotDomain(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },

    // 产品类型列表数据获取动作
    productTypeListAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            getProductTypeList().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 产品类型添加动作
    productTypeAddAction({ commit }, data){
        return new Promise((resolve, reject) => {
            productTypeAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 产品类型编辑动作
    productTypeEditAction({ commit }, data){
        return new Promise((resolve, reject) => {
            productTypeEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 产品类型删除动作
    productTypeDeleteAction({ commit }, data){
        return new Promise((resolve, reject) => {
            productTypeDelete(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },

    // 产品列表数据获取动作
    productListAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getProductList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 产品添加动作
    productAddAction({ commit }, data){
        return new Promise((resolve, reject) => {
            productAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 产品编辑动作
    productEditAction({ commit }, data){
        return new Promise((resolve, reject) => {
            productEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 产品删除动作
    productDeleteAction({ commit }, data){
        return new Promise((resolve, reject) => {
            productDelete(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 获取产品添加编辑时需要的系统数据
    productAddEditDataAction({ commit },){
        return new Promise((resolve, reject) => {
            productAddEditData().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },

    
    // 询盘字段列表数据获取动作
    cluesListAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            getCluesList().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 询盘字段分配角色动作
    cluesAllotRoleAction({ commit },data){
        return new Promise((resolve, reject) => {
            cluesAllotRole(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 询盘字段已分配角色
    cluesAllotedRoleAction({ commit },data){
        return new Promise((resolve, reject) => {
            cluesAllotedRole(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },

    
    // 询盘系统页面默认电话列表数据获取动作
    cluesPhoneIndexDataAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            cluesPhoneIndexData().then(response => {
                commit('SET_COUNT',response.warningcount);
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 询盘系统页面当前电话搜索条件数据获取动作
    cluesCurrentPhoneSearchDataAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            cluesCurrentPhoneSearchData(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 询盘系统页面当前电话询盘数据获取动作
    cluesCurrentPhoneDataAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            cluesCurrentPhoneData(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 询盘系统页面当前电话询盘数据获电商人员编辑动作
    cluesCurrentPhoneDataEleEditAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            cluesCurrentPhoneDataEleEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 询盘系统页面当前电话询盘数据电商人员批量编辑动作
    cluesCurrentPhoneDataEleEditPageAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            cluesCurrentPhoneDataEleEditPage(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 询盘系统页面当前电话询盘数据删除动作
    cluesCurrentPhoneDataDeleteAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            cluesCurrentPhoneDataDelete(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 询盘系统页面当前电话询盘获取当前登录用户可操作的字段动作
    cluesCurrentPhoneUserCanEditFieldAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            cluesCurrentPhoneUserCanEditField().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 询盘系统页面搜索询盘页查询条件数据获取动作
    cluesSearchSelectDataAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            cluesSearchSelectData().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 询盘系统页面搜索询盘页获取当前分类下的产品动作
    getCurrentCateProductListAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getCurrentCateProductList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 询盘系统页面搜索询盘页获取搜索结果动作
    getCurrentCluesSearchListAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getCurrentCluesSearchList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 询盘系统页面搜索询盘页批量标记为A+动作
    currentCluesSetALevelAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            currentCluesSetALevel(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 询盘添加修改获取条件数据动作
    cluesAddEditDataAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            cluesAddEditData().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 询盘添加保存数据动作
    cluesAddAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            cluesAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 询盘修改保存数据动作
    cluesEditAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            cluesEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 询盘修改获取询盘初始化信息动作
    initCluesEditInfoAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            initCluesEditInfo(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 根据询盘链接页面获取页面绑定电话动作
    cluesUrlGetPhoneAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            cluesUrlGetPhone(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 客服修改历史
    customerEditHistoryLogAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            customerEditHistoryLog(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 业务员数据统计初始化页面信息东西
    cluesAnalysisInitSystemDataAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            cluesAnalysisInitSystemData(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 修改客服内部提醒
    customerWarnEditAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            customerWarnEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 确认阅读客服内部提醒
    customerWarnIsReadAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            customerWarnIsRead(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 确认阅读业务员提醒
    salesmanWarnIsReadAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            salesmanWarnIsRead(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 询盘级别修改记录
    CustormeditlogAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            Custormeditlog(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 部门月度日目标列表
    EntargetlistAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            Entargetlist(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 英文询盘本月日标添加/修改-选择部门
    EndeparChooseAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            EndeparChoose(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 英文询盘本月日标添加
    EntargetlistAddAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            EntargetlistAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 英文询盘本月日标修改
    EntargetlistEditAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            EntargetlistEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 英文询盘本月日标删除
    EntargetlistDelAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            EntargetlistDel(data).then(response => {
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
