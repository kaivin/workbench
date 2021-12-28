<template>
  <div class="hxpage">
      <div class="title-view">
        <div class="title">各部门年度平均成本排行<span>（单位：元）</span></div>
      </div>
      <div class="chart-bottom" id="CostYearsChartBot"></div>
  </div>
</template>

<script>
import { Column,Area,Line} from '@antv/g2plot';
import {parseTime} from "@/utils";
export default {
    name:'demo',
    data(){
      return {
        startTime:"",
        endTime:"",
        baseDepart:"",
        contrastDepart:"",
        type:3,
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
      departList:{
        type:Array,
        default:function(){
          return []
        }
      }
    },
    watch:{
      yeardeaprtscore:{
        handler(val,oldval){
          this.setChartBottom(val)
        },
        deep:true
      }
    },
    computed:{
    },
    created(){
    },
    methods:{
      getMonthDays(year,month){
        var thisDate = new Date(year,month,0); //当天数为0 js自动处理为上一月的最后一天
        return thisDate.getDate();
      },
      setChartBottom(val){
          var $this = this;
          let chartBotData = JSON.parse(JSON.stringify(val));
          for(let i = 0;i<chartBotData.length;i++){
            chartBotData[i].departname=chartBotData[i].departname.slice(-2)
          }
          chartBotData.forEach(item=>{
            item.avgallmoney = parseFloat(item.avgallmoney.toFixed(1))
          })
          chartBotData.sort(function(a, b){return a.avgallmoney - b.avgallmoney}); 
          if($this.chartBot&&!$this.chartBot.chart.destroyed){
              $this.chartBot.changeData(chartBotData);
              return ;
          } 
          const chartBot = new Column('CostYearsChartBot', {
            appendPadding: [15,5,10,5],
            data:chartBotData,
            xField: 'departname',
            yField: 'avgallmoney',
            maxColumnWidth:19,
            xAxis: {
              grid:null,
              line:{
                style:{
                  stroke: "#e6e6e6",
                  lineWidth:1,
                }
              },
              tickLine:null,
              label: {
                autoHide: true,
                autoRotate: false,
                style: {
                  fill: '#333',
                  opacity: 1,
                  fontSize: 12,
                  lineHeight:18,
                },
              },
            },
            yAxis: {
              label: {
                style: {
                  fill: '#333',
                  opacity: 1,
                  fontSize: 12,
                  lineHeight:18,
                },
              },
              grid: {
                line: {
                  style: {
                    stroke: "#ebebeb",
                    lineWidth: 1,
                    lineDash: [3, 2],
                    strokeOpacity: 0.3,
                    shadowColor: null,
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                  },
                },
              },
              line:null,
            },
            label: {
              position:'top',
              offsetY: 6,
              style: {
                fontSize: 12,
                textAlign: 'center',
              },
            },
            meta: {
              avgallmoney: {
                alias: '成本',
              },
            },
            tooltip: {
              fields: ['avgallmoney'],
            },
            columnStyle:{
              fill:'l(270) 0:#9bbaff  1:#2f70ff',
              cursor: 'pointer'
            }
          });
          chartBot.on('element:click', (args) => {
            let baseDepart = args.data.data.id;
            let contrastDepart = '';
            let startTime = parseTime(new Date(),'{y}') + '/01';
            let endTime = parseTime(new Date(),'{y}') + '/12' 
            if($this.language == '中文'){
              $this.$router.push({path:'/stat/cn/departAnalysis',query:{type:3,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
            }else{
              $this.$router.push({path:'/stat/en/departAnalysis',query:{type:3,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
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