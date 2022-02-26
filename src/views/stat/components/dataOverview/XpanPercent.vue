<template>
  <div class="hxpage btm_shadow">
    <div class="title-view">
      <div class="title">部门询盘占比</div>
      <router-link :to="{path:language == '中文'?'/stat/cn/departAnalysis':'/stat/en/departAnalysis',query:{type:1,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}}" tag="a" target="_blank" class="more">详情 <i class="svg-i"><svg-icon icon-class="rt-more"></svg-icon></i></router-link>
    </div>
    <div class="chart-bottom scale-panel" id="XpanYearsChartBot"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import {parseTime} from "@/utils";
import { mapGetters } from 'vuex'
export default {
    name:'demo',
    data(){
      return {
        myChart:null,
        startTime:"",
        endTime:"",
        baseDepart:"",
        contrastDepart:"",
      }
    },
    props:{
      language:{
        type:String,
        default:"中文"
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
      },
      year:{
        type: Number,
        default: new Date().getFullYear()
      },
    },
    watch:{
      yearcount:{
        handler(val,oldval){
          this.goPage();
          this.setChartBottom(val)
        },
        deep:true
      },
      isCollapse(){
        setTimeout(() => {
          this.echartsSize();
        }, 200)
      }
    },
    computed:{
      ...mapGetters([
        'sidebar',
      ]),
      isCollapse() {
        return this.sidebar.opened
      }
    },
    mounted(){
      var $this = this;
      window.addEventListener('resize',$this.echartsSize);
    },
    methods:{
      goPage(){
        var $this = this;
        var newDate = new Date();
        // var newYear = newDate.getFullYear();
        var newYear = $this.year;
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
        $this.startTime = startTime;
        $this.endTime = endTime;
        $this.baseDepart = baseDepart;
        $this.contrastDepart = contrastDepart;
      },
      setChartBottom(val){
        var $this = this;
        let chartBotData = JSON.parse(JSON.stringify(val));
        var chartDom = document.getElementById('XpanYearsChartBot');
        var myChart = echarts.init(chartDom);
        var option;
        var $this = this;
        var pieData = [];
        var totalScore = 0;
        chartBotData.forEach(function(item){
          var itemData = {};
          itemData.name = item.departname;
          itemData.value = item.yearcount;
          pieData.push(itemData);
        });
        var  colorList=['#3a72ff', '#0aafcd', '#ff395d', '#2e53ad', '#f1bb4c', "rgba(250,250,250,0.5)"];
        option = {
            title:{
              text:'个数+百分比',
              show: true,
              left: 'center',
              top: 'middle',
              textStyle:{
                color: '#b4bced',
                fontSize: 14,
                fontWeight: 'normal'
              },
            },
            color: colorList,
            tooltip: {
              trigger: 'item',
              formatter: (params) => {
                    var text = `${params.data.name}<br/>
                    <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                        params.color
                    };"></span>个数：${params.data.value}`;
                    return text;
              },
            },
            animation: false,
            series: [
                {
                    radius: ['32%', '58%'],
                    center: ['50%', '50%'],
                    type: 'pie',
                    showEmptyCircle: true,
                    data:pieData,
                    itemStyle: {
                      color: function(params) {
                          return colorList[params.dataIndex]
                      },
                    },
                    z:4,
                    labelLine: {
                        normal: {
                            show: true,
                            length: 15,
                            length2: 10,
                            lineStyle: {
                                color: 'rgba(140,162,221,0.8)'
                            },
                            align: 'right'
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    label:{
                        normal:{
                            formatter: function(params){
                                var str = '';
                                str = '{a|'+params.name+'}{b|\n占比: '+params.percent.toFixed(1)+'%}{hr|}';
                                return str
                            },
                            position: 'outside',
                            fontSize: 13,
                            color: "rgba(140,162,221,0.8)",
                            rich: {
                              b:{
                                padding: [5, 0, 0, 0],
                              },
                              // hr: {
                              //     backgroundColor: 't',
                              //     borderRadius: 3,
                              //     width: 3,
                              //     height: 3,
                              //     padding: [3, 3, 0, -12],
                              // },
                            }
                        }
                    },
                },
                {
                    // radius: ['32%', '38%'],
                    radius: ['0%', '33%'],
                    center: ['50%', '50%'],
                    type: 'pie',
                    z:4,
                    label: {
                      show: false
                    },
                    labelLine: {
                      show: false
                    },
                    animation: false,
                    tooltip: {
                      show: false
                    },
                    itemStyle: {
                      // color:'rgba(0,0,0,0.2)'
                      color: "#1d2244"
                    },
                    emphasis: {
                      scale: false
                    },
                    data: [{
                        value: 1,
                    }],
                },
                {
                    radius: ['0%', '58%'],
                    center: ['50%', '50%'],
                    type: 'pie',
                    z:0,
                    label: {
                      show: false
                    },
                    labelLine: {
                      show: false
                    },
                    animation: false,
                    tooltip: {
                      show: false
                    },
                    itemStyle: {
                      color: "rgba(255, 255, 255, 0.6)",
                      borderColor: "rgba(255, 255, 255, 0.6)",
                      borderWidth: "1",
                      borderType: "solid"
                    },
                    emphasis: {
                      scale: false
                    },
                    data: [{
                        value: 1,
                    }],
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
    },
    destroyed(){
      window.removeEventListener('resize',this.echartsSize);
      if(this.myChart){
        this.myChart.dispose();
      }
    }
}
</script>

<style scoped lang="scss">
</style>