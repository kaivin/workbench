<template>
    <div class="pie-chart" :id="'pie-'+idData" :style="'height:'+scoreHeight+'px'" ></div>
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
    colorData: {
      type: Array,
      default:[],
    },
    scoreHeight:{
      type: Number,
      default: "",
    },
    idData:{
      type: String,
      default: "",
    },
    tagName:{
      type: String,
      default: "",
    },
    tagUnit:{
      type: String,
      default: "",
    },
    tagUnitend:{
      type: String,
      default: "",
    },
  },
  destroyed(){
    window.removeEventListener('resize',this.echartsSize);
    if(this.myChart){
        this.myChart.dispose();
    }
  },
  mounted(){
      var $this = this;
      window.addEventListener('resize',$this.echartsSize);
      this.drawAreaTrendChart();
  },
  methods: {
    drawAreaTrendChart() {
        var $this = this;
        console.log($this.chartData,'$this.chartData')
        var chartDom = document.getElementById('pie-'+$this.idData);
        var myChart = echarts.init(chartDom);
        var tagNum=$this.chartData[0].value + $this.tagUnitend;
        var colorList1=[];
        $this.colorData.forEach(function(item,index){
            var itemObj={};
            itemObj.x=0;
            itemObj.y=0;
            itemObj.x2=0;
            itemObj.y2=1;
            itemObj.colorStops=[];
            var colorOne={};
            colorOne.offset=0;
            colorOne.color=item;            
            itemObj.colorStops.push(colorOne);
            var colorTwo={};
            colorTwo.offset=1;
            colorTwo.color=item;
            itemObj.colorStops.push(colorTwo);
            colorList1.push(itemObj);
        });
        var option;
        option = {
            title: [   
            {
                text:$this.tagName,
                subtext: tagNum,
                textStyle:{
                    fontSize:16,
                    color:"black"
                },
                subtextStyle: {
                    fontSize: 14,
                    color: 'black'
                },
                textAlign:"center",
                x: '49%',
                y: '44%',
            }],
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    color:colorList1,
                    name:$this.tagName,
                    type: 'pie',
                    radius: ['30%', '50%'],
                    emphasis: {
                        label: {
                        show: true,
                        fontSize: '40',
                        fontWeight: 'bold'
                        }
                    },
                    avoidLabelOverlap: true,
                    itemStyle: {
                        borderColor: '#ffffff',
                        borderWidth:1,
                    },
                    label: {
                        alignTo: 'edge',
                        formatter: '{name|{b}：{d}%}\n{time|{c}'+$this.tagUnitend+'}',
                        minMargin: 10,
                        edgeDistance:10,
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
                    data:$this.chartData
                }
            ]
        };
        option && myChart.setOption(option);        
        setTimeout(function() {
            myChart.on('mouseover', function(params) {
                if (params.name == $this.chartData[0].name) {
                    myChart.dispatchAction({
                        type: 'highlight',
                        seriesIndex: 0,
                        dataIndex: 0
                    });
                } else {
                    myChart.dispatchAction({
                        type: 'downplay',
                        seriesIndex: 0,
                        dataIndex: 0
                    });
                }
                let option = myChart.getOption();
                option.title[0].subtext = params.data.value+$this.tagUnitend;
                myChart.setOption(option);
            });
            myChart.on('mouseout', function(params) {
                myChart.dispatchAction({
                    type: 'highlight',
                    seriesIndex: 0,
                    dataIndex: 0
                });
                let option = myChart.getOption();
                option.title[0].subtext = $this.chartData[0].value+$this.tagUnitend;
                myChart.setOption(option);
            });
            myChart.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: 0
            });
        }, 1000);
        $this.myChart = myChart;
    },
    echartsSize(){
        if(this.myChart){
            this.myChart.resize();
        }
    }
  },
}
</script>

<style></style>