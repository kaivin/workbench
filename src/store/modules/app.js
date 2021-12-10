import Cookies from 'js-cookie'
const state = {
  sidebar: {
    opened: Cookies.get('opened') ? JSON.parse(Cookies.get('opened')) : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'medium',
  addWebsite:false,
  addCnPhone:false,
  addCnCate:false,
  addCnProduct:false,
  addEnPhone:false,
  addEnCate:false,
  addEnProduct:false,
  addWebsiteAttr:false,
  addInformation:false,
  addTag:false,
  addUser:false,
  addDepart:false,
  addRole:false,
  addMenu:false,
  addPermit:false,
  addPromotedAccount:false,
  addPromotedChannel:false,
  addCnProcess:false,
  addCnMoney:false,
  addWebMsgIp:false,
  addWebsiteLog:1,
  addCompareList:false,
  addCompareGroupList:false,
  addEncompareList:false,
  addEncompareGroupList:false,
  addCntargetlist:false,
  addEntargetlist:false,
  addWorkOrderTag:false,
  addDepartScore:false,
  addResourceType:false,
  addResource:false,
  addCnScore:false,
  addEnScore:false,
  addUserBonus:false,
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    Cookies.set('opened', state.sidebar.opened)
    state.sidebar.withoutAnimation = false
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    state.sidebar.opened = false
    Cookies.set('opened', state.sidebar.opened)
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  ADD_WEBSITE: (state) => {
    state.addWebsite = true
  },
  CLOSE_WEBSITE: (state) => {
    state.addWebsite = false
  },
  ADD_CNPHONE: (state) => {
    state.addCnPhone = true
  },
  CLOSE_CNPHONE: (state) => {
    state.addCnPhone = false
  },
  ADD_ENPHONE: (state) => {
    state.addEnPhone = true
  },
  CLOSE_ENPHONE: (state) => {
    state.addEnPhone = false
  },
  ADD_ENCATE: (state) => {
    state.addEnCate = true
  },
  CLOSE_ENCATE: (state) => {
    state.addEnCate = false
  },
  ADD_ENPRODUCT: (state) => {
    state.addEnProduct = true
  },
  CLOSE_ENPRODUCT: (state) => {
    state.addEnProduct = false
  },
  ADD_CNCATE: (state) => {
    state.addCnCate = true
  },
  CLOSE_CNCATE: (state) => {
    state.addCnCate = false
  },
  ADD_CNPRODUCT: (state) => {
    state.addCnProduct = true
  },
  CLOSE_CNPRODUCT: (state) => {
    state.addCnProduct = false
  },
  ADD_WEBSITEATTR: (state) => {
    state.addWebsiteAttr = true
  },
  CLOSE_WEBSITEATTR: (state) => {
    state.addWebsiteAttr = false
  },
  ADD_INFORMATION: (state) => {
    state.addInformation = true
  },
  CLOSE_INFORMATION: (state) => {
    state.addInformation = false
  },
  ADD_TAG: (state) => {
    state.addTag = true
  },
  CLOSE_TAG: (state) => {
    state.addTag = false
  },
  ADD_USER: (state) => {
    state.addUser = true
  },
  CLOSE_USER: (state) => {
    state.addUser = false
  },
  ADD_DEPART: (state) => {
    state.addDepart = true
  },
  CLOSE_DEPART: (state) => {
    state.addDepart = false
  },
  ADD_ROLE: (state) => {
    state.addRole = true
  },
  CLOSE_ROLE: (state) => {
    state.addRole = false
  },
  ADD_MENU: (state) => {
    state.addMenu = true
  },
  CLOSE_MENU: (state) => {
    state.addMenu = false
  },
  ADD_PERMIT: (state) => {
    state.addPermit = true
  },
  CLOSE_PERMIT: (state) => {
    state.addPermit = false
  },
  ADD_PROMOTEDACCOUNT: (state) => {
    state.addPromotedAccount = true
  },
  CLOSE_PROMOTEDACCOUNT: (state) => {
    state.addPromotedAccount = false
  },
  ADD_PROMOTEDCHANNEL: (state) => {
    state.addPromotedChannel = true
  },
  CLOSE_PROMOTEDCHANNEL: (state) => {
    state.addPromotedChannel = false
  },
  ADD_CNPROCESS: (state) => {
    state.addCnProcess = true
  },
  CLOSE_CNPROCESS: (state) => {
    state.addCnProcess = false
  },
  ADD_CNMONEY: (state) => {
    state.addCnMoney = true
  },
  CLOSE_CNMONEY: (state) => {
    state.addCnMoney = false
  },
  ADD_WEBSITELOG: (state) => {
    state.addWebsiteLog +=1
  },
  ADD_WEBMSGIP: (state) => {
    state.addWebMsgIp = true
  },
  CLOSE_WEBMSGIP: (state) => {
    state.addWebMsgIp = false
  },
  ADD_COMPARELIST: (state) => {
    state.addCompareList = true
  },
  CLOSE_COMPARELIST: (state) => {
    state.addCompareList = false
  },
  ADD_COMPARELIST_GROUP: (state) => {
    state.addCompareGroupList = true
  },
  CLOSE_COMPARELIST_GROUP: (state) => {
    state.addCompareGroupList = false
  },
  
  ADD_ENCOMPARELIST: (state) => {
    state.addEncompareList = true
  },
  CLOSE_ENCOMPARELIST: (state) => {
    state.addEncompareList = false
  },
  ADD_ENCOMPARELIST_GROUP: (state) => {
    state.addEncompareGroupList = true
  },
  CLOSE_ENCOMPARELIST_GROUP: (state) => {
    state.addEncompareGroupList = false
  },
  ADD_CNTARGETLIST: (state) => {
    state.addCntargetlist = true
  },
  CLOSE_CNTARGETLIST: (state) => {
    state.addCntargetlist = false    
  },
  ADD_ENTARGETLIST: (state) => {
    state.addEntargetlist = true
  },
  CLOSE_ENTARGETLIST: (state) => {
    state.addEntargetlist = false  
  },
  ADD_WORKORDERTAG: (state) => {
    state.addWorkOrderTag = true
  },
  CLOSE_WORKORDERTAG: (state) => {
    state.addWorkOrderTag = false
  },
  ADD_DEPARTSCORE: (state) => {
    state.addDepartScore = true
  },
  CLOSE_DEPARTSCORE: (state) => {
    state.addDepartScore = false
  },
  ADD_RESOURCETYPE: (state) => {
    state.addResourceType = true
  },
  CLOSE_RESOURCETYPE: (state) => {
    state.addResourceType = false
  },
  ADD_RESOURCE: (state) => {
    state.addResource = true
  },
  CLOSE_RESOURCE: (state) => {
    state.addResource = false
  },
  ADD_CNSCORE: (state) => {
    state.addCnScore = true
  },
  CLOSE_CNSCORE: (state) => {
    state.addCnScore = false
  },
  ADD_ENSCORE: (state) => {
    state.addEnScore = true
  },
  CLOSE_ENSCORE: (state) => {
    state.addEnScore = false
  },
  ADD_USERBONUS: (state) => {
    state.addUserBonus = true
  },
  CLOSE_USERBONUS: (state) => {
    state.addUserBonus = false
  },
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  addWebsite({ commit }) {
    commit('ADD_WEBSITE')
  },
  closeWebsite({ commit }) {
    commit('CLOSE_WEBSITE')
  },
  addCnPhone({ commit }) {
    commit('ADD_CNPHONE')
  },
  closeCnPhone({ commit }) {
    commit('CLOSE_CNPHONE')
  },
  addEnPhone({ commit }) {
    commit('ADD_ENPHONE')
  },
  closeEnPhone({ commit }) {
    commit('CLOSE_ENPHONE')
  },
  addEnCate({ commit }) {
    commit('ADD_ENCATE')
  },
  closeEnCate({ commit }) {
    commit('CLOSE_ENCATE')
  },
  addEnProduct({ commit }) {
    commit('ADD_ENPRODUCT')
  },
  closeEnProduct({ commit }) {
    commit('CLOSE_ENPRODUCT')
  },
  addCnCate({ commit }) {
    commit('ADD_CNCATE')
  },
  closeCnCate({ commit }) {
    commit('CLOSE_CNCATE')
  },
  addCnProduct({ commit }) {
    commit('ADD_CNPRODUCT')
  },
  closeCnProduct({ commit }) {
    commit('CLOSE_CNPRODUCT')
  },
  addWebsiteAttr({ commit }) {
    commit('ADD_WEBSITEATTR')
  },
  closeWebsiteAttr({ commit }) {
    commit('CLOSE_WEBSITEATTR')
  },
  addInformation({ commit }) {
    commit('ADD_INFORMATION')
  },
  closeInformation({ commit }) {
    commit('CLOSE_INFORMATION')
  },
  addTag({ commit }) {
    commit('ADD_TAG')
  },
  closeTag({ commit }) {
    commit('CLOSE_TAG')
  },
  addUser({ commit }) {
    commit('ADD_USER')
  },
  closeUser({ commit }) {
    commit('CLOSE_USER')
  },
  addDepart({ commit }) {
    commit('ADD_DEPART')
  },
  closeDepart({ commit }) {
    commit('CLOSE_DEPART')
  },
  addRole({ commit }) {
    commit('ADD_ROLE')
  },
  closeRole({ commit }) {
    commit('CLOSE_ROLE')
  },
  addMenu({ commit }) {
    commit('ADD_MENU')
  },
  closeMenu({ commit }) {
    commit('CLOSE_MENU')
  },
  addPermit({ commit }) {
    commit('ADD_PERMIT')
  },
  closePermit({ commit }) {
    commit('CLOSE_PERMIT')
  },
  addPromotedAccount({ commit }) {
    commit('ADD_PROMOTEDACCOUNT')
  },
  closePromotedAccount({ commit }) {
    commit('CLOSE_PROMOTEDACCOUNT')
  },
  addPromotedChannel({ commit }) {
    commit('ADD_PROMOTEDCHANNEL')
  },
  closePromotedChannel({ commit }) {
    commit('CLOSE_PROMOTEDCHANNEL')
  },
  addCnProcess({ commit }) {
    commit('ADD_CNPROCESS')
  },
  closeCnProcess({ commit }) {
    commit('CLOSE_CNPROCESS')
  },
  addCnMoney({ commit }) {
    commit('ADD_CNMONEY')
  },
  closeCnMoney({ commit }) {
    commit('CLOSE_CNMONEY')
  },
  addWebsiteLog({ commit }) {
    commit('ADD_WEBSITELOG')
  },
  addWebMsgIp({ commit }) {
    commit('ADD_WEBMSGIP')
  },
  closeWebMsgIp({ commit }) {
    commit('CLOSE_WEBMSGIP')
  },
  addCompareList({ commit }) {
    commit('ADD_COMPARELIST')
  },
  closeCompareList({ commit }) {
    commit('CLOSE_COMPARELIST')
  },
  addCompareGroupList({ commit }) {
    commit('ADD_COMPARELIST_GROUP')
  },
  closeCompareGroupList({ commit }) {
    commit('CLOSE_COMPARELIST_GROUP')
  },
  addEncompareList({ commit }) {
    commit('ADD_ENCOMPARELIST')
  },
  addEncompareGroupList({ commit }) {
    commit('ADD_ENCOMPARELIST_GROUP')
  },
  closeEncompareList({ commit }) {
    commit('CLOSE_ENCOMPARELIST')
  }, 
  closeEncompareGroupList({ commit }) {
    commit('CLOSE_ENCOMPARELIST_GROUP')
  },  
  addCntargetlist({ commit }) {
    commit('ADD_CNTARGETLIST')
  },
  closeCntargetlist({ commit }) {
    commit('CLOSE_CNTARGETLIST')
  },
  addEntargetlist({ commit }) {
    commit('ADD_ENTARGETLIST')
  },
  closeEntargetlist({ commit }) {
    commit('CLOSE_ENTARGETLIST')
  },

  addWorkOrderTag({ commit }) {
    commit('ADD_WORKORDERTAG')
  },
  closeWorkOrderTag({ commit }) {
    commit('CLOSE_WORKORDERTAG')
  },

  addDepartScore({ commit }) {
    commit('ADD_DEPARTSCORE')
  },
  closeDepartScore({ commit }) {
    commit('CLOSE_DEPARTSCORE')
  },
  addResourceType({ commit }) {
    commit('ADD_RESOURCETYPE')
  },
  closeResourceType({ commit }) {
    commit('CLOSE_RESOURCETYPE')
  },
  addResource({ commit }) {
    commit('ADD_RESOURCE')
  },
  closeResource({ commit }) {
    commit('CLOSE_RESOURCE')
  },
  addCnScore({ commit }) {
    commit('ADD_CNSCORE')
  },
  closeCnScore({ commit }) {
    commit('CLOSE_CNSCORE')
  },
  addEnScore({ commit }) {
    commit('ADD_ENSCORE')
  },
  closeEnScore({ commit }) {
    commit('CLOSE_ENSCORE')
  },
  addUserBonus({ commit }) {
    commit('ADD_USERBONUS')
  },
  closeUserBonus({ commit }) {
    commit('CLOSE_USERBONUS')
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
