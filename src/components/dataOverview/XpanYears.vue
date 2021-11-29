<template>
  <div class="hxpage">
    <div class="module-top">
      <div class="title-view">
        <div class="title">{{language}}年度总询盘</div>
        <div class="unit">（单位：个）</div>
        <div class="more" @click="goPage">详情 <i class="svg-i"><svg-icon icon-class="rt-more"></svg-icon></i></div>
      </div>
      <div class="contrast-view">
        <div class="redtext">{{totalXpanYears}}</div>
        <div class="redright">
          <div class="conname">环比上年同期</div>
          <div class="num up" v-if="isUp"><i class="svg-i"><svg-icon icon-class="data-up" /></i>{{isUpNum}}</div>
          <div class="num down" v-else><i class="svg-i"><svg-icon icon-class="data-down" /></i>{{isUpNum}}</div>
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
import {parseTime} from "@/utils";
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
      },
      departList:{
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
      goPage(){
        var newDate = new Date();
        var newYear = newDate.getFullYear();
        var startTime = newYear + "/01";
        var endTime = newYear + "/12";
       
        var baseDepart = "";
        var contrastDepartArr = [];
        this.departList.forEach(function(item,index){
          if(index == 0){
            baseDepart = item.id;
          }else{
            contrastDepartArr.push(item.id);
          }
        });
        var contrastDepart = "";
        if(contrastDepartArr.length>0){
          contrastDepart = contrastDepartArr.join(",");
        }
       if(this.language == '中文'){
         this.$router.push({path:'/Home/CH/sectorAnalysis',query:{type:1,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
       }else{
         this.$router.push({path:'/Home/EN/sectorAnalysis',query:{type:1,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
       }
       
      },
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
              fill:'#a6c0f5',
              cursor: 'pointer'
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
          chartTop.on('element:click', (args) => {
            let data = args.data.data;
            let month = data.date.slice(0,2);
            let startTime = parseTime(new Date(),'{y}') + '/' +  month + '/01';
            let endTime = parseTime(new Date(),'{y}') + '/' + month + '/' + $this.getMonthDays(parseTime(new Date(),'{y}'),month);
            var baseDepart = "";
            var contrastDepartArr = [];
            $this.departList.forEach(function(item,index){
              if(index == 0){
                baseDepart = item.id;
              }else{
                contrastDepartArr.push(item.id);
              }
            });
            var contrastDepart = "";
            if(contrastDepartArr.length>0){
              contrastDepart = contrastDepartArr.join(",");
            }
            if($this.language == '中文'){
              $this.$router.push({path:'/Home/CH/sectorAnalysis',query:{type:1,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
            }else{
              $this.$router.push({path:'/Home/EN/sectorAnalysis',query:{type:1,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
            }
          });
          $this.chartTop = chartTop;
          chartTop.render();
        
      },
      getMonthDays(year,month){
        var thisDate = new Date(year,month,0); //当天数为0 js自动处理为上一月的最后一天
        return thisDate.getDate();
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
          
          const chartBot = new Pie('XpanYearsChartBot', {
            appendPadding: 10,
            data:chartBotData,
            angleField: 'yearcount',
            colorField: 'departname',
            radius: 1,
            color:['#5b79d6','#8ae45b','#f8c34e','#ee6666','#3abaf4'],
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
              $this.$router.push({path:'/Home/CH/sectorAnalysis',query:{type:1,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
            }else{
              $this.$router.push({path:'/Home/EN/sectorAnalysis',query:{type:1,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
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
      cursor: pointer;
      position: relative;
      top: -1px;
      .svg-i{
        font-size: 10px;
        color: #a1a1a1;
        vertical-align: 1px;
      }
    }
  }
  .contrast-view{
    height: 40px;
    margin-bottom: 15px;
    .redtext{
      float: left;
      font-size: 26px;
      color: #eb3737;
      font-weight: bold;
      margin-right: 15px;
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
        position: relative;
      }
      .up{
        color: #f25e5e;
        
      }
      .down{
        color: #2dbb4c;
        
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