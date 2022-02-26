<template>
  <div class="hxpage col_right">
      <div class="title-view">
        <div class="title">部门100万成交数量</div>
        <router-link :to="{path:language == '中文'?'/stat/cn/departAnalysis':'/stat/en/departAnalysis',query:{type:9,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}}" tag="a" target="_blank" class="more">详情 <i class="svg-i"><svg-icon icon-class="rt-more"></svg-icon></i></router-link>
      </div>
      <div class="chart-bottom" id="DealYearsChartBot"></div>
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
        isUp:true,
        isUpNum:0,
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
      },
      year:{
        type: Number,
        default: new Date().getFullYear()
      },
    },
    watch:{
      yeardeaprtscore:{
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
      window.addEventListener('resize',this.echartsSize)
    },
    methods:{
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
        if($this.myChart){
          $this.myChart.dispose();
        }
        var maxValue = 0;
        var bgImg="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAD7CAYAAACfZT/qAAABvElEQVR4nO3coTKHURQE8GVO9wSiGUGkiJqoaSRREyVREzVNEzVREjXRE3gDj2Bu2J39rz0v8Js5d78z893vfndr/+jyDeQaALtsZJsNFPnHyADYYyNZ7XpRIAdsJGdNivghA+BQgfywEVm7nhTIMRvJiXARP2QAnCiQbzbSsbJUOREu4od0rCzVAHhQIKdsJCfCRfyQAXCmQD7ZiKxddwrknI3kRLiIHzIALhTIOxvpWFmqnAgX8UM6VpZqANwokCs2khPhIn7IALhWIK9sRNYu+hMvmV05ES7ihwyAWwXyzEY6VpYqJ8JF/JCOlaXqWClS5O8aAPcK5JGNyNpF302V7AvnRLiIHyJ54iWzS9Yu+pESyeGYnAgX8UM6VpZKcgBWcpQ3J8JF/BDJtodkA6djZalyIlzED5F8+5V8xZa1i/5zseQ36ZwIF/FDJCfVJGfuZO2iX4UyAOiXuuREuIgf0rGyVANgR4F8sJGcCBfxQyR/AUr+Z+xYWaqcCBfxQyR3FkhuX8haky82ktOuIn5Ix4of0rFSZMMRyX2Qkpsts9aE/hIkeZ3LWZMifkjv4V4qyZegXu9fZMORX+bJLjijdVnJAAAAAElFTkSuQmCC";
        var fillImg ="data:image/png;base64,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";
        let chartBotData = JSON.parse(JSON.stringify(val));
        chartBotData.forEach(item => {
          item.departname = item.departname.slice(-2);
        });
        let xAxisData = [];
        let seriesData = [];
        for(let i = 0;i<chartBotData.length;i++){
          xAxisData.push(chartBotData[i].departname);
          // seriesData.push(chartBotData[i].a_number==0?'':chartBotData[i].a_number);
           seriesData.push(chartBotData[i].a_number);
          if(chartBotData[i].a_number > maxValue){
            maxValue = chartBotData[i].a_number;
          }
        }
        var maxList = [];
        for(let i = 0;i<chartBotData.length;i++){
          maxList.push(maxValue);
        }
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('DealYearsChartBot'));
        
        // 指定图表的配置项和数据
        var option = {
          xAxis: {
            type: 'category',
            data: xAxisData,
            axisLine:{
              show:true,
              lineStyle:{
                color: "#323857",
                type: "solid"
              }
            },
            axisTick:{
              show:false,
            },
            axisLabel:{
              color:'#cccccc',
              fontSize: '13',
              padding: [3,0, 0, 0]
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
              color:'#cccccc',
              fontSize: '13',
            },
            splitLine:{
              lineStyle:{
                type: [4, 3],
                dashOffset: 3,
                color:'#e6e6e6',
                opacity:0.1,
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
            axisPointer: {
                type: 'shadow',
            },
            backgroundColor:'#fff',
            extraCssText: 'box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);',
            formatter: function (params) {
                  return `<div class="toolDiv">
                    <div class="title">${params[1].name}</div>
                    <div class="bar clearfix">
                      <span class="icon"></span>
                      <span class="name">数量：</span>
                      <div class="num">${params[1].data}</div>
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
            bottom:25,
            top:20
          },
          animation: false,
          series: [
            //背景
            {
                name: 'bg',
                type: 'pictorialBar',
                barWidth: '25',
                silent: true,
                symbol: 'image://' + bgImg,
                symbolClip: false,
                symbolBoundingData: maxValue,
                symbolSize: [25, '100%'],
                data: maxList,
                z: 1
            },
            {
                name: '数据',
                type: 'pictorialBar',
                barWidth: '25',
                barGap: '-100%',
                z: 3,
                symbol: 'image://' + fillImg,
                symbolClip:true,
                symbolBoundingData: maxValue,
                symbolSize: [25, '100%'],
                data: seriesData,
            },
            {
                name: '数据',
                type: 'pictorialBar',
                barWidth: '25',
                barGap: '-100%',
                z: 3,
                zlevel: 0,
                itemStyle: {
                    normal: {
                        color: 'transparent', //数据的间隔颜色
                    },
                },
                label: {
                    normal: {
                        show: true,
                        position: "top",
                        distance: 5,
                        textStyle: {
                            color: "#07e8d7",
                            fontSize: 13
                        }
                    }
                    
                },
                data: seriesData,
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
            // let startTime = parseTime(new Date(),'{y}') + '/01';
            // let endTime = parseTime(new Date(),'{y}') + '/12';
            let startTime = $this.year + '/01';
            let endTime = $this.year + '/12';
            if($this.language == '中文'){
              $this.$router.push({path:'/stat/cn/departAnalysis',query:{type:9,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
            }else{
              $this.$router.push({path:'/stat/en/departAnalysis',query:{type:9,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
            }
        });
      },
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
</style>