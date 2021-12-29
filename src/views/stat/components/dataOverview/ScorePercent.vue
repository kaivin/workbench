<template>
  <div class="hxpage btm_shadow">
      <div class="title-view">
        <div class="title">部门成交占比{{type == 0?'（积分+占比）':'（个数+占比）'}}</div>
        <router-link :to="{path:language == '中文'?'/stat/cn/departAnalysis':'/stat/en/departAnalysis',query:{type:2,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}}" tag="a" target="_blank" class="more">详情 <i class="svg-i"><svg-icon icon-class="rt-more"></svg-icon></i></router-link>
      </div>
      <div class="chart-bottom scale-panel" id="ScoreYearsChartBot"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import 'echarts-gl';
import {parseTime} from "@/utils";
import { mapGetters } from 'vuex'
export default {
    name:'demo',
    data(){
      return {
        type:0,
        isUp:true,
        isUpNum:0,
        totalXpanYears:0,
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
    computed:{
      ...mapGetters([
        'sidebar',
      ]),
      isCollapse() {
        return this.sidebar.opened
      }
    },
    watch:{
      type:function(newval,oldval){
        this.drawPie3D();
      },
      yeardeaprtscore:{
        handler(newval,oldval){
          this.goPage();
          this.drawPie3D();
        },
        deep:true
      },
      isCollapse(){
        setTimeout(() => {
          this.echartsSize();
        }, 200)
      }
    },
    methods:{
      changeType(val){
        this.type = val;
      },
      setChartBottom(val){
        var $this = this;
        let chartBotData = [];
        if(this.type == 0){
          chartBotData = JSON.parse(JSON.stringify(this.yeardeaprtscore));
        }else{
          chartBotData = JSON.parse(JSON.stringify(this.yearscorenumbercount));
        }
        var chartDom = document.getElementById('ScoreYearsChartBot');
        var myChart = echarts.init(chartDom);
        var option;
        var $this = this;

        var  colorList=['#3a72ff', '#1bd7ff', '#ff395d', '#ffcd6a', '#f1bb4c', "rgba(250,250,250,0.5)"];
        option = {
            grid: {
                top: '-5%',
                bottom: 0,
                left: '-15%',
                right: '-15%',
                containLabel: true,
            },
            tooltip: {
              trigger: 'item',
              formatter: (params) => {
                   if(this.type == 0){
                      var text = `${params.data.departname}<br/>
                      <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                          params.color
                      };"></span>积分：${params.data.score}`;
                      return text;
                   }else{
                     var text = `${params.data.departname}<br/>
                      <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                          params.color
                      };"></span>个数：${params.data.score}`;
                      return text;
                   }
              },
            },
            dataset:{
                source: chartBotData
            },
            series: [
                {
                    radius: ['32%', '62%'],
                    center: ['48%', '54%'],
                    type: 'pie',
                    showEmptyCircle: true,
                    itemStyle: {
                      color: function(params) {
                          return colorList[params.dataIndex]
                      }
                    },
                    z:2,
                    label:{
                      show:false,
                    },
                    labelLine:{
                      show:false
                    }
                },
                {
                    radius: ['32%', '62%'],
                    center: ['48%', '54%'],
                    type: 'pie',
                    showEmptyCircle: true,
                    itemStyle: {
                      color: {
                        type: 'radial',
                        x: 0.5,
                        y: 0.5,
                        r: 0.5,
                        colorStops: [{
                            offset: .4, color: 'rgba(255,255,255,.2)' // 0% 处的颜色
                        }, {
                            offset: 1, color:  'rgba(0,0,0,.2)' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                      }
                      // color: {
                      //   type: 'linear',
                      //   x: 1,
                      //   y: 1,
                      //   x2: 0,
                      //   y2: 0,
                      //   colorStops: [{
                      //       offset: .2, color: 'rgba(0,0,0,.2)' // 0% 处的颜色
                      //   }, {
                      //       offset: .5, color:  'rgba(255,255,255,.2)' // 100% 处的颜色
                      //   },{
                      //       offset: .8, color:  'rgba(0,0,0,.2)' // 100% 处的颜色
                      //   }],
                      //   global: false // 缺省为 false
                      // }
                    },
                    z:3,
                    label:{
                      show:false,
                    },
                    labelLine:{
                      show:false
                    }
                },
                {
                    radius: ['35%', '62%'],
                    center: ['50%', '50%'],
                    type: 'pie',
                    showEmptyCircle: true,
                    itemStyle: {
                        normal: {
                            color: function(params) {
                                return colorList[params.dataIndex]
                            }
                        }
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
                                str = '{a|'+params.name+'}'+'{b|\n占比: '+params.percent.toFixed(1)+'%}';
                                return str
                            },
                            fontSize: 13,
                            color: "rgba(140,162,221,0.8)",
                            rich: {
                              b:{
                                padding: [5, 0, 0, 0],
                              }
                            }
                        }
                    },
                    labelLayout:{
                        verticalAlign:"top"
                    }
                },
            ]
        };
        option && myChart.setOption(option);
        $this.myChart = myChart;
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
      },
      // 3D环状图
      drawPie3D(){
        var $this = this;
        var myChart = echarts.init(document.getElementById('ScoreYearsChartBot'));
        var colorList=['#3a72ff', '#1bd7ff', '#ff395d', '#ffcd6a', '#f1bb4c'];
        let chartBotData = [];
        if(this.type == 0){
          chartBotData = JSON.parse(JSON.stringify(this.yeardeaprtscore));
        }else{
          chartBotData = JSON.parse(JSON.stringify(this.yearscorenumbercount));
        }
        console.log(chartBotData,"3D环")
        var pieData = []
        var totalScore = 0;
        chartBotData.forEach(function(item,index){
          var itemData = {};
          itemData.name = item.departname;
          itemData.score = item.score;
          totalScore += item.score;
          itemData.itemStyle = {};
          itemData.itemStyle.color = colorList[index];
          itemData.itemStyle.opacity = 1;
          pieData.push(itemData);
        })
        pieData.forEach(function(item){
          item.value = item.score==0||totalScore==0?0:parseInt(item.score/totalScore*100);
        });
        console.log(pieData)
        var option = $this.getPie3D(pieData, 0.6);
        option && myChart.setOption(option);
        $this.myChart = myChart;
        // 监听鼠标事件，实现饼图选中效果（单选），近似实现高亮（放大）效果。
        let selectedIndex = '';
        let hoveredIndex = '';
        // 监听点击事件，实现选中效果（单选）
        $this.myChart.on('click', function(params) {
            // 从 option.series 中读取重新渲染扇形所需的参数，将是否选中取反。
            let isSelected = !option.series[params.seriesIndex].pieStatus.selected;
            let isHovered = option.series[params.seriesIndex].pieStatus.hovered;
            let k = option.series[params.seriesIndex].pieStatus.k;
            let startRatio = option.series[params.seriesIndex].pieData.startRatio;
            let endRatio = option.series[params.seriesIndex].pieData.endRatio;
            // 如果之前选中过其他扇形，将其取消选中（对 option 更新）
            if (selectedIndex !== '' && selectedIndex !== params.seriesIndex) {
                option.series[selectedIndex].parametricEquation = $this.getParametricEquation(option.series[selectedIndex].pieData.startRatio, option.series[selectedIndex].pieData.endRatio, false, false, k, option.series[selectedIndex].pieData.value);
                option.series[selectedIndex].pieStatus.selected = false;
            }
            // 对当前点击的扇形，执行选中/取消选中操作（对 option 更新）
            option.series[params.seriesIndex].parametricEquation = $this.getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, option.series[selectedIndex].pieData.value);
            option.series[params.seriesIndex].pieStatus.selected = isSelected;
            // 如果本次是选中操作，记录上次选中的扇形对应的系列号 seriesIndex
            isSelected ? selectedIndex = params.seriesIndex : null;
            // 使用更新后的 option，渲染图表
            $this.myChart.setOption(option);
        });
        // 监听 mouseover，近似实现高亮（放大）效果
        $this.myChart.on('mouseover', function(params) {
            // 准备重新渲染扇形所需的参数
            let isSelected;
            let isHovered;
            let startRatio;
            let endRatio;
            let k;
            // 如果触发 mouseover 的扇形当前已高亮，则不做操作
            if (hoveredIndex === params.seriesIndex) {
                return;
                // 否则进行高亮及必要的取消高亮操作
            } else {
                // 如果当前有高亮的扇形，取消其高亮状态（对 option 更新）
                if (hoveredIndex !== '') {
                    // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 false。
                    isSelected = option.series[hoveredIndex].pieStatus.selected;
                    isHovered = false;
                    startRatio = option.series[hoveredIndex].pieData.startRatio;
                    endRatio = option.series[hoveredIndex].pieData.endRatio;
                    k = option.series[hoveredIndex].pieStatus.k;

                    // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
                    option.series[hoveredIndex].parametricEquation = $this.getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, option.series[hoveredIndex].pieData.value);
                    option.series[hoveredIndex].pieStatus.hovered = isHovered;

                    // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
                    hoveredIndex = '';
                }
                // 如果触发 mouseover 的扇形不是透明圆环，将其高亮（对 option 更新）
                if (params.seriesName !== 'mouseoutSeries') {
                    // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
                    isSelected = option.series[params.seriesIndex].pieStatus.selected;
                    isHovered = true;
                    startRatio = option.series[params.seriesIndex].pieData.startRatio;
                    endRatio = option.series[params.seriesIndex].pieData.endRatio;
                    k = option.series[params.seriesIndex].pieStatus.k;

                    // 对当前点击的扇形，执行高亮操作（对 option 更新）
                    option.series[params.seriesIndex].parametricEquation = $this.getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, option.series[params.seriesIndex].pieData.value + 5);
                    option.series[params.seriesIndex].pieStatus.hovered = isHovered;

                    // 记录上次高亮的扇形对应的系列号 seriesIndex
                    hoveredIndex = params.seriesIndex;
                }

                // 使用更新后的 option，渲染图表
                $this.myChart.setOption(option);
            }
        });
        // 修正取消高亮失败的 bug
        $this.myChart.on('globalout', function() {
            if (hoveredIndex !== '') {
                // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
                isSelected = option.series[hoveredIndex].pieStatus.selected;
                isHovered = false;
                k = option.series[hoveredIndex].pieStatus.k;
                startRatio = option.series[hoveredIndex].pieData.startRatio;
                endRatio = option.series[hoveredIndex].pieData.endRatio;
                // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
                option.series[hoveredIndex].parametricEquation = $this.getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, option.series[hoveredIndex].pieData.value);
                option.series[hoveredIndex].pieStatus.hovered = isHovered;

                // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
                hoveredIndex = '';
            }
            // 使用更新后的 option，渲染图表
            $this.myChart.setOption(option);
        });
      },
      // 生成模拟 3D 饼图的配置项
      getPie3D(pieData, internalDiameterRatio) {
        var $this = this;
        let series = [];
        let sumValue = 0;
        let startValue = 0;
        let endValue = 0;
        let legendData = [];
        let k = typeof internalDiameterRatio !== 'undefined' ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio) : 1 / 3;
        // 为每一个饼图数据，生成一个 series-surface 配置
        for (let i = 0; i < pieData.length; i++) {
            sumValue += pieData[i].value;
            let seriesItem = {
                name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
                type: 'surface',
                parametric: true,
                wireframe: {
                    show: false
                },
                pieData: pieData[i],
                pieStatus: {
                    selected: false,
                    hovered: false,
                    k: k
                },
            };
            if (typeof pieData[i].itemStyle != 'undefined') {
                let itemStyle = {};
                typeof pieData[i].itemStyle.color != 'undefined' ? itemStyle.color = pieData[i].itemStyle.color : null;
                typeof pieData[i].itemStyle.opacity != 'undefined' ? itemStyle.opacity = pieData[i].itemStyle.opacity : null;
                seriesItem.itemStyle = itemStyle;
            }
            series.push(seriesItem);
        }
        // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
        // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
        for (let i = 0; i < series.length; i++) {
            endValue = startValue + series[i].pieData.value;
            series[i].pieData.startRatio = startValue / sumValue;
            series[i].pieData.endRatio = endValue / sumValue;
            series[i].parametricEquation = $this.getParametricEquation(series[i].pieData.startRatio, series[i].pieData.endRatio, false, false, k, series[i].pieData.value);
            startValue = endValue;
            legendData.push(series[i].name);
        }
        // 补充一个透明的圆环，用于支撑高亮功能的近似实现。
        series.push({
            name: 'mouseoutSeries',
            type: 'surface',
            parametric: true,
            wireframe: {
                show: false
            },
            itemStyle: {
                opacity: 0
            },
            parametricEquation: {
              u: {
                  min: 0,
                  max: Math.PI * 2,
                  step: Math.PI / 20
              },
              v: {
                  min: 0,
                  max: Math.PI,
                  step: Math.PI / 20
              },
              x: function(u, v) {
                  return Math.sin(v) * Math.sin(u) + Math.sin(u);
              },
              y: function(u, v) {
                  return Math.sin(v) * Math.cos(u) + Math.cos(u);
              },
              z: function(u, v) {
                  return Math.cos(v) > 0 ? 0.1 : -0.1;
              }
            }
        });
        // 准备待返回的配置项，把准备好的 legendData、series 传入。
        let option = {
            //animation: false,
            legend: {
              show:false,
              data: legendData
            },
            tooltip: {
              formatter: params => {
                if (params.seriesName !== 'mouseoutSeries') {
                  console.log(pieData)
                  var score = 0;
                  var percent = 0;
                  pieData.forEach(function(item){
                    if(item.name==params.seriesName){
                      score = item.score;
                      percent = item.value+"%";
                    }
                  });
                  console.log(params)
                  var text = `${params.seriesName}<br/>
                    <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                        params.color
                    };"></span>积分：${score}<br/>
                    <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                        params.color
                    };"></span>占比：${percent}`;
                  return text;
                }
              }
            },
            xAxis3D: {
                min: -1,
                max: 1
            },
            yAxis3D: {
                min: -1,
                max: 1
            },
            zAxis3D: {
                min: -1,
                max: 1
            },
            grid3D: {
                show: false,
                boxHeight: 16,
                viewControl: {//3d效果可以放大、旋转等，请自己去查看官方配置
                    alpha: 30,
                    // beta: 90,
                    rotateSensitivity: 0,
                    zoomSensitivity: 0,
                    panSensitivity: 0,
                    autoRotate: false
                },
                //后处理特效可以为画面添加高光、景深、环境光遮蔽（SSAO）、调色等效果。可以让整个画面更富有质感。
                postEffect: {//配置这项会出现锯齿，请自己去查看官方配置有办法解决 
                    enable: true,
                    bloom: {
                        enable: true,
                        bloomIntensity: 0.5
                    },
                    SSAO: {
                        enable: true,
                        quality: 'medium',
                        radius: 2
                    }
                }
            },
            series: series
        };
        return option;
      },
      // 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
      getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, h) {
        // 计算
        let midRatio = (startRatio + endRatio) / 2;
        let startRadian = startRatio * Math.PI * 2;
        let endRadian = endRatio * Math.PI * 2;
        let midRadian = midRatio * Math.PI * 2;
        // 如果只有一个扇形，则不实现选中效果。
        if (startRatio === 0 && endRatio === 1) {
            isSelected = false;
        }
        // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
        k = typeof k !== 'undefined' ? k : 1 / 3;
        // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
        let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
        let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;
        // 计算高亮效果的放大比例（未高亮，则比例为 1）
        let hoverRate = isHovered ? 1.05 : 1;
        // 返回曲面参数方程
        return {
            u: {
                min: -Math.PI,
                max: Math.PI * 3,
                step: Math.PI / 32
            },
            v: {
                min: 0,
                max: Math.PI * 2,
                step: Math.PI / 20
            },
            x: function(u, v) {
                if (u < startRadian) {
                    return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
                }
                if (u > endRadian) {
                    return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
                }
                return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
            },
            y: function(u, v) {
                if (u < startRadian) {
                    return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
                }
                if (u > endRadian) {
                    return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
                }
                return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
            },
            z: function(u, v) {
                if (u < -Math.PI * 0.5) {
                    return Math.sin(u);
                }
                if (u > Math.PI * 2.5) {
				          return Math.sin(u);
                }
			          return Math.sin(v) > 0 ? 1 : -1;
            }
        };
      }
    }
}
</script>

<style scoped lang="scss">
</style>