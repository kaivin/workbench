<template>
  <div class="hxpage">
    <div class="module-top">
      <div class="title-view">
        <div class="title">{{language}}年度总成交{{language=='英文'&&type==1?'个数':'积分'}}</div>
        <div class="unit">{{language=='英文'&&type==1?'（单位：个）':'（单位：分）'}}</div>
        <!-- <div class="more">更多分析 ></div> -->
        <div class="btn-group" v-if="language=='英文'">
          <div @click="changeType(0)" class="btn-item" :class="type == 0?'active':''">积分</div>
          <div @click="changeType(1)" class="btn-item" :class="type == 1?'active':''">个数</div>
        </div>
      </div>
      <div class="contrast-view">
        <div class="redtext">{{totalXpanYears}}</div>
        <div class="redright">
          <div class="conname">环比上年同期</div>
          <div class="num up" v-if="isUp">{{isUpNum}}</div>
          <div class="num down" v-else>{{isUpNum}}</div>
        </div>
      </div>
      <div class="chart-top" id="ScoreYearsChartTop"></div>     
    </div>
    <div class="module-bottom">
      <div class="title-view">
        <div class="title">各部门年度总成交占比{{type == 0?'（积分+占比）':'（个数+占比）'}}</div>
      </div>
      <div class="chart-bottom" id="ScoreYearsChartBot"></div>
    </div>

  </div>
</template>

<script>
import { Area,Pie} from '@antv/g2plot';

export default {
    name:'demo',
    data(){
      return {
        type:0,
        isUp:true,
        isUpNum:0
      }
    },
    props:{
      language:{
        type:String,
        default:"中文"
      },
      yearscoretong:{
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
      },
      yearscorenumbertong:{
        type:Array,
        default:function(){
          return []
        }
      },
      yearscorenumbercount:{
        type:Array,
        default:function(){
          return []
        }
      }
    },
    watch:{
      type:function(newval,oldval){
        this.costAverageChart();
        this.setIsUp();
        this.setChartBottom();
      },
      yearscoretong:{
        handler(newval,oldval){
          this.costAverageChart();
          this.setIsUp();
        },
        deep:true
      },
      yeardeaprtscore:{
        handler(newval,oldval){
          this.setChartBottom();
        },
        deep:true
      }

    },
    computed:{
      totalXpanYears(){
        let total = 0;
        for(let i = 0;i<this.yearscoretong.length;i++){
          total+=this.yearscoretong[i].score
        }
        return total.toLocaleString()
        
      }
    },

    methods:{
       changeType(val){
        this.type = val;
      },
      //chart top
      costAverageChart(){
        var $this = this;
        let chartTopData = [];
        if(this.type == 0){
           chartTopData = JSON.parse(JSON.stringify(this.yearscoretong));
        }else{
           chartTopData = JSON.parse(JSON.stringify(this.yearscorenumbertong));
        }
          for(let i = 0;i<chartTopData.length;i++){
            chartTopData[i].date = chartTopData[i].date.slice(-2) + '月'
          }
          if($this.chartTop&&!$this.chartTop.chart.destroyed){
              $this.chartTop.destroy();
             
          } 
          const chartTop = new Area('ScoreYearsChartTop', {
            data:chartTopData,
            xField: 'date',
            yField: $this.type == 0?'score':'number',
            appendPadding: [5, 0, 5, 0],
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
            color:'#73b8e6',
            areaStyle: () => {
              return {
                fill: 'l(270) 0:#ffffff 0.5:#73b8e6 1:#73b8e6',
              };
            },
            point: {
              size: 4,
              shape: 'circle',
              style: {
                fill: 'white',
                stroke: '#73b8e6',
                lineWidth: 1,
              },
            },
            meta: {
              score: {
                alias: '积分',
              },
              number: {
                alias: '数量',
              },
            },
            
          });

          $this.chartTop = chartTop;
          chartTop.render();
        
      },
      setIsUp(){
        let val = [];
        if(this.type == 0){
           val = JSON.parse(JSON.stringify(this.yearscoretong));
        }else{
           val = JSON.parse(JSON.stringify(this.yearscorenumbertong));
        }
        let newXpanYears = 0;
        let oldXpanYears = 0;
        if(this.type == 0){
          for(let i = 0;i<val.length;i++){
            oldXpanYears+=val[i].lastscore;
            newXpanYears+=val[i].score
          }
        }else{
          for(let i = 0;i<val.length;i++){
            oldXpanYears+=val[i].lastnumber;
            newXpanYears+=val[i].number
          }
        }
        
        if(newXpanYears>=oldXpanYears){
          this.isUp = true;
          this.isUpNum = (newXpanYears - oldXpanYears).toFixed(2)
        }else{
          this.isUp = false;
          this.isUpNum = (oldXpanYears - newXpanYears).toFixed(2)
        }
      },
      setChartBottom(){
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
            color:['#a9dfbf','#d9d9f3','#bcd8ea','#f5b7b1','#f4dfb8'],
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
            tooltip: {
              fields: ['score'],
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
    .btn-group{
      float: right;
      display: flex;
      .btn-item{
        padding: 0 10px;
        height: 24px;
        text-align: center;
        line-height: 22px;
        border: 1px solid #e1e3ea;
        color: #9ea5af;
        font-size: 12px;
        box-sizing: border-box;
        cursor: pointer;
      }
      .active{
        border: 1px solid #6198f5;
        background: #6198f5;
        color: #fff;
      }
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