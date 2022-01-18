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
        var chartDom = document.getElementById('pie-'+$this.idData);
        var myChart = echarts.init(chartDom);
        var tagNum=$this.chartData[0].value + $this.tagUnitend;
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
                    name:$this.tagName,
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    emphasis: {
                        label: {
                        show: true,
                        fontSize: '40',
                        fontWeight: 'bold'
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderColor: '#ffffff',
                            borderWidth:1,
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    label: {
                        normal: {
                            position: 'inner',
                            fontSize: 12,
                            formatter: params => {
                                return (
                                    '{percent|' + params.percent + '%}'
                                );
                            },
                            padding: [0, -130, 0, -130],
                            rich: {
                                color: '#fff',
                                percent: {
                                    fontSize: 12,
                                    padding: [0, 0, 3, 0],
                                    color: '#fff'
                                },
                            },
                            textStyle: {
                                color: '#fff'
                            }
                        },
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