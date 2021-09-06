<template>
  <div class="page-root flex-box no-padding SaleCard" ref="boxPane">
    <div class="sub-router SaleCardFl"  ref="SaleCardFl">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <div class="sub-wrapper">
          <div class="side-button">
            <dl class="Sales-list">
                <dt v-if="menuButtonPermit.includes('Sales_lookphoneall')||menuButtonPermit.includes('Sales_phonecount')" v-on:click="datastatisticClues()"><span>业务员数据统计</span></dt>
                <dt v-if="menuButtonPermit.includes('Sales_waitphone')||menuButtonPermit.includes('Sales_lookphoneall')" v-bind:class="currentStatus === 'waitcount'?'active':''" v-on:click="jumpLink('waitcount')"><span>等待分配</span><i>({{defaultData.waitcount}})</i></dt>
                <dt v-if="menuButtonPermit.includes('Sales_allphone')||menuButtonPermit.includes('Sales_lookphoneall')" v-bind:class="currentStatus === 'allotcount'?'active':''" v-on:click="jumpLink('allotcount')"><span>所有已分配询盘</span><i>({{defaultData.allotcount}})</i></dt>
            </dl>
          </div>
          <dl class="Salelist">
              <dt v-if="menuButtonPermit.includes('Sales_index')" v-bind:class="currentStatus === 'personcount'?'active':''" v-on:click="jumpLink('personcount')"><span>个人所有询盘</span><i>({{defaultData.personcount}})</i></dt>
              <dt v-if="menuButtonPermit.includes('Sales_waitdeal')||menuButtonPermit.includes('Sales_lookphoneall')" v-bind:class="currentStatus === 'waitdealcount'?'active':''" v-on:click="jumpLink('waitdealcount')"><span>等待处理</span><i>({{defaultData.waitdealcount}})</i></dt>
              <dt v-if="menuButtonPermit.includes('Sales_monthsay')||menuButtonPermit.includes('Sales_lookphoneall')" v-bind:class="currentStatus === 'monthsaycount'?'active':''" v-on:click="jumpLink('monthsaycount')"><span>月底前需反馈</span><i>({{defaultData.monthsaycount}})</i></dt>
              <dt v-if="menuButtonPermit.includes('Sales_hasnosay')||menuButtonPermit.includes('Sales_lookphoneall')" v-bind:class="currentStatus === 'hasnosaycount'?'active':''" v-on:click="jumpLink('hasnosaycount')"><span>所有未反馈</span><i>({{defaultData.hasnosaycount}})</i></dt>
              <dt v-if="menuButtonPermit.includes('Sales_waitftword')||menuButtonPermit.includes('Sales_lookphoneall')" v-bind:class="currentStatus === 'waitftwordcount'?'active':''" v-on:click="jumpLink('waitftwordcount')"><span>等待添加富通ID</span><i>({{defaultData.waitftwordcount}})</i></dt>
              <dt v-if="menuButtonPermit.includes('Sales_hasdeal')||menuButtonPermit.includes('Sales_lookphoneall')" v-bind:class="currentStatus === 'hasdealcount'?'active':''" v-on:click="jumpLink('hasdealcount')"><span>已处理</span><i>({{defaultData.hasdealcount}})</i></dt>
              <dt v-if="menuButtonPermit.includes('Sales_hassay')||menuButtonPermit.includes('Sales_lookphoneall')" v-bind:class="currentStatus === 'hassaycount'?'active':''" v-on:click="jumpLink('hassaycount')"><span>已做反馈</span><i>({{defaultData.hassaycount}})</i></dt>
          </dl>
          <div class="side-button">
            <dl class="Sales-list">
                <dt v-if="menuButtonPermit.includes('Sales_search')" v-on:click="dataStatistic()"><span>数据分析</span></dt>
            </dl>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="flex-content SaleCardFr">
      <div class="abs-panel" ref="mainPane">
          <div class="scroll-panel">
              <div class="true-height" ref="scrollPane">
                  <el-card class="box-card scroll-card SaleCardFlFrTable tipsHas" shadow="hover">
                    <div slot="header">  
                      <div class="card-header" ref="headerPane">                      
                        <div class="tips-list" v-if="defaultData.warningcount>0" ref="tipsPane">
                              <div class="item-tips type-1" v-for="(item,index) in defaultData.warning" v-bind:key="index" v-on:click="editTableRow(item,index,'1')">
                                  <i>{{index+1}}</i>
                                  <strong>ID：{{item.id}}</strong>
                                  <span>{{item.givesaleswarn}}</span>
                              </div>
                        </div>
                        <div class="tipsHasItem">
                            <div class="filter-panel" v-if="device==='mobile'">
                                <div class="search-panel">
                                    <el-input class="article-search" size="small"
                                        placeholder="富通ID/分配ID"
                                        v-model="searchData.ftword_id"
                                        clearable>
                                      <el-button slot="append" @click="searchResult()"><span class="search-icon"><svg-icon icon-class="search1" class-name="disabled" /></span></el-button>
                                    </el-input>
                                </div>
                                <span class="filter-button" v-on:click="searchDialog()">筛选<i class="svg-i"><svg-icon icon-class="filter" class-name="disabled" /></i></span>
                            </div>      
                            <div class="search-wrap" v-if="device==='desktop'">
                              <div class="item-search" style="width:130px;">
                                <el-select v-model="searchData.timetype" size="small" clearable placeholder="分配时间">
                                  <el-option
                                      v-for="item in timetypelist"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                  </el-option>
                                </el-select>
                              </div>
                              <div class="item-search" style="width:240px;">
                                <el-date-picker
                                  v-model="searchData.date"
                                  class="date-range"
                                  size="small"
                                  type="daterange"
                                  align="right"
                                  value-format = "yyyy-MM-dd"
                                  unlink-panels
                                  range-separator="至"
                                  start-placeholder="开始日期"
                                  end-placeholder="结束日期"
                                  :picker-options="pickerRangeOptions">
                                </el-date-picker>
                              </div>
                              <div class="item-search" v-if="currentStatus == 'waitcount'||currentStatus == 'allotcount'" style="width:100px;">
                                <el-select v-model="searchData.salesuserid" size="small" clearable placeholder="业务员">
                                  <el-option
                                      v-for="item in salesuseridList"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                  </el-option>
                                </el-select>
                              </div>
                              <div class="item-search" style="width:90px;">
                                <el-select v-model="searchData.continent" size="small" clearable placeholder="大洲">
                                  <el-option
                                      v-for="item in continentlist"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                  </el-option>
                                </el-select>
                              </div>
                              <div class="item-search" style="width:100px;">
                                <el-select v-model="searchData.producttype_id" size="small" clearable placeholder="产品类型"  @change="currentCateChange" >
                                  <el-option
                                      v-for="item in producttype_idList"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                  </el-option>
                                </el-select>
                              </div>
                              <div class="item-search" style="width:90px;">
                                <el-select v-model="searchData.productid" size="small" clearable placeholder="产品名">
                                  <el-option
                                      v-for="item in productidList"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                  </el-option>
                                </el-select>
                              </div>
                              <div class="item-search" style="width:90px;">
                                <el-select v-model="searchData.managestatus" size="small" clearable placeholder="处理">
                                  <el-option
                                      v-for="item in managestatusList"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                  </el-option>
                                </el-select>
                              </div>
                              <div class="item-search" style="width:100px;">
                                <el-select v-model="searchData.replystatus" size="small" clearable placeholder="回复情况">
                                  <el-option
                                      v-for="item in replystatusList"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                  </el-option>
                                </el-select>
                              </div>
                              <div class="item-search" style="width:100px;">
                                <el-select v-model="searchData.ennature" size="small" clearable placeholder="性质">
                                  <el-option
                                      v-for="item in ennatureList"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                  </el-option>
                                </el-select>
                              </div>
                              <div class="item-search" style="width:100px;">
                                <el-select v-model="searchData.enxunprice" size="small" clearable placeholder="需求">
                                  <el-option
                                      v-for="item in enxunpriceList"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                  </el-option>
                                </el-select>
                              </div>
                              <div class="item-search">
                                <el-checkbox-group v-model="feedbackArr" class="checkbox-group" @change="feedbackClick"  size="small">
                                  <el-checkbox v-for="item in feedbackList" :label="item.value" :key="item.value" border>{{item.label}}</el-checkbox>
                                </el-checkbox-group>
                              </div>
                              <div class="item-search" style="width: 150px;">
                                <el-input
                                  size="small"
                                  class="tips-input-2"
                                  placeholder="客户联系方式"
                                  v-model="searchData.keyword"
                                  clearable>
                                </el-input>
                              </div>
                              <div class="item-search" style="width: 150px;">
                                <el-input
                                  size="small"
                                  class="tips-input-3"
                                  placeholder="富通ID/分配ID"
                                  v-model="searchData.ftword_id"
                                  clearable>
                                </el-input>
                              </div>
                              <div class="item-search">
                                <el-button class="item-input" size="small" type="primary" icon="el-icon-search" @click="searchResult()">查询</el-button>
                              </div>  
                            </div>
                            <div class="clues-info flex-box">
                              <div class="clues-infoFl flex-content">
                                <p v-if="currentStatus != 'allotcount'"><span>当前结果集状态：共有<strong class="color1">{{infoData.allcount}}</strong>条。</span></p>
                                <p v-else><span>当前结果集状态：当前共有<strong class="color1">{{infoData.allcount}}</strong>条信息。</span><span>昨天共分配<strong class="color2">{{infoData.countyestoday}}</strong>个询盘，当前共有<strong class="color3">{{infoData.countyestodaynodeal}}</strong>条未处理</span><span v-if="infoData.countyestodaynodeal>0" class="item-span-4" style="cursor: pointer;" @click="searchResult(1)">点击查看昨天未处理询盘</span><span>||</span><span>今天天共分配<strong class="color2">{{infoData.counttoday}}</strong>个询盘，当前共有<strong class="color3">{{infoData.counttodaynodeal}}</strong>条未处理</span><span v-if="infoData.counttodaynodeal>0" class="item-span-4" style="cursor: pointer;" @click="searchResult(2)">点击查看今天未处理询盘</span></p>
                              </div>
                              <div class="clues-title-btn">
                                <el-button class="item-input" v-if="menuButtonPermit.includes('Sales_phonecancel')&&currentStatus === 'allotcount'" size="small" type="primary" :disabled="isTableRow" @click="deleteTableRow">分配撤回</el-button>
                                <div class="SaleMassDistribution" v-if="menuButtonPermit.includes('Sales_waitphone')&&currentStatus === 'waitcount'">                          
                                  <el-select :disabled="isTableRow" v-model="Determine.userid" size="small" clearable placeholder="-选择业务员-">
                                    <el-option
                                    v-for="item in dealuserList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                  </el-select>
                                  <el-button class="item-input" size="small" type="primary" :disabled="isTableRow" @click="DetermineTableRow">确定分配</el-button>
                                </div>
                              </div>
                            </div>
                        </div>
                      </div>
                    </div>
                    <div class="card-content" ref="tableContent">
                      <el-table
                          ref="simpleTable"
                          :data="tableData"
                          tooltip-effect="dark"
                          stripe
                          class="SiteTable EntableColor"
                          style="width: 100%"
                          row-key="id"
                          :height="tableHeight"
                          @selection-change="handleSelectionChange"
                          >
                          <el-table-column
                              type="selection"
                              align="center"
                              v-if="currentStatus === 'allotcount'||currentStatus === 'waitcount'"
                              width="48">
                          </el-table-column>
                          <el-table-column
                          prop="id"
                          label="ID"
                          width="50"
                          align="center"
                          >
                          </el-table-column>
                          <el-table-column
                          prop="weekday"
                          label="咨询时间与说明"
                          width="190"
                          >
                          <template slot-scope="scope">
                              <div class="table-text">
                              <p>{{scope.row.weekday}}-{{scope.row.xuntime}}</p>
                              <p><span>业务员：</span><strong>{{scope.row.salesusername}}</strong></p>
                              <p><span>特别说明：</span><span class="SiteColor-01">{{scope.row.otherremark}}</span></p>
                              </div>
                          </template>
                          </el-table-column>
                          <el-table-column
                          prop="continent"
                          label="大州/地区"
                          width="100"
                          >
                          <template slot-scope="scope">
                              <div class="table-text">
                                <p><span class="EnColor05">大州：</span>{{scope.row.continent}}</p>
                                <p><span class="EnColor05">国家：</span>{{scope.row.country}}</p>
                              </div>
                          </template>
                          </el-table-column>
                          <el-table-column
                          prop="producttypename"
                          label="类型/产品"
                          width="150"
                          >
                          <template slot-scope="scope">
                              <div class="table-text">
                                <p><span class="EnColor05">类型：</span>{{scope.row.producttypename}}</p>
                                <p><span class="EnColor05">产品：</span>{{scope.row.keyproduct}}</p>
                                <p><span class="EnColor05">富通：</span>{{scope.row.ftword_id}}</p>
                              </div>
                          </template>
                          </el-table-column>
                          <el-table-column
                          prop="custormname"
                          label="联系方式"
                          width="180"
                          >
                          <template slot-scope="scope">
                              <div class="table-text">
                              <p><span class="EnColor05">称呼：</span>{{scope.row.custormname}}</p>
                              <p><span class="EnColor05">邮箱：</span><span class="SiteColor-02"  v-if="scope.row.custormemail" @click="editTableRow(scope.row,scope.$index,'2')" style="cursor: pointer;">点击详情查看Email</span></p>
                              <p><span class="EnColor05">电话：</span>{{scope.row.custormphone}}</p>
                              </div>
                          </template>
                          </el-table-column>
                          <el-table-column
                          prop="custormneedinfo"
                          label="需求详情"
                          min-width="300"
                          >
                          <template slot-scope="scope">
                              <div class="table-text">                        
                                  <p v-if="scope.row.contentedittime"><span class="SiteColor-01">内容有修改：修改时间{{scope.row.contentedittime}}</span></p>
                                  <p>{{scope.row.Salescustormneedinfo}}<span class="SiteColor-03 clear" style="cursor:pointer;" v-if="scope.row.Salescustormneedinfo.length>150" @click="editTableRow(scope.row,scope.$index,'2')">#查看更多</span></p>
                              </div>
                          </template>
                          </el-table-column>
                          <el-table-column
                          prop="Salesmanagestatus"
                          label="处理/回复"
                          width="90"
                          >
                          <template slot-scope="scope">
                              <div class="table-text">
                                  <p :style="scope.row.managestatus==1?'color:#d02c34':'color:#1a6fdf'">{{scope.row.Salesmanagestatus}}</p>
                                  <p :style="scope.row.replystatus==1?'color:#d02c34':'color:#49c96a'">{{scope.row.Salesreplystatus}}</p>
                              </div>
                          </template>
                          </el-table-column>
                          <el-table-column
                          prop="SalesEnnature"
                          label="客户性质"
                          width="120"
                          >
                          <template slot-scope="scope">
                              <div class="table-text">
                                  <p>{{scope.row.SalesEnnature}}</p>
                                  <p>{{scope.row.SalesEnxunprice}}</p>
                              </div>
                          </template>
                          </el-table-column>
                          <el-table-column
                          prop="salesremark"
                          label="个人备注"
                          width="200"
                          >
                          <template slot-scope="scope">
                              <div class="table-text">
                                  <p>{{scope.row.salesremark}}</p>
                              </div>
                          </template>
                          </el-table-column>
                          <el-table-column
                          prop="addtime"
                          label="添加/修改时间"
                          width="230"
                          >
                          <template slot-scope="scope">
                              <div class="table-text">
                                  <p><span>添加时间：</span>{{scope.row.xuntime}}</p>
                                  <p><span>分配时间：</span>{{scope.row.addtime}}</p>
                                  <p><span>更新时间：</span>{{scope.row.updatetime}}</p>
                              </div>
                          </template>
                          </el-table-column>
                          <el-table-column
                          v-if="menuButtonPermit.includes('Sales_phoneinfosub')&&device==='desktop'"
                          :width="operationsWidth"
                          align="center"
                          prop="operations"
                          fixed="right"
                          label="操作">
                          <template #default="scope">
                              <div class="table-button">
                              <el-button size="mini" @click="editTableRow(scope.row,scope.$index,'2')">详情</el-button>
                              <span class="SiteColor-03" v-if="scope.row.is_read==1">未读</span>
                              </div>
                          </template>
                          </el-table-column>
                      </el-table>
                    </div>
                    <div class="pagination-panel" v-if="totalDataNum>20" ref="pagePane">
                      <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="searchData.page"
                        :page-sizes="pageSizeList"
                        :page-size="searchData.limit"
                        :layout="device==='mobile'?'sizes, jumper':'total, sizes, prev, pager, next, jumper'"
                        :total="totalDataNum">
                      </el-pagination>
                    </div>
                  </el-card>
              </div>
          </div>
      </div>
    </div>
    <div class="mobile-filter-mask" v-bind:class="openClass?'open':''" v-if="device!=='desktop'" v-on:click="searchDialog()"></div>
    <div class="mobile-filter-dialog flex-box flex-column" v-bind:class="openClass?'open':''" v-if="device!=='desktop'">
      <div class="flex-content">
        <div class="abs-scroll">        
          <ul>
            <li>
              <div class="item-li">
                <span class="title-panel">分配时间</span>
                <div class="item-filter">
                    <el-select v-model="searchData.timetype" size="small" clearable placeholder="分配时间">
                        <el-option
                            v-for="item in timetypelist"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
              </div>
              <div class="item-li">
                <span class="title-panel">开始时间</span>
                <div class="item-filter">
                  <el-date-picker
                    v-model="searchData.startDate"
                    size="small"
                    type="datetime"
                    placeholder="选择开始时间"
                    value-format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker>
                </div>
              </div>
              <div class="item-li">
                <span class="title-panel">结束时间</span>
                <div class="item-filter">
                    <el-date-picker
                      v-model="searchData.endData"
                      size="small"
                      type="datetime"
                      placeholder="选择结束时间"
                      value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </div>
              </div>
              <div class="item-li" v-if="currentStatus == 'waitcount'||currentStatus == 'allotcount'">
                <span class="title-panel">业务员</span>
                <div class="item-filter">
                    <el-select v-model="searchData.salesuserid" size="small" clearable placeholder="业务员" >
                        <el-option
                            v-for="item in salesuseridList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
              </div>
              <div class="item-li">
                <span class="title-panel">大洲</span>
                <div class="item-filter">
                    <el-select v-model="searchData.continent" size="small" clearable placeholder="大洲" >
                        <el-option
                            v-for="item in continentlist"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
              </div>
              <div class="item-li">
                <span class="title-panel">产品类型</span>
                <div class="item-filter">
                    <el-select v-model="searchData.producttype_id" size="small" clearable placeholder="产品类型" @change="currentCateChange" >
                        <el-option
                            v-for="item in producttype_idList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
              </div>
              <div class="item-li">
                <span class="title-panel">产品</span>
                <div class="item-filter">
                        <el-select v-model="searchData.productid" size="small" clearable placeholder="产品名" >
                            <el-option
                                v-for="item in productidList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                </div>
              </div>
              <div class="item-li">
                <span class="title-panel">处理</span>
                <div class="item-filter">
                    <el-select v-model="searchData.managestatus" size="small" clearable placeholder="处理">
                        <el-option
                            v-for="item in managestatusList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
              </div>
              <div class="item-li">
                <span class="title-panel">回复</span>
                <div class="item-filter">
                    <el-select v-model="searchData.replystatus" size="small" clearable placeholder="回复情况">
                        <el-option
                            v-for="item in replystatusList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
              </div>
              <div class="item-li">
                <span class="title-panel">性质</span>
                <div class="item-filter">
                    <el-select v-model="searchData.ennature" size="small" clearable placeholder="性质">
                        <el-option
                            v-for="item in ennatureList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
              </div>
              <div class="item-li">
                <span class="title-panel">需求</span>
                <div class="item-filter">
                    <el-select v-model="searchData.enxunprice" size="small" clearable placeholder="需求">
                        <el-option
                            v-for="item in enxunpriceList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
              </div>
              <div class="item-li">
                <span class="title-panel">反馈</span>
                <div class="item-filter">
                    <el-checkbox-group v-model="feedbackArr" class="SalesCardcheckbox" @change="feedbackClick">
                      <el-checkbox v-for="item in feedbackList" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                </div>
              </div>
              <div class="item-li">
                <span class="title-panel">客户联系方式</span>
                <div class="item-filter">
                    <el-input size="small"
                        placeholder="客户联系方式"
                        v-model="searchData.keyword"
                        clearable>
                    </el-input>
                </div>
              </div>
              <div class="item-li">
                <span class="title-panel">富通ID/分配ID</span>
                <div class="item-filter">
                    <el-input size="small"
                        placeholder="富通ID/分配ID"
                        v-model="searchData.ftword_id"
                        clearable>
                    </el-input>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <p class="footer-button"><span class="btn-yes" v-on:click="searchResult()">确定</span></p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Sales_search',
  data() {
    return {
      currentStatus:"personcount",
      status:1,
      menuButtonPermit:[],
      defaultData:{},
      operationsWidth:"",
      tableData:[],
      tableHeight:200,
      searchData:{
        page:1,
        limit:20,
        timetype:"",
        salesownid:"",
        continent:"",
        producttype_id:"",
        productid:"",
        ennature:"",
        enxunprice:"",
        managestatus:"",
        replystatus:"",
        starttime:"",
        endtime:"",
        keyword:"",
        feedback:"",
        ftword_id:"",
        deal:"",
        date:[],
        salesuserid: "",
        startData:"",
        endData:"",
      },
      timetypelist:[
        {label:"按照分配时间",value:1},
        {label:"按照添加时间",value:2},
      ],
      continentlist:[
        {label:"东南亚",value:"东南亚"},
        {label:"中亚",value:"中亚"},
        {label:"东亚",value:"东亚"},
        {label:"西亚",value:"西亚"},
        {label:"南亚",value:"南亚"},
        {label:"非洲",value:"非洲"},
        {label:"欧洲",value:"欧洲"},
        {label:"南美洲",value:"南美洲"},
        {label:"北美洲",value:"北美洲"},
        {label:"大洋洲",value:"大洋洲"},
      ],
      producttype_idList:[],
      productidList:[],
      managestatusList:[
        {label:"未处理",value:1},
        {label:"已处理",value:2},
      ],
      replystatusList:[
        {label:"未标记",value:1},
        {label:"已回复",value:2},
        {label:"未回复",value:3},
      ],
      ennatureList:[],
      enxunpriceList:[],
      salesuseridList:[],
      dealuserList:[],
      feedbackArr:[],
      feedbackList:[
        {label:"已反馈",value:1},
        {label:"未反馈",value:2},
      ],
      pageSizeList:[20,50,100,200,500],
      totalDataNum:0,
      pickerRangeOptions: {
        shortcuts: [{
          text: '最近一旬',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 9);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      infoData:{
        allcount:0,
        warnlist:[]
      },
      isTableRow:true,
      openClass:false,
      permitStatus:[],
      permitField:[],
      selectedData:[],
      ids:[],
      Determine:{
        ids:[],
        userid:'',
      },
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'device'
    ]),
  },
  mounted(){
    const $this = this;
    $this.$nextTick(function () {
      $this.setTableHeight();
    });
    window.onresize = () => {
        return (() => {
            $this.setTableHeight();
        })()
    }
  },
  watch: {
      tableHeight(val) {
        if (!this.timer) {
          this.tableHeight = val
          this.timer = true
          const $this = this
          setTimeout(function() {
            $this.timer = false
          }, 400)
        }
      },
      //监听相同路由下参数变化的时候，从而实现异步刷新
      '$route'(to,from) {
          var $this = this;
          if($this.$route.query.Status){
              $this.currentStatus = $this.$route.query.Status;
          }else{
              $this.$message({
                  showClose: true,
                  message: "未找到对应页面或页面缺失参数",
                  type: 'error',
                  duration:6000
              });
              $this.$router.push({path:`/404?redirect=${$this.$router.currentRoute.fullPath}`});
          }
          $this.initData();
      },
  },
  updated(){
    this.$nextTick(() => {
      this.$refs.simpleTable.doLayout()
    })
  },
  created(){
    var $this = this;
    if($this.$route.query.Status){
        $this.currentStatus = $this.$route.query.Status;
    }else{
        $this.$message({
            showClose: true,
            message: "未找到对应页面或页面缺失参数",
            type: 'error',
            duration:6000
        });
        $this.$router.push({path:`/404?redirect=${$this.$router.currentRoute.fullPath}`});
    }
    $this.initData();
  },
  methods:{
    // 设置高度
    setTableHeight(){
      var $this = this;
      $this.tableHeight = "auto";
      $this.$nextTick(()=>{
          var trueHeight = $this.$refs.scrollPane.offsetHeight;
          var headerHeight = $this.$refs.headerPane.offsetHeight;
          var screenHeight = $this.$refs.boxPane.offsetHeight;
          console.log(trueHeight,"真实高度");
          console.log(headerHeight,"头部高度");
          console.log(screenHeight,"视窗高度");
          if(trueHeight<=screenHeight){
            $this.tableHeight = screenHeight-headerHeight-30-15;
          }else{
            if(trueHeight-screenHeight<=headerHeight){
              $this.tableHeight = "auto";
            }else{
              if($this.totalDataNum>100){
                $this.tableHeight = screenHeight - $this.$refs.pagePane.offsetHeight - 30;
              }else{
                $this.tableHeight = screenHeight-30;
              }
            }
          }
          console.log($this.tableHeight,"表格高度");
      });
    },
    // 数据清空
    DataEmpty(){
      var $this=this; 
      $this.defaultData.page={};
      $this.searchData.page=1;
      $this.searchData.limit=20;
      $this.searchData.timetype='';
      $this.searchData.salesownid='';
      $this.searchData.continent='';
      $this.searchData.producttype_id='';
      $this.searchData.productid='';
      $this.searchData.ennature='';
      $this.searchData.enxunprice='';
      $this.searchData.managestatus='';
      $this.searchData.replystatus='';
      $this.searchData.date=[];
      $this.searchData.keyword='';
      $this.searchData.feedback='';
      $this.searchData.ftword_id='';
      $this.searchData.deal='';
      $this.searchData.startDate='';
      $this.searchData.endDate='';
      $this.salesuseridList=[];
      $this.dealuserList=[];      
      $this.infoData.allcount=0;
      $this.infoData.warnlist=[];
      $this.isTableRow=true;
      $this.tableData=[];
      $this.tableHeight=[];
      $this.ids=[];
      $this.Determine.ids=[];
      $this.Determine.userid='';
      $this.selectedData=[];
    },
    // 搜索结果
    searchResult(DealVal){
      var $this = this;
      var isSearch = true;
      if($this.device==="mobile"){
        if(($this.searchData.startDate==""&&$this.searchData.endDate!="")||($this.searchData.startDate!=""&&$this.searchData.endDate=="")){
          isSearch = false;
        }else{
          if($this.searchData.startDate!=""&&$this.searchData.endDate!=""){
            if(!$this.compareDate($this.searchData.startDate,$this.searchData.endDate)){
              isSearch = false;
            }
          }
        }
      }
      if(!isSearch){
        if($this.searchData.startDate==""&&$this.searchData.endDate!=""){
          $this.$alert('结束时间不为空时开始时间不能为空', '警告', {
            confirmButtonText: '确定',
          });
        }
        if($this.searchData.startDate!=""&&$this.searchData.endDate==""){
          $this.$alert('开始时间不为空时结束时间不能为空', '警告', {
            confirmButtonText: '确定',
          });
        }
        if($this.searchData.startDate!=""&&$this.searchData.endDate!=""){
          $this.$alert('开始时间不能大于结束时间', '警告', {
            confirmButtonText: '确定',
          });
        }
        return false;
      }
      $this.openClass = false;      
      $this.tableData=[];
      if(DealVal&&DealVal!=''&&DealVal!=undefined){
        $this.searchData.deal=DealVal;
      }else{
        $this.searchData.deal='';
      }
      $this.initCluesList();
    },    
    // 初始化数据
    initData(){
      var $this = this;    
      $this.getUserMenuButtonPermit();
    },
    // 公共数据
    publlcData(){
      var $this = this;
      $this.$store.dispatch('Sales/getSalesPublicDataAction', null).then(response=>{
        if(response){        
          console.log(response,'左侧公共数据');
          var defaultData = {};
          defaultData.waitcount=response.waitcount;
          defaultData.allotcount=response.allotcount;
          defaultData.personcount=response.personcount;
          defaultData.waitdealcount=response.waitdealcount;
          defaultData.monthsaycount=response.monthsaycount;
          defaultData.hasnosaycount=response.hasnosaycount;
          defaultData.waitftwordcount=response.waitftwordcount;
          defaultData.hasdealcount=response.hasdealcount;
          defaultData.hassaycount=response.hassaycount;
          defaultData.warning=response.warning;
          defaultData.warningcount=response.warningcount;
          $this.defaultData = defaultData;
          console.log(defaultData,'defaultData');
        }
      });
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.publlcData();
      $this.$store.dispatch('Sales/getSalesSearchListAction', null).then(response=>{
        if(response){
          if(response.status){
            console.log(response,"搜索条件");
            var producttype_idList=[];
            response.producttype.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              producttype_idList.push(itemData);
            });
            $this.producttype_idList=producttype_idList;
            var ennatureList=[];
            response.nature.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              ennatureList.push(itemData);
            });
            $this.ennatureList=ennatureList;
            var enxunpriceList=[];
            response.enprice.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              enxunpriceList.push(itemData);
            });
            $this.enxunpriceList=enxunpriceList;            
            if($this.currentStatus=="waitcount"&&response.dealuser.length>0){
              var salesuseridList=[];
              response.allotuser.forEach(function(item,index){
                var itemData = {};
                itemData.label = item.name;
                itemData.value = item.id;
                salesuseridList.push(itemData);
              });
              $this.salesuseridList=salesuseridList;              
              var dealuserList=[];
              response.dealuser.forEach(function(item,index){
                var itemData = {};
                itemData.label = item.name;
                itemData.value = item.id;
                dealuserList.push(itemData);
              });
              $this.dealuserList=dealuserList;
            }
            if($this.currentStatus=="allotcount"&&response.allotuser.length>0){              
              var salesuseridList=[];
              response.dealuser.forEach(function(item,index){
                var itemData = {};
                itemData.label = item.name;
                itemData.value = item.id;
                salesuseridList.push(itemData);
              });
              $this.salesuseridList=salesuseridList;
            }
            $this.searchResult();
          }else{
            if(response.permitstatus&&response.permitstatus==2){
              $this.$message({
                showClose: true,
                message: "未被分配该页面访问权限",
                type: 'error',
                duration:6000
              });
              $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
            }else{
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
              });
            }
          }
        }
      });
    },    
    // 当前产品分类改变触发加载分类下的产品
    currentCateChange(e){
        var $this = this;
        if(e){
          $this.searchData.productid = "";
          $this.$store.dispatch('enphone/getCurrentCateProductListAction', {typeid:e}).then(response=>{
              if(response){
                  if(response.status){
                      console.log(response,"搜索条件信息phoneindex");
                      var productidList = [];
                      response.data.forEach(function(item,index){
                          var itemData = {};
                          itemData.label = item.name;
                          itemData.value = item.id;
                          productidList.push(itemData);
                      });
                      $this.productidList = productidList;
                  }else{
                      $this.$message({
                      showClose: true,
                      message: response.info,
                      type: 'error'
                      });
                  }
              }
          });
        }else{
          $this.searchData.productid = "";
          $this.productidList = [];
        }
    },
    // 组装搜索接口所需数据
    initSearchData(){
      var $this = this;
      var searchData = {};
      searchData.page = $this.searchData.page;
      searchData.limit = $this.searchData.limit;
      if($this.searchData.timetype&&$this.searchData.timetype!=''){
        searchData.timetype = $this.searchData.timetype;
      }
      if($this.searchData.salesownid&&$this.searchData.salesownid!=''){
        searchData.salesownid = $this.searchData.salesownid;
      }
      if($this.searchData.continent&&$this.searchData.continent!=''){
        searchData.continent = $this.searchData.continent;
      }
      if($this.searchData.producttype_id&&$this.searchData.producttype_id!=''){
        searchData.producttype_id = $this.searchData.producttype_id;
      }
      if($this.searchData.productid&&$this.searchData.productid!=''){
        searchData.productid = $this.searchData.productid;
      }
      if($this.searchData.ennature&&$this.searchData.ennature!=''){
        searchData.ennature = $this.searchData.ennature;
      }
      if($this.searchData.enxunprice&&$this.searchData.enxunprice!=''){
        searchData.enxunprice = $this.searchData.enxunprice;
      }
      if($this.searchData.managestatus&&$this.searchData.managestatus!=''){
        searchData.managestatus = $this.searchData.managestatus;
      }
      if($this.searchData.replystatus&&$this.searchData.replystatus!=''){
        searchData.replystatus = $this.searchData.replystatus;
      }  
      if($this.device === "mobile"){
        searchData.starttime = $this.searchData.startDate;
        searchData.endtime = $this.searchData.endDate;
      }else{
        if($this.searchData.date!=''){
          searchData.starttime = $this.searchData.date[0];
          searchData.endtime = $this.searchData.date[1];
        }
      }
      if($this.searchData.keyword&&$this.searchData.keyword!=''){
        searchData.keyword = $this.searchData.keyword;
      }
      if($this.searchData.feedback&&$this.searchData.feedback!=''){
        searchData.feedback = $this.searchData.feedback;
      }
      if($this.searchData.ftword_id&&$this.searchData.ftword_id!=''){
        searchData.ftword_id = $this.searchData.ftword_id;
      }
      if($this.searchData.deal&&$this.searchData.deal!=''){
        searchData.deal = $this.searchData.deal;
      }
      if($this.currentStatus=="waitcount"&&$this.searchData.salesuserid&&$this.searchData.salesuserid!=''){
          searchData.salesuserid = $this.searchData.salesuserid;
      }
      if($this.currentStatus=="allotcount"&&$this.searchData.salesuserid&&$this.searchData.salesuserid!=''){
          searchData.salesownid = $this.searchData.salesuserid;
      }
      return searchData;
    },
    // 初始化询盘列表数据
    initCluesList(){
      var $this = this;
      var searchData = $this.initSearchData();
      if($this.currentStatus=="waitcount"){
        $this.$store.dispatch('Sales/getSalesWaitDistribuAction', searchData).then(response=>{
            $this.resData(response,'等待分配');
        });
      }
      if($this.currentStatus=="allotcount"){
        $this.$store.dispatch('Sales/getSalesAllDistribuListAction', searchData).then(response=>{
            $this.resData(response,'所有已分配询盘');
        });
      }
      if($this.currentStatus=="personcount"){
        $this.$store.dispatch('Sales/getSalesListAction', searchData).then(response=>{
            $this.resData(response,'个人所有询盘');
        });
      }
      if($this.currentStatus=="waitdealcount"){
        $this.$store.dispatch('Sales/getSalesWaitFortisAction', searchData).then(response=>{
            $this.resData(response,'等待处理');
        });
      }
      if($this.currentStatus=="monthsaycount"){
        $this.$store.dispatch('Sales/getSalesMonthEndFeedbackAction', searchData).then(response=>{
            $this.resData(response,'月底前需反馈');
        });
      }
      if($this.currentStatus=="hasnosaycount"){
        $this.$store.dispatch('Sales/getSalesNofeedbackAction', searchData).then(response=>{
            $this.resData(response,'所有未反馈');
        });
      }
      if($this.currentStatus=="waitftwordcount"){
        $this.$store.dispatch('Sales/getSalesWaitAddingFortisAction', searchData).then(response=>{
            $this.resData(response,'等待添加富通ID');
        });
      }
      if($this.currentStatus=="hasdealcount"){
        $this.$store.dispatch('Sales/getSalesInquiryFortisAction', searchData).then(response=>{
            $this.resData(response,'已处理');
        });
      }
      if($this.currentStatus=="hassaycount"){
        $this.$store.dispatch('Sales/getSalesInquiryfeedbackAction', searchData).then(response=>{
            $this.resData(response,'已做反馈');
        });
      }
    },
    //数据整合
    resData(resData,T){
      var $this = this;
      if(resData){
        if(resData.status){
          console.log(resData,T);
          var tableData = resData.data;
          if(tableData.length>0){
            tableData.forEach(function(item,index){   
              var Salesmanagestatus=''; 
              var Salesreplystatus=''; 
              var SalesEnnature='';  
              var SalesEnxunprice=''; 
              var Salescustormneedinfo='';         
              $this.managestatusList.forEach(function(item01,index01){
                  if(item.managestatus==item01.value){
                    Salesmanagestatus=item01.label;
                  }
              });
              $this.replystatusList.forEach(function(item02,index02){
                  if(item.replystatus==item02.value){
                    Salesreplystatus=item02.label;
                  }
              });
              $this.ennatureList.forEach(function(item03,index03){
                  if(item.ennature==item03.value){
                    SalesEnnature=item03.label;
                  }
              });
              $this.enxunpriceList.forEach(function(item04,index04){
                  if(item.enxunprice==item04.value){
                    SalesEnxunprice=item04.label;
                  }
              });
              if(item.custormneedinfo&&item.custormneedinfo!=''&&item.custormneedinfo!=undefined){                  
                  var list=item.custormneedinfo.length;
                  if(list>150){
                      Salescustormneedinfo=item.custormneedinfo.substring(0,150) + '...';
                  }else{
                    Salescustormneedinfo=item.custormneedinfo;
                  }
              }
              item.Salescustormneedinfo=Salescustormneedinfo;
              item.Salesmanagestatus=Salesmanagestatus;
              item.Salesreplystatus=Salesreplystatus;
              item.SalesEnnature=SalesEnnature;
              item.SalesEnxunprice=SalesEnxunprice;
            });
          }
          $this.tableData = tableData;
            $this.$nextTick(function () {
              $this.setTableHeight();
            })
        }else{
          $this.$message({
            showClose: true,
            message: resData.info,
            type: 'error'
          });
        }
        var infoData = {};
        infoData.allcount=resData.allcount;
        infoData.warnlist=resData.warnlist;
        if($this.currentStatus=="allotcount"){
          infoData.counttoday=resData.counttoday;
          infoData.counttodaynodeal=resData.counttodaynodeal;
          infoData.countyestoday=resData.countyestoday;
          infoData.countyestodaynodeal=resData.countyestodaynodeal;
        }
        $this.infoData = infoData;
        $this.totalDataNum = resData.allcount;
        $this.setTableHeight();
      }
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        console.log(res);
        if(res.status){
          console.log(res,"操作权限")
          if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
              if(item.action_route=="Sales_waitphone"){
                $this.permitStatus.push("waitcount");
              }
              if(item.action_route=="Sales_allphone"){
                $this.permitStatus.push("allotcount");
              }
              if(item.action_route=="Sales_index"){
                $this.permitStatus.push("personcount");
              }
              if(item.action_route=="Sales_waitdeal"){
                $this.permitStatus.push("waitdealcount");
              }
              if(item.action_route=="Sales_monthsay"){
                $this.permitStatus.push("monthsaycount");
              }
              if(item.action_route=="Sales_hasnosay"){
                $this.permitStatus.push("hasnosaycount");
              }
              if(item.action_route=="Sales_waitftword"){
                $this.permitStatus.push("waitftwordcount");
              }
              if(item.action_route=="Sales_hasdeal"){
                $this.permitStatus.push("hasdealcount");
              }
              if(item.action_route=="Sales_hassay"){
                $this.permitStatus.push("hassaycount");
              }
            });
            if($this.menuButtonPermit.includes('Sales_index')&&$this.permitStatus.length>0){              
              if($this.$route.query.Status){
                if($this.permitStatus.includes($this.$route.query.Status)){
                  $this.currentStatus = $this.$route.query.Status;
                  $this.initPage();
                }else{
                  $this.$router.push({path:'/Sales/index',query:{Status:$this.permitStatus[0]}});
                }
              }else{
                  $this.$message({
                      showClose: true,
                      message: "未找到对应页面或页面缺失参数",
                      type: 'error',
                      duration:6000
                  });
                  $this.$router.push({path:`/404?redirect=${$this.$router.currentRoute.fullPath}`});
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
    // 页面自跳转
    jumpLink(status){
        var $this = this;
        $this.DataEmpty();
        if($this.currentStatus==status){
          $this.initPage();
        }else{
          $this.$router.push({path:'/Sales/index',query:{Status:status}});
        }
    },
    // 跳转数据分析页面
    dataStatistic(){
      var $this = this;
      if($this.device==="desktop"){
        var routeUrl = $this.$router.resolve({path:'/Sales/search'});
        window.open(routeUrl.href,'_blank');
      }else{
        $this.$router.push({path:'/Sales/search'});
      }
    },
    // 跳转数据统计页面
    datastatisticClues(){
      var $this = this;
      if($this.device==="desktop"){
        var routeUrl = $this.$router.resolve({path:'/Sales/phonecount'});
        window.open(routeUrl.href,'_blank');
      }else{
        $this.$router.push({path:'/Sales/phonecount'});
      }
    },
    // 每页显示条数改变事件
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.searchData.limit = val;
      this.initPage();
    },
    // 当前页改变事件
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.searchData.page = val;
      this.initPage();
    },
    // 反馈点击事件
    feedbackClick(){
      var $this = this;
      var feedbackArr = $this.feedbackArr;
      if(feedbackArr.length > 0){
        if (feedbackArr.length > 1) {
          feedbackArr.shift();
          $this.feedbackArr = feedbackArr;
          $this.searchData.feedback = $this.feedbackArr.toString();
        }else{
          $this.searchData.feedback = $this.feedbackArr.toString();
        }
      }else{
        $this.searchData.feedback = '';
      }
    },
    // 修改询盘
    editTableRow(row,index,num){
      var $this = this;
      var routeUrl =  $this.$router.resolve({path:'/Sales/phoneinfosub',query:{ID:row.id,status:num}});
      window.open(routeUrl.href,'_blank');
    },
    // 表格多选改变事件
    handleSelectionChange(val) {
        var $this = this;
        $this.selectedData = val;
        if($this.selectedData.length>0){
          $this.isTableRow = false;
        }else{
          $this.isTableRow = true;
        }
    },
    // 分配撤回表格行
    deleteTableRow(row,index){
      var $this = this;
      var resultData={};
      resultData.ids = [];
      if($this.selectedData.length>0){
          $this.selectedData.forEach(function(item,index){
              resultData.ids.push(item.id);
          });
      }
      $this.$store.dispatch('Sales/getSalesWithdrawDistribuSalesmanAction', resultData).then(response=>{
          var $this = this;
          if(response){
            if(response.status){
              $this.initPage();
            }else{
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
              });
            }
          }
      });
    },
    // 批量分配
    DetermineTableRow(row,index){
      var $this = this;
      var ids = [];
      if($this.selectedData.length>0){
          $this.selectedData.forEach(function(item,index){
              ids.push(item.id);
          });
      }
      $this.Determine.ids=ids;
      $this.$store.dispatch('Sales/getSalesDistribuSalesmanAction', $this.Determine).then(response=>{
          var $this = this;
          if(response){
            if(response.status){
              console.log(response,"确定分配-response");
              $this.initPage();
            }else{
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
              });
            }
          }
      });
    },
    // 高级筛选
    searchDialog(){
      var $this = this;
      $this.openClass=!$this.openClass;
    },
    // 比较两个时间的先后
    compareDate(date1,date2){
      var oDate1 = new Date(date1);
      var oDate2 = new Date(date2);
      if(oDate1.getTime() > oDate2.getTime()){
          return false;
      }else{
          return true;
      }
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
