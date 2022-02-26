<template>  
    <div class="ComparePerson">
        <div class="compareTitle">
            <h3>{{currentData.Mobtitle}}</h3>
            <span>{{currentData.unit}}</span>
        </div>
        <div class="compareMain">
            <div class="leftTable">            
                <el-table
                    :data="currentData.leftChartData"
                    border
                    style="width: 100%">
                    <el-table-column
                        prop="name"
                        label="姓名">
                        <template slot-scope="scope">
                            <span :class="'name'+(scope.$index+1)">{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="totalnum"
                        v-if="currentData.chartClass=='enquirie'"
                        label="年度总询盘">
                    </el-table-column>
                    <el-table-column
                        prop="totalnum"
                        v-if="currentData.chartClass=='score'"
                        label="年度总成交">
                    </el-table-column>
                    <el-table-column
                        prop="totalnum"
                        v-if="currentData.chartClass=='clinch'"
                        label="年度100万个数">
                          <template slot-scope="scope">
                              <p class="totalnum">
                                  <i class="awardicon"></i>
                                  <span>x{{scope.row.totalnum}}</span>
                              </p>
                          </template>
                    </el-table-column>
                    <el-table-column
                        prop="totalnum"
                        v-if="currentData.chartClass=='money'"
                        label="年度总奖金">
                    </el-table-column>
                    <el-table-column
                        prop="avgnum"
                        label="月平均值">
                    </el-table-column>
                    <el-table-column
                        prop="historynum"
                        label="历史峰值">
                    </el-table-column>
                </el-table>
            </div>
            <div class="rightLines">
                <div class="inquiryLine" :id="'Chart'+currentData.chartClass" style="height:310px"></div>
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
      myChart:null,
      currentData:this.itemData
    };
  },
  props: {
    itemData: {
      type: Object,
      default:{},
    },
  },
  computed:{
    chartName(){
      var chartName=[];
      this.itemData.ChartData.forEach(function(item,index){
        chartName.push(item[0].name);
      });
      return chartName;
    },
    ChartColor(){
      var ChartColor=[];
      this.itemData.ChartData.forEach(function(item,index){
        ChartColor.push(item[0].color);
      });
      return ChartColor;
    },
    chartAxis(){
      var chartAxis=[];
      this.itemData.ChartData.forEach(function(item,index){
        if(index==0){
          item.forEach(function(items,indexs){
            chartAxis.push(items.date.split("-")[1]+"月");           
          });
        }
      });
      return chartAxis;
    },
  },
  watch: {
    itemData:{
      handler(newValue, oldValue) {
        this.currentData = newValue;
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
  },
  mounted(){
    window.addEventListener('resize',this.echartsSize);
    if(this.currentData.chartType=='area'){
      this.drawAreaChart();
    }
    if(this.currentData.chartType=='line'){
      this.drawLineChart();
    }
    if(this.currentData.chartType=='column'){
      this.drawColumnChart();
    }
  },
  methods:{
    // 面积趋势图例
    drawAreaChart(){
      var $this = this;
      var chartDom = document.getElementById('Chart'+$this.currentData.chartClass);
      var myChart = echarts.init(chartDom, 'macarons');
      var series=[];
      if($this.currentData.ChartData&&$this.currentData.ChartData.length>0){
        $this.currentData.ChartData.forEach(function(item,index){
            var itemObj={};
            itemObj.name=$this.chartName[index];
            itemObj.smooth=false;
            itemObj.type='line';
            itemObj.showSymbol=false;
            itemObj.lineStyle={
              normal: {
                  width: 2,
                  color:$this.ChartColor[index], // 线条颜色
              },
            };
            itemObj.itemStyle={
              normal: {
                  color:$this.ChartColor[index], // 折点颜色
              },
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
              }
            };
            itemObj.symbolSize=7;
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
              }
          },
          grid: {
              top:45,
              right:1,
              bottom:25,
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
            data:$this.chartName
          },
          animation: false,
          series:series,
      };
      option && myChart.setOption(option);
      $this.myChart = myChart;
    },
    // 多折线趋势图例
    drawLineChart(){
      var $this = this;
      var chartDom = document.getElementById('Chart'+$this.currentData.chartClass);
      var lineChart = echarts.init(chartDom, 'macarons');
      var series=[];
      if($this.currentData.ChartData&&$this.currentData.ChartData.length>0){
        $this.currentData.ChartData.forEach(function(item,index){
            var itemObj={};
            itemObj.name=$this.chartName[index];
            itemObj.smooth=false;
            itemObj.type='line';
            itemObj.showSymbol=false;
            itemObj.lineStyle={
              normal: {
                  width: 2,
                  color:$this.ChartColor[index], // 线条颜色
              },
            };
            itemObj.itemStyle={
              normal: {
                  color:$this.ChartColor[index], // 折点颜色
              },
            };
            itemObj.emphasis={
              lineStyle: {
                width: 2,	// hover时的折线宽度
              }
            };
            itemObj.symbolSize=7;
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
              }
          },
          grid: {
              top:45,
              right:1,
              bottom:25,
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
    // 分组柱状图
    drawColumnChart(){
      var $this = this;
      var chartDom = document.getElementById('Chart'+$this.currentData.chartClass);
      var myChart = echarts.init(chartDom, 'macarons');
      var series=[];      
      $this.chartName.forEach(function(item,index){
          var itemObj={};
          itemObj.name=item;
          itemObj.type='bar';
          itemObj.barGap=0;
          itemObj.barWidth=18;
          itemObj.emphasis={
            focus: 'series'
          };
          itemObj.data=[];
          $this.chartAxis.forEach(function(items,indexs){
            $this.currentData.ChartData.forEach(function(itemk,indexk){
              itemk.forEach(function(itemH,indexH){
                var itemStr=itemH.date.split("-")[1]+"月";  
                if(item==itemH.name&&items==itemStr){
                  itemObj.data.push(itemH.value);
                }
              });
            });
          });
          series.push(itemObj);
      });
      var option;
      option = {
        tooltip: {
            trigger: 'axis',
            backgroundColor:'rgba(255,255,255,0.95)',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params, ticket, callback) {
                var showHtm="";
                var showHtmDt=''; 
                var showHtmDd='';
                var name = '';
                for(var i=0;i<params.length;i++){
                    if(params[i]&&params[i]!=undefined){
                        name = params[i].axisValue;
                        var text = params[i].seriesName;
                        var value = params[i].value;
                        showHtmDd+='<dd><i style="background:'+params[i].color+'"></i>'+text+'年：<strong>' + value+'</strong></dd>'
                    }
                }
                showHtmDt+='<dl class="flex-content"><dt>'+name+'成交100万个数</dt>'+showHtmDd+'</dl>';
                showHtm=showHtmDt;
                return '<div class="mainTool flex-box">'+showHtm+'</div>';
            }
        },
        grid: {
          top:45,
          right:1,
          bottom:0,
          left:30,
          containLabel: true
        },
        xAxis:{
            type: 'category',
            data: $this.chartAxis,
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
        yAxis: [
          {
            type: 'value',
            splitNumber:3,
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
          }
        ],
        legend:{
          type:'plain',
          data:$this.chartName,
          right: 10,
          top:0,
          align:'left',
        },
        animation: false,
        series:series
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

<style></style>