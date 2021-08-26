import request from "@/utils/request";


// 首页模块列表
export function homePageModuleList() {
    return request({
      url: "/hxindex/Modulelist/index",
      method: "POST"
    });
}
// 首页模块已分配角色
export function homePageModuleAllotedRoleList(data) {
    return request({
        url: "/hxindex/Modulelist/tablerole",
        method: "POST",
        data
    });
}
// 首页模块角色分配
export function homePageModuleAllotRole(data) {
    return request({
        url: "/hxindex/Modulelist/getrole",
        method: "POST",
        data
    });
}
// 获取当前登录用户有权限的模块
export function getPermitModuleList() {
    return request({
      url: "/hxindex/Modulelist/mymodule",
      method: "POST"
    });
}