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
            <div slot="header">
              <div class="card-header" ref="headerPane">
                <div class="search-wrap" ref="searchPane">
                  <div class="item-search flex-box">
                    <div class="item-label">时间选择：</div>
                    <div class="item-date-range flex-box">
                      <div class="item-change">
                        <span v-for="(item, index) in dateList" :key="index" :class="item.active ? 'active' : ''" @click="checkDate(item)">{{ item.label }}</span>
                      </div>
                      <div v-if="currentDateCount < 0" class="item-date flex-box">
                        <div class="before-date" style="width: 220px;">
                          <el-date-picker
                            v-model="searchData.dateValue"
                            @change="dateChangeHandle"
                            type="daterange"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            key="a"
                            size="small"
                            class="date-range"
                            range-separator="～"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="{
                              shortcuts: shortcutsMonth,
                              disabledDate: disabledDate
                            }">
                          </el-date-picker>
                        </div>
                        <div class="center">环比</div>
                        <div class="after-date" style="width: 220px;">
                          <el-date-picker
                            v-model="searchData.dateValue2"
                            @change="searchResult"
                            type="daterange"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            key="a"
                            size="small"
                            class="date-range"
                            range-separator="～"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="{
                              shortcuts: shortcutsMonth,
                              disabledDate: disabledDate
                            }">
                          </el-date-picker>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="item-search">
                    <el-button class="item-input" :class="isSearchResult?'isDisabled':''" :disabled="isSearchResult" type="primary" size="small" icon="el-icon-search" @click="searchResult">查询</el-button>
                    <el-button type="info" class="resetBtn" size="small" v-on:click="resetData()">重置</el-button>
                    <el-button type="primary" size="small" class="derived" @click="showExportDialog"><i class="svg-i"><svg-icon icon-class="derived" /></i>导出数据</el-button>
                    <p style="display: inline-block; font-size: 14px; color: #999;margin-left: 12px;">注：2023-06-15前无数据，每天凌晨抓取前天的数据</p>
                  </div>
                </div>
              </div>
            </div>
            <p style="font-size: 14px; line-height: 16px; color: #999;margin-bottom: 15px;">当前数据日期范围：{{ searchDate[0] }} 至 {{ searchDate[1] }}；环比数据日期范围：{{ compareDate[0] }} 至 {{ compareDate[1] }}</p>
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
                      <el-table-column type="selection" align="center" width="48" fixed="left"></el-table-column>
                      <el-table-column
                        prop="name"
                        align="center"
                        label="搜索词"
                        fixed="left"
                        min-width="140"
                        >
                        <template #default="scope">
                          <div class="item-text keyword"><span><el-tooltip class="item" :offset="5" :visible-arrow="false" effect="light" content="该搜索词存在歧义，数据可能不准确" placement="top-start">
                            <i v-if="scope.row.is_other === 1" class="icon-other el-icon-warning"></i>
    </el-tooltip>{{ scope.row['name'] }}</span></div>
                        </template>
                      </el-table-column>
                      <el-table-column label="百度指数" align="center">
                        <el-table-column
                          prop="baidu_avg"
                          label="当前指数"
                          align="center"
                          sortable
                          min-width="140"
                          class-name="stripe"
                          >
                          <template #default="scope">
                            <el-link v-if="scope.row.uid == 1112" :href="scope.row.baidu" type="primary" :underline="false" target="_blank" class="link">
                              <div class="item-text center">
                                <span class="before">{{ scope.row['baidu_avg'] }}</span>
                                <span v-if="scope.row['baidu_avg_cha'] !== 0" class="after" :class="scope.row['baidu_avg_cha'] > 0 ? 'red' : scope.row['baidu_avg_cha'] < 0 ? 'green' : 'default'">{{ Math.abs(scope.row['baidu_avg_cha']) }}</span>
                                <span v-else class="zero"></span>
                              </div>
                            </el-link>
                            <div class="item-text center" v-else>
                              <span class="before">{{ scope.row['baidu_avg'] }}</span>
                              <span v-if="scope.row['baidu_avg_cha'] !== 0" class="after" :class="scope.row['baidu_avg_cha'] > 0 ? 'red' : scope.row['baidu_avg_cha'] < 0 ? 'green' : 'default'">{{ Math.abs(scope.row['baidu_avg_cha']) }}</span>
                              <span v-else class="zero"></span>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="compare_baidu_avg"
                          label="环比指数"
                          align="center"
                          sortable
                          min-width="110"
                          class-name="stripe"
                          >
                          <template #default="scope">
                            <div class="item-text regular"><span>{{ scope.row['compare_baidu_avg'] }}</span></div>
                          </template>
                        </el-table-column>
                      </el-table-column>
                      <el-table-column label="巨量指数（头条）" align="center">
                        <el-table-column
                          prop="byte_avg"
                          label="当前指数"
                          align="center"
                          sortable
                          min-width="140"
                          >
                          <template #default="scope">
                            <el-link v-if="scope.row.uid == 1112" :href="scope.row.toutiao" type="primary" :underline="false" target="_blank" class="link">
                              <div class="item-text center">
                                <span class="before">{{ scope.row['byte_avg'] }}</span>
                                <span v-if="scope.row['byte_avg_cha'] !== 0" class="after" :class="scope.row['byte_avg_cha'] > 0 ? 'red' : scope.row['byte_avg_cha'] < 0 ? 'green' : 'default'">{{ Math.abs(scope.row['byte_avg_cha']) }}</span>
                                <span v-else class="zero"></span>
                              </div>
                            </el-link>
                            <div class="item-text center" v-else>
                              <span class="before">{{ scope.row['byte_avg'] }}</span>
                              <span v-if="scope.row['byte_avg_cha'] !== 0" class="after" :class="scope.row['byte_avg_cha'] > 0 ? 'red' : scope.row['byte_avg_cha'] < 0 ? 'green' : 'default'">{{ Math.abs(scope.row['byte_avg_cha']) }}</span>
                              <span v-else class="zero"></span>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="compare_byte_avg"
                          label="环比指数"
                          align="center"
                          sortable
                          min-width="110"
                          >
                          <template #default="scope">
                            <div class="item-text regular"><span>{{ scope.row['compare_byte_avg'] }}</span></div>
                          </template>
                        </el-table-column>
                      </el-table-column>
                      <el-table-column label="巨量指数（抖音）" align="center">
                        <el-table-column
                          prop="douyin_avg"
                          label="当前指数"
                          align="center"
                          sortable
                          min-width="140"
                          class-name="stripe"
                          >
                          <template #default="scope">
                            <el-link v-if="scope.row.uid == 1112" :href="scope.row.douyin" type="primary" :underline="false" target="_blank" class="link">
                              <div class="item-text center">
                                <span class="before">{{ scope.row['douyin_avg'] }}</span>
                                <span v-if="scope.row['douyin_avg_cha'] !== 0" class="after" :class="scope.row['douyin_avg_cha'] > 0 ? 'red' : scope.row['douyin_avg_cha'] < 0 ? 'green' : 'default'">{{ Math.abs(scope.row['douyin_avg_cha']) }}</span>
                                <span v-else class="zero"></span>
                              </div>
                            </el-link>
                            <div class="item-text center" v-else>
                              <span class="before">{{ scope.row['douyin_avg'] }}</span>
                              <span v-if="scope.row['douyin_avg_cha'] !== 0" class="after" :class="scope.row['douyin_avg_cha'] > 0 ? 'red' : scope.row['douyin_avg_cha'] < 0 ? 'green' : 'default'">{{ Math.abs(scope.row['douyin_avg_cha']) }}</span>
                              <span v-else class="zero"></span>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="compare_douyin_avg"
                          label="环比指数"
                          align="center"
                          sortable
                          min-width="110"
                          class-name="stripe"
                          >
                          <template #default="scope">
                            <div class="item-text regular"><span>{{ scope.row['compare_douyin_avg'] }}</span></div>
                          </template>
                        </el-table-column>
                      </el-table-column>
                      <el-table-column label="360指数" align="center">
                        <el-table-column
                          prop="360_avg"
                          label="当前指数"
                          align="center"
                          sortable
                          min-width="140"
                          >
                          <template #default="scope">
                            <div class="item-text center">
                              <span class="before">{{ scope.row['360_avg'] }}</span>
                              <span v-if="scope.row['360_avg_cha'] !== 0" class="after" :class="scope.row['360_avg_cha'] > 0 ? 'red' : scope.row['360_avg_cha'] < 0 ? 'green' : 'default'">{{ Math.abs(scope.row['360_avg_cha']) }}</span>
                              <span v-else class="zero"></span>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="compare_360_avg"
                          label="环比指数"
                          align="center"
                          sortable
                          min-width="110"
                          >
                          <template #default="scope">
                            <div class="item-text regular"><span>{{ scope.row['compare_360_avg'] }}</span></div>
                          </template>
                        </el-table-column>
                      </el-table-column>
                      <el-table-column label="总指数" align="center">
                        <el-table-column
                          prop="avg_cha"
                          label="当前指数"
                          align="center"
                          sortable
                          min-width="140"
                          class-name="stripe-all"
                          >
                          <template #default="scope">
                            <div class="item-text center">
                              <span class="before">{{ scope.row['all_avg'] }}</span>
                              <span v-if="scope.row['avg_cha'] !== 0" class="after" :class="scope.row['avg_cha'] > 0 ? 'red' : scope.row['avg_cha'] < 0 ? 'green' : 'default'">{{ Math.abs(scope.row['avg_cha']) }}</span>
                              <span v-else class="zero"></span>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="compare_avg"
                          label="环比指数"
                          align="center"
                          sortable
                          min-width="110"
                          class-name="stripe-all"
                          >
                          <template #default="scope">
                            <div class="item-text regular"><span>{{ scope.row['compare_avg'] }}</span></div>
                          </template>
                        </el-table-column>
                      </el-table-column>
                      <el-table-column
                        v-if="menuButtonPermit.includes('Keyword_keywordinfo')"
                        :width="operationsWidth"
                        align="center"
                        fixed="right"
                        prop="operations"
                        label="操作" >
                        <template #default="scope">
                          <div class="table-button">
                            <router-link class="clickBtn" :to="{name:'Keyword_keywordinfo',query:{id:scope.row.id}}">
                              <el-button size="mini">详情</el-button>
                            </router-link>
                          </div>
                        </template>
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
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { indices } from '@/api/keyword'
import { shortcutsMonth } from "@/utils/index"
import ExportModal from '@/components/Excel/exportModal.vue'
import { jsonToSheetXlsx } from '@/components/Excel/Export2Excel'
export default {
  name: 'Keyword_keywordcount',
  components: {
    ExportModal
  },
  data() {
    return {
      breadcrumbList:[],
      menuButtonPermit:[],
      operationsWidth: "",
      tips: '',
      pagerCount:5,
      pageSizeList:[50, 100, 150, 200],
      totalDataNum:0,
      tableData:[],
      tableHeight:200,
      selectedData: [],
      shortcutsMonth: shortcutsMonth,
      currentDateCount: 0,
      searchDate: [],
      compareDate: [],
      searchData:{
        dateValue: [],
        dateValue2: [],
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
      dateList: [
        {label: '最新', value: 0, active: true },
        {label: '7天', value: 6, active: false },
        {label: '30天', value: 29, active: false },
        {label: '近3月', value: 89, active: false },
        {label: '自定义', value: -1, active: false },
      ],
      isSearchResult:false,
      fieldList: [
        { key: 'name', value: '搜索词' },
        { key: 'baidu_avg', value: '百度指数' },
        { key: 'compare_baidu_avg', value: '百度环比指数' },
        { key: 'baidu_avg_cha', value: '百度指数差值' },
        { key: 'byte_avg', value: '巨量指数（头条）' },
        { key: 'compare_byte_avg', value: '头条环比指数' },
        { key: 'byte_avg_cha', value: '头条指数差值' },
        { key: 'douyin_avg', value: '巨量指数（抖音）' },
        { key: 'compare_douyin_avg', value: '抖音环比指数' },
        { key: 'douyin_avg_cha', value: '抖音指数差值' },
        { key: '360_avg', value: '360指数' },
        { key: 'compare_360_avg', value: '360环比指数' },
        { key: '360_avg_cha', value: '360指数差值' },
        { key: 'all_avg', value: '总指数' },
        { key: 'compare_avg', value: '环比总指数' },
        { key: 'avg_cha', value: '总指数差值' }
      ]
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
    $this.searchData.dateValue = $this.getDefaultDate();
    $this.searchDate = $this.getDefaultDate();
    $this.searchData.dateValue2 = $this.getOtherDay();
    $this.compareDate = $this.getOtherDay();
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
      $this.tableHeight = screenHeight-headerHeight-breadcrumbHeight-40-45-31;
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
      this.$refs.ExportModalRef.showDialog({ fieldList: this.fieldList, hasSelected: this.selectedData.length > 0, hasData: this.tableData.length > 0 })
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
        // formData.page = $this.searchData.page;
        // formData.limit = $this.searchData.limit;
        if ($this.searchData.dateValue && $this.searchData.dateValue.length > 0) {
          formData.starttime = $this.searchData.dateValue[0]
          formData.endtime = $this.searchData.dateValue[1]
        } else {
          formData.starttime = ''
          formData.endtime = ''
        }
        if ($this.searchData.dateValue2 && $this.searchData.dateValue2.length > 0) {
          formData.time1 = $this.searchData.dateValue2[0]
          formData.time2 = $this.searchData.dateValue2[1]
        } else {
          formData.time1 = ''
          formData.time2 = ''
        }
        const loading = $this.$loading({
          lock: true,
          text: '正在导出内容，请耐心等待……'
        });
        indices.stats.search(formData).then(res => {
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
        // $this.searchData.page = 1;
        $this.initPage();
      }
    },
    // 重置表单
    resetData(){
        var $this = this;
        $this.searchData.dateValue = $this.getDefaultDate();
        $this.searchDate = $this.getDefaultDate();
        $this.searchData.dateValue2 = $this.getOtherDay();
        $this.compareDate = $this.getOtherDay();
        // $this.searchData.page=1;
        // $this.searchData.limit=50;
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
            if($this.menuButtonPermit.includes('Keyword_keywordcount')){
                var operationsWidth = 22;
                if($this.menuButtonPermit.includes('Keyword_keywordinfo')){
                  operationsWidth+=66;
                }
                $this.operationsWidth = "" + operationsWidth;
              $this.initPage()
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
    // 初始化页面信息
    initPage(){
      var $this = this;
      var formData = {}
      // formData.page = $this.searchData.page;
      // formData.limit = $this.searchData.limit;
      if ($this.searchData.dateValue && $this.searchData.dateValue.length > 0) {
        formData.starttime = $this.searchData.dateValue[0]
        formData.endtime = $this.searchData.dateValue[1]
      } else {
        formData.starttime = ''
        formData.endtime = ''
      }
      if ($this.searchData.dateValue2 && $this.searchData.dateValue2.length > 0) {
        formData.time1 = $this.searchData.dateValue2[0]
        formData.time2 = $this.searchData.dateValue2[1]
      } else {
        formData.time1 = ''
        formData.time2 = ''
      }
      document.getElementsByClassName("scroll-panel")[0].scrollTop = 0;
      indices.stats.search(formData).then(response=>{
        console.log(response, '指数列表')
          if(response){
            if(response.status){
              if(response.data){
                $this.tableData = response.data;
                $this.tips = response.tip
                // $this.totalDataNum = response.allcount;
                setTimeout(()=>{
                  $this.isSearchResult=false;
                },1000);
                $this.$nextTick(function () {
                  $this.setTableHeight();
                })
              }
              if (response.msg) {
                $this.$message({
                  title: '提示',
                  message: response.msg,
                  type: 'warning',
                  duration:6000
                });
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
    operateData(data) {
      const result = []
      data.forEach(item => {
        if (item.word && item.word.length > 0) {
          item.word.forEach((v, idx) => {
            result.push({
              id: v.id,
              typename: item.name,
              name: v.name,
              baidu_avg: v.baidu_avg,
              byte_avg: v.byte_avg,
              douyin_avg: v.douyin_avg,
              '360_avg': v['360_avg'],
            })
          })
        }
      })
      return result
    },
    spanCell({row, column}){
      if (column.property === 'typename') {
        if (row.isStart) {
          return {
            rowspan: row.end,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    diffDateCount() {
      var $this = this;
      let aDate = $this.searchData.dateValue[0].split('-')
      const oDate1 = new Date(aDate[0], aDate[1], aDate[2])
      aDate = $this.searchData.dateValue[1].split('-')
      const oDate2 = new Date(aDate[0], aDate[1], aDate[2])
      const iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)
      return iDays
    },
    getNextDay(date, day = -1, format='{y}-{m}-{d}') {
      if (date) {
        const nDate = new Date(date)
        nDate.setDate(nDate.getDate() + day)
        const formatObj = {
          y: nDate.getFullYear(),
          m: nDate.getMonth() + 1,
          d: nDate.getDate()
        }
        return format.replace(/{([ymd])+}/g, (result, key) => {
          const value = formatObj[key]
          return value.toString().padStart(2, '0')
        })
      }
    },
    // 重置搜索数据
    resetSearchData(){
      var $this = this;
      $this.searchData.dateValue = [];
      // $this.searchData.page = 1;
      // $this.searchData.limit = 50;
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
    dateChangeHandle() {
      var $this = this
      $this.searchDate = $this.searchData.dateValue
      $this.searchData.dateValue2 = $this.getOtherDay(); 
      $this.compareDate = $this.getOtherDay();
      $this.searchResult()
    },
    checkDate(item) {
      this.dateList.forEach((v) => {
        v.active = false
        if (v.value === item.value) {
          v.active = true
          this.currentDateCount = v.value
          if (item.value >= 0) {
            this.searchDate = this.getDefaultDate();
            this.searchData.dateValue = this.getDefaultDate();
            this.searchData.dateValue2 = this.getOtherDay();
            this.compareDate = this.getOtherDay();
            this.searchResult();
          } else {
            this.searchDate = this.searchData.dateValue
            this.compareDate = this.getOtherDay()
            this.searchData.dateValue = []
            this.searchData.dateValue2 = []
          }
        }
      })
    },
    getOtherDay() {
      const dayCount = 0 - this.diffDateCount()
      const endDay = this.getNextDay(this.searchData.dateValue[0])
      const startDay = this.getNextDay(endDay, dayCount)
      return [startDay, endDay]
    },
    getDefaultDate() {
      const endDate = this.getDefaultEndDay()
      const start = new Date(endDate);
      if (this.currentDateCount > 0) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * this.currentDateCount);
      }
      var startYear = start.getFullYear();
      var startMonth = start.getMonth() +1;
      var startDay = start.getDate();
      startMonth = startMonth<10?'0'+startMonth:startMonth;
      startDay = startDay<10?'0'+startDay:startDay;
      var startDate = startYear+"-"+startMonth+"-"+startDay;
      return [startDate,endDate];
    },
    getDefaultEndDay() {
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
      // end.setTime(end.getTime());
      // end.setTime(end.getTime() + 3600 * 1000 * 24 * 1);
      var startYear = start.getFullYear();
      var startMonth = start.getMonth() +1;
      var startDay = start.getDate();
      startMonth = startMonth<10?'0'+startMonth:startMonth;
      startDay = startDay<10?'0'+startDay:startDay;
      var startDate = startYear+"-"+startMonth+"-"+startDay;
      return startDate
    },
    disabledDate(time) {
      const endDate = this.getDefaultEndDay()
      return time.getTime() > new Date(endDate) || time.getTime() < new Date('2023-06-15')
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
    }
  }
}
</script>
<style lang="scss" scoped>
.el-table.SiteTable .table-button .el-button{
  margin: 0;
}
.search-wrap{
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

    .item-label{
      line-height: 32px;
      font-size: 14px;
      color: #606266;
    }
    
    .item-date-range{
          .item-change{
              float:left;
              span{
                  float:left;
                  border:1px solid #e1e3ea;
                  font-size:14px;
                  color:#555555;
                  padding:5px 15px;
                  line-height:20px;
                  margin-left:-1px;
                  cursor:pointer;
                  &.active,&:hover{
                      color:#044bff;
                      border:1px solid #044bff;
                      background:#e0e9ff;
                      position:relative;
                      z-index:2;
                  }
              }
          }
          .item-date{
              float:left;
              vertical-align:top;
              margin-left: 10px;
              .center{
                line-height: 32px;
                font-size: 14px;
                color: #606266;
                padding: 0 12px;
              }
          }
      }
  }
  .input-panel{
    width: 190px;
  }
  .select-panel{
    width: 150px;
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

</style>
<style>

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
</style>