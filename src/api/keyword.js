import request from "@/utils/request";

// 搜索词指数
export const indices = {
  keyword: {
    add: (data) => request({
      url: "/hxindex/Keyword/add",
      method: "POST",
      data
    }),
    delete: (data) => request({
      url: "/hxindex/Keyword/delete",
      method: "POST",
      data
    }),
    edit: (data) => request({
      url: "/hxindex/Keyword/edit",
      method: "POST",
      data
    }),
    search: (data) => request({
      url: "/hxindex/Keyword/lists",
      method: "POST",
      data
    })
  },
  stats: {
    search: (data) => request({
      url: "/hxindex/Keyword/keywordcount",
      method: "POST",
      data
    }),
    info: (data) => request({
      url: "/hxindex/Keyword/keywordinfo",
      method: "POST",
      data
    })
  }
}
