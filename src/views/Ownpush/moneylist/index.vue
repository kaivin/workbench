<template>
  <div class="page-root process-index" ref="boxPane">
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
                      <div class="card-header" v-if="device==='desktop'" ref="headerPane">
                        <div class="search-wrap" ref="searchPane">
                          <div class="item-search">
                            <el-date-picker
                                class="date-picker"
                                size="small"
                                v-model="searchData.date"
                                type="daterange"
                                align="right"
                                value-format = "yyyy-MM-dd"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerRangeOptions">
                            </el-date-picker>
                          </div>
                          <div class="item-search">
                            <el-select v-model="searchData.account_id" size="small" filterable clearable multiple collapse-tags placeholder="请选择账户" class="select-panel">
                                <el-option
                                    v-for="item in accountList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                          </div>
                          <div class="item-search">
                            <el-select v-model="searchData.processtype" size="small" filterable clearable multiple collapse-tags placeholder="请选择渠道" class="select-panel">
                                <el-option
                                    v-for="item in channelList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                          </div>
                          <div class="item-search">
                            <el-select v-model="searchData.processuserid" size="small" filterable clearable multiple collapse-tags placeholder="请选择负责人" class="select-panel">
                                <el-option
                                    v-for="item in userList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                          </div>
                          <div class="item-search">
                            <el-select v-model="searchData.brand_id" size="small" clearable multiple collapse-tags placeholder="请选择品牌" class="select-panel">
                              <el-option
                                v-for="item in brandList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                          </div>
                          <div class="item-search">
                            <el-button class="item-input" type="primary" size="small" icon="el-icon-search" @click="searchResult">查询</el-button>
                          </div>
                        </div>
                      </div>
                      <div class="card-header filter-panel" v-else ref="headerPane">
                        <div class="search-panel">                              
                            <p class="search-info">当前共有 <span>{{totalDataNum}}</span> 条搜索结果。</p>
                        </div>
                        <span class="filter-button" v-on:click="searchDialog()">筛选<i class="svg-i"><svg-icon icon-class="filter" class-name="disabled" /></i></span>
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
                            row-key="id"
                            show-summary
                            :summary-method="getSummaries"
                            :default-sort = "{prop: 'addtime', order: 'descending'}"
                            >
                            <el-table-column
                              prop="addtime"
                              label="日期"
                              width="100"
                              sortable
                              >
                            </el-table-column>
                            <el-table-column
                              prop="pushname"
                              label="账户名"
                              min-width="120"
                              >
                            </el-table-column>
                            <el-table-column
                              prop="marketsource"
                              label="渠道"
                              min-width="120"
                              >
                              <template #default="scope">
                                  <div class="table-tag">
                                      <el-tag type="primary" v-for="(item,index) in scope.row.channel" v-bind:key="index">{{item}}</el-tag>
                                  </div>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="marketbrand"
                              label="品牌"
                              width="60"
                              >
                            </el-table-column>
                            <el-table-column
                              prop="uname"
                              label="负责人"
                              width="150"
                              >
                              <template #default="scope">
                                  <div class="table-tag">
                                      <el-tag type="primary" v-for="(item,index) in scope.row.user" v-bind:key="index">{{item}}</el-tag>
                                  </div>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="markettype"
                              label="类型"
                              width="70"
                              :filters="filterTypeList"
                              :filter-method="filterTypeHandler"
                              >
                              <template slot-scope="scope">
                                <el-tag :type="scope.row.markettype === 1 ? 'primary' : 'danger'" disable-transitions>{{scope.row.markettype===1?'充值':'消费'}}</el-tag>
                              </template>
                            </el-table-column>
                            <!-- <el-table-column
                              prop="money1"
                              label="充值|消费前金额"
                              width="130"
                              >
                            </el-table-column> -->
                            <el-table-column
                              prop="money2"
                              label="充值|消费金额"
                              width="130"
                              >
                            </el-table-column>
                            <!-- <el-table-column
                              prop="money3"
                              label="当前金额"
                              width="130"
                              >
                            </el-table-column> -->
                            <el-table-column
                              v-if="(menuButtonPermit.indexOf('Ownpush_moneyedit')||menuButtonPermit.indexOf('Ownpush_moneydelete'))&&device==='desktop'"
                              :width="operationsWidth"
                              align="center"
                              fixed="right"
                              prop="operations"
                              label="操作">
                              <template #default="scope">
                                <div class="table-button">
                                  <el-button size="mini" @click="editTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Ownpush_moneyedit')&&scope.row.markettype === 1&&scope.row.addtime==today">编辑</el-button>
                                  <el-button size="mini" @click="deleteTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Ownpush_moneydelete')&&scope.row.markettype === 1&&scope.row.addtime==today" type="info" plain>删除</el-button>
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
                        :layout="device==='mobile'?'prev, pager, next':'total, sizes, prev, pager, next, jumper'"
                        :total="totalDataNum">
                      </el-pagination>
                    </div>
                  </el-card>
              </div>
          </div>
      </div>
      <el-backtop target=".scroll-panel"></el-backtop>
    <el-dialog :title="dialogText" v-if="(menuButtonPermit.includes('Ownpush_moneyadd')||menuButtonPermit.includes('Ownpush_moneyedit'))&&device==='desktop'" custom-class="add-edit-dialog" :visible.sync="dialogFormVisible" :before-close="handleClose" width="400px">
      <el-form :model="dialogForm">
        <div class="item-form">
          <el-form-item label="日期：" :label-width="formLabelWidth">
            <el-date-picker
                v-model="dialogForm.addtime"
                align="right"
                :default-value="dialogForm.addtime"
                value-format = "yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="item-form">
            <el-form-item label="账户：" :label-width="formLabelWidth">
                <el-select v-model="dialogForm.marketname" filterable clearable placeholder="请选择账户">
                    <el-option
                        v-for="item in accountList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </div>
        <div class="item-form">
            <el-form-item label="充值金额：" :label-width="formLabelWidth">
                <el-input v-model="dialogForm.money2" ref="money2"></el-input>
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
    <div class="mobile-filter-mask" v-bind:class="openClass?'open':''" v-if="device!=='desktop'" v-on:click="searchDialog()"></div>
    <div class="mobile-filter-dialog flex-box flex-column" v-bind:class="openClass?'open':''" v-if="device!=='desktop'">
      <div class="flex-content">
        <div class="abs-scroll">
          <ul>
            <li>
              <div class="item-li">
                <span class="title-panel">开始时间</span>
                <div class="item-filter">
                  <el-date-picker
                    v-model="searchData.startDate"
                    size="small"
                    type="date"
                    placeholder="选择开始时间"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </div>
              </div>
              <div class="item-li">
                <span class="title-panel">结束时间</span>
                <div class="item-filter">
                  <el-date-picker
                    v-model="searchData.endDate"
                    size="small"
                    type="date"
                    placeholder="选择结束时间"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </div>
              </div>
            </li>
            <li class="column-2">
              <span class="title-panel">品牌</span>
              <div class="tag-panel">
                <div class="item-button" v-for="item in brandList" v-bind:key="item.value">
                  <el-tag v-bind:class="item.isOn?'is-plain':''" size="small" v-on:click="clickBrandHandler(item)">{{item.label}}</el-tag>
                </div>
              </div>
            </li>
            <li class="column-2">
              <span class="title-panel">账户</span>
              <div class="tag-panel">
                <div class="item-button" v-for="item in accountList" v-bind:key="item.value">
                  <el-tag v-bind:class="item.isOn?'is-plain':''" size="small" v-on:click="clickAccountHandler(item)">{{item.label}}</el-tag>
                </div>
              </div>
            </li>
            <li>
              <span class="title-panel">渠道</span>
              <div class="tag-panel">
                <div class="item-button" v-for="item in channelList" v-bind:key="item.value">
                  <el-tag v-bind:class="item.isOn?'is-plain':''" size="small" v-on:click="clickChannelHandler(item)">{{item.label}}</el-tag>
                </div>
              </div>
            </li>
            <li>
              <span class="title-panel">负责人</span>
              <div class="tag-panel">
                <div class="item-button" v-for="item in userList" v-bind:key="item.value">
                  <el-tag v-bind:class="item.isOn?'is-plain':''" size="small" v-on:click="clickUserHandler(item)">{{item.label}}</el-tag>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <p class="footer-button"><span class="btn-yes" v-on:click="searchResult()">确定</span></p>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Ownpush_moneylist',
  data() {
    return {
      breadcrumbList:[],
      menuButtonPermit:[],
      operationsWidth:"",
      tableData:[],
      tableHeight:200,
      dialogFormVisible:false,
      dialogText:"",
      formLabelWidth:"110px",
      userList:[],
      accountList:[],
      channelList:[],
      brandList:[
        {label:'红星',value:'红星',isOn:false},
        {label:'中德',value:'中德',isOn:false},
      ],
      filterTypeList:[
        {text:'充值',value:'1'},
        {text:'消费',value:'2'},
      ],
      dialogForm:{
        id:0,
        addtime:"",
        marketname:"",
        money2:"",
      },
      pickerOptions: {
        disabledDate(time) {
        return time.getTime() > Date.now();
        },
        shortcuts: [{
            text: '今天',
            onClick(picker) {
                picker.$emit('pick', new Date());
            }
        }, {
            text: '昨天',
            onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit('pick', date);
            }
        }, {
            text: '前天',
            onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 2);
                picker.$emit('pick', date);
            }
        }, {
            text: '三天前',
            onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 3);
                picker.$emit('pick', date);
            }
        }]
      },
      searchData:{
          date:[],
          page:1,
          limit:50,
          account_id:[],
          processtype:[],
          processuserid:[],
          brand_id:[],
          startDate:"",
          endDate:""
      },
      pageSizeList:[50, 500, 5000, 10000],
      totalDataNum:0,
      pagerCount:5,
      dialogSearchVisible:false,
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
      today:'',
      openClass:false,
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
      isLoading:null
    }
  },
  computed: {
    ...mapGetters([
      'device',
      'addCnMoney',
      'sidebar',
      'menuData'
    ]),
    isAdd() {
      return this.addCnMoney
    },
    isOpen() {
      return this.sidebar.opened;
    },
  },
  mounted(){
      const $this = this;
      // 监听竖向滚动条滚动事件
      window.addEventListener('scroll',this.handleScroll,true);
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
      isAdd(e){
        if(e){
          this.addTableRow();
        }
      },
      isOpen(e){
        this.setTableHeight();
      },
  },
  created(){
    var $this = this;
    $this.getBreadcrumbList();
    $this.getToday();
    $this.initData();
  },
  updated(){
    this.$nextTick(() => {
      this.$refs.simpleTable.doLayout();
    })
  },
  destroyed(){
    console.log("走了销毁1");
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
      console.log($this.breadcrumbList,"面包屑数据");
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
    // 高级筛选
    searchDialog(){
      var $this = this;
      $this.openClass=!$this.openClass;
    },
    // 设置table高度
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
    // 获取今天时间
    getToday(){
        var $this = this;
        const date = new Date();
        date.setTime(date.getTime());
        var today = date.getFullYear()+"-"+(date.getMonth()+1>9?date.getMonth()+1:'0'+(date.getMonth()+1))+"-"+(date.getDate()+1>9?date.getDate():'0'+(date.getDate()));
        $this.today = today;
    },
    // 搜索数据
    searchResult(){
        var $this = this;
        $this.loadingFun();
        var isSearch = true;
        if($this.device==="mobile"){
          if(($this.searchData.startDate==""&&$this.searchData.endDate!="")||($this.searchData.startDate!=""&&$this.searchData.endDate=="")){
            isSearch = false;
          }else{
            if($this.searchData.startDate!=""&&$this.searchData.endDate!=""){
              if(!$this.compareDate($this.searchData.startDate,$this.searchData.endDate)){
                isSearch = false;
              }
            }
          }
        }
        if(!isSearch){
          if($this.searchData.startDate==""&&$this.searchData.endDate!=""){
            $this.$alert('结束时间不为空时开始时间不能为空', '警告', {
              confirmButtonText: '确定',
            });
          }
          if($this.searchData.startDate!=""&&$this.searchData.endDate==""){
            $this.$alert('开始时间不为空时结束时间不能为空', '警告', {
              confirmButtonText: '确定',
            });
          }
          if($this.searchData.startDate!=""&&$this.searchData.endDate!=""){
            $this.$alert('开始时间不能大于结束时间', '警告', {
              confirmButtonText: '确定',
            });
          }
          return false;
        }
        $this.searchData.page = 1;
        $this.initPage();
    },
    // 比较两个时间的先后
    compareDate(date1,date2){
      var oDate1 = new Date(date1);
      var oDate2 = new Date(date2);
      if(oDate1.getTime() > oDate2.getTime()){
          return false;
      }else{
          return true;
      }
    },
    searchDataInit(){
      var $this = this;
      var searchData = {};
      searchData.page = $this.searchData.page;
      searchData.limit = $this.searchData.limit;
      searchData.pushtype = $this.searchData.processtype;
      searchData.pushuser_id = $this.searchData.processuserid;
      searchData.marketname = $this.searchData.account_id;
      searchData.pushbrand = $this.searchData.brand_id;
      if($this.device === "mobile"){
        searchData.starttime = $this.searchData.startDate;
        searchData.endtime = $this.searchData.endDate;
      }else{
        if(!$this.searchData.date||$this.searchData.date.length==0){
          searchData.starttime = "";
          searchData.endtime = "";
        }else{
          searchData.starttime = $this.searchData.date[0];
          searchData.endtime = $this.searchData.date[1];
        }
      }
      return searchData;
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.loadingFun();
      $this.getUserMenuButtonPermit();
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      var searchData = $this.searchDataInit();
      document.getElementsByClassName("scroll-panel")[0].scrollTop = 0;
      $this.$store.dispatch('ownpush/cnCostListAction', searchData).then(response=>{
        if(response){
          if(response.status){
              console.log(response);
              response.data.forEach(function(item,index){
                item.money1 = item.money1.toFixed(2);
                item.money2 = item.money2.toFixed(2);
                item.money3 = item.money3.toFixed(2);
                item.channel = [];
                if(item.marketsource&&item.marketsource!=""){
                  if(item.marketsource.indexOf(",")!=-1){
                    var channelArr = item.marketsource.split(",");
                    channelArr.forEach(function(item1,index1){
                      item.channel.push(item1);
                    });
                  }else{
                    item.channel.push(item.marketsource);
                  }
                }
                item.user = [];
                if(item.uname&&item.uname!=""){
                  if(item.uname.indexOf(",")!=-1){
                    var userArr = item.uname.split(",");
                    userArr.forEach(function(item1,index1){
                      item.user.push(item1);
                    });
                  }else{
                    item.user.push(item.uname);
                  }
                }
              });
              $this.tableData = response.data;
              $this.totalDataNum = response.allcount;
              if($this.device === "mobile"){
                $this.openClass = false;
              }
              $this.isLoading.close();
              $this.$nextTick(function () {
                $this.setTableHeight();
              })
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
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.status){
          if(res.data.length>0){
            console.log(res.data,"操作权限")
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.menuButtonPermit.includes('Ownpush_moneylist')){
              var operationsWidth = 22;
              if($this.menuButtonPermit.includes('Ownpush_moneyedit')){
                operationsWidth+=66;
              }
              if($this.menuButtonPermit.includes('Ownpush_moneydelete')){
                operationsWidth+=66;
              }
              $this.operationsWidth = "" + operationsWidth;
              $this.getAccountData();
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
    // 关闭添加充值记录弹窗
    handleClose(){
      var $this = this;
      $this.dialogFormVisible = false;
      $this.$store.dispatch('app/closeCnMoney');
    },
    // 添加表格行数据
    addTableRow(row,index){
      var $this = this;
      $this.dialogFormVisible = true;
      $this.dialogText = "添加充值记录";
      $this.resetFormData();
    },
    // 编辑表格行数据
    editTableRow(row,index){
      var $this = this;
      $this.dialogFormVisible = true;
      $this.dialogText = "编辑充值记录";
      $this.resetFormData();
      $this.dialogForm.id = row.id;
      $this.dialogForm.addtime = row.addtime;
      $this.dialogForm.marketname = row.marketname;
      $this.dialogForm.money2 = row.money2;
    },
    // 保存添加/编辑数据
    saveData(){
      var $this = this;
      if(!$this.validationForm()){
        return false;
      }
      var pathUrl = "";
      if($this.dialogText=="编辑充值记录"){
        pathUrl = "ownpush/cnCostEditAction";
      }else{
        pathUrl = "ownpush/cnCostAddAction";
      }
      $this.$store.dispatch(pathUrl, $this.dialogForm).then(response=>{
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
      });
    },
    // 重置添加数据表单
    resetFormData(){
      var $this = this;
      $this.dialogForm.id = 0
      $this.dialogForm.addtime = '';
      $this.dialogForm.pushpwd = '';
      $this.dialogForm.marketname = '';
      $this.dialogForm.money2 = '';
    },
    // 验证是否为空
    validationForm(){
      var $this = this;
      if($this.dialogForm.addtime == ""){
        $this.$message({
            showClose: true,
            message: '错误：日期不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.dialogForm.marketname == ""){
        $this.$message({
            showClose: true,
            message: '错误：账户不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.dialogForm.money2 == ""){
        $this.$message({
            showClose: true,
            message: '错误：充值金额不能为空！',
            type: 'error'
        });
        $this.$refs['money2'].focus();
        return false;
      }
      return true;
    },
    // 删除表格行
    deleteTableRow(row,index){
      var $this = this;
      $this.$confirm('是否确认删除该充值记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          $this.$store.dispatch('ownpush/cnCostDeleteAction', {id:row.id}).then(response=>{
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
    // 获取产品添加编辑是需要的系统数据
    getSelectData(){
      var $this = this;
      $this.$store.dispatch('ownpush/userListAction', null).then(response=>{
          if(response.status){
            console.log(response);
            var userList = [];
            response.data.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.name;
              userList.push(itemData);
            });
            $this.userList = userList;
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
    },
    // 获取添加数据时的账户选择数据
    getAccountData(){
      var $this = this;
      $this.$store.dispatch('ownpush/accountListAllAction', null).then(response=>{
          if(response.status){
            console.log(response);
            var accountList = [];
            response.data.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.pushname;
              itemData.isOn = false;
              accountList.push(itemData);
            });
            $this.accountList = accountList;
            $this.getChannelData();
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
    },
    // 获取添加数据时的渠道选择数据
    getChannelData(){
      var $this = this;
      $this.$store.dispatch('ownpush/cnChannelListAction', null).then(response=>{
          if(response.status){
            console.log(response);
            var channelList = [];
            response.data.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.name;
              itemData.isOn = false;
              channelList.push(itemData);
            });
            $this.channelList = channelList;
            $this.getUserData();
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
    },
    // 获取添加数据是的负责人选择数据
    getUserData(){
      var $this = this;
      $this.$store.dispatch('ownpush/userListAction', null).then(response=>{
          if(response.status){
            console.log(response);
            var userList = [];
            response.data.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.name;
              itemData.isOn = false;
              userList.push(itemData);
            });
            $this.userList = userList;
            $this.initPage();
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
      console.log(`每页 ${val} 条`);
      this.loadingFun();
      this.searchData.limit = val;
      this.searchData.page = 1;
      this.initPage();
    },
    // 当前页改变事件
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.loadingFun();
      this.searchData.page = val;
      this.initPage();
    },
    filterTypeHandler(value,row,column){
      return row.markettype === parseInt(value);
    },
    // 获取合计数据
    getSummaries(param) {
      var $this = this;
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (index === 5) {
            sums[index] = '-';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            if(index === 6){
              sums[index] = sums[index].toFixed(2);
            }
          } else {
            sums[index] = '-';
          }
        });
        return sums;
    },
    // 移动端账户选择事件
    clickAccountHandler(e){
      var $this = this;
      var accountList = $this.accountList;
      var account_id = $this.searchData.account_id;
      accountList.forEach(function(item,index){
        if(item.value == e.value){
          item.isOn = !item.isOn;
          if(item.isOn){
            if(!account_id.includes(item.value)){
              account_id.push(item.value);
            }
          }else{
            if(account_id.length == 0){
              account_id = [];
            }else{
              if(account_id.includes(item.value)){
                var newAccount = [];
                account_id.forEach(function(item1,index1){
                  if(item1!=item.value){
                    newAccount.push(item1);
                  }
                });
                account_id = newAccount;
              }
            }
          }
        }
      });
      $this.accountList = accountList;
      $this.searchData.account_id = account_id;
    },
    // 移动端渠道选择事件
    clickChannelHandler(e){
      var $this = this;
      var channelList = $this.channelList;
      var processtype = $this.searchData.processtype;
      channelList.forEach(function(item,index){
        if(item.value == e.value){
          item.isOn = !item.isOn;
          if(item.isOn){
            if(!processtype.includes(item.value)){
              processtype.push(item.value);
            }
          }else{
            if(processtype.length == 0){
              processtype = [];
            }else{
              if(processtype.includes(item.value)){
                var newArr = [];
                processtype.forEach(function(item1,index1){
                  if(item1!=item.value){
                    newArr.push(item1);
                  }
                });
                processtype = newArr;
              }
            }
          }
        }
      });
      $this.channelList = channelList;
      $this.searchData.processtype = processtype;
    },
    // 移动端负责人选择事件
    clickUserHandler(e){
      var $this = this;
      var userList = $this.userList;
      var processuserid = $this.searchData.processuserid;
      userList.forEach(function(item,index){
        if(item.value == e.value){
          item.isOn = !item.isOn;
          if(item.isOn){
            if(!processuserid.includes(item.value)){
              processuserid.push(item.value);
            }
          }else{
            if(processuserid.length == 0){
              processuserid = [];
            }else{
              if(processuserid.includes(item.value)){
                var newArr = [];
                processuserid.forEach(function(item1,index1){
                  if(item1!=item.value){
                    newArr.push(item1);
                  }
                });
                processuserid = newArr;
              }
            }
          }
        }
      });
      $this.userList = userList;
      $this.searchData.processuserid = processuserid;
    },
    // 移动端品牌选择事件
    clickBrandHandler(e){
      var $this = this;
      var brandList = $this.brandList;
      var brand_id = $this.searchData.brand_id;
      brandList.forEach(function(item,index){
        if(item.value == e.value){
          item.isOn = !item.isOn;
          if(item.isOn){
            $this.searchData.dept_id = item.value;
            if(!brand_id.includes(item.value)){
              brand_id.push(item.value);
            }
          }else{
            if(brand_id.length == 0){
              brand_id = [];
            }else{
              if(brand_id.includes(item.value)){
                var newArr = [];
                brand_id.forEach(function(item1,index1){
                  if(item1!=item.value){
                    newArr.push(item1);
                  }
                });
                brand_id = newArr;
              }
            }
          }
        }
      });
      $this.brandList = brandList;
      $this.searchData.brand_id = brand_id;
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
