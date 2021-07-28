import Cookies from 'js-cookie'
import { login, logout, userForgetPwd,userGetCode } from '@/api/login'
import { getSessionID, setSessionID, removeSessionID } from '@/utils/session'
import { resetRouter } from '@/router'

const state = {
  userInfo:Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : "",
  session: getSessionID()
}

const mutations = {
  SET_SESSION: (state, session) => {
    state.session = session
  },
  SET_INFO: (state, data) => {
    state.userInfo = data;
    var cookieData = JSON.stringify(data);
    Cookies.set('userInfo', cookieData);
  },
}
const actions = {
  // 登录
  loginAction({ commit }, userInfo) {
    const { uname, pwd } = userInfo
    return new Promise((resolve, reject) => {
      login({ uname: uname.trim(), pwd: pwd }).then(response => {
        commit('SET_INFO', response.data);
        commit('SET_SESSION', response.session_id)
        setSessionID(response.session_id)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 退出登录
  logoutAction({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout().then(response => {
        commit('SET_SESSION', '')
        removeSessionID()
        Cookies.remove("userInfo");
        resetRouter()
        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 忘记密码修改密码
  userForgetPwdAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      userForgetPwd(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取验证码
  userGetCodeAction({ commit, state },data) {
    return new Promise((resolve, reject) => {
      userGetCode(data).then(response => {
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
