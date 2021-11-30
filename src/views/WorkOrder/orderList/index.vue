<template>
    <div class="page-root flex-box no-padding work-order-index" ref="boxPane">
        <div class="flex-content relative">
            <div class="abs-panel" ref="mainPane">
                <div class="scroll-panel" ref="scrollDom" style="will-change:scroll-position">
                  <div class="true-height" ref="scrollPane">
                    <p class="breadcrumb" ref="breadcrumbPane">
                      <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
                      <template v-for="item in breadcrumbList">
                        <router-link class="breadcrumb-link" :to="item.router+'?Status=alltasks'" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
                        <span class="breadcrumb-link" v-bind:key="item.id" v-else><b>-</b><span>{{item.title}}</span></span>
                      </template>
                        <span class="breadcrumb-link"><b>-</b>{{breadcrumbName}}</span>
                    </p>
                    <el-card class="box-card scroll-card" shadow="hover">
                        <div slot="header">
                            <div class="card-header" ref="headerPane">
                                <dl class="search-orderOne">
                                    <dd v-if="menuButtonPermit.includes('Worksaccpet_allaccpetwork')" v-on:click="jumpLink('alltasks')" v-bind:class="currentStatus === 'alltasks'?'active':''"><span>全部任务<b>[{{defaultData.accpetcountNum}}]</b></span></dd>
                                    <dd v-if="menuButtonPermit.includes('Worksaccpet_personwork')" v-on:click="jumpLink('person')" v-bind:class="currentStatus === 'person'?'active':''"><span>我的任务<b>[{{defaultData.personNum}}]</b></span></dd>
                                    <dd v-if="menuButtonPermit.includes('Worksaccpet_myfocuswork')" v-on:click="jumpLink('focuson')" v-bind:class="currentStatus === 'focuson'?'active':''"><span>我的关注<b>[{{defaultData.focusonNum}}]</b></span></dd>                                  
                                    <dd v-if="menuButtonPermit.includes('Worksaccpet_waitwork')" v-on:click="jumpLink('receive')" v-bind:class="currentStatus === 'receive'?'active':''"><span>待接收<b>({{defaultData.receiveNum}})</b></span></dd>
                                    <dt class="search-orderOneFr" v-if="menuButtonPermit.includes('Worksaccpet_workcount')" v-bind:class="currentStatus === 'stat'?'active':''" v-on:click="jumpLink('stat')">
                                    <i class="svg-i"><svg-icon icon-class="workOrder_data" /></i>
                                    <span>数据统计</span>
                                    </dt>
                                </dl>
                                <div class="search-orderTwo flex-wrap" v-if="currentStatus=='alltasks'||currentStatus=='focuson'||currentStatus=='person'">
                                     <span>工单状态</span>
                                     <ul class="flex-content">
                                        <li v-on:click="hanldeworkstatus(item.id)" :class="item.departBool?'active':''" v-if="item.orderStatusBool" v-for="(item,index) in workstatusArr" :key="index"><span>{{item.name}}<b v-if='item.name!="全部"'>[{{item.departNum}}]</b></span></li>
                                     </ul>
                                </div>
                                <div class="search-orderTwo flex-wrap" v-if="currentStatus=='alltasks'||currentStatus=='focuson'||currentStatus=='person'">
                                     <span>部门分类</span>
                                     <ul class="flex-content">
                                        <li v-on:click="hanldeshdepart(item.id)" :class="item.departBool?'active':''" v-for="(item,index) in shdepart" :key="index"><span>{{item.name}}</span></li>
                                     </ul>
                                </div>
                                <div class="search-orderThree flex-wrap" v-if="currentStatus=='alltasks'||currentStatus=='focuson'||currentStatus=='person'||currentStatus=='stat'">
                                    <ul class="search-orderThree-Tag" v-if="currentStatus!='stat'">
                                        <li v-for="item in tagList" :key="item.value" :style="{color:item.namecolor}" v-on:click="hanldetag(item.value)" :class="item.departBool?'active':''">
                                            <i v-if="item.clBool" class="svg-i"><svg-icon icon-class="workOrder_bell" /></i>
                                            {{item.label}}
                                            <i class="workBg" :style="{background:item.namecolor,borderColor:item.namecolor}"></i>
                                        </li>
                                    </ul>
                                    <div class="search-wrap flex-content">
                                        <div class="item-search" style="width:150px;"  v-if="currentStatus!='stat'">
                                            <el-select @change="hanldeCustom()" v-model="searchtagListCustom" size="small" clearable placeholder="自定义标签">
                                                <el-option
                                                    v-for="item in tagListCustom"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </div>
                                        <div class="item-search" style="width:150px;" v-if="currentStatus!='stat'">
                                            <el-select @change="hanldetimeType()" v-model="searchData.timetype" size="small" clearable placeholder="请选择时间类型">
                                                <el-option
                                                    v-for="item in timeTypeList"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </div>
                                        <div class="item-search" style="width: 240px;">
                                          <el-date-picker
                                              v-model="searchData.date"
                                              class="date-range"
                                              type="daterange"
                                              align="right"
                                              value-format = "yyyy-MM-dd"
                                              unlink-panels
                                              range-separator="至"
                                              start-placeholder="开始日期"
                                              end-placeholder="结束日期"
                                               @change="hanldetime()"
                                              size="small"
                                              :picker-options="pickerRangeOptions">
                                          </el-date-picker>
                                        </div>
                                        <div class="item-search" style="width: 120px;" v-if="currentStatus=='alltasks'&&currentId!=7">
                                          <el-select @change="hanldedealuser()" v-model="searchData.dealuserid" size="small" filterable clearable placeholder="负责人"
                                          :class="searchData.dealuserid!=''?'el-xzstate':''">
                                              <el-option
                                                  v-for="item in userList"
                                                  :key="item.value"
                                                  :label="item.label"
                                                  :value="item.value">
                                              </el-option>
                                          </el-select>
                                        </div>
                                        <div class="item-search"><span class="resetBtn" v-on:click="resetData()">全部重置</span></div>
                                    </div>
                                </div>
                                <div class="clues-info flex-wrap" v-if="currentStatus=='alltasks'||currentStatus=='stat'">
                                    <div class="clues-infoFl flex-content">
                                          <p>
                                            <span v-for="(item,index) in groupScore" :key='index'>
                                            <strong>{{item.name}}</strong>本月接收总分<strong  class="color1">{{item.monthaccpetscore}}</strong>，本月获得总分<strong  class="color2">{{item.monthfinishscore}}</strong>，上月接收总分<strong  class="color1">{{item.lastmonthaccpetscore}}</strong>，上月获得总分<strong  class="color2">{{item.lastmonthfinishscore}}</strong>
                                            </span>
                                          </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-content" ref="tableContent">
                            <div class="table-wrapper" v-bind:class="scrollPosition.isFixed?'fixed-table':''">
                                  <div class="table-mask"></div>
                                  <el-table
                                      ref="simpleTable"
                                      key="a"
                                      :data="tableData"
                                      tooltip-effect="dark"
                                      stripe
                                      show-summary
                                      class="SiteTable"
                                      style="width: 100%"
                                      :style="'min-height:'+minHeight+'px;'"
                                      row-key="id"
                                      v-if="currentStatus=='stat'"
                                      >
                                      <el-table-column
                                          prop="name"
                                          label="姓名"
                                          width="100">
                                      </el-table-column>
                                      <el-table-column
                                          prop="depart"
                                          align="left"
                                          label="部门"
                                          width="150"
                                          >
                                      </el-table-column>
                                      <el-table-column
                                          prop="departgroup"
                                          align="left"
                                          label="小组"
                                          width="150"
                                          >
                                      </el-table-column>
                                      <el-table-column
                                          prop="workingcount"
                                          label="进行中工单数"
                                          min-width="150"
                                          >
                                      </el-table-column>
                                      <el-table-column
                                          prop="finishcount"
                                          label="已完成工单数"
                                          min-width="150"
                                          >
                                      </el-table-column>
                                      <el-table-column
                                          prop="outtimecount"
                                          label="已逾期工单数"
                                          min-width="150"
                                          >
                                      </el-table-column>
                                      <el-table-column
                                          prop="allcount"
                                          label="总工单数"
                                          min-width="150"
                                          >
                                      </el-table-column>
                                      <el-table-column
                                          prop="hasscore"
                                          label="已获得积分"
                                          min-width="120"
                                          >
                                      </el-table-column>
                                      <el-table-column
                                          prop="monthscore"
                                          label="本月已获得积分"
                                          min-width="120"
                                          >
                                      </el-table-column>
                                      <el-table-column
                                          prop="allscorre"
                                          label="总积分"
                                          min-width="120"
                                          >
                                      </el-table-column>
                                  </el-table>
                                  <el-table
                                      ref="simpleTable"
                                      key="b"
                                      :data="tableData"
                                      tooltip-effect="dark"
                                      stripe
                                      class="SiteTable"
                                      style="width: 100%"
                                      :style="'min-height:'+minHeight+'px;'"
                                      row-key="id"
                                      v-if="currentStatus=='receive'"
                                      >
                                      <el-table-column
                                          prop="username"
                                          align="center"
                                          label="发布人"
                                          width="100">
                                      </el-table-column>
                                      <el-table-column
                                          prop="title"
                                          label="工单标题"
                                          min-width="200"
                                          >
                                          <template slot-scope="scope">
                                            <div class="order-title">
                                              <span v-on:click="jumpArticle(scope.row.id)">{{scope.row.title}}</span>
                                              <el-tooltip class="toolCancel" effect="dark" content="取消关注" placement="top" v-if="(currentStatus=='focuson'||scope.row.focus==1)&&menuButtonPermit.includes('Worksaccpet_workfocuscancel')"><el-button v-on:click="handleCancelFocus(scope.row.id)" class="svg-i"><svg-icon icon-class="workOrder_starSolid" /></el-button></el-tooltip>
                                              <el-tooltip class="toolFocus" effect="dark" content="关注任务" placement="top" v-if="scope.row.focus==0&&menuButtonPermit.includes('Worksaccpet_workfocus')"><el-button v-on:click="handleAddFocus(scope.row.id)" class="svg-i"><svg-icon icon-class="workOrder_starHollow" /></el-button></el-tooltip>
                                            </div>
                                          </template>
                                      </el-table-column>
                                      <el-table-column
                                          prop="status"
                                          label="工单状态"
                                          width="90"
                                          >
                                          <template slot-scope="scope">
                                            <div class="table-tag starts">
                                              <span v-if="(scope.row.timestatus==2||scope.row.worktimestatus==2)&&scope.row.workstatus==3">
                                                  <el-tooltip class="item color5" effect="dark" :content="scope.row.confirmchecktime" placement="right">
                                                    <el-button><i class="svg-i"><svg-icon icon-class="work_done" /></i>已完成(<span class="color6"><i class="svg-i"><svg-icon icon-class="work_overdue" /></i>已逾期</span>)</el-button>
                                                  </el-tooltip>
                                              </span>   
                                              <span class="color6" v-if="(scope.row.timestatus==2||scope.row.worktimestatus==2)&&scope.row.workstatus!=3"><i class="svg-i"><svg-icon icon-class="work_overdue" /></i>已逾期</span>
                                              <span class="color1" v-if="scope.row.worktimestatus!=2&&currentStatus == 'receive'"><i class="svg-i"><svg-icon icon-class="work_accept" /></i>待接单</span>
                                            </div>
                                          </template>
                                      </el-table-column>
                                      <el-table-column
                                          prop="tags"
                                          align="left"
                                          label="标签"
                                          min-width="160"
                                          >                                          
                                          <template slot-scope="scope">
                                              <div class="table-tag">
                                              <el-tag v-for="(item,index) in scope.row.tagList" :style="{background:'none',borderColor:'none',color:item.color}" size="small" v-bind:key="index"><i v-if="item.clBool" class="svg-i"><svg-icon icon-class="workOrder_bell" /></i>{{item.tag}}<i class="workBg" :style="{background:item.color,borderColor:item.color}"></i></el-tag>
                                              </div>
                                          </template>
                                      </el-table-column>
                                      <el-table-column
                                          prop="starttime"
                                          sortable
                                          label="开始时间"
                                          min-width="110"
                                          >
                                          <template slot-scope="scope">
                                              <p class="timenewline">{{scope.row.starttimeDate}}<span>{{scope.row.starttimeTime}}</span></p>
                                          </template>
                                      </el-table-column>
                                      <el-table-column
                                          prop="endtime"
                                          sortable
                                          label="截止时间"
                                          min-width="110"
                                          >
                                          <template slot-scope="scope">
                                              <p class="timenewline">{{scope.row.endtimeDate}}<span>{{scope.row.endtimeTime}}</span></p>
                                          </template>
                                      </el-table-column>
                                      <el-table-column
                                          prop="orgscore"
                                          label="总积分"
                                          width="80"
                                          >
                                      </el-table-column>
                                      <el-table-column
                                          prop="receivescore"
                                          label="已认领积分"
                                          width="100"
                                          >
                                          <template slot-scope="scope">
                                              <span>{{scope.row.receivescore}}</span>
                                          </template>
                                      </el-table-column>
                                      <el-table-column
                                          prop="ownScore"
                                          label="认领积分"
                                          width="90">
                                          <template slot-scope="scope">
                                              <div class="table-input">
                                                  <el-input size="small" v-model="scope.row.ownScore"></el-input>
                                              </div>
                                          </template>
                                      </el-table-column> 
                                      <el-table-column
                                          v-if="menuButtonPermit.includes('Worksaccpet_confirmwork')&&currentStatus=='receive'"
                                          :width="operationsWidth"
                                          align="center"
                                          fixed="right"
                                          prop="operations"
                                          label="操作">
                                          <template slot-scope="scope">
                                            <div class="table-button">
                                                <el-button size="mini" @click="receiveTableRow(scope.row,scope.$index)" v-if="currentStatus=='receive'&&menuButtonPermit.includes('Worksaccpet_confirmwork')">认领工单</el-button>
                                            </div>
                                          </template>
                                      </el-table-column>
                                  </el-table>                                  
                                  <el-table
                                      ref="simpleTable"
                                      :key="certinfoKey"
                                      :data="tableData"
                                      tooltip-effect="dark"
                                      stripe
                                      class="SiteTable"
                                      style="width: 100%"
                                      :style="'min-height:'+minHeight+'px;'"
                                      v-if="currentStatus=='alltasks'||currentStatus=='person'||currentStatus=='focuson'"
                                      >
                                      <el-table-column
                                          prop="username"
                                          align="center"
                                          label="发布人"
                                          v-if="labelColumn[0].isshow"
                                          width="100">
                                      </el-table-column>
                                      <el-table-column
                                          prop="title"
                                          label="工单标题"
                                          min-width="200"
                                          v-if="labelColumn[1].isshow"
                                          >
                                          <template slot-scope="scope">
                                            <div class="order-title">
                                              <span v-on:click="jumpArticle(scope.row.id)">{{scope.row.title}}</span>
                                              <el-tooltip class="toolCancel" effect="dark" content="取消关注" placement="top" v-if="(currentStatus=='focuson'||scope.row.focus==1)&&menuButtonPermit.includes('Worksaccpet_workfocuscancel')"><el-button v-on:click="handleCancelFocus(scope.row.id)" class="svg-i"><svg-icon icon-class="workOrder_starSolid" /></el-button></el-tooltip>
                                              <el-tooltip class="toolFocus" effect="dark" content="关注任务" placement="top" v-if="scope.row.focus==0&&menuButtonPermit.includes('Worksaccpet_workfocus')"><el-button v-on:click="handleAddFocus(scope.row.id)" class="svg-i"><svg-icon icon-class="workOrder_starHollow" /></el-button></el-tooltip>
                                            </div>
                                          </template>
                                      </el-table-column>
                                      <el-table-column
                                          prop="status"
                                          label="工单状态"
                                          width="90"
                                          v-if="labelColumn[4].isshow"
                                          >
                                          <template slot-scope="scope">
                                            <div class="table-tag starts">
                                              <span class="color1" v-if="!scope.row.startdotime&&(currentStatus == 'alltasks'||currentStatus == 'person'||currentStatus == 'focuson')&&currentId==6">待进行</span>  
                                              <span v-if="(scope.row.timestatus==2||scope.row.worktimestatus==2)&&scope.row.workstatus==3">
                                                  <el-tooltip class="item color5" effect="dark" :content="scope.row.confirmchecktime" placement="right">
                                                    <el-button><i class="svg-i"><svg-icon icon-class="work_done" /></i>已完成(<span class="color6"><i class="svg-i"><svg-icon icon-class="work_overdue" /></i>已逾期</span>)</el-button>
                                                  </el-tooltip>
                                              </span>   
                                              <span class="color6" v-if="(scope.row.timestatus==2||scope.row.worktimestatus==2)&&scope.row.workstatus!=3"><i class="svg-i"><svg-icon icon-class="work_overdue" /></i>已逾期</span>
                                              <span class="color1" v-if="scope.row.worktimestatus!=2&&currentStatus == 'alltasks'&&currentId==7"><i class="svg-i"><svg-icon icon-class="work_allot" /></i>待分配</span>                                              
                                              <span class="color2" v-if="scope.row.worktimestatus!=2&&currentId!=7&&scope.row.workstatus==0&&scope.row.startdotime"><i class="svg-i"><svg-icon icon-class="work_doing" /></i>进行中</span>
                                              <span class="color2" v-if="scope.row.worktimestatus!=2&&currentId!=7&&scope.row.workstatus==1"><i class="svg-i"><svg-icon icon-class="work_accept" /></i>待审核</span>
                                              <span v-if="scope.row.worktimestatus!=2&&currentId!=7&&scope.row.workstatus==2">
                                                  <el-tooltip class="item color3" effect="dark" :content="scope.row.rejectinfo" placement="right">
                                                    <el-button><i class="svg-i"><svg-icon icon-class="work_reject" /></i>已驳回</el-button>
                                                  </el-tooltip>
                                              </span>
                                              <span class="color4" v-if="scope.row.worktimestatus!=2&&currentId!=7&&scope.row.workstatus==3&&scope.row.commentstatus==0"><i class="svg-i"><svg-icon icon-class="work_evaluate" /></i>待评价</span>
                                              <span v-if="scope.row.worktimestatus!=2&&currentId!=7&&scope.row.workstatus==3&&scope.row.commentstatus!=0">
                                                  <el-tooltip class="item color5" effect="dark" :content="scope.row.confirmchecktime" placement="right">
                                                    <el-button><i class="svg-i"><svg-icon icon-class="work_done" /></i>已完成</el-button>
                                                  </el-tooltip>
                                              </span>
                                            </div>
                                          </template>
                                      </el-table-column>
                                      <el-table-column
                                          prop="percenter"
                                          label="进度"
                                          width="180"
                                          v-if="(currentId==6||currentId==5)&&labelColumn[2].isshow">
                                          <template slot-scope="scope">
                                              <div class="table-input">
                                                  <el-input v-if="currentStatus=='person'&&currentId==5" size="small" @change="changePercenter(scope.row.id,scope.row.percenter)" v-model="scope.row.percenter"></el-input>
                                                  <p v-else><span><i :style="'width:'+scope.row.percenter+'%'"></i></span>{{scope.row.percenter}}%</p>
                                              </div>
                                          </template>
                                      </el-table-column>
                                      <el-table-column
                                          prop="ownScore"
                                          label="负责人"
                                          v-if="labelColumn[6].isshow"
                                          width="120">
                                          <template slot-scope="scope">
                                              <div class="table-input">
                                                  <el-select v-model="scope.row.dealuserid" size="small" v-if="(!scope.row.dealusername||scope.row.dealusername=='')&&currentId==7" clearable multiple collapse-tags placeholder="负责人">
                                                      <el-option
                                                          v-for="item in userList"
                                                          :key="item.value"
                                                          :label="item.label"
                                                          :value="item.value">
                                                      </el-option>
                                                  </el-select>
                                                  <span v-else>{{scope.row.dealusername}}</span>
                                              </div>
                                          </template>
                                      </el-table-column>
                                      <el-table-column
                                          prop="orgscore"
                                          label="总积分"
                                          width="80"
                                          v-if="labelColumn[5].isshow"
                                          >
                                      </el-table-column>
                                      <el-table-column
                                          prop="tags"
                                          align="left"
                                          label="标签"
                                          min-width="160"
                                          v-if="labelColumn[7].isshow"
                                          >
                                          <template slot-scope="scope">
                                              <div class="table-tag">
                                              <el-tag v-for="(item,index) in scope.row.tagList" :style="{background:'none',borderColor:'none',color:item.color}" size="small" v-bind:key="index"><i v-if="item.clBool" class="svg-i"><svg-icon icon-class="workOrder_bell" /></i>{{item.tag}}<i class="workBg" :style="{background:item.color,borderColor:item.color}"></i></el-tag>
                                              </div>
                                          </template>
                                      </el-table-column>
                                      <el-table-column
                                          prop="startdotime"
                                          sortable
                                          label="开工时间"
                                          min-width="110"
                                          v-if="labelColumn[8].isshow"
                                          >
                                          <template slot-scope="scope">
                                              <p class="timenewline">{{scope.row.startdotimeDate}}<span>{{scope.row.startdotimeTime}}</span></p>
                                          </template>
                                      </el-table-column>
                                      <el-table-column
                                          prop="starttime"
                                          sortable
                                          label="开始时间"
                                          min-width="110"
                                          v-if="labelColumn[9].isshow"
                                          >
                                          <template slot-scope="scope">
                                              <p class="timenewline">{{scope.row.starttimeDate}}<span>{{scope.row.starttimeTime}}</span></p>
                                          </template>
                                      </el-table-column>
                                      <el-table-column
                                          prop="endtime"
                                          sortable
                                          label="截止时间"
                                          min-width="110"
                                          v-if="labelColumn[3].isshow"
                                          >
                                          <template slot-scope="scope">
                                              <p class="timenewline">{{scope.row.endtimeDate}}<span>{{scope.row.endtimeTime}}</span></p>
                                          </template>
                                      </el-table-column>
                                      <el-table-column
                                          prop="receivescore"
                                          label="已认领积分"
                                          width="100"
                                          v-if="labelColumn[10].isshow"
                                          >
                                          <template slot-scope="scope">
                                              <p v-if="currentStatus=='alltasks'&&currentId==6"><el-input size="small" v-model="scope.row.score" @change="changeScore(scope.row,scope.$index)"></el-input></p>
                                              <span v-else>{{scope.row.score}}</span>
                                          </template>
                                      </el-table-column>
                                      <el-table-column
                                          v-if="menuButtonPermit.includes('Worksaccpet_backwork')||menuButtonPermit.includes('Worksaccpet_confirmdeal')||menuButtonPermit.includes('Worksaccpet_confirmstart')||menuButtonPermit.includes('Worksaccpet_confirmfinish')||menuButtonPermit.includes('Worksaccpet_workcancel')"
                                          :width="operationsWidth"
                                          align="center"
                                          fixed="right"
                                          prop="operations"
                                          label-class-name="workIconleaf"
                                          label="操作">        
                                          <template slot="header" slot-scope="scope">
                                             <div class="temHeader">
                                                  <span class="temHeaderFl">操作</span>
                                                  <span class="temHeaderFr" @click="toggleBtn"></span>
                                                  <div class="temHeaderfix" :class="screen.screenBtn?'active':''">
                                                      <div class="temHeaderfixTop">
                                                          <p @click="temHeaderhandle(item.id)" class="temHeader-checkbox"  v-bind:class="[item.istrue?'active':'',item.isDispaly?'is-disabled':'']" v-for="(item,index) in labelColumn" :key="index"><i></i><span>{{item.name}}</span></p>
                                                      </div>
                                                      <p class="temHeaderBom"><span @click="filterHandler" >筛选</span><span @click="resetHandler">重置</span></p>
                                                  </div>
                                             </div>
                                          </template>                       
                                          <template slot-scope="scope">
                                            <div class="table-button">
                                                <el-button size="mini" @click="confirmAllotTableRow(scope.row,scope.$index)" v-if="currentStatus=='alltasks'&&currentId==7&&menuButtonPermit.includes('Worksaccpet_confirmdeal')">分配</el-button>
                                                <el-button size="mini" @click="confirmstartRow(scope.row,scope.$index)" v-if="currentId==6&&(scope.row.startdotime==''||scope.row.startdotime==null)&&menuButtonPermit.includes('Worksaccpet_confirmstart')">开始</el-button>
                                                <el-button size="mini" @click="confirmDoneTableRow(scope.row,scope.$index)" v-if="currentId==5&&scope.row.workstatus!=1&&scope.row.workstatus!=3&&(scope.row.status==2||scope.row.status==5)&&menuButtonPermit.includes('Worksaccpet_confirmfinish')">审核</el-button>
                                                <el-button size="mini" @click="cancelTableRow(scope.row,scope.$index)" v-if="currentStatus!='receive'&&(scope.row.workstatus!=1&&scope.row.workstatus!=3)&&menuButtonPermit.includes('Worksaccpet_backwork')">退回</el-button>
                                                <el-button size="mini" @click="undoTableRow(scope.row,scope.$index)" v-if="currentId==6&&scope.row.workstatus!=1&&scope.row.workstatus!=3&&menuButtonPermit.includes('Worksaccpet_workcancel')">撤销</el-button>
                                            </div>
                                          </template>
                                      </el-table-column>
                                  </el-table>
                            </div>
                            <div class="out_box fixed" v-if="scrollPosition.maxScrollWidth>0&&scrollPosition.isPC" :style="'left:'+scrollPosition.left+'px;width:'+scrollPosition.width+'px;bottom:'+scrollPosition.fixedBottom+'px;'" ref="out_box">
                                <div class="in_box" @mousedown="mouseDownHandler" :style="'left:'+scrollPosition.insetLeft+'px;width:'+scrollPosition.insetWidth+'px;'" ref="in_box" ></div>
                            </div>
                        </div>
                        <div v-if="totalDataNum>50" class="pagination-panel" ref="pagePane">
                            <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="searchData.page"
                                :page-sizes="pageSizeList"
                                :page-size="searchData.limit"
                                :layout="'total, sizes, prev, pager, next, jumper'"
                                :total="totalDataNum">
                            </el-pagination>
                        </div>
                    </el-card>
                  </div>
                  <el-backtop target=".scroll-panel"></el-backtop>
                </div>
            </div>
            <el-backtop target=".scroll-panel"></el-backtop>    
            <el-dialog :title="dialogText" v-if="menuButtonPermit.includes('Worksaccpet_personwork')" custom-class="add-edit-dialog" :visible.sync="dialogFormVisible" :before-close="handleClose" width="480px">
              <el-form :model="dialogForm">
                <div class="item-form">
                    <el-radio-group class="team-list" v-model="dialogForm.status" size="mini">
                        <el-radio class="item-radio" label="1" border>是</el-radio>
                        <el-radio class="item-radio" label="2" border>否</el-radio>
                    </el-radio-group>
                </div>
              </el-form>              
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="handleClose">取 消</el-button>
                  <el-button type="primary" :class="isSaveData?'isDisabled':''" :disabled="isSaveData" @click="saveData">确 定</el-button>
                </span>
              </template>
            </el-dialog>        
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { isNumber } from '@/utils/validate';
export default {
  name: 'WorkOrder_orderList',
  data() {
    return {
        certinfoKey:true,//解决数据更新后表体不渲染问题
        dialogFormVisible:false,
        dialogText:"",
        formLabelWidth:"110px",
        dialogForm:{
          id:0,
          status:"1",
        },
        tagList:[],// 获取系统标签数据
        tagListCustom:[],// 获取系统自定义标签数据
        searchtagListCustom:'',
        shdepart:[],
        showHide:{
        },
        screen:{
          screenBtn:false,
          screenId:[],
        },
        labelColumn:[
          {id:0,name:"发布人",istrue:true,isshow:true,isDispaly:true},
          {id:1,name:"工单标题",istrue:true,isshow:true,isDispaly:true},
          {id:3,name:"进度",istrue:true,isshow:true,isDispaly:true},
          {id:6,name:"截止时间",istrue:true,isshow:true,isDispaly:true},
          {id:7,name:"工单状态",istrue:true,isshow:true,isDispaly:true},
          {id:8,name:"总积分",istrue:true,isshow:true,isDispaly:true},
          {id:11,name:"负责人",istrue:true,isshow:true,isDispaly:true},
          {id:2,name:"标签",istrue:false,isshow:false,isDispaly:false},
          {id:4,name:"开工时间",istrue:false,isshow:false,isDispaly:false},
          {id:5,name:"开始时间",istrue:false,isshow:false,isDispaly:false},
          {id:9,name:"已认领积分",istrue:false,isshow:false,isDispaly:false},
          {id:10,name:"认领积分",istrue:false,isshow:false,isDispaly:false},
        ],
        currentId:0,
        workstatusArr:[
          {id:0,name:"全部",departBool:true,orderStatusBool:true},
          {id:7,name:"待分配",departBool:false,orderStatusBool:true,departNum:0},
          {id:6,name:"已分配",departBool:false,orderStatusBool:true,departNum:0},
          {id:5,name:"进行中",departBool:false,orderStatusBool:true,departNum:0},
          {id:3,name:"已完成",departBool:false,orderStatusBool:true,departNum:0},
          {id:4,name:"已逾期",departBool:false,orderStatusBool:true,departNum:0},
          {id:2,name:"已驳回",departBool:false,orderStatusBool:true,departNum:0},
          {id:1,name:"待审核",departBool:false,orderStatusBool:true,departNum:0},
        ],
        breadcrumbList:[],
        breadcrumbName:'我的任务',
        operationsWidth:"",
        currentStatus:"alltasks",
        status:1,
        menuButtonPermit:[],
        minHeight:"auto",
        tableData:[],
        statData:[],
        groupScore:[],
        isPageBtn:false,
        pageSizeList:[50, 100, 150, 200],
        totalDataNum:0,
        userList:[],
        searchData:{
            page:1,
            limit:50,
            date:[],
            timetype:"",
        },
        timeTypeList:[
          {label:"按完成时间",value:3},
          {label:"按接单时间",value:2},
          {label:"按分配时间",value:1},
        ],
        defaultData:{
          accpetcountNum:0,
          receiveNum:0,
          personNum:0,
          focusonNum:0,
        },
        selectedData:[],
        permitStatus:[],
        pickerRangeOptions: this.$pickerRangeOptions,
        scrollPosition:{
          width:0,
          left:0,
          fixedBottom: 15,
          insetWidth:0,
          oldInsetLeft:0,
          insetLeft:0,
          ratio:0,
          startPageX:0,
          maxScrollWidth:0,
          isMouseDown:false,
          isPC:true,
          isFixed:false,
        },
        scrollTable:{
          scrollDom:null,
          tableHeaderFixedDom:null,
          tableFixedRightDom:null,
          fixedTopHeight:0,
          tableheaderHeight:0,
          fixedRightWidth:0,
          tableBottom:0,
          clientHeight:0,
        },
        isLoading:null,
        isDisabled:false,
        isSaveData:false,
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'sidebar',
      'menuData'
    ]),
    isOpen() {
      return this.sidebar.opened;
    },
  },
  mounted(){
    const $this = this;
    // 监听竖向滚动条滚动事件
    window.addEventListener('scroll',$this.handleScroll,true);
    $this.$nextTick(function () {
        this.setHeight();
    });
    window.onresize = () => {
        return (() => {
            this.setHeight();
        })()
    }
  },
  watch: {
    minHeight(val) {
      if (!this.timer) {
        this.minHeight = val
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
        $this.initData();
    },
    isOpen(e){
      this.setHeight();
    },
  },
  created(){
    var $this = this;
    $this.getBreadcrumbList();
    $this.initData();
  },
  updated(){
    var $this = this;
    $this.$nextTick(() => {
      $this.$refs.simpleTable.doLayout();
    });
  },
  destroyed(){
    window.removeEventListener('scroll', this.handleScroll,true);//监听页面滚动事件
  },
  methods:{
    // loading自定义
    loadingFun(){
      var $this = this;
      $this.isLoading = $this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
        zindex:999
      });
    },
    // 获取面包屑路径
    getBreadcrumbList(){
      var $this = this;
      var breadcrumbList = [];
      var currentID = ""+$this.$router.currentRoute.meta.id;
      var pageID = 0;
      if(currentID.indexOf('-')!=-1){
        pageID = parseInt(currentID.split("-")[1]);
      }else{
        pageID = parseInt(currentID);
      }
      $this.menuData.forEach(function(item,index){
        if(item.meta.id == pageID){
          var itemData = {};
          itemData.id = item.meta.id;
          itemData.router = item.path;
          itemData.title = item.meta.title;
          breadcrumbList.push(itemData);
        }else{
          if(item.children.length>0){
            item.children.forEach(function(item1,index1){
              if(item1.meta.id == pageID){
                var itemData = {};
                itemData.id = item.meta.id;
                itemData.router = item.path;
                itemData.title = item.meta.title;
                breadcrumbList.push(itemData);
                var itemData2 = {};
                itemData2.id = item1.meta.id;
                itemData2.router = item1.path;
                itemData2.title = item1.meta.title;
                breadcrumbList.push(itemData2);
              }else{
                if(item1.children.length>0){
                  item1.children.forEach(function(item2,index2){
                    if(item2.meta.id == pageID){
                      var itemData = {};
                      itemData.id = item.meta.id;
                      itemData.router = item.path;
                      itemData.title = item.meta.title;
                      breadcrumbList.push(itemData);
                      var itemData2 = {};
                      itemData2.id = item1.meta.id;
                      itemData2.router = item1.path;
                      itemData2.title = item1.meta.title;
                      breadcrumbList.push(itemData2);
                      var itemData3 = {};
                      itemData3.id = item2.meta.id;
                      itemData3.router = item2.path;
                      itemData3.title = item2.meta.title;
                      breadcrumbList.push(itemData3);
                    }
                  });
                }
              }
            });
          }
        }
      });
      $this.breadcrumbList = breadcrumbList;
    },
    // 判断浏览器类型
    getBrowserType(){
      var ua =  navigator.userAgent;
      if(ua){
        if(ua.indexOf('Mobile')!=-1){
          this.scrollPosition.isPC = false;
        }else{
          this.scrollPosition.isPC = true;
        }
      }else{
        this.scrollPosition.isPC = true;
      }
    },
    // 设置table高度
    setHeight(){
      var $this = this;
      $this.minHeight = 0;
      var breadcrumbHeight = $this.$refs.breadcrumbPane.offsetHeight;
      var screenHeight = $this.$refs.boxPane.offsetHeight;
      if($this.$refs.headerPane){
        var headerHeight = $this.$refs.headerPane.offsetHeight+45;
        $this.minHeight = screenHeight-headerHeight-breadcrumbHeight-30;
      }else{
        $this.minHeight = screenHeight-breadcrumbHeight-30;
      } 
      $this.getBrowserType();
        setTimeout(function() {
          $this.setScrollDom();
      }, 400);
    },
    // 搜索结果
    searchResult(){
      var $this = this;
      if(!$this.isDisabled){
        $this.isDisabled=true;
        $this.loadingFun();
        $this.getCurrentStatusData();
      }
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.loadingFun();
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
              if(item.action_route=="Worksaccpet_allaccpetwork"){
                $this.permitStatus.push("alltasks");
              }
              if(item.action_route=="Worksaccpet_personwork"){
                $this.permitStatus.push("person");
              }
              if(item.action_route=="Worksaccpet_myfocuswork"){
                $this.permitStatus.push("focuson");
              }
              if(item.action_route=="Worksaccpet_waitwork"){
                $this.permitStatus.push("receive");
              }
              if(item.action_route=="Worksaccpet_workcount"){
                $this.permitStatus.push("stat");
              }
            });
            if($this.menuButtonPermit.includes('Worksaccpet_commoncount')&&$this.menuButtonPermit.includes('WorkOrder_orderList')&&$this.permitStatus.length>0){
              if($this.$route.query.Status){
                if($this.permitStatus.includes($this.$route.query.Status)){
                  $this.currentStatus = $this.$route.query.Status;
                  var operationsWidth = 22;
                  if($this.currentStatus=="alltasks"){
                      //if($this.menuButtonPermit.includes('Worksaccpet_backwork')){
                      //    operationsWidth+=56;
                      //}
                      //if($this.menuButtonPermit.includes('Worksaccpet_confirmdeal')){
                      //    operationsWidth+=56;
                      //}
                      //if($this.menuButtonPermit.includes('Worksaccpet_confirmstart')){
                      //    operationsWidth+=56;
                      //}
                      //if($this.menuButtonPermit.includes('Worksaccpet_confirmfinish')){
                      //    operationsWidth+=56;
                      //}
                      //if($this.menuButtonPermit.includes('Worksaccpet_workcancel')){
                      //    operationsWidth+=56;
                      //}
                      operationsWidth+=168;
                  }else if($this.currentStatus=="focuson"||$this.currentStatus=="person"){
                      if($this.menuButtonPermit.includes('Worksaccpet_backwork')){
                          operationsWidth+=56;
                      }
                      if($this.menuButtonPermit.includes('Worksaccpet_confirmfinish')){
                          operationsWidth+=56;
                      }
                      if($this.menuButtonPermit.includes('Worksaccpet_confirmstart')){
                          operationsWidth+=56;
                      }
                      if($this.menuButtonPermit.includes('Worksaccpet_workcancel')){
                          operationsWidth+=56;
                      }
                  }else if($this.currentStatus=="receive"){
                    if($this.menuButtonPermit.includes('Worksaccpet_confirmwork')){
                        operationsWidth+=90;
                    }
                  }
                  $this.operationsWidth = "" + operationsWidth;
                  $this.initPage();
                }else{
                  $this.$router.push({path:'/WorkOrder/orderList',query:{Status:$this.permitStatus[0]}});
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
    // 初始化页面信息——初始化工单状态
    initPage(){
      var $this = this;
      if($this.currentStatus=="alltasks"){
        $this.breadcrumbName='全部任务';
      }
      if($this.currentStatus=="person"){
        $this.breadcrumbName='我的任务';
      }
      if($this.currentStatus=="receive"){
        $this.breadcrumbName='待接收';
      }
      if($this.currentStatus=="focuson"){
        $this.breadcrumbName='我的关注';
      }
      if($this.currentStatus=="stat"){
        $this.breadcrumbName='数据统计';
      }
      $this.workstatusArr.forEach(function(item,index){
        if(item.id!=0){
          item.departNum=0;
        }
      });
      $this.defaultData.accpetcountNum=0;
      $this.defaultData.receiveNum=0;
      $this.defaultData.personNum=0;
      $this.defaultData.focusonNum=0;
      $this.$store.dispatch('worksaccpet/workOrderPublicDataAction', null).then(response=>{
        if(response){
          if(response.status){
            $this.defaultData.accpetcountNum = response.accpetcount;
            $this.defaultData.receiveNum = response.waitcount;
            $this.defaultData.personNum = response.personcount;
            $this.defaultData.focusonNum = response.focuscount;
            if($this.currentStatus=="alltasks"||$this.currentStatus=="person"||$this.currentStatus=="focuson"){                 
                if($this.currentStatus=='focuson'||$this.currentStatus=='person'){
                    $this.workstatusArr[1].orderStatusBool=false;
                }
                $this.workstatusArr[1].departNum=response.waitdealcount;
                $this.workstatusArr[2].departNum=response.hasdealcount;
                $this.workstatusArr[3].departNum=response.makeingcount;
                $this.workstatusArr[4].departNum=response.hasfinishcount;
                $this.workstatusArr[5].departNum=response.outtimecount;
                $this.workstatusArr[6].departNum=response.rejectedcount;
                $this.workstatusArr[7].departNum=response.waitcheckcount;
                $this.getpublishdepart();
            }
            if($this.currentStatus!="receive"&&$this.currentStatus!="stat"){
              $this.getWorkOrderUser();
            }else{
              $this.getCurrentStatusData();
            }
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
    // 获取当前状态分类的数据
    getCurrentStatusData(){
      var $this = this;
      var searchData = {};
      searchData = $this.initSearchData();
      if($this.currentStatus==="alltasks"||$this.currentStatus==="person"||$this.currentStatus==="focuson"){
        searchData.page = $this.isPageBtn?$this.searchData.page:1;
        if(!$this.isPageBtn){
          $this.searchData.page = 1
        }
        $this.isPageBtn = false;
      }
      var pathUrl = "";
      if($this.currentStatus==="alltasks"){
        pathUrl = "worksaccpet/allaccpetworkAction";
      }else if($this.currentStatus==="person"){
        pathUrl = "worksaccpet/personWorkOrderDataAction";
      }else if($this.currentStatus==="focuson"){
        pathUrl = "worksaccpet/getmyfocusworkAction";
      }else if($this.currentStatus==="receive"){
        pathUrl = "worksaccpet/receiveWorkOrderDataAction";
      }else{
        pathUrl = "worksaccpet/statWorkOrderDataAction";
      }
      $this.tableData=[];
      document.getElementsByClassName("scroll-panel")[0].scrollTop = 0;
      $this.$store.dispatch(pathUrl, searchData).then(response=>{
        if(response){
          if(response.status){
            var tableData = response.data;
            if($this.currentStatus==="stat"){
                $this.groupScore=response.group;
            }else{
              if(tableData.length>0){
                tableData.forEach(function(item,index){
                  item.ownScore = "";
                  item.tagList = [];
                  if(item.tags&&item.tags != ""){
                    if(item.tags.indexOf("|")!=-1){
                      var tagArr = item.tags.split("|");
                      tagArr.forEach(function(item1,index1){
                        var itemData = {};
                        if(item1.indexOf("-")!=-1){
                          itemData.tag = item1.split("-")[0];
                          itemData.color = item1.split("-")[1];
                          if(itemData.tag=='紧急'||itemData.tag=='加急'){
                            itemData.clBool=true;
                          }else{
                            itemData.clBool=false;
                          }
                        }else{
                          itemData.tag = item1;
                          itemData.color = "#1b3f75";
                          if(itemData.tag=='紧急'||itemData.tag=='加急'){
                            itemData.clBool=true;
                          }else{
                            itemData.clBool=false;
                          }
                        }
                        item.tagList.push(itemData);
                      });
                    }else{
                      var itemData = {};
                      if(item.tags.indexOf("-")!=-1){
                        itemData.tag = item.tags.split("-")[0];
                        itemData.color = item.tags.split("-")[1];
                        if(itemData.tag=='紧急'||itemData.tag=='加急'){
                          itemData.clBool=true;
                        }else{
                          itemData.clBool=false;
                        }
                      }else{
                        itemData.tag = item.tags;
                        itemData.color = "#1b3f75";
                        if(itemData.tag=='紧急'||itemData.tag=='加急'){
                          itemData.clBool=true;
                        }else{
                          itemData.clBool=false;
                        }
                      }
                      item.tagList.push(itemData);
                    }
                  }
                  var startdotime=[];
                  var starttime=[];
                  var endtime=[];
                  if(item.startdotime&&item.startdotime!=null){
                    startdotime=item.startdotime.split(" ");
                    item.startdotimeDate=startdotime[0];
                    item.startdotimeTime=startdotime[1];
                  }else{
                    item.startdotimeDate='';
                    item.startdotimeTime='';
                  }
                  if(item.starttime&&item.starttime!=null){
                    starttime=item.starttime.split(" ");
                    item.starttimeDate=starttime[0];
                    item.starttimeTime=starttime[1];
                  }else{
                    item.starttimeDate='';
                    item.starttimeTime='';
                  }
                  if(item.endtime&&item.endtime!=null){
                    endtime=item.endtime.split(" ");
                    item.endtimeDate=endtime[0];
                    item.endtimeTime=endtime[1];
                  }else{
                    item.endtimeDate='';
                    item.endtimeTime='';
                  }
                });
              }else{
                tableData=[];
              }
              if($this.currentStatus==="alltasks"){
                $this.totalDataNum = response.allcount;
                $this.groupScore=response.group;
              }
            }
            $this.tableData = tableData;
            $this.certinfoKey=!$this.certinfoKey;
            $this.$nextTick(() => {
              $this.$refs.simpleTable.doLayout();
            });
            $this.isLoading.close();
            setTimeout(()=>{
              $this.isDisabled=false;
            },1000);
            $this.$nextTick(()=>{
              $this.setHeight();
            });
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
              setTimeout(()=>{
                $this.isDisabled=false;
              },1000);
            }
          }
        }else{
          setTimeout(()=>{
            $this.isDisabled=false;
          },1000);
        }
      });
    },
    // 初始化部门列表
    getpublishdepart(){
      var $this = this;
      $this.$store.dispatch('worksaccpet/getpublishdepartAction',null).then(res=>{
          if(res){
              if(res.status){
                if(res.data.length>0){
                  var shdepart=[];
                  var shdepartObj={};
                  res.data.forEach(function(item){
                    item.departBool=false;
                  });
                  shdepart=res.data;
                  shdepartObj.id=0;
                  shdepartObj.name='全部';
                  shdepartObj.departBool=true;
                  shdepart.unshift(shdepartObj);
                  $this.shdepart=shdepart;
                }
                $this.getTagData();
              }else{
                  $this.$message({
                      showClose: true,
                      message: res.info,
                      type: 'error'
                  });
              }
          }
      })
    },
    // 初始化系统标签和自定义标签
    getTagData(){
      var $this = this;
      $this.$store.dispatch('works/tagListAction', null).then(response=>{
        if(response){
          if(response.status){
            var tagList = [];
            var tagListCustom = [];
            response.data.forEach(function(item,index){
              var itemData = {};
              var itemDataCustom = {};
              if(item.id==0){
                itemDataCustom.label= item.name;
                itemDataCustom.value = item.name;
                itemDataCustom.namecolor = item.namecolor;
                tagListCustom.push(itemDataCustom);                
              }else{
                itemData.label= item.name;
                itemData.value = item.id;
                itemData.namecolor = item.namecolor;
                itemData.departBool = false;
                if(itemData.label=='紧急'||itemData.label=='加急'){
                  itemData.clBool=true;
                }else{
                  itemData.clBool=false;
                }
                tagList.push(itemData);
              }
            });
            $this.tagList = tagList;
            $this.tagListCustom = tagListCustom;
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
    // 初始化工单具体负责人数据
    getWorkOrderUser(){
      var $this = this;
      $this.$store.dispatch('worksaccpet/workOrderUserListAction', null).then(response=>{
        if(response){
          if(response.status){
            var userList = [];
            response.data.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              userList.push(itemData);
            });
            $this.userList = userList;
            $this.getCurrentStatusData();
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
    // 点击工单状态事件
    hanldeworkstatus(Id){
      var $this = this;
      var workstatusId=Id;
      $this.currentId=Id;
      var operationsWidth = 22;
      if($this.currentId==4){
        if($this.menuButtonPermit.includes('Worksaccpet_backwork')){
            operationsWidth+=56;
        }
        $this.operationsWidth = "" + operationsWidth;
      }
      if($this.currentId==5){
        if($this.menuButtonPermit.includes('Worksaccpet_backwork')){
            operationsWidth+=56;
        }
        if($this.menuButtonPermit.includes('Worksaccpet_confirmfinish')){
            operationsWidth+=56;
        }
        $this.operationsWidth = "" + operationsWidth;
      }
      if($this.currentId==6){
        if($this.menuButtonPermit.includes('Worksaccpet_backwork')){
            operationsWidth+=56;
        }
        if($this.menuButtonPermit.includes('Worksaccpet_confirmstart')){
            operationsWidth+=56;
        }
        if($this.menuButtonPermit.includes('Worksaccpet_workcancel')){
            operationsWidth+=56;
        }
        $this.operationsWidth = "" + operationsWidth;
      }
      if($this.currentId==7){
        if($this.menuButtonPermit.includes('Worksaccpet_backwork')){
            operationsWidth+=56;
        }
        if($this.menuButtonPermit.includes('Worksaccpet_confirmdeal')){
            operationsWidth+=56;
        }
        $this.operationsWidth = "" + operationsWidth;
      }
      $this.workstatusArr.forEach(function(item,index){
        if(workstatusId==item.id){
          item.departBool=true;
        }else{
          item.departBool=false;
        }
      });
      if(workstatusId!=0){
        $this.searchData.workstatus=workstatusId;
      }
      $this.searchResult();
    },
    // 点击部门事件
    hanldeshdepart(Id){
      var $this = this;
      var departId=Id;
      $this.shdepart.forEach(function(item,index){
        if(departId==item.id){
          item.departBool=true;
        }else{
          item.departBool=false;
        }
      });
      if(departId!=0){
        $this.searchData.dept_id=departId;
      }
      $this.searchResult();
    },
    // 点击系统标签
    hanldetag(Id){
      var $this = this;
      var tagId=Id;
      $this.tagList.forEach(function(item,index){
        if(tagId==item.value){
          item.departBool=true;
        }else{
          item.departBool=false;
        }
      });
      $this.searchData.tagsid=tagId;
      $this.searchtagListCustom='';
      $this.searchData.tags='';
      $this.searchResult();
    },
    // 点击自定义标签系统标签
    hanldeCustom(){
      var $this = this;
      $this.tagList.forEach(function(item,index){
          item.departBool=false;
      });
      $this.searchData.tagsid='';
      $this.searchData.tags=$this.searchtagListCustom;
      $this.searchResult();
    },
    // 点击时间事件类型
    hanldetimeType(){
      var $this = this;
      $this.searchResult();
    },
    // 点击时间事件选择
    hanldetime(){
      var $this = this;
      $this.searchResult();
    },
    // 点击负责人
    hanldedealuser(){
      var $this = this;
      $this.searchResult();
    },
    // 点击添加关注
    handleAddFocus(FocusId){
      var $this = this;
      var searchData = {};
      searchData.id=FocusId;
      $this.$store.dispatch('worksaccpet/getworkAddfocusAction',searchData).then(res=>{
          if(res){
              if(res.status){
                  $this.$message({
                      showClose: true,
                      message: res.info,
                      type: 'success'
                  });
                  $this.searchResult();
              }else{
                  $this.$message({
                      showClose: true,
                      message: res.info,
                      type: 'error'
                  });
              }
          }
      })
    },
    // 点击取消关注
    handleCancelFocus(FocusId){
      var $this = this;
      var searchData = {};
      searchData.id=FocusId;
      $this.$store.dispatch('worksaccpet/getCancelworkfocusAction',searchData).then(res=>{
          if(res){
              if(res.status){
                  $this.$message({
                      showClose: true,
                      message: res.info,
                      type: 'success'
                  });
                  $this.searchResult();
              }else{
                  $this.$message({
                      showClose: true,
                      message: res.info,
                      type: 'error'
                  });
              }
          }
      })
    },
    // 重置表单
    resetData(){
        var $this = this;
        $this.searchData.page=1;
        $this.searchData.limit=50;
        $this.searchData.date=[];
        $this.searchData.starttime='';
        $this.searchData.endtime='';        
        $this.workstatusArr.forEach(function(item,index){
          if(item.id==0){
            item.departBool=true;
          }else{
            item.departBool=false;
          }
        });
        $this.searchData.workstatus='';
        $this.shdepart.forEach(function(item,index){
          if(item.id==0){
            item.departBool=true;
          }else{
            item.departBool=false;
          }
        });
        $this.searchData.dept_id='';
        $this.tagList.forEach(function(item,index){
          item.departBool=false;
        });
        $this.searchData.tagsid='';
        $this.searchData.tags='';
        $this.searchtagListCustom='';
        $this.searchData.timetype='';
        $this.searchData.dealuserid='';
        $this.searchResult();
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
      if($this.searchData.date&&$this.searchData.date.length>0){
        searchData.starttime = $this.searchData.date[0];
        searchData.endtime = $this.searchData.date[1];
      }
      if($this.searchData.dealuserid&&$this.searchData.dealuserid!=''){
        searchData.dealuserid = $this.searchData.dealuserid;
      }
      if($this.searchData.workstatus&&$this.searchData.workstatus!=''){
        searchData.workstatus = $this.searchData.workstatus;
      }
      if($this.searchData.dept_id&&$this.searchData.dept_id!=''){
        searchData.dept_id = $this.searchData.dept_id;
      }
      if($this.searchData.tags&&$this.searchData.tags!=''){
        searchData.tags = $this.searchData.tags;
      }
      if($this.searchData.tagsid&&$this.searchData.tagsid!=''){
        searchData.tagsid = $this.searchData.tagsid;
      }
      return searchData;
    },
    //个人工单列表-负责人填写进度百分比（2021-10-13）
    changePercenter(varID,varPercenter){
      var $this = this;
      var dateForm={};
      dateForm.id=varID;
      dateForm.percenter=varPercenter;
      $this.$store.dispatch('worksaccpet/workOrderpercenterAction',dateForm).then(res=>{
          if(res){
              if(res.status){
                  $this.$message({
                      showClose: true,
                      message: res.info,
                      type: 'success'
                  });
                  $this.initPage();
              }else{
                  $this.$message({
                      showClose: true,
                      message: res.info,
                      type: 'error'
                  });
              }
          }
      })
    },
    // 关闭弹窗
    handleClose(){
      var $this = this;
      $this.dialogFormVisible = false;
      setTimeout(()=>{
        $this.isSaveData=false;
      },1000);
    },
    // 保存评价
    saveData(){
      var $this = this;
      if(!$this.isSaveData){
        $this.isSaveData=true;
        $this.$store.dispatch('worksaccpet/confirmDoneWorkOrderAction', $this.dialogForm).then(response=>{
            if(response){
                if(response.status){
                    $this.$message({
                        showClose: true,
                        message: response.info,
                        type: 'success'
                    });
                    $this.handleClose();
                    $this.initPage();
                }else{
                    $this.$message({
                        showClose: true,
                        message: response.info,
                        type: 'error'
                    });
                    setTimeout(()=>{
                      $this.isSaveData=false;
                    },1000);
                }
            }
        });
      }
    },
    // 提交审核
    confirmDoneTableRow(row,index){
      var $this = this;
      $this.noconfirmData();
      $this.dialogFormVisible = true;
      $this.dialogText = "是否新修改";
      $this.dialogForm.id=row.id
    },
    noconfirmData(){
      var $this = this;
      $this.dialogForm.id = 0;
      $this.dialogForm.status = '1';
    },
    // 每页显示条数改变事件
    handleSizeChange(val) {
      var $this = this;
      $this.searchData.limit = val;
      $this.searchData.page = 1;
      $this.getCurrentStatusData();
    },
    // 当前页改变事件
    handleCurrentChange(val) {
      var $this = this;
      $this.searchData.page = val;
      $this.isPageBtn = true;
      $this.getCurrentStatusData();
    },
    // 跳转到详情
    jumpArticle(id){
      var $this = this;
      var routeUrl =  $this.$router.resolve({path:'/WorkOrder/workInfo',query:{ID:id,Status:$this.currentStatus}});
      window.open(routeUrl.href,'_blank');
    },
    // 重置搜索条件
    resetSearchData(){
        var $this = this;
        $this.searchData.page=1;
        $this.searchData.limit=50;
        $this.totalDataNum=0;
        $this.searchData.date=[];
        $this.searchData.starttime='';
        $this.searchData.endtime='';
        $this.workstatusArr.forEach(function(item,index){
          if(item.id==0){
            item.departBool=true;
          }else{
            item.departBool=false;
          }
        });
        $this.searchData.workstatus='';
        $this.shdepart.forEach(function(item,index){
          if(item.id==0){
            item.departBool=true;
          }else{
            item.departBool=false;
            item.orderStatusBool=true;
          }
        });
        $this.searchData.dept_id='';
        $this.tagList.forEach(function(item,index){
          item.departBool=false;
        });
        $this.searchData.tagsid='';
        $this.searchData.tags='';
        $this.searchtagListCustom='';
        $this.searchData.timetype='';
        $this.searchData.dealuserid='';
    },
    // 页面自跳转
    jumpLink(status){
        var $this = this;
        $this.resetSearchData();
        $this.workstatusArr.forEach(function(item,index){
            if(status=='focuson'||status=='person'){
                if(item.id==7){
                  item.orderStatusBool=false;
                }else{
                  item.orderStatusBool=true;
                }
            }else{
                item.orderStatusBool=true;
            }
        });
        if($this.currentStatus==status){
          $this.initPage();
        }else{
          $this.$router.push({path:'/WorkOrder/orderList',query:{Status:status}});
        }
    },
    // 确认开始做工单
    confirmstartRow(row,index){
      var $this = this;
      $this.$store.dispatch('worksaccpet/workOrderconfirmstartAction', {id:row.id}).then(response=>{
          if(response){
              if(response.status){
                  $this.$message({
                      showClose: true,
                      message: response.info,
                      type: 'success'
                  });
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
    // 工单退回
    cancelTableRow(row,index){
      var $this = this;
      var resultData = {};
      resultData.id = row.id;
      $this.$confirm('是否确认退回工单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        $this.$store.dispatch('worksaccpet/backWorkOrderAction', resultData).then(response=>{
            if(response){
                if(response.status){
                    $this.$message({
                        showClose: true,
                        message: response.info,
                        type: 'success'
                    });
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
      }).catch(() => {
          $this.$message({
            type: 'info',
            message: '已取消'
          });          
      });
    },
    // 认领工单
    receiveTableRow(row,index){
        var $this = this;
        if(row.ownScore==""){
            $this.$message({
                showClose: true,
                message: '错误：认领积分不能为空！',
                type: 'error'
            });
            return false;
        }
        if(!isNumber(row.ownScore)){
            $this.$message({
                showClose: true,
                message: '错误：认领积分只能输入数字！',
                type: 'error'
            });
            return false;
        }
        var resultData = {};
        resultData.work_id = row.id;
        resultData.score = row.ownScore;
        $this.$store.dispatch('worksaccpet/receiveWorkOrderAction', resultData).then(response=>{
            if(response){
                if(response.status){
                    $this.$message({
                        showClose: true,
                        message: response.info,
                        type: 'success'
                    });
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
    // 确认分配工单
    confirmAllotTableRow(row,index){
      var $this = this;
      if(row.dealuserid==""){
          $this.$message({
              showClose: true,
              message: '错误：请先分配具体负责人！',
              type: 'error'
          });
          return false;
      }
      var resultData = {};
      resultData.ids = row.id;
      resultData.dealuserid = row.dealuserid;
      $this.$store.dispatch('worksaccpet/confirmWorkOrderAction', resultData).then(response=>{
          if(response){
              if(response.status){
                  $this.$message({
                      showClose: true,
                      message: response.info,
                      type: 'success'
                  });
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
    // 修改已分配工单积分
    changeScore(row,index){
      var $this = this;
      var resultData = {};
      resultData.id = row.id;
      resultData.score = row.score;
      $this.$store.dispatch('worksaccpet/workOrderEditscoreAction', resultData).then(response=>{
          if(response){
              if(response.status){
                  $this.$message({
                      showClose: true,
                      message: response.info,
                      type: 'success'
                  });
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
    // 撤销分配
    undoTableRow(row,index){
      var $this = this;
      var resultData = {};
      resultData.ids = [row.id];
      $this.$confirm('是否确认撤销分配?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        $this.$store.dispatch('worksaccpet/undoWorkOrderAction', resultData).then(response=>{
            if(response){
                if(response.status){
                    $this.$message({
                        showClose: true,
                        message: response.info,
                        type: 'success'
                    });
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
      }).catch(() => {
          $this.$message({
            type: 'info',
            message: '已取消'
          });          
      });
    },
    // 设置横向滚动条相关DOM数据
    setScrollDom(){
      var $this = this;
      $this.scrollPosition.insetLeft = 0;
      $this.scrollPosition.oldInsetLeft = 0;
      // 表格真实宽度（可能超出屏幕）
      var scrollWidth = $this.$refs.simpleTable.bodyWrapper.scrollWidth;
      // 表格可见宽度（屏幕内宽度）
      var maxWidth = $this.$refs.simpleTable.bodyWrapper.clientWidth;
      // 获取表格的位置信息（距离视窗左边的位置信息）
      var rectOBJ = $this.$refs.simpleTable.$el.getBoundingClientRect();
      // 获取距离视窗左边的宽度
      var leftWidth = rectOBJ.left;
      // 根据百分比算出滚动条滑块的宽度
      var insetWidth = parseInt(maxWidth/scrollWidth*maxWidth);
      // 算出滚动条与视口比例（滚动条滚动1像素视口需要滚动多少像素）
      var ratio = (scrollWidth - maxWidth) / (maxWidth - insetWidth);
      var scrollDom = document.querySelector(".SiteTable .el-table__body-wrapper");
      var tableHeaderFixedDom = document.querySelector(".SiteTable .el-table__header-wrapper");
      var tableFixedRightDom = document.querySelector(".SiteTable .el-table__fixed-right");
      $this.scrollPosition.width = maxWidth;
      $this.scrollPosition.left = leftWidth;
      $this.scrollPosition.insetWidth = insetWidth;
      $this.scrollPosition.ratio = parseFloat(ratio);
      $this.scrollPosition.maxScrollWidth = maxWidth - insetWidth;
      $this.scrollTable.scrollDom = scrollDom;
      // 视窗改变时，让自定义滚动条的位置与真实滚动条滚动的位置相吻合
      $this.scrollPosition.insetLeft = $this.scrollTable.scrollDom.scrollLeft/$this.scrollPosition.ratio;
      // 获取表格头吸顶需滚动的高度
      if($this.$refs.headerPane){
         $this.scrollTable.fixedTopHeight = $this.$refs.headerPane.offsetHeight+$this.$refs.breadcrumbPane.offsetHeight+15;
      }else{
         $this.scrollTable.fixedTopHeight=$this.$refs.breadcrumbPane.offsetHeight+15;
      }
      $this.scrollTable.tableHeaderFixedDom = tableHeaderFixedDom;
      if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
         $this.scrollTable.tableFixedRightDom = tableFixedRightDom;
      }
      var fixedHeaderObj = $this.scrollTable.tableHeaderFixedDom.getBoundingClientRect();
      // 获取表格头的高度
      $this.scrollTable.tableheaderHeight = fixedHeaderObj.height;
      if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
         var fixedRightObj = $this.scrollTable.tableFixedRightDom.getBoundingClientRect();
         // 获取右侧固定列的总宽度
         $this.scrollTable.fixedRightWidth = fixedRightObj.width;
      }
      var tableObj = $this.scrollTable.scrollDom.getBoundingClientRect();
      $this.scrollTable.tableBottom = tableObj.height+$this.scrollTable.fixedTopHeight+$this.scrollTable.tableheaderHeight+60+15;
      $this.scrollTable.clientHeight = document.documentElement.clientHeight;
      // 头部固定情况下视窗宽高改变，需要重新设置的一些宽高
      if($this.scrollPosition.isFixed){
        var tableHeaderStyle = "width:"+$this.scrollPosition.width+"px;";
        $this.scrollTable.tableHeaderFixedDom.style = tableHeaderStyle;
        document.querySelector(".table-mask").style = tableHeaderStyle;
        var tableStyle3 = "width:"+$this.scrollTable.fixedRightWidth+"px;";        
        if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
          document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-header-wrapper").style=tableStyle3;
        }
        $this.scrollTable.tableBottom = tableObj.height+$this.scrollTable.fixedTopHeight+60+15;
      }
      // 视窗宽高改变时需要设置默认滚动条的位置
      if($this.totalDataNum>50){
        var scrTop = $this.$refs.scrollDom.scrollTop;
        if(scrTop+$this.scrollTable.clientHeight-60>=$this.scrollTable.tableBottom-60-15){
          $this.scrollPosition.fixedBottom = scrTop+$this.scrollTable.clientHeight-$this.scrollTable.tableBottom-30;
        }else{
          $this.scrollPosition.fixedBottom = 15;
        }
      }
    },
    // 竖向滚动条滚动事件
    handleScroll(event){
      var $this = this;
      if(!$this.scrollPosition.isMouseDown&&event.target.className=="scroll-panel"){// 非鼠标按下状态，为竖向滚动条触发的滚动事件
        var scrTop = event.target.scrollTop;
        var tableFixedRightDom = document.querySelector(".SiteTable .el-table__fixed-right");
        if(scrTop>=$this.scrollTable.fixedTopHeight){// 头部需要固定
          $this.scrollPosition.isFixed = true;
          var tableHeaderStyle = "width:"+$this.scrollPosition.width+"px;"
          $this.scrollTable.tableHeaderFixedDom.style = tableHeaderStyle;
          document.querySelector(".table-mask").style = tableHeaderStyle;
          var tableStyle1 = "padding-top:"+$this.scrollTable.tableheaderHeight+"px;";
          var tableStyle2 = "top:"+$this.scrollTable.tableheaderHeight+"px;";
          var tableStyle3 = "width:"+$this.scrollTable.fixedRightWidth+"px;";
          document.querySelector(".SiteTable .el-table__body-wrapper").style=tableStyle1;
          
          if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
            document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-body-wrapper").style=tableStyle2;
            document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-header-wrapper").style=tableStyle3;
          }
        }else{// 头部需要变为正常
          $this.scrollPosition.isFixed = false;
          var tableHeaderStyle = "width:100%";
          $this.scrollTable.tableHeaderFixedDom.style = tableHeaderStyle;
          var tableStyle1 = "padding-top:0";
          document.querySelector(".SiteTable .el-table__body-wrapper").style=tableStyle1;
          var tableStyle3 = "width:auto";
          if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
            document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-header-wrapper").style=tableStyle3;
          }
        }
        if($this.totalDataNum>50){
          if(scrTop+$this.scrollTable.clientHeight-60>=$this.scrollTable.tableBottom-60-15){
            $this.scrollPosition.fixedBottom = scrTop+$this.scrollTable.clientHeight-$this.scrollTable.tableBottom-30;
          }else{
            $this.scrollPosition.fixedBottom = 15;
          }
        }
      }
    },
    // 监听横向滚动条鼠标按下事件
    mouseDownHandler(e){
      this.crossMoveStartHandler(e);
      window.addEventListener('mousemove',this.crossMoveingHandler);
      window.addEventListener('mouseup',this.crossMoveEndHandler);
    },
    // 横向滚动条移动开始事件
    crossMoveStartHandler(e){
      var $this = this;
      $this.scrollPosition.isMouseDown = true;
      $this.scrollPosition.startPageX = e.pageX;
    },
    // 横向滚动条鼠标移动事件
    crossMoveingHandler(e){
      var $this = this;
      if($this.scrollPosition.isMouseDown){// 只在鼠标按下时监听鼠标移动事件
        var moveLeft = e.pageX - $this.scrollPosition.startPageX;
        var scrollWidth = 0;
        // 判断本次鼠标按下后鼠标移动的距离 大于0为向右移动
        if(moveLeft>0){
          // 本次移动距离+历史已移动距离如果大于最大能移动距离，说明向右已经滚动到头
          if(moveLeft+$this.scrollPosition.oldInsetLeft>=$this.scrollPosition.maxScrollWidth){
            scrollWidth = $this.scrollPosition.maxScrollWidth;
          }else{
            scrollWidth = moveLeft+$this.scrollPosition.oldInsetLeft;
          }
        }else if(moveLeft<0){
          // 小于0为向左移动
          // 本次移动距离+历史已移动距离，如果小于0，说明向左移动已经到头
          if(moveLeft+$this.scrollPosition.oldInsetLeft<0){
            scrollWidth = 0;
          }else{
            scrollWidth = moveLeft+$this.scrollPosition.oldInsetLeft;
          }
        }else{// 鼠标按下后，未移动
          scrollWidth = $this.scrollPosition.insetLeft;
        }
        // 计算得出本次移动+历史移动总距离
        // 自定义滚动条位置改变
        $this.scrollPosition.insetLeft = scrollWidth;
        // 真实滚动条滚动距离 = 自定义滚动条滚动距离*自定义滚动条与真实滚动条的滚动比
        $this.scrollTable.scrollDom.scrollLeft = scrollWidth*$this.scrollPosition.ratio;
        e.preventDefault();
      }
    },
    // 横向滚动条移动结束事件
    crossMoveEndHandler(e){
      var $this = this;
      $this.scrollPosition.isMouseDown = false;
      $this.scrollPosition.startPageX = 0;
      $this.scrollPosition.oldInsetLeft = $this.scrollPosition.insetLeft;
    },
    toggleBtn(){
      var $this = this;
      $this.screen.screenBtn=!$this.screen.screenBtn;
    },
    temHeaderhandle(valData){
      var $this = this;
      var labelColumn=$this.labelColumn;
      labelColumn.forEach(function(item,index){
        if(item.id==valData){
          if(!item.isDispaly){
            item.istrue=!item.istrue;
          }
        }
      });
      $this.labelColumn=labelColumn;
    },
    //
    filterHandler() {
      var $this = this;
      var labelColumn=$this.labelColumn;
      labelColumn.forEach(function(item,index){
        if(item.istrue){
            item.isshow=true;
        }else{
            item.isshow=false;
        }
      });
      $this.labelColumn=labelColumn;
      $this.screen.screenBtn=false;
    },
    resetHandler(){
      var $this = this;
      var labelColumn=$this.labelColumn;
      labelColumn.forEach(function(item,index){
        if(item.id==0||item.id==1||item.id==3||item.id==6||item.id==7||item.id==8||item.id==11){
            item.istrue=true;
            item.isshow=true;
            item.isDispaly=true;
        }else{
            item.istrue=false;
            item.isshow=false;
            item.isDispaly=false;
        }
      });
      $this.labelColumn=labelColumn;
      $this.screen.screenBtn=false;
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
