<template>
  <div class="page-root scroll-panel group-index" ref="boxPane">
    <div class="abs-panel" ref="mainPane">
      <div class="scroll-panel" ref="scrollDom" style="will-change:scroll-position">
        <div class="true-height" ref="scrollPane">
          <p class="breadcrumb" ref="breadcrumbPane">
            <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
            <template v-for="item in breadcrumbList">
              <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
              <span v-else class="breadcrumb-link" v-bind:key="'last-' + item.id"><b>-</b><span>{{item.title}}</span></span>
            </template>
          </p>
          <div class="filter-panel" ref="headerPane">
            <div class="filter-list">
              <div class="item-search">
                <el-select v-model="searchData.start_num" size="small" clearable placeholder="请选择开始日期" class="select-panel">
                    <el-option
                        v-for="item in timeList"
                        :key="item.num"
                        :label="item.addtime"
                        :value="item.num">
                    </el-option>
                </el-select>
                <el-select style="margin-left: 10px;" v-model="searchData.end_num" size="small" clearable placeholder="请选择结束日期" class="select-panel">
                    <el-option
                        v-for="item in timeList"
                        :key="item.num"
                        :label="item.addtime"
                        :value="item.num">
                    </el-option>
                </el-select>
                <el-button class="search_btn" type="primary" size="small" :disabled="isSearchData" @click="getDouyinCountData">查询</el-button>
                <el-button type="info" class="resetBtn" size="small" v-on:click="resetData()">重置</el-button>
              </div>
            </div>
          </div>
          <!-- <div class="chartShow result-panel">
              <div class="search" v-if="isSearchData"><p>请稍候...</p></div>
              <div class="search" v-if="noData"><p>暂无数据</p></div>
              <div id="chart"></div>
          </div> -->
          <div class="dealRankMain">
            <div class="dealRankMainItem">  
              <div class="dealRankMainBox">   
                <div class="card-content" ref="tableContent">
                  <div class="table-wrapper" v-bind:class="scrollPosition.isFixed?'fixed-table':''">
                      <div class="table-mask"></div>
                      <el-table
                        ref="simpleTable"
                        :data="scorelist"
                        tooltip-effect="dark"
                        class="SiteTable userCount"
                        style="width: 100%"
                        :style="'min-height:'+tableHeight+'px;'"
                        row-key="id"
                        :span-method="objectSpanMethod"
                        :row-class-name="tableRowClass"
                        @sort-change="tableSort"
                        >
                        <el-table-column
                        v-for="item,index in tableHeader" 
                        :prop="item.prop"
                        :key="item.prop"
                        align="center"
                        :fixed="item.fixed"
                        :min-width="item.width"
                        :class-name = "item.classname"
                        :sortable = "item.sortable"
                        :label="item.label">
                          <template #default="scope">
                            <span :class="item.prop == 'num_seperate' ? 'icon_num': ''">{{scope.row[item.prop]}}</span>
                            <el-tooltip v-if="item.prop == 'num_seperate'" content="点击查看关键词统计" placement="right-start" effect="light">
                              <span class="icon_chart" @click="showColumnChart(scope.row)"><svg-icon icon-class="line2" alt="" /></span>
                            </el-tooltip>
                          </template>
                            <template v-if="item.hasChildren === 1">
                              <el-table-column
                                  v-for="_item,_index in item.children"
                                  :label="_item.label"
                                  :prop="_item.prop"
                                  :key="_item.prop"
                                  :fixed="_item.fixed"
                                  sortable="custom"
                                  :min-width="_item.width"
                                  :class-name = "_item.classname"
                                  align="center"
                                >
                                <template #default="scope">
                                  <span :class="_item.prop == 'num_seperate' ? 'icon_num': ''">{{scope.row[_item.prop]}}</span>
                                  <el-tooltip v-if="_item.prop == 'num_seperate'" content="点击查看关键词统计" placement="right-start" effect="light">
                                    <span class="icon_chart" @click="showColumnChart(scope.row)"><svg-icon icon-class="line2" alt="" /></span>
                                  </el-tooltip>
                                </template>
                              </el-table-column>
                            </template>
                        </el-table-column>
                      </el-table>
                  </div>
                  <div class="out_box fixed" v-if="scrollPosition.maxScrollWidth>0&&scrollPosition.isPC" :style="'left:'+scrollPosition.left+'px;width:'+scrollPosition.width+'px;bottom:'+scrollPosition.fixedBottom+'px;'" ref="out_box">
                      <div class="in_box" @mousedown="mouseDownHandler" :style="'left:'+scrollPosition.insetLeft+'px;width:'+scrollPosition.insetWidth+'px;'" ref="in_box" ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-backtop target=".scroll-panel"></el-backtop>
    <el-dialog :title="dialogTitle" top="10vh" custom-class="chart-line word-line" :visible.sync="isColumnShow" :before-close="handleClose" :width="dialogWidth">
        <div class="pop_search">
          <el-select v-model="popSearch.start_num" size="small" clearable placeholder="请选择开始日期" class="select-panel">
              <el-option
                  v-for="item in timeList"
                  :key="item.num"
                  :label="item.addtime"
                  :value="item.num">
              </el-option>
          </el-select>
          <el-select style="margin-left: 10px;" v-model="popSearch.end_num" size="small" clearable placeholder="请选择结束日期" class="select-panel">
              <el-option
                  v-for="item in timeList"
                  :key="item.num"
                  :label="item.addtime"
                  :value="item.num">
              </el-option>
          </el-select>
          <el-button class="search_btn" type="primary" size="small" :disabled="isPopSearch" @click="getColumnRes('search')">查询</el-button>
          <el-popover
            placement="top-start"
            width="228"
            trigger="hover">
            <el-table class="dyTable" stripe border :data="stageData">
              <el-table-column width="50" align="center" property="stage" label="级别"></el-table-column>
              <el-table-column width="150" align="center"  property="desc" label="描述"></el-table-column>
            </el-table>
            <svg-icon class="tips_div" slot="reference"  icon-class="tips"></svg-icon>
          </el-popover>
          
        </div>
        <div class="search_body">
          <div class="seach_total">
            <p class="tab_p" v-if="activeName=='second' && add_allscore.length > 0">
              增加的词<template v-for="item,index in add_allscore">
                <template v-if="index > 0">，</template><template v-if="index == 1">其中</template>{{item.label}}为<span class="dy_red"> {{item.value}} </span><template v-if="index == 0">分</template><template v-if="index > 0">个</template>
              </template>。
            </p>
            <p class="tab_p" v-if="activeName=='third'  && desc_allscore.length > 0">
              减少的词<template v-for="item,index in desc_allscore">
                <template v-if="index > 0">，</template><template v-if="index == 1">其中</template>{{item.label}}为<span class="dy_red"> {{item.value}} </span><template v-if="index == 0">分</template><template v-if="index > 0">个</template>
              </template>。
            </p>
          </div>
          <el-tabs v-model="activeName" type="card" >
            <el-tab-pane label="关键词等级统计" name="first">
              <div class="search_col">
                <div class="search" v-if="isPopSearch"><p>请稍候...</p></div>
                <div class="search_tab" v-else>
                  <div class="search_dw">单位：个</div>
                </div>
                <div id="columnChart"></div> 
              </div>
            </el-tab-pane>
            <el-tab-pane label="增加的词" name="second">
              <div class="search_col">
                <div class="search" v-if="isPopSearch"><p>请稍候...</p></div>
                <div class="table_wrap" v-else>
                  
                  <el-table
                    ref="dyTable"
                    :data="add_list"
                    tooltip-effect="dark"
                    class="dyTable"
                    style="width: 1160px"
                    height= "100%"
                    row-key="id"
                    >
                    <el-table-column
                      prop="name"
                      label="关键词"
                      min-width="100"
                      >
                      <template #default="scope">
                        <el-link v-if="scope.row.url" :href="scope.row.url" target="_blank" type="primary">
                          {{scope.row.name}}
                        </el-link>
                        <span v-else>
                          {{scope.row.name}}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="my_level"
                      label="关键词等级"
                      align="center"
                      min-width="60"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="rank_number"
                      label="排名"
                      align="center"
                      min-width="60"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="score"
                      label="积分"
                      align="center"
                      min-width="60"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="depart"
                      align="center"
                      label="部门"
                      min-width="60"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="uname"
                      align="center"
                      label="负责人"
                      min-width="60"
                      >
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="减少的词" name="third">
              <div class="search_col">
                <div class="search" v-if="isPopSearch"><p>请稍候...</p></div>
                <div class="table_wrap" v-else>
                  
                  <el-table
                    ref="dyTable"
                    :data="add_list"
                    tooltip-effect="dark"
                    class="dyTable"
                    style="width: 1160px"
                    height= "100%"
                    row-key="id"
                    >
                    <el-table-column
                      prop="name"
                      label="关键词"
                      min-width="100"
                      >
                      <template #default="scope">
                        <el-link v-if="scope.row.url" :href="scope.row.url" target="_blank" type="primary">
                          {{scope.row.name}}
                        </el-link>
                        <span v-else>
                          {{scope.row.name}}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="my_level"
                      label="关键词等级"
                      align="center"
                      min-width="60"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="score"
                      label="积分"
                      align="center"
                      min-width="60"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="rank_number"
                      label="排名"
                      align="center"
                      min-width="60"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="depart"
                      align="center"
                      label="部门"
                      min-width="60"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="uname"
                      align="center"
                      label="负责人"
                      min-width="60"
                      >
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import {mapGetters} from 'vuex';
import * as echarts from 'echarts';
import {sortByAsc} from "@/utils/index"
export default {
  name: 'Douyin_personcount',
  data() {
    return {
        menuButtonPermit:[],         //网页权限字段
        searchData:{
          uname:[],
          start_num:"",
          end_num: ""
        },
        scorelist:[],
        scorelist2: [],
        showChart: false,
        myChart:null,
        groupList: [],
        isIndeterminate: false,
        checkAll: false,
        isSearchData: false,
        timeList: [],
        noData: false,
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
          tableFixedLeftDom:null,
          fixedTopHeight:0,
          tableheaderHeight:0,
          fixedRightWidth:0,
          fixedLeftWidth:0,
          tableBottom:0,
          clientHeight:0,
        },
        tableHeight:200,
        tableHeader: [
          {
            label: "姓名",
            prop: 'uname',
            width: 80,
            hasChildren: 0,
            fixed: "left",
          },
          {
            label: "账号",
            prop: 'name',
            width: 150,
            hasChildren: 0,
            fixed: false,
          }
        ], 
        timeArr: [],
        isColumnShow: false,
        popSearch: {
          ids: [],
          start_num: 0,
          end_num: 0
        },
        isPopSearch: false,
        activeName: "first",
        add_allscore: [],
        desc_allscore: [],
        dialogTitle: "",
        dialogWidth: "1200px",
        searchId: [],
        add_list: [],
        desc_list: [],
        stageData: [
          {
            stage: "A1",
            desc: "拳头产品"
          },
          {
            stage: "A2",
            desc: "拳头产品长尾词"
          },
          {
            stage: "B1",
            desc: "非拳头产品"
          },
          {
            stage: "B2",
            desc: "非拳头产品长尾词"
          },
          {
            stage: "C2",
            desc: "口碑词"
          },
          {
            stage: "C3",
            desc: "品牌词"
          },
          {
            stage: "D",
            desc: "配套产品"
          },
        ],
        nowChart: 1,
        pieChart1: null,
        pieChart2: null,
        piedata_one: [],
        piedata_two: []
    };
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
  created() {
    var $this = this;
    $this.getBreadcrumbList();
    $this.initData();
  },
  mounted(){
    const $this = this;
    // window.addEventListener('resize',$this.echartsSize);
    // 监听竖向滚动条滚动事件
    window.addEventListener('scroll',$this.handleScroll,true);
    $this.$nextTick(function () {
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
  },
  updated(){
    var $this = this;
    $this.$nextTick(() => {
      $this.$refs.simpleTable.doLayout();
    });
  },
  destroyed(){
    const $this = this;
    // window.removeEventListener('resize', $this.echartsSize);
    window.removeEventListener('scroll', $this.handleScroll,true);//监听页面滚动事件
  },
  methods: {
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
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.data.length>0){
          var permitData = [];
          res.data.forEach(function(item,index){
            permitData.push(item.action_route);
          });
          if(permitData.includes('Douyin_personcount')){
              $this.getDepartList();
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
      });
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 获取部门列表
    getDepartList(){
      var $this = this;
      $this.$store.dispatch('douyin/douyinDepartgroup', null).then(response=>{
        if(response){
          if(response.status){
            if(response.data){
              var resList = [];
              var unames = [];
              if(response.data.length > 0){
                response.data.forEach(item => {
                  var obj = {};
                  obj.uname = item.uname;
                  obj.department = item.department;
                  obj.isOn = false;
                  resList.push(obj);
                  unames.push(item.uname);
                })
              }
              $this.groupList = resList;
              $this.searchData.uname = unames;
              $this.getDouyinTime();
            }
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
                $this.isSearchResult=false;
                $this.isSaveData=false;
              },1000);
            }
          }
        }
      });
    },
    // 获取日期
    getDouyinTime(){
      var $this = this;
      $this.$store.dispatch('douyin/douyinCountTime',null).then(res=>{
        if(res.status){
          $this.timeList = res.data;
          var numArr = [];
          res.data.forEach(item => {
            numArr.push(item.num)
          })
          $this.timeArr = numArr;
          $this.searchData.end_num = Math.max(...numArr);
          $this.searchData.start_num = $this.getPrevTime($this.searchData.end_num);
          $this.getDouyinCountData();
        }else{
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'error'
          });
        }
      });
    },
    // 小组点击事件
    groupChangeHandler(uname){
      var $this = this;
      var groupList = $this.groupList;
      var selectedID = [];
      groupList.forEach(function(item,index){
        if(item.uname == uname){
          item.isOn = !item.isOn;
        }
        if(item.isOn){
          selectedID.push(item.uname);
        }
      });
      if(selectedID.length === $this.groupList.length ){
        $this.checkAll = true
      }else{
        $this.checkAll = false
      }
      $this.groupList = groupList;
      $this.searchData.uname = selectedID;
    },
    checkAllData(){
      var $this = this;
      if($this.checkAll){
        $this.checkAll = false;
        var groupList = $this.groupList;
        groupList.forEach(function(item,index){
          item.isOn = false;
        });
        $this.groupList = groupList;
        $this.searchData.uname = [];
      }else{
        $this.checkAll = true;
        var groupList = $this.groupList;
        var selectedID = [];
        groupList.forEach(function(item,index){
          item.isOn = true;
          selectedID.push(item.uname);
        });
        $this.groupList = groupList;
        $this.searchData.uname = selectedID;
      }
      
    },
    // 获取抖音数据
    getDouyinCountData(){
      var $this = this;
      if(!$this.isSearchData){
        if($this.searchData.start_num == "" ){
          $this.$message({
            showClose: true,
            message: "错误：请选择开始日期！",
            type: "error",
          });
          return false;
        }else if($this.searchData.end_num == "" ){
          $this.$message({
            showClose: true,
            message: "错误：请选择结束日期！",
            type: "error",
          });
          return false;
        }else if($this.searchData.end_num < $this.searchData.start_num ){
          $this.$message({
            showClose: true,
            message: "错误：请核对开始、结束日期！",
            type: "error",
          });
          return false;
        }else if($this.searchData.uname.length === 0){
          $this.$message({
            showClose: true,
            message: "错误：请选择要查询的账号！",
            type: "error",
          });
          return false;
        }
        var formData = {};
        formData.uname = $this.searchData.uname;
        formData.start_num = $this.searchData.start_num;
        formData.end_num = $this.searchData.end_num;
        $this.isSearchData = true;
        $this.$store.dispatch('douyin/douyinPersonalCountLine', formData).then(response=>{
          if(response){
            $this.scorelist = [];
            $this.isSearchData = false;
            $this.tableHeader = [
              {
                label: "姓名",
                prop: 'uname',
                width: 80,
                hasChildren: 0,
                fixed: "left",
              },
              {
                label: "账号",
                prop: 'name',
                width: 150,
                hasChildren: 0,
                fixed: false,
              }
            ];
            if(response.status){
              if(response.data){
                var resList = []
                if(response.data.length > 0){
                  var latest_num = $this.searchData.end_num;
                  var prev_num = $this.searchData.start_num;
                  response.data.forEach((item,index) => {
                    if(item.score_trend && item.score_trend.length > 0){
                      // 多个账号
                      if(item.score_trend[0].son.length > 1){
                        var num = item.score_trend[0].son.length;
                        var vid = 0;
                        // 加个总计
                        var latest_score_2 = 0;
                        var prev_score_2 = 0;
                        var newobj = {};
                        newobj.id = item.id+"_"+index+"_x";
                        newobj.uname = item.uname;
                        newobj.department = item.department;
                        newobj.name = "总计";
                        newobj.haschart = 1;
                        newobj.cid = item.id;
                        for(var i = 0; i< num; i++){
                          var latest_score = 0;
                          var prev_score = 0;
                          var obj = {};
                          obj.uname = item.uname;
                          obj.department = item.department;
                          obj.haschart = 0;
                          item.score_trend.forEach((sitem,sindex) => {
                            obj.name = sitem.son[i].name;
                            obj.id = item.id+"_"+ vid;
                            obj.cid = sitem.son[i].id;
                            vid++;
                            obj.totalscore = item.score;
                            obj['score'+ sindex] = sitem.son[i].score;
                            if($this.searchData.end_num > $this.searchData.start_num ){
                              if(sitem.num === latest_num){
                                latest_score = sitem.son[i].score;
                              }else if(sitem.num === prev_num){
                                prev_score = sitem.son[i].score;
                              }
                            }
                            if(i === num-1){
                              newobj['score'+ sindex] = sitem.score;
                              if($this.searchData.end_num > $this.searchData.start_num ){
                                if(sitem.num === latest_num){
                                  latest_score_2 = sitem.score;
                                }else if(sitem.num === prev_num){
                                  prev_score_2 = sitem.score;
                                }
                              }
                            }
                            if(index === 0 && i === 0){
                              $this.tableHeader.push({
                                label: sitem.addtime,
                                prop: 'count'+sindex,
                                hasChildren: 1,
                                fixed: false,
                                children: [{
                                    label:"积分",
                                    width: 100,
                                    prop: 'score'+sindex,
                                    fixed: false,
                                  }
                                ]
                              })
                            }
                          });
                          obj.num_seperate = (latest_score - prev_score).toFixed(1);
                          resList.push(obj);
                        }
                        newobj.num_seperate = (latest_score_2 - prev_score_2).toFixed(1);
                        resList.push(newobj);
                      }else{
                        var latest_score = 0;
                        var prev_score = 0;
                        var obj = {};
                        // 单账号
                        item.score_trend.forEach((sitem,sindex) => {
                          obj.id = item.id;
                          obj.uname = item.uname;
                          obj.department = item.department;
                          obj.name = item.name;
                          obj.haschart = 1;
                          obj.cid = item.id;
                          obj['score'+ sindex] = sitem.score;
                          if($this.searchData.end_num > $this.searchData.start_num ){
                            if(sitem.num === latest_num){
                              latest_score = sitem.score;
                            }else if(sitem.num === prev_num){
                              prev_score = sitem.score;
                            }
                          }
                          if(index === 0){
                            $this.tableHeader.push({
                              label: sitem.addtime,
                              prop: 'count'+sindex,
                              hasChildren: 1,
                              fixed: false,
                              children: [{
                                  label:"积分",
                                  width: 100,
                                  prop: 'score'+sindex,
                                  fixed: false,
                                }
                              ]
                            })
                          }
                        });
                        obj.num_seperate = (latest_score - prev_score).toFixed(1);
                        resList.push(obj);
                      }
                    }
                    
                  })
                  if($this.searchData.end_num > $this.searchData.start_num ){
                    $this.tableHeader.push({
                      label: "积分增幅",
                      prop: "num_seperate",
                      hasChildren: 0,
                      fixed: false,
                      sortable: "custom",
                      classname: "num06",
                      width: 100,
                      sortway: (a,b) =>{ return a.num_seperate - b.num_seperate; }
                    })
                  }
                }
                resList.sort((a,b) =>{
                  return b.num_seperate- a.num_seperate
                });
                console.log(resList)
                var aimres = $this.sortByGroup(resList);
                $this.scorelist = aimres;
                $this.scorelist2 = [...aimres];
                // if($this.myChart){
                //   $this.myChart.dispose();
                //   $this.drawAreaChart();
                // }else{
                //   $this.drawAreaChart();
                // }
                $this.$nextTick(function () {
                  $this.setTableHeight();
                })
              }
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
                  $this.isSearchResult=false;
                  $this.isSaveData=false;
                },1000);
              }
            }
          }
        });
      }
    },
    drawAreaChart(){
      var $this = this;
      var totalNum = 0;
      if($this.scorelist.length>0){
        $this.scorelist.forEach((item, index) => {
          if(index === 0){
            totalNum = item.score_trend.length
          }
          if(item.score_trend && item.score_trend.length > 0){
            item.score_trend = item.score_trend.sort(sortByAsc("num"));
          }
        })
        if(totalNum>0){
          $this.noData = false;
          var colorArr = ["#2259e5","#3ebea7","#eca12d","#ee4747","#73c0de","#91cb74","#ff8d61","#9a60b4","#e522db","#e5d822","#5470c6","#fc8452","#fac858","#ee6666"]
          var chartDom = document.getElementById('chart');
          var myChart = echarts.init(chartDom);
          var option;
          var xData = [];
          var series = [];
          var dataset = [];
          // 获取总值
          if($this.scorelist.length > 1){
            var totalObj={};
            totalObj.smooth=false;
            totalObj.type='line';
            totalObj.name = "总积分";
            totalObj.label={
              show: true,
              position: 'top'
            }
            totalObj.lineStyle={
                width: 1,
                color: "#fe3a33", // 线条颜色
            };
            totalObj.itemStyle={
                color: '#fff',
                borderColor: "#fe3a33", // 折点颜色
                borderWidth: 1
            };
            totalObj.areaStyle={
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "#fe3a33",
                      opacity:1
                    },
                    {
                      offset: 1,
                      color: "rgba(255, 255, 255, 0)",
                    }
                  ]),
                  opacity:0.3
            };
            totalObj.emphasis={
              lineStyle: {
                width: 2,	// hover时的折线宽度
              },
              itemStyle:{
                borderWidth: 2
              }
            };
            totalObj.symbolSize=5;
            totalObj.symbol='circle';
            totalObj.data=[];
            for(var i = 0; i< totalNum; i++){
              var tobj = {
                value: 0,
                one_number: 0,
                two_number: 0,
                three_number: 0,
                four_number: 0
              }
              $this.scorelist.forEach((item, index) => {
                tobj.value += Number(item.score_trend[i].score);
                tobj.one_number += Number(item.score_trend[i].one_number);
                tobj.two_number += Number(item.score_trend[i].two_number);
                tobj.three_number += Number(item.score_trend[i].three_number);
                tobj.four_number += Number(item.score_trend[i].four_number);
              })
              tobj.value = tobj.value.toFixed(1);
              totalObj.data.push(tobj)
            }
            totalObj.animationDuration=2800;
            totalObj.animationEasing='quadraticOut';
            series.push(totalObj);
          }
          
          // 组装每个值
          $this.scorelist.forEach((item,index) => {
            var itemObj={};
            itemObj.smooth=false;
            itemObj.type='line';
            itemObj.name = item.department+'-'+item.uname;
            itemObj.label={
              show: true,
              position: 'top'
            }
            itemObj.lineStyle={
                width: 1,
                color: colorArr[index%14], // 线条颜色
            };
            itemObj.itemStyle={
                color: '#fff',
                borderColor: colorArr[index%14], // 折点颜色
                borderWidth: 1
            };
            itemObj.areaStyle={
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: colorArr[index%14],
                      opacity:1
                    },
                    {
                      offset: 1,
                      color: "rgba(255, 255, 255, 0)",
                    }
                  ]),
                  opacity:0.3
            };
            itemObj.emphasis={
              lineStyle: {
                width: 2,	// hover时的折线宽度
              },
              itemStyle:{
                borderWidth: 2
              }
            };
            itemObj.symbolSize=5;
            itemObj.symbol='circle';
            itemObj.data=[];
            if(item.score_trend && item.score_trend.length > 0){
              item.score_trend.forEach((sitem, sindex) => {
                if(index === 0){
                  xData.push(sitem.addtime);
                }
                var obj = {}
                obj.value = sitem.score;
                obj.one_number = sitem.one_number;
                obj.two_number = sitem.two_number;
                obj.three_number = sitem.three_number;
                obj.four_number = sitem.four_number;
                itemObj.data.push(obj);
              })
            }
            itemObj.animationDuration=2800;
            itemObj.animationEasing='quadraticOut';
            series.push(itemObj);
          });
          option = {
            tooltip: {
                backgroundColor:'rgba(255,255,255,0.95)',
                trigger: "axis",
                textStyle:{
                  fontSize:'12',
                  color: '#666'
                },
                formatter(params){
                  let returnData = `<div class="toolDiv">
                      <div class="tooltitle">${params[0].name}</div>`;
                  for (let i = 0; i < params.length; i++) {
                      returnData += `<div class="bar clearfix" style="margin-top:5px">
                        <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${params[i].borderColor};"></span>
                        <span>${params[i].seriesName}：</span>
                        <span>积分：${params[i].value}</span>
                        </div>
                        <div class="bar clearfix">
                        <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;"></span>
                        <span style="opacity: 0; vibisity: hidden;"> ${params[i].seriesName}：</span>
                        <span>数量：</span>
                        <span>${params[i].data.one_number}<span style="color: #999"> (1-5名)</span></span>
                        <span style="margin-left: 10px;">${params[i].data.two_number}<span style="color: #999"> (6-10名)</span></span>
                        <span style="margin-left: 10px;">${params[i].data.three_number}<span style="color: #999"> (11-15名)</span></span>
                        <span style="margin-left: 10px;">${params[i].data.four_number}<span style="color: #999"> (16-20名)</span></span>
                        </div>
                        `;
                  }
                  returnData +=`</div>`;
                  return returnData;
              }
            },
            grid: {
                top:60,
                right:52,
                bottom:40,
                left:52,
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xData,
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLine:{
                    show: true,
                    lineStyle:{
                        type: [4, 0],
                        dashOffset: 3,
                        color: '#e5e5e5',
                        opacity: 1,
                        shadowColor: null,
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                    }
                },
                axisLabel: {
                    interval:1,
                    color: "#555",
                    fontSize: "12",
                    lineHeight: 18,
                },
            },
            yAxis:{
                type: 'value',
                position: 'left',
                axisLine:{
                    show: true,
                    lineStyle:{
                        type: [4, 0],
                        dashOffset: 3,
                        color: '#e0e0e0',
                        opacity: 1,
                        shadowColor: null,
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                    }
                },
            },
            animation: false,
            series:series,
          };
          option && myChart.setOption(option);
          $this.myChart = myChart;
        }else{
          $this.noData = true;
        }
      }
    },
    echartsSize(){
      if(this.myChart){
          this.myChart.resize();
      }
    },
    findData(value, aim, str){
      var isIn = false;
      aim.forEach(item => {
        if(item[str] === value){
          isIn = true
        }
      })
      return isIn
    },
    resetData(){
      var $this = this;
      $this.searchData.start_num = "";
      $this.searchData.end_num = "";
      $this.checkAll = false;
      $this.scorelist = [];
      $this.tableHeader = [
          {
            label: "姓名",
            prop: 'uname',
            width: 80,
            hasChildren: 0,
            fixed: "left",
          },
          {
            label: "账号",
            prop: 'name',
            width: 150,
            hasChildren: 0,
            fixed: false,
          }
        ];
      var groupList = $this.groupList;
      groupList.forEach(function(item,index){
          item.isOn = false;
      });
      $this.groupList = groupList;
      if($this.myChart){
        $this.myChart.dispose();
      }
    },
    // 设置高度
    setTableHeight(){
      var $this = this;
      $this.tableHeight = 0;      
      var headerHeight = $this.$refs.headerPane.offsetHeight;
      var breadcrumbHeight = $this.$refs.breadcrumbPane.offsetHeight;
      var screenHeight = $this.$refs.boxPane.offsetHeight;
      $this.tableHeight = screenHeight-headerHeight-breadcrumbHeight-40-45-31;
      $this.getBrowserType();
        setTimeout(function() {
          $this.setScrollDom();
      }, 400);
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
      var tableFixedLeftDom = document.querySelector(".el-table__fixed");
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
         $this.scrollTable.fixedTopHeight = $this.$refs.headerPane.offsetHeight+$this.$refs.breadcrumbPane.offsetHeight+15+20;
      }else{
         $this.scrollTable.fixedTopHeight=$this.$refs.breadcrumbPane.offsetHeight+15+20;
      }
      $this.scrollTable.tableHeaderFixedDom = tableHeaderFixedDom;
      if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
         $this.scrollTable.tableFixedRightDom = tableFixedRightDom;
      }
      if(tableFixedLeftDom&&tableFixedLeftDom!=null&&tableFixedLeftDom!=undefined){
         $this.scrollTable.tableFixedLeftDom = tableFixedLeftDom;
      }
      var fixedHeaderObj = $this.scrollTable.tableHeaderFixedDom.getBoundingClientRect();
      // 获取表格头的高度
      $this.scrollTable.tableheaderHeight = fixedHeaderObj.height;
      if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
         var fixedRightObj = $this.scrollTable.tableFixedRightDom.getBoundingClientRect();
         // 获取右侧固定列的总宽度
         $this.scrollTable.fixedRightWidth = fixedRightObj.width;
      }
      if(tableFixedLeftDom&&tableFixedLeftDom!=null&&tableFixedLeftDom!=undefined){
         var fixedLeftObj = $this.scrollTable.tableFixedLeftDom.getBoundingClientRect();
         // 获取左侧侧固定列的总宽度
         $this.scrollTable.fixedLeftWidth = fixedLeftObj.width;
      }
      var tableObj = $this.scrollTable.scrollDom.getBoundingClientRect();
      $this.scrollTable.tableBottom = tableObj.height+$this.scrollTable.fixedTopHeight+$this.scrollTable.tableheaderHeight+54+20;
      $this.scrollTable.clientHeight = document.documentElement.clientHeight;
      // 头部固定情况下视窗宽高改变，需要重新设置的一些宽高
      if($this.scrollPosition.isFixed){
        var tableHeaderStyle = "width:"+$this.scrollPosition.width +5+"px;";
        $this.scrollTable.tableHeaderFixedDom.style = tableHeaderStyle;
        document.querySelector(".table-mask").style = tableHeaderStyle;
        var tableStyle3 = "width:"+$this.scrollTable.fixedRightWidth+"px;";
        var tableStyle4 = "width:"+$this.scrollTable.fixedLeftWidth+"px;";
        if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
          document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-header-wrapper").style=tableStyle3;
        }
        if(tableFixedLeftDom&&tableFixedLeftDom!=null&&tableFixedLeftDom!=undefined){
          document.querySelector(".SiteTable .el-table__fixed .el-table__fixed-header-wrapper").style=tableStyle4;
        }
        $this.scrollTable.tableBottom = tableObj.height+$this.scrollTable.fixedTopHeight+54+20;
      }
    },
    // 竖向滚动条滚动事件
    handleScroll(event){
      var $this = this;
      if(!$this.scrollPosition.isMouseDown&&event.target.className=="scroll-panel"){// 非鼠标按下状态，为竖向滚动条触发的滚动事件
        var scrTop = event.target.scrollTop;
        var tableFixedRightDom = document.querySelector(".SiteTable .el-table__fixed-right");
        var tableFixedLeftDom = document.querySelector(".SiteTable .el-table__fixed");
        if(scrTop>=$this.scrollTable.fixedTopHeight){// 头部需要固定
          $this.scrollPosition.isFixed = true;
          var tableHeaderStyle = "width:"+$this.scrollPosition.width +5+"px;"
          $this.scrollTable.tableHeaderFixedDom.style = tableHeaderStyle;
          document.querySelector(".table-mask").style = tableHeaderStyle;
          var tableStyle1 = "padding-top:"+$this.scrollTable.tableheaderHeight+"px;";
          var tableStyle2 = "top:"+$this.scrollTable.tableheaderHeight+"px;";
          var tableStyle3 = "width:"+$this.scrollTable.fixedRightWidth+"px;";
          var tableStyle4 = "width:"+$this.scrollTable.fixedLeftWidth+"px;";
          document.querySelector(".SiteTable .el-table__body-wrapper").style=tableStyle1;
          if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
            document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-body-wrapper").style=tableStyle2;
            document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-header-wrapper").style=tableStyle3;
          }
          if(tableFixedLeftDom&&tableFixedLeftDom!=null&&tableFixedLeftDom!=undefined){
            document.querySelector(".SiteTable .el-table__fixed .el-table__fixed-body-wrapper").style=tableStyle2;
            document.querySelector(".SiteTable .el-table__fixed .el-table__fixed-header-wrapper").style=tableStyle4;
          }
        }else{// 头部需要变为正常
          $this.scrollPosition.isFixed = false;
          var tableHeaderStyle = "width:100%";
          $this.scrollTable.tableHeaderFixedDom.style = tableHeaderStyle;
          var tableStyle1 = "padding-top:0";
          document.querySelector(".SiteTable .el-table__body-wrapper").style=tableStyle1;
          var tableStyle3 = "width:auto";
          var tableStyle4 = "width:auto";
          if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
            document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-header-wrapper").style=tableStyle3;
          }
          if(tableFixedLeftDom&&tableFixedLeftDom!=null&&tableFixedLeftDom!=undefined){
            document.querySelector(".SiteTable .el-table__fixed .el-table__fixed-header-wrapper").style=tableStyle4;
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
    getPrevTime(){
      var $this = this;
      var prev = $this.searchData.start_num;
      var end = $this.searchData.end_num;
      $this.timeArr.forEach(item => {
        if(item > prev && item < end){
          prev = item;
        }
      })
      return prev;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 如果是第一行
      var $this = this;
      if (columnIndex === 0) {
        const _row = $this.filterSpan($this.scorelist, 'uname')[rowIndex] // 这里需要修改
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    // 处理数据
    filterSpan(arr, condition) {
      const spanOneArr = []
      let concatOne = 0
      arr.map((item, index) => {
        if (index === 0) {
          spanOneArr.push(1)
        } else {
          // 第一列需合并相同内容的判断条件
          if (item[condition] === arr[index - 1][condition]) {
            spanOneArr[concatOne] += 1
            spanOneArr.push(0)
          } else {
            spanOneArr.push(1)
            concatOne = index
          }
        }
      })
      return spanOneArr
    },
    tableRowClass(val){
      var $this = this;
      var totalObj = [];
      var newlist = $this.scorelist;
      newlist.forEach((item,index) => {
        if(totalObj.indexOf(item.uname) < 0){
          totalObj.push(item.uname)
        }
      })
      // if(val.row.name == '总计'){
      if(totalObj.indexOf(val.row.uname)%2 === 0){
        if(val.row.name == '总计'){
          return 'row-total row-bg';
        }else{
          return 'row-bg';
        }
      }else{
        if(val.row.name == '总计'){
          return 'row-total';
        }else{
          return '';
        }
      }
    },
    sortByGroup(scorelist){
      var $this = this;
      var totalObj = [];
      var newlist = scorelist;
      newlist.forEach((item,index) => {
        if(item.name === "总计"){
          totalObj.push(item.uname)
        }
      })
      var needArr = [];
      newlist.forEach(item => {
        if(totalObj.indexOf(item.uname) > -1 && item.name !== "总计"){
          needArr.push(item);
        }
      })
      var aimRes = [];
      newlist.forEach(item => {
        if(totalObj.indexOf(item.uname) < 0){
          aimRes.push(item);
        }
        if(totalObj.indexOf(item.uname) > -1 && item.name === "总计"){
          needArr.forEach(nitem => {
            if(nitem.uname === item.uname){
              aimRes.push(nitem)
            }
          })
          aimRes.push(item);
        }
      })
      return aimRes;
    },
    tableSort(column){
      var $this = this;
      var col = column.prop;
      var way = column.order;
      var scorelist = $this.scorelist;
      if(way === 'ascending'){
        scorelist.sort((a,b) =>{
          return a[col]- b[col]
        });
        var aimres = $this.sortByGroup(scorelist);
        $this.scorelist = aimres;
      }else if(way === 'descending'){
        scorelist.sort((a,b) =>{
          return b[col]- a[col]
        });
        var aimres = $this.sortByGroup(scorelist);
        $this.scorelist = aimres;
      }else{
        $this.scorelist = [...$this.scorelist2];
      }
      $this.$refs.simpleTable.doLayout();
    },
    showColumnChart(data){
      var $this = this;
      $this.isColumnShow = true;
      $this.dialogTitle = "关键词统计——"+data.uname+"——"+data.name;
      $this.dialogWidth = "1200px";
      if(data.name == "总计"){
        $this.searchId = $this.getDataIds(data.uname);
      }else{
        var id = [];
        id.push(data.cid);
        $this.searchId = id;
      }
      
      if(!$this.isPopSearch){
        $this.getColumnRes("first");
      }
    },
    getColumnRes(str){
      var $this = this;
      if($this.myChart){
        $this.myChart.dispose();
      }
      $this.myChart = null;
      if($this.pieChart1){
        $this.pieChart1.dispose();
      }
      if($this.pieChart2){
        $this.pieChart2.dispose();
      }
      $this.pieChart1 = null;
      $this.pieChart2 = null;
      $this.add_allscore = [];
      $this.desc_allscore = [];
      var formData = {};
      $this.isPopSearch = true;
      formData.ids = $this.searchId;
      if(str == 'first'){
        if($this.searchData.end_num){
          formData.end_num = $this.searchData.end_num;
        }else{
          formData.end_num = Math.max(...timeArr);
        }
        if($this.searchData.start_num){
          formData.start_num = $this.searchData.start_num;
        }else{
          formData.start_num = $this.getPrevTime($this.searchData.end_num);
        }
        
        $this.popSearch.ids = formData.ids;
        $this.popSearch.start_num = formData.start_num;
        $this.popSearch.end_num = formData.end_num;
      }else{
        formData.start_num = $this.popSearch.start_num;
        formData.end_num = $this.popSearch.end_num;
      }
      
      $this.$store.dispatch('douyin/douyinWordInfo', formData).then(response=>{
        if(response){
          $this.columnData = {};
          if(response.status){
            $this.isPopSearch = false;
            var resObj = {};
            if(response.data_one){
              var keyArr = Object.keys(response.data_one);
              if(keyArr.length > 0){
                resObj.name = keyArr;
                var data_one = [];
                var data_two = [];
                var pie_one = [];
                var pie_two = [];
                var data_one_num = 0;
                var data_two_num = 0;
                keyArr.forEach(item => {
                  if(Object.hasOwnProperty.call(response.data_one, item)){
                    data_one_num+= response.data_one[item];
                    data_one.push(response.data_one[item]);
                  }else{
                    data_one.push(0)
                  }
                  if(Object.hasOwnProperty.call(response.data_two, item)){
                    data_two_num += response.data_two[item];
                    data_two.push(response.data_two[item]);
                  }else{
                    data_two.push(0)
                  }
                  var obj1 = {};
                  var obj2 = {};
                  obj1.name = item;
                  obj1.value = response.data_one[item];
                  obj2.name = item;
                  obj2.value = response.data_two[item];
                  pie_one.push(obj1);
                  pie_two.push(obj2);
                })
                resObj.data_one = data_one;
                resObj.data_two = data_two;
                resObj.data_one_num = data_one_num;
                resObj.data_two_num = data_two_num;
                $this.columnData = resObj;
                $this.piedata_one = pie_one;
                $this.piedata_two = pie_two;
                if($this.nowChart == 1){
                  $this.drawColumnChart();
                }else{
                  $this.drawPieChart1();
                  $this.drawPieChart2();
                }
              }
            }
            if(response.add_word && response.add_word.length > 0){
              var count = 0;
              var counta1 = 0;
              var counta2 = 0;
              var countb1 = 0;
              var countb2 = 0;
              var countc2 = 0;
              var countc3 = 0;
              var countd = 0;
              var addArr = [];
              response.add_word.forEach(item => {
                count += item.score;
                if(item.my_level == "A1"){
                  counta1 += 1
                }
                if(item.my_level == "A2"){
                  counta2 += 1
                }
                if(item.my_level == "B1"){
                  countb1 += 1
                }
                if(item.my_level == "B2"){
                  countb2 += 1
                }
                if(item.my_level == "C2"){
                  countc2 += 1
                }
                if(item.my_level == "C3"){
                  countc3 += 1
                }
                if(item.my_level == "D"){
                  countd += 1
                }
              })
              addArr.push({label: "总计", value: Number(count).toFixed(1)});
              addArr.push({label: "A1", value: counta1});
              addArr.push({label: "A2", value: counta2});
              addArr.push({label: "B1", value: countb1});
              addArr.push({label: "B1", value: countb2});
              addArr.push({label: "C2", value: countc2});
              addArr.push({label: "C3", value: countc3});
              addArr.push({label: "D", value: countd});
              $this.add_allscore = addArr;
              $this.add_list = response.add_word;
            }
            if(response.desc_word && response.desc_word.length > 0){
              var count = 0;
              var count = 0;
              var counta1 = 0;
              var counta2 = 0;
              var countb1 = 0;
              var countb2 = 0;
              var countc2 = 0;
              var countc3 = 0;
              var countd = 0;
              var descArr = [];
              response.desc_word.forEach(item => {
                count += item.score;
                if(item.my_level == "A1"){
                  counta1 += 1
                }
                if(item.my_level == "A2"){
                  counta2 += 1
                }
                if(item.my_level == "B1"){
                  countb1 += 1
                }
                if(item.my_level == "B2"){
                  countb2 += 1
                }
                if(item.my_level == "C2"){
                  countc2 += 1
                }
                if(item.my_level == "C3"){
                  countc3 += 1
                }
                if(item.my_level == "D"){
                  countd += 1
                }
              })
              descArr.push({label: "总计", value: Number(count).toFixed(1)});
              descArr.push({label: "A1", value: counta1});
              descArr.push({label: "A2", value: counta2});
              descArr.push({label: "B1", value: countb1});
              descArr.push({label: "B1", value: countb2});
              descArr.push({label: "C2", value: countc2});
              descArr.push({label: "C3", value: countc3});
              descArr.push({label: "D", value: countd});
              $this.desc_allscore = descArr;
              $this.desc_list = response.desc_word;
            }
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
                $this.isSearchResult=false;
              },1000);
            }
          }
        }
      });
    },
    drawColumnChart(){
      var $this = this;
      var chartDom = document.getElementById('columnChart');
      var myChart = echarts.init(chartDom);
      var option;
      var series=[];
      var color = ["#2259e5","#3ebea7","#eca12d","#ee4747","#73c0de","#91cb74","#ff8d61","#9a60b4","#e522db","#e5d822","#5470c6","#fc8452","#fac858","#ee6666"];
      var startname = "";
      var endname = "";
      $this.timeList.forEach(item => {
        if(item.num == $this.popSearch.start_num){
          startname = item.addtime
        }
        if(item.num == $this.popSearch.end_num){
          endname = item.addtime
        }
      })
      series=[{
        type: 'bar',
          data: $this.columnData.data_two,
          barWidth: '28px',
          name: startname,
          itemStyle: {
            color: "#2259e5"
          },
          label: {
              show: true,
              position: 'top',
          },
      },{
          type: 'bar',
          data: $this.columnData.data_one,
          barWidth: '28px',
          name: endname,
          itemStyle: {
            color: "#3ebea7"
          },
          label: {
              show: true,
              position: 'top',
          },
      }];
      var option;
      option = {
        tooltip:{
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "line", 
              lineStyle:{
                color: "#5b8ff9"
              }
            },
            textStyle:{
                fontSize:12,
                color: '#666'
            },
            formatter(params){
              let returnData = `<div class="toolDiv">
                      <div class="tooltitle">${params[0].name}</div>`;
                      for (let i = 0; i < params.length; i++) {
                        var pernum = "";
                        if(i == 0){
                          if($this.columnData.data_two_num && $this.columnData.data_two_num > 0){
                            pernum = (params[i].value*100/$this.columnData.data_two_num).toFixed(1)+"%"
                          }else{
                            prenum = "0%"
                          }
                        }
                        if(i == 1){
                          if($this.columnData.data_one_num && $this.columnData.data_one_num > 0){
                            pernum = (params[i].value*100/$this.columnData.data_one_num).toFixed(1)+"%"
                          }else{
                            prenum = "0%"
                          }
                        }
                        returnData += `<div class="bar clearfix" style="margin-top:5px">
                          <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${params[i].borderColor};"></span>
                          <span>${params[i].seriesName}</span>
                          <span>：${params[i].value}（${pernum}）</span>
                          </div>
                          `;
                      }
                  returnData +=`</div>`;
                  return returnData;
            }
          },
          grid: {
              top:'40',
              right:'18',
              left:'50',
              bottom:'30'
          },
          xAxis:{
              type: 'category',
              data: $this.columnData.name,
              axisTick: {
                  show: false
              },
              axisLine:{
                  show: true,
                  lineStyle:{
                      type: [4, 2],
                      dashOffset: 3,
                      color: '#000',
                      opacity:0.1,
                      shadowColor: null,
                      shadowBlur: 0,
                      shadowOffsetX: 0,
                      shadowOffsetY: 0,
                  }
              },
              axisLabel: {
                  color: "#999",
                  fontSize: "12",
                  lineHeight: 18,
              },
              nameTextStyle:{
                  lineHeight:18,
              }
          },
          yAxis:{
              type: 'value',
              axisTick: {
                  show: false
              },
              axisLabel: {
                  color: "#999",
                  fontSize: "12",
                  lineHeight: 18,
              },
              axisLine:{
                  show: false,
              },
              splitLine:{
                  show: true,
                  lineStyle:{
                      type: [4, 2],
                      dashOffset: 3,
                      color: '#000',
                      opacity:0.1,
                      shadowColor: null,
                      shadowBlur: 0,
                      shadowOffsetX: 0,
                      shadowOffsetY: 0,
                  }
              },
              splitNumber:3,
              nameTextStyle:{
                  lineHeight:18,
              }
          },
          animation: false,
          series:series,
      }
      option && myChart.setOption(option);
      $this.myChart = myChart;
    },
    handleClose(){
      var $this = this;
      $this.isColumnShow = false;
      $this.activeName = "first";
      $this.nowChart = 1;
      if($this.myChart){
        $this.myChart.dispose();
      }
      $this.myChart = null;
      if($this.pieChart1){
        $this.pieChart1.dispose();
      }
      if($this.pieChart2){
        $this.pieChart2.dispose();
      }
      $this.pieChart1 = null;
      $this.pieChart2 = null;
    },
    getDataIds(name){
      var $this = this;
      var ids = [];
      $this.scorelist.forEach(item => {
        if(item.uname == name && item.name != "总计"){
          ids.push(item.cid)
        }
      })
      return ids;
    },
    drawPieChart1(){
      var $this = this;
      var chartDom = document.getElementById('pieChart1');
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        tooltip: {
          trigger: 'item',
          formatter(items){
            var tooltext = `<div class="counttoolTip">
            <div class="title">${items.name}</div>
            <div class="bar clearfix">
              ${items.marker}
              <span class="name">${items.seriesName}：</span>
              <span class="num">${items.value}</span>
            </div>
            `;
            return tooltext;
          }
        },
        legend: {
          show: false
        },
        color: ["#2259e5","#3ebea7","#eca12d","#ee4747","#73c0de","#91cb74","#ff8d61","#9a60b4","#e522db","#e5d822","#5470c6","#fc8452","#fac858","#ee6666"],
        animation: false,
        series: [
          {
            name: "关键词个数",
            type: 'pie',
            radius: '75%',
            data: $this.piedata_one,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label:{
                normal:{
                    formatter: function(params){
                        var str = '';
                        str = params.name+":"+params.percent.toFixed(1)+"%";
                        return str
                    },
                    position: 'outside',
                    fontSize: 13,
                    color: "#666",
                }
              },
          }
        ]
      };
      option && myChart.setOption(option);
      $this.pieChart1 = myChart;
    },
    drawPieChart2(){
      var $this = this;
      var chartDom = document.getElementById('pieChart2');
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        tooltip: {
          trigger: 'item',
          formatter(items){
            var tooltext = `<div class="counttoolTip">
            <div class="title">${items.name}</div>
            <div class="bar clearfix">
              ${items.marker}
              <span class="name">${items.seriesName}：</span>
              <span class="num">${items.value}</span>
            </div>
            `;
            return tooltext;
          }
        },
        legend: {
          show: false
          // orient: 'vertical',
          // left: 'left',
          // top: 'middle',
          // itemWidth: 8,
          // itemHeight: 8,
          // icon: "circle",
        },
        color: ["#2259e5","#3ebea7","#eca12d","#ee4747","#73c0de","#91cb74","#ff8d61","#9a60b4","#e522db","#e5d822","#5470c6","#fc8452","#fac858","#ee6666"],
        animation: false,
        series: [
          {
            name: "关键词个数",
            type: 'pie',
            radius: '75%',
            data: $this.piedata_two,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label:{
                normal:{
                    formatter: function(params){
                        var str = '';
                        str = params.name+":"+params.percent.toFixed(1)+"%";
                        return str
                    },
                    position: 'outside',
                    fontSize: 13,
                    color: "#666",
                }
              },
          }
        ]
      };
      option && myChart.setOption(option);
      $this.pieChart2 = myChart;
    },
    tabChange(inx){
      var $this = this;
      $this.nowChart = inx;
      if($this.myChart){
        $this.myChart.dispose();
      }
      $this.myChart = null;
      if($this.pieChart1){
        $this.pieChart1.dispose();
      }
      $this.pieChart1 = null;
      if($this.pieChart2){
        $this.pieChart2.dispose();
      }
      $this.pieChart2 = null;
      if(inx == 1){
        setTimeout(() => {
          $this.drawColumnChart();  
        }, 500);
        
      }else{
        setTimeout(() => {
          $this.drawPieChart1();
          $this.drawPieChart2();
        }, 500);
      }
    },
    getTimeName(num){
      var $this = this;
      var time = "";
      $this.timeList.forEach(item => {
        if(item.num == num){
          time = item.addtime;
        }
      })
      return time;
    }
  },

}
</script>
<style lang="scss" scoped>
.group-index .filter-panel .filter-list{
  padding: 20px 20px;
}
.group-index .filter-panel{
  margin-bottom: 20px;
}
  .chartShow{
    margin-top: 20px;
    padding: 20px;
    background-color: #fff;
    height: calc(100vh - 387px);
    min-height: 530px;
    #chart{
      height: calc(100vh - 427px);
      min-height: 490px;
    }
  }
  .checked_item .c_tit, .checked_item .c_name{
    font-size: 14px;
    display: inline-block;
    height: 28px;
    line-height: 28px;
    color: #1a1a1a;
  }
  .checked_item .c_name {
    font-weight: normal;
    color: #808080;
    margin-left: 4px;
  }
  .checked_item .el-checkbox{
    min-width: 140px;
    margin: 3px;
  }
  .checked_item .is-checked .c_tit, .checked_item .is-checked .c_name{
    color: #0970ff;
  }
  .group-index .filter-panel .filter-list .item-filter.group .filter-content .item-list.group .item-checkbox{
    min-width: 140px;
  }
  @media screen and (min-width: 2400px){
    .chartShow{
      height: calc(100vh - 387px);
      #chart{
        height: calc(100vh - 427px);
      }
    }
  }
  .search_btn{
    margin-left: 10px;
  }
  .result-panel{
  position: relative;
  .search,.no-data{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    font-size: 14px;
    line-height: 2;
    text-align: center;
    p{
      position: absolute;
      left: 0;
      width: 100%;
      top: 50%;
      margin-top: -20px;
    }
  }
  .search p{
    color: #999
  }
}
.group-index .filter-panel .filter-list .item-filter .filter-content .item-list .item-checkbox .icon_chart{
  margin-left: 10px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: #0970ff;
  cursor: pointer;
  display: inline-block;
  vertical-align: top;
  margin-top: 4px;
  font-size: 16px;
  i{
    font-size: 16px;
  }
}
.item-search .filter-title{
  width: 70px;
  display:inline-block;
  .txt-title{
    display: block;
    height: 28px;
    line-height: 28px;
    font-size: 14px;
    color: #666666;
    text-align: left;
  }
}
.line_box, .search_col{
  position: relative;
  .search,.no-data{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    font-size: 14px;
    line-height: 2;
    text-align: center;
    p{
      position: absolute;
      left: 0;
      width: 100%;
      top: 50%;
      margin-top: -20px;
    }
  }
  .search p{
    color: #999
  }
}
.icon_chart{
  margin-left: 5px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: #0970ff;
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
  i{
    font-size: 16px;
  }
}
.icon_num{
  display: inline-block;
  vertical-align: middle;
  width: 50px;
}
.pop_search .search_btn{
  margin-left: 10px;
}
.search_body{
  margin-top: 20px;
  position: relative;
  .seach_total{
    position: absolute;
    left: 350px;
    top: 14px;
    font-size: 13px;
  }
}
.card-content{
  position: relative;
}
.search_col{
  height: calc(80vh - 185px);
}
#columnChart{
  width: 1160px;
  height: calc(80vh - 215px);
}
.search_pie:after{
  content: "";
  display: block;
  clear: both;
}
.pie_item{
  float: left;
  width: 580px;
  .pie_title{
    text-align: center;
    font-size: 14px;
    line-height: 20px;
    color: #666;
  }
}
#pieChart1,#pieChart2{
  width: 580px;
  height: calc(80vh - 235px);
}
.table_wrap{
  width: 1160px;
  position: relative;
  height: calc(80vh - 185px);
}
.search_tab{
  .item-change{
      float:left;
      margin-right:20px;
      margin-left: 1px;
      .item-font{
          float:left;
          border:1px solid #e1e3ea;
          font-size:14px;
          color:#555555;
          padding:4px 15px;
          line-height:20px;
          margin-left:-1px;
          cursor:pointer;
          &.active,&:hover{
              color:#0970ff;
              border:1px solid #0970ff;
              background:#e0e9ff;
              position:relative;
              z-index:2;
          }
      }
  }
  .search_dw{
    float: left;
    font-size: 13px;
    color: #acacac;
    margin-top: 8px;
  }
  &:after{
    content: "";
    display: block;
    clear: both;
  }
}

.tab_p{
  margin-bottom: 20px;
}
.item_text{
  color: #606266;
  text-align: center;
  line-height: 0;
  display: inline-block;
  vertical-align: middle;
  span{
    line-height: 24px;
    &.before{
      color: #111;
    }
    &.after{
      margin-left: 4px;
    }
    &.zero{
      padding-left: 6px;
      position: relative;
      &:before{
        content: '';
        height: 2px;
        width: 6px;
        background-color: #999;
        position: absolute;
        left: 6px;
        top: 7px;
      }
    }
    &.default{
      padding-left: 10px;
      color: #999;
    }
    &.red{
      padding-left: 10px;
      color: #f97979;
      background: url(../../../assets/up.png) left center no-repeat;
      background-size: auto 10px;
    }
    &.green{
      padding-left: 10px;
      color: #6dd29a;
      background: url(../../../assets/down.png) left center no-repeat;
      background-size: auto 10px;
    }
  }
  .icon-other{
    font-size: 16px;
    color: #f97979;
    margin-right: 6px;
    cursor: pointer;
  }
}
.tips_div{
  display:inline-block;
  vertical-align: middle;
  margin-left: 10px;
  font-size: 24px;
  color: #b4b4b4;
}

.dy_red{
    color: #f2302f;
  }
</style>
<style lang="scss">
.userCount .el-table__cell{
      &.num01{
          background:#fbe5d6;
      }
      &.num02{
          background:#fff4d1;
      }
      &.num03{
          background:#e2f0d9;
      }
      &.num04{
        background: #eaf4ff;
      }
      &.num05{
        background: #f1f1f1;
      }
      // &.num06{
      //   background: #cce7f4;
      // }
}
.userCount .el-table__row.row-bg .el-table__cell{
  background-color: #f5f5f5;
}
.userCount .el-table__row.row-total .el-table__cell{
  // background-color: #fff4d1;
  color: #0970ff;
}
.el-table.dyTable{
  width: 1160px;
  border-radius:8px;
  border-left:1px solid #ebeff1;
  border-right:1px solid #ebeff1;
  display:flex;
  flex-direction:column;
  .el-table__body-wrapper{
    flex:1;
    display:flex;
    flex-direction:column;
    .el-table__empty-block{
      flex:1;
    }
  }
  &:before{display:none;}
  th.is-leaf{
    background:#e2e9ed;
    font-size: 14px;
    color:#555;
    font-weight:normal;
    border-bottom:1px solid #ebeff1;
    border-right:1px solid #ebeff1;
    line-height:20px;
  }
  th.gutter{
    background:#e2e9ed;
  }
  td{
    border-bottom:1px solid #ebeff1 !important;
    border-right:1px solid #ebeff1 !important;
    font-size:13px !important;
    color:#1a1a1a;
  }
  svg,i[class~="el-cion"]{
    font-size:21px;
  }
  .el-table__placeholder{
    display:none!important;
  }
}
.fixed-table .el-table__fixed .el-table__fixed-header-wrapper{
  border-top-left-radius: 0
}
</style>