import request from "@/utils/request";
// 个人成交管理
export function EnscoreList() {
    return request({
      url: "/hxindex/Enuserscore/getuser",
      method: "POST",
    });
}
// 个人成交管理带分页查询
export function EnscoreSearch(data) {
    return request({
        url: "/hxindex/Enuserscore/userscore",
        method: "POST",
        data
    });
}
// 个人成交添加
export function EnscoreAdd(data) {
    return request({
        url: "/hxindex/Enuserscore/userscoreadd",
        method: "POST",
        data
    });
}
// 个人成交修改
export function EnscoreEdit(data) {
    return request({
        url: "/hxindex/Enuserscore/userscoreedit",
        method: "POST",
        data
    });
}
// 个人成交删除
export function EnscoreDel(data) {
    return request({
        url: "/hxindex/Enuserscore/userscoredelete",
        method: "POST",
        data
    });
}