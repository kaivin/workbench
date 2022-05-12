import request from "@/utils/request";
// 参与评比的部门列表
export function getDepartList() {
    return request({
      url: "/hxindex/Enquiries/getdepart",
      method: "POST",
    });
}
// 获取指定部门下的所有成员
export function Getdepartuser(data) {
    return request({
      url: "/hxindex/Enquiries/getdepartuser",
      method: "POST",
      data
    });
}
// 选择每个月参与评比的新老员工
export function Selectuser(data) {
    return request({
      url: "/hxindex/Enquiries/selectuseradd",
      method: "POST",
      data
    });
}
// 删除新老用户
export function Selectuserdel(data) {
    return request({
      url: "/hxindex/Enquiries/selectuserdel",
      method: "POST",
      data
    });
}
// 每个月的新老用户列表
export function Selectuserlist(data) {
    return request({
      url: "/hxindex/Enquiries/selectuserlist",
      method: "POST",
      data
    });
}
// 排名
export function Userrank(data) {
    return request({
      url: "/hxindex/Enquiries/userrank",
      method: "POST",
      data
    });
}