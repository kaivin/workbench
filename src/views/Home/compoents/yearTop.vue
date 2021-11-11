<template>
  <div class="rowFourTwo flex-content" v-if="currentCluesData.yearuserscoreNum&&currentCluesData.yearuserscoreNum.length>0">                    
                    <div class="itemRowTit">
                         <h3>年度成交Top5</h3>
                         <span>(单位：分)</span>
                    </div>
                    <ul class="rowFourTwoUl">
                        <li class="flex-box flex-wrap" v-for="(item,index) in currentCluesData.yearuserscoreNum" :key='index'>
                             <div class="rowFourTwoUlNum">
                                <p v-if="item.headimg"><img v-bind:src="item.headimg" alt=""></p>
                                <p v-else><img src="../../../assets/clinchIcon01.png" alt=""></p>
                                <span>TOP{{index+1}}</span>
                             </div>
                             <p class="rowFourTwoUlName">
                                {{item.username}}
                                <span>{{item.groupname}}</span>
                             </p>
                             <div class="rowFourTwoUlPercen flex-content">
                                  <p class="percenBom flex-wrap" :style="'width:'+item.Percen">
                                     <span class="rowFourline"><i></i></span>
                                     <span class="rowFourtext flex-content">{{item.number}}</span>
                                  </p>
                             </div>
                             <div class="rowFourTwoUlScore">
                                  <p v-if="item.anumber>0">
                                      <span class="ScoreTop"><span>{{item.anumber}}</span></span>
                                      <span class="ScoreBom">百万成交</span>
                                  </p>
                             </div>
                             <div class="rowFourTwoUlarea">
                                <div :id="`yearuserChart${index}`" class="chart-canva"></div>
                             </div>
                        </li>
                    </ul>
               </div>
</template>

<script>
import { Area} from '@antv/g2plot';
export default {
    name:'demo',
    data(){
        return {

        }
    },
    props:{
        currentCluesData:{
            type:Object,
            default:function(){
                return {}
            }
        }
    },
    created(){

    },
    methods:{
// 中文年度成交Top5
    yearuserChart(){
      var $this = this;
      if($this.useryearChart&&!$this.useryearChart.chart.destroyed){
        $this.currentCluesData.yearuserscoreNum.forEach(function(item,index){
            $this.useryearChart.changeData(item.children);
        })
      }else{
        $this.currentCluesData.yearuserscoreNum.forEach(function(item,index){
          if(item.children&&item.children.length>0){
            const yearuserChart = new Area(`yearuserChart${index}`, {
              data:item.children, 
              xField: 'mtime',
              yField: 'number',
              padding:5,
              appendPadding:0,
              limitInPlot:false,
              xAxis:false,
              yAxis:false,
              line:false,
              height:44,
              tooltip: {
                formatter: (datum) => {
                  return { name:'年度月成交分', value: datum.number };
                },
              },
              areaStyle: () => {
                return {
                  fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
                };
              },
            });
            $this.useryearChart=yearuserChart;
            yearuserChart.render();
          }
        });
      }
    },
    }
}
</script>

<style>

</style>