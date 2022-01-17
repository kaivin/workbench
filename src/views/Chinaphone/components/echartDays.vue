<template>
<div id="cluesChart" class="chart-canvas"></div>
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
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  destroyed(){
    window.removeEventListener('resize',this.echartsSize);
    if(this.myChart){
        this.myChart.dispose();
    }
  },
  watch:{
    enquirieChart:{
        handler(val,oldval){
            this.drawAreaTrendChart();
        },
        deep:true
    }
  },
  mounted(){
      var $this = this;
      window.addEventListener('resize',$this.echartsSize);
      console.log($this.enquirieChart,'enquirieChart');
      this.drawAreaTrendChart();
  },
  methods: {
    // 近30天询盘统计趋势图
    drawAreaTrendChart() {
        var $this = this;
        if($this.enquirieChart&&$this.enquirieChart.length>0){
            var chartName=[];
            var series=[];
            var itemObj={};
            itemObj.name='询盘个数';
            itemObj.type='line';
            itemObj.smooth=false;
            itemObj.showSymbol=false;
            itemObj.type='line';
            itemObj.lineStyle={
            normal: {
                width: 2,
                color:'#0970ff', // 线条颜色
            },
            };
            itemObj.itemStyle={
            normal: {
                color:'#0970ff', // 折点颜色
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
            itemObj.showSymbol=false;
            itemObj.emphasis={
            lineStyle: {
                width: 2,	// hover时的折线宽度
            }
            };
            itemObj.symbolSize=7;
            itemObj.animationDuration=2800;
            itemObj.animationEasing='quadraticOut';
            itemObj.markLine={
    　　　　　　 data:[
    　　　　　　　　{type :'average', name: '平均值'}
    　　　　　　 ],
                label: {
                    show: true,
                    position: 'insideEndTop',
                },
                lineStyle:{
                    normal: {
                        width:1,
                        color:'#01b01d', // 线条颜色
                    },
                },
                emphasis:{
                    lineStyle: {
                      width:1,	// hover时的折线宽度
                    }
                }
    　　　  }
            itemObj.data=[];
            $this.enquirieChart.forEach(function(item,index){
                chartName.push(item.name);
                itemObj.data.push(item.value);
            });
            series.push(itemObj);
            var chartDom = document.getElementById('cluesChart');
            var myChart = echarts.init(chartDom, 'macarons');
            var option;
            option = {
                tooltip: {
                    backgroundColor:'rgba(255,255,255,0.95)',
                    trigger: "axis",
                    textStyle:{
                        fontSize:12,
                    },
                },
                grid: {
                    left: 0,
                    right:30,
                    bottom:10,
                    top:10,
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data:chartName,
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
</style>