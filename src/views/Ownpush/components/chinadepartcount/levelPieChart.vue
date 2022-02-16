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
        var colorList1=[];
        var tagName='';
        var tagNum='';
        $this.currentData.forEach(function(item,index){
            tagName=item.departname;
            tagNum=item.value;
            var itemObj={};
            itemObj.x=0;
            itemObj.y=0;
            itemObj.x2=0;
            itemObj.y2=1;
            itemObj.colorStops=[];
            var colorOne={};
            colorOne.offset=0;
            colorOne.color=item.color;            
            itemObj.colorStops.push(colorOne);
            var colorTwo={};
            colorTwo.offset=1;
            colorTwo.color=item.color;
            itemObj.colorStops.push(colorTwo);
            colorList1.push(itemObj);
        });
        var option;
        option = {
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    color:colorList1,
                    type: 'pie',
                    radius: ['28%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderColor: '#ffffff',
                        borderWidth:1,
                    },
                    labelLine: {
                        length: 5,
                        length2: 20,
                        lineStyle: {
                            width: 1
                        }
                    },
                    label: {
                        show: true,
                        position: 'outside',
                        formatter: '{a|{b}：{d}%}',
                        rich: {
                            a: {
                                padding: [0, 5, 0, 5]
                            }
                        }
                    },
                    data:$this.currentData
                }
            ]
        };
        option && myChart.setOption(option);
        $this.myChart = myChart;
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