﻿<template>
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
                                        style="width:150px;"
                                        placeholder="ip"
                                        v-model="searchData.isIp"
                                        size="small"
                                        clearable>
                                    </el-input>
                                </div>
                                <div class="item-search" style="padding-top:0px;padding-bottom:0px;">
                                    <el-input
                                        style="width:300px;"
                                        placeholder="抓取页面、UA 模糊查询"
                                        v-model="searchData.url"
                                        size="small"
                                        clearable>
                                    </el-input>
                                </div>
                                <div class="item-search" style="padding-top:0px;padding-bottom:0px;">
                                    <el-select style="width:150px;" v-model="searchData.spidertype" size="small" clearable placeholder="蜘蛛类型">
                                        <el-option
                                            v-for="item in spidertypeList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="item-search" style="padding-top:0px;padding-bottom:0px;">
                                    <el-select style="width:120px;" v-model="searchData.type" size="small" clearable placeholder="页面类型">
                                        <el-option
                                            v-for="item in pagetypeList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="item-search" style="padding-top:0px;padding-bottom:0px;">
                                    <el-input
                                        style="width:90px;"
                                        placeholder="状态码"
                                        v-model="searchData.startcode"
                                        size="small"
                                        clearable>
                                    </el-input> -
                                    <el-input
                                        style="width:90px;"
                                        placeholder="状态码"
                                        v-model="searchData.endcode"
                                        size="small"
                                        clearable>
                                    </el-input>
                                </div>
                                <div class="item-search" style="padding-top:0px;padding-bottom:0px;">
                                    <el-button class="item-input" size="small" type="primary" icon="el-icon-search" @click="searchResult">查询</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-content" style="border-radius: 0px;" ref="tableContent">
                         <div class="search_statis" v-if="searchData.isfile">
                            <p>
                              字节: <b>{{spiderCount.Byte}}</b>
                              谷歌：<b>{{spiderCount.Google}}</b>
                              搜狗：<b>{{spiderCount.Sogou}}</b>
                              百度：<b>{{spiderCount.baidu}}</b>
                              必应：<b>{{spiderCount.bing}}</b>
                              360：<b>{{spiderCount.s360}}</b>
                              神马：<b>{{spiderCount.shenma}}</b>
                            </p>
                            <span>总数：<b>{{totalDataNum}}</b></span>
                         </div>
                         <div class="search_ip" v-if="iparrCount.length>0">
                              <p>ip：数量</p>
                              <span v-for="(item,index) in iparrCount">{{item.label}}: <b>{{item.value}}</b></span>
                         </div>
                         <div class="search-weblog">
                            <ul :style="'height:'+ boxHeight">
                                <li v-for="(item,index) in loglist" :class="item.isOn?'active':''" @click="handleLog(item)" :key='index'>
                                    <span>{{item.value}}</span>
                                </li>
                            </ul>
                            <i :class="isFold? 'inRotate' : '' "  @click="showAll" ></i>
                         </div>
                         <div class="search-table">
                            <el-table
                              ref="simpleTable"
                              :data="tableData"
                              tooltip-effect="dark"
                              stripe
                              class="SiteTable"
                              row-key="id"
                              >
                                <el-table-column prop="url" label="抓取页面">
                                  <template slot-scope="scope">
                                    <a class="spiderItem" :href="scope.row.url" target="_blank">{{scope.row.url}}</a>
                                  </template>
                                </el-table-column>
                                <el-table-column prop="ip" label="ip" width="130"></el-table-column>
                                <el-table-column prop="code" label="状态码" width="70"></el-table-column>
                                <el-table-column prop="size" label="文件大小" width="80"></el-table-column>
                                <el-table-column prop="spider" label="蜘蛛类型" width="140">
                                  <template slot-scope="scope">
                                      <span @click="spiderBtn(scope.row)" class="spiderItem">{{scope.row.spider}}</span>
                                  </template>
                                </el-table-column>
                                <el-table-column prop="time" label="抓取时间" width="180"></el-table-column>
                                <el-table-column prop="content" label="内容" min-width="120"></el-table-column>
                            </el-table>
                         </div>
                    </div>
                    <div v-if="totalDataNum>100" class="pagination-panel" ref="pagePane">
                      <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="searchData.page"
                        :page-sizes="pageSizeList"
                        :page-size="searchData.limit"
                        :pager-count="pagerCount"
                        :layout="'total, sizes, prev, pager, next, jumper'"
                        :total="totalDataNum">
                      </el-pagination>
                    </div>
                  </el-card>
          </div>
        </div>
      </div>
      <el-backtop target=".scroll-panel"></el-backtop>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: 'WeblogLists',
  data() {
    return {
        pageSizeList:[100,200,400,800,1600],
        pagerCount:5,
        totalDataNum:0,
        isPageBtn:false,
        isFold:false,
        boxHeight:'84px',
        loglist:[],
        iparrCount:[],
        spiderCount:[],
        tableData:[],
        searchData:{
          page:1,
          limit:100,
          ip:'',
          isIp:'',
          ftpuser:'',
          ftppwd:'',
          path:'',
          weburl:'',
          file:'',
          url:'',
          spidertype:'',
          isfile:'',
          type:'',
          startcode:'',
          endcode:'',
          webip:'',
          domain:'',
        },
        spidertypeList:[],
        pagetypeList:[
          {value:1,label:'图片'},
          {value:2,label:'html'},
          {value:3,label:'js'},
        ],
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
    ]),
  },
  mounted(){
    var $this = this;
    if(!$this.sidebar.opened){
      $this.$store.dispatch('app/toggleSideBar');
    };
    $this.getspidertypeList();
  },
  created(){
    var $this = this;
    $this.initData();
  },
  methods:{
    // loading自定义
    loadingFun(){
      var $this = this;
      $this.isLoading = $this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },
    // 常用蜘蛛列表
    getspidertypeList(){
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
        }else{
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'error'
          });
        }
      });
    },
    initData(){
      var $this=this;
      $this.loadingFun();
      $this.getRouterQuery();
    },
    // 获取路由参数
    getRouterQuery(){
      var $this = this;
      var ip = $this.$route.query.ip;
      var ftpuser = $this.$route.query.ftpuser;
      var ftppwd = $this.$route.query.ftppwd;
      var path = $this.$route.query.path;
      var weburl = $this.$route.query.weburl;
      var domain = $this.$route.query.weburl;
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
      if(domain&&domain!=''){
        $this.searchData.domain=domain;
      }
      $this.getloglist();
    },
    // 组装日志文件所需数据
    Searchlog(){
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
      if($this.searchData.domain&&$this.searchData.domain!=''){
        searchData.domain = $this.searchData.domain;
      }
      return searchData;
    },
    //获取最后斜杠后的字符串 
    LastStr(str){       
      let index = str .lastIndexOf("\/");  
      str  = str .substring(index + 1, str.length);
      return str;
    },
    // 调用日志文件
    getloglist(){
      var $this=this;
      var searchData=$this.Searchlog();
      $this.$store.dispatch('Weblog/getloglistAction',searchData).then(res=>{
        if(res.status){
           if(res.data&&res.data.length>0){
             var loglist=[];
             res.data.forEach(function(item,index){
                 var objItem={};
                 objItem.isOn=false;
                 objItem.label=item;
                 objItem.value=$this.LastStr(item);
                 loglist.push(objItem);
             });
             $this.loglist=loglist;
           }
           $this.isLoading.close();
        }else{
          $this.$message({
            showClose: true,
            message: res.info,
            type: 'error'
          });
        }
      });
    },
    // 点击日志标签
    handleLog(valDate){
      var $this=this;
      $this.loadingFun();
      $this.searchData.isfile=valDate.label;
      $this.loglist.forEach(function(item,index){
        item.isOn=false;
        if(valDate.value==item.value){
          item.isOn=true;
        }
      });
      $this.getWeblogLists();
    },
    // 组装搜索接口所需数据
    SearchData(){
      var $this = this;
      var searchData = {};
      searchData.page = $this.searchData.page;
      searchData.limit = $this.searchData.limit;
      if($this.searchData.isIp&&$this.searchData.isIp!=''){
        searchData.ip = $this.searchData.isIp;
      }
      if($this.searchData.spidertype&&$this.searchData.spidertype!=''){
        searchData.spidertype = $this.searchData.spidertype;
      }
      if($this.searchData.type&&$this.searchData.type!=''){
        searchData.type = $this.searchData.type;
      }
      if($this.searchData.startcode&&$this.searchData.startcode!=''){
        searchData.startcode = $this.searchData.startcode;
      }
      if($this.searchData.endcode&&$this.searchData.endcode!=''){
        searchData.endcode = $this.searchData.endcode;
      }
      if($this.searchData.url&&$this.searchData.url!=''){
        searchData.url = $this.searchData.url;
      }
      if($this.searchData.isfile&&$this.searchData.isfile!=''){
        searchData.file =$this.$route.query.weburl+'/'+$this.searchData.isfile;
      }
      if($this.searchData.ip&&$this.searchData.ip!=''){
        searchData.webip = $this.searchData.ip;
      }
      if($this.searchData.ftpuser&&$this.searchData.ftpuser!=''){
        searchData.ftpuser = $this.searchData.ftpuser;
      }
      if($this.searchData.ftppwd&&$this.searchData.ftppwd!=''){
        searchData.ftppwd = $this.searchData.ftppwd;
      }
      if($this.searchData.domain&&$this.searchData.domain!=''){
        searchData.domain = $this.searchData.domain;
      }
      return searchData;
    },
    // 获取当前日志文件的抓取详情
    getWeblogLists(){
      var $this=this;
      var searchData=$this.SearchData();
      searchData.page = $this.isPageBtn?$this.searchData.page:1;
      if(!$this.isPageBtn){
        $this.searchData.page = 1
      }
      $this.isPageBtn = false;
      $this.$store.dispatch('Weblog/getlistsAction',searchData).then(res=>{
        if(res.status){
          console.log(res,'res---')
            $this.tableData=res.data;
            $this.totalDataNum = res.allcount;
            $this.spiderCount=res.spidercount;
            var iparrCount=[]
            for(let key in res.iparr){
              iparrCount.push({
                label:key,
                value:res.iparr[key]
              })
            }
            console.log(typeof(iparrCount))
            console.log(iparrCount,'iparrCount')
            $this.iparrCount=iparrCount;
            $this.isLoading.close();
        }else{
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'error'
          });
        }
      });
    },
    // 点击日志展开/收缩
    showAll(){
      var $this=this;
      $this.isFold=!$this.isFold;
      var boxHeight = '';
      if($this.isFold){
        boxHeight = "auto";
      }else{
        boxHeight = '84px'
      }
      $this.boxHeight=boxHeight;
    },
    // 搜索
    searchResult(){
      var $this=this;
      $this.loadingFun();
      $this.getWeblogLists();
    },
    // 每页显示条数改变事件
    handleSizeChange(val) {
      var $this=this;
      $this.searchData.limit = val;
      $this.page = 1;
      $this.loadingFun();
      $this.getWeblogLists();
    },
    // 当前页改变事件
    handleCurrentChange(val) {
      var $this=this;
      $this.searchData.page = val;
      $this.isPageBtn = true;
      $this.loadingFun();
      $this.getWeblogLists();
    },
    spiderBtn(varDate){
      var $this=this;
      var searchData={};
      searchData.ip=varDate.ip
      $this.$store.dispatch('Weblog/getlogCheckspiderActive',searchData).then(res=>{
        if(res.status){
          $this.$message({
              message: res.data,
            type: 'success'
          });
        }else{
          $this.$message({
            showClose: true,
            message: res.info,
            type: 'error'
          });
        }
      });
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
