import request from "@/utils/request";
// 获取内网论坛页面部门及部门下的成员数据
export function getDataList() {
  return request({
    url: "/hxindex/Article/index",
    method: "POST"
  });
}
// 添加论文文章类型接口
export function postArticleAdd(data) {
  return request({
    url: "/hxindex/Article/add",
    method: "POST",
    data
  });
}
// 编辑论文文章类型接口
export function postArticleEdit(data) {
  return request({
    url: "/hxindex/Article/edit",
    method: "POST",
    data
  });
}
// 删除论文文章类型接口
export function postArticleDelete(data) {
  return request({
    url: "/hxindex/Article/delete",
    method: "POST",
    data
  });
}
// 获取当前登录用户可读的论文文章类型接口
export function userCanReadPost() {
  return request({
    url: "/hxindex/Article/userreadtypepermit",
    method: "POST"
  });
}
// 获取当前内网论坛分类文章列表数据
export function postList(data) {
  return request({
    url: "/hxindex/Article/lists",
    method: "POST",
    data
  });
}
// 获取当前内网论坛分类标签列表数据
export function postTagList(data) {
  return request({
    url: "/hxindex/Article/gettypetags",
    method: "POST",
    data
  });
}
// 内网论坛文章搜索结果数据
export function postSearchList(data) {
  return request({
    url: "/hxindex/Article/search",
    method: "POST",
    data
  });
}
// 内网论坛文章编辑/修改界面获取内网论坛文章详情
export function postArticleEditInfo(data) {
  return request({
    url: "/hxindex/Article/editini",
    method: "POST",
    data
  });
}
// 获取内网论坛文章详情
export function postArticleInfo(data) {
  return request({
    url: "/hxindex/Article/info",
    method: "POST",
    data
  });
}
// 获取当前文章应读用户、已读用户、未读用户
export function postArticleReadUser(data) {
  return request({
    url: "/hxindex/Article/getreaduser",
    method: "POST",
    data
  });
}
// 提交留言
export function postArticleSubmitComment(data) {
  return request({
    url: "/hxindex/Article/addcomment",
    method: "POST",
    data
  });
}
// 获取留言列表数据
export function postArticleCommentList(data) {
  return request({
    url: "/hxindex/Article/commentlist",
    method: "POST",
    data
  });
}
// 获取留言列表数据
export function deleteComment(data) {
  return request({
    url: "/hxindex/Article/commentdelete",
    method: "POST",
    data
  });
}
// 获取添加/编辑页面展示数据
export function getEditPostData() {
  return request({
    url: "/hxindex/Article/getalldata",
    method: "POST",
  });
}