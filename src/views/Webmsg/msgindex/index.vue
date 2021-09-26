<template>
    <div class="page-root flex-box no-padding web-msg" ref="boxPane">
        <div class="sub-router">
            <el-scrollbar wrap-class="scrollbar-wrapper">
                <ul class="sub-router-list">
                    <li v-if="menuButtonPermit.includes('Webmsg_allmsg')" v-bind:class="currentStatus === 'All'?'active':''" v-on:click="jumpLink('All')"><span>全部</span><b>({{defaultData.totalNum}})</b></li>
                    <li v-if="menuButtonPermit.includes('Webmsg_nodealmsg')" v-bind:class="currentStatus === 'Untreated'?'active':''" v-on:click="jumpLink('Untreated')"><span>未处理</span><b>({{defaultData.untreatedNum}})</b></li>
                    <li v-if="menuButtonPermit.includes('Webmsg_persondealmsg')" v-bind:class="currentStatus === 'Pending'?'active':''" v-on:click="jumpLink('Pending')"><span>个人待处理</span><b>({{defaultData.pendingNum}})</b></li>
                    <li v-if="menuButtonPermit.includes('Webmsg_hasdealmsg')" v-bind:class="currentStatus === 'Processed'?'active':''" v-on:click="jumpLink('Processed')"><span>已处理</span><b>({{defaultData.processedNum}})</b></li>
                    <li v-if="menuButtonPermit.includes('Webmsg_hasstarmsg')" v-bind:class="currentStatus === 'Starred'?'active':''" v-on:click="jumpLink('Starred')"><span>加星标</span><b>({{defaultData.starNum}})</b></li>
                    <li v-if="menuButtonPermit.includes('Webmsg_rubblishmsg')" v-bind:class="currentStatus === 'Spam'?'active':''" v-on:click="jumpLink('Spam')"><span>垃圾信息</span><b>({{defaultData.spamNum}})</b></li>
                    <li v-if="menuButtonPermit.includes('Webmsg_testmsg')" v-bind:class="currentStatus === 'Test'?'active':''" v-on:click="jumpLink('Test')"><span>测试数据</span><b>({{defaultData.testNum}})</b></li>
                    <li v-if="menuButtonPermit.includes('Webmsg_pushwaitdeal')" v-bind:class="currentStatus === 'SNS_1'?'active':''" v-on:click="jumpLink('SNS_1')" style="margin-top:32px;"><span>推广待处理</span><b>({{defaultData.sns1Num}})</b></li>
                    <li v-if="menuButtonPermit.includes('Webmsg_pushhasdeal')" v-bind:class="currentStatus === 'SNS_2'?'active':''" v-on:click="jumpLink('SNS_2')"><span>推广已处理</span><b>({{defaultData.sns2Num}})</b></li>
                    <li v-if="menuButtonPermit.includes('Webmsg_filetermsg')" v-bind:class="currentStatus === 'Filter'?'active':''" v-on:click="jumpLink('Filter')" style="margin-cctop:32px;"><span>已过滤垃圾信息</span><b>({{defaultData.filterNum}})</b></li>
                    <li v-if="menuButtonPermit.includes('Webmsg_deletemsg')" v-bind:class="currentStatus === 'Recycle'?'active':''" v-on:click="jumpLink('Recycle')" style="margin-top:32px;"><span>回收站</span><b>({{defaultData.recycleNum}})</b></li>
                </ul>
                <div class="tips">
                  <p>tips：显示45天内的数据</p>
                </div>
            </el-scrollbar>
        </div>
        <div class="flex-content relative">
            <div class="abs-panel" ref="mainPane">
                <div class="scroll-panel" ref="scrollDom" style="will-change:scroll-position">
                  <div class="true-height" ref="scrollPane">
                    <p class="breadcrumb" ref="breadcrumbPane">
                      <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
                      <template v-for="item in breadcrumbList">
                        <router-link class="breadcrumb-link" :to="item.router+'?Status=Untreated'" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
                        <span class="breadcrumb-link" v-bind:key="item.id" v-else><b>-</b><span>{{item.title}}</span></span>
                      </template>
                      <span class="breadcrumb-link"><b>-</b><span>{{breadcrumbName}}</span></span>
                    </p>
                    <el-card class="box-card scroll-card" shadow="hover">
                        <div slot="header">
                            <div class="card-header" ref="headerPane">
                                <div class="search-wrap">
                                    <div class="item-search">
                                        <el-select v-model="searchData.language" size="small" clearable placeholder="请选择语言">
                                            <el-option
                                                v-for="item in languageList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <div class="item-search">
                                        <el-select v-model="searchData.brand_id" size="small" clearable placeholder="请选择品牌">
                                            <el-option
                                                v-for="item in brandList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <div class="item-search">
                                        <el-input
                                            style="width: 280px;"
                                            placeholder="网站、URL、标识、Email、客户名等"
                                            v-model="searchData.keyword"
                                            size="small"
                                            clearable>
                                        </el-input>
                                    </div>
                                    <div class="item-search">
                                        <el-button class="item-input" size="small" type="primary" icon="el-icon-search" @click="searchResult">查询</el-button>
                                    </div>
                                    <div class="item-search">
                                        <el-button class="item-input" size="small" type="primary" :disabled="!isReady" :icon="isReady?'':'el-icon-loading'" v-if="menuButtonPermit.includes('Webmsg_getmsg')" @click="getCnMsgData">同步中文留言</el-button>
                                    </div>
                                    <div class="item-search" v-if="currentStatus==='Untreated'&&menuButtonPermit.includes('Webmsg_addpersondeal')">
                                        <el-button class="item-input" size="small" type="primary" :disabled="isDisabled" @click="allotToPending">添加到个人待处理</el-button>
                                    </div>
                                    <div class="item-search" v-if="(currentStatus==='Filter'&&menuButtonPermit.includes('Webmsg_filterback'))||(currentStatus==='Recycle'&&menuButtonPermit.includes('Webmsg_deleteback'))">
                                        <el-button class="item-input" size="small" type="primary" :disabled="isDisabled" @click="msgBack">还原</el-button>
                                    </div>
                                    <div class="item-search" v-if="menuButtonPermit.includes('Webmsg_delete')||(currentStatus==='Recycle'&&menuButtonPermit.includes('Webmsg_deleteconfirm'))">
                                        <el-button class="item-input" size="small" type="primary" :disabled="isDisabled" @click="deleteTableRow">删除</el-button>
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
                                    class="SiteTable msg-table EntableColor"
                                    style="width: 100%"
                                    :style="'min-height:'+minHeight+'px;'"
                                    row-key="id"
                                    @selection-change="handleSelectionChange"
                                    >
                                    <el-table-column
                                        type="selection"
                                        align="center"
                                        width="48">
                                    </el-table-column>
                                    <el-table-column
                                        prop="id"
                                        label="类型"
                                        width="90"
                                        >
                                        <template slot-scope="scope">
                                          <div class="msg-text">
                                            <p><strong class="EnColor05">ID：</strong><span class="txt-span">{{scope.row.id}}</span></p>
                                            <p class="star-p"><strong class="EnColor05">星标：</strong><i class="svg-i" v-if="scope.row.isStar"><svg-icon icon-class="star1" class-name="disabled" /></i></p>
                                            <p class="txt-api" v-if="scope.row.appid"><strong class="EnColor05">APPID：</strong><span class="txt-span">{{scope.row.appid}}</span></p>
                                          </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="webdomain"
                                        label="来源"
                                        width="160"
                                        >
                                        <template slot-scope="scope">
                                          <div class="msg-text">
                                            <p><strong class="EnColor05">域名：</strong><span class="txt-span">{{scope.row.webdomain}}</span></p>
                                            <p><strong class="EnColor05">网站ID：</strong><span class="txt-span">{{scope.row.website_id}}</span></p>
                                            <p><strong class="EnColor05">IP：</strong><a :href="'https://www.ip138.com/iplookup.asp?ip='+scope.row.ip+'&action=2'" target="_blank" class="txt-link">{{scope.row.ip}}</a><span v-if="scope.row.ip&&scope.row.ip!=''&&scope.row.ipcount>1" class="txt-link num-span" v-on:click="searchJumpLink(scope.row.ip)">({{scope.row.ipcount}})</span></p>
                                            <p><strong class="EnColor05">URL：</strong><a :href="scope.row.refer" target="_blank" class="txt-link">打开</a></p>
                                            <p><strong class="EnColor05">标识：</strong><span class="txt-span">{{scope.row.site_feedback}}</span></p>
                                            <p><strong class="EnColor05">渠道：</strong><span class="txt-span">{{scope.row.from_way}}</span></p>
                                          </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="name"
                                        label="联系方式"
                                        width="160"
                                        >
                                        <template slot-scope="scope">
                                          <div class="msg-text">
                                            <p><strong class="EnColor05">联系人：</strong><span class="txt-span">{{scope.row.name}}</span></p>
                                            <p><strong class="EnColor05">电话：</strong><span class="txt-span">{{scope.row.encryptPhone}}</span><span v-if="scope.row.encryptPhone&&scope.row.encryptPhone!=''&&scope.row.phonecount>1" class="txt-link num-span" v-on:click="searchJumpLink(scope.row.encryptPhone)">({{scope.row.phonecount}})</span></p>
                                            <p><strong class="EnColor05">Email：</strong><span class="txt-span">{{scope.row.encryptEmail}}</span><span v-if="scope.row.encryptEmail&&scope.row.encryptEmail!=''&&scope.row.emailcount>1" class="txt-link num-span" v-on:click="searchJumpLink(scope.row.encryptEmail)">({{scope.row.emailcount}})</span></p>
                                            <p><strong class="EnColor05">理想联系方式：</strong><span class="txt-span">{{scope.row.othercontact}}</span></p>
                                          </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="productname"
                                        label="留言内容"
                                        min-width="160"
                                        >
                                        <template slot-scope="scope">
                                          <div class="msg-text">
                                            <p><strong class="EnColor05">产品：</strong><span class="txt-span">{{scope.row.productname}}</span></p>
                                            <p><strong class="EnColor05">标题：</strong><span class="txt-span">{{scope.row.topic}}</span></p>
                                            <p><strong class="EnColor05">内容：</strong><span class="txt-span">{{scope.row.message}}</span></p>
                                          </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="remark"
                                        label="中文备注"
                                        width="140"
                                        >
                                        <template slot-scope="scope">
                                          <div class="msg-input">
                                            <el-input size="small" type="textarea" rows="7" resize="none" v-model="scope.row.remark"></el-input>
                                          </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="addtime"
                                        label="时间"
                                        width="160"
                                        >
                                        <template slot-scope="scope">
                                          <div class="msg-text">
                                            <p><strong class="EnColor05">留言时间：</strong><br /><span class="txt-span">{{scope.row.addtime}}</span></p>
                                            <p><strong class="EnColor05">处理时间：</strong><br /><span class="txt-span">{{scope.row.dealtime?scope.row.dealtime:"未处理"}}</span></p>
                                            <p><strong class="EnColor05">更新时间：</strong><br /><span class="txt-span">{{scope.row.updatetime}}</span></p>
                                          </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="dealusername"
                                        label="分配人员"
                                        width="190"
                                        >
                                        <template slot-scope="scope">
                                          <div class="msg-text input-msg">
                                            <p><el-checkbox v-model="scope.row.isProcessed" label="已处理" border size="mini" class="checkbox-inline"></el-checkbox><span class="txt-span">{{scope.row.dealusername}}</span></p>
                                            <p><el-checkbox v-model="scope.row.isStar" label="加星标" border size="mini"></el-checkbox></p>
                                            <p>
                                              <strong class="txt-strong EnColor05">质量级：</strong>
                                              <el-select v-model="scope.row.qualitylevel" placeholder="" style="width: 118px;" size="mini">
                                                <el-option
                                                  v-for="item in levelList"
                                                  :key="item.value"
                                                  :label="item.label"
                                                  :value="item.value">
                                                </el-option>
                                              </el-select>
                                            </p>
                                            <p><strong class="txt-strong EnColor05">备注项：</strong><el-input size="small" type="textarea" rows="2" resize="none" style="width: 118px;" v-model="scope.row.xunremark"></el-input></p>
                                          </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="sort"
                                        label="跟踪"
                                        width="120"
                                        >
                                        <template slot-scope="scope">
                                          <div class="msg-text textarea-msg">
                                            <p><strong class="txt-strong EnColor05">询盘分配：</strong><el-input size="mini" type="textarea" rows="1" resize="none" v-model="scope.row.allotremark"></el-input></p>
                                            <p><strong class="txt-strong EnColor05">询盘状态：</strong><el-input size="mini" type="textarea" rows="3" resize="none" v-model="scope.row.xunstatusremark"></el-input></p>
                                          </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        v-if="(menuButtonPermit.includes('Webmsg_edit')||menuButtonPermit.includes('Webmsg_delete')||menuButtonPermit.includes('Webmsg_haswaitdealsub')||menuButtonPermit.indexOf('Webmsg_hasdealsub'))"
                                        width="120"
                                        align="center"
                                        fixed="right"
                                        prop="operations"
                                        label="操作">
                                        <template #default="scope">
                                          <div class="table-button">
                                              <el-button size="mini" @click="editTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Webmsg_edit')&&currentStatus!=='SNS_1'&&currentStatus!=='SNS_2'">修改</el-button>
                                              <el-button size="mini" @click="promotePendingEdit(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Webmsg_haswaitdealsub')&&(currentStatus==='Untreated'||currentStatus==='Pending')">推广待处理</el-button>
                                              <el-button size="mini" @click="promoteProcessedEdit(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Webmsg_hasdealsub')&&currentStatus==='SNS_1'">推广已处理</el-button>
                                              <el-button size="mini" @click="deleteTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Webmsg_delete')&&(currentStatus==='Untreated'||currentStatus==='Pending')" type="info" plain>删除</el-button>
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
export default {
  name: 'Webmsg_msgindex',
  data() {
    return {
        breadcrumbList:[],
        breadcrumbName:'未处理',
        currentStatus:"Untreated",
        lastDate:"",
        currentDate:"",
        status:1,
        menuButtonPermit:[],
        minHeight:"auto",
        tableData:[],
        page:1,
        limit:50,
        pageSizeList:[50, 100, 150, 200],
        totalDataNum:0,
        brandList:[],
        languageList:[],
        searchData:{
            msgtype:"",
            language:"",
            brand_id:"",
            keyword:"",
        },
        levelList:[
          {label:"未分级",value:-1},
          {label:"垃圾信息",value:1},
          {label:"广告信息",value:2},
          {label:"劣质留言",value:3},
          {label:"一般留言",value:4},
          {label:"优质留言",value:5},
        ],
        permitFieldData:[],
        defaultData:{
          totalNum:0,
          untreatedNum:0,
          pendingNum:0,
          processedNum:0,
          starNum:0,
          spamNum:0,
          testNum:0,
          sns1Num:0,
          sns2Num:0,
          filterNum:0,
          recycleNum:0,
        },
        isDisabled:true,
        selectedData:[],
        permitStatus:[],
        isReady:true,
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
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'msgPage',
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
        $this.setHeight();
    });
    window.onresize = () => {
        return (() => {
            $this.setHeight();
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
      var headerHeight = $this.$refs.headerPane.offsetHeight+45;
      var breadcrumbHeight = $this.$refs.breadcrumbPane.offsetHeight;
      var screenHeight = $this.$refs.boxPane.offsetHeight;
      $this.minHeight = screenHeight-headerHeight-breadcrumbHeight-30;
      $this.getBrowserType();
      setTimeout(function() {
          $this.setScrollDom();
      }, 400);
    },
    // 搜索结果
    searchResult(){
      var $this = this;
      $this.loadingFun();
      $this.initPage();
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
      searchData.page = $this.page;
      searchData.limit = $this.limit;
      searchData.language = $this.searchData.language;
      searchData.brand_id = $this.searchData.brand_id;
      searchData.keyword = $this.searchData.keyword;
      var pathUrl = "";
      if($this.currentStatus==="All"){
        pathUrl = "webmsg/webMsgAllListAction";
      }else if($this.currentStatus==="Untreated"){
        pathUrl = "webmsg/webMsgUntreatedListAction";
      }else if($this.currentStatus==="Pending"){
        pathUrl = "webmsg/webMsgPendingListAction";
      }else if($this.currentStatus==="Processed"){
        pathUrl = "webmsg/webMsgProcessedListAction";
      }else if($this.currentStatus==="Starred"){
        pathUrl = "webmsg/webMsgStarListAction";
      }else if($this.currentStatus==="Spam"){
        pathUrl = "webmsg/webMsgSpamListAction";
      }else if($this.currentStatus==="Test"){
        pathUrl = "webmsg/webMsgTestListAction";
      }else if($this.currentStatus==="SNS_1"){
        pathUrl = "webmsg/webMsgPromotePendingListAction";
      }else if($this.currentStatus==="SNS_2"){
        pathUrl = "webmsg/webMsgPromoteProcessedListAction";
      }else if($this.currentStatus==="Filter"){
        pathUrl = "webmsg/webMsgFilterSpamListAction";
      }else{
        pathUrl = "webmsg/webMsgRecycleListAction";
      }
      document.getElementsByClassName("scroll-panel")[0].scrollTop = 0;
      $this.$store.dispatch(pathUrl, searchData).then(response=>{
        if(response){
          if(response.status){
            var tableData = response.data;
            tableData.forEach(function(item,index){
              if(item.starstatus==1){
                item.isStar = false;
              }else{
                item.isStar = true;
              }
              if(item.dealstatus==1){
                item.isProcessed = false;
              }else{
                item.isProcessed = true;
              }
              if($this.currentStatus==="All"||$this.currentStatus==="Untreated"||$this.currentStatus==="Processed"||$this.currentStatus==="Starred"||$this.currentStatus==="Spam"||$this.currentStatus==="Test"||$this.currentStatus==="Filter"){
                if(response.emailshow === 2){
                  if(item.email&&item.email.indexOf("@")!=-1){
                    item.encryptEmail = "";
                    var emailArr = item.email.split("@");
                    var emailName = "";
                    if(emailArr[0].length>3){
                      emailName = emailArr[0].substring(0,emailArr[0].length-3)+"***";
                    }else{
                      emailName = "***";
                    }
                    item.encryptEmail = emailName+emailArr[1]
                  }else{
                    item.encryptEmail = item.email;
                  }
                }else{
                  item.encryptEmail = item.email;
                }
                if(response.phoneshow === 2){
                  if(item.telephone&&item.telephone.length>6){
                    item.encryptPhone = item.telephone.substring(0,item.telephone.length-6)+"******";
                  }else{
                    item.encryptPhone = item.telephone;
                  }
                }else{
                  item.encryptPhone = item.telephone;
                }
              }else{
                item.encryptEmail = item.email;
                item.encryptPhone = item.telephone;
              }
            });
            $this.tableData = tableData;
            $this.totalDataNum = response.allcount;
            $this.$nextTick(()=>{
              $this.setHeight();
            });
            $this.isLoading.close();
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
    // 获取系统筛选数据
    getSearchSystemData(){
      var $this = this;
      $this.$store.dispatch('webmsg/webMsgSearchSystemListAction', null).then(response=>{
        if(response){
          if(response.status){
            var brandList = [];
            response.brand.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.brandname;
              itemData.value = item.id;
              brandList.push(itemData);
            });
            $this.brandList = brandList;
            var languageList = [];
            response.language.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.languagename;
              itemData.value = item.id;
              languageList.push(itemData);
            });
            $this.languageList = languageList;
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
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.$store.dispatch('webmsg/webMsgInitDataAction', null).then(response=>{
        if(response){
          if(response.status){
            $this.defaultData.totalNum = response.countall;
            $this.defaultData.untreatedNum = response.nodealcount;
            $this.defaultData.pendingNum = response.selfnodealcount;
            $this.defaultData.processedNum = response.hasdealcount;
            $this.defaultData.starNum = response.hasstarcount;
            $this.defaultData.spamNum = response.rubblishcount;
            $this.defaultData.testNum = response.testcount;
            $this.defaultData.sns1Num = response.pushnodealcount;
            $this.defaultData.sns2Num = response.pushhasdealcount;
            $this.defaultData.filterNum = response.filtercount;
            $this.defaultData.recycleNum = response.deletecount;
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
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.status){
          if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
              if(item.action_route=="Webmsg_allmsg"){
                $this.permitStatus.push("All");
              }
              if(item.action_route=="Webmsg_nodealmsg"){
                $this.permitStatus.push("Untreated");
              }
              if(item.action_route=="Webmsg_persondealmsg"){
                $this.permitStatus.push("Pending");
              }
              if(item.action_route=="Webmsg_hasdealmsg"){
                $this.permitStatus.push("Processed");
              }
              if(item.action_route=="Webmsg_hasstarmsg"){
                $this.permitStatus.push("Starred");
              }
              if(item.action_route=="Webmsg_rubblishmsg"){
                $this.permitStatus.push("Spam");
              }
              if(item.action_route=="Webmsg_testmsg"){
                $this.permitStatus.push("Test");
              }
              if(item.action_route=="Webmsg_pushwaitdeal"){
                $this.permitStatus.push("SNS_1");
              }
              if(item.action_route=="Webmsg_pushhasdeal"){
                $this.permitStatus.push("SNS_2");
              }
              if(item.action_route=="Webmsg_filetermsg"){
                $this.permitStatus.push("Filter");
              }
              if(item.action_route=="Webmsg_deletemsg"){
                $this.permitStatus.push("Recycle");
              }
            });
            if($this.menuButtonPermit.includes('Webmsg_msgindex')&&$this.permitStatus.length>0){
              if($this.$route.query.Status){
                if($this.permitStatus.includes($this.$route.query.Status)){
                  $this.currentStatus = $this.$route.query.Status;
                  if($this.currentStatus=="All"){
                    $this.breadcrumbName='全部';
                  }
                  if($this.currentStatus=="Untreated"){
                    $this.breadcrumbName='未处理';
                  }
                  if($this.currentStatus=="Pending"){
                    $this.breadcrumbName='个人待处理';
                  }
                  if($this.currentStatus=="Processed"){
                    $this.breadcrumbName='已处理';
                  }
                  if($this.currentStatus=="Starred"){
                    $this.breadcrumbName='加星标';
                  }
                  if($this.currentStatus=="waitftwordcount"){
                    $this.breadcrumbName='垃圾信息';
                  }
                  if($this.currentStatus=="Spam"){
                    $this.breadcrumbName='所有未反馈';
                  }
                  if($this.currentStatus=="Test"){
                    $this.breadcrumbName='测试数据';
                  }
                  if($this.currentStatus=="SNS_1"){
                    $this.breadcrumbName='推广待处理';
                  }
                  if($this.currentStatus=="SNS_2"){
                    $this.breadcrumbName='推广已处理';
                  }
                  if($this.currentStatus=="Filter"){
                    $this.breadcrumbName='已过滤垃圾信息';
                  }
                  if($this.currentStatus=="Recycle"){
                    $this.breadcrumbName='回收站';
                  }
                  if($this.$route.query.keyword){
                    $this.searchData.keyword = $this.$route.query.keyword;
                  }
                  $this.getSearchSystemData();
                }else{
                  $this.$router.push({path:'/Webmsg/msgindex',query:{Status:$this.permitStatus[0]}});
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
      this.loadingFun();
      this.initData();
    },
    // 当前页改变事件
    handleCurrentChange(val) {
      this.page = val;
      this.loadingFun();
      this.initData();
    },
    // 页面自跳转
    jumpLink(status){
        var $this = this;
        $this.resetSearchData();
        $this.$router.push({path:'/Webmsg/msgindex',query:{Status:status}});
    },
    // 搜索跳转
    searchJumpLink(val){
      var $this = this;
      if($this.permitStatus.includes("All")){
        $this.resetSearchData();
        $this.$router.push({path:'/Webmsg/msgindex',query:{Status:'All',keyword:val}});
      }
    },
    // 获取第三方平台中文留言信息
    getCnMsgData(){
      var $this = this;
      $this.loadingFun();
      $this.isReady = false;
      $this.$store.dispatch('webmsg/webMsgSyncPlatMsgAction', {number:$this.msgPage}).then(response=>{
        if(response){
          if(response.status){
            $this.isReady = true;
            if(response.success!=0){
              $this.$message({
                  showClose: true,
                  message: response.info,
                  type: 'success'
              });
              $this.initPage();
            }else{
              $this.$message({
                showClose: true,
                message: "请求失败",
                type: 'error'
              });
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
    // 表格多选改变事件
    handleSelectionChange(val) {
        var $this = this;
        $this.selectedData = val;
        if($this.selectedData.length>0){
          $this.isDisabled = false;
        }else{
          $this.isDisabled = true;
        }
    },
    // 添加到个人待处理
    allotToPending(){
      var $this = this;
      $this.loadingFun();
      if($this.selectedData.length>0){
        var resultData = {};
        resultData.id = [];
        $this.selectedData.forEach(function(item,index){
          resultData.id.push(item.id);
        });
        $this.$store.dispatch('webmsg/webMsgAllotToPendingAction', resultData).then(response=>{
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
      }
    },
    // 留言修改
    editTableRow(row,index){
      var $this = this;
      $this.loadingFun();
      var resultData = {};
      resultData.id = row.id;
      resultData.remark = row.remark;
      resultData.qualitylevel = row.qualitylevel;
      resultData.xunremark = row.xunremark;
      resultData.xunstatusremark = row.xunstatusremark;
      resultData.starstatus = row.isStar?2:1;
      resultData.dealstatus = row.isProcessed?2:1;
      resultData.allotremark = row.allotremark;
      $this.$store.dispatch('webmsg/webMsgEditAction', resultData).then(response=>{
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
    // 删除表格行
    deleteTableRow(row,index){
      var $this = this;
      $this.loadingFun();
      var resultData = {};
      resultData.id =[];
      if(row.id){
          resultData.id = [row.id];
      }else{
          if($this.selectedData.length>0){
              $this.selectedData.forEach(function(item,index){
                  resultData.id.push(item.id);
              });
          }
      }
      if(resultData.id.length>0){
        var msgTxt = "";
        if(row.id){
          if($this.currentStatus==="Recycle"){
            msgTxt = "是否确认永久删除该留言？"
          }else{
            msgTxt = "是否确认删除该留言？"
          }
        }else{
          if($this.currentStatus==="Recycle"){
            msgTxt = "是否确认永久删除选中的留言？"
          }else{
            msgTxt = "是否确认删除选中的留言？"
          }
        }
        $this.$confirm(msgTxt, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            var pathUrl = "";
            if($this.currentStatus==="Recycle"){
              pathUrl = "webmsg/webMsgDeleteAction"
            }else{
              pathUrl = "webmsg/webMsgDeleteAction"
            }
            $this.$store.dispatch(pathUrl, resultData).then(response=>{
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
      }
    },
    // 回收站垃圾信息还原
    msgBack(){
      var $this = this;
      if($this.selectedData.length>0){
        var resultData = {};
        resultData.id = [];
        $this.selectedData.forEach(function(item,index){
          resultData.id.push(item.id);
        });
        var pathUrl = "";
        if($this.currentStatus==="Recycle"){
          pathUrl = "webmsg/webMsgRecycleBackAction";
        }else{
          pathUrl = "webmsg/webMsgFilterBackAction";
        }
        $this.$store.dispatch(pathUrl, resultData).then(response=>{
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
      }
    },
    // 改为推广待处理
    promotePendingEdit(row,index){
      var $this = this;
      $this.loadingFun();
      $this.$store.dispatch('webmsg/webMsgPromotePendingAction', {id:row.id}).then(response=>{
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
    // 改为推广已处理
    promoteProcessedEdit(row,index){
      var $this = this;
      $this.loadingFun();
      $this.$store.dispatch('webmsg/webMsgPromoteProcessedAction', {id:row.id}).then(response=>{
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
      $this.searchData.keyword = "";
      $this.searchData.language = "";
      $this.searchData.brand_id = "";
      $this.page = 1;
      $this.limit = 50;
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
          }
        }else{
            $this.scrollPosition.fixedBottom = 15;
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
