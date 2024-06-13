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
                <div class="item-search item-check">
                  <el-checkbox v-model="searchData.all_name" label="全公司" border @change="searchResult" />
                </div>
                <div class="item-search">
                  <el-select v-model="searchData.num" size="small" clearable placeholder="请选择日期" class="select-panel" @change="selectedTimeChange">
                      <el-option
                          v-for="item in timeList"
                          :key="item.num"
                          :label="item.addtime"
                          :value="item.num">
                      </el-option>
                  </el-select>
                </div>
                <div class="item-search">
                  <el-select v-model="searchData.sort" size="small" clearable placeholder="排序方式" class="select-panel" @change="searchResult">
                      <el-option
                          v-for="item in sortList"
                          :key="item.label"
                          :label="item.label"
                          :value="item.value">
                      </el-option>
                  </el-select>
                </div>
                <div class="item-search">
                  <el-select v-model="searchData.my_level" size="small" clearable placeholder="关键词等级" class="select-panel" @change="searchResult">
                      <el-option
                          v-for="item in levelList"
                          :key="item.label"
                          :label="item.label"
                          :value="item.value">
                      </el-option>
                  </el-select>
                </div>
                <div class="item-search">
                  <el-input
                      class="input-panel"
                      size="small"
                      placeholder="请输入关键词"
                      v-model="searchData.keyword"
                      @keyup.enter.native="searchResult"
                      @clear="searchResult"
                      clearable>
                  </el-input>
                </div>
                <div class="item-search">
                  <el-input
                      class="input-panel"
                      size="small"
                      placeholder="请输入快手账号id"
                      v-model="searchData.nickname"
                      @keyup.enter.native="searchResult"
                      @clear="searchResult"
                      clearable>
                  </el-input>
                </div>
                <div class="item-search">
                  <el-button class="item-input" :class="isSearchResult?'isDisabled':''" :disabled="isSearchResult" type="primary" size="small" icon="el-icon-search" @click="searchResult">查询</el-button>
                  <el-button type="info" class="resetBtn" size="small" v-on:click="resetData()">重置</el-button>
                  <el-button type="warning" size="small" class="exportBtn derived" @click="showExportDialog"><i class="svg-i"><svg-icon icon-class="derived" /></i>导出数据</el-button>
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
              </div>
            </div>
            <div class="kuaishou_count" ref="countPane">
              <div class="dy_box">
                <div class="dy_item" v-for="item,index in scoreList" :key="item.id">
                  <span class="dy_item_s" @click="searchByName(item)">
                    <span class="rank">{{index<9?'0'+(index+1):index+1}}.</span>
                    <span class="cname">{{item.name}}</span>
                    <span class="uname">[{{item.department}}-{{item.uname}}]</span>：<span class="score">{{item.score}}</span>
                  </span>
                  <el-tooltip content="点击查看积分趋势" placement="right-start" effect="light">
                    <span class="dy_item_c" @click="showAccountChart(item)"><svg-icon icon-class="line2" /></span>
                  </el-tooltip>
                </div>
                <div class="dy_item dy_red">
                  积分总计：{{scoreCount}} 
                  <el-tooltip content="点击查看总积分趋势" placement="right-start" effect="light">
                    <span class="dy_item_c" @click="getTotalCountData()"><svg-icon icon-class="line2" /></span>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <div class="dy_res" v-if="checkBtnShow && nick_res.length > 0">
              <p class="res_p">
                <span class="color_01" v-if="searchData.nickname">{{searchData.name}}[{{searchData.department}}-{{searchData.uname}}]</span>
                <span class="color_01" v-else>以上所有账号</span>
                的关键词中：<span v-for="item,index in nick_res" :key="index"><i v-if="index > 0">，</i>{{item.name}}有<strong class="color_02" >{{item.value}}</strong>个</span>。
                <span class="word_count" v-if="add_word.length > 0 || desc_word.length > 0" >
                  <template v-if="searchData.num">当前选中的日期</template>对比上次，
                </span>
                <span v-if="add_word.length > 0">新增的词有<strong class="color_02" >{{add_word.length}}</strong>个</span><span v-if="add_word.length > 0 && desc_word.length > 0">，</span>
                <span v-if="desc_word.length > 0">减少的词有<strong class="color_02" >{{desc_word.length}}</strong>个</span>。
                <el-button type="info" plain size="mini" class="more_btn" @click="showColumnChart">查看详情</el-button>
              </p>
            </div>
            <div class="card-content" ref="tableContent">
              <div class="table-wrapper" v-bind:class="scrollPosition.isFixed?'fixed-table':''">
                <div class="table-mask"></div>
                    <el-table
                      ref="simpleTable"
                      :data="tableData"
                      tooltip-effect="dark"
                      class="SiteTable"
                      style="width: 100%"
                      :style="'min-height:'+tableHeight+'px;'"
                      row-key="id"
                      @selection-change="handleSelectionChange"
                      >
                      <el-table-column type="selection" align="center" width="48"></el-table-column>
                      <el-table-column align="center" width="80" prop="id" label="ID"></el-table-column>
                      <el-table-column
                        prop="name"
                        label="关键词"
                        min-width="120"
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
                        width="100"
                        >
                      </el-table-column>
                      <el-table-column
                        prop="rank_number"
                        label="排名"
                        align="center"
                        width="100"
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
                        v-if="searchData.all_name"
                        prop="depart"
                        align="center"
                        label="部门"
                        width="100"
                        >
                      </el-table-column>
                      <el-table-column
                        v-if="searchData.all_name"
                        prop="uname"
                        align="center"
                        label="负责人"
                        width="90"
                        >
                      </el-table-column>
                      <el-table-column
                        prop="score"
                        align="center"
                        label="积分"
                        width="140"
                        >
                        <template #default="scope">
                          <div class="chart_main">
                            <div class="item_text">
                              <span class="before">{{scope.row.score}}</span>
                              <template v-if="scope.row.hasOwnProperty('score_cha')">
                                <span v-if="scope.row['score_cha'] !== 0" class="after" :class="scope.row['score_cha'] > 0 ? 'red' : scope.row['score_cha'] < 0 ? 'green' : 'default'">{{ Math.abs(scope.row['score_cha']).toFixed(1) }}</span>
                                <span v-else class="zero"></span>
                              </template>
                            </div>
                            <el-tooltip content="点击查看积分趋势" placement="right-start" effect="light">
                              <span class="icon_chart" @click="showLineChart(scope.row)"><svg-icon icon-class="line2" alt="" /></span>
                            </el-tooltip>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="desc"
                        label="标题"
                        min-width="460"
                        >
                      </el-table-column>
                      <el-table-column
                        prop="nickname"
                        label="名称"
                        min-width="150"
                        >
                      </el-table-column>
                    </el-table>
                </div>
                <div class="out_box fixed" v-if="scrollPosition.maxScrollWidth>0&&scrollPosition.isPC" :style="'left:'+scrollPosition.left+'px;width:'+scrollPosition.width+'px;bottom:'+scrollPosition.fixedBottom+'px;'" ref="out_box">
                    <div class="in_box" @mousedown="mouseDownHandler" :style="'left:'+scrollPosition.insetLeft+'px;width:'+scrollPosition.insetWidth+'px;'" ref="in_box" ></div>
                </div>
            </div>
            <div class="pagination-panel" v-if="totalDataNum>50" ref="pagePane">
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
    <ExportModal ref="ExportModalRef" @exportSuccess="exportDone"></ExportModal>
    <el-dialog :title="dialogTitle" top="20vh" custom-class="chart-line" :visible.sync="isChartShow" :before-close="handleClose" :width="dialogWidth">
      <div class="line_box" v-if="charttype == 1">
        <div class="search" v-if="isSearchLine"><p>请稍候...</p></div>
        <div class="no-data" v-if="!isSearchLine && lineData.length == 0 ">暂无数据</div>
        <div id="chart"></div>
      </div>
      <div class="line_box" v-if="charttype == 2">
        <div class="search" v-if="isSearchLine"><p>请稍候...</p></div>
        <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
          <el-tab-pane label="积分趋势" name="first">
            <div class="search_column">
              <div class="search" v-if="isPopSearch"><p>请稍候...</p></div>
              <div id="chart"></div>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="menuButtonPermit.includes('Kuaishou_xun')" label="询盘趋势" name="second">
            <div class="search_tab">
              <div class="item-change">
                <div class="item-font" :class="nowChart == 1?'active':''" @click="tabChange(1)">月询盘统计</div>
                <div class="item-font" :class="nowChart == 2?'active':''" @click="tabChange(2)">阶段询盘统计</div>
              </div>
              <div class="search_dw" v-if="nowChart == 1">
                <el-popover
                  placement="right"
                  content="1号询盘：上个月16号到上个月月底的询盘数；15号询盘：本月1号到15号的询盘数。询盘提供者字段请填写提供者姓名，否则统计不上。"
                  trigger="hover">
                  <svg-icon class="tips_div tips_div2" slot="reference" icon-class="tips"></svg-icon>
                </el-popover>  
              </div>
            </div>
            <div class="search_column" v-if="nowChart == 1">
              <div class="search" v-if="isPopSearch"><p>请稍候...</p></div>
              <div id="xunChart"></div>
            </div>
            <div class="search_column" v-if="nowChart == 2">
              <div class="search" v-if="isPopSearch"><p>请稍候...</p></div>
              <div id="xunChart2"></div>
            </div>
          </el-tab-pane>
        </el-tabs>
        
          
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ExportModal from '@/components/Excel/exportModal.vue'
import { jsonToSheetXlsx } from '@/components/Excel/Export2Excel'
import {sortByDesc, sortByAsc} from "@/utils/index"
import * as echarts from 'echarts';
export default {
  name: 'Kuaishou_index',
  components: {
    ExportModal
  },
  data() {
    return {
      breadcrumbList:[],
      menuButtonPermit:[],
      pagerCount:5,
      pageSizeList:[20, 50, 100, 150, 200],
      totalDataNum: 0,
      tableData:[],
      tableHeight:200,
      searchData:{
        keyword: "",
        nickname: "",
        all_name: false,
        page: 1,
        limit: 20,
        num: "",
        my_level: "",
        sort: "",
        id: "",
        name: "",
        uname: "",
        department: ""
      },
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
      isSearchResult:false,
      selectedData: [],
      fieldList: [
        { key: 'name', value: '关键词' },
        { key: 'my_level', value: '关键词等级' },
        { key: 'rank_number', value: '排名' },
        { key: 'avgnumber', value: '快手指数' },
        { key: 'score', value: '积分' },
        { key: 'desc', value: '标题' },
        { key: 'nickname', value: '名称' },
      ],
      fieldList2: [
        { key: 'name', value: '关键词' },
        { key: 'my_level', value: '关键词等级' },
        { key: 'rank_number', value: '排名' },
        { key: 'avgnumber', value: '快手指数' },
        { key: 'depart', value: '部门' },
        { key: 'uname', value: '负责人' },
        { key: 'score', value: '积分' },
        { key: 'desc', value: '标题' },
        { key: 'nickname', value: '名称' },
      ],
      scoreList: [],
      scoreCount: 0,
      timeList: [],
      lineData: [],
      isChartShow: false,
      myChart:null,
      isSearchLine: false,
      dialogTitle: "",
      dialogWidth: "1200px",
      levelList: [
        {
          label: "A1",
          value: "A1"
        },
        {
          label: "A2",
          value: "A2"
        },
        {
          label: "B1",
          value: "B1"
        },
        {
          label: "B2",
          value: "B2"
        },
        {
          label: "C1",
          value: "C1"
        },
        {
          label: "C2",
          value: "C2"
        },
        {
          label: "D",
          value: "D"
        },
      ],
      sortList: [
        {
          label: "默认排序",
          value: 0
        },
        {
          label: "关键词等级降序",
          value: 1
        },
        {
          label: "排名降序",
          value: 2
        },
      ],
      nick_res: [],
      add_word: [],
      desc_word: [],
      isColumnShow: false,
      accountIds: [],
      timeArr: [],
      columnData: {},
      add_list: [],
      desc_list: [],
      popSearch: {
        ids: [],
        start_num: 0,
        end_num: 0
      },
      isPopSearch: false,
      activeName: "first",
      add_allscore: [],
      desc_allscore: [],
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
            stage: "C1",
            desc: "口碑词"
          },
          {
            stage: "C2",
            desc: "品牌词"
          },
          {
            stage: "D",
            desc: "配套产品"
          },
      ],
      nowChart: 1,
      xunChart: null,
      xundata: [],
      xunChart2: null,
      xundata2: [],
      checkBtnShow: false,
      charttype: 1,
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
  created(){
    var $this = this;
    $this.getBreadcrumbList();
    $this.initData();
  },
  updated(){
    var $this = this;
    $this.$nextTick(() => {
      $this.$refs.simpleTable.doLayout();
    });
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
    // 表格多选改变事件
    handleSelectionChange(val) {
      var $this = this;
      $this.selectedData = val;
    },
    showExportDialog() {
      if(this.searchData.all_name){
        this.$refs.ExportModalRef.showDialog({ fieldList: this.fieldList2, hasSelected: this.selectedData.length > 0, hasData: this.tableData.length > 0 })
      }else{
        this.$refs.ExportModalRef.showDialog({ fieldList: this.fieldList, hasSelected: this.selectedData.length > 0, hasData: this.tableData.length > 0 })
      }
    },
    exportDone(obj) {
      const filename = obj.filename
      const customData = []
      let header = null
      const bookType = obj.fileType
      const headerSort = obj.sort
      if (obj.headerType === 'custom') {
        header = obj.header
      }
      if (obj.dataScope === 1) { // 导出当前页数据
        this.tableData.forEach((item) => {
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
      } else if (obj.dataScope === 2) { // 导出选中数据
        this.selectedData.forEach((item) => {
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
      } else { // 导出全量后台数据
        var $this = this;
        var formData = {}
        formData.page = $this.searchData.page;
        formData.limit = $this.totalDataNum;
        formData.keyword = $this.searchData.keyword;
        formData.nickname = $this.searchData.nickname;
        formData.all_name = $this.searchData.all_name ? 1 : "";
        formData.num = $this.searchData.num;
        formData.my_level = $this.searchData.my_level;
        formData.sort = $this.searchData.sort;
        const loading = $this.$loading({
          lock: true,
          text: '正在导出内容，请耐心等待……'
        });
        $this.$store.dispatch('kuaishou/getKuaishouResData', formData).then(res => {
          if (res) {
            loading.close();
            if(res.status){
              if (res.data && res.data.length > 0) {
                const result = []
                const customData = res.data;
                customData.forEach((item) => {
                  const itemObj = {}
                  headerSort.forEach((current) => {
                    itemObj[current] = item[current]
                  })
                  result.push(itemObj)
                })
                jsonToSheetXlsx({
                  data: result,
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
              }
            }else{
              $this.$message({
                showClose: true,
                message: res.info,
                type: 'error'
              });
            }
          }
          
        })
      }
    },
    // 搜索点击事件
    searchResult(){
      var $this = this;
      if(!$this.isSearchResult){
        $this.isSearchResult=true;
        $this.searchData.page = 1;
        $this.initPage();
      }
    },
    // 重置表单
    resetData(){
        var $this = this;
        $this.searchData.page=1;
        $this.searchData.limit=20;
        $this.searchData.keyword = "";
        $this.searchData.nickname = "";
        $this.searchData.all_name = false;
        $this.searchData.num = "";
        $this.searchData.my_level = "";
        $this.searchData.sort = "";
        $this.searchData.id = "";
        $this.searchData.name = "";
        $this.searchData.uname = "";
        $this.searchData.department = "";
        $this.searchResult();
    },
    // 初始化数据
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
            if($this.menuButtonPermit.includes('Kuaishou_index')){
              $this.getKuaishouTime();
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
    getKuaishouTime(){
      var $this = this;
      $this.$store.dispatch('kuaishou/kuaishouCountTime',null).then(res=>{
        if(res.status){
          $this.timeList = res.data;
          var numArr = [];
          res.data.forEach(item => {
            numArr.push(item.num)
          })
          $this.searchData.num = Math.max(...numArr);
          $this.timeArr = numArr;
          $this.initPage();
          $this.getKuaishouCount();
        }else{
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'error'
          });
        }
      });
    },
    selectedTimeChange(){
      var $this = this;
      if(!$this.isSearchResult){
        $this.isSearchResult=true;
        $this.initPage();
        $this.getKuaishouCount();
      }
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.nick_res = [];
      var formData = {}
      formData.page = $this.searchData.page;
      formData.limit = $this.searchData.limit;
      formData.keyword = $this.searchData.keyword;
      formData.nickname = $this.searchData.nickname;
      formData.all_name = $this.searchData.all_name ? 1 : "";
      formData.num = $this.searchData.num;
      formData.my_level = $this.searchData.my_level;
      formData.sort = $this.searchData.sort;
      document.getElementsByClassName("scroll-panel")[0].scrollTop = 0;
      $this.$store.dispatch('kuaishou/getKuaishouResData', formData).then(response=>{
          if(response){
            if(response.status){
              if(response.data){
                $this.tableData = response.data;
                $this.totalDataNum = response.allcount;
                setTimeout(()=>{
                  $this.isSearchResult=false;
                },1000);
                $this.$nextTick(function () {
                  $this.setTableHeight();
                })
              }
              if(response.nick_res){
                var keys = Object.keys(response.nick_res);
                var resList = [];
                keys.forEach(item => {
                  var obj = {};
                  obj.name = item;
                  obj.value = response.nick_res[item];
                  resList.push(obj);
                })
                $this.nick_res = resList;
              }else{
                $this.nick_res = [];
              }
              if(response.add_word){
                var keys = Object.keys(response.add_word);
                var resList = [];
                keys.forEach(item => {
                  var obj = {};
                  obj.name = item;
                  obj.value = response.add_word[item];
                  resList.push(obj);
                })
                $this.add_word = resList;
              }else{
                $this.add_word = [];
              }
              if(response.desc_word){
                var keys = Object.keys(response.desc_word);
                var resList = [];
                keys.forEach(item => {
                  var obj = {};
                  obj.name = item;
                  obj.value = response.desc_word[item];
                  resList.push(obj);
                })
                $this.desc_word = resList;
              }else{
                $this.desc_word = [];
              }
              if( $this.searchData.nickname == "" || $this.searchData.nickname == null || $this.searchData.nickname && $this.CheckNameIn()){
                $this.checkBtnShow = true;
              }else{
                $this.checkBtnShow = false;
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
    // 获取快手统计数据
    getKuaishouCount(){
      var $this = this;
      var formData = {}
      formData.num = $this.searchData.num;
      $this.$store.dispatch('kuaishou/getKuaishouScoreData', formData).then(response=>{
          if(response){
            if(response.status){
              if(response.data && response.data.length > 0){
                $this.scoreList = response.data.sort(sortByDesc("score"));
                var count = 0;
                var account_ids = [];
                response.data.forEach(item => {
                  count += item.score;
                  account_ids.push(item.id);
                })
                $this.accountIds = account_ids;
                $this.scoreCount = Number(count).toFixed(1);
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
    // 内容点击搜索
    searchByName(data){
      var $this = this;
      $this.searchData.page=1;
      $this.searchData.limit=20;
      $this.searchData.nickname = data.dy_uuid;
      $this.searchData.all_name = true;
      $this.searchData.id = data.id;
      $this.searchData.name = data.name;
      $this.searchData.uname = data.uname;
      $this.searchData.department = data.department;
      $this.searchResult();
    },
    // 点击展示图表
    showLineChart(data){
      var $this = this;
      $this.dialogTitle = data.nickname+"——"+data.name;
      $this.dialogWidth = "1200px";
      $this.isChartShow = true;
      $this.isSearchLine = true;
      $this.charttype = 1;
      var formData = {};
      formData.pid = data.pid;
      formData.my_level = data.my_level;
      formData.nickname = data.w_uid;
      $this.$store.dispatch('kuaishou/kuaishouEachLine', formData).then(response=>{
          if(response){
            $this.isSearchLine = false;
            $this.lineData = [];
            if(response.status){
              if(response.data && response.data.length > 0){
                var resData = [];
                response.data.forEach(item => {
                  var obj = {};
                  obj.addtime = item.addtime;
                  obj.score = item.score;
                  obj.number_one = item.number_one;
                  obj.number_two = item.number_two;
                  obj.number_three = item.number_three;
                  obj.number_four = item.number_four;
                  obj.num = item.num;
                  resData.push(obj);
                })
                $this.lineData = resData.sort(sortByAsc("num"));
                $this.drawLineChart();
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
    showAccountChart(data){
      var $this = this;
      $this.dialogTitle = data.name+"["+data.department+"-"+data.uname+"]";
      $this.isChartShow = true;
      $this.isSearchLine = true;
      $this.dialogWidth = "1200px";
      $this.charttype = 1;
      var formData = {};
      formData.id = data.id;
      $this.$store.dispatch('kuaishou/kuaishouAccountLine', formData).then(response=>{
        if(response){
          $this.isSearchLine = false;
          $this.lineData = [];
          if(response.status){
            if(response.data && response.data.length > 0){
              var resData = [];
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
              })
              $this.lineData = resData.sort(sortByAsc("num"));
              setTimeout(() => {
                $this.drawLineChart();
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
                $this.isSearchResult=false;
                $this.isSaveData=false;
              },1000);
            }
          }
        }
      });
    },
    // 曲线图
    drawLineChart(){
      var $this = this;
      if($this.lineData.length>0){
        var chartDom = document.getElementById('chart');
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
            source: $this.lineData,  
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
        $this.myChart = myChart;
      }
    },
    handleClose(){
      var $this = this;
      $this.isChartShow = false;
      $this.isSearchLine = false;
      $this.isColumnShow = false;
      $this.activeName = "first";
      $this.nowChart = 1;
      if($this.myChart){
        $this.myChart.dispose();
      }
      $this.myChart = null;
      if($this.xunChart){
        $this.xunChart.dispose();
      }
      $this.xunChart = null;
      if($this.xunChart2){
        $this.xunChart2.dispose();
      }
      $this.xunChart2 = null;
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
    getTotalCountData(){
      var $this = this;
      $this.dialogTitle = "所有账号";
      $this.dialogWidth = "1200px";
      $this.isChartShow = true;
      $this.isSearchLine = true;
      $this.charttype = 2;
      var formData = {};
      var ids = [];
      $this.scoreList.forEach(item => {
        ids.push(item.id)
      })
      formData.ids = ids;
      $this.$store.dispatch('kuaishou/kuaishouTotalCountData', formData).then(response=>{
          if(response){
            $this.isSearchLine = false;
            $this.lineData = [];
            if(response.status){
              if(response.data && response.data.length > 0){
                var resData = [];
                var xundata2 = [];
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
                  xunobj.score = item.user_data;
                  xundata2.push(xunobj);
                })
                $this.xundata = response.xundata&&response.xundata.length > 0 ? response.xundata : [];
                $this.xundata2 = xundata2.sort(sortByAsc("num"));
                $this.lineData = resData.sort(sortByAsc("num"));
                setTimeout(() => {
                  if($this.activeName == 'first'){
                    $this.drawLineChart();
                  }else{
                    if($this.nowChart == 1){
                      $this.drawXunChart();
                    }else if($this.nowChart == 2){
                      $this.drawXunChart2();
                    }
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
                  $this.isSearchResult=false;
                },1000);
              }
            }
          }
      });
    },
    showColumnChart(){
      var $this = this;
      var resId = [];
      var res_start = "";
      var res_end = "";
      if($this.searchData.num){
        res_end = $this.searchData.num;
      }else{
        res_end = Math.max(...$this.timeArr);
      }
      res_start = $this.getPrevTime(res_end);
      if($this.searchData.nickname){
        var ids = [];
        if($this.searchData.id){
          ids.push($this.searchData.id);
        }else{
          ids.push($this.tableData[0].aweme_id);
        }
        resId = ids;
        console.log($this.checkAccount($this.searchData.nickname))
        if($this.checkAccount($this.searchData.nickname)){
          $this.$router.push({path:'/Kuaishou/keywordcount',query:{ id:resId.join(","), start_num:res_start, end_num: res_end, isall:1}});
        }else{
          $this.$router.push({path:'/Kuaishou/keywordcount',query:{ id:resId.join(","), start_num:res_start, end_num: res_end, isall:0}});
        }
      }else{
        resId = $this.accountIds;
        $this.$router.push({path:'/Kuaishou/keywordcount',query:{ id:resId.join(","), start_num:res_start, end_num: res_end, isall:1}});
      }
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
    CheckNameIn(){
      var $this = this;
      var isIn = false;
      var aim = $this.searchData.nickname;
      $this.scoreList.forEach(item => {
        if(item.dy_uuid == aim){
          isIn = true;
        }
      })
      return isIn;
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
      }else if(inx == 2){
        setTimeout(() => {
          $this.drawXunChart2();
        }, 500);
      }
    },
    getScoreData(data){
      var $this = this;
      var score = 0;
      var hasScore = 0;
      $this.lineData.forEach(item => {
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
        $this.lineData.forEach(item => {
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
          data: timeList,
          axisLine:{
            lineStyle:{
              color: "#dedede"
            }
          },
          axisLabel:{
            color: "#888"
          },
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
      var timeList = [];
      var xunList = [];
      var scoreList = [];
      $this.xundata2.forEach(item => {
        timeList.push(item.addtime);
        xunList.push(item.number);
        scoreList.push(item.score);
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
          data: timeList,
          axisLine:{
            lineStyle:{
              color: "#dedede"
            }
          },
          axisLabel:{
            color: "#888"
          },
        },
        yAxis: [{
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
            type: 'line',
            symbol: 'circle',
            symbolSize: '5',
            data: xunList,
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
      $this.xunChart2 = myChart;
    },
    checkAccount(name){
      var $this = this;
      var uname = "";
      var ids = [];
      $this.scoreList.forEach(item => {
        if(item.dy_uuid == name){
          uname = item.uname
        }
      })
      $this.scoreList.forEach(item => {
        if(item.uname == uname){
          ids.push(item.id);
        }
      })
      if(ids.length > 1){
        return false
      }else{
        return true
      }
    },
    tabClick(e){
      var $this = this;
      if($this.xunChart){
        $this.xunChart.dispose();
      }
      $this.xunChart = null;
      if($this.xunChart2){
        $this.xunChart2.dispose();
      }
      $this.xunChart2 = null;
        
      if(e.name == 'first'){
        setTimeout(() => {
          $this.drawLineChart();  
        }, 300);
      }
      if(e.name == 'second'){
        setTimeout(() => {
          if($this.nowChart == 1){
            $this.drawXunChart();  
          }else{
            $this.drawXunChart2();  
          }
        }, 300);
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
  padding: 15px;
  margin-bottom: 15px;
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
  .select-panel{
    width: 140px;
  }
}
.el-table.SiteTable svg{
  font-size: 20px;
}
.item-text{
  color: #606266;
  display: flex;
  align-items: center;
  line-height: 0;
  &.regular{
    color: #999;
  }
  &.keyword{
    justify-content: center;
    span{
      justify-content: center;
    }
  }
  &.center{
    justify-content: center;
    span{
      flex: none;
      display: inline-flex;
      justify-content: center;
      line-height: 24px;
    }
  }
  span{
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 24px;
    .svg-i{
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    &.before{
      justify-content: flex-end;
      color: #111;
    }
    &.after{
      justify-content: flex-start;
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
        top: 0;
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
.box-card .el-card__header{
  padding: 0;
  background-color: transparent;
}
.link{
  color:#0970ff;
  font-size: 13px;
  .item-text span.before{
    color:#0970ff;
  }
  .item-text span.zero:before{
    background-color:#0970ff;
  }
}
.kuaishou_count{
  padding: 15px;
  background: #fff;
  margin-bottom: 15px;
  border-radius: 0;
  .dy_item{
    display: inline-block;
    vertical-align: top;
    width: 25%;
    font-size: 14px;
    line-height: 2.4;
    cursor: pointer;
    color: #0970ff;
    .cname{}
    .uname{}
    .rank{}
    .score{}
    .dy_item_s, .dy_item_c{
      display: inline-block;
      vertical-align: middle;
    }
    .dy_item_c{
      margin-left: 10px;
      font-size: 20px;
      cursor: pointer;
      line-height:1;
    }
  }
  .dy_red{
    color: #f2302f;
  }
}
.dy_red{
    color: #f2302f;
  }
.dy_res{
    padding-bottom: 15px;
    p{
      color: #666;
      font-size: 13px;
      line-height: 1.5;
      padding-left: 15px;
    }
    .color_01{
      color: #444;
    }
    .color_02{
      color: #f2302f;
      margin-left: 2px;
      margin-right: 2px;
    }
    i{
      font-style: normal;
    }
    .more_btn{
      padding: 6px 10px;
      color: #666;
      &:hover, &:focus{
        color: #fff;
      }
    }
    .place_span{
      opacity: 0;
      visibility: hidden;
    }
    // .word_count{
    //   margin-left: 30px;
    // }
  }
.word-line{
  .word_box{
    height: 70vh;
    :deep(.el-scrollbar__wrap){
      height: 70vh;
    }
  }
  .word_tit{
    padding-left: 15px;
    font-size: 16px;
    line-height: 1.5;
    color: #333;
    position: relative;
    margin-bottom: 15px;
    &:before{
      content: "";
      display: block;
      position: absolute;
      left: 0;
      top: 2px;
      width: 5px;
      bottom: 2px;
      border-radius: 3px;
      background-color: #2f9e32;
    }
  }
  .word_ul{
    padding-left: 15px;
    li{
      margin-top: 8px;
      margin-bottom: 8px;
      font-size: 14px;
      line-height: 1.5;
      color: #666;
      float: left;
      width: 25%;
      padding-left: 14px;
      position: relative;
      &:before{
        content: "";
        display: block;
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -2px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: #2f9e32;
      }
    }
    &:after{
      content: "";
      display: block;
      clear: both;
    }
  }
  .word_item+.word_item{
    margin-top: 40px;
    .word_tit:before{
      background-color: #f2302f;
    }
    .word_ul{
      li:before{
        background-color: #f2302f;
      }
    }
  }
}

@media screen and (max-width: 1800px){
  .kuaishou_count .dy_item{
    width: auto;
    margin-right: 30px;
  }
}
.score_num{
  display: inline-block;
  vertical-align: middle;
  width: 40px;
}

#chart{
  width: 1160px;
  height: 400px;
}
.pie_chart #chart{
  width: 760px;
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
.search_col{
  height: calc(80vh - 185px);
}
#columnChart{
  width: 1160px;
  height: calc(80vh - 215px);
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
  margin-bottom: 10px;
  .item-change{
      float:left;
      margin-right:15px;
      margin-left: 1px;
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
    margin-top: 4px;
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
.tips_div{
  display:inline-block;
  vertical-align: middle;
  margin-left: 10px;
  font-size: 24px;
  color: #b4b4b4;
  cursor: pointer;
}
.tips_div2{
  font-size: 20px;
  margin-left: 0;
  margin-top: 2px;
}
.exportBtn{
  background-color: #f9a500;
  &:hover,&:focus{
    background: #ffba00;
    border-color: #ffba00;
  }
}

.search_column #chart{
  height: 442px;
}
.search_column #xunChart, .search_column #xunChart2{
  width: 100%;
  height: 400px;
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