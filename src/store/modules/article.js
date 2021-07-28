import { 
    getDataList, 
    postArticleAdd,
    postArticleEdit,
    postArticleDelete,
    userCanReadPost,
    userCanWritePost,
    postList,
    postTagList,
    postSearchList,
    postSystemTagList,
    postDepartList,
    postUserList,
    postArticleEditInfo,
    postArticleInfo,
    postArticleReadUser,
    postArticleSubmitComment,
    postArticleCommentList,
    deleteComment,
    getCanEditData,
    getEditPostData
} from '@/api/article'

const state = {}
const mutations = {}
const actions = {
    // 获取论坛页面部门及部门下的成员数据
    postArticleAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            getDataList().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 添加论文动作
    postArticleAddAction({ commit }, data){
        return new Promise((resolve, reject) => {
            postArticleAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 编辑论文动作
    postArticleEditAction({ commit }, data){
        return new Promise((resolve, reject) => {
            postArticleEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 删除论文动作
    postArticleDeleteAction({ commit }, data){
        return new Promise((resolve, reject) => {
            postArticleDelete(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 获取当前登录用户可读的论文类型接口
    userCanReadPostAction({ commit }){
        return new Promise((resolve, reject) => {
            userCanReadPost().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 获取当前登录用户可写的论文类型接口
    userCanWritePostAction({ commit }){
        return new Promise((resolve, reject) => {
            userCanWritePost().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 获取当前论坛分类文章列表数据
    postListAction({ commit },data){
        return new Promise((resolve, reject) => {
            postList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 获取当前论坛分类标签数据
    postTagListAction({ commit },data){
        return new Promise((resolve, reject) => {
            postTagList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 论坛文章搜索结果数据
    postSearchListAction({ commit },data){
        return new Promise((resolve, reject) => {
            postSearchList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 论坛文章编辑/修改界面获取系统标签
    postSystemTagListAction({ commit },data){
        return new Promise((resolve, reject) => {
            postSystemTagList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 论坛文章编辑/修改界面获取可选部门
    postDepartListAction({ commit }){
        return new Promise((resolve, reject) => {
            postDepartList().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 论坛文章编辑/修改界面获取可选用户
    postUserListAction({ commit }){
        return new Promise((resolve, reject) => {
            postUserList().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 论坛文章编辑/修改界面获取论坛文章详情
    postArticleEditInfoAction({ commit },data){
        return new Promise((resolve, reject) => {
            postArticleEditInfo(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 获取论坛文章详情
    postArticleInfoAction({ commit },data){
        return new Promise((resolve, reject) => {
            postArticleInfo(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 获取当前文章应读用户、已读用户、未读用户
    postArticleReadUserAction({ commit },data){
        return new Promise((resolve, reject) => {
            postArticleReadUser(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 提交留言
    postArticleSubmitCommentAction({ commit },data){
        return new Promise((resolve, reject) => {
            postArticleSubmitComment(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 获取留言列表
    postArticleCommentListAction({ commit },data){
        return new Promise((resolve, reject) => {
            postArticleCommentList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 删除评论
    deleteCommentAction({ commit },data){
        return new Promise((resolve, reject) => {
            deleteComment(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 获取当前登录用户可操作的数据字段
    getCanEditDataAction({ commit }){
        return new Promise((resolve, reject) => {
            getCanEditData().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 获取添加/编辑页面展示数据
    getEditPostDataAction({ commit }){
        return new Promise((resolve, reject) => {
            getEditPostData().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
