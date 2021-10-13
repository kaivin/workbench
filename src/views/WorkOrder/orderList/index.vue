<template>
    <div class="page-root flex-box no-padding work-order-index" ref="boxPane">
        <div class="sub-router">
            <el-scrollbar wrap-class="scrollbar-wrapper">
                <ul class="sub-router-list">
                    <li v-if="menuButtonPermit.includes('Worksaccpet_waitwork')" v-bind:class="currentStatus === 'receive'?'active':''" v-on:click="jumpLink('receive')"><span>待接收</span><b>({{defaultData.receiveNum}})</b></li>
                    <li v-if="menuButtonPermit.includes('Worksaccpet_waitdealwork')" v-bind:class="currentStatus === 'allot'?'active':''" v-on:click="jumpLink('allot')"><span>待分配</span><b>({{defaultData.allotNum}})</b></li>
                    <li v-if="menuButtonPermit.includes('Worksaccpet_allwork')" v-bind:class="currentStatus === 'alloted'?'active':''" v-on:click="jumpLink('alloted')"><span>所有已分配</span><b>({{defaultData.allotedNum}})</b></li>
                    <li v-if="menuButtonPermit.includes('Worksaccpet_personwork')" v-bind:class="currentStatus === 'person'?'active':''" v-on:click="jumpLink('person')" style="margin-top:32px;"><span>个人已分配</span><b>({{defaultData.personNum}})</b></li>
                    <li v-if="menuButtonPermit.includes('Worksaccpet_makeingwork')" v-bind:class="currentStatus === 'doing'?'active':''" v-on:click="jumpLink('doing')"><span>进行中</span><b>({{defaultData.doingNum}})</b></li>
                    <li v-if="menuButtonPermit.includes('Worksaccpet_hasfinish')" v-bind:class="currentStatus === 'done'?'active':''" v-on:click="jumpLink('done')"><span>已完成</span><b>({{defaultData.doneNum}})</b></li>
                    <li v-if="menuButtonPermit.includes('Worksaccpet_workcount')" v-bind:class="currentStatus === 'stat'?'active':''" v-on:click="jumpLink('stat')" style="margin-top:32px;"><span>数据统计</span></li>
                </ul>
            </el-scrollbar>
        </div>
        <div class="flex-content relative">
            <div class="abs-panel" ref="mainPane">
                <div class="scroll-panel" ref="scrollDom" style="will-change:scroll-position">
                  <div class="true-height" ref="scrollPane">
                    <p class="breadcrumb" ref="breadcrumbPane">
                      <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
                      <template v-for="item in breadcrumbList">
                        <router-link class="breadcrumb-link" :to="item.router+'?Status=person'" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
                        <span class="breadcrumb-link" v-bind:key="item.id" v-else><b>-</b><span>{{item.title}}</span></span>
                      </template>
                        <span class="breadcrumb-link"><b>-</b>{{breadcrumbName}}</span>
                    </p>
                    <el-card class="box-card scroll-card" shadow="hover">
                        <div slot="header" v-if="currentStatus=='person'||currentStatus=='alloted'||currentStatus=='doing'||currentStatus=='done'||currentStatus=='stat'">
                            <div class="card-header" ref="headerPane">
                                <div class="search-wrap">
                                    <div class="item-search" style="width:150px;" v-if="currentStatus!='stat'">
                                        <el-select v-model="searchData.timetype" size="small" clearable placeholder="请选择时间类型">
                                            <el-option
                                                v-for="item in timeTypeList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </div>
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
                                          :picker-options="pickerRangeOptions">
                                      </el-date-picker>
                                    </div>
                                    <div class="item-search" style="width: 110px;" v-if="currentStatus === 'alloted'">
                                      <el-select v-model="searchData.workstatus" size="small" clearable placeholder="工单状态">
                                          <el-option
                                              v-for="item in statusList"
                                              :key="item.value"
                                              :label="item.label"
                                              :value="item.value">
                                          </el-option>
                                      </el-select>
                                    </div>
                                    <div class="item-search" style="width: 120px;" v-if="currentStatus === 'alloted'">
                                      <el-select v-model="searchData.dealuserid" size="small" filterable clearable placeholder="负责人">
                                          <el-option
                                              v-for="item in userList"
                                              :key="item.value"
                                              :label="item.label"
                                              :value="item.value">
                                          </el-option>
                                      </el-select>
                                    </div>
                                    <div class="item-search">
                                        <el-button class="item-input" :class="isDisabled?'isDisabled':''" :disabled="isDisabled" size="small" type="primary" icon="el-icon-search" @click="searchResult">查询</el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-content" ref="tableContent">
                            <div class="table-wrapper" v-bind:class="scrollPosition.isFixed?'fixed-table':''">
                                  <div class="table-mask"></div>
                                  <el-table
                                      ref="simpleTable"
                                      key="a"
                                      :data="tableData"
                                      tooltip-effect="dark"
                                      stripe
                                      class="SiteTable"
                                      style="width: 100%"
                                      :style="'min-height:'+minHeight+'px;'"
                                      row-key="id"
                                      v-if="currentStatus=='stat'"
                                      >
                                      <el-table-column
                                          prop="name"
                                          label="姓名"
                                          width="100">
                                      </el-table-column>
                                      <el-table-column
                                          prop="depart"
                                          align="left"
                                          label="部门"
                                          width="160"
                                          >
                                      </el-table-column>
                                      <el-table-column
                                          prop="departgroup"
                                          align="left"
                                          label="小组"
                                          min-width="160"
                                          >
                                      </el-table-column>
                                      <el-table-column
                                          prop="workingcount"
                                          label="进行中工单数"
                                          width="150"
                                          >
                                      </el-table-column>
                                      <el-table-column
                                          prop="finishcount"
                                          label="已完成工单数"
                                          width="150"
                                          >
                                      </el-table-column>
                                      <el-table-column
                                          prop="outtimecount"
                                          label="已逾期工单数"
                                          width="150"
                                          >
                                      </el-table-column>
                                      <el-table-column
                                          prop="allcount"
                                          label="总工单数"
                                          width="150"
                                          >
                                      </el-table-column>
                                      <el-table-column
                                          prop="hasscore"
                                          label="已获得积分"
                                          width="120"
                                          >
                                      </el-table-column>
                                      <el-table-column
                                          prop="monthscore"
                                          label="本月已获得积分"
                                          width="120"
                                          >
                                      </el-table-column>
                                      <el-table-column
                                          prop="allscorre"
                                          label="总积分"
                                          width="120"
                                          >
                                      </el-table-column>
                                  </el-table>
                                  <el-table
                                      ref="simpleTable"
                                      key="b"
                                      :data="tableData"
                                      tooltip-effect="dark"
                                      stripe
                                      class="SiteTable"
                                      style="width: 100%"
                                      :style="'min-height:'+minHeight+'px;'"
                                      row-key="id"
                                      v-else
                                      >
                                      <el-table-column
                                          prop="username"
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
                                          prop="tags"
                                          align="left"
                                          label="标签"
                                          width="160"
                                          >
                                          <template #default="scope">
                                              <div class="table-tag">
                                              <el-tag :style="{background:item.color,borderColor:item.color,color:'#ffffff'}" size="small" v-for="(item,index) in scope.row.tagList" v-bind:key="index">{{item.tag}}</el-tag>
                                              </div>
                                          </template>
                                      </el-table-column>
                                      <el-table-column
                                          prop="addtime"
                                          label="开始时间"
                                          width="150"
                                          >
                                      </el-table-column>
                                      <el-table-column
                                          prop="endtime"
                                          label="截止时间"
                                          width="150"
                                          >
                                      </el-table-column>
                                      <el-table-column
                                          prop="status"
                                          label="工单状态"
                                          width="80"
                                          >
                                          <template #default="scope">
                                            <div class="table-tag">
                                              <span class="color6" v-if="scope.row.timestatus==2||scope.row.worktimestatus==2">已逾期</span>
                                              <span class="color1" v-if="scope.row.worktimestatus!=2&&currentStatus == 'receive'">待接单</span>
                                              <span class="color1" v-if="scope.row.worktimestatus!=2&&currentStatus == 'allot'">待分配</span>
                                              <span class="color2" v-if="scope.row.worktimestatus!=2&&currentStatus!='allot'&&currentStatus!='receive'&&scope.row.workstatus==0">进行中</span>
                                              <span class="color2" v-if="scope.row.worktimestatus!=2&&currentStatus!='allot'&&currentStatus!='receive'&&scope.row.workstatus==1">待审核</span>
                                              <span class="color3" v-if="scope.row.worktimestatus!=2&&currentStatus!='allot'&&currentStatus!='receive'&&scope.row.workstatus==2">已驳回</span>
                                              <span class="color4" v-if="scope.row.worktimestatus!=2&&currentStatus!='allot'&&currentStatus!='receive'&&scope.row.workstatus==3&&scope.row.commentstatus==0">待评价</span>
                                              <span class="color5" v-if="scope.row.worktimestatus!=2&&currentStatus!='allot'&&currentStatus!='receive'&&scope.row.workstatus==3&&scope.row.commentstatus!=0">已完成</span>
                                            </div>
                                          </template>
                                      </el-table-column>
                                      <el-table-column
                                          prop="orgscore"
                                          label="总积分"
                                          width="80"
                                          >
                                      </el-table-column>
                                      <el-table-column
                                          prop="receivescore"
                                          label="已认领积分"
                                          width="100"
                                          >
                                          <template slot-scope="scope">
                                              <span>{{currentStatus=='receive'?scope.row.receivescore:scope.row.score}}</span>
                                          </template>
                                      </el-table-column>
                                      <el-table-column
                                          v-if="currentStatus=='receive'"
                                          prop="ownScore"
                                          label="认领积分"
                                          width="90">
                                          <template slot-scope="scope">
                                              <div class="table-input">
                                                  <el-input size="small" v-model="scope.row.ownScore"></el-input>
                                              </div>
                                          </template>
                                      </el-table-column>
                                      <el-table-column
                                          v-if="currentStatus!='receive'"
                                          prop="ownScore"
                                          label="负责人"
                                          width="120">
                                          <template slot-scope="scope">
                                              <div class="table-input">
                                                  <el-select v-model="scope.row.dealuserid" size="small" :disabled="currentStatus!='allot'" clearable placeholder="负责人">
                                                    <el-option
                                                        v-for="item in userList"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value">
                                                    </el-option>
                                                </el-select>
                                              </div>
                                          </template>
                                      </el-table-column>
                                      <el-table-column
                                          v-if="(menuButtonPermit.includes('Worksaccpet_confirmwork')||menuButtonPermit.includes('Worksaccpet_confirmdeal')||menuButtonPermit.includes('Worksaccpet_backwork')||menuButtonPermit.includes('Worksaccpet_confirmfinish')||menuButtonPermit.includes('Worksaccpet_workcancel'))&&(currentStatus=='receive'||currentStatus=='allot'||currentStatus=='alloted'||currentStatus=='person'||currentStatus=='doing')"
                                          :width="operationsWidth"
                                          align="center"
                                          fixed="right"
                                          prop="operations"
                                          label="操作">
                                          <template #default="scope">
                                            <div class="table-button">
                                                <el-button size="mini" @click="receiveTableRow(scope.row,scope.$index)" v-if="currentStatus=='receive'&&menuButtonPermit.includes('Worksaccpet_confirmwork')">认领工单</el-button>
                                                <el-button size="mini" @click="cancelTableRow(scope.row,scope.$index)" v-if="currentStatus!='receive'&&(scope.row.workstatus!=1&&scope.row.workstatus!=3)&&menuButtonPermit.includes('Worksaccpet_backwork')">工单退回</el-button>
                                                <el-button size="mini" @click="confirmAllotTableRow(scope.row,scope.$index)" v-if="currentStatus=='allot'&&menuButtonPermit.includes('Worksaccpet_confirmdeal')">确认分配</el-button>
                                                <el-button size="mini" @click="confirmDoneTableRow(scope.row,scope.$index)" v-if="(currentStatus=='alloted'||currentStatus=='person'||currentStatus=='doing')&&scope.row.workstatus!=1&&scope.row.workstatus!=3&&(scope.row.status==2||scope.row.status==5)&&menuButtonPermit.includes('Worksaccpet_confirmfinish')">提交审核</el-button>
                                                <el-button size="mini" @click="undoTableRow(scope.row,scope.$index)" v-if="(currentStatus=='alloted'||currentStatus=='person'||currentStatus=='doing')&&(scope.row.workstatus!=1&&scope.row.workstatus!=3)&&menuButtonPermit.includes('Worksaccpet_workcancel')">撤销分配</el-button>
                                            </div>
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
                                :layout="'total, sizes, prev, pager, next, jumper'"
                                :total="totalDataNum">
                            </el-pagination>
                        </div>
                    </el-card>
                  </div>
                  <el-backtop target=".scroll-panel"></el-backtop>
                </div>
            </div>
            <el-backtop target=".scroll-panel"></el-backtop>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { isNumber } from '@/utils/validate';
export default {
  name: 'WorkOrder_orderList',
  data() {
    return {
        breadcrumbList:[],
        breadcrumbName:'个人已分配',
        operationsWidth:"",
        currentStatus:"person",
        status:1,
        menuButtonPermit:[],
        minHeight:"auto",
        tableData:[],
        statData:[],
        page:1,
        limit:50,
        pageSizeList:[50, 100, 150, 200],
        totalDataNum:0,
        userList:[],
        searchData:{
            date:[],
            timetype:"",
            dealuserid:'',
            workstatus:'',
        },
        timeTypeList:[
          {label:"按接单时间",value:2},
          {label:"按分配时间",value:1},
        ],
        statusList:[
          {label:"进行中",value:5},
          {label:"待审核",value:1},
          {label:"已驳回",value:2},
          {label:"已完成",value:3},
          {label:"已逾期",value:4},
        ],
        defaultData:{
          receiveNum:0,
          allotedNum:0,
          allotNum:0,
          personNum:0,
          doingNum:0,
          doneNum:0,
        },
        selectedData:[],
        permitStatus:[],
        pickerRangeOptions: {
          shortcuts: [{
            text: '最近一旬',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 9);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
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
        isLoading:null,
        isDisabled:false,
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
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
    window.addEventListener('scroll',$this.handleScroll,true);
    $this.$nextTick(function () {
        this.setHeight();
    });
    window.onresize = () => {
        return (() => {
            this.setHeight();
        })()
    }
  },
  watch: {
    minHeight(val) {
      if (!this.timer) {
        this.minHeight = val
        this.timer = true
        const $this = this
        setTimeout(function() {
          $this.timer = false
        }, 400)
      }
    },
    //监听相同路由下参数变化的时候，从而实现异步刷新
    '$route'(to,from) {
        var $this = this;
        $this.initData();
    },
    isOpen(e){
      this.setHeight();
    },
  },
  updated(){
    var $this = this;
    $this.$nextTick(() => {
      $this.$refs.simpleTable.doLayout();
    });
  },
  created(){
    var $this = this;
    $this.getBreadcrumbList();
    $this.initData();
  },
  destroyed(){
    window.removeEventListener('scroll', this.handleScroll,true);//监听页面滚动事件
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
    setHeight(){
      var $this = this;
      $this.minHeight = 0;
      var breadcrumbHeight = $this.$refs.breadcrumbPane.offsetHeight;
      var screenHeight = $this.$refs.boxPane.offsetHeight;
      if($this.$refs.headerPane){
        var headerHeight = $this.$refs.headerPane.offsetHeight+45;
        $this.minHeight = screenHeight-headerHeight-breadcrumbHeight-30;
      }else{
        $this.minHeight = screenHeight-breadcrumbHeight-30;
      } 
      $this.getBrowserType();
        setTimeout(function() {
          $this.setScrollDom();
      }, 400);
    },
    // 搜索结果
    searchResult(){
      var $this = this;
      if(!$this.isDisabled){
        $this.isDisabled=true;
        $this.loadingFun();
        $this.getCurrentStatusData();
      }
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.loadingFun();
      $this.getUserMenuButtonPermit();
    },
    // 获取当前状态分类的数据
    getCurrentStatusData(){
      var $this = this;
      var searchData = {};
      var pathUrl = "";
      if($this.currentStatus==="receive"){
        pathUrl = "worksaccpet/receiveWorkOrderDataAction";
      }else if($this.currentStatus==="allot"){
        pathUrl = "worksaccpet/allotWorkOrderDataAction";
      }else if($this.currentStatus==="alloted"){
        pathUrl = "worksaccpet/allotedWorkOrderDataAction";
      }else if($this.currentStatus==="person"){
        pathUrl = "worksaccpet/personWorkOrderDataAction";
      }else if($this.currentStatus==="doing"){
        pathUrl = "worksaccpet/doingWorkOrderDataAction";
      }else if($this.currentStatus==="done"){
        pathUrl = "worksaccpet/doneWorkOrderDataAction";
      }else{
        pathUrl = "worksaccpet/statWorkOrderDataAction";
      }
      if($this.currentStatus==="alloted"||$this.currentStatus==="person"||$this.currentStatus==="doing"||$this.currentStatus==="done"){
        searchData.page = $this.page;
        searchData.limit = $this.limit;
        searchData.timetype = $this.searchData.timetype;
        if($this.searchData.date&&$this.searchData.date.length>0){
            searchData.starttime = $this.searchData.date[0];
            searchData.endtime = $this.searchData.date[1];
        }else{
            searchData.starttime = "";
            searchData.endtime = "";
        }
        if($this.currentStatus==="alloted"){
          searchData.dealuserid = $this.searchData.dealuserid;
          searchData.workstatus = $this.searchData.workstatus;
        }
      }else if($this.currentStatus==="stat"){
        if($this.searchData.date&&$this.searchData.date.length>0){
            searchData.starttime = $this.searchData.date[0];
            searchData.endtime = $this.searchData.date[1];
        }else{
            searchData.starttime = "";
            searchData.endtime = "";
        }
      }else{
          searchData = null
      }      
      document.getElementsByClassName("scroll-panel")[0].scrollTop = 0;
      $this.$store.dispatch(pathUrl, searchData).then(response=>{
        if(response){
          if(response.status){
            var tableData = response.data;
            if($this.currentStatus==="stat"){
            }else{
              tableData.forEach(function(item,index){
                item.ownScore = "";
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
                if($this.currentStatus == "allot"){
                  if(item.dealuserid == 0){
                    item.dealuserid = "";
                  }
                }
              });
              if($this.currentStatus==="alloted"||$this.currentStatus==="person"||$this.currentStatus==="doing"||$this.currentStatus==="done"){
                  $this.totalDataNum = response.allcount;
              }else{
                  $this.totalDataNum = 0;
              }
            }
            $this.tableData = tableData;
            $this.isLoading.close();
            setTimeout(()=>{
              $this.isDisabled=false;
            },1000);
            $this.$nextTick(()=>{
              $this.setHeight();
            });
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
        }else{
          setTimeout(()=>{
            $this.isDisabled=false;
          },1000);
        }
      });
    },
    // 初始化页面信息
    initPage(){
      var $this = this;   
      if($this.currentStatus=="receive"){
        $this.breadcrumbName='待接收';
      }
      if($this.currentStatus=="allot"){
        $this.breadcrumbName='待分配';
      }
      if($this.currentStatus=="alloted"){
        $this.breadcrumbName='所有已分配';
      }
      if($this.currentStatus=="person"){
        $this.breadcrumbName='个人已分配';
      }
      if($this.currentStatus=="doing"){
        $this.breadcrumbName='进行中';
      }
      if($this.currentStatus=="done"){
        $this.breadcrumbName='已完成';
      }
      if($this.currentStatus=="stat"){
        $this.breadcrumbName='数据统计';
      }
      $this.$store.dispatch('worksaccpet/workOrderPublicDataAction', null).then(response=>{
        if(response){
          if(response.status){
            $this.defaultData.receiveNum = response.waitcount;
            $this.defaultData.allotNum = response.waitdealcount;
            $this.defaultData.allotedNum = response.hasdealcount;
            $this.defaultData.personNum = response.personcount;
            $this.defaultData.doingNum = response.makeingcount;
            $this.defaultData.doneNum = response.hasfinishcount;
            if($this.currentStatus!="receive"&&$this.currentStatus!="stat"){
              $this.getWorkOrderUser();
            }else{
              $this.getCurrentStatusData();
            }
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
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.status){
          if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
              if(item.action_route=="Worksaccpet_waitwork"){
                $this.permitStatus.push("receive");
              }
              if(item.action_route=="Worksaccpet_waitdealwork"){
                $this.permitStatus.push("allot");
              }
              if(item.action_route=="Worksaccpet_allwork"){
                $this.permitStatus.push("alloted");
              }
              if(item.action_route=="Worksaccpet_personwork"){
                $this.permitStatus.push("person");
              }
              if(item.action_route=="Worksaccpet_makeingwork"){
                $this.permitStatus.push("doing");
              }
              if(item.action_route=="Worksaccpet_hasfinish"){
                $this.permitStatus.push("done");
              }
              if(item.action_route=="Worksaccpet_workcount"){
                $this.permitStatus.push("stat");
              }
            });
            if($this.menuButtonPermit.includes('Worksaccpet_commoncount')&&$this.menuButtonPermit.includes('WorkOrder_orderList')&&$this.permitStatus.length>0){
              if($this.$route.query.Status){
                if($this.permitStatus.includes($this.$route.query.Status)){
                  $this.currentStatus = $this.$route.query.Status;
                  var operationsWidth = 22;
                  if($this.currentStatus=="receive"){
                    if($this.menuButtonPermit.includes('Worksaccpet_confirmwork')){
                        operationsWidth+=90;
                    }
                  }else if($this.currentStatus=="allot"){
                    if($this.menuButtonPermit.includes('Worksaccpet_backwork')){
                        operationsWidth+=90;
                    }
                    if($this.menuButtonPermit.includes('Worksaccpet_confirmdeal')){
                        operationsWidth+=90;
                    }
                  }else if($this.currentStatus=="alloted"||$this.currentStatus=="person"||$this.currentStatus=="doing"){
                    if($this.menuButtonPermit.includes('Worksaccpet_backwork')){
                        operationsWidth+=90;
                    }
                    if($this.menuButtonPermit.includes('Worksaccpet_confirmfinish')){
                        operationsWidth+=90;
                    }
                    if($this.menuButtonPermit.includes('Worksaccpet_workcancel')){
                        operationsWidth+=90;
                    }
                  }
                  $this.operationsWidth = "" + operationsWidth;
                  $this.initPage();
                }else{
                  $this.$router.push({path:'/WorkOrder/orderList',query:{Status:$this.permitStatus[0]}});
                }
              }else{
                  $this.$message({
                      showClose: true,
                      message: "未找到对应页面或页面缺失参数",
                      type: 'error',
                      duration:6000
                  });
                  $this.$router.push({path:`/404?redirect=${$this.$router.currentRoute.fullPath}`});
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
    // 每页显示条数改变事件
    handleSizeChange(val) {
      this.limit = val;
      this.page = 1;
      this.getCurrentStatusData();
    },
    // 当前页改变事件
    handleCurrentChange(val) {
      this.page = val;
      this.getCurrentStatusData();
    },
    // 跳转到详情
    jumpArticle(id){
      var $this = this;
      var routeUrl =  $this.$router.resolve({path:'/WorkOrder/workInfo',query:{ID:id,Status:$this.currentStatus}});
      window.open(routeUrl.href,'_blank');
    },
    // 页面自跳转
    jumpLink(status){
        var $this = this;
        $this.resetSearchData();
        if($this.currentStatus==status){
          $this.initPage();
        }else{
          $this.$router.push({path:'/WorkOrder/orderList',query:{Status:status}});
        }
    },
    // 工单退回
    cancelTableRow(row,index){
      var $this = this;
      var resultData = {};
      resultData.id = row.id;
      $this.$confirm('是否确认退回工单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        $this.$store.dispatch('worksaccpet/backWorkOrderAction', resultData).then(response=>{
            if(response){
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
            }
        });
      }).catch(() => {
          $this.$message({
            type: 'info',
            message: '已取消'
          });          
      });
    },
    // 认领工单
    receiveTableRow(row,index){
        var $this = this;
        if(row.ownScore==""){
            $this.$message({
                showClose: true,
                message: '错误：认领积分不能为空！',
                type: 'error'
            });
            return false;
        }
        if(!isNumber(row.ownScore)){
            $this.$message({
                showClose: true,
                message: '错误：认领积分只能输入数字！',
                type: 'error'
            });
            return false;
        }
        var resultData = {};
        resultData.work_id = row.id;
        resultData.score = row.ownScore;
        $this.$store.dispatch('worksaccpet/receiveWorkOrderAction', resultData).then(response=>{
            if(response){
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
            }
        });
    },
    // 确认分配工单
    confirmAllotTableRow(row,index){
      var $this = this;
      if(row.dealuserid==""){
          $this.$message({
              showClose: true,
              message: '错误：请先分配具体负责人！',
              type: 'error'
          });
          return false;
      }
      var resultData = {};
      resultData.ids = [row.id];
      resultData.dealuserid = row.dealuserid;
      $this.$store.dispatch('worksaccpet/confirmWorkOrderAction', resultData).then(response=>{
          if(response){
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
          }
      });
    },
    // 撤销分配
    undoTableRow(row,index){
      var $this = this;
      var resultData = {};
      resultData.ids = [row.id];
      $this.$confirm('是否确认撤销分配?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        $this.$store.dispatch('worksaccpet/undoWorkOrderAction', resultData).then(response=>{
            if(response){
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
            }
        });
      }).catch(() => {
          $this.$message({
            type: 'info',
            message: '已取消'
          });          
      });
    },
    // 提交审核
    confirmDoneTableRow(row,index){
      var $this = this;
      $this.$store.dispatch('worksaccpet/confirmDoneWorkOrderAction', {id:row.id}).then(response=>{
          if(response){
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
          }
      });
    },
    // 重置搜索条件
    resetSearchData(){
      var $this = this;
      $this.searchData.date = [];
      $this.searchData.timetype = "";
      $this.page = 1;
      $this.limit = 50;
    },
    // 获取工单具体负责人数据
    getWorkOrderUser(){
      var $this = this;
      $this.$store.dispatch('worksaccpet/workOrderUserListAction', null).then(response=>{
        if(response){
          if(response.status){
            var userList = [];
            response.data.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              userList.push(itemData);
            });
            $this.userList = userList;
            $this.getCurrentStatusData();
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
      if($this.totalDataNum>50){
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
        if($this.totalDataNum>50){
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
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
