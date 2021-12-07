<template>
  <div class="page-root flex-box no-padding weblog" ref="boxPane">
      <div class="abs-panel" ref="mainPane">
          <div class="scroll-panel" ref="scrollDom" style="will-change:scroll-position">
              <div class="true-height" ref="scrollPane">
                  <el-card class="box-card" shadow="hover">
                    <div slot="header">
                        <div class="card-header" ref="headerPane">
                            <div class="search-wrap">
                                <div class="item-search" style="padding-top:0px;padding-bottom:0px;">
                                    <el-input
                                        style="width:180px;"
                                        placeholder="ip"
                                        v-model="searchData.ip"
                                        size="small"
                                        clearable>
                                    </el-input>
                                </div>
                                <div class="item-search" style="padding-top:0px;padding-bottom:0px;">
                                    <el-input
                                        style="width:180px;"
                                        placeholder="url"
                                        v-model="searchData.url"
                                        size="small"
                                        clearable>
                                    </el-input>
                                </div>
                                <div class="item-search" style="padding-top:0px;padding-bottom:0px;">
                                    <el-select v-model="searchData.spidertype" size="small" clearable placeholder="蜘蛛类型">
                                        <el-option
                                            v-for="item in spidertypeList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="item-search" style="padding-top:0px;padding-bottom:0px;">
                                    <el-button class="item-input" size="small" type="primary" icon="el-icon-search" @click="searchResult">查询</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-content" ref="tableContent">
                            <el-table
                              ref="simpleTable"
                              :data="tableData"
                              tooltip-effect="dark"
                              stripe
                              class="SiteTable"
                              row-key="id"
                              >
                                <el-table-column prop="url" label="抓取页面" min-width="120"></el-table-column>
                                <el-table-column prop="ip" label="ip" min-width="120"></el-table-column>
                                <el-table-column prop="code" label="状态码" min-width="120"></el-table-column>
                                <el-table-column prop="content" label="内容" min-width="120"></el-table-column>
                                <el-table-column prop="spider" label="蜘蛛类型" min-width="120"></el-table-column>
                                <el-table-column prop="time" label="抓取时间" min-width="120"></el-table-column>
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
export default {
  name: 'WeblogInfo',
  data() {
    return {
        loglist:[],
        tableData:[],
        searchData:{
          page:1,
          limit:20,
          file:'',
          spidertype:'',
          ip:'',
          url:'',
        },
        spidertypeList:[],
    }
  },
  mounted(){
      const $this = this;
  },
  created(){
    var $this = this;
    $this.getRouterQuery();
  },
  methods:{
    // 获取路由参数
    getRouterQuery(){
      var $this = this;
      var file = $this.$route.query.file;
      if(file&&file!=''){
        $this.searchData.file=file;
      }
      $this.initData();
    },
    // 常用蜘蛛列表
    initData(){
      var $this=this;
      $this.$store.dispatch('Weblog/getlogSpidertypeAction').then(res=>{
        if(res.status){
           if(res.data&&res.data.length>0){
              var spidertypeList=[];
              res.data.forEach(function(item,index){
                  var objItem={};
                  objItem.value=item;
                  objItem.label=item;
                  spidertypeList.push(objItem);
              });
              $this.spidertypeList=spidertypeList;
           }
           $this.getWeblogLists();
        }else{
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'error'
          });
        }
      });
    },
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
        }else{
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'error'
          });
        }
      });
    },
    // 搜索
    searchResult(){
      var $this=this;
      $this.getWeblogLists();
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
