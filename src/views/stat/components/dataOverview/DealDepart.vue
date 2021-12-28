<template>
  <div class="hxpage">
      <div class="title-view">
        <div class="title">部门100万成交数量</div>
      </div>
      <div class="chart-bottom" id="DealYearsChartBot"></div>
  </div>
</template>

<script>
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
      yeardeaprtscore:{
        handler(val,oldval){
          this.setChartBottom(val)
        },
        deep:true
      }
    },
    computed:{
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
        var maxValue = 0;;
        var bgImg="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAF+CAYAAADNzDlVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAilJREFUeNrs1rENwjAURdEfC0pmQAwBDfuwE8wDDSULIGagTGEcFNHQpfPXseT0V0ryzrA/XzcRsWt3HX2fsd1XSRITc8O2JIn5RZVIdsr87mU54xT0TBL1/Sms2uPd7qPXivvp+PfKpfuGBAkStPxMf7muLXe43FiO5ViO5VjOsAoSxHIsx3Isx3Isx3KGVZAglmM5lmM5lmM5liMFQYJYjuVYjuVYjuVYTpAgQSzHcizHcizHcoZVkCCWYzmWYzmWYzmWM6yCBLEcy7Ecy7Ecy7GcIEGCWI7lWI7lWI7lDKsgQYJYjuVYjuVYjuUMqyBBLMdyLMdyLMdyLGdYBQliOZZjOZZjOZZjOUGCBLEcy7Ecy7EcyxlWQYJYjuVYjuVYjuVYzrAKEsRyLMdyLMdyLMdypCBIEMuxHMuxHMuxnGEVJEgQy7Ecy7Ecy7GcYRUkiOVYjuVYjuVYjuUMqyBBLMdyLMdyLMdyLCdIkCCWYzmWYzmWYznDKkgQy7Ecy7Ecy7EcyxlWQYJYjuVYjuVYjuVYjhQECWI5lmM5lmM5ljOsggQJYjmWYzmWYzmWM6yCBLEcy7Ecy7Ecy7GcYRUkiOVYjuVYjuVYjuUECRLEcizHcizHcixnWAUJYjmWYzmWYzmWYznDKkgQy7Ecy7Ecy7Ecy5GCIEEsx3Isx3Isx3IsJ0iQIJZjOZZjOZZjOcMqSBDLsRzLsRzL9Wy5odZqhwQJWn4+AgwApGqd0LftHcgAAAAASUVORK5CYII=";
        var fillImg ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAF+CAYAAADNzDlVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABFhJREFUeNrs3U+O1DgUgHHblUFzhb7GCCHNtnfMFUasOA9HYEWfAQlpZq6AEOIIdPcFZgMVe5L6Q6pLzQjFLZK2fpZSKbVioQ8n9b68+Dnxz39fXYYYrkIIF+Fxt5the5kagQkHhtepEZhvUCk01tLh3Gul3aZQwovxSwMwn8cfhW74+Lul66jJawgQIEB1QJfDdj1s5ZFvI8NzLsfluByX43KAlmzjKRdyTkYIEJeb6XK5JC7H5bhchculmLmcOASoAqjPGyMEiMtVuFyMhctxOS5X4XKlRC4nDgECBIjLLeVyXSnpqhQux+W43FyXi/Jy4hCgKqC+74wQIC5XkZdLKcvLcTkuV+FyOScuJw4Bmt/MlwPE5WprH4LaBy7H5WpcbvjgcuIQIECAuByXe0iXy4eJtOONXilx2NJh238PIYbpmPP9qvpc7O5YU+r351/KB9hyAl7C3WPO9+vqs3O5hkZocrn9H+PJwdP3Y87h/n9sNX24HKBFgLaesQLiclUul9Q+yMvJy1Xl5bLaB3EIUE3biVzvGSsgLjfb5Yb7ci7H5bhchcvFWLicOAQIECAux+W43P1QXcmpuWuotbyc2gdxCFBF29c+FHk5QFzOfDl5OS63jMsFtQ/iECBAgLgcl+Ny34PqcoMrot+cFkzEWIbtuN9/H0/R/yuyWFGf2zR8vBiLIHa5hTsFE3FGkcWifT4Pey63fqDt9hemsOYWSylGaM2t++P6zWUjS7KNuZGX1pdbO5S83Mqb9eXEIUC1gfV4r2GEAP08IHk5LsfluNzkcsEzVnEIULXLFS4HiMvNdrnh+uFyXI7LVbhcTN7hJQ4BqnU5eTlAXG6+y/XbjstxOS5X4XJ93nA5cQhQrcupYwXE5Wa7XLRWMJfjclUuV6wVLA4BAgSIyy3ncl0p6aoULsfluNxcl4vRM1ZxCBAgQFxuybWC25ov1+Wc2nK543tOj/tpeYxpOz9mzX3GERpd7uI4PWZcGuO8Hf82vSr07n5FfW7TZrPlcuIQoAqgL19+NUKAuFyFyw1xyDPWVbtci9dQY/Pl+o7LiUOA5rdD7cPGCAHicubLcTkut4jLmS8nDgF6CJdT+wCIy3kfK5fjcsu43HA/xOXEIUCVLnffhAYjBIjL/ZjLZevLcTkuV+Vyyfpy4hCgKqCvX58YIUBcbr7Lxd8/vb1u6Gf7hstxuZ/tcp6xikOAAAHicubLPYz2BHk5LsfluJzA+tja7hlrr/YBEJeb63Lx2cd38nJcjstVuFyyvpw4BAgQIC7H5bgcl3u0Lpd77/AShwBVNGuSAOJylS739MNf7blcSv1+uFI+LFmbT5avzbv/gOmY8/2q+lzc+ZWbqvZPK76OS9duvrNfV5/2XG4YMS4nDgECBIjLcbmHdLmGzjh5OS7H5cShxoGsLweIy1W63G/v/+FyXI7LVbic+XLiECBAgLgcl+NyXI7LrcXlYilFHAIEaH77T4ABAKzsRPWz+TQ7AAAAAElFTkSuQmCCgg";
        let chartBotData = JSON.parse(JSON.stringify(val));
        chartBotData.forEach(item => {
          item.departname = item.departname.slice(-2);
        });
        let xAxisData = [];
        let seriesData = [];
        for(let i = 0;i<chartBotData.length;i++){
          xAxisData.push(chartBotData[i].departname);
          seriesData.push(chartBotData[i].a_number==0?'':chartBotData[i].a_number);
          if(chartBotData[i].a_number > maxValue){
            chartBotData[i].a_number = maxValue
          }
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
              color:'#cccccc',
              fontSize: '13'
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
            //背景
            {
                name: 'bg',
                type: 'pictorialBar',
                barWidth: '45%',
                silent: true,
                symbol: 'image://' + bgImg,
                symbolClip: false,
                symbolBoundingData: maxValue,
                symbolSize: [52, '100%'],
                data: seriesData,
            },
            {
                name: '数据',
                type: 'pictorialBar',
                barWidth: '45%',
                barGap: '-100%',
                z: 1,
                symbol: 'image://' + fillImg,
                symbolClip:true,
                symbolBoundingData: maxValue,
                symbolSize: [52, '100%'],
                data: seriesData,
            },
            {
                name: '数据',
                type: 'pictorialBar',
                barWidth: '45%',
                barGap: '-100%',
                z: 1,
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
                        distance: 20,
                        formatter: function(params) {
                            var stuNum = 0;
                            seriesData.forEach(function(value, index, array) {
                                if (params.name == value.departname) {
                                    stuNum = value.a_number;
                                }
                            })
                            return stuNum;
                        },
                        textStyle: {
                            color: "#ffc72b",
                            fontSize: 20
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
            let startTime = parseTime(new Date(),'{y}') + '/01';
            let endTime = parseTime(new Date(),'{y}') + '/12' 
            if($this.language == '中文'){
              $this.$router.push({path:'/stat/cn/departAnalysis',query:{type:9,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
            }else{
              $this.$router.push({path:'/stat/en/departAnalysis',query:{type:9,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
            }
        });
      },
      // 原图表
      setChartBottom2(val){
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
</style>