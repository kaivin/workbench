import {
    getKuaishouData,
    getKuaishouScore,
    ksKeywordList,
    ksKeywordAdd,
    ksKeywordDel,
    getKuaishouCount,
    getKuaishouDepartlist,
    getKuaishouTime,
    getKuaishouEachLine,
    getKuaishouAccountLine,
    getKuaishouPersonalCount,
    getKuaishouDepartgroup,
    getKuaishouTotalCount,
    getKuaishouWordInfo,
    getKuaishouCountInfo,
    getKuaishouAccountList,
    kuaishouAccountAdd,
    kuaishouAccountEdit

} from '@/api/kuaishou'

const state = {}
const mutations = {}
const actions = {
    // 获取抖音结果
    getKuaishouResData({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getKuaishouData(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取抖音t统计结果
    getKuaishouScoreData({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getKuaishouScore(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取抖音统计结果
    getKuaishouKeywordList({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            ksKeywordList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 关键词添加
    kuaishouKeywordAdd({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            ksKeywordAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 关键词删除
    kuaishouKeywordDel({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            ksKeywordDel(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 部门列表
    kuaishouDepartlist({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getKuaishouDepartlist(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 账号统计
    kuaishouCountData({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getKuaishouCount(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取日期
    kuaishouCountTime({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getKuaishouTime(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取每个图表曲线
    kuaishouEachLine({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getKuaishouEachLine(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取账号图表曲线
    kuaishouAccountLine({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getKuaishouAccountLine(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取个人账号图表曲线
    kuaishouPersonalCountLine({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getKuaishouPersonalCount(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    kuaishouDepartgroup({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getKuaishouDepartgroup(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 账号总计
    kuaishouTotalCountData({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getKuaishouTotalCount(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 关键词详情
    kuaishouWordInfo({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getKuaishouWordInfo(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 关键词详情
    kuaishouCountInfo({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getKuaishouCountInfo(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 抖音账号列表
    kuaishouAccountList({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getKuaishouAccountList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }, 
    //  抖音账号添加
    addKuaishouAccount({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            kuaishouAccountAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }, 
    //  抖音账号编辑
    editKuaishouAccount({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            kuaishouAccountEdit(data).then(response => {
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
