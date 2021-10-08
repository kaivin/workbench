import { 
    getDataList, 
    roleAdd,
    roleEdit,
    roleDelete,
    rolePermit,
    rolePermited,
    rolePermiting,
    roleUser,
    roleAllotUser,
    roleAllotedPostPermit,
    roleAllotPostPermit,
    canAllotPostPermit,
    userCanAllotPost,
    userCanAllotPostAllPermit,
    getWorkOrder,
    roleWorkOrder,
    roleAllotWorkOrder,
    userCanAllotWorkOrderAllPermit,
    getNetwork,
    roleNetwork,
    roleAllotNetwork,
 } from '@/api/role'

const state = {}
const mutations = {}

const actions = {
    // 角色列表数据动作
  roleListAction({ commit, state }) {
    return new Promise((resolve, reject) => {
        getDataList().then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
  },
  //角色添加动作
  roleAddAction({ commit }, data){
    return new Promise((resolve, reject) => {
        roleAdd(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  //角色编辑动作
  roleEditAction({ commit }, data){
    return new Promise((resolve, reject) => {
        roleEdit(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  //角色删除动作
  roleDeleteAction({ commit }, data){
    return new Promise((resolve, reject) => {
        roleDelete(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 当前角色已分配权限动作
  rolePermitedAction({ commit }, data){
    return new Promise((resolve, reject) => {
        rolePermited(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 当前登陆用户可分配权限动作
  rolePermitingAction({ commit }){
    return new Promise((resolve, reject) => {
        rolePermiting().then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 当前角色分配权限保存动作
  rolePermitAction({ commit }, data){
    return new Promise((resolve, reject) => {
        rolePermit(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 当前角色已分配用户接口动作
  roleUserAction({ commit }, data){
    return new Promise((resolve, reject) => {
        roleUser(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 当前角色分配用户保存动作
  roleAllotUserAction({ commit }, data){
    return new Promise((resolve, reject) => {
      roleAllotUser(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 当前角色已分配论坛分类操作权限接口动作
  roleAllotedPostPermitAction({ commit }, data){
    return new Promise((resolve, reject) => {
        roleAllotedPostPermit(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 当前角色分配论坛分类操作权限保存动作
  roleAllotPostPermitAction({ commit }, data){
    return new Promise((resolve, reject) => {
        roleAllotPostPermit(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 获取当前选中论坛分类下可供分配的操作权限列表数据
  canAllotPostPermitAction({ commit }, data){
    return new Promise((resolve, reject) => {
        canAllotPostPermit(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 获取当前登陆用户可读的论坛分类
  userCanAllotPostAction({ commit }){
    return new Promise((resolve, reject) => {
        userCanAllotPost().then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 获取当前登陆用户所有可分配论坛分类操作的权限
  userCanAllotPostAllPermitAction({ commit }){
    return new Promise((resolve, reject) => {
        userCanAllotPostAllPermit().then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 当前角色已分配工单权限接口动作
  roleWorkOrderAction({ commit }, data){
    return new Promise((resolve, reject) => {
        roleWorkOrder(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 当前角色分配工单权限保存动作
  roleAllotWorkOrderAction({ commit }, data){
    return new Promise((resolve, reject) => {
      roleAllotWorkOrder(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 获取当前登录用户可分配的工单权限
  getWorkOrderAction({ commit },data){
    return new Promise((resolve, reject) => {
        getWorkOrder(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 获取当前登录用户有权限的工单权限
  userCanAllotWorkOrderAllPermitAction({ commit }){
    return new Promise((resolve, reject) => {
        userCanAllotWorkOrderAllPermit().then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 当前角色已分配外网访问菜单权限接口动作
  roleNetworkAction({ commit }, data){
    return new Promise((resolve, reject) => {
        roleNetwork(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 当前角色分配外网访问菜单权限保存动作
  roleAllotNetworkAction({ commit }, data){
    return new Promise((resolve, reject) => {
        roleAllotNetwork(data).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        });
    });
  },
  // 获取当前登录用户可分配的外网访问菜单权限
  getNetworkAction({ commit },data){
    return new Promise((resolve, reject) => {
        getNetwork(data).then(response => {
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
