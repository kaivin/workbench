<template>
  <div class="page-root flex-box no-padding EnphoneCard" ref="boxPane">
    <div class="sub-router">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <div class="sub-wrapper">
          <div class="side-button">
            <el-button type="primary" plain size="mini" v-if="menuButtonPermit.includes('Enphone_search')" v-on:click="searchStatisticsData()"><i class="svg-i" ><svg-icon icon-class="serch_en" /></i>搜索数据</el-button>
            <el-button type="primary" plain size="mini" v-if="menuButtonPermit.includes('Enphone_phonecount')" v-on:click="statisticsClues()"><i class="svg-i" ><svg-icon icon-class="analy_en" /></i>业务员数据统计</el-button>
          </div>
          <template v-for="(item,index) in defaultData.data">
            <dl class="phone-list" v-if="item.phone.length>0" v-bind:key="index">
              <dt><span>{{item.brandname}}</span></dt>
              <dd v-for="(phone,index) in item.phone" v-bind:class="phone.isOn?'active':''" :key="index" :title="phone.phonenumber+phone.othername" v-on:click="phoneJump(phone.id,phone.waitstatus)"><span>{{phone.phonenumber}}</span><i>({{phone.nowmonthnumber}})</i><em>({{phone.lastdaynumber}})</em><b>({{phone.nownumber}})</b></dd>
            </dl>
          </template>
        </div>
      </el-scrollbar>
    </div>
    <div class="flex-content relative EnphoneCardFr">
      <div class="abs-panel" ref="mainPane">
        <div class="scroll-panel" ref="scrollPane">
          <div class="EnStatistical" v-if="!phoneID">
              <div class="tips-list" v-if="defaultData.custormwarn.length>0&&defaultData.custormwarntatus">
                <div class="item-tips type-1" v-for="(item,index) in defaultData.custormwarn" v-bind:key="index" v-on:click="jumpEditPage(item.id)">{{item.custormselfwarn}}</div>
              </div>
              <div class="tips-list" v-if="defaultData.saleswarning.length>0&&defaultData.warningstatus">
                <div class="item-tips type-2" v-for="(item,index) in defaultData.saleswarning" v-bind:key="index" v-on:click="jumpEditPage(item.id)">{{item.givecustormwarn}}</div>
              </div>
              <el-card class="box-card" shadow="hover">
                    <div slot="header">
                        <div class="EnStatisticalTop">
                              <ul class="EnStatisticalTopTit">
                                  <li v-for="(item,index) in defaultData.departcountArr" v-bind:key="index"><span v-bind:class="item.isOn?'active':''" v-on:click="topdepartClick(item.dept_id)">{{item.name}}</span></li>
                              </ul>
                              <div class="EnStatisticalTopBox">
                                    <dl v-for="(item,index) in departcountUlist" v-bind:key="index" :class="item.user=='总数'?'dep':''">
                                        <dt>{{item.user}}</dt>
                                        <dd>
                                            <p>今天<span>{{item.todaycount}}</span></p>
                                            <p>昨天<span>{{item.lastdaycount}}</span></p>
                                            <p>本月<span>{{item.monthcount}}</span></p>
                                        </dd>
                                    </dl>
                              </div>
                        </div>
                    </div>
                    <div class="card-content EnStatisticalBom">
                         <div class="EnStatisticalBomBox" v-for="(item,index) in defaultData.departusercount" v-bind:key="index">
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
          <el-card class="box-card scroll-card EnphoneCardFrDate" v-else shadow="hover">
            <div slot="header">
              <div class="card-header EnphoneCardHeader" ref="headerPane">
                  <div class="tips-list" v-if="defaultData.custormwarn.length>0&&defaultData.custormwarntatus">
                    <div class="item-tips type-1" v-for="(item,index) in defaultData.custormwarn" v-bind:key="index" v-on:click="jumpEditPage(item.id)">{{item.custormselfwarn}}</div>
                  </div>
                  <div class="tips-list" v-if="defaultData.saleswarning.length>0&&defaultData.warningstatus">
                    <div class="item-tips type-2" v-for="(item,index) in defaultData.saleswarning" v-bind:key="index" v-on:click="jumpEditPage(item.id)">{{item.givecustormwarn}}</div>
                  </div>
                  <h2 class="clues-title">当前信息：{{currentPhone}}</h2>
                  <div class="search-wrap" v-if="device==='desktop'">
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
                        style="float:left;margin:5px 10px 5px 0px;"
                        :picker-options="pickerRangeOptions">
                    </el-date-picker>
                    <el-select v-model="searchData.timeing" clearable placeholder="时段" size="small" style="width:80px;margin:5px 10px 5px 0px;float:left;">
                        <el-option
                            v-for="item in timeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="searchData.continent" size="small" clearable placeholder="大洲" style="width:80px;margin:5px 10px 5px 0px;float:left;">
                        <el-option
                            v-for="item in continentsList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="searchData.typekey" size="small" clearable placeholder="分类" @change="currentCateChange" style="width:90px;margin:5px 10px 5px 0px;float:left;">
                        <el-option
                            v-for="item in productTypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="searchData.productid" size="small" clearable placeholder="产品" style="width:90px;margin:5px 10px 5px 0px;float:left;">
                        <el-option
                            v-for="item in productList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="searchData.messagetype" size="small" clearable placeholder="留言类型" style="width:100px;margin:5px 10px 5px 0px;float:left;">
                        <el-option
                            v-for="item in messageList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="searchData.mode" size="small" clearable placeholder="渠道" style="width:80px;margin:5px 10px 5px 0px;float:left;">
                        <el-option
                            v-for="item in sourceList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="searchData.device" size="small" clearable placeholder="设备" style="width:80px;margin:5px 10px 5px 0px;float:left;">
                      <el-option
                        v-for="item in deviceList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-select v-model="searchData.level_id" size="small" clearable placeholder="级别" style="width:80px;margin:5px 10px 5px 0px;float:left;">
                        <el-option
                            v-for="item in levelList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="searchData.ennature" size="small" clearable placeholder="性质" style="width:80px;margin:5px 10px 5px 0px;float:left;">
                        <el-option
                            v-for="item in natureList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="searchData.enxunprice" size="small" clearable placeholder="需求" style="width:80px;margin:5px 10px 5px 0px;float:left;">
                        <el-option
                            v-for="item in priceList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="searchData.erroring" size="small" clearable placeholder="异常" style="width:80px;margin:5px 10px 5px 0px;float:left;">
                        <el-option
                            v-for="item in errorList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="searchData.adduser" size="small" clearable placeholder="添加人" style="width:90px;margin:5px 10px 5px 0px;float:left;">
                      <el-option
                        v-for="item in userList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-select v-model="searchData.production" size="small" clearable placeholder="产量" style="width:80px;margin:5px 10px 5px 0px;float:left;">
                      <el-option
                        v-for="item in productionList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-select v-model="searchData.custormwarnstatus" size="small" clearable placeholder="业务员提醒" style="width:120px;margin:5px 10px 5px 0px;float:left;">
                      <el-option
                        v-for="item in salesUserNoticeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-select v-model="searchData.saleswarnstatus" size="small" clearable placeholder="添加人提醒" style="width:120px;margin:5px 10px 5px 0px;float:left;">
                      <el-option
                        v-for="item in addUserNoticeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-input
                      style="width: 150px;margin:5px 10px 5px 0px;float:left;" size="small"
                      placeholder="模糊搜索、备注1"
                      v-model="searchData.remark1"
                      clearable>
                    </el-input>
                    <el-input
                      style="width: 100px;margin:5px 10px 5px 0px;float:left;" size="small"
                      placeholder="备注2"
                      v-model="searchData.remark2"
                      clearable>
                    </el-input>
                    <el-input
                      style="width: 100px;margin:5px 10px 5px 0px;float:left;" size="small"
                      placeholder="备注3"
                      v-model="searchData.remark3"
                      clearable>
                    </el-input>
                    <el-select v-model="searchData.effective" size="small" clearable placeholder="有效性" style="width:100px;margin:5px 10px 5px 0px;float:left;">
                      <el-option
                        v-for="item in effectiveList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-select v-model="searchData.feedback" size="small" clearable placeholder="反馈" style="width:80px;margin:5px 10px 5px 0px;float:left;">
                      <el-option
                        v-for="item in feedbackList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <span style="float:left;line-height:32px;font-size:13px;margin:5px;">排序：</span>
                    <el-select v-model="searchData.sort" size="small" placeholder="排序" style="width:100px;margin:5px 10px 5px 0px;float:left;">
                      <el-option
                        v-for="item in sortList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-button class="item-input" size="small" type="primary" icon="el-icon-search" @click="searchResult" style="margin:5px 10px 5px 0px;float:left;">查询</el-button>
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
                            <el-button type="primary" size="small" class="editorNote" :disabled="isDisabled" v-if="menuButtonPermit.includes('Enphone_othereditall')" v-on:click="editPageNote()"><i class="svg-i" ><svg-icon icon-class="editorNote" /></i>修改当前页备注</el-button>
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
                class="SiteTable"
                style="width: 100%"
                v-bind:style="'min-height:'+minHeight+'px;'"
                row-key="id"
                >
                <el-table-column
                  prop="id"
                  label="ID"
                  width="80"
                  >
                </el-table-column>
                <el-table-column
                  prop="xuntime"
                  label="时间"
                  width="200"
                  >
                  <template slot-scope="scope">
                    <div class="table-text">
                      <p>时段：{{scope.row.timeing}}</p>
                      <p>星期：{{scope.row.weekday}}</p>
                      <p>本地：{{scope.row.xuntime}}</p>
                      <p>当地：{{scope.row.foreigntime}}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="sourcename"
                  label="来源网站"
                  width="150"
                  >
                  <template slot-scope="scope">
                    <div class="table-text">
                      <p v-if="scope.row.domain"><a :href="scope.row.url" target="_blank">{{scope.row.domain}}</a></p>
                      <p>{{scope.row.sourcename}}</p>
                      <p>{{scope.row.messagetype}}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="sourcename"
                  label="大洲/地区/IP"
                  width="150"
                  >
                  <template slot-scope="scope">
                    <div class="table-text">
                      <p><span>大洲：</span>{{scope.row.continent}}</p>
                      <p><span>国家：</span>{{scope.row.country}}</p>
                      <p><span>来路：</span><a :href="'https://www.ip138.com/iplookup.asp?ip='+scope.row.ip+'&action=2'" target="_blank" v-if="scope.row.ip">IP</a></p>
                      <p><span>设备：</span>{{scope.row.device}}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="keyproduct"
                  label="类型/产品"
                  min-width="150"
                  >
                  <template slot-scope="scope">
                    <div class="table-text">
                      <p><span>产品：</span><span :style="'font-weight:bold;color:'+scope.row.producttypecolor">{{scope.row.producttypename}}</span>/{{scope.row.keyproduct}}</p>
                      <p><span>物料：</span>{{scope.row.material}}</p>
                      <p><span>产量：</span>{{scope.row.production}}</p>
                      <p><span>进料：</span>{{scope.row.infeed}}</p>
                      <p><span>出料：</span>{{scope.row.outfeed}}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="effective"
                  label="有效/原因"
                  width="100"
                  >
                  <template slot-scope="scope">
                    <div class="table-tag" style="text-align:center;"><el-checkbox v-model="scope.row.isEffective" disabled></el-checkbox></div>
                    <div class="table-text" v-if="!scope.row.isEffective"><p>{{scope.row.invalidcause}}<span style="color:#E88401;">{{scope.row.noeffectivetime}}</span></p></div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="levelname"
                  label="首次级别/二次判定"
                  min-width="140"
                  >
                  <template slot-scope="scope">
                    <div class="table-text">
                      <p class="table-tag"><span>初次：</span><span class="level"  @click="handleCustormeditlogClick(scope.row.id)" :class="'level-'+scope.row.level_id">{{scope.row.levelname}}</span></p>
                      <p><span>性质：</span>{{scope.row.ennaturename?scope.row.ennaturename:'未判定'}}</p>
                      <p><span>需求：</span>{{scope.row.enxunpricename?scope.row.enxunpricename:'未判定'}}</p>
                      <p><span>状态：</span>{{scope.row.managestatus==1?'':'已开始处理'}}</p>
                      <p><span>异常：</span>{{scope.row.erroring}}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="xunremark"
                  label="备注"
                  min-width="100"
                  >
                </el-table-column>
                <el-table-column
                  prop="addusername"
                  label="添加人"
                  width="120"
                  >
                  <template slot-scope="scope">
                    <div class="table-text">
                      <p><span>添：</span>{{scope.row.addusername}}</p>
                      <p><span>分：</span>{{scope.row.allotusername}}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="hassale"
                  label="业务员"
                  width="100"
                  >
                </el-table-column>
                <el-table-column
                  prop="addtime"
                  label="添/分/改/业务时间"
                  width="160"
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
                  prop="score"
                  label="价值分"
                  min-width="80"
                  >
                  <template slot-scope="scope">
                    <div class="table-score"><span>{{scope.row.score}}</span></div>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="writepermit&&(permitField.includes('remark1')||permitField.includes('remark2')||permitField.includes('remark3'))"
                  key="d"
                  prop="searchword"
                  label="备注"
                  min-width="90"
                  fixed="right"
                  >
                  <template slot-scope="scope">
                    <div class="table-input">
                      <el-input size="small" v-model="scope.row.remark1" v-if="permitField.includes('remark1')"></el-input>
                      <el-input size="small" v-model="scope.row.remark2" v-if="permitField.includes('remark2')"></el-input>
                      <el-input size="small" v-model="scope.row.remark3" v-if="permitField.includes('remark3')"></el-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="writepermit&&(menuButtonPermit.includes('Enphone_otheredit'))&&device==='desktop'"
                  width="88"
                  align="center"
                  prop="operations"
                  fixed="right"
                  label="修改">
                  <template #default="scope">
                    <div class="table-button">
                      <el-button size="mini" @click="editTableInputRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Enphone_otheredit')">修改</el-button>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="writepermit&&(menuButtonPermit.includes('Enphone_edit'))&&device==='desktop'"
                  :width="operationsWidth"
                  align="center"
                  prop="operations"
                  fixed="right"
                  label="操作">
                  <template #default="scope">
                    <div class="table-button">
                      <el-button size="mini" @click="editTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Enphone_edit')">修改</el-button>
                      <span class="edit-times" v-on:click="jumpEditHistoryPage(scope.row.id)">({{scope.row.eidtnumber}})</span>
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
            <el-button :loading="downloadLoading" type="primary" icon="el-icon-document" @click="handleLockClick">确定</el-button>
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
      minHeight:0,
      phoneID:null,
      currentPhone:'',
      writepermit:false,
      menuButtonPermit:[],
      defaultData:{
        custormwarn:[],
        saleswarning:[],
      },
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
      },
      pageSizeList:[20, 500, 5000, 10000],
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
        {label:"本地时间",value:"xuntime"},
        {label:"价值分",value:"score"},
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
      formLabelWidth:"110px",
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
      if($this.$route.query.phoneID){
       $this.minHeight = $this.$refs.mainPane.offsetHeight-$this.$refs.headerPane.offsetHeight-75; 
      }
    });
    if($this.$route.query.phoneID){
      window.onresize = () => {
        return (() => {
          $this.minHeight = $this.$refs.mainPane.offsetHeight-$this.$refs.headerPane.offsetHeight-75; 
        })()
      }
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
        if(this.$route.query.phoneID){
          this.phoneID = parseInt(this.$route.query.phoneID);
          this.searchData.waitstatus = parseInt(this.$route.query.waitstatus);
        }else{
          this.phoneID = null;
          this.searchData.waitstatus=1;
        }
        this.initData();
      },
  },
  created(){
    var $this = this;
    if($this.$route.query.phoneID){
      $this.phoneID = parseInt($this.$route.query.phoneID);
      $this.searchData.waitstatus = parseInt($this.$route.query.waitstatus);
    }else{
      $this.phoneID = null;
      $this.searchData.waitstatus=1;
    }
    $this.initData();
  },
  updated(){
    var $this =this;
    if($this.phoneID){
      $this.$nextTick(() => {
        $this.minHeight = $this.$refs.mainPane.offsetHeight-$this.$refs.headerPane.offsetHeight-75; 
        $this.$refs.simpleTable.doLayout();
      })
    }
  },
  methods:{
    // 搜索结果
    searchResult(){
      var $this = this;
      $this.initCluesList();
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.$store.dispatch('enphone/cluesPhoneIndexDataAction', null).then(response=>{
        if(response){
          if(response.status){
            var departnumberArr=[];
            var totalObj={              
              user: "总数",
              depart: "总数",
              lastdaycount:response.alllastnumber,
              monthcount:response.allnumber,
              todaycount:response.alltodaynumber,
            }
            departnumberArr.push(totalObj);
            response.departnumber.forEach(function(item){
                item.user=item.depart;
                item.lastdaycount=item.lastdaynumber;
                item.monthcount=item.monthnumber;
                item.todaycount=item.todaynumber;
                departnumberArr.push(item);
            });
            var departcountArr=[];          
            var departcountObj={
              dept_id:0,
              name: "总数",
              isOn:true,
              ulist: departnumberArr
            }
            departcountArr.push(departcountObj);
            response.departcount.forEach(function(item){
                item.isOn=false;
                departcountArr.push(item);
            });
            var departcountUlist=[];
            departcountArr.forEach(function(item){
              if(item.dept_id==0){
                departcountUlist=item.ulist;
              }
            });
            $this.departcountUlist = departcountUlist;
            $this.defaultData = response;
            $this.defaultData.departcountArr = departcountArr;
            console.log(response,"电话信息");
            console.log($this.departcountUlist,"$this.departcountUlist");
            var brand = "";
            if($this.$route.query.phoneID){
              $this.defaultData.data.forEach(function(item,index){
                brand = item.brandname;
                item.phone.forEach(function(item1,index1){
                  if(item1.id == $this.phoneID&&item1.waitstatus==$this.searchData.waitstatus){
                    item1.isOn = true;
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
              $this.getCurrentPhoneSearchData();
            }
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
      searchData.phoneid = $this.phoneID;
      searchData.waitstatus = $this.searchData.waitstatus;
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
      var searchData = $this.initSearchData();
      $this.$store.dispatch('enphone/cluesCurrentPhoneDataAction', searchData).then(response=>{
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
            console.log(response,"询盘信息");
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
          }
        }
      });
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        console.log(res);
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
              $this.initPage();
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
      var queryObj = {};
      queryObj.phoneID = id;
      queryObj.waitstatus = waitstatus;
      this.$router.push({page:'Enphone/phoneindex',query:queryObj});
    },
    // 获取当前电话的搜索条件数据
    getCurrentPhoneSearchData(){
      var $this = this;
      $this.$store.dispatch('enphone/cluesCurrentPhoneSearchDataAction', {phoneid:$this.phoneID}).then(response=>{
        if(response){
          if(response.status){
            console.log(response,"搜索条件信息");
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
    // 修改询盘
    editTableRow(row,index){
      var $this = this;
      if($this.device==="desktop"){
        var routeUrl =  $this.$router.resolve({path:'/Enphone/addEditClues',query:{ID:row.id}});
        window.open(routeUrl.href,'_blank');
      }
    },
    // 提醒跳转到编辑页面
    jumpEditPage(id){
      var $this = this;
      if($this.device==="desktop"){
        var routeUrl =  $this.$router.resolve({path:'/Enphone/addEditClues',query:{ID:id}});
        window.open(routeUrl.href,'_blank');
      }
    },
    // 跳转询盘修改历史页面
    jumpEditHistoryPage(id){
      var $this = this;
      if($this.device==="desktop"){
        var routeUrl =  $this.$router.resolve({path:'/Enphone/editHistoryLog',query:{ID:id}});
        window.open(routeUrl.href,'_blank');
      }
    },
    // 搜索统计数据跳转
    searchStatisticsData(){
      var $this = this;
      if($this.device==="desktop"){
        var routeUrl =  $this.$router.resolve({path:'/Enphone/searchClues'});
        window.open(routeUrl.href,'_blank');
      }else{
        $this.$router.push({path:'/Enphone/searchClues'});
      }
    },
    // 统计分析跳转
    statisticsClues(){
      var $this = this;
      if($this.device==="desktop"){
        var routeUrl =  $this.$router.resolve({path:'/Enphone/statisticClues'});
        window.open(routeUrl.href,'_blank');
      }else{
        $this.$router.push({path:'/Enphone/statisticClues'});
      }
    },
    // 导出当前页数据
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '时段','星期','询盘时间','域名','链接','渠道', '来源类型', '大洲', '国家','IP','设备', '产品分类','意向产品','物料','产量','进料','出料','有效','无效原因','初次等级','性质','需求','其他','异常','备注','添加人','分配人','业务员','添加时间','分配时间','修改时间','业务时间','价值分', '备注1','备注2',  '备注3']
        const list = this.tableData
        const data = [];
        list.forEach(function(item,index){
          var itemData = [];
          itemData.push(item.id);
          itemData.push(item.timeing);
          itemData.push(item.weekday);
          itemData.push(item.xuntime);
          itemData.push(item.domain);
          itemData.push(item.url);
          itemData.push(item.sourcename);
          itemData.push(item.messagetype);
          itemData.push(item.continent);
          itemData.push(item.country);
          itemData.push(item.ip);
          itemData.push(item.device);
          itemData.push(item.producttypename);
          itemData.push(item.keyproduct);
          itemData.push(item.custormemail);
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
      console.log(resultData,"批量修改提交数据");
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
            console.log(response,"字段权限");
            $this.permitField = response.data;
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
    // 当前产品分类改变触发事件
    currentCateChange(e){
        var $this = this;
        if(e){
          $this.searchData.productid = "";
          $this.$store.dispatch('enphone/getCurrentCateProductListAction', {typeid:e}).then(response=>{
              if(response){
                  if(response.status){
                      console.log(response,"搜索条件信息phoneindex");
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
      $this.$store.dispatch('chinaphone/CustormeditlogAction', FormID).then(response=>{
        if(response){
          if(response.status){  
            console.log(response,'级别修改记录-response');  
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
      var topdepart = $this.defaultData.departcountArr;
      topdepart.forEach(function(item){
        if(item.dept_id == Tid){
          item.isOn = true;
          var departcountUlist=[];
          departcountUlist=item.ulist;
          $this.departcountUlist = departcountUlist;
        }else{
          item.isOn = false;
        }
      });
      console.log($this.departcountUlist,'$this.departcountUlist');
    },  
  }
}
</script>
<style lang="scss" scoped>
</style>
