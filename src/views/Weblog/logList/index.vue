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
                        <ul class="search-weblog">
                            <li v-for="(item,index) in loglist" :class="item.isOn?'active':''" @click="handleLog(item.value)" :key='index'>
                                <span>{{item.value}}</span>
                            </li>
                        </ul>
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
  name: 'WeblogLists',
  data() {
    return {
        loglist:[],
        tableData:[],
        searchData:{
          page:1,
          limit:20,
          ip:'',
          ftpuser:'',
          ftppwd:'',
          path:'',
          weburl:'',
          file:'',
          url:'',
          spidertype:'',
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
      var ip = $this.$route.query.ip;
      var ftpuser = $this.$route.query.ftpuser;
      var ftppwd = $this.$route.query.ftppwd;
      var path = $this.$route.query.path;
      var weburl = $this.$route.query.weburl;
      if(ip&&ip!=''){
        $this.searchData.ip=ip;
      }
      if(ftpuser&&ftpuser!=''){
        $this.searchData.ftpuser=ftpuser;
      }
      if(ftppwd&&ftppwd!=''){
        $this.searchData.ftppwd=ftppwd;
      }
      if(path&&path!=''){
        $this.searchData.path=path;
      }
      if(weburl&&weburl!=''){
        $this.searchData.weburl=weburl;
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
           $this.getloglist();
        }else{
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'error'
          });
        }
      });
    },
    // 组装日志文件所需数据
    initSearchloglist(){
      var $this = this;
      var searchData = {};
      if($this.searchData.ip&&$this.searchData.ip!=''){
        searchData.ip = $this.searchData.ip;
      }
      if($this.searchData.ftpuser&&$this.searchData.ftpuser!=''){
        searchData.ftpuser = $this.searchData.ftpuser;
      }
      if($this.searchData.ftppwd&&$this.searchData.ftppwd!=''){
        searchData.ftppwd = $this.searchData.ftppwd;
      }
      if($this.searchData.path&&$this.searchData.path!=''){
        searchData.path = $this.searchData.path;
      }
      if($this.searchData.weburl&&$this.searchData.weburl!=''){
        searchData.weburl = $this.searchData.weburl;
      }
      return searchData;
    },
    // 调用日志文件
    getloglist(){
      var $this=this;
      var searchData=$this.initSearchloglist();
      $this.$store.dispatch('Weblog/getloglistAction',searchData).then(res=>{
        if(res.status){
           if(res.data&&res.data.length>0){
             var loglist=[];
             res.data.forEach(function(item,index){
                 var objItem={};
                 objItem.isOn=false;
                 objItem.value=item;
                 loglist.push(objItem);
             });
             $this.loglist=loglist;
           }
        }else{
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'error'
          });
        }
      });
    },
    handleLog(valDate){
      var $this=this;
      var file=$this.searchData.weburl+'/'+valDate;
      var routeUrl =  $this.$router.resolve({path: "/Weblog/logInfo",query: {file:file}});
      window.open(routeUrl.href,'_blank');
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
