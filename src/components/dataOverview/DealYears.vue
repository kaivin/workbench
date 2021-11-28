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
import echarts from 'echarts';

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
              fill:'#8bb2f2',
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

          $this.chartTop = chartTop;
          console.log($this.chartTop)
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
          item.departname = item.departname.slice(-2)
        });
        let xAxisData = [];
        let seriesData = [];
        for(let i = 0;i<chartBotData.length;i++){
          xAxisData.push(chartBotData[i].departname);
          seriesData.push(chartBotData[i].a_number)
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
              color:'#a6a6a6',
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
              color:'#a6a6a6',
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
            show:false,
            trigger:'axis',
            
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
              data: seriesData,
              type: 'pictorialBar',
              symbol: 'triangle',
              symbolSize:['140%', '100%'],
              label:{
                show:true,
                position:'top',
                color:'#8b8b8b'
              },
              itemStyle:{
                color:'#79a4f7',
                opacity:0.2,
               
              },
              
            },
            
          ]
        };
        this.myChart = myChart;
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        this.echartsResize = this.myChart.resize();
        
      },
      echartsSize(){
        if(this.myChart){
          this.myChart.resize()
        }
      }
    },
    destroyed(){
      window.removeEventListener('resize',this.echartsSize)
      this.myChart.dispose();
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