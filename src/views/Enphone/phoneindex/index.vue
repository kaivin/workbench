<template>
  <div class="page-root flex-box no-padding EnphoneCard" ref="boxPane">
    <div class="sub-router">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <div class="sub-wrapper">
          <div class="side-button">
            <router-link v-if="menuButtonPermit.includes('Enphone_search')" :to="{path:'/Enphone/searchClues'}" tag="a" target="_blank">
              <el-button type="primary" plain size="mini"><i class="svg-i" ><svg-icon icon-class="serch_en" /></i>搜索数据</el-button>
            </router-link>
            <router-link v-if="menuButtonPermit.includes('Enphone_phonecount')" :to="{path:'/Enphone/statisticClues'}" tag="a" target="_blank">
              <el-button type="primary" plain size="mini"><i class="svg-i" ><svg-icon icon-class="analy_en" /></i>业务员数据统计</el-button>
            </router-link>
          </div>
          <dl class="phone-list" v-if="menuButtonPermit.includes('Enphone_lookall')&&menuButtonPermit.includes('Enphone_lookwaitdealall')">
              <dd v-bind:class="currentKey&&currentKey=='all'?'active':''" v-if="menuButtonPermit.includes('Enphone_lookall')">
                <router-link :to="{page:'Enphone/phoneindex',query:{key:'all'}}">
                  <span>查看所有</span><i>({{linkAll.monthNum}})</i><em>({{linkAll.yestodayNum}})</em><b>({{linkAll.todayNum}})</b>
                </router-link>
              </dd>
              <dd v-bind:class="currentKey&&currentKey=='unAllot'?'active':''" v-if="menuButtonPermit.includes('Enphone_lookwaitdealall')">
                <router-link :to="{page:'Enphone/phoneindex',query:{key:'unAllot'}}">
                  <span>未分配</span><i>({{linkAll.unAllotNum}})</i>
                </router-link>
              </dd>
          </dl>
          <template v-for="(item,index) in defaultData.data">
            <dl class="phone-list" v-if="item.phone.length>0" v-bind:key="index">
              <dt><span>{{item.brandname}}</span></dt>
              <dd v-for="(phone,index) in item.phone" v-bind:class="phone.isOn?'active':''" :key="index" :title="phone.phonenumber+phone.othername">
                <router-link :to="{page:'Enphone/phoneindex',query:{phoneID:phone.id, waitstatus:phone.waitstatus}}">
                  <span>{{phone.phonenumber}}</span><i>({{phone.nowmonthnumber}})</i><em>({{phone.lastdaynumber}})</em><b>({{phone.nownumber}})</b>
                </router-link>
              </dd>
            </dl>
          </template>
        </div>
      </el-scrollbar>
    </div>
    <div class="flex-content relative EnphoneCardFr">
      <div class="abs-panel" ref="mainPane">
        <div class="scroll-panel" ref="scrollDom" style="will-change:scroll-position">
            <div class="true-height" ref="scrollPane">
                <div class="EnStatistical" v-if="!phoneID&&!currentKey">
                    <p class="breadcrumb" ref="breadcrumbPane">
                      <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
                      <template v-for="item in breadcrumbList">
                        <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
                        <span class="breadcrumb-link" v-bind:key="item.id" v-else><b>-</b><span>{{item.title}}</span></span>
                      </template>
                    </p>
                    <div class="tips-list" v-if="(defaultData.custormwarntatus==1&&defaultData.custormwarn.length>0)||(defaultData.warningstatus==1&&defaultData.saleswarning.length>0)">
                          <div class="item-tips" :class="item.type=='custormwarn'?'type-1':'type-2'" v-for="(item,index) in defaultData.custorAndsalesmwarn" v-bind:key="index" v-on:click="jumpEditPage(item.id)">
                              <i>{{index+1}}</i>
                              <strong>ID：{{item.id}}</strong>
                              <span>{{item.warning}}</span>
                          </div>
                    </div>
                    <el-card class="box-card" shadow="hover">
                          <div slot="header">
                              <div class="EnStatisticalTop" ref="enTopPane">
                                    <ul class="EnStatisticalTopTit">
                                        <li v-for="(item,index) in defaultData.departArr" v-bind:key="index"><span v-bind:class="item.isOn?'active':''" v-on:click="topdepartClick(item.depart_id)">{{item.depart}}</span></li>
                                    </ul>
                                    <div class="EnStatisticalTopBox">
                                          <dl v-for="(item,index) in departcountUlist" v-bind:key="index" :class="item.depart=='总数'?'dep':''">
                                              <dt>{{item.depart}}</dt>
                                              <dd>
                                                  <p>今天<span>{{item.todaycount}}</span></p>
                                                  <p>昨天<span>{{item.lastdaycount}}</span></p>
                                                  <p>本月<span>{{item.monthcount}}</span></p>
                                              </dd>
                                          </dl>
                                    </div>
                              </div>
                          </div>
                          <div v-if="depart_id==0?false:true" class="card-content EnStatisticalBom"  :style="'min-height:'+tableHeight+'px;'">
                              <div class="EnStatisticalBomBox" v-for="(item,index) in dept_Data" v-bind:key="index">
                                    <h2>{{item.name}}个人有效询盘数量</h2>
                                    <div class="item">
                                        <div class="itemPane" v-for="(items,indexs) in item.ulist" v-bind:key="indexs">
                                              <h3>{{items.user}}组</h3>   
                                              <div class="itemPaneTable">
                                                  <el-table
                                                    :data="items.xunlist"
                                                    stripe
                                                    show-summary
                                                    align='center'>
                                                    <el-table-column
                                                      prop="personname"
                                                      label="姓名"
                                                      align='center'>
                                                    </el-table-column>
                                                    <el-table-column
                                                      prop="todaycount"
                                                      label="今天个数"
                                                      align='center'>
                                                    </el-table-column>
                                                    <el-table-column
                                                      prop="lastdaycount"
                                                      label="昨天个数"
                                                      align='center'>
                                                    </el-table-column>
                                                    <el-table-column
                                                      prop="monthcount"
                                                      label="本月个数"
                                                      align='center'>
                                                    </el-table-column>
                                                  </el-table>
                                              </div>
                                        </div>
                                    </div>
                              </div>
                          </div>
                    </el-card>
                </div>
                <div class="EnphoneCardFrDate" v-else>
                    <p class="breadcrumb" ref="breadcrumbPane">
                        <router-link class="breadcrumb-link" to="/">首页</router-link>
                        <template v-for="item in breadcrumbList">
                          <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id"><b>-</b><span>{{item.title}}</span></router-link>
                        </template>
                    </p>
                    <el-card class="box-card scroll-card tipsHas" shadow="hover">
                      <div slot="header">
                        <div class="card-header EnphoneCardHeader" ref="headerPane">
                            <div class="tips-list" ref="tipsPane" v-if="(defaultData.custormwarntatus==1&&defaultData.custormwarn.length>0)||(defaultData.warningstatus==1&&defaultData.saleswarning.length>0)">
                                  <div class="item-tips" :class="item.type=='custormwarn'?'type-1':'type-2'" v-for="(item,index) in defaultData.custorAndsalesmwarn" v-bind:key="index" v-on:click="jumpEditPage(item.id)">
                                      <i>{{index+1}}</i>
                                      <strong>ID：{{item.id}}</strong>
                                      <span>{{item.warning}}</span>
                                  </div>
                            </div>
                            <div class="tipsHasItem">
                                <h2 class="clues-title">当前信息：{{currentPhone}}</h2>
                                <div class="search-wrap">
                                  <el-date-picker
                                      v-model="searchData.date"
                                      size="small"
                                      type="daterange"
                                      align="right"
                                      value-format = "yyyy-MM-dd"
                                      unlink-panels
                                      range-separator="至"
                                      start-placeholder="开始日期"
                                      end-placeholder="结束日期"
                                      @change="timeSearch"
                                      style="float:left;margin:5px 10px 5px 0px;width:240px;"
                                      :picker-options="pickerRangeOptions"
                                      :class="searchData.date&&searchData.date.length>0?'el-xzstate':''">
                                  </el-date-picker>
                                  <el-select v-model="searchData.timeing" clearable placeholder="时段" size="small" :class="searchData.timeing!=''?'el-xzstate':''" style="width:80px;margin:5px 10px 5px 0px;float:left;">
                                      <el-option
                                          v-for="item in timeList"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value">
                                      </el-option>
                                  </el-select>
                                  <el-select v-model="searchData.continent" size="small" clearable placeholder="大洲" :class="searchData.continent!=''?'el-xzstate':''" style="width:80px;margin:5px 10px 5px 0px;float:left;">
                                      <el-option
                                          v-for="item in continentsList"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value">
                                      </el-option>
                                  </el-select>
                                  <el-select v-model="searchData.typekey" size="small" clearable placeholder="分类" @change="currentCateChange"
                                  :class="searchData.typekey!=''?'el-xzstate':''" style="width:90px;margin:5px 10px 5px 0px;float:left;">
                                      <el-option
                                          v-for="item in productTypeList"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value">
                                      </el-option>
                                  </el-select>
                                  <el-select v-model="searchData.productid" size="small" clearable placeholder="产品" :class="searchData.productid!=''?'el-xzstate':''" style="width:90px;margin:5px 10px 5px 0px;float:left;">
                                      <el-option
                                          v-for="item in productList"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value">
                                      </el-option>
                                  </el-select>
                                  <el-select v-model="searchData.messagetype" size="small" clearable placeholder="留言类型" :class="searchData.messagetype!=''?'el-xzstate':''" style="width:100px;margin:5px 10px 5px 0px;float:left;">
                                      <el-option
                                          v-for="item in messageList"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value">
                                      </el-option>
                                  </el-select>
                                  <el-select v-model="searchData.mode" size="small" clearable placeholder="渠道" :class="searchData.mode!=''?'el-xzstate':''" style="width:140px;margin:5px 10px 5px 0px;float:left;">
                                      <el-option
                                          v-for="item in sourceList"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value">
                                      </el-option>
                                  </el-select>
                                  <el-select v-model="searchData.device" size="small" clearable placeholder="设备" :class="searchData.device!=''?'el-xzstate':''" style="width:80px;margin:5px 10px 5px 0px;float:left;">
                                    <el-option
                                      v-for="item in deviceList"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                  <el-select v-model="searchData.level_id" size="small" clearable placeholder="级别" :class="searchData.level_id!=''?'el-xzstate':''" style="width:80px;margin:5px 10px 5px 0px;float:left;">
                                      <el-option
                                          v-for="item in levelList"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value">
                                      </el-option>
                                  </el-select>
                                  <el-select v-model="searchData.ennature" size="small" clearable placeholder="性质" :class="searchData.ennature!=''?'el-xzstate':''" style="width:80px;margin:5px 10px 5px 0px;float:left;">
                                      <el-option
                                          v-for="item in natureList"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value">
                                      </el-option>
                                  </el-select>
                                  <el-select v-model="searchData.enxunprice" size="small" clearable placeholder="需求" :class="searchData.enxunprice!=''?'el-xzstate':''" style="width:80px;margin:5px 10px 5px 0px;float:left;">
                                      <el-option
                                          v-for="item in priceList"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value">
                                      </el-option>
                                  </el-select>
                                  <el-select v-model="searchData.erroring" size="small" clearable placeholder="异常" :class="searchData.erroring!=''?'el-xzstate':''" style="width:80px;margin:5px 10px 5px 0px;float:left;">
                                      <el-option
                                          v-for="item in errorList"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value">
                                      </el-option>
                                  </el-select>
                                  <el-select v-model="searchData.adduser" size="small" clearable placeholder="添加人" :class="searchData.adduser!=''?'el-xzstate':''" style="width:90px;margin:5px 10px 5px 0px;float:left;">
                                    <el-option
                                      v-for="item in userList"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                  <el-select v-model="searchData.production" size="small" clearable placeholder="产量" :class="searchData.production!=''?'el-xzstate':''" style="width:80px;margin:5px 10px 5px 0px;float:left;">
                                    <el-option
                                      v-for="item in productionList"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                  <el-select v-model="searchData.custormwarnstatus" size="small" clearable placeholder="业务员提醒" :class="searchData.custormwarnstatus!=''?'el-xzstate':''" style="width:120px;margin:5px 10px 5px 0px;float:left;">
                                    <el-option
                                      v-for="item in salesUserNoticeList"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                  <el-select v-if="(currentKey&&currentKey=='all')||(!currentKey&&searchData.waitstatus==1&&phoneID>800)" v-model="searchData.salesownid" size="small" clearable placeholder="业务员" :class="searchData.salesownid!=''?'el-xzstate':''" 
                                    style="width:90px;margin:5px 10px 5px 0px;float:left;">
                                    <el-option
                                      v-for="item in salesuserList"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                  <el-select v-if="(currentKey&&currentKey=='all')||(!currentKey&&searchData.waitstatus==1&&phoneID>800)"  v-model="searchData.salesdepart_id" size="small" clearable placeholder="业务员部门" :class="searchData.salesdepart_id!=''?'el-xzstate':''" 
                                    style="width:120px;margin:5px 10px 5px 0px;float:left;">
                                    <el-option
                                      v-for="item in salesdepartList"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                  <el-select v-model="searchData.saleswarnstatus" size="small" clearable placeholder="添加人提醒" :class="searchData.saleswarnstatus!=''?'el-xzstate':''" style="width:120px;margin:5px 10px 5px 0px;float:left;">
                                    <el-option
                                      v-for="item in addUserNoticeList"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                  <el-input
                                    class="tips-input-2"
                                    style="width: 150px;margin:5px 10px 5px 0px;float:left;" size="small"
                                    placeholder="模糊搜索、备注1"
                                    v-model="searchData.remark1"
                                    @keyup.enter.native="enterBtn"
                                    :class="searchData.remark1!=''?'el-xzstate':''"
                                    clearable>
                                  </el-input>
                                  <el-input
                                    class="tips-input-3"
                                    style="width: 100px;margin:5px 10px 5px 0px;float:left;" size="small"
                                    placeholder="备注2"
                                    v-model="searchData.remark2"
                                    @keyup.enter.native="enterBtn"
                                    :class="searchData.remark2!=''?'el-xzstate':''"
                                    clearable>
                                  </el-input>
                                  <el-input
                                    class="tips-input-4"
                                    style="width: 100px;margin:5px 10px 5px 0px;float:left;" size="small"
                                    placeholder="备注3"
                                    v-model="searchData.remark3"
                                    @keyup.enter.native="enterBtn"
                                    :class="searchData.remark3!=''?'el-xzstate':''"
                                    clearable>
                                  </el-input>
                                  <el-select v-model="searchData.effective" size="small" clearable placeholder="有效性" :class="searchData.effective!=''?'el-xzstate':''" style="width:100px;margin:5px 10px 5px 0px;float:left;">
                                    <el-option
                                      v-for="item in effectiveList"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                  <el-select v-model="searchData.feedback" size="small" clearable placeholder="反馈" :class="searchData.feedback!=''?'el-xzstate':''" style="width:80px;margin:5px 10px 5px 0px;float:left;">
                                    <el-option
                                      v-for="item in feedbackList"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                  <span style="float:left;line-height:32px;font-size:13px;margin:5px;">排序：</span>
                                  <el-select v-model="searchData.sort" size="small" placeholder="排序" :class="searchData.sort!=''?'el-xzstate':''" 
                                  style="width:130px;margin:5px 10px 5px 0px;float:left;">
                                    <el-option
                                      v-for="item in sortList"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                  <el-button class="item-input" :class="isSearchResult?'isDisabled':''" :disabled="isSearchResult" size="small" type="primary" icon="el-icon-search" @click="searchResult" style="margin:5px 10px 5px 0px;float:left;">查询</el-button>
                                  <el-button type="info" class="resetBtn" size="small" v-on:click="resetData()" style="margin:5px 10px 5px 0px;float:left;">重置</el-button>
                                   <el-button type="info" plain size="small" style="margin:5px 10px 5px 0px;float:left;" v-on:click="clearCache">清除缓存</el-button>
                                </div>
                                <div class="clues-info flex-wrap">
                                    <div class="clues-infoFl flex-content">
                                          <p>
                                            <span class="item-span-1">当前结果集：共有<strong>{{infoData.totalCount}}</strong>条。</span>
                                            <span class="item-span-2">有效：<strong>{{infoData.effectiveCount}}</strong>条，</span>
                                            <span class="item-span-3">无效：<strong>{{infoData.invalidCount}}</strong>条。</span>
                                            <span class="item-span-1">总分：<strong>{{infoData.totalScore}}</strong>。</span>
                                            <br/>
                                            <span class="item-span-1">本月（自然月） 共有<strong>{{infoData.totalCountMonth}}</strong>条。</span>
                                            <span class="item-span-2">有效：<strong>{{infoData.effectiveCountMonth}}</strong>条，</span>                  
                                            <span class="item-span-1">积分：<strong>{{infoData.totalScoreMonth}}</strong>。</span><em>||</em>
                                            
                                            <span class="item-span-1">上月（自然月） 共有<strong>{{infoData.totalCountLastMonth}}</strong>条。</span>
                                            <span class="item-span-2">有效：<strong>{{infoData.effectiveCountLastMonth}}</strong>条，</span>                  
                                            <span class="item-span-1">积分：<strong>{{infoData.totalScoreLastMonth}}</strong>。</span>
                                          </p>
                                    </div>
                                    <div class="clues-title-btn">
                                          <el-button type="primary" size="small" class="derived" :disabled="isDisabled" v-if="menuButtonPermit.includes('Enphone_listexport')" @click="dialogExportVisible = true"><i class="svg-i" ><svg-icon icon-class="derived" /></i>导出结果</el-button>
                                          <el-button type="primary" size="small" class="editorNote" :disabled="isDisabled" v-if="writepermit&&menuButtonPermit.includes('Enphone_othereditall')" v-on:click="editPageNote()"><i class="svg-i" ><svg-icon icon-class="editorNote" /></i>批量修改当前页备注</el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                      </div>
                      <div class="card-content" ref="tableContent">
                          <div class="table-wrapper" v-bind:class="scrollPosition.isFixed?'fixed-table':''">
                              <div class="table-mask"></div>
                              <el-table
                                ref="simpleTable"
                                :data="tableData"
                                tooltip-effect="dark"
                                stripe
                                class="SiteTable EntableColor"
                                style="width: 100%"
                                :style="'min-height:'+tableHeight+'px;'"
                                row-key="id"
                                key="a"
                                v-if="phoneID"
                                >
                                <el-table-column
                                  prop="id"
                                  label="ID"
                                  width="70"
                                  >
                                  <template slot-scope="scope">
                                    <div class="table-text">
                                      <p>{{scope.row.id}}</p>
                                    </div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  prop="xuntime"
                                  label="时间"
                                  min-width="120"
                                  >
                                  <template slot-scope="scope">
                                    <div class="table-text">
                                      <p>时段：{{scope.row.timeing}}</p>
                                      <p class="EnColor02">星期：{{scope.row.weekday}}</p>
                                      <p>本地：{{scope.row.xuntime}}</p>
                                      <p>当地：{{scope.row.foreigntime}}</p>
                                    </div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  prop="sourcename"
                                  label="来源"
                                  min-width="110"
                                  >
                                  <template slot-scope="scope">
                                    <div class="table-text">
                                      <p v-if="scope.row.domain"><a :href="scope.row.url" target="_blank" :title="scope.row.url">{{scope.row.domain}}</a></p>
                                      <p>{{scope.row.sourcename}}</p>
                                      <p>{{scope.row.messagetype}}</p>
                                    </div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  prop="sourcename"
                                  label="大洲/地区/IP"
                                  min-width="90"
                                  >
                                  <template slot-scope="scope">
                                    <div class="table-text">
                                      <p><span class="EnColor05">大洲：</span>{{scope.row.continent}}</p>
                                      <p><span class="EnColor05">国家：</span>{{scope.row.country}}</p>
                                      <p><span class="EnColor05">来路：</span><a :href="'https://www.ip138.com/iplookup.asp?ip='+scope.row.ip+'&action=2'" target="_blank" v-if="scope.row.ip" :title="scope.row.ip">IP</a></p>
                                      <p><span class="EnColor05">设备：</span>{{scope.row.device}}</p>
                                    </div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  prop="keyproduct"
                                  label="类型/产品"
                                  min-width="130"
                                  >
                                  <template slot-scope="scope">
                                    <div class="table-text">
                                      <p><span class="EnColor05">产品：</span><span :style="'font-weight:bold;color:'+scope.row.producttypecolor">{{scope.row.producttypename}}</span>/{{scope.row.keyproduct}}</p>
                                      <p class="EnColor05"><span>物料：</span>{{scope.row.material}}</p>
                                      <p class="EnColor05"><span>产量：</span>{{scope.row.production}}</p>
                                      <p class="EnColor05"><span>进料：</span>{{scope.row.infeed}}</p>
                                      <p class="EnColor05"><span>出料：</span>{{scope.row.outfeed}}</p>
                                    </div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  prop="effective"
                                  label="有效/原因"
                                  min-width="90"
                                  >
                                  <template slot-scope="scope">
                                    <div class="table-tag" style="text-align:center;"><el-checkbox v-model="scope.row.isEffective" disabled></el-checkbox></div>
                                    <div class="table-text">{{scope.row.invalidcause}}<span class="redTip">{{scope.row.noeffectivetime}}</span></div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  prop="levelname"
                                  label="首次/二次"
                                  min-width="100"
                                  >
                                  <template slot-scope="scope">
                                    <div class="table-text">
                                      <p class="table-tag"><span class="EnColor05">初次：</span><span class="level"  @click="handleCustormeditlogClick(scope.row.id)" :class="'level-'+scope.row.level_id">{{scope.row.levelname}}</span></p>
                                      <p><span class="EnColor05">性质：</span>{{scope.row.ennaturename?scope.row.ennaturename:'未判定'}}</p>
                                      <p><span class="EnColor05">需求：</span>{{scope.row.enxunpricename?scope.row.enxunpricename:'未判定'}}</p>
                                      <p><span class="EnColor05">状态：</span>{{scope.row.managestatus==1?'':'已开始处理'}}</p>
                                      <p><span class="EnColor05">异常：</span>{{scope.row.erroring}}</p>
                                    </div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  prop="xunremark"
                                  label="备注"
                                  min-width="90"
                                  >
                                  <template slot-scope="scope">
                                    <div class="table-text">
                                      <p><span class="EnColor05" v-if="scope.row.xunremark&&scope.row.xunremark!=''">询盘：</span>{{scope.row.xunremark}}</p>
                                      <p v-if="permitField.includes('custormremark')" class="EnColor07"><span class="EnColor05" v-if="scope.row.custormremark&&scope.row.custormremark!=''">客服：</span>{{scope.row.custormremark}}</p>
                                      <p v-if="permitField.includes('salesremark')" class="EnColor07"><span class="EnColor05" v-if="scope.row.salesremark&&scope.row.salesremark!=''">业务员：</span>{{scope.row.salesremark}}</p>
                                    </div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  prop="addusername"
                                  label="添/分人员"
                                  width="100"
                                  >
                                  <template slot-scope="scope">
                                    <div class="table-text">
                                      <p><span>添：</span>{{scope.row.addusername}}</p>
                                      <p><span>分：</span>{{scope.row.allotusername}}</p>
                                    </div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  prop="addusername"
                                  label="业务人员"
                                  width="80"
                                  >
                                  <template slot-scope="scope">
                                    <div class="table-text">
                                      <p>{{scope.row.hassale}}</p>
                                    </div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  prop="addtime"
                                  label="添/分/改/业务时间"
                                  min-width="90"
                                  >
                                  <template slot-scope="scope">
                                    <div class="table-text">
                                      <p>{{scope.row.addtime}}</p>
                                      <p>{{scope.row.allottime}}</p>
                                      <p>{{scope.row.updatetime}}</p>
                                      <p style="color:red;">{{scope.row.managetime}}</p>
                                    </div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  prop="sourcename"
                                  label="价值分"
                                  width="70"
                                  >
                                  <template slot-scope="scope">
                                    <div class="table-score"><span class="EnColor06">{{scope.row.score}}</span></div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  v-if="writepermit&&(permitField.includes('remark1')||permitField.includes('remark2')||permitField.includes('remark3'))"
                                  key="d"
                                  prop="searchword"
                                  label="备注"
                                  width="100"
                                  fixed="right"
                                  >
                                  <template slot-scope="scope">
                                    <div class="table-input">
                                      <el-input size="small" class="tips-input-2" v-model="scope.row.remark1" v-if="permitField.includes('remark1')"></el-input>
                                      <el-input size="small" class="tips-input-3" v-model="scope.row.remark2" v-if="permitField.includes('remark2')"></el-input>
                                      <el-input size="small" class="tips-input-4" v-model="scope.row.remark3" v-if="permitField.includes('remark3')"></el-input>
                                    </div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  v-if="writepermit&&(menuButtonPermit.includes('Enphone_edit')||menuButtonPermit.includes('Enphone_otheredit'))"
                                  width="88"
                                  align="center"
                                  prop="operations"
                                  fixed="right"
                                  label="操作">
                                  <template #default="scope">
                                    <div class="table-button">
                                      <el-button size="mini" @click="editTableInputRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Enphone_otheredit')">修改</el-button>
                                      <router-link :to="{path:'/Enphone/addEditClues',query:{ID:scope.row.id}}" tag="a" target="_blank" v-if="menuButtonPermit.includes('Enphone_edit')">
                                        <el-button size="mini">编辑</el-button>        
                                      </router-link>
                                      <span class="edit-times" v-on:click="jumpEditHistoryPage(scope.row.id)" v-if="menuButtonPermit.includes('Enphone_edit')" style="color:red;">({{scope.row.eidtnumber}})</span>
                                    </div>
                                  </template>
                                </el-table-column>
                              </el-table>
                              <el-table
                                ref="simpleTable"
                                :data="tableData"
                                tooltip-effect="dark"
                                stripe
                                class="SiteTable EntableColor"
                                style="width: 100%"
                                :style="'min-height:'+tableHeight+'px;'"
                                row-key="id"
                                key="a"
                                v-else
                                >
                                <el-table-column
                                  prop="id"
                                  label="ID"
                                  width="70"
                                  >
                                  <template slot-scope="scope">
                                    <div class="table-text">
                                      <p>{{scope.row.id}}</p>
                                    </div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  prop="xuntime"
                                  label="时间"
                                  min-width="120"
                                  >
                                  <template slot-scope="scope">
                                    <div class="table-text">
                                      <p>时段：{{scope.row.timeing}}</p>
                                      <p class="EnColor02">星期：{{scope.row.weekday}}</p>
                                      <p>本地：{{scope.row.xuntime}}</p>
                                      <p>当地：{{scope.row.foreigntime}}</p>
                                    </div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  prop="sourcename"
                                  label="来源"
                                  min-width="110"
                                  >
                                  <template slot-scope="scope">
                                    <div class="table-text">
                                      <p v-if="scope.row.domain"><a :href="scope.row.url" target="_blank" :title="scope.row.url">{{scope.row.domain}}</a></p>
                                      <p>{{scope.row.sourcename}}</p>
                                      <p>{{scope.row.messagetype}}</p>
                                    </div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  prop="sourcename"
                                  label="大洲/地区/IP"
                                  min-width="90"
                                  >
                                  <template slot-scope="scope">
                                    <div class="table-text">
                                      <p><span class="EnColor05">大洲：</span>{{scope.row.continent}}</p>
                                      <p><span class="EnColor05">国家：</span>{{scope.row.country}}</p>
                                      <p><span class="EnColor05">来路：</span><a :href="'https://www.ip138.com/iplookup.asp?ip='+scope.row.ip+'&action=2'" target="_blank" v-if="scope.row.ip" :title="scope.row.ip">IP</a></p>
                                      <p><span class="EnColor05">设备：</span>{{scope.row.device}}</p>
                                    </div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  prop="keyproduct"
                                  label="类型/产品"
                                  min-width="130"
                                  >
                                  <template slot-scope="scope">
                                    <div class="table-text">
                                      <p><span class="EnColor05">产品：</span><span :style="'font-weight:bold;color:'+scope.row.producttypecolor">{{scope.row.producttypename}}</span>/{{scope.row.keyproduct}}</p>
                                      <p class="EnColor05"><span>物料：</span>{{scope.row.material}}</p>
                                      <p class="EnColor05"><span>产量：</span>{{scope.row.production}}</p>
                                      <p class="EnColor05"><span>进料：</span>{{scope.row.infeed}}</p>
                                      <p class="EnColor05"><span>出料：</span>{{scope.row.outfeed}}</p>
                                    </div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  prop="effective"
                                  label="有效/原因"
                                  min-width="90"
                                  >
                                  <template slot-scope="scope">
                                    <div class="table-tag" style="text-align:center;"><el-checkbox v-model="scope.row.isEffective" disabled></el-checkbox></div>
                                    <div class="table-text">{{scope.row.invalidcause}}<span class="redTip">{{scope.row.noeffectivetime}}</span></div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  prop="levelname"
                                  label="首次/二次"
                                  min-width="100"
                                  >
                                  <template slot-scope="scope">
                                    <div class="table-text">
                                      <p class="table-tag"><span class="EnColor05">初次：</span><span class="level"  @click="handleCustormeditlogClick(scope.row.id)" :class="'level-'+scope.row.level_id">{{scope.row.levelname}}</span></p>
                                      <p><span class="EnColor05">性质：</span>{{scope.row.ennaturename?scope.row.ennaturename:'未判定'}}</p>
                                      <p><span class="EnColor05">需求：</span>{{scope.row.enxunpricename?scope.row.enxunpricename:'未判定'}}</p>
                                      <p><span class="EnColor05">状态：</span>{{scope.row.managestatus==1?'':'已开始处理'}}</p>
                                      <p><span class="EnColor05">异常：</span>{{scope.row.erroring}}</p>
                                    </div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  prop="xunremark"
                                  label="备注"
                                  min-width="90"
                                  >
                                  <template slot-scope="scope">
                                    <div class="table-text">
                                      <p><span class="EnColor05" v-if="scope.row.xunremark&&scope.row.xunremark!=''">询盘：</span>{{scope.row.xunremark}}</p>
                                      <p v-if="permitField.includes('custormremark')" class="EnColor07"><span class="EnColor05" v-if="scope.row.custormremark&&scope.row.custormremark!=''">客服：</span>{{scope.row.custormremark}}</p>
                                      <p v-if="permitField.includes('salesremark')" class="EnColor07"><span class="EnColor05" v-if="scope.row.salesremark&&scope.row.salesremark!=''">业务员：</span>{{scope.row.salesremark}}</p>
                                    </div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  prop="addusername"
                                  label="添/分人员"
                                  width="100"
                                  >
                                  <template slot-scope="scope">
                                    <div class="table-text">
                                      <p><span>添：</span>{{scope.row.addusername}}</p>
                                      <p><span>分：</span>{{scope.row.allotusername}}</p>
                                    </div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  prop="addusername"
                                  label="业务人员"
                                  width="80"
                                  >
                                  <template slot-scope="scope">
                                    <div class="table-text">
                                      <p>{{scope.row.hassale}}</p>
                                    </div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  prop="addtime"
                                  label="添/分/改/业务时间"
                                  min-width="90"
                                  >
                                  <template slot-scope="scope">
                                    <div class="table-text">
                                      <p>{{scope.row.addtime}}</p>
                                      <p>{{scope.row.allottime}}</p>
                                      <p>{{scope.row.updatetime}}</p>
                                      <p style="color:red;">{{scope.row.managetime}}</p>
                                    </div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  prop="sourcename"
                                  label="价值分"
                                  width="70"
                                  >
                                  <template slot-scope="scope">
                                    <div class="table-score"><span class="EnColor06">{{scope.row.score}}</span></div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  v-if="permitField.includes('remark1')||permitField.includes('remark2')||permitField.includes('remark3')"
                                  key="d"
                                  prop="searchword"
                                  label="备注"
                                  width="100"
                                  fixed="right"
                                  >
                                  <template slot-scope="scope">
                                    <div class="table-input">
                                      <el-input size="small" class="tips-input-2" v-model="scope.row.remark1" v-if="scope.row.writepermit&&permitField.includes('remark1')"></el-input>
                                      <el-input size="small" class="tips-input-3" v-model="scope.row.remark2" v-if="scope.row.writepermit&&permitField.includes('remark2')"></el-input>
                                      <el-input size="small" class="tips-input-4" v-model="scope.row.remark3" v-if="scope.row.writepermit&&permitField.includes('remark3')"></el-input>
                                    </div>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  v-if="menuButtonPermit.includes('Enphone_edit')||menuButtonPermit.includes('Enphone_otheredit')"
                                  width="88"
                                  align="center"
                                  prop="operations"
                                  fixed="right"
                                  label="操作">
                                  <template #default="scope">
                                    <div class="table-button">
                                      <el-button size="mini" @click="editTableInputRow(scope.row,scope.$index)" v-if="scope.row.writepermit&&menuButtonPermit.includes('Enphone_otheredit')">修改</el-button>
                                      <router-link :to="{path:'/Enphone/addEditClues',query:{ID:scope.row.id}}" tag="a" target="_blank" v-if="scope.row.writepermit&&menuButtonPermit.includes('Enphone_edit')">
                                      <el-button size="mini" >编辑</el-button>
                                      </router-link>
                                      <span class="edit-times" v-on:click="jumpEditHistoryPage(scope.row.id)" v-if="scope.row.writepermit&&menuButtonPermit.includes('Enphone_edit')" style="color:red;">({{scope.row.eidtnumber}})</span>
                                    </div>
                                  </template>
                                </el-table-column>
                              </el-table>
                          </div>
                          <div class="out_box fixed" v-if="scrollPosition.maxScrollWidth>0&&scrollPosition.isPC" :style="'left:'+scrollPosition.left+'px;width:'+scrollPosition.width+'px;bottom:'+scrollPosition.fixedBottom+'px;'" ref="out_box">
                              <div class="in_box" @mousedown="mouseDownHandler" :style="'left:'+scrollPosition.insetLeft+'px;width:'+scrollPosition.insetWidth+'px;'" ref="in_box" ></div>
                          </div>
                      </div>
                      <div class="pagination-panel" v-if="totalDataNum>20" ref="pagePane">
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
            </div>
        </div>
      </div>
      <el-backtop target=".scroll-panel"></el-backtop>
    </div>
    <el-backtop target=".scroll-panel"></el-backtop>
    <el-dialog title="导出" custom-class="export-dialog" :visible.sync="dialogExportVisible" width="440px">
      <el-form :inline="true" :model="exportForm">
        <el-form-item label="文件名称：" :label-width="formLabelWidth">
          <el-input v-model="exportForm.fileName" placeholder="文件名 (默认：excel-list)" prefix-icon="el-icon-document"></el-input>
        </el-form-item>
        <el-form-item label="文件类型：" :label-width="formLabelWidth">
          <el-select v-model="exportForm.bookType" placeholder="请选择导出文件类型" style="display:block;">
            <el-option label="xlsx" value="xlsx"></el-option>
            <el-option label="csv" value="csv"></el-option>
            <el-option label="txt" value="txt"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogExportVisible = false">取 消</el-button>
          <el-button :loading="downloadLoading" type="primary" icon="el-icon-document" @click="handleDownload">导 出</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="级别修改记录" custom-class="export-dialog popover" :visible.sync="levelPopBool">
         <ul>
            <li v-for="item in levelPop" :key="item.id">            
              <span>{{item.addtime}}</span>
              <span v-if="item.bname&&item.bname!=''">[{{item.bname}}]修改</span>
              <span>是否有效<em>[{{item.neweffective}}]</em></span>
              <span>原始级别<em>[{{item.oldlevel}}]</em>,</span>
              <span>修改后级别<em>[{{item.newlevel}}]</em>,</span>
              <span>原因：<em>[{{item.remark}}]</em></span>            
            </li>
         </ul>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" size="small" @click="handleLockClick">确定</el-button>
          </span>
        </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Enphone_phoneindex',
  data() {
    return {
      phoneID:null,
      depart_id:0,
      dept_Data:[],
      breadcrumbList:[],
      currentPhone:'',
      writepermit:false,
      menuButtonPermit:[],
      tableHeight:200,
      defaultData:{
        custorAndsalesmwarn:[],
        custormwarn:[],
        saleswarning:[],
      },
      currentID:'',
      operationsWidth:"",
      tableData:[],
      EnphoneCardFrWidth:200,
      maxDate:[],
      minDate:[],
      maxNum:0,
      searchData:{
        date:[],
        timeing:"",
        continent:"",
        page:1,
        limit:20,
        mode:"",
        typekey:'',
        productid:"",
        level_id:'',
        messagetype:'',
        adduser:'',
        device:'',
        ennature:"",
        enxunprice:"",
        erroring:"",
        production:"",
        custormwarnstatus:"",
        saleswarnstatus:"",
        effective:'',
        remark1:"",
        remark2:"",
        remark3:"",
        feedback:"",
        sort:"xuntime",
        waitstatus:"1",
        salesownid:"",
        salesdepart_id:"",
      },
      pageSizeList:[20, 50, 100, 500],
      totalDataNum:0,
      pickerRangeOptions: this.$pickerRangeOptions,
      deviceList:[
        {label:"PC设备",value:"PC设备"},
        {label:"移动设备",value:"移动设备"},
        {label:"未知设备",value:"未知设备"},
      ],
      messageList:[
        {label:"留言板",value:"留言板"},
        {label:"Email",value:"Email"},
        {label:"商务通",value:"商务通"},
        {label:"其他",value:"其他"},
      ],
      continentsList:[
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
      timeList:[
        {label:"0-3",value:"0-3"},
        {label:"3-6",value:"3-6"},
        {label:"6-9",value:"6-9"},
        {label:"9-12",value:"9-12"},
        {label:"12-15",value:"12-15"},
        {label:"15-18",value:"15-18"},
        {label:"18-21",value:"18-21"},
        {label:"21-24",value:"21-24"},
      ],
      salesuserList:[],
      salesdepartList:[],
      natureList:[],
      productTypeList:[],
      productList:[],
      sourceList:[],
      userList:[],
      levelList:[],
      priceList:[],
      effectiveList:[
        {label:"只显示有效",value:1},
        {label:"只显示无效",value:2},
      ],
      feedbackList:[
        {label:"已反馈",value:1},
        {label:"未反馈",value:2},
      ],
      sortList:[
        {label:"本地时间排序",value:"xuntime"},
        {label:"价值分排序",value:"score"},
      ],
      addUserNoticeList:[
        {label:"提醒过所有",value:1},
        {label:"提醒过已处理",value:2},
        {label:"提醒过未处理",value:3},
      ],
      salesUserNoticeList:[
        {label:"提醒过所有",value:1},
        {label:"提醒过已处理",value:2},
        {label:"提醒过未处理",value:3},
      ],
      productionList:[
        {label:"≤5T/H",value:"≤5T/H"},
        {label:"≤10T/H",value:"≤10T/H"},
        {label:"10-50T/H",value:"10-50T/H"},
        {label:"50-100T/H",value:"50-100T/H"},
        {label:"≥100T/H",value:"≥100T/H"},
      ],
      errorList:[
        {label:"1.信息全但联系不上",value:"1.信息全但联系不上"},
        {label:"2.信息全但客户不需要",value:"2.信息全但客户不需要"},
        {label:"3.找工作",value:"3.找工作"},
        {label:"4.找投资",value:"4.找投资"},
        {label:"5.产量过小",value:"5.产量过小"},
        {label:"6.联系方式错误",value:"6.联系方式错误"},
      ],
      infoData:{
        totalCount:0,
        effectiveCount:0,
        invalidCount:0,
        levelOneCount:0,
        levelTwoCount:0,
        totalCountMonth:0,
        effectiveCountMonth:0,
        invalidCountMonth:0,
        levelOneCountMonth:0,
        levelTwoCountMonth:0,
      },
      formLabelWidth:"120px",
      exportForm:{
        fileName:"",
        bookType:"xlsx"
      },
      dialogExportVisible:false,
      downloadLoading: false,
      permitField:[],
      isDisabled:true,
      levelPop:[],  
      levelPopBool:false,
      departcountUlist:[],
      linkAll:{
        todayNum:0,
        yestodayNum:0,
        monthNum:0,
        unAllotNum:0,
      },
      currentKey:null,
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
      brandID:null,
      isSearchResult:false,
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
    window.addEventListener('scroll',this.handleScroll,true);
    if($this.$route.query.phoneID||$this.$route.query.key){
      $this.$nextTick(function () {     
        $this.setTableHeight();
      });
      window.onresize = () => {
        return (() => {
           $this.setTableHeight();
        })()
      }
    }else{
        var headerHeight = $this.$refs.enTopPane.offsetHeight+30;        
        var breadcrumbHeight = $this.$refs.breadcrumbPane.offsetHeight;
        var screenHeight = $this.$refs.boxPane.offsetHeight;
        $this.tableHeight = screenHeight-headerHeight-breadcrumbHeight-40;
        window.onresize = () => {
          return (() => {
              $this.tableHeight = screenHeight-headerHeight-breadcrumbHeight-40;
          })()
        }
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
        if(this.$route.query.phoneID){
          this.phoneID = parseInt(this.$route.query.phoneID);
          this.searchData.waitstatus = parseInt(this.$route.query.waitstatus);
          this.currentKey = null;
          this.$nextTick(function () {     
            this.setTableHeight();
          });
        }else{
          this.phoneID = null;
          this.searchData.waitstatus=1;
          if(this.$route.query.key){
            this.currentKey = this.$route.query.key;
            this.$nextTick(function () {     
              this.setTableHeight();
            });
          }else{
            this.currentKey = null;
          }
        }
        this.initData();
      },
      isOpen(e){        
        if(this.$route.query.phoneID||this.$route.query.key){
            this.setTableHeight();
        }
      },
  },
  created(){
    var $this = this;
    if($this.$route.query.phoneID){
      $this.phoneID = parseInt($this.$route.query.phoneID);
      $this.searchData.waitstatus = parseInt($this.$route.query.waitstatus);
      $this.currentKey = null;
    }else{
      $this.phoneID = null;
      $this.searchData.waitstatus=1;
      if($this.$route.query.key){
        $this.currentKey = $this.$route.query.key;
      }else{
        $this.currentKey = null;
      }
    }
    $this.getBreadcrumbList();
    $this.initData();
  },
  updated(){
    this.$nextTick(() => {
      if(this.$route.query.phoneID||this.$route.query.key){
        this.$refs.simpleTable.doLayout(); 
      }else{
        if(this.$refs.mainPane&&this.$refs.enTopPane){          
        var headerHeight = this.$refs.enTopPane.offsetHeight+30;
        var breadcrumbHeight = this.$refs.breadcrumbPane.offsetHeight+15;
        var screenHeight = this.$refs.boxPane.offsetHeight;        
        this.tableHeight = screenHeight-headerHeight-breadcrumbHeight-40;
        }
      }
    })
  }, 
  destroyed(){
    window.removeEventListener('scroll', this.handleScroll,true);//监听页面滚动事件
  },
  methods:{
    // 清除缓存
    clearCache(){
      var $this = this;
      
      var type = null;
      if(this.$route.query.phoneID){
        type = this.$route.query.phoneID
      }
      if(this.$route.query.key == 'all'){
        type = 'lookall'
      }
      if(this.$route.query.key == 'unAllot'){
        type = 'unAllot'
      }
      
      $this.$store.dispatch('api/clearCacheAction', {cachename:type}).then(response=>{
        if(response){
          if(response.status){
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'success'
            });
            $this.searchResult();
            
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
    // loading自定义
    loadingFun(){
      var $this = this;
      $this.isLoading = $this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
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
    // 设置高度
    setTableHeight(){
      var $this = this;
      if($this.$route.query.phoneID||$this.$route.query.key){
        $this.tableHeight = 0;      
        var headerHeight = $this.$refs.headerPane.offsetHeight;      
        var breadcrumbHeight = $this.$refs.breadcrumbPane.offsetHeight;
        var screenHeight = $this.$refs.boxPane.offsetHeight;
        $this.tableHeight = screenHeight-headerHeight-breadcrumbHeight-40;
        $this.getBrowserType();      
        if($this.$route.query.phoneID||$this.$route.query.key){
          setTimeout(function() {
              $this.setScrollDom();
          }, 400);
        }
      }
    },
    // 时间搜索
    timeSearch(){
      var $this = this;
      $this.searchResult();
    },
    // 搜索结果
    searchResult(){
      var $this = this;
      $this.searchData.page=1;
      $this.initCluesList();
    },
    // 重置表单
    resetData(){
        var $this = this;
        $this.searchData.date=[];
        $this.searchData.timeing="";
        $this.searchData.continent="";
        $this.searchData.page=1;
        $this.searchData.limit=20;
        $this.searchData.mode="";
        $this.searchData.typekey="";
        $this.searchData.productid="";
        $this.searchData.level_id="";
        $this.searchData.messagetype="";
        $this.searchData.adduser="";
        $this.searchData.device="";
        $this.searchData.ennature="";
        $this.searchData.enxunprice="";
        $this.searchData.erroring="";
        $this.searchData.production="";
        $this.searchData.custormwarnstatus="";
        $this.searchData.saleswarnstatus="";
        $this.searchData.effective="";
        $this.searchData.remark1="";
        $this.searchData.remark2="";
        $this.searchData.remark3="";
        $this.searchData.feedback="";
        $this.searchData.sort="xuntime";
        $this.searchData.salesownid="";
        $this.searchData.salesdepart_id="";
        $this.searchResult();
    },
    // 右侧标题-左侧电话括号小数字
    leftPhoto(){
      var $this=this;
      $this.loadingFun();
      $this.$store.dispatch('enphone/getLeftPhotoAction', null).then(response=>{
        if(response){
          if(response.status){
              $this.linkAll.todayNum = response.alltodaynumber;
              $this.linkAll.yestodayNum = response.alllastnumber;
              $this.linkAll.monthNum = response.allnumber;
              $this.linkAll.unAllotNum = response.nodealcount;
              var brand = "";
              var brandID = null;              
              if($this.$route.query.phoneID){
                response.data.forEach(function(item,index){
                  brand = item.brandname;
                  item.phone.forEach(function(item1,index1){
                    if(item1.id == $this.phoneID&&item1.waitstatus==$this.searchData.waitstatus){
                      $this.currentID = item1.id;
                      item1.isOn = true;
                      brandID = item.id;
                      if(item1.phonenumber.indexOf("-")!=-1){
                        $this.currentPhone = item1.phonenumber;
                      }else{
                        $this.currentPhone = brand+"-"+item1.phonenumber;
                      }
                    }else{
                      item1.isOn = false;
                    }
                  });
                });
              }else{
                if($this.$route.query.key){
                  response.data.forEach(function(item,index){
                    item.phone.forEach(function(item1,index1){
                      item.isOn = false;
                    });
                  });
                  if($this.$route.query.key=="all"){
                    $this.currentPhone = "查看所有";
                  }else{
                    $this.currentPhone = "所有未分配";
                  }
                }
              }
              $this.brandID = brandID;
              $this.defaultData = response;
              var custorAndsalesmwarn=[];
              var custormwarn=[];
              var saleswarning=[];
              if(response.custormwarn.length>0){
                  response.custormwarn.forEach(function(item){
                      var Obj={
                        id:0,
                        warning:'',
                        type:'custormwarn',
                      }
                      Obj.id=item.id;
                      Obj.warning=item.custormselfwarn;
                      custormwarn.push(Obj);
                  });
              }
              if(response.saleswarning.length>0){
                  response.saleswarning.forEach(function(item){
                      var Obj={
                        id:'0',
                        warning:'',
                        type:'saleswarning',
                      }
                      Obj.id=item.id;
                      Obj.warning=item.givecustormwarn;
                      saleswarning.push(Obj);
                  });
              }
              $this.defaultData.custorAndsalesmwarn=custorAndsalesmwarn.concat(custormwarn,saleswarning);
              $this.getCurrentPhoneSearchData();
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
    // 初始化数据
    initData(){
      var $this = this;
        $this.searchData.page=1;
      $this.loadingFun();
      $this.getUserMenuButtonPermit();
    },
    // 电话首页-部门搜索
    initHomePage(){
      var $this = this;
      var deptForm={};
      deptForm.dept_id=$this.depart_id;
      $this.$store.dispatch('enphone/cluesPhoneIndexSearchDataAction', deptForm).then(response=>{
        if(response){
          if(response.status){
             $this.dept_Data=[];
             var departcountUlist=[];
             response.departcount.forEach(function(item){
                if(item.dept_id==$this.depart_id){
                  item.ulist.forEach(function(items,indexs){
                      items.depart=items.user;
                  })
                  departcountUlist=item.ulist;
                }
             });
             $this.departcountUlist = departcountUlist;             
             $this.dept_Data=response.departusercount;
             $this.isLoading.close();
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
    // 初始化首页统计页面信息
    initPage(){
      var $this = this;
      $this.$store.dispatch('enphone/cluesPhoneIndexDataAction', null).then(response=>{
        if(response){
          if(response.status){
            $this.linkAll.todayNum = response.alltodaynumber;
            $this.linkAll.yestodayNum = response.alllastnumber;
            $this.linkAll.monthNum = response.allnumber;
            $this.linkAll.unAllotNum = response.nodealcount;
            if($this.$route.query.phoneID){
                $this.defaultData.data.forEach(function(item,index){
                  item.phone.forEach(function(item1,index1){
                    if(item1.id == $this.currentID){
                      item1.isOn = true;
                    }else{
                      item1.isOn = false;
                    }
                  });
                });
            }else{
              if($this.$route.query.key){
                $this.defaultData.data.forEach(function(item,index){
                  item.phone.forEach(function(item1,index1){
                    item1.isOn = false;
                  });
                });
                if($this.$route.query.key=="all"){
                  $this.currentPhone = "查看所有";
                }else{
                  $this.currentPhone = "所有未分配";
                }
              }else{
                var departArr=[];
                var departObj={     
                  depart_id:0,
                  depart: "总数",
                  isOn:true,
                }
                departArr.push(departObj);
                response.departnumber.forEach(function(item){
                    item.depart_id=item.depart_id;
                    item.depart=item.depart;
                    item.isOn=false,
                    departArr.push(item);
                });
                var departcountUlist=[];
                var totalObj={     
                  depart_id:0,
                  isOn:true,
                  depart: "总数",
                  lastdaycount:response.alllastnumber,
                  monthcount:response.allnumber,
                  todaycount:response.alltodaynumber,
                }
                departcountUlist.push(totalObj);
                response.departnumber.forEach(function(item){
                    item.depart_id=item.depart_id;
                    item.isOn=false,
                    item.depart=item.depart;
                    item.lastdaycount=item.lastdaynumber;
                    item.monthcount=item.monthnumber;
                    item.todaycount=item.todaynumber;
                    departcountUlist.push(item);
                });
                $this.departcountUlist = departcountUlist;
                $this.defaultData = response;
                $this.defaultData.departArr = departArr;
              }
            }
            var custorAndsalesmwarn=[];
            var custormwarn=[];
            var saleswarning=[];
            if(response.custormwarn.length>0){
                response.custormwarn.forEach(function(item){
                    var Obj={
                      id:0,
                      warning:'',
                      type:'custormwarn',
                    }
                    Obj.id=item.id;
                    Obj.warning=item.custormselfwarn;
                    custormwarn.push(Obj);
                });
            }
            if(response.saleswarning.length>0){
                response.saleswarning.forEach(function(item){
                    var Obj={
                      id:'0',
                      warning:'',
                      type:'saleswarning',
                    }
                    Obj.id=item.id;
                    Obj.warning=item.givecustormwarn;
                    saleswarning.push(Obj);
                });
            }
            $this.defaultData.custorAndsalesmwarn=custorAndsalesmwarn.concat(custormwarn,saleswarning);
            $this.isLoading.close();
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
    // 组装搜索接口所需数据
    initSearchData(){
      var $this = this;
      var searchData = {};
      searchData.page = $this.searchData.page;
      searchData.limit = $this.searchData.limit;
      if($this.phoneID){
        searchData.phoneid = $this.phoneID;
        searchData.waitstatus = $this.searchData.waitstatus;
      }
      if($this.searchData.timeing&&$this.searchData.timeing!=''){
        searchData.timeing = $this.searchData.timeing;
      }
      if($this.searchData.continent&&$this.searchData.continent!=''){
        searchData.continent = $this.searchData.continent;
      }
      if($this.searchData.mode&&$this.searchData.mode!=''){
        searchData.mode = $this.searchData.mode;
      }
      if($this.searchData.typekey&&$this.searchData.typekey!=''){
        searchData.typekey = $this.searchData.typekey;
      }
      if($this.searchData.productid&&$this.searchData.productid!=''){
        searchData.productid = $this.searchData.productid;
      }
      if($this.searchData.level_id&&$this.searchData.level_id!=''){
        searchData.level_id = $this.searchData.level_id;
      }
      if($this.searchData.messagetype&&$this.searchData.messagetype!=''){
        searchData.messagetype = $this.searchData.messagetype;
      }
      if($this.searchData.adduser&&$this.searchData.adduser!=''){
        searchData.adduser = $this.searchData.adduser;
      }
      if($this.searchData.device&&$this.searchData.device!=''){
        searchData.device = $this.searchData.device;
      }
      if($this.searchData.ennature&&$this.searchData.ennature!=''){
        searchData.ennature = $this.searchData.ennature;
      }
      if($this.searchData.enxunprice&&$this.searchData.enxunprice!=''){
        searchData.enxunprice = $this.searchData.enxunprice;
      }
      if($this.searchData.erroring&&$this.searchData.erroring!=''){
        searchData.erroring = $this.searchData.erroring;
      }
      if($this.searchData.production&&$this.searchData.production!=''){
        searchData.production = $this.searchData.production;
      }
      if($this.searchData.custormwarnstatus&&$this.searchData.custormwarnstatus!=''){
        searchData.custormwarnstatus = $this.searchData.custormwarnstatus;
      }
      if($this.searchData.saleswarnstatus&&$this.searchData.saleswarnstatus!=''){
        searchData.saleswarnstatus = $this.searchData.saleswarnstatus;
      }
      if($this.searchData.effective&&$this.searchData.effective!=''){
        searchData.effective = $this.searchData.effective;
      }
      if($this.searchData.remark1!=''){
        searchData.remark1 = $this.searchData.remark1;
      }
      if($this.searchData.remark2!=''){
        searchData.remark2 = $this.searchData.remark2;
      }
      if($this.searchData.remark3!=''){
        searchData.remark3 = $this.searchData.remark3;
      }
      if($this.searchData.feedback&&$this.searchData.feedback!=''){
        searchData.feedback = $this.searchData.feedback;
      }
      if($this.searchData.sort!=''){
        searchData.sort = $this.searchData.sort;
      }    
      if($this.searchData.date&&$this.searchData.date.length>0){
        searchData.starttime = $this.searchData.date[0];
        searchData.endtime = $this.searchData.date[1];
      }
      return searchData;
    },
    // 初始化询盘列表数据
    initCluesList(){
      var $this = this;
      if(!$this.isSearchResult){
        $this.isSearchResult=true;
        var searchData = $this.initSearchData();
        var pathUrl = "";
        if($this.phoneID){
          pathUrl = 'enphone/cluesCurrentPhoneDataAction';
          if($this.phoneID>800&&$this.searchData.waitstatus==1){
            searchData.salesownid=$this.searchData.salesownid;
            searchData.salesdepart_id=$this.searchData.salesdepart_id;
          }
        }else{
          if($this.currentKey){
            if($this.currentKey=="all"){
              pathUrl = "enphone/allCluesDataAction";
              searchData.salesownid=$this.searchData.salesownid;
              searchData.salesdepart_id=$this.searchData.salesdepart_id;
            }else{
              pathUrl = "enphone/allUnAllotCluesDataAction";
            }
          }
        }
        $this.loadingFun();
        $this.$store.dispatch(pathUrl, searchData).then(response=>{
          if(response){
            if(response.status){
              var infoData = {};            
              infoData.totalCount=response.allcount;
              infoData.effectiveCount=response.effectivecount;
              infoData.invalidCount=response.noeffectivecount;
              infoData.totalScore=response.countscore;
              infoData.totalCountMonth=response.nowmonthnumber;
              infoData.effectiveCountMonth=response.noweffectivenumber;
              infoData.invalidCountMonth=response.nownoeffectivenumber;
              infoData.totalScoreMonth=response.countmonthscore;
              infoData.totalCountLastMonth=response.lastmonthnumber;
              infoData.effectiveCountLastMonth=response.lasteffectivenumber;
              infoData.invalidCountLastMonth=response.lastnoeffectivenumber;
              infoData.totalScoreLastMonth=response.countlastmonthscore;
              if(response.data.length>0){
                response.data.forEach(function(item,index){
                  item.isEffective = item.effective==1?true:false;
                });
                $this.isDisabled = false;
              }else{
                $this.isDisabled = true;
              }
              $this.writepermit = response.writepermit?true:false;
              $this.tableData = response.data;
              $this.infoData = infoData;
              $this.totalDataNum = response.allcount;
              $this.getPermitField();            
            }else{
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
              });
              setTimeout(()=>{
                $this.isSearchResult=false;
              },1000);
            }
          }
        });
      }
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
            if($this.menuButtonPermit.includes('Enphone_phoneindex')){
              var operationsWidth = 22;
              if($this.menuButtonPermit.includes('Enphone_edit')){
                operationsWidth+=66;
              }
              if($this.menuButtonPermit.includes('Enphone_delete')){
                operationsWidth+=66;
              }
              $this.operationsWidth = "" + operationsWidth;
              if($this.$route.query.phoneID||$this.$route.query.key){
                $this.leftPhoto();
              }else{
                $this.initPage();
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
    // 电话点击跳转列表
    phoneJump(id,waitstatus){
      var $this=this;
      var queryObj = {};
      if(id==""){
        queryObj.key=waitstatus;
      }else{
        queryObj.phoneID = id;
        queryObj.waitstatus = waitstatus;
      }
      $this.$router.push({page:'Enphone/phoneindex',query:queryObj});
    },
    // 获取当前电话的搜索条件数据
    getCurrentPhoneSearchData(){
      var $this = this;
      var resultData = {};
      if($this.brandID){
        resultData.brand_id = $this.brandID;
      }else{
        resultData = null;
      }
      $this.$store.dispatch('enphone/cluesCurrentPhoneSearchDataAction', resultData).then(response=>{
        if(response){
          if(response.status){
            var natureList = [];
            response.nature.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              natureList.push(itemData);
            });
            $this.natureList = natureList;
            var productTypeList = [];
            response.producttype.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              productTypeList.push(itemData);
            });
            $this.productTypeList = productTypeList;
            var sourceList = [];
            response.sourcetype.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              sourceList.push(itemData);
            });
            $this.sourceList = sourceList;
            var userList = [];
            response.adduser.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              userList.push(itemData);
            });
            $this.userList = userList;
            var levelList = [];
            response.xunlevel.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.levelname;
              itemData.value = item.id;
              levelList.push(itemData);
            });
            $this.levelList = levelList;
            var priceList = [];
            response.enprice.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              priceList.push(itemData);
            });
            $this.priceList = priceList;            
            var salesuserList = [];
            response.salesuser.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              salesuserList.push(itemData);
            });
            $this.salesuserList = salesuserList;
            

            var salesdepartList = [];
            response.salesdepart.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              salesdepartList.push(itemData);
            });
            $this.salesdepartList = salesdepartList;


            $this.initCluesList();
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
    // 每页显示条数改变事件
    handleSizeChange(val) {
      this.searchData.limit = val;
      this.searchData.page = 1;
      this.leftPhoto();
    },
    // 当前页改变事件
    handleCurrentChange(val) {
      this.searchData.page = val;
      this.leftPhoto();
    },
    // 修改询盘
    editTableRow(row,index){
      var $this = this;
      var routeUrl =  $this.$router.resolve({path:'/Enphone/addEditClues',query:{ID:row.id}});
      window.open(routeUrl.href,'_blank');
    },
    // 提醒跳转到编辑页面
    jumpEditPage(id){
      var $this = this;
      $this.$router.push({path:'/Enphone/addEditClues',query:{ID:id}});
    },
    // 跳转询盘修改历史页面
    jumpEditHistoryPage(id){
      var $this = this;
      var routeUrl =  $this.$router.resolve({path:'/Enphone/editHistoryLog',query:{ID:id}});
      window.open(routeUrl.href,'_self');
    },
    // 搜索统计数据跳转
    searchStatisticsData(){
      var $this = this;
      var routeUrl =  $this.$router.resolve({path:'/Enphone/searchClues'});
      window.open(routeUrl.href,'_blank');
    },
    // 统计分析跳转
    statisticsClues(){
      var $this = this;
      var routeUrl =  $this.$router.resolve({path:'/Enphone/statisticClues'});
      window.open(routeUrl.href,'_blank');
    },
    // 导出当前页数据
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID','时段','星期','本地时间','当地时间','域名','渠道','来源类型', '大洲', '国家','IP','设备','产品分类','意向产品','物料','产量','进料','出料','有效','无效原因','初次等级','性质','需求','状态','异常','备注','添加人','分配人','业务员','添加时间','分配时间','修改时间','业务时间','价值分', '备注1','备注2',  '备注3']
        const list = this.tableData
        const data = [];
        list.forEach(function(item,index){
          var itemData = [];
          itemData.push(item.id);
          itemData.push(item.timeing);
          itemData.push(item.weekday);
          itemData.push(item.xuntime);
          itemData.push(item.foreigntime);
          itemData.push(item.domain);
          itemData.push(item.sourcename);
          itemData.push(item.messagetype);
          itemData.push(item.continent);
          itemData.push(item.country);
          itemData.push(item.ip);
          itemData.push(item.device);
          itemData.push(item.producttypename);
          itemData.push(item.keyproduct);
          itemData.push(item.material);
          itemData.push(item.production);
          itemData.push(item.infeed);
          itemData.push(item.outfeed);
          itemData.push(item.effective==1?'有效':'无效');
          itemData.push(item.invalidcause+item.noeffectivetime);
          itemData.push(item.levelname);
          itemData.push(item.ennaturename);
          itemData.push(item.enxunpricename);
          itemData.push(item.managestatus==1?'':'已开始处理');
          itemData.push(item.erroring);
          itemData.push(item.xunremark);
          itemData.push(item.addusername);
          itemData.push(item.addusername);
          itemData.push(item.allotusername);
          itemData.push(item.hassale);
          itemData.push(item.addtime);
          itemData.push(item.allottime);
          itemData.push(item.updatetime);
          itemData.push(item.managetime);
          itemData.push(item.score);
          itemData.push(item.remark1);
          itemData.push(item.remark2);
          itemData.push(item.remark3);
          data.push(itemData);
        });
        // const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.exportForm.fileName,
          autoWidth: true,
          bookType: this.exportForm.bookType
        })
        this.downloadLoading = false;
        this.dialogExportVisible = false;
        this.exportForm.fileName = "";
      })
    },
    // 修改当前页备注
    editPageNote(){
      var $this = this;
      var resultData = [];
      $this.tableData.forEach(function(item,index){
        var itemData = {};
        itemData.phoneid= $this.phoneID;
        itemData.id = item.id;
        itemData.remark1 = item.remark1;
        itemData.remark2 = item.remark2;
        itemData.remark3 = item.remark3;
        resultData.push(itemData);
      });
      $this.$store.dispatch('enphone/cluesCurrentPhoneDataEleEditPageAction', resultData).then(response=>{
        if(response){
          if(response.status){
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'success'
            });
            $this.initCluesList();
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
    // 电商人员修改询盘信息
    editTableInputRow(row,index){
      var $this = this;
      var resultData = {};
      resultData.id = row.id;
      resultData.phoneid = row.phoneid;
      resultData.remark1 = row.remark1;
      resultData.remark2 = row.remark2;
      resultData.remark3 = row.remark3;
      $this.$store.dispatch('enphone/cluesCurrentPhoneDataEleEditAction', resultData).then(response=>{
        if(response){
          if(response.status){
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'success'
            });
            $this.initCluesList();
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
    // 删除表格行
    deleteTableRow(row,index){
      var $this = this;
      $this.$confirm('是否确认删除该询盘?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          $this.$store.dispatch('enphone/cluesCurrentPhoneDataDeleteAction', {id:row.id}).then(response=>{
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
          });
      }).catch(() => {
          $this.$message({
            type: 'info',
            message: '已取消删除'
          });          
      });
    },
    // 获取当前登录用户有可写权限的询盘字段
    getPermitField(){
      var $this = this;
      $this.$store.dispatch('enphone/cluesCurrentPhoneUserCanEditFieldAction', null).then(response=>{
        if(response){
          if(response.status){
            $this.permitField = response.data;
            if($this.$route.query.phoneID||$this.$route.query.key){
                $this.$nextTick(function () {
                  $this.setTableHeight();
                })
            }
            $this.isLoading.close();
            setTimeout(()=>{
              $this.isSearchResult=false;
            },1000);
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
            setTimeout(()=>{
              $this.isSearchResult=false;
            },1000);
          }
        }
      });
    },
    // 当前产品分类改变触发事件
    currentCateChange(e){
        var $this = this;
        if(e){
          $this.searchData.productid = "";
          $this.$store.dispatch('enphone/getCurrentCateProductListAction', {typeid:e}).then(response=>{
              if(response){
                  if(response.status){
                      var productList = [];
                      response.data.forEach(function(item,index){
                          var itemData = {};
                          itemData.label = item.name;
                          itemData.value = item.id;
                          productList.push(itemData);
                      });
                      $this.productList = productList;
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
          $this.productList = [];
        }
    },
    // 询盘级别修改记录
    handleCustormeditlogClick(Rid){
      var $this = this;
      var FormID={};
      FormID.id = Rid;
      $this.$store.dispatch('enphone/CustormeditlogAction', FormID).then(response=>{
        if(response){
          if(response.status){  
            if(response.data.length>0){
              $this.levelPopBool=true;
              $this.levelPop=response.data;
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
    handleLockClick(){
        var $this=this;
        $this.levelPopBool=!$this.levelPopBool;
    },
    // 部门点击事件
    topdepartClick(Tid){
      var $this = this;
      $this.loadingFun();
      var topdepart = $this.defaultData.departArr;
      topdepart.forEach(function(item){
        if(item.depart_id == Tid){
          item.isOn = true;
        }else{
          item.isOn = false;
        }
      });
      $this.depart_id=Tid;
      if($this.depart_id!=0){
        $this.initHomePage();
      }else{        
        var departcountUlist=[];
        var totalObj={     
          depart_id:0,
          isOn:true,
          depart: "总数",
          lastdaycount:$this.defaultData.alllastnumber,
          monthcount:$this.defaultData.allnumber,
          todaycount:$this.defaultData.alltodaynumber,
        }
        departcountUlist.push(totalObj);
        $this.defaultData.departnumber.forEach(function(item){
            item.depart_id=item.depart_id;
            item.isOn=false,
            item.depart=item.depart;
            item.lastdaycount=item.lastdaynumber;
            item.monthcount=item.monthnumber;
            item.todaycount=item.todaynumber;
            departcountUlist.push(item);
        });
        $this.departcountUlist = departcountUlist;
        $this.isLoading.close();
      }
    },  
    enterBtn(){
      var $this=this;
      $this.searchResult();
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
         $this.scrollTable.fixedTopHeight = $this.$refs.headerPane.offsetHeight+$this.$refs.breadcrumbPane.offsetHeight+15+20;
      }else{
         $this.scrollTable.fixedTopHeight=$this.$refs.breadcrumbPane.offsetHeight+15+20;
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
        $this.scrollTable.tableBottom = tableObj.height+$this.scrollTable.fixedTopHeight+54+20;
      }
      // 视窗宽高改变时需要设置默认滚动条的位置
      if($this.totalDataNum>20){
        var scrTop = $this.$refs.scrollDom.scrollTop;
        if(scrTop+$this.scrollTable.clientHeight>=$this.scrollTable.tableBottom-20){
          $this.scrollPosition.fixedBottom = scrTop+$this.scrollTable.clientHeight-$this.scrollTable.tableBottom-10;
        }else{
          $this.scrollPosition.fixedBottom = 20;
        }
      }
    },
    // 竖向滚动条滚动事件
    handleScroll(event){
      var $this = this;
      if($this.$route.query.phoneID||$this.$route.query.key){
          if(!$this.scrollPosition.isMouseDown&&event.target.className=="scroll-panel"){// 非鼠标按下状态，为竖向滚动条触发的滚动事件
            var scrTop = event.target.scrollTop;
            var tableFixedRightDom = document.querySelector(".SiteTable .el-table__fixed-right");
            if($this.scrollTable.fixedTopHeight!=0){
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
              if($this.totalDataNum>20){
                if(scrTop+$this.scrollTable.clientHeight>=$this.scrollTable.tableBottom-20){
                  $this.scrollPosition.fixedBottom = scrTop+$this.scrollTable.clientHeight-$this.scrollTable.tableBottom-10;
                }else{
                  $this.scrollPosition.fixedBottom = 20;
                }
              }
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
  }
}
</script>
<style lang="scss" scoped>
</style>
