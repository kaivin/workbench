import { 
    getWebsiteProperty,
    getWebsiteDataList, 
    websiteAdd,
    websiteEdit,
    websiteEditSystemInfo,
    websiteEditInfo,
    websiteDelete,
    getWebsiteBrandDataList,
    getWebsiteLangDataList,
    getWebsiteHostDataList,
    getWebsiteAttrDataList, 
    websiteAttrAdd,
    websiteAttrEdit,
    websiteAttrDelete,
    getWebsiteLogDataList,
    websiteLogAdd,
    websiteLogEdit,
    websiteLogDelete,
    systemTagList,
    websiteLogEditInfo,
    websiteLogInfo,
    websiteLogReadUser,
    websiteFieldList,
    websiteFieldAllotedReadPermit,
    websiteFieldAllotReadPermit,
    websiteFieldAllotedWritePermit,
    websiteFieldAllotWritePermit
} from '@/api/website'

const state = {}
const mutations = {}
const actions = {
    // 获取网站基础选择条件数据
    websitePropertyAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            getWebsiteProperty().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取网站数据列表
    websiteListAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getWebsiteDataList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 添加网站
    websiteAddAction({ commit }, data){
        return new Promise((resolve, reject) => {
          websiteAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 编辑网站
    websiteEditAction({ commit }, data){
        return new Promise((resolve, reject) => {
          websiteEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 编辑网站获取网站修改系统数据
    websiteEditSystemInfoAction({ commit }){
        return new Promise((resolve, reject) => {
            websiteEditSystemInfo().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 编辑网站获取网站基本信息
    websiteEditInfoAction({ commit },data){
        return new Promise((resolve, reject) => {
            websiteEditInfo(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 删除网站标签属性
    websiteDeleteAction({ commit }, data){
        return new Promise((resolve, reject) => {
          websiteDelete(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 获取网站品牌数据列表
    websiteBrandListAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            getWebsiteBrandDataList().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取网站语言数据列表
    websiteLangListAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            getWebsiteLangDataList().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取网站host状态数据列表
    websiteHostListAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            getWebsiteHostDataList().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 获取网站标签属性数据列表
    websiteAttrListAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            getWebsiteAttrDataList().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 添加网站标签属性
    websiteAttrAddAction({ commit }, data){
        return new Promise((resolve, reject) => {
          websiteAttrAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 编辑网站标签属性
    websiteAttrEditAction({ commit }, data){
        return new Promise((resolve, reject) => {
          websiteAttrEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 删除网站标签属性
    websiteAttrDeleteAction({ commit }, data){
        return new Promise((resolve, reject) => {
          websiteAttrDelete(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },

    
    // 获取网站日志数据列表
    websiteLogListAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getWebsiteLogDataList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 添加网站日志
    websiteLogAddAction({ commit }, data){
        return new Promise((resolve, reject) => {
          websiteLogAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 编辑网站日志
    websiteLogEditAction({ commit }, data){
        return new Promise((resolve, reject) => {
          websiteLogEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 删除网站日志
    websiteLogDeleteAction({ commit }, data){
        return new Promise((resolve, reject) => {
          websiteLogDelete(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 添加修改网站日志时获取系统标签
    systemTagListAction({ commit }){
        return new Promise((resolve, reject) => {
            systemTagList().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 修改网站日志时获取日志详情
    websiteLogEditInfoAction({ commit },data){
        return new Promise((resolve, reject) => {
            websiteLogEditInfo(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 网站日志获取日志详情
    websiteLogInfoAction({ commit },data){
        return new Promise((resolve, reject) => {
            websiteLogInfo(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 网站日志已读未读用户数据
    websiteLogReadUserAction({ commit },data){
        return new Promise((resolve, reject) => {
            websiteLogReadUser(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },

    // 网站属性字段列表
    websiteFieldListAction({ commit }){
        return new Promise((resolve, reject) => {
            websiteFieldList().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },

    // 网站属性字段可读权限已分配角色数据
    websiteFieldAllotedReadPermitAction({ commit },data){
        return new Promise((resolve, reject) => {
            websiteFieldAllotedReadPermit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 网站属性字段可写权限已分配角色数据
    websiteFieldAllotedWritePermitAction({ commit },data){
        return new Promise((resolve, reject) => {
            websiteFieldAllotedWritePermit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 网站属性字段可读权限分配角色
    websiteFieldAllotReadPermitAction({ commit },data){
        return new Promise((resolve, reject) => {
            websiteFieldAllotReadPermit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 网站属性字段可写权限分配角色
    websiteFieldAllotWritePermitAction({ commit },data){
        return new Promise((resolve, reject) => {
            websiteFieldAllotWritePermit(data).then(response => {
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
