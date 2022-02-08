<template>
  <div class="page-root scroll-panel depart-index" ref="boxPane" v-resize="changeSize">
        <p class="breadcrumb" ref="breadcrumbPane">
            <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
            <template v-for="item in breadcrumbList">
            <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
            <span class="breadcrumb-link" v-bind:key="item.id" v-else><b>-</b><span>{{item.title}}</span></span>
            </template>
        </p>
        <div class="filter-panel" ref="filterbox">
            <div class="filter-list">
                <div class="item-filter flex-box depart">
                <div class="filter-title"><span class="txt-title">部门：</span></div>
                <div class="filter-content flex-content">
                    <div class="item-list depart">
                    <div class="item-checkbox" v-bind:class="item.isOn?'active':''" v-for="item in departList" v-bind:key="item.id" v-on:click="groupChangeHandler(item.id)"><i></i><span>{{item.name}}</span></div>
                    </div>
                </div>
                </div>
                <div class="item-filter flex-box date">
                <div class="filter-title"><span class="txt-title">日期：</span></div>
                <div class="filter-content flex-content">
                    <div class="item-list">
                    <div class="item-change">
                        <div class="item-font" v-bind:class="item.isOn?'active':''" v-for="item in dateDimension" v-bind:key="item.value" v-on:click="dimensionChangeHandler(item)">{{item.label}}</div>
                    </div>
                    <div class="item-date">
                        <el-date-picker
                        v-if="!selectedData.isMonth"
                        v-model="selectedData.dateDefault"
                        :disabled="!dateSelected"
                        @change="initData"
                        type="daterange"
                        format="yyyy/MM/dd"
                        value-format="yyyy/MM/dd"
                        key="a"
                        size="mini"
                        class="date-range"
                        range-separator="～"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerDateRangeOptions">
                        </el-date-picker>
                        <el-date-picker
                        v-else
                        v-model="selectedData.dateDefault"
                        @change="initData"
                        type="monthrange"
                        format="yyyy/MM"
                        value-format="yyyy/MM"
                        key="b"
                        size="mini"
                        class="date-range"
                        range-separator="～"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerMonthRangeOptions">
                        </el-date-picker>
                    </div>
                    <div class="item-checkbox" v-bind:class="[selectedData.comparedept_id.length>0||!dateSelected?'is-disabled':'',selectedData.isDateCompare?'active':'']" v-on:click="dateCompareChangeHandler"><i></i><span>日期对比</span></div>
                    <div class="item-date" v-if="selectedData.isDateCompare" style="margin-right: 20px;">
                        <el-date-picker
                        v-if="!selectedData.isMonth"
                        v-model="selectedData.dateContrast"
                        @change="initData"
                        type="daterange"
                        format="yyyy/MM/dd"
                        value-format="yyyy/MM/dd"
                        key="c"
                        size="mini"
                        class="date-range"
                        range-separator="～"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerDateRangeOptions">
                        </el-date-picker>
                        <el-date-picker
                        v-else
                        v-model="selectedData.dateContrast"
                        @change="initData"
                        type="monthrange"
                        format="yyyy/MM"
                        value-format="yyyy/MM"
                        key="d"
                        size="mini"
                        class="date-range"
                        range-separator="～"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerMonthRangeOptions">
                        </el-date-picker>
                    </div>
                    </div>
                </div>
                </div>
                <div class="item-filter flex-box filter">
                <div class="filter-title"><span class="txt-title">分析项：</span></div>
                <div class="filter-content flex-content">
                    <div class="item-list">
                    <div class="item-checkbox" v-for="item in contrastList" v-bind:class="[item.isOn?'active':'', item.disabled?'is-disabled':'']" v-bind:key="item.value" v-on:click="analysisItemChangeHandler(item)"><i></i><span>{{item.label}}</span></div>
                    <div class="item-reset" v-if="isFilter"><span v-on:click="resetData">全部重置</span></div>
                    </div>
                </div>
                </div>
            </div>
            <div class="filter-tips"><p><i class="svg-i"><svg-icon icon-class="tips" class-name="disabled" /></i>{{tipsInfo}}</p></div>
        </div>
        <div class="contrast-panel flex-box" :class="isFix ? 'contrast-fixed' : ''" :style="'width:'+ boxWidth + 'px' " v-if="!selectedData.isDateCompare&&selectedData.dept_id.length>0">
            <div class="title-font"><span class="txt-title">对比项：</span></div>
            <div class="contrast-content flex-content">
                <div class="item-list">
                    <div class="item-contrast" v-if="selectedData.dept_id.length>0"><span>{{groupName}}</span><i v-on:click="deleteDefaultGroup" class="svg-i"><svg-icon icon-class="close" class-name="disabled" /></i></div>
                    <template v-if="selectedData.comparetype_id.length>0">
                        <div class="item-contrast" v-if="item.isOn" v-for="item in contrastTypeList" v-bind:key="item.id"><span>{{item.name}}</span><i v-on:click="deleteContrastType(item.id)" class="svg-i"><svg-icon icon-class="close" class-name="disabled" /></i></div>
                    </template>
                    <template v-if="selectedData.comparedept_id.length>0">
                        <div class="item-contrast" v-if="item.isOn" v-for="item in contrastGroupList" v-bind:key="item.id"><span>{{item.name}}</span><i v-on:click="deleteContrastGroup(item.id)" class="svg-i"><svg-icon icon-class="close" class-name="disabled" /></i></div>
                    </template>
                    <div class="item-button">
                        <div class="button-click"  v-on:click="toggleContrast"><i class="svg-i"><svg-icon icon-class="s-add" class-name="disabled" /></i><span>添加对比</span></div>
                        <div class="group-contrast depart" v-show="isContrastShow">
                            <div class="item-checkbox" v-bind:class="[item.disabled?'is-disabled':'',item.isOn?'active':'']" v-for="item in contrastTypeList" v-bind:key="item.id" v-on:click="contrastTypeChangeHandler(item)"><i></i><span>{{item.name}}</span></div>
                            <div class="item-checkbox" v-bind:class="[item.disabled?'is-disabled':'',item.isOn?'active':'']" v-for="item in contrastGroupList" v-bind:key="item.id" v-on:click="contrastGroupChangeHandler(item)"><i></i><span>{{item.name}}</span></div>
                            <div class="item-sure"  v-on:click="saveContrastGroup">确定</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="result-panel" :class="isFix ? 'resulttop' : ''">
            <template v-if="defaultChartData.length>0" v-for="item in defaultChartData">
              <default-chart 
                :item-data="item" 
                :is-default-page="isDefaultPage"
                :judge-data="judgeData"
                ></default-chart>
            </template>
            <template v-if="qualityChartData.length>0" v-for="item in qualityChartData">
                <quality-chart 
                  :item-data="item" 
                  :is-default-page="isDefaultPage"
                  :judge-data="judgeData"
                  ></quality-chart>
            </template>
            <template v-if="defaultYearData.length>0" v-for="item in defaultYearData">
                <year-chart 
                  :item-data="item" 
                  :is-default-page="isDefaultPage"
                  :judge-data="judgeData"
                  ></year-chart>
            </template>
            <template v-if="mapChart.length>0" v-for="item in mapChart">
              <map-chart
                :item-data="item" 
                :judge-data="judgeData"
                :is-cn="true"
              ></map-chart>
            </template>
        </div>
        <el-backtop target=".scroll-panel"></el-backtop>
  </div>
</template>
<script>
import {mapGetters} from 'vuex';
import mapChart from "../components/chinadepartcount/mapChart.vue";
import qualityChart from "../components/chinadepartcount/qualityChart.vue";
import yearChart from "../components/chinadepartcount/yearChart.vue";
import defaultChart from "../components/chinadepartcount/defaultChart.vue";
import {randomString,sortByDesc,sortByAsc,groupColor,groupDateColor,singleArrColor,formatDate,numSeparate,sortByDate,memberArrColor,singleNewArrColor} from "@/utils/index";
import {MapInterval,TopTenColor} from "@/utils/MapColor"
import { chinaData } from "@/utils/chinaMap";
export default {
  name: 'Ownpush_chinadepartcount',
  components: {
    defaultChart,
    qualityChart,
    mapChart,
    yearChart,
  },
  data() {
    return {
        breadcrumbList:[],                             //面包屑导航
        menuButtonPermit:[],                           //网页权限字段
        minWidth:"",
        mapRatio:0.75,
        contrastTypeList:[
            {disabled: true,id:1,isOn: false,name: "电商一部搜索"},
            {disabled: false,id:2,isOn: false,name: "电商一部信息流"},
        ],//对比部门项数据
        contrastGroupList:[],//对比部门数据
        departList:[       //部门数据
            {disabled: false,id:1,isOn: true,name: "电商一部搜索"},
            {disabled: false,id:2,isOn: false,name: "电商一部信息流"},
        ],
        dateDimension:[       //日月数据
            {label:"日",value:"day",isOn:true},
            {label:"月",value:"month",isOn:false},
        ],
        contrastList:[
            {label:"消费分析",id:9,value:"consumptionAnalysis",isOn:false,disabled:true},
            {label:"询盘分析",id:1,value:"enquiriesFew",isOn:true,disabled:false},
            {label:"成交积分分析",id:2,value:"clinchScore",isOn:false,disabled:true},
            {label:"质量分析",id:8,value:"qualityAnalysis",isOn:false,disabled:true},
            {label:'询盘年份',id:3,value:"enquiriesYear",isOn:false,disabled:true},
            {label:"询盘地图",id:4,value:"regionEnquiries",isOn:true,disabled:false},
            {label:"成交积分地区",id:5,value:"regionClinchScore",isOn:false,disabled:true},
            {label:"成交个数地区",id:6,value:"regionClinchNumber",isOn:false,disabled:true},
            {label:"产品分析",id:7,value:"ProductAnalysis",isOn:false,disabled:true},
        ],
        selectedData:{               //搜索数据
          dateDefault:[],          //默认时间
          dateContrast:[],         //对比时间
          dept_id:[1],               //部门选择
          type:[1,4],              //分析项数据
          is_compare:1,            //是否部门对比
          comparedept_id:[],       //对比部门选择
          comparetype_id:[],       //对比项选择
          is_timecopmare:1,        //是否时间对比
          isMonth:false,
          isDateCompare:false,
        },
        groupName:"电商一部搜索",
        dateSelected:true,  //控制日期插件是否可以选择
        isFilter:true,      //是否显示重置按钮
        tipsInfo:"当前部门分析页面，展示为：本年度数据信息。",
        tipsItem:"",
        pickerDateRangeOptions: {
            shortcuts: [{
            text: '最近一个月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                end.setTime(end.getTime() + 3600 * 1000 * 24 * 1);
                picker.$emit('pick', [start, end]);
            }
            }, {
                text: '上月',
                onClick(picker) {
                var date = new Date();
                var year = date.getFullYear().toString();
                //获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
                var month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1).toString():(date.getMonth()+1).toString();
                var end = year + '/' + month + '/01';
                var start = '';
                
                if(month == '01'){
                    start = (parseInt(year) - 1) + '/12/01';
                }else{
                    start = parseInt(month) - 1>9 ? year + '/' + (parseInt(month) - 1)  + '/01':year + '/0' + (parseInt(month) - 1)  + '/01';
                }
                picker.$emit('pick', [start, end]);
                }
            }, {
            text: '本月',
            onClick(picker) {
                var date = new Date();
                var year = date.getFullYear().toString();
                //获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
                var month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1).toString():(date.getMonth()+1).toString();
                var end = '';
                var start = year + '/' + month + '/01';
                if(month == '12'){
                end = (parseInt(year) + 1) + '/01/01';
                }else{
                end = parseInt(month) + 1>9 ? year + '/' + (parseInt(month) + 1)  + '/01':year + '/0' + (parseInt(month) + 1)  + '/01';
                }
                picker.$emit('pick', [start, end]);
            }
            }]
        },
        pickerMonthRangeOptions: {
            shortcuts: [{
            text: '今年至今',
            onClick(picker) {
                const end = new Date();
                const start = new Date(new Date().getFullYear(), 0);
                picker.$emit('pick', [start, end]);
            }
            }, {
            text: '最近六个月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setMonth(start.getMonth() - 6);
                picker.$emit('pick', [start, end]);
            }
            }]
        },
        selectedType:['enquiriesFew','regionEnquiries'],       //选中分析项数据
        oldContrastGroupID:"",
        isDefaultPage:false,
        judgeData:{},
        defaultChartData:[],
        defaultYearData:[],
        qualityChartData:[],
        mapChart:[],
        isContrastShow:false,
        boxWidth:0,
        isFix:false,
    };
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'menuData'
    ]),
  },
  created() {
    var $this = this;
    $this.selectedData.dateDefault = $this.getNearDay();
    $this.getBreadcrumbList();
    $this.getUserMenuButtonPermit();
  },
  watch:{
    minWidth(val) {
      if (!this.timer) {
        this.minWidth = val
        this.timer = true
        const $this = this
        setTimeout(function() {
          $this.timer = false
        }, 400)
      }
    },
    boxWidth(val) {
      if (!this.timer) {
        this.boxWidth = val
        this.timer = true
        const $this = this
        setTimeout(function() {
          $this.timer = false
        }, 400)
      }
    },
  },
  mounted(){
    const $this = this;
    if(!$this.sidebar.opened){
      $this.$store.dispatch('app/toggleSideBar');
    }  
    if($this.$refs.boxPane){  
      $this.minWidth = $this.$refs.boxPane.offsetWidth;
      $this.boxWidth = $this.$refs.boxPane.offsetWidth - 50;
      $this.$refs.boxPane.addEventListener('scroll', $this.getScroll);
    }
  },
  destroyed(){
    const $this = this;
    if($this.$refs.boxPane){
      $this.$refs.boxPane.removeEventListener('scroll', $this.getScroll);
    }
  },
  directives: {  // 使用局部注册指令的方式
      resize: { // 指令的名称
        bind(el, binding) { // el为绑定的元素，binding为绑定给指令的对象
          let width = '', height = '';
          function isReize() {
            const style = document.defaultView.getComputedStyle(el);
            if (width !== style.width || height !== style.height) {
              binding.value();  // 关键
            }
            width = style.width;
            height = style.height;
          }
          el.__vueSetInterval__ = setInterval(isReize, 300);
        },
        unbind(el) {
          clearInterval(el.__vueSetInterval__);
        }
      }
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
          if(permitData.includes('Ownpush_chinadepartcount')){
              $this.getContrastDepart()
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
    // 获取对比部门数据
    getContrastDepart(){
      var $this = this;
      $this.$store.dispatch('api/getCnDepartAction', null).then(res=>{
        var contrastGroupList = [];
        res.data.forEach(function(item,index){
          var itemData = {};
          var itemOne={};
          var itemTwo={};
          if(item.name!='电商一部'){
            itemData.isOn = false;
            itemData.disabled = false;
            itemData.id = item.id;
            itemData.name = item.name;
            contrastGroupList.push(itemData);
          }
        });

        $this.contrastGroupList = contrastGroupList;
        $this.initData();
      });
    },
    //组装请求所需数据
    searchDataInit(){
      var $this = this;
      var searchData = {};
      if($this.selectedData.dateDefault&&$this.selectedData.dateDefault.length>0){
        searchData.starttime = formatDate($this.selectedData.dateDefault[0],'/','-');
        searchData.endtime = formatDate($this.selectedData.dateDefault[1],'/','-');
      }
      if($this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0&&$this.selectedData.isDateCompare){
        searchData.comparestarttime = formatDate($this.selectedData.dateContrast[0],'/','-');
        searchData.compareendtime = formatDate($this.selectedData.dateContrast[1],'/','-');
      }
      if($this.selectedData.dept_id.length>0){
        searchData.dept_id = $this.selectedData.dept_id;
      }
      if($this.selectedData.type&&$this.selectedData.type.length>0){
        searchData.type = $this.selectedData.type;
      }
      searchData.is_compare = $this.selectedData.comparedept_id.length>0?2:$this.selectedData.comparetype_id.length>0?2:1;
      if($this.selectedData.comparetype_id&&$this.selectedData.comparetype_id.length>0){
        searchData.comparetype_id = $this.selectedData.comparetype_id;
      }
      if($this.selectedData.comparedept_id&&$this.selectedData.comparedept_id.length>0){
        searchData.comparedept_id = $this.selectedData.comparedept_id;
      }
      searchData.is_timecopmare = $this.selectedData.isDateCompare&&$this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0?2:1;

      if($this.selectedData.dept_id.length==0){
        $this.tipsInfo = "请选择数据分析的部门";
      }else{
        if(!$this.selectedData.dateDefault||$this.selectedData.dateDefault.length==0){
          $this.tipsInfo = "请选择数据分析的日期范围";
        }else{
          if($this.selectedData.type.length==0){
            $this.tipsInfo = "请选择数据分析的分析项";
          }else{
            $this.dateInfoTips();
            if(searchData.is_timecopmare==2&&searchData.starttime&&searchData.endtime){
              $this.tipsInfo = "当前部门分析页面，展示为："+$this.selectedData.dateDefault[0]+" ~ " + $this.selectedData.dateDefault[1]+" 与 "+$this.selectedData.dateContrast[0]+" ~ "+$this.selectedData.dateContrast[1]+" 的日期对比数据信息。"+$this.tipsItem;
            }
            if(searchData.is_timecopmare==1&&searchData.starttime&&searchData.endtime){
              $this.tipsInfo = "当前部门分析页面，展示为："+$this.selectedData.dateDefault[0]+" ~ " + $this.selectedData.dateDefault[1]+" 的数据信息。"+$this.tipsItem;
            }
          }
        }
      }
      return searchData;
    },
    // 清空数据
    clearData(){
      var $this = this;
      $this.isDefaultPage = false;
      $this.qualityChartData = [];
      $this.defaultChartData = [];
      $this.mapChart = [];
    },
    // 获取筛选条件下的数据
    initData() {
      var $this = this;
      $this.isFilter = true;
      $this.judgeChartStatus();
      var searchData = $this.searchDataInit();
      $this.clearData();
      if(searchData.dept_id&&searchData.starttime&&searchData.endtime&&searchData.type){
        $this.$store.dispatch('ownpush/getOwnChinadepartcountAction', searchData).then(res=>{
         if(res.status){
            $this.filterDataClump(res);
          }else{
            $this.$message({
              showClose: true,
              message: res.info,
              type: 'error',
              duration:6000
            });
            $this.$router.push({path:`/login?redirect=${$this.$router.currentRoute.fullPath}`});
          }
        });
      }
    },
    // 组装筛选结果数据
    filterDataClump(res){
      var $this = this;
      var defaultChartData = $this.defaultChartDataClump(res);
      $this.defaultChartData = defaultChartData;
      var mapChartData = $this.mapChartDataClump(res);
      var productData = $this.productDataClump(res);
      if(productData){
        mapChartData[0].push(productData);
      }    
      $this.mapChart = mapChartData;
      var qualityChartData = $this.qualityChartDataClump(res);
      $this.qualityChartData = qualityChartData;
      var defaultYearData = $this.defaultYearDataClump(res);
      $this.defaultYearData = defaultYearData;
      $this.changeSize();
    },
    // 组装默认类型图表数据
    defaultChartDataClump(res){
      var $this = this;
      // 询盘趋势
      var inquiryData = null;
      if($this.selectedType.includes("enquiriesFew")){
        inquiryData = {};
        inquiryData.chartType = "area";
        // 时间对比
        if($this.selectedData.isDateCompare&&$this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
          var dateData = [];
          // 月维度
          if($this.selectedData.isMonth){
            dateData = res.selfmonthxuncompare;
          }else{
            // 日维度
            dateData = res.selfdayxuncompare;
          }
          var backData = $this.dateCompare(dateData,'xunnumber');
          inquiryData.mainData = backData.mainData;
          inquiryData.dateCompareData = backData.dateCompareData;
          inquiryData.colorArr = backData.colorArr;
          if($this.selectedData.dept_id.length==1){
            $this.departList.forEach(function(item){
              if(item.id == $this.selectedData.dept_id[0]){
                if($this.selectedData.isMonth){
                  inquiryData.chartTitle = item.name+"询盘日期对比月趋势";
                }else{
                  inquiryData.chartTitle = item.name+"询盘日期对比日趋势";
                }
                inquiryData.name = item.name+"询盘统计";
              }
            });
          }else{
            if($this.selectedData.isMonth){
              inquiryData.chartTitle = "电商一部询盘日期对比月趋势";
            }else{
              inquiryData.chartTitle = "电商一部询盘日期对比日趋势";
            }
            inquiryData.name = "电商一部询盘统计";
          }
        }else{
          // 部门对比
          if($this.selectedData.comparedept_id.length>0||$this.selectedData.comparetype_id.length>0){
            if($this.selectedData.isMonth){
              inquiryData.chartTitle = "各部门询盘月趋势对比";
            }else{
              inquiryData.chartTitle = "各部门询盘日趋势对比";
            }
            inquiryData.mainData = [];
            var chartData = []
            if($this.selectedData.isMonth){
              // 月维度
              chartData = res.monthxuntrendcompare;
            }else{
              // 日维度
              chartData = res.dayxuntrendcompare;
            }
            inquiryData.colorArr = [];
            var tongData = groupColor(chartData);
            tongData.forEach(function(item,index){
              var newItemArr=[];
              inquiryData.colorArr.push(item[0].color);
              item.forEach(function(item1){
                var itemChart = {};
                if(index == 0){
                  if($this.selectedData.dept_id.length==1){
                    $this.departList.forEach(function(item1){
                      if(item1.isOn){
                        itemChart.name = item1.name;
                      }
                    });
                  }else{
                    itemChart.name="电商一部"
                  }
                }else{
                  var selectContrastGroupList = [];
                  $this.contrastGroupList.forEach(function(item1){
                    if(item1.isOn){
                      selectContrastGroupList.push(item1);
                    }
                  });
                  $this.contrastTypeList.forEach(function(item1){
                    if(item1.isOn){
                      selectContrastGroupList.push(item1);
                    }
                  });
                  if($this.selectedData.comparedept_id.length>0||$this.selectedData.comparetype_id.length>0){
                      itemChart.name=selectContrastGroupList[index-1].name;                    
                  }
                }
                if($this.selectedData.isMonth){
                  // 月维度
                  itemChart.key = item1.date;
                }else{
                  // 日维度
                  itemChart.key = item1.date+" "+item1.week;
                }
                itemChart.value = item1.xunnumber;
                itemChart.color = item[0].color;
                newItemArr.push(itemChart);
              });
              inquiryData.mainData.push(newItemArr);
            });
            inquiryData.name = "部门询盘统计";
            var compareData = [];
            if($this.selectedData.isMonth){
              var monthxunallnumbercompare=0;
              if($this.selectedData.dept_id.length>1&&$this.selectedData.comparetype_id&&$this.selectedData.comparetype_id.length>0){          
                  if(res.monthxuntrendcompare&&res.monthxuntrendcompare.length){
                    res.monthxuntrendcompare.forEach(function(item,index){
                      if(index==0){
                          if(item&&item.length>0){
                            item.forEach(function(items,indexs){
                              monthxunallnumbercompare+=items.xunnumber;
                            });
                          }
                      }
                    });
                  }
              }else{
                  if(res.monthxuntrendcompare&&res.monthxuntrendcompare.length){
                    res.monthxuntrendcompare.forEach(function(item,index){
                      if(item&&item.length>0){
                        item.forEach(function(items,indexs){
                          monthxunallnumbercompare+=items.xunnumber;
                        });
                      }
                    });
                  }
              }
              inquiryData.nowNumber = numSeparate(monthxunallnumbercompare);
              compareData = res.monthdepartpercentercompare;
              inquiryData.lastNumber = res.lastmonthxunallnumbercompare;
              inquiryData.nowLastNumber = numSeparate(Math.abs(monthxunallnumbercompare - res.lastmonthxunallnumbercompare).toFixed(2)*1);
              inquiryData.status = monthxunallnumbercompare - res.lastmonthxunallnumbercompare>0?'up':monthxunallnumbercompare - res.lastmonthxunallnumbercompare<0?'down':'flat';
              inquiryData.avgNumber = numSeparate(parseInt(monthxunallnumbercompare/res.monthxuntrendcompare[0].length));
              inquiryData.historyMaxNumber = numSeparate(res.historymaxnumbermonthcompare[0].number);
              inquiryData.historyMaxNumberDate = res.historymaxnumbermonthcompare[0].yeartime;
              inquiryData.avgTitle = "月平均询盘个数";
              inquiryData.historyTitle = "月历史峰值";
            }else{
              var dayxuntrendcompare=0;
              if($this.selectedData.dept_id.length>1&&$this.selectedData.comparetype_id&&$this.selectedData.comparetype_id.length>0){
                  if(res.dayxuntrendcompare&&res.dayxuntrendcompare.length){
                    res.dayxuntrendcompare.forEach(function(item,index){
                      if(index==0){
                          if(item&&item.length>0){
                            item.forEach(function(items,indexs){
                              dayxuntrendcompare+=items.xunnumber;
                            });
                          }
                      }
                    });
                  }
              }else{
                  if(res.dayxuntrendcompare&&res.dayxuntrendcompare.length){
                    res.dayxuntrendcompare.forEach(function(item,index){
                      if(item&&item.length>0){
                        item.forEach(function(items,indexs){
                          dayxuntrendcompare+=items.xunnumber;
                        });
                      }
                    });
                  }
              }
              inquiryData.nowNumber = numSeparate(dayxuntrendcompare);
              compareData = res.departpercentercompare;
              inquiryData.lastNumber = res.lastxunallnumbercompare;
              inquiryData.nowLastNumber = numSeparate(Math.abs(dayxuntrendcompare - res.lastxunallnumbercompare).toFixed(2)*1);
              inquiryData.status = dayxuntrendcompare - res.lastxunallnumbercompare>0?'up':dayxuntrendcompare - res.lastxunallnumbercompare<0?'down':'flat';
              inquiryData.avgNumber = numSeparate(parseInt(dayxuntrendcompare/res.dayxuntrendcompare[0].length));
              inquiryData.historyMaxNumber = numSeparate(res.historymaxnumberdaycompare[0].number);
              inquiryData.historyMaxNumberDate = res.historymaxnumberdaycompare[0].xundate;
              inquiryData.avgTitle = "日平均询盘个数";
              inquiryData.historyTitle = "日历史峰值";
            }
            inquiryData.totalChart = [];
            var newCompareData=[];
            if($this.selectedData.dept_id.length>1){
              var itemObj={
                departname:'',
                xunnumber:0
              };
              if($this.selectedData.comparedept_id&&$this.selectedData.comparedept_id.length>0){
                compareData.forEach(function(item){
                    if(item.departname.indexOf('电商一部')>=0){
                      itemObj.departname = '电商一部';
                      itemObj.xunnumber+=item.xunnumber;
                    }else{
                      newCompareData.push(item);
                    }
                });
                newCompareData.push(itemObj);
              }
              if($this.selectedData.comparetype_id&&$this.selectedData.comparetype_id.length>0){
                newCompareData=compareData;
              }
            }else{
              compareData.forEach(function(item){
                  newCompareData.push(item);
              });
            }
            newCompareData.forEach(function(item,index){
              var itemChart = {};
              itemChart.name = item.departname;
              itemChart.value = item.xunnumber;
              inquiryData.totalChart.push(itemChart);
            });
            inquiryData.totalChart = singleArrColor(inquiryData.totalChart);
            inquiryData.totalChart.sort(sortByDesc("value"));
          }else{
            // 统计
            inquiryData.mainData = [];
            inquiryData.colorArr = [];
            var tongData = []
            // 月维度
            if($this.selectedData.isMonth){
              var xunallnumber=0;
              if(res.monthxuntrend&&res.monthxuntrend.length){
                res.monthxuntrend.forEach(function(item,index){
                  xunallnumber+=item.xunnumber;
                });
              }
              inquiryData.nowNumber = numSeparate(xunallnumber);
              tongData.push(res.monthxuntrend);
              inquiryData.lastNumber = res.lastmonthxunallnumber;
              inquiryData.nowLastNumber = numSeparate(Math.abs(xunallnumber - res.lastmonthxunallnumber).toFixed(2)*1);
              inquiryData.status = xunallnumber - res.lastmonthxunallnumber>0?'up':xunallnumber - res.lastmonthxunallnumber<0?'down':'flat';
              inquiryData.avgNumber = numSeparate(parseInt(xunallnumber/res.monthxuntrend.length));
              inquiryData.historyMaxNumber = numSeparate(res.historymaxnumbermonth[0].number);
              inquiryData.historyMaxNumberDate = res.historymaxnumbermonth[0].yeartime;
              inquiryData.avgTitle = "月平均询盘个数";
              inquiryData.historyTitle = "月历史峰值";
            }else{
              //现阶段询盘总数
              var xunallnumber=0;
              if(res.dayxuntrend&&res.dayxuntrend.length){
                res.dayxuntrend.forEach(function(item,index){
                  xunallnumber+=item.xunnumber;
                });
              }
              inquiryData.nowNumber = numSeparate(xunallnumber);
              tongData.push(res.dayxuntrend);
              // 日维度
              inquiryData.lastNumber = res.lastxunallnumber;
              inquiryData.nowLastNumber = numSeparate(Math.abs(xunallnumber - res.lastxunallnumber).toFixed(2)*1);
              inquiryData.status = xunallnumber - res.lastxunallnumber>0?'up':xunallnumber - res.lastxunallnumber<0?'down':'flat';
              inquiryData.avgNumber = numSeparate(parseInt(xunallnumber/res.dayxuntrend.length));
              inquiryData.historyMaxNumber = numSeparate(res.historymaxnumberday[0].number);
              inquiryData.historyMaxNumberDate = res.historymaxnumberday[0].xundate;
              inquiryData.avgTitle = "日平均询盘个数";
              inquiryData.historyTitle = "日历史峰值";
            }
            tongData = groupColor(tongData);
            inquiryData.colorArr.push(tongData[0][0].color);
            var newItemArr=[];
            tongData[0].forEach(function(item,index){
              if($this.selectedData.isMonth){
                item.key = item.date;
              }else{
                item.key = item.date+" "+item.week;
              }
              if($this.selectedData.dept_id.length==1){
                $this.departList.forEach(function(item1){
                  if(item1.id == $this.selectedData.dept_id[0]){
                    item.name = item1.name;
                  }
                });
              }else{
                item.name = "电商一部"
              }
              item.value = item.xunnumber;
              newItemArr.push(item);
            });
            inquiryData.mainData.push(newItemArr);
            // 只有一个部门被选中的情况
            if($this.selectedData.dept_id.length==1){
              $this.departList.forEach(function(item){
                  inquiryData.name = "询盘统计";
                  if($this.selectedData.isMonth){
                    inquiryData.chartTitle = "询盘月趋势";
                  }else{
                    inquiryData.chartTitle = "询盘日趋势";
                  }
              });
            }else{// 多部门被选中              
              inquiryData.totalChart = [];
              var compareData = [];
              inquiryData.name = "电商一部询盘统计";
              if($this.selectedData.isMonth){
                compareData = res.monthdepartpercenter;
                inquiryData.chartTitle = "电商一部询盘月趋势";
              }else{
                compareData = res.departpercenter;
                inquiryData.chartTitle = "电商一部询盘日趋势";
              }
              compareData.forEach(function(item){
                var itemChart = {};
                itemChart.name = item.departname;
                itemChart.value = item.xunnumber;
                inquiryData.totalChart.push(itemChart);
              });
              inquiryData.totalChart = singleArrColor(inquiryData.totalChart);
              inquiryData.totalChart.sort(sortByDesc("value"));
            }
          }
        }
        inquiryData.totalTitle = "总询盘数量";
        inquiryData.unit = "（单位：个）";
        inquiryData.randomStr = randomString(4);
      }
      // 成交积分分析
      var dealScoreData = null;
      if($this.selectedType.includes("clinchScore")){
        dealScoreData = {};
        dealScoreData.chartType = "line";
        // 时间对比
        if($this.selectedData.isDateCompare&&$this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){          
          var monthscoreallnumber=0;
          if(res.selfmonthscoretrend&&res.selfmonthscoretrend.length){
            res.selfmonthscoretrend.forEach(function(item,index){
              if(item&&item.length>0){
                item.forEach(function(items,indexs){
                  monthscoreallnumber+=items.score;
                });
              }
            });
          }
          dealScoreData.nowNumber = numSeparate(monthscoreallnumber);
          var backData = $this.dateCompare(res.selfmonthscoretrend,'score');
          dealScoreData.mainData = backData.mainData;
          dealScoreData.dateCompareData = backData.dateCompareData;
          dealScoreData.colorArr = backData.colorArr;
          if($this.selectedData.dept_id.length==1){
            $this.departList.forEach(function(item){
              if(item.id == $this.selectedData.dept_id[0]){
                if($this.selectedData.isMonth){
                  dealScoreData.chartTitle = item.name+"成交积分日期对比月趋势";
                }else{
                  dealScoreData.chartTitle = item.name+"成交积分日期对比日趋势";
                }
                dealScoreData.name = item.name+"成交积分统计";
              }
            });
          }else{
            if($this.selectedData.isMonth){
              dealScoreData.chartTitle = "电商一部成交积分日期对比月趋势";
            }else{
              dealScoreData.chartTitle = "电商一部成交积分日期对比日趋势";
            }
            dealScoreData.name = "电商一部成交积分统计";
          }
        }else{
          // 部门对比
          if($this.selectedData.comparedept_id.length>0||$this.selectedData.comparetype_id.length>0){
            if($this.selectedData.isMonth){
              dealScoreData.chartTitle = "各部门成交积分月趋势对比";
            }else{
              dealScoreData.chartTitle = "各部门成交积分日趋势对比";
            }
            dealScoreData.mainData = [];
            dealScoreData.colorArr = [];
            var chartData = groupColor(res.monthscoretrendcompare);
            chartData.forEach(function(item,index){
              var newItemArr=[];
              dealScoreData.colorArr.push(item[0].color);
              item.forEach(function(item1){
                var itemChart = {};
                if(index == 0){
                  if($this.selectedData.dept_id.length==1){
                    $this.departList.forEach(function(item1){
                      if(item1.isOn){
                        itemChart.name = item1.name;
                      }
                    });
                  }else{
                    itemChart.name="电商一部"
                  }
                }else{
                  var selectContrastGroupList = [];
                  $this.contrastGroupList.forEach(function(item1){
                    if(item1.isOn){
                      selectContrastGroupList.push(item1);
                    }
                  });                  
                  $this.contrastTypeList.forEach(function(item1){
                    if(item1.isOn){
                      selectContrastGroupList.push(item1);
                    }
                  });
                  if($this.selectedData.comparedept_id.length>0||$this.selectedData.comparetype_id.length>0){
                      itemChart.name=selectContrastGroupList[index-1].name;                    
                  }
                }
                itemChart.key = item1.date;
                itemChart.value = Math.floor(item1.score*100)/100;
                itemChart.color = item[0].color;
                newItemArr.push(itemChart);
              });
              dealScoreData.mainData.push(newItemArr);
            });
            dealScoreData.name = "部门成交积分统计";
            var monthscoreallnumbercompare=0;
            if($this.selectedData.dept_id.length>1&&$this.selectedData.comparetype_id&&$this.selectedData.comparetype_id.length>0){ 
                if(res.monthscoretrendcompare&&res.monthscoretrendcompare.length){
                  res.monthscoretrendcompare.forEach(function(item,index){
                    if(index==0){
                        if(item&&item.length>0){
                          item.forEach(function(items,indexs){
                            monthscoreallnumbercompare+=items.score;
                          });
                        }
                    }
                  });
                }
            }else{
                if(res.monthscoretrendcompare&&res.monthscoretrendcompare.length){
                  res.monthscoretrendcompare.forEach(function(item,index){
                    if(item&&item.length>0){
                      item.forEach(function(items,indexs){
                        monthscoreallnumbercompare+=items.score;
                      });
                    }
                  });
                }
            }
            dealScoreData.nowNumber = numSeparate(Math.floor(monthscoreallnumbercompare*100)/100);
            dealScoreData.lastNumber = Math.floor(res.lastmonthscoreallnumbercompare*100)/100;
            dealScoreData.nowLastNumber = numSeparate(Math.abs(Math.floor(monthscoreallnumbercompare*100)/100 - Math.floor(res.lastmonthscoreallnumbercompare*100)/100).toFixed(2)*1);
            dealScoreData.status = Math.floor(monthscoreallnumbercompare*100)/100 - Math.floor(res.lastmonthscoreallnumbercompare*100)/100>0?'up':Math.floor(monthscoreallnumbercompare*100)/100 - Math.floor(res.lastmonthscoreallnumbercompare*100)/100<0?'down':'flat';
            dealScoreData.avgNumber = numSeparate(Math.floor(monthscoreallnumbercompare/res.monthscoretrendcompare[0].length*100)/100);
            dealScoreData.historyMaxNumber = numSeparate(Math.floor(res.historymaxscoremonthcompare[0].score*100)/100);
            dealScoreData.historyMaxNumberDate = res.historymaxscoremonthcompare[0].yeartime;
            dealScoreData.avgTitle = "月平均成交积分";
            dealScoreData.historyTitle = "月历史峰值";
            dealScoreData.totalChart = [];
            res.monthdepartscorepercentercompare.forEach(function(item){
              var itemChart = {};
              itemChart.name = item.departname;
              itemChart.value = Math.floor(item.score*100)/100;
              dealScoreData.totalChart.push(itemChart);
            });
            dealScoreData.totalChart = singleArrColor(dealScoreData.totalChart);
            dealScoreData.totalChart.sort(sortByDesc("value"));
          }else{
            // 统计
            dealScoreData.mainData = [];
            dealScoreData.colorArr = [];
            var monthscoreallnumber=0;
            if(res.monthscoretrend&&res.monthscoretrend.length){
              res.monthscoretrend.forEach(function(item,index){
                    monthscoreallnumber+=item.score;
              });
            }
            dealScoreData.nowNumber = numSeparate(Math.floor(monthscoreallnumber*100)/100);
            var tongData = groupColor([res.monthscoretrend]);
            dealScoreData.colorArr.push(tongData[0][0].color);
            var newItemArr=[];
            tongData[0].forEach(function(item,index){
              item.key = item.date;
              item.value = Math.floor(item.score*100)/100;
              if($this.selectedData.dept_id.length==1){
                $this.departList.forEach(function(item1){
                  if(item1.id == $this.selectedData.dept_id[0]){
                    item.name = item1.name;
                  }
                });
              }else{
                item.name = "电商一部"
              }
              newItemArr.push(item);
            });
            dealScoreData.mainData.push(newItemArr);
            dealScoreData.lastNumber = Math.floor(res.lastmonthscoreallnumber*100)/100;
            dealScoreData.nowLastNumber = numSeparate(Math.abs(Math.floor(monthscoreallnumber*100)/100 - Math.floor(res.lastmonthscoreallnumber*100)/100).toFixed(2)*1);
            dealScoreData.status = Math.floor(monthscoreallnumber*100)/100 - Math.floor(res.lastmonthscoreallnumber*100)/100>0?'up':Math.floor(monthscoreallnumber*100)/100 - Math.floor(res.lastmonthscoreallnumber*100)/100<0?'down':'flat';
            dealScoreData.avgNumber = numSeparate(Math.floor(monthscoreallnumber/res.monthscoretrend.length*100)/100);
            dealScoreData.historyMaxNumber = numSeparate(Math.floor(res.historymaxscoremonth.length>0?res.historymaxscoremonth[0].score:0*100)/100);
            dealScoreData.historyMaxNumberDate = res.historymaxscoremonth.length>0?res.historymaxscoremonth[0].yeartime:0;
            dealScoreData.avgTitle = "月平均成交积分";
            dealScoreData.historyTitle = "月历史峰值";
            // 只有一个部门被选中的情况
            if($this.selectedData.dept_id.length==1){
              $this.departList.forEach(function(item){
                  if($this.selectedData.isMonth){
                    dealScoreData.chartTitle = "成交积分月趋势";
                  }else{
                    dealScoreData.chartTitle = "成交积分日趋势";
                  }
                  dealScoreData.name = "成交积分统计";
              });
            }else{// 多部门被选中
              if($this.selectedData.isMonth){
                dealScoreData.chartTitle = "电商一部成交积分月趋势";
              }else{
                dealScoreData.chartTitle = "电商一部成交积分日趋势";
              }
              dealScoreData.name = "电商一部成交积分统计"; 
              dealScoreData.totalChart = [];
              res.monthdepartscorepercenter.forEach(function(item){
                var itemChart = {};
                itemChart.name = item.departname;
                itemChart.value =  Math.floor(item.score*100)/100;
                dealScoreData.totalChart.push(itemChart);
              });
              dealScoreData.totalChart = singleArrColor(dealScoreData.totalChart);
              dealScoreData.totalChart.sort(sortByDesc("value"));
            }
          }
        }
        dealScoreData.totalTitle = "总成交积分";
        dealScoreData.unit = "（单位：分）";
        dealScoreData.randomStr = randomString(4);
      }
      // 消费分析
      var consumptionData = null;
      if($this.selectedType.includes("consumptionAnalysis")){
        consumptionData = {};
        consumptionData.chartType = "area";
        // 时间对比
        if($this.selectedData.isDateCompare&&$this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){        
          var monthmoneyallnumber=0;
          var selfmoneymonthArr=[];
          if(res.selfmoneymonthcompare&&res.selfmoneymonthcompare.length){
            res.selfmoneymonthcompare.forEach(function(item,index){
              if(item.monthmoneypercenter&&item.monthmoneypercenter.length>0){
                var itemArr=[];
                itemArr=item.monthmoneypercenter;
                item.monthmoneypercenter.forEach(function(items,indexs){
                  monthmoneyallnumber+=items.money;
                });
                selfmoneymonthArr.push(itemArr);
              }
            });
          }
          consumptionData.nowNumber = numSeparate(Math.floor(monthmoneyallnumber*100)/100);
          var backData = $this.dateCompare(selfmoneymonthArr,'money');

          consumptionData.mainData = backData.mainData;
          consumptionData.dateCompareData = backData.dateCompareData;
          consumptionData.colorArr = backData.colorArr;
          if($this.selectedData.dept_id.length==1){
            $this.departList.forEach(function(item){
              if(item.id == $this.selectedData.dept_id[0]){
                if($this.selectedData.isMonth){
                  consumptionData.chartTitle = item.name+"消费日期对比月趋势";
                }else{
                  consumptionData.chartTitle = item.name+"消费日期对比日趋势";
                }
                consumptionData.name = item.name+"消费统计";
              }
            });
          }else{
            if($this.selectedData.isMonth){
              consumptionData.chartTitle = "电商一部消费日期对比月趋势";
            }else{
              consumptionData.chartTitle = "电商一部消费日期对比日趋势";
            }
            
            consumptionData.name = "电商一部消费统计";
          }
        }else{
          // 部门对比
          if($this.selectedData.comparedept_id.length>0||$this.selectedData.comparetype_id.length>0){
            // 统计
            if($this.selectedData.isMonth){
              consumptionData.chartTitle = "各部门消费月趋势对比";
            }else{
              consumptionData.chartTitle = "各部门消费日趋势对比";
            }
            consumptionData.mainData = [];
            consumptionData.colorArr = [];
            var chartData = groupColor(res.moneymonthcompare);
            chartData.forEach(function(item,index){
              var newItemArr=[];
              consumptionData.colorArr.push(item[0].color);
              item.forEach(function(item1){
                var itemChart = {};
                if(index == 0){
                  if($this.selectedData.dept_id.length==1){
                    $this.departList.forEach(function(item1){
                      if(item1.isOn){
                        itemChart.name = item1.name;
                      }
                    });
                  }else{
                    itemChart.name="电商一部"
                  }
                }else{
                  var selectContrastGroupList = [];
                  $this.contrastGroupList.forEach(function(item1){
                    if(item1.isOn){
                      selectContrastGroupList.push(item1);
                    }
                  });                  
                  $this.contrastTypeList.forEach(function(item1){
                    if(item1.isOn){
                      selectContrastGroupList.push(item1);
                    }
                  });
                  if($this.selectedData.comparedept_id.length>0||$this.selectedData.comparetype_id.length>0){
                      itemChart.name=selectContrastGroupList[index-1].name;                    
                  }
                }
                itemChart.key = item1.date;
                itemChart.value = Math.floor(item1.money*100)/100;
                itemChart.color = item[0].color;
                newItemArr.push(itemChart);
              });
              consumptionData.mainData.push(newItemArr);
            });
            consumptionData.name = "部门消费统计";
            var monthscoreallnumbercompare=0;
            if($this.selectedData.dept_id.length>1&&$this.selectedData.comparetype_id&&$this.selectedData.comparetype_id.length>0){ 
                if(res.moneymonthcompare&&res.moneymonthcompare.length){
                  res.moneymonthcompare.forEach(function(item,index){
                    if(index==0){
                        if(item&&item.length>0){
                          item.forEach(function(items,indexs){
                            monthscoreallnumbercompare+=items.money;
                          });
                        }
                    }
                  });
                }
            }else{
                if(res.moneymonthcompare&&res.moneymonthcompare.length){
                  res.moneymonthcompare.forEach(function(item,index){
                    if(item&&item.length>0){
                      item.forEach(function(items,indexs){
                        monthscoreallnumbercompare+=items.money;
                      });
                    }
                  });
                }
            }
            consumptionData.nowNumber = numSeparate(Math.floor(monthscoreallnumbercompare*100)/100);
            consumptionData.lastNumber = Math.floor(res.lastmonthmoneycompare*100)/100;
            consumptionData.nowLastNumber = numSeparate(Math.abs(Math.floor(monthscoreallnumbercompare*100)/100 - Math.floor(res.lastmonthmoneycompare*100)/100).toFixed(2)*1);
            consumptionData.status = Math.floor(monthscoreallnumbercompare*100)/100 - Math.floor(res.lastmonthmoneycompare*100)/100>0?'up':Math.floor(monthscoreallnumbercompare*100)/100 - Math.floor(res.lastmonthmoneycompare*100)/100<0?'down':'flat';
            consumptionData.avgNumber = numSeparate(Math.floor(monthscoreallnumbercompare/res.moneymonthcompare[0].length*100)/100);        
            consumptionData.historyMaxNumber = numSeparate(Math.floor(res.historymaxmoneymonthcompare.length>0?res.historymaxmoneymonthcompare[0].allmoney:0*100)/100);
            consumptionData.historyMaxNumberDate = res.historymaxmoneymonthcompare[0].yeartime;
            consumptionData.avgTitle = "月平均消费";
            consumptionData.historyTitle = "月历史峰值";
            consumptionData.totalChart = [];
            res.monthmoneydepartpercentercompare.forEach(function(item){
              var itemChart = {};
              itemChart.name = item.departname;
              itemChart.value = Math.floor(item.xunnumber*100)/100;
              consumptionData.totalChart.push(itemChart);
            });
            consumptionData.totalChart = singleArrColor(consumptionData.totalChart);
            consumptionData.totalChart.sort(sortByDesc("value"));
          }else{
            // 统计
            consumptionData.mainData = [];
            consumptionData.colorArr = [];
            var monthmoneyallnumber=0;
            if(res.monthmoneytend&&res.monthmoneytend.length){
              res.monthmoneytend.forEach(function(item,index){
                    monthmoneyallnumber+=item.money;
              });
            }
            consumptionData.nowNumber = numSeparate(Math.floor(monthmoneyallnumber*100)/100);
            var tongData = groupColor([res.monthmoneytend]);
            consumptionData.colorArr.push(tongData[0][0].color); 
            var newItemArr=[];
            tongData[0].forEach(function(item,index){
              item.key = item.date;
              item.value = Math.floor(item.money*100)/100;
              if($this.selectedData.dept_id.length==1){
                $this.departList.forEach(function(item1){
                  if(item1.id == $this.selectedData.dept_id[0]){
                    item.name = item1.name;
                  }
                });
              }else{
                item.name = "电商一部"
              }
              newItemArr.push(item);
            });
            consumptionData.mainData.push(newItemArr);
            consumptionData.lastNumber = Math.floor(res.lastmonthmoneyallnumber*100)/100;
            consumptionData.nowLastNumber = numSeparate(Math.abs(Math.floor(monthmoneyallnumber*100)/100 - Math.floor(res.lastmonthmoneyallnumber*100)/100).toFixed(2)*1);
            consumptionData.status = Math.floor(monthmoneyallnumber*100)/100 - Math.floor(res.lastmonthmoneyallnumber*100)/100>0?'up':Math.floor(monthmoneyallnumber*100)/100 - Math.floor(res.lastmonthmoneyallnumber*100)/100<0?'down':'flat';            
            consumptionData.avgNumber = numSeparate(Math.floor(monthmoneyallnumber/res.monthmoneytend.length*100)/100);            
            consumptionData.historyMaxNumber = numSeparate(Math.floor(res.historymaxmoneymonth.length>0?res.historymaxmoneymonth[0].allmoney:0*100)/100);            
            consumptionData.historyMaxNumberDate = res.historymaxmoneymonth.length>0?res.historymaxmoneymonth[0].yeartime:0;
            consumptionData.avgTitle = "月平均消费";
            consumptionData.historyTitle = "月历史峰值";
            // 只有一个部门被选中的情况
            if($this.selectedData.dept_id.length==1){
              $this.departList.forEach(function(item){
                  if($this.selectedData.isMonth){
                    consumptionData.chartTitle = "消费月趋势";
                  }else{
                    consumptionData.chartTitle = "消费日趋势";
                  }
                  consumptionData.name = "消费统计";
              });
            }else{// 多部门被选中
              if($this.selectedData.isMonth){
                consumptionData.chartTitle = "电商一部消费月趋势";
              }
              consumptionData.name = "电商一部消费统计"; 
              consumptionData.totalChart = [];
              res.monthmoneydepartpercenter.forEach(function(item){
                var itemChart = {};
                itemChart.name = item.departname;
                itemChart.value =  Math.floor(item.xunnumber*100)/100;
                consumptionData.totalChart.push(itemChart);
              });
              consumptionData.totalChart = singleArrColor(consumptionData.totalChart);
              consumptionData.totalChart.sort(sortByDesc("value"));
            }
          }
        }
        consumptionData.totalTitle = "总消费";
        consumptionData.unit = "（单位：元）";
        consumptionData.randomStr = randomString(4);
      }
      var defaultChartData = [];
      if(consumptionData){
        defaultChartData.push(consumptionData);
      }
      if(inquiryData){
        defaultChartData.push(inquiryData);
      }
      if(dealScoreData){
        defaultChartData.push(dealScoreData);
      }
      return defaultChartData;
    },
    // 组装询盘年份
    defaultYearDataClump(res){
      var $this = this;
      var inquiryYear = null;
      if($this.selectedType.includes("enquiriesYear")){
        inquiryYear = [];
        // 时间对比
        if($this.selectedData.isDateCompare&&$this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){            
            var inquiryYearArr=res.selfxunscorecompare;
            var itemData=$this.ClumpYear(inquiryYearArr,'isCost');
            itemData.title = "询盘年份";
            inquiryYear.push(itemData);
        }else{
          // 部门对比
          if($this.selectedData.comparedept_id.length>0||$this.selectedData.comparetype_id.length>0){
            var inquiryYearArr=res.monthscorexuntrendcompare;
            var itemData=$this.ClumpYear(inquiryYearArr,'isCost');
            itemData.title = "询盘年份";
            inquiryYear.push(itemData);
          }else{
            var inquiryYearArr=[res.monthscorexuntrend];
            var itemData=$this.ClumpYear(inquiryYearArr,'noCost');
            itemData.title = "询盘年份";
            inquiryYear.push(itemData);
          }
        }
      }
      return inquiryYear;
    },
    ClumpYear(dataArr,TagName){
      var $this=this;
      var itemData = {};
      itemData.inquiryYearCount = [];
      if(TagName=='noCost'){
        itemData.isCost = false;
      }
      if(TagName=='isCost'){
        itemData.isCost = true;
      }
      var title='';
      if($this.selectedData.dept_id.length==1){
        $this.departList.forEach(function(item){
          if(item.isOn){
            title = item.name;
          }
        });
      }else{
        title = "电商一部";
      }
      //  判断是否跨年
      var starttime=$this.selectedData.dateDefault[0].split('/')[0]*1;
      var endtime=$this.selectedData.dateDefault[1].split('/')[0]*1; 
      itemData.yarnArr=[];
      while (starttime<=endtime){
        itemData.yarnArr.push(starttime);
        starttime++
      }
      //月份数据合并到年份
      var newDataArr=[];      
      itemData.yarnArr.forEach(function(itemh,indexh){
        dataArr.forEach(function(item,index){
          var yearObj={};
          yearObj.date=itemh;
          if($this.selectedData.isDateCompare&&$this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){  
              if(index==0){
                yearObj.name=$this.selectedData.dateDefault[0]+' ~ '+$this.selectedData.dateDefault[1];
              }
              if(index==1){
                yearObj.name=$this.selectedData.dateContrast[0]+' ~ '+$this.selectedData.dateContrast[1];
              }
          }else{
              if(index==0){
                yearObj.name=title;
              }else{
                yearObj.name=item[0].depart;
              }
          }
          yearObj.score=[];
          item.forEach(function(items,indexs){
            if(items.date.indexOf(itemh)>-1){
              if(items.score&&items.score.length>0){
                items.score.forEach(function(itemk){ 
                  yearObj.score.push(itemk);               
                });
              }
            }
          });
          newDataArr.push(yearObj);
        });
      });
      //获取成交年份
      itemData.yarnClinch=[];
      itemData.departArr=[];
      newDataArr.forEach(function(item,index){
        if(itemData.departArr.indexOf(item.name)==-1){
          itemData.departArr.push(item.name);
        }
        if(item.score&&item.score.length>0){
          item.score.forEach(function(items,indexs){
            if(itemData.yarnClinch.indexOf(items.yeartime)==-1){
              itemData.yarnClinch.push(items.yeartime);
            }
          });
        }
      });
      //去重合并 score 
      newDataArr.forEach(function(item,index){
        item.newscore=[];
        if(item.score&&item.score.length>0){
          itemData.yarnClinch.forEach(function(itemk,indexk){
            var itemArr={};
            itemArr.yeartime=itemk;
            itemArr.score=0;
            item.score.forEach(function(items,indexs){
              if(items.yeartime==itemk){
                itemArr.score+=items.score
              }
            });
            itemArr.score=itemArr.score.toFixed(2)*1
            item.newscore.push(itemArr);
          });
        }else{
          itemData.yarnClinch.forEach(function(itemk,indexk){
            var itemArr={};
            itemArr.yeartime=itemk;
            itemArr.score=0;
            item.newscore.push(itemArr);
          });
        }
      });
      newDataArr.forEach(function(items,indexs){
          if(items.newscore&&items.newscore.length>0){
            items.newscore.forEach(function(itemk,indexk){
              if(itemk.score>0){
                var itemObj = {};
                itemObj.name=items.name;
                itemObj.time=items.date;
                itemObj.value=itemk.score.toFixed(2)*1;
                itemObj.yeartime=itemk.yeartime*1;
                itemData.inquiryYearCount.push(itemObj);
              }else{
                var itemObj = {};
                itemObj.name=items.name;
                itemObj.time=items.date;
                itemObj.value=0;
                itemObj.yeartime=itemk.yeartime*1;
                itemData.inquiryYearCount.push(itemObj);
              }
            });
          }
      });
      if($this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0||$this.selectedData.comparedept_id&&$this.selectedData.comparedept_id.length>0||$this.selectedData.comparetype_id&&$this.selectedData.comparetype_id.length>0){
        itemData.isCost = true;
      }else{
        itemData.isCost = false;
      }
      itemData.randomStr = randomString(4);
      //获取table数据
      itemData.tableData=[];
      itemData.departArr.forEach(function(items,indexs){
        var itemtableArr={};
        itemtableArr.name=items;
        itemtableArr.mainArr=[];
        itemData.yarnArr.forEach(function(itemd,indexd){
          newDataArr.forEach(function(item,index){
            if(items==item.name&&itemd==item.date){
              var tol={};
              tol.yeartime='合计';
              tol.score=0;
              item.newscore.forEach(function(itemg,indexg){
                tol.score=tol.score+itemg.score;
              });
              var sortNewscore=item.newscore.sort(function(a,b){return b['yeartime']-a['yeartime']});
              tol.score=tol.score.toFixed(2);
              sortNewscore.push(tol);
              itemtableArr.mainArr.push(sortNewscore);       
            }
          });
        });
        itemtableArr.mainArr.reverse();
        itemData.tableData.push(itemtableArr);
      });
      /**/
      return itemData;
    },
    //质量分析
    qualityChartDataClump(res){
      var $this = this;
      var qualityData = null;
      if($this.selectedType.includes("qualityAnalysis")){
        qualityData=[]
        var mainQuality={};
        var enquirieDate={};
        var scoreDate={};
        var moneyDate={};
        enquirieDate.name='询盘个数';
        enquirieDate.unit='（单位：个）';
        enquirieDate.unitEnd='个';
        enquirieDate.mainDate=[];
        scoreDate.name='成交积分';
        scoreDate.unit='（单位：分）';
        scoreDate.unitEnd='分';
        scoreDate.mainDate=[];
        moneyDate.name='消费';
        moneyDate.unit='（单位：元）';
        moneyDate.unitEnd='元';
        moneyDate.mainDate=[];

        var xunArr=res.monthxuntrendpercenter;    //询盘占比
        enquirieDate.mainDate=$this.clumpQuality(xunArr,'询盘占比');
        var scoreArr=res.monthscoretrendpercenter;//积分占比
        scoreDate.mainDate=$this.clumpQuality(scoreArr,'积分占比');
        var moneyArr=res.monthmoneypercenter;     //消费占比
        moneyDate.mainDate=$this.clumpQuality(moneyArr,'消费占比');

        var tableDate=[];
        res.monthxuntrendpercenter.forEach(function(item,index){
          item.id=index+1;
          tableDate.push(item);
        });
        tableDate.forEach(function(item){
          res.monthscoretrendpercenter.forEach(function(items){
             if(item.date==items.date){
               item.score=items.score;
             }
          });
        });
        tableDate.forEach(function(item){
          res.monthmoneypercenter.forEach(function(items){
             if(item.date==items.date){
               item.money=items.money;
             }
          });
        });
        mainQuality.tableBom=false;
        mainQuality.tableHeight='auto';
        if(tableDate.length>6){
          mainQuality.tableHeight='351px';
          mainQuality.tableBom=true;
        }
        tableDate.sort(function(a,b){return b['id']-a['id']});
        mainQuality.isTable = false;
        mainQuality.tableDate = tableDate;
        mainQuality.enquirieDate = enquirieDate;
        mainQuality.scoreDate = scoreDate;
        mainQuality.moneyDate = moneyDate;
        mainQuality.randomStr1 = randomString(4);
        mainQuality.randomStr2 = randomString(4);
        mainQuality.randomStr3 = randomString(4);
        mainQuality.title = '质量分析';
        mainQuality.inquiryCountColor = ['#0079e6','#f56463','#00c6ff','#f09614','#7ae5a6','#a1a1fe','#87cefc','#ff4d18','#28b391','#ce19a6','#eac9c4','#f0e266','#66c2a9','#d9e897','#aedf84','#d3f5d4','#c19878','#909c9a','#779ade'];
        qualityData.push(mainQuality);
      }
      return qualityData;
    },
    clumpQuality(dataArr,TagName){
        var $this=this;
        var itemData = [];
        dataArr.forEach(function(item,index){
          var itemInquiryCount = {};
          itemInquiryCount.name = item.date;
          if(TagName=='询盘占比'){
              itemInquiryCount.value = item.xunnumber;
          }
          if(TagName=='积分占比'){
              itemInquiryCount.value = item.score;
          }
          if(TagName=='消费占比'){
              itemInquiryCount.value = item.money;
          }
          itemData.push(itemInquiryCount);
        });
        return itemData;
    },
    // 组装地图类型图表数据
    mapChartDataClump(res){
      var $this = this;
      var inquiryMapData = null;
      // 询盘地图
      if($this.selectedType.includes("regionEnquiries")){
        inquiryMapData = {};
        // 时间对比
        if($this.selectedData.isDateCompare&&$this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
          var mapData = "";
          // 月维度
          if($this.selectedData.isMonth){
            mapData = res.selfprovincemonthcompare;
          }else{
            // 日维度
            mapData = res.selfprovincedaycompare;
          }
          inquiryMapData.mapDataArr = [];
          var itemMapChart0 = {};
          var itemMapChart1 = {};
          var title = "";
          if($this.selectedData.dept_id.length==1){
            $this.departList.forEach(function(item){
              if(item.isOn){
                title = item.name;
              }
            });
          }else{
            title = "电商一部";
          }
          var mapWidth = parseInt(($this.minWidth-38)/2*0.7)-60;
          var mapHeight = parseInt(mapWidth*$this.mapRatio)+30;
          itemMapChart0.title = title+"("+$this.selectedData.dateDefault[0]+" ~ "+$this.selectedData.dateDefault[1]+")";
          itemMapChart0.mapData = chinaData(mapData[0],"name","number");
          itemMapChart0.randomStr = randomString(4);
          itemMapChart0.width = "50%";
          itemMapChart0.alias = "询盘个数";
          itemMapChart0.mapWidth = mapWidth;
          itemMapChart0.mapHeight = mapHeight;
          itemMapChart1.title = title+"("+$this.selectedData.dateContrast[0]+" ~ "+$this.selectedData.dateContrast[1]+")";
          itemMapChart1.mapData = chinaData(mapData[1],"name","number");
          itemMapChart1.randomStr = randomString(4);
          itemMapChart1.width = "50%";
          itemMapChart1.alias = "询盘个数";
          itemMapChart1.mapWidth = mapWidth;
          itemMapChart1.mapHeight = mapHeight;
          var maxNumArr = [mapData[0][0].number,mapData[1][0].number];
          maxNumArr.sort(function(a,b){return b-a});
          var maxNum = maxNumArr[0];
          itemMapChart0.colorData = MapInterval(maxNum);
          itemMapChart1.colorData = MapInterval(maxNum);
          itemMapChart0.topTitle = "热门地区TOP10";
          itemMapChart0.topTenData = [];
          itemMapChart0.mapData.forEach(function(item,index){
            if(index<10){
              itemMapChart0.topTenData.push(item);
            }
          });
          itemMapChart0.topTenColor = TopTenColor(itemMapChart0.topTenData,itemMapChart0.colorData);
          itemMapChart1.topTitle = "热门地区TOP10";
          itemMapChart1.topTenData = [];
          itemMapChart1.mapData.forEach(function(item,index){
            if(index<10){
              itemMapChart1.topTenData.push(item);
            }
          });
          itemMapChart1.topTenColor = TopTenColor(itemMapChart1.topTenData,itemMapChart1.colorData);
          inquiryMapData.title = "询盘 - 地区排行榜";
          inquiryMapData.unit = "（单位：个）";
          inquiryMapData.isMap = 'map';
          inquiryMapData.mapDataArr.push(itemMapChart0);
          inquiryMapData.mapDataArr.push(itemMapChart1);
        }else{
          // 部门对比
          if($this.selectedData.comparedept_id.length>0||$this.selectedData.comparetype_id.length>0){
            inquiryMapData = {};
            var mapData = "";
            if($this.selectedData.isMonth){
              // 月维度
              mapData = res.provincemonthcompare;
            }else{
              // 日维度
              mapData = res.provincecompare;
            }
            inquiryMapData.mapDataArr = [];
            var maxNumArr = [];
            mapData.forEach(function(item,index){
              maxNumArr.push(item[0].number)
            });
            maxNumArr.sort(function(a,b){return b-a});
            var maxNum = maxNumArr[0];
            mapData.forEach(function(item,index){
              var itemChart = {};
              if(index == 0){
                if($this.selectedData.dept_id.length==1){
                  $this.departList.forEach(function(item1){
                    if(item1.isOn){
                      itemChart.title = item1.name;
                    }
                  });
                }else{
                  itemChart.title="电商一部"
                }
              }else{
                  var selectContrastGroupList = [];
                  $this.contrastGroupList.forEach(function(item1){
                    if(item1.isOn){
                      selectContrastGroupList.push(item1);
                    }
                  });
                  $this.contrastTypeList.forEach(function(item1){
                    if(item1.isOn){
                      selectContrastGroupList.push(item1);
                    }
                  });
                  if($this.selectedData.comparedept_id.length>0||$this.selectedData.comparetype_id.length>0){
                      itemChart.title=selectContrastGroupList[index-1].name;                    
                  }
              }
              itemChart.randomStr = randomString(4);
              itemChart.mapData = chinaData(item,"name","number");
              itemChart.colorData = MapInterval(maxNum);
              var itemWidth = "50%";
              var mapWidth = 0;
              var mapHeight = 0;
              if(mapData.length==5){
                itemWidth = "20%";
                mapWidth = parseInt(($this.minWidth-38)/5)-60;
              }else{
                if(mapData.length>4){
                  itemWidth = "25%";
                  mapWidth = parseInt(($this.minWidth-38)/4)-60;
                }else{
                  itemWidth = parseInt(1/mapData.length*100)+"%";
                  if(mapData.length==2){
                    mapWidth = parseInt(($this.minWidth-38)/(mapData.length)*0.7)-60;
                  }else{
                    mapWidth = parseInt(($this.minWidth-38)/(mapData.length))-60;
                  }
                }
              }
              mapHeight = parseInt(mapWidth*$this.mapRatio)+30;
              itemChart.width = itemWidth;
              itemChart.mapWidth = mapWidth;
              itemChart.mapHeight = mapHeight;
              itemChart.alias = "询盘个数";
              itemChart.topTitle = "热门地区TOP10";
              itemChart.topTenData = [];
              itemChart.mapData.forEach(function(item,index){
                if(index<10){
                  itemChart.topTenData.push(item);
                }
              });
              itemChart.topTenColor = TopTenColor(itemChart.topTenData,itemChart.colorData);
              inquiryMapData.mapDataArr.push(itemChart);
            });
            inquiryMapData.title = "询盘 - 地区排行榜";
            inquiryMapData.unit = "（单位：个）";
            inquiryMapData.isMap = 'map';
          }else{
            inquiryMapData = [];
            // 统计
            // 月维度
            var itemMapData = {};
            if($this.selectedData.isMonth){
              itemMapData.mapData = chinaData(res.provincecountmapmonth,"name","number");
              itemMapData.colorData = MapInterval(itemMapData.mapData[0].value);
            }else{
              // 日维度 
              itemMapData.mapData = chinaData(res.provincecountmapday,"name","number");
              itemMapData.colorData = MapInterval(itemMapData.mapData[0].value);
            }
            itemMapData.randomStr = randomString(4);
            itemMapData.alias = "询盘个数";
            itemMapData.title = "询盘 - 地区排行榜";
            itemMapData.unit = "（单位：个）";
            itemMapData.isMap = 'map';
            itemMapData.topTitle = "热门地区TOP10";
            itemMapData.topTenData = [];
            itemMapData.mapData.forEach(function(item,index){
              if(index<10){
                itemMapData.topTenData.push(item);
              }
            });
            itemMapData.topTenColor = TopTenColor(itemMapData.topTenData,itemMapData.colorData);
            var mapWidth = 0;
            var mapHeight = 0;
            mapWidth = parseInt(($this.minWidth-38)/2)-80-330;
            mapHeight = parseInt(mapWidth*$this.mapRatio)+30;
            itemMapData.mapWidth = mapWidth;
            itemMapData.mapHeight = mapHeight;
            inquiryMapData.push(itemMapData);
          }
        }
      }
      // 成交积分地图
      var dealRegionMapData = null
      if($this.selectedType.includes("regionClinchScore")){
        dealRegionMapData = {};
        // 时间对比
        if($this.selectedData.isDateCompare&&$this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
          var mapData = res.selfprovincebuymonthcompare;
          dealRegionMapData.mapDataArr = [];
          var itemMapChart0 = {};
          var itemMapChart1 = {};
          var title = "";
          if($this.selectedData.dept_id.length==1){
            $this.departList.forEach(function(item){
              if(item.isOn){
                title = item.name;
              }
            });
          }else{
            title = "电商一部";
          }
          var mapWidth = parseInt(($this.minWidth-38)/2*0.7)-60;
          var mapHeight = parseInt(mapWidth*$this.mapRatio)+30;
          itemMapChart0.title = title+"（"+$this.selectedData.dateDefault[0]+" ~ "+$this.selectedData.dateDefault[1]+"）";
          itemMapChart0.mapData = chinaData(mapData[0],"name","number");
          itemMapChart0.randomStr = randomString(4);
          itemMapChart0.width = "50%";
          itemMapChart0.alias = "成交积分";
          itemMapChart0.mapWidth = mapWidth;
          itemMapChart0.mapHeight = mapHeight;
          itemMapChart1.title = title+"（"+$this.selectedData.dateContrast[0]+" ~ "+$this.selectedData.dateContrast[1]+"）";
          itemMapChart1.mapData = chinaData(mapData[1],"name","number");
          itemMapChart1.randomStr = randomString(4);
          itemMapChart1.width = "50%";
          itemMapChart1.alias = "成交积分";
          itemMapChart1.mapWidth = mapWidth;
          itemMapChart1.mapHeight = mapHeight;
          var maxNumArr = [mapData[0][0].number,mapData[1][0].number];
          maxNumArr.sort(function(a,b){return b-a});
          var maxNum = maxNumArr[0];
          itemMapChart0.colorData = MapInterval(maxNum);
          itemMapChart1.colorData = MapInterval(maxNum);
          itemMapChart0.topTitle = "热门地区TOP10";
          itemMapChart0.topTenData = [];
          itemMapChart0.mapData.forEach(function(item,index){
            if(index<10){
              itemMapChart0.topTenData.push(item);
            }
          });
          itemMapChart0.topTenColor = TopTenColor(itemMapChart0.topTenData,itemMapChart0.colorData);
          itemMapChart1.topTitle = "热门地区TOP10";
          itemMapChart1.topTenData = [];
          itemMapChart1.mapData.forEach(function(item,index){
            if(index<10){
              itemMapChart1.topTenData.push(item);
            }
          });
          itemMapChart1.topTenColor = TopTenColor(itemMapChart1.topTenData,itemMapChart1.colorData);
          dealRegionMapData.title = "成交积分 - 地区排行榜";
          dealRegionMapData.unit = "（单位：分）";
          dealRegionMapData.isMap = 'map';
          dealRegionMapData.mapDataArr.push(itemMapChart0);
          dealRegionMapData.mapDataArr.push(itemMapChart1);
        }else{
          // 部门对比
          if($this.selectedData.comparedept_id.length>0||$this.selectedData.comparetype_id.length>0){
            var mapData = res.provincebuymonthcompare;
            dealRegionMapData.mapDataArr = [];
            var maxNumArr = [];
            mapData.forEach(function(item,index){
              maxNumArr.push(item[0].number)
            });
            maxNumArr.sort(function(a,b){return b-a});
            var maxNum = maxNumArr[0];
            mapData.forEach(function(item,index){
              var itemChart = {};
              if(index == 0){
                if($this.selectedData.dept_id.length==1){
                  $this.departList.forEach(function(item1){
                    if(item1.isOn){
                      itemChart.title = item1.name;
                    }
                  });
                }else{
                  itemChart.title="电商一部"
                }
              }else{                
                  var selectContrastGroupList = [];
                  $this.contrastGroupList.forEach(function(item1){
                    if(item1.isOn){
                      selectContrastGroupList.push(item1);
                    }
                  });                  
                  $this.contrastTypeList.forEach(function(item1){
                    if(item1.isOn){
                      selectContrastGroupList.push(item1);
                    }
                  });
                  if($this.selectedData.comparedept_id.length>0||$this.selectedData.comparetype_id.length>0){
                      itemChart.title=selectContrastGroupList[index-1].name;                    
                  }
              }
              itemChart.randomStr = randomString(4);
              itemChart.mapData = chinaData(item,"name","number");
              itemChart.colorData = MapInterval(maxNum);
              var itemWidth = "50%";
              var mapWidth = 0;
              var mapHeight = 0;
              if(mapData.length==5){
                itemWidth = "20%";
                mapWidth = parseInt(($this.minWidth-38)/5)-60;
              }else{
                if(mapData.length>4){
                  itemWidth = "25%";
                  mapWidth = parseInt(($this.minWidth-38)/4)-60;
                }else{
                  itemWidth = parseInt(1/mapData.length*100)+"%";
                  if(mapData.length==2){
                    mapWidth = parseInt(($this.minWidth-38)/(mapData.length)*0.7)-60;
                  }else{
                    mapWidth = parseInt(($this.minWidth-38)/(mapData.length))-60;
                  }
                }
              }
              mapHeight = parseInt(mapWidth*$this.mapRatio)+30;
              itemChart.width = itemWidth;
              itemChart.mapWidth = mapWidth;
              itemChart.mapHeight = mapHeight;
              itemChart.alias = "成交积分";
              itemChart.topTitle = "热门地区TOP10";
              itemChart.topTenData = [];
              itemChart.mapData.forEach(function(item,index){
                if(index<10){
                  itemChart.topTenData.push(item);
                }
              });
              itemChart.topTenColor = TopTenColor(itemChart.topTenData,itemChart.colorData);
              dealRegionMapData.mapDataArr.push(itemChart);
            });

            dealRegionMapData.title = "成交积分 - 地区排行榜";
            dealRegionMapData.unit = "（单位：分）";
            dealRegionMapData.isMap = 'map';
          }else{
            dealRegionMapData = [];
            // 统计
            var itemMapData = {};
            itemMapData.mapData = chinaData(res.provincebuymapmonth,"name","number");;
            itemMapData.colorData = MapInterval(res.provincebuymapmonth[0].number);
            itemMapData.randomStr = randomString(4);
            itemMapData.title = "成交积分 - 地区排行榜";
            itemMapData.unit = "（单位：分）";
            itemMapData.alias = "成交积分";
            itemMapData.topTitle = "热门地区TOP10";
            itemMapData.topTenData = [];
            itemMapData.mapData.forEach(function(item,index){
              if(index<10){
                itemMapData.topTenData.push(item);
              }
            });
            itemMapData.topTenColor = TopTenColor(itemMapData.topTenData,itemMapData.colorData);
            var mapWidth = 0;
            var mapHeight = 0;
            mapWidth = parseInt(($this.minWidth-38)/2)-80-330;
            mapHeight = parseInt(mapWidth*$this.mapRatio)+30;
            itemMapData.mapWidth = mapWidth;
            itemMapData.mapHeight = mapHeight;
            itemMapData.isMap = 'map';
            dealRegionMapData.push(itemMapData);
          }
        }
      }
      // 成交个数地图
      var numRegionMapData = null
      if($this.selectedType.includes("regionClinchNumber")){
        numRegionMapData = {};
        // 时间对比
        if($this.selectedData.isDateCompare&&$this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
          var mapData = res.selfprovincebuynumbermonthcompare;
          numRegionMapData.mapDataArr = [];
          var itemMapChart0 = {};
          var itemMapChart1 = {};
          var title = "";
          if($this.selectedData.dept_id.length==1){
            $this.departList.forEach(function(item){
              if(item.isOn){
                title = item.name;
              }
            });
          }else{
            title = "电商一部";
          }
          var mapWidth = parseInt(($this.minWidth-38)/2*0.7)-60;
          var mapHeight = parseInt(mapWidth*$this.mapRatio)+30;
          itemMapChart0.title = title+"（"+$this.selectedData.dateDefault[0]+" ~ "+$this.selectedData.dateDefault[1]+"）";
          itemMapChart0.mapData = chinaData(mapData[0],"name","number");
          itemMapChart0.randomStr = randomString(4);
          itemMapChart0.width = "50%";
          itemMapChart0.alias = "成交个数";
          itemMapChart0.mapWidth = mapWidth;
          itemMapChart0.mapHeight = mapHeight;
          itemMapChart1.title = title+"（"+$this.selectedData.dateContrast[0]+" ~ "+$this.selectedData.dateContrast[1]+"）";
          itemMapChart1.mapData = chinaData(mapData[1],"name","number");
          itemMapChart1.randomStr = randomString(4);
          itemMapChart1.width = "50%";
          itemMapChart1.alias = "成交个数";
          itemMapChart1.mapWidth = mapWidth;
          itemMapChart1.mapHeight = mapHeight;
          var maxNumArr = [mapData[0][0].number,mapData[1][0].number];
          maxNumArr.sort(function(a,b){return b-a});
          var maxNum = maxNumArr[0];
          itemMapChart0.colorData = MapInterval(maxNum);
          itemMapChart1.colorData = MapInterval(maxNum);
          itemMapChart0.topTitle = "热门地区TOP10";
          itemMapChart0.topTenData = [];
          itemMapChart0.mapData.forEach(function(item,index){
            if(index<10){
              itemMapChart0.topTenData.push(item);
            }
          });
          itemMapChart0.topTenColor = TopTenColor(itemMapChart0.topTenData,itemMapChart0.colorData);
          itemMapChart1.topTitle = "热门地区TOP10";
          itemMapChart1.topTenData = [];
          itemMapChart1.mapData.forEach(function(item,index){
            if(index<10){
              itemMapChart1.topTenData.push(item);
            }
          });
          itemMapChart1.topTenColor = TopTenColor(itemMapChart1.topTenData,itemMapChart1.colorData);
          numRegionMapData.title = "成交个数 - 地区排行榜";
          numRegionMapData.unit = "（单位：分）";
          numRegionMapData.isMap = 'map';
          numRegionMapData.mapDataArr.push(itemMapChart0);
          numRegionMapData.mapDataArr.push(itemMapChart1);
        }else{
          // 部门对比
          if($this.selectedData.comparedept_id.length>0||$this.selectedData.comparetype_id.length>0){
            var mapData = res.provincebuynumbermonthcompare;
            numRegionMapData.mapDataArr = [];
            var maxNumArr = [];
            mapData.forEach(function(item,index){
              maxNumArr.push(item[0].number)
            });
            maxNumArr.sort(function(a,b){return b-a});
            var maxNum = maxNumArr[0];
            mapData.forEach(function(item,index){
              var itemChart = {};
              if(index == 0){
                if($this.selectedData.dept_id.length==1){
                  $this.departList.forEach(function(item1){
                    if(item1.isOn){
                      itemChart.title = item1.name;
                    }
                  });
                }else{
                  itemChart.title="电商一部"
                }
              }else{                
                  var selectContrastGroupList = [];
                  $this.contrastGroupList.forEach(function(item1){
                    if(item1.isOn){
                      selectContrastGroupList.push(item1);
                    }
                  });                  
                  $this.contrastTypeList.forEach(function(item1){
                    if(item1.isOn){
                      selectContrastGroupList.push(item1);
                    }
                  });
                  if($this.selectedData.comparedept_id.length>0||$this.selectedData.comparetype_id.length>0){
                      itemChart.title=selectContrastGroupList[index-1].name;                    
                  }
              }
              itemChart.randomStr = randomString(4);
              itemChart.mapData = chinaData(item,"name","number");
              itemChart.colorData = MapInterval(maxNum);
              var itemWidth = "50%";
              var mapWidth = 0;
              var mapHeight = 0;
              if(mapData.length==5){
                itemWidth = "20%";
                mapWidth = parseInt(($this.minWidth-38)/5)-60;
              }else{
                if(mapData.length>4){
                  itemWidth = "25%";
                  mapWidth = parseInt(($this.minWidth-38)/4)-60;
                }else{
                  itemWidth = parseInt(1/mapData.length*100)+"%";
                  if(mapData.length==2){
                    mapWidth = parseInt(($this.minWidth-38)/(mapData.length)*0.7)-60;
                  }else{
                    mapWidth = parseInt(($this.minWidth-38)/(mapData.length))-60;
                  }
                }
              }
              mapHeight = parseInt(mapWidth*$this.mapRatio)+30;
              itemChart.width = itemWidth;
              itemChart.mapWidth = mapWidth;
              itemChart.mapHeight = mapHeight;
              itemChart.alias = "成交个数";
              itemChart.topTitle = "热门地区TOP10";
              itemChart.topTenData = [];
              itemChart.mapData.forEach(function(item,index){
                if(index<10){
                  itemChart.topTenData.push(item);
                }
              });
              itemChart.topTenColor = TopTenColor(itemChart.topTenData,itemChart.colorData);
              numRegionMapData.mapDataArr.push(itemChart);
            });

            numRegionMapData.title = "成交个数 - 地区排行榜";
            numRegionMapData.unit = "（单位：分）";
            numRegionMapData.isMap = 'map';
          }else{
            numRegionMapData = [];
            // 统计
            var itemMapData = {};
            itemMapData.mapData = chinaData(res.provincebuynumbermapmonth,"name","number");;
            itemMapData.colorData = MapInterval(res.provincebuynumbermapmonth[0].number);
            itemMapData.randomStr = randomString(4);
            itemMapData.title = "成交个数 - 地区排行榜";
            itemMapData.unit = "（单位：分）";
            itemMapData.alias = "成交个数";
            itemMapData.topTitle = "热门地区TOP10";
            itemMapData.topTenData = [];
            itemMapData.mapData.forEach(function(item,index){
              if(index<10){
                itemMapData.topTenData.push(item);
              }
            });
            itemMapData.topTenColor = TopTenColor(itemMapData.topTenData,itemMapData.colorData);
            var mapWidth = 0;
            var mapHeight = 0;
            mapWidth = parseInt(($this.minWidth-38)/2)-80-330;
            mapHeight = parseInt(mapWidth*$this.mapRatio)+30;
            itemMapData.mapWidth = mapWidth;
            itemMapData.mapHeight = mapHeight;
            itemMapData.isMap = 'map';
            numRegionMapData.push(itemMapData);
          }
        }
      }
      var mapChartData = [];
      var itemChartArr = [];
      if(inquiryMapData){
        itemChartArr.push(inquiryMapData);
      }
      if(dealRegionMapData){
        itemChartArr.push(dealRegionMapData);
      }
      if(numRegionMapData){
        itemChartArr.push(numRegionMapData);
      }
      mapChartData.push(itemChartArr);
      return mapChartData;
    },
    // 组装产品分析数据
    productDataClump(res){
      var $this = this;
      var productData = null
      if($this.selectedType.includes("ProductAnalysis")){
        productData = {};
        // 时间对比
        if($this.selectedData.isDateCompare&&$this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
          var totalData = res.selefproductbuylistcompare;
          productData.itemData = [];
          totalData.forEach(function(item,index){
            var itemProduct = $this.clumpProduct(item);
            productData.itemData.push(itemProduct);
          });
          var title = "";
          if($this.selectedData.dept_id.length==1){
            $this.departList.forEach(function(item){
              if(item.isOn){
                title = item.name;
              }
            });
          }else{
            title = "电商一部";
          }
          productData.itemData.forEach(function(item,index){
            if(index==0){
              item.title = title+"（"+$this.selectedData.dateDefault[0]+"~"+$this.selectedData.dateDefault[1]+"）";
            }else{
              item.title = title+"（"+$this.selectedData.dateContrast[0]+"~"+$this.selectedData.dateContrast[1]+"）";
            }
          })
          productData.title = "产品分析";
          productData.isMap = 'pro';
        }else{
          productData = {};
          // 部门对比
          if($this.selectedData.comparedept_id.length>0||$this.selectedData.comparetype_id.length>0){
            var totalData = res.productbuylistcompare;
            productData.itemData = [];
            totalData.forEach(function(item,index){
              var itemProduct = $this.clumpProduct(item);
              productData.itemData.push(itemProduct);
            });
            totalData.forEach(function(item,index){
              if(index == 0){
                if($this.selectedData.dept_id.length==1){
                  $this.departList.forEach(function(item1){
                    if(item1.isOn){
                      productData.itemData[0].title = item1.name;
                    }
                  });
                }else{
                  productData.itemData[0].title="电商一部"
                }
              }else{                                
                  var selectContrastGroupList = [];
                  $this.contrastGroupList.forEach(function(item1){
                    if(item1.isOn){
                      selectContrastGroupList.push(item1);
                    }
                  });                  
                  $this.contrastTypeList.forEach(function(item1){
                    if(item1.isOn){
                      selectContrastGroupList.push(item1);
                    }
                  });
                  if($this.selectedData.comparedept_id.length>0||$this.selectedData.comparetype_id.length>0){
                      productData.itemData[index].title=selectContrastGroupList[index-1].name;                    
                  }
              }
            });
            productData.title = "产品分析";
            productData.isMap = 'pro';
          }else{
            // 统计
            productData =  []
            var itemData = $this.clumpProduct(res.productbuylist);
            itemData.title = "产品分析";
            itemData.isMap = 'pro';
            productData.push(itemData);
          }
        }
      }
      return productData;
    },
    // 产品数据组装的封装函数
    clumpProduct(dataArr){
      var itemData = {};
      itemData.tableData = [];
      itemData.inquiryCount = [];
      itemData.dealCount = [];
      itemData.dealScore = [];
      itemData.inquiryCountColor = ['#fb7c6f','#ffcd6d','#72e4a1','#9c9cfe','#81cbfc',"#FF4500","#1AAF8B"];
      itemData.dealCountColor = ['#416eff','#43ced7','#00a0e9','#0068b7','#41d0ff',"#406C85","#F6BD16"];
      itemData.dealScoreColor = ['#ffc383','#f29b76','#ff783f','#f29c9f','#acd598',"#B40F0F","#2FB8FC"];
      var inquiryCount = [];
      var dealCount = [];
      var dealScore = [];
      dataArr.forEach(function(item,index){
        var itemTable = {};
        var itemInquiryCount = {};
        var itemDealCount = {};
        var itemDealScore = {};
        itemTable.name = item.xunproduct;
        itemTable.inquiryNumber = item.xunnumber;
        itemTable.dealNumber = item.buynumber;
        itemTable.dealScore = item.score;
        itemData.tableData.push(itemTable);
        itemInquiryCount.name = item.xunproduct;
        itemInquiryCount.value = item.xunnumber;
        inquiryCount.push(itemInquiryCount);
        itemDealCount.name = item.xunproduct;
        itemDealCount.value = item.buynumber;
        dealCount.push(itemDealCount);
        itemDealScore.name = item.xunproduct;
        itemDealScore.value = item.score;
        dealScore.push(itemDealScore);
      });
      inquiryCount.sort(sortByDesc("value"));
      dealCount.sort(sortByDesc("value"));
      dealScore.sort(sortByDesc("value"));
      var itemInquiryObj = {};
      itemInquiryObj.name = "其他";
      itemInquiryObj.value = 0;
      inquiryCount.forEach(function(item,index){
        if(index<5){
          itemData.inquiryCount.push(item);
        }else{
          if(item.name!="配件"){
            itemInquiryObj.value += item.value;
          }else{
            itemData.inquiryCount.push(item);
          }
        }
      });
      itemData.inquiryCount.push(itemInquiryObj);
      var itemDealObj = {};
      itemDealObj.name = "其他";
      itemDealObj.value = 0;
      dealCount.forEach(function(item,index){
        if(index<5){
          itemData.dealCount.push(item);
        }else{
          if(item.name!="配件"){
            itemDealObj.value += item.value;
          }else{
            itemData.dealCount.push(item);
          }
        }
      });
      itemData.dealCount.push(itemDealObj);
      var itemScoreObj = {};
      itemScoreObj.name = "其他";
      itemScoreObj.value = 0;
      dealScore.forEach(function(item,index){
        if(index<5){
          itemData.dealScore.push(item);
        }else{
          if(item.name!="配件"){
            itemScoreObj.value += item.value;
          }else{
            itemData.dealScore.push(item);
          }
        }
      });
      itemData.dealScore.push(itemScoreObj);
      itemData.randomStr1 = randomString(4);
      itemData.randomStr2 = randomString(4);
      itemData.randomStr3 = randomString(4);
      return itemData;
    },
    // 时间对比数据封装函数
    dateCompare(dataArr,key,isMulit){
      var $this = this;
      // 默认时间数据条数多于对比时间数据条数
      var tongData = groupDateColor(dataArr);
      var backData = {};
      backData.mainData = [];
      backData.colorArr = [];
      tongData.forEach(function(item){
        backData.colorArr.push(item[0].color);
      });
      if(tongData[0].length>=tongData[1].length){
        var newChartOne=[];
        var newChartTwo=[];
        for(var i=0;i<tongData[0].length;i++){
          var itemChart0 = {};
          var itemChart1 = {};
          if(tongData[1][i]){
            itemChart0.key = tongData[0][i].date+"&"+tongData[1][i].date;
            itemChart0.name = $this.selectedData.dateDefault[0]+" ~ "+$this.selectedData.dateDefault[1];
            itemChart1.key = tongData[0][i].date+"&"+tongData[1][i].date;
            itemChart1.name = $this.selectedData.dateContrast[0]+" ~ "+$this.selectedData.dateContrast[1];
            if(key == "score"||key=="money"){
              itemChart1.value = Math.floor(tongData[1][i][key]*100)/100;
            }else{
              itemChart1.value = tongData[1][i][key];
            }
            if(key=="anumber"){
              itemChart1.user = tongData[1][i].user;
            }
            itemChart1.color = tongData[1][0].color;
          }else{
            itemChart0.key = tongData[0][i].date+"&";
            itemChart0.name = $this.selectedData.dateDefault[0]+" ~ "+$this.selectedData.dateDefault[1];
            itemChart1.key = tongData[0][i].date+"&";
            itemChart1.name = $this.selectedData.dateContrast[0]+" ~ "+$this.selectedData.dateContrast[1];
            itemChart1.value = null;
            itemChart1.color = tongData[1][0].color;
            if(key=="anumber"){
              itemChart1.user = [];
            }
          }
          if(key == "score"||key=="money"){
            itemChart0.value = Math.floor(tongData[0][i][key]*100)/100;
          }else{
            itemChart0.value = tongData[0][i][key];
          }
          if(key=="anumber"){
            itemChart0.user = tongData[0][i].user;
          }
          itemChart0.color = tongData[0][0].color;
          newChartOne.push(itemChart0);
          newChartTwo.push(itemChart1);
        }
        backData.mainData.push(newChartOne);
        backData.mainData.push(newChartTwo);
      }else{
        var newChartOne=[];
        var newChartTwo=[];
        for(var i=0;i<tongData[1].length;i++){
          var itemChart0 = {};
          var itemChart1 = {};
          if(tongData[0][i]){
            itemChart1.key = tongData[0][i].date+"&"+tongData[1][i].date;
            itemChart1.name = $this.selectedData.dateContrast[0]+" ~ "+$this.selectedData.dateContrast[1];
            itemChart0.key = tongData[0][i].date+"&"+tongData[1][i].date;
            itemChart0.name = $this.selectedData.dateDefault[0]+" ~ "+$this.selectedData.dateDefault[1];
            if(key == "score"||key=="money"){
              itemChart0.value = Math.floor(tongData[0][i][key]*100)/100;
            }else{
              itemChart0.value = tongData[0][i][key];
            }
            if(key=="anumber"){
              itemChart0.user = tongData[0][i].user;
            }
            itemChart0.color = tongData[0][0].color;
          }else{
            itemChart1.key = "&"+tongData[1][i].date;
            itemChart1.name = $this.selectedData.dateContrast[0]+" ~ "+$this.selectedData.dateContrast[1];
            itemChart0.key = "&"+tongData[1][i].date;
            itemChart0.name = $this.selectedData.dateDefault[0]+" ~ "+$this.selectedData.dateDefault[1];
            itemChart0.value = null;
            itemChart0.color = tongData[0][0].color;
            if(key=="anumber"){
              itemChart0.user = [];
            }
          }
          if(key == "score"||key=="money"){
            itemChart1.value = Math.floor(tongData[1][i][key]*100)/100;
          }else{
            itemChart1.value = tongData[1][i][key];
          }
          if(key=="anumber"){
            itemChart1.user = tongData[1][i].user;
          }
          itemChart1.color = tongData[1][0].color;
          newChartOne.push(itemChart0);
          newChartTwo.push(itemChart1);
        }
        backData.mainData.push(newChartOne);
        backData.mainData.push(newChartTwo);
      }
      backData.dateCompareData = {};
      backData.dateCompareData.baseValue = 0;
      backData.dateCompareData.compareValue = 0;
      tongData.forEach(function(item,index){
        item.forEach(function(item1){
          if(index == 0){
            backData.dateCompareData.baseValue += item1[key];
          }else{
            backData.dateCompareData.compareValue += item1[key];
          }
        });
      });
      if(key == "score"||key == "money"){
        backData.dateCompareData.baseValue =Math.floor(backData.dateCompareData.baseValue*100)/100;
        backData.dateCompareData.compareValue = Math.floor(backData.dateCompareData.compareValue*100)/100;
      }
      // 时间对比数据
      backData.dateCompareData.baseDate = $this.selectedData.dateDefault[0]+" ~ "+$this.selectedData.dateDefault[1];
      backData.dateCompareData.compareDate = $this.selectedData.dateContrast[0]+" ~ "+$this.selectedData.dateContrast[1]
      if(backData.dateCompareData.baseValue - backData.dateCompareData.compareValue>0){
        backData.dateCompareData.status = "up";
        backData.dateCompareData.baseWidth = "100%";
        backData.dateCompareData.compareWidth = parseInt(backData.dateCompareData.compareValue/backData.dateCompareData.baseValue*100)+"%";
      }else if(backData.dateCompareData.baseValue - backData.dateCompareData.compareValue<0){
        backData.dateCompareData.status = "down";
        backData.dateCompareData.compareWidth = "100%";
        backData.dateCompareData.baseWidth = parseInt(backData.dateCompareData.baseValue/backData.dateCompareData.compareValue*100)+"%";
      }else{
        backData.dateCompareData.status = "flat";
        backData.dateCompareData.baseWidth = "100%";
        backData.dateCompareData.compareWidth = "100%";
      }
      backData.dateCompareData.compareNumber = numSeparate(Math.abs(backData.dateCompareData.baseValue - backData.dateCompareData.compareValue).toFixed(1)*1);
      backData.dateCompareData.compareRate = backData.dateCompareData.compareValue==0?'0%':(Math.abs(backData.dateCompareData.baseValue - backData.dateCompareData.compareValue)/backData.dateCompareData.compareValue*100).toFixed(1)+"%";
      backData.dateCompareData.baseValue = numSeparate(backData.dateCompareData.baseValue);
      backData.dateCompareData.compareValue = numSeparate(backData.dateCompareData.compareValue);
      return backData;
    },
    // 部门点击事件
    groupChangeHandler(id){
      var $this = this;
      var departList = $this.departList;
      var selectedGroupID = [];
      departList.forEach(function(item,index){
        if(item.id == id){
          item.isOn = !item.isOn;
        }
        if(item.isOn){
          selectedGroupID.push(item.id);
        }
      });
      $this.departList = departList;
      $this.selectedData.dept_id = selectedGroupID;
      // 部门有被选中的，且默认时间是空的情况下，需要给默认时间一个默认时间范围
      if($this.selectedData.dept_id.length>0&&(!$this.selectedData.dateDefault||$this.selectedData.dateDefault.length==0)){
        if($this.selectedData.isMonth){
          $this.selectedData.dateDefault = $this.getNearMonth();
        }else{
          $this.selectedData.dateDefault = $this.getNearDay();
        }
      }
      // 只有一个部门被选中，日维度需默认将询盘个数分析、询盘地区分析选中，月维度需将所有分析项选中      
      if($this.selectedData.dept_id.length==1&&$this.selectedData.type.length==0){
        var contrastList = $this.contrastList;
        var selectedContrastType = [];
        var selectedType = [];
        contrastList.forEach(function(item){
          if($this.selectedData.isMonth){
            item.isOn = true;
            item.disabled = false;
            if($this.selectedData.comparedept_id.length>0||$this.selectedData.comparetype_id.length>0){
              if(item.value=='qualityAnalysis'){
                item.isOn = false;
                item.disabled = true;
              }
            }else{
              if(item.value=='consumptionAnalysis'){
                item.isOn = false;
                item.disabled = true;
              }
            }
            if(item.isOn){
              selectedContrastType.push(item.id);
              selectedType.push(item.value);
            }
          }else{
            if(item.value=="enquiriesFew"||item.value=="regionEnquiries"){
              item.isOn = true;
              selectedContrastType.push(item.id);
              selectedType.push(item.value);
            }
          }
        });
        $this.selectedType = selectedType;
        $this.selectedData.type = selectedContrastType;
        $this.contrastList = contrastList;
      }
      // 部门有被选中的，且只有一个部门被选中的情况下，对比部门中，当前被选中部门需被禁用不可选（不能自己和自己在部门维度比）,部门选中超过1个或没有被选中的，则对比部门不需要有禁用状态
      if($this.selectedData.dept_id.length==1){        
        var contrastTypeList = $this.contrastTypeList;
        contrastTypeList.forEach(function(item){
          if(item.id == $this.selectedData.dept_id[0]){
            item.disabled = true;
          }
        });
        $this.contrastTypeList = contrastTypeList;
      }else{
        if($this.selectedData.dept_id.length>1){    
          var contrastTypeList = $this.contrastTypeList;
          contrastTypeList.forEach(function(item){
            item.disabled = false;
          });
          $this.contrastTypeList = contrastTypeList;
        }else{
          var contrastTypeList = $this.contrastTypeList;
          contrastTypeList.forEach(function(item){
            item.disabled = false;
          });
          $this.contrastTypeList = contrastTypeList;
        }
      }
      $this.getGroupName();
      $this.initData();
    },
    //组装部门选中名字
    getGroupName(){
      var $this = this;
      var departList = $this.departList;
      var groupName = "";
      var fontArr = [];
      departList.forEach(function(item,index){
        if(item.isOn){
          fontArr.push(item.name);
        }
      })
      if(fontArr&&fontArr.length>0){
        if(fontArr.length==1){
          groupName=fontArr[0];
        }else{          
          groupName='电商一部';
        }
      }else{
        groupName = '';
      }
      $this.groupName = groupName;
    },
    // 日期维度点击事件
    dimensionChangeHandler(obj){
      var $this = this;
      if(!obj.isOn){
        var dateDimension = $this.dateDimension;
        dateDimension.forEach(function(item){
          if(item.value==obj.value){
            item.isOn = true;
            $this.dateSelected = true;
            if(item.value=="month"){
              $this.selectedData.isMonth = true;
            }else{
              $this.selectedData.isMonth = false;
            }
          }else{
            item.isOn = false;
          }
        });
        $this.dateDimension = dateDimension;
        // 切换日期维度，对比时间清空，默认时间给一个默认时间范围
        if($this.selectedData.isMonth){
          $this.selectedData.dateDefault = $this.getNearMonth();
          $this.selectedData.dateContrast = [];
        }else{
          $this.selectedData.dateDefault = $this.getNearDay();
          $this.selectedData.dateContrast = [];
        }
        // 切换日期维度，分析项只在月时可选的，切换到日维度时，需禁用，且清除选中状态；切换到月维度时，则需解除禁用并全部选中
        var contrastList = $this.contrastList;
        var selectedContrastType = [];
        var selectedType = [];
        contrastList.forEach(function(item,index){
          if($this.selectedData.isMonth){
              item.isOn = true;
              item.disabled = false;
              if($this.selectedData.comparedept_id.length>0||$this.selectedData.comparetype_id.length>0){
                if(item.value=='qualityAnalysis'||item.value=='consumptionAnalysis'){
                  item.isOn = false;
                  item.disabled = true;
                }
              }
          }else{
            if(item.value=="enquiriesFew"||item.value=="regionEnquiries"){
              item.isOn = true;
              item.disabled = false;
            }else{
              item.isOn = false;
              item.disabled = true;
            }
          }
          if(item.isOn){
            selectedContrastType.push(item.id);
            selectedType.push(item.value);
          }
        });
        $this.selectedData.type = selectedContrastType;
        $this.contrastList = contrastList;
        $this.selectedType = selectedType;
        $this.initData();
      }
    },
    // 日期对比点击事件
    dateCompareChangeHandler(){
      var $this = this;
      // 只有在对比部门没有被选中的，此时日期对比才是非禁用状态，可点击的
      if($this.selectedData.comparedept_id.length==0&&$this.dateSelected){
        if($this.selectedData.isDateCompare){
          $this.selectedData.isDateCompare = false;
          if($this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
            $this.selectedData.dateContrast = [];
          }
        }else{
          $this.selectedData.isDateCompare = true;
        }
        //月维度，日期对比添加质量分析
        if($this.selectedData.isMonth){            
          var contrastList=$this.contrastList;
          var selectedContrastType = [];
          var selectedType = [];
          contrastList.forEach(function(item,index){
            if(item.value=='qualityAnalysis'){
              if($this.selectedData.isDateCompare){
                item.isOn=false;
                item.disabled=true;
              }else{
                item.isOn=true;
                item.disabled=false;
              }
            }
            if(item.isOn){
              selectedContrastType.push(item.id);
              selectedType.push(item.value);
            }
          });
          $this.selectedType = selectedType;
          $this.selectedData.type = selectedContrastType;
          $this.contrastList = contrastList;
          $this.initData();
        }
      }
    },
    // 分析项点击事件
    analysisItemChangeHandler(obj){
      var $this = this;
      if(!obj.disabled){
        var contrastList = $this.contrastList;
        var selectedContrastType = [];
        var selectedType = [];
        contrastList.forEach(function(item,index){
          if(item.value == obj.value){
            item.isOn = !item.isOn;
          }
          if(item.isOn){
            selectedContrastType.push(item.id);
            selectedType.push(item.value);
          }
        });
        $this.selectedType = selectedType;
        $this.selectedData.type = selectedContrastType;
        $this.contrastList = contrastList;
        $this.initData();
      }
    },    
    // 对比部门删除点击事件
    deleteContrastType(id){
      var $this = this;
      var contrastTypeList = $this.contrastTypeList;
      var selectedContrastGroupID = [];
      contrastTypeList.forEach(function(item,index){
        if(item.id == id){
          item.isOn = false;
        }
        if(item.isOn){
          selectedContrastGroupID.push(item.id);
        }
      });
      $this.contrastTypeList = contrastTypeList;
      $this.selectedData.comparetype_id = selectedContrastGroupID;
      if($this.selectedData.comparetype_id.length==0){
          //月维度，部门对比添加质量分析
          if($this.selectedData.isMonth){            
            var contrastList=$this.contrastList;
            var selectedContrastType = [];
            var selectedType = [];
            contrastList.forEach(function(item,index){
              if(item.value=='qualityAnalysis'){
                item.isOn=true;
                item.disabled=false;
              }
              if(item.isOn){
                selectedContrastType.push(item.id);
                selectedType.push(item.value);
              }
            });
            $this.selectedType = selectedType;
            $this.selectedData.type = selectedContrastType;
            $this.contrastList = contrastList;
          }
          var contrastGroupList = $this.contrastGroupList;
          contrastGroupList.forEach(function(item,index){
              item.isOn=false;
              item.disabled=false;
          });
      }
      $this.initData();
    },
    // 对比部门删除点击事件
    deleteContrastGroup(id){
      var $this = this;
      var contrastGroupList = $this.contrastGroupList;
      var selectedContrastGroupID = [];
      contrastGroupList.forEach(function(item,index){
        if(item.id == id){
          item.isOn = false;
        }
        if(item.isOn){
          selectedContrastGroupID.push(item.id);
        }
      });
      $this.contrastGroupList = contrastGroupList;
      $this.selectedData.comparedept_id = selectedContrastGroupID;
      if($this.selectedData.comparedept_id.length==0){
          //月维度，部门对比添加质量分析
          if($this.selectedData.isMonth){            
            var contrastList=$this.contrastList;
            var selectedContrastType = [];
            var selectedType = [];
            contrastList.forEach(function(item,index){
              if(item.value=='qualityAnalysis'){
                item.isOn=true;
                item.disabled=false;
              }
              if(item.isOn){
                selectedContrastType.push(item.id);
                selectedType.push(item.value);
              }
            });
            $this.selectedType = selectedType;
            $this.selectedData.type = selectedContrastType;
            $this.contrastList = contrastList;
          }
          var contrastTypeList = $this.contrastTypeList;
          contrastTypeList.forEach(function(item,index){
              item.isOn=false;
              item.disabled=false;
              if($this.selectedData.dept_id.length!=$this.departList.length){
                  $this.selectedData.dept_id.forEach(function(items,indexs){
                      if(item.id==items){
                        item.disabled=true;
                      }
                  });
              }
          });
      }
      $this.initData();
    },
    // 基础部门删除点击事件
    deleteDefaultGroup(){
      var $this = this;
      // 基础部门被删除，则对比部门选中状态全部清空，基础部门选中状态全部清空，页面数据清空
      var departList = $this.departList;
      departList.forEach(function(item,index){
        item.isOn = false;
      });
      $this.departList = departList;
      $this.selectedData.dept_id = [];
      $this.oldContrastGroupID = "";
      $this.groupName = "";
      var contrastGroupList = $this.contrastGroupList;
      contrastGroupList.forEach(function(item,index){
        item.isOn = false;
      });
      $this.contrastGroupList = contrastGroupList;
      $this.selectedData.comparedept_id = [];
      $this.clearData();
    },
    // 添加对比部门点击事件
    toggleContrast(){
      this.isContrastShow = !this.isContrastShow;
    },
    contrastTypeChangeHandler(obj){
      var $this = this;
      if(!obj.disabled){
        var selectedContrastGroupID = [];
        var contrastTypeList = $this.contrastTypeList;
        contrastTypeList.forEach(function(item,index){
          if(item.id == obj.id){
            if(item.isOn){
              item.isOn = false;
            }else{
              item.isOn = true;
            }
          }
          if(item.isOn){
            selectedContrastGroupID.push(item.id);
          }
        });
        if(selectedContrastGroupID.length>0){
          $this.contrastGroupList.forEach(function(item,index){
            item.disabled=true;
            item.isOn=false;
          });
        }else{
          $this.contrastGroupList.forEach(function(item,index){
            item.disabled=false;
            item.isOn=false;
          });
        }
        $this.selectedData.comparetype_id = selectedContrastGroupID;
        $this.contrastTypeList = contrastTypeList;
        $this.selectedData.comparedept_id=[];
      }
    },
    // 对比部门点击事件
    contrastGroupChangeHandler(obj){
      var $this = this;
      if(!obj.disabled){
        var selectedContrastGroupID = [];
        var contrastGroupList = $this.contrastGroupList;
        contrastGroupList.forEach(function(item,index){
          if(item.id == obj.id){
            if(item.isOn){
              item.isOn = false;
            }else{
              item.isOn = true;
            }
          }
          if(item.isOn){
            selectedContrastGroupID.push(item.id);
          }
        });
        if(selectedContrastGroupID.length>0){
          $this.contrastTypeList.forEach(function(item,index){
            item.disabled=true;
            item.isOn=false;
          });
        }else{
          $this.contrastTypeList.forEach(function(item,index){
              item.disabled=false;
              item.isOn=false;
              if($this.selectedData.dept_id.length!=$this.departList.length){
                $this.selectedData.dept_id.forEach(function(items,indexs){
                    if(items==item.id){
                        item.disabled=true;
                        item.isOn=false;
                    }
                });
              }
          });
        }
        $this.selectedData.comparedept_id = selectedContrastGroupID;
        $this.contrastGroupList = contrastGroupList;
        $this.selectedData.comparetype_id=[];
      }
    },
    // 对比部门添加确定事件
    saveContrastGroup(){
      var $this = this;
      if($this.selectedData.comparedept_id&&$this.selectedData.comparedept_id.length>0){
          //月维度，部门对比屏蔽质量分析
          if($this.selectedData.isMonth){            
            var contrastList=$this.contrastList;
            var selectedContrastType = [];
            var selectedType = [];
            contrastList.forEach(function(item,index){
              item.isOn=true;
              item.disabled=false;
              if(item.value=='qualityAnalysis'||item.value=='consumptionAnalysis'){
                item.isOn=false;
                item.disabled=true;
              }
              if(item.isOn){
                selectedContrastType.push(item.id);
                selectedType.push(item.value);
              }
            });
            $this.selectedType = selectedType;
            $this.selectedData.type = selectedContrastType;
            $this.contrastList = contrastList;
          }
      }
      if($this.selectedData.comparetype_id&&$this.selectedData.comparetype_id.length>0){
          //月维度，部门对比屏蔽质量分析
          if($this.selectedData.isMonth){            
            var contrastList=$this.contrastList;
            var selectedContrastType = [];
            var selectedType = [];
            contrastList.forEach(function(item,index){
              item.isOn=true;
              item.disabled=false;
              if(item.value=='qualityAnalysis'){
                item.isOn=false;
                item.disabled=true;
              }
              if(item.isOn){
                selectedContrastType.push(item.id);
                selectedType.push(item.value);
              }
            });
            $this.selectedType = selectedType;
            $this.selectedData.type = selectedContrastType;
            $this.contrastList = contrastList;
          }
      }
      $this.isContrastShow = !$this.isContrastShow;
      if($this.oldContrastGroupID!=$this.selectedData.comparedept_id.join(",")||$this.oldContrastGroupID!=$this.selectedData.comparetype_id.join(",")){
        if($this.selectedData.comparedept_id.length>0){
            $this.oldContrastGroupID = $this.selectedData.comparedept_id.join(",");
        }
        if($this.selectedData.comparetype_id.length>0){
            $this.oldContrastGroupID = $this.selectedData.comparetype_id.join(",");
        }
        $this.initData();
      }
    },
    // 最近六个月时间周期
    getNearMonth(){
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 6);
      var startYear = start.getFullYear();
      var startMonth = start.getMonth() +1;
      var endYear = end.getFullYear();
      var endMonth = end.getMonth() + 1;
      startMonth = startMonth<10?'0'+startMonth:startMonth;
      endMonth = endMonth<10?'0'+endMonth:endMonth;
      var startDate = startYear+"/"+startMonth;
      var endDate = endYear+"/"+endMonth;
      return [startDate,endDate];
    },
    // 最近30天时间周期
    getNearDay(){
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      end.setTime(end.getTime() + 3600 * 1000 * 24 * 1);
      var startYear = start.getFullYear();
      var startMonth = start.getMonth() +1;
      var startDay = start.getDate();
      var endYear = end.getFullYear();
      var endMonth = end.getMonth() + 1;
      var endDay = end.getDate();
      startMonth = startMonth<10?'0'+startMonth:startMonth;
      startDay = startDay<10?'0'+startDay:startDay;
      endMonth = endMonth<10?'0'+endMonth:endMonth;
      endDay = endDay<10?'0'+endDay:endDay;
      var startDate = startYear+"/"+startMonth+"/"+startDay;
      var endDate = endYear+"/"+endMonth+"/"+endDay;
      return [startDate,endDate];
    },
    // 重置数据
    resetData(){
      var $this = this;
      $this.groupName = "电商一部搜索";
      $this.dateSelected = true;
      $this.isFilter = true,
      $this.tipsInfo="当前部门分析页面，展示为：本年度数据信息。";
      $this.tipsItem="";
      $this.isContrastShow=false;
      $this.selectedData.dateDefault = $this.getNearDay();
      $this.selectedData.dateContrast = [];
      $this.selectedData.dept_id = [1];
      $this.selectedData.comparedept_id = [];
      $this.selectedData.isMonth = false;
      $this.selectedData.isDateCompare = false;
      $this.selectedData.type = [1,4];
      $this.selectedType = ['enquiriesFew','regionEnquiries'];
      $this.oldContrastGroupID = "";
      $this.isDefaultPage = false;
      $this.judgeData = {};
      $this.defaultChartData = [];
      $this.mapChart = [];
      $this.dateDimension.forEach(function(item,index){
        item.isOn = false;
        if(index==0){
            item.isOn = true;
        }
      });
      $this.contrastList.forEach(function(item){
        item.isOn = false;
        item.disabled = true;
        if(item.value=="enquiriesFew"||item.value=="regionEnquiries"){
          item.isOn = true;
          item.disabled = false;
        }
      });
      $this.getContrastDepart();
    },
    // 判断当前展示情况
    judgeChartStatus(){
      var $this = this;
      var judgeData = {};
      judgeData.singleGroupStatic = false;          // 单基础部门统计
      judgeData.singleGroupDateCompare = false;     // 单基础部门时间对比
      judgeData.singleGroupTeamCompare = false;     // 单基础部门与其他部门对比
      judgeData.pluralGroupStatic = false;          // 多基础部门统计
      judgeData.pluralGroupDateCompare = false;     // 多基础部门的时间对比
      judgeData.pluralGroupTeamCompare = false;     // 多基础部门与其他部门对比
      judgeData.pluralGroupTeamSameCompare = false; // 多基础部门与其他部门对比，且有部门同时存在于基础部门与对比部门
      // 基础部门有被选中的
      if($this.selectedData.dept_id.length>0){
        // 基础部门有一个被选中
        if($this.selectedData.dept_id.length==1){
          // 且基础时间有值
          if($this.selectedData.dateDefault&&$this.selectedData.dateDefault.length>0){
            // 且对比时间有值，此时是单一部门的时间对比
            if($this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
              if($this.selectedData.type.length>0){
                judgeData.singleGroupDateCompare = true;
              }
            }else{
              // 基础部门选中1个，且基础时间有值，而对比时间无值
              // 且有对比部门被选中
              if($this.selectedData.comparedept_id.length>0||$this.selectedData.comparetype_id.length>0){
                if($this.selectedData.type.length>0){
                  judgeData.singleGroupTeamCompare = true;
                }
              }else{
                // 对比时间无值，对比部门也无值，此情况为单一部门统计
                if($this.selectedData.type.length>0){
                  judgeData.singleGroupStatic = true;
                }
              }
            }
          }
        }else{
          // 基础部门有多个被选中
          // 且基础时间有值
          if($this.selectedData.dateDefault&&$this.selectedData.dateDefault.length>0){
            // 且对比时间有值，此时是基础多部门的时间对比
            if($this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
              if($this.selectedData.type.length>0){
                judgeData.pluralGroupDateCompare = true;
              }
            }else{
              // 基础部门选中多个，且基础时间有值，而对比时间无值
              // 且有对比部门被选中
              if($this.selectedData.comparedept_id.length>0||$this.selectedData.comparetype_id.length>0){
                if($this.selectedData.type.length>0){
                  judgeData.pluralGroupTeamCompare = true;
                  // 判断基础部门与对比部门是否有同一个部门被选中
                  $this.selectedData.comparedept_id.forEach(function(item){
                    if($this.selectedData.dept_id.includes(item)){
                      if($this.selectedData.type.length>0){
                        judgeData.pluralGroupTeamSameCompare = true;
                      }
                    }
                  });
                }
              }else{
                // 对比时间无值，对比部门也无值，此情况为多基础部门统计
                if($this.selectedData.type.length>0){
                  judgeData.pluralGroupStatic = true;
                }
              }
            }
          }
        }
      }
      $this.judgeData = judgeData;
    },
    // 判断日期维度，跳转参数，添加补充说明信息
    dateInfoTips(){
      var $this = this;
      var itemArr = [];
      $this.contrastList.forEach(function(item){
        if(item.isOn){
          itemArr.push(item.label);
        }
      });
      $this.tipsItem = "（展示项："+itemArr.join("、")+"）";
    },
    // 滚动悬浮
    getScroll(){
      var $this = this;
      if(!$this.selectedData.isDateCompare && $this.selectedData.dept_id.length>0){
          var scrolltop = $this.$refs.boxPane.scrollTop;
          var boxheight = $this.$refs.filterbox.offsetHeight;
          if(scrolltop > parseInt(boxheight) + 20){
            $this.isFix = true;
          }else{
            $this.isFix = false;
          }
      }
    },
    changeSize(){
      var $this = this;
      $this.$nextTick(function () {    
        var boxHeight=0;
        boxHeight = document.body.clientHeight-$this.$refs.boxPane.scrollHeight-98;
        if(boxHeight>=0){
            $this.boxWidth = $this.$refs.boxPane.offsetWidth - 40;
        }else{
            $this.boxWidth = $this.$refs.boxPane.offsetWidth - 50;
        }
      });
    }
  }
}
</script>



