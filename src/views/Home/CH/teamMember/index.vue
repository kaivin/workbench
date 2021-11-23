<template>
  <div class="page-root scroll-panel group-index" ref="boxPane">
    <div class="filter-panel">
      <div class="filter-list">
        <div class="item-filter flex-box group">
          <div class="filter-title"><span class="txt-title">小组选择：</span></div>
          <div class="filter-content flex-content">
            <div class="item-list">
              <div class="item-checkbox" v-bind:class="item.isOn?'active':''" v-if="item.typeid==1" v-for="item in groupList" v-bind:key="item.userid" v-on:click="groupChangeHandler(item.userid)"><i></i><span>{{item.typename}} {{item.groupName}}组</span><b>[{{item.departName}}]</b></div>
            </div>
            <div class="item-list">
              <div class="item-checkbox" v-bind:class="item.isOn?'active':''" v-if="item.typeid==2" v-for="item in groupList" v-bind:key="item.userid" v-on:click="groupChangeHandler(item.userid)"><i></i><span>{{item.typename}} {{item.groupName}}组</span><b>[{{item.departName}}]</b></div>
            </div>
            <div class="item-list">
              <div class="item-checkbox" v-bind:class="item.isOn?'active':''" v-if="item.typeid==3||item.typeid==4" v-for="item in groupList" v-bind:key="item.userid" v-on:click="groupChangeHandler(item.userid)"><i></i><span>{{item.typename}} {{item.groupName}}组</span><b>[{{item.departName}}]</b></div>
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
                  @change="getSearchData"
                  type="daterange"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
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
                  format="yyyy-MM"
                  value-format="yyyy-MM"
                  key="b"
                  size="mini"
                  class="date-range"
                  range-separator="～"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerMonthRangeOptions">
                </el-date-picker>
              </div>
              <div class="item-checkbox" v-bind:class="[selectedData.contrastGroupID.length>0?'is-disabled':'',selectedData.isDateCompare?'active':'']" v-on:click="dateCompareChangeHandler"><i></i><span>对比</span></div>
              <div class="item-date" v-if="selectedData.isDateCompare">
                <el-date-picker
                  v-if="!selectedData.isMonth"
                  v-model="selectedData.dateContrast"
                  @change="getSearchData"
                  type="daterange"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
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
                  format="yyyy-MM"
                  value-format="yyyy-MM"
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
          <div class="item-contrast" v-if="selectedData.groupID.length>0" v-on:click="deleteDefaultGroup"><span>{{groupName}}</span><i class="svg-i"><svg-icon icon-class="close" class-name="disabled" /></i></div>
          <template v-if="selectedData.contrastGroupID.length>0">
            <div class="item-contrast" v-if="item.isOn" v-for="item in contrastGroupList" v-bind:key="item.userid" v-on:click="deleteContrastGroup(item.userid)"><span>{{item.typename}} {{item.groupName}}组</span><i class="svg-i"><svg-icon icon-class="close" class-name="disabled" /></i></div>
          </template>
          <div class="item-button">
            <div class="button-click" v-on:click="toggleContrast"><i class="svg-i"><svg-icon icon-class="s-add" class-name="disabled" /></i><span>添加对比</span></div>
            <div class="group-contrast" v-show="isContrastShow">
              <div class="item-checkbox" v-bind:class="[item.disabled?'is-disabled':'',item.isOn?'active':'']" v-for="item in contrastGroupList" v-bind:key="item.userid" v-on:click="contrastGroupChangeHandler(item)"><i></i><span>{{item.typename}} {{item.groupName}}组</span><b>[{{item.departName}}]</b></div>
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
        ></map-chart>
      </template>
    </div>
  </div>
</template>
<script>
import defaultChart from "./components/defaultChart.vue";
import mapChart from "./components/mapChart.vue";
import {randomString,sortByDesc} from "@/utils/index"
import {MapInterval} from "@/utils/MapColor"
export default {
  name: "teamMember",
  components: {
    defaultChart,
    mapChart,
  },
  data() {
    return {
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
              var end = year + '-' + month + '-01';
              var start = '';
            
              if(month == '01'){
                start = (parseInt(year) - 1) + '-12-01';
              }else{
                start = parseInt(month) - 1>9 ? year + '-' + (parseInt(month) - 1)  + '-01':year + '-0' + (parseInt(month) - 1)  + '-01';
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
            var start = year + '-' + month + '-01';
            if(month == '12'){
              end = (parseInt(year) + 1) + '-01-01';
            }else{
              end = parseInt(month) + 1>9 ? year + '-' + (parseInt(month) + 1)  + '-01':year + '-0' + (parseInt(month) + 1)  + '-01';
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
        {label:"日",value:"day",isOn:true},
        {label:"月",value:"month",isOn:false},
      ],
      contrastList:[
        {label:"询盘个数分析",id:1,value:"inquiryCount",isOn:false,disabled:false},
        {label:"询盘地区分析",id:4,value:"inquiryRegion",isOn:false,disabled:false},
        {label:"成交积分分析",id:2,value:"dealIntegral",isOn:false,disabled:true},
        {label:"成交地区分析",id:5,value:"dealRegion",isOn:false,disabled:true},
        {label:"产品分析",id:6,value:"product",isOn:false,disabled:true},
      ],
      channelType:"",
      groupName:"",
      tipsInfo:"当前小组分析页面，展示为：近30天数据信息。",
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
    $this.initData();
  },
  methods: {
    // 默认展示数据
    initData() {
      var $this = this;
      $this.$store.dispatch('teamMember/cnGroupDefaultAction', null).then(response=>{
        console.log(response,"默认数据");
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
                semData.nowNumber = response.semallnumber;
                semData.lastNumber = response.lastsemallnumber;
                semData.nowLastNumber = Math.abs(response.semallnumber - response.lastsemallnumber);
                semData.status = response.semallnumber - response.lastsemallnumber>0?'up':response.semallnumber - response.lastsemallnumber<0?'down':'flat';
                semData.avgNumber = response.semavgmonth;
                semData.historyMaxNumber = response.semhistorymaxnumber[0].effectivenumber;
                semData.historyMaxNumberDate = response.semhistorymaxnumber[0].xundate;
                semData.mainData = [];
                semData.totalChart = [];
                semData.randomStr = randomString(4);
                response.semtong.forEach(function(item,index){
                  var itemChart = {};
                  itemChart.name = item[0].name+"组";
                  itemChart.value = 0;
                  item.forEach(function(item1){
                    item1.key = item1.date+" "+item1.week;
                    item1.value = item1.xunnumber;
                    item1.name = item1.name+"组";
                    semData.mainData.push(item1);
                    itemChart.value += item1.xunnumber;
                  });
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
                seoData.nowNumber = response.seoallnumber;
                seoData.lastNumber = response.lastseoallnumber;
                seoData.nowLastNumber = Math.abs(response.seoallnumber - response.lastseoallnumber);
                seoData.status = response.seoallnumber - response.lastseoallnumber>0?'up':response.seoallnumber - response.lastseoallnumber<0?'down':'flat';
                seoData.avgNumber = response.seoavgmonth;
                seoData.historyMaxNumber = response.seohistorymaxnumber[0].effectivenumber;
                seoData.historyMaxNumberDate = response.seohistorymaxnumber[0].xundate;
                seoData.mainData = [];
                seoData.totalChart = [];
                seoData.randomStr = randomString(4);
                response.seotong.forEach(function(item){
                  var itemChart = {};
                  itemChart.name = item[0].name+"组";
                  itemChart.value = 0;
                  item.forEach(function(item1){
                    item1.key = item1.date+" "+item1.week;
                    item1.value = item1.xunnumber;
                    item1.name = item1.name+"组";
                    seoData.mainData.push(item1);
                    itemChart.value += item1.xunnumber;
                  });
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
                snsData.nowNumber = response.snsallnumber;
                snsData.lastNumber = response.lastsnsallnumber;
                snsData.nowLastNumber = Math.abs(response.snsallnumber - response.lastsnsallnumber);
                snsData.status = response.snsallnumber - response.lastsnsallnumber>0?'up':response.snsallnumber - response.lastsnsallnumber<0?'down':'flat';
                snsData.avgNumber = response.snsavgmonth;
                snsData.historyMaxNumber = response.snshistorymaxnumber[0].effectivenumber;
                snsData.historyMaxNumberDate = response.snshistorymaxnumber[0].xundate;
                snsData.mainData = [];
                snsData.totalChart = [];
                snsData.randomStr = randomString(4);
                response.snstong.forEach(function(item){
                  var itemChart = {};
                  itemChart.name = item[0].name+"组";
                  itemChart.value = 0;
                  item.forEach(function(item1){
                    item1.key = item1.date+" "+item1.week;
                    item1.value = item1.xunnumber;
                    item1.name = item1.name+"组";
                    snsData.mainData.push(item1);
                    itemChart.value += item1.xunnumber;
                  });
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
          if(item.value=="inquiryCount"||item.value=="inquiryRegion"){
            item.isOn = true;
            selectedContrastType.push(item.id);
            selectedType.push(item.value);
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
      $this.getGourpName();
      $this.getSearchData();
    },
    //组装小组选中名字
    getGourpName(){
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
        contrastList.forEach(function(item,index){
          if($this.selectedData.isMonth){
            item.disabled = false;
          }else{
            if(item.value=="dealIntegral"||item.value=="dealRegion"||item.value=="product"){
              item.isOn = false;
              item.disabled = true;
            }else{
              item.disabled = false;
            }
          }
          if(item.isOn){
            selectedContrastType.push(item.id);
          }
        });
        $this.selectedData.type = selectedContrastType;
        $this.contrastList = contrastList;
        $this.getSearchData();
      }
    },
    // 日期对比点击事件
    dateCompareChangeHandler(){
      var $this = this;
      // 只有在对比小组没有被选中的，此时日期对比才是非禁用状态，可点击的
      if($this.selectedData.contrastGroupID.length==0){
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
    },
    // 对比小组点击事件
    contrastGroupChangeHandler(obj){
      var $this = this;
      if(!obj.disabled){
        var selectedContrastGroupID = [];
        var contrastGroupList = $this.contrastGroupList;
        contrastGroupList.forEach(function(item,index){
          if(item.userid == obj.userid){
            item.isOn = !item.isOn;
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
      var startDate = startYear+"-"+startMonth;
      var endDate = endYear+"-"+endMonth;
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
      var startDate = startYear+"-"+startMonth+"-"+startDay;
      var endDate = endYear+"-"+endMonth+"-"+endDay;
      return [startDate,endDate];
    },
    // 组装请求所需数据
    searchDataInit(){
      var $this = this;
      var searchData = {};
      if($this.selectedData.dateDefault&&$this.selectedData.dateDefault.length>0){
        searchData.starttime = $this.selectedData.dateDefault[0];
        searchData.endtime = $this.selectedData.dateDefault[1];
      }
      if($this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0&&$this.selectedData.isDateCompare){
        searchData.comparestarttime = $this.selectedData.dateContrast[0];
        searchData.compareendtime = $this.selectedData.dateContrast[1];
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
            if(searchData.is_timecopmare==2&&searchData.starttime&&searchData.endtime){
              $this.tipsInfo = "当前小组分析页面，展示为："+searchData.starttime+" ~ " + searchData.endtime+" 与 "+searchData.comparestarttime+" ~ "+searchData.compareendtime+" 的日期对比数据信息。";
            }
            if(searchData.is_timecopmare==1&&searchData.starttime&&searchData.endtime){
              $this.tipsInfo = "当前小组分析页面，展示为："+searchData.starttime+" ~ " + searchData.endtime+" 的数据信息。";
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
      if(searchData.userid&&searchData.starttime&&searchData.endtime&&searchData.type){
        $this.isDefaultPage = false;
        $this.defaultChartData = [];
        $this.$store.dispatch('teamMember/cnGroupFilterAction', searchData).then(res=>{
          console.log(res,"筛选数据");
          $this.filterDataClump(res);
        });
      }
    },
    // 组装筛选结果数据
    filterDataClump(res){
      var $this = this;
      var defaultChartData = $this.defaultChartDataClump(res);
      var mapChartData = $this.mapChartDataClump(res);
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
          inquiryData.mainData = [];
          inquiryData.dateCompareData = {};
          // 月维度
          if($this.selectedData.isMonth){
            inquiryData.nowNumber = res.monthxunallnumber;
            if(res.selfmonthxuncompare[0].length>=res.selfmonthxuncompare[1].length){
              for(var i=0;i<res.selfmonthxuncompare[0].length;i++){
                var itemChart0 = {};
                var itemChart1 = {};
                if(res.selfmonthxuncompare[1][i]){
                  itemChart0.key = res.selfmonthxuncompare[0][i].date+"&"+res.selfmonthxuncompare[1][i].date;
                  itemChart0.name = $this.selectedData.dateDefault[0]+"~"+$this.selectedData.dateDefault[1];
                  itemChart1.key = res.selfmonthxuncompare[0][i].date+"&"+res.selfmonthxuncompare[1][i].date;
                  itemChart1.value = res.selfmonthxuncompare[1][i].xunnumber;
                  itemChart1.name = $this.selectedData.dateContrast[0]+"~"+$this.selectedData.dateContrast[1];
                }else{
                  itemChart0.key = res.selfmonthxuncompare[0][i].date+"&";
                  itemChart0.name = $this.selectedData.dateDefault[0]+"~"+$this.selectedData.dateDefault[1];
                }
                itemChart0.value = res.selfmonthxuncompare[0][i].xunnumber;
                inquiryData.mainData.push(itemChart0);
                inquiryData.mainData.push(itemChart1);
              }
            }else{
              for(var i=0;i<res.selfmonthxuncompare[1].length;i++){
                var itemChart0 = {};
                var itemChart1 = {};
                if(res.selfmonthxuncompare[0][i]){
                  itemChart1.key = res.selfmonthxuncompare[0][i].date+"&"+res.selfmonthxuncompare[1][i].date;
                  itemChart0.key = res.selfmonthxuncompare[0][i].date+"&"+res.selfmonthxuncompare[1][i].date;
                  itemChart1.name = $this.selectedData.dateContrast[0]+"~"+$this.selectedData.dateContrast[1];
                  itemChart0.value = res.selfmonthxuncompare[0][i].xunnumber;
                  itemChart0.name = $this.selectedData.dateDefault[0]+"~"+$this.selectedData.dateDefault[1];
                }else{
                  itemChart1.key = "&"+res.selfmonthxuncompare[1][i].date;
                  itemChart1.name = $this.selectedData.dateContrast[0]+"~"+$this.selectedData.dateContrast[1];
                }
                itemChart1.value = res.selfmonthxuncompare[1][i].xunnumber;
                inquiryData.mainData.push(itemChart0);
                inquiryData.mainData.push(itemChart1);
              }
            }
            inquiryData.dateCompareData.baseValue = 0;
            inquiryData.dateCompareData.compareValue = 0;
            res.selfmonthxuncompare.forEach(function(item,index){
              item.forEach(function(item1){
                if(index == 0){
                  inquiryData.dateCompareData.baseValue += item1.xunnumber;
                }else{
                  inquiryData.dateCompareData.compareValue += item1.xunnumber;
                }
              });
            });
          }else{
            inquiryData.nowNumber = res.xunallnumber;
            // 日维度
            if(res.selfdayxuncompare[0].length>=res.selfdayxuncompare[1].length){
              for(var i=0;i<res.selfdayxuncompare[0].length;i++){
                var itemChart0 = {};
                var itemChart1 = {};
                if(res.selfdayxuncompare[1][i]){
                  itemChart0.key = res.selfdayxuncompare[0][i].date+"&"+res.selfdayxuncompare[1][i].date;
                  itemChart0.name = $this.selectedData.dateDefault[0]+"~"+$this.selectedData.dateDefault[1];
                  itemChart1.key = res.selfdayxuncompare[0][i].date+"&"+res.selfdayxuncompare[1][i].date;
                  itemChart1.value = res.selfdayxuncompare[1][i].xunnumber;
                  itemChart1.name = $this.selectedData.dateContrast[0]+"~"+$this.selectedData.dateContrast[1];
                }else{
                  itemChart0.key = res.selfdayxuncompare[0][i].date+"&";
                  itemChart0.name = $this.selectedData.dateDefault[0]+"~"+$this.selectedData.dateDefault[1];
                }
                itemChart0.value = res.selfdayxuncompare[0][i].xunnumber;
                inquiryData.mainData.push(itemChart0);
                inquiryData.mainData.push(itemChart1);
              }
            }else{
              for(var i=0;i<res.selfdayxuncompare[1].length;i++){
                var itemChart0 = {};
                var itemChart1 = {};
                if(res.selfdayxuncompare[0][i]){
                  itemChart1.key = res.selfdayxuncompare[0][i].date+"&"+res.selfdayxuncompare[1][i].date;
                  itemChart0.key = res.selfdayxuncompare[0][i].date+"&"+res.selfdayxuncompare[1][i].date;
                  itemChart1.name = $this.selectedData.dateContrast[0]+"~"+$this.selectedData.dateContrast[1];
                  itemChart0.value = res.selfdayxuncompare[0][i].xunnumber;
                  itemChart0.name = $this.selectedData.dateDefault[0]+"~"+$this.selectedData.dateDefault[1];
                }else{
                  itemChart1.key = "&"+res.selfdayxuncompare[0][i].date;
                  itemChart1.name = $this.selectedData.dateContrast[0]+"~"+$this.selectedData.dateContrast[1];
                }
                itemChart1.value = res.selfdayxuncompare[1][i].xunnumber;
                inquiryData.mainData.push(itemChart0);
                inquiryData.mainData.push(itemChart1);
              }
            }
            inquiryData.dateCompareData.baseValue = 0;
            inquiryData.dateCompareData.compareValue = 0;
            res.selfdayxuncompare.forEach(function(item,index){
              item.forEach(function(item1){
                if(index == 0){
                  inquiryData.dateCompareData.baseValue += item1.xunnumber;
                }else{
                  inquiryData.dateCompareData.compareValue += item1.xunnumber;
                }
              });
            });
          }
          // 时间对比数据
          inquiryData.dateCompareData.baseDate = $this.selectedData.dateDefault[0]+"~"+$this.selectedData.dateDefault[1];
          inquiryData.dateCompareData.compareDate = $this.selectedData.dateContrast[0]+"~"+$this.selectedData.dateContrast[1]
          if(inquiryData.dateCompareData.baseValue - inquiryData.dateCompareData.compareValue>0){
            inquiryData.dateCompareData.status = "up";
            inquiryData.dateCompareData.baseWidth = "100%";
            inquiryData.dateCompareData.compareWidth = parseInt(inquiryData.dateCompareData.compareValue/inquiryData.dateCompareData.baseValue*100)+"%";
          }else if(inquiryData.dateCompareData.baseValue - inquiryData.dateCompareData.compareValue<0){
            inquiryData.dateCompareData.status = "down";
            inquiryData.dateCompareData.compareWidth = "100%";
            inquiryData.dateCompareData.baseWidth = parseInt(inquiryData.dateCompareData.baseValue/inquiryData.dateCompareData.compareValue*100)+"%";
          }else{
            inquiryData.dateCompareData.status = "flat";
            inquiryData.dateCompareData.baseWidth = "100%";
            inquiryData.dateCompareData.compareWidth = "100%";
          }
          inquiryData.dateCompareData.compareNumber = Math.abs(inquiryData.dateCompareData.baseValue - inquiryData.dateCompareData.compareValue);
          inquiryData.dateCompareData.compareRate = (inquiryData.dateCompareData.compareNumber/inquiryData.dateCompareData.compareValue*100).toFixed(2)+"%";
          if($this.selectedData.groupID.length==1){
            $this.groupList.forEach(function(item){
              if(item.userid == $this.selectedData.groupID[0]){
                inquiryData.chartTitle = item.departName+"-"+item.groupName+"组询盘时间对比趋势";
                inquiryData.name = item.departName+"-"+item.groupName+"组总询盘";
              }
            });
          }else{
            inquiryData.chartTitle = "小组组合总询盘时间对比趋势";
            inquiryData.name = "小组组合总询盘";
          }
        }else{
          // 小组对比
          if($this.selectedData.contrastGroupID.length>0){
            inquiryData.chartTitle = "各小组询盘趋势对比";
            inquiryData.mainData = [];
            var chartData = []
            if($this.selectedData.isMonth){
              // 月维度
              chartData = res.monthxuntrendcompare;
            }else{
              // 日维度
              chartData = res.dayxuntrendcompare;
            }
            chartData.forEach(function(item,index){
              item.forEach(function(item1){
                var itemChart = {};
                if($this.judgeData.pluralGroupTeamCompare){
                  if(index == 0){
                    itemChart.name = "已多选小组";
                  }else{
                    itemChart.name = item1.depart+"组";
                  }
                }else{
                  itemChart.name = item1.depart+"组";
                }
                if($this.selectedData.isMonth){
                  // 月维度
                  itemChart.key = item1.date;
                }else{
                  // 日维度
                  itemChart.key = item1.date+" "+item1.week;
                }
                itemChart.value = item1.xunnumber;
                inquiryData.mainData.push(itemChart);
              });
            });
            if(!$this.judgeData.pluralGroupTeamSameCompare){
              inquiryData.name = "小组总询盘";
              if($this.selectedData.isMonth){
                inquiryData.nowNumber = res.monthxunallnumbercompare
              }else{
                inquiryData.nowNumber = res.xunallnumbercompare;
              }
              inquiryData.totalChart = [];
              if($this.selectedData.isMonth){
                res.monthdepartpercentercompare.forEach(function(item){
                  var itemChart = {};
                  itemChart.name = item.departname+"组";
                  itemChart.value = item.xunnumber;
                  inquiryData.totalChart.push(itemChart);
                });
              }else{
                res.departpercentercompare.forEach(function(item){
                  var itemChart = {};
                  itemChart.name = item.departname+"组";
                  itemChart.value = item.xunnumber;
                  inquiryData.totalChart.push(itemChart);
                });
              }
              inquiryData.totalChart.sort(sortByDesc("value"));
            }
          }else{
            // 统计
            inquiryData.mainData = [];
            // 月维度
            if($this.selectedData.isMonth){
              inquiryData.nowNumber = res.monthxunallnumber;
              res.monthxuntrend.forEach(function(item,index){
                item.key = item.date;
                item.value = item.xunnumber;
                inquiryData.mainData.push(item);
              });
              inquiryData.avgTitle = "月平均询盘个数";
              inquiryData.historyTitle = "月历史峰值";
            }else{
              inquiryData.nowNumber = res.xunallnumber;
              // 日维度
              res.dayxuntrend.forEach(function(item,index){
                item.key = item.date+" "+item.week;
                item.value = item.xunnumber;
                inquiryData.mainData.push(item);
              });
              inquiryData.avgTitle = "日平均询盘个数";
              inquiryData.historyTitle = "日历史峰值";
            }
            // 只有一个小组被选中的情况
            if($this.selectedData.groupID.length==1){
              $this.groupList.forEach(function(item){
                if(item.userid == $this.selectedData.groupID[0]){
                  inquiryData.chartTitle = item.departName+"-"+item.groupName+"组询盘趋势";
                  inquiryData.name = item.departName+"-"+item.groupName+"组总询盘";
                }
              });
              if($this.selectedData.isMonth){
                inquiryData.lastNumber = res.lastmonthxunallnumber;
                inquiryData.nowLastNumber = Math.abs(res.monthxunallnumber - res.lastmonthxunallnumber);
                inquiryData.status = res.monthxunallnumber - res.lastmonthxunallnumber>0?'up':res.monthxunallnumber - res.lastmonthxunallnumber<0?'down':'flat';
                inquiryData.avgNumber = res.monthavgxun;
                inquiryData.historyMaxNumber = res.historymaxnumbermonth[0].number;
                inquiryData.historyMaxNumberDate = res.historymaxnumbermonth[0].yeartime;
              }else{
                inquiryData.lastNumber = res.lastxunallnumber;
                inquiryData.nowLastNumber = Math.abs(res.xunallnumber - res.lastxunallnumber);
                inquiryData.status = res.xunallnumber - res.lastxunallnumber>0?'up':res.xunallnumber - res.lastxunallnumber<0?'down':'flat';
                inquiryData.avgNumber = res.avgxunnumber;
                inquiryData.historyMaxNumber = res.historymaxnumberday[0].number;
                inquiryData.historyMaxNumberDate = res.historymaxnumberday[0].xundate;
              }
            }else{// 多小组被选中
              inquiryData.chartTitle = "小组组合总询盘趋势";
              inquiryData.name = "小组组合总询盘";
              inquiryData.totalChart = [];
              if($this.selectedData.isMonth){
                res.monthdepartpercenter.forEach(function(item){
                  var itemChart = {};
                  itemChart.name = item.departname+"组";
                  itemChart.value = item.xunnumber;
                  inquiryData.totalChart.push(itemChart);
                });
              }else{
                res.departpercenter.forEach(function(item){
                  var itemChart = {};
                  itemChart.name = item.departname+"组";
                  itemChart.value = item.xunnumber;
                  inquiryData.totalChart.push(itemChart);
                });
              }
              inquiryData.totalChart.sort(sortByDesc("value"));
            }
          }
        }
        inquiryData.totalTitle = "总询盘数量";
        inquiryData.unit = "（单位：个）";
        inquiryData.randomStr = randomString(4);
      }
      // 成交积分趋势
      var dealIntegralData = null;
      if($this.selectedType.includes("dealIntegral")){
        dealIntegralData = {};
        // 时间对比
        if($this.selectedData.isDateCompare&&$this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
          dealIntegralData.mainData = [];
          dealIntegralData.dateCompareData = {};
          dealIntegralData.nowNumber = res.monthscoreallnumber;
          if(res.selfmonthscoretrend[0].length>=res.selfmonthscoretrend[1].length){
            for(var i=0;i<res.selfmonthscoretrend[0].length;i++){
              var itemChart0 = {};
              var itemChart1 = {};
              if(res.selfmonthscoretrend[1][i]){
                itemChart0.key = res.selfmonthscoretrend[0][i].date+"&"+res.selfmonthscoretrend[1][i].date;
                itemChart0.name = $this.selectedData.dateDefault[0]+"~"+$this.selectedData.dateDefault[1];
                itemChart1.key = res.selfmonthscoretrend[0][i].date+"&"+res.selfmonthscoretrend[1][i].date;
                itemChart1.value = res.selfmonthscoretrend[1][i].score;
                itemChart1.name = $this.selectedData.dateContrast[0]+"~"+$this.selectedData.dateContrast[1];
              }else{
                itemChart0.key = res.selfmonthscoretrend[0][i].date+"&";
                itemChart0.name = $this.selectedData.dateDefault[0]+"~"+$this.selectedData.dateDefault[1];
              }
              itemChart0.value = res.selfmonthscoretrend[0][i].score;
              dealIntegralData.mainData.push(itemChart0);
              dealIntegralData.mainData.push(itemChart1);
            }
          }else{
            for(var i=0;i<res.selfmonthscoretrend[1].length;i++){
              var itemChart0 = {};
              var itemChart1 = {};
              if(res.selfmonthscoretrend[0][i]){
                itemChart1.key = res.selfmonthscoretrend[0][i].date+"&"+res.selfmonthscoretrend[1][i].date;
                itemChart0.key = res.selfmonthscoretrend[0][i].date+"&"+res.selfmonthscoretrend[1][i].date;
                itemChart1.name = $this.selectedData.dateContrast[0]+"~"+$this.selectedData.dateContrast[1];
                itemChart0.value = res.selfmonthscoretrend[0][i].score;
                itemChart0.name = $this.selectedData.dateDefault[0]+"~"+$this.selectedData.dateDefault[1];
              }else{
                itemChart1.key = "&"+res.selfmonthscoretrend[1][i].date;
                itemChart1.name = $this.selectedData.dateContrast[0]+"~"+$this.selectedData.dateContrast[1];
              }
              itemChart1.value = res.selfmonthscoretrend[1][i].score;
              dealIntegralData.mainData.push(itemChart0);
              dealIntegralData.mainData.push(itemChart1);
            }
          }
          dealIntegralData.dateCompareData.baseValue = 0;
          dealIntegralData.dateCompareData.compareValue = 0;
          res.selfmonthscoretrend.forEach(function(item,index){
            item.forEach(function(item1){
              if(index == 0){
                dealIntegralData.dateCompareData.baseValue += item1.score;
              }else{
                dealIntegralData.dateCompareData.compareValue += item1.score;
              }
            });
          });
          // 时间对比数据
          dealIntegralData.dateCompareData.baseDate = $this.selectedData.dateDefault[0]+"~"+$this.selectedData.dateDefault[1];
          dealIntegralData.dateCompareData.compareDate = $this.selectedData.dateContrast[0]+"~"+$this.selectedData.dateContrast[1]
          if(dealIntegralData.dateCompareData.baseValue - dealIntegralData.dateCompareData.compareValue>0){
            dealIntegralData.dateCompareData.status = "up";
            dealIntegralData.dateCompareData.baseWidth = "100%";
            dealIntegralData.dateCompareData.compareWidth = parseInt(dealIntegralData.dateCompareData.compareValue/dealIntegralData.dateCompareData.baseValue*100)+"%";
          }else if(dealIntegralData.dateCompareData.baseValue - dealIntegralData.dateCompareData.compareValue<0){
            dealIntegralData.dateCompareData.status = "down";
            dealIntegralData.dateCompareData.compareWidth = "100%";
            dealIntegralData.dateCompareData.baseWidth = parseInt(dealIntegralData.dateCompareData.baseValue/dealIntegralData.dateCompareData.compareValue*100)+"%";
          }else{
            dealIntegralData.dateCompareData.status = "flat";
            dealIntegralData.dateCompareData.baseWidth = "100%";
            dealIntegralData.dateCompareData.compareWidth = "100%";
          }
          dealIntegralData.dateCompareData.compareNumber = Math.abs(dealIntegralData.dateCompareData.baseValue - dealIntegralData.dateCompareData.compareValue);
          dealIntegralData.dateCompareData.compareRate = (dealIntegralData.dateCompareData.compareNumber/dealIntegralData.dateCompareData.compareValue*100).toFixed(2)+"%";
          if($this.selectedData.groupID.length==1){
            $this.groupList.forEach(function(item){
              if(item.userid == $this.selectedData.groupID[0]){
                dealIntegralData.chartTitle = item.departName+"-"+item.groupName+"组成交积分时间对比趋势";
                dealIntegralData.name = item.departName+"-"+item.groupName+"组总成交积分";
              }
            });
          }else{
            dealIntegralData.chartTitle = "小组组合总成交积分时间对比趋势";
            dealIntegralData.name = "小组组合总成交积分";
          }
        }else{
          // 小组对比
          if($this.selectedData.contrastGroupID.length>0){
            dealIntegralData.chartTitle = "各小组成交积分趋势对比";
            dealIntegralData.mainData = [];
            var chartData = res.monthscoretrendcompare;
            chartData.forEach(function(item,index){
              item.forEach(function(item1){
                var itemChart = {};
                if($this.judgeData.pluralGroupTeamCompare){
                  if(index == 0){
                    itemChart.name = "已多选小组";
                  }else{
                    itemChart.name = item1.depart+"组";
                  }
                }else{
                  itemChart.name = item1.depart+"组";
                }
                itemChart.key = item1.date;
                itemChart.value = item1.score;
                dealIntegralData.mainData.push(itemChart);
              });
            });
            if(!$this.judgeData.pluralGroupTeamSameCompare){
              dealIntegralData.name = "小组总成交积分";
              dealIntegralData.nowNumber = res.monthscoreallnumbercompare
              dealIntegralData.totalChart = [];
              res.monthdepartscorepercentercompare.forEach(function(item){
                var itemChart = {};
                itemChart.name = item.departname+"组";
                itemChart.value = item.score;
                dealIntegralData.totalChart.push(itemChart);
              });
            }
          }else{
            // 统计
            dealIntegralData.mainData = [];
            dealIntegralData.nowNumber = res.monthscoreallnumber;
            res.monthscoretrend.forEach(function(item,index){
              item.key = item.date;
              item.value = item.score;
              dealIntegralData.mainData.push(item);
            });
            // 只有一个小组被选中的情况
            if($this.selectedData.groupID.length==1){
              $this.groupList.forEach(function(item){
                if(item.userid == $this.selectedData.groupID[0]){
                  dealIntegralData.chartTitle = item.departName+"-"+item.groupName+"组总成交积分趋势";
                  dealIntegralData.name = item.departName+"-"+item.groupName+"组总成交积分";
                }
              });
              dealIntegralData.lastNumber = res.lastmonthscoreallnumber;
              dealIntegralData.nowLastNumber = Math.abs(res.monthscoreallnumber - res.lastmonthscoreallnumber);
              dealIntegralData.status = res.monthscoreallnumber - res.lastmonthscoreallnumber>0?'up':res.monthscoreallnumber - res.lastmonthscoreallnumber<0?'down':'flat';
              dealIntegralData.avgNumber = res.monthscoreavgxun;
              dealIntegralData.historyMaxNumber = res.historymaxscoremonth[0].score;
              dealIntegralData.historyMaxNumberDate = res.historymaxscoremonth[0].yeartime;
              dealIntegralData.avgTitle = "月平均成交积分";
              dealIntegralData.historyTitle = "月历史峰值";
            }else{// 多小组被选中
              dealIntegralData.chartTitle = "小组组合总成交积分趋势";
              dealIntegralData.name = "小组组合总成交积分";
              dealIntegralData.totalChart = [];
              res.monthdepartscorepercenter.forEach(function(item){
                var itemChart = {};
                itemChart.name = item.departname+"组";
                itemChart.value = item.score;
                dealIntegralData.totalChart.push(itemChart);
              });
              dealIntegralData.totalChart.sort(sortByDesc("value"));
            }
          }
        }
        dealIntegralData.totalTitle = "总成交积分";
        dealIntegralData.unit = "（单位：分）";
        dealIntegralData.randomStr = randomString(4);
      }
      var defaultChartData = [];
      if(inquiryData){
        defaultChartData.push(inquiryData);
      }
      if(dealIntegralData){
        defaultChartData.push(dealIntegralData);
      }
      return defaultChartData;
    },
    // 组装地图类型图表数据
    mapChartDataClump(res){
      var $this = this;
      var inquiryMapData = null;
      // 询盘地图
      if($this.selectedType.includes("inquiryRegion")){
        inquiryMapData = [];
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
          var itemMapChart0 = {};
          var itemMapChart1 = {};
          var title = "";
          $this.groupList.forEach(function(item){
            if(item.isOn){
              title = item.departName+"-"+item.groupName+"组";
            }
          });
          itemMapChart0.title = title+"("+$this.selectedData.dateDefault[0]+"~"+$this.selectedData.dateDefault[1]+")";
          itemMapChart0.mapData = mapData[0];
          itemMapChart0.randomStr = randomString(4);
          itemMapChart1.title = title+"("+$this.selectedData.dateContrast[0]+"~"+$this.selectedData.dateContrast[1]+")";
          itemMapChart1.mapData = mapData[1];
          itemMapChart1.randomStr = randomString(4);
          inquiryMapData.push(itemMapChart0);
          inquiryMapData.push(itemMapChart1);
        }else{
          // 小组对比
          if($this.selectedData.contrastGroupID.length>0){
            if($this.selectedData.isMonth){
              // 月维度
              chartData = res.monthxuntrendcompare;
            }else{
              // 日维度
              chartData = res.dayxuntrendcompare;
            }
          }else{
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
            itemMapData.title = "询盘地图展示 （地区询盘排行榜）";
            itemMapData.unit = "(单位：个)";
            itemMapData.isMap = true;
            inquiryMapData.push(itemMapData);
          }
        }
      }
      // 成交积分地图
      var dealRegionMapData = null
      if($this.selectedType.includes("dealRegion")){}
      var mapChartData = [];
      if(inquiryMapData){
        mapChartData.push(inquiryMapData);
      }
      if(dealRegionMapData){
        mapChartData.push(dealRegionMapData);
      }
      return mapChartData;
    },
    // 组装产品分析数据
    productDataClump(res){
      var $this = this;
      if($this.selectedType.includes("product")){}
    },
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
              }else{
                //无分析项被选中的情况下
                $this.defaultChartData = [];
              }
            }else{
              // 基础小组选中1个，且基础时间有值，而对比时间无值
              // 且有对比小组被选中
              if($this.selectedData.contrastGroupID.length>0){
                if($this.selectedData.type.length>0){
                  judgeData.singleGroupTeamCompare = true;
                }else{
                  //无分析项被选中的情况下
                  $this.defaultChartData = [];
                }
              }else{
                // 对比时间无值，对比小组也无值，此情况为单一小组统计
                if($this.selectedData.type.length>0){
                  judgeData.singleGroupStatic = true;
                }else{
                  //无分析项被选中的情况下
                  $this.defaultChartData = [];
                }
              }
            }
          }else{
            // 基础小组选中1个，基础时间没有默认值的情况下，当前页数据清空
            $this.defaultChartData = [];
          }
        }else{
          // 基础小组有多个被选中
          // 且基础时间有值
          if($this.selectedData.dateDefault&&$this.selectedData.dateDefault.length>0){
            // 且对比时间有值，此时是基础多小组的时间对比
            if($this.selectedData.dateContrast&&$this.selectedData.dateContrast.length>0){
              if($this.selectedData.type.length>0){
                judgeData.pluralGroupDateCompare = true;
              }else{
                //无分析项被选中的情况下
                $this.defaultChartData = [];
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
                }else{
                  //无分析项被选中的情况下
                  $this.defaultChartData = [];
                }
              }else{
                // 对比时间无值，对比小组也无值，此情况为多基础小组统计
                if($this.selectedData.type.length>0){
                  judgeData.pluralGroupStatic = true;
                }else{
                  //无分析项被选中的情况下
                  $this.defaultChartData = [];
                }
              }
            }
          }else{
            // 基础小组选中多个，基础时间没有默认值的情况下，当前页数据清空
            $this.defaultChartData = [];
          }
        }
      }else{
        // 基础小组没有被选中的，当前页数据清空
        $this.defaultChartData = [];
      }
      $this.judgeData = judgeData;
    }
  }
}
</script>



