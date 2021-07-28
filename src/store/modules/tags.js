import { getDataList, tagsAdd,tagsEdit,tagsDelete } from '@/api/tags'

const state = {}
const mutations = {}
const actions = {
    // 获取帖子系统标签列表数据接口
    tagsListAction({ commit, state }) {
        return new Promise((resolve, reject) => {
            getDataList().then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 添加帖子系统标签动作
    tagsAddAction({ commit }, data){
        return new Promise((resolve, reject) => {
          tagsAdd(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 编辑帖子系统标签动作
    tagsEditAction({ commit }, data){
        return new Promise((resolve, reject) => {
          tagsEdit(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
    // 删除帖子系统标签动作
    tagsDeleteAction({ commit }, data){
        return new Promise((resolve, reject) => {
          tagsDelete(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
