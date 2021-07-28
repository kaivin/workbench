const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    menu_data: state => state.permission.menuData,
    userInfo: state => state.login.userInfo,
    session: state => state.login.session,
}
export default getters
  