<template>
  <div class="hxpage">
    <div class="module-top">
      <div class="title-view">
        <div class="title">{{language}}年度总询盘</div>
        <div class="unit">（单位：个）</div>
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
      <div class="chart-top" id="XpanYearsChartTop"></div>     
    </div>
    <div class="module-bottom">
      <div class="title-view">
        <div class="title">各部门年度总询盘占比（个数+百分比）</div>
      </div>
      <div class="chart-bottom" id="XpanYearsChartBot"></div>
    </div>

  </div>
</template>

<script>
import { Column,Pie} from '@antv/g2plot';

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
      yeartong:{
        type:Array,
        default:function(){
          return []
        }
      },
      yearcount:{
        type:Array,
        default:function(){
          return []
        }
      }
    },
    watch:{
      yeartong:{
        handler(val,oldval){
          this.costAverageChart(val);
          this.setIsUp(val);
        },
        deep:true
      },
      yearcount:{
        handler(val,oldval){
          this.setChartBottom(val)
        },
        deep:true
      }
    },
    computed:{
      totalXpanYears(){
        let total = 0;
        for(let i = 0;i<this.yeartong.length;i++){
          total+=this.yeartong[i].xunnumber
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
          const chartTop = new Column('XpanYearsChartTop', {
            data:chartTopData,
            xField: 'date',
            yField: 'xunnumber',
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
            columnStyle:{
              fill:'#c9daf2',
            },
            meta: {
              xunnumber: {
                alias: '询盘数量',
              },
            },
            state: {
              interactions: [{ type: 'element-active' }],
              // 设置 active 激活状态的样式
              active: {
                columnStyle:{
                  fill:'#83aafc',
                },
              },
            }
            
            
          });

          $this.chartTop = chartTop;
          chartTop.render();
        
      },
      setIsUp(val){
        let newXpanYears = 0;
        let oldXpanYears = 0;
        for(let i = 0;i<val.length;i++){
          oldXpanYears+=val[i].lastxunnumber;
          newXpanYears+=val[i].xunnumber
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
          
          if($this.chartBot&&!$this.chartBot.chart.destroyed){
              $this.chartBot.changeData(chartBotData);
              return ;
          } 
          console.log(chartBotData)
          const chartBot = new Pie('XpanYearsChartBot', {
            appendPadding: 10,
            data:chartBotData,
            angleField: 'yearcount',
            colorField: 'departname',
            radius: 1,
            color:['#a9dfbf','#d9d9f3','#bcd8ea','#f5b7b1','#f4dfb8'],
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