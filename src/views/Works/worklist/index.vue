<template>
  <div class="page-root works-index" ref="boxPane">
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
                      <div slot="header">
                          <div class="card-header" ref="headerPane">
                              <div class="search-wrap" style="padding-bottom:10px;">
                                  <div class="item-search" style="width: 240px;">
                                  <el-date-picker
                                      v-model="searchData.date"
                                      class="date-range"
                                      type="daterange"
                                      align="right"
                                      value-format = "yyyy-MM-dd"
                                      unlink-panels
                                      range-separator="至"
                                      start-placeholder="开始日期"
                                      end-placeholder="结束日期"
                                      size="small"
                                      :picker-options="pickerRangeOptions"
                                      :class="searchData.date&&searchData.date.length>0?'el-xzstate':''">
                                  </el-date-picker>
                                  </div>
                                  <div class="item-search" style="width: 140px;">
                                    <el-select v-model="searchData.uid" size="small" filterable clearable placeholder="发布人" :class="searchData.uid!=''?'el-xzstate':''">
                                        <el-option
                                            v-for="item in userList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                  </div>
                                  <div class="item-search" style="width: 100px;">
                                    <el-select v-model="searchData.tagsid" size="small" clearable placeholder="标签" :class="searchData.tagsid!=''?'el-xzstate':''">
                                        <el-option
                                            v-for="item in tagList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                  </div>
                                  <div class="item-search" style="width: 100px;">
                                    <el-select v-model="searchData.status" size="small" clearable placeholder="工单状态" :class="searchData.status!=''?'el-xzstate':''">
                                        <el-option
                                            v-for="item in statusList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                  </div>
                                  <div class="item-search">
                                    <el-button class="item-input" :class="isDisabled?'isDisabled':''" :disabled="isDisabled" size="small" type="primary" icon="el-icon-search" @click="searchResult">查询</el-button>
                                  </div>
                                  <div class="item-search" v-if="menuButtonPermit.includes('Works_workcount')">
                                    <el-button class="item-input" size="small" type="primary" @click="jumpStatPage">数据统计</el-button>
                                  </div>
                                  <div class="item-search">
                                    <el-button type="info" class="resetBtn" size="small" v-on:click="resetData()">重置</el-button>
                                  </div>
                              </div>
                              <div class="clues-info flex-box">
                                <div class="clues-infoFl flex-content">
                                      <p><span>当前结果集共有<strong class="color1">{{infoData.totalCount}}</strong>条工单信息，进行中<strong class="color2">{{infoData.doingCount}}</strong>条，待审核<strong class="color3">{{infoData.checkingCount}}</strong>条，逾期未完成<strong class="color4">{{infoData.overdueCount}}</strong>条，已完成<b class="color5">{{infoData.doneCount}}</b>条。</span></p>
                                      
                                      <p>
                                        <span v-for="(item,index) in groupScore" :key='index'><strong>{{item.name}}</strong> ，本月总积分<strong  class="color1">{{item.score}}</strong>，本月剩余积分<strong  class="color2">{{item.nowscore}}</strong></span>
                                      </p>
                                </div>
                              </div>
                          </div>
                      </div>
                      <div class="card-content" ref="tableContent">
                          <div class="table-wrapper" v-bind:class="scrollPosition.isFixed?'fixed-table':''">
                            <div class="table-mask"></div>
                              <el-table
                              ref="simpleTable"
                              :data="tableData"
                              tooltip-effect="dark"
                              stripe
                              class="SiteTable"
                              style="width: 100%"
                              :style="'min-height:'+tableHeight+'px;'"
                              row-key="id">
                                <el-table-column
                                    prop="createname"
                                    align="center"
                                    label="发布人"
                                    width="100">
                                </el-table-column>
                                <el-table-column
                                    prop="title"
                                    label="工单标题"
                                    min-width="200"
                                    >
                                    <template slot-scope="scope">
                                      <div class="order-title" v-on:click="jumpArticle(scope.row.id)">
                                          <span>{{scope.row.title}}</span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="负责人(进度)"
                                    width="140"
                                    >
                                    <template v-if="scope.row.dealusername.indexOf('|')" slot-scope="scope">
                                      <div v-for="item in scope.row.dealusername.split('|')" :key="item.id">{{item}}</div>
                                    </template>
                                    <template v-else>
                                       <div>{{scope.row.dealusername}}</div> 
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="tags"
                                    align="left"
                                    label="标签"
                                    min-width="160"
                                    >
                                    <template #default="scope">
                                      <div class="table-tag">
                                        <el-tag :style="{background:item.color,borderColor:item.color,color:'#ffffff'}" size="small" v-for="(item,index) in scope.row.tagList" v-bind:key="index">{{item.tag}}</el-tag>
                                      </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="score"
                                    label="积分"
                                    width="60"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="commentnumber"
                                    label="评论"
                                    width="60"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="starttime"
                                    sortable
                                    label="开始时间"
                                    width="160"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="endtime"
                                    label="截止时间"
                                    sortable
                                    width="160"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="status"
                                    label="工单状态"
                                    width="90">
                                    <template #default="scope">
                                      <div class="table-tag">
                                          <span class="color5" v-if="scope.row.status == 6&&scope.row.timestatus==2">已完成(<span class="color6">已逾期</span>)</span>
                                          <span class="color6" v-if="scope.row.status!=6&&scope.row.timestatus==2">已逾期</span>
                                          <span class="color7" v-if="scope.row.timestatus!=2&&scope.row.status == 0">已撤销</span>
                                          <span class="color1" v-if="scope.row.timestatus!=2&&scope.row.status == 1">待接单</span>
                                          <span class="color2" v-if="scope.row.timestatus!=2&&scope.row.status == 2">进行中</span>
                                          <span class="color2" v-if="scope.row.timestatus!=2&&scope.row.status == 4">待审核</span>
                                          <span class="color3" v-if="scope.row.timestatus!=2&&scope.row.status == 5">已驳回</span>
                                          <span class="color4" v-if="scope.row.timestatus!=2&&scope.row.status == 6&&scope.row.commentstatus==0">待评价</span>
                                          <span class="color5" v-if="scope.row.timestatus!=2&&scope.row.status == 6&&scope.row.commentstatus!=0">已完成</span>
                                      </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    v-if="(menuButtonPermit.includes('Works_workedit')||menuButtonPermit.includes('Works_workcancel')||menuButtonPermit.includes('Works_workconfirm')||menuButtonPermit.includes('Works_noconfirm')||menuButtonPermit.includes('Works_workdelete'))"
                                    :width="operationsWidth"
                                    align="center"
                                    fixed="right"
                                    prop="operations"
                                    label="操作">
                                    <template #default="scope">
                                      <div class="table-button">
                                          <el-button size="mini" @click="editTableRow(scope.row,scope.$index)" v-if="scope.row.editshow&&menuButtonPermit.includes('Works_workedit')&&scope.row.status==1">编辑</el-button>
                                          <el-button size="mini" @click="cancelTableRow(scope.row,scope.$index)" v-if="scope.row.editshow&&menuButtonPermit.includes('Works_workcancel')&&(scope.row.status==1||scope.row.status==2||scope.row.status==4||scope.row.status==5)">撤销</el-button>
                                          <el-button size="mini" @click="rejectTableRow(scope.row,scope.$index)" v-if="scope.row.editshow&&menuButtonPermit.includes('Works_noconfirm')&&(scope.row.status==4)">驳回</el-button>
                                          <el-button size="mini" @click="confirmTableRow(scope.row,scope.$index)" v-if="scope.row.editshow&&menuButtonPermit.includes('Works_workconfirm')&&(scope.row.status==4)">确认完成</el-button>
                                          <el-button size="mini" @click="commentTableRow(scope.row,scope.$index)" v-if="scope.row.editshow&&menuButtonPermit.includes('Works_addevaluation')&&scope.row.status==6&&scope.row.commentstatus==0">添加评价</el-button>
                                          <el-button size="mini" @click="deleteTableRow(scope.row,scope.$index)" v-if="scope.row.deleteshow&&menuButtonPermit.includes('Works_workdelete')&&(scope.row.status==0||scope.row.status==1)" type="info" plain>删除</el-button>
                                      </div>
                                    </template>
                                </el-table-column>
                              </el-table>
                          </div>
                          <div class="out_box fixed" v-if="scrollPosition.maxScrollWidth>0&&scrollPosition.isPC" :style="'left:'+scrollPosition.left+'px;width:'+scrollPosition.width+'px;bottom:'+scrollPosition.fixedBottom+'px;'" ref="out_box">
                              <div class="in_box" @mousedown="mouseDownHandler" :style="'left:'+scrollPosition.insetLeft+'px;width:'+scrollPosition.insetWidth+'px;'" ref="in_box" ></div>
                          </div>
                      </div>
                      <div v-if="totalDataNum>20" class="pagination-panel" ref="pagePane">
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
      <el-dialog :title="dialogText" v-if="menuButtonPermit.includes('Works_addevaluation')" custom-class="add-edit-dialog" :visible.sync="dialogFormVisible" :before-close="handleClose" width="480px">
        <el-form :model="dialogForm">
          <div class="item-form">
              <el-form-item :label="dialogText=='添加评价'?'评价内容：':'驳回内容：'" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="dialogForm.commentinfo" :autosize="{ minRows: 2, maxRows: 4}" ref="commentinfo"></el-input>
              </el-form-item>
          </div>
          <div class="item-form" v-if="dialogText=='添加评价'">
              <el-form-item label="评价打分：" :label-width="formLabelWidth">
                <el-radio-group v-model="dialogForm.commentstatus">
                  <el-radio :label="1">好评</el-radio>
                  <el-radio :label="2">一般</el-radio>
                  <el-radio :label="3">差评</el-radio>
                </el-radio-group>
              </el-form-item>
          </div>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="saveData">确 定</el-button>
          </span>
        </template>
      </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Works_worklist',
  data() {
    return {
      breadcrumbList:[],
      operationsWidth:"",
      menuButtonPermit:[],
      tableData:[],
      groupScore:[],
      isPageBtn:false,
      tableHeight:"auto",
      dialogFormVisible:false,
      dialogText:"",
      formLabelWidth:"110px",
      noconfirmForm:{
        id:0,
        rejectinfo:"",
      },
      dialogForm:{
        id:0,
        commentinfo:"",
        commentstatus:1,
      },
      tagList:[],
      userList:[],
      statusList:[
        {label:"已撤销",value:7},
        {label:"待接单",value:1},
        {label:"进行中",value:2},
        {label:"待审核",value:4},
        {label:"已驳回",value:5},
        {label:"待评价",value:8},
        {label:"已完成",value:6},
        {label:"已逾期",value:9},
      ],
      searchData:{
        date:[],
        tags:"",
        page:1,
        limit:20,
        tagsid:"",
        uid:'',
        status:'',
      },
      pageSizeList:[20,50,100,200,500],
      pagerCount:5,
      totalDataNum:0,
      pickerRangeOptions: this.$pickerRangeOptions,
      scrollPosition:{
        width:0,
        left:0,
        fixedBottom: 15,
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
      infoData:{
        totalCount:0,
        doingCount:0,
        doneCount:0,
        checkingCount:0,
        overdueCount:0,
      },
      isLoading:null,
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
      // 监听竖向滚动条滚动事件
      window.addEventListener('scroll',this.handleScroll,true);
      this.$nextTick(function () {
        $this.setTableHeight();
      });
      window.onresize = () => {
          return (() => {
            $this.setTableHeight();
          })()
      }
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
    // 设置高度
    setTableHeight(){
      var $this = this;
      $this.tableHeight = 0;      
      var headerHeight = $this.$refs.headerPane.offsetHeight+45;
      var breadcrumbHeight = $this.$refs.breadcrumbPane.offsetHeight;
      var screenHeight = $this.$refs.boxPane.offsetHeight;
      $this.tableHeight = screenHeight-headerHeight-breadcrumbHeight-30;
      $this.getBrowserType();
        setTimeout(function() {
          $this.setScrollDom();
      }, 400);
    },
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
    // 搜索结果
    searchResult(){
      var $this = this;
      $this.loadingFun();
      $this.initPage();
    },
    // 重置表单
    resetData(){
        var $this = this;
        $this.searchData.date=[];
        $this.searchData.page=1;
        $this.searchData.limit=20;
        $this.searchData.tagsid='';
        $this.searchData.uid='';
        $this.searchData.status='';
        $this.searchResult();
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.loadingFun();
      $this.getUserMenuButtonPermit();
    },
    // 初始化页面信息
    initPage(){
      var $this =this;
      if(!$this.isDisabled){
        $this.isDisabled=true;
        var searchData = $this.initSearchData();
        document.getElementsByClassName("scroll-panel")[0].scrollTop = 0;
        $this.$store.dispatch('works/workOrderListAction', searchData).then(response=>{
          if(response){
            if(response.status){
              response.data.forEach(function(item,index){
                item.tagList = [];
                if(item.tags&&item.tags != ""){
                  if(item.tags.indexOf("|")!=-1){
                    var tagArr = item.tags.split("|");
                    tagArr.forEach(function(item1,index1){
                      var itemData = {};
                      if(item1.indexOf("-")!=-1){
                        itemData.tag = item1.split("-")[0];
                        itemData.color = item1.split("-")[1];
                      }else{
                        itemData.tag = item1;
                        itemData.color = "#1b3f75";
                      }
                      item.tagList.push(itemData);
                    });
                  }else{
                    var itemData = {};
                    if(item.tags.indexOf("-")!=-1){
                      itemData.tag = item.tags.split("-")[0];
                      itemData.color = item.tags.split("-")[1];
                    }else{
                      itemData.tag = item.tags;
                      itemData.color = "#1b3f75";
                    }
                    item.tagList.push(itemData);
                  }
                }
              });
              $this.groupScore=response.departscore;
              $this.tableData = response.data;
              $this.totalDataNum = response.allcount;
              var infoData = {};
              infoData.totalCount = response.allcount;
              infoData.doingCount = response.workincount;
              infoData.doneCount = response.hasfinishcount;
              infoData.checkingCount = response.waitcheckcount;
              infoData.overdueCount = response.hasouttimecount;
              $this.infoData = infoData;
              $this.isLoading.close();
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
    // 组装搜索接口所需数据
    initSearchData(){
      var $this = this;
      var searchData = {};
      searchData.page = $this.isPageBtn?$this.searchData.page:1;
      if(!this.isPageBtn){
        $this.searchData.page = 1
      }
      $this.isPageBtn = false;
      searchData.limit = $this.searchData.limit;
      searchData.uid = $this.searchData.uid;
      searchData.status = $this.searchData.status;
      if($this.searchData.tagsid>0){
        searchData.tagsid = $this.searchData.tagsid;
        searchData.tags = "";
      }else{
        searchData.tagsid = "";
        searchData.tags = $this.searchData.tagsid;
      }
      if($this.searchData.date&&$this.searchData.date.length>0){
        searchData.starttime = $this.searchData.date[0];
        searchData.endtime = $this.searchData.date[1];
      }else{
        searchData.starttime = "";
        searchData.endtime = "";
      }
      return searchData;
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
            if($this.menuButtonPermit.includes('Works_worklist')){
              var operationsWidth = 22;
              if($this.menuButtonPermit.includes('Works_workedit')){
                operationsWidth+=66;
              }
              if($this.menuButtonPermit.includes('Works_workcancel')){
                operationsWidth+=66;
              }
              if($this.menuButtonPermit.includes('Works_workconfirm')){
                operationsWidth+=90;
              }
              if($this.menuButtonPermit.includes('Works_noconfirm')){
                operationsWidth+=66;
              }
              if($this.menuButtonPermit.includes('Works_workdelete')){
                operationsWidth+=66;
              }
              $this.operationsWidth = "" + operationsWidth;
              $this.getUserData();
            }else{
              $this.$message({
                showClose: true,
                message: "未被分配该页面的访问权限",
                type: 'error',
                  duration:6000
              });
              $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
            }
          }else{
            $this.$message({
              showClose: true,
              message: "未被分配该页面的访问权限",
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
    // 跳转到详情
    jumpArticle(id){
      var $this = this;
      var routeUrl =  $this.$router.resolve({path:'/Works/workInfo',query:{ID:id}});
      window.open(routeUrl.href,'_blank');
    },
    // 跳转到统计
    jumpStatPage(){
      var $this = this;
      var routeUrl =  $this.$router.resolve({path:'/Works/statData'});
      window.open(routeUrl.href,'_blank');
    },
    // 编辑表格行数据
    editTableRow(row,index){
      var $this = this;
      var routeUrl =  $this.$router.resolve({path:'/Works/addEdit',query:{ID:row.id}});
      window.open(routeUrl.href,'_blank');
    },
    // 驳回表格行
    rejectTableRow(row,index){
      var $this = this;
      $this.noconfirmData();
      $this.dialogFormVisible = true;
      $this.dialogText = "驳回原因";
      $this.noconfirmForm.id = row.id;
    },
    noconfirmData(){
      var $this = this;
      $this.noconfirmForm.id = 0;
      $this.noconfirmForm.rejectinfo = "";
      $this.dialogForm.commentinfo = "";
    },
    // 确认表格行
    confirmTableRow(row,index){
      var $this = this;
      $this.$confirm('是否确认该工单已完成?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          $this.$store.dispatch('works/workOrderConfirmAction', {id:row.id}).then(response=>{
            if(response.status){
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'success'
              });
              $this.initPage();
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
    // 撤销表格行
    cancelTableRow(row,index){
      var $this = this;
      $this.$confirm('是否确认撤销该工单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          $this.$store.dispatch('works/workOrderCancelAction', {id:row.id}).then(response=>{
            if(response.status){
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'success'
              });
              $this.initPage();
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
    // 删除表格行
    deleteTableRow(row,index){
      var $this = this;
      $this.$confirm('此操作将永久删除该工单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          $this.$store.dispatch('works/workOrderDeleteAction', {id:row.id}).then(response=>{
            if(response.status){
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'success'
              });
              $this.initPage();
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
    // 获取发布人数据
    getUserData(){
      var $this = this;
      $this.$store.dispatch('works/issuerListAction', null).then(response=>{
        if(response){
          if(response.status){
            var userList = [];
            response.data.forEach(function(item,index){
              var itemData = {};
              itemData.label= item.name+"["+item.id+"]";
              itemData.value = item.id;
              userList.push(itemData);
            });
            $this.userList = userList;
            $this.getTagData();
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
    // 获取系统标签数据
    getTagData(){
      var $this = this;
      $this.$store.dispatch('works/tagListAction', null).then(response=>{
        if(response){
          if(response.status){
            var tagList = [];
            response.data.forEach(function(item,index){
              var itemData = {};
              itemData.label= item.name;
              itemData.value = item.id==0?item.name:item.id;
              tagList.push(itemData);
            });
            $this.tagList = tagList;
            $this.initPage();
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
    // 每页显示条数改变事件
    handleSizeChange(val) {
      this.searchData.limit = val;
      this.page = 1;
      this.initPage();
    },
    // 当前页改变事件
    handleCurrentChange(val) {
      this.searchData.page = val;
      this.isPageBtn = true;
      this.initPage();
    },
    // 添加表格行数据
    commentTableRow(row,index){
      var $this = this;
      $this.resetFormData();
      $this.dialogFormVisible = true;
      $this.dialogForm.id = row.id;
      $this.dialogText = "添加评价";
    },
    resetFormData(){
      var $this = this;
      $this.dialogForm.id = 0;
      $this.dialogForm.commentinfo = "";
      $this.dialogForm.commentstatus = 1;
    },
    // 关闭弹窗
    handleClose(){
      var $this = this;
      $this.dialogFormVisible = false;
    },
    // 保存评价
    saveData(){
      var $this = this;
      var pathUrl = "";
      var pathformData = "";
      if($this.dialogText == "添加评价"){
          pathUrl = "works/workOrderEvaluateSaveAction";
          pathformData=$this.dialogForm;
      }
      if($this.dialogText == "驳回原因"){
          pathUrl = "works/workOrderRejectedAction";
          $this.noconfirmForm.rejectinfo = $this.dialogForm.commentinfo;
          pathformData=$this.noconfirmForm;
      }
      $this.$store.dispatch(pathUrl, pathformData).then(response=>{
        if(response){
          if(response.status){
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'success'
            });
            $this.handleClose();
            $this.initPage();
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
         $this.scrollTable.fixedTopHeight = $this.$refs.headerPane.offsetHeight+$this.$refs.breadcrumbPane.offsetHeight+15;
      }else{
         $this.scrollTable.fixedTopHeight=$this.$refs.breadcrumbPane.offsetHeight+15;
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
      $this.scrollTable.tableBottom = tableObj.height+$this.scrollTable.fixedTopHeight+$this.scrollTable.tableheaderHeight+60+15;
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
        $this.scrollTable.tableBottom = tableObj.height+$this.scrollTable.fixedTopHeight+60+15;
      }
      // 视窗宽高改变时需要设置默认滚动条的位置
      if($this.totalDataNum>20){
        var scrTop = $this.$refs.scrollDom.scrollTop;
        if(scrTop+$this.scrollTable.clientHeight-60>=$this.scrollTable.tableBottom-60-15){
          $this.scrollPosition.fixedBottom = scrTop+$this.scrollTable.clientHeight-$this.scrollTable.tableBottom-30;
        }else{
          $this.scrollPosition.fixedBottom = 15;
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
        if($this.totalDataNum>20){
          if(scrTop+$this.scrollTable.clientHeight-60>=$this.scrollTable.tableBottom-60-15){
            $this.scrollPosition.fixedBottom = scrTop+$this.scrollTable.clientHeight-$this.scrollTable.tableBottom-30;
          }else{
            $this.scrollPosition.fixedBottom = 15;
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
