import { 
    getCustormbuyList,
    setExportLink,
    getCustormenbuyList,
    setExportLinken,
    getCnTemplate,
    getEnTemplate
} from '@/api/Custormbuy'


const state = {}
const mutations = {}
const actions = {
    // 中文成交详情列表
    getCustormbuyListAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getCustormbuyList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 中文成交详情导入
    setExportLinkAction({commit,state},data){
        return new Promise((resolve, reject)=>{
           setExportLink(data).then(response=>{
                resolve(response)
            }).catch(error => {
                reject(error)
            }) 
        })
        
    },
     // 英文成交详情列表
     getCustormenbuyListAction({ commit, state },data) {
        return new Promise((resolve, reject) => {
            getCustormenbuyList(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 英文成交详情导入
    setExportLinkActionen({commit,state},data){
        return new Promise((resolve, reject)=>{
           setExportLinken(data).then(response=>{
                resolve(response)
            }).catch(error => {
                reject(error)
            }) 
        })
        
    },   
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}