import {
    getDouyinData,
    getDouyinScore,
    dyKeywordList,
    dyKeywordAdd,
    dyKeywordDel,
    getDouyinCount,
    getDouyinDepartlist,
    getDouyinTime,
    getDouyinEachLine,
    getDouyinAccountLine,
    getDouyinPersonalCount,
    getDouyinDepartgroup,
    getDouyinTotalCount,
    getDouyinWordInfo,
    getDouyinCountInfo,
    getDouyinAccountList,
    douyinAccountAdd,
    douyinAccountEdit

} from '@/api/douyin'

const state = {}
const mutations = {}
const actions = {
    // 获取抖音结果
    getDouyinResData({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getDouyinData(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取抖音t统计结果
    getDouyinScoreData({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getDouyinScore(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取抖音统计结果
    getDouyinKeywordList({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            dyKeywordList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 关键词添加
    douyinKeywordAdd({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            dyKeywordAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 关键词删除
    douyinKeywordDel({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            dyKeywordDel(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 部门列表
    douyinDepartlist({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getDouyinDepartlist(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 账号统计
    douyinCountData({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getDouyinCount(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取日期
    douyinCountTime({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getDouyinTime(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取每个图表曲线
    douyinEachLine({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getDouyinEachLine(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取账号图表曲线
    douyinAccountLine({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getDouyinAccountLine(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取个人账号图表曲线
    douyinPersonalCountLine({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getDouyinPersonalCount(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    douyinDepartgroup({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getDouyinDepartgroup(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 账号总计
    douyinTotalCountData({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getDouyinTotalCount(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 关键词详情
    douyinWordInfo({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getDouyinWordInfo(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 关键词详情
    douyinCountInfo({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getDouyinCountInfo(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 抖音账号列表
    douyinAccountList({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getDouyinAccountList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }, 
    //  抖音账号添加
    addDouyinAccount({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            douyinAccountAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }, 
    //  抖音账号编辑
    editDouyinAccount({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            douyinAccountEdit(data).then(response => {
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
