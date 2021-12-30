<template>
  <div class="hxpage">
      <div class="title-view">
        <div class="title">年度总成本</div>
        <div class="unit">（单位：万）</div>
        <router-link :to="{path:language == '中文'?'/stat/cn/departAnalysis':'/stat/en/departAnalysis',query:{type:type,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}}" tag="a" target="_blank" class="more">详情 <i class="svg-i"><svg-icon icon-class="rt-more"></svg-icon></i></router-link>
      </div>
      <div class="contrast-view">
        <div class="redtext">{{totalXpanYears}}</div>
        <div class="redright">
          <div class="conname">环比上年同期</div>
          <div class="num up" v-if="isUp"><i class="svg-i"><svg-icon icon-class="data-up" /></i>{{isUpNum.toFixed(2)}}</div>
          <div class="num down" v-else><i class="svg-i"><svg-icon icon-class="data-down" /></i>{{isUpNum.toFixed(2)}}</div>
        </div>
      </div>
      <div class="chart-top" id="CostYearsChartTop"></div>     
  </div>
</template>

<script>
import { Column,Area,Line} from '@antv/g2plot';
import {parseTime} from "@/utils";
export default {
    name:'demo',
    data(){
      return {
        isUp:true,
        isUpNum:0,
        startTime:"",
        endTime:"",
        baseDepart:"",
        contrastDepart:"",
        type:3,
      }
    },
    props:{
      language:{
        type:String,
        default:"中文"
      },
      yearsmoneytong:{
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
      yearsmoneytong:{
        handler(val,oldval){
          this.goPage();
          this.costAverageChart(val);
          this.setIsUp(val);
        },
        deep:true
      },
    },
    computed:{
      totalXpanYears(){
        let total = 0;
        for(let i = 0;i<this.yearsmoneytong.length;i++){
          total+=this.yearsmoneytong[i].money
        }
        return total.toLocaleString()
      }
    },
    created(){
    },
    methods:{
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
      //chart top
      costAverageChart(val){
        
        var $this = this;
          let chartTopData = JSON.parse(JSON.stringify(val));
          for(let i = 0;i<chartTopData.length;i++){
            chartTopData[i].date = chartTopData[i].date.slice(-2) + '月'
          }
          if($this.chartTop&&!$this.chartTop.chart.destroyed){
              $this.chartTop.changeData(chartTopData);
              return ;
          } 
          const chartTop = new Line('CostYearsChartTop', {
            data:chartTopData,
            xField: 'date',
            yField: 'money',
            xAxis: {
              grid:null,
              line:null,
              tickLine:null,
              label: {
                autoHide: true,
                autoRotate: false,
                style: {
                  fill: '#bfbfbf',
                  opacity: 1,
                  fontSize: 12,
                  lineHeight:18,
                  cursor: 'pointer'
                },
              },
            },
            yAxis: {
              grid:null,
              line:null,
              label:null
            },
            maxColumnWidth:16,
            color:'#ffc857',
            // areaStyle: () => {
            //   return {
            //     fill: '#f7d996',
            //   };
            // },
            lineStyle:{
              fill:'#ffc857',
              
            },
            meta: {
              money: {
                alias: '成本',
              },
            },
          });
          chartTop.on('axis-label:click', (args) => {
            let data = args.gEvent.delegateObject.item.name;
            let month = data.slice(0,2);
            let startTime = parseTime(new Date(),'{y}') + '/' +  month;
            let endTime = parseTime(new Date(),'{y}') + '/' + month;
            var baseDepart = "";
            var contrastDepartArr = [];
            $this.departList.forEach(function(item,index){
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
            if($this.language == '中文'){
              $this.$router.push({path:'/stat/cn/departAnalysis',query:{type:3,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
            }else{
              $this.$router.push({path:'/stat/en/departAnalysis',query:{type:3,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
            }
          }); 
          $this.chartTop = chartTop;
          chartTop.render();
        
      },
      setIsUp(val){
        let newXpanYears = 0;
        let oldXpanYears = 0;
        for(let i = 0;i<val.length;i++){
          oldXpanYears+=val[i].lastmoney;
          newXpanYears+=val[i].money
        }
        if(newXpanYears>=oldXpanYears){
          this.isUp = true;
          this.isUpNum = newXpanYears - oldXpanYears
        }else{
          this.isUp = false;
          this.isUpNum = oldXpanYears - newXpanYears
        }
      },
    }
}
</script>
<style scoped lang="scss">
</style>