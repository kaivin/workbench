const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    menu_data: state => state.permission.menuData,
    userInfo: state => state.login.userInfo,
    session: state => state.login.session,
    isArticleSearch: state => state.api.isArticleSearch,
    isArticleAdd: state => state.api.isArticleAdd,
    isWebsiteAdd: state => state.api.isWebsiteAdd,
    isWebserverAdd: state => state.api.isWebserverAdd,
    addWebsite:state => state.app.addWebsite,
}
export default getters
  