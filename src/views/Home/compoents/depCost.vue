<template>
  <div class="rowSever" >
              <div class="rowSeverFl">
                    <div class="itemRowTit">
                      <h3>部门成本</h3>
                      <span>(展示为{{updateScoremonth}}之间的数据)</span>
                      <p>数据更新于{{updatemtime[0]}}年{{updatemtime[1]}}月{{updatemtime[2]}}日 {{updatemtime[3]}}时  | 每月更新</p>
                    </div>
                    <div class="rowSeverFlItem">
                        <el-table
                          :data="currentCluesData.departmentCost"
                          show-summary
                          :summary-method="getSummaries"
                          class="rowThreeTable"
                          style="width: 100%">
                          <el-table-column
                            prop="departname"
                            label="部门"
                            min-width="70">
                          </el-table-column>
                          <el-table-column
                            prop="score"
                            label="成交分"
                            min-width="70">
                          </el-table-column>
                          <el-table-column
                            prop="personnumber"
                            sortable
                            label="总人数"
                            min-width="70">
                          </el-table-column>
                          <el-table-column
                            prop="personmoney"
                            sortable
                            label="人力成本(万元)"
                            min-width="70">
                          </el-table-column>
                          <el-table-column
                            prop="paymoney"
                            sortable
                            label="付费成本(万元)"
                            min-width="80">
                          </el-table-column>
                          <el-table-column
                            prop="allmoney"
                            label="总成本(万元)"
                            min-width="60">
                          </el-table-column>
                          <el-table-column
                            prop="avgallmoney"
                            sortable
                            label="每分成本(元)"
                            min-width="70">
                            <template slot-scope="scope">
                              <span style="color:#ff4245;">{{scope.row.avgallmoney}}</span>
                            </template>
                          </el-table-column>
                          <el-table-column
                            prop="moneyscore"
                            sortable
                            label="1万元成交分"
                            min-width="70">
                          </el-table-column>
                          
                          
                        </el-table>
                    </div>
              </div>
              <div class="rowSeverFr">
                    <h3>部门成本均价排行</h3>
                    <p class="unit">(单位：元)</p>
                    <div id="costAverageChart" class="chart-canvas"></div>
              </div>
          </div>
</template>

<script>
import { Column} from '@antv/g2plot';
export default {
    name:"demo",
    data(){
        return {

        }
    },
    props:{
        language:{
            type:String,
            default:""
        },
        currentCluesData:{
            type:Object,
            default:function(){
                return {}
            }
        },
        updateScoremonth:{
            type:String,
            default:""
        },
        updatemtime:{
            type:Array,
            default:function(){
                return []
            }
        }

    },
    created(){
        
    },
    methods:{
        // 成本均价排行
      costAverageChart(){
        var $this = this;
          if($this.costAverageData&&!$this.costAverageData.chart.destroyed){
              $this.costAverageData.chart.destroy();
            } 
          const costAverageData = new Column('costAverageChart', {
            data:$this.currentCluesData.costAverage,
            xField: 'departname',
            yField: 'avgallmoney',
           
            appendPadding: [15, 0, 0, 0],
            height:347,
            color: '#81a8f1',
            label: {
              position: 'top', 
              offset:4,
              // 配置样式
              style: {
                fill: '#333333',
                fontSize:13
              },
            },
            xAxis: {
              label: {
                offset:11,
                autoHide: true,
                autoRotate: false,
                style: {
                  fill: '#a1a1a1',
                  opacity: 1,
                  fontSize: 12,
                  lineHeight:18,
                },
              },
            },
            yAxis: {
              tickCount:4,
              grid: {
                line: {
                  style: {
                    stroke: '#cccccc',
                    lineWidth: 1,
                    lineDash: [3, 2],
                    strokeOpacity: 0.5,
                    shadowColor: null,
                    shadowBlur: 0,
                    shadowOffsetX:0,
                    shadowOffsetY:0,
                    cursor: 'pointer'
                  }
                }
              },
            },
            meta: {
              avgallmoney: {
                alias: '成本均价',
              },
            },
            statistic: null,
            minColumnWidth:20,
            maxColumnWidth:25,
            annotations: [
              {
                type: 'image',
                src: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*ELYbTIVCgPoAAAAAAAAAAABkARQnAQ',
                /** 位置 */
                position: ['50%', '50%'],
                /** 图形样式属性 */
                style: {
                  width: 50,
                  height: 50,
                },
                /** x 方向的偏移量 */
                offsetX: -25,
                /** y 方向的偏移量 */
                offsetY: 40,
              },
            ],
          });

          $this.costAverageData = costAverageData;
          costAverageData.render();
        
      },
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
       
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if(column.label == "每分成本(元)" || column.label == "1万元成交分"){
            let anum = 0;
            values.forEach(val=>{
              anum+=val
            })
            sums[index] = (anum / values.length).toFixed(2);
          }else{
            let anum = 0;
            values.forEach(val=>{
              anum+=val
            })
            sums[index] = anum.toFixed(2);
          }
          
        });

        return sums;
      }
    }
}
</script>

<style>

</style>