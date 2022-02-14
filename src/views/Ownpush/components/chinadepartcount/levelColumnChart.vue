<template>
    <div class="pie-chart" :id="'chart-'+idData" :style="'height:'+scoreHeight+'px'" ></div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: "pieChart",
  data:function() {
    return {
        myChart:null,
    };
  },
  props: {
    chartData: {
      type: Array,
      default:[],
    },
    idData:{
      type: String,
      default: "",
    },
    axisData: {
      type: Array,
      default:[],
    },
    yarnData: {
      type: Array,
      default:[],
    },
    scoreHeight:{
      type: Number,
      default: "",
    },
    isCost:{
      type:Boolean,
      default:true,
    },
  },
  computed:{
    currentData(){
      return this.chartData;
    },
  },
  directives: {  // 使用局部注册指令的方式
      resize: { // 指令的名称
        bind(el, binding) { // el为绑定的元素，binding为绑定给指令的对象
          let width = '', height = '';
          function isReize() {
            const style = document.defaultView.getComputedStyle(el);
            if (width !== style.width || height !== style.height) {
              binding.value();  // 关键
            }
            width = style.width;
            height = style.height;
          }
          el.__vueSetInterval__ = setInterval(isReize, 300);
        },
        unbind(el) {
          clearInterval(el.__vueSetInterval__);
        }
      }
  },
  destroyed(){
    window.removeEventListener('resize',this.echartsSize);
    if(this.myChart){
        this.myChart.dispose();
    }
  },
  mounted(){
    var $this = this;
    window.addEventListener('resize',this.echartsSize);
    $this.drawAreaTrendChart();
  },
  methods: {
    drawAreaTrendChart() {
        var $this = this;
        if(this.myChart){
            this.myChart.dispose();
        }
        var chartDom = document.getElementById('chart-'+$this.idData);
        var myChart = echarts.init(chartDom);
        var series=[];
        if($this.isCost){ 
            $this.yarnData.forEach(function(itemk,indexk){
                var itemObj={};
                itemObj.name=itemk;
                itemObj.type='bar';
                itemObj.barWidth=25;
                itemObj.emphasis={
                    focus: 'series'
                };
                itemObj.data=[];
                $this.currentData.forEach(function(items,indexs){
                    if(itemk==items.price){
                    itemObj.data.push(items.number);
                    }
                });
                series.push(itemObj);
            });
        }else{
          $this.currentData.forEach(function(item,index){
              var itemObj={};
              itemObj.data=[];
              itemObj.name=item.price;
              itemObj.type='bar';
              itemObj.barWidth=25;
              itemObj.emphasis={
                focus: 'series'
              };
              itemObj.data.push(item.number);
              series.push(itemObj);
          });
        }
        var option;
        option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left:0,
            right:30,
            bottom: 0,
            top: 60,
            containLabel: true
          },
          xAxis:{
              type: 'category',
              data: $this.axisData,
              axisLine: {
                  show: false,
              },
              axisTick: {
                  show: false,
              },
              axisLine:{
                  show: true,
                  lineStyle:{
                      type: [4, 0],
                      dashOffset: 3,
                      color: '#e5e5e5',
                      opacity: 1,
                      shadowColor: null,
                      shadowBlur: 0,
                      shadowOffsetX: 0,
                      shadowOffsetY: 0,
                  }
              },
              axisLabel: {
                  color: "#555",
                  fontSize: "12",
                  lineHeight: 18,
              },
          },
          yAxis: [
            {
              type: 'value',
              splitNumber:3,
              splitLine:{
                  show: true,
                  lineStyle:{
                      type: [4, 2],
                      dashOffset: 3,
                      color: '#f6f6f6',
                      opacity: 1,
                      shadowColor: null,
                      shadowBlur: 0,
                      shadowOffsetX: 0,
                      shadowOffsetY: 0,
                  }
              },
            }
          ],
          legend:{
            type:'plain',
            data:$this.yarnData,
            right: 10,
            top:0,
            align:'left',
          },
          series:series
        };
        option && myChart.setOption(option);
        $this.myChart = myChart;
        $this.echartsResize = $this.myChart.resize();
    },
    echartsSize(){
        if(this.myChart){
            this.myChart.resize();
        }
    }
  }
}
</script>

<style>
</style>