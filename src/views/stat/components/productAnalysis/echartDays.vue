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
    isInterval:{
      type: Number,
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
        var legend=false;
        if($this.contrastTag=='overview'){
          legend=false;
        }else{
          legend={
            type:'plain',
            show:true,
            bottom:0,
            orient:'horizontal',
            data:$this.enquirieChart.chartName,
            padding:0,
            textStyle: {
                color: "#555",
                fontSize: "12",
                lineHeight: 18,
            },
          }
        }
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
                    width: 1,
                    color:$this.enquirieChart.ChartColor[index], // 线条颜色
                },
              };
              itemObj.itemStyle={
                normal: {
                    color: '#fff',
                    borderColor:$this.enquirieChart.ChartColor[index], // 折点颜色
                    borderWidth: 1
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
              itemObj.showSymbol=false;
              itemObj.emphasis={
                lineStyle:{
                  width: 2
                },
                itemStyle:{
                  borderWidth: 2
                }
              };
              itemObj.symbolSize=5;
              itemObj.symbol='circle',
              itemObj.data=item;
              itemObj.animationDuration=2800;
              itemObj.animationEasing='quadraticOut';
              if($this.contrastTag=='overview'){
                  itemObj.markLine={
            　　　　　　data:[
            　　　　　　　　{type :'average', name: '平均值'}
            　　　　　　],
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
              }
              series.push(itemObj);
          });
        }
        var option;
        option = {
            tooltip: {
                backgroundColor:'rgba(255,255,255,0.95)',
                trigger: "axis",
                formatter(params){
                  let returnData = `<div class="toolDiv">
                    <div class="tooltitle">${params[0].name}</div>`;
                  for (let i = 0; i < params.length; i++) {
                    returnData += `<div class="bar clearfix"><span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${params[i].borderColor};"></span>
                      <span class="tooltit">${params[i].seriesName}</span>
                      <span class="toolval">${params[i].value}</span></div>`;
                  }
                  returnData +=`</div>`;
                  return returnData;
                }
            },
            grid: {
                left: 10,
                right:$this.contrastTag=='overview'?'40':'20',
                bottom:$this.contrastTag=='overview'?'10':'40',
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
                    interval:$this.isInterval,
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
            legend:legend,
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