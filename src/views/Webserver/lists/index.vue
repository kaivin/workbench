﻿<template>
  <div class="page-root" ref="boxPane">
      <div class="abs-panel" ref="mainPane">
        <div class="scroll-panel" ref="scrollDom" style="will-change:scroll-position">
            <div class="true-height" ref="scrollPane">
                <p class="breadcrumb" ref="breadcrumbPane">
                  <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
                  <template v-for="item in breadcrumbList">
                    <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
                    <span class="breadcrumb-link" v-bind:key="item.id" v-else><b>-</b><span>{{item.title}}</span></span>
                  </template>
                </p>
                <el-card class="box-card" shadow="hover">
                  <div slot="header" v-if="canSearch">
                    <div class="card-header WebServerTop" ref="headerPane">
                      <div class="border-wrap post-class" ref="searchPane">
                        <div class="border-row flex-wrap">
                            <div class="border-cell txt-font"><span>语言：</span></div>
                            <div class="border-cell flex-content">
                                <div class="tag-panel">
                                    <el-select v-model="formData.language" size="small" clearable placeholder="请选择" :class="formData.language!=''?'el-xzstate':''">
                                      <el-option
                                        v-for="item in languageList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                      </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="border-cell txt-font"><span>用途：</span></div>
                            <div class="border-cell flex-content">
                                <div class="tag-panel">
                                    <el-select v-model="formData.useringid" size="small" clearable placeholder="请选择" :class="formData.useringid!=''?'el-xzstate':''">
                                      <el-option
                                        v-for="item in useingList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                      </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="border-cell txt-font"><span>系统：</span></div>
                            <div class="border-cell flex-content">
                                <div class="tag-panel">
                                    <el-select v-model="formData.systemid" size="small" clearable placeholder="请选择" :class="formData.systemid!=''?'el-xzstate':''">
                                      <el-option
                                        v-for="item in serverList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                      </el-option>
                                    </el-select>
                                </div>
                            </div>
                        </div>
                        <div class="border-row flex-wrap">
                            <div class="border-cell txt-font"><span>IP/别名：</span></div>
                            <div class="border-cell flex-content">
                                <div class="tag-panel">
                                    <el-input
                                      style="width: 229px;margin-right:10px;"
                                      placeholder="输入别名"
                                      v-model="formData.name"
                                      @keyup.enter.native="searchResult"
                                      size="small"
                                      :class="formData.name!=''?'el-xzstate':''"
                                      clearable>
                                    </el-input>
                                    <el-input
                                      style="width: 229px;margin-right: 5px;"
                                      placeholder="输入ip"
                                      v-model="formData.ip"
                                      @keyup.enter.native="searchResult"
                                      size="small"
                                      :class="formData.ip!=''?'el-xzstate':''"
                                      clearable>
                                    </el-input>
                                    <el-button class="item-input table-icon search" :class="isDisabled?'isDisabled':''" :disabled="isDisabled" size="small" type="primary" @click="searchResult"><i class="svg-i searchWhite" ><svg-icon icon-class="searchWhite" class-name="disabled" /></i>搜索</el-button>
                                    <el-button type="info" class="resetBtn" size="small" v-on:click="resetData()">重置</el-button>
                                </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="card-content WebServerBom" ref="cardContent">
                      <div class="table-wrapper" v-bind:class="scrollPosition.isFixed?'fixed-table':''">
                          <div class="table-mask"></div>
                          <el-table
                            ref="simpleTable"
                            :data="tableData"
                            :style="'min-height:'+tableHeight+'px;'"
                            stripe
                            class="SiteTable"
                            style="width: 100%"
                            >
                            <el-table-column
                              type="index"
                              label="序号"
                              align="center"
                              width="60">
                            </el-table-column>
                            <el-table-column
                              prop="id"
                              label="ID"
                              align="center"
                              width="60"
                              >
                            </el-table-column>
                            <el-table-column
                              prop="name"
                              label="别名"
                              align="left"
                              min-width="120"
                              >
                            </el-table-column>
                            <el-table-column
                              prop="useringname"
                              label="用途"
                              width="80"
                              align="center"
                              >
                            </el-table-column>
                            <el-table-column
                              prop="systemname"
                              label="系统"
                              width="80"
                              align="left"
                              >
                            </el-table-column>
                            <el-table-column
                              prop="ip"
                              label="IP"
                              width="160"
                              align="left"
                              >
                              <template #default="scope">
                                <div class="table-link">
                                  <router-link class="link" :to="{name:'Website_lists',query:{key:scope.row.ip}}">
                                    {{scope.row.ip}}  
                                  </router-link>
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="allip"
                              label="全部IP"
                              min-width="240"
                              align="left"
                              >
                            </el-table-column>
                            <el-table-column
                              prop="adminuser"
                              label="负责人"
                              width="120"
                              align="left"
                              >
                            </el-table-column>
                            <el-table-column
                              v-if="(menuButtonPermit.includes('Webserver_edit')||menuButtonPermit.includes('Webserver_delete'))"
                              :width="operationsWidth"
                              align="center"
                              fixed="right"
                              label="操作">
                              <template #default="scope">
                                <router-link :to="{name:'webserverAddEdit',query:{webserverID:scope.row.id}}" class="newBtn">
                                  <el-button v-if="scope.row.editshow===1" size="mini">编辑</el-button>
                                </router-link>
                                
                                <el-button v-if="scope.row.deletepermit===1" size="mini" @click="deleteTableRow(scope.row,scope.$index)" type="info" plain>删除</el-button>
                              </template>
                            </el-table-column>
                          </el-table>
                      </div>
                      <div class="out_box fixed" v-if="scrollPosition.maxScrollWidth>0&&scrollPosition.isPC" :style="'left:'+scrollPosition.left+'px;width:'+scrollPosition.width+'px;bottom:'+scrollPosition.fixedBottom+'px;'" ref="out_box">
                          <div class="in_box" @mousedown="mouseDownHandler" :style="'left:'+scrollPosition.insetLeft+'px;width:'+scrollPosition.insetWidth+'px;'" ref="in_box" ></div>
                      </div>
                    </div>
                    <div v-if="totalDataNum>50" class="pagination-panel" ref="pagePane">
                      <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page"
                        :page-sizes="pageSizeList"
                        :page-size="limit"
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
import { mapGetters } from 'vuex'
export default {
  name: 'Webserver_lists',
  data() {
    return {
      breadcrumbList:[],
      tableHeight:200,
      operationsWidth:"",
      menuButtonPermit:[],
      tableData:[],
      page:1,
      limit:50,
      pagerCount:5,
      pageSizeList:[50, 100, 150, 200],
      totalDataNum:0,
      serverList:[],
      useingList:[],
      languageList:[],
      canSearch:true,
      formData:{
        ip:"",
        systemid:"",
        language:"",
        name:"",
        useringid:"",
      },
      dialogSearchVisible:false,
      scrollPosition:{
        width:0,
        left:0,
        fixedBottom: 20,
        insetWidth:0,
        oldInsetLeft:0,
        insetLeft:0,
        ratio:0,
        startPageX:0,
        maxScrollWidth:0,
        isMouseDown:false,
        isPC:true,
        isFixed:false,
      },
      scrollTable:{
        scrollDom:null,
        tableHeaderFixedDom:null,
        tableFixedRightDom:null,
        fixedTopHeight:0,
        tableheaderHeight:0,
        fixedRightWidth:0,
        tableBottom:0,
        clientHeight:0,
      },
      isDisabled:false,
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'menuData'
    ]),
    isOpen() {
      return this.sidebar.opened;
    },
  },
  mounted(){
      const $this = this;
      if(!$this.sidebar.opened){
        $this.$store.dispatch('app/toggleSideBar');
      };
      // 监听竖向滚动条滚动事件
      window.addEventListener('scroll',this.handleScroll,true);
      $this.$nextTick(function () {
        $this.setTableHeight();
      });
      window.onresize = () => {
        return (() => {
          $this.setTableHeight();
        })()
      };
  },
  watch: {
      tableHeight(val) {
        if (!this.timer) {
          this.tableHeight = val
          this.timer = true
          const $this = this
          setTimeout(function() {
            $this.timer = false
          }, 400)
        }
      },
      isOpen(e){
        this.setTableHeight();
      },
  },
  created(){
    var $this = this;
    $this.getBreadcrumbList();
    $this.initData();
  },
  updated(){
    this.$nextTick(() => {
      this.$refs.simpleTable.doLayout();
    })
  },
  destroyed(){
    window.removeEventListener('scroll', this.handleScroll,true);//监听页面滚动事件
  },
  methods:{
    // 获取面包屑路径
    getBreadcrumbList(){
      var $this = this;
      var breadcrumbList = [];
      var currentID = ""+$this.$router.currentRoute.meta.id;
      var pageID = 0;
      if(currentID.indexOf('-')!=-1){
        pageID = parseInt(currentID.split("-")[1]);
      }else{
        pageID = parseInt(currentID);
      }
      $this.menuData.forEach(function(item,index){
        if(item.meta.id == pageID){
          var itemData = {};
          itemData.id = item.meta.id;
          itemData.router = item.path;
          itemData.title = item.meta.title;
          breadcrumbList.push(itemData);
        }else{
          if(item.children.length>0){
            item.children.forEach(function(item1,index1){
              if(item1.meta.id == pageID){
                var itemData = {};
                itemData.id = item.meta.id;
                itemData.router = item.path;
                itemData.title = item.meta.title;
                breadcrumbList.push(itemData);
                var itemData2 = {};
                itemData2.id = item1.meta.id;
                itemData2.router = item1.path;
                itemData2.title = item1.meta.title;
                breadcrumbList.push(itemData2);
              }else{
                if(item1.children.length>0){
                  item1.children.forEach(function(item2,index2){
                    if(item2.meta.id == pageID){
                      var itemData = {};
                      itemData.id = item.meta.id;
                      itemData.router = item.path;
                      itemData.title = item.meta.title;
                      breadcrumbList.push(itemData);
                      var itemData2 = {};
                      itemData2.id = item1.meta.id;
                      itemData2.router = item1.path;
                      itemData2.title = item1.meta.title;
                      breadcrumbList.push(itemData2);
                      var itemData3 = {};
                      itemData3.id = item2.meta.id;
                      itemData3.router = item2.path;
                      itemData3.title = item2.meta.title;
                      breadcrumbList.push(itemData3);
                    }
                  });
                }
              }
            });
          }
        }
      });
      $this.breadcrumbList = breadcrumbList;
    },
    // 判断浏览器类型
    getBrowserType(){
      var ua =  navigator.userAgent;
      if(ua){
        if(ua.indexOf('Mobile')!=-1){
          this.scrollPosition.isPC = false;
        }else{
          this.scrollPosition.isPC = true;
        }
      }else{
        this.scrollPosition.isPC = true;
      }
    },
    // 设置table高度
    setTableHeight(){
      var $this = this;
      $this.tableHeight = 0;      
      var headerHeight = $this.$refs.headerPane.offsetHeight+45;
      var breadcrumbHeight = $this.$refs.breadcrumbPane.offsetHeight;
      var screenHeight = $this.$refs.boxPane.offsetHeight;
      $this.tableHeight = screenHeight-headerHeight-breadcrumbHeight-40;
      $this.getBrowserType();
        setTimeout(function() {
          $this.setScrollDom();
      }, 400);
    },
    // 搜索结果点击事件
    searchResult(){
      var $this = this;
      $this.page = 1;
      $this.getWebsiteListData();
    },
    // 重置表单
    resetData(){
        var $this = this;
        $this.formData.ip='';
        $this.formData.systemid='';
        $this.formData.language='';
        $this.formData.name='';
        $this.formData.useringid='';
        $this.searchResult();
    },
    // 初始化页面数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.status){
          if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.menuButtonPermit.includes('Webserver_lists')){
              var operationsWidth = 20;
              if($this.menuButtonPermit.includes("Webserver_edit")){
                operationsWidth+=66;
              }
              if($this.menuButtonPermit.includes("Webserver_delete")){
                operationsWidth+=66;
              }
              $this.operationsWidth = "" + operationsWidth;
              $this.getSearchItemData();
            }else{
              $this.$message({
                showClose: true,
                message: "未被分配服务器管理查看权限",
                type: 'error',
                duration:6000
              });
              $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
            }
          }else{
            $this.$message({
              showClose: true,
              message: "未被分配服务器管理查看权限",
              type: 'error',
              duration:6000
            });
            $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
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
    // 获取服务器列表数据
    getWebsiteListData(){
      var $this = this;
      if(!$this.isDisabled){
        $this.isDisabled=true;
        if($this.$route.query.IP&&$this.formData.ip==""){
          $this.formData.ip = $this.$route.query.IP
        }
        var formData = {};
        formData.page = $this.page;
        formData.limit = $this.limit;
        formData.name = $this.formData.name;
        formData.language = $this.formData.language;
        formData.useringid = $this.formData.useringid;
        formData.systemid = $this.formData.systemid;
        formData.ip = $this.formData.ip;
        $this.$store.dispatch('webserver/webserverListAction', formData).then(response=>{
          if(response){
            if(response.status){
              $this.tableData = response.data;
              $this.totalDataNum = response.allcount;
              $this.canSearch = response.searchshow?true:false;
              $this.$nextTick(function () {
                $this.setTableHeight();
              })
              setTimeout(()=>{
                $this.isDisabled=false;
              },1000);
            }else{
              if(response.permitstatus&&response.permitstatus==2){
                $this.$message({
                  showClose: true,
                  message: "未被分配该页面访问权限",
                  type: 'error',
                  duration:6000
                });
                $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
              }else{
                $this.$message({
                  showClose: true,
                  message: response.info,
                  type: 'error'
                });
                setTimeout(()=>{
                  $this.isDisabled=false;
                },1000);
              }
            }
          }
        });
      }
    },
    // 获取查询相关展示数据
    getSearchItemData(){
      var $this = this;
      $this.$store.dispatch('webserver/webserverSelectDataAction', null).then(response=>{
        if(response){
          if(response.status){
            var languageList = [];
            response.language.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.languagename;
              item.isOn = false;
              languageList.push(itemData);
            });
            $this.languageList = languageList;
            var serverList = [];
            response.server.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.name;
              item.isOn = false;
              serverList.push(itemData);
            });
            $this.serverList = serverList;
            var useingList = [];
            response.usering.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.name;
              item.isOn = false;
              useingList.push(itemData);
            });
            $this.useingList = useingList;
            $this.getWebsiteListData();
          }else{
            $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
            });
          }
        }
      });
    },
    // 跳转到网站列表页
    jumpWebsiteList(row,index){
      var $this = this;
      var routeUrl =  $this.$router.resolve({name:'Website_lists',query:{key:row.ip}});
      window.open(routeUrl.href,'_blank');
    },
    // 修改网站数据
    editTableRow(row,index){
      var $this = this;
      var routeUrl =  $this.$router.resolve({name:'webserverAddEdit',query:{webserverID:row.id}});
      window.open(routeUrl.href,'_blank');
    },
    // 重置搜索条件
    resetSearchData(){
      var $this = this;
      $this.formData.ip="";
      $this.formData.name=null;
      $this.formData.language=null;
      $this.formData.useringid=null;
      $this.formData.systemid=null;
      $this.limit = 50;
      $this.page = 1;
    },
    // 每页显示条数改变事件
    handleSizeChange(val) {
      this.limit = val;
      this.page = 1;
      this.initData();
    },
    // 当前页改变事件
    handleCurrentChange(val) {
      this.page = val;
      this.initData();
    },
    // 添加表格行数据
    addTableRow(row,index){
      var $this = this;
      $this.$router.push({name:'webserverAddEdit'});
    },
    // 保存添加网站数据
    saveWebsiteAddData(){
      var $this = this;
      if(!$this.validationForm()){
        return false;
      }
      $this.$store.dispatch('website/websiteAddAction', $this.dialogForm).then(response=>{
          if(response.status){
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'success'
            });
            $this.dialogFormVisible = false;
            $this.initData();
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
    },
    // 重置添加数据表单
    resetFormData(){
      var $this = this;
      $this.dialogForm.brand = "";
      $this.dialogForm.language = "";
      $this.dialogForm.domain = "";
      $this.dialogForm.weblink = "";
    },
    // 验证是否为空
    validationForm(){
      var $this = this;
      if($this.dialogForm.brand == ""){
        $this.$message({
            showClose: true,
            message: '错误：网站品牌不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.dialogForm.language == ""){
        $this.$message({
            showClose: true,
            message: '错误：网站语种不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.dialogForm.domain == ""){
        $this.$message({
            showClose: true,
            message: '错误：主域名不能为空！',
            type: 'error'
        });
        $this.$refs['domain'].focus();
        return false;
      }
      return true;
    },
    // 删除表格行
    deleteTableRow(row,index){
      var $this = this;
      $this.$confirm('此操作将删除该服务器, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          $this.$store.dispatch('webserver/webserverDeleteAction', {id:row.id}).then(response=>{
            if(response.status){
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'success'
              });
              $this.getWebsiteListData();
            }else{
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
              });
            }
          });
      }).catch(() => {
          $this.$message({
            type: 'info',
            message: '已取消删除'
          });          
      });
    },
    // 设置横向滚动条相关DOM数据
    setScrollDom(){
      var $this = this;
      $this.scrollPosition.insetLeft = 0;
      $this.scrollPosition.oldInsetLeft = 0;
      // 表格真实宽度（可能超出屏幕）
      var scrollWidth = $this.$refs.simpleTable.bodyWrapper.scrollWidth;
      // 表格可见宽度（屏幕内宽度）
      var maxWidth = $this.$refs.simpleTable.bodyWrapper.clientWidth;
      // 获取表格的位置信息（距离视窗左边的位置信息）
      var rectOBJ = $this.$refs.simpleTable.$el.getBoundingClientRect();
      // 获取距离视窗左边的宽度
      var leftWidth = rectOBJ.left;
      // 根据百分比算出滚动条滑块的宽度
      var insetWidth = parseInt(maxWidth/scrollWidth*maxWidth);
      // 算出滚动条与视口比例（滚动条滚动1像素视口需要滚动多少像素）
      var ratio = (scrollWidth - maxWidth) / (maxWidth - insetWidth);
      var scrollDom = document.querySelector(".SiteTable .el-table__body-wrapper");
      var tableHeaderFixedDom = document.querySelector(".SiteTable .el-table__header-wrapper");
      var tableFixedRightDom = document.querySelector(".SiteTable .el-table__fixed-right");
      $this.scrollPosition.width = maxWidth;
      $this.scrollPosition.left = leftWidth;
      $this.scrollPosition.insetWidth = insetWidth;
      $this.scrollPosition.ratio = parseFloat(ratio);
      $this.scrollPosition.maxScrollWidth = maxWidth - insetWidth;
      $this.scrollTable.scrollDom = scrollDom;
      // 视窗改变时，让自定义滚动条的位置与真实滚动条滚动的位置相吻合
      $this.scrollPosition.insetLeft = $this.scrollTable.scrollDom.scrollLeft/$this.scrollPosition.ratio;
      // 获取表格头吸顶需滚动的高度
      if($this.$refs.headerPane){
         $this.scrollTable.fixedTopHeight = $this.$refs.headerPane.offsetHeight+$this.$refs.breadcrumbPane.offsetHeight+15+20+44;
      }else{
         $this.scrollTable.fixedTopHeight=$this.$refs.breadcrumbPane.offsetHeight+15+20+44;
      }
      $this.scrollTable.tableHeaderFixedDom = tableHeaderFixedDom;
      if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
         $this.scrollTable.tableFixedRightDom = tableFixedRightDom;
      }
      var fixedHeaderObj = $this.scrollTable.tableHeaderFixedDom.getBoundingClientRect();
      // 获取表格头的高度
      $this.scrollTable.tableheaderHeight = fixedHeaderObj.height;
      if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
         var fixedRightObj = $this.scrollTable.tableFixedRightDom.getBoundingClientRect();
         // 获取右侧固定列的总宽度
         $this.scrollTable.fixedRightWidth = fixedRightObj.width;
      }
      var tableObj = $this.scrollTable.scrollDom.getBoundingClientRect();
      $this.scrollTable.tableBottom = tableObj.height+$this.scrollTable.fixedTopHeight+$this.scrollTable.tableheaderHeight+54+20;
      $this.scrollTable.clientHeight = document.documentElement.clientHeight;
      // 头部固定情况下视窗宽高改变，需要重新设置的一些宽高
      if($this.scrollPosition.isFixed){
        var tableHeaderStyle = "width:"+$this.scrollPosition.width+"px;";
        $this.scrollTable.tableHeaderFixedDom.style = tableHeaderStyle;
        document.querySelector(".table-mask").style = tableHeaderStyle;
        var tableStyle3 = "width:"+$this.scrollTable.fixedRightWidth+"px;";        
        if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
          document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-header-wrapper").style=tableStyle3;
        }
        $this.scrollTable.tableBottom = tableObj.height+$this.scrollTable.fixedTopHeight+54+20;
      }
      // 视窗宽高改变时需要设置默认滚动条的位置
      if($this.totalDataNum>50){
        var scrTop = $this.$refs.scrollDom.scrollTop;
        if(scrTop+$this.scrollTable.clientHeight>=$this.scrollTable.tableBottom-20){
          $this.scrollPosition.fixedBottom = scrTop+$this.scrollTable.clientHeight-$this.scrollTable.tableBottom-10;
        }else{
          $this.scrollPosition.fixedBottom = 20;
        }
      }
    },
    // 竖向滚动条滚动事件
    handleScroll(event){
      var $this = this;
      if(!$this.scrollPosition.isMouseDown&&event.target.className=="scroll-panel"){// 非鼠标按下状态，为竖向滚动条触发的滚动事件
        var scrTop = event.target.scrollTop;
        var tableFixedRightDom = document.querySelector(".SiteTable .el-table__fixed-right");
        if(scrTop>=$this.scrollTable.fixedTopHeight){// 头部需要固定
          $this.scrollPosition.isFixed = true;
          var tableHeaderStyle = "width:"+$this.scrollPosition.width+"px;"
          $this.scrollTable.tableHeaderFixedDom.style = tableHeaderStyle;
          document.querySelector(".table-mask").style = tableHeaderStyle;
          var tableStyle1 = "padding-top:"+$this.scrollTable.tableheaderHeight+"px;";
          var tableStyle2 = "top:"+$this.scrollTable.tableheaderHeight+"px;";
          var tableStyle3 = "width:"+$this.scrollTable.fixedRightWidth+"px;";
          document.querySelector(".SiteTable .el-table__body-wrapper").style=tableStyle1;
          
          if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
            document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-body-wrapper").style=tableStyle2;
            document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-header-wrapper").style=tableStyle3;
          }
        }else{// 头部需要变为正常
          $this.scrollPosition.isFixed = false;
          var tableHeaderStyle = "width:100%";
          $this.scrollTable.tableHeaderFixedDom.style = tableHeaderStyle;
          var tableStyle1 = "padding-top:0";
          document.querySelector(".SiteTable .el-table__body-wrapper").style=tableStyle1;
          var tableStyle3 = "width:auto";
          if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
            document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-header-wrapper").style=tableStyle3;
          }
        }
        if($this.totalDataNum>50){
          if(scrTop+$this.scrollTable.clientHeight>=$this.scrollTable.tableBottom-20){
            $this.scrollPosition.fixedBottom = scrTop+$this.scrollTable.clientHeight-$this.scrollTable.tableBottom-10;
          }else{
            $this.scrollPosition.fixedBottom = 20;
          }
        }
      }
    },
    // 监听横向滚动条鼠标按下事件
    mouseDownHandler(e){
      this.crossMoveStartHandler(e);
      window.addEventListener('mousemove',this.crossMoveingHandler);
      window.addEventListener('mouseup',this.crossMoveEndHandler);
    },
    // 横向滚动条移动开始事件
    crossMoveStartHandler(e){
      var $this = this;
      $this.scrollPosition.isMouseDown = true;
      $this.scrollPosition.startPageX = e.pageX;
    },
    // 横向滚动条鼠标移动事件
    crossMoveingHandler(e){
      var $this = this;
      if($this.scrollPosition.isMouseDown){// 只在鼠标按下时监听鼠标移动事件
        var moveLeft = e.pageX - $this.scrollPosition.startPageX;
        var scrollWidth = 0;
        // 判断本次鼠标按下后鼠标移动的距离 大于0为向右移动
        if(moveLeft>0){
          // 本次移动距离+历史已移动距离如果大于最大能移动距离，说明向右已经滚动到头
          if(moveLeft+$this.scrollPosition.oldInsetLeft>=$this.scrollPosition.maxScrollWidth){
            scrollWidth = $this.scrollPosition.maxScrollWidth;
          }else{
            scrollWidth = moveLeft+$this.scrollPosition.oldInsetLeft;
          }
        }else if(moveLeft<0){
          // 小于0为向左移动
          // 本次移动距离+历史已移动距离，如果小于0，说明向左移动已经到头
          if(moveLeft+$this.scrollPosition.oldInsetLeft<0){
            scrollWidth = 0;
          }else{
            scrollWidth = moveLeft+$this.scrollPosition.oldInsetLeft;
          }
        }else{// 鼠标按下后，未移动
          scrollWidth = $this.scrollPosition.insetLeft;
        }
        // 计算得出本次移动+历史移动总距离
        // 自定义滚动条位置改变
        $this.scrollPosition.insetLeft = scrollWidth;
        // 真实滚动条滚动距离 = 自定义滚动条滚动距离*自定义滚动条与真实滚动条的滚动比
        $this.scrollTable.scrollDom.scrollLeft = scrollWidth*$this.scrollPosition.ratio;
        e.preventDefault();
      }
    },
    // 横向滚动条移动结束事件
    crossMoveEndHandler(e){
      var $this = this;
      $this.scrollPosition.isMouseDown = false;
      $this.scrollPosition.startPageX = 0;
      $this.scrollPosition.oldInsetLeft = $this.scrollPosition.insetLeft;
    },
  }
}
</script>
<style lang="scss" scoped>
</style>