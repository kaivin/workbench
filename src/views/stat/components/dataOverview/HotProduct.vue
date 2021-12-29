<template>
  <div class="hxpage btm_prochart">
      <div class="title-view">
        <div class="title">热门产品TOP10<span v-if="type==1">（单位：个）</span><span v-if="type==2">（单位：分）</span></div>
        <router-link :to="{path:language == '中文'?'/stat/cn/departAnalysis':'/stat/en/departAnalysis',query:{type:6,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}}" tag="a" target="_blank" class="more">更多分析 <i class="svg-i"><svg-icon icon-class="rt-more"></svg-icon></i></router-link>
        <div class="btn-group">
          <div @click="changeType(1)" class="btn-item" :class="type == 1?'active':''">询盘</div>
          <div @click="changeType(2)" class="btn-item" :class="type == 2?'active':''">成交</div>
        </div>
      </div>
      <div class="chart-bottom" id="HotProductChart"></div>
      <div class="product_list" v-if="type==1">
          <div class="product_item" v-for="(item,index) in productxuntop10" :key="index">
            <div class="pro_img">
              <img :src="item.pimg" :alt="item.productname" >
            </div>
            <div class="pro_name">
                {{item.productname.slice(0,6)}}
            </div>
          </div>
      </div>
      <div class="product_list" v-if="type==2">
          <div class="product_item" v-for="(item,index) in productscoretop10" :key="index">
            <div class="pro_img">
              <img :src="item.pimg" :alt="item.xunproduct" >
            </div>
            <div class="pro_name">
                {{item.xunproduct.slice(0,6)}}
            </div>
          </div>
      </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { mapGetters } from 'vuex'
export default {
    name:'demo',
    data(){
      return {
        type: 1,
        myChart:null,
        startTime:"",
        endTime:"",
        baseDepart:"",
        contrastDepart:"",
      }
    },
    props:{
      productscoretop10:{
        type:Array,
        default:function(){
          return []
        }
      },
      productxuntop10:{
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
      language:{
        type:String,
        default:"中文"
      },
    },
    watch:{
      type:function(val,oldval){
        this.setChartBottom()
      },
      productxuntop10:{
        handler(val,oldval){
          this.goPage();
          this.setChartBottom()
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
      changeType(val){
        this.type = val;
      },
      setChartBottom(){
        var $this = this;
        let chartBotData = [];
        let xAxisData = [];
        let seriesData = [];
        if($this.type == 1){
            chartBotData = JSON.parse(JSON.stringify($this.productxuntop10));
            for(let i = 0;i<chartBotData.length;i++){
                xAxisData.push(chartBotData[i].productname);
                seriesData.push(chartBotData[i].number);
            }
        }else if($this.type == 2){
            chartBotData = JSON.parse(JSON.stringify($this.productscoretop10));
            for(let i = 0;i<chartBotData.length;i++){
                xAxisData.push(chartBotData[i].xunproduct);
                seriesData.push(chartBotData[i].score);
            }
        }
        
        var chartDom = document.getElementById('HotProductChart');
        var myChart = echarts.init(chartDom);
        var option = {
            tooltip:{
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                },
            },
            grid: {
                left: '50',
                right: '0',
                bottom: '3%',
                top: '20',
                containLabel: true
            },
            xAxis: {
                type: "category",
                data: xAxisData,
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: true
                },
                axisLabel: {
                    show: false,
                    rotate: 0,
                    interval: 0,
                    textStyle: {
                        padding: [2,0,0,0],
                        fontSize: 12,
                        color: "#333"
                    }
                },
                splitLine:{
                    show: true,
                    lineStyle:{
                        type: [4, 3],
                        dashOffset: 3,
                        color: '#ebebeb',
                        opacity: 0.1,
                        shadowColor: null,
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                    }
                },
            },
            yAxis: {
                name: "",
                type: "value",
                triggerEvent: true,
                splitLine:{
                    lineStyle:{
                        type: [4, 3],
                        dashOffset: 3,
                        color: '#ebebeb',
                        opacity: 0.1,
                        shadowColor: null,
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(230,230,230,.1)'
                    }
                },
                axisLabel: {
                    show: true,
                    color: "#ccc",
                    fontSize: 13,
                    inside:true,        // 标签刻度朝内
                    margin:0,           // 清除默认间距
                    padding:[0,10,0,0], // 右边内边距10
                    textStyle:{
                        align:'right'   // 文字右对齐
                    }
                }
            },
            series: [
                {
                    name: $this.type == 1 ? "个数" : "积分",
                    barMinHeight: 10,
                    type: "pictorialBar",
                    barCategoryGap: "50%",
                    symbol: "path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z",
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: "#24a5ff"
                                },
                                {
                                    offset: 0.5,
                                    color: "#54ddf7"
                                },
                                {
                                    offset: 1,
                                    color: "#70fcf3"
                                }
                            ])
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: "top",
                            textStyle: {
                                color: "#ccc",
                                fontSize:13
                            },
                            distance: 5,
                        }
                    },
                    z: 10,
                    data: seriesData
                }
            ]
        };
        
        this.myChart = myChart;
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        this.echartsResize = this.myChart.resize();
      },

      echartsSize(){
        if(this.myChart){
          this.myChart.resize();
        }
      },
      goPage(){
        var $this = this;
        var newDate = new Date();
        var newYear = newDate.getFullYear();
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