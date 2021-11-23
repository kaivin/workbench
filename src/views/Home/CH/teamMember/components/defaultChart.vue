<template>
  <div class="item-row default-chart flex-box">
    <div class="item-column flex-box flex-column" v-if="isDefault||parentData.singleGroupStatic||parentData.singleGroupDateCompare||parentData.singleGroupTeamCompare||parentData.pluralGroupStatic||parentData.pluralGroupDateCompare||(parentData.pluralGroupTeamCompare&&!parentData.pluralGroupTeamSameCompare)">
      <div class="column-header flex-box">
        <div class="flex-content txt-header">
          <strong>{{currentData.name}}</strong><span>{{currentData.unit}}</span>
        </div>
        <div class="item-change" v-if="tabList">
          <div class="item-font" v-bind:class="item.isOn?'active':''" v-for="item in tabList" v-bind:key="item.value" v-on:click="tabChange(item)">{{item.label}}</div>
        </div>
      </div>
      <div class="column-body flex-content">
        <div class="item-tab default-panel" v-show="currentType=='default'">
          <div class="total-num">
            <div class="txt-num">
            <strong>{{currentData.nowNumber}}</strong>
            <span v-if="parentData.singleGroupStatic"><em>环比上年同期</em><b v-bind:class="currentData.status"><i class="svg-i"><svg-icon :icon-class="'data-'+currentData.status" /></i>{{currentData.nowLastNumber}}</b></span></div>
            <div class="txt-font">{{currentData.totalTitle}}</div>
          </div>
          <div class="other-num" v-if="parentData.singleGroupStatic">
            <div class="item-num">
              <dl>
                <dt>{{currentData.avgNumber}}</dt>
                <dd>{{currentData.avgTitle}}</dd>
              </dl>
            </div>
            <div class="item-num">
              <dl>
                <dt>{{currentData.historyMaxNumber}}</dt>
                <dd>{{currentData.historyTitle}}({{currentData.historyMaxNumberDate}})</dd>
              </dl>
            </div>
          </div>
        </div>
        <template v-if="isDefault||parentData.singleGroupTeamCompare||parentData.pluralGroupStatic||(parentData.pluralGroupTeamCompare&&!parentData.pluralGroupTeamSameCompare)">
          <div class="item-tab pie-panel" v-show="currentType=='pie'">
            <div class="pie-chart" :id="'pie-'+currentData.randomStr"></div>
          </div>
          <div class="item-tab rank-panel" v-show="currentType=='rank'">
            <div class="column-chart" :id="'column-'+currentData.randomStr"></div>
          </div>
        </template>
        <div class="item-tab date-panel" v-if="currentType=='date'&&(parentData.singleGroupDateCompare||parentData.pluralGroupDateCompare)">
          <dl class="item-range" :style="'width:'+currentData.dateCompareData.baseWidth">
            <dt class="flex-box"><span class="flex-content">{{currentData.dateCompareData.baseDate}}</span><strong>{{currentData.dateCompareData.baseValue}}</strong></dt>
            <dd></dd>
          </dl>
          <dl class="item-range" :style="'width:'+currentData.dateCompareData.compareWidth">
            <dt class="flex-box"><span class="flex-content">{{currentData.dateCompareData.compareDate}}</span><strong>{{currentData.dateCompareData.compareValue}}</strong></dt>
            <dd></dd>
          </dl>
          <div class="num-panel">
            <div class="item-num">
              <div class="num-font">
                <span class="icon"><i class="svg-i"><svg-icon icon-class="home_num" /></i></span>
                <span class="txt-font">
                  <b>同比增长量</b>
                  <strong :class="currentData.dateCompareData.status">{{currentData.dateCompareData.compareNumber}}<i class="svg-i"><svg-icon :icon-class="'data-'+currentData.dateCompareData.status" /></i></strong>
                </span>
              </div>
            </div>
            <div class="item-num">
              <div class="num-font">
                <span class="icon"><i class="svg-i"><svg-icon icon-class="home_rate" /></i></span>
                <span class="txt-font">
                  <b>同比增长率</b>
                  <strong :class="currentData.dateCompareData.status">{{currentData.dateCompareData.compareRate}}<i class="svg-i"><svg-icon :icon-class="'data-'+currentData.dateCompareData.status" /></i></strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-content flex-box flex-column">
      <div class="chart-header flex-box">
        <div class="title-panel"><strong>{{currentData.chartTitle}}</strong><span>{{currentData.unit}}</span></div>
        <div class="legend-list flex-content">
          <div class="item-legend"></div>
        </div>
      </div>
      <div class="flex-content chart-content">
        <div class="chart-panel" :id="'area-'+currentData.randomStr"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { Pie,Column,Area } from '@antv/g2plot';
export default {
  name: "defaultChart",
  data:function() {
    return {
      currentType:"default",
      tabList:null,
      parentData:{},
    };
  },
  props: {
    itemData: {
      type: Object,
      default:{},
    },
    judgeData:{
      type: Object,
      default: function () {
        return {};
      },
    },
    isDefaultPage:{
      type:Boolean,
      default:false,
    },
  },
  computed:{
    isDefault(){
      return this.isDefaultPage;
    },
    currentData(){
      return this.itemData;
    },
  },
  watch: {
    judgeData:{
      handler(newValue, oldValue) {
        this.parentData = newValue;
        this.tabTypeChange();
      },
      deep: true,
      immediate:true
    },
  },
  mounted(){
    this.drawAreaChart();
  },
  methods:{
    // 选项卡切换事件
    tabChange(obj){
      var $this = this;
      var tabList = $this.tabList;
      tabList.forEach(function(item){
        if(item.value == obj.value){
          item.isOn = !item.isOn;
          if(item.isOn){
            $this.currentType = item.value;
            if(obj.value=="pie"){
              $this.drawPieChart();
            }else if(obj.value=="rank"){
              $this.drawColumnChart();
            }
          }else{
            $this.currentType = "default";
          }
        }else{
          if(item.isOn){
            item.isOn = !item.isOn
          }
        }
      });
      $this.tabList = tabList;
    },
    // 判断选项卡类别
    tabTypeChange(){
      var $this = this;
      var tabList = null;
      if($this.parentData.singleGroupDateCompare||$this.parentData.pluralGroupDateCompare){
        $this.currentType = "date";
      }
      if($this.parentData.singleGroupTeamCompare||$this.parentData.pluralGroupStatic||$this.parentData.pluralGroupTeamCompare||$this.isDefault){
        tabList =[
          {label:"占比",value:"pie",isOn:false},
          {label:"排行",value:"rank",isOn:false},
        ]
      }
      $this.tabList = tabList;
    },
    // 排行图例
    drawColumnChart(){
      var $this = this;
      if(!$this.columnPlot){
        const columnPlot = new Column('column-'+$this.currentData.randomStr, {
          appendPadding: [20,30, 10],
          data:$this.currentData.totalChart,
          xField: 'name',
          yField: 'value',
          width: 390,
          height: 290,
          minColumnWidth:30,
          maxColumnWidth:30,
          columnStyle:{
            fill: 'l(270) 0:#c6d6f4 1:#81a7f1',
          },
          label: {
            // 可手动配置 label 数据标签位置
            position: 'top', // 'top', 'bottom', 'middle',
            offsetY:8,
            // 配置样式
            style: {
              fill: '#333333',
              opacity: 1,
              fontWeight:'bold',
            },
          },
          xAxis: {
            label: {
              formatter: (v) => {
                var item = "";
                if(v.indexOf("-")!=-1){
                  item = v.split("-")[0]+"\n"+v.split("-")[1];
                }else{
                  item = v
                }
                return item
              },
              style:{
                lineHeight:18
              }
            },
            grid:null,
            tickLine:null,
            subTickLine:null,
          },
          yAxis:{
            tickCount:5,
            grid: {
              line: {
                style: {
                  stroke: 'black',
                  lineWidth: .5,
                  lineDash: [6, 3],
                  strokeOpacity:0.2,
                  shadowBlur:0
                }
              }
            },
          },
          meta: {
            name: {
              alias: '小组',
            },
            value: {
              alias: '询盘个数',
            },
          },
        });
        $this.columnPlot = columnPlot;
        columnPlot.render();
      }
    },
    // 占比图例
    drawPieChart(){
      var $this = this;
      if(!$this.piePlot){
        const piePlot = new Pie('pie-'+$this.currentData.randomStr, {
          appendPadding: 10,
          data:$this.currentData.totalChart,
          angleField: 'value',
          colorField: 'name',
          radius: 0.75,
          width: 390,
          height: 290,
          animation: {
            // 配置图表第一次加载时的入场动画
            appear: {
              animation: 'zoom-in', // 动画效果
              duration: 500,  // 动画执行时间
            },
          },
          label: {
            type:'spider',
            labelHeight: 28,
            style:{
              fill:'#bfbfbf',
            },
            content:(data)=>{
              return '个数：'+data.value+'\n占比：'+ Math.floor(data.percent * 10000) / 100+"%";
            } ,
          },
          legend:{
            layout:'horizontal',
            position:'bottom',
            flipPage:false,
          },// 自定义状态样式
          state: {
            active: {
              style: {
                lineWidth: 0,
                fillOpacity: 0.65,
              },
            },
          },
          interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
        });
        $this.piePlot = piePlot;
        piePlot.render();
      }
    },
    // 面积趋势图例
    drawAreaChart(){
      var $this = this;
      if(!$this.areaPlot&&$this.currentData){
        var isPluralLine = false;
        if($this.parentData.pluralGroupDateCompare||$this.parentData.pluralGroupTeamCompare||$this.parentData.singleGroupDateCompare||$this.parentData.singleGroupTeamCompare||$this.isDefault){
          isPluralLine = true;
        }
        const areaPlot = new Area('area-'+$this.currentData.randomStr, {
          appendPadding: isPluralLine?[30,30,20]:[60,30,20],
          data:$this.currentData.mainData,
          xField: 'key',
          yField: 'value',
          seriesField:isPluralLine?'name':'',
          isStack:false,
          yAxis:{
            grid:{
              line:{
                style:{
                  stroke: 'black',
                  lineWidth:1,
                  lineDash:[6,3],
                  strokeOpacity:0.1,
                  shadowBlur:0
                }
              }
            },
          },
          xAxis: {
            tickCount:15,
            label: {
              // 数值格式化为千分位
              formatter: (v) => {
                var item = "";
                if(v.indexOf("&")!=-1){
                  item = v.split("&")[0]+'\n'+v.split("&")[1];
                }else{
                  if(v.indexOf(" ")!=-1){
                    var week = "周"+v.split(" ")[1].substr(2);
                    var date = v.split(" ")[0];
                    item = date.split("-")[1]+"-"+date.split("-")[2]+'\n'+week;
                  }else{
                    item = v.split("-")[1]+"月";
                  }
                }
                return item
              },
              style:{
                lineHeight:18
              }
            },
          },
          legend:{
            layout:'horizontal',
            position:'top',
            flipPage:false,
            offsetX:-30,
            label:{
              style:{
                textBaseline:"middle"
              }
            },
          },// 自定义状态样式
          areaStyle: (data) => {
            return {
              fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
            };
          },
        });
        $this.areaPlot = areaPlot;
        areaPlot.render();
      }
    },
  },
};
</script>

<style>
</style>