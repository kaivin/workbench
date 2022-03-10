import {
    getDepartList,
    Getdepartuser,
    Selectuser,
    Selectuserdel,
    Selectuserlist,
    Userrank
} from '@/api/Enquiries'

const state = {}
const mutations = {}
const actions = {
    // 参与评比的部门列表
    getDepartListAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            getDepartList().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取指定部门下的所有成员
    GetdepartuserAction({ commit }, data){
        return new Promise((resolve, reject) => {
            Getdepartuser(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 选择每个月参与评比的新老员工
    SelectuserAction({ commit }, data){
        return new Promise((resolve, reject) => {
            Selectuser(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 删除新老用户
    SelectuserdelAction({ commit }, data){
        return new Promise((resolve, reject) => {
            Selectuserdel(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 每个月的新老用户列表
    SelectuserlistAction({ commit }, data){
        return new Promise((resolve, reject) => {
            Selectuserlist(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 排名
    UserrankAction({ commit }, data){
        return new Promise((resolve, reject) => {
            Userrank(data).then(response => {
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
