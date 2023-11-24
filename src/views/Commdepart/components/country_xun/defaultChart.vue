<template>
  <div class="item-row depcom default-chart flex-box">
    <div class="flex-content flex-box flex-column">
      <div class="chart-header flex-box">
        <div class="title-panel"><strong>{{currentData.chartTitle}}</strong><span>{{currentData.unit}}</span></div>
        <div class="legend-list flex-content">
          <div class="item-legend"></div>
        </div>
      </div>
      <div class="flex-content chart-content">
        <template v-if="currentData.totalChart && currentData.totalChart.length > 0">
          <div v-if="currentData.chartType=='area'" style="height:650px;" class="chart-panel" :id="'area-'+currentData.randomStr"></div>
          <div v-else-if="currentData.chartType=='line'" style="height:650px;" class="chart-panel" :id="'line-'+currentData.randomStr"></div>
          <div v-else-if="currentData.chartType=='column'" style="height:650px;" class="chart-panel" :id="'column-'+currentData.randomStr"></div>
          <div v-else style="height:650px;" class="chart-panel" :id="'mulitColumn-'+currentData.randomStr"></div>
        </template>
        <template v-else>
          <div class="nodata">暂无数据</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
require('echarts/theme/macarons') // echarts theme
export default {
  name: "defaultChart",
  data:function() {
    return {
      areaChart:null,
      columnChart:null,
      lineChart:null,
      mulitColumnPlot: null,
    };
  },
  props: {
    itemData: {
      type: Object,
      default:{},
    },
  },
  computed:{
    currentData(){
      return this.itemData;
    },
    chartName(){
      var chartName=[];
      this.itemData.mainData.forEach(function(item,index){
        chartName.push(item[0].name);
      });
      return chartName;
    },
    ChartColor(){
      var ChartColor=[];
      this.itemData.mainData.forEach(function(item,index){
        ChartColor.push(item[0].color);
      });
      return ChartColor;
    },
    chartAxis(){
      var chartAxis=[];
      this.itemData.mainData.forEach(function(item,index){
        if(index==0){
          item.forEach(function(items,indexs){
            if(items.key.indexOf("&")!=-1){
              chartAxis.push(items.key.split("&")[0]+'\n'+items.key.split("&")[1]);
            }else{
              if(items.key.indexOf(" ")!=-1){
                var week = "周"+items.key.split(" ")[1].substr(2);
                var date = items.key.split(" ")[0];
                chartAxis.push(date.split("-")[1]+"-"+date.split("-")[2]+'\n'+week);
              }else{
                chartAxis.push(items.key.split("-")[1]+"月");
              }
            }            
          });
        }
      });
      return chartAxis;
    },
  },
  watch: {
      itemData:{
        handler(newValue, oldValue) {
          if(this.areaChart){
            this.areaChart.dispose()
          }
          if(this.lineChart){
            this.lineChart.dispose()
          }
          if(this.columnChart){
            this.columnChart.dispose()
          }
          if(this.mulitColumnPlot){
            this.mulitColumnPlot.dispose()
          }
          if(this.currentData.totalChart && this.currentData.totalChart.length > 0){
            this.$nextTick(() => {
              if(this.currentData.chartType=='area'){
                this.drawAreaChart();
              }else if(this.currentData.chartType=='line'){
                this.drawLineChart();
              }else if(this.currentData.chartType=='column'){
                this.drawColumnChart();
              }else if(this.currentData.chartType=='multicolumn'){
                this.drawMulitColumnChart();
              }
            })
          }
        },
        deep: true
      },
    },
  destroyed(){
    window.removeEventListener('resize',this.echartsSize);
    if(this.areaChart){
        this.myChart.dispose();
    }
    if(this.pieChart){
        this.pieChart.dispose();
    }
    if(this.columnChart){
        this.columnChart.dispose();
    }
    if(this.lineChart){
        this.lineChart.dispose();
    }
  },
  mounted(){
    window.addEventListener('resize',this.echartsSize);
    if(this.currentData.totalChart && this.currentData.totalChart.length > 0){
      this.$nextTick(() => {
        if(this.currentData.chartType=='area'){
          this.drawAreaChart();
        }else if(this.currentData.chartType=='line'){
          this.drawLineChart();
        }else if(this.currentData.chartType=='column'){
          this.drawColumnChart();
        }else if(this.currentData.chartType=='multicolumn'){
          this.drawMulitColumnChart();
        }
      })
    }
  },
  methods:{
    // 排行图例
    drawColumnChart(){
      var $this = this;
      var chartDom = document.getElementById('column-'+$this.currentData.randomStr);
      var columnChart = echarts.init(chartDom);
      var DataArr=[];
      var chartNameArr=[];
      const maxColor = '#FF4500';
      const minColor = '#1CC25E';
      const defaultColor = '#5B8FF9';   
      $this.currentData.totalChart.forEach(function(item,index){
          chartNameArr.push(item.name);
          DataArr.push(item.value);
      });
      var series=[];
      series=[{
          name: $this.currentData.chartName,
          type: 'bar',
          data:DataArr,
          label: {
              show: false,
          },
          barMaxWidth: 40,
          itemStyle:{
            color:function(params){
              var currentColor = defaultColor;
              if($this.currentData.maxHours && $this.currentData.maxHours.length > 0){
                $this.currentData.maxHours.forEach(function(item,index){
                  if(item == params.name){
                    currentColor = maxColor;
                  }
                });
              }
              if( $this.currentData.minHours &&  $this.currentData.minHours.length > 0){
                $this.currentData.minHours.forEach(function(item,index){
                  if(item == params.name){
                    currentColor = minColor;
                  }
                });
              }
              return currentColor;
            }
          }
      }];
      var option;
      option = {
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                  type: 'shadow'
              },
          },
          grid: {
            top: "80",
            left: '30',
            right: '30',
            bottom: '30',
            containLabel: true
          },
          label:{
            show: true,
            position: 'top',
            color: "#000",
            distance: 8,
          },
          xAxis:{
              type: 'category',
              data:chartNameArr,
              axisTick: {
                  show: false
              },
              axisLine:{
                  show: true,
                  lineStyle:{
                      type: [4, 2],
                      dashOffset: 3,
                      color: '#000',
                      opacity:0.1,
                      shadowColor: null,
                      shadowBlur: 0,
                      shadowOffsetX: 0,
                      shadowOffsetY: 0,
                  }
              },
              axisLabel: {
                  color: "#999",
                  fontSize: "12",
                  lineHeight: 18,
              },
              nameTextStyle:{
                  lineHeight:18,
              }
          },
          yAxis:{
              type: 'value',
              axisTick: {
                  show: false
              },
              axisLabel: {
                  color: "#999",
                  fontSize: "12",
                  lineHeight: 18,
              },
              axisLine:{
                  show: false,
              },
              splitLine:{
                  show: true,
                  lineStyle:{
                      type: [4, 2],
                      dashOffset: 3,
                      color: '#000',
                      opacity:0.1,
                      shadowColor: null,
                      shadowBlur: 0,
                      shadowOffsetX: 0,
                      shadowOffsetY: 0,
                  }
              },
              splitNumber:3,
              nameTextStyle:{
                  lineHeight:18,
              }
          },
          animation: false,
          series:series,
      }
      option && columnChart.setOption(option);
      $this.columnChart = columnChart;
    },
    // 面积趋势图例
    drawAreaChart(){
      var $this = this;
      var chartDom = document.getElementById('area-'+$this.currentData.randomStr);
      var myChart = echarts.init(chartDom, 'macarons');
      var series=[];
      if($this.currentData.mainData&&$this.currentData.mainData.length>0){
        $this.currentData.mainData.forEach(function(item,index){
            var itemObj={};
            itemObj.name=$this.chartName[index];
            itemObj.smooth=false;
            itemObj.type='line';
            // if($this.currentData.mainData.length<=3){
              itemObj.label={
                show: true,
                position: 'top',
                formatter: function(params) {
                    if (params.value > 0) {
                        return params.value;
                    } else {
                        return ' ';
                    }
                }
              }
            // }else{
            //   itemObj.showSymbol=false;
            // }
            itemObj.lineStyle={
                width: 1,
                color:$this.ChartColor[index], // 线条颜色
            };
            itemObj.itemStyle={
                color: '#fff',
                borderColor:$this.ChartColor[index], // 折点颜色
                borderWidth: 1
            };
            itemObj.areaStyle={
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color:$this.ChartColor[index],
                      opacity:1
                    },
                    {
                      offset: 1,
                      color: "rgba(255, 255, 255, 0)",
                    }
                  ]),
                  opacity:0.3
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
            itemObj.data=[];
            item.forEach(function(items,indexs){
              itemObj.data.push(items.value);
            });
            itemObj.animationDuration=2800;
            itemObj.animationEasing='quadraticOut';
            series.push(itemObj);
        });
      }
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
          grid: {
              top:60,
              right:30,
              bottom:40,
              left:52,
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data:$this.chartAxis,
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
                  show: true
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
          legend:{
            right:30,
            data:$this.currentData.chartName
          },
          animation: false,
          series:series,
      };
      option && myChart.setOption(option);
      $this.areaChart = myChart;
    },
    // 多折线趋势图例
    drawLineChart(){
      var $this = this;
      var chartDom = document.getElementById('line-'+$this.currentData.randomStr);
      var lineChart = echarts.init(chartDom, 'macarons');
      var series=[];
      if($this.currentData.mainData&&$this.currentData.mainData.length>0){
        $this.currentData.mainData.forEach(function(item,index){
            var itemObj={};
            itemObj.name=$this.chartName[index];
            itemObj.smooth=false;
            itemObj.type='line';
            itemObj.label={
              show: true,
              position: 'top'
            }
            
            itemObj.lineStyle={
                width: 1,
                color:$this.ChartColor[index], // 线条颜色
            };
            itemObj.itemStyle={
                color: '#fff',
                borderColor:$this.ChartColor[index], // 折点颜色
                borderWidth: 1
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
            itemObj.data=[];
            item.forEach(function(items,indexs){
              itemObj.data.push(items.value);
            });
            itemObj.animationDuration=2800;
            itemObj.animationEasing='quadraticOut';
            series.push(itemObj);
        });
      }
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
          grid: {
              top:60,
              right:30,
              bottom:40,
              left:52,
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data:$this.chartAxis,
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
                  show: true
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
          legend:{
            right:30,
            data:$this.currentData.chartName
          },
          animation: false,
          series:series,
      };
      option && lineChart.setOption(option);
      $this.lineChart = lineChart;
    },
    // 堆叠分组柱状图例
    drawMulitColumnChart(){
      var $this = this;
      var isDate = false;
      if($this.currentData.chartTitle.indexOf('日期')!=-1){
        isDate = true;
      }
      if(!$this.mulitColumnPlot){
        const mulitColumnPlot = new Column('mulitColumn-'+$this.currentData.randomStr, {
          appendPadding:[30,30,20],
          data:$this.currentData.mainData,
          xField: 'key',
          yField: 'value',
          isGroup: true,
          isStack: true,
          seriesField: 'name',
          groupField: 'depart',
          color:$this.currentData.colorArr.length==1?$this.currentData.colorArr[0]:$this.currentData.colorArr,
          label:{
            style: {
              fill: '#ffffff',
              opacity: 1,
              fontSize: 14
            }
          },
          xAxis: {
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
          legend:{
            marker:'line',
            layout:'horizontal',
            position:'top-right',
            flipPage:false,
            offsetX:-30,
            label:{
              style:{
                textBaseline:"middle"
              }
            },
          },
          tooltip: {
            customContent: (title,datum) => {
              var newArr = [];
              var departArr = [];
              datum.forEach(function(item,index){
                newArr.push(item.data);
                if(!departArr.includes(item.data.depart)){
                  departArr.push(item.data.depart)
                }
              });
              var dataArr = [];
              departArr.forEach(function(item){
                var itemData = {};
                itemData.title = item;
                itemData.value = 0;
                itemData.children = [];
                newArr.forEach(function(item1){
                  if(item1.depart == item){
                    itemData.color = item1.departColor;
                    itemData.value += item1.value;
                    var itemChart = {};
                    itemChart.name = item1.name;
                    itemChart.value = item1.value;
                    itemChart.color = item1.memberColor;
                    itemData.children.push(itemChart);
                  };
                });
                dataArr.push(itemData);
              });
              var templateHtml = "";
              if(isDate){
                templateHtml = '<div class="tooltip-panel date"><div class="tooltip-title">'+title+'</div><div class="tooltip-body">';
              }else{
                templateHtml = '<div class="tooltip-panel"><div class="tooltip-title">'+title+'</div><div class="tooltip-body">';
              }
              dataArr.forEach(function(item,index){
                var itemHtml = '<div class="tooltip-dl"><div class="tooltip-dt"><div class="txt-name" style="color:'+item.color+'">'+item.title+'</div><div class="txt-value" style="color:'+item.color+'">'+item.value+'</div></div>';
                item.children.forEach(function(item1){
                  itemHtml += '<div class="tooltip-dd"><div class="txt-name"><i style="background:'+item1.color+'"></i>'+item1.name+'</div><div class="txt-value">'+item1.value+'</div></div>';
                });
                itemHtml+='</div>'
                templateHtml += itemHtml
              });
              templateHtml += '</div></div>'
              return templateHtml;
            },
          },// 自定义状态样式
          state: {
            active: {
              style: {
                lineWidth: 0,
                fillOpacity: 0.65,
              },
            },
          },
        });
        $this.mulitColumnPlot = mulitColumnPlot;
        mulitColumnPlot.render();
      }
    },
    echartsSize(){
        if(this.areaChart){
            this.areaChart.resize();
        }
        if(this.columnChart){
            this.columnChart.resize();
        }
        if(this.lineChart){
            this.lineChart.resize();
        }
        if(this.mulitColumnPlot){
          this.mulitColumnPlot.resize();
        }
    }
  },
};
</script>

<style scoped>
.depcom.item-row.default-chart{
  margin-top: 0;
  height: 700px!important;
}
.depcom .chart-content .nodata{
  height: 700px;
  text-align:center;
  line-height: 600px;
  font-size: 13px;
  color: #888
}
</style>