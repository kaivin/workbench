import request from "@/utils/request";
// 个人成交管理
export function CnscoreList() {
    return request({
      url: "/hxindex/Chinauserscore/getuser",
      method: "POST",
    });
}
// 个人成交管理带分页查询
export function CnscoreSearch(data) {
    return request({
        url: "/hxindex/Chinauserscore/userscore",
        method: "POST",
        data
    });
}
// 个人成交添加
export function CnscoreAdd(data) {
    return request({
        url: "/hxindex/Chinauserscore/userscoreadd",
        method: "POST",
        data
    });
}
// 个人成交修改
export function CnscoreEdit(data) {
    return request({
        url: "/hxindex/Chinauserscore/userscoreedit",
        method: "POST",
        data
    });
}
// 个人成交删除
export function CnscoreDel(data) {
    return request({
        url: "/hxindex/Chinauserscore/userscoredelete",
        method: "POST",
        data
    });
}