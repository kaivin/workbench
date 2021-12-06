<template>
  <div class="hxpage">
    <div class="module-top">
      <div class="title-view">
        <div class="title">{{language}}年度总成本</div>
        <div class="unit">（单位：万）</div>
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
import { Column,Area,Line} from '@antv/g2plot';
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
      },
      departList:{
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
         this.$router.push({path:'/stat/cn/departAnalysis',query:{type:3,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
       }else{
         this.$router.push({path:'/stat/en/departAnalysis',query:{type:3,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
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
          const chartTop = new Line('CostYearsChartTop', {
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
                  cursor: 'pointer'
                },
              },
            },
            yAxis: {
              grid:null,
              line:null,
              label:null
            },
            maxColumnWidth:16,
            color:'#f7d996',
            // areaStyle: () => {
            //   return {
            //     fill: '#f7d996',
            //   };
            // },
            lineStyle:{
              fill:'#f7d996',
              
            },
            meta: {
              money: {
                alias: '成本',
              },
            },
          });
          chartTop.on('axis-label:click', (args) => {
            let data = args.gEvent.delegateObject.item.name;
            let month = data.slice(0,2);
            let startTime = parseTime(new Date(),'{y}') + '/' +  month;
            let endTime = parseTime(new Date(),'{y}') + '/' + month;
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
              $this.$router.push({path:'/stat/cn/departAnalysis',query:{type:3,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
            }else{
              $this.$router.push({path:'/stat/en/departAnalysis',query:{type:3,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
            }
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

<style></style>