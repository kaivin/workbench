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
                    <div class="filter-title"><span class="txt-title">渠道：</span></div>
                    <div class="filter-content flex-content">
                        <div class="item-list depart">
                        <div class="item-checkbox" v-bind:class="item.isOn?'active':''" v-for="item in channelList" v-bind:key="item.id" v-on:click="groupChangeHandler(item.id)"><i></i><span>{{item.name}}</span></div>
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
                          @change="getSearchData"
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
                          @change="getSearchData"
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
                      <div class="item-checkbox" v-bind:class="[selectedData.comparesource_id.length>0||!dateSelected?'is-disabled':'',selectedData.isDateCompare?'active':'']" v-on:click="dateCompareChangeHandler"><i></i><span>日期对比</span></div>
                      <div class="item-date" v-if="selectedData.isDateCompare" style="margin-right: 20px;">
                        <el-date-picker
                          v-if="!selectedData.isMonth"
                          v-model="selectedData.dateContrast"
                          @change="getSearchData"
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
                          @change="getSearchData"
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
                      <div class="item-checkbox" v-for="item in contrastRatio" v-bind:class="[item.isOn?'active':'', item.disabled?'is-disabled':'']" v-bind:key="item.value" v-on:click="RatioItemChangeHandler(item)"><i></i><span>{{item.label}}</span></div>
                      <div class="item-reset" v-if="isFilter"><span v-on:click="resetData">全部重置</span></div>
                    </div>
                  </div>
                </div>
            </div>
            <div class="filter-tips"><p><i class="svg-i"><svg-icon icon-class="tips" class-name="disabled" /></i>{{tipsInfo}}</p></div>
        </div>
        <div class="contrast-panel flex-box" :class="isFix ? 'contrast-fixed' : ''" :style="'width:'+ boxWidth + 'px' " v-if="!selectedData.isDateCompare&&selectedData.source_id.length>0">
          <div class="title-font"><span class="txt-title">对比项：</span></div>
          <div class="contrast-content flex-content">
            <div class="item-list">
              <div class="item-contrast" v-if="selectedData.source_id.length>0"><span>{{groupName}}</span><i  v-on:click="deleteDefaultGroup" class="svg-i"><svg-icon icon-class="close" class-name="disabled" /></i></div>
              <template v-if="selectedData.comparesource_id.length>0">
                <div class="item-contrast" v-if="item.isOn" v-for="item in contrastSourceList" v-bind:key="item.id"><span>{{item.name}}</span><i v-on:click="deleteContrastGroup(item.id)" class="svg-i"><svg-icon icon-class="close" class-name="disabled" /></i></div>
              </template>
              <div class="item-button">
                <div class="button-click" v-on:click="toggleContrast"><i class="svg-i"><svg-icon icon-class="s-add" class-name="disabled" /></i><span>添加对比</span></div>
                <div class="group-contrast depart getChannel" v-show="isContrastShow">
                  <div class="item-checkbox" v-bind:class="[item.disabled?'is-disabled':'',item.isOn?'active':'']" v-for="item in contrastSourceList" v-bind:key="item.id" v-on:click="contrastGroupChangeHandler(item)"><i></i><span>{{item.name}}</span></div>
                  <div class="item-sure" v-on:click="saveContrastGroup">确定</div>
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
import {getOwnsource,getOwnChinasourcecount} from '@/api/ownpush';
import {mapGetters} from 'vuex';
import defaultChart from "../components/chinadepartcount/defaultChart.vue";
import qualityChart from "../components/chinadepartcount/qualityChart.vue";
import mapChart from "../components/chinadepartcount/mapChart.vue";
import {randomString,sortByDesc,groupColor,groupDateColor,singleArrColor,formatDate,numSeparate,sortByDate,memberArrColor,singleNewArrColor} from "@/utils/index"
import {MapInterval,TopTenColor} from "@/utils/MapColor"
import { chinaData } from "@/utils/chinaMap";
export default {
  name: 'OwnpushChannelAnalysis',
  components: {
    defaultChart,
    qualityChart,
    mapChart,
  },
  data() {
    return {
        breadcrumbList:[],  
        menuButtonPermit:[],                           //网页权限字段
        minWidth:"",
        boxWidth:0,
        mapRatio:0.75,
        channelList:[],              //渠道数据
        contrastSourceList:[],       //对比渠道数据
        selectedData:{               //搜索数据
          dateDefault:[],          //默认时间
          dateContrast:[],         //对比时间
          source_id:[],               //渠道类型
          type:[1,5],              //分析项数据
          is_compare:1,            //是否渠道对比
          comparesource_id:[],       //对比渠道选择
          is_timecopmare:1,        //是否时间对比
          isMonth:false,
          isDateCompare:false,
        },
        comparesourceNum:0,//选中对比数量
        dateDimension:[
          {label:"日",value:"day",isOn:true},
          {label:"月",value:"month",isOn:false},
        ],
        contrastList:[
          {label:'消费分析',id:3,value:"consumptionAnalysis",isOn:false,disabled:true},
          {label:"询盘个数",id:1,value:"enquiriesFew",isOn:true,disabled:false},
          {label:"成交积分",id:2,value:"clinchScore",isOn:false,disabled:true},
          {label:'百万个数',id:7,value:"millionCount",isOn:false,disabled:true},
          {label:'积分等级',id:8,value:"scoreLevel",isOn:false,disabled:true},
          {label:'质量分析',id:4,value:"qualityAnalysis",isOn:false,disabled:true},
          {label:'询盘地图',id:5,value:"enquiriesRegion",isOn:true,disabled:false},
          {label:'成交积分地图',id:6,value:"scoreRegion",isOn:false,disabled:true},
        ],
        contrastRatio:[
          {label:'询盘均价',id:3,value:"enquiriesAvg",isOn:false,disabled:true},
          {label:"积分均价",id:1,value:"scoreAvg",isOn:false,disabled:true},
          {label:"积分询盘比",id:2,value:"scoreRatioenquiries",isOn:false,disabled:true},
        ],
        costList:[],       //消费列表
        enquirieList:[],   //询盘列表
        scoreList:[],      //积分列表
        groupName:"",
        dateSelected:true,
        isFilter:false,
        isContrastShow:false,
        selectedType:['enquiriesFew','enquiriesRegion'],
        oldContrastSourceID:"",
        isDefaultPage:false,
        tipsInfo:"当前渠道分析页面，展示为：本年度数据信息。",
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
              start.setMonth(start.getMonth() - 5);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        judgeData:{},
        defaultChartData:[],
        qualityChartData:[],
        mapChart:[],
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
    $this.getBreadcrumbList();
    if($this.$route.query.startTime&&$this.$route.query.endTime){
      var startTime=$this.$route.query.startTime.replace('-','/');
      var endTime=$this.$route.query.endTime.replace('-','/');
      $this.selectedData.dateDefault=[startTime,endTime]
      $this.routeChange();
    }else{
      $this.selectedData.dateDefault = $this.getNearDay();
    }
    $this.getChannelList();
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
    }
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
    // 获取渠道列表
    getChannelList(){
      var $this = this;
      getOwnsource(null).then(res=>{
        var channelList = [];
        var contrastSourceList = [];
        var baseDepart;
        res.data.forEach(function(item,index){
          var itemData = {};
          itemData.id = item.id;
          itemData.name = item.name;
          itemData.disabled = false;
          itemData.isOn = false;
          if($this.$route.query.itemId){
            if($this.$route.query.itemId==item.id){
                itemData.isOn=true;
                baseDepart=item.id;
                $this.selectedData.source_id.push(item.id);
                $this.groupName = item.name;
            }
          }else{
             if(index==0){
                itemData.isOn=true;
                baseDepart=item.id;
                $this.selectedData.source_id.push(item.id);
                $this.groupName = item.name;
             }
          }
          channelList.push(itemData);
        });
        $this.channelList = JSON.parse(JSON.stringify(channelList));
        $this.contrastSourceList = JSON.parse(JSON.stringify(channelList));
        $this.contrastSourceList.forEach(function(item){
          item.disabled = false;
          item.isOn = false;
          if(item.id == baseDepart){
            item.disabled = true;
          }
        });
        $this.getSearchData();
      });
    },
    // 渠道点击事件
    groupChangeHandler(id){
      var $this = this;
      var channelList = $this.channelList;
      var sourceID = [];
      channelList.forEach(function(item,index){
        if(item.id == id){
          item.isOn = !item.isOn;
        }
        if(item.isOn){
          sourceID.push(item.id);
        }
      });
      $this.channelList = channelList;
      $this.selectedData.source_id = sourceID;
      // 日期维度未选择的情况下，渠道选中后，需要默认将日维度选中
      if(!$this.dateSelected){
        $this.dateDimension.forEach(function(item,index){
          if(index==0){
            item.isOn = true;
            $this.dateSelected = true;
          }
        });
      }
      // 渠道有被选中的，且默认时间是空的情况下，需要给默认时间一个默认时间范围
      if($this.selectedData.source_id.length>0&&(!$this.selectedData.dateDefault||$this.selectedData.dateDefault.length==0)){
        if($this.selectedData.isMonth){
          $this.selectedData.dateDefault = $this.getNearMonth();
        }else{
          $this.selectedData.dateDefault = $this.getNearDay();
        }
      }
      // 初始第一次渠道被选中（即此时只有一个渠道被选中），日维度需默认将询盘个数分析、询盘地区分析选中，月维度需将所有分析项选中
      if($this.selectedData.source_id.length==1&&$this.selectedData.type.length==0){
        var contrastList = $this.contrastList;
        var selectedContrastType = [];
        var selectedType = [];
        contrastList.forEach(function(item){
          if($this.selectedData.isMonth){
            item.isOn = true;
            item.disabled = false;
            selectedContrastType.push(item.id);
            selectedType.push(item.value);
          }else{
            if(item.value=="enquiriesFew"||item.value=="enquiriesRegion"){
              item.isOn = true;
              selectedContrastType.push(item.id);
              selectedType.push(item.value);
            }
          }
        });
        $this.selectedData.type = selectedContrastType;
        $this.contrastList = contrastList;
        var contrastRatio = $this.contrastRatio;
        contrastRatio.forEach(function(item,index){
          if($this.selectedData.isMonth){
            item.isOn = true;
            item.disabled = false;
          }else{
            item.isOn = false;
            item.disabled = true;
          }
          if(item.isOn){
            selectedType.push(item.value);
          }
        });
        $this.contrastRatio = contrastRatio;
        $this.selectedType = selectedType;
      }
      // 渠道有被选中的，且只有一个渠道被选中的情况下，对比渠道中，当前被选中渠道需被禁用不可选（不能自己和自己在渠道维度比）,渠道选中超过1个或没有被选中的，则对比渠道不需要有禁用状态
      if($this.selectedData.source_id.length==1){
        var contrastSourceList = $this.contrastSourceList;
        contrastSourceList.forEach(function(item){
          if(item.id == $this.selectedData.source_id[0]){
            item.disabled = true;
          }
        });
        $this.contrastSourceList = contrastSourceList;
      }else{
        var contrastSourceList = $this.contrastSourceList;
        contrastSourceList.forEach(function(item){
          item.disabled = false;
        });
        $this.contrastSourceList = contrastSourceList;
      }
      $this.getSourceName();
      $this.getSearchData();
    },
    //组装渠道选中名字
    getSourceName(){
      var $this = this;
      var channelList = $this.channelList;
      var groupName = "";
      var fontArr = [];
      channelList.forEach(function(item,index){
        if(item.isOn){
          fontArr.push(item.name);
        }
      })
      groupName = fontArr.join("、");
      $this.groupName = groupName;
    },
    // 路由传递有值时间默认是月维度
    routeChange(){
        var $this = this;
        $this.selectedData.isMonth = true;
        var dateDimension = $this.dateDimension;
        dateDimension.forEach(function(item){
          item.isOn = false;
          if($this.selectedData.isMonth&&item.value=="month"){
              item.isOn = true;
          }
        });
        $this.dateDimension = dateDimension;
        // 切换日期维度，分析项只在月时可选的，切换到日维度时，需禁用，且清除选中状态；切换到月维度时，则需解除禁用并全部选中
        var contrastList = $this.contrastList;
        var selectedContrastType = [];
        var selectedType = [];
        contrastList.forEach(function(item,index){
          if($this.selectedData.isMonth){
            item.isOn = true;
            item.disabled = false;
            if($this.selectedData.comparesource_id.length>0||$this.selectedData.comparesource_id.length>0||$this.selectedData.isDateCompare){
              if(item.value=='qualityAnalysis'){
                item.isOn = false;
                item.disabled = true;
              }
            }
          }
          if(item.isOn){
            selectedContrastType.push(item.id);
            selectedType.push(item.value);
          }
        });
        $this.selectedData.type = selectedContrastType;
        $this.contrastList = contrastList;
        var contrastRatio = $this.contrastRatio;
        contrastRatio.forEach(function(item,index){
          if($this.selectedData.isMonth){
            item.isOn = true;
            item.disabled = false;
          }
          if(item.isOn){
            selectedType.push(item.value);
          }
        });
        $this.contrastRatio = contrastRatio;
        $this.selectedType = selectedType;
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
            if($this.selectedData.comparesource_id.length>0||$this.selectedData.comparesource_id.length>0||$this.selectedData.isDateCompare){
              if(item.value=='qualityAnalysis'){
                item.isOn = false;
                item.disabled = true;
              }
            }
          }else{
            item.isOn = false;
            item.disabled = true;
            if(item.value=="enquiriesFew"||item.value=="enquiriesRegion"){
              item.isOn = true;
              item.disabled = false;
            }
          }
          if(item.isOn){
            selectedContrastType.push(item.id);
            selectedType.push(item.value);
          }
        });
        $this.selectedData.type = selectedContrastType;
        $this.contrastList = contrastList;
        var contrastRatio = $this.contrastRatio;
        contrastRatio.forEach(function(item,index){
          if($this.selectedData.isMonth){
            item.isOn = true;
            item.disabled = false;
          }else{
            item.isOn = false;
            item.disabled = true;
          }
          if(item.isOn){
            selectedType.push(item.value);
          }
        });
        $this.contrastRatio = contrastRatio;
        $this.selectedType = selectedType;
        $this.getSearchData();
      }
    },
    // 日期对比点击事件
    dateCompareChangeHandler(){
      var $this = this;
      // 只有在对比渠道没有被选中的，此时日期对比才是非禁用状态，可点击的
      if($this.selectedData.comparesource_id.length==0&&$this.dateSelected){
        if($this.selectedData.isDateCompare){
          $this.selectedData.isDateCompare = false;
          if($this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
            $this.selectedData.dateContrast = [];
          }
        }else{
          $this.selectedData.isDateCompare = true;
        }
      }
      //月维度，日期对比屏蔽质量分析
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
        $this.selectedData.type = selectedContrastType;
        $this.contrastList = contrastList;
        var contrastRatio = $this.contrastRatio;
        contrastRatio.forEach(function(item,index){
          if($this.selectedData.isMonth){
            item.isOn = true;
            item.disabled = false;
          }else{
            item.isOn = false;
            item.disabled = true;
          }
          if(item.isOn){
            selectedType.push(item.value);
          }
        });
        $this.contrastRatio = contrastRatio;
        $this.selectedType = selectedType;
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
        $this.selectedData.type = selectedContrastType;
        $this.contrastList = contrastList;
        var contrastRatio = $this.contrastRatio;
        contrastRatio.forEach(function(item,index){
            contrastList.forEach(function(items,indexs){
              if($this.selectedData.isMonth){
                if(items.value=='enquiriesFew'&&items.isOn==false&&(item.value=="enquiriesAvg"||item.value=="scoreRatioenquiries")){
                  item.isOn = false;
                }
                if(items.value=='clinchScore'&&items.isOn==false&&(item.value=="scoreAvg"||item.value=="scoreRatioenquiries")){
                  item.isOn = false;
                }
                if(items.value=='consumptionAnalysis'&&items.isOn==false&&(item.value=="enquiriesAvg"||item.value=="scoreAvg")){
                  item.isOn = false;
                }
              }
            });
            if(item.isOn){
              selectedType.push(item.value);
            }
        });
        $this.contrastRatio = contrastRatio;
        $this.selectedType = selectedType;
        $this.getSearchData();
      }
    },
    RatioItemChangeHandler(obj){
      var $this = this;
      if(!obj.disabled){
        var contrastList = $this.contrastList;
        var contrastRatio = $this.contrastRatio;
        var selectedType = [];
        contrastRatio.forEach(function(item,index){
          if(item.value == obj.value){
            item.isOn = !item.isOn;
          }
          contrastList.forEach(function(items,indexs){
            if(item.value=='enquiriesAvg'&&item.isOn==true&&(items.value=="consumptionAnalysis"||items.value=="enquiriesFew")){
              items.isOn = true;
            }
            if(item.value=='scoreAvg'&&item.isOn==true&&(items.value=="consumptionAnalysis"||items.value=="clinchScore")){
              items.isOn = true;
            }
            if(item.value=='scoreRatioenquiries'&&item.isOn==true&&(items.value=="enquiriesFew"||items.value=="clinchScore")){
              items.isOn = true;
            }
          });
          if(item.isOn){
            selectedType.push(item.value);
          }
        });
        var selectedContrastType = [];
        contrastList.forEach(function(item,index){
          if(item.isOn){
            selectedContrastType.push(item.id);
            selectedType.push(item.value);
          }
        });
        $this.selectedData.type = selectedContrastType;
        $this.contrastList = contrastList;
        $this.selectedType = selectedType;
        $this.getSearchData();
      }
    },
    // 添加对比渠道点击事件
    toggleContrast(){
      this.isContrastShow = !this.isContrastShow;
    },
    // 对比渠道点击事件
    contrastGroupChangeHandler(obj){
      var $this = this;
      if(!obj.disabled){
        if($this.comparesourceNum<3){
            var selectedContrastGroupID = [];
            var contrastSourceList = $this.contrastSourceList;
            var comparesourceNum=0;
            contrastSourceList.forEach(function(item,index){
              if(item.id == obj.id){
                if(item.isOn){
                  item.isOn = false;
                }else{
                  item.isOn = true;
                }
              }
              if(item.isOn){
                comparesourceNum++;
                selectedContrastGroupID.push(item.id);
              }
            });
            $this.comparesourceNum=comparesourceNum;
            $this.selectedData.comparesource_id = selectedContrastGroupID;
            $this.contrastSourceList = contrastSourceList;
        }
      }
    },
    // 对比渠道添加确定事件
    saveContrastGroup(){
      var $this = this;
      if($this.selectedData.comparesource_id&&$this.selectedData.comparesource_id.length>0){
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
            $this.selectedData.type = selectedContrastType;
            $this.contrastList = contrastList;
            var contrastRatio = $this.contrastRatio;
            contrastRatio.forEach(function(item,index){
              item.isOn = true;
              item.disabled = false;
              if(item.isOn){
                selectedType.push(item.value);
              }
            });
            $this.contrastRatio = contrastRatio;
            $this.selectedType = selectedType;
          }
      };
      $this.isContrastShow = !$this.isContrastShow;
      if($this.oldContrastSourceID!=$this.selectedData.comparesource_id.join(",")){
         if($this.selectedData.comparesource_id.length>0){
              $this.oldContrastSourceID = $this.selectedData.comparesource_id.join(",");
         }
        $this.getSearchData();
      }
    },
    // 基础渠道删除点击事件
    deleteDefaultGroup(){
      var $this = this;
      // 基础渠道被删除，则对比渠道选中状态全部清空，基础渠道选中状态全部清空，页面数据清空
      var channelList = $this.channelList;
      channelList.forEach(function(item,index){
        item.isOn = false;
      });
      $this.channelList = channelList;
      $this.selectedData.source_id = [];
      $this.oldContrastSourceID = "";
      $this.groupName = "";
      var contrastSourceList = $this.contrastSourceList;
      contrastSourceList.forEach(function(item,index){
        item.isOn = false;
      });
      $this.contrastSourceList = contrastSourceList;
      $this.selectedData.comparesource_id = [];
      $this.clearData();
    },
    // 组装请求所需数据
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
      if($this.selectedData.source_id.length>0){
        searchData.source_id = $this.selectedData.source_id;
      }
      if($this.selectedData.type.length>0){
        searchData.type = $this.selectedData.type;
      }
      if($this.selectedData.comparesource_id.length>0){
        searchData.comparesource_id = $this.selectedData.comparesource_id
      }
      searchData.is_compare = $this.selectedData.comparesource_id.length>0?2:1;
      searchData.is_timecopmare = $this.selectedData.isDateCompare&&$this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0?2:1;
      if($this.selectedData.source_id.length==0){
        $this.tipsInfo = "请选择数据分析的渠道";
      }else{
        if(!$this.selectedData.dateDefault||$this.selectedData.dateDefault.length==0){
          $this.tipsInfo = "请选择数据分析的日期范围";
        }else{
          if($this.selectedData.type.length==0){
            $this.tipsInfo = "请选择数据分析的分析项";
          }else{
            $this.dateInfoTips();
            if(searchData.is_timecopmare==2&&searchData.starttime&&searchData.endtime){
              $this.tipsInfo = "当前渠道分析页面，展示为："+$this.selectedData.dateDefault[0]+" ~ " + $this.selectedData.dateDefault[1]+" 与 "+$this.selectedData.dateContrast[0]+" ~ "+$this.selectedData.dateContrast[1]+" 的日期对比数据信息。"+$this.tipsItem;
            }
            if(searchData.is_timecopmare==1&&searchData.starttime&&searchData.endtime){
              $this.tipsInfo = "当前渠道分析页面，展示为："+$this.selectedData.dateDefault[0]+" ~ " + $this.selectedData.dateDefault[1]+" 的数据信息。"+$this.tipsItem;
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
      $this.defaultChartData = [];
      $this.mapChart = [];
    },
    getSearchData(){
      var $this = this;
      $this.isFilter = true;
      $this.judgeChartStatus();
      var searchData = $this.searchDataInit();
      $this.clearData();
      if(searchData.source_id&&searchData.starttime&&searchData.endtime&&searchData.type){
        getOwnChinasourcecount(searchData).then(res=>{
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
      var Integrallevel = $this.dateIntegrallevel(res);
      if(Integrallevel){
        mapChartData[0].push(Integrallevel);
      }    
      $this.mapChart = mapChartData;
      var qualityChartData = $this.qualityChartDataClump(res);
      $this.qualityChartData = qualityChartData;
      $this.changeSize();
    },
    // 组装默认类型图表数据
    defaultChartDataClump(res){
      var $this = this;
      // 询盘个数
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
          $this.enquirieList=inquiryData.mainData;
          inquiryData.dateCompareData = backData.dateCompareData;
          inquiryData.colorArr = backData.colorArr;
          if($this.selectedData.source_id.length==1){
            $this.channelList.forEach(function(item){
              if(item.id == $this.selectedData.source_id[0]){
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
              inquiryData.chartTitle = "渠道组合询盘日期对比月趋势";
            }else{
              inquiryData.chartTitle = "渠道组合询盘日期对比日趋势";
            }
            inquiryData.name = "渠道组合询盘统计";
          }
        }else{
          // 渠道对比
          if($this.selectedData.comparesource_id.length>0){
            if($this.selectedData.isMonth){
              inquiryData.chartTitle = "各渠道询盘月趋势对比";
            }else{
              inquiryData.chartTitle = "各渠道询盘日趋势对比";
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
                  if($this.selectedData.source_id.length==1){
                    $this.channelList.forEach(function(item1){
                      if(item1.isOn){
                        itemChart.name = item1.name;
                      }
                    });
                  }else{
                    itemChart.name="已多选渠道"
                  }
                }else{
                  var selectContrastSourceList = [];
                  $this.contrastSourceList.forEach(function(item1){
                    if(item1.isOn){
                      selectContrastSourceList.push(item1);
                    }
                  });
                  itemChart.name=selectContrastSourceList[index-1].name;
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
              $this.enquirieList=inquiryData.mainData;
            });
            inquiryData.name = "渠道询盘统计";
            var compareData = [];
            if($this.selectedData.isMonth){
              var monthxunallnumbercompare=0;
              if(res.monthxuntrendcompare&&res.monthxuntrendcompare.length){
                res.monthxuntrendcompare.forEach(function(item,index){                  
                  if(index==0){
                      if(item&&item.length>0){
                        item.forEach(function(items,indexs){
                          monthxunallnumbercompare+=items.xunnumber;
                        });
                      }
                  }
                  if(index>0){
                      if(item&&item.length>0){
                        item.forEach(function(items,indexs){
                          if(res.monthxuntrendcompare[0][0].depart.indexOf(items.depart)==-1){
                            monthxunallnumbercompare+=items.xunnumber;
                          }
                        });
                      }
                  }
                });
              }
              inquiryData.nowNumber = numSeparate(monthxunallnumbercompare);
              compareData = res.monthdepartpercentercompare;
              inquiryData.lastNumber = res.lastmonthxunallnumbercompare;
              inquiryData.nowLastNumber = numSeparate(Math.abs(monthxunallnumbercompare - res.lastmonthxunallnumbercompare).toFixed(2)*1);
              inquiryData.status = monthxunallnumbercompare - res.lastmonthxunallnumbercompare>0?'up':monthxunallnumbercompare - res.lastmonthxunallnumbercompare<0?'down':'flat';
              inquiryData.avgNumber = numSeparate(parseInt(monthxunallnumbercompare/res.monthxuntrendcompare[0].length));
              if(res.historymaxnumbermonthcompare&&res.historymaxnumbermonthcompare.length>0){
                inquiryData.historyMaxNumber = numSeparate(res.historymaxnumbermonthcompare[0].number);
                inquiryData.historyMaxNumberDate = res.historymaxnumbermonthcompare[0].yeartime;
              }
              inquiryData.avgTitle = "月平均询盘个数";
              inquiryData.historyTitle = "月历史峰值";
            }else{
              var dayxuntrendcompare=0;
              if(res.dayxuntrendcompare&&res.dayxuntrendcompare.length){
                res.dayxuntrendcompare.forEach(function(item,index){
                  if(index==0){
                      if(item&&item.length>0){
                        item.forEach(function(items,indexs){
                          dayxuntrendcompare+=items.xunnumber;
                        });
                      }
                  }
                  if(index>0){
                      if(item&&item.length>0){
                        item.forEach(function(items,indexs){
                          if(res.dayxuntrendcompare[0][0].depart.indexOf(items.depart)==-1){
                            dayxuntrendcompare+=items.xunnumber;
                          }
                        });
                      }
                  }
                });
              }
              inquiryData.nowNumber = numSeparate(dayxuntrendcompare);
              compareData = res.departpercentercompare;
              inquiryData.lastNumber = res.lastxunallnumbercompare;
              inquiryData.nowLastNumber = numSeparate(Math.abs(dayxuntrendcompare - res.lastxunallnumbercompare).toFixed(2)*1);
              inquiryData.status = dayxuntrendcompare - res.lastxunallnumbercompare>0?'up':dayxuntrendcompare - res.lastxunallnumbercompare<0?'down':'flat';
              inquiryData.avgNumber = numSeparate(parseInt(dayxuntrendcompare/res.dayxuntrendcompare[0].length));
              if(res.historymaxnumberdaycompare&&res.historymaxnumberdaycompare.length>0){
                inquiryData.historyMaxNumber = numSeparate(res.historymaxnumberdaycompare[0].number);
                inquiryData.historyMaxNumberDate = res.historymaxnumberdaycompare[0].xundate;
              }
              inquiryData.avgTitle = "日平均询盘个数";
              inquiryData.historyTitle = "日历史峰值";
            }
            inquiryData.totalChart = [];
            compareData.forEach(function(item,index){
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
              if(res.historymaxnumbermonth&&res.historymaxnumbermonth.length>0){
                inquiryData.historyMaxNumber = numSeparate(res.historymaxnumbermonth[0].number);
                inquiryData.historyMaxNumberDate = res.historymaxnumbermonth[0].yeartime;
              }
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
              if(res.historymaxnumberday&&res.historymaxnumberday.length>0){
                inquiryData.historyMaxNumber = numSeparate(res.historymaxnumberday[0].number);
                inquiryData.historyMaxNumberDate = res.historymaxnumberday[0].xundate;
              }
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
              if($this.selectedData.source_id.length==1){
                $this.channelList.forEach(function(item1){
                  if(item1.id == $this.selectedData.source_id[0]){
                    item.name = item1.name;
                  }
                });
              }else{
                item.name = "已多选渠道"
              }
              item.value = item.xunnumber;
              newItemArr.push(item);
            });
            inquiryData.mainData.push(newItemArr);
            $this.enquirieList=inquiryData.mainData;
            // 只有一个渠道被选中的情况
            if($this.selectedData.source_id.length==1){
              $this.channelList.forEach(function(item){
                  inquiryData.name = "询盘统计";
                  if($this.selectedData.isMonth){
                    inquiryData.chartTitle = "询盘月趋势";
                  }else{
                    inquiryData.chartTitle = "询盘日趋势";
                  }
              });
            }else{// 多渠道被选中              
              inquiryData.totalChart = [];
              var compareData = [];
              inquiryData.name = "渠道组合询盘统计";
              if($this.selectedData.isMonth){
                compareData = res.monthdepartpercenter;
                inquiryData.chartTitle = "渠道组合询盘月趋势";
              }else{
                compareData = res.departpercenter;
                inquiryData.chartTitle = "渠道组合询盘日趋势";
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
      // 成交积分
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
          $this.scoreList=dealScoreData.mainData;
          dealScoreData.dateCompareData = backData.dateCompareData;
          dealScoreData.colorArr = backData.colorArr;
          if($this.selectedData.source_id.length==1){
            $this.channelList.forEach(function(item){
              if(item.id == $this.selectedData.source_id[0]){
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
              dealScoreData.chartTitle = "渠道组合成交积分日期对比月趋势";
            }else{
              dealScoreData.chartTitle = "渠道组合成交积分日期对比日趋势";
            }
            dealScoreData.name = "渠道组合成交积分统计";
          }
        }else{
          // 渠道对比
          if($this.selectedData.comparesource_id.length>0){
            if($this.selectedData.isMonth){
              dealScoreData.chartTitle = "各渠道成交积分月趋势对比";
            }else{
              dealScoreData.chartTitle = "各渠道成交积分日趋势对比";
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
                  if($this.selectedData.source_id.length==1){
                    $this.channelList.forEach(function(item1){
                      if(item1.isOn){
                        itemChart.name = item1.name;
                      }
                    });
                  }else{
                    itemChart.name="已多选渠道"
                  }
                }else{
                  var selectContrastSourceList = [];
                  $this.contrastSourceList.forEach(function(item1){
                    if(item1.isOn){
                      selectContrastSourceList.push(item1);
                    }
                  });
                  itemChart.name=selectContrastSourceList[index-1].name;
                }
                itemChart.key = item1.date;
                itemChart.value = Math.floor(item1.score*100)/100;
                itemChart.color = item[0].color;
                newItemArr.push(itemChart);
              });
              dealScoreData.mainData.push(newItemArr);
              $this.scoreList=dealScoreData.mainData;
            });
            dealScoreData.name = "渠道成交积分统计";
            var monthscoreallnumbercompare=0;
            if(res.monthscoretrendcompare&&res.monthscoretrendcompare.length){
              res.monthscoretrendcompare.forEach(function(item,index){
                  if(index==0){
                    if(item&&item.length>0){
                      item.forEach(function(items,indexs){
                        monthscoreallnumbercompare+=items.score;
                      });
                    }
                  }
                  if(index>0){
                      if(item&&item.length>0){
                        item.forEach(function(items,indexs){
                          if(res.monthscoretrendcompare[0][0].depart.indexOf(items.depart)==-1){
                            monthscoreallnumbercompare+=items.score;
                          }
                        });
                      }
                  }
              });
            }
            dealScoreData.nowNumber = numSeparate(Math.floor(monthscoreallnumbercompare*100)/100);
            dealScoreData.lastNumber = Math.floor(res.lastmonthscoreallnumbercompare*100)/100;
            dealScoreData.nowLastNumber = numSeparate(Math.abs(Math.floor(monthscoreallnumbercompare*100)/100 - Math.floor(res.lastmonthscoreallnumbercompare*100)/100).toFixed(2)*1);
            dealScoreData.status = Math.floor(monthscoreallnumbercompare*100)/100 - Math.floor(res.lastmonthscoreallnumbercompare*100)/100>0?'up':Math.floor(monthscoreallnumbercompare*100)/100 - Math.floor(res.lastmonthscoreallnumbercompare*100)/100<0?'down':'flat';
            dealScoreData.avgNumber = numSeparate((Math.floor(monthscoreallnumbercompare/res.monthscoretrendcompare[0].length*100)/100).toFixed(2)*1);
            if(res.historymaxscoremonthcompare&&res.historymaxscoremonthcompare.length>0){
              dealScoreData.historyMaxNumber = numSeparate(Math.floor(res.historymaxscoremonthcompare[0].score*100)/100);
              dealScoreData.historyMaxNumberDate = res.historymaxscoremonthcompare[0].yeartime;
            }
            dealScoreData.avgTitle = "月平均成交积分";
            dealScoreData.historyTitle = "月历史峰值";
            dealScoreData.totalChart = [];
            if(res.monthdepartscorepercentercompare&&res.monthdepartscorepercentercompare.length>0){
                res.monthdepartscorepercentercompare.forEach(function(item){
                  var itemChart = {};
                  itemChart.name = item.departname;
                  itemChart.value = Math.floor(item.score*100)/100;
                  dealScoreData.totalChart.push(itemChart);
                });
                dealScoreData.totalChart = singleArrColor(dealScoreData.totalChart);
                dealScoreData.totalChart.sort(sortByDesc("value"));
            };
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
              if($this.selectedData.source_id.length==1){
                $this.channelList.forEach(function(item1){
                  if(item1.id == $this.selectedData.source_id[0]){
                    item.name = item1.name;
                  }
                });
              }else{
                item.name = "已多选渠道"
              }
              newItemArr.push(item);
            });
            dealScoreData.mainData.push(newItemArr);
            $this.scoreList=dealScoreData.mainData;
            dealScoreData.lastNumber = Math.floor(res.lastmonthscoreallnumber*100)/100;
            dealScoreData.nowLastNumber = numSeparate(Math.abs(Math.floor(monthscoreallnumber*100)/100 - Math.floor(res.lastmonthscoreallnumber*100)/100).toFixed(2)*1);
            dealScoreData.status = Math.floor(monthscoreallnumber*100)/100 - Math.floor(res.lastmonthscoreallnumber*100)/100>0?'up':Math.floor(monthscoreallnumber*100)/100 - Math.floor(res.lastmonthscoreallnumber*100)/100<0?'down':'flat';
            dealScoreData.avgNumber = numSeparate((Math.floor(monthscoreallnumber/res.monthscoretrend.length*100)/100).toFixed(2)*1);
            if(res.historymaxscoremonth&&res.historymaxscoremonth.length>0){
                dealScoreData.historyMaxNumber = numSeparate(Math.floor((res.historymaxscoremonth.length>0?res.historymaxscoremonth[0].score:0)*100)/100);
                dealScoreData.historyMaxNumberDate = res.historymaxscoremonth.length>0?res.historymaxscoremonth[0].yeartime:0;
            }
            dealScoreData.avgTitle = "月平均成交积分";
            dealScoreData.historyTitle = "月历史峰值";
            // 只有一个渠道被选中的情况
            if($this.selectedData.source_id.length==1){
              $this.channelList.forEach(function(item){
                  if($this.selectedData.isMonth){
                    dealScoreData.chartTitle = "成交积分月趋势";
                  }else{
                    dealScoreData.chartTitle = "成交积分日趋势";
                  }
                  dealScoreData.name = "成交积分统计";
              });
            }else{// 多渠道被选中
              if($this.selectedData.isMonth){
                dealScoreData.chartTitle = "渠道组合成交积分月趋势";
              }else{
                dealScoreData.chartTitle = "渠道组合成交积分日趋势";
              }
              dealScoreData.name = "渠道组合成交积分统计"; 
              dealScoreData.totalChart = [];
              if(res.monthdepartscorepercenter&&res.monthdepartscorepercenter.length>0){
                  res.monthdepartscorepercenter.forEach(function(item){
                    var itemChart = {};
                    itemChart.name = item.departname;
                    itemChart.value =  Math.floor(item.score*100)/100;
                    dealScoreData.totalChart.push(itemChart);
                  });
                  dealScoreData.totalChart = singleArrColor(dealScoreData.totalChart);
                  dealScoreData.totalChart.sort(sortByDesc("value"));
              };
            }
          }
        }
        dealScoreData.totalTitle = "总成交积分";
        dealScoreData.unit = "（单位：分）";
        dealScoreData.randomStr = randomString(4);
      }
      // 消费分析
      var costCountData = null;
      if($this.selectedType.includes("consumptionAnalysis")){
        costCountData = {};
        costCountData.chartType = "area";
        // 时间对比
        if($this.selectedData.isDateCompare&&$this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
          var selfmonthmoneycompare=0;
          if(res.selfmonthmoneycompare&&res.selfmonthmoneycompare.length){
            res.selfmonthmoneycompare.forEach(function(item,index){
              if(item&&item.length>0){
                item.forEach(function(items,indexs){
                  selfmonthmoneycompare+=items.score;
                });
              }
            });
          }
          costCountData.nowNumber = numSeparate(Math.floor(selfmonthmoneycompare*10)/10);
          var backData = $this.dateCompare(res.selfmonthmoneycompare,'money');
          costCountData.mainData = backData.mainData;
          $this.costList=costCountData.mainData;
          costCountData.dateCompareData = backData.dateCompareData;
          costCountData.colorArr = backData.colorArr;
          if($this.selectedData.source_id.length==1){
            $this.channelList.forEach(function(item){
              if(item.id == $this.selectedData.source_id[0]){
                if($this.selectedData.isMonth){
                  costCountData.chartTitle = item.name+"消费日期对比月趋势";
                }else{
                  costCountData.chartTitle = item.name+"消费日期对比日趋势";
                }
                costCountData.name = item.name+"消费统计";
              }
            });
          }else{
            if($this.selectedData.isMonth){
              costCountData.chartTitle = "渠道组合消费日期对比月趋势";
            }else{
              costCountData.chartTitle = "渠道组合消费日期对比日趋势";
            }
            
            costCountData.name = "渠道组合消费统计";
          }
        }else{
          // 渠道对比
          if($this.selectedData.comparesource_id.length>0){
            if($this.selectedData.isMonth){
              costCountData.chartTitle = "各渠道消费月趋势对比";
            }else{
              costCountData.chartTitle = "各渠道消费日趋势对比";
            }
            costCountData.mainData = [];
            costCountData.colorArr = [];
            var chartData = groupColor(res.monthmoneytrendcompare);
            chartData.forEach(function(item,index){
              var newItemArr=[];
              costCountData.colorArr.push(item[0].color);
              item.forEach(function(item1){
                var itemChart = {};
                if(index == 0){
                  if($this.selectedData.source_id.length==1){
                    $this.channelList.forEach(function(item1){
                      if(item1.isOn){
                        itemChart.name = item1.name;
                      }
                    });
                  }else{
                    itemChart.name="已多选渠道"
                  }
                }else{
                  var selectContrastSourceList = [];
                  $this.contrastSourceList.forEach(function(item1){
                    if(item1.isOn){
                      selectContrastSourceList.push(item1);
                    }
                  });
                  itemChart.name=selectContrastSourceList[index-1].name;
                }
                itemChart.key = item1.date;
                itemChart.value = Math.floor(item1.money*10)/10;
                itemChart.color = item[0].color;
                newItemArr.push(itemChart);
              });
              costCountData.mainData.push(newItemArr);
              $this.costList=costCountData.mainData;
            });
            costCountData.name = "渠道消费统计";
            var monthmoneytrendcompare=0;
            if(res.monthmoneytrendcompare&&res.monthmoneytrendcompare.length){
              res.monthmoneytrendcompare.forEach(function(item,index){
                  if(index==0){
                    if(item&&item.length>0){
                      item.forEach(function(items,indexs){
                        monthmoneytrendcompare+=items.money;
                      });
                    }
                  }
                  if(index>0){
                      if(item&&item.length>0){
                        item.forEach(function(items,indexs){
                          if(res.monthmoneytrendcompare[0][0].depart.indexOf(items.depart)==-1){
                            monthmoneytrendcompare+=items.money;
                          }
                        });
                      }
                  }
              });
            }
            costCountData.nowNumber = numSeparate(Math.floor(monthmoneytrendcompare*100)/100);
            costCountData.lastNumber = Math.floor(res.lastmonthmoneyallnumbercompare*100)/100;
            costCountData.nowLastNumber = numSeparate(Math.abs(Math.floor(monthmoneytrendcompare*10)/10 - Math.floor(res.lastmonthmoneyallnumbercompare*10)/10).toFixed(2)*1);
            costCountData.status = Math.floor(monthmoneytrendcompare*10)/10 - Math.floor(res.lastmonthmoneyallnumbercompare*10)/10>0?'up':Math.floor(monthmoneytrendcompare*10)/10 - Math.floor(res.lastmonthmoneyallnumbercompare*10)/10<0?'down':'flat';
            costCountData.avgNumber = numSeparate((Math.floor(monthmoneytrendcompare/res.monthmoneytrendcompare[0].length*10)/10).toFixed(2)*1);
            if(res.historymaxmoneymonthcompare&&res.historymaxmoneymonthcompare.length>0){
                costCountData.historyMaxNumber = numSeparate(Math.floor(res.historymaxmoneymonthcompare[0].allmoney*10)/10);
                costCountData.historyMaxNumberDate = res.historymaxmoneymonthcompare[0].yeartime;
            }
            costCountData.avgTitle = "月平均消费";
            costCountData.historyTitle = "月历史峰值";
            costCountData.totalChart = [];
            if(res.monthdepartmoneypercentercompare&&res.monthdepartmoneypercentercompare.length>0){
                res.monthdepartmoneypercentercompare.forEach(function(item){
                  var itemChart = {};
                  itemChart.name = item.departname;
                  itemChart.value = Math.floor(item.money*10)/10;
                  costCountData.totalChart.push(itemChart);
                });
                costCountData.totalChart = singleArrColor(costCountData.totalChart);
                costCountData.totalChart.sort(sortByDesc("value"));
            };
          }else{
            // 统计
            costCountData.mainData = [];
            costCountData.colorArr = [];
            var monthmoneyallnumber=0;
            if(res.monthmoneytrend&&res.monthmoneytrend.length){
              res.monthmoneytrend.forEach(function(item,index){
                    monthmoneyallnumber+=item.money;
              });
            }
            costCountData.nowNumber = numSeparate(Math.floor(monthmoneyallnumber*10)/10);
            var tongData = groupColor([res.monthmoneytrend]);
            costCountData.colorArr.push(tongData[0][0].color); 
            var newItemArr=[];
            tongData[0].forEach(function(item,index){
              item.key = item.date;
              item.value = Math.floor(item.money*10)/10;
              if($this.selectedData.source_id.length==1){
                $this.channelList.forEach(function(item1){
                  if(item1.id == $this.selectedData.source_id[0]){
                    item.name = item1.name;
                  }
                });
              }else{
                item.name = "已多选渠道"
              }
              newItemArr.push(item);
            });
            costCountData.mainData.push(newItemArr);
            $this.costList=costCountData.mainData;
            costCountData.lastNumber = Math.floor(res.lastmonthmoneyallnumber*10)/10;
            costCountData.nowLastNumber = numSeparate(Math.abs(Math.floor(monthmoneyallnumber*10)/10 - Math.floor(res.lastmonthmoneyallnumber*10)/10).toFixed(2)*1);
            costCountData.status = Math.floor(monthmoneyallnumber*10)/10 - Math.floor(res.lastmonthmoneyallnumber*10)/10>0?'up':Math.floor(monthmoneyallnumber*10)/10 - Math.floor(res.lastmonthmoneyallnumber*10)/10<0?'down':'flat';
            costCountData.avgNumber = numSeparate((Math.floor(monthmoneyallnumber/res.monthmoneytrend.length*100)/100).toFixed(2)*1);
            if(res.historymaxmoneymonth&&res.historymaxmoneymonth.length>0){
                costCountData.historyMaxNumber = numSeparate(Math.floor(res.historymaxmoneymonth[0].allmoney*10)/10);
                costCountData.historyMaxNumberDate = res.historymaxmoneymonth[0].yeartime;
            }
            costCountData.avgTitle = "月平均消费";
            costCountData.historyTitle = "月历史峰值";
            // 只有一个渠道被选中的情况
            if($this.selectedData.source_id.length==1){
              $this.channelList.forEach(function(item){
                  if($this.selectedData.isMonth){
                    costCountData.chartTitle = "消费月趋势";
                  }else{
                    costCountData.chartTitle = "消费日趋势";
                  }
                  costCountData.name = "消费统计"; 
              });
            }else{// 多渠道被选中
              if($this.selectedData.isMonth){
                costCountData.chartTitle = "渠道组合消费月趋势";
              }else{
                costCountData.chartTitle = "渠道组合消费日趋势";
              }
              costCountData.name = "渠道组合消费统计";
              costCountData.totalChart = [];
              if(res.monthdepartmoneypercenter&&res.monthdepartmoneypercenter.length>0){
                  res.monthdepartmoneypercenter.forEach(function(item){
                    var itemChart = {};
                    itemChart.name = item.departname;
                    itemChart.value = Math.floor(item.money*10)/10;
                    costCountData.totalChart.push(itemChart);
                  });
                  costCountData.totalChart = singleArrColor(costCountData.totalChart);
                  costCountData.totalChart.sort(sortByDesc("value"));
              };
            }
          }
        }
        costCountData.totalTitle = "总消费";
        costCountData.unit = "（单位：元）";
        costCountData.randomStr = randomString(4);
      }
      // 百万个数
      var millionData = null;
      if($this.selectedType.includes("millionCount")){
        millionData = {};
        millionData.chartType = "line";
        // 时间对比
        if($this.selectedData.isDateCompare&&$this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){          
          var monthscoreallnumber=0;
          if(res.selfmonthanumbertrend&&res.selfmonthanumbertrend.length){
            res.selfmonthanumbertrend.forEach(function(item,index){
              if(item&&item.length>0){
                item.forEach(function(items,indexs){
                  monthscoreallnumber+=items.anumber;
                });
              }
            });
          }
          millionData.nowNumber = numSeparate(monthscoreallnumber);
          var backData = $this.dateCompare(res.selfmonthanumbertrend,'anumber');
          millionData.mainData = backData.mainData;
          millionData.dateCompareData = backData.dateCompareData;
          millionData.colorArr = backData.colorArr;
          if($this.selectedData.source_id.length==1){
            $this.channelList.forEach(function(item){
              if(item.id == $this.selectedData.source_id[0]){
                if($this.selectedData.isMonth){
                  millionData.chartTitle = item.name+"百万个数日期对比月趋势";
                }else{
                  millionData.chartTitle = item.name+"百万个数日期对比日趋势";
                }
                millionData.name = item.name+"百万个数统计";
              }
            });
          }else{
            if($this.selectedData.isMonth){
              millionData.chartTitle = "渠道组合百万个数日期对比月趋势";
            }else{
              millionData.chartTitle = "渠道组合百万个数日期对比日趋势";
            }
            millionData.name = "渠道组合百万个数统计";
          }
        }else{
          // 渠道对比
          if($this.selectedData.comparesource_id.length>0){
            if($this.selectedData.isMonth){
              millionData.chartTitle = "各渠道百万个数月趋势对比";
            }else{
              millionData.chartTitle = "各渠道百万个数日趋势对比";
            }
            millionData.mainData = [];
            millionData.colorArr = [];
            var chartData = groupColor(res.monthanumbertrendcompare);
            chartData.forEach(function(item,index){
              var newItemArr=[];
              millionData.colorArr.push(item[0].color);
              item.forEach(function(item1){
                var itemChart = {};
                if(index == 0){
                  if($this.selectedData.source_id.length==1){
                    $this.channelList.forEach(function(item1){
                      if(item1.isOn){
                        itemChart.name = item1.name;
                      }
                    });
                  }else{
                    itemChart.name="已多选渠道"
                  }
                }else{
                  var selectContrastSourceList = [];
                  $this.contrastSourceList.forEach(function(item1){
                    if(item1.isOn){
                      selectContrastSourceList.push(item1);
                    }
                  });
                  itemChart.name=selectContrastSourceList[index-1].name;
                }
                itemChart.key = item1.date;
                itemChart.value = Math.floor(item1.anumber*100)/100;
                itemChart.color = item[0].color;
                newItemArr.push(itemChart);
              });
              millionData.mainData.push(newItemArr);
            });
            millionData.name = "渠道百万个数统计";
            var monthscoreallnumbercompare=0;
            if(res.monthanumbertrendcompare&&res.monthanumbertrendcompare.length){
              res.monthanumbertrendcompare.forEach(function(item,index){
                  if(index==0){
                    if(item&&item.length>0){
                      item.forEach(function(items,indexs){
                        monthscoreallnumbercompare+=items.anumber;
                      });
                    }
                  }
                  if(index>0){
                      if(item&&item.length>0){
                        item.forEach(function(items,indexs){
                          if(res.monthanumbertrendcompare[0][0].depart.indexOf(items.depart)==-1){
                            monthscoreallnumbercompare+=items.anumber;
                          }
                        });
                      }
                  }
              });
            }
            millionData.nowNumber = numSeparate(Math.floor(monthscoreallnumbercompare*100)/100);
            millionData.lastNumber = Math.floor(res.lastmonthanumbercompare*100)/100;
            millionData.nowLastNumber = numSeparate(Math.abs(Math.floor(monthscoreallnumbercompare*100)/100 - Math.floor(res.lastmonthanumbercompare*100)/100).toFixed(2)*1);
            millionData.status = Math.floor(monthscoreallnumbercompare*100)/100 - Math.floor(res.lastmonthanumbercompare*100)/100>0?'up':Math.floor(monthscoreallnumbercompare*100)/100 - Math.floor(res.lastmonthanumbercompare*100)/100<0?'down':'flat';
            millionData.avgNumber = numSeparate((Math.floor(monthscoreallnumbercompare/res.monthanumbertrendcompare[0].length*100)/100).toFixed(2)*1);
            if(res.historymaxanumbermonthcompare&&res.historymaxanumbermonthcompare.length>0){
              millionData.historyMaxNumber = numSeparate(Math.floor(res.historymaxanumbermonthcompare[0].anumber*100)/100);
              millionData.historyMaxNumberDate = res.historymaxanumbermonthcompare[0].yeartime;
            }
            millionData.avgTitle = "月平均百万个数";
            millionData.historyTitle = "月历史峰值";
            millionData.totalChart = [];
            if(res.monthanumberpercentercompare&&res.monthanumberpercentercompare.length>0){
                res.monthanumberpercentercompare.forEach(function(item){
                  var itemChart = {};
                  itemChart.name = item.departname;
                  itemChart.value = Math.floor(item.anumber*100)/100;
                  millionData.totalChart.push(itemChart);
                });
                millionData.totalChart = singleArrColor(millionData.totalChart);
                millionData.totalChart.sort(sortByDesc("value"));
            };
          }else{
            // 统计
            millionData.mainData = [];
            millionData.colorArr = [];
            var monthanumbertrend=0;
            if(res.monthanumbertrend&&res.monthanumbertrend.length){
              res.monthanumbertrend.forEach(function(item,index){
                    monthanumbertrend+=item.anumber;
              });
            }
            millionData.nowNumber = numSeparate(Math.floor(monthanumbertrend*100)/100);
            var tongData = groupColor([res.monthanumbertrend]);
            millionData.colorArr.push(tongData[0][0].color);
            var newItemArr=[];
            tongData[0].forEach(function(item,index){
              item.key = item.date;
              item.value = Math.floor(item.anumber*100)/100;
              if($this.selectedData.source_id.length==1){
                $this.channelList.forEach(function(item1){
                  if(item1.id == $this.selectedData.source_id[0]){
                    item.name = item1.name;
                  }
                });
              }else{
                item.name = "已多选渠道"
              }
              newItemArr.push(item);
            });
            millionData.mainData.push(newItemArr);
            millionData.lastNumber = Math.floor(res.lastmonthanumberallnumber*100)/100;
            millionData.nowLastNumber = numSeparate(Math.abs(Math.floor(monthanumbertrend*100)/100 - Math.floor(res.lastmonthanumberallnumber*100)/100).toFixed(2)*1);
            millionData.status = Math.floor(monthanumbertrend*100)/100 - Math.floor(res.lastmonthanumberallnumber*100)/100>0?'up':Math.floor(monthanumbertrend*100)/100 - Math.floor(res.lastmonthanumberallnumber*100)/100<0?'down':'flat';
            millionData.avgNumber = numSeparate((Math.floor(monthanumbertrend/res.monthanumbertrend.length*100)/100).toFixed(2)*1);
            if(res.historymaxanumbermonth&&res.historymaxanumbermonth.length>0){
                millionData.historyMaxNumber = numSeparate(Math.floor((res.historymaxanumbermonth.length>0?res.historymaxanumbermonth[0].anumber:0)*100)/100);
                millionData.historyMaxNumberDate = res.historymaxanumbermonth.length>0?res.historymaxanumbermonth[0].yeartime:0;
            }
            millionData.avgTitle = "月平均百万个数";
            millionData.historyTitle = "月历史峰值";
            // 只有一个渠道被选中的情况
            if($this.selectedData.source_id.length==1){
              $this.channelList.forEach(function(item){
                  if($this.selectedData.isMonth){
                    millionData.chartTitle = "百万个数月趋势";
                  }else{
                    millionData.chartTitle = "百万个数日趋势";
                  }
                  millionData.name = "百万个数统计";
              });
            }else{// 多渠道被选中
              if($this.selectedData.isMonth){
                millionData.chartTitle = "渠道组合百万个数月趋势";
              }else{
                millionData.chartTitle = "渠道组合百万个数日趋势";
              }
              millionData.name = "渠道组合百万个数统计"; 
              millionData.totalChart = [];
              if(res.monthdepartanumberpercenter&&res.monthdepartanumberpercenter.length>0){
                  res.monthdepartanumberpercenter.forEach(function(item){
                    var itemChart = {};
                    itemChart.name = item.departname;
                    itemChart.value =  Math.floor(item.anumber*100)/100;
                    millionData.totalChart.push(itemChart);
                  });
                  millionData.totalChart = singleArrColor(millionData.totalChart);
                  millionData.totalChart.sort(sortByDesc("value"));
              };
            }
          }
        }
        millionData.totalTitle = "总百万个数";
        millionData.unit = "（单位：分）";
        millionData.randomStr = randomString(4);
      }
      // 询盘均价
      var enquiriesAvgData = null;
      if($this.selectedType.includes("enquiriesAvg")&&$this.selectedType.includes("enquiriesFew")&&$this.selectedType.includes("consumptionAnalysis")){
        enquiriesAvgData = {};
        // 时间对比
        if($this.selectedData.isDateCompare&&$this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
            enquiriesAvgData.chartType = "area";
            enquiriesAvgData.mainData = [];
            enquiriesAvgData.colorArr = [$this.enquirieList[0][0].color];
            $this.costList.forEach(function(item,index){
              var itemArr=[];
              item.forEach(function(items,indexs){
                $this.enquirieList.forEach(function(itemm,indexm){
                  if(index==indexm){
                    itemm.forEach(function(itemn,indexn){
                      if(items.key==itemn.key){
                        var itemObj={};
                        itemObj.color=itemn.color;
                        itemObj.key=itemn.key;
                        itemObj.name=itemn.name;                       
                        if((items.value==0&&itemn.value!=0)||(items.value==0&&itemn.value==0)){
                          itemObj.value=0;
                        }
                        if(items.value!=0&&itemn.value==0){
                          itemObj.value=items.value;
                        }
                        if(items.value!=0&&itemn.value!=0){
                          itemObj.value=(items.value/itemn.value).toFixed(1)*1;
                        }
                        itemArr.push(itemObj);
                      }
                    });
                  }
                });
              });
              enquiriesAvgData.mainData.push(itemArr);
            });
            enquiriesAvgData.dateCompareData=$this.dateAvgCompare(enquiriesAvgData.mainData);
            if($this.selectedData.source_id.length==1){
              $this.channelList.forEach(function(item){
                if(item.id == $this.selectedData.source_id[0]){
                  enquiriesAvgData.chartTitle = item.name+"询盘均价日期对比月趋势";
                  enquiriesAvgData.name = item.name+"询盘均价统计";
                }
              });
            }else{
              enquiriesAvgData.chartTitle = "渠道组合询盘均价日期对比月趋势";
              enquiriesAvgData.name = "渠道组合询盘均价统计";
            }
        }else{
          // 渠道对比
          if($this.selectedData.comparesource_id.length>0){
            enquiriesAvgData=$this.dateAvg($this.costList,$this.enquirieList);
            enquiriesAvgData.chartTitle = "各渠道询盘均价月趋势对比";
            enquiriesAvgData.name = "渠道询盘均价统计";
            enquiriesAvgData.totalChart = [];
          }else{
            enquiriesAvgData=$this.dateAvg($this.costList,$this.enquirieList);
            // 只有一个渠道被选中的情况
            if($this.selectedData.source_id.length==1){
              $this.channelList.forEach(function(item){
                  enquiriesAvgData.chartTitle = "询盘均价月趋势";
                  enquiriesAvgData.name = "询盘均价统计";
              });
            }else{// 多渠道被选中
              enquiriesAvgData.chartTitle = "渠道组合询盘均价月趋势";
              enquiriesAvgData.name = "渠道组合询盘均价统计"; 
              enquiriesAvgData.totalChart = [];
            }
          }
        }
        enquiriesAvgData.totalTitle = "总询盘均价";
        enquiriesAvgData.unit = "（消费/询盘个数）";
        enquiriesAvgData.randomStr = randomString(4);
      }
      // 积分均价
      var scoreAvgData = null;
      if($this.selectedType.includes("scoreAvg")&&$this.selectedType.includes("clinchScore")&&$this.selectedType.includes("consumptionAnalysis")){
        scoreAvgData = {};
        // 时间对比
        if($this.selectedData.isDateCompare&&$this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
            scoreAvgData.chartType = "area";
            scoreAvgData.mainData = [];
            scoreAvgData.colorArr = [$this.enquirieList[0][0].color];
            $this.costList.forEach(function(item,index){
              var itemArr=[];
              item.forEach(function(items,indexs){
                $this.enquirieList.forEach(function(itemm,indexm){
                  if(index==indexm){
                    itemm.forEach(function(itemn,indexn){
                      if(items.key==itemn.key){
                        var itemObj={};
                        itemObj.color=itemn.color;
                        itemObj.key=itemn.key;
                        itemObj.name=itemn.name;                       
                        if((items.value==0&&itemn.value!=0)||(items.value==0&&itemn.value==0)){
                          itemObj.value=0;
                        }
                        if(items.value!=0&&itemn.value==0){
                          itemObj.value=items.value;
                        }
                        if(items.value!=0&&itemn.value!=0){
                          itemObj.value=(items.value/itemn.value).toFixed(1)*1;
                        }
                        itemArr.push(itemObj);
                      }
                    });
                  }
                });
              });
              scoreAvgData.mainData.push(itemArr);
            });
            scoreAvgData.dateCompareData=$this.dateAvgCompare(scoreAvgData.mainData);
            if($this.selectedData.source_id.length==1){
              $this.channelList.forEach(function(item){
                if(item.id == $this.selectedData.source_id[0]){
                  scoreAvgData.chartTitle = item.name+"积分均价日期对比月趋势";
                  scoreAvgData.name = item.name+"积分均价统计";
                }
              });
            }else{
              scoreAvgData.chartTitle = "渠道组合积分均价日期对比月趋势";
              scoreAvgData.name = "渠道组合积分均价统计";
            }
        }else{
          // 渠道对比
          if($this.selectedData.comparesource_id.length>0){
            scoreAvgData=$this.dateAvg($this.costList,$this.scoreList);
            scoreAvgData.chartTitle = "各渠道积分均价月趋势对比";
            scoreAvgData.name = "渠道积分均价统计";
            scoreAvgData.totalChart = [];
          }else{
            scoreAvgData=$this.dateAvg($this.costList,$this.scoreList);
            // 只有一个渠道被选中的情况
            if($this.selectedData.source_id.length==1){
              $this.channelList.forEach(function(item){
                  scoreAvgData.chartTitle = "积分均价月趋势";
                  scoreAvgData.name = "积分均价统计";
              });
            }else{// 多渠道被选中
              scoreAvgData.chartTitle = "渠道组合积分均价月趋势";
              scoreAvgData.name = "渠道组合积分均价统计"; 
              scoreAvgData.totalChart = [];
            }
          }
        }
        scoreAvgData.totalTitle = "总积分均价";
        scoreAvgData.unit = "（消费/成交积分）";
        scoreAvgData.randomStr = randomString(4);
      }
      // 积分询盘比
      var scoreAndenquiriesData = null;
      if($this.selectedType.includes("scoreRatioenquiries")&&$this.selectedType.includes("enquiriesFew")&&$this.selectedType.includes("clinchScore")){
        scoreAndenquiriesData = {};
        // 时间对比
        if($this.selectedData.isDateCompare&&$this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
            scoreAndenquiriesData.chartType = "area";
            scoreAndenquiriesData.mainData = [];
            scoreAndenquiriesData.colorArr = [$this.enquirieList[0][0].color];
            $this.enquirieList.forEach(function(item,index){
              var itemArr=[];
              item.forEach(function(items,indexs){
                $this.costList.forEach(function(itemm,indexm){
                  if(index==indexm){
                    itemm.forEach(function(itemn,indexn){
                      if(items.key==itemn.key){
                        var itemObj={};
                        itemObj.color=itemn.color;
                        itemObj.key=itemn.key;
                        itemObj.name=itemn.name;                        
                        if((items.value==0&&itemn.value!=0)||(items.value==0&&itemn.value==0)){
                          itemObj.value=0;
                        }
                        if(items.value!=0&&itemn.value==0){
                          itemObj.value=items.value;
                        }
                        if(items.value!=0&&itemn.value!=0){
                          itemObj.value=(items.value/itemn.value).toFixed(1)*1;
                        }
                        itemArr.push(itemObj);
                      }
                    });
                  }
                });
              });
              scoreAndenquiriesData.mainData.push(itemArr);
            });
            scoreAndenquiriesData.dateCompareData=$this.dateAvgCompare(scoreAndenquiriesData.mainData);
            if($this.selectedData.source_id.length==1){
              $this.channelList.forEach(function(item){
                if(item.id == $this.selectedData.source_id[0]){
                  scoreAndenquiriesData.chartTitle = item.name+"积分询盘比日期对比月趋势";
                  scoreAndenquiriesData.name = item.name+"积分询盘比统计";
                }
              });
            }else{
              scoreAndenquiriesData.chartTitle = "渠道组合积分询盘比日期对比月趋势";
              scoreAndenquiriesData.name = "渠道组合积分询盘比统计";
            }
        }else{
          // 渠道对比
          if($this.selectedData.comparesource_id.length>0){
            scoreAndenquiriesData=$this.dateAvg($this.enquirieList,$this.scoreList);
            scoreAndenquiriesData.chartTitle = "各渠道积分询盘比月趋势对比";
            scoreAndenquiriesData.name = "渠道积分询盘比统计";
            scoreAndenquiriesData.totalChart = [];
          }else{
            scoreAndenquiriesData=$this.dateAvg($this.enquirieList,$this.scoreList);
            // 只有一个渠道被选中的情况
            if($this.selectedData.source_id.length==1){
              $this.channelList.forEach(function(item){
                  scoreAndenquiriesData.chartTitle = "积分询盘比月趋势";
                  scoreAndenquiriesData.name = "积分询盘比统计";
              });
            }else{// 多渠道被选中
              scoreAndenquiriesData.chartTitle = "渠道组合积分询盘比月趋势";
              scoreAndenquiriesData.name = "渠道组合积分询盘比统计"; 
              scoreAndenquiriesData.totalChart = [];
            }
          }
        }
        scoreAndenquiriesData.totalTitle = "总积分询盘比";
        scoreAndenquiriesData.unit = "（询盘个数/成交积分）";
        scoreAndenquiriesData.randomStr = randomString(4);
      }
      var defaultChartData = [];
      if(costCountData){
        defaultChartData.push(costCountData);
      }
      if(inquiryData){
        defaultChartData.push(inquiryData);
      }
      if(dealScoreData){
        defaultChartData.push(dealScoreData);
      }
      if(millionData){
        defaultChartData.push(millionData);
      }
      if(enquiriesAvgData){
        defaultChartData.push(enquiriesAvgData);
      }
      if(scoreAvgData){
        defaultChartData.push(scoreAvgData);
      }
      if(scoreAndenquiriesData){
        defaultChartData.push(scoreAndenquiriesData);
      }
      return defaultChartData;
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

        var moneyArr=res.monthmoneypercenter;     //消费占比
        moneyDate.mainDate=$this.clumpQuality(moneyArr,'消费占比');
        var xunArr=res.monthxuntrendpercenter;    //询盘占比
        enquirieDate.mainDate=$this.clumpQuality(xunArr,'询盘占比');
        var scoreArr=res.monthscoretrendpercenter;//积分占比
        scoreDate.mainDate=$this.clumpQuality(scoreArr,'积分占比');

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
      if($this.selectedType.includes("enquiriesRegion")){
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
          if($this.selectedData.source_id.length==1){
            $this.channelList.forEach(function(item){
              if(item.isOn){
                title = item.name;
              }
            });
          }else{
            title = "已多选渠道";
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
          // 渠道对比
          if($this.selectedData.comparesource_id.length>0){
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
                if($this.selectedData.source_id.length==1){
                  $this.channelList.forEach(function(item1){
                    if(item1.isOn){
                      itemChart.title = item1.name;
                    }
                  });
                }else{
                  itemChart.title="已多选渠道"
                }
              }else{
                var selectContrastSourceList = [];
                $this.contrastSourceList.forEach(function(item1){
                  if(item1.isOn){
                    selectContrastSourceList.push(item1);
                  }
                });
                itemChart.title=selectContrastSourceList[index-1].name;
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
      if($this.selectedType.includes("scoreRegion")){
        dealRegionMapData = {};
        // 时间对比
        if($this.selectedData.isDateCompare&&$this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
          var mapData = res.selfprovincebuymonthcompare;
          dealRegionMapData.mapDataArr = [];
          var itemMapChart0 = {};
          var itemMapChart1 = {};
          var title = "";
          if($this.selectedData.source_id.length==1){
            $this.channelList.forEach(function(item){
              if(item.isOn){
                title = item.name;
              }
            });
          }else{
            title = "已多选渠道";
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
          // 渠道对比
          if($this.selectedData.comparesource_id.length>0){
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
                if($this.selectedData.source_id.length==1){
                  $this.channelList.forEach(function(item1){
                    if(item1.isOn){
                      itemChart.title = item1.name;
                    }
                  });
                }else{
                  itemChart.title="已多选渠道"
                }
              }else{
                var selectContrastSourceList = [];
                $this.contrastSourceList.forEach(function(item1){
                  if(item1.isOn){
                    selectContrastSourceList.push(item1);
                  }
                });
                itemChart.title=selectContrastSourceList[index-1].name;
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
      var mapChartData = [];
      var itemChartArr = [];
      if(inquiryMapData){
        itemChartArr.push(inquiryMapData);
      }
      if(dealRegionMapData){
        itemChartArr.push(dealRegionMapData);
      }
      mapChartData.push(itemChartArr);
      return mapChartData;
    },
    // 组装积分等级饼状类型图表数据
    dateIntegrallevel(res){
      var $this = this;
      var Integrallevel = null
      if($this.selectedType.includes("scoreLevel")){
        Integrallevel = {};
        // 时间对比
        if($this.selectedData.isDateCompare&&$this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
            Integrallevel.LevelCount = [];
            var yarnArr = ['A','B','C','D','E'];
            res.selfpricemonthcompare.forEach(function(item,index){
              var itemChart = {};
              if(index==0){
                itemChart.title = $this.selectedData.dateDefault[0]+" ~ "+$this.selectedData.dateDefault[1];
              }
              if(index==1){
                itemChart.title = $this.selectedData.dateContrast[0]+" ~ "+$this.selectedData.dateContrast[1]
              }
              itemChart.randomStr = randomString(4);
              itemChart.width = parseInt(1/res.selfpricemonthcompare.length*100)+"%";
              itemChart.mapData=[];
              yarnArr.forEach(function(items,indexs){
                var itemObj={};
                itemObj.departname=itemChart.title;
                itemObj.name=items;
                itemObj.value=0;
                item.forEach(function(itemk,indexk){
                  if(items==itemk.price){
                    itemObj.value=itemk.number;
                  }
                });
                itemChart.mapData.push(itemObj);
              });
              itemChart.mapData=singleArrColor(itemChart.mapData);
              Integrallevel.LevelCount.push(itemChart);
            }); 
            Integrallevel.title = "积分等级";
            Integrallevel.isMap = 'level';
        }else{
          if($this.selectedData.comparesource_id.length>0){
            Integrallevel.LevelCount = [];
            var yarnArr = ['A','B','C','D','E'];
            res.pricemonthcompare.forEach(function(item,index){
              var itemChart = {};
              if(index == 0){
                if($this.selectedData.source_id.length==1){
                  $this.channelList.forEach(function(item1){
                    if(item1.isOn){
                      itemChart.title = item1.name;
                    }
                  });
                }else{
                  itemChart.title="已多选渠道"
                }
              }else{
                var selectContrastSourceList = [];
                $this.contrastSourceList.forEach(function(item1){
                  if(item1.isOn){
                    selectContrastSourceList.push(item1);
                  }
                });
                itemChart.title=selectContrastSourceList[index-1].name;
              }
              itemChart.randomStr = randomString(4);
              itemChart.mapData=[];
              itemChart.width = parseInt(1/res.pricemonthcompare.length*100)+"%";
              yarnArr.forEach(function(items,indexs){
                var itemObj={};
                itemObj.departname=itemChart.title;
                itemObj.name=items;
                itemObj.value=0;
                item.forEach(function(itemk,indexk){
                  if(items==itemk.price){
                    itemObj.value=itemk.number;
                  }
                });
                itemChart.mapData.push(itemObj);
              });
              itemChart.mapData=singleArrColor(itemChart.mapData);
              Integrallevel.LevelCount.push(itemChart);
            });
            Integrallevel.title = "积分等级";
            Integrallevel.isMap = 'level';     
          }else{
            Integrallevel =  []
            var yarnArr = ['A','B','C','D','E'];
            var itemData = {};
            itemData.LevelCount = [];
            yarnArr.forEach(function(item,index){
              var itemObj={};
              itemObj.departname=$this.groupName;
              itemObj.name=item;
              itemObj.value=0;
              res.pricelist.forEach(function(items,indexs){
                if(item==items.price){
                  itemObj.name=items.price;
                  itemObj.value=items.number;
                }
              })
              itemData.LevelCount.push(itemObj);
            });
            itemData.LevelCount=singleArrColor(itemData.LevelCount);
            itemData.title = "积分等级";
            itemData.isMap = 'level';
            itemData.randomStr = randomString(4);
            Integrallevel.push(itemData);
          }
        }
      }
      return Integrallevel;
    },
    // 平均数据封装函数
    dateAvg(costDate,enquirieDate){
        var $this=this;
        var itemObj={};
        itemObj.chartType = "area";
        itemObj.mainData = [];
        itemObj.colorArr = [enquirieDate[0][0].color];
        costDate.forEach(function(item,index){
          var itemArr=[];
          item.forEach(function(items,indexs){
            enquirieDate.forEach(function(itemm,indexm){
              if(index==indexm){
                itemm.forEach(function(itemn,indexn){
                  if(items.key==itemn.key){
                    var itemObj={};
                    itemObj.color=itemn.color;
                    itemObj.key=itemn.key;
                    itemObj.name=itemn.name;
                    if(((items.value==0||items.value==null)&&itemn.value!=0)||(items.value==0&&itemn.value==0)){
                      itemObj.value=0;
                    }
                    if(items.value!=0&&itemn.value==0){
                      itemObj.value=items.value;
                    }
                    if(items.value!=0&&itemn.value!=0){
                      itemObj.value=(items.value/itemn.value).toFixed(1)*1;
                    }
                    itemArr.push(itemObj);
                  }
                });
              }
            });
          });
          itemObj.mainData.push(itemArr);
        });
        var enquiriesAvgNum=0;
        var avgNumber=0;
        var historyAvgNumAvg={
          yeartime:'',
          value:0,
        };
        if(itemObj.mainData&&itemObj.mainData.length){
          itemObj.mainData.forEach(function(item,index){
              if(item&&item.length>0){
                item.forEach(function(items,indexs){
                  enquiriesAvgNum+=items.value;
                  if(historyAvgNumAvg.value<items.value){
                    historyAvgNumAvg.value=items.value;
                    historyAvgNumAvg.yeartime=items.key;
                  }
                });
              }
          });
        }
        itemObj.nowNumber = numSeparate(Math.floor(enquiriesAvgNum*100)/100);
        itemObj.historyMaxNumber = numSeparate(Math.floor(historyAvgNumAvg.value*100)/100);
        itemObj.historyMaxNumberDate = historyAvgNumAvg.yeartime;
        itemObj.avgNumber = numSeparate((Math.floor(enquiriesAvgNum/itemObj.mainData[0].length*100)/100).toFixed(2)*1);
        itemObj.avgTitle = "月平均询盘均价";
        itemObj.historyTitle = "月历史峰值";
        return itemObj;
    },
    // 时间对比平均数据封装函数
    dateAvgCompare(dataArr){
      var $this = this;
      var ItemObj={};
      ItemObj.baseValue = 0;
      ItemObj.compareValue = 0;
      dataArr.forEach(function(item,index){
        item.forEach(function(item1){
          if(index == 0){
            ItemObj.baseValue += item1.value;
          }else{
            ItemObj.compareValue += item1.value;
          }
        });
      });
      ItemObj.baseValue =Math.floor(ItemObj.baseValue*100)/100;
      ItemObj.compareValue = Math.floor(ItemObj.compareValue*100)/100;
      ItemObj.baseDate = $this.selectedData.dateDefault[0]+" ~ "+$this.selectedData.dateDefault[1];
      ItemObj.compareDate = $this.selectedData.dateContrast[0]+" ~ "+$this.selectedData.dateContrast[1];            
      if(ItemObj.baseValue - ItemObj.compareValue>0){
        ItemObj.status = "up";
        ItemObj.baseWidth = "100%";
        ItemObj.compareWidth = parseInt(ItemObj.compareValue/ItemObj.baseValue*100)+"%";
      }else if(ItemObj.baseValue - ItemObj.compareValue<0){
        ItemObj.status = "down";
        ItemObj.compareWidth = "100%";
        ItemObj.baseWidth = parseInt(ItemObj.baseValue/ItemObj.compareValue*100)+"%";
      }else{
        ItemObj.status = "flat";
        ItemObj.baseWidth = "100%";
        ItemObj.compareWidth = "100%";
      }
      ItemObj.compareNumber = numSeparate(Math.abs(ItemObj.baseValue - ItemObj.compareValue).toFixed(1)*1);
      ItemObj.compareRate = ItemObj.compareValue==0?'0%':(Math.abs(ItemObj.baseValue - ItemObj.compareValue)/ItemObj.compareValue*100).toFixed(1)+"%";
      ItemObj.baseValue = numSeparate(ItemObj.baseValue);
      ItemObj.compareValue = numSeparate(ItemObj.compareValue);
      return ItemObj;
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
    // 判断当前展示情况
    judgeChartStatus(){
      var $this = this;
      var judgeData = {};
      judgeData.singleGroupStatic = false;          // 单基础渠道统计
      judgeData.singleGroupDateCompare = false;     // 单基础渠道时间对比
      judgeData.singleGroupTeamCompare = false;     // 单基础渠道与其他渠道对比
      judgeData.pluralGroupStatic = false;          // 多基础渠道统计
      judgeData.pluralGroupDateCompare = false;     // 多基础渠道的时间对比
      judgeData.pluralGroupTeamCompare = false;     // 多基础渠道与其他渠道对比
      judgeData.pluralGroupTeamSameCompare = false; // 多基础渠道与其他渠道对比，且有渠道同时存在于基础渠道与对比渠道
      // 基础渠道有被选中的
      if($this.selectedData.source_id.length>0){
        // 基础渠道有一个被选中
        if($this.selectedData.source_id.length==1){
          // 且基础时间有值
          if($this.selectedData.dateDefault&&$this.selectedData.dateDefault.length>0){
            // 且对比时间有值，此时是单一渠道的时间对比
            if($this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
              if($this.selectedData.type.length>0){
                judgeData.singleGroupDateCompare = true;
              }
            }else{
              // 基础渠道选中1个，且基础时间有值，而对比时间无值
              // 且有对比渠道被选中
              if($this.selectedData.comparesource_id.length>0){
                if($this.selectedData.type.length>0){
                  judgeData.singleGroupTeamCompare = true;
                }
              }else{
                // 对比时间无值，对比渠道也无值，此情况为单一渠道统计
                if($this.selectedData.type.length>0){
                  judgeData.singleGroupStatic = true;
                }
              }
            }
          }
        }else{
          // 基础渠道有多个被选中
          // 且基础时间有值
          if($this.selectedData.dateDefault&&$this.selectedData.dateDefault.length>0){
            // 且对比时间有值，此时是基础多渠道的时间对比
            if($this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
              if($this.selectedData.type.length>0){
                judgeData.pluralGroupDateCompare = true;
              }
            }else{
              // 基础渠道选中多个，且基础时间有值，而对比时间无值
              // 且有对比渠道被选中
              if($this.selectedData.comparesource_id.length>0){
                if($this.selectedData.type.length>0){
                  judgeData.pluralGroupTeamCompare = true;
                  // 判断基础渠道与对比渠道是否有同一个渠道被选中
                  $this.selectedData.comparesource_id.forEach(function(item){
                    if($this.selectedData.source_id.includes(item)){
                      if($this.selectedData.type.length>0){
                        judgeData.pluralGroupTeamSameCompare = true;
                      }
                    }
                  });
                }
              }else{
                // 对比时间无值，对比渠道也无值，此情况为多基础渠道统计
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
    // 对比渠道删除点击事件
    deleteContrastGroup(id){
      var $this = this;
      var contrastSourceList = $this.contrastSourceList;
      var selectedContrastGroupID = [];
      contrastSourceList.forEach(function(item,index){
        if(item.id == id){
          item.isOn = false;
          $this.comparesourceNum--;
        }
        if(item.isOn){
          selectedContrastGroupID.push(item.id);
        }
      });
      $this.contrastSourceList = contrastSourceList;
      $this.selectedData.comparesource_id = selectedContrastGroupID;      
      if($this.selectedData.comparesource_id.length==0){
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
            $this.selectedData.type = selectedContrastType;
            $this.contrastList = contrastList;
            var contrastRatio = $this.contrastRatio;
            contrastRatio.forEach(function(item,index){
              if($this.selectedData.isMonth){
                item.isOn = true;
                item.disabled = false;
              }
              if(item.isOn){
                selectedType.push(item.value);
              }
            });
            $this.contrastRatio = contrastRatio;
            $this.selectedType = selectedType;
          }
          var contrastSourceList = $this.contrastSourceList;
          contrastSourceList.forEach(function(item,index){
              item.isOn=false;
              item.disabled=false;
              if($this.selectedData.source_id.length==1){
                  $this.selectedData.source_id.forEach(function(items,indexs){
                      if(item.id==items){
                        item.disabled=true;
                      }
                  });
              }
          });
      }
      $this.getSearchData();
    },
    // 重置数据
    resetData(){
      var $this = this;
      var baseDepart;
      $this.tipsInfo="当前渠道分析页面，展示为：本年度数据信息。";
      $this.tipsItem="";
      $this.channelList.forEach(function(item,index){
        item.isOn=false;
        if(index==0){
          item.isOn=true;
          baseDepart=item.id;
          $this.selectedData.source_id.push(item.id);
          $this.groupName = item.name;
        }
      });
      $this.contrastSourceList.forEach(function(item){
        item.disabled = false;
        if(item.id == baseDepart){
          item.disabled = true;
        }
      });
      $this.contrastList.forEach(function(item,index){
        item.isOn=false;
        item.disabled=true;
        if(item.value=='enquiriesFew'){
          item.isOn=true;
          item.disabled=false;
        }
      });
      $this.dateDimension.forEach(function(item,index){
        item.isOn=false;
        if(index==0){
          item.isOn=true;
        }
      });
      $this.selectedData.type=[1,5];
      $this.selectedData.dateDefault = $this.getNearDay();
      $this.selectedData.dateContrast = [];
      $this.selectedData.is_compare=1;
      $this.selectedData.comparesource_id = [];
      $this.selectedData.is_timecopmare=1;
      $this.selectedData.isMonth=false;
      $this.selectedData.isDateCompare=false;
      $this.dateSelected=true;
      $this.isFilter = false,
      $this.isContrastShow = false,
      $this.selectedType=['enquiriesFew','enquiriesRegion'];
      $this.oldContrastSourceID = "";
      $this.isDefaultPage = false;
      $this.judgeData = {};
      $this.defaultChartData = [];
      $this.getSearchData();
    },
    // 最近六个月时间周期
    getNearMonth(){
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 5);
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
      var endDay = end.getDate()-1;
      startMonth = startMonth<10?'0'+startMonth:startMonth;
      startDay = startDay<10?'0'+startDay:startDay;
      endMonth = endMonth<10?'0'+endMonth:endMonth;
      endDay = endDay<10?'0'+endDay:endDay;
      var startDate = startYear+"/"+startMonth+"/"+startDay;
      var endDate = endYear+"/"+endMonth+"/"+endDay;
      return [startDate,endDate];
    },
    // 滚动悬浮
    getScroll(){
      var $this = this;
      if(!$this.selectedData.isDateCompare && $this.selectedData.source_id.length>0){
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