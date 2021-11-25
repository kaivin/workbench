<template>
  <div class="personYearChart">
      <div class="yearChartTab">
          <div class="yearTabItem yearTabActive">
            <p class="yearTabTitle">年度总询盘个数<span>（单位：个）</span></p>
            <div class="yearNum">23,568</div>
            <div class="numCompare">环比上年同期<span class="numsep">445</span></div>
          </div>
          <div class="yearTabItem">
            <p class="yearTabTitle">年度总成交积分<span>（单位：分）</span></p>
            <div class="yearNum">654</div>
            <div class="numCompare">环比上年同期<span class="numsep">445</span></div>
          </div>
          <div class="yearTabItem">
            <p class="yearTabTitle">年度100万成交个数<span>（单位：个）</span></p>
            <div class="yearNum">16</div>
            <div class="numCompare">环比上年同期<span class="numsep numdec">445</span></div>
          </div>
          <div class="yearTabItem">
            <p class="yearTabTitle">年度总奖金<span>（单位：元）</span></p>
            <div class="yearNum">36,985.6</div>
            <div class="numCompare">环比上年同期<span class="numsep">445</span></div>
          </div>
      </div>
      <div class="chartContainer">
          <div id="inquirybox"></div>
          <div class="showLine">
            <span class="line1">2021年</span>
            <span class="line2">2020年</span>
            <span class="line3">月平均值</span>
          </div>
      </div>
  </div>
</template>

<script>
import { Mix } from '@antv/g2plot';
export default {
  name: "YearChart",
  data() {
    return {
        nowYear:[
            {
                month:'1',
                number: 100
            },
            {
                month:'2',
                number: 130
            },
            {
                month:'3',
                number: 80
            },
            {
                month:'4',
                number: 40
            },
            {
                month:'5',
                number: 160
            },
            {
                month:'6',
                number: 120
            },
            {
                month:'7',
                number: 180
            },
            {
                month:'8',
                number: 220
            },
            {
                month:'9',
                number: 225
            },
            {
                month:'10',
                number: 230
            },
            {
                month:'11',
                number: 240
            },
            {
                month:'12',
                number: 255
            }
        ],
        lastYear:[
            {
                month:'1',
                number: 80
            },
            {
                month:'2',
                number: 100
            },
            {
                month:'3',
                number: 110
            },
            {
                month:'4',
                number: 60
            },
            {
                month:'5',
                number: 150
            },
            {
                month:'6',
                number: 140
            },
            {
                month:'7',
                number: 140
            },
            {
                month:'8',
                number: 180
            },
            {
                month:'9',
                number: 200
            },
            {
                month:'10',
                number: 220
            },
            {
                month:'11',
                number: 220
            },
            {
                month:'12',
                number: 235
            }
        ],
      }
  },
  created(){
      
  },
  mounted(){
      var $this = this;
      $this.getYearInquiryChart();
  },
  props: {
    payMember: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  methods:{
      departChange(){

      },
      personChange(){

      },
      getYearInquiryChart(){
          var $this = this;
          var nowyear = $this.nowYear;
          var lastyear = $this.lastYear;
          //计算y轴显示的最大数值
          var maxnum = 0;
          for(var i=0;i<nowyear.length;i++){
              if(nowyear[i].number > maxnum){
                  maxnum = nowyear[i].number;
              }
          }
          for(var i=0;i<lastyear.length;i++){
              if(lastyear[i].number > maxnum){
                  maxnum = lastyear[i].number;
              }
          }
          
          const plot = new Mix('inquirybox', {
            tooltip: { 
                shared: true
            },
        
            syncViewPadding: true,
            plots: [
                {
                    type: 'column',
                    options: {
                        data: nowyear,
                        xField: 'month',
                        yField: 'number',
                        minColumnWidth: 22,
                        maxColumnWidth: 22,
                        yAxis: {
                            grid: {
                                line: {
                                    style: {
                                        stroke: '#f2f2f2',
                                    },
                                
                                },
                            },
                            tickCount: 5,
                            max:maxnum,
                            label:{
                                style:{
                                    fontSize: 12,
                                    fill: "#b3b3b3"
                                }
                            }
                        },
                        xAxis: {
                            label:{
                                style:{
                                    fontSize: 12,
                                    fill: "#b3b3b3"
                                }
                            }
                        },
                        meta: {
                            month: {
                                formatter:(item)=>{
                                    return item+"月"
                                }
                            },
                            number: {
                                alias: '今年询盘',
                            },
                        },
                        label: {
                            position: 'top',
                        },
                        annotations: [
                            {
                                type: 'line',
                                start: ['min', 'median'],
                                end: ['max', 'median'],
                                style: {
                                    stroke: '#5fce45',
                                    lineWidth: 2,
                                    lineDash: [8, 4]
                                },
                            },
                        ],
                        columnStyle: {
                            fill: 'l(270) 0:#b9cff4 0.5:#a0bff4 1:#82adf2'
                        },
                    },
                },
                {
                    type: 'area', 
                    options: {
                        data: lastyear,
                        xField: 'month',
                        yField: 'number',
                        areaStyle: () => {
                            return {
                                fill: 'l(270) 0:#ffffff 0.5:#efd587 1:#f1cb56',
                            };
                        },
                        color: "#f3be1c",
                        line:{
                            color: "#f3be1c",
                            size:2
                        },
                        point:{
                            size: 4,
                            shape: "circle",
                            style: {
                                fill: '#fff',
                                stroke: '#f3be1c',
                                lineWidth:  1,
                            },
                        },
                        meta: {
                            month: {
                                formatter:(item)=>{
                                    return item+"月"
                                }
                            },
                            number: {
                                alias: '去年询盘',
                            },
                        },
                        yAxis: {
                            grid: {
                                line: {
                                    style: {
                                        stroke: '#f2f2f2',
                                    },
                                
                                },
                            },
                            tickCount: 5,
                            max: maxnum,
                            label:{
                                style:{
                                    fontSize: 12,
                                    fill: "#b3b3b3",
                                    fillOpacity: 1
                                }
                            }
                        },
                        xAxis: {
                            label:{
                                style:{
                                    fontSize: 12,
                                    fill: "#b3b3b3"
                                }
                            }
                        }
                   }
                }
            ],
            });

            plot.render();
      }
  }
}
</script>

<style>

</style>