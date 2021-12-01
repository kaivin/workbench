<template>
  <div class="page-root scroll-panel personAnalysis" ref="boxPane">
      <top-tab></top-tab>
      <div class="middleBox">          
          <div class="personalCard">
              <div class="personMsg">
                  <div class="personAvatar">
                      <img src="../../../../assets/clinchIcon01.png" alt="" />
                  </div>
                  <h3 class="personName">袁丹丹</h3>
                  <p class="workTime">在河南红星机器有限公司工作了108天</p>
                  <div class="rate_num">
                      <span class="num01">P10</span>
                      <span class="num02">组长</span>
                  </div>
              </div>
              <div class="personMore">
                  <div class="pHistory">历史成就</div>
                  <div class="pCompare">对比</div>
              </div>
              <div class="personDepart">
                  <div class="pdname">
                      <p><span>部门：</span>电商一部-中文推广1组 </p>
                  </div>
                  <div class="pdsub">
                      <p><span>入职时间：</span>2016-11-23</p>
                      <p><span>主管：</span>李玉娟</p>
                  </div>
              </div>
              <div class="clear:both"></div>
              <div class="monthResult">
                  <div class="mtit">个人10月份数据表现：</div>
                  <ul class="monthUl">
                      <li>
                          <div class="mon01">询盘个数</div>
                          <span class="res">5824</span>
                      </li>
                      <li>
                          <div class="mon02">成交积分</div>
                          <span class="res">963</span>
                      </li>
                      <li>
                          <div class="mon03">100万成交个数</div>
                          <span class="res">-</span>
                      </li>
                      <li>
                          <div class="mon04">个人奖金 (元)</div>
                          <span class="res">18696</span>
                      </li>
                  </ul>
              </div>
          </div>
          <div class="middleRight">              
              <div class="personYearChart">
                  <div class="yearChartTab">
                      <div class="yearTabItem yearTabActive">
                        <p class="yearTabTitle">年度总询盘个数<span>（单位：个）</span></p>
                        <div class="yearNum">23,568</div>
                        <div class="numCompare">环比上年同期<span class="numsep">445</span></div>
                      </div>
                      <div class="yearTabItem">
                        <p class="yearTabTitle">年度总成交积分<span>（单位：分）</span></p>
                        <div class="yearNum">654</div>
                        <div class="numCompare">环比上年同期<span class="numsep">445</span></div>
                      </div>
                      <div class="yearTabItem">
                        <p class="yearTabTitle">年度100万成交个数<span>（单位：个）</span></p>
                        <div class="yearNum">16</div>
                        <div class="numCompare">环比上年同期<span class="numsep numdec">445</span></div>
                      </div>
                      <div class="yearTabItem">
                        <p class="yearTabTitle">年度总奖金<span>（单位：元）</span></p>
                        <div class="yearNum">36,985.6</div>
                        <div class="numCompare">环比上年同期<span class="numsep">445</span></div>
                      </div>
                  </div>
                  <div class="chartContainer">
                      <div id="inquirybox"></div>
                      <div class="showLine">
                        <span class="line1">2021年</span>
                        <span class="line2">2020年</span>
                        <span class="line3">月平均值</span>
                      </div>
                  </div>
              </div>                          
              <div class="personScoreNum">
                  <h3 class="stitle">个人成绩统计</h3>
                  <div class="scoreTable">
                        <el-table
                            :data="scoreCount"
                            border
                            style="width: 100%">
                            <el-table-column
                                prop="date"
                                label="日期">
                            </el-table-column>
                            <el-table-column
                                prop="number"
                                label="询盘个数">
                            </el-table-column>
                            <el-table-column
                                prop="score"
                                label="成交积分">
                            </el-table-column>
                            <el-table-column
                                prop="anumber"
                                label="百万个数">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.anumber>0">
                                        <div class="awardicon" v-for="(item,index) in scope.row.anumber" :key="index"></div>
                                    </div>
                                    <div v-else class="line"></div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="award"
                                label="个人奖金">
                                <template slot-scope="scope">
                                    {{scope.row.award.toFixed(1)}}
                                </template>
                            </el-table-column>
                        </el-table>
                  </div>
                  <div class="scoreSepcount">
                      <ul class="countul">
                          <li class="i1">
                              <p>最高月询盘数量</p>
                              <span>698</span>
                          </li>
                          <li class="i2">
                              <p>最高月成交积分</p>
                              <span>99</span>
                          </li>
                          <li class="i3">
                              <p>最高月成交百万个数</p>
                              <span>2</span>
                          </li>
                          <li class="i4">
                              <p>最高月奖金</p>
                              <span>8692</span>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>
<script>
import TopTab from "../../compoents/memberDetail/TopTab"
export default {
  name: "cnSinglePerson",
  data() {
    return {
        nowYear:[
            {
                month:'1',
                number: 100
            },
            {
                month:'2',
                number: 130
            },
            {
                month:'3',
                number: 80
            },
            {
                month:'4',
                number: 40
            },
            {
                month:'5',
                number: 160
            },
            {
                month:'6',
                number: 120
            },
            {
                month:'7',
                number: 180
            },
            {
                month:'8',
                number: 220
            },
            {
                month:'9',
                number: 225
            },
            {
                month:'10',
                number: 230
            },
            {
                month:'11',
                number: 240
            },
            {
                month:'12',
                number: 255
            }
        ],
        lastYear:[
            {
                month:'1',
                number: 80
            },
            {
                month:'2',
                number: 100
            },
            {
                month:'3',
                number: 110
            },
            {
                month:'4',
                number: 60
            },
            {
                month:'5',
                number: 150
            },
            {
                month:'6',
                number: 140
            },
            {
                month:'7',
                number: 140
            },
            {
                month:'8',
                number: 180
            },
            {
                month:'9',
                number: 200
            },
            {
                month:'10',
                number: 220
            },
            {
                month:'11',
                number: 220
            },
            {
                month:'12',
                number: 235
            }
        ],
        scoreCount:[
            {
                date:"1月",
                number: 200,
                score: 68.5,
                anumber: 3,
                award: 2024.45
            },
            {
                date:"2月",
                number: 200,
                score: 68.5,
                anumber: 0,
                award: 2024.45
            },
            {
                date:"3月",
                number: 200,
                score: 68.5,
                anumber: 1,
                award: 2024.45
            },
            {
                date:"4月",
                number: 200,
                score: 68.5,
                anumber: 2,
                award: 2024.45
            },
            {
                date:"5月",
                number: 200,
                score: 68.5,
                anumber: 0,
                award: 2024.45
            },
        ]
    };
  },
  components:{
    TopTab
  },
  created() {
    var $this = this;
    $this.initData();
  },
  methods: {
    // 初始化数据
    initData() {
      var $this = this;
    },
    // 获取组员基本信息
    departChange(){

    },
    personChange(){

    },
    departChange(){

    },
    personChange(){

    },
    getYearInquiryChart(){
        var $this = this;
        var nowyear = $this.nowYear;
        var lastyear = $this.lastYear;
        //计算y轴显示的最大数值
        var maxnum = 0;
        for(var i=0;i<nowyear.length;i++){
            if(nowyear[i].number > maxnum){
                maxnum = nowyear[i].number;
            }
        }
        for(var i=0;i<lastyear.length;i++){
            if(lastyear[i].number > maxnum){
                maxnum = lastyear[i].number;
            }
        }
        
        const plot = new Mix('inquirybox', {
          tooltip: { 
              shared: true
          },
      
          syncViewPadding: true,
          plots: [
              {
                  type: 'column',
                  options: {
                      data: nowyear,
                      xField: 'month',
                      yField: 'number',
                      minColumnWidth: 22,
                      maxColumnWidth: 22,
                      yAxis: {
                          grid: {
                              line: {
                                  style: {
                                      stroke: '#f2f2f2',
                                  },
                              
                              },
                          },
                          tickCount: 5,
                          max:maxnum,
                          label:{
                              style:{
                                  fontSize: 12,
                                  fill: "#b3b3b3"
                              }
                          }
                      },
                      xAxis: {
                          label:{
                              style:{
                                  fontSize: 12,
                                  fill: "#b3b3b3"
                              }
                          }
                      },
                      meta: {
                          month: {
                              formatter:(item)=>{
                                  return item+"月"
                              }
                          },
                          number: {
                              alias: '今年询盘',
                          },
                      },
                      label: {
                          position: 'top',
                      },
                      annotations: [
                          {
                              type: 'line',
                              start: ['min', 'median'],
                              end: ['max', 'median'],
                              style: {
                                  stroke: '#5fce45',
                                  lineWidth: 2,
                                  lineDash: [8, 4]
                              },
                          },
                      ],
                      columnStyle: {
                          fill: 'l(270) 0:#b9cff4 0.5:#a0bff4 1:#82adf2'
                      },
                  },
              },
              {
                  type: 'area', 
                  options: {
                      data: lastyear,
                      xField: 'month',
                      yField: 'number',
                      areaStyle: () => {
                          return {
                              fill: 'l(270) 0:#ffffff 0.5:#efd587 1:#f1cb56',
                          };
                      },
                      color: "#f3be1c",
                      line:{
                          color: "#f3be1c",
                          size:2
                      },
                      point:{
                          size: 4,
                          shape: "circle",
                          style: {
                              fill: '#fff',
                              stroke: '#f3be1c',
                              lineWidth:  1,
                          },
                      },
                      meta: {
                          month: {
                              formatter:(item)=>{
                                  return item+"月"
                              }
                          },
                          number: {
                              alias: '去年询盘',
                          },
                      },
                      yAxis: {
                          grid: {
                              line: {
                                  style: {
                                      stroke: '#f2f2f2',
                                  },
                              
                              },
                          },
                          tickCount: 5,
                          max: maxnum,
                          label:{
                              style:{
                                  fontSize: 12,
                                  fill: "#b3b3b3",
                                  fillOpacity: 1
                              }
                          }
                      },
                      xAxis: {
                          label:{
                              style:{
                                  fontSize: 12,
                                  fill: "#b3b3b3"
                              }
                          }
                      }
                  }
              }
          ],
          });

          plot.render();
    }
  }
}


</script>



