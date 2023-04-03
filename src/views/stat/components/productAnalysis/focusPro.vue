<template>
    <div class="focusProMain flex-wrap">
        <div class="focusProUlFl">
            <router-link :to="{path: lang == 'ch'?'/stat/cn/productAnalysis/ProAccount':'/stat/en/productAnalysis/ProAccount',query:{starttime:starttime,endtime:endtime,productname:focusPro.name,typeid:focusPro.typeid}}" tag="a" target="_blank">{{focusPro.name}}</router-link>
            <dl>
                <dd>
                    <p class="focusProUlFlTop">{{focusPro.todayxunnumber}}</p>
                    <p class="focusProUlFlBom">今日询盘</p>
                </dd>
                <dd>
                    <p class="focusProUlFlTop">{{focusPro.lastdayxunnumber}}</p>
                    <p class="focusProUlFlBom">昨日询盘</p>
                </dd>
                <dd>
                    <p class="focusProUlFlTop">{{focusPro.weekxunnumber}}<span :class="focusPro.weekxunnumber-focusPro.lastweekxunnumber>=0?'':'fall'"><i><svg-icon :icon-class="focusPro.weekxunnumber-focusPro.lastweekxunnumber>=0?'data-up':'data-down'" /></i>{{Math.abs(focusPro.weekxunnumber-focusPro.lastweekxunnumber)}}</span></p>
                    <p class="focusProUlFlBom">本周询盘</p>
                </dd>
                <dd>
                    <p class="focusProUlFlTop">{{focusPro.monthxunnumber}}<span :class="focusPro.monthxunnumber-focusPro.lastmonthxunnumber>=0?'':'fall'"><i><svg-icon :icon-class="focusPro.monthxunnumber-focusPro.lastmonthxunnumber>=0?'data-up':'data-down'" /></i>{{Math.abs(focusPro.monthxunnumber-focusPro.lastmonthxunnumber)}}</span></p>
                    <p class="focusProUlFlBom">本月询盘</p>
                </dd>
            </dl>
        </div>
        <div class="focusProUlFr flex-content" ref="focusProPane">
            <p class="focusProUlTit"><i class="icon"><svg-icon icon-class="tips" /></i>近7天部门<span :class="item.isOn?'active':''" v-for="item in tabList" :key="item.value" v-on:click="tabChange(item)">{{item.label}}</span></p>
            <div class="focusProUlChart" v-show="currentType=='trend'">
                  <div class="chart-panel" :style="'width:'+isWidth+'px; height:270px;'" :id="'trend'+focusPro.id"></div> 
            </div>
            <div class="focusProUlChart" v-show="currentType=='pie'">
                  <div class="chart-pie" :style="'width:'+isWidth+'px; height:270px; margin-left:-'+isWidth/2+'px;'" :id="'pie'+focusPro.id"></div> 
            </div>
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts';
export default {
  name: "focusPro",
  data() {
    return {
      currentType:"trend",
      tabList:null,
      myChart:null,
      pieChart:null,
    };
  },
  created() {
    var $this = this;
  },
  props: {
    focusPro:{
      type: Object,
      default: function () {
        return {};
      },
    },
    lang:{
      type: String,
      default: function () {
        return "";
      },
    },
    isWidth:{
      type: Number,
      default: "",
    },
    starttime:{
      type: String,
      default: function () {
        return "";
      },
    },
    endtime:{
      type: String,
      default: function () {
        return "";
      },
    },
  },
  watch: {
    focusPro:{
      handler(newValue, oldValue) {
        this.tabTypeChange();
      },
      deep: true,
      immediate:true
    },
  },
  destroyed(){
    window.removeEventListener('resize',this.echartsSize);
    if(this.myChart){
        this.myChart.dispose();
    }
    if(this.pieChart){
        this.pieChart.dispose();
    }
  },
  mounted(){
    window.addEventListener('resize',this.echartsSize);
    if(this.currentType=='trend'){
      this.drawAreaChart();
    }
  },
  methods: {
    // 选项卡切换事件
    tabChange(obj){
        var $this = this;
        var tabList = $this.tabList;
        $this.currentType = obj.value;
        tabList.forEach(function(item){
          if(item.value == obj.value){
            item.isOn = !item.isOn;
            if(item.isOn){
              $this.currentType = item.value;
              if(obj.value=="pie"){
                $this.drawPieChart();
              }else if(obj.value=="trend"){
                $this.drawAreaChart();
              }
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
      tabList =[
        {label:"趋势",value:"trend",isOn:true},
        {label:"占比",value:"pie",isOn:false},
      ]
      $this.tabList = tabList;
    },
    // 占比图例
    drawPieChart(){
      var $this = this;
      var chartDom = document.getElementById('pie'+$this.focusPro.id);
      var pieChart = echarts.init(chartDom);
      var colorList1=[];
      $this.focusPro.ChartColor.forEach(function(item,index){
          var itemObj={};
          itemObj.x=0;
          itemObj.y=0;
          itemObj.x2=0;
          itemObj.y2=1;
          itemObj.colorStops=[];
          var colorOne={};
          colorOne.offset=0;
          colorOne.color=item;            
          itemObj.colorStops.push(colorOne);
          var colorTwo={};
          colorTwo.offset=1;
          colorTwo.color=item;
          itemObj.colorStops.push(colorTwo);
          colorList1.push(itemObj);
      });
      var option;
      option = {
          tooltip: {
              trigger: 'item'
          },
          legend: {
            show: true,
            type: "plain",
            icon: "rect",
            itemWidth:12,
            itemHeight:2,
            itemGap:20,
            right:10,
            textStyle:{
              color:'#c2c2c2',
              fontStyle:'normal',
              fontSize:'12'
            },
            data:$this.focusPro.legendData,
          },
          animation: false,
          series: [
              {
                  color:colorList1,
                  type: 'pie',
                  top:30,
                  radius: ['40%', '70%'],
                  avoidLabelOverlap: false,
                  itemStyle: {
                      normal: {
                          borderColor:'rgba(0,0,0,0)',
                          borderWidth:1,
                      }
                  },
                  labelLine: {
                      normal: {
                          length: 20,
                          length2: 30,
                          lineStyle: {
                              width: 1
                          }
                      }
                  },
                  label: {
                      show: true,
                      position: 'outside',
                      formatter: '{a|{b}：{d}%}',
                      color:'#90a6e8',
                      rich: {
                          a: {
                              padding: [-30, 15, -20, 15]
                          }
                      }
                  },
                  data:$this.focusPro.focusProPie
              }
          ]
      };
      var option;
      option && pieChart.setOption(option);
      $this.pieChart = pieChart;
    },
    // 面积趋势图例
    drawAreaChart(){
        var $this = this;
        var chartDom = document.getElementById('trend'+$this.focusPro.id);
        var myChart = echarts.init(chartDom);
        var xAxisData=[];
        $this.focusPro.xAxisData.forEach(function(item,index){
            var itemArr=item.split('-')[1]+'-'+item.split('-')[2];
            xAxisData.push(itemArr);
        });
        var series=[];
        $this.focusPro.focusProTrend.forEach(function(item,index){
          var itemObj={};
          itemObj.name=$this.focusPro.legendData[index];
          itemObj.type='line';
          itemObj.data=item;
          itemObj.showSymbol=false;
          itemObj.lineStyle={
            normal: {
                width: 1,
                color:$this.focusPro.ChartColor[index], // 线条颜色
            },
          };
          itemObj.itemStyle={
            normal: {
                color: '#fff',
                borderColor:$this.focusPro.ChartColor[index], // 折点颜色
                borderWidth:1
            },
          };
          itemObj.emphasis={
            lineStyle: {
              width: 2,	// hover时的折线宽度
            },
            itemStyle:{
              borderWidth: 2
            }
          };
          itemObj.symbolSize=5;
          itemObj.symbol='circle',
          itemObj.animationDuration=2800;
          itemObj.animationEasing='quadraticOut';
          series.push(itemObj);
        });
        var option;
        option = {
          tooltip: {
              backgroundColor:'rgba(255,255,255,0.95)',
              trigger: "axis",
              textStyle:{
                fontSize:'12',
                color: '#666'
              },
              formatter(params){
                let returnData = `<div class="toolDiv">
                    <div class="tooltitle">${params[0].name}</div>`;
                for (let i = 0; i < params.length; i++) {
                    returnData += `<div class="bar clearfix"><span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${params[i].borderColor};"></span>
                      <span>${params[i].seriesName}：</span>
                      <span>${params[i].value}</span></div>`;
                }
                returnData +=`</div>`;
                return returnData;
              }
          },
          legend: {
            show: true,
            type: "plain",
            icon: "rect",
            itemWidth:12,
            itemHeight:2,
            itemGap:20,
            right:10,
            textStyle:{
              color:'#c2c2c2',
              fontStyle:'normal',
              fontSize:'12'
            },
            data:$this.focusPro.legendData,
          },
          grid: {
            top:50,
            right:20,
            bottom:10,
            left:0,
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data:xAxisData,
            axisTick: {
                show: false,
            },
            axisLine:{
                show: true,
                lineStyle:{
                    type: [4, 0],
                    dashOffset: 3,
                    color: '#fff',
                    opacity:0.2,
                    shadowColor: null,
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                }
            },
            axisLabel: {
                color: "#e5e5e5",
                fontSize: "12",
                lineHeight: 18,
            },
          },
          yAxis: {
            type: 'value',
            splitNumber:3,
            position: 'left',
            axisTick: {
                show: true
            },
            axisLabel: {
                color: "#e5e5e5",
                fontSize: "12",
            },
            axisLine:{
                show: true,
                lineStyle:{
                    type: [4, 0],
                    dashOffset: 3,
                    color: '#fff',
                    opacity: 0.2,
                    shadowColor: null,
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                }
            },
            splitLine:{
                show: true,
                lineStyle:{
                    type: [4, 0],
                    dashOffset: 3,
                    color: '#fff',
                    opacity: 0.05,
                    shadowColor: null,
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                }
            },
            axisTick:{
              lineStyle:{
                color:'#f00'
              }
            },
            nameTextStyle:{
                lineHeight:18,
            }
          },
          animation: false,
          series:series,
        };
        option && myChart.setOption(option);
        $this.myChart = myChart;
    },
    echartsSize(){
        if(this.myChart){
            this.myChart.resize();
        }
        if(this.pieChart){
            this.pieChart.resize();
        }
    }
  }
}
</script>



