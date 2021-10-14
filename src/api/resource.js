import request from "@/utils/request";
// 获取资源列表数据接口
export function resourceList(data) {
  return request({
    url: "/hxindex/Resource/index",
    method: "POST",
    data,
  });
}
// 添加资源接口
export function resourceAdd(data) {
  return request({
    url: "/hxindex/Resource/resourceadd",
    method: "POST",
    data
  });
}
// 编辑资源接口
export function resourceEdit(data) {
  return request({
    url: "/hxindex/Resource/resourceedit",
    method: "POST",
    data
  });
}
// 删除资源接口
export function resourceDelete(data) {
  return request({
    url: "/hxindex/Resource/resourcedelete",
    method: "POST",
    data
  });
}
// 获取资源类型列表数据接口
export function resourceTypeList() {
    return request({
      url: "/hxindex/Resource/typelist",
      method: "POST"
    });
  }
  // 添加资源类型接口
  export function resourceTypeAdd(data) {
    return request({
      url: "/hxindex/Resource/typeadd",
      method: "POST",
      data
    });
  }
  // 编辑资源类型接口
  export function resourceTypeEdit(data) {
    return request({
      url: "/hxindex/Resource/typeedit",
      method: "POST",
      data
    });
  }
  // 删除资源类型接口
  export function resourceTypeDelete(data) {
    return request({
      url: "/hxindex/Resource/typedelete",
      method: "POST",
      data
    });
  }
  // 获取资源管理公共查询数据
  export function resourceSearchData() {
    return request({
      url: "/hxindex/Resource/getalldata",
      method: "POST"
    });
  }
  // 根据资源类型获取小类型
  export function resourceTypeSelected(data) {
    return request({
      url: "/hxindex/Resource/getsourcetype",
      method: "POST",
      data
    });
  }