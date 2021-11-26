<template>
  <div class="page-root scroll-panel Sector-index" ref="boxPane">
      <div class="Sectorheader">
           <div class="SectorheaderItem">
              <div class="SectorHeaderOne">
                <span class="SectorHeaderTit">部门选择：</span>
                <el-checkbox class="SectorHeaderOneAll" :indeterminate="isAlldepartArr" border size="mini" v-model="checkAlldepartArr" 
                :disabled="checkAlldisabled"
                @change="handleCheckAllDepartArrChange">全部部门</el-checkbox>                
                <div class="SectorBox">
                      <div class="SectorBoxItem" v-for="item in departArr" v-bind:class="item.isOn?'active':''" v-bind:key="item.value" v-on:click="handleDepart(item.value)"><i></i><span>{{item.label}}</span></div>
                </div>
              </div>
              <div class="SectorHeaderOne">
                <span class="SectorHeaderTit">时间选择：</span>
                <span class="SectorHeaderOneBtn">
                    <i v-bind:class="item.isOn?'active':''" v-for="item in dateDimension" v-bind:key="item.value" v-on:click="dimensionChangeHandler(item)">{{item.label}}</i>
                </span>
                <div class="contrastTimeDay">
                    <el-date-picker
                      v-if="!searchData.isMonth"
                      v-model="searchData.dateOne"
                      @change="searchResult"
                      type="daterange"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      style="width: 220px"
                      key="a"
                      size="mini"
                      class="date-range"
                      range-separator="～"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :picker-options="pickerDateRangeOptions">
                    </el-date-picker>
                    <el-date-picker
                      v-else
                      v-model="searchData.dateOne"
                      @change="searchResult"
                      type="monthrange"
                      format="yyyy-MM"
                      value-format="yyyy-MM"
                      style="width: 220px"
                      key="b"
                      size="mini"
                      class="date-range"
                      range-separator="～"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :picker-options="pickerMonthRangeOptions">
                    </el-date-picker>
                </div>
                <div class="contrastBtn" v-bind:class="[searchData.comparedept_id.length>0?'is-disabled':'',searchData.isDateCompare?'active':'']" v-on:click="dateCompareChangeHandler"><i></i><span>对比</span></div>              
                <div class="contrastTimeDay" v-if="searchData.isDateCompare">
                    <el-date-picker
                      v-if="!searchData.isMonth"
                      v-model="searchData.comparedateOne"
                      @change="searchResult"
                      type="daterange"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      style="width: 220px"
                      key="c"
                      size="mini"
                      class="date-range"
                      range-separator="～"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :picker-options="pickerDateRangeOptions">
                    </el-date-picker>
                    <el-date-picker
                      v-else
                      v-model="searchData.comparedateOne"
                      @change="searchResult"
                      type="monthrange"
                      format="yyyy-MM"
                      value-format="yyyy-MM"
                      style="width: 220px"
                      key="d"
                      size="mini"
                      class="date-range"
                      range-separator="～"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :picker-options="pickerMonthRangeOptions">
                    </el-date-picker>
                </div>
              </div>
              <div class="SectorHeaderOne">
                <span class="SectorHeaderTit">分析项：</span>
                <div class="SectorBox">
                      <div class="SectorBoxItem" v-for="item in AnalysisItemArr" v-bind:class="[item.isOn?'active':'', item.disabled?'is-disabled':'']" v-bind:key="item.value" v-on:click="handleAnalysisItem(item)"><i></i><span>{{item.label}}</span></div>
                </div>
              </div>
           </div>
           <div class="SectorheaderTip"><p><i class="svg-i"><svg-icon icon-class="tips" class-name="disabled" /></i>{{tipsInfo}}</p></div>
      </div>     
      <div class="CompareItem" v-if="!searchData.isDateCompare&&searchData.dept_id.length>0">
        <span class="SectorHeaderTit">对比项：</span>
        <ul>
            <li v-if="searchData.dept_id.length>0" v-on:click="deleteDefaultGroup"><span>{{groupName}}</span><i class="svg-i"><svg-icon icon-class="close" class-name="disabled" /></i></li>
            <template v-if="searchData.comparedept_id.length>0">
                  <li v-if="item.isOn" v-for="item in contrastGroupList" v-bind:key="item.value" v-on:click="deleteContrastGroup(item.value)"><span>{{item.label}}</span><i class="svg-i"><svg-icon icon-class="close" class-name="disabled" /></i></li>
            </template>
        </ul>
        <div class="CompareItemAdd">
            <span class="CompareItemAddTit" v-on:click="toggleContrast"><i class="svg-i"><svg-icon icon-class="s-add" class-name="disabled" /></i><span>添加对比</span></span>
            <div class="group-contrast" v-show="isContrastShow">
              <div class="item-checkbox" v-bind:class="[item.disabled?'is-disabled':'',item.isOn?'active':'']" v-for="item in contrastGroupList" v-bind:key="item.value" v-on:click="contrastGroupChangeHandler(item)"><i></i><span>{{item.label}}</span></div>
              <div class="item-sure" v-on:click="saveContrastGroup">确定</div>
            </div>          
        </div>
      </div>
      <div class="SectorMain">          
            <div class="SectorRow flex-wrap" v-if="isDefaultPage||selectedType.includes('enquirieCount')">
                <div class="SectorRowFl" v-if="isDefaultPage||judgeData.singleGroupStatic||judgeData.singleGroupDateCompare||judgeData.singleGroupTeamCompare||judgeData.pluralGroupStatic||judgeData.pluralGroupDateCompare||(judgeData.pluralGroupTeamCompare&&!judgeData.pluralGroupTeamSameCompare)">
                      <div class="SectorRowTit">
                          <h3>部门询盘总数</h3>
                          <span class="unit">(单位：个)</span>
                          <span class="SectorRowTitBtn" v-if="isDefaultPage||judgeData.singleGroupTeamCompare||judgeData.pluralGroupStatic||(judgeData.pluralGroupTeamCompare&&!judgeData.pluralGroupTeamSameCompare)">
                                <i v-on:click="EnquiriesAccounted" v-bind:class="inBrandnum === 'Accounted'?'active':''">占比</i>
                                <i v-on:click="Enquiriesranking" v-bind:class="inBrandnum === 'ranking'?'active':''">排行</i>
                          </span>
                      </div>
                      <div class="defaultData" v-if="!judgeData.singleGroupDateCompare&&!judgeData.pluralGroupDateCompare&&inBrandnum=='current'">
                          <div class="defaultDataTop">
                              <div class="defaultDataDt">
                                  <strong>{{yeartongObj.allNum}}</strong>
                                  <span v-if="(isDefaultPage||judgeData.singleGroupStatic)&&(!searchData.isDateCompare||searchData.comparedept_id.length==0)">环比上年同期<i :class="(yeartongObj.allNum-yeartongObj.lastallNum)>0?'rising':'fall'">{{Math.abs(yeartongObj.allNum-yeartongObj.lastallNum)}}</i></span>
                              </div>
                              <p>总询盘数量</p>
                          </div>
                          <dl class="defaultDataBom"  v-if="(isDefaultPage||judgeData.singleGroupStatic)&&(!searchData.isDateCompare||searchData.comparedept_id.length==0)">
                            <dd v-if="searchData.comparedept_id.length==0"><p><strong>{{yeartongObj.avgNum}}</strong>月平均询盘个数</p></dd>
                            <dd v-if="searchData.comparedept_id.length==0"><p><strong>{{yeartongObj.historyNum}}</strong>历史峰值</p></dd>
                          </dl>
                      </div>
                      <template v-if="isDefaultPage||judgeData.singleGroupTeamCompare||judgeData.pluralGroupStatic||(judgeData.pluralGroupTeamCompare&&!judgeData.pluralGroupTeamSameCompare)">
                          <div class="ManyDepartData" v-if="inBrandnum=='Accounted'">
                              <piechart-manydepar :ManyDepartData="yeartongAccounted" v-if="yeartongAccounted.length>0" :key="chartTap" style="height:240px"></piechart-manydepar>
                          </div>
                          <div class="ManyDepartDatawas" v-if="inBrandnum=='ranking'">
                              <columnchart-manydepar :ManyDepartData="yeartongAccounted" v-if="yeartongAccounted.length>0" :key="chartTap" style="height:260px"></columnchart-manydepar>
                          </div>
                      </template>
                      <div class="singleDepartTimeCompare" v-if="(judgeData.singleGroupDateCompare||judgeData.pluralGroupDateCompare)&&inBrandnum=='contrast'">
                        <ul class="TimeCompareTop">
                            <li v-for="(item,index) in DepartTimeCompare" :key="index" :style="'width:'+item.percen">
                                <p class="time">{{item.year}}<span>{{item.value}}</span></p>
                                <p class="contrast">
                                    <span class="percen"><i></i></span>
                                </p>
                            </li>
                        </ul>
                        <ul class="TimeCompareBom">
                            <li>
                                <i class="svg-i"><svg-icon icon-class="home_num" /></i>
                                <p><span>同比增长量</span>
                                <strong :class="(yeartongObj.allNum-yeartongObj.lastallNum)>=0?'':'falling'">{{Math.abs(yeartongObj.allNum-yeartongObj.lastallNum)}}<i>{{(yeartongObj.allNum-yeartongObj.lastallNum)>=0?'↑':'↓'}}</i></strong>
                                </p>
                            </li>
                            <li>
                                <i class="svg-i"><svg-icon icon-class="home_rate" /></i>
                                <p><span>同比增长率</span><strong :class="(yeartongObj.allNum-yeartongObj.lastallNum)>=0?'':'falling'">{{sametimeRate}}<i>{{(yeartongObj.allNum-yeartongObj.lastallNum)>=0?'↑':'↓'}}</i></strong></p>
                            </li>
                        </ul>
                      </div>
                </div>
                <div class="SectorRowFr flex-content">
                      <div class="SectorRowTit">
                          <h3>{{!isDefaultPage&&!searchData.isMonth?"日":"月"}}部门询盘趋势</h3>
                          <span class="unit">(单位：个)</span>
                      </div>
                      <div class="SectorRowFrBox"><areaday-enquiriestrend :dayEnquiriesTrendArr="dayEnquiriesTrend" v-if="dayEnquiriesTrend.dayxuntrend" :key="chartTap" style="height:320px"></areaday-enquiriestrend></div>
                </div>
            </div>
            <div class="SectorRow flex-wrap" v-if="isDefaultPage||selectedType.includes('scoreDealCount')">
                <div class="SectorRowFl" v-if="isDefaultPage||judgeData.singleGroupStatic||judgeData.singleGroupDateCompare||judgeData.singleGroupTeamCompare||judgeData.pluralGroupStatic||judgeData.pluralGroupDateCompare||(judgeData.pluralGroupTeamCompare&&!judgeData.pluralGroupTeamSameCompare)">
                      <div class="SectorRowTit">
                          <h3>部门成交总数</h3>
                          <span class="unit">(单位：个)</span>
                          <span class="SectorRowTitBtn" v-if="isDefaultPage||judgeData.singleGroupTeamCompare||judgeData.pluralGroupStatic||(judgeData.pluralGroupTeamCompare&&!judgeData.pluralGroupTeamSameCompare)">
                                <i v-on:click="ClinchAccounted" v-bind:class="inBrandnumScore === 'scoreAccounted'?'active':''">占比</i>
                                <i v-on:click="Clinchranking" v-bind:class="inBrandnumScore === 'scoreRanking'?'active':''">排行</i>
                          </span>
                      </div>
                      <div class="defaultData" v-if="!judgeData.singleGroupDateCompare&&!judgeData.pluralGroupDateCompare&&inBrandnumScore=='current'">
                          <div class="defaultDataTop">
                              <div class="defaultDataDt">
                                  <strong>{{yearscoretongObj.allNum}}</strong>
                                  <span v-if="(isDefaultPage||judgeData.singleGroupStatic)&&(!searchData.isDateCompare||searchData.comparedept_id.length==0)">环比上年同期<i :class="(yearscoretongObj.allNum-yearscoretongObj.lastallNum)>0?'rising':'fall'">{{Math.abs(yearscoretongObj.allNum-yearscoretongObj.lastallNum)}}</i></span>
                              </div>
                              <p>总成交分</p>
                          </div>
                          <dl class="defaultDataBom"  v-if="(isDefaultPage||judgeData.singleGroupStatic)&&(!searchData.isDateCompare||searchData.comparedept_id.length==0)">
                            <dd v-if="searchData.comparedept_id.length==0"><p><strong>{{yearscoretongObj.avgNum}}</strong>月平均成交分</p></dd>
                            <dd v-if="searchData.comparedept_id.length==0"><p><strong>{{yearscoretongObj.historyNum}}</strong>历史峰值</p></dd>
                          </dl>
                      </div>
                      <template v-if="isDefaultPage||judgeData.singleGroupTeamCompare||judgeData.pluralGroupStatic||(judgeData.pluralGroupTeamCompare&&!judgeData.pluralGroupTeamSameCompare)">
                        <div class="ManyDepartData" v-if="inBrandnumScore=='scoreAccounted'">
                            <piechart-manydepar :ManyDepartData="yeartongscoreAccounted" v-if="yeartongscoreAccounted.length>0" :key="chartTap" style="height:240px"></piechart-manydepar>
                        </div>
                        <div class="ManyDepartDatawas" v-if="inBrandnumScore=='scoreRanking'">
                            <columnchart-manydepar :ManyDepartData="yeartongscoreAccounted" v-if="yeartongscoreAccounted.length>0" :key="chartTap" style="height:260px"></columnchart-manydepar>
                        </div>
                      </template>
                      <div class="singleDepartTimeCompare" v-if="(judgeData.singleGroupDateCompare||judgeData.pluralGroupDateCompare)&&inBrandnumScore=='contrast'">
                        <ul class="TimeCompareTop">
                            <li v-for="(item,index) in DepartTimeCompareScore" :key="index" :style="'width:'+item.percen">
                                <p class="time">{{item.year}}<span>{{item.value}}</span></p>
                                <p class="contrast">
                                    <span class="percen"><i></i></span>
                                </p>
                            </li>
                        </ul>
                        <ul class="TimeCompareBom">
                            <li>
                                <i class="svg-i"><svg-icon icon-class="home_num" /></i>
                                <p><span>同比增长量</span>
                                <strong :class="(yearscoretongObj.allNum-yearscoretongObj.lastallNum)>=0?'':'falling'">{{Math.abs(yearscoretongObj.allNum-yearscoretongObj.lastallNum)}}<i>{{(yearscoretongObj.allNum-yearscoretongObj.lastallNum)>=0?'↑':'↓'}}</i></strong>
                                </p>
                            </li>
                            <li>
                                <i class="svg-i"><svg-icon icon-class="home_rate" /></i>
                                <p><span>同比增长率</span><strong :class="(yearscoretongObj.allNum-yearscoretongObj.lastallNum)>=0?'':'falling'">{{sametimeRateScore}}<i>{{(yearscoretongObj.allNum-yearscoretongObj.lastallNum)>=0?'↑':'↓'}}</i></strong></p>
                            </li>
                        </ul>
                      </div>
                </div>
                <div class="SectorRowFr flex-content">
                      <div class="SectorRowTit">
                          <h3>月部门成交趋势</h3>
                          <span class="unit">(单位：个)</span>
                      </div>
                      <div class="SectorRowFrBox">
                      <areaday-enquiriestrend :dayEnquiriesTrendArr="yearscoretongArr" v-if="yearscoretongArr.dayxuntrend" :key="chartTap" style="height:320px"></areaday-enquiriestrend>                      
                      </div>
                </div>
            </div>
            <div class="SectorRow flex-wrap" v-if="isDefaultPage||selectedType.includes('moneyCostCount')">
                <div class="SectorRowFl" v-if="isDefaultPage||judgeData.singleGroupStatic||judgeData.singleGroupDateCompare||judgeData.singleGroupTeamCompare||judgeData.pluralGroupStatic||judgeData.pluralGroupDateCompare||(judgeData.pluralGroupTeamCompare&&!judgeData.pluralGroupTeamSameCompare)">
                      <div class="SectorRowTit">
                          <h3>部门成本总数</h3>
                          <span class="unit">(单位：个)</span>
                          <span class="SectorRowTitBtn" v-if="isDefaultPage||judgeData.singleGroupTeamCompare||judgeData.pluralGroupStatic||(judgeData.pluralGroupTeamCompare&&!judgeData.pluralGroupTeamSameCompare)">
                                <i v-on:click="CostAccounted" v-bind:class="inBrandnumMonye === 'monyeAccounted'?'active':''">占比</i>
                                <i v-on:click="Costranking" v-bind:class="inBrandnumMonye === 'monyeRanking'?'active':''">排行</i>
                          </span>
                      </div>
                      <div class="defaultData" v-if="!judgeData.singleGroupDateCompare&&!judgeData.pluralGroupDateCompare&&inBrandnumMonye=='current'">
                          <div class="defaultDataTop">
                              <div class="defaultDataDt">
                                  <strong>{{yearmonyetongObj.allNum}}</strong>
                                  <span v-if="(isDefaultPage||judgeData.singleGroupStatic)&&(!searchData.isDateCompare||searchData.comparedept_id.length==0)">环比上年同期<i :class="(yearmonyetongObj.allNum-yearmonyetongObj.lastallNum)>0?'rising':'fall'">{{Math.abs(yearmonyetongObj.allNum-yearmonyetongObj.lastallNum)}}</i></span>
                              </div>
                              <p>总成本</p>
                          </div>
                          <dl class="defaultDataBom"  v-if="(isDefaultPage||judgeData.singleGroupStatic)&&(!searchData.isDateCompare||searchData.comparedept_id.length==0)">
                            <dd v-if="searchData.comparedept_id.length==0"><p><strong>{{yearmonyetongObj.avgNum}}</strong>月平均成本</p></dd>
                            <dd v-if="searchData.comparedept_id.length==0"><p><strong>{{yearmonyetongObj.historyNum}}</strong>历史峰值</p></dd>
                          </dl>
                      </div>
                      <template v-if="isDefaultPage||judgeData.singleGroupTeamCompare||judgeData.pluralGroupStatic||(judgeData.pluralGroupTeamCompare&&!judgeData.pluralGroupTeamSameCompare)">
                          <div class="ManyDepartData" v-if="inBrandnumMonye=='monyeAccounted'">
                              <piechart-manydepar :ManyDepartData="yeartongmonyeAccounted" v-if="yeartongmonyeAccounted.length>0" :key="chartTap" style="height:240px"></piechart-manydepar>
                          </div>
                          <div class="ManyDepartDatawas" v-if="inBrandnumMonye=='monyeRanking'">
                              <columnchart-manydepar :ManyDepartData="yeartongmonyeAccounted" v-if="yeartongmonyeAccounted.length>0" :key="chartTap" style="height:260px"></columnchart-manydepar>
                          </div>
                      </template>
                      <div class="singleDepartTimeCompare" v-if="(judgeData.singleGroupDateCompare||judgeData.pluralGroupDateCompare)&&inBrandnumMonye=='contrast'">
                        <ul class="TimeCompareTop">
                            <li v-for="(item,index) in DepartTimeCompareMonye" :key="index" :style="'width:'+item.percen">
                                <p class="time">{{item.year}}<span>{{item.value}}</span></p>
                                <p class="contrast">
                                    <span class="percen"><i></i></span>
                                </p>
                            </li>
                        </ul>
                        <ul class="TimeCompareBom">
                            <li>
                                <i class="svg-i"><svg-icon icon-class="home_num" /></i>
                                <p><span>同比增长量</span>
                                <strong :class="(yearmonyetongObj.allNum-yearmonyetongObj.lastallNum)>=0?'':'falling'">{{Math.abs(yearmonyetongObj.allNum-yearmonyetongObj.lastallNum)}}<i>{{(yearmonyetongObj.allNum-yearmonyetongObj.lastallNum)>=0?'↑':'↓'}}</i></strong>
                                </p>
                            </li>
                            <li>
                                <i class="svg-i"><svg-icon icon-class="home_rate" /></i>
                                <p><span>同比增长率</span><strong :class="(yearmonyetongObj.allNum-yearmonyetongObj.lastallNum)>=0?'':'falling'">{{sametimeRateMonye}}<i>{{(yearmonyetongObj.allNum-yearmonyetongObj.lastallNum)>=0?'↑':'↓'}}</i></strong></p>
                            </li>
                        </ul>
                      </div>
                </div>
                <div class="SectorRowFr flex-content">
                      <div class="SectorRowTit">
                          <h3>月部门成本趋势</h3>
                          <span class="unit">(单位：个)</span>
                      </div>
                      <div class="SectorRowFrBox">
                      <areaday-enquiriestrend :dayEnquiriesTrendArr="yearmonyetongArr" v-if="yearmonyetongArr.dayxuntrend" :key="chartTap" style="height:320px"></areaday-enquiriestrend>
                      </div>
                </div>
            </div>
            <div class="SectorRow flex-wrap" v-if="isDefaultPage||selectedType.includes('scoreCount')">
                <div class="SectorRowFl" v-if="isDefaultPage||judgeData.singleGroupStatic||judgeData.singleGroupDateCompare||judgeData.singleGroupTeamCompare||judgeData.pluralGroupStatic||judgeData.pluralGroupDateCompare||(judgeData.pluralGroupTeamCompare&&!judgeData.pluralGroupTeamSameCompare)">
                      <div class="SectorRowTit">
                          <h3>部门成交个数总数</h3>
                          <span class="unit">(单位：个)</span>
                          <span class="SectorRowTitBtn" v-if="isDefaultPage||judgeData.singleGroupTeamCompare||judgeData.pluralGroupStatic||(judgeData.pluralGroupTeamCompare&&!judgeData.pluralGroupTeamSameCompare)">
                                <i v-on:click="ScoreNumAccounted" v-bind:class="inBrandnumScoreNum === 'scoreNumAccounted'?'active':''">占比</i>
                                <i v-on:click="ScoreNumranking" v-bind:class="inBrandnumScoreNum === 'scoreNumRanking'?'active':''">排行</i>
                          </span>
                      </div>
                      <div class="defaultData" v-if="!judgeData.singleGroupDateCompare&&!judgeData.pluralGroupDateCompare&&inBrandnumScoreNum=='current'">
                          <div class="defaultDataTop">
                              <div class="defaultDataDt">
                                  <strong>{{yearscorenumbertongObj.allNum}}</strong>
                                  <span v-if="(isDefaultPage||judgeData.singleGroupStatic)&&(!searchData.isDateCompare||searchData.comparedept_id.length==0)">环比上年同期<i :class="(yearscorenumbertongObj.allNum-yearscorenumbertongObj.lastallNum)>0?'rising':'fall'">{{Math.abs(yearscorenumbertongObj.allNum-yearscorenumbertongObj.lastallNum)}}</i></span>
                              </div>
                              <p>总成本</p>
                          </div>
                          <dl class="defaultDataBom" v-if="(isDefaultPage||judgeData.singleGroupStatic)&&(!searchData.isDateCompare||searchData.comparedept_id.length==0)">
                            <dd v-if="searchData.comparedept_id.length==0"><p><strong>{{yearscorenumbertongObj.avgNum}}</strong>月平均成本</p></dd>
                            <dd v-if="searchData.comparedept_id.length==0"><p><strong>{{yearscorenumbertongObj.historyNum}}</strong>历史峰值</p></dd>
                          </dl>
                      </div>
                      <template v-if="isDefaultPage||judgeData.singleGroupTeamCompare||judgeData.pluralGroupStatic||(judgeData.pluralGroupTeamCompare&&!judgeData.pluralGroupTeamSameCompare)">
                          <div class="ManyDepartData" v-if="inBrandnumScoreNum=='scoreNumAccounted'">
                              <piechart-manydepar :ManyDepartData="yeartongscoreNumAccounted" v-if="yeartongscoreNumAccounted.length>0" :key="chartTap" style="height:240px"></piechart-manydepar>
                          </div>
                          <div class="ManyDepartDatawas" v-if="inBrandnumScoreNum=='scoreNumRanking'">
                              <columnchart-manydepar :ManyDepartData="yeartongscoreNumAccounted" v-if="yeartongscoreNumAccounted.length>0" :key="chartTap" style="height:260px"></columnchart-manydepar>
                          </div>
                      </template>
                      <div class="singleDepartTimeCompare" v-if="(judgeData.singleGroupDateCompare||judgeData.pluralGroupDateCompare)&&inBrandnumScoreNum=='contrast'">
                        <ul class="TimeCompareTop">
                            <li v-for="(item,index) in DepartTimeCompareScorenum" :key="index" :style="'width:'+item.percen">
                                <p class="time">{{item.year}}<span>{{item.value}}</span></p>
                                <p class="contrast">
                                    <span class="percen"><i></i></span>
                                </p>
                            </li>
                        </ul>
                        <ul class="TimeCompareBom">
                            <li>
                                <i class="svg-i"><svg-icon icon-class="home_num" /></i>
                                <p><span>同比增长量</span>
                                <strong :class="(yearscorenumbertongObj.allNum-yearscorenumbertongObj.lastallNum)>=0?'':'falling'">{{Math.abs(yearscorenumbertongObj.allNum-yearscorenumbertongObj.lastallNum)}}<i>{{(yearscorenumbertongObj.allNum-yearscorenumbertongObj.lastallNum)>=0?'↑':'↓'}}</i></strong>
                                </p>
                            </li>
                            <li>
                                <i class="svg-i"><svg-icon icon-class="home_rate" /></i>
                                <p><span>同比增长率</span><strong :class="(yearscorenumbertongObj.allNum-yearscorenumbertongObj.lastallNum)>=0?'':'falling'">{{sametimeRateScorenum}}<i>{{(yearscorenumbertongObj.allNum-yearscorenumbertongObj.lastallNum)>=0?'↑':'↓'}}</i></strong></p>
                            </li>
                        </ul>
                      </div>
                </div>
                <div class="SectorRowFr flex-content">
                      <div class="SectorRowTit">
                          <h3>月部门成交个数趋势</h3>
                          <span class="unit">(单位：个)</span>
                      </div>
                      <div class="SectorRowFrBox">
                      <areaday-enquiriestrend :dayEnquiriesTrendArr="yearscoreNumtongArr" v-if="yearscoreNumtongArr.dayxuntrend" :key="chartTap" style="height:320px"></areaday-enquiriestrend>
                      </div>
                </div>
            </div>
            <div class="xunMapRow" v-if="selectedType.includes('enquirieRegion')&&searchData.dept_id.length>0">
                  <div class="SectorRowTit">
                      <h3>询盘地图展示（地区询盘排行榜）</h3>
                      <span class="unit">(单位：个)</span>
                  </div>
                  <div class="flex-wrap">
                      <div class="flex-content MapRowCon" :class="(searchData.comparedept_id.length==0&&selectedType.includes('enquirieRegion')?'MapRowConXun':'',item.MapNum>2?'MapRowclass':'')" :style="'width:'+ 100/MapAny.length+'%'" v-for="(item,index) in MapAny" :key='index'>
                          <h4 v-if="MapAny.length>3">{{item.name}}</h4>
                          <daymap-chart :mapanychart="item" v-if="item.MapNum>0" :key="chartTap" ></daymap-chart>
                      </div>
                  </div>
            </div>
            <div class="xunMapRow" v-if="selectedType.includes('scoreDealRegion')&&searchData.dept_id.length>0">
                  <div class="SectorRowTit">
                      <h3>成交地图展示（地区成交排行榜）</h3>
                      <span class="unit">(单位：个)</span>
                  </div>
                  <div class="flex-wrap">
                      <div class="flex-content MapRowCon" :class="(searchData.comparedept_id.length==0&&selectedType.includes('scoreDealRegion')?'MapRowConXun':'',item.MapNum>2?'MapRowclass':'')" :style="'width:'+ 100/ScoreMapAny.length+'%'" v-for="(item,index) in ScoreMapAny" :key='index'>
                          <h4 v-if="ScoreMapAny.length>3">{{item.name}}</h4>
                          <daymap-chart :mapanychart="item" v-if="item.MapNum>0" :key="chartTap" ></daymap-chart>
                      </div>
                  </div>
            </div>
            <div class="xunMapRow" v-if="selectedType.includes('scoreMapCount')&&searchData.dept_id.length>0">
                  <div class="SectorRowTit">
                      <h3>成交个数地图展示（地区成交排行榜）</h3>
                      <span class="unit">(单位：个)</span>
                  </div>
                  <div class="flex-wrap">
                      <div class="flex-content MapRowCon" :class="(searchData.comparedept_id.length==0&&selectedType.includes('scoreMapCount')?'MapRowConXun':'',item.MapNum>2?'MapRowclass':'')" :style="'width:'+ 100/ScorenumMapAny.length+'%'" v-for="(item,index) in ScorenumMapAny" :key='index'>
                          <h4 v-if="ScorenumMapAny.length>3">{{item.name}}</h4>
                          <daymap-chart :mapanychart="item" v-if="item.MapNum>0" :key="chartTap" ></daymap-chart>
                      </div>
                  </div>
            </div>            
            <div class="SectorRowPro" :class="ProductAnaly.length>1?'half':''" v-if="selectedType.includes('product')&&searchData.isMonth"> 
                <div class="SectorRowTit"><h3>产品分析</h3></div>               
                <div class="SectorRowProMain" v-if="ProductAnaly.length==1">
                     <ul>
                        <li v-for="(item,index) in ProductAnaly" :key="index">
                            <div class="SectorRowTop">
                                <dl class="SectorRowProChatTop">
                                    <dd :class="item.TabName === 'xunnumber'?'active':''" v-on:click="chartBtn(item.id,'xunnumber')">询盘个数</dd>
                                    <dd :class="item.TabName === 'buynumber'?'active':''" v-on:click="chartBtn(item.id,'buynumber')">成交个数</dd>
                                    <dd :class="item.TabName === 'score'?'active':''" v-on:click="chartBtn(item.id,'score')">成交积分</dd>
                                </dl>
                            </div>
                            <div class="SectorRowBom flex-box">
                              <div class="SectorRowProTable flex-content">
                                  <div class="SectorRowProhidden" :style="'height:' + item.tableHidden.tableHeight">
                                      <el-table
                                          ref="simpleTable"
                                          :data="item.ProductArr"
                                          tooltip-effect="dark"
                                          stripe
                                          class="SectorProTable"
                                          style="width: 100%">
                                          <el-table-column prop="name" label="设备名称" aglin="center" min-width="100px">
                                              <template slot-scope="scope">
                                              <p class="SectorProTableName">{{ scope.row.name }}</p>
                                              </template>
                                          </el-table-column>
                                          <el-table-column prop="xunnumber" label="询盘个数" aglin="center" width="80px"></el-table-column>
                                          <el-table-column prop="buynumber" label="成交个数" aglin="center" width="80px"></el-table-column>
                                          <el-table-column prop="score" label="成交积分" aglin="center" width="80px"></el-table-column>
                                      </el-table>
                                  </div>
                                  <p class="SectorRowProBtn"
                                      v-if="item.tableHidden.tableBtnVisible"
                                      v-on:click="ProductAnyBtnPlug(item.id)"
                                  ><span>{{ item.tableHidden.tableBtnTxt }}</span></p>
                              </div>
                              <div class="SectorRowProChat">
                                  <product-anachart :visible='item.TabName' :ProductAnyDate="item.ProductTopTen" :TabNameAny='item.TabName' v-if="item.ProductTopTen" :key="chartTap"></product-anachart>
                              </div>
                            </div>
                        </li>
                     </ul>
                </div>
                <div class="SectorRowProMain" v-else>  
                     <ul>
                        <li v-for="(item,index) in ProductAnaly" :key="index">
                          <template v-if="(index+1)%2===1">
                            <div class="SectorRowTop">
                                <h4 v-if="ProductAnaly.length>1">{{item.name}}</h4>
                                <dl class="SectorRowProChatTop">
                                    <dd :class="item.TabName === 'xunnumber'?'active':''" v-on:click="chartBtn(item.id,'xunnumber')">询盘个数</dd>
                                    <dd :class="item.TabName === 'buynumber'?'active':''" v-on:click="chartBtn(item.id,'buynumber')">成交个数</dd>
                                    <dd :class="item.TabName === 'score'?'active':''" v-on:click="chartBtn(item.id,'score')">成交积分</dd>
                                </dl>
                            </div>
                            <div class="SectorRowBom flex-box">
                              <div class="SectorRowProTable flex-content">
                                  <div class="SectorRowProhidden" :style="'height:' + item.tableHidden.tableHeight">
                                      <el-table
                                          ref="simpleTable"
                                          :data="item.ProductArr"
                                          tooltip-effect="dark"
                                          stripe
                                          class="SectorProTable"
                                          style="width: 100%">
                                          <el-table-column prop="name" label="设备名称" aglin="center" min-width="100px">
                                              <template slot-scope="scope">
                                              <p class="SectorProTableName">{{ scope.row.name }}</p>
                                              </template>
                                          </el-table-column>
                                          <el-table-column prop="xunnumber" label="询盘个数" aglin="center" width="80px"></el-table-column>
                                          <el-table-column prop="buynumber" label="成交个数" aglin="center" width="80px"></el-table-column>
                                          <el-table-column prop="score" label="成交积分" aglin="center" width="80px"></el-table-column>
                                      </el-table>
                                  </div>
                                  <p class="SectorRowProBtn" :style="'top:'+ item.tableHidden.tableBtn"
                                      v-if="item.tableHidden.tableBtnVisible"
                                      v-on:click="ProductAnyBtnPlug(item.id)"
                                  ><span>{{ item.tableHidden.tableBtnTxt }}</span></p>
                              </div>
                              <div class="SectorRowProChat">
                                  <product-anachart :visible='item.TabName' :ProductAnyDate="item.ProductTopTen" :TabNameAny='item.TabName' v-if="item.ProductTopTen" :key="chartTap"></product-anachart>
                              </div>
                            </div>
                          </template>
                        </li>
                     </ul>
                     <ul>
                        <li v-for="(item,index) in ProductAnaly" :key="index">
                          <template v-if="(index+1)%2===0">
                            <div class="SectorRowTop">
                                <h4 v-if="ProductAnaly.length>1">{{item.name}}</h4>
                                <dl class="SectorRowProChatTop">
                                    <dd :class="item.TabName === 'xunnumber'?'active':''" v-on:click="chartBtn(item.id,'xunnumber')">询盘个数</dd>
                                    <dd :class="item.TabName === 'buynumber'?'active':''" v-on:click="chartBtn(item.id,'buynumber')">成交个数</dd>
                                    <dd :class="item.TabName === 'score'?'active':''" v-on:click="chartBtn(item.id,'score')">成交积分</dd>
                                </dl>
                            </div>
                            <div class="SectorRowBom flex-box">
                              <div class="SectorRowProTable flex-content">
                                  <div class="SectorRowProhidden" :style="'height:' + item.tableHidden.tableHeight">
                                      <el-table
                                          ref="simpleTable"
                                          :data="item.ProductArr"
                                          tooltip-effect="dark"
                                          stripe
                                          class="SectorProTable"
                                          style="width: 100%">
                                          <el-table-column prop="name" label="设备名称" aglin="center" min-width="100px">
                                              <template slot-scope="scope">
                                              <p class="SectorProTableName">{{ scope.row.name }}</p>
                                              </template>
                                          </el-table-column>
                                          <el-table-column prop="xunnumber" label="询盘个数" aglin="center" width="80px"></el-table-column>
                                          <el-table-column prop="buynumber" label="成交个数" aglin="center" width="80px"></el-table-column>
                                          <el-table-column prop="score" label="成交积分" aglin="center" width="80px"></el-table-column>
                                      </el-table>
                                  </div>
                                  <p class="SectorRowProBtn" :style="'top:'+ item.tableHidden.tableBtn"
                                      v-if="item.tableHidden.tableBtnVisible"
                                      v-on:click="ProductAnyBtnPlug(item.id)"
                                  ><span>{{ item.tableHidden.tableBtnTxt }}</span></p>
                              </div>
                              <div class="SectorRowProChat">
                                  <product-anachart :visible='item.TabName' :ProductAnyDate="item.ProductTopTen" :TabNameAny='item.TabName' v-if="item.ProductTopTen" :key="chartTap"></product-anachart>
                              </div>
                            </div>
                          </template>
                        </li>
                     </ul>
                </div>
            </div>
      </div>
    <el-backtop target=".scroll-panel"></el-backtop>
  </div>
</template>
<script>
import LinedepartChartenquiries from "./components/LinedepartChartenquiries";
import PiechartManydepar from "./components/PiechartManydepar";
import ColumnchartManydepar from "./components/ColumnchartManydepar";
import AreadayEnquiriestrend from "./components/AreadayEnquiriestrend";
import NocomparMap from "./components/NocomparMap";
import DaymapChart from "./components/DaymapChart";
import ChartContrast from "./components/ChartContrast";
import ProductAnachart from "./components/ProductAnachart";
import {MapInterval,TopTenColor} from "@/utils/MapColor"
import { worldCountry } from "@/utils/worldCountry";
export default {
  name: "sectorAnalysis",
  data() {
    return {
      isDefaultPage:true,
      chartTap:false,//图片切换刷新
      inBrandnum:'current',
      inBrandnumScore:'current',
      inBrandnumMonye:'current',
      inBrandnumScoreNum:'current',
      departArr:[],//部门数据
      isAlldepartArr:false,
      checkAlldepartArr:false,
      checkAlldisabled:false,
      dateDimension:[
        {label:"日",value:"day",isOn:true},
        {label:"月",value:"month",isOn:false},
      ],//时间数据    
      pickerDateRangeOptions: {
        shortcuts: [{
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 1);
            picker.$emit('pick', [start, end]);
          }
        }, {
            text: '上月',
            onClick(picker) {
              var date = new Date();
              var year = date.getFullYear().toString();
              //获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
              var month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1).toString():(date.getMonth()+1).toString();
              var end = year + '-' + month + '-01';
              var start = '';
            
              if(month == '01'){
                start = (parseInt(year) - 1) + '-12-01';
              }else{
                start = parseInt(month) - 1>9 ? year + '-' + (parseInt(month) - 1)  + '-01':year + '-0' + (parseInt(month) - 1)  + '-01';
              }
              picker.$emit('pick', [start, end]);
            }
        }, {
          text: '本月',
          onClick(picker) {
            var date = new Date();
            var year = date.getFullYear().toString();
            //获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
            var month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1).toString():(date.getMonth()+1).toString();
            var end = '';
            var start = year + '-' + month + '-01';
            if(month == '12'){
              end = (parseInt(year) + 1) + '-01-01';
            }else{
              end = parseInt(month) + 1>9 ? year + '-' + (parseInt(month) + 1)  + '-01':year + '-0' + (parseInt(month) + 1)  + '-01';
            }
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      pickerMonthRangeOptions: {
        shortcuts: [{
          text: '今年至今',
          onClick(picker) {
            const end = new Date();
            const start = new Date(new Date().getFullYear(), 0);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 6);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      AnalysisItemArr:[
        {id:1,label:'询盘个数趋势分析',value:"enquirieCount",isOn:false,disabled:false},
        {id:2,label:'成交积分趋势分析',value:"scoreDealCount",isOn:false,disabled:true},
        {id:3,label:'成本趋势分析',value:"moneyCostCount",isOn:false,disabled:true},
        {id:4,label:'询盘个数地区分析',value:"enquirieRegion",isOn:false,disabled:false},
        {id:5,label:'成交积分地区分析',value:"scoreDealRegion",isOn:false,disabled:true},
        {id:6,label:'产品分析',value:"product",isOn:false,disabled:true},
        {id:7,label:'成交个数地区地图分析',value:"scoreMapCount",isOn:false,disabled:true},
        {id:8,label:'成交个数分析',value:"scoreCount",isOn:false,disabled:true},
      ],
      tipsInfo:"当前状态部门分析默认页。",
      dayEnquiriesTrend:{},     //各个部门询盘
      yeartongAccounted:[],     //各个部门询盘占比
      yeartongRanking:[],     //各个部门询盘排行 
      yeartongTimethan:[],     //各个部门询盘时间占比 

      yearscoretongArr:[],      //各个部门月成交 
      yeartongscoreAccounted:[],     //各个部门成交占比
      yeartongscoreRanking:[],     //各个部门成交排行 
      yeartongscoreTimethan:[],     //各个部门成交时间占比

      yearmonyetongArr:[],//各个部门月成本
      yeartongmonyeAccounted:[],     //各个部门成本占比
      yeartongmonyeRanking:[],     //各个部门成本排行 
      yeartongmonyeTimethan:[],     //各个部门成本时间占比

      yearscoreNumtongArr:[],//各个部门月成交个数
      yeartongscoreNumAccounted:[],     //各个部门成交个数占比
      yeartongscoreNumRanking:[],     //各个部门成交个数排行 
      yeartongscoreNumTimethan:[],     //各个部门成交个数时间占比

      ProductAnaly:[],     //产品分析
      MapAny:[],     //询盘地区分析分析
      ScoreMapAny:[],     //成交地区分析
      ScorenumMapAny:[],     //成交个数地图分析

      sametimeRate:'',
      DepartTimeCompare:[],
      sametimeRateScore:'',
      DepartTimeCompareScore:[],
      sametimeRateMonye:'',
      DepartTimeCompareMonye:[],
      sametimeRateScorenum:'',
      DepartTimeCompareScorenum:[],
      yeartongObj:{
        allNum:0,
        lastallNum:0,
        avgNum:0,
        historyNum:0,
      },
      yearscoretongObj:{
        allNum:0,
        lastallNum:0,
        avgNum:0,
        historyNum:0,
      },
      yearmonyetongObj:{
        allNum:0,
        lastallNum:0,
        avgNum:0,
        historyNum:0,
      },
      yearscorenumbertongObj:{
        allNum:0,
        lastallNum:0,
        avgNum:0,
        historyNum:0,
      },
      selectedType:[],   //主题展示对比项
      searchData:{
        dateOne:[],
        comparedateOne:[],
        isMonth:false,
        isDateCompare:false,
        dept_id:[],
        type:[],
        comparedept_id:[],
      },
      contrastGroupList:[],//对比小组数据
      oldContrastGroupID:'',
      groupName:"",
      isContrastShow:false,//控制对比选项显隐 
      judgeData:{},//底层逻辑
    };
  },
  components: {
    LinedepartChartenquiries,
    PiechartManydepar,
    ColumnchartManydepar,
    AreadayEnquiriestrend,
    NocomparMap,
    DaymapChart,
    ChartContrast,
    ProductAnachart,
  },
  created() {
    var $this = this;
    $this.AnalysisItemPlug();
    $this.initData();
  },
  methods: {
    //点击筛选事件底层逻辑
    judgeChartStatus(){
      var $this = this;
      var judgeData = {};
      judgeData.singleGroupStatic = false;          // 单基础部门统计
      judgeData.singleGroupDateCompare = false;     // 单基础部门时间对比
      judgeData.singleGroupTeamCompare = false;     // 单基础部门与其他小组对比
      judgeData.pluralGroupStatic = false;          // 多基础部门统计
      judgeData.pluralGroupDateCompare = false;     // 多基础部门的时间对比
      judgeData.pluralGroupTeamCompare = false;     // 多基础部门与其他部门对比
      judgeData.pluralGroupTeamSameCompare = false; // 多基础部门与其他部门对比，且有部门同时存在于基础部门与对比部门
      // 部门有被选中的
      if($this.searchData.dept_id&&$this.searchData.dept_id.length>0){
        // 部门有一个被选中
        if($this.searchData.dept_id.length==1){
          // 且基础时间有值
          if($this.searchData.dateOne&&$this.searchData.dateOne.length>0){
            // 且对比时间有值，此时是单一小组的时间对比
            if($this.searchData.comparedateOne&&$this.searchData.comparedateOne.length>0){
              if($this.searchData.type&&$this.searchData.type.length>0){
                judgeData.singleGroupDateCompare = true;
              }
            }else{
              // 部门选中1个，且基础时间有值，而对比时间无值
              // 且有对比小组被选中
              if($this.searchData.comparedept_id&&$this.searchData.comparedept_id.length>0){
                if($this.searchData.type&&$this.searchData.type.length>0){
                  judgeData.singleGroupTeamCompare = true;
                }
              }else{
                // 对比时间无值，对比小组也无值，此情况为单一小组统计
                if($this.searchData.type&&$this.searchData.type.length>0){
                  judgeData.singleGroupStatic = true;
                }
              }
            }
          }
        }else{
          // 部门有多个被选中
          // 且基础时间有值
          if($this.searchData.dateOne&&$this.searchData.dateOne.length>0){
            // 且对比时间有值，此时是基础多小组的时间对比
            if($this.searchData.comparedateOne&&$this.searchData.comparedateOne.length>0){
              if($this.searchData.type&&$this.searchData.type.length>0){
                judgeData.pluralGroupDateCompare = true;
              }
            }else{
              // 部门选中多个，且基础时间有值，而对比时间无值
              // 且有对比小组被选中
              if($this.searchData.comparedept_id&&$this.searchData.comparedept_id.length>0){
                if($this.searchData.type&&$this.searchData.type.length>0){
                  judgeData.pluralGroupTeamCompare = true;
                  // 判断部门与对比小组是否有同一个小组被选中
                  $this.searchData.comparedept_id.forEach(function(item){
                    if($this.searchData.dept_id.includes(item)){
                      if($this.searchData.type&&$this.searchData.type.length>0){
                        judgeData.pluralGroupTeamSameCompare = true;
                      }
                    }
                  });
                }
              }else{
                // 对比时间无值，对比小组也无值，此情况为多部门统计
                if($this.searchData.type&&$this.searchData.type.length>0){
                  judgeData.pluralGroupStatic = true;
                }
              }
            }
          }
        }
      }
      $this.judgeData = judgeData;
    },    
    // 日期维度点击事件
    dimensionChangeHandler(obj){
      var $this = this;
      if(!obj.isOn){
        var dateDimension = $this.dateDimension;
        dateDimension.forEach(function(item){
          if(item.value==obj.value){
            item.isOn = true;
            if(item.value=="month"){
              $this.searchData.isMonth = true;
            }else{
              $this.searchData.isMonth = false;
            }
          }else{
            item.isOn = false;
          }
        });
        $this.dateDimension = dateDimension;
        // 切换日期维度，对比时间清空，默认时间在有小组选中的情况下，需要给一个默认时间范围
        if($this.searchData.dept_id&&$this.searchData.dept_id.length>0){
          if($this.searchData.isMonth){
            $this.searchData.dateOne = $this.getNearMonth();
            $this.searchData.comparedateOne = [];
          }else{
            $this.searchData.dateOne = $this.getNearDay();
            $this.searchData.comparedateOne = [];
          }
        }else{
          $this.searchData.dateOne = [];
          $this.searchData.comparedateOne = [];
        }
        // 切换日期维度，分析项只在月时可选的，切换到日维度时，需禁用，且清除选中状态；切换到月维度时，则只需将所有禁用状态解除
        var AnalysisItemArr = $this.AnalysisItemArr;
        var selectedContrastType = [];
        AnalysisItemArr.forEach(function(item,index){
          if($this.searchData.isMonth){
            item.disabled = false;
          }else{
            if(item.value=="scoreDealCount"||item.value=="moneyCostCount"||item.value=="scoreDealRegion"||item.value=="product"||item.value=="scoreMapCount"||item.value=="scoreCount"){
              item.isOn = false;
              item.disabled = true;
            }else{
              item.disabled = false;
            }
          }
          if(item.isOn){
            selectedContrastType.push(item.id);
          }
        });
        $this.searchData.type = selectedContrastType;
        $this.AnalysisItemArr = AnalysisItemArr;
      }
    },
    // 最近六个月时间周期
    getNearMonth(){
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 6);
      var startYear = start.getFullYear();
      var startMonth = start.getMonth() +1;
      var endYear = end.getFullYear();
      var endMonth = end.getMonth() + 1;
      startMonth = startMonth<10?'0'+startMonth:startMonth;
      endMonth = endMonth<10?'0'+endMonth:endMonth;
      var startDate = startYear+"-"+startMonth;
      var endDate = endYear+"-"+endMonth;
      return [startDate,endDate];
    },
    // 最近30天时间周期
    getNearDay(){
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      end.setTime(end.getTime() + 3600 * 1000 * 24 * 1);
      var startYear = start.getFullYear();
      var startMonth = start.getMonth() +1;
      var startDay = start.getDate();
      var endYear = end.getFullYear();
      var endMonth = end.getMonth() + 1;
      var endDay = end.getDate();
      startMonth = startMonth<10?'0'+startMonth:startMonth;
      startDay = startDay<10?'0'+startDay:startDay;
      endMonth = endMonth<10?'0'+endMonth:endMonth;
      endDay = endDay<10?'0'+endDay:endDay;
      var startDate = startYear+"-"+startMonth+"-"+startDay;
      var endDate = endYear+"-"+endMonth+"-"+endDay;
      return [startDate,endDate];
    },
    // 日期对比点击事件
    dateCompareChangeHandler(){
      var $this = this;
      // 只有在对比小组没有被选中的，此时日期对比才是非禁用状态，可点击的
      if($this.searchData.comparedept_id.length==0){
        if($this.searchData.isDateCompare){
          $this.searchData.isDateCompare = false;
          if($this.searchData.comparedateOne&&$this.searchData.comparedateOne.length>0){
            $this.searchData.comparedateOne = [];
          }
          $this.inBrandnum='current';
          $this.inBrandnumScore='current';
          $this.inBrandnumMonye='current';
          $this.inBrandnumScoreNum='current';
          $this.searchResult();
        }else{
          $this.searchData.isDateCompare = true;
          $this.inBrandnum='contrast';
          $this.inBrandnumScore='contrast';
          $this.inBrandnumMonye='contrast';
          $this.inBrandnumScoreNum='contrast';          
        }
      }
    },
    //搜索向还原初始状态
    Searchinitstate(){
      var $this = this;
      $this.AnalysisItemArr.forEach(function(item){
        item.disabled=false;
      });
      
      $this.searchData.isDateCompare=false;
      $this.searchData.dateOne=[];
      $this.searchData.comparedateOne=[];
      $this.searchData.starttime='';
      $this.searchData.endtime='';
      $this.searchData.comparestarttime='';
      $this.searchData.compareendtime='';
      $this.searchData.dept_id=[];
      $this.searchData.type=[];
      $this.searchData.comparedept_id=[];
      $this.searchData.is_timecopmare='1';
      $this.searchData.is_compare='1';
      $this.dayEnquiriesTrend={};
    },
    // 搜索结果
    searchResult(){
      var $this = this;
      if($this.searchData.dept_id&&$this.searchData.dept_id.length>0){
        $this.isDefaultPage=false;
        $this.initPage();
      }
    },
    //清除搜索数据
    clearDate(){
      var $this=this;
      $this.inBrandnum='current';
      $this.inBrandnumScore='current';
      $this.inBrandnumMonye='current';
      $this.inBrandnumScoreNum='current';
      $this.dayEnquiriesTrend={};     //各个部门询盘
      $this.yeartongAccounted=[];     //各个部门询盘占比
      $this.yeartongRanking=[];     //各个部门询盘排行 
      $this.yeartongTimethan=[];     //各个部门询盘时间占比
      $this.yearscoretongArr=[];      //各个部门月成交 
      $this.yeartongscoreAccounted=[];     //各个部门成交占比
      $this.yeartongscoreRanking=[];     //各个部门成交排行 
      $this.yeartongscoreTimethan=[];     //各个部门成交时间占比
      $this.yearmonyetongArr=[];//各个部门月成本
      $this.yeartongmonyeAccounted=[];     //各个部门成本占比
      $this.yeartongmonyeRanking=[];     //各个部门成本排行 
      $this.yeartongmonyeTimethan=[];     //各个部门成本时间占比
      $this.yearscoreNumtongArr=[];//各个部门月成交个数
      $this.yeartongscoreNumAccounted=[];     //各个部门成交个数占比
      $this.yeartongscoreNumRanking=[];     //各个部门成交个数排行 
      $this.yeartongscoreNumTimethan=[];     //各个部门成交个数时间占比
      $this.ProductAnaly=[];     //产品分析
      $this.MapAny=[];     //询盘地区分析分析
      $this.ScoreMapAny=[];     //成交地区分析
      $this.ScorenumMapAny=[];     //成交个数地图分析
      $this.sametimeRate='';
      $this.DepartTimeCompare=[];
      $this.sametimeRateScore='';
      $this.DepartTimeCompareScore=[];
      $this.sametimeRateMonye='';
      $this.DepartTimeCompareMonye=[];
      $this.sametimeRateScorenum='';
      $this.DepartTimeCompareScorenum=[];
      $this.yeartongObj.allNum=0;
      $this.yeartongObj.lastallNum=0;
      $this.yeartongObj.avgNum=0;
      $this.yeartongObj.historyNum=0;
      $this.yearscoretongObj.allNum=0;
      $this.yearscoretongObj.lastallNum=0;
      $this.yearscoretongObj.avgNum=0;
      $this.yearscoretongObj.historyNum=0;
      $this.yearmonyetongObj.allNum=0;
      $this.yearmonyetongObj.lastallNum=0;
      $this.yearmonyetongObj.avgNum=0;
      $this.yearmonyetongObj.historyNum=0;
      $this.yearscorenumbertongObj.allNum=0;
      $this.yearscorenumbertongObj.lastallNum=0;
      $this.yearscorenumbertongObj.avgNum=0;
      $this.yearscorenumbertongObj.historyNum=0;
    },
    // 组装搜索接口所需数据
    initSearchData(){
      var $this = this;
      var searchData = {};
      if($this.searchData.dateOne&&$this.searchData.dateOne.length>0){
        searchData.starttime = $this.searchData.dateOne[0];
        searchData.endtime = $this.searchData.dateOne[1];
      }
      if($this.searchData.comparedateOne&&$this.searchData.comparedateOne.length>0){
        searchData.comparestarttime = $this.searchData.comparedateOne[0];
        searchData.compareendtime = $this.searchData.comparedateOne[1];
      }
      if($this.searchData.dept_id&&$this.searchData.dept_id.length>0){
        searchData.dept_id = $this.searchData.dept_id;
      }
      if($this.searchData.type&&$this.searchData.type.length>0){
        searchData.type = $this.searchData.type;
      }
      if($this.searchData.comparedept_id&&$this.searchData.comparedept_id.length>0){
        searchData.comparedept_id = $this.searchData.comparedept_id;
      }
      searchData.is_compare = $this.searchData.comparedept_id.length>0?2:1;
      searchData.is_timecopmare = $this.searchData.isDateCompare&&$this.searchData.comparedateOne&&$this.searchData.comparedateOne.length>0?2:1;     
      if($this.searchData.dept_id.length==0){
        $this.tipsInfo = "请选择数据分析的部门";
      }else{
        if(!$this.searchData.dateOne||$this.searchData.dateOne.length==0){
          $this.tipsInfo = "请选择数据分析的日期范围";
        }else{
          if($this.searchData.type.length==0){
            $this.tipsInfo = "请选择数据分析的分析项";
          }else{
            if(searchData.is_timecopmare==2&&searchData.starttime&&searchData.endtime){
              $this.tipsInfo = "当前小组分析页面，展示为："+searchData.starttime+" ~ " + searchData.endtime+" 与 "+searchData.comparestarttime+" ~ "+searchData.compareendtime+" 的日期对比数据信息。";
            }
            if(searchData.is_timecopmare==1&&searchData.starttime&&searchData.endtime){
              $this.tipsInfo = "当前小组分析页面，展示为："+searchData.starttime+" ~ " + searchData.endtime+" 的数据信息。";
            }
          }
        }
      }
      return searchData;
    },
    // 初始化页面信息
    initPage(){
      var $this =this;      
      $this.judgeChartStatus();
      var searchData = $this.initSearchData();   
      console.log(searchData,'searchData');
      $this.clearDate();
      $this.$store.dispatch("api/getendepartcountAction", searchData).then(response=>{
        if(response){
          console.log(response,'初始化页面信息');
          if(response.status){
              //多部门
              if($this.searchData.comparedept_id&&$this.searchData.comparedept_id.length>0){
                  //自我对比
                  if($this.searchData.isDateCompare&&$this.searchData.comparedateOne&&$this.searchData.comparedateOne.length>0){ 
                  }else{            
                      if($this.searchData.isMonth){
                        //多部门月询盘对比
                        if($this.selectedType.includes("enquirieCount")||$this.selectedType.includes("enquirieRegion")){
                          var dayxuntrend=[];
                          dayxuntrend.dayxuntrend=response.monthxuntrendcompare;
                          var mapItem=[];
                          if(response.provincemonthcompare&&response.provincemonthcompare.length>0){
                            response.provincemonthcompare.forEach(function(item,index){
                              if(item.length>0){
                                var ProductAnyObj={
                                  dartName:'',
                                  MapArr:[],
                                };
                                item.forEach(function(items,indexs){
                                    if(items.depart.indexOf('/')>0){
                                      var departArr=[];
                                      items.depart=items.depart.replace(/\//g,"").replace(/电商/g,"").replace(/部/g,"");
                                      ProductAnyObj.dartName='电商'+items.depart.split("").join("、")+'部';
                                    }else{
                                      ProductAnyObj.dartName=items.depart;
                                    }
                                    ProductAnyObj.MapArr.push(items);
                                });
                                mapItem.push(ProductAnyObj); 
                              }                           
                            });
                          }
                          $this.dayComparePlug(dayxuntrend,response.monthxunallnumbercompare,response.lastmonthxunallnumbercompare,'','',response.monthdepartpercentercompare,mapItem,'询盘');
                        }
                        //多部门月成交对比
                        if($this.selectedType.includes("scoreDealCount")||$this.selectedType.includes("scoreDealRegion")){
                          var scoretrend=[];
                          scoretrend.dayxuntrend=response.monthscoretrendcompare;                        
                          if(response.provincebuymonthcompare&&response.provincebuymonthcompare.length>0){
                            var scoremapArr=[];
                            response.provincebuymonthcompare.forEach(function(item,index){
                              if(item.length>0){
                                var ProductAnyObj={
                                  dartName:'',
                                  MapArr:[],
                                };
                                item.forEach(function(items,indexs){
                                    if(items.depart.indexOf('/')>0){
                                      var departArr=[];
                                      items.depart=items.depart.replace(/\//g,"").replace(/电商/g,"").replace(/部/g,"");
                                      ProductAnyObj.dartName='电商'+items.depart.split("").join("、")+'部';
                                    }else{
                                      ProductAnyObj.dartName=items.depart;
                                    }
                                    ProductAnyObj.MapArr.push(items);
                                });
                                scoremapArr.push(ProductAnyObj);                                 
                              }                           
                            });
                          }
                          $this.dayComparePlug(scoretrend,response.monthscoreallnumbercompare,response.lastmonthscoreallnumbercompare,'','',response.monthdepartscorepercentercompare,scoremapArr,'成交');
                        }
                        //多部门月成交个数对比
                        if($this.selectedType.includes("scoreCount")||$this.selectedType.includes("scoreMapCount")){
                          var scorenumtrend=[];
                          scorenumtrend.dayxuntrend=response.monthscorenumbertrendcompare;                        
                          if(response.provincescorenumberbuymonthcompare&&response.provincescorenumberbuymonthcompare.length>0){
                            var scorenummapArr=[];
                            response.provincescorenumberbuymonthcompare.forEach(function(item,index){
                              if(item.length>0){
                                var ProductAnyObj={
                                  dartName:'',
                                  MapArr:[],
                                };
                                item.forEach(function(items,indexs){
                                    if(items.depart.indexOf('/')>0){
                                      var departArr=[];
                                      items.depart=items.depart.replace(/\//g,"").replace(/电商/g,"").replace(/部/g,"");
                                      ProductAnyObj.dartName='电商'+items.depart.split("").join("、")+'部';
                                    }else{
                                      ProductAnyObj.dartName=items.depart;
                                    }
                                    ProductAnyObj.MapArr.push(items);
                                });
                                scorenummapArr.push(ProductAnyObj);
                              }                            
                            });
                          }
                          $this.dayComparePlug(scorenumtrend,response.monthscorenumbercompare,response.lastmonthscorenumbercompare,'','',response.monthdepartscorenumberpercentercompare,scorenummapArr,'成交个数');
                        }
                        //多部门月成本对比
                        if($this.selectedType.includes("moneyCostCount")){
                          var moneytrend=[];
                          moneytrend.dayxuntrend=response.monthmoneytrendcompare;
                          $this.dayComparePlug(moneytrend,response.monthmoneyallnumbercompare,response.lastmonthmoneyallnumbercompare,'','',response.monthdepartmoneypercentercompare,'','成本');
                        }
                        //多部门月产品分析对比
                        if($this.selectedType.includes("product")){
                          if(response.productbuylistcompare&&response.productbuylistcompare.length>0){
                            var ProductAny=[];
                            response.productbuylistcompare.forEach(function(item,index){
                              var ProductAnyObj={
                                dartName:'',
                                ProductArr:[],
                              };
                              item.forEach(function(items,indexs){
                                  if(items.depart.indexOf('/')>0){
                                    var departArr=[];

                                    items.depart=items.depart.replace(/\//g,"").replace(/电商/g,"").replace(/部/g,"");

                                    ProductAnyObj.dartName='电商'+items.depart.split("").join("、")+'部';

                                  }else{
                                    ProductAnyObj.dartName=items.depart;
                                  }
                                ProductAnyObj.ProductArr.push(items);
                              });
                              ProductAny.push(ProductAnyObj);                            
                            });
                            $this.ProductAnyPlug(ProductAny);
                          }
                        }
                      }else{
                        //多部门日询盘对比
                        if($this.selectedType.includes("enquirieCount")||$this.selectedType.includes("enquirieRegion")){
                          var dayxuntrend=[];
                          dayxuntrend.dayxuntrend=response.dayxuntrendcompare;
                          var mapItem=[];
                          if(response.provincecompare&&response.provincecompare.length>0){
                            response.provincecompare.forEach(function(item,index){
                              if(item.length>0){
                                var ProductAnyObj={
                                  dartName:'',
                                  MapArr:[],
                                };
                                item.forEach(function(items,indexs){
                                    if(items.depart.indexOf('/')>0){
                                      var departArr=[];
                                      items.depart=items.depart.replace(/\//g,"").replace(/电商/g,"").replace(/部/g,"");
                                      ProductAnyObj.dartName='电商'+items.depart.split("").join("、")+'部';
                                    }else{
                                      ProductAnyObj.dartName=items.depart;
                                    }
                                    ProductAnyObj.MapArr.push(items);
                                });
                                mapItem.push(ProductAnyObj); 
                              }                          
                            });
                          }
                          $this.dayComparePlug(dayxuntrend,response.xunallnumbercompare,response.lastxunallnumbercompare,response.avgxunnumbercompare,response.historymaxnumberdaycompare,response.departpercentercompare,mapItem,'询盘');                          
                        }
                      }
                  }
              }else{
                  //单部门
                  if($this.searchData.isDateCompare&&$this.searchData.comparedateOne&&$this.searchData.comparedateOne.length>0){
                      if($this.searchData.isMonth){
                        //单部门日询盘自我对比
                        if($this.selectedType.includes("enquirieCount")||$this.selectedType.includes("enquirieRegion")){                          
                            var enquirieMap=[];
                            if(response.selfprovincemonthcompare&&response.selfprovincemonthcompare.length>0){
                              response.selfprovincemonthcompare.forEach(function(item,index){
                                if(item.length>0){
                                  var ProductAnyObj={
                                    dartName:'',
                                    MapArr:[],
                                  };
                                  item.forEach(function(items,indexs){
                                      if(indexs==0){
                                        ProductAnyObj.dartName=$this.searchData.dateOne[0]+'~'+$this.searchData.dateOne[1];
                                      }
                                      if(indexs==1){
                                        ProductAnyObj.dartName=$this.searchData.comparedateOne[0]+'~'+$this.searchData.comparedateOne[1];
                                      }
                                      ProductAnyObj.MapArr.push(items);
                                  });
                                  enquirieMap.push(ProductAnyObj); 
                                }                           
                              });
                            }
                            $this.enquiriesSelfContrastPlug(response.selfmonthxuncompare,enquirieMap,'询盘');
                        }
                        //单部门日成交自我对比
                        if($this.selectedType.includes("scoreDealCount")||$this.selectedType.includes("scoreDealRegion")){      
                            var scoreMap=[];
                            if(response.selfprovincebuymonthcompare&&response.selfprovincebuymonthcompare.length>0){
                              response.selfprovincebuymonthcompare.forEach(function(item,index){
                                if(item.length>0){
                                  var ProductAnyObj={
                                    dartName:'',
                                    MapArr:[],
                                  };
                                  item.forEach(function(items,indexs){
                                      if(indexs==0){
                                        ProductAnyObj.dartName=$this.searchData.dateOne[0]+'~'+$this.searchData.dateOne[1];
                                      }
                                      if(indexs==1){
                                        ProductAnyObj.dartName=$this.searchData.comparedateOne[0]+'~'+$this.searchData.comparedateOne[1];
                                      }
                                      ProductAnyObj.MapArr.push(items);
                                  });
                                  scoreMap.push(ProductAnyObj); 
                                }                           
                              });
                            }
                            $this.enquiriesSelfContrastPlug(response.selfmonthscoretrend,scoreMap,'成交');
                        }
                        //单部门日成本自我对比
                        if($this.selectedType.includes("moneyCostCount")){
                            $this.enquiriesSelfContrastPlug(response.selfmonthmoneytrend,'','成本');
                        }
                        //单部门日成交个数自我对比
                        if($this.selectedType.includes("scoreCount")||$this.selectedType.includes("scoreMapCount")){     
                            var scoreCountMap=[];
                            if(response.selfprovincescorenumberbuycompare&&response.selfprovincescorenumberbuycompare.length>0){
                              response.selfprovincescorenumberbuycompare.forEach(function(item,index){
                                if(item.length>0){
                                  var ProductAnyObj={
                                    dartName:'',
                                    MapArr:[],
                                  };
                                  item.forEach(function(items,indexs){
                                      if(indexs==0){
                                        ProductAnyObj.dartName=$this.searchData.dateOne[0]+'~'+$this.searchData.dateOne[1];
                                      }
                                      if(indexs==1){
                                        ProductAnyObj.dartName=$this.searchData.comparedateOne[0]+'~'+$this.searchData.comparedateOne[1];
                                      }
                                      ProductAnyObj.MapArr.push(items);
                                  });
                                  scoreCountMap.push(ProductAnyObj); 
                                }                           
                              });
                            }
                            $this.enquiriesSelfContrastPlug(response.selfmonthscorenumbertrend,scoreCountMap,'成交个数');
                        }
                        //单部门日产品分析
                        if($this.selectedType.includes("product")){
                          if(response.selefproductbuylistcompare&&response.selefproductbuylistcompare.length>0){                            
                            var ProductAny=[];
                            response.selefproductbuylistcompare.forEach(function(item,index){
                              var ProductAnyObj={
                                dartName:'',
                                ProductArr:[],
                              };                             
                              if(index==0){
                                ProductAnyObj.dartName=$this.groupName+'~'+$this.searchData.dateOne[0]+'~'+$this.searchData.dateOne[1];
                                ProductAnyObj.ProductArr=item;
                              }
                              if(index==1){
                                ProductAnyObj.dartName=$this.groupName+'~'+$this.searchData.comparedateOne[0]+'~'+$this.searchData.comparedateOne[1];
                                ProductAnyObj.ProductArr=item;
                              }
                              ProductAny.push(ProductAnyObj);                            
                            });
                            $this.ProductAnyPlug(ProductAny);
                          }
                        }
                      }else{
                        //单部门日自我对比
                        if($this.selectedType.includes("enquirieCount")||$this.selectedType.includes("enquirieRegion")){           
                          var enquirieMap=[];
                          if(response.selfprovincedaycompare&&response.selfprovincedaycompare.length>0){
                            response.selfprovincedaycompare.forEach(function(item,index){
                              if(item.length>0){
                                var ProductAnyObj={
                                  dartName:'',
                                  MapArr:[],
                                };
                                item.forEach(function(items,indexs){
                                    if(indexs==0){
                                      ProductAnyObj.dartName=$this.searchData.dateOne[0]+'~'+$this.searchData.dateOne[1];
                                    }
                                    if(indexs==1){
                                      ProductAnyObj.dartName=$this.searchData.comparedateOne[0]+'~'+$this.searchData.comparedateOne[1];
                                    }
                                    ProductAnyObj.MapArr.push(items);
                                });
                                enquirieMap.push(ProductAnyObj); 
                              }                           
                            });
                          }
                         $this.enquiriesSelfContrastPlug(response.selfdayxuncompare,enquirieMap,'询盘');
                        }
                      } 
                  }else{  
                      if($this.searchData.isMonth){
                        //单部门月询盘对比
                        if($this.selectedType.includes("enquirieCount")||$this.selectedType.includes("enquirieRegion")){
                          var dayxuntrend=[];
                          dayxuntrend.dayxuntrend=[response.monthxuntrend];
                          var mapXunDay=[];
                          var mapXunDayObj={};
                          mapXunDayObj.dartName=$this.groupName;
                          mapXunDayObj.MapArr=response.provincecountmapmonth;
                          mapXunDay.push(mapXunDayObj);
                          $this.dayComparePlug(dayxuntrend,response.monthxunallnumber,response.lastmonthxunallnumber,response.monthavgxun,response.historymaxnumbermonth,response.monthdepartpercenter,mapXunDay,'询盘');
                        }
                        //单部门月成交对比
                        if($this.selectedType.includes("scoreDealCount")||$this.selectedType.includes("scoreDealRegion")){
                          var scoretrend=[];
                          scoretrend.dayxuntrend=[response.monthscoretrend];
                          var mapScoreDay=[];
                          var mapScoreDayObj={};
                          mapScoreDayObj.dartName=$this.groupName;
                          mapScoreDayObj.MapArr=response.provincebuymapmonth;
                          mapScoreDay.push(mapScoreDayObj);
                          $this.dayComparePlug(scoretrend,response.monthscoreallnumber,response.lastmonthscoreallnumber,response.monthscoreavgxun,response.historymaxscoremonth,response.monthdepartscorepercenter,mapScoreDay,'成交');
                        }
                        //单部门月成本对比
                        if($this.selectedType.includes("moneyCostCount")){
                          var moneytrend=[];
                          moneytrend.dayxuntrend=[response.monthmoneytrend];
                          $this.dayComparePlug(moneytrend,response.monthmoneyallnumber,response.lastmonthmoneyall,response.avgmonthmoney,response.historymaxmoneymonth,response.monthdepartmoneypercenter,'','成本');
                        }
                        //单部门月产品分析
                        if($this.selectedType.includes("product")){
                          if(response.productbuylist&&response.productbuylist.length>0){
                            var ProductAny=[];
                            var ProductAnyObj={};
                            ProductAnyObj.dartName=$this.groupName;
                            ProductAnyObj.ProductArr=response.productbuylist;
                            ProductAny.push(ProductAnyObj);
                            $this.ProductAnyPlug(ProductAny);
                          }
                        }
                        //单部门月成交个数分析
                        if($this.selectedType.includes("scoreCount")||$this.selectedType.includes("scoreMapCount")){
                          var scoreCounttrend=[];
                          scoreCounttrend.dayxuntrend=[response.monthscorenumbertrend];
                          var mapscoreCount=[];
                          var mapscoreCountObj={};
                          mapscoreCountObj.dartName=$this.groupName;
                          mapscoreCountObj.MapArr=response.provincescorenumberbuymapmonth;
                          mapscoreCount.push(mapscoreCountObj);
                          $this.dayComparePlug(scoreCounttrend,response.monthscorenumber,response.lastmonthscorenumber,response.monthscorenumberavgxun,response.historymaxscorenumbermonth,response.monthdepartscorenumberpercenter,mapscoreCount,'成交个数');
                        }
                      }else{
                        //单部门日询盘对比
                        if($this.selectedType.includes("enquirieCount")||$this.selectedType.includes("enquirieRegion")){                          
                          var dayxuntrend=[];
                          dayxuntrend.dayxuntrend=[response.dayxuntrend];
                          var mapXunDay=[];
                          var mapXunDayObj={};
                          mapXunDayObj.dartName=$this.groupName;
                          mapXunDayObj.MapArr=response.provincecountmapday;
                          mapXunDay.push(mapXunDayObj);
                          $this.dayComparePlug(dayxuntrend,response.xunallnumber,response.lastxunallnumber,response.avgxunnumber,response.historymaxnumberday,response.departpercenter,mapXunDay,'询盘');
                        }
                      }                   
                  }
              }
          }else{
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'error',
                duration:6000
            });
            $this.$router.push({path:`/login?redirect=${$this.$route.currentRoute.fullPath}`});
          }
        }
      });
    },
    //组装传递路由默认值
    routeVal(){
      var $this = this;
      $this.searchData.dateOne=$this.getNearMonth();
      $this.searchData.isMonth=true;
      $this.searchData.isDateCompare=false;
      $this.searchData.dept_id=[12];
      $this.searchData.comparedept_id=[13,14,15,,16];
      $this.departArr=[
        {disabled: false,isOn: true,label: "电商一部",value: 12},
        {disabled: false,isOn: false,label: "电商二部",value: 13},
        {disabled: false,isOn: false,label: "电商三部",value: 14},
        {disabled: false,isOn: false,label: "电商四部",value: 15},
        {disabled: false,isOn: false,label: "电商五部",value: 16},
      ];
      $this.dateDimension=[
        {label:"日",value:"day",isOn:false},
        {label:"月",value:"month",isOn:true},
      ];
      var contrastGroupList=[];
      $this.departArr.forEach(function(item,index){
        var objItem={}
        if(index==0){
          objItem.disabled=true;
          objItem.isOn=false;
          objItem.label=item.label;
          objItem.value=item.value;
        }else{
          objItem.disabled=false;
          objItem.isOn=true;
          objItem.label=item.label;
          objItem.value=item.value;
        }
        contrastGroupList.push(objItem);
      });
      $this.contrastGroupList=contrastGroupList;
      $this.oldContrastGroupID='13,14,15,16';
      $this.selectedType=["enquirieRegion"];
      $this.groupName='电商一部';
    },
    // 初始化数据
    initData() {
      var $this = this;
      if($this.$route.query.type==0){
        $this.routeVal();
        $this.AnalysisItemArr.forEach(function(item,index){
          item.disabled=false;
          item.isOn=false;
          if(index==3){
            item.isOn=true;
          }
        });
        $this.searchData.type=[4];
        $this.searchResult();
      }else if($this.$route.query.type==1){
        $this.routeVal();
        $this.AnalysisItemArr.forEach(function(item,index){
          item.disabled=false;
          item.isOn=false;
          if(index==4){
            item.isOn=true;
          }
        });
        $this.searchData.type=[5];
        $this.searchResult();
      }else if($this.$route.query.type==2){
        $this.routeVal();
        $this.AnalysisItemArr.forEach(function(item,index){
          item.disabled=false;
          item.isOn=false;
          if(index==6){
            item.isOn=true;
          }
        });
        $this.searchData.type=[7];
        $this.searchResult();
      }else{
        $this.getReadart();
      }
    },
    //首页中文统计总览
    getReadart(){
      var $this = this;
      $this.$store.dispatch('api/getendepartcountdefaultAction', null).then(response=>{
        if(response){
          if(response.status){
            console.log(response,'response');            
            if (response.readdepart && response.readdepart.length >0) {
              //获取部门数据
              var DeparData = [];
              response.readdepart.forEach(function (item, index) {
                var itemDate = {};
                itemDate.value = item.id;
                itemDate.label = item.name;
                itemDate.isOn = false;
                itemDate.disabled = false;
                DeparData.push(itemDate);
              });
              $this.departArr =JSON.parse(JSON.stringify(DeparData));
              $this.contrastGroupList =JSON.parse(JSON.stringify(DeparData)); 
            }
            //获取默认询盘趋势
            var yeartong=[];
            yeartong.dayxuntrend=response.yeartong;
            var yearenquirietong=$this.yearenquirietong(response.yeartong,'询盘');
            $this.dayComparePlug(yeartong,response.allxunnumber,response.lastallxunnumber,response.avgxunnumber,response.historymaxnumber,yearenquirietong,'','询盘');
            //获取默认成交趋势
            var yearscoretong=[];
            yearscoretong.dayxuntrend=response.yearscoretong;
            var yearClinchtong=$this.yearenquirietong(response.yearscoretong,'成交');
            $this.dayComparePlug(yearscoretong,response.scoreall,response.lastscoreall,response.avgscore,response.historyscore,yearClinchtong,'','成交');
            //获取默认月部门成本趋势
            var yearmonyetong=[];
            yearmonyetong.dayxuntrend=response.yearmonyetong;
            var yearCosttong=$this.yearenquirietong(response.yearmonyetong,'成本');
            $this.dayComparePlug(yearmonyetong,response.moneyeall,response.lastmoneyall,response.avgmoney,response.historymoney,yearCosttong,'','成本');
            //获取默认月部门成本个数趋势
            var yearscorenum=[];
            yearscorenum.dayxuntrend=response.yearscorenumbertong;
            var yearscorenumtong=$this.yearenquirietong(response.yearscorenumbertong,'成交个数');
            $this.dayComparePlug(yearscorenum,response.scorenumberall,response.lastscorenumberall,response.avgscorenumber,response.historyscorenumber,yearscorenumtong,'','成交个数');
          }else{
            $this.$message({
                showClose: true,
                message: response.info,
                type: 'error',
                duration:6000
            });
            $this.$router.push({path:`/login?redirect=${$this.$route.currentRoute.fullPath}`});
          }
        }
      });
    },
    //统计询盘趋势
    dayEnquiriesTrendPlug(DateVal,strDate){
      var $this=this; 
      var dayEnquiriesTrend={}; 
      var dayEnquiriesArr=[]; 
      var newLable=[];
      var colorDate=['#75adfa', '#59cab6', '#ff7e24', '#8a80b9', '#ff5a5a'];
      if(DateVal.dayxuntrend&&DateVal.dayxuntrend.length){
        DateVal.dayxuntrend.forEach(function(item,index){
          if(item&&item!=null){
              item.forEach(function(items,indexs){
                var yeartongObj={
                  name:'',
                  value:'',
                  date:'',
                  color:colorDate[index],
                }
                if(newLable.indexOf(items.depart)<0){
                  newLable.push(items.depart);
                }
                var itemDate = [];
                if(items.depart){
                  if(items.depart.indexOf('/')>0){
                    var departArr=[];
                    items.depart=items.depart.replace(/\//g,"").replace(/电商/g,"").replace(/部/g,"")
                    yeartongObj.name='电商'+items.depart.split("").join("、")+'部';
                  }else{
                    yeartongObj.name=items.depart;
                  }
                }else{
                    yeartongObj.name=$this.groupName;
                }
                if(strDate=='询盘'){yeartongObj.value=items.xunnumber;}
                if(strDate=='成交'){yeartongObj.value=items.score;}
                if(strDate=='成本'){yeartongObj.value=items.money;}
                if(strDate=='成交个数'){yeartongObj.value=items.number;}
                if(items.time){
                  yeartongObj.date=items.time;
                }else{
                  itemDate = items.date.split("-"); 
                  if($this.isDefaultPage){
                      yeartongObj.date=itemDate[1] + "月"; 
                  }else{
                    if($this.searchData.isMonth){
                      yeartongObj.date=itemDate[1] + "月"; 
                    }else{
                      yeartongObj.date=itemDate[1] + "-" + itemDate[2] + "\n" + items.week.replace("星期", "周"); 
                    }          
                  }           
                }       
                dayEnquiriesArr.push(yeartongObj);
              });
          }
        });  
        dayEnquiriesTrend.dayxuntrend=dayEnquiriesArr;      
      }
      if(strDate=='询盘'){$this.dayEnquiriesTrend=dayEnquiriesTrend;}
      if(strDate=='成交'){$this.yearscoretongArr=dayEnquiriesTrend;}
      if(strDate=='成本'){$this.yearmonyetongArr=dayEnquiriesTrend;}
      if(strDate=='成交个数'){$this.yearscoreNumtongArr=dayEnquiriesTrend;}
      $this.chartTap=!$this.chartTap;
    },
    //获取默认占比排行数据
    yearenquirietong(DateVal,strDate){
      var $this=this;
      var yeartongArr=[];
      var newLable=[];
      DateVal.forEach(function(item,index){
        item.forEach(function(items,indexs){
          var yeartongObj={
            name:'',
            date:'',
          }
          if(newLable.indexOf(items.depart)<0){
            newLable.push(items.depart);
          }
          yeartongObj.name=items.depart;
          if(strDate=='询盘'){yeartongObj.xunnumber=items.xunnumber;}
          if(strDate=='成交'){yeartongObj.score=items.score;}
          if(strDate=='成本'){yeartongObj.money=items.money;}
          if(strDate=='成交个数'){yeartongObj.number=items.number;}
          yeartongObj.date=items.date;                    
          yeartongArr.push(yeartongObj);
        });
      });
      //获取默认询盘趋势-多部门数据
      var yeartongAccounted=[];
      newLable.forEach(function(item,index){
      if(strDate=='询盘'){var ObjItem={departname:'',xunnumber:0,}}
      if(strDate=='成交'){var ObjItem={departname:'',score:0,}}
      if(strDate=='成本'){var ObjItem={departname:'',money:0,}}
      if(strDate=='成交个数'){var ObjItem={departname:'',number:0,}}
        ObjItem.departname=item;
        yeartongArr.forEach(function(items,indexs){
          if(item==items.name){   
            if(strDate=='询盘'){ObjItem.xunnumber=ObjItem.xunnumber+items.xunnumber;}
            if(strDate=='成交'){ObjItem.score=ObjItem.score+items.score;}
            if(strDate=='成本'){ObjItem.money=ObjItem.money+items.money;} 
            if(strDate=='成交个数'){ObjItem.number=ObjItem.number+items.number;}  
          }
        }); 
        if(strDate=='询盘'){ObjItem.xunnumber=Number(ObjItem.xunnumber.toFixed(0));}
        if(strDate=='成交'){ObjItem.score=Number(ObjItem.score.toFixed(0));}
        if(strDate=='成本'){ObjItem.money=Number(ObjItem.money.toFixed(0));}
        if(strDate=='成交个数'){ObjItem.number=Number(ObjItem.number.toFixed(0));}
        yeartongAccounted.push(ObjItem);
      });
      if(strDate=='询盘'){
        yeartongAccounted.sort(function (a, b) {
          var value1 = a.xunnumber;
          var value2 = b.xunnumber;
          return value2 - value1;
        });
      }
      if(strDate=='成交'){
        yeartongAccounted.sort(function (a, b) {
          var value1 = a.score;
          var value2 = b.score;
          return value2 - value1;
        });
      }
      if(strDate=='成本'){
        yeartongAccounted.sort(function (a, b) {
          var value1 = a.money;
          var value2 = b.money;
          return value2 - value1;
        });
      }
      if(strDate=='成交个数'){
        yeartongAccounted.sort(function (a, b) {
          var value1 = a.number;
          var value2 = b.number;
          return value2 - value1;
        });
      }
      return yeartongAccounted; 
    },
    //点击全选部门
    handleCheckAllDepartArrChange(e){
      var $this = this;
      var departArr = $this.departArr;
      var currentDepartID = [];
      if(e){
        departArr.forEach(function(item,index){
          item.isOn=true;
          currentDepartID.push(item.value);
        });
        $this.departArr = departArr;
        $this.searchData.dept_id = currentDepartID;
        // 分析项没有被选中的情况下，需要默认选中询盘个数与询盘地区分析
        if($this.searchData.type.length==0){
          var AnalysisItemArr = $this.AnalysisItemArr;
          var selectedContrastType = [];
          var selectedType = [];
          AnalysisItemArr.forEach(function(item){
            if(item.value=="enquirieCount"||item.value=="enquirieRegion"){
              item.isOn = true;
              selectedContrastType.push(item.id);
              selectedType.push(item.value);
            }
          });
          $this.selectedType = selectedType;
          $this.searchData.type = selectedContrastType;
          $this.AnalysisItemArr = AnalysisItemArr;
        }
      }else{
        departArr.forEach(function(item,index){
          item.isOn=false;
        });
        $this.departArr = departArr;
        $this.searchData.dept_id = [];
        // 删除分析项
        if($this.searchData.type.length>0){
          var AnalysisItemArr = $this.AnalysisItemArr;
          AnalysisItemArr.forEach(function(item){
            item.isOn = false;
          });
          $this.selectedType = [];
          $this.searchData.type = [];
          $this.AnalysisItemArr = AnalysisItemArr;
        }
      }
      // 小组有被选中的，且默认时间是空的情况下，需要给默认时间一个默认时间范围
      if($this.searchData.dept_id&&$this.searchData.dept_id.length>0&&(!$this.searchData.dateOne||$this.searchData.dateOne.length==0)){
        if($this.searchData.isMonth){
          $this.searchData.dateOne = $this.getNearDay();
        }else{
          $this.searchData.dateOne = $this.getNearMonth();
        }
      }
      // 小组选中超过1个或没有被选中的，则对比小组不需要有禁用状态
      if($this.searchData.dept_id.length==$this.departArr.length){
        var contrastGroupList = $this.contrastGroupList;
        contrastGroupList.forEach(function(item){
          item.disabled = false;
        });
        $this.contrastGroupList = contrastGroupList;
      }
      $this.getGourpName();
      $this.searchResult();
    },
    //点击部门
    handleDepart(valDate){
      var $this = this;
      var departArr = $this.departArr;
      var currentDepartID = [];
      departArr.forEach(function(item,index){
        if(item.value == valDate){
          item.isOn = !item.isOn;
        }
        if(item.isOn){
          currentDepartID.push(item.value);
        }
      });
      $this.departArr = departArr;
      $this.searchData.dept_id = currentDepartID;
      // 部门全部被选中控制全选按钮
      if($this.searchData.dept_id.length==$this.departArr.length){
        $this.checkAlldepartArr=true;
      }else{
        $this.checkAlldepartArr=false;
        if($this.searchData.dept_id&&$this.searchData.dept_id.length>0){
          $this.isAlldepartArr=true;
        }else{
          $this.isAlldepartArr=false;
          var AnalysisItemArr=$this.AnalysisItemArr;
          AnalysisItemArr.forEach(function(item){
            item.isOn=false;
          });
          $this.AnalysisItemArr=AnalysisItemArr;
          $this.contrastGroupList=[];
          $this.searchData.comparedept_id=[];
        }
      }
      // 小组有被选中的，且默认时间是空的情况下，需要给默认时间一个默认时间范围
      if($this.searchData.dept_id&&$this.searchData.dept_id.length>0&&(!$this.searchData.dateOne||$this.searchData.dateOne.length==0)){
        if($this.searchData.isMonth){
          $this.searchData.dateOne = $this.getNearMonth();
        }else{
          $this.searchData.dateOne = $this.getNearDay();
        }
      }
      // 初始第一次小组被选中（即此时只有一个小组被选中），且分析项没有被选中的情况下，需要默认选中询盘个数与询盘地区分析
      if($this.searchData.dept_id.length==1&&$this.searchData.type.length==0){
        var AnalysisItemArr = $this.AnalysisItemArr;
        var selectedContrastType = [];
        var selectedType = [];
        AnalysisItemArr.forEach(function(item){
          if(item.value=="enquirieCount"||item.value=="enquirieRegion"){
            item.isOn = true;
            selectedContrastType.push(item.id);
            selectedType.push(item.value);
          }
        });
        $this.selectedType = selectedType;
        $this.searchData.type = selectedContrastType;
        $this.AnalysisItemArr = AnalysisItemArr;
      }
      // 小组有被选中的，且只有一个小组被选中的情况下，对比小组中，当前被选中小组需被禁用不可选（不能自己和自己在小组维度比）,小组选中超过1个或没有被选中的，则对比小组不需要有禁用状态
      if($this.searchData.dept_id.length==1){
        var contrastGroupList = $this.contrastGroupList;
        contrastGroupList.forEach(function(item){
          if(item.value == $this.searchData.dept_id[0]){
            item.disabled = true;
          }
        });
        $this.contrastGroupList = contrastGroupList;
      }else{
        var contrastGroupList = $this.contrastGroupList;
        contrastGroupList.forEach(function(item){
          item.disabled = false;
        });
        $this.contrastGroupList = contrastGroupList;
        if($this.searchData.dept_id.length==0){
          var AnalysisItemArr = $this.AnalysisItemArr;
          AnalysisItemArr.forEach(function(item){
            item.isOn = false;
          });
          $this.selectedType = [];
          $this.searchData.type = [];
          $this.AnalysisItemArr = AnalysisItemArr;
        }
      }
      $this.getGourpName();
      $this.searchResult();
    },
    //组装小组选中名字
    getGourpName(){
      var $this = this;
      var departArr = $this.departArr;
      var groupName = "";
      $this.departArr.forEach(function(item,index){
        if(item.isOn){
          groupName=groupName+item.label.slice(2, 3);
        }
      });
      if(groupName&&groupName!=''){
        groupName = "电商" + groupName.split("").join("、") + "部";
      }else{
        groupName='';
      }
      $this.groupName = groupName;
    },
    //点击分析项
    handleAnalysisItem(obj){
      var $this = this;
      if(!obj.disabled){
        var AnalysisItemArr = $this.AnalysisItemArr;
        var selectedContrastType = [];
        var selectedType = [];
        AnalysisItemArr.forEach(function(item,index){
          if(item.value == obj.value){
            item.isOn = !item.isOn;
          }
          if(item.isOn){
            selectedContrastType.push(item.id);
            selectedType.push(item.value);
          }
        });
        $this.selectedType = selectedType;
        $this.searchData.type = selectedContrastType;
        $this.AnalysisItemArr = AnalysisItemArr;
        $this.searchResult();
      }
    },
    //分析项选择
    AnalysisItemPlug(){
      var $this = this;
    },
    //判断浮点数
    isFloat(num) {
      if (!isNaN(num) && num % 1 !== 0) {
        return true;
      } else {
        return false;
      }
    },
    //询盘占比
    EnquiriesAccounted(){
      var $this=this;
      if($this.inBrandnum=='Accounted'){
         if($this.searchData.isDateCompare){
           $this.inBrandnum='contrast';
         }else{
           $this.inBrandnum='current';
         }
      }else{
         $this.inBrandnum='Accounted';
      }
    },
    //询盘排行
    Enquiriesranking(){
      var $this=this;
      if($this.inBrandnum=='ranking'){
         if($this.searchData.isDateCompare){
           $this.inBrandnum='contrast';
         }else{
           $this.inBrandnum='current';
         }
      }else{
         $this.inBrandnum='ranking';
      }
    },
    //成交占比
    ClinchAccounted(){
      var $this=this;
      if($this.inBrandnumScore=='scoreAccounted'){
         if($this.searchData.isDateCompare){
           $this.inBrandnumScore='current';
         }else{
           $this.inBrandnumScore='contrast';
         }
      }else{
         $this.inBrandnumScore='scoreAccounted';
      }
    },
    //成交排行
    Clinchranking(){
      var $this=this;
      if($this.inBrandnumScore=='scoreRanking'){         
         if($this.searchData.isDateCompare){
           $this.inBrandnumScore='contrast';
         }else{
           $this.inBrandnumScore='current';
         }
      }else{
         $this.inBrandnumScore='scoreRanking';
      }
    },
    //成本占比
    CostAccounted(){
      var $this=this;
      if($this.inBrandnumMonye=='monyeAccounted'){
         if($this.searchData.isDateCompare){
           $this.inBrandnumMonye='contrast';
         }else{
           $this.inBrandnumMonye='current';
         }
      }else{
         $this.inBrandnumMonye='monyeAccounted';
      }
    },
    //成本排行
    Costranking(){
      var $this=this;
      if($this.inBrandnumMonye=='monyeRanking'){
         if($this.searchData.isDateCompare){
           $this.inBrandnumMonye='contrast';
         }else{
           $this.inBrandnumMonye='current';
         }
      }else{
         $this.inBrandnumMonye='monyeRanking';
      }
    }, 
    //成交个数占比
    ScoreNumAccounted(){
      var $this=this;
      if($this.inBrandnumScoreNum=='scoreNumAccounted'){
         if($this.searchData.isDateCompare){
           $this.inBrandnumScoreNum='contrast';
         }else{
           $this.inBrandnumScoreNum='current';
         }
      }else{
         $this.inBrandnumScoreNum='scoreNumAccounted';
      }
    },
    //成交个数排行
    ScoreNumranking(){
      var $this=this;
      if($this.inBrandnumScoreNum=='scoreNumRanking'){
         if($this.searchData.isDateCompare){
           $this.inBrandnumScoreNum='contrast';
         }else{
           $this.inBrandnumScoreNum='current';
         }
      }else{
         $this.inBrandnumScoreNum='scoreNumRanking';
      }
    }, 
    //询盘、成交、成本趋势(is_timecopmare=1),不对比(is_compare=1) (趋势,总数,上阶段总数,平均,历史最高,占比,地图,字符串(询盘,成本,成交))
    dayComparePlug(Trend,Stage,lastStage,Avg,History,Proportion,MapNum,strDate){
      console.log(strDate,'——趋势',Trend);
      console.log(strDate,'——总数',Stage);
      console.log(strDate,'——上阶段总数',lastStage);
      console.log(strDate,'——平均',Avg);
      console.log(strDate,'——历史最高',History);
      console.log(strDate,'——占比',Proportion);
      console.log(strDate,'——地图',MapNum);
      var $this =this;
      var EnquiriesTrend=[]
      EnquiriesTrend=Trend;
      //趋势
      if(EnquiriesTrend.dayxuntrend&&EnquiriesTrend.dayxuntrend.length>0){ 
        $this.dayEnquiriesTrendPlug(EnquiriesTrend,strDate);
      }  
      if(strDate=='询盘'){
        //总数
        if((Stage==0||Stage!='')&&Stage!=null){
          $this.yeartongObj.allNum=Stage.toFixed(0);
        };
        //上阶段总数
        if((lastStage==0||lastStage!='')&&lastStage!=null){
          $this.yeartongObj.lastallNum=lastStage;
        };
        //平均
        if((Avg==0||Avg!='')&&Avg!=null){
          $this.yeartongObj.avgNum=Avg;
        };
        //历史最高、询盘时间对比
        if(History&&History.length>0){
          $this.yeartongObj.historyNum=Number(History[0].number);
          var LefttimeArr=$this.LefttimePlug(Stage,lastStage,History);
          $this.sametimeRate=LefttimeArr[1];
          $this.DepartTimeCompare=LefttimeArr[0];
        };
      }
      if(strDate=='成交'){ 
        //总数       
        if((Stage==0||Stage!='')&&Stage!=null){
          $this.yearscoretongObj.allNum=Stage.toFixed(2);
        };
        //上阶段总数
        if((lastStage==0||lastStage!='')&&lastStage!=null){
          $this.yearscoretongObj.lastallNum=lastStage;
        };
        //平均
        if((Avg==0||Avg!='')&&Avg!=null){
          $this.yearscoretongObj.avgNum=Avg;
        };
        //历史最高、询盘时间对比
        if(History&&History.length>0){
          $this.yearscoretongObj.historyNum=Number(History[0].score).toFixed(0);
          var LefttimeArr=$this.LefttimePlug(Stage,lastStage,History);
          $this.sametimeRateScore=LefttimeArr[1];
          $this.DepartTimeCompareScore=LefttimeArr[0];
        };
      }
      if(strDate=='成本'){
        //总数
        if((Stage==0||Stage!='')&&Stage!=null){
          $this.yearmonyetongObj.allNum=Stage.toFixed(2);
        };
        //上阶段总数
        if((lastStage==0||lastStage!='')&&lastStage!=null){
          $this.yearmonyetongObj.lastallNum=lastStage;
        };
        //平均
        if((Avg==0||Avg!='')&&Avg!=null){
          $this.yearmonyetongObj.avgNum=Avg;
        };
        //历史最高、询盘时间对比
        if(History&&History.length>0){
          $this.yearmonyetongObj.historyNum=Number(History[0].allmoney).toFixed(0);
          var LefttimeArr=$this.LefttimePlug(Stage,lastStage,History);
          $this.sametimeRateMonye=LefttimeArr[1];
          $this.DepartTimeCompareMonye=LefttimeArr[0];        
        };
      }
      if(strDate=='成交个数'){
        //总数
        if((Stage==0||Stage!='')&&Stage!=null){
          $this.yearscorenumbertongObj.allNum=Stage.toFixed(2);
        };
        //上阶段总数
        if((lastStage==0||lastStage!='')&&lastStage!=null){
          $this.yearscorenumbertongObj.lastallNum=lastStage;
        };
        //平均
        if((Avg==0||Avg!='')&&Avg!=null){
          $this.yearscorenumbertongObj.avgNum=Avg;
        };
        //历史最高、询盘时间对比
        if(History&&History.length>0){
          $this.yearscorenumbertongObj.historyNum=Number(History[0].number).toFixed(0);
          var LefttimeArr=$this.LefttimePlug(Stage,lastStage,History);
          $this.sametimeRateScorenum=LefttimeArr[1];
          $this.DepartTimeCompareScorenum=LefttimeArr[0];        
        };
      }
      //占比 
      if(Proportion&&Proportion!=''){ 
        if($this.searchData.comparedept_id&&$this.searchData.comparedept_id.length>0){
            if($this.searchData.isDateCompare&&$this.searchData.comparedateOne&&$this.searchData.comparedateOne.length>0){
            }else{              
                if(strDate=='询盘'){
                  $this.yeartongAccounted=$this.Comparison($this.dayEnquiriesTrend.dayxuntrend);
                }
                if(strDate=='成交'){
                  $this.yeartongscoreAccounted=$this.Comparison($this.yearscoretongArr.dayxuntrend);
                }
                if(strDate=='成本'){
                  $this.yeartongmonyeAccounted=$this.Comparison($this.yearmonyetongArr.dayxuntrend);
                }
                if(strDate=='成交个数'){
                  $this.yeartongscoreNumAccounted=$this.Comparison($this.yearscoreNumtongArr.dayxuntrend);
                }
            }
        }else{
            if($this.searchData.isDateCompare&&$this.searchData.comparedateOne&&$this.searchData.comparedateOne.length>0){
            }else{
                if(strDate=='询盘'){
                  $this.yeartongAccounted=[];
                }
                if(strDate=='成交'){
                  $this.yeartongscoreAccounted=[];
                }
                if(strDate=='成本'){
                  $this.yeartongmonyeAccounted=[];
                }
                if(strDate=='成交个数'){
                  $this.yeartongscoreNumAccounted=[];
                }
                if(Proportion&&Proportion.length>0){ 
                  var yeartongAccounted=[];
                  Proportion.forEach(function(item,index){
                    var ObjItem={
                      name:'',
                      value:0,
                    }
                    ObjItem.name=item.departname.replace('电商','');                    
                    if(strDate=='询盘'){
                      ObjItem.value=item.xunnumber;
                    }
                    if(strDate=='成交'){
                      ObjItem.value=item.score;
                    }
                    if(strDate=='成本'){
                      ObjItem.value=item.money;
                    }
                    if(strDate=='成交个数'){
                      ObjItem.value=item.number;
                    }
                    yeartongAccounted.push(ObjItem);
                  });
                  yeartongAccounted.sort(function (a, b) {
                    var value1 = a.value;
                    var value2 = b.value;
                    return value2 - value1;
                  });                  
                  if(strDate=='询盘'){
                    $this.yeartongAccounted=yeartongAccounted;
                  }
                  if(strDate=='成交'){
                    $this.yeartongscoreAccounted=yeartongAccounted;
                  }
                  if(strDate=='成本'){
                    $this.yeartongmonyeAccounted=yeartongAccounted;
                  }
                  if(strDate=='成交个数'){
                    $this.yeartongscoreNumAccounted=yeartongAccounted;
                  }
                }
            }
        }
      }    
      //地图
      if(MapNum&&MapNum!=''&&(strDate=='询盘'||strDate=='成交'||strDate=='成交个数')){
        $this.dayMapPlug(MapNum,strDate);
      }
    },
    //对比占比、排行(根据趋势计算占比)
    Comparison(DateVal){
      var $this=this;
      if(DateVal&&DateVal.length>0){ 
        var yeartongAccounted=[];
        var newLable=[];
        var maxNum=0;
        DateVal.forEach(function(item,index){
          item.name=item.name.replace('电商','');
          if(newLable.indexOf(item.name)<0){
            newLable.push(item.name);
          }
          maxNum=maxNum+item.value;
        });
        var newArr=[];
        newLable.forEach(function(item,index){
          var ObjItem={
            name:'',
            value:0,
            percent:''
          }
          DateVal.forEach(function(items,indexs){
            if(item==items.name){
                ObjItem.name=item;
                ObjItem.value=ObjItem.value+items.value;
            }
          });
          newArr.push(ObjItem);
        });
        newArr.forEach(function(item,index){
          var ObjItem={
            name:'',
            value:0,
            percent:0
          }
          ObjItem.name=item.name;
          ObjItem.value=Number(item.value.toFixed(0));
          ObjItem.percent=item.value/maxNum*100+'%';
          yeartongAccounted.push(ObjItem);
        });
        yeartongAccounted.sort(function (a, b) {
          var value1 = a.value;
          var value2 = b.value;
          return value2 - value1;
        });
        return yeartongAccounted;
      }
    },
    //中文地图分组
    dayMapPlug(DateVal,strDate){
      var $this=this;
      var MapAny=[];
      var maxMapNum='';
      DateVal.forEach(function(item,index){  
        var ObjAnyItem={
          id:0,
          name:'',
          MapNum:0,
          is_compare:$this.searchData.is_compare,
          MapArr:[],
          MapTopTen:[],
        }
        var MapTopTen=[];
        ObjAnyItem.name=item.dartName
        ObjAnyItem.id=index;
        ObjAnyItem.MapNum=$this.searchData.comparedept_id.length+($this.searchData.dept_id.length>0?1:0);
        if(item.MapArr&&item.MapArr.length){
            var worldDateVal = worldCountry(item.MapArr);
            worldDateVal.sort(function (a, b) {
                var value1 = a.number;
                var value2 = b.number;
                return value2 - value1;
            });
            worldDateVal.forEach(function(items,indexs){
              var ObjItem={
                name:'',
                country:'',
                number:0,
              }
              ObjItem.name=items.name;
              ObjItem.country=items.country;
              ObjItem.number=items.number;
              ObjAnyItem.MapArr.push(ObjItem);
              if(maxMapNum<items.number){
                maxMapNum=items.number;
              }
            });
            worldDateVal.forEach(function(items,indexs){
              if($this.searchData.comparedept_id.length>0){
                if(indexs<5){
                    MapTopTen.push(items);
                }
              }else{
                if(indexs<10){
                    MapTopTen.push(items);
                }
              }
            });
        }
        ObjAnyItem.MapTopTen=MapTopTen;
        MapAny.push(ObjAnyItem);
      });
      var MapAnyInterval=[];
      var valmaxMap = MapInterval(maxMapNum);
      MapAny.forEach(function(item,index){     
        var ObjAnyItem={
          id:0,
          name:'',
          MapNum:'',
          is_compare:'',
          MapArr:[],
          MapTopTen:[],
          minAverage:'',
          numList:[],
          averArr:[],
          defaulColor:[],
        }
        ObjAnyItem.id=item.id;
        ObjAnyItem.name=item.name;
        ObjAnyItem.MapNum=item.MapNum;
        ObjAnyItem.is_compare=item.is_compare;
        ObjAnyItem.MapArr=item.MapArr;
        ObjAnyItem.MapTopTen=item.MapTopTen;
        ObjAnyItem.minAverage=valmaxMap.minAverage;
        ObjAnyItem.numList=valmaxMap.numList;
        ObjAnyItem.averArr=valmaxMap.averArr;
        ObjAnyItem.defaulColor=valmaxMap.defaulColor;
        MapAnyInterval.push(ObjAnyItem);
      });
      if(strDate=='询盘'){
        $this.MapAny=MapAnyInterval;
      }
      if(strDate=='成交'){
        $this.ScoreMapAny=MapAnyInterval;
      }
      if(strDate=='成交个数'){
        $this.ScorenumMapAny=MapAnyInterval;
        console.log($this.ScorenumMapAny,'$this.ScorenumMapAny');
      }
    },
    LefttimePlug(allDate,lastallDate,historyDate){
      var $this=this;      
      var LefttimeArr=[];   
      var DepartTimeCompareScore=[];
      var MaxValueScore='';
      if(allDate>=lastallDate){
        MaxValueScore=allDate;
      }else{
        MaxValueScore=lastallDate;
      }
      if($this.isDefaultPage){
          var TimeCompareScore={
            year:historyDate[0].yeartime.split('-')[0],
            value:allDate,
            percen:'0%'
          };
          var LastTimeCompareScore={
            year:historyDate[0].yeartime.split('-')[0]-1,
            value:lastallDate,
            percen:'0%'
          }; 
      }else{
        if($this.searchData.isMonth){
          var TimeCompareScore={
            year:historyDate[0].yeartime.split('-')[0],
            value:allDate,
            percen:'0%'
          };
          var LastTimeCompareScore={
            year:historyDate[0].yeartime.split('-')[0]-1,
            value:lastallDate,
            percen:'0%'
          }; 
        }else{
          var TimeCompareScore={
            year:historyDate[0].xundate.split('-')[0],
            value:allDate,
            percen:'0%'
          };
          var LastTimeCompareScore={
            year:historyDate[0].xundate.split('-')[0]-1,
            value:lastallDate,
            percen:'0%'
          }; 
        }
      }
      if(MaxValueScore==0){
        TimeCompareScore.percen='0%';
        LastTimeCompareScore.percen='0%';
      }else{
        TimeCompareScore.percen=(allDate/MaxValueScore*100).toFixed(2)+'%';
        LastTimeCompareScore.percen=(lastallDate/MaxValueScore*100).toFixed(2)+'%';
      }
      var sametimeRateScore='';
      if(LastTimeCompareScore.value==0){
        sametimeRateScore=TimeCompareScore.value.toFixed(2)+'%';
      }else{
        sametimeRateScore=(Math.abs(TimeCompareScore.value-LastTimeCompareScore.value)/LastTimeCompareScore.value*100).toFixed(2)+'%';
      }
      DepartTimeCompareScore=DepartTimeCompareScore.concat(TimeCompareScore,LastTimeCompareScore);
      sametimeRateScore=sametimeRateScore;
      LefttimeArr=[DepartTimeCompareScore,sametimeRateScore];
      return LefttimeArr;
    },
    //左侧时间对比
    //询盘、成交、成本的自我对比（单部门）
    enquiriesSelfContrastPlug(trend,MapNum,strDate){
      console.log(trend,'自我对比'+strDate);
      console.log(MapNum,'自我对比'+strDate);
      var $this=this;
      if(trend&&trend.length>0){
        var DepartTimeCompare=[];
        var DepartTime=[];
        var allxun='';
        var lastxun='';
        trend.forEach(function(item,index){
          var obj={
            year:'',
            value:''
          }
          var max=0;
          item.forEach(function(items,indexs){
             if(indexs==0){
               obj.year=items.date;
             }
             if(strDate=="询盘"){max=max+items.xunnumber;}
             if(strDate=="成本"){max=max+items.money;}
             if(strDate=="成交"){max=max+items.score;}  
             if(strDate=="成交个数"){max=max+items.number;}             
          });
          obj.value=max;
          DepartTime.push(obj);
        });
        if(strDate=="询盘"){
          $this.yeartongObj.allNum=DepartTime[0].value;
          $this.yeartongObj.lastallNum=DepartTime[1].value;
        }
        if(strDate=="成本"){
          $this.yearmonyetongObj.allNum=DepartTime[0].value;
          $this.yearmonyetongObj.lastallNum=DepartTime[1].value;
        }
        if(strDate=="成交"){
          $this.yearscoretongObj.allNum=DepartTime[0].value.toFixed(0);
          $this.yearscoretongObj.lastallNum=DepartTime[1].value.toFixed(0);
        } 
        if(strDate=="成交个数"){
          $this.yearscorenumbertongObj.allNum=DepartTime[0].value;
          $this.yearscorenumbertongObj.lastallNum=DepartTime[1].value;
        } 
        //获取左侧展示数据-单部门时间对比
        var MaxValue='';
        if(DepartTime[0].value>=DepartTime[1].value){
          MaxValue=DepartTime[0].value;
        }else{
          MaxValue=DepartTime[1].value;
        }
        var TimeCompare={
          year:DepartTime[0].year,
          value:DepartTime[0].value,
          percen:'0%'
        };
        var LastTimeCompare={
          year:DepartTime[1].year,
          value:DepartTime[1].value,
          percen:'0%'
        };
        if(MaxValue==0){
          TimeCompare.percen='0%';
          LastTimeCompare.percen='0%';
        }else{
          TimeCompare.percen=(DepartTime[0].value/MaxValue*100).toFixed(2)+'%';
          LastTimeCompare.percen=(DepartTime[1].value/MaxValue*100).toFixed(2)+'%';
        }
        var sametimeRate='';
        if(LastTimeCompare.value==0){
          sametimeRate=TimeCompare.value.toFixed(2)+'%';
        }else{
          sametimeRate=(Math.abs(TimeCompare.value-LastTimeCompare.value)/LastTimeCompare.value*100).toFixed(2)+'%';
        }
        DepartTimeCompare=DepartTimeCompare.concat(TimeCompare,LastTimeCompare);        
        if(strDate=="询盘"){
          $this.sametimeRate=sametimeRate;
          $this.DepartTimeCompare=DepartTimeCompare;
        }
        if(strDate=="成本"){
          $this.sametimeRateMonye=sametimeRate;
          $this.DepartTimeCompareMonye=DepartTimeCompare;
        }
        if(strDate=="成交"){
          $this.sametimeRateScore=sametimeRate;
          $this.DepartTimeCompareScore=DepartTimeCompare;
        } 
        if(strDate=="成交个数"){
          $this.sametimeRateScorenum=sametimeRate;
          $this.DepartTimeCompareScorenum=DepartTimeCompare;
        } 
      }
      $this.enquiriesSelfContrastPlugtrend(trend,strDate);
      //地图
      if(MapNum&&MapNum!=''){
        $this.dayMapPlug(MapNum,strDate); 
      }
    },
    //询盘、成交、成本的自我对比趋势（单部门）
    enquiriesSelfContrastPlugtrend(DateVal,strDate){
      var $this=this;
      var selfdayxuncompare=DateVal;
      if(selfdayxuncompare&&selfdayxuncompare.length>0){
        if(selfdayxuncompare[0].length>0&&selfdayxuncompare[1].length>0){
          if(selfdayxuncompare[0].length>selfdayxuncompare[1].length){
            selfdayxuncompare[0].forEach(function(item,index){
              selfdayxuncompare[1].forEach(function(items,indexs){
                if(index==indexs&&index<=selfdayxuncompare[1].length-1){
                  item.time=item.date + "\n" + items.date;
                  items.time=item.date + "\n" + items.date;
                  item.depart='对比前';
                  items.depart='对比后';
                }
                if(index>=selfdayxuncompare[1].length){
                  item.time=item.date;
                  item.depart='对比前';
                }
                if(strDate=='询盘'){
                  item.xunnumber=item.xunnumber;
                  items.xunnumber=items.xunnumber;
                }
                if(strDate=='成本'){
                  item.money=item.money;
                  items.money=items.money;
                }
                if(strDate=='成交'){
                  item.score=item.score;
                  items.score=items.score;
                }
                if(strDate=='成交个数'){
                  item.score=item.number;
                  items.score=items.number;
                }
              });
            });
          }else{
            selfdayxuncompare[1].forEach(function(item,index){
              selfdayxuncompare[0].forEach(function(items,indexs){
                if(index==indexs&&indexs<=selfdayxuncompare[0].length-1){
                  item.time=item.date + "\n" + items.date;
                  items.time=item.date + "\n" + items.date;
                  item.depart='对比前';
                  items.depart='对比后';
                }
                if(index>=selfdayxuncompare[0].length){
                  item.time=item.date;
                  item.depart='对比前';
                }
                if(strDate=='询盘'){
                  item.xunnumber=item.xunnumber;
                  items.xunnumber=items.xunnumber;
                }
                if(strDate=='成本'){
                  item.money=item.money;
                  items.money=items.money;
                }
                if(strDate=='成交'){
                  item.score=item.score;
                  items.score=items.score;
                }
                if(strDate=='成交个数'){
                  item.score=item.number;
                  items.score=items.number;
                }
              });
            });
          }
        }
      }
      var arrList=[];
      arrList.dayxuntrend=selfdayxuncompare
      if(arrList.dayxuntrend&&arrList.dayxuntrend.length>0){ 
        $this.dayEnquiriesTrendPlug(arrList,strDate);
      }
    },
    //产品分析
    ProductAnyPlug(DateVal){
      var $this=this;
      var ProductAnaly=[]; 
      DateVal.forEach(function(item,index){     
        var ObjAnyItem={
          id:0,
          name:'',
          ProductArr:[],
          ProductTopTen:[],
          tableHidden:{
            tableHeight: 0,
            tableBtn:'auto',
            tableBtnVisible: true,
            tableBtnBool: true,
            tableBtnTxt: "点击展开",
          },
          TabName:'xunnumber',
        }
        ObjAnyItem.name=item.dartName
        ObjAnyItem.id=index;
        item.ProductArr.forEach(function(items,indexs){
          var ObjItem={
            name:'',
            score:0,
            xunnumber:0,
            buynumber:0,
          }
          if(items.xunproduct!=null&&items.xunproduct!=''){
            ObjItem.name=items.xunproduct;
          }          
          if(items.score!=null&&items.score!=''){
            ObjItem.score=items.score.toFixed(2);
          }
          if(items.xunnumber!=null&&items.xunnumber!=''){
            ObjItem.xunnumber=items.xunnumber;
          }
          if(items.buynumber!=null&&items.buynumber!=''){
            ObjItem.buynumber=items.buynumber;
          }
          ObjAnyItem.ProductArr.push(ObjItem);
        });
        ProductAnaly.push(ObjAnyItem);
      });
      $this.ProductAnaly=ProductAnaly;
      console.log($this.ProductAnaly,'原始产品分析');      
      if(ProductAnaly&&ProductAnaly.length>0){
          $this.ProductAnaly.forEach(function(item,index){           
              if (item.ProductArr.length >5) {
                  item.tableHidden.tableBtnVisible = true;
                  item.tableHidden.tableHeight = 298+'px';
              } else {
                  item.tableHidden.tableBtnVisible = false;
                  item.tableHidden.tableHeight = "auto";
              }            
              item.ProductTopTen=$this.Datareorganization(item,item.ProductArr);
          });
      }
    },    
    //提取部门产品前10个
    Datareorganization(valItem,valDate){
        var valDateArr=[];
        valDateArr=valDate;
        valDateArr.forEach(function(items,indexs){
            items.value=0;
            if(valItem.TabName=='xunnumber'){items.value=Number(items.xunnumber);}
            if(valItem.TabName=='buynumber'){items.value=Number(items.buynumber);}
            if(valItem.TabName=='score'){items.value=Number(items.score);}
        });
        var ProductTopTen=[];  
        valDateArr.sort(function (a, b) {
            var value1 = a.value;
            var value2 = b.value;
            return value2 - value1;
        });
        valDateArr.forEach(function(items,indexs){
            if(indexs<10){
                ProductTopTen.push(items);
            }
        });
        return ProductTopTen;
    },
    //产品table点击展开/收缩
    ProductAnyBtnPlug(vID){
      var $this = this;
      $this.ProductAnaly.forEach(function(item,index){
          if(vID==item.id){
            item.tableHidden.tableBtnBool = !item.tableHidden.tableBtnBool;            
            if(item.tableHidden.tableBtnBool){
                item.tableHidden.tableHeight=298+'px';
                item.tableHidden.tableBtnTxt='点击展开';
            }else{
                item.tableHidden.tableHeight=(item.ProductArr.length+1)*50+'px';
                item.tableHidden.tableBtnTxt='点击收起';
            }
          }
      });
    },
    chartBtn(vID,valDate){
        var $this=this;
        $this.vID=vID;
        $this.ProductAnaly.forEach(function(item,index){
            if(vID==item.id){
                item.TabName=valDate
                item.ProductTopTen=$this.Datareorganization(item,item.ProductArr);
            }
        });
    },    
    // 添加对比小组点击事件
    toggleContrast(){
      this.isContrastShow = true;
    },
    // 对比小组点击事件
    contrastGroupChangeHandler(obj){
      var $this = this;
      if(!obj.disabled){
        var selectedContrastGroupID = [];
        var contrastGroupList = $this.contrastGroupList;
        contrastGroupList.forEach(function(item,index){
          if(item.value == obj.value){
            item.isOn = !item.isOn;
          }
          if(item.isOn){
            selectedContrastGroupID.push(item.value);
          }
        });
        $this.searchData.comparedept_id = selectedContrastGroupID;
        $this.contrastGroupList = contrastGroupList;
      }
    },
    // 对比小组添加确定事件
    saveContrastGroup(){
      var $this = this;
      $this.isContrastShow = !$this.isContrastShow;
      if($this.oldContrastGroupID!=$this.searchData.comparedept_id.join(",")){
        $this.oldContrastGroupID = $this.searchData.comparedept_id.join(",");
        $this.searchResult();
      }
    },
    // 基础小组删除点击事件
    deleteDefaultGroup(){
      var $this = this;
      // 基础小组被删除，则对比小组选中状态全部清空，基础小组选中状态全部清空，页面数据清空
      var departArr = $this.departArr;
      departArr.forEach(function(item,index){
        item.isOn = false;
      });
      $this.departArr = departArr;
      $this.searchData.dept_id = [];

      $this.oldContrastGroupID = "";
      $this.groupName = "";
      var contrastGroupList = $this.contrastGroupList;
      contrastGroupList.forEach(function(item,index){
        item.isOn = false;
        item.disabled = false;
      });
      $this.contrastGroupList = contrastGroupList;
      $this.searchData.comparedept_id = [];
      $this.isAlldepartArr=false;
      $this.checkAlldisabled=false;
      //删除分析项
      var AnalysisItemArr = $this.AnalysisItemArr;
      AnalysisItemArr.forEach(function(item,index){
        item.isOn=false;
      });
      $this.selectedType = [];
      $this.searchData.type = [];
      $this.AnalysisItemArr = AnalysisItemArr;
    },
    // 对比小组删除点击事件
    deleteContrastGroup(id){
      var $this = this;
      var contrastGroupList = $this.contrastGroupList;
      var selectedContrastGroupID = [];
      contrastGroupList.forEach(function(item,index){
        if(item.value == id){
          item.isOn = false;
        }
        if(item.isOn){
          selectedContrastGroupID.push(item.value);
        }
      });
      $this.contrastGroupList = contrastGroupList;
      $this.searchData.comparedept_id = selectedContrastGroupID;
      $this.searchResult();
    },
  }
}
</script>