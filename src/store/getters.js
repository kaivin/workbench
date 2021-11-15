﻿const getters = {
    sidebar: state => state.app.sidebar,
    menuData: state => state.permission.menuData,
    userInfo: state => state.login.userInfo,
    session: state => state.login.session,
    isArticleSearch: state => state.api.isArticleSearch,
    isArticleAdd: state => state.api.isArticleAdd,
    isWebsiteAdd: state => state.api.isWebsiteAdd,
    isWebserverAdd: state => state.api.isWebserverAdd,
    addWebsite:state => state.app.addWebsite,
    addCnPhone:state => state.app.addCnPhone,
    addEnPhone:state => state.app.addEnPhone,
    isCnPhoneAdd: state => state.api.isCnPhoneAdd,
    isEnPhoneAdd: state => state.api.isEnPhoneAdd,
    isEnCateAdd: state => state.api.isEnCateAdd,
    addEnCate:state => state.app.addEnCate,
    isEnProductAdd: state => state.api.isEnProductAdd,
    addEnProduct:state => state.app.addEnProduct,
    isCnCateAdd: state => state.api.isCnCateAdd,
    addCnCate:state => state.app.addCnCate,
    isCnProductAdd: state => state.api.isCnProductAdd,
    addCnProduct:state => state.app.addCnProduct,
    isWebsiteAttrAdd: state => state.api.isWebsiteAttrAdd,
    addWebsiteAttr:state => state.app.addWebsiteAttr,
    isInformationAdd: state => state.api.isInformationAdd,
    addInformation:state => state.app.addInformation,
    isTagAdd: state => state.api.isTagAdd,
    addTag:state => state.app.addTag,
    isUserAdd: state => state.api.isUserAdd,
    addUser:state => state.app.addUser,
    isDepartAdd: state => state.api.isDepartAdd,
    addDepart:state => state.app.addDepart,
    isRoleAdd: state => state.api.isRoleAdd,
    addRole:state => state.app.addRole,
    isMenuAdd: state => state.api.isMenuAdd,
    addMenu:state => state.app.addMenu,
    isPermitAdd: state => state.api.isPermitAdd,
    addPermit:state => state.app.addPermit,
    isPromotedAccountAdd: state => state.api.isPromotedAccountAdd,
    addPromotedAccount:state => state.app.addPromotedAccount,
    isPromotedChannelAdd: state => state.api.isPromotedChannelAdd,
    addPromotedChannel:state => state.app.addPromotedChannel,
    isCnProcessAdd: state => state.api.isCnProcessAdd,
    addCnProcess:state => state.app.addCnProcess,
    isCnMoneyAdd: state => state.api.isCnMoneyAdd,
    addCnMoney:state => state.app.addCnMoney,
    isCnCluesAdd: state => state.api.isCnCluesAdd,
    isEnCluesAdd: state => state.api.isEnCluesAdd,
    isWebsiteLogAdd: state => state.api.isWebsiteLogAdd,
    addWebsiteLog:state => state.app.addWebsiteLog,
    customerTipsCount:state => state.enphone.customerTipsCount,
    isWebMsgIpAdd: state => state.api.isWebMsgIpAdd,
    addWebMsgIp:state => state.app.addWebMsgIp,
    msgPage:state => state.webmsg.msgPage,
    iscompareListAdd: state => state.api.iscompareListAdd,
    addCompareList: state => state.app.addCompareList,
    isEncompareListAdd: state => state.api.isEncompareListAdd,
    addEncompareList: state => state.app.addEncompareList,
    isCntargetlistAdd: state => state.api.isCntargetlistAdd,
    addCntargetlist: state => state.app.addCntargetlist,
    isEntargetlistAdd: state => state.api.isEntargetlistAdd,
    addEntargetlist: state => state.app.addEntargetlist,
    isWorkOrderTagAdd: state => state.api.isWorkOrderTagAdd,
    addWorkOrderTag:state => state.app.addWorkOrderTag,
    isWorkOrderAdd: state => state.api.isWorkOrderAdd,
    isDepartScoreAdd: state => state.api.isDepartScoreAdd,
    addDepartScore:state => state.app.addDepartScore,
    isResourceTypeAdd: state => state.api.isResourceTypeAdd,
    addResourceType:state => state.app.addResourceType,
    isResourceAdd: state => state.api.isResourceAdd,
    addResource:state => state.app.addResource,
    isCnScoreAdd: state => state.api.isCnScoreAdd,
    addCnScore:state => state.app.addCnScore,
    isEnScoreAdd: state => state.api.isEnScoreAdd,
    addEnScore:state => state.app.addEnScore,
    isHomeCache: state => state.api.isHomeCache,
    isNohomeCache: state => state.api.isNohomeCache,
}
export default getters
  