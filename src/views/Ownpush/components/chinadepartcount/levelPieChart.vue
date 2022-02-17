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
                    radius: ['40%', '70%'],
                    width: 380,
                    left: 'center',
                    avoidLabelOverlap: true,
                    itemStyle: {
                        borderColor: '#ffffff',
                        borderWidth:1,
                    },
                    label: {
                        alignTo: 'edge',
                        formatter: '{name|{b}：{d}%}\n{time|{c} 个}',
                        minMargin: 10,
                        edgeDistance:10,
                        padding:[10,0,10,0],
                        rich: {
                          name: {
                            fontSize: 12,
                            lineHeight:20,
                            color: '#333',
                            fontWeight:'bold'
                          },
                          time: {
                            fontSize: 12,
                            lineHeight:20,
                            color: '#999'
                          }
                        }
                    },
                    labelLine: {
                      length: 15,
                      length2: 0,
                      maxSurfaceAngle: 80
                    },
                    labelLayout: function (params) {
                      const isLeft = params.labelRect.x < myChart.getWidth() / 2;
                      const points = params.labelLinePoints;
                      // Update the end point.
                      points[2][0] = isLeft
                        ? params.labelRect.x
                        : params.labelRect.x + params.labelRect.width;
                      return {
                        labelLinePoints: points
                      };
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