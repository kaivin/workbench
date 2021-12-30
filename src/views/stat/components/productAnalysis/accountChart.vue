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
                            <span class="depart">{{scope.row.departname}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                          prop="number"
                          v-if="accountArr.currentTag=='enquirie'"
                          align="center"
                          width="60"
                          label="个数">
                      </el-table-column>
                      <el-table-column
                          prop="score"
                          v-if="accountArr.currentTag=='score'"
                          align="center"
                          width="60"
                          label="积分">
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
import {Pie} from '@antv/g2plot';
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
    };
  },
  mounted(){
    this.drawPieChart();
  },
  methods: {
    // 占比图例
    drawPieChart(){
      var $this = this;
      if(!$this.piePlot){
        const piePlot = new Pie('pie-'+$this.accountArr.currentTag, {
          data:$this.accountArr.itemArr,
          angleField: 'number',
          colorField: 'name',
          radius: 0.75,
          width:218,
          height:218,
          radius: 1,
          innerRadius: 0.65,
          color:$this.accountArr.ChartColor,
          appendPadding:[10,10,10,10],
          animation: {
            // 配置图表第一次加载时的入场动画
            appear: {
              animation: 'zoom-in', // 动画效果
              duration: 500,  // 动画执行时间
            },
          },
          label:false,
          legend:false,
          state: {
            active: {
              style: {
                fill:'#90a6e8',
                lineWidth:0,
                fillOpacity: 0.65,
              },
            },
          },
          interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
          statistic: {
            title:false,
            content: {
              style: {
                whiteSpace: 'pre-wrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
              customHtml:(v)=>{
                var item='<p class="picCon"><span class="picConTit">'+$this.accountArr.totalNum+'</span><span class="picConMain">'+$this.accountArr.totalNumName+'</span></p>'
                return item
              },
            },
          },
        });
        $this.piePlot = piePlot;
        piePlot.render();
      }
    },
  }
}
</script>



