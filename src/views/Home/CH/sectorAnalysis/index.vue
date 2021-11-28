<template>
  <div class="page-root scroll-panel group-index" ref="boxPane">
    <div class="filter-panel">
      <div class="filter-list">
        <div class="item-filter flex-box group">
          <div class="filter-title"><span class="txt-title">部门选择：</span></div>
          <div class="filter-content flex-content">
            <div class="item-list depart">
              <div class="item-checkbox" v-bind:class="item.isOn?'active':''" v-for="item in groupList" v-bind:key="item.id" v-on:click="groupChangeHandler(item.id)"><i></i><span>{{item.name}}</span></div>
            </div>
          </div>
        </div>
        <div class="item-filter flex-box date">
          <div class="filter-title"><span class="txt-title">时间选择：</span></div>
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
              <div class="item-checkbox" v-bind:class="[selectedData.contrastGroupID.length>0||!dateSelected?'is-disabled':'',selectedData.isDateCompare?'active':'']" v-on:click="dateCompareChangeHandler"><i></i><span>对比</span></div>
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
            </div>
          </div>
        </div>
      </div>
      <div class="filter-tips"><p><i class="svg-i"><svg-icon icon-class="tips" class-name="disabled" /></i>{{tipsInfo}}</p></div>
    </div>
    <div class="contrast-panel flex-box" v-if="!selectedData.isDateCompare&&selectedData.groupID.length>0">
      <div class="title-font"><span class="txt-title">对比项：</span></div>
      <div class="contrast-content flex-content">
        <div class="item-list">
          <div class="item-contrast" v-if="selectedData.groupID.length>0"><span>{{groupName}}</span><i v-on:click="deleteDefaultGroup" class="svg-i"><svg-icon icon-class="close" class-name="disabled" /></i></div>
          <template v-if="selectedData.contrastGroupID.length>0">
            <div class="item-contrast" v-if="item.isOn" v-for="item in contrastGroupList" v-bind:key="item.id"><span>{{item.name}}</span><i v-on:click="deleteContrastGroup(item.id)" class="svg-i"><svg-icon icon-class="close" class-name="disabled" /></i></div>
          </template>
          <div class="item-button">
            <div class="button-click" v-on:click="toggleContrast"><i class="svg-i"><svg-icon icon-class="s-add" class-name="disabled" /></i><span>添加对比</span></div>
            <div class="group-contrast depart" v-show="isContrastShow">
              <div class="item-checkbox" v-bind:class="[item.disabled?'is-disabled':'',item.isOn?'active':'']" v-for="item in contrastGroupList" v-bind:key="item.id" v-on:click="contrastGroupChangeHandler(item)"><i></i><span>{{item.name}}</span></div>
              <div class="item-sure" v-on:click="saveContrastGroup">确定</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="result-panel">
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
import defaultChart from "@/views/Home/compoents/departTeam/defaultChart.vue";
import mapChart from "@/views/Home/compoents/departTeam/mapChart.vue";
import {randomString,sortByDesc,groupColor,groupDateColor,singleArrColor,formatDate} from "@/utils/index"
import {MapInterval,TopTenColor} from "@/utils/MapColor"
export default {
  name: "cnSectorAnalysis",
  components: {
    defaultChart,
    mapChart,
  },
  data() {
    return {
      minWidth:"",
      mapRatio:0.75,
      groupList:[],
      contrastGroupList:[],
      selectedContrastGroupList:[],
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
      dateDimension:[
        {label:"日",value:"day",isOn:false},
        {label:"月",value:"month",isOn:false},
      ],
      contrastList:[
        {label:"询盘个数趋势分析",id:1,value:"inquiryCount",isOn:false,disabled:false},
        {label:"询盘个数地区分析",id:4,value:"inquiryCountRegion",isOn:false,disabled:false},
        {label:'成本趋势分析',id:3,value:"costCount",isOn:false,disabled:true},
        {label:"成交积分趋势分析",id:2,value:"dealScore",isOn:false,disabled:true},
        {label:"成交积分地区分析",id:5,value:"dealScoreRegion",isOn:false,disabled:true},
        {label:"产品分析",id:6,value:"product",isOn:false,disabled:true},
      ],
      groupName:"",
      dateSelected:false,
      tipsInfo:"当前部门分析页面，展示为：本年度数据信息。",
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
      staticChart:[],
      mapChart:[],
      productChart:[],
    };
  },
  created() {
    var $this = this;
    if($this.$route.query.type){
      $this.getRouterQuery();
    }else{
      $this.initData();
    }
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
    //监听相同路由下参数变化的时候，从而实现异步刷新
    '$route'(to,from) {
        var $this = this;
        if($this.$route.query.type){
          $this.getRouterQuery();
        }else{
          $this.initData();
        }
    },
  },
  mounted(){
    const $this = this;
    if($this.$refs.boxPane){  
      $this.minWidth = $this.$refs.boxPane.offsetWidth; 
      console.log($this.minWidth,"最小宽度");
    }
    window.onresize = () => {
      return (() => {
        if($this.$refs.boxPane){
          $this.minWidth = $this.$refs.boxPane.offsetWidth; 
        }
      })()
    }
  },
  methods: {
    // 获取路由参数
    getRouterQuery(){
      var $this = this;
      var type = parseInt($this.$route.query.type);
      var startTime = $this.$route.query.startTime;
      var endTime = $this.$route.query.endTime;
      var baseDepart = parseInt($this.$route.query.baseDepart);
      var contrastDepart = $this.$route.query.contrastDepart;
      var dateLen = startTime.split("/");
      if(dateLen.length==2){
        $this.selectedData.isMonth = true;
        $this.dateDimension.forEach(function(item){
          if(item.value=="month"){
            item.isOn = true;
          }else{
            item.isOn = false;
          }
        });
      }else{
        $this.selectedData.isMonth = false;
        $this.dateDimension.forEach(function(item){
          if(item.value=="day"){
            item.isOn = true;
          }else{
            item.isOn = false;
          }
        });
      }
      $this.contrastList.forEach(function(item,index){
        if($this.selectedData.isMonth){
          item.disabled = false;
        }
        if(item.id == type){
          item.isOn = true;
          $this.selectedType.push(item.value);
        }
      });
      $this.selectedData.dateDefault = [startTime,endTime];
      $this.dateSelected = true;
      $this.selectedData.groupID.push(baseDepart);
      if(contrastDepart!=''){
        if(contrastDepart.indexOf(",")!=-1){
          var contrastDepartArr = contrastDepart.split(",");
          contrastDepartArr.forEach(function(item){
            $this.selectedData.contrastGroupID.push(parseInt(item));
          });
        }else{
          $this.selectedData.contrastGroupID.push(parseInt(contrastDepart))
        }
      }
    },
    // 默认展示数据
    initData() {
      var $this = this;
      $this.$store.dispatch('api/getChinadepartcountdefaultAction', null).then(response=>{
        console.log(response,"默认数据");
          if(response){
            if(response.status){
                var groupList = [];
                response.readdepart.forEach(function(item,index){
                  var itemData = {};
                  itemData.isOn = false;
                  itemData.disabled = false;
                  itemData.id = item.id;
                  itemData.name = item.name;
                  groupList.push(itemData);
                });
                $this.groupList = JSON.parse(JSON.stringify(groupList));
                $this.contrastGroupList = JSON.parse(JSON.stringify(groupList));
                var inquiryData = {};
                var dealScoreData = {};
                var costData = {};
                var semData = {};
                inquiryData.name = "部门询盘统计";
                dealScoreData.name = "部门成交积分统计";
                costData.name = "部门成本统计";

                inquiryData.totalTitle = "总询盘数量";
                dealScoreData.totalTitle = "总成交积分";
                costData.totalTitle = "总成本";

                inquiryData.chartTitle = "部门询盘月趋势";
                dealScoreData.chartTitle = "部门成交积分月趋势";
                costData.chartTitle = "部门成本月趋势";

                inquiryData.avgTitle = "月平均询盘个数";
                dealScoreData.avgTitle = "月平均成交积分";
                costData.avgTitle = "月平均成本";

                inquiryData.historyTitle = "月历史峰值";
                dealScoreData.historyTitle = "月历史峰值";
                costData.historyTitle = "月历史峰值";

                inquiryData.unit = "（单位：个）";
                dealScoreData.unit = "（单位：分）";
                costData.unit = "（单位：万元）";

                inquiryData.nowNumber = response.allxunnumber;
                dealScoreData.nowNumber = response.scoreall;
                costData.nowNumber = response.moneyeall;

                inquiryData.lastNumber = response.lastallxunnumber;
                dealScoreData.lastNumber = response.lastscoreall;
                costData.lastNumber = response.lastmoneyall;

                inquiryData.nowLastNumber = Math.abs(response.allxunnumber - response.lastallxunnumber);
                dealScoreData.nowLastNumber = Math.abs(response.scoreall - response.lastscoreall);
                costData.nowLastNumber = Math.abs(response.moneyeall - response.lastmoneyall);

                inquiryData.status = response.allxunnumber - response.lastallxunnumber>0?'up':response.allxunnumber - response.lastallxunnumber<0?'down':'flat';
                dealScoreData.status = response.scoreall - response.lastscoreall>0?'up':response.scoreall - response.lastscoreall<0?'down':'flat';
                costData.status = response.moneyeall - response.lastmoneyall>0?'up':response.moneyeall - response.lastmoneyall<0?'down':'flat';

                inquiryData.avgNumber = response.avgxunnumber;
                dealScoreData.avgNumber = response.avgscore;
                costData.avgNumber = response.avgmoney;

                inquiryData.historyMaxNumber = response.historymaxnumber[0].number;
                dealScoreData.historyMaxNumber = response.historyscore[0].score.toFixed(2);
                costData.historyMaxNumber = response.historymoney[0].allmoney.toFixed(2);

                inquiryData.historyMaxNumberDate = response.historymaxnumber[0].yeartime;
                dealScoreData.historyMaxNumberDate = response.historyscore[0].yeartime;
                costData.historyMaxNumberDate = response.historymoney[0].yeartime;
                
                inquiryData.randomStr = randomString(4);
                dealScoreData.randomStr = randomString(4);
                costData.randomStr = randomString(4);

                var inquiryArr = groupColor(response.yeartong);
                var dealScoreArr = groupColor(response.yearscoretong);
                var costArr = groupColor(response.yearmonyetong);

                inquiryData.mainData = [];
                dealScoreData.mainData = [];
                costData.mainData = [];

                inquiryData.totalChart = [];
                dealScoreData.totalChart = [];
                costData.totalChart = [];

                inquiryData.colorArr = [];
                dealScoreData.colorArr = [];
                costData.colorArr = [];

                inquiryArr.forEach(function(item,index){
                  var itemChart = {};
                  itemChart.name = item[0].depart;
                  itemChart.color = item[0].color;
                  inquiryData.colorArr.push(item[0].color);
                  itemChart.value = 0;
                  item.forEach(function(item1){
                    item1.key = item1.date;
                    item1.value = item1.xunnumber;
                    item1.name = item1.depart;
                    item1.color = item1.color;
                    inquiryData.mainData.push(item1);
                    itemChart.value += item1.xunnumber;
                  });
                  inquiryData.totalChart.push(itemChart);
                });
                inquiryData.totalChart.sort(sortByDesc("value"));

                dealScoreArr.forEach(function(item,index){
                  var itemChart = {};
                  itemChart.name = item[0].depart;
                  itemChart.color = item[0].color;
                  dealScoreData.colorArr.push(item[0].color);
                  itemChart.value = 0;
                  item.forEach(function(item1){
                    item1.key = item1.date;
                    item1.value = Math.floor(item1.score * 100)/100;
                    item1.name = item1.depart;
                    item1.color = item1.color;
                    dealScoreData.mainData.push(item1);
                    itemChart.value += Math.floor(item1.score * 100)/100;
                  });
                  dealScoreData.totalChart.push(itemChart);
                });
                dealScoreData.totalChart.forEach(function(item){
                  item.value = Math.floor(item.value * 100)/100;
                });
                dealScoreData.totalChart.sort(sortByDesc("value"));

                costArr.forEach(function(item,index){
                  var itemChart = {};
                  itemChart.name = item[0].depart;
                  itemChart.color = item[0].color;
                  costData.colorArr.push(item[0].color);
                  itemChart.value = 0;
                  item.forEach(function(item1){
                    item1.key = item1.date;
                    item1.value = Math.floor(item1.money * 100)/100;
                    item1.name = item1.depart;
                    item1.color = item1.color;
                    costData.mainData.push(item1);
                    itemChart.value += Math.floor(item1.money * 100)/100;
                  });
                  costData.totalChart.push(itemChart);
                });
                costData.totalChart.forEach(function(item){
                  item.value = Math.floor(item.value * 100)/100;
                });
                costData.totalChart.sort(sortByDesc("value"));

                $this.defaultChartData = [inquiryData,dealScoreData,costData];
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
    // 部门点击事件
    groupChangeHandler(id){
      var $this = this;
      var groupList = $this.groupList;
      var selectedGroupID = [];
      groupList.forEach(function(item,index){
        if(item.id == id){
          item.isOn = !item.isOn;
        }
        if(item.isOn){
          selectedGroupID.push(item.id);
        }
      });
      $this.groupList = groupList;
      $this.selectedData.groupID = selectedGroupID;
      // 部门有被选中的，且默认时间是空的情况下，需要给默认时间一个默认时间范围
      if($this.selectedData.groupID.length>0&&(!$this.selectedData.dateDefault||$this.selectedData.dateDefault.length==0)){
        if($this.selectedData.isMonth){
          $this.selectedData.dateDefault = $this.getNearMonth();
        }else{
          $this.selectedData.dateDefault = $this.getNearDay();
        }
      }
      // 初始第一次部门被选中（即此时只有一个部门被选中），且分析项没有被选中的情况下，需要默认选中询盘个数与询盘地区分析
      if($this.selectedData.groupID.length==1&&$this.selectedData.type.length==0){
        var contrastList = $this.contrastList;
        var selectedContrastType = [];
        var selectedType = [];
        contrastList.forEach(function(item){
          if(item.value=="inquiryCount"||item.value=="inquiryCountRegion"){
            item.isOn = true;
            selectedContrastType.push(item.id);
            selectedType.push(item.value);
          }
        });
        $this.selectedType = selectedType;
        $this.selectedData.type = selectedContrastType;
        $this.contrastList = contrastList;
      }
      // 部门有被选中的，且只有一个部门被选中的情况下，对比部门中，当前被选中部门需被禁用不可选（不能自己和自己在部门维度比）,部门选中超过1个或没有被选中的，则对比部门不需要有禁用状态
      if($this.selectedData.groupID.length==1){
        var contrastGroupList = $this.contrastGroupList;
        contrastGroupList.forEach(function(item){
          if(item.id == $this.selectedData.groupID[0]){
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
      if(!$this.dateSelected){
        $this.dateDimension.forEach(function(item,index){
          if(index==0){
            item.isOn = true;
            $this.dateSelected = true;
          }
        });
      }
      $this.getGroupName();
      $this.getSearchData();
    },
    //组装部门选中名字
    getGroupName(){
      var $this = this;
      var groupList = $this.groupList;
      var groupName = "";
      var fontArr = [];
      groupList.forEach(function(item,index){
        if(item.isOn){
          var font = item.name.substring(2,3);
          fontArr.push(font);
        }
      })
      groupName = "电商"+fontArr.join("、")+"部";
      console.log(groupName);
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
        // 切换日期维度，对比时间清空，默认时间在有部门选中的情况下，需要给一个默认时间范围
        if($this.selectedData.groupID.length>0){
          if($this.selectedData.isMonth){
            $this.selectedData.dateDefault = $this.getNearMonth();
            $this.selectedData.dateContrast = [];
          }else{
            $this.selectedData.dateDefault = $this.getNearDay();
            $this.selectedData.dateContrast = [];
          }
        }else{
          $this.selectedData.dateDefault = [];
          $this.selectedData.dateContrast = [];
        }
        // 切换日期维度，分析项只在月时可选的，切换到日维度时，需禁用，且清除选中状态；切换到月维度时，则只需将所有禁用状态解除
        var contrastList = $this.contrastList;
        var selectedContrastType = [];
        var selectedType = [];
        contrastList.forEach(function(item,index){
          if($this.selectedData.isMonth){
            item.disabled = false;
          }else{
            if(item.value=="dealScore"||item.value=="costCount"||item.value=="dealScoreRegion"||item.value=="product"){
              item.isOn = false;
              item.disabled = true;
            }else{
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
        $this.selectedType = selectedType;
        $this.getSearchData();
      }
    },
    // 日期对比点击事件
    dateCompareChangeHandler(){
      var $this = this;
      // 只有在对比部门没有被选中的，此时日期对比才是非禁用状态，可点击的
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
    // 添加对比部门点击事件
    toggleContrast(){
      this.isContrastShow = true;
    },
    // 对比部门点击事件
    contrastGroupChangeHandler(obj){
      var $this = this;
      if(!obj.disabled){
        var selectedContrastGroupID = [];
        var contrastGroupList = $this.contrastGroupList;
        contrastGroupList.forEach(function(item,index){
          if(item.id == obj.id){
            item.isOn = !item.isOn;
          }
          if(item.isOn){
            selectedContrastGroupID.push(item.id);
          }
        });
        $this.selectedData.contrastGroupID = selectedContrastGroupID;
        $this.contrastGroupList = contrastGroupList;
      }
    },
    // 对比部门添加确定事件
    saveContrastGroup(){
      var $this = this;
      $this.isContrastShow = !$this.isContrastShow;
      if($this.oldContrastGroupID!=$this.selectedData.contrastGroupID.join(",")){
        $this.oldContrastGroupID = $this.selectedData.contrastGroupID.join(",");
        $this.getSearchData();
      }
    },
    // 基础部门删除点击事件
    deleteDefaultGroup(){
      var $this = this;
      // 基础部门被删除，则对比部门选中状态全部清空，基础部门选中状态全部清空，页面数据清空
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
      $this.selectedData.contrastGroupID = selectedContrastGroupID;
      $this.getSearchData();
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
        searchData.dept_id = $this.selectedData.groupID;
      }
      if($this.selectedData.type.length>0){
        searchData.type = $this.selectedData.type;
      }
      if($this.selectedData.contrastGroupID.length>0){
        searchData.comparedept_id = $this.selectedData.contrastGroupID
      }
      searchData.is_compare = $this.selectedData.contrastGroupID.length>0?2:1;
      searchData.is_timecopmare = $this.selectedData.isDateCompare&&$this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0?2:1;
      if($this.selectedData.groupID.length==0){
        $this.tipsInfo = "请选择数据分析的部门";
      }else{
        if(!$this.selectedData.dateDefault||$this.selectedData.dateDefault.length==0){
          $this.tipsInfo = "请选择数据分析的日期范围";
        }else{
          if($this.selectedData.type.length==0){
            $this.tipsInfo = "请选择数据分析的分析项";
          }else{
            if(searchData.is_timecopmare==2&&searchData.starttime&&searchData.endtime){
              $this.tipsInfo = "当前部门分析页面，展示为："+$this.selectedData.dateDefault[0]+" ~ " + $this.selectedData.dateDefault[1]+" 与 "+$this.selectedData.dateContrast[0]+" ~ "+$this.selectedData.dateContrast[1]+" 的日期对比数据信息。";
            }
            if(searchData.is_timecopmare==1&&searchData.starttime&&searchData.endtime){
              $this.tipsInfo = "当前部门分析页面，展示为："+$this.selectedData.dateDefault[0]+" ~ " + $this.selectedData.dateDefault[1]+" 的数据信息。";
            }
          }
        }
      }
      return searchData;
    },
    // 获取筛选条件下的数据
    getSearchData(){
      var $this = this;
      $this.judgeChartStatus();
      var searchData = $this.searchDataInit();
      $this.clearData();
      if(searchData.dept_id&&searchData.starttime&&searchData.endtime&&searchData.type){
        $this.$store.dispatch('api/getChinadepartcountAction', searchData).then(res=>{
         if(res.status){
            console.log(res,"筛选数据")
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
        // 时间对比
        if($this.selectedData.isDateCompare&&$this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
          var dateData = [];
          // 月维度
          if($this.selectedData.isMonth){
            inquiryData.nowNumber = res.monthxunallnumber;
            dateData = res.selfmonthxuncompare;
          }else{
            // 日维度
            inquiryData.nowNumber = res.xunallnumber;
            dateData = res.selfdayxuncompare;
          }
          var backData = $this.dateCompare(dateData,'xunnumber');
          inquiryData.mainData = backData.mainData;
          inquiryData.dateCompareData = backData.dateCompareData;
          inquiryData.colorArr = backData.colorArr;
          if($this.selectedData.groupID.length==1){
            $this.groupList.forEach(function(item){
              if(item.id == $this.selectedData.groupID[0]){
                inquiryData.chartTitle = item.name+"询盘日期对比趋势";
                inquiryData.name = item.name+"询盘统计";
              }
            });
          }else{
            inquiryData.chartTitle = "部门组合询盘日期对比趋势";
            inquiryData.name = "部门组合询盘统计";
          }
        }else{
          // 部门对比
          if($this.selectedData.contrastGroupID.length>0){
            inquiryData.chartTitle = "各部门询盘趋势对比";
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
                  if($this.selectedData.groupID.length==1){
                    $this.groupList.forEach(function(item1){
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
              inquiryData.nowNumber = res.monthxunallnumbercompare
              compareData = res.monthdepartpercentercompare
            }else{
              inquiryData.nowNumber = res.xunallnumbercompare;
              compareData = res.departpercentercompare
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
              inquiryData.nowNumber = res.monthxunallnumber;
              tongData.push(res.monthxuntrend);
              inquiryData.lastNumber = res.lastmonthxunallnumber;
              inquiryData.nowLastNumber = Math.abs(res.monthxunallnumber - res.lastmonthxunallnumber);
              inquiryData.status = res.monthxunallnumber - res.lastmonthxunallnumber>0?'up':res.monthxunallnumber - res.lastmonthxunallnumber<0?'down':'flat';
              inquiryData.avgNumber = res.monthavgxun;
              inquiryData.historyMaxNumber = res.historymaxnumbermonth[0].number;
              inquiryData.historyMaxNumberDate = res.historymaxnumbermonth[0].yeartime;
              inquiryData.avgTitle = "月平均询盘个数";
              inquiryData.historyTitle = "月历史峰值";
            }else{
              inquiryData.nowNumber = res.xunallnumber;
              tongData.push(res.dayxuntrend);
              // 日维度
              inquiryData.lastNumber = res.lastxunallnumber;
              inquiryData.nowLastNumber = Math.abs(res.xunallnumber - res.lastxunallnumber);
              inquiryData.status = res.xunallnumber - res.lastxunallnumber>0?'up':res.xunallnumber - res.lastxunallnumber<0?'down':'flat';
              inquiryData.avgNumber = res.avgxunnumber;
              inquiryData.historyMaxNumber = res.historymaxnumberday[0].number;
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
              if($this.selectedData.groupID.length==1){
                $this.groupList.forEach(function(item1){
                  if(item1.id == $this.selectedData.groupID[0]){
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
            if($this.selectedData.groupID.length==1){
              console.log($this.groupList)
              $this.groupList.forEach(function(item){
                if(item.id == $this.selectedData.groupID[0]){
                  inquiryData.chartTitle = item.name+"询盘趋势";
                  inquiryData.name = item.name+"询盘统计";
                }
              });
            }else{// 多部门被选中
              inquiryData.chartTitle = "部门组合询盘趋势";
              inquiryData.name = "部门组合询盘统计";
              inquiryData.totalChart = [];
              var compareData = [];
              if($this.selectedData.isMonth){
                compareData = res.monthdepartpercenter
              }else{
                compareData = res.departpercenter
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
      // 成交积分趋势
      var dealScoreData = null;
      if($this.selectedType.includes("dealScore")){
        dealScoreData = {};
        // 时间对比
        if($this.selectedData.isDateCompare&&$this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
          dealScoreData.nowNumber = res.monthscoreallnumber;
          var backData = $this.dateCompare(res.selfmonthscoretrend,'score');
          dealScoreData.mainData = backData.mainData;
          dealScoreData.dateCompareData = backData.dateCompareData;
          dealScoreData.colorArr = backData.colorArr;
          if($this.selectedData.groupID.length==1){
            $this.groupList.forEach(function(item){
              if(item.id == $this.selectedData.groupID[0]){
                dealScoreData.chartTitle = item.name+"成交积分日期对比趋势";
                dealScoreData.name = item.name+"成交积分统计";
              }
            });
          }else{
            dealScoreData.chartTitle = "部门组合成交积分日期对比趋势";
            dealScoreData.name = "部门组合成交积分统计";
          }
        }else{
          // 部门对比
          if($this.selectedData.contrastGroupID.length>0){
            dealScoreData.chartTitle = "各部门成交积分趋势对比";
            dealScoreData.mainData = [];
            dealScoreData.colorArr = [];
            var chartData = groupColor(res.monthscoretrendcompare);
            chartData.forEach(function(item,index){
              dealScoreData.colorArr.push(item[0].color);
              item.forEach(function(item1){
                var itemChart = {};
                if(index == 0){
                  if($this.selectedData.groupID.length==1){
                    $this.groupList.forEach(function(item1){
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
            dealScoreData.nowNumber = Math.floor(res.monthscoreallnumbercompare*100)/100;
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
            dealScoreData.nowNumber = Math.floor(res.monthscoreallnumber*100)/100;
            var tongData = groupColor([res.monthscoretrend]);
            dealScoreData.colorArr.push(tongData[0][0].color);
            tongData[0].forEach(function(item,index){
              item.key = item.date;
              item.value = Math.floor(item.score*100)/100;
              if($this.selectedData.groupID.length==1){
                $this.groupList.forEach(function(item1){
                  if(item1.id == $this.selectedData.groupID[0]){
                    item.name = item1.name;
                  }
                });
              }else{
                item.name = "已多选部门"
              }
              dealScoreData.mainData.push(item);
            });
            dealScoreData.lastNumber = Math.floor(res.lastmonthscoreallnumber*100)/100;
            dealScoreData.nowLastNumber = Math.abs(Math.floor(res.monthscoreallnumber*100)/100 - Math.floor(res.lastmonthscoreallnumber*100)/100);
            dealScoreData.status = Math.floor(res.monthscoreallnumber*100)/100 - Math.floor(res.lastmonthscoreallnumber*100)/100>0?'up':Math.floor(res.monthscoreallnumber*100)/100 - Math.floor(res.lastmonthscoreallnumber*100)/100<0?'down':'flat';
            dealScoreData.avgNumber = Math.floor(res.monthscoreavgxun*100)/100;
            dealScoreData.historyMaxNumber = Math.floor(res.historymaxscoremonth[0].score*100)/100;
            dealScoreData.historyMaxNumberDate = res.historymaxscoremonth[0].yeartime;
            dealScoreData.avgTitle = "月平均成交积分";
            dealScoreData.historyTitle = "月历史峰值";
            // 只有一个部门被选中的情况
            if($this.selectedData.groupID.length==1){
              $this.groupList.forEach(function(item){
                if(item.id == $this.selectedData.groupID[0]){
                  dealScoreData.chartTitle = item.name+"成交积分趋势";
                  dealScoreData.name = item.name+"成交积分统计";
                }
              });
            }else{// 多部门被选中
              dealScoreData.chartTitle = "部门组合成交积分趋势";
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
      // 成本趋势
      var costCountData = null;
      if($this.selectedType.includes("costCount")){
        costCountData = {};
        // 时间对比
        if($this.selectedData.isDateCompare&&$this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
          costCountData.nowNumber = Math.floor(res.monthmoneyallnumber*100)/100;
          var backData = $this.dateCompare(res.selfmonthmoneytrend,'money');
          costCountData.mainData = backData.mainData;
          costCountData.dateCompareData = backData.dateCompareData;
          costCountData.colorArr = backData.colorArr;
          if($this.selectedData.groupID.length==1){
            $this.groupList.forEach(function(item){
              if(item.id == $this.selectedData.groupID[0]){
                costCountData.chartTitle = item.name+"成本日期对比趋势";
                costCountData.name = item.name+"成本统计";
              }
            });
          }else{
            costCountData.chartTitle = "部门组合成本日期对比趋势";
            costCountData.name = "部门组合成本统计";
          }
        }else{
          // 部门对比
          if($this.selectedData.contrastGroupID.length>0){
            costCountData.chartTitle = "各部门成本趋势对比";
            costCountData.mainData = [];
            costCountData.colorArr = [];
            var chartData = groupColor(res.monthmoneytrendcompare);
            chartData.forEach(function(item,index){
              costCountData.colorArr.push(item[0].color);
              item.forEach(function(item1){
                var itemChart = {};
                if(index == 0){
                  if($this.selectedData.groupID.length==1){
                    $this.groupList.forEach(function(item1){
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
                itemChart.value = Math.floor(item1.money*100)/100;
                itemChart.color = item[0].color;
                costCountData.mainData.push(itemChart);
              });
            });
            costCountData.name = "部门成本统计";
            costCountData.nowNumber = Math.floor(res.monthmoneyallnumbercompare*100)/100;
            costCountData.totalChart = [];
            res.monthdepartmoneypercentercompare.forEach(function(item){
              var itemChart = {};
              itemChart.name = item.departname;
              itemChart.value = Math.floor(item.money*100)/100;
              costCountData.totalChart.push(itemChart);
            });
            costCountData.totalChart = singleArrColor(costCountData.totalChart);
            costCountData.totalChart.sort(sortByDesc("value"));
          }else{
            // 统计
            costCountData.mainData = [];
            costCountData.colorArr = [];
            costCountData.nowNumber = Math.floor(res.monthmoneyallnumber*100)/100;
            var tongData = groupColor([res.monthmoneytrend]);
            costCountData.colorArr.push(tongData[0][0].color);
            tongData[0].forEach(function(item,index){
              item.key = item.date;
              item.value = Math.floor(item.money*100)/100;
              if($this.selectedData.groupID.length==1){
                $this.groupList.forEach(function(item1){
                  if(item1.id == $this.selectedData.groupID[0]){
                    item.name = item1.name;
                  }
                });
              }else{
                item.name = "已多选部门"
              }
              costCountData.mainData.push(item);
            });
            costCountData.lastNumber = Math.floor(res.lastmonthmoneyall*100)/100;
            costCountData.nowLastNumber = Math.abs(Math.floor(res.monthmoneyallnumber*100)/100 - Math.floor(res.lastmonthmoneyall*100)/100);
            costCountData.status = Math.floor(res.monthmoneyallnumber*100)/100 - Math.floor(res.lastmonthmoneyall*100)/100>0?'up':Math.floor(res.monthmoneyallnumber*100)/100 - Math.floor(res.lastmonthmoneyall*100)/100<0?'down':'flat';
            costCountData.avgNumber = Math.floor(res.avgmonthmoney*100)/100;
            costCountData.historyMaxNumber = Math.floor(res.historymaxmoneymonth[0].allmoney*100)/100;
            costCountData.historyMaxNumberDate = res.historymaxmoneymonth[0].yeartime;
            costCountData.avgTitle = "月平均成本";
            costCountData.historyTitle = "月历史峰值";
            // 只有一个部门被选中的情况
            if($this.selectedData.groupID.length==1){
              $this.groupList.forEach(function(item){
                if(item.id == $this.selectedData.groupID[0]){
                  costCountData.chartTitle = item.name+"成本趋势";
                  costCountData.name = item.name+"成本统计";
                }
              });
            }else{// 多部门被选中
              costCountData.chartTitle = "部门组合成本趋势";
              costCountData.name = "部门组合成本统计";
              costCountData.totalChart = [];
              res.monthdepartmoneypercenter.forEach(function(item){
                var itemChart = {};
                itemChart.name = item.departname;
                itemChart.value = Math.floor(item.money*100)/100;
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
                title = item.name;
              }
            });
          }else{
            title = "已多选部门";
          }
          var mapWidth = parseInt(($this.minWidth-38)/2*0.7)-60;
          var mapHeight = parseInt(mapWidth*$this.mapRatio)+30;
          itemMapChart0.title = title+"("+$this.selectedData.dateDefault[0]+" ~ "+$this.selectedData.dateDefault[1]+")";
          itemMapChart0.mapData = mapData[0];
          itemMapChart0.randomStr = randomString(4);
          itemMapChart0.width = "50%";
          itemMapChart0.alias = "询盘个数";
          itemMapChart0.mapWidth = mapWidth;
          itemMapChart0.mapHeight = mapHeight;
          itemMapChart1.title = title+"("+$this.selectedData.dateContrast[0]+" ~ "+$this.selectedData.dateContrast[1]+")";
          itemMapChart1.mapData = mapData[1];
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
          itemMapChart0.topTitle = "热门地区TOP5";
          itemMapChart0.topTenData = [];
          itemMapChart0.mapData.forEach(function(item,index){
            if(index<5){
              itemMapChart0.topTenData.push(item);
            }
          });
          itemMapChart0.topTenColor = TopTenColor(itemMapChart0.topTenData,itemMapChart0.colorData);
          itemMapChart1.topTitle = "热门地区TOP5";
          itemMapChart1.topTenData = [];
          itemMapChart1.mapData.forEach(function(item,index){
            if(index<5){
              itemMapChart1.topTenData.push(item);
            }
          });
          itemMapChart1.topTenColor = TopTenColor(itemMapChart1.topTenData,itemMapChart1.colorData);
          inquiryMapData.title = "询盘地图展示 - 地区排行榜";
          inquiryMapData.unit = "（单位：个）";
          inquiryMapData.isMap = true;
          inquiryMapData.mapDataArr.push(itemMapChart0);
          inquiryMapData.mapDataArr.push(itemMapChart1);
        }else{
          // 部门对比
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
                      itemChart.title = item1.name;
                    }
                  });
                }else{
                  itemChart.title="已多选部门"
                }
              }else{
                var selectContrastGroupList = [];
                $this.contrastGroupList.forEach(function(item1){
                  if(item1.isOn){
                    selectContrastGroupList.push(item1);
                  }
                });
                itemChart.title=selectContrastGroupList[index-1].name;
              }
              itemChart.randomStr = randomString(4);
              itemChart.mapData = item;
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
              itemChart.topTitle = "热门地区TOP5";
              itemChart.topTenData = [];
              itemChart.mapData.forEach(function(item,index){
                if(index<5){
                  itemChart.topTenData.push(item);
                }
              });
              itemChart.topTenColor = TopTenColor(itemChart.topTenData,itemChart.colorData);
              inquiryMapData.mapDataArr.push(itemChart);
            });
            inquiryMapData.title = "询盘地图展示 - 地区排行榜";
            inquiryMapData.unit = "（单位：个）";
            inquiryMapData.isMap = true;
          }else{
            inquiryMapData = [];
            // 统计
            // 月维度
            var itemMapData = {};
            if($this.selectedData.isMonth){
              itemMapData.mapData = res.provincecountmapmonth;
              itemMapData.colorData = MapInterval(res.provincecountmapmonth[0].number);
            }else{
              // 日维度
              itemMapData.mapData = res.provincecountmapday;
              itemMapData.colorData = MapInterval(res.provincecountmapday[0].number);
            }
            itemMapData.randomStr = randomString(4);
            itemMapData.alias = "询盘个数";
            itemMapData.title = "询盘地图展示 - 地区排行榜";
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
                title = item.name;
              }
            });
          }else{
            title = "已多选部门";
          }
          var mapWidth = parseInt(($this.minWidth-38)/2*0.7)-60;
          var mapHeight = parseInt(mapWidth*$this.mapRatio)+30;
          itemMapChart0.title = title+"（"+$this.selectedData.dateDefault[0]+" ~ "+$this.selectedData.dateDefault[1]+"）";
          itemMapChart0.mapData = mapData[0];
          itemMapChart0.randomStr = randomString(4);
          itemMapChart0.width = "50%";
          itemMapChart0.alias = "成交积分";
          itemMapChart0.mapWidth = mapWidth;
          itemMapChart0.mapHeight = mapHeight;
          itemMapChart1.title = title+"（"+$this.selectedData.dateContrast[0]+" ~ "+$this.selectedData.dateContrast[1]+"）";
          itemMapChart1.mapData = mapData[1];
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
          itemMapChart0.topTitle = "热门地区TOP5";
          itemMapChart0.topTenData = [];
          itemMapChart0.mapData.forEach(function(item,index){
            if(index<5){
              itemMapChart0.topTenData.push(item);
            }
          });
          itemMapChart0.topTenColor = TopTenColor(itemMapChart0.topTenData,itemMapChart0.colorData);
          itemMapChart1.topTitle = "热门地区TOP5";
          itemMapChart1.topTenData = [];
          itemMapChart1.mapData.forEach(function(item,index){
            if(index<5){
              itemMapChart1.topTenData.push(item);
            }
          });
          itemMapChart1.topTenColor = TopTenColor(itemMapChart1.topTenData,itemMapChart1.colorData);
          dealRegionMapData.title = "成交积分地图展示 - 地区排行榜";
          dealRegionMapData.unit = "（单位：分）";
          dealRegionMapData.isMap = true;
          dealRegionMapData.mapDataArr.push(itemMapChart0);
          dealRegionMapData.mapDataArr.push(itemMapChart1);
        }else{
          // 部门对比
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
                      itemChart.title = item1.name;
                    }
                  });
                }else{
                  itemChart.title="已多选部门"
                }
              }else{
                var selectContrastGroupList = [];
                $this.contrastGroupList.forEach(function(item1){
                  if(item1.isOn){
                    selectContrastGroupList.push(item1);
                  }
                });
                itemChart.title=selectContrastGroupList[index-1].name;
              }
              itemChart.randomStr = randomString(4);
              itemChart.mapData = item;
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
              itemChart.topTitle = "热门地区TOP5";
              itemChart.topTenData = [];
              itemChart.mapData.forEach(function(item,index){
                if(index<5){
                  itemChart.topTenData.push(item);
                }
              });
              itemChart.topTenColor = TopTenColor(itemChart.topTenData,itemChart.colorData);
              dealRegionMapData.mapDataArr.push(itemChart);
            });
            dealRegionMapData.title = "成交积分地图展示 - 地区排行榜";
            dealRegionMapData.unit = "（单位：分）";
            dealRegionMapData.isMap = true;
          }else{
            dealRegionMapData = [];
            // 统计
            var itemMapData = {};
            itemMapData.mapData = res.provincebuymapmonth;
            itemMapData.colorData = MapInterval(res.provincebuymapmonth[0].number);
            itemMapData.randomStr = randomString(4);
            itemMapData.title = "成交积分地图展示 - 地区排行榜";
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
                title = item.name;
              }
            });
          }else{
            title = "已多选部门";
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
          // 部门对比
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
                      productData.itemData[0].title = item1.name;
                    }
                  });
                }else{
                  productData.itemData[0].title="已多选部门"
                }
              }else{
                var selectContrastGroupList = [];
                $this.contrastGroupList.forEach(function(item1){
                  if(item1.isOn){
                    selectContrastGroupList.push(item1);
                  }
                });
                productData.itemData[index].title=selectContrastGroupList[index-1].name;
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
      judgeData.singleGroupStatic = false;          // 单基础部门统计
      judgeData.singleGroupDateCompare = false;     // 单基础部门时间对比
      judgeData.singleGroupTeamCompare = false;     // 单基础部门与其他部门对比
      judgeData.pluralGroupStatic = false;          // 多基础部门统计
      judgeData.pluralGroupDateCompare = false;     // 多基础部门的时间对比
      judgeData.pluralGroupTeamCompare = false;     // 多基础部门与其他部门对比
      judgeData.pluralGroupTeamSameCompare = false; // 多基础部门与其他部门对比，且有部门同时存在于基础部门与对比部门
      // 基础部门有被选中的
      if($this.selectedData.groupID.length>0){
        // 基础部门有一个被选中
        if($this.selectedData.groupID.length==1){
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
              if($this.selectedData.contrastGroupID.length>0){
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
              if($this.selectedData.contrastGroupID.length>0){
                if($this.selectedData.type.length>0){
                  judgeData.pluralGroupTeamCompare = true;
                  // 判断基础部门与对比部门是否有同一个部门被选中
                  $this.selectedData.contrastGroupID.forEach(function(item){
                    if($this.selectedData.groupID.includes(item)){
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
          backData.mainData.push(itemChart0);
          backData.mainData.push(itemChart1);
        }
      }else{
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
          backData.mainData.push(itemChart0);
          backData.mainData.push(itemChart1);
        }
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
      backData.dateCompareData.compareNumber = Math.abs(backData.dateCompareData.baseValue - backData.dateCompareData.compareValue);
      backData.dateCompareData.compareRate = backData.dateCompareData.compareValue==0?'0%':(backData.dateCompareData.compareNumber/backData.dateCompareData.compareValue*100).toFixed(2)+"%";
      return backData;
    },
  }
}
</script>



