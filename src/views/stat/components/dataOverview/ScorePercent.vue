<template>
  <div class="hxpage">
      <div class="title-view">
        <div class="title">各部门年度总成交占比{{type == 0?'（积分+占比）':'（个数+占比）'}}</div>
      </div>
      <div class="chart-bottom" id="ScoreYearsChartBot"></div>
  </div>
</template>

<script>
import { Area,Pie} from '@antv/g2plot';
import * as echarts from 'echarts';
import {parseTime} from "@/utils";
export default {
    name:'demo',
    data(){
      return {
        type:0,
        isUp:true,
        isUpNum:0,
        totalXpanYears:0,
      }
    },
    props:{
      language:{
        type:String,
        default:"中文"
      },
      yeardeaprtscore:{
        type:Array,
        default:function(){
          return []
        }
      },
    },
    watch:{
      type:function(newval,oldval){
        this.setChartBottom();
      },
      yeardeaprtscore:{
        handler(newval,oldval){
          this.setChartBottom();
        },
        deep:true
      }
    },
    methods:{
      changeType(val){
        this.type = val;
      },
      setChartBottom(val){
        var $this = this;
        let chartBotData = [];
        if(this.type == 0){
          chartBotData = JSON.parse(JSON.stringify(this.yeardeaprtscore));
        }else{
          chartBotData = JSON.parse(JSON.stringify(this.yearscorenumbercount));
        }
        var chartDom = document.getElementById('ScoreYearsChartBot');
        var myChart = echarts.init(chartDom);
        var option;
        var $this = this;

        var  colorList=['#3a72ff', '#1bd7ff', '#ff395d', '#ffcd6a', '#f1bb4c', "rgba(250,250,250,0.5)"];
        option = {
            grid: {
                top: '-5%',
                bottom: 0,
                left: '-15%',
                right: '-15%',
                containLabel: true,
            },
            tooltip: {
              trigger: 'item',
              formatter: (params) => {
                console.log(params)
                   if(this.type == 0){
                      var text = `${params.data.departname}<br/>
                      <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                          params.color
                      };"></span>积分：${params.data.score}`;
                      return text;
                   }else{
                     var text = `${params.data.departname}<br/>
                      <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                          params.color
                      };"></span>个数：${params.data.score}`;
                      return text;
                   }
              },
            },
            dataset:{
                source: chartBotData
            },
            series: [
                {
                    radius: ['35%', '62%'],
                    center: ['50%', '50%'],
                    type: 'pie',
                    showEmptyCircle: true,
                    itemStyle: {
                        normal: {
                            color: function(params) {
                                return colorList[params.dataIndex]
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: true,
                            length: 15,
                            length2: 10,
                            lineStyle: {
                                color: 'rgba(140,162,221,0.8)'
                            },
                            align: 'right'
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    label:{
                        normal:{
                            formatter: function(params){
                                var str = '';
                                str = '{a|'+params.name+'}'+'{b|\n占比: '+params.percent.toFixed(1)+'%}';
                                return str
                            },
                            fontSize: 13,
                            color: "rgba(140,162,221,0.8)",
                            rich: {
                              b:{
                                padding: [5, 0, 0, 0],
                              }
                            }
                        }
                    },
                    labelLayout:{
                        verticalAlign:"top"
                    }
                },
                {
                    radius: ['35%', '40%'],
                    center: ['50%', '50%'],
                    type: 'pie',
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    animation: false,
                    tooltip: {
                        show: false
                    },
                    itemStyle: {
                        normal: {
                            color:'rgba(0,0,0,0.2)'
                        }
                    },
                    data: [{
                        value: 1,
                    }],
                }
            ]
        };
        option && myChart.setOption(option);
        $this.myChart = myChart;
      },
      // 原图表
      setChartBottom2(){
          var $this = this;
          let chartBotData = [];
          if(this.type == 0){
            chartBotData = JSON.parse(JSON.stringify(this.yeardeaprtscore));
          }else{
            chartBotData = JSON.parse(JSON.stringify(this.yearscorenumbercount));
          }
          if($this.chartBot&&!$this.chartBot.chart.destroyed){
              $this.chartBot.destroy();
            
          } 
          const chartBot = new Pie('ScoreYearsChartBot', {
            appendPadding: 10,
            data:chartBotData,
            angleField: 'score',
            colorField: 'departname',
            radius: 1,
            innerRadius: 0.6,
            color:['#1760ff','#3fcaff','#ffc857','#fe3a33','#8ae45b'],
            label: {
              type: 'inner',
              autoHide:true,
              autoRotate:false,
              content: (data) => {
                return `${(data.percent * 100).toFixed(0)}%`
              },
              style: {
                fontSize: 12,
                
              },
            },
            meta: {
              score: {
                alias: $this.type == 0?'积分':'个数',
              },
            },
            pieStyle:{
              cursor: 'pointer'
            },
            tooltip: {
              fields: ['score'],
              showTitle:true,
              title:'departname'
            },
            legend: {
              position:'bottom',
              maxRow:2,
              flipPage:false,
              marker:{
                symbol:'square'
              },
              itemName:{
                style:{
                  fontSize: 12,
                  fill: '#a6a6a6',
                }
              }
            },
            state: {
              active: {
                style: {
                  lineWidth: 1,
                  stroke:'#fff'
                },
              },
            },
            statistic: null,
          });
          chartBot.on('element:click', (args) => {
            let baseDepart = args.data.data.id;
            let contrastDepart = '';
            let startTime = parseTime(new Date(),'{y}') + '/01';
            let endTime = parseTime(new Date(),'{y}') + '/12' 
            if($this.language == '中文'){
              $this.$router.push({path:'/stat/cn/departAnalysis',query:{type:2,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
            }else{
              if(this.type == 0){
                $this.$router.push({path:'/stat/en/departAnalysis',query:{type:2,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
              }else{
                $this.$router.push({path:'/stat/en/departAnalysis',query:{type:8,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
              }
            }
          });
          $this.chartBot = chartBot;
          chartBot.render();
      },
    }
}
</script>

<style scoped lang="scss">
</style>