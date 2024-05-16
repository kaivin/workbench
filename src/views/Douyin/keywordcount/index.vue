<template>
    <div class="page-root" ref="boxPane">
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
            <el-card class="box-card" shadow="hover">
              <div class="card-header" ref="headerPane">
                <div class="search-wrap" ref="searchPane">
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
                    <el-button class="search_btn" type="primary" size="small" icon="el-icon-search" :disabled="isPopSearch" @click="getSearchRes">查询</el-button>
                </div>
              </div>
              <div class="card-content" ref="tableContent">
                <div class="user_account" v-if="account_names.length > 0 && account_names.length < groupList.length">
                  <span class="account_name" v-for="item,index in account_names" :key="index"><template v-if="index > 0">、</template>{{item}}</span>
                  <span class="account_user">{{account_user}}</span>
                </div>
                <div class="user_account" v-if="account_names.length > 0 && account_names.length == groupList.length">
                  <span class="account_name">所有账号</span>
                </div>
                <div class="search_body">
                  <div class="seach_total"  :class="showXun ? 'total_xun':''">
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
                    <p class="tab_p" v-if="activeName=='second'">
                      增加的积分总计<span class="dy_red"> {{add_allscore}} </span>分<template v-for="item,index in columnData.data_addCount">
                        ，<template v-if="index == 1">其中</template>{{item.label}}为<span class="dy_red"> {{item.value}} </span>个
                      </template>。
                    </p>
                    <p class="tab_p" v-if="activeName=='third'">
                      减少的积分总计<span class="dy_red"> {{desc_allscore}} </span>分<template v-for="item,index in columnData.data_descCount">
                        ，<template v-if="index == 0">其中</template>{{item.label}}为<span class="dy_red"> {{item.value}} </span>个
                      </template>。
                    </p>
                    <el-button v-if="activeName=='second'" type="primary" size="small" class="derived" @click="showExportDialog('add')"><i class="svg-i"><svg-icon icon-class="derived" /></i>导出增加的词</el-button>
                    <el-button v-if="activeName=='third'" type="primary" size="small" class="derived" @click="showExportDialog('desc')"><i class="svg-i"><svg-icon icon-class="derived" /></i>导出减少的词</el-button>
                  </div>
                  <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
                    <el-tab-pane label="积分趋势" name="forth">
                      <div class="search_col">
                        <div class="search" v-if="isPopSearch"><p>请稍候...</p></div>
                        <div id="scoreChart"></div>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="询盘趋势" name="fifth" v-if="showXun">
                      <div class="search_col">
                        <div class="search" v-if="isPopSearch"><p>请稍候...</p></div>
                        <div class="search_tab" v-else>
                          <div class="item-change">
                            <div class="item-font" :class="nowChart == 1?'active':''" @click="tabChange(1)">月询盘统计</div>
                            <div class="item-font" :class="nowChart == 2?'active':''" @click="tabChange(2)">阶段询盘统计</div>
                          </div>
                          <div class="search_dw" v-if="nowChart == 1">
                            <el-popover
                              placement="right"
                              content="1号询盘：上个月16号到上个月月底的询盘数；15号询盘：本月1号到15号的询盘数。"
                              trigger="hover">
                              <svg-icon class="tips_div tips_div2" slot="reference" icon-class="tips"></svg-icon>
                            </el-popover>  
                          </div>
                        </div>
                        <div class="search_column" v-if="nowChart == 1">
                          <div id="xunChart"></div>
                        </div>
                        <div class="search_column" v-if="nowChart == 2">
                          <div id="xunChart2"></div>
                        </div>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="关键词等级统计" name="first">
                      <div class="search_col">
                        <div class="search" v-if="isPopSearch"><p>请稍候...</p></div>
                        <div class="search_tab" v-if="false">
                          <div class="item-change">
                            <div class="item-font" :class="nowChart == 1?'active':''" @click="tabChange(1)">排行</div>
                            <div class="item-font" :class="nowChart == 2?'active':''" @click="tabChange(2)">占比</div>
                          </div>
                        </div>
                        <div class="search_column">
                          <div id="columnChart"></div>
                        </div>
                        <div class="search_pie" v-if="nowChart == 2">
                          <div class="pie_item">
                            <div id="pieChart1"></div>
                            <p class="pie_title" v-if="!isPopSearch">增加的积分占比</p>
                          </div>
                          <div class="pie_item">
                            <div id="pieChart2"></div>
                            <p class="pie_title" v-if="!isPopSearch">减少的积分占比</p>
                          </div>
                          <div class="pie_item">
                            <div id="pieChart3"></div>
                            <p class="pie_title" v-if="!isPopSearch">改变的积分占比</p>
                          </div>
                        </div>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="积分增加的词" name="second">
                      <div class="search_col">
                        <div class="search" v-if="isPopSearch"><p>请稍候...</p></div>
                        <div class="table_wrap" v-else>
                          
                          <el-table
                            ref="addTable"
                            :data="add_list"
                            tooltip-effect="dark"
                            class="dyTable"
                            style="width: 100%"
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
                              <template #default="scope">
                                <div class="item_text item_text_rank">
                                  <span class="before">{{scope.row.rank_number}}</span>
                                  <template v-if="scope.row.hasOwnProperty('rand_cha')">
                                    <span v-if="scope.row['rand_cha'] !== 0" class="after" :class="scope.row['rand_cha'] > 0 ? 'red' : scope.row['rand_cha'] < 0 ? 'green' : 'default'">{{ Math.abs(scope.row['rand_cha']) }}</span>
                                    <span v-else class="zero"></span>
                                  </template>
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="score"
                              label="积分"
                              align="center"
                              min-width="60"
                              >
                              <template #default="scope">
                                <div class="chart_main">
                                  <div class="item_text">
                                    <span class="before">{{scope.row.score}}</span>
                                    <template v-if="scope.row.hasOwnProperty('addscore')">
                                      <span v-if="scope.row['addscore'] !== 0" class="after" :class="scope.row['addscore'] > 0 ? 'red' : scope.row['addscore'] < 0 ? 'green' : 'default'">{{ Math.abs(scope.row['addscore']) }}</span>
                                      <span v-else class="zero"></span>
                                    </template>
                                  </div>
                                </div>
                              </template>
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
                    <el-tab-pane label="积分减少的词" name="third">
                      <div class="search_col">
                        <div class="search" v-if="isPopSearch"><p>请稍候...</p></div>
                        <div class="table_wrap" v-else>
                          
                          <el-table
                            ref="descTable"
                            :data="desc_list"
                            tooltip-effect="dark"
                            class="dyTable"
                            style="width: 100%"
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
                              <template #default="scope">
                                <div class="item_text item_text_rank">
                                  <span class="before">{{scope.row.rank_number}}</span>
                                  <template v-if="scope.row.hasOwnProperty('rand_cha')">
                                    <span v-if="scope.row['rand_cha'] !== 0" class="after" :class="scope.row['rand_cha'] > 0 ? 'red' : scope.row['rand_cha'] < 0 ? 'green' : 'default'">{{ Math.abs(scope.row['rand_cha']) }}</span>
                                    <span v-else class="zero"></span>
                                  </template>
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="score"
                              label="积分"
                              align="center"
                              min-width="60"
                              >
                              <template #default="scope">
                                <div class="chart_main">
                                  <div class="item_text">
                                    <span class="before">{{scope.row.score}}</span>
                                    <template v-if="scope.row.hasOwnProperty('descscore')">
                                      <span v-if="scope.row['descscore'] !== 0" class="after" :class="scope.row['descscore'] > 0 ? 'green' : scope.row['descscore'] < 0 ? 'red' : 'default'">{{ Math.abs(scope.row['descscore']) }}</span>
                                      <span v-else class="zero"></span>
                                    </template>
                                  </div>
                                </div>
                              </template>
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
              </div>
            </el-card>
          </div>
        </div>
      </div>
      <ExportModal ref="ExportModalRef" @exportSuccess="exportDone"></ExportModal>
    </div>
  </template>
  <script>
  import { mapGetters } from 'vuex'
  import {sortByDesc, sortByAsc} from "@/utils/index"
  import ExportModal from '@/components/Excel/exportModal.vue'
  import { jsonToSheetXlsx } from '@/components/Excel/Export2Excel'
  import * as echarts from 'echarts';
  export default {
    name: 'Douyin_keywordcount',
    components: {
      ExportModal
    },
    data() {
      return {
        breadcrumbList:[],
        menuButtonPermit:[],
        pagerCount:5,
        pageSizeList:[20, 50, 100, 150, 200],
        tableHeight:200,
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
        selectedData: [],
        timeList: [],
        myChart:null,
        timeArr: [],
        columnData: {},
        add_list: [],
        desc_list: [],
        popSearch: {
          ids: [],
          start_num: "",
          end_num: ""
        },
        isPopSearch: false,
        activeName: "forth",
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
        exportValue: "add",
        fieldList: [
          { key: 'name', value: '关键词' },
          { key: 'my_level', value: '关键词等级' },
          { key: 'rank_number', value: '排名' },
          { key: 'score', value: '积分' },
          { key: 'depart', value: '部门' },
          { key: 'uname', value: '负责人' },
        ],
        account_names: [],
        account_user: "",
        groupList: [],
        add_allscore: 0,
        desc_allscore: 0,
        lineChart: null,
        xundata: [],
        xundata2: [],
        pieChart1: null,
        pieChart2: null,
        pieChart3: null,
        scoreChart:null,
        scoreData: [],
        isAccountSearch: false,
        isScoreSearch: false,
        showXun: false,
        xunChart: false,
        xunChart2: false,
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
    created(){
      var $this = this;
      $this.getBreadcrumbList();
      $this.initData();
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
        var headerHeight = $this.$refs.headerPane.offsetHeight;
        var breadcrumbHeight = $this.$refs.breadcrumbPane.offsetHeight;
        var screenHeight = $this.$refs.boxPane.offsetHeight;
        var countHeight = $this.$refs.countPane.offsetHeight;
        $this.tableHeight = screenHeight-headerHeight-countHeight-breadcrumbHeight-40-45-31;
        $this.getBrowserType();
          setTimeout(function() {
            $this.setScrollDom();
        }, 400);
      },
      // 初始化数据
      initData(){
        var $this = this;
        // $this.getUserMenuButtonPermit();
        $this.getDouyinTime();
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
              if($this.menuButtonPermit.includes('Douyin_index') || $this.menuButtonPermit.includes('Douyin_personcount')){
                $this.getDouyinTime();
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
            if($this.$route.query.id){
              $this.popSearch.ids = $this.$route.query.id.split(",");
            }
            if($this.$route.query.start_num){
              $this.popSearch.start_num = Number($this.$route.query.start_num);
            }
            if($this.$route.query.end_num){
              $this.popSearch.end_num = Number($this.$route.query.end_num);
            }
            if($this.$route.query.isall == "1"){
              $this.showXun = true;
            }else{
              $this.showXun = false;
            }
            $this.getDepartList();
            $this.getDouyinCount();
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
        });
      },
      getDepartList(){
        var $this = this;
        $this.$store.dispatch('douyin/douyinDepartlist', null).then(response=>{
          if(response){
            if(response.status){
              if(response.data){
                if(response.data.length > 0){
                  $this.groupList = response.data;
                  var uname = "";
                  var account = [];
                  var ids = $this.popSearch.ids;
                  response.data.forEach(item => {
                    if(ids.indexOf(""+item.id) > -1){
                      uname = item.uname;
                      account.push(item.name);
                    }
                  })
                  $this.account_user = uname;
                  $this.account_names = account;
                }
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
              }
            }
          }
        });
      },
      // 每页显示条数改变事件
      handleSizeChange(val) {
        this.searchData.limit = val;
        this.searchData.page = 1;
        this.initPage();
      },
      // 当前页改变事件
      handleCurrentChange(val) {
        this.searchData.page = val;
        this.initPage();
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
           $this.scrollTable.fixedTopHeight = $this.$refs.headerPane.offsetHeight+$this.$refs.countPane.offsetHeight+$this.$refs.breadcrumbPane.offsetHeight+15+20;
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
          var tableHeaderStyle = "width:"+$this.scrollPosition.width+"px;";
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
            var tableHeaderStyle = "width:"+$this.scrollPosition.width+"px;"
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
      getDouyinCount(){
        var $this = this;
        $this.isPopSearch = true;
        var formData = {};
        formData.ids = $this.popSearch.ids;
        formData.start_num = $this.popSearch.start_num;
        formData.end_num = $this.popSearch.end_num;
        $this.$store.dispatch('douyin/douyinCountInfo', formData).then(response=>{
          if(response){
            if(response.status){
              $this.isPopSearch = false;
              $this.isScoreSearch = true;
              $this.xundata = response.xundata&&response.xundata.length > 0 ? response.xundata : [];
              var xundata2 = [];
              if(response.data && response.data.length > 0){
                var resData = []
                response.data.forEach(item => {
                  var obj = {};
                  obj.addtime = item.addtime;
                  obj.score = item.user_data;
                  obj.number_one = item.one_number;
                  obj.number_two = item.two_number;
                  obj.number_three = item.three_number;
                  obj.number_four = item.four_number;
                  obj.num = item.num;
                  resData.push(obj);
                  var xunobj = {};
                  xunobj.addtime = item.addtime;
                  xunobj.number = item.xunnumber;
                  xundata2.push(xunobj);
                })
                $this.scoreData = resData.sort(sortByAsc("num"));
                $this.xundata2 = xundata2.sort(sortByAsc("num"));
                setTimeout(() => {
                  if($this.activeName == "fifth"){
                    if($this.nowChart == 1){
                      $this.drawXunChart();
                    }else{
                      $this.drawXunChart2();
                    }
                  }else if($this.activeName == "forth"){
                    $this.drawScoreChart();
                  }
                }, 500);
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
                  $this.isPopSearch=false;
                },1000);
              }
            }
          }
        });
      },
      getColumnRes(){
        var $this = this;
        $this.isPopSearch = true;
        var formData = {};
        formData.ids = $this.popSearch.ids;
        formData.start_num = $this.popSearch.start_num;
        formData.end_num = $this.popSearch.end_num;
        $this.$store.dispatch('douyin/douyinWordInfo', formData).then(response=>{
          if(response){
            $this.columnData = {};
            if(response.status){
              $this.isAccountSearch = true;
              $this.isPopSearch = false;
              $this.add_allscore = response.totalscore_add;
              $this.desc_allscore = response.totalscore_desc;
              var resObj = {};
              var data_addList = [];
              var data_descList = [];
              var data_totalList = [];
              var data_addCount = [];
              var data_descCount = [];
              var data_add_num = 0;
              var data_desc_num = 0;
              var add_allscore = 0;
              var desc_allscore = 0;
              var pie_addList = [];
              var pie_descList = [];
              var pie_totalList = [];
              if(response.add_word && response.add_word.length > 0){
                var filterAddList = [];
                // 统计每个等级个数
                var counta1 = 0;
                var counta2 = 0;
                var countb1 = 0;
                var countb2 = 0;
                var countc2 = 0;
                var countc3 = 0;
                var countd = 0;
                var addArr = [];
                // 统计每个等级积分
                var scorea1 = 0;
                var scorea2 = 0;
                var scoreb1 = 0;
                var scoreb2 = 0;
                var scorec2 = 0;
                var scorec3 = 0;
                var scored = 0;
                var addScoreArr = [];
                var pieAddScore = [];
                response.add_word.forEach(item => {
                  if(!item.addscore == 0){
                    filterAddList.push(item);
                    add_allscore += item.addscore;
                    if(item.my_level == "A1"){
                      counta1 += 1;
                      scorea1 += item.addscore;
                    }else if(item.my_level == "A2"){
                      counta2 += 1;
                      scorea2 += item.addscore;
                    }else if(item.my_level == "B1"){
                      countb1 += 1;
                      scoreb1 += item.addscore;
                    }else if(item.my_level == "B2"){
                      countb2 += 1;
                      scoreb2 += item.addscore;
                    }else if(item.my_level == "C2"){
                      countc2 += 1;
                      scorec2 += item.addscore;
                    }else if(item.my_level == "C3"){
                      countc3 += 1;
                      scorec3 += item.addscore;
                    }else if(item.my_level == "D"){
                      countd += 1;
                      scored += item.addscore;
                    }
                  }
                })
                addArr.push({label: "A1", value: counta1});
                addArr.push({label: "A2", value: counta2});
                addArr.push({label: "B1", value: countb1});
                addArr.push({label: "B2", value: countb2});
                addArr.push({label: "C2", value: countc2});
                addArr.push({label: "C3", value: countc3});
                addArr.push({label: "D", value: countd});
                addScoreArr.push(scorea1.toFixed(1));
                addScoreArr.push(scorea2.toFixed(1));
                addScoreArr.push(scoreb1.toFixed(1));
                addScoreArr.push(scoreb2.toFixed(1));
                addScoreArr.push(scorec2.toFixed(1));
                addScoreArr.push(scorec3.toFixed(1));
                addScoreArr.push(scored.toFixed(1));
                pieAddScore.push({name: "A1", value: scorea1.toFixed(1)});
                pieAddScore.push({name: "A2", value: scorea2.toFixed(1)});
                pieAddScore.push({name: "B1", value: scoreb1.toFixed(1)});
                pieAddScore.push({name: "B2", value: scoreb2.toFixed(1)});
                pieAddScore.push({name: "C2", value: scorec2.toFixed(1)});
                pieAddScore.push({name: "C3", value: scorec3.toFixed(1)});
                pieAddScore.push({name: "D", value: scored.toFixed(1)});
                data_addCount = addArr;
                data_add_num = counta1+counta2+countb1+countb2+countc2+countc3+countd;
                data_addList = addScoreArr;
                pie_addList = pieAddScore;
                $this.add_list = filterAddList;
              }
              if(response.desc_word && response.desc_word.length > 0){
                var filterDescList = [];
                // 统计减少的每个等级个数
                var counta1 = 0;
                var counta2 = 0;
                var countb1 = 0;
                var countb2 = 0;
                var countc2 = 0;
                var countc3 = 0;
                var countd = 0;
                var descArr = [];
                // 统计减少的每个等级积分
                var scorea1 = 0;
                var scorea2 = 0;
                var scoreb1 = 0;
                var scoreb2 = 0;
                var scorec2 = 0;
                var scorec3 = 0;
                var scored = 0;
                var descScoreArr = [];
                var pieDescScore = [];
                response.desc_word.forEach(item => {
                  if(!item.descscore == 0){
                    filterDescList.push(item);
                    desc_allscore += item.descscore;
                    if(item.my_level == "A1"){
                      counta1 += 1;
                      scorea1 += item.descscore;
                    }else if(item.my_level == "A2"){
                      counta2 += 1;
                      scorea2 += item.descscore;
                    }else if(item.my_level == "B1"){
                      countb1 += 1;
                      scoreb1 += item.descscore;
                    }else if(item.my_level == "B2"){
                      countb2 += 1;
                      scoreb2 += item.descscore;
                    }else if(item.my_level == "C2"){
                      countc2 += 1;
                      scorec2 += item.descscore;
                    }else if(item.my_level == "C3"){
                      countc3 += 1;
                      scorec3 += item.descscore;
                    }else if(item.my_level == "D"){
                      countd += 1;
                      scored += item.descscore;
                    }
                  }
                })
                descArr.push({label: "A1", value: counta1});
                descArr.push({label: "A2", value: counta2});
                descArr.push({label: "B1", value: countb1});
                descArr.push({label: "B2", value: countb2});
                descArr.push({label: "C2", value: countc2});
                descArr.push({label: "C3", value: countc3});
                descArr.push({label: "D", value: countd});
                descScoreArr.push(-scorea1.toFixed(1));
                descScoreArr.push(-scorea2.toFixed(1));
                descScoreArr.push(-scoreb1.toFixed(1));
                descScoreArr.push(-scoreb2.toFixed(1));
                descScoreArr.push(-scorec2.toFixed(1));
                descScoreArr.push(-scorec3.toFixed(1));
                descScoreArr.push(-scored.toFixed(1));
                pieDescScore.push({name: "A1", value: scorea1.toFixed(1)});
                pieDescScore.push({name: "A2", value: scorea2.toFixed(1)});
                pieDescScore.push({name: "B1", value: scoreb1.toFixed(1)});
                pieDescScore.push({name: "B2", value: scoreb2.toFixed(1)});
                pieDescScore.push({name: "C2", value: scorec2.toFixed(1)});
                pieDescScore.push({name: "C3", value: scorec3.toFixed(1)});
                pieDescScore.push({name: "D", value: scored.toFixed(1)});
                data_descCount = descArr;
                data_desc_num = counta1+counta2+countb1+countb2+countc2+countc3+countd;
                data_descList = descScoreArr;
                pie_descList = pieDescScore;
                $this.desc_list = filterDescList;
              }
              var stage = ["A1","A2","B1","B2","C2","C3","D"];
              // 计算总数
              data_addList.forEach((item,index) => {
                var res = Number(item)+Number(data_descList[index]);
                data_totalList.push(Number(res).toFixed(1));
                pie_totalList.push({name: stage[index], value: Number(res).toFixed(1)});
              })
              resObj.data_addList = data_addList;
              resObj.data_descList = data_descList;
              resObj.data_totalList = data_totalList;
              resObj.pie_addList = pie_addList;
              resObj.pie_descList = pie_descList;
              resObj.pie_totalList = pie_totalList;
              resObj.data_addCount = data_addCount;
              resObj.data_descCount = data_descCount;
              resObj.data_add_num = data_add_num;
              resObj.data_desc_num = data_desc_num;
              resObj.name = stage;
              $this.columnData = resObj;
              if($this.activeName == "first"){
                $this.drawColumnChart();
              }else{
                // $this.drawPieChart1();
                // $this.drawPieChart2();
                // $this.drawPieChart3();
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
                  $this.isPopSearch=false;
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
        series=[{
            type: 'bar',
            data: $this.columnData.data_addList,
            barWidth: '28px',
            name: "增加积分",
            itemStyle: {
              color: "#2259e5"
            },
            stack: 'all',
            label: {
                show: true,
                position: 'top',
            },
        },{
            type: 'bar',
            data: $this.columnData.data_descList,
            barWidth: '28px',
            name: "减少积分",
            itemStyle: {
              color: "#ee4747"
            },
            stack: 'all',
            label: {
                show: true,
                position: 'bottom',
            },
        },{
            type: 'line',
            data: $this.columnData.data_totalList,
            name: "积分改变",
            itemStyle:{
              color: '#eca12d',
              borderColor: "#eca12d",
              borderWidth: 1
            },
            lineStyle:{
              color: "#eca12d",
              width: 1
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
                        // var pernum = "";
                        // if(i == 0){
                        //   if($this.add_allscore && $this.add_allscore > 0){
                        //     pernum = (params[i].value*100/$this.add_allscore).toFixed(1)+"%"
                        //   }else{
                        //     prenum = "0%"
                        //   }
                        // }
                        // if(i == 1){
                        //   if($this.desc_allscore && $this.desc_allscore > 0){
                        //     pernum = (params[i].value*100/$this.columnData.desc_allscore).toFixed(1)+"%"
                        //   }else{
                        //     prenum = "0%"
                        //   }
                        // }
                        returnData += `<div class="bar clearfix" style="margin-top:5px">
                          <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${params[i].color};"></span>
                          <span>${params[i].seriesName}</span>
                          <span>：${params[i].value}</span>
                          </div>
                          `;
                      }
                  returnData +=`</div>`;
                  return returnData;
            }
          },
          grid: {
              top:'35',
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
              name: "单位（分）",
              nameTextStyle: {
                color: "#b4b4b4",
                nameLocation: "start",
              },
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
          },
          animation: false,
          series:series,
        }
        option && myChart.setOption(option);
        $this.myChart = myChart;
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
            show: false,
            orient: 'vertical',
            right: 'right',
            top: 'middle',
            itemWidth: 8,
            itemHeight: 8,
            icon: "circle",
          },
          color: ["#2259e5","#3ebea7","#eca12d","#ee4747","#73c0de","#91cb74","#ff8d61","#9a60b4","#e522db","#e5d822","#5470c6","#fc8452","#fac858","#ee6666"],
          animation: false,
          series: [
            {
              name: '增加的积分',
              type: 'pie',
              radius: '60%',
              data: $this.columnData.pie_addList,
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
            show: false,
            orient: 'vertical',
            right: 'right',
            top: 'middle',
            itemWidth: 8,
            itemHeight: 8,
            icon: "circle",
          },
          color: ["#2259e5","#3ebea7","#eca12d","#ee4747","#73c0de","#91cb74","#ff8d61","#9a60b4","#e522db","#e5d822","#5470c6","#fc8452","#fac858","#ee6666"],
          animation: false,
          series: [
            {
              name: '减少的积分',
              type: 'pie',
              radius: '60%',
              data: $this.columnData.pie_descList,
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
      drawPieChart3(){
        var $this = this;
        var chartDom = document.getElementById('pieChart3');
        var myChart = echarts.init(chartDom);
        var option;
        let changeData = $this.columnData.pie_totalList.map((item) => {
          let changeItem = {};
          $this.deepCopyData(changeItem, item);
          return changeItem;
        });
        changeData.map((item) => {
          for (let key in item) {
            if (item[key] < 0) {
              item[key] = JSON.stringify(Math.abs(item[key]));
            }
          }
        });
        option = {
          tooltip: {
            trigger: 'item',
            formatter(items){
              var value = "";
              if ($this.columnData.pie_totalList[items.dataIndex].value < 0) {
                value = "-"+items.value;
              }else{
                value = items.value;
              }
              var tooltext = `<div class="counttoolTip">
              <div class="title">${items.name}</div>
              <div class="bar clearfix">
                ${items.marker}
                <span class="name">${items.seriesName}：</span>
                <span class="num">${value}</span>
              </div>
              `;
              return tooltext;
            }
          },
          legend: {
            show: false,
            orient: 'vertical',
            right: 'right',
            top: 'middle',
            itemWidth: 8,
            itemHeight: 8,
            icon: "circle",
          },
          color: ["#2259e5","#3ebea7","#eca12d","#ee4747","#73c0de","#91cb74","#ff8d61","#9a60b4","#e522db","#e5d822","#5470c6","#fc8452","#fac858","#ee6666"],
          animation: false,
          series: [
            {
              name: '改变的积分',
              type: 'pie',
              radius: '60%',
              data: changeData,
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
                          if ($this.columnData.pie_totalList[params.dataIndex].value < 0) {
                            str = params.name+":-"+params.percent.toFixed(1)+"%";
                          }else{
                            str = params.name+":"+params.percent.toFixed(1)+"%";
                          }
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
        $this.pieChart3 = myChart;
      },
      deepCopyData(newobj, oldobj){
        for (let k in oldobj) {
          let item = oldobj[k];
          if (item instanceof Array) {
            newobj[k] = [];
            deepCopy(newobj[k], item);
          } else if (item instanceof Object) {
            newobj[k] = {};
            deepCopy(newobj[k], item);
          } else {
            newobj[k] = item;
          }
        }
      },
      // 曲线图
      drawScoreChart(){
        var $this = this;
        var chartDom = document.getElementById('scoreChart');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          grid:{
            left: '50',
            top:'35',
            right:'18',
            bottom: '30'
          },
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
              var res = `<div class="toolDiv">
                    <div class="tooltitle">${params[0].name}</div>
                    <div class="bar clearfix">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#0970ff;"></span>
                      <span>${params[0].seriesName}：</span>
                      <span>${params[0].data.score}</span>
                    </div>
                    <div class="bar clearfix">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;"></span>
                      <span>数量：</span>
                      <span>${params[0].data.number_one}<span style="color: #999"> (1-5名)</span></span>
                      <span style="margin-left: 10px;">${params[0].data.number_two}<span style="color: #999"> (6-10名)</span></span>
                      <span style="margin-left: 10px;">${params[0].data.number_three}<span style="color: #999"> (11-15名)</span></span>
                      <span style="margin-left: 10px;">${params[0].data.number_four}<span style="color: #999"> (16-20名)</span></span>
                    </div>
                  </div>`;
                return res;
            }
          },
          xAxis: {
            type: 'category',
            name: "日期",
            axisLine:{
              lineStyle:{
                color: "#dedede"
              }
            },
            axisLabel:{
              color: "#888"
            },
          },
          yAxis: {
            type: 'value',
            name: "单位（分）",
            nameTextStyle: {
              color: "#b4b4b4",
              nameLocation: "start",
            },
            axisLabel:{
              color: "#888"
            }
          },
          animation: false,
          dataset:{
            source: $this.scoreData,  
          },
          series: [
            {
              name: "积分",
              type: 'line',
              symbol: 'circle',
              symbolSize: '5',
              label:{
                show: true,
                position: 'top',
                distance: '5'
              },
              itemStyle:{
                color: '#fff',
                borderColor: "#0970ff",
                borderWidth: 1
              },
              lineStyle:{
                color: "#0970ff",
                width: 1
              },
              emphasis:{
                lineStyle: {
                  width: 2,
                },
                itemStyle:{
                  borderWidth: 2
                }
              }
            }
          ]
        };
        option && myChart.setOption(option);
        $this.scoreChart = myChart;
      },
      getPrevTime(){
        var $this = this;
        var prev = 0;
        var end = $this.searchData.num;
        $this.timeArr.forEach(item => {
          if(item > prev && item < end){
            prev = item;
          }
        })
        return prev;
      },
      tabChange(inx){
        var $this = this;
        $this.nowChart = inx;
        if($this.xunChart){
          $this.xunChart.dispose();
        }
        $this.xunChart = null;
        if($this.xunChart2){
          $this.xunChart2.dispose();
        }
        $this.xunChart2 = null;
        if(inx == 1){
          setTimeout(() => {
            $this.drawXunChart();  
          }, 500);
          
        }else{
          setTimeout(() => {
            $this.drawXunChart2();
          }, 500);
        }
      },
      tabChange2(inx){
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
        if($this.pieChart3){
          $this.pieChart3.dispose();
        }
        $this.pieChart3 = null;
        if(inx == 1){
          setTimeout(() => {
            $this.drawColumnChart();  
          }, 500);
          
        }else{
          setTimeout(() => {
            $this.drawPieChart1();
            $this.drawPieChart2();
            $this.drawPieChart3();
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
      },
      showExportDialog(str) {
        var $this = this;
        $this.exportValue = str;
        $this.$refs.ExportModalRef.showDialog({ fieldList: $this.fieldList, hasSelected: false, hasData: false })
      },
      exportDone(obj) {
        var $this = this;
        const filename = obj.filename
        const customData = []
        let header = null
        const bookType = obj.fileType
        const headerSort = obj.sort
        if (obj.headerType === 'custom') {
          header = obj.header
        }
        var resData = [];
        if($this.exportValue == "add"){
          resData = $this.add_list;
        }else{
          resData = $this.desc_list;
        }
        resData.forEach((item) => {
          const itemObj = {}
          headerSort.forEach((current) => {
            itemObj[current] = item[current]
          })
          customData.push(itemObj)
        })
        jsonToSheetXlsx({
          data: customData,
          header: header,
          filename: filename,
          json2sheetOpts: {
            // 指定顺序
            header: headerSort
          },
          write2excelOpts: {
            bookType
          }
        })
      },
      tabClick(e){
        var $this = this;
        if(e.name == "first" || e.name == "second" || e.name == "third"){
          if($this.myChart){
            $this.myChart.dispose();
          }
          $this.myChart=null;
          if(!$this.isAccountSearch){
            $this.getColumnRes();
          }
          if(e.name == 'first'){
            setTimeout(() => {
              $this.drawColumnChart();  
            }, 300);
          }
        }else if(e.name == "forth"||e.name == "fifth"){
          if($this.scoreChart){
            $this.scoreChart.dispose();
          }
          $this.scoreChart = null;
          if($this.xunChart){
            $this.xunChart.dispose();
          }
          $this.xunChart = null;
          if($this.xunChart2){
            $this.xunChart2.dispose();
          }
          $this.xunChart2 = null;
          if(!$this.isScoreSearch){
            $this.getDouyinCount();
          }
          if(e.name == 'forth'){
            setTimeout(() => {
              $this.drawScoreChart();  
            }, 300);
          }
          if(e.name == 'fifth'){
            setTimeout(() => {
              if($this.nowChart == 1){
                $this.drawXunChart();  
              }else{
                $this.drawXunChart2();  
              }
            }, 300);
          }
        }
        
        if(e.name == "second"){
          $this.$nextTick(() => {
            $this.$refs.addTable.doLayout()
          })
        }else if(e.name == "third"){
          $this.$nextTick(() => {
            $this.$refs.descTable.doLayout()
          })
        }
      },
      getSearchRes(){
        var $this = this;
        $this.isAccountSearch = false;
        $this.isScoreSearch = false;
        if($this.myChart){
          $this.myChart.dispose();
        }
        $this.myChart=null;
        if($this.scoreChart){
          $this.scoreChart.dispose();
        }
        $this.scoreChart = null;
        if($this.xunChart){
          $this.xunChart.dispose();
        }
        $this.xunChart = null;
        if($this.activeName == "forth" || $this.activeName == "fifth"){
          $this.getDouyinCount();
        }else{
          $this.getColumnRes();
        }
      },
      // 询盘
      drawXunChart(){
        var $this = this;
        var chartDom = document.getElementById('xunChart');
        var myChart = echarts.init(chartDom);
        var option;
        var timeList = [];
        var xunList = [];
        var scoreList = [];
        $this.xundata.forEach(item => {
          timeList.push(item.date);
          xunList.push(item.number);
        })
        timeList.forEach(item => {
          var score = $this.getScoreData(item);
          scoreList.push(score);
        })
        option = {
          grid:{
            left: '45',
            top:'35',
            right:'45',
            bottom: '25'
          },
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
            var res = `<div class="toolDiv">
                  <div class="tooltitle">${params[0].name}</div>`;
                  params.forEach(item => {
                    res +=`<div class="bar clearfix">
                          <span style="display:inline-block;vertical-align:top;margin-top:4px;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${item.borderColor};"></span>
                          <span>${item.seriesName}：</span>
                          <span>${item.value}</span>
                        </div>`;
                  })
                return res;
            }
          },
          xAxis: {
            type: 'category',
            name: "日期",
            axisLine:{
              lineStyle:{
                color: "#dedede"
              }
            },
            axisLabel:{
              color: "#888"
            },
            data: timeList,
          },
          yAxis: [
            {
              type: 'value',
              name: "单位（个）",
              nameTextStyle: {
                color: "#b4b4b4",
                nameLocation: "start",
              },
              alignTicks: true,
              axisLabel:{
                color: "#888"
              },
              
            },
            {
              type: 'value',
              name: "单位（分）",
              nameTextStyle: {
                color: "#b4b4b4",
                nameLocation: "end",
              },
              alignTicks: true,
              axisLabel:{
                color: "#888"
              },
            },
          ],
          animation: false,
          series: [
            {
              name: "询盘个数",
              data: xunList,
              type: 'line',
              symbol: 'circle',
              symbolSize: '5',
              label:{
                show: true,
                position: 'top',
                distance: '5'
              },
              itemStyle:{
                color: '#fff',
                borderColor: "#0970ff",
                borderWidth: 1
              },
              lineStyle:{
                color: "#0970ff",
                width: 1
              },
              emphasis:{
                lineStyle: {
                  width: 2,
                },
                itemStyle:{
                  borderWidth: 2
                }
              }
            },
            {
              name: "积分",
              data: scoreList,
              type: 'line',
              symbol: 'circle',
              symbolSize: '5',
              yAxisIndex: 1,
              label:{
                show: true,
                position: 'top',
                distance: '5'
              },
              itemStyle:{
                color: '#fff',
                borderColor: "#3ebea7",
                borderWidth: 1
              },
              lineStyle:{
                color: "#3ebea7",
                width: 1
              },
              emphasis:{
                lineStyle: {
                  width: 2,
                },
                itemStyle:{
                  borderWidth: 2
                }
              }
            },
          ]
        };
        option && myChart.setOption(option);
        $this.xunChart = myChart;
      },
      drawXunChart2(){
        var $this = this;
        var chartDom = document.getElementById('xunChart2');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          grid:{
            left: '45',
            top:'35',
            right:'15',
            bottom: '25'
          },
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
              var res = `<div class="toolDiv">
                    <div class="tooltitle">${params[0].name}</div>
                    <div class="bar clearfix">
                      <span style="display:inline-block;vertical-align:top;margin-top:4px;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#0970ff;"></span>
                      <span>${params[0].seriesName}：</span>
                      <span>${params[0].data.number}</span>
                    </div>`;
                return res;
            }
          },
          xAxis: {
            type: 'category',
            name: "日期",
            axisLine:{
              lineStyle:{
                color: "#dedede"
              }
            },
            axisLabel:{
              color: "#888"
            },
          },
          yAxis: {
            type: 'value',
            name: "单位（个）",
            nameTextStyle: {
              color: "#b4b4b4",
              nameLocation: "start",
            },
            axisLabel:{
              color: "#888"
            }
          },
          animation: false,
          dataset:{
            source: $this.xundata2,  
          },
          series: [
            {
              name: "询盘个数",
              type: 'line',
              symbol: 'circle',
              symbolSize: '5',
              label:{
                show: true,
                position: 'top',
                distance: '5'
              },
              itemStyle:{
                color: '#fff',
                borderColor: "#0970ff",
                borderWidth: 1
              },
              lineStyle:{
                color: "#0970ff",
                width: 1
              },
              emphasis:{
                lineStyle: {
                  width: 2,
                },
                itemStyle:{
                  borderWidth: 2
                }
              }
            }
          ]
        };
        option && myChart.setOption(option);
        $this.xunChart2 = myChart;
      },
      getScoreData(data){
        var $this = this;
        var score = 0;
        var hasScore = 0;
        $this.scoreData.forEach(item => {
          if(item.addtime == data){
            hasScore = 1;
            score = item.score
          }
        })
        if(hasScore == 1){
          return score
        }else{
          var prevTime = "";
          var nextTime = "";
          var prevScore = 0;
          var nextScore = 0;
          $this.scoreData.forEach(item => {
            if(prevTime){
              if(new Date(item.addtime) > new Date(prevTime) && new Date(item.addtime) < new Date(data)){
                prevTime = item.addtime;
                prevScore = item.score;
              }
            }else{
              if(new Date(item.addtime) < new Date(data)){
                prevTime = item.addtime;
                prevScore = item.score;
              }
            }
            if(nextTime){
              if(new Date(item.addtime) < new Date(nextTime) && new Date(item.addtime) > new Date(data)){
                nextTime = item.addtime;
                prevScore = item.score;
              }
            }else{
              if(new Date(item.addtime) > new Date(data)){
                nextTime = item.addtime;
                nextScore = item.score;
              }
            }
          })
          if(prevTime){
            return prevScore
          }else{
            return nextScore
          }
        }
      },
    }
  }
  </script>
  <style lang="scss" scoped>
  .el-table.SiteTable .table-button .el-button{
    margin: 0;
  }
  .search-wrap{
    background-color: #fff;
    padding: 20px;
    margin-bottom: 20px;
    .item-search{
      float:left;
      padding: 10px 10px 10px 0;
      span{
        font-size: 14px;
        line-height: 28px;
      }
      .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner {
        width: 100% !important
      }
      .el-checkbox__label{
        padding-left: 6px;
      }
      .el-checkbox.is-bordered.el-checkbox--medium{
        height: 32px;
        padding-top: 6px;
      }
      .item-label{
        line-height: 32px;
        font-size: 14px;
        color: #606266;
      }
    }
    .input-panel{
      width: 210px;
    }
    // .select-panel{
    //   width: 140px;
    // }
    .search_btn{
      margin-left: 10px;
    }
  }
  .el-table.SiteTable svg{
    font-size: 20px;
  }
  .box-card .el-card__header{
    padding: 0;
    background-color: transparent;
  }
  .dy_red{
      color: #f2302f;
    }
  .score_num{
    display: inline-block;
    vertical-align: middle;
    width: 40px;
  }
  
  #chart{
    width: 100%;
    height: 400px;
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
  
  .pop_search .search_btn{
    margin-left: 10px;
  }
  .card-content{
    padding: 20px;
    background: #fff;
    border-radius: 0;
  }
  .search_body{
    position: relative;
    .seach_total{
      position: absolute;
      z-index: 33;
      left: 500px;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      .derived{
        padding: 8px 12px;
      }
      .tips_div{
        display:inline-block;
        vertical-align: middle;
        font-size: 20px;
        color: #b4b4b4;
      }
    }
    .total_xun{
      left: 600px;
    }
  }
  .user_account{
    line-height: 20px;
    margin-bottom: 18px;
    .account_name{
      color: #1a1a1a;
      font-size: 17px;
      font-weight: bold;
      display: inline-block;
      vertical-align: top;
    }
    .account_user{
      color: #444444;
      font-size: 13px;
      display: inline-block;
      margin-left: 10px;
    }
  }
  .search_pie:after{
    content: "";
    display: block;
    clear: both;
  }
  #columnChart{
    width: 100%;
    // height: calc(100vh - 434px);
    height: calc(100vh - 398px);
  }
  #scoreChart{
    width: 100%;
    height: calc(100vh - 398px);
  }
  #xunChart{
    width: 100%;
    height: calc(100vh - 440px);
  }
  #xunChart2{
    width: 100%;
    height: calc(100vh - 440px);
  }
  .search_col{
    height: calc(100vh - 398px);
  }
  .table_wrap{
    width: 100%;
    position: relative;
    height: calc(100vh - 398px);
  } 
  .tab_p{
    display: inline-block;
    margin-left: 10px;
    margin-right: 5px;
  }
  .item_text{
    color: #606266;
    line-height: 0;
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    span{
      line-height: 24px;
      float:left;
      &.before{
        color: #111;
        width: 36px;
        text-align: center;
      }
      &.after{
        width: 40px;
        text-align: center;
      }
      &.zero{
        width: 40px;
        height: 24px;
        position: relative;
        &:before{
          content: '';
          height: 2px;
          width: 6px;
          background-color: #999;
          position: absolute;
          left: 17px;
          top: 10px;
        }
      }
      &.default{
        padding-left: 10px;
        color: #999;
      }
      &.red{
        color: #f97979;
        &:before{
          content: "";
          display: inline-block;
          vertical-align: middle;
          width: 10px;
          height: 24px;
          background: url(../../../assets/up.png) left 6px no-repeat;
          background-size: auto 10px;
        }
      }
      &.green{
        color: #6dd29a;
        &:before{
          content: "";
          display: inline-block;
          vertical-align: middle;
          width: 10px;
          height: 24px;
          background: url(../../../assets/down.png) left 6px no-repeat;
          background-size: auto 10px;
        }
      }
    }
    .icon-other{
      font-size: 16px;
      color: #f97979;
      margin-right: 6px;
      cursor: pointer;
    }
    &:after{
      content: "";
      display: block;
      clear: both;
    }
  }
  .item_text_rank{
    span{
      &.before{
        width: 30px;
      }
      &.after{
        width: 32px;
      }
      &.zero{
        width:32px;
        &:before{
          left: 13px;
        }
      }
    }
  }
  .chart_main{
    position: relative;
    .icon_chart{
      margin-left: 10px;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      display: inline-block;
      vertical-align: middle;
      color: #0970ff;
      cursor: pointer;
      i{
        font-size: 16px;
      }
    }
  }
  .search_tab{
    .item-change{
        float:left;
        margin-left: 1px;
        margin-left: 20px;
        margin-bottom: 10px;
        .item-font{
            float:left;
            border:1px solid #e1e3ea;
            font-size:13px;
            color:#555555;
            padding:5px 12px;
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
      margin-top: 6px;
    }
    .tips_div2{
      display:inline-block;
      vertical-align: middle;
      margin-left: 10px;
      font-size: 20px;
      color: #b4b4b4;
      cursor: pointer;
    }
    &:after{
      content: "";
      display: block;
      clear: both;
    }
}
.search_pie:after{
  content: "";
  display: block;
  clear: both;
}
.pie_item{
  float: left;
  width: 33.3%;
  .pie_title{
    text-align: center;
    font-size: 14px;
    line-height: 20px;
    color: #666;
  }
  #pieChart1,#pieChart2,#pieChart3{
    width: 100%;
    height: calc(100vh - 454px);
  }
}
  </style>
  <style lang="scss" > 
  .el-table__cell.stripe{
    background: #fafafa;
  }
  
  .el-table__cell.stripe-all{
    background: #f2f6f9;
  }
  
  .el-table--border th.el-table__cell{
    border-bottom: 1px solid #ebeff1;
  }
  .el-table--border .el-table__cell {
      border-right: 1px solid #ebeff1;
  }
  .el-table th.el-table__cell{
    font-weight: normal;
    color: #111;
  }
  .el-tooltip__popper.is-light{
    color: #606266!important;
  }
  .el-message{
    max-width: 380px;
    min-width: 380px!important;
  }
  
  .el-table.dyTable{
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
  
  </style>