import { getUserList,userAdd,userEdit,userDelete,userShowHide,userResetPwd,userAllotedRole,userCanAllotRole,userAllotRole,userCanDepart,userNameEdit,pwdEdit,
  contactEdit,
  getBrandList,
  changeUserLogin,userPersonother,getUserPersonother,userPersonotherAdd,userPersonotherEdit,userPersonotherExportlink,getAccountList,transAccount,getMoveInqury} from '@/api/user'

const state = {}
const mutations = {}
const actions = {
  // 个人其他信息 导入
  userPersonotherExportlinkAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      userPersonotherExportlink(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 个人其他信息 修改
  userPersonotherEditAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      userPersonotherEdit(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 个人其他信息 添加
  userPersonotherAddAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      userPersonotherAdd(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 个人其他信息列表
  userPersonotherAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      userPersonother(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getUserPersonotherAction({ commit, state }){
    return new Promise((resolve, reject) => {
      getUserPersonother().then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取用户列表数据
  userListAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      getUserList(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 添加新用户
  userAddAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      userAdd(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 修改用户信息
  userEditAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      userEdit(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 用户删除
  userDeleteAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      userDelete(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 用户显示隐藏
  userShowHideAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      userShowHide(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 密码重置
  userResetPwdAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      userResetPwd(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取用户已分配角色
  userAllotedRoleAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      userAllotedRole(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取当前登录用户可分配角色
  userCanAllotRoleAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      userCanAllotRole(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 给用户分配角色
  userAllotRoleAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      userAllotRole(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取当前登录用户可看到的部门
  userCanDepartAction({ commit, state }) {
    return new Promise((resolve, reject) => {
      userCanDepart().then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取品牌列表
  getBrandListAction({ commit, state }) {
    return new Promise((resolve, reject) => {
      getBrandList().then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },


  // 个人修改相关接口
  // 用户名修改
  userNameEditAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
        userNameEdit(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 密码修改
  pwdEditAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
        pwdEdit(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 联系方式修改
  contactEditAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
        contactEdit(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 切换登陆用户
  changeUserLoginAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      changeUserLogin(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 可操作的账号资源
  getAccountListAction({ commit, state }) {
    return new Promise((resolve, reject) => {
      getAccountList().then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 转移账号
  transAccountAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      transAccount(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 转移资源的询盘
  moveInquryAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      getMoveInqury(data).then(response => {
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
