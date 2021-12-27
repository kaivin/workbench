<template>
  <div class="enquirieTrend areaBox">
      <p class="enquirieTrendTit">
          {{enquirieChart.TagName}}
          <span v-if="contrastTag=='overview'">统计时间：近30天</span>
      </p>
      <div class="enquirieTrendBox">
          <div :id="'cluesChart'+enquirieChart.randomStr" style="height:250px" class="chart-canvas"></div>
          <div class="trendlegend" v-if="contrastTag=='overview'">
              <span class="legendItem1" v-for="item in enquirieChart.chartName" :key='item'>{{item}}</span>
              <span class="legendItem2">平均值</span>
          </div>
      </div>          
  </div>
</template>

<script>
import { Area } from "@antv/g2plot";
export default {
  name: "demo",
  data() {
    return {};
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
    }
  },
  mounted(){
      this.drawAreaTrendChart();
  },
  methods: {
    // 近30天询盘统计趋势图
    drawAreaTrendChart() {
      var $this = this;
      if(!$this.areaTrendPlot){
        var legend=false;
        var annotations=false;
        if($this.contrastTag=='overview'){
          legend=false;
          //总览平均数
          var newEnquirieArr = $this.enquirieChart.enquirieArr;
          if(newEnquirieArr&&newEnquirieArr.length>0){
              var tolNum=0;
              newEnquirieArr.forEach(function(item,index){
                  tolNum=tolNum+item.number;
              });
              var avg=(tolNum/newEnquirieArr.length).toFixed(2)*1;              
          }      
          var annotations=[
              {
                  type: "line",
                  start: ["min",avg],
                  end: ["max",avg],
                  top: true,
                  offsetY: 0,
                  offsetX: 0,
                  style: {
                      stroke: "#5fce45",
                      lineDash: [8, 4],
                      lineWidth:1,
                  },
              },
              // 平均值
              {
                  type: "html",
                  position: ["max", avg],
                  top: true,
                  html:"<span class='chart-font target'><span class='txt-font'>" + avg + "</span><i></i></span>",
                  alignX: "left",
                  alignY: "bottom",
              },
          ];
        }else{
          legend={
            marker:{
              symbol:"hyphen",
            },
            itemSpacing:15,
            layout:'horizontal',
            position:'bottom',
            flipPage:false,
            offsetX:0,
            offsetY:10,
            itemName: {
              formatter: (val) => `${val}`,
              style: {
                fill: '#555555',
                fontSize:13,
              },
            },
            label:{
                style:{
                    textBaseline:"middle",
                    fill:'#555555',
                }
            },
          }
        }
        const areaTrendPlot = new Area("cluesChart"+$this.enquirieChart.randomStr, {
            data:$this.enquirieChart.enquirieArr,
            xField: "time",
            yField: "number",
            seriesField:'name',
            isStack:false,
            startOnZero:false,
            color:$this.enquirieChart.enquirieArr.length==1?$this.enquirieChart.ChartColor[0]:$this.enquirieChart.ChartColor,
            appendPadding: [15, 0, 0, 0],
            meta: {
                time: {
                   range: [0, 1],
                },
            },
            yAxis:{
                tickCount:3,
                line:{
                    style:{
                        stroke: '#e9e9e9',
                    }
                },
                grid:{
                    line:{
                        style:{
                            stroke: '#f2f2f2',
                            lineWidth: 1,
                            lineDash: [5,1],
                        }
                    }
                },
                label: {
                    style:{
                        lineHeight:18,
                        fill:'#555555',
                    }
                },
            },
            xAxis: {
                tickCount:15,
                line:{
                    style:{
                        stroke: '#e9e9e9',
                    }
                },
                label: {
                    style:{
                        lineHeight:20,
                        fill:'#555',
                    }
                },
            },
            point: {
              size: 3,
              shape: "circle",
              style: (res) => {
                var obj = {
                  opacity: 0.5,
                  stroke: "#6392ec",
                  fill: "#fff",
                };
                return obj;
              },
            },
            tooltip: {
              formatter: (datum) => {
                return { name:datum.name, value: datum.number };
              },
              title: (e) => {
                return e.replace(/\n/g, " ");
              },
            },
            legend:legend,
            annotations:annotations,
            areaStyle: (data) => {
                var itemColor = "";
               $this.enquirieChart.enquirieArr.forEach(function(item){
                    if(item.name){
                        if(item.name == data.name){
                            itemColor = item.color;
                        }
                    }else{
                        itemColor = item.color;
                    }
                });
                return {
                    fill: 'l(270) 0:#ffffff 1:'+itemColor,
                };
            },
        });
        $this.areaTrendPlot = areaTrendPlot;
        areaTrendPlot.render();
      }
    },
  },
};
</script>

<style>
</style>