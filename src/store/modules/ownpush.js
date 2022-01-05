import { 
    getAccountList, 
    getAccountListAll,
    accountAdd,
    accountEdit,
    accountDelete,
    userList,
    getCnProcessList,
    cnProcessAdd,
    cnProcessEdit,
    cnProcessDelete,
    cnProcessImport,
    getCnCostList,
    cnCostAdd,
    cnCostEdit,
    cnCostDelete,
    getCnChannelList,
    cnChannelAdd,
    cnChannelEdit,
    cnChannelDelete,
    getExpenselog,
    getExpenseadd,
} from '@/api/ownpush'

const state = {}
const mutations = {}
const actions = {
    // 获取推广账户列表数据接口
    accountListAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            getAccountList().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取推广账户列表数据接口
    accountListAllAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            getAccountListAll().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 添加推广账户动作
    accountAddAction({ commit }, data){
        return new Promise((resolve, reject) => {
            accountAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 编辑推广账户动作
    accountEditAction({ commit }, data){
        return new Promise((resolve, reject) => {
            accountEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 删除推广账户动作
    accountDeleteAction({ commit }, data){
        return new Promise((resolve, reject) => {
            accountDelete(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 添加|编辑时获取用户列表
    userListAction({ commit }, data){
        return new Promise((resolve, reject) => {
            userList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },

    // 获取营销流程表列表数据接口
    cnProcessListAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getCnProcessList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 添加营销流程表动作
    cnProcessAddAction({ commit }, data){
        return new Promise((resolve, reject) => {
            cnProcessAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 编辑营销流程表动作
    cnProcessEditAction({ commit }, data){
        return new Promise((resolve, reject) => {
            cnProcessEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 删除营销流程表动作
    cnProcessDeleteAction({ commit }, data){
        return new Promise((resolve, reject) => {
            cnProcessDelete(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 营销流程表批量导入动作
    cnProcessImportAction({ commit }, data){
        return new Promise((resolve, reject) => {
            cnProcessImport(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },

    // 获取充值消费记录列表数据接口
    cnCostListAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getCnCostList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 添加充值消费记录动作
    cnCostAddAction({ commit }, data){
        return new Promise((resolve, reject) => {
            cnCostAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 编辑充值消费记录动作
    cnCostEditAction({ commit }, data){
        return new Promise((resolve, reject) => {
            cnCostEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 删除充值消费记录动作
    cnCostDeleteAction({ commit }, data){
        return new Promise((resolve, reject) => {
            cnCostDelete(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },

    // 获取推广渠道列表数据接口
    cnChannelListAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            getCnChannelList().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 添加推广渠道动作
    cnChannelAddAction({ commit }, data){
        return new Promise((resolve, reject) => {
            cnChannelAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 编辑推广渠道动作
    cnChannelEditAction({ commit }, data){
        return new Promise((resolve, reject) => {
            cnChannelEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 删除推广渠道动作
    cnChannelDeleteAction({ commit }, data){
        return new Promise((resolve, reject) => {
            cnChannelDelete(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 消费记录列表
    getExpenselogAction({ commit }, data){
        return new Promise((resolve, reject) => {
            getExpenselog(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 消费记录excel导入
    getExpenseaddAction({ commit }, data){
        return new Promise((resolve, reject) => {
            getExpenseadd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
