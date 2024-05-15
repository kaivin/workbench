<template>
    <div class="rowDayCount">
      <div class="rowTitle">
        <div class="title-left">
          <h3 class="tit-h3">询盘趋势</h3>
          <span class="tit-span">（单位：元）</span>
        </div>
      </div>
      <div class="rowMain">
          <div :id="'dayTarget'+title"></div>
      </div>
    </div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  import { mapGetters } from 'vuex'
  export default {
      name: "DayTarget",
      data() {
          return {
            myChart: "",
          }
      },
      props:{
          InquiryData:{
            type: Object,
            default: function () {
              return {};
            },
          },
          title:{
            type: String,
            default: ""
          },
      },
      created(){
      },
      computed:{
        ...mapGetters([
          'sidebar',
        ]),
        isCollapse() {
          return this.sidebar.opened
        }
      },
      watch:{
          DayData:{
              handler(val, oldVal){
                  this.drawLine(val)
              },
              deep: true
          },
          isCollapse(){
            setTimeout(() => {
              this.echartsSize();
            }, 200)
          }
      },
      mounted(){
        window.addEventListener('resize',this.echartsSize)
      },
      methods:{
        drawLine(){
            var $this = this;
            var chartDom = document.getElementById('dayTarget'+$this.props.title);
            var myChart = echarts.init(chartDom);
            var option;
            option = {
                grid:{
                    left: '50',
                    top:'35',
                    right:'18',
                    bottom: '30'
                },
                tooltip:{
                    show: true,
                    trigger: "axis",
                    axisPointer: {
                    type: "line", 
                    lineStyle:{
                        color: "#5b8ff9"
                    }
                    },
                    textStyle:{
                        fontSize:12,
                        color: '#666'
                    },
                    formatter(params){
                    var res = `<div class="toolDiv">
                            <div class="tooltitle">${params[0].name}</div>
                            <div class="bar clearfix">
                            <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#0970ff;"></span>
                            <span>${params[0].seriesName}：</span>
                            <span>${params[0].data.score}</span>
                            </div>
                            <div class="bar clearfix">
                            <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;"></span>
                            <span>数量：</span>
                            <span>${params[0].data.number_one}<span style="color: #999"> (1-5名)</span></span>
                            <span style="margin-left: 10px;">${params[0].data.number_two}<span style="color: #999"> (6-10名)</span></span>
                            <span style="margin-left: 10px;">${params[0].data.number_three}<span style="color: #999"> (11-15名)</span></span>
                            <span style="margin-left: 10px;">${params[0].data.number_four}<span style="color: #999"> (16-20名)</span></span>
                            </div>
                        </div>`;
                        return res;
                    }
                },
                xAxis: {
                    type: 'category',
                    name: "日期",
                    axisLine:{
                      lineStyle:{
                          color: "#dedede"
                      }
                    },
                    axisLabel:{
                      color: "#888"
                    },
                    data: $this.props.InquiryData.category
                },
                yAxis: {
                    type: 'value',
                    name: "单位（分）",
                    nameTextStyle: {
                    color: "#b4b4b4",
                    nameLocation: "start",
                    },
                    axisLabel:{
                    color: "#888"
                    }
                },
                animation: false,
                series: [
                    {
                        name: "积分",
                        type: 'line',
                        symbol: 'circle',
                        symbolSize: '5',
                        label:{
                            show: true,
                            position: 'top',
                            distance: '5'
                        },
                        itemStyle:{
                            color: '#fff',
                            borderColor: "#0970ff",
                            borderWidth: 1
                        },
                        lineStyle:{
                            color: "#0970ff",
                            width: 1
                        },
                        emphasis:{
                            lineStyle: {
                                width: 2,
                            },
                            itemStyle:{
                                borderWidth: 2
                            }
                        },
                        data: $this.props.InquiryData.data
                    }
                ]
            };
            option && myChart.setOption(option);
            $this.myChart = myChart;
        },
        echartsSize(){
          if(this.myChart){
            this.myChart.resize();
          }
        },
      },
      destroyed(){
        window.removeEventListener('resize',this.echartsSize);
        if(this.myChart){
          this.myChart.dispose();
        }
      }
  }
  </script>
  
  <style>
  
  </style>