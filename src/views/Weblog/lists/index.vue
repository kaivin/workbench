<template>
  <div class="page-root website-log" ref="boxPane">
      <div class="abs-panel" ref="mainPane">
          <div class="scroll-panel" ref="scrollDom" style="will-change:scroll-position">
              <div class="true-height" ref="scrollPane">
                  <el-card class="box-card" shadow="hover">
                    <div class="card-content" ref="tableContent">
                            <el-table
                              ref="simpleTable"
                              :data="tableData"
                              tooltip-effect="dark"
                              stripe
                              class="SiteTable"
                              row-key="id"
                              >
                                <el-table-column prop="url" label="域名" width="120"></el-table-column>
                                <el-table-column prop="ip" label="ip" min-width="240"></el-table-column>
                                <el-table-column prop="code" label="标签" min-width="160"></el-table-column>
                                <el-table-column prop="content" label="备注" min-width="180"></el-table-column>
                                <el-table-column prop="spider" label="spider" width="80"></el-table-column>
                                <el-table-column prop="time" label="时间" width="100"></el-table-column>
                            </el-table>
                    </div>
                  </el-card>
          </div>
        </div>
      </div>
      <el-backtop target=".scroll-panel"></el-backtop>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'WeblogLists',
  data() {
    return {
        tableData:[],
        searchData:{
            page:1,
            limit:20,
        }
    }
  },
  mounted(){
      const $this = this;
  },
  created(){
    var $this = this;
    $this.getWeblogLists();
  },
  methods:{
    // 组装搜索接口所需数据
    initSearchData(){
      var $this = this;
      var searchData = {};
      searchData.page = $this.searchData.page;
      searchData.limit = $this.searchData.limit;
      if($this.searchData.file&&$this.searchData.file!=''){
        searchData.file = $this.searchData.file;
      }
      if($this.searchData.spidertype&&$this.searchData.spidertype!=''){
        searchData.spidertype = $this.searchData.spidertype;
      }
      if($this.searchData.ip&&$this.searchData.ip!=''){
        searchData.ip = $this.searchData.ip;
      }
      if($this.searchData.url&&$this.searchData.url!=''){
        searchData.url = $this.searchData.url;
      }
      return searchData;
    },
    // 获取当前日志文件的抓取详情
    getWeblogLists(){
      var $this=this;
      var searchData=$this.initSearchData();
      $this.$store.dispatch('Weblog/getlistsAction',searchData).then(res=>{
        if(res.status){
            $this.tableData=res.data;
           console.log(res,'res');


           code: ""
content: ""
ip: ""
spider: ""
time: "1970-01-01 08:00:00"
url: ""
        }else{
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'error'
          });
        }
      });
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
