<template>
    <div class="pie-chart" id='randomStr' :style="'height:'+scoreHeight+'px'" ></div>
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
    departArr: {
      type: Array,
      default:[],
    },
    yarnArr: {
      type: Array,
      default:[],
    },
    yarnClinch: {
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
    isCost:{
      type:Boolean,
      default:true,
    },
  },
  watch:{
    chartData:{
      handler(newValue, oldValue) {
          this.drawAreaTrendChart();
      },
      deep: true
    },
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
        var chartDom = document.getElementById('randomStr');
        var myChart = echarts.init(chartDom);
        var series=[];
        var departArr=[];
        if($this.isCost){ 
          departArr=$this.departArr;
          $this.yarnArr.forEach(function(item,index){
            $this.yarnClinch.forEach(function(itemk,indexk){
              var itemObj={};
              itemObj.name=itemk;
              itemObj.type='bar';
              itemObj.barWidth=25;
              itemObj.stack=item;
              itemObj.emphasis={
                focus: 'series'
              };
              itemObj.data=[];
              $this.chartData.forEach(function(items,indexs){
                if(item==items.time&&itemk==items.yeartime){
                  itemObj.data.push(items.value);
                }
              });
              series.push(itemObj);
            });
          });
        }else{ 
          $this.yarnClinch.forEach(function(item,index){
              var itemObj={};
              itemObj.name=item;
              itemObj.type='bar';
              itemObj.barWidth=25;
              itemObj.emphasis={
                focus: 'series'
              };
              itemObj.data=[];
              $this.yarnArr.forEach(function(items,indexs){
                $this.chartData.forEach(function(itemk,indexk){
                  if(item==itemk.yeartime&&items==itemk.time){
                    itemObj.data.push(itemk.value);
                  }
                });
              });
              series.push(itemObj);
          });
          departArr=$this.yarnArr;
        }
        var option;
        option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params, ticket, callback) {
                var showHtm="";
                if($this.isCost){ 
                  departArr.forEach(function(item,index){  
                      var showHtmDt='';                  
                      $this.yarnArr.forEach(function(items,indexs){
                          var len01=$this.yarnClinch.length*(indexs+1); 
                          var len02=$this.yarnClinch.length;
                          var showHtmDd='';
                          for(var i=len01-len02;i<len01;i++){
                            if(params[i]&&params[i]!=undefined){
                              var name = params[i].axisValue;
                              var text = params[i].seriesName;
                              var value = params[i].value;
                              showHtmDd+='<dd><i style="background:'+params[i].color+'"></i>'+text+'年：<strong>' + value+'</strong></dd>'
                            }
                          }
                          showHtmDt+='<dl class="flex-content"><dt>'+items+'成交积分</dt>'+showHtmDd+'</dl>';
                      });
                      showHtm=showHtmDt
                  });
                }else{ 
                  var showHtm="";
                  var showHtmDt=''; 
                  var showHtmDd='';
                  var name = '';
                  for(var i=0;i<params.length;i++){
                      if(params[i]&&params[i]!=undefined){
                          name = params[i].axisValue;
                          var text = params[i].seriesName;
                          var value = params[i].value;
                          showHtmDd+='<dd><i style="background:'+params[i].color+'"></i>'+text+'年：<strong>' + value+'</strong></dd>'
                      }
                  }
                  showHtmDt+='<dl class="flex-content"><dt>'+name+'成交积分</dt>'+showHtmDd+'</dl>';
                  showHtm=showHtmDt;
                }
                return '<div class="mainTool flex-box">'+showHtm+'</div>';
            }
          },
          grid: {
            left: 30,
            right:30,
            bottom: 0,
            top: 60,
            containLabel: true
          },
          xAxis:{
              type: 'category',
              data: departArr,
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
            data:$this.yarnClinch,
            right: 10,
            top:0,
            align:'left',
          },
          animation: false,
          series:series
        };
        option && myChart.setOption(option);
        $this.myChart = myChart;
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
  },
}
</script>

<style></style>