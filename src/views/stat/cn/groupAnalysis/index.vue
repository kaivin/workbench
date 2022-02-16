<template>
  <div class="page-root scroll-panel group-index" ref="boxPane" v-resize="changeSize">
    <div class="filter-panel" ref="filterbox">
      <div class="filter-list">
        <div class="item-filter flex-box group">
          <div class="filter-title"><span class="txt-title">小组：</span></div>
          <div class="filter-content flex-content">
            <div class="item-list group">
              <div class="item-checkbox" v-bind:class="item.isOn?'active':''" v-if="item.typeid==1" v-for="item in groupList" v-bind:key="item.userid" v-on:click="groupChangeHandler(item.userid)"><i></i><span>{{item.typename}} {{item.groupName}}组</span><b>[{{item.departName}}]</b></div>
            </div>
            <div class="item-list group">
              <div class="item-checkbox" v-bind:class="item.isOn?'active':''" v-if="item.typeid==2" v-for="item in groupList" v-bind:key="item.userid" v-on:click="groupChangeHandler(item.userid)"><i></i><span>{{item.typename}} {{item.groupName}}组</span><b>[{{item.departName}}]</b></div>
            </div>
            <div class="item-list group">
              <div class="item-checkbox" v-bind:class="item.isOn?'active':''" v-if="item.typeid==3||item.typeid==4" v-for="item in groupList" v-bind:key="item.userid" v-on:click="groupChangeHandler(item.userid)"><i></i><span>{{item.typename}} {{item.groupName}}组</span><b>[{{item.departName}}]</b></div>
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
              <div class="item-checkbox" v-bind:class="[selectedData.contrastGroupID.length>0||!dateSelected?'is-disabled':'',selectedData.isDateCompare?'active':'']" v-on:click="dateCompareChangeHandler"><i></i><span>日期对比</span></div>
              <div class="item-date" v-if="selectedData.isDateCompare">
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
              <div class="item-reset" v-if="isFilter"><span v-on:click="resetData">全部重置</span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="filter-tips"><p><i class="svg-i"><svg-icon icon-class="tips" class-name="disabled" /></i>{{tipsInfo}}</p></div>
    </div>
    <div class="contrast-panel flex-box" :class="isFix ? 'contrast-fixed' : ''" :style="'width:'+ boxWidth + 'px' " v-if="!selectedData.isDateCompare&&selectedData.groupID.length>0">
      <div class="title-font"><span class="txt-title">对比项：</span></div>
      <div class="contrast-content flex-content">
        <div class="item-list">
          <div class="item-contrast" v-if="selectedData.groupID.length>0"><span>{{groupName}}</span><i v-on:click="deleteDefaultGroup" class="svg-i"><svg-icon icon-class="close" class-name="disabled" /></i></div>
          <template v-if="selectedData.contrastGroupID.length>0">
            <div class="item-contrast" v-bind:class="'color'+(index+1)" v-if="item.isOn" v-for="(item,index) in contrastGroupList" v-bind:key="item.userid"><span>{{item.typename}} {{item.groupName}}组</span><i v-on:click="deleteContrastGroup(item.userid)" class="svg-i"><svg-icon icon-class="close" class-name="disabled" /></i></div>
          </template>
          <div class="item-button">
            <div class="button-click" v-on:click="toggleContrast"><i class="svg-i"><svg-icon icon-class="s-add" class-name="disabled" /></i><span>添加对比</span></div>
            <div class="group-contrast" v-show="isContrastShow" v-bind:style="{width:contrastWidth+'px'}">
              <div class="item-checkbox" v-bind:class="[item.disabled?'is-disabled':'',item.isOn?'active':'']" v-for="item in contrastGroupList" v-bind:key="item.userid" v-on:click="contrastGroupChangeHandler(item)"><i></i><span>{{item.typename}} {{item.groupName}}组</span><b>[{{item.departName}}]</b></div>
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
      <template v-if="mapChart.length>0" v-for="item in mapChart">
        <map-chart
          :item-data="item" 
          :judge-data="judgeData"
          :is-cn="true"
        ></map-chart>
      </template>
    </div>
  </div>
</template>
<script>
import defaultChart from "../../components/departGroup/defaultChart.vue";
import mapChart from "../../components/departGroup/mapChart.vue";
import {randomString,sortByDesc,groupColor,groupDateColor,singleArrColor,formatDate,numSeparate,pickerDateRangeOptions} from "@/utils/index"
import {MapInterval,TopTenColor} from "@/utils/MapColor"
import { chinaData } from "@/utils/chinaMap";
import { mapGetters } from 'vuex';
export default {
  name: "cnGroupAnalysis",
  components: {
    defaultChart,
    mapChart,
  },
  data() {
    return {
      contrastWidth:200,
      minWidth:"",
      mapRatio:0.75,
      groupList:[],
      contrastGroupList:[],
      pickerDateRangeOptions: pickerDateRangeOptions,
      // pickerDateRangeOptions: {
      //   shortcuts: [{
      //     text: '最近一个月',
      //     onClick(picker) {
      //       const end = new Date();
      //       const start = new Date();
      //       start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      //       end.setTime(end.getTime() + 3600 * 1000 * 24 * 1);
      //       picker.$emit('pick', [start, end]);
      //     }
      //   }, {
      //       text: '上月',
      //       onClick(picker) {
      //         var date = new Date();
      //         var year = date.getFullYear().toString();
      //         //获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
      //         var month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1).toString():(date.getMonth()+1).toString();
      //         var end = year + '/' + month + '/01';
      //         var start = '';
            
      //         if(month == '01'){
      //           start = (parseInt(year) - 1) + '/12/01';
      //         }else{
      //           start = parseInt(month) - 1>9 ? year + '/' + (parseInt(month) - 1)  + '/01':year + '/0' + (parseInt(month) - 1)  + '/01';
      //         }
      //         picker.$emit('pick', [start, end]);
      //       }
      //   }, {
      //     text: '本月',
      //     onClick(picker) {
      //       var date = new Date();
      //       var year = date.getFullYear().toString();
      //       //获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
      //       var month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1).toString():(date.getMonth()+1).toString();
      //       var end = '';
      //       var start = year + '/' + month + '/01';
      //       if(month == '12'){
      //         end = (parseInt(year) + 1) + '/01/01';
      //       }else{
      //         end = parseInt(month) + 1>9 ? year + '/' + (parseInt(month) + 1)  + '/01':year + '/0' + (parseInt(month) + 1)  + '/01';
      //       }
      //       picker.$emit('pick', [start, end]);
      //     }
      //   }]
      // },
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
      dateDimension:[
        {label:"日",value:"day",isOn:false},
        {label:"月",value:"month",isOn:false},
      ],
      contrastList:[
        {label:"询盘趋势",id:1,value:"inquiryCount",isOn:false,disabled:false},
        {label:"询盘地区",id:4,value:"inquiryCountRegion",isOn:false,disabled:false},
        {label:"成交积分趋势",id:2,value:"dealScore",isOn:false,disabled:true},
        {label:"成交积分地区",id:5,value:"dealScoreRegion",isOn:false,disabled:true},
        {label:"产品分析",id:6,value:"product",isOn:false,disabled:true},
      ],
      channelType:"",
      groupName:"",
      dateSelected:false,
      isFilter:false,
      tipsInfo:"当前小组分析页面，展示为：近30天数据信息。",
      tipsItem:"",
      isContrastShow:false,
      selectedData:{
        dateDefault:[],
        dateContrast:[],
        groupID:[],
        contrastGroupID:[],
        isMonth:false,
        isDateCompare:false,
        type:[],
      },
      selectedType:[],
      oldContrastGroupID:"",
      isDefaultPage:true,
      judgeData:{},
      defaultChartData:[],
      mapChart:[],
      isFix:false,
      boxWidth:0
    };
  },
  computed: {
    ...mapGetters([
      'sidebar',
    ]),
  },
  created() {
    var $this = this;
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
      $this.boxWidth = $this.$refs.boxPane.offsetWidth - 48; 
      $this.$refs.boxPane.addEventListener('scroll', $this.getScroll);
    }
    window.onresize = () => {
      return (() => {
        if($this.$refs.boxPane){
          $this.minWidth = $this.$refs.boxPane.offsetWidth; 
          $this.boxWidth = $this.$refs.boxPane.offsetWidth - 48;
        }
      })()
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
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.data.length>0){
          var permitData = [];
          res.data.forEach(function(item,index){
            permitData.push(item.action_route);
          });
          if(permitData.includes('Api_chinagroupcountdefault')){
            $this.initData()
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
    // 默认展示数据
    initData() {
      var $this = this;
      $this.$store.dispatch('teamMember/cnGroupDefaultAction', null).then(response=>{
          if(response){
            if(response.status){
                var groupList = response.group;
                var typeArr = []
                groupList.forEach(function(item,index){
                  item.departName = item.departname.slice(2);
                  item.groupName = item.othername.split("-")[1];
                  item.isOn = false;
                  item.disabled = false;
                  typeArr.push(item.typename);
                });
                var typeObj = typeArr.reduce((obj, name) => { 
                  if (name in obj) {
                    obj[name]++
                  } else {
                    obj[name]=1
                  }
                  return obj
                }, {})
                var typeList = []
                for(let i in typeObj){
                  var itemData = {};
                  itemData.key = i;
                  itemData.value = typeObj[i];
                  typeList.push(itemData);
                }
                $this.channelType = typeList;
                $this.groupList = JSON.parse(JSON.stringify(groupList));
                $this.contrastGroupList = JSON.parse(JSON.stringify(groupList));
                var semData = {};
                semData.name = "SEM 询盘总数据";
                semData.totalTitle = "总询盘数量";
                semData.chartTitle = "SEM 小组近30天询盘趋势";
                semData.avgTitle = "日平均询盘个数";
                semData.historyTitle = "日历史峰值";
                semData.unit = "（单位：个）";
                semData.chartType = "area";
                semData.nowNumber = numSeparate(response.semallnumber);
                semData.lastNumber = response.lastsemallnumber;
                semData.nowLastNumber = numSeparate(Math.abs(response.semallnumber - response.lastsemallnumber));
                semData.status = response.semallnumber - response.lastsemallnumber>0?'up':response.semallnumber - response.lastsemallnumber<0?'down':'flat';
                semData.avgNumber = numSeparate(parseInt(response.semavgmonth));
                semData.historyMaxNumber = numSeparate(response.semhistorymaxnumber[0].effectivenumber);
                semData.historyMaxNumberDate = response.semhistorymaxnumber[0].xundate;
                semData.mainData = [];
                semData.totalChart = [];
                semData.colorArr = [];
                semData.randomStr = randomString(4);
                var semTong = groupColor(response.semtong);
                semTong.forEach(function(item,index){
                  var itemChart = {};
                  var newItemArr=[];
                  itemChart.name = item[0].name+"组";
                  itemChart.color = item[0].color;
                  semData.colorArr.push(item[0].color);
                  itemChart.value = 0;
                  item.forEach(function(item1){
                    item1.key = item1.date+" "+item1.week;
                    item1.value = item1.xunnumber;
                    item1.name = item1.name+"组";
                    item1.color = item1.color;
                    newItemArr.push(item1);
                    itemChart.value += item1.xunnumber;
                  });
                  semData.mainData.push(newItemArr);
                  semData.totalChart.push(itemChart);
                });
                semData.totalChart.sort(sortByDesc("value"));
                var seoData = {};
                seoData.name = "SEO 询盘总数据";
                seoData.totalTitle = "总询盘数量";
                seoData.chartTitle = "SEO 小组近30天询盘趋势";
                seoData.avgTitle = "日平均询盘个数";
                seoData.historyTitle = "日历史峰值";
                seoData.unit = "（单位：个）";
                seoData.chartType = "area";
                seoData.nowNumber = numSeparate(response.seoallnumber);
                seoData.lastNumber = response.lastseoallnumber;
                seoData.nowLastNumber = numSeparate(Math.abs(response.seoallnumber - response.lastseoallnumber));
                seoData.status = response.seoallnumber - response.lastseoallnumber>0?'up':response.seoallnumber - response.lastseoallnumber<0?'down':'flat';
                seoData.avgNumber = numSeparate(parseInt(response.seoavgmonth));
                seoData.historyMaxNumber = numSeparate(response.seohistorymaxnumber[0].effectivenumber);
                seoData.historyMaxNumberDate = response.seohistorymaxnumber[0].xundate;
                seoData.mainData = [];
                seoData.totalChart = [];
                seoData.colorArr = [];
                seoData.randomStr = randomString(4);
                var seoTong = groupColor(response.seotong);
                seoTong.forEach(function(item){
                  var itemChart = {};
                  var newItemArr=[];
                  itemChart.name = item[0].name+"组";
                  itemChart.color = item[0].color;
                  seoData.colorArr.push(item[0].color);
                  itemChart.value = 0;
                  item.forEach(function(item1){
                    item1.key = item1.date+" "+item1.week;
                    item1.value = item1.xunnumber;
                    item1.name = item1.name+"组";
                    item1.color = item1.color;
                    newItemArr.push(item1);
                    itemChart.value += item1.xunnumber;
                  });
                  seoData.mainData.push(newItemArr);
                  seoData.totalChart.push(itemChart);
                });
                seoData.totalChart.sort(sortByDesc("value"));
                var snsData = {};
                snsData.name = "SNS 询盘总数据";
                snsData.totalTitle = "总询盘数量";
                snsData.chartTitle = "SNS 小组近30天询盘趋势";
                snsData.avgTitle = "日平均询盘个数";
                snsData.historyTitle = "日历史峰值";
                snsData.unit = "（单位：个）";
                snsData.chartType = "area";
                snsData.nowNumber = numSeparate(response.snsallnumber);
                snsData.lastNumber = response.lastsnsallnumber;
                snsData.nowLastNumber = numSeparate(Math.abs(response.snsallnumber - response.lastsnsallnumber));
                snsData.status = response.snsallnumber - response.lastsnsallnumber>0?'up':response.snsallnumber - response.lastsnsallnumber<0?'down':'flat';
                snsData.avgNumber = numSeparate(parseInt(response.snsavgmonth));
                snsData.historyMaxNumber = numSeparate(response.snshistorymaxnumber[0].effectivenumber);
                snsData.historyMaxNumberDate = response.snshistorymaxnumber[0].xundate;
                snsData.mainData = [];
                snsData.totalChart = [];
                snsData.colorArr = [];
                snsData.randomStr = randomString(4);
                var snsTong = groupColor(response.snstong);
                snsTong.forEach(function(item){
                  var itemChart = {};
                  var newItemArr=[];
                  itemChart.name = item[0].name+"组";
                  itemChart.color = item[0].color;
                  snsData.colorArr.push(item[0].color);
                  itemChart.value = 0;
                  item.forEach(function(item1){
                    item1.key = item1.date+" "+item1.week;
                    item1.value = item1.xunnumber;
                    item1.name = item1.name+"组";
                    item1.color = item1.color;
                    newItemArr.push(item1);
                    itemChart.value += item1.xunnumber;
                  });
                  snsData.mainData.push(newItemArr);
                  snsData.totalChart.push(itemChart);
                });
                snsData.totalChart.sort(sortByDesc("value"));
                $this.defaultChartData = [semData,seoData,snsData];
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
                $this.$router.push({path:`/login?redirect=${$this.$router.currentRoute.fullPath}`});
              }
            }
          }
      });
    },
    // 小组点击事件
    groupChangeHandler(id){
      var $this = this;
      var groupList = $this.groupList;
      var selectedGroupID = [];
      groupList.forEach(function(item,index){
        if(item.userid == id){
          item.isOn = !item.isOn;
        }
        if(item.isOn){
          selectedGroupID.push(item.userid);
        }
      });
      $this.groupList = groupList;
      $this.selectedData.groupID = selectedGroupID;
      // 日期维度未选择的情况下，小组选中后，需要默认将日维度选中
      if(!$this.dateSelected){
        $this.dateDimension.forEach(function(item,index){
          if(index==0){
            item.isOn = true;
            $this.dateSelected = true;
          }
        });
      }
      // 小组有被选中的，且默认时间是空的情况下，需要给默认时间一个默认时间范围
      if($this.selectedData.groupID.length>0&&(!$this.selectedData.dateDefault||$this.selectedData.dateDefault.length==0)){
        if($this.selectedData.isMonth){
          $this.selectedData.dateDefault = $this.getNearMonth();
        }else{
          $this.selectedData.dateDefault = $this.getNearDay();
        }
      }
      // 初始第一次小组被选中（即此时只有一个小组被选中），且分析项没有被选中的情况下，需要默认选中询盘个数与询盘地区分析
      if($this.selectedData.groupID.length==1&&$this.selectedData.type.length==0){
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
            if(item.value=="inquiryCount"||item.value=="inquiryCountRegion"){
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
      // 小组有被选中的，且只有一个小组被选中的情况下，对比小组中，当前被选中小组需被禁用不可选（不能自己和自己在小组维度比）,小组选中超过1个或没有被选中的，则对比小组不需要有禁用状态
      if($this.selectedData.groupID.length==1){
        var contrastGroupList = $this.contrastGroupList;
        contrastGroupList.forEach(function(item){
          if(item.userid == $this.selectedData.groupID[0]){
            item.disabled = true;
          }
        });
        $this.contrastGroupList = contrastGroupList;
      }else{
        var contrastGroupList = $this.contrastGroupList;
        contrastGroupList.forEach(function(item){
          item.disabled = false;
        });
        $this.contrastGroupList = contrastGroupList;
      }
      $this.getGroupName();
      $this.getSearchData();
    },
    //组装小组选中名字
    getGroupName(){
      var $this = this;
      var groupList = $this.groupList;
      var groupName = "";
      $this.channelType.forEach(function(item,index){
        var itemArr = [];
        var itemOn = 0;
        groupList.forEach(function(item1,index1){
          if(item.key == item1.typename){
            itemArr.push(item1)
          }
        });
        itemArr.forEach(function(item2,index2){
          if(item2.isOn){
            itemOn++;
          }
        });
        if(itemOn==0){
          groupName+="";
        }else if(itemOn==item.value){
          if(groupName == ""){
            groupName += item.key+" 渠道";
          }else{
            groupName += " + " + item.key+" 渠道";
          }
        }else{
          var selectedArr = [];
          var teamName = [];
          itemArr.forEach(function(item2,index2){
            if(item2.isOn){
              selectedArr.push(item2);
            }
          });
          selectedArr.forEach(function(item3,index3){
            teamName.push(item3.groupName);
          });
          var teamNameStr = "";
          if(teamName.length>1){
            teamNameStr = "(" + teamName.join(" + ")+")";
          }else{
            teamNameStr = teamName[0];
          }
          if(groupName == ""){
            groupName += item.key+" "+ teamNameStr+"组";
          }else{
            groupName += " + " + item.key+" "+ teamNameStr+"组";
          }
        }
      });
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
        // 切换日期维度，对比时间清空，默认时间在有小组选中的情况下，需要给一个默认时间范围
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
            if(item.value=="dealScore"||item.value=="dealScoreRegion"||item.value=="product"){
              item.isOn = false;
              item.disabled = true;
            }else{
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
      // 只有在对比小组没有被选中的，此时日期对比才是非禁用状态，可点击的
      if($this.selectedData.contrastGroupID.length==0&&$this.dateSelected){
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
    // 添加对比小组点击事件
    toggleContrast(){
      this.isContrastShow = true;
      this.contrastWidth = 200;
    },
    // 对比小组点击事件
    contrastGroupChangeHandler(obj){
      var $this = this;
      if(!obj.disabled){
        var selectedContrastGroupID = [];
        var contrastGroupList = $this.contrastGroupList;
        contrastGroupList.forEach(function(item,index){
          if(item.userid == obj.userid){
            if(item.isOn){
              item.isOn = false;
              if($this.contrastWidth>200){
                $this.contrastWidth -= 130;
              }
            }else{
              item.isOn = true;
              $this.contrastWidth += 130;
            }
          }
          if(item.isOn){
            selectedContrastGroupID.push(item.userid);
          }
        });
        $this.selectedData.contrastGroupID = selectedContrastGroupID;
        $this.contrastGroupList = contrastGroupList;
      }
    },
    // 对比小组添加确定事件
    saveContrastGroup(){
      var $this = this;
      $this.isContrastShow = !$this.isContrastShow;
      if($this.oldContrastGroupID!=$this.selectedData.contrastGroupID.join(",")){
        $this.oldContrastGroupID = $this.selectedData.contrastGroupID.join(",");
        $this.getSearchData();
      }
    },
    // 基础小组删除点击事件
    deleteDefaultGroup(){
      var $this = this;
      // 基础小组被删除，则对比小组选中状态全部清空，基础小组选中状态全部清空，页面数据清空
      var groupList = $this.groupList;
      groupList.forEach(function(item,index){
        item.isOn = false;
      });
      $this.groupList = groupList;
      $this.selectedData.groupID = [];
      $this.oldContrastGroupID = "";
      $this.groupName = "";
      var contrastGroupList = $this.contrastGroupList;
      contrastGroupList.forEach(function(item,index){
        item.isOn = false;
      });
      $this.contrastGroupList = contrastGroupList;
      $this.selectedData.contrastGroupID = [];
      $this.clearData();
    },
    // 对比小组删除点击事件
    deleteContrastGroup(id){
      var $this = this;
      var contrastGroupList = $this.contrastGroupList;
      var selectedContrastGroupID = [];
      contrastGroupList.forEach(function(item,index){
        if(item.userid == id){
          item.isOn = false;
        }
        if(item.isOn){
          selectedContrastGroupID.push(item.userid);
        }
      });
      $this.contrastGroupList = contrastGroupList;
      $this.selectedData.contrastGroupID = selectedContrastGroupID;
      $this.getSearchData();
    },
    // 重置数据
    resetData(){
      var $this = this;
      if($this.$route.query.type){
        $this.$router.push({path:'/stat/cn/groupAnalysis'});
      }else{
        $this.channelType = "";
        $this.groupName = "";
        $this.dateSelected = false;
        $this.isFilter = false,
        $this.tipsInfo="当前小组分析页面，展示为：近30天数据信息。";
        $this.tipsItem="";
        $this.isContrastShow=false;
        $this.selectedData.dateDefault = [];
        $this.selectedData.dateContrast = [];
        $this.selectedData.groupID = [];
        $this.selectedData.contrastGroupID = [];
        $this.selectedData.isMonth = false;
        $this.selectedData.isDateCompare = false;
        $this.selectedData.type = [];
        $this.selectedType = [];
        $this.oldContrastGroupID = "";
        $this.isDefaultPage = true;
        $this.judgeData = {};
        $this.defaultChartData = [];
        $this.mapChart = [];
        $this.dateDimension.forEach(function(item){
          item.isOn = false;
        });
        $this.contrastList.forEach(function(item){
          item.isOn = false;
          if(item.value=="inquiryCount"||item.value=="inquiryCountRegion"){
            item.disabled = false;
          }else{
            item.disabled = true;
          }
        });
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
      end.setTime(end.getTime());
      var startYear = start.getFullYear();
      var startMonth = start.getMonth() +1;
      var startDay = start.getDate();
      var endYear = end.getFullYear();
      var endMonth = end.getMonth() + 1;
      // var endDay = end.getDate()-1;
      var endDay = end.getDate();
      startMonth = startMonth<10?'0'+startMonth:startMonth;
      startDay = startDay<10?'0'+startDay:startDay;
      endMonth = endMonth<10?'0'+endMonth:endMonth;
      endDay = endDay<10?'0'+endDay:endDay;
      var startDate = startYear+"/"+startMonth+"/"+startDay;
      var endDate = endYear+"/"+endMonth+"/"+endDay;
      return [startDate,endDate];
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
      if($this.selectedData.groupID.length>0){
        searchData.userid = $this.selectedData.groupID;
      }
      if($this.selectedData.type.length>0){
        searchData.type = $this.selectedData.type;
      }
      if($this.selectedData.contrastGroupID.length>0){
        searchData.compareuser_id = $this.selectedData.contrastGroupID
      }
      searchData.is_compare = $this.selectedData.contrastGroupID.length>0?2:1;
      searchData.is_timecopmare = $this.selectedData.isDateCompare&&$this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0?2:1;
      if($this.selectedData.groupID.length==0){
        $this.tipsInfo = "请选择数据分析的小组";
      }else{
        if(!$this.selectedData.dateDefault||$this.selectedData.dateDefault.length==0){
          $this.tipsInfo = "请选择数据分析的日期范围";
        }else{
          if($this.selectedData.type.length==0){
            $this.tipsInfo = "请选择数据分析的分析项";
          }else{
            $this.dateInfoTips();
            if(searchData.is_timecopmare==2&&searchData.starttime&&searchData.endtime){
              $this.tipsInfo = "当前小组分析页面，展示为："+$this.selectedData.dateDefault[0]+" ~ " + $this.selectedData.dateDefault[1]+" 与 "+$this.selectedData.dateContrast[0]+" ~ "+$this.selectedData.dateContrast[1]+" 的日期对比数据信息。"+$this.tipsItem;
            }
            if(searchData.is_timecopmare==1&&searchData.starttime&&searchData.endtime){
              $this.tipsInfo = "当前小组分析页面，展示为："+$this.selectedData.dateDefault[0]+" ~ " + $this.selectedData.dateDefault[1]+" 的数据信息。"+$this.tipsItem;
            }
          }
        }
      }
      return searchData;
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
    // 获取筛选条件下的数据
    getSearchData(){
      var $this = this;
      $this.isFilter = true;
      $this.judgeChartStatus();
      var searchData = $this.searchDataInit();
      $this.clearData();
      if(searchData.userid&&searchData.starttime&&searchData.endtime&&searchData.type){
        $this.$store.dispatch('teamMember/cnGroupFilterAction', searchData).then(res=>{
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
      var mapChartData = $this.mapChartDataClump(res);
      var productData = $this.productDataClump(res);
      if(productData){
        mapChartData[0].push(productData);
      }
      $this.defaultChartData = defaultChartData;
      $this.mapChart = mapChartData;
    },
    // 组装默认类型图表数据
    defaultChartDataClump(res){
      var $this = this;
      var inquiryData = null;
      // 询盘趋势
      if($this.selectedType.includes("inquiryCount")){
        inquiryData = {};
        inquiryData.chartType = "area";
        // 时间对比
        if($this.selectedData.isDateCompare&&$this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
          var dateData = [];
          // 月维度
          if($this.selectedData.isMonth){
            inquiryData.nowNumber = numSeparate(res.monthxunallnumber);
            dateData = res.selfmonthxuncompare;
          }else{
            // 日维度
            inquiryData.nowNumber = numSeparate(res.xunallnumber);
            dateData = res.selfdayxuncompare;
          }
          var backData = $this.dateCompare(dateData,'xunnumber');
          inquiryData.mainData = backData.mainData;
          inquiryData.dateCompareData = backData.dateCompareData;
          inquiryData.colorArr = backData.colorArr;
          if($this.selectedData.groupID.length==1){
            $this.groupList.forEach(function(item){
              if(item.userid == $this.selectedData.groupID[0]){
                if($this.selectedData.isMonth){
                  inquiryData.chartTitle = item.departName+"-"+item.groupName+"组询盘日期对比月趋势";
                }else{
                  inquiryData.chartTitle = item.departName+"-"+item.groupName+"组询盘日期对比日趋势";
                }
                inquiryData.name = item.departName+"-"+item.groupName+"组询盘统计";
              }
            });
          }else{
            if($this.selectedData.isMonth){
              inquiryData.chartTitle = "小组组合询盘日期对比月趋势";
            }else{
              inquiryData.chartTitle = "小组组合询盘日期对比日趋势";
            }
            inquiryData.name = "小组组合询盘统计";
          }
        }else{
          // 小组对比
          if($this.selectedData.contrastGroupID.length>0){
            if($this.selectedData.isMonth){
              inquiryData.chartTitle = "各小组询盘月趋势对比";
            }else{
              inquiryData.chartTitle = "各小组询盘日趋势对比";
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
                  if($this.selectedData.groupID.length==1){
                    $this.groupList.forEach(function(item1){
                      if(item1.isOn){
                        itemChart.name = item1.departName+"-"+item1.groupName+"组";
                      }
                    });
                  }else{
                    itemChart.name="已多选小组"
                  }
                }else{
                  var selectContrastGroupList = [];
                  $this.contrastGroupList.forEach(function(item1){
                    if(item1.isOn){
                      selectContrastGroupList.push(item1);
                    }
                  });
                  itemChart.name=selectContrastGroupList[index-1].departName+"-"+selectContrastGroupList[index-1].groupName+"组";
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
            inquiryData.name = "小组询盘统计";
            var compareData = [];
            if($this.selectedData.isMonth){
              inquiryData.nowNumber = numSeparate(res.monthxunallnumbercompare);
              compareData = res.monthdepartpercentercompare;
              inquiryData.lastNumber = res.lastmonthxunallnumbercompare;
              inquiryData.nowLastNumber = numSeparate(Math.abs(res.monthxunallnumbercompare - res.lastmonthxunallnumbercompare));
              inquiryData.status = res.monthxunallnumbercompare - res.lastmonthxunallnumbercompare>0?'up':res.monthxunallnumbercompare - res.lastmonthxunallnumbercompare<0?'down':'flat';
              inquiryData.avgNumber = numSeparate(parseInt(res.monthxunallnumbercompare/res.monthxuntrendcompare[0].length));
              inquiryData.historyMaxNumber = numSeparate(res.historymaxnumbermonthcompare[0].number);
              inquiryData.historyMaxNumberDate = res.historymaxnumbermonthcompare[0].yeartime;
              inquiryData.avgTitle = "月平均询盘个数";
              inquiryData.historyTitle = "月历史峰值";
            }else{
              inquiryData.nowNumber = numSeparate(res.xunallnumbercompare);
              compareData = res.departpercentercompare;
              inquiryData.lastNumber = res.lastxunallnumbercompare;
              inquiryData.nowLastNumber = numSeparate(Math.abs(res.xunallnumbercompare - res.lastxunallnumbercompare));
              inquiryData.status = res.xunallnumbercompare - res.lastxunallnumbercompare>0?'up':res.xunallnumbercompare - res.lastxunallnumbercompare<0?'down':'flat';
              inquiryData.avgNumber = numSeparate(parseInt(res.xunallnumbercompare/res.dayxuntrendcompare[0].length));
              inquiryData.historyMaxNumber = numSeparate(res.historymaxnumberdaycompare[0].number);
              inquiryData.historyMaxNumberDate = res.historymaxnumberdaycompare[0].xundate;
              inquiryData.avgTitle = "日平均询盘个数";
              inquiryData.historyTitle = "日历史峰值";
            }
            inquiryData.totalChart = [];
            compareData.forEach(function(item){
              var itemChart = {};
              if(item.departname.indexOf("组")!=-1){
                itemChart.name = item.departname;
              }else{
                itemChart.name = item.departname+"组";
              }
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
              inquiryData.nowNumber = numSeparate(res.monthxunallnumber);
              tongData.push(res.monthxuntrend);
              inquiryData.lastNumber = res.lastmonthxunallnumber;
              inquiryData.nowLastNumber = numSeparate(Math.abs(res.monthxunallnumber - res.lastmonthxunallnumber));
              inquiryData.status = res.monthxunallnumber - res.lastmonthxunallnumber>0?'up':res.monthxunallnumber - res.lastmonthxunallnumber<0?'down':'flat';
              inquiryData.avgNumber = numSeparate(parseInt(res.monthavgxun));
              inquiryData.historyMaxNumber = numSeparate(res.historymaxnumbermonth[0].number);
              inquiryData.historyMaxNumberDate = res.historymaxnumbermonth[0].yeartime;
              inquiryData.avgTitle = "月平均询盘个数";
              inquiryData.historyTitle = "月历史峰值";
            }else{
              inquiryData.nowNumber = numSeparate(res.xunallnumber);
              tongData.push(res.dayxuntrend);
              // 日维度
              inquiryData.lastNumber = res.lastxunallnumber;
              inquiryData.nowLastNumber = numSeparate(Math.abs(res.xunallnumber - res.lastxunallnumber));
              inquiryData.status = res.xunallnumber - res.lastxunallnumber>0?'up':res.xunallnumber - res.lastxunallnumber<0?'down':'flat';
              inquiryData.avgNumber = numSeparate(parseInt(res.avgxunnumber));
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
              item.value = item.xunnumber;
              if($this.selectedData.groupID.length==1){
                $this.groupList.forEach(function(item1){
                  if(item1.userid == $this.selectedData.groupID[0]){
                    item.name = item1.departName+"-"+item1.groupName+"组";
                  }
                });
              }else{
                item.name = "已多选小组"
              }
              newItemArr.push(item);
            });
            inquiryData.mainData.push(newItemArr);
            // 只有一个小组被选中的情况
            if($this.selectedData.groupID.length==1){
              $this.groupList.forEach(function(item){
                if(item.userid == $this.selectedData.groupID[0]){
                  if($this.selectedData.isMonth){
                    inquiryData.chartTitle = "询盘月趋势";
                  }else{
                    inquiryData.chartTitle = "询盘日趋势";
                  }
                  inquiryData.name = "询盘统计";
                }
              });
            }else{// 多小组被选中
              inquiryData.name = "小组组合询盘统计";
              inquiryData.totalChart = [];
              var compareData = [];
              if($this.selectedData.isMonth){
                compareData = res.monthdepartpercenter;
                inquiryData.chartTitle = "小组组合询盘月趋势";
                
              }else{
                compareData = res.departpercenter;
                inquiryData.chartTitle = "小组组合询盘日趋势";
              }
              compareData.forEach(function(item){
                var itemChart = {};
                if(item.departname.indexOf("组")!=-1){
                  itemChart.name = item.departname;
                }else{
                  itemChart.name = item.departname+"组";
                }
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
      // 成交积分趋势
      var dealScoreData = null;
      if($this.selectedType.includes("dealScore")){
        dealScoreData = {};
        dealScoreData.chartType = "line";
        // 时间对比
        if($this.selectedData.isDateCompare&&$this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
          dealScoreData.nowNumber = numSeparate(res.monthscoreallnumber);
          var backData = $this.dateCompare(res.selfmonthscoretrend,'score');
          dealScoreData.mainData = backData.mainData;
          dealScoreData.dateCompareData = backData.dateCompareData;
          dealScoreData.colorArr = backData.colorArr;
          if($this.selectedData.groupID.length==1){
            $this.groupList.forEach(function(item){
              if(item.userid == $this.selectedData.groupID[0]){
                if($this.selectedData.isMonth){
                  dealScoreData.chartTitle = item.departName+"-"+item.groupName+"组成交积分日期对比月趋势";
                }else{
                  dealScoreData.chartTitle = item.departName+"-"+item.groupName+"组成交积分日期对比日趋势";
                }
                dealScoreData.name = item.departName+"-"+item.groupName+"组成交积分统计";
              }
            });
          }else{
            if($this.selectedData.isMonth){
              dealScoreData.chartTitle = "小组组合成交积分日期对比月趋势";
            }else{
              dealScoreData.chartTitle = "小组组合成交积分日期对比日趋势";
            }
            dealScoreData.name = "小组组合成交积分统计";
          }
        }else{
          // 小组对比
          if($this.selectedData.contrastGroupID.length>0){
            if($this.selectedData.isMonth){
              dealScoreData.chartTitle = "各小组成交积分月趋势对比";
            }else{
              dealScoreData.chartTitle = "各小组成交积分日趋势对比";
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
                  if($this.selectedData.groupID.length==1){
                    $this.groupList.forEach(function(item1){
                      if(item1.isOn){
                        itemChart.name = item1.departName+"-"+item1.groupName+"组";
                      }
                    });
                  }else{
                    itemChart.name="已多选小组"
                  }
                }else{
                  var selectContrastGroupList = [];
                  $this.contrastGroupList.forEach(function(item1){
                    if(item1.isOn){
                      selectContrastGroupList.push(item1);
                    }
                  });
                  itemChart.name=selectContrastGroupList[index-1].departName+"-"+selectContrastGroupList[index-1].groupName+"组";
                }
                itemChart.key = item1.date;
                itemChart.value = Math.floor(item1.score*100)/100;
                itemChart.color = item[0].color;
                newItemArr.push(itemChart);                
              });
              dealScoreData.mainData.push(newItemArr);
            });
            dealScoreData.name = "小组成交积分统计";
            dealScoreData.nowNumber = numSeparate(Math.floor(res.monthscoreallnumbercompare*100)/100);
            dealScoreData.lastNumber = Math.floor(res.lastmonthscoreallnumbercompare*100)/100;
            dealScoreData.nowLastNumber = numSeparate(Math.abs(Math.floor(res.monthscoreallnumbercompare*100)/100 - Math.floor(res.lastmonthscoreallnumbercompare*100)/100).toFixed(2)*1);
            dealScoreData.status = Math.floor(res.monthscoreallnumbercompare*100)/100 - Math.floor(res.lastmonthscoreallnumbercompare*100)/100>0?'up':Math.floor(res.monthscoreallnumbercompare*100)/100 - Math.floor(res.lastmonthscoreallnumbercompare*100)/100<0?'down':'flat';
            dealScoreData.avgNumber = numSeparate(Math.floor(res.monthscoreallnumbercompare/res.monthscoretrendcompare[0].length*100)/100);
            dealScoreData.historyMaxNumber = numSeparate(Math.floor(res.historymaxscoremonthcompare[0].score*100)/100);
            dealScoreData.historyMaxNumberDate = res.historymaxscoremonthcompare[0].yeartime;
            dealScoreData.avgTitle = "月平均成交积分";
            dealScoreData.historyTitle = "月历史峰值";
            dealScoreData.totalChart = [];
            res.monthdepartscorepercentercompare.forEach(function(item){
              var itemChart = {};
              if(item.departname.indexOf("组")!=-1){
                itemChart.name = item.departname;
              }else{
                itemChart.name = item.departname+"组";
              }
              itemChart.value = Math.floor(item.score*100)/100;
              dealScoreData.totalChart.push(itemChart);
            });
            dealScoreData.totalChart = singleArrColor(dealScoreData.totalChart);
            dealScoreData.totalChart.sort(sortByDesc("value"));
          }else{
            // 统计
            dealScoreData.mainData = [];
            dealScoreData.colorArr = [];
            dealScoreData.nowNumber = numSeparate(Math.floor(res.monthscoreallnumber*100)/100);
            var tongData = groupColor([res.monthscoretrend]);
            dealScoreData.colorArr.push(tongData[0][0].color);
            var newItemArr=[];
            tongData[0].forEach(function(item,index){
              item.key = item.date;
              item.value = Math.floor(item.score*100)/100;
              if($this.selectedData.groupID.length==1){
                $this.groupList.forEach(function(item1){
                  if(item1.userid == $this.selectedData.groupID[0]){
                    item.name = item1.departName+"-"+item1.groupName+"组";
                  }
                });
              }else{
                item.name = "已多选小组"
              }
              newItemArr.push(item);
            });
            dealScoreData.mainData.push(newItemArr);
            dealScoreData.lastNumber = Math.floor(res.lastmonthscoreallnumber*100)/100;
            dealScoreData.nowLastNumber = numSeparate(Math.abs(Math.floor(res.monthscoreallnumber*100)/100 - Math.floor(res.lastmonthscoreallnumber*100)/100).toFixed(2)*1);
            dealScoreData.status = Math.floor(res.monthscoreallnumber*100)/100 - Math.floor(res.lastmonthscoreallnumber*100)/100>0?'up':Math.floor(res.monthscoreallnumber*100)/100 - Math.floor(res.lastmonthscoreallnumber*100)/100<0?'down':'flat';
            dealScoreData.avgNumber = numSeparate(Math.floor(res.monthscoreavgxun*100)/100);
            dealScoreData.historyMaxNumber = numSeparate(Math.floor(res.historymaxscoremonth[0].score*100)/100);
            dealScoreData.historyMaxNumberDate = res.historymaxscoremonth[0].yeartime;
            dealScoreData.avgTitle = "月平均成交积分";
            dealScoreData.historyTitle = "月历史峰值";
            // 只有一个小组被选中的情况
            if($this.selectedData.groupID.length==1){
              $this.groupList.forEach(function(item){
                if(item.userid == $this.selectedData.groupID[0]){
                  if($this.selectedData.isMonth){
                    dealScoreData.chartTitle = "成交积分月趋势";
                  }else{
                    dealScoreData.chartTitle = "成交积分日趋势";
                  }
                  dealScoreData.name = "成交积分统计";

                }
              });
            }else{// 多小组被选中
              if($this.selectedData.isMonth){
                dealScoreData.chartTitle = "小组组合成交积分月趋势";
              }else{
                dealScoreData.chartTitle = "小组组合成交积分日趋势";
              }
              dealScoreData.name = "小组组合成交积分统计";
              dealScoreData.totalChart = [];
              res.monthdepartscorepercenter.forEach(function(item){
                var itemChart = {};
                if(item.departname.indexOf("组")!=-1){
                  itemChart.name = item.departname;
                }else{
                  itemChart.name = item.departname+"组";
                }
                itemChart.value = Math.floor(item.score*100)/100;
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
      var defaultChartData = [];
      if(inquiryData){
        defaultChartData.push(inquiryData);
      }
      if(dealScoreData){
        defaultChartData.push(dealScoreData);
      }
      return defaultChartData;
    },
    // 组装地图类型图表数据
    mapChartDataClump(res){
      var $this = this;
      var inquiryMapData = null;
      // 询盘地图
      if($this.selectedType.includes("inquiryCountRegion")){
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
          if($this.selectedData.groupID.length==1){
            $this.groupList.forEach(function(item){
              if(item.isOn){
                title = item.departName+"-"+item.groupName+"组";
              }
            });
          }else{
            title = "已多选小组";
          }
          var mapWidth = parseInt(($this.minWidth-38)/2*0.7)-60;
          var mapHeight = parseInt(mapWidth*$this.mapRatio)+30;
          itemMapChart0.title = title+"（"+$this.selectedData.dateDefault[0]+" ~ "+$this.selectedData.dateDefault[1]+"）";
          itemMapChart0.mapData = chinaData(mapData[0],"name","number");
          itemMapChart0.randomStr = randomString(4);
          itemMapChart0.width = "50%";
          itemMapChart0.alias = "询盘个数";
          itemMapChart0.mapWidth = mapWidth;
          itemMapChart0.mapHeight = mapHeight;
          itemMapChart1.title = title+"（"+$this.selectedData.dateContrast[0]+" ~ "+$this.selectedData.dateContrast[1]+"）";
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
          // inquiryMapData.title = "询盘地图展示 - 地区排行榜";
          inquiryMapData.title = "询盘 - 地区排行榜";
          inquiryMapData.unit = "（单位：个）";
          inquiryMapData.isMap = true;
          inquiryMapData.mapDataArr.push(itemMapChart0);
          inquiryMapData.mapDataArr.push(itemMapChart1);
        }else{
          // 小组对比
          if($this.selectedData.contrastGroupID.length>0){
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
                if($this.selectedData.groupID.length==1){
                  $this.groupList.forEach(function(item1){
                    if(item1.isOn){
                      itemChart.title = item1.departName+"-"+item1.groupName+"组";
                    }
                  });
                }else{
                  itemChart.title="已多选小组"
                }
              }else{
                var selectContrastGroupList = [];
                $this.contrastGroupList.forEach(function(item1){
                  if(item1.isOn){
                    selectContrastGroupList.push(item1);
                  }
                });
                itemChart.title=selectContrastGroupList[index-1].departName+"-"+selectContrastGroupList[index-1].groupName+"组";
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
                  // if(index<=3){
                  //   itemWidth = "25%";
                  //   mapWidth = parseInt(($this.minWidth-38)/4)-60;
                  // }else{
                  //   itemWidth = parseInt(1/(mapData.length-4)*100)+"%";
                  //   mapWidth = parseInt(($this.minWidth-38)/(mapData.length-4))-60;
                  // }
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
            // inquiryMapData.title = "询盘地图展示 - 地区排行榜";
            inquiryMapData.title = "询盘 - 地区排行榜";
            inquiryMapData.unit = "（单位：个）";
            inquiryMapData.isMap = true;
          }else{
            inquiryMapData = [];
            // 统计
            // 月维度
            var itemMapData = {};
            if($this.selectedData.isMonth){
              itemMapData.mapData = chinaData(res.provincecountmapmonth,"name","number");
              itemMapData.colorData = MapInterval(res.provincecountmapmonth[0].number);
            }else{
              // 日维度
              itemMapData.mapData = chinaData(res.provincecountmapday,"name","number");
              itemMapData.colorData = MapInterval(res.provincecountmapday[0].number);
            }
            itemMapData.randomStr = randomString(4);
            itemMapData.alias = "询盘个数";
            // itemMapData.title = "询盘地图展示 - 地区排行榜";
            itemMapData.title = "询盘 - 地区排行榜";
            itemMapData.unit = "（单位：个）";
            itemMapData.isMap = true;
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
      if($this.selectedType.includes("dealScoreRegion")){
        dealRegionMapData = {};
        // 时间对比
        if($this.selectedData.isDateCompare&&$this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
          var mapData = res.selfprovincebuymonthcompare;
          dealRegionMapData.mapDataArr = [];
          var itemMapChart0 = {};
          var itemMapChart1 = {};
          var title = "";
          if($this.selectedData.groupID.length==1){
            $this.groupList.forEach(function(item){
              if(item.isOn){
                title = item.departName+"-"+item.groupName+"组";
              }
            });
          }else{
            title = "已多选小组";
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
          itemMapChart1.title = title+"("+$this.selectedData.dateContrast[0]+" ~ "+$this.selectedData.dateContrast[1]+")";
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
          // dealRegionMapData.title = "成交积分地图展示 - 地区排行榜";
          dealRegionMapData.title = "成交积分 - 地区排行榜";
          dealRegionMapData.unit = "（单位：分）";
          dealRegionMapData.isMap = true;
          dealRegionMapData.mapDataArr.push(itemMapChart0);
          dealRegionMapData.mapDataArr.push(itemMapChart1);
        }else{
          // 小组对比
          if($this.selectedData.contrastGroupID.length>0){
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
                if($this.selectedData.groupID.length==1){
                  $this.groupList.forEach(function(item1){
                    if(item1.isOn){
                      itemChart.title = item1.departName+"-"+item1.groupName+"组";
                    }
                  });
                }else{
                  itemChart.title="已多选小组"
                }
              }else{
                var selectContrastGroupList = [];
                $this.contrastGroupList.forEach(function(item1){
                  if(item1.isOn){
                    selectContrastGroupList.push(item1);
                  }
                });
                itemChart.title=selectContrastGroupList[index-1].departName+"-"+selectContrastGroupList[index-1].groupName+"组";
              }
              itemChart.randomStr = randomString(4);
              itemChart.mapData = chinaData(item,"name","number");;
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
                  // if(index<=3){
                  //   itemWidth = "25%";
                  //   mapWidth = parseInt(($this.minWidth-38)/4)-60;
                  // }else{
                  //   itemWidth = parseInt(1/(mapData.length-4)*100)+"%";
                  //   mapWidth = parseInt(($this.minWidth-38)/(mapData.length-4))-60;
                  // }
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
            // dealRegionMapData.title = "成交积分地图展示 - 地区排行榜";
            dealRegionMapData.title = "成交积分 - 地区排行榜";
            dealRegionMapData.unit = "（单位：分）";
            dealRegionMapData.isMap = true;
          }else{
            dealRegionMapData = [];
            // 统计
            var itemMapData = {};
            itemMapData.mapData = chinaData(res.provincebuymapmonth,"name","number");
            itemMapData.colorData = MapInterval(res.provincebuymapmonth[0].number);
            itemMapData.randomStr = randomString(4);
            // itemMapData.title = "成交积分地图展示 - 地区排行榜";
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
            itemMapData.isMap = true;
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
    // 组装产品分析数据
    productDataClump(res){
      var $this = this;
      var productData = null
      if($this.selectedType.includes("product")){
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
          if($this.selectedData.groupID.length==1){
            $this.groupList.forEach(function(item){
              if(item.isOn){
                title = item.departName+"-"+item.groupName+"组";
              }
            });
          }else{
            title = "已多选小组";
          }
          productData.itemData.forEach(function(item,index){
            if(index==0){
              item.title = title+"（"+$this.selectedData.dateDefault[0]+"~"+$this.selectedData.dateDefault[1]+"）";
            }else{
              item.title = title+"（"+$this.selectedData.dateContrast[0]+"~"+$this.selectedData.dateContrast[1]+"）";
            }
          })
          productData.title = "产品分析";
          productData.isMap = false;
        }else{
          productData = {};
          // 小组对比
          if($this.selectedData.contrastGroupID.length>0){
            var totalData = res.productbuylistcompare;
            productData.itemData = [];
            totalData.forEach(function(item,index){
              var itemProduct = $this.clumpProduct(item);
              productData.itemData.push(itemProduct);
            });
            totalData.forEach(function(item,index){
              if(index == 0){
                if($this.selectedData.groupID.length==1){
                  $this.groupList.forEach(function(item1){
                    if(item1.isOn){
                      productData.itemData[0].title = item1.departName+"-"+item1.groupName+"组";
                    }
                  });
                }else{
                  productData.itemData[0].title="已多选小组"
                }
              }else{
                var selectContrastGroupList = [];
                $this.contrastGroupList.forEach(function(item1){
                  if(item1.isOn){
                    selectContrastGroupList.push(item1);
                  }
                });
                productData.itemData[index].title=selectContrastGroupList[index-1].departName+"-"+selectContrastGroupList[index-1].groupName+"组";
              }
            });
            productData.title = "产品分析";
            productData.isMap = false;
          }else{
            // 统计
            productData =  []
            var itemData = $this.clumpProduct(res.productbuylist);
            itemData.title = "产品分析";
            itemData.isMap = false;
            productData.push(itemData);
          }
        }
      }
      // var itemChartArr = [];
      // if(productData){
      //   itemChartArr.push(productData);
      // }
      return productData;
    },
    // 判断当前展示情况
    judgeChartStatus(){
      var $this = this;
      var judgeData = {};
      judgeData.singleGroupStatic = false;          // 单基础小组统计
      judgeData.singleGroupDateCompare = false;     // 单基础小组时间对比
      judgeData.singleGroupTeamCompare = false;     // 单基础小组与其他小组对比
      judgeData.pluralGroupStatic = false;          // 多基础小组统计
      judgeData.pluralGroupDateCompare = false;     // 多基础小组的时间对比
      judgeData.pluralGroupTeamCompare = false;     // 多基础小组与其他小组对比
      judgeData.pluralGroupTeamSameCompare = false; // 多基础小组与其他小组对比，且有小组同时存在于基础小组与对比小组
      // 基础小组有被选中的
      if($this.selectedData.groupID.length>0){
        // 基础小组有一个被选中
        if($this.selectedData.groupID.length==1){
          // 且基础时间有值
          if($this.selectedData.dateDefault&&$this.selectedData.dateDefault.length>0){
            // 且对比时间有值，此时是单一小组的时间对比
            if($this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
              if($this.selectedData.type.length>0){
                judgeData.singleGroupDateCompare = true;
              }
            }else{
              // 基础小组选中1个，且基础时间有值，而对比时间无值
              // 且有对比小组被选中
              if($this.selectedData.contrastGroupID.length>0){
                if($this.selectedData.type.length>0){
                  judgeData.singleGroupTeamCompare = true;
                }
              }else{
                // 对比时间无值，对比小组也无值，此情况为单一小组统计
                if($this.selectedData.type.length>0){
                  judgeData.singleGroupStatic = true;
                }
              }
            }
          }
        }else{
          // 基础小组有多个被选中
          // 且基础时间有值
          if($this.selectedData.dateDefault&&$this.selectedData.dateDefault.length>0){
            // 且对比时间有值，此时是基础多小组的时间对比
            if($this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
              if($this.selectedData.type.length>0){
                judgeData.pluralGroupDateCompare = true;
              }
            }else{
              // 基础小组选中多个，且基础时间有值，而对比时间无值
              // 且有对比小组被选中
              if($this.selectedData.contrastGroupID.length>0){
                if($this.selectedData.type.length>0){
                  judgeData.pluralGroupTeamCompare = true;
                  // 判断基础小组与对比小组是否有同一个小组被选中
                  $this.selectedData.contrastGroupID.forEach(function(item){
                    if($this.selectedData.groupID.includes(item)){
                      if($this.selectedData.type.length>0){
                        judgeData.pluralGroupTeamSameCompare = true;
                      }
                    }
                  });
                }
              }else{
                // 对比时间无值，对比小组也无值，此情况为多基础小组统计
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
    // 清空数据
    clearData(){
      var $this = this;
      $this.isDefaultPage = false;
      $this.defaultChartData = [];
      $this.mapChart = [];
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
    dateCompare(dataArr,key){
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
            itemChart1.color = tongData[1][0].color;
          }else{
            itemChart0.key = tongData[0][i].date+"&";
            itemChart0.name = $this.selectedData.dateDefault[0]+" ~ "+$this.selectedData.dateDefault[1];
            itemChart1.key = tongData[0][i].date+"&";
            itemChart1.name = $this.selectedData.dateContrast[0]+" ~ "+$this.selectedData.dateContrast[1];
            itemChart1.value = null;
            itemChart1.color = tongData[1][0].color;
          }
          if(key == "score"||key=="money"){
            itemChart0.value = Math.floor(tongData[0][i][key]*100)/100;
          }else{
            itemChart0.value = tongData[0][i][key];
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
            itemChart0.color = tongData[0][0].color;
          }else{
            itemChart1.key = "&"+tongData[1][i].date;
            itemChart1.name = $this.selectedData.dateContrast[0]+" ~ "+$this.selectedData.dateContrast[1];
            itemChart0.key = "&"+tongData[1][i].date;
            itemChart0.name = $this.selectedData.dateDefault[0]+" ~ "+$this.selectedData.dateDefault[1];
            itemChart0.value = null;
            itemChart0.color = tongData[0][0].color;
          }
          if(key == "score"||key=="money"){
            itemChart1.value = Math.floor(tongData[1][i][key]*100)/100;
          }else{
            itemChart1.value = tongData[1][i][key];
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
        backData.dateCompareData.baseValue = Math.floor(backData.dateCompareData.baseValue*100)/100;
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

    // 滚动悬浮
    getScroll(){
      var $this = this;
      if(!$this.selectedData.isDateCompare && $this.selectedData.groupID.length>0){
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
      $this.boxWidth = $this.$refs.boxPane.offsetWidth -48;
    }
  }
}
</script>



