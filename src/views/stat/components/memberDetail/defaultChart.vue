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
                                  <span>X{{scope.row.totalnum}}</span>
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
import {Column,Area,Line } from '@antv/g2plot';
export default {
  name: "defaultChart",
  props: {
    itemData: {
      type: Object,
      default:{},
    },
  },
  data:function() {
    return {
      Plot:null,
      currentData:this.itemData,
    };
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
  mounted(){
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
        if($this.currentData.ChartData&&$this.currentData.ChartData.length>0){
            const Plot = new Area('Chart'+$this.currentData.chartClass, {
                data:$this.currentData.ChartData,
                xField: 'date',
                yField: 'number',
                seriesField:'name',
                isStack:false,
                color:$this.currentData.ChartData.length==1?$this.currentData.ChartColor[0]:$this.currentData.ChartColor,
                appendPadding:[15,15,15,15],
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
                  marker:{
                    symbol:"hyphen",
                  },
                  layout:'horizontal',
                  position:'top-right',
                  flipPage:false,
                  offsetX:-15,
                  offsetY:0,
                  label:{
                    style:{
                      textBaseline:"middle"
                    }
                  },
                },
                areaStyle: (data) => {
                    var itemColor = "";
                    $this.currentData.ChartData.forEach(function(item){
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
            $this.Plot = Plot;
            Plot.render();
        }
    },
    // 多折线趋势图例
    drawLineChart(){
      var $this = this;
      if($this.currentData.ChartData&&$this.currentData.ChartData.length>0){
        const Plot = new Line('Chart'+$this.currentData.chartClass, {
          appendPadding:[30,30,20],
          data:$this.currentData.ChartData,
          xField: 'date',
          yField: 'number',
          seriesField:'name',
          color:$this.currentData.ChartData.length==1?$this.currentData.ChartColor[0]:$this.currentData.ChartColor,
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
            marker:{
              symbol:"hyphen",
            },
            layout:'horizontal',
            position:'top-right',
            flipPage:false,
            offsetX:-15,
            offsetY:0,
            label:{
              style:{
                textBaseline:"middle"
              }
            },
          },
        });
        $this.Plot = Plot;
        Plot.render();
      }
    },
    // 分组柱状图
    drawColumnChart(){
      var $this = this;
      if($this.currentData.ChartData&&$this.currentData.ChartData.length>0){
        const Plot = new Column('Chart'+$this.currentData.chartClass, {
            data:$this.currentData.ChartData,
            isGroup: true,
            xField: 'date',
            yField: 'number',
            seriesField: 'name',
            appendPadding: [20,30, 10],
            color:$this.currentData.ChartColor,
            dodgePadding: 0,
            maxColumnWidth:25,
            legend:{
              marker:{
                symbol:"hyphen",
              },
              layout:'horizontal',
              position:'top-right',
              flipPage:false,
              offsetX:-15,
              offsetY:0,
              label:{
                style:{
                  textBaseline:"middle"
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
            yAxis: {
                grid: {
                    line: {
                        style: {
                            stroke: '#cccccc',
                            lineWidth: 1,
                            lineDash: [3, 2],
                            strokeOpacity: 0.5,
                            shadowColor: null,
                            shadowBlur: 0,
                            shadowOffsetX:0,
                            shadowOffsetY:0,
                            cursor: 'pointer'
                        }
                    }
                },
            },
        });
        $this.Plot = Plot;
        Plot.render();
      }
    },
  },
};
</script>

<style>
</style>