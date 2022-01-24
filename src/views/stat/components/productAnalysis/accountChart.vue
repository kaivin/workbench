<template>
    <div class="proAccountBox AccountBox">
        <p class="proAccountTit">{{accountArr.currentName}}</p>
        <div class="proAccountItem flex-box">
                <div class="proAccountItemFl flex-content">
                     <div class="Chartpie" :id="'pie-'+accountArr.currentTag" style="width:198px;height:198px"></div>
                </div>
                <div class="proAccountItemFr"> 
                  <el-table
                      :data="accountArr.itemArr"
                      border
                      style="width: 100%">
                      <el-table-column
                          prop="ranking"
                          width="60"
                          align="center"
                          label="排名">
                        <template slot-scope="scope">
                            <span class="rank" :style="'background:'+scope.row.color">{{scope.row.ranking}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                          prop="departname"
                          align="center"
                          min-width="70"
                          v-if="contrastTag=='productCont'"
                          label="产品">
                        <template slot-scope="scope">
                            <span class="depart">{{scope.row.departname}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                          prop="name"
                          align="center"
                          min-width="70"
                          v-if="contrastTag=='timeCont'"
                          label="时间">
                        <template slot-scope="scope">
                            <span class="depart">{{scope.row.name}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                          prop="departname"
                          align="center"
                          min-width="70"
                          v-if="contrastTag=='overview'||contrastTag=='departCont'"
                          label="部门">
                        <template slot-scope="scope">
                            <a href="#pro_user">
                              <span class="depart" @click="departClick(scope.row.departname,accountArr.currentTag)">{{scope.row.departname}}</span>
                            </a>
                        </template>
                      </el-table-column>
                      <el-table-column
                          prop="number"
                          v-if="accountArr.currentTag=='enquirie'"
                          align="center"
                          width="60"
                          label="个数">
                          <template  slot-scope="scope">
                            <a href="#pro_user">
                              <span class="number" @click="departClick(scope.row.departname,accountArr.currentTag)">{{scope.row.number}}</span>
                            </a>
                          </template>
                      </el-table-column>
                      <el-table-column
                          prop="score"
                          v-if="accountArr.currentTag=='score'"
                          align="center"
                          width="60"
                          label="积分">
                          <template  slot-scope="scope">
                            <a href="#pro_user">
                              <span class="number" @click="departClick(scope.row.departname,accountArr.currentTag)">{{scope.row.number}}</span>
                            </a>
                          </template>
                      </el-table-column>
                      <el-table-column
                          prop="percent"
                          align="center"
                          width="90"
                          label="占比">
                      </el-table-column>
                  </el-table>
                </div>
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts';
export default {
  name: "accountChart",
  props: {
    accountArr:{
      type: Object,
      default: function () {
        return {};
      },
    },
    contrastTag:{
      type: String,
      default: "",
    }
  },
  data() {
    return {
        myChart:null,
    };
  },
  destroyed(){
    window.removeEventListener('resize',this.echartsSize);
    if(this.myChart){
        this.myChart.dispose();
    }
  },
  mounted(){
    window.addEventListener('resize',this.echartsSize);
    this.drawPieChart();
  },
  methods: {
    // 占比图例
    drawPieChart(){
      var $this = this;
      var chartDom = document.getElementById('pie-'+$this.accountArr.currentTag);
      var myChart = echarts.init(chartDom);
      let echartData=[];
      let echartColor=[];
      $this.accountArr.itemArr.forEach(function(item,index){
        var itemObj={};
        itemObj.name=item.name;
        itemObj.value=item.number;
        echartData.push(itemObj);
        var colorObj={};
        colorObj.x=0;
        colorObj.y=0;
        colorObj.x2=0;
        colorObj.y2=1;
        colorObj.colorStops=[];
        var colorOne={};
        colorOne.offset=0;
        colorOne.color=item.color;            
        colorObj.colorStops.push(colorOne);
        var colorTwo={};
        colorTwo.offset=1;
        colorTwo.color=item.color;
        colorObj.colorStops.push(colorTwo);
        echartColor.push(colorObj);
      });
        var option;
        option = {
            title:{
                text:$this.accountArr.totalNum,
                subtext:$this.accountArr.totalNumName,
                textStyle:{
                    fontSize:20,
                    color:"#252525",
                    fontWeight:'400',
                    lineHeight:1,
                },
                subtextStyle: {
                    fontSize: 14,
                    color: '#252525',
                    fontWeight:'400',
                    lineHeight:1,
                },
                textAlign:"center",
                x: '48%',
                y: '43%',
                itemGap:0
            },
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    color:echartColor,
                    type: 'pie',
                    radius: ['60%', '90%'],
                    avoidLabelOverlap: false,
                    label: {
                      show: false,
                    },
                    emphasis: {
                      label: {
                        show: false,
                      }
                    },
                    itemStyle: {
                        normal: {
                            borderColor: '#ffffff',
                            borderWidth:1,
                        }
                    },
                    labelLine: {
                      show: false
                    },
                    data:echartData
                }
            ]
        };
        option && myChart.setOption(option);
        $this.myChart = myChart;
    },
    departClick(name,tag){
      this.$emit("departchange", name, tag);
    },
    echartsSize(){
        if(this.myChart){
            this.myChart.resize();
        }
    }
  }
}
</script>



