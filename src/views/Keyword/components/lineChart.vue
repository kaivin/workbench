<template>
  <div :id="'lineChart'+id" class="chart-canvas"></div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  require('echarts/theme/macarons') // echarts theme
  export default {
    name: "lineChart",
    data() {
      return {
          myChart:null,
      };
    },
    props: {
      chartData:{
        type: Array,
        default: function () {
          return [];
        },
      },
      id: {
        type: String, 
        default: ''
      }
    },
    destroyed(){
      window.removeEventListener('resize',this.echartsSize);
      if(this.myChart){
          this.myChart.dispose();
      }
    },
    watch:{
      chartData:{
          handler(val,oldval){
              this.drawAreaTrendChart();
          },
          deep:true
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
          if($this.chartData&&$this.chartData.length>0){
              var chartName=[];
              var series=[];
              var itemObj={};
              itemObj.name='搜索词指数';
              itemObj.type='line';
              itemObj.smooth=false;
              itemObj.type='line';
              itemObj.lineStyle={
              normal: {
                  width: 1,
                  color:'#0970ff', // 线条颜色
              },
              };
              itemObj.itemStyle={
                  normal: {
                      color: '#fff',
                      borderColor:'#0970ff', // 折点颜色
                      borderWidth: 1
                  },
              };
              itemObj.areaStyle={
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                      offset: 0,
                      color:'#0970ff',
                      opacity:1
                      },
                      {
                      offset: 1,
                      color: "rgba(255, 255, 255, 0)",
                      }
                  ]),
                  opacity:0.3
              };
              itemObj.label={
                  show: true,
                  position: 'top',
                  distance: '5'
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
              itemObj.symbol='circle';
              itemObj.animationDuration=2800;
              itemObj.animationEasing='quadraticOut';
              itemObj.data=[];
              $this.chartData.forEach(function(item,index){
                  chartName.push(item.name);
                  itemObj.data.push(item.value);
              });
              series.push(itemObj);
              var chartDom = document.getElementById('lineChart'+$this.id);
              var myChart = echarts.init(chartDom, 'macarons');
              var option;
              option = {
                  tooltip: {
                      backgroundColor:'rgba(255,255,255,0.95)',
                      trigger: "axis",
                      textStyle:{
                          fontSize:12,
                          color: '#666'
                      },
                      formatter(params){
                          return `<div class="toolDiv">
                                  <div class="tooltitle">${params[0].name}</div>
                                  <div class="bar clearfix">
                                  <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#0970ff;"></span>
                                  <span>${params[0].seriesName}：</span>
                                  <span>${params[0].data}</span>
                                  </div>
                              </div>`;
                          }
                  },
                  grid: {
                      left: 0,
                      right:30,
                      bottom:10,
                      top:20,
                      containLabel: true
                  },
                  xAxis: {
                      type: 'category',
                      boundaryGap: false,
                      data:chartName,
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
                          interval:1,
                          color: "#555",
                          fontSize: "12",
                          lineHeight: 18,
                      },
                  },
                  yAxis:[{
                      type: 'value',
                      position: 'left',
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
                  },{
                      type: 'value',
                      position: 'right',
                      axisTick: {
                          show: false
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
                  }],
                  animation: false,
                  legend:false,
                  series:series,
              };
              option && myChart.setOption(option);
              $this.myChart = myChart;
          }
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
  .chart-canvas{
    display: block;
    width: 100%;
    height: 100%;
  }
  </style>