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
        <div class="contrast-panel flex-box" :style="'width:'+ boxWidth + 'px' " v-if="!selectedData.isDateCompare&&selectedData.source_id.length>0">
          <div class="title-font"><span class="txt-title">对比项：</span></div>
          <div class="contrast-content flex-content">
            <div class="item-list">
              <div class="item-contrast" v-if="selectedData.source_id.length>0"><span>{{groupName}}</span><i class="svg-i"><svg-icon icon-class="close" class-name="disabled" /></i></div>
              <template v-if="selectedData.comparesource_id.length>0">
                <div class="item-contrast" v-if="item.isOn" v-for="item in contrastSourceList" v-bind:key="item.id"><span>{{item.name}}</span><i class="svg-i"><svg-icon icon-class="close" class-name="disabled" /></i></div>
              </template>
              <div class="item-button">
                <div class="button-click" v-on:click="toggleContrast"><i class="svg-i"><svg-icon icon-class="s-add" class-name="disabled" /></i><span>添加对比</span></div>
                <div class="group-contrast depart" v-show="isContrastShow">
                  <div class="item-checkbox" v-bind:class="[item.disabled?'is-disabled':'',item.isOn?'active':'']" v-for="item in contrastSourceList" v-bind:key="item.id" v-on:click="contrastGroupChangeHandler(item)"><i></i><span>{{item.name}}</span></div>
                  <div class="item-sure" v-on:click="saveContrastGroup">确定</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="result-panel">
            <template v-for="item in defaultChartData">
              <default-chart 
                :item-data="item" 
                :is-default-page="isDefaultPage"
                :judge-data="judgeData"
                ></default-chart>
            </template>
        </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex';
import defaultChart from "../../stat/components/departGroup/defaultChart.vue";
import {randomString,sortByDesc,groupColor,groupDateColor,singleArrColor,formatDate,numSeparate,sortByDate,memberArrColor,singleNewArrColor} from "@/utils/index"
export default {
  name: 'Ownpush_getsource',
  components: {
    defaultChart,
  },
  data() {
    return {
        breadcrumbList:[],                             //面包屑导航
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
          type:[],              //分析项数据
          is_compare:'',            //是否部门对比
          comparesource_id:[],       //对比渠道选择
          is_timecopmare:'',        //是否时间对比
          isMonth:false,
          isDateCompare:false,
        },
        dateDimension:[
          {label:"日",value:"day",isOn:false},
          {label:"月",value:"month",isOn:false},
        ],
        contrastList:[
          {label:"询盘个数",id:1,value:"enquiriesNum",isOn:false,disabled:false},
          {label:"成交积分",id:2,value:"clinchScore",isOn:false,disabled:false},
          {label:'消费',id:3,value:"consumpTion",isOn:false,disabled:false},
          {label:'质量分析',id:4,value:"qualityAnalysis",isOn:false,disabled:false},
        ],
        groupName:"",
        dateSelected:false,
        isFilter:false,
        isContrastShow:false,
        selectedType:[],
        oldContrastSourceID:"",
        isDefaultPage:true,
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
        judgeData:{},
        defaultChartData:[],
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
    if($this.$refs.boxPane){  
      $this.minWidth = $this.$refs.boxPane.offsetWidth;
      $this.boxWidth = $this.$refs.boxPane.offsetWidth - 40;
    }
    window.onresize = () => {
      return (() => {
        if($this.$refs.boxPane){
          $this.minWidth = $this.$refs.boxPane.offsetWidth; 
          $this.boxWidth = $this.$refs.boxPane.offsetWidth -40;
        }
      })()
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
          if(permitData.includes('Ownpush_getsource')){
              $this.getChannelList()
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
    // 获取渠道列表
    getChannelList(){
      var $this = this;
      $this.$store.dispatch('ownpush/getOwnsourceAction', null).then(res=>{
        var channelList = [];
        var contrastSourceList = [];
        res.data.forEach(function(item,index){
          var itemData = {};
          itemData.id = item.id;
          itemData.name = item.name;
          itemData.disabled = false;
          itemData.isOn = false;
          channelList.push(itemData);
        });
        $this.channelList = JSON.parse(JSON.stringify(channelList));
        $this.contrastSourceList = JSON.parse(JSON.stringify(channelList));
        $this.getDefaultData();
      });
    },
    // 获取默认数据
    getDefaultData(){
      var $this = this;
      var baseDepart;
      $this.channelList.forEach(function(item,index){
        if(index==0){
          item.isOn=true;
          baseDepart=item.id;
          $this.selectedData.source_id.push(item.id);
          $this.groupName = item.name;
        }
      });
      $this.contrastList.forEach(function(item,index){
        item.disabled=true;
        if(index==0){
          item.isOn=true;
          item.disabled=false;
          $this.selectedData.type.push(item.id);
          $this.selectedType.push(item.value);
        }
      });
      $this.dateDimension.forEach(function(item,index){
        item.isOn=false;
        if(index==0){
          item.isOn=true;
        }
      });
      $this.contrastSourceList.forEach(function(item){
        item.disabled = false;
        if(item.id == baseDepart){
          item.disabled = true;
        }
      });
      $this.contrastSourceList.forEach(function(item){
        item.disabled = false;
      });
      $this.selectedData.is_compare=1;
      $this.selectedData.is_timecopmare=1;
      $this.selectedData.isMonth=false;
      $this.dateSelected=true;
      $this.getSearchData();
    },
    // 部门点击事件
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
      // 日期维度未选择的情况下，部门选中后，需要默认将日维度选中
      if(!$this.dateSelected){
        $this.dateDimension.forEach(function(item,index){
          if(index==0){
            item.isOn = true;
            $this.dateSelected = true;
          }
        });
      }
      // 部门有被选中的，且默认时间是空的情况下，需要给默认时间一个默认时间范围
      if($this.selectedData.source_id.length>0&&(!$this.selectedData.dateDefault||$this.selectedData.dateDefault.length==0)){
        if($this.selectedData.isMonth){
          $this.selectedData.dateDefault = $this.getNearMonth();
        }else{
          $this.selectedData.dateDefault = $this.getNearDay();
        }
      }
      // 初始第一次部门被选中（即此时只有一个部门被选中），日维度需默认将询盘个数分析、询盘地区分析选中，月维度需将所有分析项选中
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
            if(item.value=="enquiriesNum"){
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
            item.disabled = false;
            item.isOn = true;
          }else{
            item.disabled = true;
            item.isOn = false;
            if(item.value=="enquiriesNum"){
              item.disabled = false;
              item.isOn = true;
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
        $this.getSearchData();
      }
    },
    // 日期对比点击事件
    dateCompareChangeHandler(){
      var $this = this;
      // 只有在对比部门没有被选中的，此时日期对比才是非禁用状态，可点击的
      if($this.selectedData.comparesource_id.length==0&&$this.dateSelected){
        if($this.selectedData.isDateCompare){
          $this.selectedData.isDateCompare = false;
          if($this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
            $this.selectedData.dateContrast = [];
            $this.getSearchData();
          }
        }else{
          $this.selectedData.isDateCompare = true;
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
        $this.getSearchData();
      }
    },
    // 添加对比部门点击事件
    toggleContrast(){
      this.isContrastShow = !this.isContrastShow;
    },
    // 对比部门点击事件
    contrastGroupChangeHandler(obj){
      var $this = this;
      if(!obj.disabled){
        var selectedContrastGroupID = [];
        var contrastSourceList = $this.contrastSourceList;
        contrastSourceList.forEach(function(item,index){
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
        $this.selectedData.comparesource_id = selectedContrastGroupID;
        $this.contrastSourceList = contrastSourceList;
      }
    },
    // 对比部门添加确定事件
    saveContrastGroup(){
      var $this = this;
      $this.isContrastShow = !$this.isContrastShow;
      if($this.oldContrastSourceID!=$this.selectedData.comparesource_id.join(",")){
        $this.oldContrastSourceID = $this.selectedData.comparesource_id.join(",");
        $this.getSearchData();
      }
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
    getSearchData(){
      var $this = this;
      $this.isFilter = true;
      $this.judgeChartStatus();
      var searchData = $this.searchDataInit();
      if(searchData.source_id&&searchData.starttime&&searchData.endtime&&searchData.type){
        $this.$store.dispatch('ownpush/getOwnChinasourcecountAction', searchData).then(res=>{
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
    },
    // 组装默认类型图表数据
    defaultChartDataClump(res){
      var $this = this;
      // 询盘个数
      var inquiryData = null;
      if($this.selectedType.includes("enquiriesNum")){
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
              inquiryData.chartTitle = "部门组合询盘日期对比月趋势";
            }else{
              inquiryData.chartTitle = "部门组合询盘日期对比日趋势";
            }
            inquiryData.name = "部门组合询盘统计";
          }
        }else{
          // 部门对比
          if($this.selectedData.comparesource_id.length>0){
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
                    itemChart.name="已多选部门"
                  }
                }else{
                  var selectContrastGroupList = [];
                  $this.contrastGroupList.forEach(function(item1){
                    if(item1.isOn){
                      selectContrastGroupList.push(item1);
                    }
                  });
                  itemChart.name=selectContrastGroupList[index-1].name;
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
                inquiryData.mainData.push(itemChart);
              });
            });
            inquiryData.name = "部门询盘统计";
            var compareData = [];
            if($this.selectedData.isMonth){
              var monthxunallnumbercompare=0;
              if(res.monthxuntrendcompare&&res.monthxuntrendcompare.length){
                res.monthxuntrendcompare.forEach(function(item,index){
                  if(item&&item.length>0){
                    item.forEach(function(items,indexs){
                      monthxunallnumbercompare+=items.xunnumber;
                    });
                  }
                });
              }
              inquiryData.nowNumber = numSeparate(monthxunallnumbercompare);
              compareData = res.monthdepartpercentercompare;
              inquiryData.lastNumber = res.lastmonthxunallnumbercompare;
              inquiryData.nowLastNumber = numSeparate(Math.abs(monthxunallnumbercompare - res.lastmonthxunallnumbercompare));
              inquiryData.status = monthxunallnumbercompare - res.lastmonthxunallnumbercompare>0?'up':monthxunallnumbercompare - res.lastmonthxunallnumbercompare<0?'down':'flat';
              inquiryData.avgNumber = numSeparate(parseInt(monthxunallnumbercompare/res.monthxuntrendcompare[0].length));
              inquiryData.historyMaxNumber = numSeparate(res.historymaxnumbermonthcompare[0].number);
              inquiryData.historyMaxNumberDate = res.historymaxnumbermonthcompare[0].yeartime;
              inquiryData.avgTitle = "月平均询盘个数";
              inquiryData.historyTitle = "月历史峰值";
            }else{
              var dayxuntrendcompare=0;
              if(res.dayxuntrendcompare&&res.dayxuntrendcompare.length){
                res.dayxuntrendcompare.forEach(function(item,index){
                  if(item&&item.length>0){
                    item.forEach(function(items,indexs){
                      dayxuntrendcompare+=items.xunnumber;
                    });
                  }
                });
              }
              inquiryData.nowNumber = numSeparate(dayxuntrendcompare);
              compareData = res.departpercentercompare;
              inquiryData.lastNumber = res.lastxunallnumbercompare;
              inquiryData.nowLastNumber = numSeparate(Math.abs(dayxuntrendcompare - res.lastxunallnumbercompare));
              inquiryData.status = dayxuntrendcompare - res.lastxunallnumbercompare>0?'up':dayxuntrendcompare - res.lastxunallnumbercompare<0?'down':'flat';
              inquiryData.avgNumber = numSeparate(parseInt(dayxuntrendcompare/res.dayxuntrendcompare[0].length));
              inquiryData.historyMaxNumber = numSeparate(res.historymaxnumberdaycompare[0].number);
              inquiryData.historyMaxNumberDate = res.historymaxnumberdaycompare[0].xundate;
              inquiryData.avgTitle = "日平均询盘个数";
              inquiryData.historyTitle = "日历史峰值";
            }
            inquiryData.totalChart = [];
            compareData.forEach(function(item){
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
              inquiryData.nowLastNumber = numSeparate(Math.abs(xunallnumber - res.lastmonthxunallnumber));
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
              inquiryData.nowLastNumber = numSeparate(Math.abs(xunallnumber - res.lastxunallnumber));
              inquiryData.status = xunallnumber - res.lastxunallnumber>0?'up':xunallnumber - res.lastxunallnumber<0?'down':'flat';
              inquiryData.avgNumber = numSeparate(parseInt(xunallnumber/res.dayxuntrend.length));
              inquiryData.historyMaxNumber = numSeparate(res.historymaxnumberday[0].number);
              inquiryData.historyMaxNumberDate = res.historymaxnumberday[0].xundate;
              inquiryData.avgTitle = "日平均询盘个数";
              inquiryData.historyTitle = "日历史峰值";
            }
            tongData = groupColor(tongData);
            inquiryData.colorArr.push(tongData[0][0].color);
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
                item.name = "已多选部门"
              }
              item.value = item.xunnumber;
              inquiryData.mainData.push(item);
            });
            // 只有一个部门被选中的情况
            if($this.selectedData.source_id.length==1){
              $this.channelList.forEach(function(item){
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
              inquiryData.name = "部门组合询盘统计";
              if($this.selectedData.isMonth){
                compareData = res.monthdepartpercenter;
                inquiryData.chartTitle = "部门组合询盘月趋势";
              }else{
                compareData = res.departpercenter;
                inquiryData.chartTitle = "部门组合询盘日趋势";
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
              dealScoreData.chartTitle = "部门组合成交积分日期对比月趋势";
            }else{
              dealScoreData.chartTitle = "部门组合成交积分日期对比日趋势";
            }
            dealScoreData.name = "部门组合成交积分统计";
          }
        }else{
          // 部门对比
          if($this.selectedData.comparesource_id.length>0){
            if($this.selectedData.isMonth){
              dealScoreData.chartTitle = "各部门成交积分月趋势对比";
            }else{
              dealScoreData.chartTitle = "各部门成交积分日趋势对比";
            }
            dealScoreData.mainData = [];
            dealScoreData.colorArr = [];
            var chartData = groupColor(res.monthscoretrendcompare);
            chartData.forEach(function(item,index){
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
                    itemChart.name="已多选部门"
                  }
                }else{
                  var selectContrastGroupList = [];
                  $this.contrastGroupList.forEach(function(item1){
                    if(item1.isOn){
                      selectContrastGroupList.push(item1);
                    }
                  });
                  itemChart.name=selectContrastGroupList[index-1].name;
                }
                itemChart.key = item1.date;
                itemChart.value = Math.floor(item1.score*100)/100;
                itemChart.color = item[0].color;
                dealScoreData.mainData.push(itemChart);
              });
            });
            dealScoreData.name = "部门成交积分统计";
            var monthscoreallnumbercompare=0;
            if(res.monthscoretrendcompare&&res.monthscoretrendcompare.length){
              res.monthscoretrendcompare.forEach(function(item,index){
                if(item&&item.length>0){
                  item.forEach(function(items,indexs){
                    monthscoreallnumbercompare+=items.score;
                  });
                }
              });
            }
            dealScoreData.nowNumber = numSeparate(Math.floor(monthscoreallnumbercompare*100)/100);
            dealScoreData.lastNumber = Math.floor(res.lastmonthscoreallnumbercompare*100)/100;
            dealScoreData.nowLastNumber = numSeparate(Math.abs(Math.floor(monthscoreallnumbercompare*100)/100 - Math.floor(res.lastmonthscoreallnumbercompare*100)/100));
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
                item.name = "已多选部门"
              }
              dealScoreData.mainData.push(item);
            });
            dealScoreData.lastNumber = Math.floor(res.lastmonthscoreallnumber*100)/100;
            dealScoreData.nowLastNumber = numSeparate(Math.abs(Math.floor(monthscoreallnumber*100)/100 - Math.floor(res.lastmonthscoreallnumber*100)/100));
            dealScoreData.status = Math.floor(monthscoreallnumber*100)/100 - Math.floor(res.lastmonthscoreallnumber*100)/100>0?'up':Math.floor(monthscoreallnumber*100)/100 - Math.floor(res.lastmonthscoreallnumber*100)/100<0?'down':'flat';
            dealScoreData.avgNumber = numSeparate(Math.floor(monthscoreallnumber/res.monthscoretrend.length*100)/100);
            dealScoreData.historyMaxNumber = numSeparate(Math.floor(res.historymaxscoremonth.length>0?res.historymaxscoremonth[0].score:0*100)/100);
            dealScoreData.historyMaxNumberDate = res.historymaxscoremonth.length>0?res.historymaxscoremonth[0].yeartime:0;
            dealScoreData.avgTitle = "月平均成交积分";
            dealScoreData.historyTitle = "月历史峰值";
            // 只有一个部门被选中的情况
            if($this.selectedData.source_id.length==1){
              $this.channelList.forEach(function(item){
                  if($this.selectedData.isMonth){
                    dealScoreData.chartTitle = "成交积分月趋势";
                  }else{
                    dealScoreData.chartTitle = "成交积分日趋势";
                  }
                  dealScoreData.name = "成交积分统计";
              });
            }else{// 多部门被选中
              if($this.selectedData.isMonth){
                dealScoreData.chartTitle = "部门组合成交积分月趋势";
              }else{
                dealScoreData.chartTitle = "部门组合成交积分日趋势";
              }
              dealScoreData.name = "部门组合成交积分统计"; 
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
      // 消费
      var costCountData = null;
      if($this.selectedType.includes("consumpTion")){
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
          costCountData.dateCompareData = backData.dateCompareData;
          costCountData.colorArr = backData.colorArr;
          if($this.selectedData.source_id.length==1){
            $this.channelList.forEach(function(item){
              if(item.id == $this.selectedData.source_id[0]){
                if($this.selectedData.isMonth){
                  costCountData.chartTitle = item.name+"成本日期对比月趋势";
                }else{
                  costCountData.chartTitle = item.name+"成本日期对比日趋势";
                }
                costCountData.name = item.name+"成本统计";
              }
            });
          }else{
            if($this.selectedData.isMonth){
              costCountData.chartTitle = "部门组合成本日期对比月趋势";
            }else{
              costCountData.chartTitle = "部门组合成本日期对比日趋势";
            }
            
            costCountData.name = "部门组合成本统计";
          }
        }else{
          // 部门对比
          if($this.selectedData.comparesource_id.length>0){
            if($this.selectedData.isMonth){
              costCountData.chartTitle = "各部门成本月趋势对比";
            }else{
              costCountData.chartTitle = "各部门成本日趋势对比";
            }
            costCountData.mainData = [];
            costCountData.colorArr = [];
            var chartData = groupColor(res.monthmoneytrendcompare);
            chartData.forEach(function(item,index){
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
                    itemChart.name="已多选部门"
                  }
                }else{
                  var selectContrastGroupList = [];
                  $this.contrastGroupList.forEach(function(item1){
                    if(item1.isOn){
                      selectContrastGroupList.push(item1);
                    }
                  });
                  itemChart.name=selectContrastGroupList[index-1].name;
                }
                itemChart.key = item1.date;
                itemChart.value = Math.floor(item1.money*10)/10;
                itemChart.color = item[0].color;
                costCountData.mainData.push(itemChart);
              });
            });
            costCountData.name = "部门成本统计";
            var monthmoneytrendcompare=0;
            if(res.monthmoneytrendcompare&&res.monthmoneytrendcompare.length){
              res.monthmoneytrendcompare.forEach(function(item,index){
                if(item&&item.length>0){
                  item.forEach(function(items,indexs){
                    monthmoneytrendcompare+=items.score;
                  });
                }
              });
            }
            costCountData.nowNumber = numSeparate(Math.floor(monthmoneytrendcompare*100)/100);
            costCountData.lastNumber = Math.floor(res.lastmonthmoneyallnumbercompare*100)/100;
            costCountData.nowLastNumber = numSeparate(Math.abs(Math.floor(monthmoneytrendcompare*10)/10 - Math.floor(res.lastmonthmoneyallnumbercompare*10)/10));
            costCountData.status = Math.floor(monthmoneytrendcompare*10)/10 - Math.floor(res.lastmonthmoneyallnumbercompare*10)/10>0?'up':Math.floor(monthmoneytrendcompare*10)/10 - Math.floor(res.lastmonthmoneyallnumbercompare*10)/10<0?'down':'flat';
            costCountData.avgNumber = numSeparate(Math.floor(monthmoneytrendcompare/res.monthmoneytrendcompare[0].length*10)/10);
            costCountData.historyMaxNumber = numSeparate(Math.floor(res.historymaxmoneymonthcompare[0].allmoney*10)/10);
            costCountData.historyMaxNumberDate = res.historymaxmoneymonthcompare[0].yeartime;
            costCountData.avgTitle = "月平均成本";
            costCountData.historyTitle = "月历史峰值";
            costCountData.totalChart = [];
            res.monthdepartmoneypercentercompare.forEach(function(item){
              var itemChart = {};
              itemChart.name = item.departname;
              itemChart.value = Math.floor(item.money*10)/10;
              costCountData.totalChart.push(itemChart);
            });
            costCountData.totalChart = singleArrColor(costCountData.totalChart);
            costCountData.totalChart.sort(sortByDesc("value"));
          }else{
            // 统计
            costCountData.mainData = [];
            costCountData.colorArr = [];
            var monthmoneyallnumber=0;
            if(res.monthmoneytrend&&res.monthmoneytrend.length){
              res.monthmoneytrend.forEach(function(item,index){
                    monthmoneyallnumber+=item.score;
              });
            }
            costCountData.nowNumber = numSeparate(Math.floor(monthmoneyallnumber*10)/10);
            var tongData = groupColor([res.monthmoneytrend]);
            costCountData.colorArr.push(tongData[0][0].color);
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
                item.name = "已多选部门"
              }
              costCountData.mainData.push(item);
            });
            costCountData.lastNumber = Math.floor(res.lastmonthmoneyallnumber*10)/10;
            costCountData.nowLastNumber = numSeparate(Math.abs(Math.floor(monthmoneyallnumber*10)/10 - Math.floor(res.lastmonthmoneyallnumber*10)/10));
            costCountData.status = Math.floor(monthmoneyallnumber*10)/10 - Math.floor(res.lastmonthmoneyallnumber*10)/10>0?'up':Math.floor(monthmoneyallnumber*10)/10 - Math.floor(res.lastmonthmoneyallnumber*10)/10<0?'down':'flat';
            costCountData.avgNumber = numSeparate(Math.floor(monthmoneyallnumber/res.monthmoneytrend*100)/100);
            costCountData.historyMaxNumber = numSeparate(Math.floor(res.historymaxmoneymonth[0].allmoney*10)/10);
            costCountData.historyMaxNumberDate = res.historymaxmoneymonth[0].yeartime;
            costCountData.avgTitle = "月平均成本";
            costCountData.historyTitle = "月历史峰值";
            // 只有一个部门被选中的情况
            if($this.selectedData.source_id.length==1){
              $this.channelList.forEach(function(item){
                  if($this.selectedData.isMonth){
                    costCountData.chartTitle = "成本月趋势";
                  }else{
                    costCountData.chartTitle = "成本日趋势";
                  }
                  costCountData.name = "成本统计"; 
              });
            }else{// 多部门被选中
              if($this.selectedData.isMonth){
                costCountData.chartTitle = "部门组合成本月趋势";
              }else{
                costCountData.chartTitle = "部门组合成本日趋势";
              }
              costCountData.name = "部门组合成本统计";
              costCountData.totalChart = [];
              res.monthdepartmoneypercenter.forEach(function(item){
                var itemChart = {};
                itemChart.name = item.departname;
                itemChart.value = Math.floor(item.money*10)/10;
                costCountData.totalChart.push(itemChart);
              });
              costCountData.totalChart = singleArrColor(costCountData.totalChart);
              costCountData.totalChart.sort(sortByDesc("value"));
            }
          }
        }
        costCountData.totalTitle = "总成本";
        costCountData.unit = "（单位：万元）";
        costCountData.randomStr = randomString(4);
      }
      var defaultChartData = [];
      if(inquiryData){
        defaultChartData.push(inquiryData);
      }
      if(dealScoreData){
        defaultChartData.push(dealScoreData);
      }
      if(costCountData){
        defaultChartData.push(costCountData);
      }
      return defaultChartData;
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
    //组装部门选中名字
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
      if($this.selectedData.source_id.length>0){
        // 基础部门有一个被选中
        if($this.selectedData.source_id.length==1){
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
              if($this.selectedData.comparesource_id.length>0){
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
              if($this.selectedData.comparesource_id.length>0){
                if($this.selectedData.type.length>0){
                  judgeData.pluralGroupTeamCompare = true;
                  // 判断基础部门与对比部门是否有同一个部门被选中
                  $this.selectedData.comparesource_id.forEach(function(item){
                    if($this.selectedData.source_id.includes(item)){
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
    // 重置数据
    resetData(){
      var $this = this;
      $this.tipsInfo="当前部门分析页面，展示为：本年度数据信息。";
      $this.tipsItem="";
      $this.channelList.forEach(function(item,index){
        item.isOn=false;
      });
      $this.contrastList.forEach(function(item,index){
        item.isOn=false;
        item.disabled=false;
      });
      $this.dateDimension.forEach(function(item,index){
        item.isOn=false;
      });
      $this.contrastSourceList.forEach(function(item){
        item.disabled = false;
      });
      $this.groupName = '';
      $this.selectedData.type=[];
      $this.selectedData.dateDefault = $this.getNearDay();
      $this.selectedData.dateContrast = [];
      $this.selectedData.source_id = [];
      $this.selectedData.type = [];
      $this.selectedData.is_compare='';
      $this.selectedData.comparesource_id = [];
      $this.selectedData.is_timecopmare='';
      $this.selectedData.isMonth=false;
      $this.selectedData.isDateCompare=false;
      $this.dateSelected=false;
      $this.groupName = "";
      $this.dateSelected = false;
      $this.isFilter = false,
      $this.isContrastShow = false,
      $this.selectedType=[];
      $this.oldContrastSourceID = "";
      $this.isDefaultPage = true;
      $this.judgeData = {};
      $this.defaultChartData = [];
      $this.getDefaultData();
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
    changeSize(){
      var $this = this;
      $this.boxWidth = $this.$refs.boxPane.offsetWidth -40;
    }
  }
}
</script>



