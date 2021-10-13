<template>
  <div class="page-root flex-box no-padding SaleCard" ref="boxPane">
    <div class="sub-router SaleCardFl"  ref="SaleCardFl">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <div class="sub-wrapper">
          <div class="side-button">
            <dl class="Sales-list">
                <dt v-if="menuButtonPermit.includes('Sales_lookphoneall')||menuButtonPermit.includes('Sales_phonecount')" v-on:click="datastatisticClues()"><span>业务员数据统计</span></dt>
                <dt v-if="menuButtonPermit.includes('Sales_waitphone')||menuButtonPermit.includes('Sales_lookphoneall')" v-bind:class="currentStatus === 'waitcount'?'active':''" v-on:click="jumpLink('waitcount')"><span>等待分配</span><i>({{defaultData.waitcount}})</i></dt>
                <dt v-if="menuButtonPermit.includes('Sales_allphone')||menuButtonPermit.includes('Sales_lookphoneall')" v-bind:class="currentStatus === 'allotcount'?'active':''" v-on:click="jumpLink('allotcount')"><span>所有已分配询盘</span><i>({{defaultData.allotcount}})</i></dt>
            </dl>
          </div>
          <dl class="Salelist">
              <dt v-if="menuButtonPermit.includes('Sales_index')" v-bind:class="currentStatus === 'personcount'?'active':''" v-on:click="jumpLink('personcount')"><span>个人所有询盘</span><i>({{defaultData.personcount}})</i></dt>
              <dt v-if="menuButtonPermit.includes('Sales_waitdeal')||menuButtonPermit.includes('Sales_lookphoneall')" v-bind:class="currentStatus === 'waitdealcount'?'active':''" v-on:click="jumpLink('waitdealcount')"><span>等待处理</span><i class="redsale">({{defaultData.waitdealcount}})</i></dt>
              <dt v-if="menuButtonPermit.includes('Sales_monthsay')||menuButtonPermit.includes('Sales_lookphoneall')" v-bind:class="currentStatus === 'monthsaycount'?'active':''" v-on:click="jumpLink('monthsaycount')"><span>月底前需反馈</span><i>({{defaultData.monthsaycount}})</i></dt>
              <dt v-if="menuButtonPermit.includes('Sales_hasnosay')||menuButtonPermit.includes('Sales_lookphoneall')" v-bind:class="currentStatus === 'hasnosaycount'?'active':''" v-on:click="jumpLink('hasnosaycount')"><span>所有未反馈</span><i>({{defaultData.hasnosaycount}})</i></dt>
              <dt v-if="menuButtonPermit.includes('Sales_waitftword')||menuButtonPermit.includes('Sales_lookphoneall')" v-bind:class="currentStatus === 'waitftwordcount'?'active':''" v-on:click="jumpLink('waitftwordcount')"><span>等待添加富通ID</span><i>({{defaultData.waitftwordcount}})</i></dt>
              <dt v-if="menuButtonPermit.includes('Sales_hasdeal')||menuButtonPermit.includes('Sales_lookphoneall')" v-bind:class="currentStatus === 'hasdealcount'?'active':''" v-on:click="jumpLink('hasdealcount')"><span>已处理</span><i>({{defaultData.hasdealcount}})</i></dt>
              <dt v-if="menuButtonPermit.includes('Sales_hassay')||menuButtonPermit.includes('Sales_lookphoneall')" v-bind:class="currentStatus === 'hassaycount'?'active':''" v-on:click="jumpLink('hassaycount')"><span>已做反馈</span><i>({{defaultData.hassaycount}})</i></dt>
          </dl>
          <div class="side-button">
            <dl class="Sales-list">
                <dt v-if="menuButtonPermit.includes('Sales_search')" v-on:click="dataStatistic()" v-bind:class="currentStatus === 'SalesSearch'?'active':''"><span>数据分析</span></dt>
            </dl>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="flex-content SaleCardFr">
      <div class="abs-panel">
          <div class="scroll-panel" ref="scrollPane">
            <p class="breadcrumb" ref="breadcrumbPane">
              <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
              <template v-for="item in breadcrumbList">
                <router-link class="breadcrumb-link" :to="item.router+'?Status=personcount'" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
                <span class="breadcrumb-link" v-bind:key="item.id" v-else><b>-</b><span>{{item.title}}</span></span>
              </template>
              <span class="breadcrumb-link"><b>-</b><span>数据分析</span></span>
            </p>
            <el-card class="box-card scroll-card SaleCardFlFrDatastatistic" shadow="hover">                    
                <div class="card-content SaleCardDataTop">
                    <div class="SaleCardDate buttonTwo">
                      <div class="group-header"><span>业务员</span></div>
                      <div class="group-body">
                        <div class="team-panel">
                            <el-checkbox class="all-select" 
                            v-model="checkAllUser"
                            :indeterminate="isAllUser" 
                            @change="handleCheckAllUserChange"  border size="mini">全选</el-checkbox>
                            <el-checkbox-group class="team-list" v-model="searchData.userid" 
                            @change="handleCheckedUserhange" size="mini">
                              <el-checkbox class="item-checkbox" v-for="item in userlist" :label="item.value" :key="item.value" border>{{item.label}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                      </div>
                    </div>
                    <div class="SaleCardDate buttonTwo">
                      <div class="group-header"><span>时间</span></div>
                      <div class="group-body">
                        <div class="team-panel">
                            <el-select v-model="searchData.timetype" size="small" clearable placeholder="选择时间" style="width:140px;margin:5px 10px 5px 4px;float:left;">
                                <el-option
                                    v-for="item in timetypeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-date-picker
                                v-model="searchData.date"
                                size="small"
                                type="daterange"
                                align="right"
                                value-format = "yyyy-MM-dd"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                style="float:left;margin:5px 10px 5px 0px; width:280px;"
                                :picker-options="pickerRangeOptions">
                            </el-date-picker>
                        </div>
                      </div>
                    </div>
                    <div class="SaleCardDate buttonTwo">
                      <div class="group-header"><span>属性</span></div>
                      <div class="group-body">
                        <div class="team-panel">
                            <el-checkbox class="all-select"
                            v-model="checkAllArea"
                            :indeterminate="isAllArea" 
                            @change="handleCheckAllAreaChange"  border size="mini">全选</el-checkbox>
                            <el-checkbox-group class="team-list" v-model="searchData.area" 
                            @change="handleCheckedAreahange" size="mini">
                              <el-checkbox class="item-checkbox" v-for="item in arealist" :label="item.value" :key="item.value" border>{{item.label}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div class="team-panel" v-if="productList.length>0">
                            <el-checkbox class="all-select"
                            v-model="checkAllProductType"
                            :indeterminate="isProductType" 
                            @change="handleCheckAllProductTypeChange"
                             border size="mini">全选</el-checkbox>
                            <el-checkbox-group class="team-list" v-model="searchData.producttype_id" @change="handleCheckedProductTypehange" size="mini">
                              <el-checkbox class="item-checkbox" v-for="item in productList" :label="item.value" :key="item.value" border>{{item.label}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div class="team-panel">
                            <el-checkbox class="all-select"
                            v-model="checkAllmanagestatus"
                            :indeterminate="ismanagestatus" 
                            @change="handleCheckAllmanagestatusChange" 
                            border size="mini">全选</el-checkbox>
                            <el-checkbox-group class="team-list" v-model="managestatusArr" @change="handleCheckedmanagestatuschange" size="mini">
                              <el-checkbox class="item-checkbox" v-for="item in managestatusList" :label="item.value" :key="item.value" border>{{item.label}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div class="team-panel">
                            <el-checkbox class="all-select"
                            v-model="checkAllReplystatus"
                            :indeterminate="isReplystatus" 
                            @change="handleCheckAllReplystatusChange" border size="mini">全选</el-checkbox>
                            <el-checkbox-group class="team-list" v-model="replystatusArr" @change="handleCheckedReplystatuschange" size="mini">
                              <el-checkbox class="item-checkbox" v-for="item in replystatusList" :label="item.value" :key="item.value" border>{{item.label}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                      </div>
                    </div>
                    <div class="SaleCardDate buttonTwo">
                      <div class="group-header"><span>分组</span></div>
                      <div class="group-body">
                        <div class="team-panel customRadio">
                             <span class="item-clues" v-for="item in groupList" v-bind:class="item.isOn?'active':''" v-bind:key="item.value" v-on:click="groupClick(item.value)"><i></i>{{item.label}}</span>
                        </div>
                      </div>
                    </div>
                    <div class="WebServerAddEditBtn ChinaphoneTwoBtn">
                        <el-button type="primary" class="updateBtn" :class="isDisabled?'isDisabled':''" :disabled="isDisabled" size="small" v-on:click="searchResult"><i class="svg-i planeWhite" ><svg-icon icon-class="planeWhite" /></i>查询</el-button>
                    </div>
                </div>               
                <div class="card-content SaleCardDataBom" v-if="tableData.length>0" id="resultPane" ref="resultPane">                 
                  <el-table
                    ref="simpleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    stripe
                    class="SiteTable"
                    style="width: 100%;"
                    >
                    <el-table-column
                      prop="uname"
                      label="业务员姓名"
                      align="center"
                      v-if="is_groupData=='3'"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="producttypename"
                      label="产品分类"
                      align="center"
                      v-if="is_groupData=='1'"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="continent"
                      label="地区"
                      align="center"
                      v-if="is_groupData=='2'"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="number"
                      label="数量"
                      align="center"
                      >
                    </el-table-column>
                  </el-table>
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
  name: 'Sales_search',
  data() {
    return {
      breadcrumbList:[],
      checkAllUser:false,
      isAllUser:false,
      checkAllArea:false,
      isAllArea:false,
      checkAllProductType:false,
      isProductType:false,
      checkAllmanagestatus:false,
      ismanagestatus:false,
      checkAllReplystatus:false,
      isReplystatus:false,
      currentStatus:"SalesSearch",
      status:1,
      menuButtonPermit:[],
      defaultData:{},
      tableData:[],
      searchData:{
        userid:[],
        producttype_id:[],
        area:[],
        date:[],
        managestatus: "",
        replystatus: "",
        is_group: "",
        timetype: "",
        starttime: "",
        endtime: "",
        user:""
      },
      productList:[],
      userlist:[],
      arealist:[
        {label:"东南亚",value:"东南亚"},
        {label:"中亚",value:"中亚"},
        {label:"东亚",value:"东亚"},
        {label:"西亚",value:"西亚"},
        {label:"南亚",value:"南亚"},
        {label:"非洲",value:"非洲"},
        {label:"欧洲",value:"欧洲"},
        {label:"南美洲",value:"南美洲"},
        {label:"北美洲",value:"北美洲"},
        {label:"大洋洲",value:"大洋洲"},
      ],
      managestatusArr:[],
      managestatusList:[
        {label:"待处理",value:1},
        {label:"已处理",value:2},
      ],
      replystatusArr:[],
      replystatusArrShow:[],
      replystatusList:[
        {label:"已回复",value:2},
        {label:"无回复",value:3},
      ],
      groupArr:[],
      is_groupData: "",
      groupList:[
        {label:"产品分类",value:1,isOn:false},
        {label:"客户地区",value:2,isOn:false},
        {label:"业务员",value:3,isOn:false},
      ],
      timetypeList:[
        {label:"按照分配时间",value:1},
        {label:"按照添加时间",value:2},
      ],
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
      isLoading:null,
      isDisabled:false,
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'menuData'
    ]),
  },
  created(){
    var $this = this;
    $this.getBreadcrumbList();
    $this.initData();
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
    // 搜索结果
    searchResult(){
      var $this = this;
      if(!$this.isDisabled){
        if($this.searchData.is_group==''){
          $this.$message({
              showClose: true,
              message: '错误：请至少选择一个分组！',
              type: 'error'
          });
          return false;
        }
        if($this.searchData.is_group == '1'&&$this.searchData.producttype_id.length<1){
          $this.$message({
              showClose: true,
              message: '错误：请至少选择一个产品！',
              type: 'error'
          });
          return false;
        }
        if($this.searchData.is_group == '2'&&$this.searchData.area.length<1){
          $this.$message({
              showClose: true,
              message: '错误：请至少选择一个地区！',
              type: 'error'
          });
          return false;
        }
        if($this.searchData.is_group == '3'&&$this.searchData.userid.length<1){
          $this.$message({
              showClose: true,
              message: '错误：请至少选择一个业务员！',
              type: 'error'
          });
          return false;
        }
        $this.isDisabled=true;
        $this.loadingFun();
        $this.is_groupData=$this.searchData.is_group;
        $this.initCluesList();
      }
    },    
    // 初始化数据
    initData(){
      var $this = this;    
      $this.loadingFun();
      $this.getUserMenuButtonPermit();
    },
    // 初始化页面信息-数据分析查询条件
    initPage(){
      var $this = this;
      $this.$store.dispatch('Sales/getSalesAnalysisConditionAction', null).then(response=>{
        if(response){
          if(response.status){
            var productList=[];
            if(response.producttype.length>1){
              response.producttype.forEach(function(item,index){
                var itemData = {};
                itemData.label = item.name;
                itemData.value = item.id;
                productList.push(itemData);
              });
              $this.productList=productList;
            }
            if(response.userlist.length>1){
              var userlist=[];
              response.userlist.forEach(function(item,index){
                var itemData = {};
                itemData.label = item.name;
                itemData.value = item.id;
                userlist.push(itemData);
              });
              $this.userlist=userlist;
            }
            $this.isLoading.close();
          }else{
            $this.isLoading.close();
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
    // 组装搜索接口所需数据
    initSearchData(){
      var $this = this;
      var searchData = {};
      if($this.searchData.userid.length>0){
        searchData.userid = $this.searchData.userid;
      }
      if($this.searchData.producttype_id.length>0){
        searchData.producttype_id = $this.searchData.producttype_id;
      }
      if($this.searchData.area.length>0){
        searchData.area = $this.searchData.area;
      }
      if($this.searchData.date.length>0){
        searchData.starttime = $this.searchData.date[0];
        searchData.endtime = $this.searchData.date[1];
      }
      if($this.searchData.is_group&&$this.searchData.is_group!=''){
        searchData.is_group = $this.searchData.is_group;
      }
      if($this.searchData.managestatus&&$this.searchData.managestatus!=''){
        searchData.managestatus = $this.searchData.managestatus;
      }
      if($this.searchData.replystatus&&$this.searchData.replystatus!=''){
        searchData.replystatus = $this.searchData.replystatus;
      }
      if($this.searchData.timetype&&$this.searchData.timetype!=''){
        searchData.timetype = $this.searchData.timetype;
      }
      return searchData;
    },
    // 初始化询盘列表数据
    initCluesList(){
      var $this = this;
      var searchData = $this.initSearchData();
      $this.loadingFun();
      $this.$store.dispatch('Sales/getSalesDataAnalysisAction', searchData).then(response=>{
        if(response){
          if(response.status){
            $this.tableData = response.data;
            $this.$nextTick(()=>{
              document.getElementById("resultPane").scrollIntoView({behavior: "smooth"});
            });
            $this.isLoading.close();
            setTimeout(()=>{
              $this.isDisabled=false;
            },1000);
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
          var infoData = {};
          infoData.allcount=response.allcount;
          infoData.warnlist=response.warnlist;
          $this.infoData = infoData;
          $this.isLoading.close();
        }
      });
    },
    // 侧边任务数据
    publlcData(){
      var $this = this;
      $this.$store.dispatch('Sales/getSalesPublicDataAction', null).then(response=>{
        if(response){        
          var defaultData = {};
          defaultData.waitcount=response.waitcount;
          defaultData.allotcount=response.allotcount;
          defaultData.personcount=response.personcount;
          defaultData.waitdealcount=response.waitdealcount;
          defaultData.monthsaycount=response.monthsaycount;
          defaultData.hasnosaycount=response.hasnosaycount;
          defaultData.waitftwordcount=response.waitftwordcount;
          defaultData.hasdealcount=response.hasdealcount;
          defaultData.hassaycount=response.hassaycount;
          $this.defaultData = defaultData;
          $this.initPage();
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
            });
            if($this.menuButtonPermit.includes('Sales_search')){
               $this.publlcData();
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
    // 页面自跳转
    jumpLink(status){
        var $this = this;
        var routeUrl = $this.$router.resolve({path:'/Sales/index',query:{Status:status}});
        window.open(routeUrl.href,'_self');
    },
    //分组点击事件
    groupClick(id){
      var $this = this;
      var groupArr = $this.groupList;
      groupArr.forEach(function(item,index){
        if(item.value == id){
          if(item.isOn){
            item.isOn = false;
          }else{
            item.isOn = true;
            $this.searchData.is_group = id;
          }
        }else{
          item.isOn = false;
        }
      });
    },
    //业务员点击事件
    handleCheckedUserhange(e){
      var $this = this;
      var checkedCount = e.length;
      if(checkedCount === $this.userlist.length){
        $this.checkAllUser = true;
      }else{
        $this.checkAllUser = false;
      }
      if(checkedCount>0&&checkedCount<$this.userlist.length){
        $this.isAllUser = true;
      }else{
        $this.isAllUser = false;
      }
    },
    // 业务员全选点击事件
    handleCheckAllUserChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.userlist.forEach(function(item,index){
            checkedList.push(item.value);
        });
        $this.searchData.userid = checkedList;
        $this.checkAllUser = true;
      }else{
        $this.searchData.userid = [];
        $this.checkAllUser = false;
      }
      $this.isAllUser = false;
    },
    //地区点击事件
    handleCheckedAreahange(e){
      var $this = this;
      var checkedCount = e.length;
      if(checkedCount === $this.arealist.length){
        $this.checkAllArea = true;
      }else{
        $this.checkAllArea = false;
      }
      if(checkedCount>0&&checkedCount<$this.arealist.length){
        $this.isAllArea = true;
      }else{
        $this.isAllArea = false;
      }
    },
    // 地区全选点击事件
    handleCheckAllAreaChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.arealist.forEach(function(item,index){
            checkedList.push(item.value);
        });
        $this.searchData.area = checkedList;
        $this.checkAllArea = true;
      }else{
        $this.searchData.area = [];
        $this.checkAllArea = false;
      }
      $this.isAllArea = false;
    },
    //产品分类点击事件
    handleCheckedProductTypehange(e){
      var $this = this;
      var checkedCount = e.length;
      if(checkedCount === $this.productList.length){
        $this.checkAllProductType = true;
      }else{
        $this.checkAllProductType = false;
      }
      if(checkedCount>0&&checkedCount<$this.productList.length){
        $this.isProductType = true;
      }else{
        $this.isProductType = false;
      }
    },
    // 产品分类全选点击事件
    handleCheckAllProductTypeChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.productList.forEach(function(item,index){
            checkedList.push(item.value);
        });
        $this.searchData.producttype_id = checkedList;
        $this.checkAllProductType = true;
      }else{
        $this.searchData.producttype_id = [];
        $this.checkAllProductType = false;
      }
      $this.isProductType = false;
    },
    //待处理已处理点击事件
    handleCheckedmanagestatuschange(e){
      var $this = this;
      var checkedCount = e.length;
      if(checkedCount === $this.managestatusList.length){
        $this.checkAllmanagestatus = true;
        $this.searchData.managestatus ='';
      }else{
        $this.checkAllmanagestatus = false;
        $this.searchData.managestatus = e.toString();
      }
      if(checkedCount>0&&checkedCount<$this.managestatusList.length){
        $this.ismanagestatus = true;
      }else{
        $this.ismanagestatus = false;
      }
    },
    // 待处理已处理全选点击事件
    handleCheckAllmanagestatusChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.managestatusList.forEach(function(item,index){
            checkedList.push(item.value);
        });
        $this.managestatusArr = checkedList;
        $this.checkAllmanagestatus = true;
      }else{
        $this.managestatusArr = [];
        $this.checkAllmanagestatus = false;
      }
      $this.ismanagestatus = false;
      $this.searchData.managestatus ='';
    },
    // 已回复无回复点击事件
    handleCheckedReplystatuschange(e){
      var $this = this;
      var checkedCount = e.length;
      if(checkedCount === $this.replystatusList.length){
        $this.checkAllReplystatus = true;
        $this.searchData.replystatus ='';
      }else{
        $this.checkAllReplystatus = false;
        $this.searchData.replystatus = e.toString();
      }
      if(checkedCount>0&&checkedCount<$this.replystatusList.length){
        $this.isReplystatus = true;
      }else{
        $this.isReplystatus = false;
      }
    },
    // 已回复无回复全选点击事件
    handleCheckAllReplystatusChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.replystatusList.forEach(function(item,index){
            checkedList.push(item.value);
        });
        $this.replystatusArr = checkedList;
        $this.checkAllReplystatus = true;
      }else{
        $this.replystatusArr = [];
        $this.checkAllReplystatus = false;
      }
      $this.isReplystatus = false;
      $this.searchData.replystatus ='';
    },
    dataStatistic(){
      var $this = this;
      $this.$router.push({path:'/Sales/search'});
    },
    // 跳转数据统计页面
    datastatisticClues(){
      var $this = this;
      $this.$router.push({path:'/Sales/phonecount'});
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
