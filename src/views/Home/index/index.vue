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
                    <div class="rowOneOneItem clearfix">
                         <div class="rowOneOneItemFl">
                              <div id="radialBarChart" class="chart-canvas"></div>
                         </div>
                         <dl class="rowOneOneItemFr">
                             <dt>{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}统计</dt>
                             <dd>历史单日最高<span>({{targetScore.historymaxnumber.xundate}})</span><strong class="color01">{{targetScore.historymaxnumber.maxnumber}}</strong></dd>
                             <dd>本月单日最高<span>({{targetScore.daymaxnumber.xundate}})</span><strong class="color02">{{targetScore.daymaxnumber.maxnumber}}</strong></dd>
                             <!-- <dd v-if="targetScore.isDistanceTarget">距目标线差距<strong>{{targetScore.DistanceTarget}}</strong></dd>
                             <dd v-else>超出目标线<strong>{{targetScore.DistanceTarget}}</strong></dd> -->
                         </dl>
                          <div class="legendFly">
                            <span class="legendItem1">目标询盘</span>
                            <span class="legendItem2">询盘数量</span>
                            <span class="legendItem6">非搜索询盘</span>
                            <span class="legendItem3">达成目标</span>
                            <span class="legendItem4">历史最高</span>
                            <span class="legendItem5">本月最高</span>
                          </div>
                    </div>
               </div>
               <div class="rowOneTwoThree flex-wrap flex-content">
                  <div class="rowOneTwo flex-content">
                        <h3>{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}日询盘</h3>
                        <ul class="rowOneTwoItem">
                            <li class="flex-box" :class="currentCluesData.alltodaynumber<=currentCluesData.alllastdaynumber?'rowOneColor':''">
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
              <div class="trendlegend">
                <span class="legendItem1">总询盘</span>
                <span v-if="isDepart1" class="legendItem2">搜索询盘</span>
                <span class="legendItem3">平均值</span>
                <span class="legendItem4">目标值</span>
              </div>
          </div>
          <div class="rowFive">
               <div class="rowFiveFl">
                    <h3>{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}年度询盘对比</h3>
                    <div id="yeartongChart" class="chart-canvas"></div>
               </div>
               <div class="rowFiveFr">
                    <h3>{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}年度同期询盘对比</h3>
                    <div class="rowFiveFrBox">
                         <ul class="rowFiveFrBoxFr">
                             <li v-for="(item,index) in currentCluesData.registerArr" :key='index' :class="item.isOn?'rowFiveOne':'rowFiveTwo'">
                                 <p :style="'border-bottom-width:'+item.isHeight+'px'">
                                  <span class="rowFiveNumBom">{{item.value}}</span>
                                 </p>
                                  <span class="rowFiveNumTop">{{item.year}}</span>
                             </li>
                         </ul>
                         <ul class="rowFiveFrBoxFl">
                             <li><span>同比增长量</span><strong :class="currentCluesData.registerGrowth>0?'':'falling'">{{Math.abs(currentCluesData.registerGrowth)}}<i>{{currentCluesData.registerGrowth>0?'↑':'↓'}}</i></strong></li>
                             <li><span>同比增长率</span><strong :class="currentCluesData.registerGrowth>0?'':'falling'">{{currentCluesData.registerRate}}<i>{{currentCluesData.registerGrowth>0?'↑':'↓'}}</i></strong></li>
                         </ul>
                    </div>
               </div>
               <div class="rowFivelegend">
                  <span class="legendItem1">(单位：个)</span>
                  <span class="legendItem2">2021年</span>
                  <span class="legendItem3">2020年</span>
               </div>
          </div>
          <div class="rowThree">
               <div class="rowThreeOne" v-if="currentCluesData.monthtongArr.length>0&&currentCluesData.monthtongArr">
                   <h3>{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}小组月询盘成绩</h3>
                   <div class="rowThreeBox">
                        <div id="zugroupmonthChart" class="chart-canvas"></div>
                        <div class="rowThreeOnelegend">
                            <span class="legendItem1">(单位：个)</span>
                            <span class="legendItem2">本月数量</span>
                            <span class="legendItem3">上月数量</span>
                        </div>
                   </div>
               </div>
               <div class="rowThreeTwo" v-if="currentCluesData.zugroupdayArr.length>0&&currentCluesData.zugroupdayArr">
                   <h3>{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}小组日询盘成绩</h3>
                    <div class="rowThreeBox">
                        <div id="zugroupdayChart" class="chart-canvas"></div>
                        <div class="rowThreeTwolegend">
                            <span class="legendItem1">(单位：个)</span>
                            <span class="legendItem2">当日数量</span>
                            <span class="legendItem3">昨日数量</span>
                        </div>
                    </div>
               </div>
          </div>
          <div class="rowTwo" :class="language=='Module_cnStat'?'mapCNpad':'mapENpad'">
               <div class="rowTwoTwo" v-if="zusuercount.zusuercountArr.length>0&&zusuercount.zusuercountArr">
                    <div class="itemRowTit">
                        <h3>组员成绩</h3>
                        <div class="customRadio">                          
                          <el-checkbox-group class="checkbox-panel" v-model="zusuercount.GroupID" @change="groupClick" size="small">
                            <el-checkbox :label="item.value" :disabled="item.disabled" v-for="(item,index) in zusuercount.zusuercountGroupnameArr" v-bind:key="index">{{item.label}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                        <span>注：与上月同期对比</span>
                    </div>
                    <div class="rowTwoTwoItem"> 
                        <div class="rowTwoTwoItemBox" :style="'height:'+tableHidden.tableHeight">
                          <el-table
                              ref="simpleTable"
                              :data="zusuercount.zusuercountArr"
                              tooltip-effect="dark"
                              stripe
                              class="rowTwoTwoTable rowTableOne"
                              style="width: 100%"
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
                                        <i>{{scope.row.monthnumber}}</i>
                                        <span :class="scope.row.Class">{{scope.row.Growth}}</span>
                                    </p>
                                  </div>
                                </template>
                              </el-table-column>
                          </el-table>
                        </div>     
                      <p class="rowTwoTwoItemBtn" v-if="tableHidden.tableBtnVisible" v-on:click="tableBtn"><span>{{tableHidden.tableBtnTxt}}</span></p>
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
                    <div class="rowTwoOneItem">
                        <div class="map-chart">
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
          <div class="rowEight">
               <div class="rowEightFl">
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
                    <div class="rowEightFlItem">
                         <div class="rowEightFlItemTop flex-wrap">
                              <p class="rowEightFlItemTop01 flex-content">
                                 <span>成交积分</span><span>合格线</span><span>中等线</span><span>优秀线</span>
                              </p>
                              <p class="rowEightFlItemTop02">百万成交</p>
                         </div>
                         <ul class="rowEightFlItemBom">
                             <li class="flex-wrap" v-for="(item,index) in currentCluesData.departScoreData" :key="index">
                                <p class="rowEightFlItemFlName">{{item.departname}}</p>
                                <el-tooltip placement="top" effect="light" :visible-arrow="false">
                                  <div slot="content">
                                    <div class="tipnumber">合格线：{{item.passnumber}}</div>
                                    <div class="tipnumber">中等线：{{item.mediumnumber}}</div>
                                    <div class="tipnumber">优秀线：{{item.goodnumber}}</div>
                                  </div>
                                  <p class="rowEightFlItemFlBox flex-content">
                                    <span v-if="language=='Module_cnStat'" class="departnamescore" :style="'width:'+item.score/ScoreData.MaxValue*100+'%'">
                                    <i class="tip-right">{{item.score}}</i>
                                    </span>
                                    <span v-else class="departnamescore" :style="'width:'+item.snumber/ScoreData.MaxValue*100+'%'"></span>
                                    <span class="goodnumber" :style="'width:'+item.goodnumber/ScoreData.MaxValue*100+'%'"></span>
                                    <span class="mediumnumber" :style="'width:'+item.mediumnumber/ScoreData.MaxValue*100+'%'"></span>
                                    <span class="passnumber" :style="'width:'+item.passnumber/ScoreData.MaxValue*100+'%'"></span>
                                  </p>
                                </el-tooltip>
                                <p class="rowEightFlItemFlNum NumClass">
                                   <span v-if="item.a_number>0">{{item.a_number}}</span>
                                </p>

                             </li>
                         </ul>
                         <dl class="rowEightFlItemDl">
                              <dt>
                                  <p class="rowEightFlItemDlTit">{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}成交数量</p>
                                  <p class="rowEightFlItemDlNum">{{ScoreData.addallsnumber}}<span v-if="ScoreData.allsnumber!=ScoreData.addallsnumber">(占总成交{{ScoreData.allsnumberPercen}})</span></p>
                              </dt>
                              <dt>
                                  <p class="rowEightFlItemDlTit">{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}成交积分</p>
                                  <p class="rowEightFlItemDlNum">{{ScoreData.addallscore}}<span v-if="ScoreData.allscore!=ScoreData.addallscore">(占总成交{{ScoreData.allscorePercen}})</span></p>
                              </dt>
                         </dl>
                    </div>
               </div>
               <div class="rowEightFr">
                 <div class="clearfix">
                   <h3 style="float:left">
                      {{language=='Module_cnStat'?'中文':'英文'}}年度成交积分
                      <span style="color:#c1c1c1;font-size:12px">数据更新于{{updatemtime[0]}}年{{updatemtime[1]}}月{{updatemtime[2]}}日 {{updatemtime[3]}}时  | 每月更新</span>
                      <span style="color:#c1c1c1;font-size:12px;margin-left:20px">({{updateScoremonth}}更新数据)</span>
                    </h3>
                    <p class="unit">(单位：分)</p>
                </div>                    
                    <p class="totalNum">
                       <span>{{language=='Module_cnStat'?'中文':'英文'}}总成交积分：</span><strong>{{currentCluesData.totalNumscore}}</strong>
                    </p>
                    <div id="yeardepartscoreChart" class="chart-canvas"></div>
               </div>
          </div>
          <div class="rowSever" v-if="language=='Module_cnStat'">
              <div class="rowSeverFl">
                    <div class="itemRowTit">
                      <h3>部门成本</h3>
                      <span>({{updateScoremonth}}更新数据)</span>
                      <p>数据更新于{{updatemtime[0]}}年{{updatemtime[1]}}月{{updatemtime[2]}}日 {{updatemtime[3]}}时  | 每月更新</p>
                    </div>
                    <div class="rowSeverFlItem">
                        <el-table
                          :data="currentCluesData.departmentCost"
                          show-summary
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
                            prop="personnumber"
                            sortable
                            label="总人数"
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
          <div class="rowSix" v-if="language=='Module_cnStat'">
               <div class="rowSixFl">
                    <h3>{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}年度成交积分对比</h3>
                    <div id="yearscoretongChart01" class="chart-canvas"></div>
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
                                    <span class="percen"><i></i></span>
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
               <div class="rowSixlegend">
                  <span class="legendItem1">(单位：分)</span>
                  <span class="legendItem2">2021年</span>
                  <span class="legendItem3">2020年</span>
               </div>
          </div>
          <div class="flex-box flex-wrap rowFour" v-if="language=='Module_cnStat'&&((currentCluesData.userscoreNum&&currentCluesData.userscoreNum.length>0)||(currentCluesData.yearuserscoreNum&&currentCluesData.yearuserscoreNum.length>0))">
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
                                  </p>
                                  <p class="percen flex-wrap">
                                     <span class="percenFl" :style="'width:'+item.percen+'%'"></span>
                                     <span class="percenFr flex-content">{{item.number}}<i v-if="item.Growth!=0" :class="item.growthClass?'rising':'falling'">{{item.Growth}}</i></span>
                                  </p>
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
import { Bullet,RadialBar,Liquid,Line,Area,measureTextWidth,Pie,Bar,Column,Mix,P,G2,Rose} from '@antv/g2plot';
export default {
  name: 'Home',
  data() {
    return {
      updateScoremonth:'',
      depDayTarget:[],//部门日目标
      menuButtonPermit:[],
      permitModules:[],
      thisMonth:'',
      ScoreTime:'',
      DaytargetTime:'',
      DaytargetTodayTime:'',
      TodayMonth:'',//默认本月
      updatemtime:[],
      updateScoremonth:'',
      tableHidden:{
        tableHeight:0,
        tableBtnVisible:true,
        tableBtnBool:true,
        tableBtnTxt:'点击展开',
      },
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
      zusuercount:{
        zusuercountAllArr:[],//所有组员成绩
        zusuercountArr:[],//组员成绩
        zusuercountGroupnameArr:[],
        GroupID:[],
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
      isDepart1:false,
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
      $this.zusuercount.zusuercountAllArr=[];
      $this.zusuercount.zusuercountArr=[];
      $this.zusuercount.zusuercountGroupnameArr=[];
      $this.zusuercount.GroupID=[];
      $this.tableHidden.tableHeight=0;
      $this.tableHidden.tableBtnVisible=true;
      $this.tableHidden.tableBtnBool=true;
      $this.tableHidden.tableBtnTxt='点击展开';
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
                  groupcountObj.searchdaynumber=item.searchdaynumber?item.searchdaynumber:'';
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
              var itemDate=[];
              itemDate=item.date.split('-');
              item.date = itemDate[1]+'-'+itemDate[2]+"\n"+item.week.replace("星期","周");
              var tolItem={};
              tolItem.date=item.date;
              tolItem.xunnumber=item.xunnumber;
              tolItem.title='询盘';
              if($this.isDepart1){
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
            // 月询盘面积图数据
            if(response.monthtong&&response.monthtong.length>0){
              var monthtongArr=[];
              var monthtongList=[]
              monthtongList=response.monthtong;
              monthtongList.forEach(function(item,index){
                var monthtongObj={};
                monthtongObj.date=item.date.split('-')[1]+'月';
                monthtongObj.xunnumber=item.xunnumber;
                monthtongObj.xunchange= item.tongxunnumber?item.tongxunnumber:item.xunnumber;
                monthtongArr.push(monthtongObj);
              });
              $this.currentCluesData.monthtongArr=monthtongArr;
              $this.monthtongChart();
            }
            // 年度询盘对比
            if(response.yeartong&&response.yeartong.length>0){
              var yeartongArr=[];
              var registerArr=[];
              var registerGrowth='';
              var registerRate='';
              var registerObj={
                year:'',
                isOn:false,
                isHeight:0,
                value:0,
              };        
              var lastregisterObj={
                year:'',
                isOn:false,
                isHeight:0,
                value:0,
              };
              response.yeartong.forEach(function(item,index){
                  var yeartongObj={};
                  var lastyeartongObj={};
                  yeartongObj.month=item.date.split('-')[1]+'月';
                  yeartongObj.value=item.xunnumber;
                  yeartongObj.year=item.date.split('-')[0];
                  yeartongObj.date=item.date+'月';
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
              $this.currentCluesData.yeartongArr=yeartongArr;
              if(registerObj.year>lastregisterObj.year){
                registerObj.isOn=true;
              }else{
                lastregisterObj.isOn=true;
              }
              var MaxVal='';
              if(registerObj.value>lastregisterObj.value){
                MaxVal=registerObj.value;
              }else{
                MaxVal=lastregisterObj.value;
              }
              registerObj.isHeight=registerObj.value/MaxVal*244;
              lastregisterObj.isHeight=lastregisterObj.value/MaxVal*244;
              registerArr.push(registerObj,lastregisterObj); 
              $this.currentCluesData.registerArr=registerArr;
              registerGrowth=registerObj.value-lastregisterObj.value;
              registerRate=Math.abs(((registerObj.value-lastregisterObj.value)/lastregisterObj.value*100).toFixed(2))+'%';
              $this.currentCluesData.registerGrowth=registerGrowth;
              $this.currentCluesData.registerRate=registerRate;
              $this.yeartongChart();
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
            // 组员成绩
            if(response.zusuercount!=''&&response.zusuercount!=null){
                if(response.zusuercount.length>0&&response.zusuercount){
                    var newStrArr = [];
                    var zusuercountAllArr=[];//综合-组员成绩
                    response.zusuercount.forEach(function(item,index){
                      if(item.length>0&&item){
                          item.forEach(function(items,indexs){
                                zusuercountAllArr.push(items);
                                if(newStrArr.indexOf(items.dept_id)==-1){
                                    newStrArr.push(items.dept_id);
                                }
                          });
                      }
                    });
                    $this.zusuercount.zusuercountAllArr=zusuercountAllArr;
                    var zusuercountGroupnameArr=[];//小组
                    var GroupID=[];
                    newStrArr.forEach(function(item,index){
                        GroupID.push(item);
                        $this.currentCluesData.DeparData.forEach(function(items,indexs){
                            if(item==items.value){
                                var GroupnameObj={};
                                GroupnameObj.value=items.value;
                                GroupnameObj.label=items.label;
                                GroupnameObj.disabled=false;
                                zusuercountGroupnameArr.push(GroupnameObj);
                            }
                        });
                    });
                    $this.zusuercount.GroupID = GroupID;      
                    $this.zusuercount.zusuercountGroupnameArr = zusuercountGroupnameArr; 
                    $this.groupClick();
                }else{
                  $this.currentCluesData.zusuercountArr=[];
                }
            }else{
                  $this.currentCluesData.zusuercountArr=[];
            }
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
                     yeartongObj.value=Number(Number(item.score).toFixed(2));
                  } else {
                     yeartongObj.value=item.score;
                  }
                  yeartongObj.year=item.date.split('-')[0];
                  lastyeartongObj.month=item.lastdate.split('-')[1]+'月';
                  if ($this.isFloat(Number(item.lastscore))) {
                     lastyeartongObj.value=Number(Number(item.lastscore).toFixed(2));
                  } else {
                     lastyeartongObj.value=item.lastscore;
                  }
                  lastyeartongObj.year=item.lastdate.split('-')[0];
                  yearscoretongArr.push(yeartongObj,lastyeartongObj);
                  //年度同期成交对比
                  registerObj.year=item.date.split('-')[0];
                  if ($this.isFloat(Number(item.score))) {
                      registerObj.value=Number((Number(registerObj.value)+Number(item.score)).toFixed(2));
                  } else {
                      registerObj.value=Number(registerObj.value)+Number(item.score);
                  }
                  lastregisterObj.year=item.lastdate.split('-')[0];
                  if ($this.isFloat(Number(item.lastscore))) {
                      lastregisterObj.value=Number((Number(lastregisterObj.value)+Number(item.lastscore)).toFixed(2));
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
              if($this.isFloat(sametimeGrowth)){
                sametimeGrowth=Number(sametimeGrowth.toFixed(2));
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
                    //年度成交Top5
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
                      var Maxnumber=0;
                      var yearusernewArr=[];
                      yearuserscoreNum.forEach(function(item,index){
                        if(index==0){
                          Maxnumber=item.number;
                        }
                        if(Maxnumber!=0){
                            item.Percen=(item.number/Maxnumber*100).toFixed(2)+'%';
                        }else{
                            item.Percen='0%'
                        }
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
                //年度成交Top5
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
                  var Maxnumber=0;
                  var yearusernewArr=[];
                  yearuserscoreNum.forEach(function(item,index){
                     if(index==0){
                       Maxnumber=item.number;
                     }
                     if(Maxnumber!=0){
                        item.Percen=(item.number/Maxnumber*100).toFixed(2)+'%';
                     }else{
                        item.Percen='0%'
                     }
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
              var itemDate=[];
              itemDate=item.date.split('-');
              item.date = itemDate[1]+'-'+itemDate[2]+"\n"+item.week.replace("星期","周");
              var tolItem={};
              tolItem.date=item.date;
              tolItem.xunnumber=item.xunnumber;
              tolItem.title='询盘';
              if($this.isDepart1){
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
            // 月询盘面积图数据
            if(response.monthtong&&response.monthtong.length>0){
              var monthtongArr=[];
              var monthtongList=[]
              monthtongList=response.monthtong;
              monthtongList.forEach(function(item,index){
                var monthtongObj={};
                monthtongObj.date=item.date.split('-')[1]+'月';
                monthtongObj.xunnumber=item.xunnumber;
                monthtongObj.xunchange= item.tongxunnumber?item.tongxunnumber:item.xunnumber;
                monthtongArr.push(monthtongObj);
              });
              $this.currentCluesData.monthtongArr=monthtongArr;
              $this.monthtongChart();
            }
            // 年度询盘对比
            if(response.yeartong&&response.yeartong.length>0){
              var yeartongArr=[];
              var registerArr=[];
              var registerGrowth='';
              var registerRate='';
              var registerObj={
                year:'',
                isOn:false,
                isHeight:0,
                value:0,
              };        
              var lastregisterObj={
                year:'',
                isOn:false,
                isHeight:0,
                value:0,
              };
              response.yeartong.forEach(function(item,index){
                  var yeartongObj={};
                  var lastyeartongObj={};
                  yeartongObj.month=item.date.split('-')[1]+'月';
                  yeartongObj.value=item.xunnumber;
                  yeartongObj.year=item.date.split('-')[0];
                  yeartongObj.date=item.date+'月';
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
              $this.currentCluesData.yeartongArr=yeartongArr;
              if(registerObj.year>lastregisterObj.year){
                registerObj.isOn=true;
              }else{
                lastregisterObj.isOn=true;
              }
              var MaxVal='';
              if(registerObj.value>lastregisterObj.value){
                MaxVal=registerObj.value;
              }else{
                MaxVal=lastregisterObj.value;
              }
              registerObj.isHeight=registerObj.value/MaxVal*244;
              lastregisterObj.isHeight=lastregisterObj.value/MaxVal*244;
              registerArr.push(registerObj,lastregisterObj); 
              $this.currentCluesData.registerArr=registerArr;
              registerGrowth=registerObj.value-lastregisterObj.value;
              registerRate=Math.abs(((registerObj.value-lastregisterObj.value)/lastregisterObj.value*100).toFixed(2))+'%';
              $this.currentCluesData.registerGrowth=registerGrowth;
              $this.currentCluesData.registerRate=registerRate;
              $this.yeartongChart();
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
            // 组员成绩
            if(response.zusuercount!=''&&response.zusuercount!=null){
                if(response.zusuercount.length>0&&response.zusuercount){
                    var newStrArr = [];
                    var zusuercountAllArr=[];//综合-组员成绩
                    response.zusuercount.forEach(function(item,index){
                      if(item.length>0&&item){
                          item.forEach(function(items,indexs){
                                zusuercountAllArr.push(items);
                                if(newStrArr.indexOf(items.dept_id)==-1){
                                    newStrArr.push(items.dept_id);
                                }
                          });
                      }
                    });
                    $this.zusuercount.zusuercountAllArr=zusuercountAllArr;
                    var zusuercountGroupnameArr=[];//小组
                    var GroupID=[];
                    newStrArr.forEach(function(item,index){
                        GroupID.push(item);
                        $this.currentCluesData.DeparData.forEach(function(items,indexs){
                            if(item==items.value){
                                var GroupnameObj={};
                                GroupnameObj.value=items.value;
                                GroupnameObj.label=items.label;
                                GroupnameObj.disabled=false;
                                zusuercountGroupnameArr.push(GroupnameObj);
                            }
                        });
                    });
                    $this.zusuercount.GroupID = GroupID;      
                    $this.zusuercount.zusuercountGroupnameArr = zusuercountGroupnameArr; 
                    $this.groupClick();
                }else{
                  $this.currentCluesData.zusuercountArr=[];
                }
            }else{
                  $this.currentCluesData.zusuercountArr=[];
            }
            // 年度成交积分对比
            //if(response.yearscoretong&&response.yearscoretong.length>0){
            //  var yearscoretongArr=[];
            //  var sametimeArr=[];
            //  var sametimeGrowth='';
            //  var sametimeRate='';
            //  var registerObj={
            //    year:'',
            //    value:0,
            //  };        
            //  var lastregisterObj={
            //    year:'',
            //    value:0,
            //  };
            //  response.yearscoretong.forEach(function(item,index){
            //      var yeartongObj={};
            //      var lastyeartongObj={};
            //      yeartongObj.month=item.date.split('-')[1]+'月';
            //      if ($this.isFloat(Number(item.score))) {
            //         yeartongObj.value=Number(Number(item.score).toFixed(2));
            //      } else {
            //         yeartongObj.value=item.score;
            //      }
            //      yeartongObj.year=item.date.split('-')[0];
            //      lastyeartongObj.month=item.lastdate.split('-')[1]+'月';
            //      if ($this.isFloat(Number(item.lastscore))) {
            //         lastyeartongObj.value=Number(Number(item.lastscore).toFixed(2));
            //      } else {
            //         lastyeartongObj.value=item.lastscore;
            //      }
            //      lastyeartongObj.year=item.lastdate.split('-')[0];
            //      yearscoretongArr.push(yeartongObj,lastyeartongObj);
            //      //年度同期成交对比
            //      registerObj.year=item.date.split('-')[0];
            //      if ($this.isFloat(Number(item.score))) {
            //          registerObj.value=Number((Number(registerObj.value)+Number(item.score)).toFixed(2));
            //      } else {
            //          registerObj.value=Number(registerObj.value)+Number(item.score);
            //      }
            //      lastregisterObj.year=item.lastdate.split('-')[0];
            //      if ($this.isFloat(Number(item.lastscore))) {
            //          lastregisterObj.value=Number((Number(lastregisterObj.value)+Number(item.lastscore)).toFixed(2));
            //      } else {
            //          lastregisterObj.value=Number(lastregisterObj.value)+Number(item.lastscore);
            //      }
            //  });
            //  $this.currentCluesData.yearscoretongArr=yearscoretongArr;
            //  sametimeArr.push(registerObj,lastregisterObj);
            //  $this.currentCluesData.sametimeArr=sametimeArr;
            //  var MaxValue='';
            //  if(Number(registerObj.value)>=Number(lastregisterObj.value)){
            //    MaxValue=Number(registerObj.value);
            //  }else{
            //    MaxValue=Number(lastregisterObj.value);
            //  }
            //  if(MaxValue==0){
            //    lastregisterObj.percen='0%';
            //    registerObj.percen='0%';
            //  }else{
            //      lastregisterObj.percen=(Number(lastregisterObj.value)/MaxValue*100).toFixed(2)+'%';
            //      registerObj.percen=(Number(registerObj.value)/MaxValue*100).toFixed(2)+'%';
            //  }
            //  sametimeGrowth=Number(registerObj.value)-Number(lastregisterObj.value);
            //  if(Number(lastregisterObj.value)==0){
            //    sametimeRate=Number(registerObj.value).toFixed(2)+'%';
            //  }else{
            //    sametimeRate=Math.abs((Number(registerObj.value)-Number(lastregisterObj.value))/Number(lastregisterObj.value)*100).toFixed(2)+'%';
            //  }
            //  if($this.isFloat(sametimeGrowth)){
            //    sametimeGrowth=Number(sametimeGrowth.toFixed(2));
            //  }
            //  $this.currentCluesData.sametimeGrowth=sametimeGrowth;
            //  $this.currentCluesData.sametimeRate=sametimeRate;
            //  $this.yearscoretongChart();
            //}
            if($this.currentCluesData.departID&&$this.currentCluesData.departID.length>0){ 
                if($this.currentCluesData.departID.length==$this.currentCluesData.DeparData.length){
                    //if(response.userscore.length>0&&response.userscore){
                    //  var userscoreNum=[];
                    //  response.userscore.forEach(function(item,index){
                    //    var itemData = {};
                    //    itemData.id = item.id;
                    //    itemData.username = item.username;
                    //    itemData.groupname = item.groupname;
                    //    itemData.headimg = item.headimg;
                    //    itemData.number = item.number;
                    //    if(item.lastnumber){
                    //      itemData.Growth = Math.abs(item.number-item.lastnumber.number);
                    //      if(item.number-item.lastnumber.number>0){
                    //        itemData.growthClass=true;
                    //      }
                    //      if(item.number-item.lastnumber.number<0){
                    //        itemData.growthClass=false;
                    //      }
                    //    }else{
                    //      itemData.Growth = item.number;
                    //      itemData.growthClass=true;
                    //    }
                    //    userscoreNum.push(itemData);
                    //  });
                    //  userscoreNum.sort(function(a, b) {
                    //      var value1 = a.number;
                    //      var value2 = b.number;
                    //      return value2 - value1;
                    //  });
                    //  userscoreNum.forEach(function(item,index){
                    //    item.percen = item.number/userscoreNum[0].number*100;
                    //  });
                    //  $this.currentCluesData.userscoreNum = userscoreNum;
                    //}else{
                    //  $this.currentCluesData.userscoreNum=[];
                    //}
     
                    ////年度成交Top5
                    //if(response.yearuserscore.length>0&&response.yearuserscore){
                    //  var yearuserscoreNum=[];
                    //  response.yearuserscore.forEach(function(item,index){
                    //    var itemData = {};
                    //    itemData.id = item.id;
                    //    itemData.username = item.username;
                    //    itemData.groupname = item.groupname;
                    //    itemData.number = item.number;
                    //    itemData.anumber = item.anumber;
                    //    itemData.children = item.son;
                    //    itemData.headimg = item.headimg;
                    //    yearuserscoreNum.push(itemData);
                    //  });
                    //  yearuserscoreNum.sort(function(a, b) {
                    //      var value1 = a.number;
                    //      var value2 = b.number;
                    //      return value2 - value1;
                    //  });
                    //  var Maxnumber=0;
                    //  var yearusernewArr=[];
                    //  yearuserscoreNum.forEach(function(item,index){
                    //     if(index==0){
                    //       Maxnumber=item.number;
                    //     }
                    //     if(Maxnumber!=0){
                    //        item.Percen=(item.number/Maxnumber*100).toFixed(2)+'%';
                    //     }else{
                    //        item.Percen='0%'
                    //     }
                    //  });              
                    //  $this.currentCluesData.yearuserscoreNum = yearuserscoreNum;
                    //}else{
                    //  $this.currentCluesData.yearuserscoreNum=[];
                    //}
                    //$this.$nextTick(() => {
                    //    $this.yearuserChart();
                    //})
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
                //if(response.userscore.length>0&&response.userscore){
                //  var userscoreNum=[];
                //  response.userscore.forEach(function(item,index){
                //    var itemData = {};
                //    itemData.id = item.id;
                //    itemData.username = item.username;
                //    itemData.groupname = item.groupname;
                //    itemData.headimg = item.headimg;
                //    itemData.number = item.number;
                //    if(item.lastnumber){
                //      itemData.Growth = Math.abs(item.number-item.lastnumber.number);
                //      if(item.number-item.lastnumber.number>0){
                //        itemData.growthClass=true;
                //      }
                //      if(item.number-item.lastnumber.number<0){
                //        itemData.growthClass=false;
                //      }
                //    }else{
                //      itemData.Growth = item.number;
                //      itemData.growthClass=true;
                //    }
                //    userscoreNum.push(itemData);
                //  });
                //  userscoreNum.sort(function(a, b) {
                //      var value1 = a.number;
                //      var value2 = b.number;
                //      return value2 - value1;
                //  });
                //  userscoreNum.forEach(function(item,index){
                //    item.percen = item.number/userscoreNum[0].number*100;
                //  });
                //  $this.currentCluesData.userscoreNum = userscoreNum;
                //}else{
                //  $this.currentCluesData.userscoreNum=[];
                //}                
                ////年度成交Top5
                //if(response.yearuserscore.length>0&&response.yearuserscore){
                //  var yearuserscoreNum=[];
                //  response.yearuserscore.forEach(function(item,index){
                //    var itemData = {};
                //    itemData.id = item.id;
                //    itemData.username = item.username;
                //    itemData.groupname = item.groupname;
                //    itemData.number = item.number;
                //    itemData.anumber = item.anumber;
                //    itemData.children = item.son;
                //    itemData.headimg = item.headimg;
                //    yearuserscoreNum.push(itemData);
                //  });
                //  yearuserscoreNum.sort(function(a, b) {
                //      var value1 = a.number;
                //      var value2 = b.number;
                //      return value2 - value1;
                //  });
                //  var Maxnumber=0;
                //  var yearusernewArr=[];
                //  yearuserscoreNum.forEach(function(item,index){
                //     if(index==0){
                //       Maxnumber=item.number;
                //     }
                //     if(Maxnumber!=0){
                //        item.Percen=(item.number/Maxnumber*100).toFixed(2)+'%';
                //     }else{
                //        item.Percen='0%'
                //     }
                //  });              
                //  $this.currentCluesData.yearuserscoreNum = yearuserscoreNum;
                //}else{
                //  $this.currentCluesData.yearuserscoreNum=[];
                //}
                //$this.$nextTick(() => {
                //    $this.yearuserChart();
                //})
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
            shared: true,
            customItems: (originalItems) => {
                for(let i=0;i<originalItems.length;i++){
                  if(originalItems[i].name == originalItems[i].title){
                    if(originalItems[i].name == "电商一部"){
                      originalItems[i].name = '非搜索询盘';
                      originalItems[i].value = parseInt(originalItems[i].value.split('-')[1]) - parseInt(originalItems[i].value.split('-')[0]);
                    }else{
                      originalItems[i].name = '询盘数量';
                      originalItems[i].value = parseInt(originalItems[i].value.split('-')[1]) - parseInt(originalItems[i].value.split('-')[0]);
                    }
                  }
                }
                 return originalItems;
            },
          },
          height:215,
          plots:[
            {//历史最高折线图
               type: 'column',
                options: {
                    data: resultData,
                    xField: 'departname',
                    yField: 'historymaxnumber',
                    minColumnWidth:30,
                    maxColumnWidth:30,
                    interactions: [{ type: 'active-region', enable: false }],
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
                      fill:'#fff',
                      stroke: '#fee4e4',
                      lineWidth: 1,
                      fillOpacity:0.5,
                      
                    },
                    color:'#f38080',
                    columnWidthRatio:0.5,
                    meta: {
                        historymaxnumber: {
                            alias: '历史最高',
                        },
                    },
                    label:{
                      style: {
                        fill: '#ff0606',
                        fontWeight:600
                      },
                      offsetY:6,
                      position: 'top', 
                      
                    }
                    
                },
            },
            
            {//目标柱状图
               type: 'column',
                options: {
                    data: resultData,
                    xField: 'departname',
                    yField: 'daytargetnumber',
                    minColumnWidth:30,
                    maxColumnWidth:30,
                    interactions: [{ type: 'active-region', enable: false }],
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
                    minColumnWidth:20,
                    maxColumnWidth:20,
                    interactions: [{ type: 'active-region', enable: false }],
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
                    color:'#59cab6',
                    columnStyle: (res) =>{
                      var obj = {};
                      obj.fill = "#59cab6";
                      if(res.departname=="电商一部"){
                        if(res.searchdaynumber){
                          resultData.forEach(function(item,index){
                            if(item.departname == res.departname){
                              if(res.searchdaynumber>=item.daytargetnumber){
                                obj.fill = '#f38080';
                              }
                            }
                          });
                        }
                      }
                      return obj;
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
                        if(item.searchdaynumber){
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
                    minColumnWidth:20,
                    maxColumnWidth:20,
                    interactions: [{ type: 'active-region', enable: false }],
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
                    color:(item)=>{
                      if(item.departname=="电商一部"){
                        return '#f7c572'
                      }else{
                        return '#59cab6'
                      }
                    },
                    columnStyle:(item)=>{
                      if(item.departname=="电商一部"){
                        return {
                          fill:'#f7c572'
                        }
                      }else{
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
                            return item.searchdaynumber?parseInt(item.daynumber) - parseInt(item.searchdaynumber):parseInt(item.daynumber)
                          }
                      }
                    }
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
                    lineStyle:{
                      fill:'#fcb030',
                      fillOpacity:0,
                      lineOpacity:0,
                      opacity:0
                    },
                    point: {
                      size: 3,
                      shape: 'circle',
                      style: {
                        fill: '#fcb030',
                        stroke: '#fcb030',
                        
                      },
                    },
                    label:{
                      style: {
                        fill: '#fcb030',
                        fontWeight:600
                      },
                      position: 'top', 
                      
                    }
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
      var numList=[800,600,400,200];
      var defaulColor=['#ae1222','#f27042','#f1de5f','#a2bfcd', '#b3b3b3'];
      var trendArr=[];
      var maxNum='';
      var minNum='';
      $this.currentCluesData.cluesRegionData.forEach(function(item,index){
          if(maxNum<item.number){
            maxNum=item.number;
          }
          if(minNum>=item.number){
            minNum=item.number;
          }
      });
      if(maxNum>numList[0]){
        trendArr=defaulColor;
      }
      if(maxNum<=numList[numList.length-1]){
        trendArr=['#b3b3b3'];
      }
      for(var i=0;i<numList.length;i++){
        if(maxNum>=numList[i+1]&&maxNum<numList[i]){
          defaulColor.forEach(function(item,index){
              if(index>i){
                trendArr.push(item);
              }
          });
        }
      };
      
      if($this.currentCluesData.cluesRegionData.length>0){   
        fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/china-provinces.geo.json')
        .then(res => res.json())
        .then(GeoJSON => {
          const regionMapChart = new G2.Chart({
            container: 'regionMapChart',
            width:580,
            height:422,
            // 添加 element 选中和激活交互
            interactions: [{ type: 'element-single-selected' }, { type: 'element-active' }],
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
          regionMapChart.axis(false);
          regionMapChart.legend('trend', {
            position: 'bottom-left',
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
            geoDataView: geoDv,
            field: 'name',
            type: 'geo.region',
            as: ['longitude', 'latitude']
          }).transform({
            type: 'map',
            callback: obj => {
              if(obj.number <200){
                  obj.trend="0-200";
              }else if(obj.number <400 && obj.number>=200){
                  obj.trend="200-400";
              }else if(obj.number <600 && obj.number>=400){
                  obj.trend="400-600";
              }else if(obj.number <800 && obj.number>=600){
                  obj.trend="600-800";
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
            .color('trend', trendArr)
            .tooltip('name*number')
            .style({
              fillOpacity: 1,
              stroke:"#fff"
            }).state({
              active: {
                style: {
                  lineWidth: 0,
                  stroke:0,
                  fillOpacity:0.8,
                },
              },
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
          var numList=[];     
          if($this.language=="Module_cnStat"){
              numList=[800,600,400,200];
          }else{
              numList=[700,500,300,100];
          }  
          var defaulColor=['#ae1222','#f27042','#f1de5f','#a2bfcd', '#b3b3b3'];
          var rel=$this.currentCluesData.topTenRegionData;
          var topTenColor=[];
          $this.currentCluesData.topTenRegionData.forEach(function(item,index){
            for(var i=0;i<numList.length;i++){
              if(item.number>numList[i]){
                topTenColor.push(defaulColor[i]);
                break;
              }
            }
          });
          topTenColor=topTenColor.reverse();
          const pieSourcePlot = new Bar('topTen', {
            data:$this.currentCluesData.topTenRegionData,
            xField: 'number',
            yField: 'name',
            seriesField: 'name',
            barWidthRatio: 0.4,
            height:340,
            legend: false,
            appendPadding:[0, 30, 0, 30],
            xAxis:false,
            //color:['#b3b3b3','#a2bfcd','#a3cfce','#bfd3dd','#b0d4d3','#bae29d','#f1e89d','#f9ac6e','#f27042','#df3041'],
            color:topTenColor,
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
            var laseXunchange='';
            var monthtongLength=$this.currentCluesData.monthtongArr.length;
            laseXunchange=$this.currentCluesData.monthtongArr[monthtongLength-1].xunchange;

            const monthtongArea = new Area('rowOneThreeArea', {
              data:$this.currentCluesData.monthtongArr,
              xField: 'date',
              yField: 'xunnumber',
              height:100,
              padding:[20,25,22,15],
              xAxis: {
                range: [0, 1],
                tickCount: 6,
                title:{
                  style:{
                    fill: '#719ef6',
                    fontsize:'12',
                  }
                },
                tickLine:null,
                label:{
                  offsetY:-30,
                  style: {
                    fill: '#5B8FF9',
                    
                    fontsize:'12',
                  },
                }
              },
              yAxis:false,
              label: {
                layout: [{ type: 'hide-overlap' }], // 隐藏重叠label
                style: {
                  textAlign: 'center',
                  color:'#9e9e9e',
                  fontsize:12,
                },
                formatter: (item) => {
                  return item.xunnumber
                },
              },
              point: {
                size:3,
                shape: 'circle',
                style: (res) => {
                  var obj = {
                    opacity: 0.5,
                    stroke: '#6392ec',
                    fill: '#fff',
                  }
                  return obj;
                },
              },
              tooltip: {
                //fields:['date','xunnumber', 'xunchange'],
                customContent: (title, data) => {
                  
                  if(data.length>0){
                    if(laseXunchange - data[0].data.xunchange>=0){
                       return `<div class='tooltip_fly'>
                      <div class='tip_item'><span class='tip_name'>${title}同期 ：</span><span class='tip_value'>${data[0].data.xunchange}</span><span class="rising">${laseXunchange - data[0].data.xunchange}</span></div>
                      <div class='tip_item'><span class='tip_name'>${title}总询盘：</span><span class='tip_value'>${data[0].data.xunnumber}</span></div>
                      
                      </div>`;
                    }else{
                      return `<div class='tooltip_fly'>
                      <div class='tip_item'><span class='tip_name'>${title}同期：</span><span class='tip_value'>${data[0].data.xunchange}</span><span class="falling">${Math.abs(laseXunchange - data[0].data.xunchange)}</div>
                      <div class='tip_item'><span class='tip_name'>${title}总询盘：</span><span class='tip_value'>${data[0].data.xunnumber}</span></div>
                      
                      </div>`;
                    }                   
                  }else{
                    return ''
                  }
                  
                }
              },
              areaStyle: () => {
                return {
                  fill: '#e4edfd',
                  fillOpacity:1,
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
              isStack:false,
              areaStyle: () => {
                return {
                  fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
                };
              },
              appendPadding:[15,15,15,15],
              height: 370,
              smooth:false,
              legend:false,
              xAxis: {
                tickCount:10,
                label: {
                  offset:10,
                  style: {
                    fill: '#666666',
                    opacity: 0.6,
                    fontSize: 12,
                    lineHeight:16,
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
                  textAlign: 'center',
                  color:'#9e9e9e',
                  fontsize:12,
                },
                formatter: (item) => {
                  if($this.isDepart1){
                    if(item.title=="搜索询盘"){
                      return item.xunnumber
                    }else{
                      return null
                    }
                  }else{
                    return item.xunnumber
                  }
                },
              },
              point: {
                size:3,
                shape: 'circle',
                style: (res) => {
                  var obj = {
                    opacity: 0.5,
                    stroke: '#6392ec',
                    fill: '#fff',
                  }
                  if(res.title=="搜索询盘"){
                    obj.opacity = 1;
                  }else{
                    if($this.isDepart1){
                      obj.opacity = 0;
                      obj.lineWidth= 0;
                      obj.fill= '';
                      obj.r = 0
                    }else{
                      obj.opacity = 1;
                    }
                  }
                  return obj;
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
          height:358,
          radius:0.7,
          innerRadius: 0.6,
          appendPadding: 0,
          color:["#f38080","#ffd29e","#6bddc9","#81a7f1","#b4c4ee","#78D3F8","#9661BC","#F6903D","#008685","#F08BB4"],
          meta: {
            score: {
              formatter: (v) => `${v}`,
            },
          },
          state: {
            active: {
              style: {
                lineWidth: 0,
                fillOpacity: 0.8,
              },
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
            
            maxRow: 3,
            position: 'left',
            itemHeight:20,  
            offsetY:36,
            offsetX:25,
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
                lineHeight:1.4,
                fontWeight:500,
                color:"#999"
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
    // 年度成交积分对比
    yearscoretongChart(){
      var $this = this;
      if($this.currentCluesData.yearscoretongArr.length>0){
        var yearArr = [];
        var maxYear = 0;
        var minYear = 0;
        $this.currentCluesData.yearscoretongArr.forEach(function(item,index){
          if(!yearArr.includes(parseInt(item.year))){
            yearArr.push(parseInt(item.year));
          }
        });
        if(yearArr.length==2){
          if(yearArr[0]>yearArr[1]){
            maxYear = yearArr[0];
            minYear = yearArr[1];
          }else if(yearArr[0]<yearArr[1]){
            maxYear = yearArr[1];
            minYear = yearArr[0];
          }else{
            maxYear = minYear = yearArr[0]
          }
        }
        if($this.yearscoretongData&&!$this.yearscoretongData.chart.destroyed){
          $this.yearscoretongData.changeData($this.currentCluesData.yearscoretongArr);
        }else{
          $this.currentCluesData.yearscoretongArr.forEach((item,index)=>{
            item.value = parseFloat(item.value)
          })
          const yearscoretongData = new Line('yearscoretongChart01', {
            data:$this.currentCluesData.yearscoretongArr,
            xField: 'month',
            yField: 'value',
            seriesField: 'year',
           
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
            legend:false,
            // label
            label: {
              style: {
                textAlign: 'center',
                color:'#9e9e9e',
                fontsize:12,
              },
              formatter: (item) => {
                if(item.year==""+maxYear){
                  return item.value
                }
              },
            },
            point: {
              shape: (res) =>{
                if(res.year == ""+maxYear){
                  return 'circle';
                }
              },
              size: 3,
              style:(res)=> {
                var obj = {
                  opacity: 0.5,
                  stroke: '#78bccf',
                  fill: '#fff',
                }
                if(res.year == ""+maxYear){
                  obj.opacity = 0.5;
                }else{
                  obj.opacity = 0;
                  obj.lineWidth= 0;
                  obj.fill= '';
                }
                return obj;
              },
            },
            color: ({ year }) => {
              return year === ""+minYear ? '#fbd266' : '#78bccf';
            },
            lineStyle: ({ year }) => {
              if (year === ""+minYear) {
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
            if ($this.isFloat(registerObj.value)) {
                registerObj.value=Number(registerObj.value.toFixed(2));
            } 
            if ($this.isFloat(lastregisterObj.value)) {
                lastregisterObj.value=Number(lastregisterObj.value.toFixed(2));
            }                          
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
            if($this.isFloat(sametimeGrowth)){
              sametimeGrowth=Number(sametimeGrowth.toFixed(2));
            }
            $this.currentCluesData.sametimeGrowth=sametimeGrowth;
            $this.currentCluesData.sametimeRate=sametimeRate;
          });
        }
      }
    },
    // 年度询盘对比
    yeartongChart(){
      var $this = this;
      if($this.currentCluesData.yeartongArr.length>0){
        var yearArr = [];
        var maxYear = 0;
        var minYear = 0;
        $this.currentCluesData.yeartongArr.forEach(function(item,index){
          if(!yearArr.includes(parseInt(item.year))){
            yearArr.push(parseInt(item.year));
          }
        });
        if(yearArr.length==2){
          if(yearArr[0]>yearArr[1]){
            maxYear = yearArr[0];
            minYear = yearArr[1];
          }else if(yearArr[0]<yearArr[1]){
            maxYear = yearArr[1];
            minYear = yearArr[0];
          }else{
            maxYear = minYear = yearArr[0]
          }
        }
          if($this.yeartongData&&!$this.yeartongData.chart.destroyed){
            $this.yeartongData.changeData($this.currentCluesData.yeartongArr);
          }else{
            const yeartongData = new Line('yeartongChart', {
              data:$this.currentCluesData.yeartongArr,
              xField: 'month',
              yField: 'value',
              seriesField: 'year',
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
              legend:false,
              // label
              label: {
                style: {
                  textAlign: 'center',
                  color:'#9e9e9e',
                  fontsize:12,
                },
                formatter: (item) => {
                  if(item.year==""+maxYear){
                    return item.value
                  }
                },
              },
              point: {
                shape: (res) =>{
                  if(res.year == ""+maxYear){
                    return 'circle';
                  }
                },
                size: 3,
                style:(res)=> {
                  var obj = {
                    opacity: 0.5,
                    stroke: '#6392ec',
                    fill: '#fff',
                  }
                  if(res.year == ""+maxYear){
                    obj.opacity = 0.5;
                  }else{
                    obj.opacity = 0;
                    obj.lineWidth= 0;
                    obj.fill= '';
                  }
                  return obj;
                },
              },
              color: ({ year }) => {
                return year === ""+minYear ? '#fbd266' : '#6392ec';
              },
              lineStyle: ({ year }) => {
                if (year === ""+minYear) {
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
              var mouth=hoverData[0].data.month.replace('月','');
              var registerArr=[];
              var registerObj={
                year:hoverData[0].data.year,
                value:0,
                isOn:false,
                isHeight:0,
              };        
              var lastregisterObj={
                year:hoverData[1].data.year,
                value:0,
                isOn:false,
                isHeight:0,
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
              if(registerObj.year>lastregisterObj.year){
                registerObj.isOn=true;
              }else{
                lastregisterObj.isOn=true;
              }
              var MaxVal='';
              if(registerObj.value>lastregisterObj.value){
                MaxVal=registerObj.value;
              }else{
                MaxVal=lastregisterObj.value;
              }
              registerObj.isHeight=registerObj.value/MaxVal*244;
              lastregisterObj.isHeight=lastregisterObj.value/MaxVal*244;
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
            var resultData =$this.currentCluesData.zugroupdayArr;
            var maxnum = 0;
            for(var i = 0;i<resultData.length;i++){
              for(var key in resultData[i]){
                if(key != 'id' && typeof(resultData[i][key]) == 'number' && resultData[i][key]>maxnum){
                  maxnum = resultData[i][key]
                }
              }
            }
            const zugroupdayColumn = new Column('zugroupdayChart', {
              data:resultData,
              isGroup: true,
              xField: 'name',
              yField: 'number',
              seriesField: 'title',
              width: 500,
              height: 300,
              color: ['#669aff', '#9dd5ff'],
              dodgePadding: 0,
              maxColumnWidth:25,
              legend:false,
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
                max: maxnum + 10,
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
            var resultData =$this.currentCluesData.zugoupmonthArr;
            var maxnum = 0;
            for(var i = 0;i<resultData.length;i++){
              for(var key in resultData[i]){
                if(key != 'id' && typeof(resultData[i][key]) == 'number' && resultData[i][key]>maxnum){
                  maxnum = resultData[i][key]
                }
              }
            }
            
            const zugoupmonthColumn = new Column('zugroupmonthChart', {
              data:resultData,
              isGroup: true,
              xField: 'name',
              yField: 'number',
              seriesField: 'title',
              width: 500,
              height: 300,
              //padding:[35,0,30,25],
              /** 设置颜色 */
              color: ['#fcb030', '#f7c572'],
              /** 设置间距 */
              dodgePadding: 0,
              maxColumnWidth:25,
              legend:false,
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
                max: maxnum + 10,
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
                  if($this.language=="Module_cnStat"){
                      var updatemtime=[];
                      var resMtimeOne=response.mtime.split(' ');
                      updatemtime=resMtimeOne[0].split('-');
                      updatemtime.push(resMtimeOne[1]);
                      $this.updatemtime=updatemtime;
                      $this.updateScoremonth=response.scoremonth;
                      if(response.yeardepartscore&&response.yeardepartscore.length>0){                   
                          if($this.costAverageData&&!$this.costAverageData.chart.destroyed){
                            $this.costAverageData.chart.destroy();
                          } 
                          if($this.yeardepartscoreData&&!$this.yeardepartscoreData.chart.destroyed){
                            $this.yeardepartscoreData.chart.destroy();
                          }
                          $this.currentCluesData.yeardepartscoreArr=[];
                          $this.currentCluesData.totalNumscore='';
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
                              departmentCostObj.score=Number(parseFloat(item.score).toFixed(2));
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
                          $this.currentCluesData.totalNumscore=Number(totalNumscore.toFixed(2));
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
                      $this.ScoreData.addallscore=Number(parseFloat(tolScore).toFixed(2));
                      $this.ScoreData.addallsnumber=Number(parseFloat(tolNumber).toFixed(2));
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
                  if($this.language=="Module_cnStat"){
                      var updatemtime=[];
                      var resMtimeOne=response.mtime.split(' ');
                      updatemtime=resMtimeOne[0].split('-');
                      updatemtime.push(resMtimeOne[1]);
                      $this.updatemtime=updatemtime;
                      $this.updateScoremonth=response.scoremonth;
                      if(response.yeardepartscore&&response.yeardepartscore.length>0){    
                          if($this.costAverageData&&!$this.costAverageData.chart.destroyed){
                            $this.costAverageData.chart.destroy();
                          } 
                          if($this.yeardepartscoreData&&!$this.yeardepartscoreData.chart.destroyed){
                            $this.yeardepartscoreData.chart.destroy();
                          }
                          $this.currentCluesData.yeardepartscoreArr=[];
                          $this.currentCluesData.totalNumscore='';
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
                              departmentCostObj.score=Number(parseFloat(item.score).toFixed(2));
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
                          $this.currentCluesData.totalNumscore=Number(totalNumscore.toFixed(2));
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
      var numList=[700,500,300,100];
      var defaulColor=['#ae1222','#f27042','#f1de5f','#a2bfcd', '#b3b3b3'];
      var trendArr=[];
      var maxNum='';
      var minNum='';
      $this.currentCluesData.cluesRegionData.forEach(function(item,index){
          if(maxNum<item.number){
            maxNum=item.number;
          }
          if(minNum>=item.number){
            minNum=item.number;
          }
      });
      if(maxNum>numList[0]){
        trendArr=defaulColor;
      }
      if(maxNum<=numList[numList.length-1]){
        trendArr=['#b3b3b3'];
      }
      for(var i=0;i<numList.length;i++){
        if(maxNum>=numList[i+1]&&maxNum<numList[i]){
          defaulColor.forEach(function(item,index){
              if(index>i){
                trendArr.push(item);
              }
          });
        }
      };
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
          position: 'bottom-left',
          itemHeight:20,
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
            if(obj.number <100){
                obj.trend="0-100";
            }else if(obj.number <300 && obj.number>=100){
                obj.trend="100-300";
            }else if(obj.number <500 && obj.number>=300){
                obj.trend="300-500";
            }else if(obj.number <700 && obj.number>=500){
                obj.trend="500-700";
            }else{
                obj.trend="大于700";
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
          .color('trend', trendArr)
          .tooltip('name*country*number')
          .style({
            fillOpacity: 1,
            stroke:"#fff"
          }).state({
              active: {
                style: {
                  lineWidth: 0,
                  stroke:0,
                  fillOpacity:0.8,
                },
              },
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

        //var monthDay = start.getFullYear()+"-"+(start.getMonth()+1>9?start.getMonth()+1:'0'+(start.getMonth()+1))+"-"+(start.getDate()+1>9?start.getDate():'0'+(start.getDate()));
        
        var lastYear='';
        var lastmonth='';
        var lastday='';
        if(start.getMonth()+1<=3){
          var absM = Math.abs((start.getMonth()+1)-3);
          lastYear = parseInt(start.getFullYear()) - Math.ceil(absM / 12 == 0 ? 1 : parseInt(absM) / 12);
          lastmonth = (12 - (absM % 12))>9?(12 - (absM % 12)):'0'+(12 - (absM % 12));
        }else{
          lastYear=start.getFullYear();
          lastmonth = start.getMonth()-1>9?start.getMonth()-1:'0'+(start.getMonth()-1);
        }
        var monthDay = lastYear+"-"+lastmonth+"-"+(start.getDate()+1>9?start.getDate():'0'+(start.getDate()));
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
        var DeparId='';
        $this.currentCluesData.DeparData.forEach(function(item,index){
          item.disabled=true;
          if(item.label=='电商一部'){
             DeparId=item.value;
          }
        });
        if(departID&&departID.length>0){
            if(departID.length==$this.currentCluesData.DeparData.length){
              $this.isDepart1=false;
              departName='中文'
            }else{
              if(departID.length==1){
                departID.forEach(function(item,index){
                  $this.currentCluesData.DeparData.forEach(function(items,indexs){
                    if(item==items.value){
                        departName=departName+items.label;
                    }
                  });
                  if(item==DeparId){
                    $this.isDepart1=true;
                  }else{
                    $this.isDepart1=false;
                  }
                });
              }else{
                $this.isDepart1=false;
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
            $this.isDepart1=false;
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
          $this.isDepart1 = false;
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
    // 组员成绩部门点击事件
    groupClick(){
      var $this = this;
      var GroupID=$this.zusuercount.GroupID;
      if(GroupID&&GroupID.length>0){
          if(GroupID.length==1){
            $this.zusuercount.zusuercountGroupnameArr.forEach(function(item,index){
              GroupID.forEach(function(items){
                if(items==item.value){
                  item.disabled=true;
                }else{
                  item.disabled=false;
                }
              });
            });
          }else{
              $this.zusuercount.zusuercountGroupnameArr.forEach(function(item,index){
                  item.disabled=false;
              });
          }
          var zusuercountArr=[];//分组-组员成绩
          GroupID.forEach(function(item,index){
              $this.zusuercount.zusuercountAllArr.forEach(function(items,indexs){
                  if(item==items.dept_id){
                      var itemData = {};
                      itemData.dept_id=items.dept_id;
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
                  }
              });
          });
          zusuercountArr.sort(function(a, b) {
                var value1 = a.monthnumber;
                var value2 = b.monthnumber;
                return value2 - value1;
          });
          if(zusuercountArr.length>7){
             $this.tableHidden.tableBtnVisible=true;
             $this.tableHidden.tableHeight=357+'px';
          }else{
             $this.tableHidden.tableBtnVisible=false;
             $this.tableHidden.tableHeight='auto';
          }
          $this.zusuercount.zusuercountArr = zusuercountArr;
      }else{
          var zusuercountArr=[];//分组-组员成绩
          $this.zusuercount.zusuercountAllArr.forEach(function(item,index){
            var itemData = {};
            itemData.dept_id=item.dept_id;
            itemData.groupname=item.groupname;
            itemData.lastdaynumber=item.lastdaynumber;
            itemData.lastmonthnumber=item.lastmonthnumber;
            itemData.monthnumber=item.monthnumber;
            itemData.todaynumber=item.todaynumber;
            itemData.username=item.username;
            if(item.monthnumber-item.lastmonthnumber>0){
              itemData.Class='rising'
            }
            if(item.monthnumber-item.lastmonthnumber<0){
              itemData.Class='falling'
            }
            if(item.monthnumber-item.lastmonthnumber==0){
              itemData.Class='equality'
            }
            itemData.Growth=Math.abs(item.monthnumber-item.lastmonthnumber);
            if(itemData.Growth==0){
              itemData.Growth='-'
            }
            zusuercountArr.push(itemData);
          })
          zusuercountArr.sort(function(a, b) {
                var value1 = a.monthnumber;
                var value2 = b.monthnumber;
                return value2 - value1;
          });
          if(zusuercountArr.length>7){
             $this.tableHidden.tableBtnVisible=true;
             $this.tableHidden.tableHeight=357+'px';
          }else{
             $this.tableHidden.tableBtnVisible=false;
             $this.tableHidden.tableHeight='auto';
          }
          $this.zusuercount.zusuercountArr = zusuercountArr;
      }
    },
    // 表格点击展开
    tableBtn(){
      var $this = this;
      $this.tableHidden.tableBtnBool=!$this.tableHidden.tableBtnBool;
      if($this.tableHidden.tableBtnBool){
        $this.tableHidden.tableHeight=357+'px';
        $this.tableHidden.tableBtnTxt='点击展开';
      }else{
        $this.tableHidden.tableHeight='auto';
        $this.tableHidden.tableBtnTxt='点击收起';
      }
    },
  }
}
</script>
<style lang="scss" scoped>
</style>