<template>
  <div class="hxpage">
    <div class="module-top">
      <div class="title-view">
        <div class="title">{{language}}年度总成交100万数量</div>
        <div class="unit">（单位：个）</div>
        <!-- <div class="more">更多分析 ></div> -->
      </div>
      <div class="contrast-view">
        <div class="redtext">{{totalXpanYears}}</div>
        <div class="redright">
          <div class="conname">环比上年同期</div>
          <div class="num up" v-if="isUp"><i class="svg-i"><svg-icon icon-class="data-up" /></i>{{isUpNum}}</div>
          <div class="num down" v-else><i class="svg-i"><svg-icon icon-class="data-down" /></i>{{isUpNum}}</div>
        </div>
      </div>
      <div class="chart-top" id="DealYearsChartTop"></div>     
    </div>
    <div class="module-bottom">
      <div class="title-view">
        <div class="title">各部门年度总成交100万数量</div>
      </div>
      <div class="chart-bottom" id="DealYearsChartBot"></div>
    </div>

  </div>
</template>

<script>
import { Column,P, G2} from '@antv/g2plot';
import * as echarts from 'echarts';
import {parseTime} from "@/utils";

export default {
    name:'demo',

    data(){
      return {
        isUp:true,
        isUpNum:0,
        myChart:null,
      }
    },
    props:{
      language:{
        type:String,
        default:"中文"
      },
      yearsanumbertong:{
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
      yearsanumbertong:{
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
        for(let i = 0;i<this.yearsanumbertong.length;i++){
          total+=this.yearsanumbertong[i].a_number
        }
        return total.toLocaleString()
      },
    },
    mounted(){
      window.addEventListener('resize',this.echartsSize)
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
          const chartTop = new Column('DealYearsChartTop', {
            data:chartTopData,
            xField: 'date',
            yField: 'a_number',
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
            color:'#8bb2f2',
            maxColumnWidth:16,
            columnStyle:{
              fill:'#b0c9ff',
              cursor: 'pointer',
              fillOpacity:1,
              opacity:1,
            },
            meta: {
              a_number: {
                alias: '数量',
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
              $this.$router.push({path:'/stat/cn/departAnalysis',query:{type:9,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
            }else{
              $this.$router.push({path:'/stat/en/departAnalysis',query:{type:9,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
            }
          });
          $this.chartTop = chartTop;
          chartTop.render();
        
      },
      setIsUp(val){
        let newXpanYears = 0;
        let oldXpanYears = 0;
        for(let i = 0;i<val.length;i++){
          oldXpanYears+=val[i].lasta_number;
          newXpanYears+=val[i].a_number
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
        chartBotData.forEach(item => {
          item.departname = item.departname.slice(-2);
        });
        let xAxisData = [];
        let seriesData = [];
        for(let i = 0;i<chartBotData.length;i++){
          xAxisData.push(chartBotData[i].departname);
          seriesData.push(chartBotData[i].a_number==0?'':chartBotData[i].a_number);
        }
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('DealYearsChartBot'));
        
        // 指定图表的配置项和数据
        var option = {
          xAxis: {
            type: 'category',
            data: xAxisData,
            axisLine:{
              show:false,
            },
            axisTick:{
              show:false,
            },
            axisLabel:{
              color:'#333',
            }
          },
          yAxis: {
            type: 'value',
            axisLine:{
              show:false,
            },
            axisTick:{
              show:false,
            },
            axisLabel:{
              color:'#333',
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
            splitLine:{
              lineStyle:{
                type:'dotted',
                color:'#ccc',
                opacity:0.3,
                dashOffset:3,
                shadowColor: null,
                shadowBlur: 0,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              }
            }
          },
          tooltip:{
            show:true,
            trigger:'axis',
            backgroundColor:'#fff',
            extraCssText: 'box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);',
            formatter: function (params) {
                  return `<div class="toolDiv">
                    <div class="title">${params[0].name}</div>
                    <div class="bar clearfix">
                      <span class="icon"></span>
                      <span class="name">数量：</span>
                      <div class="num">${params[0].data}</div>
                    </div>
                  </div>`
            },
            textStyle:{
              fontSize:12,
            }
          },
          grid:{
            left:40,
            right:10,
            bottom:20,
            top:20
          },
          series: [
            {
              name: 'hill',
              type: 'pictorialBar',
              barCategoryGap: '-20%',
              symbol: 'triangle',
              label:{
                show:true,
                position:'top',
                color:'#333'
              },
              itemStyle:{
                color:'#869eff',
                opacity:0.2,
               
              },
              emphasis: {
                itemStyle: {
                  opacity: 1
                }
              },
              data: seriesData,
              z: 10
            },            
          ]
        };
        this.myChart = myChart;
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        this.echartsResize = this.myChart.resize();
        myChart.on('click', function (params) {
            // 在用户点击后控制台打印数据的名称
            let baseDepart = $this.departList[params.dataIndex].id;
            let contrastDepart = '';
            let startTime = parseTime(new Date(),'{y}') + '/01';
            let endTime = parseTime(new Date(),'{y}') + '/12' 
            if($this.language == '中文'){
              $this.$router.push({path:'/stat/cn/departAnalysis',query:{type:9,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
            }else{
              $this.$router.push({path:'/stat/en/departAnalysis',query:{type:9,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
            }
        });
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
<style lang="scss">
.toolDiv{
  .title{
    font-size: 12px;
    color: rgb(89, 89, 89);
    margin-bottom: 8px;
  }
  .bar{
    .icon{
      float: left;
      background: rgb(91, 143, 249);
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: block;
      margin-right: 8px;
      margin-top: 5px;
    }
    .name{
      color: rgb(89, 89, 89);
      float: left;
    }
    .num{
      float: right;
      margin-left: 30px;
      color: rgb(89, 89, 89);
    }
  }
}
</style>
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