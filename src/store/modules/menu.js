import { getDataList, menuAdd,menuEdit,menuDelete } from '@/api/menu'

const state = {}
const mutations = {}

const actions = {
  // 菜单管理菜单列表数据获取动作
  menuListAction({ commit, state }) {
    return new Promise((resolve, reject) => {
        getDataList().then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 菜单添加动作
  menuAddAction({ commit }, data){
    return new Promise((resolve, reject) => {
        menuAdd(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 菜单编辑动作
  menuEditAction({ commit }, data){
    return new Promise((resolve, reject) => {
        menuEdit(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 菜单删除动作
  menuDeleteAction({ commit }, data){
    return new Promise((resolve, reject) => {
        menuDelete(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
