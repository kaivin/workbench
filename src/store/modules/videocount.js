import {
    getVideoType,
    getVideoPost,
    getRecordList,
    getRecordDetail,
    saveRecord,
    seprateScore,
    getUserList
} from '@/api/videocount'

const state = {}
const mutations = {}
const actions = {
    // 工作类型
    getVideoTypeData({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getVideoType(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 岗位类型
    getVideoPostData({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getVideoPost(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 工作数据
    getRecordData({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getRecordList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 工作详情
    getRecordDetailData({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getRecordDetail(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 保存工作内容
    saveRecordData({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            saveRecord(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 分配积分
    seprateUserScore({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            seprateScore(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取组员列表
    userListData({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            getUserList(data).then(response => {
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
