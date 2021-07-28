import { getMenuPermit,getUserInfo,getUser,getWorkName,getPostionName,getRoute,getMenuButtonPermit,getNewPostArticle,fileUpload} from '@/api/api'

const state = {}
const mutations = {}

const actions = {
    // 获取指定菜单下所有的权限动作（角色分配权限时使用）
    menuPermitAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
          getMenuPermit(data).then(response => {
              resolve(response)
          }).catch(error => {
              reject(error)
          })
      })
    },
    // 根据用户id获取用户详细信息
    userInfoAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getUserInfo(data).then(response => {
              resolve(response)
          }).catch(error => {
              reject(error)
          })
      })
    },
    // 根据当前登录用户获取其可分配用户动作
    getUserAction({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUser().then(response => {
              resolve(response)
          }).catch(error => {
              reject(error)
          })
      })
    },
    // 获取职位动作
    getWorkNameAction({ commit, state }) {
      return new Promise((resolve, reject) => {
        getWorkName().then(response => {
              resolve(response)
          }).catch(error => {
              reject(error)
          })
      })
    },
    // 获取职称动作
    getPostionNameAction({ commit, state }) {
      return new Promise((resolve, reject) => {
        getPostionName().then(response => {
              resolve(response)
          }).catch(error => {
              reject(error)
          })
      })
    },
    // 用户登陆获取权限菜单
    getRouteAction({ commit, state }) {
      return new Promise((resolve, reject) => {
        getRoute().then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取登陆用户指定菜单页面操作按钮权限数据动作
    getMenuButtonPermitAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        getMenuButtonPermit(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取最新消息
    getNewPostArticleAction({ commit, state }) {
      return new Promise((resolve, reject) => {
        getNewPostArticle().then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 文件上传
    fileUploadAction({ commit, state },data) {
      return new Promise((resolve, reject) => {
        fileUpload(data).then(response => {
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
