<template>
  <div class="hxpage">
    <div class="module-top">
      <div class="title-view">
        <div class="title">{{language}}年度总成本</div>
        <div class="unit">（单位：万）</div>
        <div class="more">更多分析 ></div>
      </div>
      <div class="contrast-view">
        <div class="redtext">{{totalXpanYears}}</div>
        <div class="redright">
          <div class="conname">环比上年同期</div>
          <div class="num up" v-if="isUp">{{isUpNum}}</div>
          <div class="num down" v-else>{{isUpNum}}</div>
        </div>
      </div>
      <div class="chart-top" id="CostYearsChartTop"></div>     
    </div>
    <div class="module-bottom">
      <div class="title-view">
        <div class="title">各部门年度平均成本排行<span>（单位：元）</span></div>
      </div>
      <div class="chart-bottom" id="CostYearsChartBot"></div>
    </div>

  </div>
</template>

<script>
import { Column,Area} from '@antv/g2plot';

export default {
    name:'demo',
    data(){
      return {
        isUp:true,
        isUpNum:0
      }
    },
    props:{
      language:{
        type:String,
        default:"中文"
      },
      yearsmoneytong:{
        type:Array,
        default:function(){
          return []
        }
      },
      yeardeaprtscore:{
        type:Array,
        default:function(){
          return []
        }
      }
    },
    watch:{
      yearsmoneytong:{
        handler(val,oldval){
          this.costAverageChart(val);
          this.setIsUp(val);
        },
        deep:true
      },
      yeardeaprtscore:{
        handler(val,oldval){
          this.setChartBottom(val)
        },
        deep:true
      }
    },
    computed:{
      totalXpanYears(){
        let total = 0;
        for(let i = 0;i<this.yearsmoneytong.length;i++){
          total+=this.yearsmoneytong[i].money
        }
        return total.toLocaleString()
      }
    },
    methods:{
      //chart top
      costAverageChart(val){
        
        var $this = this;
          let chartTopData = JSON.parse(JSON.stringify(val));
          for(let i = 0;i<chartTopData.length;i++){
            chartTopData[i].date = chartTopData[i].date.slice(-2) + '月'
          }
          if($this.chartTop&&!$this.chartTop.chart.destroyed){
              $this.chartTop.changeData(chartTopData);
              return ;
          } 
          const chartTop = new Area('CostYearsChartTop', {
            data:chartTopData,
            xField: 'date',
            yField: 'money',
            xAxis: {
              grid:null,
              line:null,
              tickLine:null,
              label: {
                autoHide: true,
                autoRotate: false,
                style: {
                  fill: '#bfbfbf',
                  opacity: 1,
                  fontSize: 12,
                  lineHeight:18,
                },
              },
            },
            yAxis: {
              grid:null,
              line:null,
              label:null
            },
            maxColumnWidth:16,
            color:'#fceabe',
            areaStyle: () => {
              return {
                fill: '#fceabe',
              };
            },
            meta: {
              money: {
                alias: '成本',
              },
            },
          });

          $this.chartTop = chartTop;
          chartTop.render();
        
      },
      setIsUp(val){
        let newXpanYears = 0;
        let oldXpanYears = 0;
        for(let i = 0;i<val.length;i++){
          oldXpanYears+=val[i].lastmoney;
          newXpanYears+=val[i].money
        }
        if(newXpanYears>=oldXpanYears){
          this.isUp = true;
          this.isUpNum = newXpanYears - oldXpanYears
        }else{
          this.isUp = false;
          this.isUpNum = oldXpanYears - newXpanYears
        }
      },
      setChartBottom(val){
          var $this = this;
          let chartBotData = JSON.parse(JSON.stringify(val));
          for(let i = 0;i<chartBotData.length;i++){
            chartBotData[i].departname=chartBotData[i].departname.slice(-2)
          }
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
            maxColumnWidth:16,
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
                  fill: '#bfbfbf',
                  opacity: 1,
                  fontSize: 12,
                  lineHeight:18,
                },
              },
            },
            yAxis: {
              grid: {
                line: {
                  style: {
                    stroke: "#cccccc",
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
              fill:'l(270) 0:#d4e3f9  1:#b9d1f6',
            }
          });
          $this.chartBot = chartBot;
          chartBot.render();
      },
    }
}
</script>

<style scoped lang="scss">
.hxpage{
  background: #fff;
  .module-top{
    padding: 15px 30px;
    border-bottom: 2px solid #f6f7fa;
  }
  .title-view{
    height: 24px;
    line-height: 24px;
    margin-bottom: 10px;
    .title{
      font-size: 14px;
      color: #1a1a1a;
      float: left;
      margin-right: 4px;
      font-weight: bold;
      span{
        font-size: 12px;
        color: #a1a1a1;
        font-weight: normal;
        margin-left: 10px;
      }
    }
    .unit{
      font-size: 12px;
      color: #a1a1a1;
      float: left;
    }
    .more{
      font-size: 12px;
      color: #a1a1a1;
      float: right;
    }
  }
  .contrast-view{
    height: 40px;
    margin-bottom: 15px;
    .redtext{
      float: left;
      font-size: 28px;
      color: #eb3737;
      font-weight: bold;
      margin-right: 15px;
      line-height: 40px;
    }
    .redright{
      float: left;
      .conname{
        font-size: 12px;
        line-height: 20px;
        color: #999999;
      }
      .num{
        font-size: 12px;
        line-height: 20px;
        padding-left: 12px;
        position: relative;
      }
      .up{
        color: #f25e5e;
        &:before{
          content: '↑';
          position: absolute;
          left: 0;
          font-size: 12px;
          line-height: 12px;
          top: 3px;
          
        }
      }
      .down{
        color: #2dbb4c;
        &:before{
          content: '↓';
          position: absolute;
          left: 0;
          font-size: 12px;
          line-height: 12px;
          top: 3px;
          
        }
      }
    }
  }
  .chart-top{
    height: 68px;
  }
  .module-bottom{
    padding: 20px 30px;
  }
  .chart-bottom{
    height: 260px;
    margin-top: 35px;
  }
  
}
</style>