<template>
  <div class="enquirieTrend areaBox">
      <p class="enquirieTrendTit">
          {{enquirieChart.TagName}}
          <span v-if="contrastTag=='overview'">统计时间：近30天</span>
      </p>
      <div class="enquirieTrendBox">
          <div :id="'cluesChart'+enquirieChart.randomStr" :style="'height:'+scoreHeight+'px'" class="chart-canvas"></div>
          <div class="trendlegend" v-if="contrastTag=='overview'">
              <span class="legendItem1" v-for="item in enquirieChart.chartName" :key='item'>{{item}}</span>
              <span class="legendItem2">平均值</span>
          </div>
      </div>          
  </div>
</template>

<script>
import * as echarts from 'echarts';
require('echarts/theme/macarons') // echarts theme
export default {
  name: "demo",
  data() {
    return {
        myChart:null,
    };
  },
  props: {
    enquirieChart:{
      type: Object,
      default: function () {
        return {};
      },
    },
    contrastTag:{
      type: String,
      default: "",
    },
    scoreHeight:{
      type: Number,
      default: "",
    }
  },
  destroyed(){
    window.removeEventListener('resize',this.echartsSize);
    if(this.myChart){
        this.myChart.dispose();
    }
  },
  mounted(){
      var $this = this;
      window.addEventListener('resize',$this.echartsSize);
      this.drawAreaTrendChart();
  },
  methods: {
    // 近30天询盘统计趋势图
    drawAreaTrendChart() {
      var $this = this;
        var chartDom = document.getElementById('cluesChart'+$this.enquirieChart.randomStr);
        var myChart = echarts.init(chartDom, 'macarons');
        var series=[];
        if($this.enquirieChart.enquirieArr&&$this.enquirieChart.enquirieArr.length>0){
          $this.enquirieChart.enquirieArr.forEach(function(item,index){
              var itemObj={};
              itemObj.name=$this.enquirieChart.chartName[index];
              itemObj.smooth=false;
              itemObj.showSymbol=false;
              itemObj.type='line';
              itemObj.lineStyle={
                normal: {
                    width: 2,
                    color:$this.enquirieChart.ChartColor[index], // 线条颜色
                },
              };
              itemObj.itemStyle={
                normal: {
                    color:$this.enquirieChart.ChartColor[index], // 折点颜色
                },
              };
              itemObj.areaStyle={
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color:$this.enquirieChart.ChartColor[index],
                        opacity:1
                      },
                      {
                        offset: 1,
                        color: "rgba(255, 255, 255, 0)",
                      }
                    ]),
                    opacity:0.3
              };
              itemObj.symbolSize=7;
              itemObj.data=item;
              itemObj.animationDuration=2800;
              itemObj.animationEasing='quadraticOut';
              if($this.contrastTag=='overview'){
                  itemObj.markLine={
            　　　　　　data : [
            　　　　　　　　{type :'average', name: '平均值'}
            　　　　　　],
                       lineStyle:{
                          normal: {
                              width:1,
                              color:'#01b01d', // 线条颜色
                          },
                       }
            　　　}
              }
              series.push(itemObj);
          });
        }
        var option;
        option = {
            tooltip: {
                backgroundColor:'rgba(255,255,255,0.7)',
                trigger: "axis",
            },
            grid: {
                left: 10,
                right: 40,
                bottom: 20,
                top: 30,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: $this.enquirieChart.TagTime,
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLine:{
                    show: true,
                    lineStyle:{
                        type: [4, 0],
                        dashOffset: 3,
                        color: '#e5e5e5',
                        opacity: 1,
                        shadowColor: null,
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                    }
                },
                axisLabel: {
                    color: "#555",
                    fontSize: "12",
                    lineHeight: 18,
                },
            },
            yAxis: {
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: "#555",
                    fontSize: "12",
                },
                axisLine:{
                    show: true,
                    lineStyle:{
                        type: [4, 0],
                        dashOffset: 3,
                        color: '#e5e5e5',
                        opacity: 1,
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
                        color: '#eee',
                        opacity: 1,
                        shadowColor: null,
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                    }
                },
                splitNumber:3,
                nameTextStyle:{
                    lineHeight:20,
                }
            },
            series:series,
        };
        option && myChart.setOption(option);
        $this.myChart = myChart;
    },
    echartsSize(){
        if(this.myChart){
            this.myChart.resize();
        }
    }
  },
};
</script>

<style>
</style>