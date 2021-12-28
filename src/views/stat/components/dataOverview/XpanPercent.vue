<template>
  <div class="hxpage btm_shadow">
    <div class="title-view">
      <div class="title">部门询盘占比（个数+百分比）</div>
    </div>
    <div class="chart-bottom" id="XpanYearsChartBot"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import {parseTime} from "@/utils";
export default {
    name:'demo',
    data(){
      return {
        myChart:null,
      }
    },
    props:{
      language:{
        type:String,
        default:"中文"
      },
      yearcount:{
        type:Array,
        default:function(){
          return []
        }
      },
    },
    watch:{
      yearcount:{
        handler(val,oldval){
          this.setChartBottom(val)
        },
        deep:true
      }
    },
    computed:{
    },
    mounted(){
      var $this = this;
      window.addEventListener('resize',$this.echartsSize);
    },
    methods:{
      setChartBottom(val){
        var $this = this;
        let chartBotData = JSON.parse(JSON.stringify(val));
        var chartDom = document.getElementById('XpanYearsChartBot');
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
                    var text = `${params.data.departname}<br/>
                    <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                        params.color
                    };"></span>个数：${params.data.yearcount}`;
                    return text;
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
      setChartBottom2(val){
          var $this = this;
          let chartBotData = JSON.parse(JSON.stringify(val));
          
          if($this.chartBot&&!$this.chartBot.chart.destroyed){
              $this.chartBot.changeData(chartBotData);
              return ;
          } 
          
          const chartBot = new Pie('XpanYearsChartBot', {
            appendPadding: 10,
            data:chartBotData,
            angleField: 'yearcount',
            colorField: 'departname',
            radius: 1,
            color:['#1760ff','#3fcaff','#ffc857','#fe3a33','#8ae45b'],
            label: {
              type: 'inner',
              offset: '-30%',
              autoHide:true,
              autoRotate:false,
              content: (data) => {
                return `${(data.percent * 100).toFixed(0)}%`
              },
              style: {
                fontSize: 12,
                textAlign: 'center',
              },
            },
            meta: {
              yearcount: {
                alias: '个数',
              },
            },
            tooltip: {
              fields: ['yearcount'],
              showTitle:true,
              title:'departname'
            },
            pieStyle:{
              cursor: 'pointer'
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
           
          });
          chartBot.on('element:click', (args) => {
            let baseDepart = args.data.data.depart;
            let contrastDepart = '';
            let startTime = parseTime(new Date(),'{y}') + '/01';
            let endTime = parseTime(new Date(),'{y}') + '/12' 
            if($this.language == '中文'){
              $this.$router.push({path:'/stat/cn/departAnalysis',query:{type:1,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
            }else{
              $this.$router.push({path:'/stat/en/departAnalysis',query:{type:1,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
            }
          });
          $this.chartBot = chartBot;
          chartBot.render();
      },
      echartsSize(){
        if(this.myChart){
          this.myChart.resize();
        }
      }
    },
    destroyed(){
      window.removeEventListener('resize',this.echartsSize);
      if(this.myChart){
        this.myChart.dispose();
      }
    }
}
</script>

<style scoped lang="scss">
</style>