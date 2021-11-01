<template>
  <div class="page-root scroll-panel home-index" ref="boxPane">
    <el-card class="box-card scroll-card" shadow="hover">
      <div class="card-content" ref="tableContent">
        <div class="item-row flex-box Module_bbs" v-if="newsList.length>0"> 
            <div class="news-list flex-content" v-if="permitModules.includes('Module_bbs')">
              <dl class="news-dl flex-wrap" v-for="(item,index) in newsList" v-bind:key="index">
                <dt class="news-dt">{{item.groupname}}：</dt>
                <dd class="news-dd flex-content">
                    <div class="item-news flex-box" v-for="item1 in item.article" v-bind:key="item1.id" v-on:click="jumpArticle(item1)">
                      <div class="txt-font flex-content" :title="item1.title">
                        <span class="txt-icon" v-bind:class="item1.is_new==1?'update':'new'"><b>{{item1.is_new==1?'改':'新'}}</b></span>
                        <span class="txt-type" v-if="item1.type==1">【{{item1.domain}} [{{item1.website_id}}]】</span>
                        <span class="txt-type" v-else>【{{item1.typename}}】</span>
                        <span class="txt-title" :style="{color:item1.titlecolor?item1.titlecolor:''}">{{item1.title}}</span>
                      </div>
                      <div class="txt-time">({{item1.updatetime}})</div>
                    </div>
                </dd>
              </dl>
            </div>
        </div>
        <div class="item-row stat-row">
          <div class="rowBtn">
              <p class="btn-panel" v-if="permitModules.includes('Module_cnStat')&&permitModules.includes('Module_enStat')">
                <span class="btn-span" v-bind:class="item.isOn?'active':''" v-for="(item,index) in languageList" v-bind:key="index" v-on:click="cnEnStatChange(item.label)">{{item.name}}统计</span>
              </p>
              <div class="rowBtnFr">
                    <el-checkbox-group class="checkbox-panel" v-model="currentCluesData.departID" @change="handleDepart" size="small">
                      <el-checkbox :label="item.value" :disabled="item.disabled" v-for="(item,index) in currentCluesData.DeparData" v-bind:key="index">{{item.label}}</el-checkbox>
                    </el-checkbox-group>
              </div>
          </div>          
          <div class="flex-box flex-wrap rowOne" v-if="permitModules.includes('Module_cnStat')||permitModules.includes('Module_enStat')">
               <div class="rowOneOne flex-content">                    
                    <div class="rowOneOneTit flex-wrap">
                        <h3>{{language=='Module_cnStat'?'中文':'英文'}}各部门日目标</h3>
                        <div class="item-search flex-content">                        
                          <el-date-picker
                            v-model="DaytargetTime"
                            size="mini"
                            type="date"
                            @change="DaytargetHandler"
                            placeholder="选择日期"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd"
                            style="width:180px"
                            >
                          </el-date-picker>
                        </div>
                    </div>
                    <div class="rowOneOneItem clearfix flex-wrap">
                         <div class="rowOneOneItemFl">
                              <div id="radialBarChart" class="chart-canvas"></div>
                              <div class="legendFly">
                                <span class="legendItem1">目标询盘</span>
                                <span class="legendItem2">询盘数量</span>
                                <span class="legendItem3">优秀询盘数量</span>
                                <span class="legendItem4">历史最高</span>
                                <span class="legendItem5">本月最高</span>
                              </div>
                         </div>
                         <dl class="rowOneOneItemFr flex-content">
                             <dt>{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}统计</dt>
                             <dd>历史单日最高<span>({{targetScore.historymaxnumber.xundate}})</span><strong class="color01">{{targetScore.historymaxnumber.maxnumber}}</strong></dd>
                             <dd>本月单日最高<span>({{targetScore.daymaxnumber.xundate}})</span><strong class="color02">{{targetScore.daymaxnumber.maxnumber}}</strong></dd>
                             <dd v-if="targetScore.isDistanceTarget">距目标线差距<strong>{{targetScore.DistanceTarget}}</strong></dd>
                             <dd v-else>超出目标线<strong>{{targetScore.DistanceTarget}}</strong></dd>
                         </dl>
                    </div>
               </div>
               <div class="rowOneTwoThree flex-wrap flex-content">
                  <div class="rowOneTwo flex-content">
                        <h3>{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}日询盘</h3>
                        <ul class="rowOneTwoItem">
                            <li class="flex-box">
                                <i class="svg-i"><svg-icon icon-class="homePic" /></i>
                                <p class="flex-content">
                                    今日询盘                          
                                    <strong>{{currentCluesData.alltodaynumber}}</strong>
                                    <span><i :style="'width:'+ currentCluesData.alltodaynumberPercent +'%'"></i></span>
                                </p>
                            </li>
                            <li class="flex-box">
                                <i class="svg-i"><svg-icon icon-class="homeTime" /></i>
                                <p class="flex-content">
                                    昨日询盘                                
                                    <strong>{{currentCluesData.alllastdaynumber}}</strong>
                                    <span><i :style="'width:'+ currentCluesData.alllastdaynumberPercent +'%'"></i></span>
                                </p>
                            </li>     
                        </ul>
                  </div>
                  <div class="rowOneThree">
                        <h3>{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}月询盘</h3>
                        <div class="rowOneThreeTop">
                            <span>本月询盘</span>
                            <strong>{{currentCluesData.allmonthnumber}}</strong>
                            <p :class="currentCluesData.monthGrowth>0?'rising':'falling'">环比上月同期<span v-if="currentCluesData.monthGrowth>0">上升</span><span v-else>下降</span>{{currentCluesData.monthGrowthTxt}}</p>
                        </div>
                        <div class="rowOneThreeBom">
                            <div id="rowOneThreeArea" class="chart-canvas"></div>
                        </div>
                  </div>
               </div>
          </div>
          <div class="flex-box flex-column trend-chart" v-if="permitModules.includes('Module_cnStat')||permitModules.includes('Module_enStat')">
            <h3>{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}近30天询盘趋势</h3>
            <div id="cluesChart" class="chart-canvas flex-content"></div>
          </div>
          <div class="rowFive">
               <div class="rowFiveFl">
                    <h3>{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}年度询盘对比</h3>
                    <div id="yeartongChart" class="chart-canvas"></div>
               </div>
               <div class="rowFiveFr">
                    <h3>{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}年度同期询盘对比</h3>
                    <div class="rowFiveFrBox">
                         <div id="registerChart" class="chart-canvas"></div>
                         <ul class="rowFiveFrBoxFl">
                             <li><span>同比增长量</span><strong :class="currentCluesData.registerGrowth>0?'':'falling'">{{Math.abs(currentCluesData.registerGrowth)}}<i>{{currentCluesData.registerGrowth>0?'↑':'↓'}}</i></strong></li>
                             <li><span>同比增长率</span><strong :class="currentCluesData.registerGrowth>0?'':'falling'">{{currentCluesData.registerRate}}<i>{{currentCluesData.registerGrowth>0?'↑':'↓'}}</i></strong></li>
                         </ul>
                    </div>
               </div>
          </div>
          <div class="rowThree">
               <h3>{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}小组成绩</h3>
               <div class="rowThreeOne">
                    <div class="rowThreeOne01" v-if="currentCluesData.zugroupdayArr.length>0&&currentCluesData.zugroupdayArr">
                        <div id="zugroupdayChart" class="chart-canvas"></div>
                    </div>
                    <div class="rowThreeOne02" v-if="currentCluesData.monthtongArr.length>0&&currentCluesData.monthtongArr">
                        <div id="zugroupmonthChart" class="chart-canvas"></div>
                    </div>
                    <div class="rowThreeOne03"  v-if="currentCluesData.zusuercountArr.length>0&&currentCluesData.zusuercountArr">
                         <p class="rowThreeOne03Tit">组员成绩<span>注：与上月同期对比</span></p>
                         <div class="rowThreeThreeItem">                             
                            <el-table
                                ref="simpleTable"
                                :data="currentCluesData.zusuercountArr"
                                tooltip-effect="dark"
                                stripe
                                class="rowThreeTable rowTableOne"
                                style="width: 100%"
                                height="300"
                                >
                                <el-table-column
                                prop="groupname"
                                label="组别"
                                aglin="center"
                                >
                                  <template slot-scope="scope">
                                    <span style="color:#aaaaaa;">{{scope.row.groupname}}</span>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                prop="username"
                                label="姓名"
                                aglin="center"
                                >
                                </el-table-column>
                                <el-table-column
                                prop="todaynumber"
                                sortable
                                label="今天个数"
                                aglin="center"
                                >
                                </el-table-column>
                                <el-table-column
                                prop="lastdaynumber"
                                sortable
                                label="昨天个数"
                                aglin="center"
                                >
                                </el-table-column>
                                <el-table-column
                                prop="monthnumber"
                                sortable
                                label="本月个数"
                                aglin="center"
                                >
                                  <template slot-scope="scope">
                                    <div class="rowThreeGrowth">
                                      <p>
                                          <i>{{scope.row.lastmonthnumber}}</i>
                                          <span :class="scope.row.Class">{{scope.row.Growth}}</span>
                                      </p>
                                    </div>
                                  </template>
                                </el-table-column>
                            </el-table>
                         </div>
                    </div>
               </div>
          </div>
          <div class="flex-box flex-wrap rowTwo">
               <div class="rowTwoTwo flex-content">
                    <div class="map-Top-chartTit flex-wrap">
                        <h3>{{language=='Module_cnStat'?'中文':'英文'}}成交统计</h3>
                        <div class="item-search flex-content">                        
                          <el-date-picker
                            v-model="ScoreTime"
                            size="mini"
                            type="month"
                            @change="monthChangeHandler"
                            placeholder="选择月"
                            format="yyyy 年 MM 月"
                            value-format="yyyy-MM"
                            style="width:140px"
                            >
                          </el-date-picker>
                        </div>
                    </div>
                    <div class="rowTwoTwoItem">
                         <div class="rowTwoTwoItemTop flex-wrap">
                              <p class="rowTwoTwoItemTop01 flex-content">
                                 <span>成交积分</span><span>合格线</span><span>中等线</span><span>优秀线</span>
                              </p>
                              <p class="rowTwoTwoItemTop02">百万成交</p>
                         </div>
                         <ul class="rowTwoTwoItemBom">
                             <li class="flex-wrap" v-for="(item,index) in currentCluesData.departScoreData" :key="index">
                                <p class="rowTwoTwoItemFlName">{{item.departname}}</p>
                                <p class="rowTwoTwoItemFlBox flex-content">
                                   <span v-if="language=='Module_cnStat'" class="departnamescore" :style="'width:'+item.score/ScoreData.MaxValue*100+'%'"></span>
                                   <span v-else class="departnamescore" :style="'width:'+item.snumber/ScoreData.MaxValue*100+'%'"></span>
                                   <span class="goodnumber" :style="'width:'+item.goodnumber/ScoreData.MaxValue*100+'%'"></span>
                                   <span class="mediumnumber" :style="'width:'+item.mediumnumber/ScoreData.MaxValue*100+'%'"></span>
                                   <span class="passnumber" :style="'width:'+item.passnumber/ScoreData.MaxValue*100+'%'"></span>
                                </p>
                                <p class="rowTwoTwoItemFlNum NumClass">
                                   <span>{{item.a_number}}</span>
                                </p>
                             </li>
                         </ul>
                         <dl class="rowTwoTwoItemDl">
                              <dt>
                                  <p class="rowTwoTwoItemDlTit">{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}成交数量</p>
                                  <p class="rowTwoTwoItemDlNum">{{ScoreData.addallsnumber}}<span v-if="ScoreData.allsnumber!=ScoreData.addallsnumber">(占总成交{{ScoreData.allsnumberPercen}})</span></p>
                              </dt>
                              <dt>
                                  <p class="rowTwoTwoItemDlTit">{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}成交积分</p>
                                  <p class="rowTwoTwoItemDlNum">{{ScoreData.addallscore}}<span v-if="ScoreData.allscore!=ScoreData.addallscore">(占总成交{{ScoreData.allscorePercen}})</span></p>
                              </dt>
                         </dl>
                    </div>
               </div>
               <div class="rowTwoOne" v-if="permitModules.includes('Module_cnStat')||permitModules.includes('Module_enStat')">
                    <div class="map-Top-chartTit flex-wrap">
                        <h3>{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}热门{{language=='Module_cnStat'?'地区':'国家'}}TOP10</h3>
                        <div class="item-search flex-content">
                          <el-date-picker
                            v-model="mapDate"
                            size="mini"
                            type="daterange"
                            class="date-range"
                            align="right"
                            style="width:220px;"
                            value-format = "yyyy-MM-dd"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="dateRangeChangeHandler"
                            :picker-options="pickerRangeOptions">
                          </el-date-picker> 
                        </div>
                    </div>
                    <div class="rowTwoOneItem flex-wrap" :class="language=='Module_cnStat'?'mapCNpad':'mapENpad'">
                        <div class="map-chart flex-content">
                          <div v-if="language=='Module_cnStat'" id="regionMapChart" class="chart-canvas"></div>
                          <div v-else id="worldRegionMapChart" class="chart-canvas"></div>
                        </div>
                        <div class="top-ten">
                             <h3>热门地区TOP10</h3>
                             <div id="topTen" class="chart-canva"></div>
                        </div>
                    </div>
               </div>
          </div>
          <div class="rowSever">
               <div class="rowSeverFl">
                    <h3>{{language=='Module_cnStat'?'中文':'英文'}}年度成交积分</h3>
                    <p class="unit">(单位：分)</p>
                    <p class="totalNum">
                       <span>{{language=='Module_cnStat'?'中文':'英文'}}总成交积分</span><strong>{{currentCluesData.totalNumscore}}</strong>
                    </p>
                    <div id="yeardepartscoreChart" class="chart-canvas"></div>
               </div>
               <div class="rowSeverFr">
                  <div class="rowSeverFrOne">
                        <div class="itemRowTit">
                          <h3>部门成本</h3>
                          <span>数据更新于2021年10月25日 12时  | 每月更新</span>
                        </div>
                        <div class="rowSeverFrOneBox">
                            <el-table
                              :data="currentCluesData.departmentCost"
                              border
                              show-summary
                              class="rowThreeTable"
                              style="width: 100%">
                              <el-table-column
                                prop="departname"
                                label="部门"
                                width="80">
                              </el-table-column>
                              <el-table-column
                                prop="score"
                                label="成交分"
                                width="80">
                              </el-table-column>
                              <el-table-column
                                prop="allmoney"
                                label="总成本(万元)"
                                width="120">
                              </el-table-column>
                              <el-table-column
                                prop="avgallmoney"
                                sortable
                                label="每分成本(元)"
                                width="140">
                              </el-table-column>
                              <el-table-column
                                prop="moneyscore"
                                sortable
                                label="1万元成交分"
                                width="140">
                              </el-table-column>
                              <el-table-column
                                prop="personmoney"
                                sortable
                                label="人力成本(万元)"
                                width="140">
                              </el-table-column>
                              <el-table-column
                                prop="paymoney"
                                sortable
                                label="付费成本(万元)"
                                width="140">
                              </el-table-column>
                              <el-table-column
                                prop="personnumber"
                                sortable
                                label="总人数"
                                width="100">
                              </el-table-column>
                            </el-table>
                        </div>
                  </div>
                  <div class="rowSeverFrTwo">
                        <h3>部门成本均价排行</h3>
                        <p class="unit">(单位：分)</p>
                        <div id="costAverageChart" class="chart-canvas"></div>
                  </div>
               </div>
          </div>
          <div class="flex-box flex-wrap rowSix">
               <div class="rowSixFl flex-content">
                    <h3>{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}年度成交积分对比</h3>
                    <div id="yearscoretongChart" class="chart-canvas"></div>
               </div>
               <div class="rowSixFr">
                    <div class="itemRowTit">
                         <h3>{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}年度同期成交对比</h3>
                         <span>(单位：分)</span>
                    </div>
                    <div class="rowSixFrBox">
                         <ul class="rowSixFrTop">
                             <li v-for="(item,index) in currentCluesData.sametimeArr" :key="index" :style="'width:'+item.percen">
                                <p class="time">{{item.year}}</p>
                                <p class="contrast flex-box flex-wrap">
                                    <span class="percen" :style="'width:'+item.percen"><i :style="'width:'+item.percen"></i></span>
                                    <span class="number flex-content">{{item.value}}</span>
                                </p>
                             </li>
                         </ul>
                         <ul class="rowSixFrBom">
                             <li>                             
                                <i class="svg-i"><svg-icon icon-class="home_num" /></i>
                                <p><span>同比增长量</span><strong :class="currentCluesData.sametimeGrowth>0?'':'falling'">{{Math.abs(currentCluesData.sametimeGrowth)}}<i>{{currentCluesData.sametimeGrowth>0?'↑':'↓'}}</i></strong></p>
                             </li>
                             <li>                             
                                <i class="svg-i"><svg-icon icon-class="home_rate" /></i>
                                <p><span>同比增长率</span><strong :class="currentCluesData.sametimeGrowth>0?'':'falling'">{{currentCluesData.sametimeRate}}<i>{{currentCluesData.sametimeGrowth>0?'↑':'↓'}}</i></strong></p>
                             </li>
                         </ul>
                    </div>
               </div>
          </div>
          <div class="flex-box flex-wrap rowFour" v-if="(currentCluesData.userscoreNum&&currentCluesData.userscoreNum.length>0)||(currentCluesData.yearuserscoreNum&&currentCluesData.yearuserscoreNum.length>0)">
               <div class="rowFourOne" v-if="currentCluesData.userscoreNum&&currentCluesData.userscoreNum.length>0">
                    <div class="itemRowTit">
                         <h3>月成交Top5</h3>
                         <span>(单位：分)</span>
                    </div>
                    <ul class="rowFourOneUl">
                        <li class="flex-box flex-wrap" v-for="(item,index) in currentCluesData.userscoreNum" :key='index'>
                             <p class="rowFourOneUlNum"><span>{{index+1}}</span></p>
                             <p class="rowFourOneUlPic" v-if="item.headimg"><img v-bind:src="item.headimg" alt=""></p>
                             <p class="rowFourOneUlPic" v-else><img src="../../../assets/clinchIcon01.png" alt=""></p>
                             <div class="rowFourOneUlBox flex-content">
                                  <p class="infoData">
                                    {{item.username}}
                                    <span class="group">{{item.groupname}}</span>
                                    <span class="groupNum">{{item.number}}<i v-if="item.Growth!=0" :class="item.growthClass?'rising':'falling'">{{item.Growth}}</i></span>
                                  </p>
                                  <p class="percen"><span :style="'width:'+item.percen+'%'"></span></p>
                             </div>
                        </li>
                    </ul>
               </div>
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
                                  <p class="percenTop">成交积分<span>{{item.number}}</span></p>
                                  <p class="percenBom"><span></span></p>
                             </div>
                             <div class="rowFourTwoUlScore" v-if="item.anumber>0">
                                  <p class="ScoreTop"><span>{{item.anumber}}</span></p>
                                  <p class="ScoreBom">百万成交</p>
                             </div>
                             <div class="rowFourTwoUlScore" v-else>
                                  <p class="ScoreLine">——</p>
                             </div>
                             <div class="rowFourTwoUlarea">
                                <div :id="`yearuserChart${index}`" class="chart-canva"></div>
                             </div>
                        </li>
                    </ul>
               </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { worldCountry } from '@/utils/worldCountry';
import { mapGetters } from 'vuex';
import Cookies from 'js-cookie'
import DataSet from '@antv/data-set';
import { Chart } from '@antv/g2';
import { isObject, deepMix } from '@antv/util';
import { Bullet,RadialBar,Liquid,Line,Area,measureTextWidth,Pie,Bar,Column,Mix,P,G2} from '@antv/g2plot';
export default {
  name: 'Home',
  data() {
    return {
      depDayTarget:[],//部门日目标
      menuButtonPermit:[],
      permitModules:[],
      thisMonth:'',
      ScoreTime:'',
      DaytargetTime:'',
      DaytargetTodayTime:'',
      TodayMonth:'',//默认本月
      targetScore:{
        daymaxnumber:[],
        historymaxnumber:[],
        DistanceTarget:0,
        isDistanceTarget:false,
      },
      currentCluesData:{
        departName:"中文",
        departID:[],
        chartData:[],
        avgChartNum:0,
        targetNum:0,
        alltodaynumber:0,
        alltodaynumberPercent:0,
        alllastdaynumber:0,
        alllastdaynumberPercent:0,
        allmonthnumber:0,
        monthGrowth:0,
        monthGrowthTxt:0,
        DeparData:null,
        groupcountArr:[],//部门数据
        targetData:null,
        targetDataLine:null,
        departScoreData:null,
        userscoreNum:null,//月成交TOP5
        yearuserscoreNum:null,//年度成交Top5
        zugoupmonthArr:null,//年询盘
        zugroupdayArr:[],//日询盘
        monthtongArr:[],//月询盘
        zusuercountArr:[],//组员成绩
        checkedDeparData:[],
        cluesRegionData:[],//地图
        topTenRegionData:[],//前10
        yeartongArr:[],//年度询盘对比
        registerArr:[],//年度同期询盘对比
        registerGrowth:'',//同比增长量
        registerRate:'',//同比增长率
        yearscoretongArr:[],//年度成交积分对比
        sametimeArr:[],//年度同期成交积分对比
        sametimeGrowth:'',//同比增长量
        sametimeRate:'',//同比增长率
        yeardepartscoreArr:[],//中文年度成交积分
        totalNumscore:'',//总成交积分
        departmentCost:[],//部门成本
        costAverage:[],//成本均价排行
      },
      ScoreData:{
        allscore:'',
        allsnumber:'',
        addallscore:'',
        addallsnumber:'',
        allscorePercen:'',
        allsnumberPercen:'',
        MaxValue:'',
      },
      mapDate:[],
      salesmanData:{},
      newsList:[],
      pickerRangeOptions: this.$pickerRangeOptions,
      mapDate:[],
      languageList:[
        {name:"中文",label:"Module_cnStat",isOn:false},
        {name:"英文",label:"Module_enStat",isOn:false},
      ],
      language:null,

      radialBarPlot:null,//中文地区目标
      worldRegionMapChart:null,//世界地图
      regionMapChart:null,//中国地图
      pieSourcePlot:null,//热门地区TOP10
      monthtongArea:null,//月询盘数据图
      areaTrendPlot:null,//30天询盘
      zugroupdayColumn:null,//日询盘
      zugoupmonthColumn:null,//月询盘
      useryearChart:null,
      yeartongData:null,//年度询盘对比
      registerData:null,//年度同期询盘对比
      yearscoretongData:null,//年度成交积分对比
      yeardepartscoreData:null,//中文年度成交积分
      costAverageData:null,//成本均价排行

      loading:false,
      clickID:'',
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ]),
  },
  created() {
    var $this = this;
    $this.initData();
  },
  methods: {
    // 初始化数据
    initData() {
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.status){
          if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.menuButtonPermit.includes('Home_index')){
              $this.getPermitModules();
            }else{
              $this.$message({
                showClose: true,
                message: "未被分配该页面的访问权限",
                type: 'error',
                  duration:6000
              });
              $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
            }
          }else{
            $this.$message({
              showClose: true,
              message: "未被分配该页面的访问权限",
              type: 'error',
                  duration:6000
            });
            $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
          }
        }else{
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'error'
          });
        }
      });
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      if($this.permitModules.includes('Module_bbs')){
        $this.getPostData();
      }
      if(!$this.language){
        if($this.permitModules.includes('Module_cnStat')){
          $this.language = "Module_cnStat";
          $this.currentCluesData.departName = "中文";
        }else{
          if($this.permitModules.includes('Module_enStat')){
            $this.language = "Module_enStat";
            $this.currentCluesData.departName = "英文";
          }else{
            $this.language = null;
          }
        }
        var userlanguage={};
        userlanguage.language=$this.language;
        userlanguage = JSON.stringify(userlanguage);
        Cookies.set('language', userlanguage);
      }else{
        $this.language = null;
      }
      if($this.language){
        $this.cnEnActiveChange();
        $this.getNearMonth();
        $this.statDataApi();
      }
    },
    // 获取当前登录用户首页拥有阅读权限的模块
    getPermitModules(){
      var $this = this;
      $this.$store.dispatch("modulelist/getPermitModuleListAction", null).then((response) => {
        if (response) {
          if (response.status) {
            $this.permitModules = response.data;
            $this.initPage();
          } else {
            $this.$message({
              showClose: true,
              message: response.info,
              type: "error",
            });
          }
        }
      });
    },
    // 跳转到文章详情
    jumpArticle(row){
      var $this = this;
      var routeUrl = "";
      if(row.type==1){
        routeUrl =  $this.$router.resolve({path:'/Website/logInfo',query:{logID:row.id,websiteID:row.website_id,website:row.domain}});
      }else{
        routeUrl =  $this.$router.resolve({path:'/Article/info',query:{id:row.id}});
      }
      window.open(routeUrl.href,'_blank');
    },
    // 获取论坛最新资讯
    getPostData(){
      var $this = this;
      $this.$store.dispatch("api/getNewPostArticleAction", null).then((response) => {
        if (response) {
          if (response.status) {
            $this.newsList = response.data;
          } else {
            $this.$message({
              showClose: true,
              message: response.info,
              type: "error",
            });
          }
        }
      });
    },
    //清除数据
    clearData(){
      var $this = this;
      $this.currentCluesData.alltodaynumber='';
      $this.currentCluesData.alltodaynumberPercent='';
      $this.currentCluesData.alllastdaynumber='';
      $this.currentCluesData.alllastdaynumberPercent='';
      $this.currentCluesData.allmonthnumber='';
      $this.currentCluesData.monthGrowth='';
      $this.currentCluesData.monthGrowthTxt='';
      $this.currentCluesData.monthtongArr=[];
      $this.currentCluesData.chartData=[];
      $this.currentCluesData.avgChartNum=[];
      $this.currentCluesData.targetNum=[];
      $this.currentCluesData.zugroupdayArr=[];
      $this.currentCluesData.zugoupmonthArr=[];
      $this.currentCluesData.zugoupmonthArr=[];
    },
    // 中文部门日目标
    cnDaytarget(){
      var $this = this;
      var resultData = {};
      if($this.DaytargetTime&&$this.DaytargetTime!=''){
        resultData.time=$this.DaytargetTime;
      }else{
        resultData.time='';
      }
      $this.targetScore.DistanceTarget='';
      $this.$store.dispatch("api/getChinadaytargetAction", resultData).then((response) => {
        if (response) {
          console.log(response,'中文部门日目标');
          if (response.status) {
              // 获取部门数据
              if(response.readdepart&&response.readdepart.length>0){
                var DeparData=[];
                response.readdepart.forEach(function(item,index){
                    var itemDate={};
                    itemDate.value=item.id;
                    itemDate.label=item.name;
                    itemDate.disabled=false;
                    DeparData.push(itemDate);
                });
                $this.currentCluesData.DeparData=DeparData;
              }
              if($this.DaytargetTime&&$this.DaytargetTime!=''){
              }else{
                $this.DaytargetTime=$this.DaytargetTodayTime;
              }                  
              if(response.groupcount&&response.groupcount.length>0){
                var groupcountArr=[];
                response.groupcount.forEach(function(item){
                  var groupcountObj={};
                  groupcountObj.daynumber=item.daynumber;
                  groupcountObj.daytargetnumber=item.daytargetnumber;
                  groupcountObj.departname=item.departname;
                  groupcountObj.historymaxnumber=item.historymaxnumber;
                  groupcountObj.id=item.id;
                  if(item.searchdaynumber&&item.searchdaynumber!=null){
                      groupcountObj.searchdaynumber=item.searchdaynumber;
                  }
                  if(item.monthmaxnumber==null){
                      groupcountObj.monthmaxnumber=0;
                  }else{
                      groupcountObj.monthmaxnumber=item.monthmaxnumber;
                  }
                  groupcountArr.push(groupcountObj);
                })
                $this.groupcountArr=groupcountArr;
                $this.depDayTarget = groupcountArr;
              }
              //距目标线差距
              if(response.groupcount.length>0){
                var maxTarget=0;
                response.groupcount.forEach(function(item,index){
                    var gap=0;
                    if(item.searchdaynumber){
                      gap=item.daytargetnumber-item.searchdaynumber;
                      maxTarget=maxTarget+gap;
                    }else{
                      gap=item.daytargetnumber-item.daynumber;
                      maxTarget=maxTarget+gap;
                    }
                })
                if(maxTarget>=0){
                  $this.targetScore.isDistanceTarget=true;
                }else{
                  $this.targetScore.isDistanceTarget=false;
                }
                $this.targetScore.DistanceTarget=Math.abs(maxTarget);
              }
              // 部门日目标进度图
              var departTargetNum = [];
              var targetDataLine = [];
              $this.currentCluesData.targetData=[];
              response.groupcount.forEach(function(item,index){
                var itemData = {};
                var itemDataLine = {};
                var itemDatahisLine = {};
                itemData.id = item.id;
                itemData.name = item.departname;
                if(item.searchdaynumber&&item.searchdaynumber>=0){
                    itemData.dayNum = [item.searchdaynumber,item.daynumber];
                }else{
                    itemData.dayNum = [item.daynumber];
                }
                itemData.targetNum = [item.daytargetnumber];
                itemDataLine.name = item.departname;
                itemDataLine.count = item.historymaxnumber;
                itemDatahisLine.name = item.departname;
                itemDatahisLine.count = item.monthmaxnumber;
                departTargetNum.push(itemData);
                targetDataLine.push(itemDataLine,itemDatahisLine);
              });
              $this.currentCluesData.targetDataLine = targetDataLine;
              $this.currentCluesData.targetData = departTargetNum.reverse();
              if($this.radialBarPlot&&!$this.radialBarPlot.chart.destroyed){
                $this.radialBarPlot.chart.destroy();
              }
              $this.drawDepartTarget();// 部门日目标进度图
          } else {
            $this.$message({
              showClose: true,
              message: response.info,
              type: "error",
            });
          }
        }
      });
    },
    // 英文部门日目标
    enDaytarget(){
      var $this = this;
      var resultData = {};
      if($this.DaytargetTime&&$this.DaytargetTime!=''){
        resultData.time=$this.DaytargetTime;
      }else{
        resultData.time='';
      }
      $this.targetScore.DistanceTarget='';
      $this.$store.dispatch("api/getEndaytargetAction", resultData).then((response) => {
        if (response) {
          console.log(response,'首页英文询盘日目标接口');
          if (response.status) {
              //部门日目标
              // 获取部门数据
              if(response.readdepart&&response.readdepart.length>0){
                var DeparData=[];
                response.readdepart.forEach(function(item,index){
                    var itemDate={};
                    itemDate.value=item.id;
                    itemDate.label=item.name;
                    itemDate.disabled=false;
                    DeparData.push(itemDate);
                });
                $this.currentCluesData.DeparData=DeparData;
              } 
              if($this.DaytargetTime&&$this.DaytargetTime!=''){
              }else{
                $this.DaytargetTime=$this.DaytargetTodayTime;
              }
              if(response.groupcount&&response.groupcount.length>0){
                var groupcountArr=[];
                response.groupcount.forEach(function(item){
                  var groupcountObj={};
                  groupcountObj.daynumber=item.daynumber;
                  groupcountObj.daytargetnumber=item.daytargetnumber;
                  groupcountObj.departname=item.departname;
                  groupcountObj.historymaxnumber=item.historymaxnumber;
                  groupcountObj.id=item.id;
                  if(item.monthmaxnumber==null){
                      groupcountObj.monthmaxnumber=0;
                  }else{
                      groupcountObj.monthmaxnumber=item.monthmaxnumber;
                  }
                  groupcountArr.push(groupcountObj);
                })
                $this.groupcountArr=groupcountArr;  
                $this.depDayTarget = groupcountArr;                  
              }
              //距目标线差距
              if(response.groupcount.length>0){
                var maxTarget=0;
                response.groupcount.forEach(function(item,index){
                    var gap=0;
                    gap=item.daytargetnumber-item.daynumber;
                    maxTarget=maxTarget+gap;
                })
                if(maxTarget>=0){
                  $this.targetScore.isDistanceTarget=true;
                }else{
                  $this.targetScore.isDistanceTarget=false;
                }
                $this.targetScore.DistanceTarget=Math.abs(maxTarget);
              }
              // 部门日目标进度图
              var departTargetNum = [];
              var targetDataLine = [];
              $this.currentCluesData.targetData=[];
              response.groupcount.forEach(function(item,index){
                var itemData = {};
                var itemDataLine = {};
                var itemDatahisLine = {};
                itemData.id = item.id;
                itemData.name = item.departname;
                if(item.searchdaynumber&&item.searchdaynumber>=0){
                    itemData.dayNum = [item.searchdaynumber,item.daynumber];
                }else{
                    itemData.dayNum = [item.daynumber];
                }
                itemData.targetNum = [item.daytargetnumber];
                itemDataLine.name = item.departname;
                itemDataLine.count = item.historymaxnumber;
                itemDatahisLine.name = item.departname;
                itemDatahisLine.count = item.monthmaxnumber;
                departTargetNum.push(itemData);
                targetDataLine.push(itemDataLine,itemDatahisLine);
              });
              $this.currentCluesData.targetDataLine = targetDataLine;
              $this.currentCluesData.targetData = departTargetNum.reverse();
              if($this.radialBarPlot&&!$this.radialBarPlot.chart.destroyed){
                $this.radialBarPlot.chart.destroy();
              }   
              $this.drawDepartTarget();// 部门日目标进度图
          }else {
            $this.$message({
              showClose: true,
              message: response.info,
              type: "error",
            });
          }
        }
      });
    },
    // 获取中文统计数据
    getCnCluesStatData(){
      var $this = this;
      var resultData = {};
      if($this.currentCluesData.departID&&$this.currentCluesData.departID.length>0){
        resultData.dept_id = $this.currentCluesData.departID;
      }else{
        resultData.dept_id = [];
      }
      if($this.areaTrendPlot&&!$this.areaTrendPlot.chart.destroyed){
        $this.areaTrendPlot.chart.destroy();
      }
      if($this.monthtongArea&&!$this.monthtongArea.chart.destroyed){
        $this.monthtongArea.chart.destroy();
      }
      if($this.zugroupdayColumn&&!$this.zugroupdayColumn.chart.destroyed){
        $this.zugroupdayColumn.chart.destroy();
      }
      if($this.zugoupmonthColumn&&!$this.zugoupmonthColumn.chart.destroyed){
        $this.zugoupmonthColumn.chart.destroy();
      }
      if($this.yeartongData&&!$this.yeartongData.chart.destroyed){
        $this.yeartongData.chart.destroy();
      }
      if($this.registerData&&!$this.registerData.chart.destroyed){
        $this.registerData.chart.destroy();
      }
      if($this.yearscoretongData&&!$this.yearscoretongData.chart.destroyed){
        $this.yearscoretongData.chart.destroy();
      }
      $this.clearData();
      $this.$store.dispatch("api/cnCluesStatDataAction", resultData).then((response) => {
        if (response) {
          console.log(response,'/hxindex/Api/chinacount');
          if (response.status) {
            // 获取部门数据
            if(response.readart&&response.readart.length>0){
              var DeparData=[];
              response.readart.forEach(function(item,index){
                  var itemDate={};
                  itemDate.value=item.id;
                  itemDate.label=item.name;
                  itemDate.disabled=false;
                  DeparData.push(itemDate);
              });
              $this.currentCluesData.DeparData=DeparData;
            }
            // 日目标统计
            $this.targetScore.daymaxnumber= response.daymaxnumber[0];
            $this.targetScore.historymaxnumber = response.historymaxnumber[0];
            // 日询盘
            var MaxValue='';
            var MaxArr=[response.alltodaynumber,response.daytargetnumber,response.alllastdaynumber];
            MaxArr.forEach(function(item,index){
               if(MaxValue<item){
                 MaxValue=item;
               }
            });
            $this.currentCluesData.alltodaynumber = response.alltodaynumber;
            $this.currentCluesData.alltodaynumberPercent=response.alltodaynumber/MaxValue*100;
            $this.currentCluesData.alllastdaynumber = response.alllastdaynumber;
            $this.currentCluesData.alllastdaynumberPercent=response.alllastdaynumber/MaxValue*100;
            // 月询盘
            $this.currentCluesData.allmonthnumber = response.allmonthnumber;
            $this.currentCluesData.monthGrowth=response.allmonthnumber-response.lastallnumber;
            $this.currentCluesData.monthGrowthTxt=Math.abs(response.allmonthnumber-response.lastallnumber);
            // 中文成交统计数据
            $this.getCnDepartScore();
            // 近30天询盘统计
            var tongArr=[];
            response.tong.forEach(function(item,index){
              item.date = item.date+"\n"+item.week.replace("星期","周");
              var tolItem={};
              tolItem.date=item.date;
              tolItem.xunnumber=item.xunnumber;
              tolItem.title='总询盘';
              if(item.searchxunnumber){
                var searchItem={};
                searchItem.date=item.date;
                searchItem.xunnumber=item.searchxunnumber;
                searchItem.title='搜索询盘';
                tongArr.push(searchItem,tolItem);
              }else{
                tongArr.push(tolItem);
              }
            });
            $this.currentCluesData.chartData = tongArr;
            $this.currentCluesData.avgChartNum = response.tongavgnumber;
            $this.currentCluesData.targetNum = response.daytargetnumber;
            $this.drawAreaTrendChart();
            // 年度询盘对比
            if(response.yeartong&&response.yeartong.length>0){
              // 月询盘面积图数据
              var monthtongArr=[];
              if(response.yeartong.length>=6){
                var monthtongList=[]
                monthtongList=response.yeartong.slice(-6);
                monthtongList.forEach(function(item,index){
                  var monthtongObj={};
                  monthtongObj.date=item.date.split('-')[1];
                  monthtongObj.xunnumber=item.xunnumber;
                  monthtongArr.push(monthtongObj);
                });
                $this.currentCluesData.monthtongArr=monthtongArr;
                $this.monthtongChart();
              }else{
                response.yeartong.forEach(function(item,index){
                  var monthtongObj={};
                  monthtongObj.date=item.date.split('-')[1];
                  monthtongObj.xunnumber=item.xunnumber;
                  monthtongArr.push(monthtongObj);
                });
                $this.currentCluesData.monthtongArr=monthtongArr;
                $this.monthtongChart();
              }
              // 年度询盘对比
              var yeartongArr=[];
              var registerArr=[];
              var registerGrowth='';
              var registerRate='';
              var registerObj={
                year:'',
                value:0,
              };        
              var lastregisterObj={
                year:'',
                value:0,
              };
              response.yeartong.forEach(function(item,index){
                  var yeartongObj={};
                  var lastyeartongObj={};
                  yeartongObj.month=item.date.split('-')[1]+'月';
                  yeartongObj.value=item.xunnumber;
                  yeartongObj.year=item.date.split('-')[0];
                  lastyeartongObj.month=item.lastdate.split('-')[1]+'月';
                  lastyeartongObj.value=item.lastxunnumber;
                  lastyeartongObj.year=item.lastdate.split('-')[0];
                  yeartongArr.push(yeartongObj,lastyeartongObj);
                  //年度同期询盘对比
                  registerObj.value=registerObj.value+item.xunnumber;
                  registerObj.year=item.date.split('-')[0];
                  lastregisterObj.value=lastregisterObj.value+item.lastxunnumber;
                  lastregisterObj.year=item.lastdate.split('-')[0];               
              });
              registerArr.push(registerObj,lastregisterObj); 

              $this.currentCluesData.yeartongArr=yeartongArr;
              $this.currentCluesData.registerArr=registerArr;

              registerGrowth=registerObj.value-lastregisterObj.value;

              registerRate=Math.abs(((registerObj.value-lastregisterObj.value)/lastregisterObj.value*100).toFixed(2))+'%';

              $this.currentCluesData.registerGrowth=registerGrowth;
              $this.currentCluesData.registerRate=registerRate;
              $this.yeartongChart();
              $this.registerChart();
            };
            // 小组日成绩
            if(response.zugroupday!=''&&response.zugroupday!=null){
              if(response.zugroupday.length>0&&response.zugroupday){
                  var zugroupdayArr=[];
                  response.zugroupday.forEach(function(item,index){
                    var lastdayitemData = {};
                    var todayitemData = {};
                    lastdayitemData.name=item.name;
                    lastdayitemData.title='昨日数量';
                    lastdayitemData.number=item.lastdaynumber;
                    
                    todayitemData.name=item.name;
                    todayitemData.title='当日数量';
                    todayitemData.number=item.todaynumber;
                    zugroupdayArr.push(lastdayitemData,todayitemData);
                  });
                  $this.currentCluesData.zugroupdayArr = zugroupdayArr;
                  $this.$nextTick(()=>{
                    $this.zugroupdayChart();// 日询盘
                  });
              }else{
                $this.currentCluesData.zugroupdayArr=[];
              }
            }else{
                  $this.currentCluesData.zugroupdayArr=[];
            }
            // 小组月成绩
            if(response.zugoupmonth!=''&&response.zugoupmonth!=null){
                if(response.zugoupmonth.length>0&&response.zugoupmonth){
                    var zugoupmonthArr=[];
                    response.zugoupmonth.forEach(function(item,index){
                      var lastdayitemData = {};
                      var todayitemData = {};
                      lastdayitemData.name=item.name;
                      lastdayitemData.title='上月同期';
                      lastdayitemData.number=item.lastmonthnumber;
                      
                      todayitemData.name=item.name;
                      todayitemData.title='本月同期';
                      todayitemData.number=item.monthnumber;
                      zugoupmonthArr.push(lastdayitemData,todayitemData);
                    });
                    $this.currentCluesData.zugoupmonthArr = zugoupmonthArr;
                  $this.$nextTick(()=>{
                    $this.zugroupmonthChart();// 月询盘
                  });
                }else{
                  $this.currentCluesData.zugoupmonthArr=[];
                }
            }else{
                  $this.currentCluesData.zugoupmonthArr=[];
            }
            // 组员成交数
            if(response.zusuercount!=''&&response.zusuercount!=null){
                if(response.zusuercount.length>0&&response.zusuercount){
                    var zusuercountArr=[];
                    response.zusuercount.forEach(function(item,index){
                      if(item.length>0&&item){
                          item.forEach(function(items,indexs){
                                var itemData = {};
                                itemData.groupname=items.groupname;
                                itemData.lastdaynumber=items.lastdaynumber;
                                itemData.lastmonthnumber=items.lastmonthnumber;
                                itemData.monthnumber=items.monthnumber;
                                itemData.todaynumber=items.todaynumber;
                                itemData.username=items.username;
                                if(items.monthnumber-items.lastmonthnumber>0){
                                  itemData.Class='rising'
                                }
                                if(items.monthnumber-items.lastmonthnumber<0){
                                  itemData.Class='falling'
                                }
                                if(items.monthnumber-items.lastmonthnumber==0){
                                  itemData.Class='equality'
                                }
                                itemData.Growth=Math.abs(items.monthnumber-items.lastmonthnumber);
                                if(itemData.Growth==0){
                                  itemData.Growth='-'
                                }
                                zusuercountArr.push(itemData);
                          });
                      }
                    });
                    $this.currentCluesData.zusuercountArr = zusuercountArr;
                }else{
                  $this.currentCluesData.zusuercountArr=[];
                }
            }else{
                  $this.currentCluesData.zusuercountArr=[];
            }
            $this.$nextTick(()=>{
               $this.handleTableWidth();
            });
            // 年度成交积分对比
            if(response.yearscoretong&&response.yearscoretong.length>0){
              var yearscoretongArr=[];
              var sametimeArr=[];
              var sametimeGrowth='';
              var sametimeRate='';
              var registerObj={
                year:'',
                value:0,
              };        
              var lastregisterObj={
                year:'',
                value:0,
              };
              response.yearscoretong.forEach(function(item,index){
                  var yeartongObj={};
                  var lastyeartongObj={};
                  yeartongObj.month=item.date.split('-')[1]+'月';
                  if ($this.isFloat(Number(item.score))) {
                     yeartongObj.value=Number(item.score).toFixed(2);
                  } else {
                     yeartongObj.value=item.score;
                  }
                  yeartongObj.year=item.date.split('-')[0];
                  lastyeartongObj.month=item.lastdate.split('-')[1]+'月';
                  if ($this.isFloat(Number(item.lastscore))) {
                     lastyeartongObj.value=Number(item.lastscore).toFixed(2);
                  } else {
                     lastyeartongObj.value=item.lastscore;
                  }
                  lastyeartongObj.year=item.lastdate.split('-')[0];
                  yearscoretongArr.push(yeartongObj,lastyeartongObj);
                  //年度同期成交对比
                  registerObj.year=item.date.split('-')[0];
                  if ($this.isFloat(Number(item.score))) {
                      registerObj.value=(Number(registerObj.value)+Number(item.score)).toFixed(2);
                  } else {
                      registerObj.value=Number(registerObj.value)+Number(item.score);
                  }
                  lastregisterObj.year=item.lastdate.split('-')[0];
                  if ($this.isFloat(Number(item.lastscore))) {
                      lastregisterObj.value=(Number(lastregisterObj.value)+Number(item.lastscore)).toFixed(2);
                  } else {
                      lastregisterObj.value=Number(lastregisterObj.value)+Number(item.lastscore);
                  }

              });
              $this.currentCluesData.yearscoretongArr=yearscoretongArr;
              sametimeArr.push(registerObj,lastregisterObj);
              $this.currentCluesData.sametimeArr=sametimeArr;
              var MaxValue='';
              if(Number(registerObj.value)>=Number(lastregisterObj.value)){
                MaxValue=Number(registerObj.value);
              }else{
                MaxValue=Number(lastregisterObj.value);
              }
              if(MaxValue==0){
                lastregisterObj.percen='0%';
                registerObj.percen='0%';
              }else{
                  lastregisterObj.percen=(Number(lastregisterObj.value)/MaxValue*100).toFixed(2)+'%';
                  registerObj.percen=(Number(registerObj.value)/MaxValue*100).toFixed(2)+'%';
              }
              sametimeGrowth=Number(registerObj.value)-Number(lastregisterObj.value);
              if(Number(lastregisterObj.value)==0){
                sametimeRate=Number(registerObj.value).toFixed(2)+'%';
              }else{
                sametimeRate=Math.abs((Number(registerObj.value)-Number(lastregisterObj.value))/Number(lastregisterObj.value)*100).toFixed(2)+'%';
              }

              $this.currentCluesData.sametimeGrowth=sametimeGrowth;
              $this.currentCluesData.sametimeRate=sametimeRate;
              $this.yearscoretongChart();
            }
            if($this.currentCluesData.departID&&$this.currentCluesData.departID.length>0){ 
                if($this.currentCluesData.departID.length==$this.currentCluesData.DeparData.length){
                    if(response.userscore.length>0&&response.userscore){
                      var userscoreNum=[];
                      response.userscore.forEach(function(item,index){
                        var itemData = {};
                        itemData.id = item.id;
                        itemData.username = item.username;
                        itemData.groupname = item.groupname;
                        itemData.headimg = item.headimg;
                        itemData.number = item.number;
                        if(item.lastnumber){
                          itemData.Growth = Math.abs(item.number-item.lastnumber.number);
                          if(item.number-item.lastnumber.number>0){
                            itemData.growthClass=true;
                          }
                          if(item.number-item.lastnumber.number<0){
                            itemData.growthClass=false;
                          }
                        }else{
                          itemData.Growth = item.number;
                          itemData.growthClass=true;
                        }
                        userscoreNum.push(itemData);
                      });
                      userscoreNum.sort(function(a, b) {
                          var value1 = a.number;
                          var value2 = b.number;
                          return value2 - value1;
                      });
                      userscoreNum.forEach(function(item,index){
                        item.percen = item.number/userscoreNum[0].number*100;
                      });
                      $this.currentCluesData.userscoreNum = userscoreNum;

                    }else{
                      $this.currentCluesData.userscoreNum=[];
                    }
                    if(response.yearuserscore.length>0&&response.yearuserscore){
                      var yearuserscoreNum=[];
                      response.yearuserscore.forEach(function(item,index){
                        var itemData = {};
                        itemData.id = item.id;
                        itemData.username = item.username;
                        itemData.groupname = item.groupname;
                        itemData.number = item.number;
                        itemData.anumber = item.anumber;
                        itemData.son = item.son;
                        itemData.headimg = item.headimg;
                        yearuserscoreNum.push(itemData);
                      });
                      yearuserscoreNum.sort(function(a, b) {
                          var value1 = a.number;
                          var value2 = b.number;
                          return value2 - value1;
                      });
                      $this.currentCluesData.yearuserscoreNum = yearuserscoreNum;
                    }else{
                      $this.currentCluesData.yearuserscoreNum=[];
                    }
                    $this.$nextTick(() => {
                        $this.yearuserChart();
                    })
                }else{                  
                  //距目标线差距
                  var maxTarget=0;
                  $this.currentCluesData.departID.forEach(function(item,index){
                    $this.groupcountArr.forEach(function(items,indexs){
                        if(item==items.id){
                          var gap=0;
                          if(items.searchdaynumber){
                            gap=items.daytargetnumber-items.searchdaynumber;
                            maxTarget=maxTarget+gap;
                          }else{
                            gap=items.daytargetnumber-items.daynumber;
                            maxTarget=maxTarget+gap;
                          }
                        }
                    })
                  });
                  if(maxTarget>=0){
                    $this.targetScore.isDistanceTarget=true;
                  }else{
                    $this.targetScore.isDistanceTarget=false;
                  }
                  $this.targetScore.DistanceTarget=Math.abs(maxTarget);
                }
            }else{
                if(response.userscore.length>0&&response.userscore){
                  var userscoreNum=[];
                  response.userscore.forEach(function(item,index){
                    var itemData = {};
                    itemData.id = item.id;
                    itemData.username = item.username;
                    itemData.groupname = item.groupname;
                    itemData.headimg = item.headimg;
                    itemData.number = item.number;
                    if(item.lastnumber){
                      itemData.Growth = Math.abs(item.number-item.lastnumber.number);
                      if(item.number-item.lastnumber.number>0){
                        itemData.growthClass=true;
                      }
                      if(item.number-item.lastnumber.number<0){
                        itemData.growthClass=false;
                      }
                    }else{
                      itemData.Growth = item.number;
                      itemData.growthClass=true;
                    }
                    userscoreNum.push(itemData);
                  });
                  userscoreNum.sort(function(a, b) {
                      var value1 = a.number;
                      var value2 = b.number;
                      return value2 - value1;
                  });
                  userscoreNum.forEach(function(item,index){
                    item.percen = item.number/userscoreNum[0].number*100;
                  });
                  $this.currentCluesData.userscoreNum = userscoreNum;
                }else{
                  $this.currentCluesData.userscoreNum=[];
                }
                if(response.yearuserscore.length>0&&response.yearuserscore){
                  var yearuserscoreNum=[];
                  response.yearuserscore.forEach(function(item,index){
                    var itemData = {};
                    itemData.id = item.id;
                    itemData.username = item.username;
                    itemData.groupname = item.groupname;
                    itemData.number = item.number;
                    itemData.anumber = item.anumber;
                    itemData.children = item.son;
                    itemData.headimg = item.headimg;
                    yearuserscoreNum.push(itemData);
                  });
                  yearuserscoreNum.sort(function(a, b) {
                      var value1 = a.number;
                      var value2 = b.number;
                      return value2 - value1;
                  });
                  $this.currentCluesData.yearuserscoreNum = yearuserscoreNum;
                }else{
                  $this.currentCluesData.yearuserscoreNum=[];
                }
                $this.$nextTick(() => {
                    $this.yearuserChart();
                })
            }
            $this.currentCluesData.DeparData.forEach(function(item,index){
              item.disabled=false;
            });
          } else {
            $this.$message({
              showClose: true,
              message: response.info,
              type: "error",
            });
          }
        }
      });
    },
    // 获取英文统计数据
    getEnCluesStatData(){
      var $this = this;
      var resultData = {};
      if($this.currentCluesData.departID&&$this.currentCluesData.departID.length>0){
        resultData.dept_id = $this.currentCluesData.departID;
      }else{
        resultData.dept_id = [];
      }
      if($this.areaTrendPlot&&!$this.areaTrendPlot.chart.destroyed){
        $this.areaTrendPlot.chart.destroy();
      }
      if($this.zugroupdayColumn&&!$this.zugroupdayColumn.chart.destroyed){
        $this.zugroupdayColumn.chart.destroy();
      }
      if($this.monthtongArea&&!$this.monthtongArea.chart.destroyed){
        $this.monthtongArea.chart.destroy();
      }
      if($this.zugoupmonthColumn&&!$this.zugoupmonthColumn.chart.destroyed){
        $this.zugoupmonthColumn.chart.destroy();
      }
      if($this.yeartongData&&!$this.yeartongData.chart.destroyed){
        $this.yeartongData.chart.destroy();
      }
      if($this.registerData&&!$this.registerData.chart.destroyed){
        $this.registerData.chart.destroy();
      }
      if($this.yearscoretongData&&!$this.yearscoretongData.chart.destroyed){
        $this.yearscoretongData.chart.destroy();
      }
      $this.clearData();
      $this.$store.dispatch("api/enCluesStatDataAction", resultData).then((response) => {
        if (response) {
          //console.log(response,'/hxindex/Api/encount');
          if (response.status) {
            // 获取部门数据
            if(response.readart&&response.readart.length>0){
              var DeparData=[];
              response.readart.forEach(function(item,index){
                  var itemDate={};
                  itemDate.value=item.id;
                  itemDate.label=item.name;
                  itemDate.disabled=false;
                  DeparData.push(itemDate);
              });
              $this.currentCluesData.DeparData=DeparData;
            }
            // 日目标统计
            $this.targetScore.daymaxnumber= response.daymaxnumber[0];
            $this.targetScore.historymaxnumber = response.historymaxnumber[0];
            // 日询盘
            var MaxValue='';
            var MaxArr=[response.alltodaynumber,response.daytargetnumber,response.alllastdaynumber];
            MaxArr.forEach(function(item,index){
               if(MaxValue<item){
                 MaxValue=item;
               }
            });
            $this.currentCluesData.alltodaynumber = response.alltodaynumber;
            $this.currentCluesData.alltodaynumberPercent=response.alltodaynumber/MaxValue*100;
            $this.currentCluesData.alllastdaynumber = response.alllastdaynumber;
            $this.currentCluesData.alllastdaynumberPercent=response.alllastdaynumber/MaxValue*100;
            // 月询盘
            $this.currentCluesData.allmonthnumber = response.allmonthnumber;
            $this.currentCluesData.monthGrowth=response.allmonthnumber-response.lastallnumber;
            $this.currentCluesData.monthGrowthTxt=Math.abs(response.allmonthnumber-response.lastallnumber);
            // 英文成交统计数据
            $this.getCnDepartScore();
            // 近30天询盘统计
            var tongArr=[];
            response.tong.forEach(function(item,index){
              item.date = item.date+"\n"+item.week.replace("星期","周");
              var tolItem={};
              tolItem.date=item.date;
              tolItem.xunnumber=item.xunnumber;
              tolItem.title='询盘';
              tongArr.push(tolItem);
            });
            $this.currentCluesData.chartData = tongArr;
            $this.currentCluesData.avgChartNum = response.tongavgnumber;
            $this.currentCluesData.targetNum = response.daytargetnumber;
            $this.drawAreaTrendChart();
            // 年度询盘对比
            if(response.yeartong&&response.yeartong.length>0){
              // 月询盘面积图数据
              var monthtongArr=[];
              if(response.yeartong.length>=6){
                var monthtongList=[]
                monthtongList=response.yeartong.slice(-6);
                monthtongList.forEach(function(item,index){
                  var monthtongObj={};
                  monthtongObj.date=item.date.split('-')[1];
                  monthtongObj.xunnumber=item.xunnumber;
                  monthtongArr.push(monthtongObj);
                });
                $this.currentCluesData.monthtongArr=monthtongArr;
                $this.monthtongChart();
              }else{
                response.yeartong.forEach(function(item,index){
                  var monthtongObj={};
                  monthtongObj.date=item.date.split('-')[1];
                  monthtongObj.xunnumber=item.xunnumber;
                  monthtongArr.push(monthtongObj);
                });
                $this.currentCluesData.monthtongArr=monthtongArr;
                $this.monthtongChart();
              }
              // 年度询盘对比
              var yeartongArr=[];
              var registerArr=[];
              var registerGrowth='';
              var registerRate='';
              var registerObj={
                year:'',
                value:0,
              };        
              var lastregisterObj={
                year:'',
                value:0,
              };
              response.yeartong.forEach(function(item,index){
                  var yeartongObj={};
                  var lastyeartongObj={};
                  yeartongObj.month=item.date.split('-')[1]+'月';
                  yeartongObj.value=item.xunnumber;
                  yeartongObj.year=item.date.split('-')[0];
                  lastyeartongObj.month=item.lastdate.split('-')[1]+'月';
                  lastyeartongObj.value=item.lastxunnumber;
                  lastyeartongObj.year=item.lastdate.split('-')[0];
                  yeartongArr.push(yeartongObj,lastyeartongObj);
                  //年度同期询盘对比
                  registerObj.value=registerObj.value+item.xunnumber;
                  registerObj.year=item.date.split('-')[0];
                  lastregisterObj.value=lastregisterObj.value+item.lastxunnumber;
                  lastregisterObj.year=item.lastdate.split('-')[0];               
              });
              registerArr.push(registerObj,lastregisterObj); 

              $this.currentCluesData.yeartongArr=yeartongArr;
              $this.currentCluesData.registerArr=registerArr;

              registerGrowth=registerObj.value-lastregisterObj.value;

              registerRate=Math.abs(((registerObj.value-lastregisterObj.value)/lastregisterObj.value*100).toFixed(2))+'%';

              $this.currentCluesData.registerGrowth=registerGrowth;
              $this.currentCluesData.registerRate=registerRate;
              $this.yeartongChart();
              $this.registerChart();
            };
            // 小组日成绩
            if(response.zusuercount!=''&&response.zusuercount!=null){
              if(response.zugroupday.length>0&&response.zugroupday){
                  var zugroupdayArr=[];
                  response.zugroupday.forEach(function(item,index){
                    var lastdayitemData = {};
                    var todayitemData = {};
                    lastdayitemData.name=item.name.replace("-","\n").replace("-","\n");
                    lastdayitemData.title='昨日数量';
                    lastdayitemData.number=item.lastdaynumber;
                    
                    todayitemData.name=item.name.replace("-","\n").replace("-","\n");
                    todayitemData.title='当日数量';
                    todayitemData.number=item.todaynumber;
                    zugroupdayArr.push(lastdayitemData,todayitemData);
                  });
                  $this.currentCluesData.zugroupdayArr = zugroupdayArr;
                  $this.$nextTick(()=>{
                    $this.zugroupdayChart();// 日询盘
                  });
              }else{
                $this.currentCluesData.zugroupdayArr=[];
              }   
            }else{
                  $this.currentCluesData.zugroupdayArr=[];
            }      
            // 小组月成绩
            if(response.zusuercount!=''&&response.zusuercount!=null){
              if(response.zugoupmonth.length>0&&response.zugoupmonth){
                  var zugoupmonthArr=[];
                  response.zugoupmonth.forEach(function(item,index){
                    var lastdayitemData = {};
                    var todayitemData = {};
                    lastdayitemData.name=item.name.replace("-","\n").replace("-","\n");
                    lastdayitemData.title='上月同期';
                    lastdayitemData.number=item.lastmonthnumber;
                    
                    todayitemData.name=item.name.replace("-","\n").replace("-","\n");
                    todayitemData.title='本月同期';
                    todayitemData.number=item.monthnumber;
                    zugoupmonthArr.push(lastdayitemData,todayitemData);
                  });
                  $this.currentCluesData.zugoupmonthArr = zugoupmonthArr;
                  $this.$nextTick(()=>{
                    $this.zugroupmonthChart();// 月询盘
                  });
              }else{
                $this.currentCluesData.zugoupmonthArr=[];
              }
            }else{
              $this.currentCluesData.zugoupmonthArr=[];
            }
            // 组员成交数
            if(response.zusuercount!=''&&response.zusuercount!=null){
              if(response.zusuercount.length>0&&response.zusuercount){
                  var zusuercountArr=[];
                  response.zusuercount.forEach(function(item,index){
                    if(item.length>0&&item){
                        item.forEach(function(items,indexs){
                              var itemData = {};
                              itemData.groupname=items.groupname;
                              itemData.lastdaynumber=items.lastdaynumber;
                              itemData.lastmonthnumber=items.lastmonthnumber;
                              itemData.monthnumber=items.monthnumber;
                              itemData.todaynumber=items.todaynumber;
                              itemData.username=items.username;
                              if(items.monthnumber-items.lastmonthnumber>0){
                                itemData.Class='rising'
                              }
                              if(items.monthnumber-items.lastmonthnumber<0){
                                itemData.Class='falling'
                              }
                              if(items.monthnumber-items.lastmonthnumber==0){
                                itemData.Class='equality'
                              }
                              itemData.Growth=Math.abs(items.monthnumber-items.lastmonthnumber);
                              if(itemData.Growth==0){
                                itemData.Growth='-'
                              }
                              zusuercountArr.push(itemData);
                        });
                    }
                  });
                  $this.currentCluesData.zusuercountArr = zusuercountArr;
              }else{
                $this.currentCluesData.zusuercountArr=[];
              }
            }else{
              $this.currentCluesData.zusuercountArr=[];
            }
            $this.$nextTick(()=>{
               $this.handleTableWidth();
            });
            // 年度成交积分对比
            if(response.yearscoretong&&response.yearscoretong.length>0){
              var yearscoretongArr=[];
              var sametimeArr=[];
              var sametimeGrowth='';
              var sametimeRate='';
              var registerObj={
                year:'',
                value:0,
              };        
              var lastregisterObj={
                year:'',
                value:0,
              };
              response.yearscoretong.forEach(function(item,index){
                  var yeartongObj={};
                  var lastyeartongObj={};
                  yeartongObj.month=item.date.split('-')[1]+'月';
                  if ($this.isFloat(Number(item.score))) {
                     yeartongObj.value=Number(item.score).toFixed(2);
                  } else {
                     yeartongObj.value=item.score;
                  }
                  yeartongObj.year=item.date.split('-')[0];
                  lastyeartongObj.month=item.lastdate.split('-')[1]+'月';
                  if ($this.isFloat(Number(item.lastscore))) {
                     lastyeartongObj.value=Number(item.lastscore).toFixed(2);
                  } else {
                     lastyeartongObj.value=item.lastscore;
                  }
                  lastyeartongObj.year=item.lastdate.split('-')[0];
                  yearscoretongArr.push(yeartongObj,lastyeartongObj);
                  //年度同期成交对比
                  registerObj.year=item.date.split('-')[0];
                  if ($this.isFloat(Number(item.score))) {
                      registerObj.value=registerObj.value+Number(item.score).toFixed(2);
                  } else {
                      registerObj.value=registerObj.value+Number(item.score);
                  }
                  lastregisterObj.year=item.lastdate.split('-')[0];
                  if ($this.isFloat(Number(item.lastscore))) {
                      lastregisterObj.value=lastregisterObj.value+Number(item.lastscore).toFixed(2);
                  } else {
                      lastregisterObj.value=lastregisterObj.value+Number(item.lastscore);
                  }
              });
              $this.currentCluesData.yearscoretongArr=yearscoretongArr;
              sametimeArr.push(registerObj,lastregisterObj);
              $this.currentCluesData.sametimeArr=sametimeArr;
              var MaxValue='';
              if(Number(registerObj.value)>=Number(lastregisterObj.value)){
                MaxValue=Number(registerObj.value);
              }else{
                MaxValue=Number(lastregisterObj.value);
              }
              if(MaxValue==0){
                lastregisterObj.percen='0%';
                registerObj.percen='0%';
              }else{
                  lastregisterObj.percen=(Number(lastregisterObj.value)/MaxValue*100).toFixed(2)+'%';
                  registerObj.percen=(Number(registerObj.value)/MaxValue*100).toFixed(2)+'%';
              }
              sametimeGrowth=Number(registerObj.value)-Number(lastregisterObj.value);
              if(Number(lastregisterObj.value)==0){
                sametimeRate=Number(registerObj.value).toFixed(2)+'%';
              }else{
                sametimeRate=Math.abs((Number(registerObj.value)-Number(lastregisterObj.value))/Number(lastregisterObj.value)*100).toFixed(2)+'%';
              }

              $this.currentCluesData.sametimeGrowth=sametimeGrowth;
              $this.currentCluesData.sametimeRate=sametimeRate;
              $this.yearscoretongChart();
            }
            if($this.currentCluesData.departID&&$this.currentCluesData.departID.length>0){ 
                if($this.currentCluesData.departID.length==$this.currentCluesData.DeparData.length){
                    if(response.userscore.length>0&&response.userscore){
                      var userscoreNum=[];
                      response.userscore.forEach(function(item,index){
                        var itemData = {};
                        itemData.id = item.id;
                        itemData.username = item.username;
                        itemData.groupname = item.groupname;
                        itemData.headimg = item.headimg;
                        itemData.number = item.number;
                        if(item.lastnumber){
                          itemData.Growth = Math.abs(item.number-item.lastnumber.number);
                          if(item.number-item.lastnumber.number>0){
                            itemData.growthClass=true;
                          }
                          if(item.number-item.lastnumber.number<0){
                            itemData.growthClass=false;
                          }
                        }else{
                          itemData.Growth = item.number;
                          itemData.growthClass=true;
                        }
                        userscoreNum.push(itemData);
                      });
                      userscoreNum.sort(function(a, b) {
                          var value1 = a.number;
                          var value2 = b.number;
                          return value2 - value1;
                      });
                      userscoreNum.forEach(function(item,index){
                        item.percen = item.number/userscoreNum[0].number*100;
                      });
                      $this.currentCluesData.userscoreNum = userscoreNum;
                    }else{
                      $this.currentCluesData.userscoreNum=[];
                    }
                    if(response.yearuserscore.length>0&&response.yearuserscore){
                      var yearuserscoreNum=[];
                      response.yearuserscore.forEach(function(item,index){
                        var itemData = {};
                        itemData.id = item.id;
                        itemData.username = item.username;
                        itemData.groupname = item.groupname;
                        itemData.number = item.number;
                        itemData.anumber = item.anumber;
                        itemData.son = item.son;
                        itemData.headimg = item.headimg;
                        yearuserscoreNum.push(itemData);
                      });
                      yearuserscoreNum.sort(function(a, b) {
                          var value1 = a.number;
                          var value2 = b.number;
                          return value2 - value1;
                      });
                      $this.currentCluesData.yearuserscoreNum = yearuserscoreNum;
                    }else{
                      $this.currentCluesData.yearuserscoreNum=[];
                    }
                    $this.$nextTick(() => {
                        $this.yearuserChart();
                    })
                }else{                  
                  //距目标线差距
                  var maxTarget=0;
                  $this.currentCluesData.departID.forEach(function(item,index){
                    $this.groupcountArr.forEach(function(items,indexs){                        
                        if(item==items.id){
                          var gap=0;
                          gap=items.daytargetnumber-items.daynumber;
                          maxTarget=maxTarget+gap;
                        }
                    })
                  });
                  if(maxTarget>=0){
                    $this.targetScore.isDistanceTarget=true;
                  }else{
                    $this.targetScore.isDistanceTarget=false;
                  }
                  $this.targetScore.DistanceTarget=Math.abs(maxTarget);
                }
            }else{
                if(response.userscore.length>0&&response.userscore){
                  var userscoreNum=[];
                  response.userscore.forEach(function(item,index){
                    var itemData = {};
                    itemData.id = item.id;
                    itemData.username = item.username;
                    itemData.groupname = item.groupname;
                    itemData.headimg = item.headimg;
                    itemData.number = item.number;
                    if(item.lastnumber){
                      itemData.Growth = Math.abs(item.number-item.lastnumber.number);
                      if(item.number-item.lastnumber.number>0){
                        itemData.growthClass=true;
                      }
                      if(item.number-item.lastnumber.number<0){
                        itemData.growthClass=false;
                      }
                    }else{
                      itemData.Growth = item.number;
                      itemData.growthClass=true;
                    }
                    userscoreNum.push(itemData);
                  });
                  userscoreNum.sort(function(a, b) {
                      var value1 = a.number;
                      var value2 = b.number;
                      return value2 - value1;
                  });
                  userscoreNum.forEach(function(item,index){
                    item.percen = item.number/userscoreNum[0].number*100;
                  });
                  $this.currentCluesData.userscoreNum = userscoreNum;
                }else{
                  $this.currentCluesData.userscoreNum=[];
                }                
                if(response.yearuserscore.length>0&&response.yearuserscore){
                  var yearuserscoreNum=[];
                  response.yearuserscore.forEach(function(item,index){
                    var itemData = {};
                    itemData.id = item.id;
                    itemData.username = item.username;
                    itemData.groupname = item.groupname;
                    itemData.number = item.number;
                    itemData.anumber = item.anumber;
                    itemData.children = item.son;
                    itemData.headimg = item.headimg;
                    yearuserscoreNum.push(itemData);
                  });
                  yearuserscoreNum.sort(function(a, b) {
                      var value1 = a.number;
                      var value2 = b.number;
                      return value2 - value1;
                  });
                  $this.currentCluesData.yearuserscoreNum = yearuserscoreNum;
                }else{
                  $this.currentCluesData.yearuserscoreNum=[];
                }
                $this.$nextTick(() => {
                    $this.yearuserChart();
                })
            }
            $this.currentCluesData.DeparData.forEach(function(item,index){
              item.disabled=false;
            });
          } else {
            $this.$message({
              showClose: true,
              message: response.info,
              type: "error",
            });
          }
        }
      });
    },
    // 获取地区目标询盘数据
    drawDepartTarget(){
      var $this = this;
      if($this.radialBarPlot&&!$this.radialBarPlot.chart.destroyed){
        $this.radialBarPlot.changeData($this.depDayTarget);
      }else{
        var resultData =$this.depDayTarget;
        var maxnum = 0;
        for(var i = 0;i<resultData.length;i++){
          for(var key in resultData[i]){
            if(key != 'id' && typeof(resultData[i][key]) == 'number' && resultData[i][key]>maxnum){
              maxnum = resultData[i][key]
            }
          }
        }
        for(var i = 0;i<resultData.length;i++){
          if(resultData[i].searchdaynumber){
            resultData[i].values = [resultData[i].searchdaynumber,resultData[i].daynumber]
          }else{
            resultData[i].values = [0,resultData[i].daynumber]
          }
        }
        const radialBarPlot = new Mix('radialBarChart', {
          appendPadding: 8,
          syncViewPadding: true,          
          tooltip: { 
            shared: true ,
            customItems: (originalItems) => {
                for(let i=0;i<originalItems.length;i++){
                  if(originalItems[i].name == 'values'){
                    originalItems[i].name = '询盘数量';
                    originalItems[i].value = originalItems[i].value.split('-')[1];
                  }
                }
                return originalItems;
            },
          },
          legend:{
            position: 'bottom',
            items:[
              {
                name:"目标询盘",
                value:"目标询盘",
                marker: { symbol: 'square', style: { fill: '#5B8FF9', r: 5 } },
              },
              {
                name:"目标询盘",
                value:"目标询盘",
                marker: { symbol: 'square', style: { fill: '#5B8FF9', r: 5 } },
              }
            ]
          },
          height:230,
          plots:[
            {//目标柱状图
               type: 'column',
                options: {
                    data: resultData,
                    xField: 'departname',
                    yField: 'daytargetnumber',
                    minColumnWidth:20,
                    maxColumnWidth:25,
                    xAxis: {
                      label: {
                        autoHide: true,
                        autoRotate: false,
                        style: {
                          fill: '#666666',
                          opacity: 0.6,
                        },
                      },
                    },
                    yAxis: {
                      grid: {
                        line: {
                          style: {
                            stroke: '#cccccc',
                            lineWidth: 1,
                            lineDash: [3, 2],
                            strokeOpacity: 0.3,
                            shadowColor: null,
                            shadowBlur: 0,
                            shadowOffsetX:0,
                            shadowOffsetY:0,
                          }
                        }
                      },
                      max: maxnum + 10,
                    },
                    columnStyle:{
                      fill:'#e7f1ff',
                    },
                    color:'#e7f1ff',
                    columnWidthRatio:0.5,
                    meta: {
                        daytargetnumber: {
                            alias: '目标询盘',
                        },
                    },
                },
            },
            {//搜索柱状图
               type: 'column',
                options: {
                    data: resultData,
                    xField: 'departname',
                    yField: 'searchdaynumber',
                    xAxis:false,
                    yAxis: {
                      grid: {
                        line: {
                          style: {
                            stroke: '#cccccc',
                            lineWidth: 1,
                            lineDash: [3, 2],
                            strokeOpacity: 0,
                            shadowColor: null,
                            shadowBlur: 0,
                            shadowOffsetX:0,
                            shadowOffsetY:0,
                          }
                        }
                      },
                      max: maxnum + 10,
                    },
                    minColumnWidth:20,
                    maxColumnWidth:25,
                    columnStyle:{
                      fill:'#2e88ff',
                    },
                    columnWidthRatio:0.4,
                    meta: {
                        searchdaynumber: {
                            alias: '搜索询盘',
                        },
                    },
                    label:{
                      style: {
                        fill: '#FFFFFF',
                      },
                      position: 'middle', 
                      content:(item)=>{
                        if(item.searchdaynumber>0){
                          return item.searchdaynumber
                        }
                      }
                    }
                },
            },
            {//非搜索区间柱状图
                type: 'column',
                options: {
                    data: resultData,
                    isRange: true,
                    xField: 'departname',
                    yField: 'values',
                    xAxis:false,
                    yAxis: {
                      grid: {
                        line: {
                          style: {
                            stroke: '#cccccc',
                            lineWidth: 1,
                            lineDash: [3, 2],
                            strokeOpacity: 0,
                            shadowColor: null,
                            shadowBlur: 0,
                            shadowOffsetX:0,
                            shadowOffsetY:0,
                          }
                        }
                      },
                      max: maxnum + 10,
                    },
                    minColumnWidth:20,
                    maxColumnWidth:25,
                    color:'#59cab6',
                    columnStyle:(item)=>{
                      for(let i = 0;i<resultData.length;i++){
                        if(resultData[i].departname == item.departname){
                          if(resultData[i].daynumber>=resultData[i].daytargetnumber){
                            return {
                              fill:'#f38080'
                            }
                          }else{
                            return {
                              fill:'#59cab6'
                            }
                          }
                        }
                      }
                    },
                    columnWidthRatio:0.4,
                    label:{
                      style: {
                        fill: '#FFFFFF',
                      },
                      position: 'middle', 
                      content:(item)=>{
                        if(item.daynumber>0){
                          return item.daynumber
                        }
                      }
                    }
                },
            },
            {//历史最高折线图
               type: 'line',
                options: {
                    data: resultData,
                    xField: 'departname',
                    yField: 'historymaxnumber',
                    xAxis:false,
                    yAxis: {
                      grid: {
                        line: {
                          style: {
                            stroke: '#cccccc',
                            lineWidth: 1,
                            lineDash: [3, 2],
                            strokeOpacity: 0,
                            shadowColor: null,
                            shadowBlur: 0,
                            shadowOffsetX:0,
                            shadowOffsetY:0,
                          }
                        }
                      },
                      max: maxnum + 10,
                    },
                    color:'#f38080',
                    meta: {
                        historymaxnumber: {
                            alias: '历史最高',
                        },
                    },
                    label: {
                      position: 'top',
                    },
                    
                },
            },
            {//本月最高折线图
               type: 'line',
                options: {
                    data: resultData,
                    xField: 'departname',
                    yField: 'monthmaxnumber',
                    xAxis:false,
                    yAxis: {
                      grid: {
                        line: {
                          style: {
                            stroke: '#cccccc',
                            lineWidth: 1,
                            lineDash: [3, 2],
                            strokeOpacity: 0,
                            shadowColor: null,
                            shadowBlur: 0,
                            shadowOffsetX:0,
                            shadowOffsetY:0,
                          }
                        }
                      },
                      max: maxnum + 10,
                    },
                    color:'#fcb030',
                    meta: {
                        monthmaxnumber: {
                            alias: '本月最高',
                        },
                    },
                },
            },
          ]
        });
        
        $this.radialBarPlot = radialBarPlot;
        radialBarPlot.render();
      }
    },
    // 获取中文地区统计数据
    getCnCluesRegionStatData(){
      var $this = this;
      var resultData = {};
      if($this.mapDate&&$this.mapDate.length>0){
        resultData.starttime = $this.mapDate[0];
        resultData.endtime = $this.mapDate[1];
      }else{
        resultData.starttime = "";
        resultData.endtime = "";
      }
      if($this.currentCluesData.departID&&$this.currentCluesData.departID.length>0){
        resultData.dept_id = $this.currentCluesData.departID;
      }else{
        resultData.dept_id = [];
      }
      if($this.worldRegionMapChart&&!$this.worldRegionMapChart.destroyed){
        $this.worldRegionMapChart.destroy();
      }
      if($this.regionMapChart&&!$this.regionMapChart.destroyed){
        $this.regionMapChart.destroy();
      }
      if($this.pieSourcePlot&&!$this.pieSourcePlot.chart.destroyed){
        $this.pieSourcePlot.chart.destroy();
      }
      $this.$store.dispatch("api/cnCluesRegionStatDataAction", resultData).then((response) => {
        if (response) {
          //console.log(response,'中文地图')
          if (response.status) {
            $this.currentCluesData.cluesRegionData = response.data;
            var topTenRegionData = [];
            response.data.forEach(function(item,index){
              if(index<10){
                topTenRegionData.push(item);
              }
            });
            topTenRegionData.sort(function(a, b) {
                var value1 = a.number;
                var value2 = b.number;
                return value2 - value1;
            });
            $this.currentCluesData.topTenRegionData = topTenRegionData;
            $this.drawCnCluesRegionChart();
            $this.drawTopTen();
          } else {
            $this.$message({
              showClose: true,
              message: response.info,
              type: "error",
            });
          }
        }
      });
    },    
    // 中文地区询盘地图
    drawCnCluesRegionChart(){
      var $this = this;
      if($this.currentCluesData.cluesRegionData.length>0){   
        fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/china-provinces.geo.json')
        .then(res => res.json())
        .then(GeoJSON => {
          const regionMapChart = new G2.Chart({
            container: 'regionMapChart',
            width:600,
            height:380,
          });
          regionMapChart.scale({
            latitude: { sync: true },
            longitude: { sync: true }
          });
          regionMapChart.tooltip({
            showTitle: false,
            showMarkers: false,
            shared: true,
          });
          // 同步度量
          regionMapChart.scale({
            longitude: {
              sync: true
            },
            latitude: {
              sync: true
            }
          });
          regionMapChart.axis(false);
          regionMapChart.legend('trend', {
            position: 'left',
          });
          // 绘制中国地图背景
          var ds = new DataSet();
          const geoDv = ds.createView('back').source(GeoJSON, {type: 'GeoJSON'});
          const geoView = regionMapChart.createView();
          geoView.data(geoDv.rows);
          geoView.tooltip(false);
          geoView.polygon()
            .position('longitude*latitude')
            .color('grey')
            .style({
              fill: '#fff',
              stroke: '#ccc',
              lineWidth: 1,
            });
          // 可视化用户数据
          const userData = [];
          $this.currentCluesData.cluesRegionData.forEach(function(item,index){
            var itemData = {};
            itemData.name = item.name;
            itemData.number = item.number;
            userData.push(itemData);
          });
          const userDv = ds.createView().source(userData).transform({
            // sizeByCount: true,
            geoDataView: geoDv,
            field: 'name',
            type: 'geo.region',
            as: ['longitude', 'latitude']
          }).transform({
            type: 'map',
            callback: obj => {
              if(obj.number <10){
                  obj.trend="0-10";
              }else if(obj.number <20 && obj.number>=10){
                  obj.trend="10-20";
              }else if(obj.number <30 && obj.number>=20){
                  obj.trend="20-30";
              }else if(obj.number <40 && obj.number>=30){
                  obj.trend="30-40";
              }else if(obj.number <50 && obj.number>=40){
                  obj.trend="40-50";
              }else if(obj.number <60 && obj.number>=50){
                  obj.trend="50-60";
              }else if(obj.number <100 && obj.number>=60){
                  obj.trend="60-100";
              }else if(obj.number <300 && obj.number>=100){
                  obj.trend="100-300";
              }else if(obj.number <500 && obj.number>=300){
                  obj.trend="300-500";
              }else if(obj.number <800 && obj.number>=500){
                  obj.trend="500-800";
              }else{
                  obj.trend="大于800";
              }
              return obj;
            }
          });
          const userView = regionMapChart.createView();
          userView.data(userDv.rows);
          userView.scale({
            number: {
              alias: '数量'
            },
            name:{
              alias:"地区"
            }
          });
          userView.polygon()
            .position('longitude*latitude')
            .color('trend', '#0050B3-#1890FF-#BAE7FF')
            //.color('trend', ['#c9311c', '#f85f23', '#f0a861', '#a7c67e', '#c2e8b7'])
            .tooltip('name*number')
            .style({
              fillOpacity: 0.85
            }).animate({
              leave: {
                animation: 'fade-out'
              }
            });
          userView.interaction('element-active');
          $this.regionMapChart = regionMapChart;
          regionMapChart.render();
        });
      }
    },
    // 热门地区TOP10
    drawTopTen(){
      var $this = this;
      if($this.currentCluesData.topTenRegionData.length>0){
        if($this.pieSourcePlot&&!$this.pieSourcePlot.chart.destroyed){
          $this.pieSourcePlot.changeData($this.currentCluesData.topTenRegionData);
        }else{
          const pieSourcePlot = new Bar('topTen', {
            data:$this.currentCluesData.topTenRegionData,
            xField: 'number',
            yField: 'name',
            seriesField: 'name',
            barWidthRatio: 0.4,
            height:340,
            legend: false,
            xAxis:false,
            color:['#cbebfc','#bae7ff','#92d1ff','#69bcff','#41a6ff','#1890ff','#1280ec','#0c70d9','#0660c6','#0050b3'],
            label: {
              style: {
                fill: '#999999',
                opacity: 1,
                fontSize: 12
              },
              position: 'right',
              offset:10,
            },
            meta: {
              name: {
                alias: '地区',
              },
              number: {
                alias: '数量',
              },
            },
          });
          $this.pieSourcePlot = pieSourcePlot;
          pieSourcePlot.render();
        }
      }
    },
    // 月询盘数据图
    monthtongChart(){
      var $this = this;
      if($this.currentCluesData.monthtongArr.length>0){
          if($this.monthtongArea&&!$this.monthtongArea.chart.destroyed){
            $this.monthtongArea.changeData($this.currentCluesData.monthtongArr);
          }else{
            const monthtongArea = new Area('rowOneThreeArea', {
              data:$this.currentCluesData.monthtongArr,
              xField: 'date',
              yField: 'xunnumber',
              height:100,
              xAxis: {
                //type: 'date',
                mask: 'MM',
                range: [0, 1],
                //tickCount: 6,
              },
              yAxis:false,
              tooltip: {
                formatter:(datum) => {
                    return { name:datum.date+'月总询盘',value:datum.xunnumber };
                }
              },
              areaStyle: () => {
                return {
                  fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
                };
              },
            });
            $this.monthtongArea = monthtongArea;
            monthtongArea.render();
          }
      }
    },
    // 近30天询盘统计趋势图
    drawAreaTrendChart(){
      var $this = this;
      if($this.currentCluesData.chartData.length>0){
          if($this.areaTrendPlot&&!$this.areaTrendPlot.chart.destroyed){
            $this.areaTrendPlot.changeData($this.currentCluesData.chartData);
          }else{
            const areaTrendPlot = new Area('cluesChart', {
              data:$this.currentCluesData.chartData,    
              xField: 'date',
              yField: 'xunnumber',
              seriesField: 'title',
              color: ['#6b9afa', '#316afa'],
              areaStyle: () => {
                return {
                  fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
                };
              },
              appendPadding:[15,15,15,15],
              height: 370,
              smooth:false,
              yAxis: {
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
              // label
              label: {
                layout: [{ type: 'hide-overlap' }], // 隐藏重叠label
                style: {
                  textAlign: 'right',
                  color:'#9e9e9e',
                  fontsize:12,
                },
                formatter: (item) => item.xunnumber,
              },
              // 自定义 legend
              legend: {
                custom: true,
                position: 'bottom',
                items: [
                  {
                    value: '搜索询盘',
                    name: '搜索询盘',
                    marker: { symbol: 'square', style: { fill: '#5B8FF9', r: 5 } },
                  },
                  {
                    value: '总询盘',
                    name: '总询盘',
                    marker: { symbol: 'square', style: { fill: '#3D76DD', r: 5 } },
                  },
                  {
                    value: '平均值',
                    name: '平均值',
                    marker: { symbol: 'line', style: { stroke: '#f16b6b', r: 5 } },
                  },
                  {
                    value: '目标值',
                    name: '目标值',
                    marker: { symbol: 'line', style: { stroke: '#6aa343', r: 5 } },
                  },
                ],
              },
              point: {
                shape: ({ title }) => {
                  return title === 'circle';
                },
                style: ({ date }) => {
                  return {
                    r: Number(date) % 4 ? 0 : 3, // 4 个数据示一个点标记
                  };
                },
              },
              tooltip: {
                formatter: (datum) => {
                  return { name: datum.title, value: datum.xunnumber };
                },
                title:(e)=>{
                  return e.replace(/\n/g," ")
                }
              },
              annotations: [
                // 平均值
                {
                  type: 'line',
                  start: ['min', $this.currentCluesData.avgChartNum],
                  end: ['max', $this.currentCluesData.avgChartNum],
                  top:true,
                  offsetY: 0,
                  offsetX: 0,
                  style: {
                    stroke: '#f16b6b',
                    lineDash: [6, 4],
                    lineWidth: 1,
                  },
                },
                // 平均值
                {
                  type: 'html',
                  position:['max',$this.currentCluesData.avgChartNum],
                  top:true,
                  html:"<span class='chart-font avg'><span class='txt-font'>"+$this.currentCluesData.avgChartNum+"</span><i></i></span>",
                  alignX:"left",
                  alignY:"bottom",
                },
                // 目标线
                {
                  type: 'line',
                  start: ['min', $this.currentCluesData.targetNum],
                  end: ['max', $this.currentCluesData.targetNum],
                  top:true,
                  offsetY: 0,
                  offsetX: 0,
                  style: {
                    stroke: '#6aa343',
                    lineWidth: 1,
                  },
                },
                // 目标线
                {
                  type: 'html',
                  position:['max',$this.currentCluesData.targetNum],
                  top:true,
                  html:"<span class='chart-font target'><span class='txt-font'>"+$this.currentCluesData.targetNum+"</span><i></i></span>",
                  alignX:"left",
                  alignY:"bottom",
                },
              ],
            });
            $this.areaTrendPlot = areaTrendPlot;
            areaTrendPlot.render();
          }
      }
    },
    //判断浮点数
    isFloat(num){
      if (!isNaN(num) && num % 1 !== 0) {        
        return true;
      } else {       
        return false;
      } 
    },
    // 成本均价排行
    costAverageChart(){
      var $this = this;
      if($this.costAverageData&&!$this.costAverageData.chart.destroyed){
        $this.costAverageData.changeData($this.currentCluesData.costAverage);
      }else{
        const costAverageData = new Column('costAverageChart', {
          data:$this.currentCluesData.costAverage,
          xField: 'departname',
          yField: 'avgallmoney',
          height:347,
          color: '#81a8f1',
          label: {
            position: 'top', 
            // 配置样式
            style: {
              fill: '#333333',
              fontSize:13
            },
          },
          xAxis: {
            label: {
              autoHide: true,
              autoRotate: false,
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
      }
    },
    // 中文年度成交积分
    yeardepartscoreChart(){
      var $this = this;
      if($this.yeardepartscoreData&&!$this.yeardepartscoreData.chart.destroyed){
        $this.yeardepartscoreData.changeData($this.currentCluesData.yeardepartscoreArr);
      }else{     
        var data=$this.currentCluesData.yeardepartscoreArr;
        const yeardepartscoreData = new Pie('yeardepartscoreChart', {
          data,
          angleField: 'score',
          colorField: 'departname',
          height:366,
          radius:0.7,
          innerRadius: 0.6,
          appendPadding: 10,
          meta: {
            score: {
              formatter: (v) => `${v}`,
            },
          },
          label: {
            type: 'inner',
            offset: '-50%',
            autoRotate: false,
            style: { textAlign: 'center' },
            formatter: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
          },
          legend: {
            position: 'left',  
            itemName: {
              formatter(text, item, index) {
                if (data) {
                  return (
                    text +
                    '：' +
                    data[index].score.toFixed(2)
                  )
                }
                return
              }
            }
          },
          statistic: {
            title: false,
            content: {
              style: {
                fontSize:'14',
                whiteSpace: 'pre-wrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
              content: '部门\n成交占比',
            },
          },
          // 添加 中心统计文本 交互
          interactions: [
            { type: 'element-selected' },
            { type: 'element-active' },
          ],
        });
        $this.yeardepartscoreData = yeardepartscoreData;
        yeardepartscoreData.render();
      }
    },
    // 年度同期询盘对比
    registerChart(){
      var $this = this;
      if($this.registerData&&!$this.registerData.chart.destroyed){
        $this.registerData.changeData($this.currentCluesData.registerArr);
      }else{
        // 自定义图形
        G2.registerShape('interval', 'registerData', {
          draw(info, container) {
            const { points, style, defaultStyle = {} } = info;
            let path = [
              ['M', points[0].x, points[0].y],
              ['L', (points[1].x + points[2].x) / 2, points[1].y],
              ['L', points[3].x, points[3].y],
              ['Z'],
            ];
            path = this.parsePath(path);
            return container.addShape('path', {
              attrs: {
                path,
                ...defaultStyle,
                ...style,
              },
            });
          },
        });
        // 1. 定义配置
        const defaultOptions = {
          columnWidthRatio: 1.2,
        };
        // 2. adaptor 实现
        function adaptor(params) {
          const { chart, options } = params;
          const { data, xField, yField, columnWidthRatio, columnStyle, theme } = options;
          // 数据
          chart.data($this.currentCluesData.registerArr);
          // 几何图形
          const i = chart
            .interval()
            .position(`${xField}*${yField}`)
            .shape('registerData')
            .style(`${xField}*${yField}`, (x, y) => {
              return typeof columnStyle === 'function' ? columnStyle({ [xField]: x, [yField]: y }) : columnStyle;
            });

          // 设置重叠比率
          chart.theme(
            deepMix({}, isObject(theme) ? theme : G2.getTheme(theme), {
              columnWidthRatio: columnWidthRatio,
            })
          );
          const gap = (1 / data.length / 2) * columnWidthRatio;// 左右预留
          chart.axis('value', false);
          chart.scale({
            year: {
              range: [gap, 1 - gap],
            },
          });
          return params;
        }
        // 3. G2Plot 上使用
        const registerData = new P('registerChart',{
            data:$this.currentCluesData.registerArr,
            appendPadding: 16,
            xField: 'year',
            yField: 'value',
            xAxis:false,
            yAxis:false,
            columnStyle: {
              fillOpacity: 0.3,
            },
          },
          adaptor,
          defaultOptions
        );
        $this.registerData = registerData;
        registerData.render();
      }
    },
    // 年度成交积分对比
    yearscoretongChart(){
      var $this = this;
      if($this.currentCluesData.yearscoretongArr.length>0){
          if($this.yearscoretongData&&!$this.yearscoretongData.chart.destroyed){
            $this.yearscoretongData.changeData($this.currentCluesData.yearscoretongArr);
          }else{
            const yearscoretongData = new Line('yearscoretongChart', {
              data:$this.currentCluesData.yearscoretongArr,
              xField: 'month',
              yField: 'value',
              seriesField: 'year',
              yAxis: {
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
              seriesField: 'year',
              color: ({ year }) => {
                return year === '2020' ? '#fbd266' : '#6392ec';
              },
              lineStyle: ({ year }) => {
                if (year === '2020') {
                  return {
                    lineDash: [4, 4],
                    opacity: 1,
                  };
                }
                return {
                  opacity: 0.5,
                };
              },
            });
            $this.yearscoretongData = yearscoretongData;
            yearscoretongData.render();
            var hoverData = [];
            yearscoretongData.on('tooltip:change', ev => {
              hoverData=ev.data.items;
            })
            yearscoretongData.on('plot:click', ev => {
              console.log(hoverData,'hoverData');
              var mouth=hoverData[0].data.month.replace('月','');
              var sametimeArr=[];
              var registerObj={
                year:hoverData[0].data.year,
                value:0,
              };        
              var lastregisterObj={
                year:hoverData[1].data.year,
                value:0,
              };
              var sametimeGrowth='';
              var sametimeRate='';
              $this.currentCluesData.yearscoretongArr.forEach(function(item,index){
                  if(item.month.replace('月','')<mouth||item.month.replace('月','')==mouth){
                    //年度同期询盘对比
                    if(registerObj.year==item.year){
                       registerObj.value=registerObj.value+Number(item.value);
                    }else{
                      lastregisterObj.value=lastregisterObj.value+Number(item.value);
                    } 
                  }
              });                            
              var MaxValue='';
              if(Number(registerObj.value)>=Number(lastregisterObj.value)){
                MaxValue=Number(registerObj.value);
              }else{
                MaxValue=Number(lastregisterObj.value);
              }
              if(MaxValue==0){
                lastregisterObj.percen='0%';
                registerObj.percen='0%';
              }else{
                  lastregisterObj.percen=(Number(lastregisterObj.value)/MaxValue*100).toFixed(2)+'%';
                  registerObj.percen=(Number(registerObj.value)/MaxValue*100).toFixed(2)+'%';
              }
              sametimeArr.push(registerObj,lastregisterObj);
              $this.currentCluesData.sametimeArr = sametimeArr;

              if(registerObj.year>lastregisterObj.year){
                  sametimeGrowth=registerObj.value-lastregisterObj.value;
                  if(lastregisterObj.value==0){
                    sametimeRate=registerObj.value.toFixed(2)+'%';
                  }else{
                    sametimeRate=(Math.abs(registerObj.value-lastregisterObj.value)/lastregisterObj.value*100).toFixed(2)+'%';
                  }
              }else{
                  sametimeGrowth=lastregisterObj.value-registerObj.value;
                  if(registerObj.value==0){
                    sametimeRate=(lastregisterObj.value).toFixed(2)+'%';
                  }else{
                    sametimeRate=(Math.abs(lastregisterObj.value-registerObj.value)/registerObj.value*100).toFixed(2)+'%';
                  }
              }
              $this.currentCluesData.sametimeGrowth=sametimeGrowth;
              $this.currentCluesData.sametimeRate=sametimeRate;
              $this.registerChart();
            });
          }
      }
    },
    // 年度询盘对比
    yeartongChart(){
      var $this = this;
      if($this.currentCluesData.yeartongArr.length>0){
          if($this.yeartongData&&!$this.yeartongData.chart.destroyed){
            $this.yeartongData.changeData($this.currentCluesData.yeartongArr);
          }else{
            const yeartongData = new Line('yeartongChart', {
              data:$this.currentCluesData.yeartongArr,
              xField: 'month',
              yField: 'value',
              seriesField: 'year',
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
              seriesField: 'year',
              color: ({ year }) => {
                return year === '2020' ? '#fbd266' : '#6392ec';
              },
              lineStyle: ({ year }) => {
                if (year === '2020') {
                  return {
                    lineDash: [4, 4],
                    opacity: 1,
                  };
                }
                return {
                  opacity: 0.5,
                };
              },
            });
            $this.yeartongData = yeartongData;
            yeartongData.render();
            var hoverData = [];
            yeartongData.on('tooltip:change', ev => {
              hoverData=ev.data.items;
            })
            yeartongData.on('plot:click', ev => {
              console.log(hoverData,'hoverData');
              var mouth=hoverData[0].data.month.replace('月','');
              var registerArr=[];
              var registerObj={
                year:hoverData[0].data.year,
                value:0,
              };        
              var lastregisterObj={
                year:hoverData[1].data.year,
                value:0,
              };
              $this.currentCluesData.yeartongArr.forEach(function(item,index){
                  if(item.month.replace('月','')<mouth||item.month.replace('月','')==mouth){
                    //年度同期询盘对比
                    if(registerObj.year==item.year){
                       registerObj.value=registerObj.value+item.value;
                    }else{
                      lastregisterObj.value=lastregisterObj.value+item.value;
                    } 
                  }
              });
              registerArr.push(registerObj,lastregisterObj);
              $this.currentCluesData.registerArr = registerArr;
              var registerGrowth='';
              var registerRate='';
              if(registerObj.year>=lastregisterObj.year){
                registerGrowth=registerObj.value-lastregisterObj.value;
                registerRate=Math.abs(((registerObj.value-lastregisterObj.value)/lastregisterObj.value*100).toFixed(2))+'%';
              }else{
                registerGrowth=lastregisterObj.value-registerObj.value;
                registerRate=Math.abs(((lastregisterObj.value-registerObj.value)/registerObj.value*100).toFixed(2))+'%';
              }
              $this.currentCluesData.registerGrowth=registerGrowth;
              $this.currentCluesData.registerRate=registerRate;
              $this.registerChart();
            });
          }
      }
    },
    // 日询盘
    zugroupdayChart(){
      var $this = this;
      if($this.currentCluesData.zugroupdayArr.length>0){
          if($this.zugroupdayColumn&&!$this.zugroupdayColumn.chart.destroyed){
            $this.zugroupdayColumn.changeData($this.currentCluesData.zugroupdayArr);
          }else{
            const zugroupdayColumn = new Column('zugroupdayChart', {
              data:$this.currentCluesData.zugroupdayArr,
              isGroup: true,
              xField: 'name',
              yField: 'number',
              seriesField: 'title',
              width: 500,
              height: 300,
              color: ['#669aff', '#9dd5ff'],
              marginRatio: 0,
              yAxis: {
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
              label: {
                position: 'top',
                layout: [
                  { type: 'interval-hide-overlap' },
                  { type: 'adjust-color' },
                ],
              },
            });
            $this.zugroupdayColumn = zugroupdayColumn;
            zugroupdayColumn.render();
          }
      }
    },
    // 月询盘
    zugroupmonthChart(){
      var $this = this;
      if($this.currentCluesData.zugoupmonthArr.length>0){
          if($this.zugoupmonthColumn&&!$this.zugoupmonthColumn.chart.destroyed){
            $this.zugoupmonthColumn.changeData($this.currentCluesData.zugoupmonthArr);
          }else{
            const zugoupmonthColumn = new Column('zugroupmonthChart', {
              data:$this.currentCluesData.zugoupmonthArr,
              isGroup: true,
              xField: 'name',
              yField: 'number',
              seriesField: 'title',
              width: 500,
              height: 300,
              /** 设置颜色 */
              color: ['#fcb030', '#f7c572'],
              /** 设置间距 */
              marginRatio: 0,
              yAxis: {
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
              label: {
                // 可手动配置 label 数据标签位置
                position: 'top', // 'top', 'middle', 'bottom'
                offset: 4,
                // 可配置附加的布局方法
                layout: [
                  // 数据标签防遮挡
                  { type: 'interval-hide-overlap' },
                  // 数据标签文颜色自动调整
                  { type: 'adjust-color' },
                ],
              },
            });
            $this.zugoupmonthColumn = zugoupmonthColumn;
            zugoupmonthColumn.render();
          }
      }
    },
    // 首页中文成交统计数据
    getCnDepartScore(){
      var $this = this;
      $this.currentCluesData.departScoreData=[];
      var resultData = {};
      if($this.ScoreTime&&$this.ScoreTime!=''){
        resultData.month=$this.ScoreTime;
      }else{
        resultData.month='';
      }
      var resUrl='';
      if($this.language=="Module_cnStat"){
        resUrl='api/departScoreAction';
      }else{
        resUrl='api/endepartScoreAction';
      }  
      $this.$store.dispatch(resUrl, resultData).then((response) => {
          //console.log(response,'首页中文成交统计接口')
          if (response.status) {
              $this.ScoreTime=response.month;
              if(response.departscore&&response.departscore.length>0){
                 var departscoreArr=[];
                 response.departscore.forEach(function(item,index){
                    var itemDate={};
                    itemDate.departname=item.departname;
                    if(item.passnumber==null||item.passnumber==0||item.passnumber==''){
                      itemDate.passnumber=0;
                    }else{
                      itemDate.passnumber=item.passnumber;
                    }
                    if(item.mediumnumber==null||item.mediumnumber==0||item.mediumnumber==''){
                      itemDate.mediumnumber=0;
                    }else{
                      itemDate.mediumnumber=item.mediumnumber;
                    }
                    if(item.goodnumber==null||item.goodnumber==0||item.goodnumber==''){
                      itemDate.goodnumber=0;
                    }else{
                      itemDate.goodnumber=item.goodnumber;
                    }
                    if(item.a_number==null||item.a_number==0||item.a_number==''){
                      itemDate.a_number=0;
                    }else{
                      itemDate.a_number=item.a_number;
                    }
                    if(item.snumber==null||item.snumber==0||item.snumber==''){
                      itemDate.snumber=0;
                    }else{
                      itemDate.snumber=item.snumber;
                    }
                    if(item.score==null||item.score==0||item.score==''){
                      itemDate.score=0;
                    }else{
                      itemDate.score=item.score;
                    }
                    departscoreArr.push(itemDate);
                 });
                 departscoreArr.sort(function(a, b) {
                      var value1 = a.score;
                      var value2 = b.score;
                      return value2 - value1;
                 });
                 $this.currentCluesData.departScoreData = departscoreArr;
              }else{
                  $this.yearuserChart=null;
                  if($this.yearuserChart&&!$this.yearuserChart.chart.destroyed){
                    $this.yearuserChart.chart.destroy();
                  }
              }
              var scoreArr=[];
              var goodnumberArr=[];
              var Maxscore='';
              var Maxgoodnumber='';
              if($this.currentCluesData.departID&&$this.currentCluesData.departID.length>0){
                if($this.currentCluesData.departID.length==$this.currentCluesData.DeparData.length){
                  if(response.departscore&&response.departscore.length>0){
                    response.departscore.forEach(function(item){
                        scoreArr.push(item.score);
                        goodnumberArr.push(item.goodnumber);
                    });
                    scoreArr.forEach(function(item){
                      if(item>Maxscore){
                        Maxscore=item;
                      }
                    });
                    goodnumberArr.forEach(function(item){
                      if(item>Maxgoodnumber){
                        Maxgoodnumber=item;
                      }
                    });
                    if(Maxscore>Maxgoodnumber){
                      $this.ScoreData.MaxValue=Maxscore*1.1;
                    }else{
                      $this.ScoreData.MaxValue=Maxgoodnumber*1.1;
                    }
                  }
                  $this.ScoreData.allscore=response.allscore;
                  $this.ScoreData.allsnumber=response.allsnumber;
                  $this.ScoreData.addallscore=response.allscore;
                  $this.ScoreData.addallsnumber=response.allsnumber;
                  if(response.yeardepartscore&&response.yeardepartscore.length>0){                    
                      if($this.yeardepartscoreData&&!$this.yeardepartscoreData.chart.destroyed){
                        $this.yeardepartscoreData.chart.destroy();
                      }
                      var yeardepartscoreArr=[];
                      var departmentCost=[];
                      var costAverage=[];
                      var totalNumscore='';
                      response.yeardepartscore.forEach(function(item,index){
                          var departscoreObj={};
                          var departmentCostObj={};
                          var costAverageObj={};
                          departscoreObj.score=item.score;
                          departscoreObj.departname=item.departname.replace('电商','');
                          departscoreObj.percenter=item.percenter;
                          totalNumscore=Number(totalNumscore)+Number(item.score);
                          yeardepartscoreArr.push(departscoreObj);
                          //部门成本
                          departmentCostObj.departname=item.departname.replace('电商','');
                          departmentCostObj.score=parseFloat(item.score).toFixed(2);
                          departmentCostObj.allmoney=item.allmoney;
                          departmentCostObj.avgallmoney=item.avgallmoney;
                          departmentCostObj.moneyscore=item.moneyscore;
                          departmentCostObj.personmoney=item.personmoney;
                          departmentCostObj.paymoney=item.paymoney;
                          departmentCostObj.personnumber=item.personnumber;

                          departmentCost.push(departmentCostObj);

                          costAverageObj.departname=item.departname.replace('电商','');
                          costAverageObj.avgallmoney=item.avgallmoney;
                          costAverage.push(costAverageObj);
                      });
                      $this.currentCluesData.yeardepartscoreArr=yeardepartscoreArr;
                      $this.currentCluesData.totalNumscore=totalNumscore.toFixed(2);
                      $this.yeardepartscoreChart();
                      //部门成本
                      costAverage.sort(function(a, b) {
                            var value1 = a.avgallmoney;
                            var value2 = b.avgallmoney;
                            return value1 - value2;
                      });
                      $this.currentCluesData.costAverage=costAverage;
                      //部门成本均价排行
                      $this.currentCluesData.departmentCost=departmentCost;
                      $this.costAverageChart();
                  }
                }else{
                   if(response.departscore&&response.departscore.length>0){
                     var tolScore=0;
                     var tolNumber=0;
                     $this.currentCluesData.departID.forEach(function(item,index){
                       response.departscore.forEach(function(items,indexs){
                           if(item==items.id){
                              if(items.score==null||items.score==0||items.score==''){
                                items.score=0;
                              }
                              if(items.snumber==null||items.snumber==0||items.snumber==''){
                                items.snumber=0;
                              }
                              tolScore=tolScore+parseFloat(items.score);
                              tolNumber=tolNumber+parseFloat(items.snumber);
                           }
                       });
                     });
                      $this.ScoreData.allscore=response.allscore;
                      $this.ScoreData.allsnumber=response.allsnumber;
                      $this.ScoreData.addallscore=parseFloat(tolScore).toFixed(2);
                      $this.ScoreData.addallsnumber=parseFloat(tolNumber).toFixed(2);
                      $this.ScoreData.allsnumberPercen=(parseFloat(tolNumber)/response.allsnumber*100).toFixed(2)+'%';
                      $this.ScoreData.allscorePercen=(parseFloat(tolScore)/response.allscore*100).toFixed(2)+'%';
                   }
                }
              }else{
                  if(response.departscore&&response.departscore.length>0){
                    response.departscore.forEach(function(item){
                        scoreArr.push(item.score);
                        goodnumberArr.push(item.goodnumber);
                    });
                    scoreArr.forEach(function(item){
                      if(item>Maxscore){
                        Maxscore=item;
                      }
                    });
                    goodnumberArr.forEach(function(item){
                      if(item>Maxgoodnumber){
                        Maxgoodnumber=item;
                      }
                    });
                    if(Maxscore>Maxgoodnumber){
                      $this.ScoreData.MaxValue=Maxscore*1.1;
                    }else{
                      $this.ScoreData.MaxValue=Maxgoodnumber*1.1;
                    }
                  }
                  $this.ScoreData.allscore=response.allscore;
                  $this.ScoreData.allsnumber=response.allsnumber;
                  $this.ScoreData.addallscore=response.allscore;
                  $this.ScoreData.addallsnumber=response.allsnumber;
                  if(response.yeardepartscore&&response.yeardepartscore.length>0){                 
                      if($this.yeardepartscoreData&&!$this.yeardepartscoreData.chart.destroyed){
                        $this.yeardepartscoreData.chart.destroy();
                      }
                      var yeardepartscoreArr=[];
                      var departmentCost=[];
                      var costAverage=[];
                      var totalNumscore='';
                      response.yeardepartscore.forEach(function(item,index){
                          var departscoreObj={};
                          var departmentCostObj={};
                          var costAverageObj={};
                          departscoreObj.score=item.score;
                          departscoreObj.departname=item.departname.replace('电商','');
                          departscoreObj.percenter=item.percenter;
                          totalNumscore=Number(totalNumscore)+Number(item.score);
                          yeardepartscoreArr.push(departscoreObj);
                          //部门成本
                          departmentCostObj.departname=item.departname.replace('电商','');
                          departmentCostObj.score=parseFloat(item.score).toFixed(2);
                          departmentCostObj.allmoney=item.allmoney;
                          departmentCostObj.avgallmoney=item.avgallmoney;
                          departmentCostObj.moneyscore=item.moneyscore;
                          departmentCostObj.personmoney=item.personmoney;
                          departmentCostObj.paymoney=item.paymoney;
                          departmentCostObj.personnumber=item.personnumber;

                          departmentCost.push(departmentCostObj);

                          costAverageObj.departname=item.departname.replace('电商','');
                          costAverageObj.avgallmoney=item.avgallmoney;
                          costAverage.push(costAverageObj);
                      });
                      $this.currentCluesData.yeardepartscoreArr=yeardepartscoreArr;
                      $this.currentCluesData.totalNumscore=totalNumscore.toFixed(2);
                      $this.yeardepartscoreChart();
                      //部门成本
                      costAverage.sort(function(a, b) {
                            var value1 = a.avgallmoney;
                            var value2 = b.avgallmoney;
                            return value1 - value2;
                      });
                      $this.currentCluesData.costAverage=costAverage;
                      //部门成本均价排行
                      $this.currentCluesData.departmentCost=departmentCost;
                      $this.costAverageChart();
                  }
              }
          } else {
            $this.$message({
              showClose: true,
              message: response.info,
              type: "error",
            });
          }
      });
    },
    // 成交统计月份选择
    monthChangeHandler(){
      var $this = this;
      $this.getCnDepartScore();
    },
    // 成交统计月份选择
    DaytargetHandler(){
      var $this = this;
      $this.groupcountArr=[];
      if($this.language=="Module_cnStat"){
        $this.cnDaytarget();
      }else{
        $this.enDaytarget();
      }      
    },
    // 获取英文地区统计数据
    getEnCluesRegionStatData(){
      var $this = this;
      var resultData = {};
      if($this.mapDate&&$this.mapDate.length>0){
        resultData.starttime = $this.mapDate[0];
        resultData.endtime = $this.mapDate[1];
      }else{
        resultData.starttime = "";
        resultData.endtime = "";
      }
      if($this.currentCluesData.departID&&$this.currentCluesData.departID.length>0){
        resultData.dept_id = $this.currentCluesData.departID;
      }else{
        resultData.dept_id = [];
      }
      if($this.worldRegionMapChart&&!$this.worldRegionMapChart.destroyed){
        $this.worldRegionMapChart.destroy();
      }
      if($this.regionMapChart&&!$this.regionMapChart.destroyed){
        $this.regionMapChart.destroy();
      }
      if($this.pieSourcePlot&&!$this.pieSourcePlot.chart.destroyed){
        $this.pieSourcePlot.chart.destroy();
      }
      $this.$store.dispatch("api/enCluesRegionStatDataAction", resultData).then((response) => {
        if (response) {
          //console.log(response,'英文地图')
          if (response.status) {
            $this.currentCluesData.cluesRegionData = worldCountry(response.data);
            $this.currentCluesData.cluesRegionData.sort($this.sortNumber);
            var topTenRegionData = [];
            $this.currentCluesData.cluesRegionData.forEach(function(item,index){
              if(index<10){
                topTenRegionData.push(item);
              }
            });
            topTenRegionData.sort(function(a, b) {
                var value1 = a.number;
                var value2 = b.number;
                return value2 - value1;
            });
            $this.currentCluesData.topTenRegionData = topTenRegionData;
            $this.drawEnCluesRegionChart();
            $this.drawTopTen();
          } else {
            $this.$message({
              showClose: true,
              message: response.info,
              type: "error",
            });
          }
        }
      });
    },
    // 根据地区的询盘数量做降序排序
    sortNumber(a,b){
      return b.number - a.number;
    },
    // 英文地区询盘地图
    drawEnCluesRegionChart(){
      var $this = this;
      fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/world.geo.json')
      .then(res => res.json())
      .then(mapData => {
        const worldRegionMapChart = new G2.Chart({
          container: 'worldRegionMapChart',
          width: 800,
          height: 350,
        });
        worldRegionMapChart.tooltip({
          showTitle: false,
          showMarkers: false,
          shared: true,
        });
        // 同步度量
        worldRegionMapChart.scale({
          longitude: {
            sync: true
          },
          latitude: {
            sync: true
          }
        });
        worldRegionMapChart.axis(false);
        worldRegionMapChart.legend('trend', {
          position: 'left',
        });
        // 绘制世界地图背景
        var ds = new DataSet();
        const worldMap = ds.createView('back').source(mapData, {type: 'GeoJSON'});
        const worldMapView = worldRegionMapChart.createView();
        worldMapView.data(worldMap.rows);
        worldMapView.tooltip(false);
        worldMapView.polygon()
          .position('longitude*latitude')
          .color('grey')
          .style({
            fill: '#fff',
            stroke: '#ccc',
            lineWidth: 1,
          });
        // 可视化用户数据
        const userData = $this.currentCluesData.cluesRegionData;
        const userDv = ds.createView().source(userData).transform({
          // sizeByCount: true,
          geoDataView: worldMap,
          field: 'country',
          type: 'geo.region',
          as: ['longitude', 'latitude']
        }).transform({
          type: 'map',
          callback: obj => {
            if(obj.number <10){
                obj.trend="0-10";
            }else if(obj.number <20 && obj.number>=10){
                obj.trend="10-20";
            }else if(obj.number <30 && obj.number>=20){
                obj.trend="20-30";
            }else if(obj.number <40 && obj.number>=30){
                obj.trend="30-40";
            }else if(obj.number <50 && obj.number>=40){
                obj.trend="40-50";
            }else if(obj.number <60 && obj.number>=50){
                obj.trend="50-60";
            }else if(obj.number <100 && obj.number>=60){
                obj.trend="60-100";
            }else if(obj.number <300 && obj.number>=100){
                obj.trend="100-300";
            }else if(obj.number <500 && obj.number>=300){
                obj.trend="300-500";
            }else if(obj.number <800 && obj.number>=500){
                obj.trend="500-800";
            }else{
                obj.trend="大于800";
            }
            return obj;
          }
        });
        const userView = worldRegionMapChart.createView();
        userView.data(userDv.rows);
        userView.scale({
          number: {
            alias: '数量'
          },
          name:{
            alias:"国家"
          },
          country:{
            alias:"英文名"
          }
        });
        userView.polygon()
          .position('longitude*latitude')
          .color('trend', '#0050B3-#1890FF-#BAE7FF')
          .tooltip('name*country*number')
          .style({
            fillOpacity: 0.85
          }).animate({
            leave: {
              animation: 'fade-out'
            }
          });
        userView.interaction('element-active');
        $this.worldRegionMapChart = worldRegionMapChart;
        worldRegionMapChart.render();
      });
    },
    // 中文地区日期选择改变事件
    dateRangeChangeHandler(e){
      var $this = this;
      if($this.language=="Module_cnStat"){
        $this.getCnCluesRegionStatData();
      }else{
        $this.getEnCluesRegionStatData();
      }
    },
    // 获取今天时间
    getNearMonth(){
        var $this = this;
        const date = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        date.setTime(date.getTime());
        var monthDay = start.getFullYear()+"-"+(start.getMonth()+1>9?start.getMonth()+1:'0'+(start.getMonth()+1))+"-"+(start.getDate()+1>9?start.getDate():'0'+(start.getDate()));
        var today = date.getFullYear()+"-"+(date.getMonth()+1>9?date.getMonth()+1:'0'+(date.getMonth()+1))+"-"+(date.getDate()+1>9?date.getDate():'0'+(date.getDate()));
        $this.mapDate = [monthDay,today];
        $this.thisMonth=date.getFullYear()+"-"+(date.getMonth()+1>9?date.getMonth()+1:'0'+(date.getMonth()+1));
        $this.DaytargetTodayTime=today;
        $this.TodayMonth=date.getMonth()+1>9?date.getMonth()+1:'0'+(date.getMonth()+1);
    },
    renderStatistic(containerWidth, text, style) {
      const { width: textWidth, height: textHeight } = measureTextWidth(text, style);
      const R = containerWidth / 2;
      var scale = 1;
      if (containerWidth < textWidth) {
        scale = Math.min(Math.sqrt(Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)))), 1);
      }
      const textStyleStr = `width:${containerWidth}px;`;
      return `<div style="${textStyleStr};font-size:${scale}em;line-height:${scale < 1 ? 1 : 'inherit'};">${text}</div>`;
    },
    // 中文年度成交Top5
    yearuserChart(){
      var $this = this;
      if($this.useryearChart&&!$this.useryearChart.chart.destroyed){
        $this.currentCluesData.yearuserscoreNum.forEach(function(item,index){
            $this.useryearChart.changeData(item.children);
        })
      }else{
        $this.currentCluesData.yearuserscoreNum.forEach(function(item,index){
          const yearuserChart = new Area(`yearuserChart${index}`, {
            data:item.children, 
            xField: 'mtime',
            yField: 'anumber',
            padding:0,
            appendPadding:0,
            limitInPlot:false,
            xAxis:false,
            yAxis:false,
            line:false,
            height:44,
            tooltip: {
              formatter: (datum) => {
                return { name:'年度月询盘', value: datum.anumber };
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
        });
      }
    },
    //点击部门
    handleDepart(){
      var $this = this;
      if(!$this.loading){
        $this.loading = true;
        setTimeout(() => {
          $this.loading = false;
        }, 600);
        var departID=$this.currentCluesData.departID;
        var departName='';
        $this.currentCluesData.DeparData.forEach(function(item,index){
          item.disabled=true;
        });
        if(departID&&departID.length>0){
            if(departID.length==$this.currentCluesData.DeparData.length){
              departName='中文'
            }else{
              if(departID.length==1){
                departID.forEach(function(item,index){
                  $this.currentCluesData.DeparData.forEach(function(items,indexs){
                    if(item==items.value){
                        departName=departName+items.label;
                    }
                  });
                });
              }else{
                departID=departID.sort(function(a,b){return a-b})
                departID.forEach(function(item,index){
                  $this.currentCluesData.DeparData.forEach(function(items,indexs){
                    if(item==items.value){
                        departName=departName+items.label.slice(2,3);
                    }
                  });
                });
                departName='电商('+departName.split('').join('、')+')部';
              }
            }
        }else{
            departName='中文'
        }
        $this.currentCluesData.departName = departName;
        if($this.language=="Module_cnStat"){
          $this.getCnCluesRegionStatData();
          $this.getCnCluesStatData();
        }else{
          $this.getEnCluesRegionStatData();
          $this.getEnCluesStatData();
        }
      }
    },
    // 中英文选中状态切换
    cnEnActiveChange(){
      var $this = this;
      $this.languageList.forEach(function(item,index){
        if(item.label==$this.language){
          item.isOn = true;
        }else{
          item.isOn = false;
        }
      });
    },
    // 中英文数据分析切换
    cnEnStatChange(language){
      var $this = this;
      if(!$this.loading){
        $this.loading = true;
        setTimeout(() => {
          $this.loading = false;
        }, 600);
        if($this.language!=language){
          $this.language = language;
          $this.cnEnActiveChange();
          $this.currentCluesData.departID = [];
          $this.ScoreTime='';
          if($this.language=="Module_cnStat"){
            $this.currentCluesData.departName = "中文";
          }else{
            $this.currentCluesData.departName = "英文";
          }
          $this.currentCluesData.DeparData=[];

          var userlanguage = Cookies.get('language');
          userlanguage = JSON.parse(userlanguage);
          userlanguage.language=$this.language;
          userlanguage = JSON.stringify(userlanguage);
          Cookies.set('language', userlanguage);
          $this.statDataApi();
        }
      }
    },
    // 调用数据分析接口
    statDataApi(){
      var $this = this;
      if($this.language=="Module_cnStat"){
        $this.getCnCluesRegionStatData();
        $this.cnDaytarget();
        $this.getCnCluesStatData();
      }else{
        $this.getEnCluesRegionStatData();
        $this.enDaytarget();
        $this.getEnCluesStatData();
      }
    },
    // 切换清空table宽度
    handleTableWidth(event){
      var $this = this;
      var tableStyle2 = "width:100%";
      document.querySelector(".rowTableOne .el-table__header-wrapper .el-table__header").style=tableStyle2;
      document.querySelector(".rowTableOne .el-table__body-wrapper .el-table__body").style=tableStyle2;
    },
  }
}
</script>
<style lang="scss" scoped>
</style>