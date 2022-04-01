import { 
    resourceList,
    resourceAdd,
    resourceEdit,
    resourceDelete,
    resourceTypeList,
    resourceTypeAdd,
    resourceTypeEdit,
    resourceTypeDelete,
    resourceSearchData,
    resourceTypeSelected,
 } from '@/api/resource'

const state = {}
const mutations = {}

const actions = {
  // 资源列表数据动作
  resourceListAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
        resourceList(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 添加资源动作
  resourceAddAction({ commit }, data){
    return new Promise((resolve, reject) => {
        resourceAdd(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 编辑资源动作
  resourceEditAction({ commit }, data){
    return new Promise((resolve, reject) => {
        resourceEdit(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 删除资源动作
  resourceDeleteAction({ commit }, data){
    return new Promise((resolve, reject) => {
        resourceDelete(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 资源类型列表数据动作
  resourceTypeListAction({ commit, state }) {
    return new Promise((resolve, reject) => {
        resourceTypeList().then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  // 添加资源类型动作
  resourceTypeAddAction({ commit }, data){
    return new Promise((resolve, reject) => {
        resourceTypeAdd(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 编辑资源类型动作
  resourceTypeEditAction({ commit }, data){
    return new Promise((resolve, reject) => {
        resourceTypeEdit(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 删除资源类型动作
  resourceTypeDeleteAction({ commit }, data){
    return new Promise((resolve, reject) => {
        resourceTypeDelete(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 获取资源管理公共查询数据
  resourceSearchDataAction({ commit }){
    return new Promise((resolve, reject) => {
        resourceSearchData().then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 根据资源类型获取小类型
  resourceTypeSelectedAction({ commit }, data){
    return new Promise((resolve, reject) => {
        resourceTypeSelected(data).then(response => {
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
