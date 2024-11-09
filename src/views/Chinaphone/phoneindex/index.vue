<template>
  <div class="page-root flex-box no-padding cn-phone-index" ref="boxPane">
    <div class="sub-router">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <div class="sub-wrapper">
          <div class="side-button">
            <router-link v-if="menuButtonPermit.includes('Chinaphone_search')" :to="{path:'/Chinaphone/searchClues'}">
              <el-button type="primary" plain size="mini" ><i class="svg-i" ><svg-icon icon-class="serch_en" /></i>搜索数据</el-button>
            </router-link>
            <router-link v-if="menuButtonPermit.includes('Chinaphone_countlist')" :to="{path:'/Chinaphone/statisticChart'}" >
              <el-button type="primary" plain size="mini"><i class="svg-i" ><svg-icon icon-class="analy_en" /></i>统计分析</el-button>
            </router-link>    
          </div>
          <dl class="phone-list" v-for="(item,index) in phoneList" v-bind:key="index">
            <dt><span>{{item.name}}</span></dt>
            <dd v-for="phone in item.phone" class="tipphone" v-bind:class="phone.isOn?'active':''" :key="phone.id">           
                <el-tooltip placement="right" class="el-tooltip" effect="light">
                  <div slot="content">
                    <span v-if="phone.phonenumber&&phone.phonenumber!=''">电话：{{phone.phonenumber}}</span><br v-if="phone.othername&&phone.othername!=''" />
                    <span v-if="phone.othername&&phone.othername!=''">别名：{{phone.othername}}</span><br v-if="phone.departname&&phone.departname!=''" />
                    <span v-if="phone.departname&&phone.departname!=''">部门：{{phone.departname}}</span><br v-if="phone.user&&phone.user!=''" />
                    <span v-if="phone.user&&phone.user!=''">负责人：{{phone.user}}</span>
                  </div>
                  <el-button>
                    <router-link :to="{page:'Chinaphone/phoneindex',query:{phoneID:phone.id}}">
                      <span>{{phone.shortPhonenumber}}</span><i>({{phone.nowmonthnumber}})</i><em>({{phone.lastdaynumber}})</em><b>({{phone.nownumber}})</b> 
                    </router-link>
                  </el-button>
                </el-tooltip>
            </dd>
          </dl>
        </div>
      </el-scrollbar>
    </div>
    <div class="flex-content relative">
      <div class="abs-panel" ref="mainPane">
        <div class="scroll-panel" ref="scrollDom" style="will-change:scroll-position"> 
          <div class="phone-index" v-if="!phoneID">
            <div class="ChinaphoneNum" ref="numPane">
              <div class="card-header chcard-header">
                <h2>{{currentTeam}}</h2>
                <p class="ChinaphoneNumTag">
                    <span class="item-clues" v-for="item in topdepart" v-bind:class="item.isOn?'active':''" v-bind:key="item.id" v-on:click="topdepartClick(item.id,item.name,item.isOn)">{{item.name}}</span>
                </p>
              </div>
              <div class="card-content ChinaphoneNumBom" >
                <div class="ChinaphoneNumItem">
                  <div class="item-number">
                    <dl>
                      <dt>今天</dt>
                      <dd>{{defaultData.alltodaynumber}}</dd>
                    </dl>
                  </div>
                  
                  <div class="item-number">
                    <dl>
                      <dt>昨天</dt>
                      <dd>{{defaultData.alllastnumber}}</dd>
                    </dl>
                  </div>
                  <div class="item-number">
                    <dl>
                      <dt>本月</dt>
                      <dd>{{defaultData.allnumber}}</dd>
                    </dl>
                  </div>
                  <div class="item-number" v-bind:class="defaultData.allnumber>defaultData.lastmonthnumber?'rise':defaultData.allnumber<defaultData.lastmonthnumber?'down':'flat'">
                    <dl>
                      <dt>上月同期<i class="svg-i" v-if="defaultData.allnumber!=defaultData.lastmonthnumber"><svg-icon :icon-class="defaultData.allnumber>defaultData.lastmonthnumber?'rise':'down'" /></i><i class="flat-icon" v-else></i></dt>
                      <dd>{{defaultData.lastmonthnumber}}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div class="ChinaphoneMap" v-bind:style="'min-height:'+minHeight+'px;'" v-loading="chartLoading">
              <el-card class="box-card canvas-card flex-box" shadow="hover" v-bind:style="'min-height:'+(minHeight-60)+'px;'">
                <div class="card-header">
                     <h2>{{currentTeam}}询盘趋势</h2>
                     <div class="ChinaphoneMapDate">
                        <el-date-picker
                          v-model="timeChart"
                          type="daterange"
                          class="date-range"
                          align="right"
                          size="small"
                          unlink-panels
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          value-format = "yyyy-MM-dd"
                          @change="getCluesChartData"
                          :picker-options="pickerOptions">
                        </el-date-picker>
                     </div>
                </div>
                <div class="card-content ChinaphoneMapChart">
                  <div class="canvas-wrap">
                    <echart-days :enquirie-chart="defaultData.cluesChartData"></echart-days>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
          <div class="true-height" v-else ref="scrollPane">
            <el-card class="box-card scroll-card EnphoneCardFrDate" shadow="hover">
              <div slot="header">
                <div class="card-header EnphoneCardHeader" ref="headerPane">
                    <h2 class="clues-title">当前信息：{{currentPhone}}</h2>
                    <div class="search-wrap">
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
                            @change="timeSearch"
                            size="small"
                            :picker-options="pickerRangeOptions"
                            :class="searchData.date&&searchData.date.length>0?'el-xzstate':''">
                        </el-date-picker>
                      </div>
                      <div class="item-search" style="width: 150px;">
                        <el-input
                          placeholder="域名、备注等"
                          class="tips-input-1"
                          size="small"
                          v-model="searchData.name"
                          @keyup.enter.native="searchResult"
                          :class="searchData.name!=''?'el-xzstate':''"
                          clearable>
                        </el-input>
                      </div>
                      <div class="item-search" style="width: 100px;">
                        <el-select v-model="searchData.mode" size="small" clearable placeholder="渠道" :class="searchData.mode!=''?'el-xzstate':''">
                          <el-option
                              v-for="item in sourceList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                      <div class="item-search" style="width: 100px;">
                        <el-select v-model="searchData.typekey" size="small" clearable placeholder="分类" :class="searchData.typekey!=''?'el-xzstate':''">
                          <el-option
                              v-for="item in productTypeList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                      <div class="item-search" style="width: 80px;">
                        <el-select v-model="searchData.level_id" size="small" clearable placeholder="级别" :class="searchData.level_id!=''?'el-xzstate':''">
                          <el-option
                              v-for="item in levelList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                      <div class="item-search">
                        <el-checkbox v-model="searchData.is_core" label="核心产品" border size="small"></el-checkbox>
                      </div>
                      <div class="item-search" style="width: 100px;">
                        <el-select v-model="searchData.userid" size="small" filterable clearable placeholder="提供者" :class="searchData.userid!=''?'el-xzstate':''">
                          <el-option
                            v-for="item in userList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                      <div class="item-search" style="width: 80px;">
                        <el-select v-model="searchData.device" size="small" clearable placeholder="设备" :class="searchData.device!=''?'el-xzstate':''">
                          <el-option
                            v-for="item in deviceList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                      <div class="item-search" style="width: 80px;">
                        <el-select v-model="searchData.effective" size="small" clearable placeholder="价值" :class="searchData.effective!=''?'el-xzstate':''">
                          <el-option
                            v-for="item in effectiveList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                      <div class="item-search" style="width: 120px;">
                        <el-select v-model="searchData.hasquality" size="small" clearable placeholder="质量判定情况" :class="searchData.effective!=''?'el-xzstate':''">
                          <el-option
                            v-for="item in hasQualityList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                      <div class="item-search" style="width: 120px;">
                        <el-select v-model="searchData.qualityscore" size="small" clearable placeholder="质量判定分数" :class="searchData.effective!=''?'el-xzstate':''">
                          <el-option
                            v-for="item in qualityScoreList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                      <div class="item-search">
                        <el-button class="item-input"  :class="isSearchResult?'isDisabled':''" :disabled="isSearchResult" size="small" type="primary" icon="el-icon-search" @click="searchResult">查询</el-button>
                        <el-button type="info" class="resetBtn" size="small" v-on:click="resetData()">重置</el-button>
                      </div>
                    </div>
                    <div class="clues-info flex-box">
                        <div class="clues-infoFl flex-content">
                              <p><span>共有<strong class="color1">{{infoData.totalCount}}</strong>条信息，有效<strong class="color2">{{infoData.effectiveCount}}</strong>条，无效<strong class="color3">{{infoData.invalidCount}}</strong>条，已判定<strong class="color2">{{infoData.hasqualitynumber}}</strong>条，未判定<strong class="color3">{{infoData.noqualitynumber}}</strong>条，总质量分<strong class="color2">{{infoData.qualityscore}}</strong>分，平均质量分<strong class="color2">{{infoData.avaragescore}}</strong>分。</span><span>||</span><span>本月共有<strong class="color1">{{infoData.totalCountMonth}}</strong>条信息，有效<strong class="color2">{{infoData.effectiveCountMonth}}</strong>条，无效<strong class="color3">{{infoData.invalidCountMonth}}</strong>条，质量分<strong class="color2">{{infoData.nowqualityscore}}</strong>分。</span></p>
                        </div>
                        <div class="clues-title-btn">
                            <el-button type="primary" size="small" class="derived" :disabled="isDisabled" v-if="menuButtonPermit.includes('Chinaphone_listexport')" @click="dialogExportVisible = true"><i class="svg-i" ><svg-icon icon-class="derived" /></i>导出数据</el-button>
                            <el-button type="primary" size="small" class="editorNote" :disabled="isDisabled" v-if="writepermit&&menuButtonPermit.includes('Chinaphone_othereditall')" v-on:click="editPageNote()"><i class="svg-i" ><svg-icon icon-class="editorNote" /></i>修改当前页备注</el-button>
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
                        row-key="id"
                        :style="'min-height:'+minHeight+'px;'"
                        >
                        <el-table-column
                          prop="id"
                          label="ID/电话"
                          min-width="120"
                          >
                          <template slot-scope="scope">
                            <div class="table-text">
                              <p><span class="txt-title">ID：</span><span style="display:inline-block;">{{scope.row.id}}</span></p>
                              <p><span class="txt-title">电话：</span><span style="display:inline-block;">{{scope.row.phonenumber}}</span></p>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="xuntime"
                          label="添加/询盘时间"
                          min-width="90"
                          >
                          <template slot-scope="scope">
                            <div class="table-text">
                              <p>{{scope.row.addtime}}</p>
                              <p>{{scope.row.xuntime}}</p>
                              <p>{{scope.row.weekday}}</p>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="sourcename"
                          label="域名/渠道/地区/归属地"
                          min-width="130"
                          >
                          <template slot-scope="scope">
                            <div class="table-text">
                              <p><a :href="scope.row.url" target="_blank" :title="scope.row.url">{{scope.row.domain}}</a></p>
                              <p>{{scope.row.sourcename}}</p>
                              <p>{{scope.row.province}}<span v-if="scope.row.province&&scope.row.city">/</span>{{scope.row.city}}</p>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="keyproduct"
                          label="意向设备"
                          min-width="120"
                          >
                          <template slot-scope="scope">                            
                            <span class="product-span level_star"><i v-if='scope.row.productlevel>0&&scope.row.productlevel<3'><svg-icon icon-class="star" /></i>{{scope.row.keyproduct}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="qualityscore"
                          sortable
                          label="添加人/有效/质量分"
                          min-width="110"
                          align="center"
                          >
                          <template slot-scope="scope">
                            <div>
                              <div class="table-text">
                                <p style="text-align:center;">{{scope.row.addusername}}</p>
                              </div>
                              <div class="table-tag" style="text-align:center;margin: 5px auto;"><el-checkbox v-model="scope.row.isEffective" disabled></el-checkbox></div>
                              <!-- <div class="table-tag" style="text-align:center;"><span class="level" @click="handleCustormeditlogClick(scope.row.id)" :class="'level-'+scope.row.level_id">{{scope.row.levelname}}</span></div> -->
                              
                              <el-popover
                                placement="right"
                                trigger="hover"
                                @show="popoverShow(scope.row.id)"
                                :popper-class="popContent.length > 0 ? '' : 'pop-quality-hide'"
                                >
                                <div class="pop-box">
                                  <p class="pop-time" v-if="popTime"><span class="tit">判定时间：</span>{{popTime}}</p>
                                  <div class="pop-cont">
                                    <span class="tit">具体情况：</span>
                                    <ul class="pop-ul" v-if="popContent.length > 1">
                                      <li class="pop-p" v-for="item,index in popContent" :key="item"><span class="num">{{index+1}}、</span><span class="cont">{{item}}</span></li>
                                    </ul>
                                    <ul class="pop-ul" v-else>
                                      <li class="pop-p" v-for="item,index in popContent" :key="item">{{item}}</li>
                                    </ul>
                                  </div>
                                  
                                </div>
                                
                                <div class="table-tag table-score" slot="reference" > 
                                  <span v-if="scope.row.hasquality == 2">
                                    {{scope.row.qualityscore}}
                                  </span>
                                </div>
                              </el-popover>


                              <!-- <div class="table-tag" style="text-align:center; color: #f73a3e; font-weight: bold">{{scope.row.qualityscore}}</div> -->
                              
                              <div class="table-tag" style="text-align:center;margin-top:5px" v-if="menuButtonPermit.includes('Chinaphone_chinaqualityconfirmedit') || menuButtonPermit.includes('Chinaphone_chinaqualityconfirm')">
                                <el-button size="mini" @click="qualityJudge(scope.row)">质量判定</el-button>
                              </div>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="levelname"
                          label="备注/原因/无效原因"
                          min-width="140"
                          >
                          <template slot-scope="scope">
                            <div class="table-text">
                              <p>{{scope.row.custormcause}}</p>
                              <p>{{scope.row.custormremark}}</p>
                              <p class="redTip" v-if="!scope.row.isEffective">无效原因：{{scope.row.invalidcause}}</p>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column
                          v-if="writepermit&&(permitField.includes('domain')||permitField.includes('url')||permitField.includes('searchword'))"
                          key="a"
                          fixed="right"
                          prop="url"
                          label="域名/链接/关键词"
                          width="150"
                          >
                          <template slot-scope="scope">
                            <div class="table-input">
                              <el-input size="small" v-model="scope.row.domain" v-if="permitField.includes('domain')"></el-input>
                              <el-input size="small" v-model="scope.row.url" v-if="permitField.includes('url')"></el-input>
                              <el-input size="small" v-model="scope.row.searchword" v-if="permitField.includes('searchword')"></el-input>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column
                          v-if="writepermit&&(permitField.includes('search')||permitField.includes('userid')||permitField.includes('device'))"
                          key="b"
                          fixed="right"
                          prop="searchword"
                          label="平台/提供者/设备"
                          width="130"
                          >
                          <template slot-scope="scope">
                            <div class="table-input">
                              <el-autocomplete size="small" v-model="scope.row.search"    
                                        :fetch-suggestions="searchQuerySearch"
                                        :trigger-on-focus="false"
                                        v-if="permitField.includes('search')"></el-autocomplete>
                              <el-input size="small" v-model="scope.row.useridname" v-if="permitField.includes('userid')"></el-input>
                              <el-input size="small" v-model="scope.row.device" v-if="permitField.includes('device')"></el-input>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column
                          v-if="writepermit&&permitField.includes('remark')"
                          key="c"
                          fixed="right"
                          prop="remark"
                          label="备注/其他"
                          width="120"
                          >
                          <template slot-scope="scope">
                            <div class="table-input cnClues">
                              <el-input size="small" type="textarea" rows="5" resize="none" v-model="scope.row.remark" v-if="permitField.includes('remark')"></el-input>
                              <el-input size="small" type="textarea" class="remark2" rows="2" resize="none" v-model="scope.row.remark2" v-if="permitField.includes('remark2')"></el-input>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column
                          v-if="writepermit&&(menuButtonPermit.includes('Chinaphone_edit')||menuButtonPermit.includes('Chinaphone_delete')||menuButtonPermit.includes('Chinaphone_otheredit'))"
                          width="88"
                          align="center"
                          fixed="right"
                          prop="operations"
                          label="操作">
                          <template #default="scope">
                            <div class="table-button">
                              <el-button size="mini" @click="editTableInputRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Chinaphone_otheredit')">修改</el-button>
                              <router-link class="editBtn" :to="{path:'/Chinaphone/addEditClues',query:{ID:scope.row.id}}" v-if="menuButtonPermit.includes('Chinaphone_edit')">
                                <el-button size="mini">编辑</el-button>
                              </router-link>
                              <el-button size="mini" @click="deleteTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Chinaphone_delete')">删除</el-button>
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
    <!-- 询盘线索质量判定 -->
    <el-dialog title="询盘线索质量判定" custom-class="quality-dialog" :visible.sync="qualityDecision" width="1100px" :top="showOld ? '18px' : '46px'">
        <div class="top_quality_select" v-if="showOld">
          <el-radio-group v-model="typeValue" size="medium">
            <el-radio-button v-for="item in typeList" :label="item.value" :key="item.value">{{item.label}}</el-radio-button>
          </el-radio-group>
        </div>
        <div class="quality_content" ref="quality_content" v-if="typeValue == 2">
          <div class="quality_title">
            <div class="title_type">多选</div>
            <div class="title_content">具体情况</div>
          </div>
          <div class="content_selection">
            <div class="quality-selection">
              <el-checkbox-group v-model="qualityMultiChoosed" @change="qualityChooseChange">
                <el-checkbox v-for="item in qualityMultiOptions" :key="item.id" :label="item.id" :disabled="item.disabled">
                  {{item.content}}
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="quality-remark">
              <div v-for="item in qualityMultiOptions" :key="item.id" :label="item.id" :class="item.slength > 0 ? 'normal-div the-same'+item.slength : 'normal-div' ">
                <span v-if="item.slength > 0">{{item.slength}}选1</span>
              </div>
            </div>
          </div>
          <div class="quality_title">
            <div class="title_type">单选</div>
            <div class="title_content">具体情况</div>
          </div>
          <div class="quality-selection">
            <el-radio-group v-model="qualitySingleChoosed" @change="qualitySingleChange">
              <el-radio v-for="item in qualitySingleOptions" :key="item.id" :label="item.id" :disabled="item.disabled">
                {{item.content}}
              </el-radio>
            </el-radio-group>
          </div>
        </div>

        <div class="old_has_select" v-if="typeValue == 1">
          <div class="quality_title">具体情况</div>
          <div class="old_item" v-for="item in qualityHasOldData" :key="item.pid">
            {{item.content}}
          </div>
        </div>
        
        <template #footer>
          <span class="dialog-footer" v-show="typeValue == 2">
            <el-button size="small" @click="qualityDecision = false">取 消</el-button>
            <el-button type="primary" size="small" :class="isSaveData?'isDisabled':''" :disabled="isSaveData" @click="qualityDecide">确定</el-button>
          </span>
        </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import echartDays from "../components/echartDays";
export default {
  name: 'Chinaphone_phoneindex',
  data() {
    return {
      minHeight:"auto",
      breadcrumbList:[],
      phoneID:null,
      currentPhone:'',
      writepermit:false,
      menuButtonPermit:[],
      defaultData:{
        cluesChartData:[],
        avgnumber:0,
        alltodaynumber:0,
        alllastnumber:0,
        allnumber:0,
        lastmonthnumber:0,
      },
      phoneList:[],
      operationsWidth:"",
      tableData:[], 
      searchData:{
        date:[],
        name:"",
        page:1,
        limit:20,
        mode:"",
        typekey:'',
        level_id:'',
        productlevel:'',
        is_core:false,
        userid:'',
        device:'',
        effective:'',
        hasquality:'',
        qualityscore: '',
      },
      pageSizeList:[20,50,100,200,500],
      totalDataNum:0,
      pickerRangeOptions: this.$pickerRangeOptions,
      deviceList:[],
      productTypeList:[],
      sourceList:[],
      userList:[],
      levelList:[],
      effectiveList:[
        {label:"有效",value:1},
        {label:"无效",value:2},
      ],
      hasQualityList:[
        {label:"待判定",value:1},
        {label:"已判定",value:2},
      ],
      qualityScoreList: [
        {label:"0",value:"0"},
        {label:"0.1",value:"0.1"},
        {label:"0.2",value:"0.2"},
        {label:"0.3",value:"0.3"},
        {label:"0.4",value:"0.4"},
        {label:"0.5",value:"0.5"},
        {label:"0.6",value:"0.6"},
        {label:"0.7",value:"0.7"},
        {label:"0.8",value:"0.8"},
        {label:"0.9",value:"0.9"},
        {label:"1.0",value:"1.0"},
        {label:"1.1",value:"1.1"},
        {label:"1.2",value:"1.2"},
        {label:"1.3",value:"1.3"},
        {label:"1.4",value:"1.4"},
        {label:"1.5",value:"1.5"},
        {label:"1.6",value:"1.6"},
        {label:"1.7",value:"1.7"},
        {label:"1.8",value:"1.8"},
        {label:"1.9",value:"1.9"},
        {label:"2.0",value:"2.0"},
      ],
      infoData:{
        totalCount:0,
        effectiveCount:0,
        invalidCount:0,
        totalCountMonth:0,
        effectiveCountMonth:0,
        invalidCountMonth:0,
        nowqualityscore: 0,
        qualityscore: 0,
        avaragescore: 0,
        hasqualitynumber: 0,
        noqualitynumber: 0
      },
      cnAreaPlot:null,
      formLabelWidth:"120px",
      exportForm:{
        fileName:"",
        bookType:"xlsx"
      },
      dialogExportVisible:false,
      downloadLoading: false,
      permitField:[],
      isDisabled:true,
      topdepart:[],
      pickerOptions: this.$pickerRangeOptions,
      chartData:{
         dept_id:[],
         starttime:"",
         endtime:"",
      },
      currentDepartID: 0,
      department:[],
      timeChart:"",
      deptChart:"0",
      tableShow:true,      
      levelPop:[],  
      levelPopBool:false,
      scrollPosition:{
        width:0,
        left:0,
        fixedBottom: 20,
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
      currentTeam:"中文合计",
      chartLoading:false,
      isSearchResult:false,
      qualityDecision: false,//询盘质量判定弹窗
      qualityMultiOptions: [],//询盘多选意向情况
      qualitySingleOptions: [],//询盘单选意向情况
      qualityMultiChoosed: [],
      qualitySingleChoosed: 0,
      qualityOptions: [], // 询盘情况弹窗
      judgeOptions: [],
      totalScore: 0,
      qualityId : 0,
      isSaveData: false,
      isNewAdd: true,
      popContent: [],
      popTime: "",
      showOld: false, // 是否展示旧数据
      qualityHasOldData: [], //已选择旧数据
      typeValue: 1,
      typeList: [
        {
          label: "已有内容",
          value: 1
        },
        {
          label: "质量判定",
          value: 2
        }
      ],
    }
  },
  components:{
    echartDays,
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
    if(this.sidebar.opened){
      $this.$store.dispatch('app/toggleSideBar');
    }
    // 监听竖向滚动条滚动事件
    window.addEventListener('scroll',$this.handleScroll,true);
    $this.$nextTick(function () {     
      if($this.$route.query.phoneID){
        $this.setHeight();
      }else{
        if($this.$refs.mainPane&&$this.$refs.numPane){  
          // $this.minHeight = $this.$refs.mainPane.offsetHeight-$this.$refs.numPane.offsetHeight-$this.$refs.breadcrumbPane.offsetHeight-45-15; 
          $this.minHeight = $this.$refs.mainPane.offsetHeight-$this.$refs.numPane.offsetHeight-45-15; 
        }
        //$this.drawChart();
      }
    });
    window.onresize = () => {
      return (() => {
        if($this.$route.query.phoneID){
          $this.setHeight();
        }else{
          if($this.$refs.mainPane&&$this.$refs.numPane){
            // $this.minHeight = $this.$refs.mainPane.offsetHeight-$this.$refs.numPane.offsetHeight-$this.$refs.breadcrumbPane.offsetHeight-45-15; 
            $this.minHeight = $this.$refs.mainPane.offsetHeight-45-15; 
          }
        }
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
        if(this.$route.query.phoneID){
          this.phoneID = parseInt(this.$route.query.phoneID);
          this.$nextTick(function () {     
            this.setHeight();
          });
        }else{
          this.phoneID = null;
        }
        this.initData();
      },
      isOpen(e){       
        if(this.$route.query.phoneID){
          this.setHeight();
        }
      },
  },
  created(){
    var $this = this;
    if($this.$route.query.phoneID){
      $this.phoneID = parseInt($this.$route.query.phoneID);
    }else{
      $this.phoneID = null;
    }
    $this.getBreadcrumbList();
    $this.initData();
  },
  updated(){
    var $this =this;
    $this.$nextTick(() => {
      if($this.phoneID){
          $this.$refs.simpleTable.doLayout();
      }else{
        if($this.$refs.mainPane&&$this.$refs.numPane){
          // $this.minHeight = $this.$refs.mainPane.offsetHeight-$this.$refs.numPane.offsetHeight-$this.$refs.breadcrumbPane.offsetHeight-45-15;  
          $this.minHeight = $this.$refs.mainPane.offsetHeight-$this.$refs.numPane.offsetHeight-45-15;  
        }
      }
    })
  },
  destroyed(){
    window.removeEventListener('scroll', this.handleScroll,true);//监听页面滚动事件
  },
  methods:{
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
    // 设置高度
    setHeight(){
      var $this = this;
      $this.minHeight = 0;      
      var headerHeight = $this.$refs.headerPane.offsetHeight+45;
      // var breadcrumbHeight = $this.$refs.breadcrumbPane.offsetHeight;
      var screenHeight = $this.$refs.boxPane.offsetHeight;
      // $this.minHeight = screenHeight-headerHeight-breadcrumbHeight-40;
      $this.minHeight = screenHeight-headerHeight-40;
      $this.getBrowserType();
      setTimeout(function() {
          $this.setScrollDom();
      }, 400);
    },
    // 时间搜索
    timeSearch(){
      var $this = this;
      $this.searchResult();
    },
    // 搜索结果
    searchResult(){
      var $this = this;
      $this.searchData.page = 1;
      $this.initCluesList();
    },
    // 重置表单
    resetData(){
        var $this = this;
        $this.searchData.date=[];
        $this.searchData.name="";
        $this.searchData.page=1;
        $this.searchData.limit=20;
        $this.searchData.mode="";
        $this.searchData.typekey="";
        $this.searchData.level_id="";
        $this.searchData.productlevel="";
        $this.searchData.is_core=false;
        $this.searchData.userid="";
        $this.searchData.device="";
        $this.searchData.effective="";
        $this.searchData.hasquality="";
        $this.searchData.qualityscore="";
        $this.searchResult();    
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.searchData.page=1;
      $this.getUserMenuButtonPermit();
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      if($this.$route.query.phoneID){
        $this.getPhoneListNum();
      }else{
        $this.getPhoneInitData();
      }
    },
    // 获取电话列表初始化页面数据
    getPhoneInitData(){
      var $this = this;
      $this.$store.dispatch('chinaphone/cluesPhoneIndexDataAction', null).then(response=>{
        if(response){
          if(response.status){
            var cluesChartData=[];
            response.groupmonthtrend.forEach(function(item,index){
              var itemObj={};
              var itemTime=item.date.split('-');
              itemObj.name = itemTime[1]+'-'+itemTime[2]+"\n"+item.week.replace("星期","周");
              itemObj.value = item.xunnumber;
              cluesChartData.push(itemObj);
            });
            $this.defaultData.cluesChartData = cluesChartData;
            $this.defaultData.avgnumber = response.avgnumber;
            $this.defaultData.alltodaynumber = response.alltodaynumber;
            $this.defaultData.alllastnumber = response.alllastnumber;
            $this.defaultData.allnumber = response.allnumber;
            $this.defaultData.lastmonthnumber = response.lastmonthnumber;
            var phoneArr=response.data;
            phoneArr.forEach(function(item,index){
               item.phone.forEach(function(item01,index01){
                    var tagphone='-';
                    item01.isOn = false;
                    if(item01.phonenumber.indexOf(tagphone)!=-1){
                       item01.shortPhonenumber=item01.phonenumber.split("-")[1];
                    }else{
                      item01.shortPhonenumber=item01.phonenumber;
                    }
               });
            });
            $this.phoneList=phoneArr;
            var topdepart=[];
            var topdepartObj = {
              id:0,
              name:'中文合计',
              alllastday:response.alllastnumber,
              allnumber:response.allnumber,
              alltoday:response.alltodaynumber,
              lastmonthnumber:response.lastmonthnumber,
              isOn:true,
            };
            topdepart.push(topdepartObj);
            response.topdepart.forEach(function(item,index){
              var itemData = {};
              itemData.id = item.id;
              itemData.name = item.name;
              itemData.alllastday = item.alllastday;
              itemData.allnumber = item.allnumber;
              itemData.alltoday = item.alltoday;
              itemData.lastmonthnumber = item.lastmonthnumber;
              itemData.isOn=false;
              topdepart.push(itemData);
            });
            $this.topdepart=topdepart;
            $this.currentDepartID = "";
            //$this.drawChart();
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
    // 获取电话列表及电话统计数字
    getPhoneListNum(){
      var $this = this;
      $this.$store.dispatch('chinaphone/cluesPhoneStatDataAction', null).then(response=>{
        if(response){
          if(response.status){
            var phoneArr=response.data;
            phoneArr.forEach(function(item,index){
               item.phone.forEach(function(item01,index01){
                    var tagphone='-';
                    item01.isOn = false;
                    if(item01.phonenumber.indexOf(tagphone)!=-1){
                       item01.shortPhonenumber=item01.phonenumber.split("-")[1];
                    }else{
                      item01.shortPhonenumber=item01.phonenumber;
                    }
               });
            });
            $this.phoneList = phoneArr;
            if($this.$route.query.phoneID){
              $this.phoneList.forEach(function(item,index){
                item.phone.forEach(function(item1,index1){
                  if(item1.id == $this.phoneID){
                    $this.currentPhone = item1.phonenumber;
                    item1.isOn = true;
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
      if($this.searchData.mode&&$this.searchData.mode!=''){
        searchData.mode = $this.searchData.mode;
      }
      if($this.searchData.typekey&&$this.searchData.typekey!=''){
        searchData.typekey = $this.searchData.typekey;
      }
      if($this.searchData.level_id===0||($this.searchData.level_id&&$this.searchData.level_id!='')){
        searchData.level_id = $this.searchData.level_id;
      }
      if($this.searchData.productlevel&&$this.searchData.productlevel!=''){
        searchData.productlevel = $this.searchData.productlevel;
      }
      if($this.searchData.userid===0||($this.searchData.userid&&$this.searchData.userid!='')){
        searchData.userid = $this.searchData.userid;
      }
      if($this.searchData.device&&$this.searchData.device!=''){
        searchData.device = $this.searchData.device;
      }
      if($this.searchData.effective&&$this.searchData.effective!=''){
        searchData.effective = $this.searchData.effective;
      }
      if($this.searchData.hasquality&&$this.searchData.hasquality!=''){
        searchData.hasquality = $this.searchData.hasquality;
      }
      if($this.searchData.name&&$this.searchData.name!=''){
        searchData.name = $this.searchData.name;
      }
      if($this.searchData.date&&$this.searchData.date.length>0){
        searchData.starttime = $this.searchData.date[0];
        searchData.endtime = $this.searchData.date[1];
      }
      searchData.is_core = $this.searchData.is_core?1:0;
      searchData.qualityscore = $this.searchData.qualityscore;
      return searchData;
    },
    // 初始化询盘列表数据
    initCluesList(){
      var $this = this;
      if(!$this.isSearchResult){
        $this.isSearchResult=true;
        var searchData = $this.initSearchData();
        $this.$store.dispatch('chinaphone/cluesCurrentPhoneDataAction', searchData).then(response=>{
          if(response){
            if(response.status){
              var infoData = {};
              infoData.totalCount=response.allcount;
              infoData.effectiveCount=response.effectivecount;
              infoData.invalidCount=response.noeffectivecount;
              infoData.totalCountMonth=response.nowmonthnumber;
              infoData.effectiveCountMonth=response.noweffectivenumber;
              infoData.invalidCountMonth=response.nownoeffectivenumber;
              infoData.nowqualityscore = response.nowqualityscore > 0 ? response.nowqualityscore.toFixed(1) : 0;
              infoData.qualityscore = response.qualityscore > 0 ? response.qualityscore.toFixed(1) : 0;
              infoData.hasqualitynumber = response.hasqualitynumber;
              infoData.noqualitynumber = response.noqualitynumber;
              if(response.hasqualitynumber > 0){
                if(response.qualityscore == 0){
                  infoData.avaragescore =  0;
                }else{
                  infoData.avaragescore =  (response.qualityscore/response.hasqualitynumber).toFixed(2);
                }
              }else{
                infoData.avaragescore =  0;
              }
              if(response.data.length>0){
                response.data.forEach(function(item,index){
                  if(item.phonenumber.indexOf("-")!=-1){
                    item.phoneText = item.phonenumber.split("-")[1];
                  }else{
                    item.phoneText = item.phonenumber;
                  }
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
            if($this.menuButtonPermit.includes('Chinaphone_phoneindex')){
              var operationsWidth = 22;
              if($this.menuButtonPermit.includes('Chinaphone_edit')){
                operationsWidth+=66;
              }
              if($this.menuButtonPermit.includes('Chinaphone_delete')){
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
    phoneJump(id){
      var $this=this;
      if($this.cnAreaPlot&&!$this.cnAreaPlot.chart.destroyed){
        $this.cnAreaPlot.destroy();
      }
      var queryObj = {};
      queryObj.phoneID = id;
      $this.$router.push({page:'Chinaphone/phoneindex',query:queryObj});
    },
    // 获取当前电话的搜索条件数据
    getCurrentPhoneSearchData(){
      var $this = this;
      if($this.$route.query.phoneID){
        $this.phoneList.forEach(function(item,index){
          item.phone.forEach(function(item1,index1){
            if(item1.id == $this.phoneID){
              $this.currentPhone = item1.phonenumber;
              item1.isOn = true;
            }else{
              item1.isOn = false;
            }
          });
        });
        $this.$store.dispatch('chinaphone/cluesCurrentPhoneSearchDataAction', {phoneid:$this.phoneID}).then(response=>{
          if(response){
            if(response.status){
              var deviceList = [];
              response.device.forEach(function(item,index){
                var itemData = {};
                itemData.label = item.name;
                itemData.value = item.name;
                deviceList.push(itemData);
              });
              $this.deviceList = deviceList;
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
              response.userlist.forEach(function(item,index){
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
      }
    },
    // 每页显示条数改变事件
    handleSizeChange(val) {
      this.searchData.limit = val;
      this.searchData.page = 1;
      this.initPage();
    },
    // 当前页改变事件
    handleCurrentChange(val) {
      this.searchData.page = val;
      this.initPage();
    },
    // 修改询盘
    editTableRow(row,index){
      var $this = this;
      $this.$router.push({path:'/Chinaphone/addEditClues',query:{ID:row.id}});
    },
    // 搜索统计数据跳转
    searchStatisticsData(){
      var $this = this;
      $this.$router.push({path:'/Chinaphone/searchClues'});
    },
    // 统计分析跳转
    statisticsClues(){
      var $this = this;
      $this.$router.push({path:'/Chinaphone/statisticChart'});
    },
    // 导出当前页数据
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '电话','询盘时间','星期','域名','渠道', '地区', '城市', '意向设备','是否有效','无效原因','是否判定','质量分','添加人','添加时间', '等级', '客服备注','客服原因', '链接', '平台', '关键词', '电商备注', '提供者', '设备']
        const list = this.tableData
        const data = [];
        list.forEach(function(item,index){
          var itemData = [];
          itemData.push(item.id);
          itemData.push(item.phonenumber);
          itemData.push(item.xuntime);
          itemData.push(item.weekday);
          itemData.push(item.domain);
          itemData.push(item.sourcename);
          itemData.push(item.province);
          itemData.push(item.city);
          itemData.push(item.keyproduct);
          itemData.push(item.effective==1?'有效':'无效');
          itemData.push(item.invalidcause);
          itemData.push(item.hasquality==2?'已判定':'未判定');
          itemData.push(item.qualityscore);
          itemData.push(item.addusername);
          itemData.push(item.addtime);
          itemData.push(item.levelname);
          itemData.push(item.custormremark);
          itemData.push(item.custormcause);
          itemData.push(item.url);
          itemData.push(item.search);
          itemData.push(item.searchword);
          itemData.push(item.remark);
          itemData.push(item.useridname);
          itemData.push(item.device);
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
        itemData.domain = item.domain;
        itemData.url = item.url;
        itemData.remark = item.remark;
        itemData.search = item.search;
        itemData.searchword = item.searchword;
        if(item.device&&item.device!=''){
          var device = item.device.toUpperCase();
          if(device==="PC"||device==="M"){
            itemData.device = device;
          }else{
            itemData.device = null;
          }
        }else{
          itemData.device = null;
        }
        $this.userList.forEach(function(item1,index1){
          if(item1.label == item.useridname){
            itemData.userid = item1.value;
          }
        });
        resultData.push(itemData);
      });
      $this.$store.dispatch('chinaphone/cluesCurrentPhoneDataEleEditPageAction', resultData).then(response=>{
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
      resultData.phoneid = $this.phoneID;
      resultData.domain = row.domain;
      resultData.url = row.url;
      resultData.remark = row.remark;
      resultData.remark2 = row.remark2;
      resultData.search = row.search;
      resultData.searchword = row.searchword;
      if(row.device&&row.device!=''){
        var device = row.device.toUpperCase();
        if(device==="PC"||device==="M"){
          resultData.device = device;
        }else{
          resultData.device = null;
        }
      }else{
        resultData.device = null;
      }
      $this.userList.forEach(function(item,index){
        if(item.label == row.useridname){
          resultData.userid = item.value;
        }
      });
      $this.$store.dispatch('chinaphone/cluesCurrentPhoneDataEleEditAction', resultData).then(response=>{
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
          $this.$store.dispatch('chinaphone/cluesCurrentPhoneDataDeleteAction', {id:row.id}).then(response=>{
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
      $this.$store.dispatch('chinaphone/cluesCurrentPhoneUserCanEditFieldAction', null).then(response=>{
        if(response){
          if(response.status){
            $this.permitField = response.data;           
            if($this.$route.query.phoneID){
                $this.$nextTick(function () {
                  $this.setHeight();
                })
            }
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
    // 部门点击事件
    topdepartClick(Tid,name,isOn){
      var $this = this;
      if(isOn){
        return false;
      }
      var topdepart = $this.topdepart;
      $this.currentTeam = name;
      topdepart.forEach(function(item){
        if(item.id == Tid){
          item.isOn = true;
          $this.defaultData.alltodaynumber=item.alltoday;
          $this.defaultData.alllastnumber=item.alllastday;
          $this.defaultData.allnumber=item.allnumber;
          $this.defaultData.lastmonthnumber=item.lastmonthnumber;
        }else{
          item.isOn = false;
        }
      });
      $this.topdepart=topdepart;
      $this.currentDepartID = Tid;
      $this.getCluesChartData();
    },   
    // 图表曲线图数据获取
    getCluesChartData(){
      var $this = this;
      $this.chartLoading = true;
      if($this.cnAreaPlot&&!$this.cnAreaPlot.chart.destroyed){
        $this.cnAreaPlot.destroy();
      }
      if($this.timeChart&&$this.timeChart.length>0){
        $this.chartData.starttime = $this.timeChart[0];
        $this.chartData.endtime = $this.timeChart[1];
      }else{
        $this.chartData.starttime='';
        $this.chartData.endtime='';
      }
      $this.chartData.dept_id = $this.currentDepartID == 0?"":[$this.currentDepartID];
      $this.$store.dispatch('chinaphone/cluesPhoneChartDataAction', $this.chartData).then(response=>{
        if(response){
          if(response.status){
            var cluesChartData=[];
            response.groupmonthtrend.forEach(function(item,index){
              var itemObj={};
              var itemTime=item.date.split('-');
              itemObj.name = itemTime[1]+'-'+itemTime[2]+"\n"+item.week.replace("星期","周");
              itemObj.value = item.xunnumber;
              cluesChartData.push(itemObj);
            });
            $this.defaultData.cluesChartData = cluesChartData;
            $this.defaultData.avgnumber = response.avgnumber;
            $this.chartLoading = false;
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
    // 询盘级别修改记录
    handleCustormeditlogClick(Rid){
      var $this = this;
      var FormID={};
      FormID.id = Rid;
      $this.$store.dispatch('chinaphone/CustormeditlogAction', FormID).then(response=>{
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
    //渠道下拉框
    searchQuerySearch(queryString,cb){
      var $this = this;
      var resultData = {};
      var returnData = [];
      resultData.keywork = queryString;
      resultData.phoneid=$this.phoneID;
      $this.$store.dispatch("chinaphone/getkeywordAction", resultData).then(response=>{
          if(response.status){
            if(response.data.length>0){
              response.data.forEach(function(item){
                var itemData = {};
                itemData.value = item.name;
                returnData.push(itemData);
              });
            }
            cb(returnData);
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
    },
    handleLockClick(){
        var $this=this;
        $this.levelPopBool=!$this.levelPopBool;
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
        //  $this.scrollTable.fixedTopHeight = $this.$refs.headerPane.offsetHeight+$this.$refs.breadcrumbPane.offsetHeight+15+20+44;
         $this.scrollTable.fixedTopHeight = $this.$refs.headerPane.offsetHeight+10+44;
      }else{
        //  $this.scrollTable.fixedTopHeight=$this.$refs.breadcrumbPane.offsetHeight+15+20+44;
         $this.scrollTable.fixedTopHeight=10+44;
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
      $this.scrollTable.tableBottom = tableObj.height+$this.scrollTable.fixedTopHeight+$this.scrollTable.tableheaderHeight+54+30;
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
        $this.scrollTable.tableBottom = tableObj.height+$this.scrollTable.fixedTopHeight+54+30;
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
      if($this.$route.query.phoneID){      
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
            if($this.totalDataNum>20){
              if(scrTop+$this.scrollTable.clientHeight>=$this.scrollTable.tableBottom-20){
                $this.scrollPosition.fixedBottom = scrTop+$this.scrollTable.clientHeight-$this.scrollTable.tableBottom-10;
              }else{
                $this.scrollPosition.fixedBottom = 20;
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
    // 质量判定点击
    qualityJudge(data){
      var $this = this;
      $this.isSaveData = false;
      $this.qualityId = data.id;
      $this.typeValue = 2;
      $this.qualityMultiChoosed = [];
      $this.qualitySingleChoosed = 0;
      if($this.qualityOptions.length == 0){
        $this.getQualityCondition(data.id);
      }else{
        $this.getSelectedQuality(data.id);
      }
    },
    // 质量判定条件列表
    getQualityCondition(id){
      var $this = this;
      $this.$store.dispatch('chinaphone/getChinaQualitySelect', null).then(response=>{
        if(response){
          if(response.status){
            if(response.data.length>0){
              response.data.sort(function(a,b){
                return a.sort - b.sort
              })
              var multiOption = response.data.filter(item=>{
                return item.status == 1
              })
              var singleOption = response.data.filter(item=>{
                return item.status == 2
              })
              $this.qualityOptions = response.data;
              $this.judgeOptions = $this.radioOption(response.data);

              multiOption.forEach(item=>{
                var index = $this.getArrayIndex($this.judgeOptions,item.id);
                item.disabled = false;
                item.sindex = index.sindex;
                item.slength = index.slength;
              })
              $this.qualityMultiOptions = multiOption;
              $this.qualitySingleOptions = singleOption;
            }else{
              $this.qualityOptions = [];
            }

            $this.getSelectedQuality(id);
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

    // 多选选项选择
    qualityChooseChange(e){
      var $this = this;
      $this.qualitySingleChoosed = 0;
      if(e.length > 0){
        $this.qualityMultiChoosed = $this.getChoosedDataFilter($this.qualityOptions, $this.qualityMultiChoosed, $this.judgeOptions ,e);
      }else{
        $this.qualityMultiChoosed = []
      }
    },
    // 数据筛选
    getChoosedDataFilter(qualityOptions, qualityChoosed, judgeOptions, data){
      var $this = this;
      var filterChoosed = [];
      var filterResult = [];
      // 先将数据还原一下
      data.forEach((item,index)=>{
        var itemObj = $this.getAimObj(qualityOptions, item);
        filterChoosed.push(itemObj);
      })
      // 过滤排斥数据
      var filterChoosedArr = [...filterChoosed];
      var idArr = [];
      var lastItem = filterChoosed.slice(-1)[0];
      var lastItemId = lastItem.id;
      var lastIdIndexObj = $this.getArrayIndex(judgeOptions, lastItemId); // 查找元素
      var lastIdIndex = lastIdIndexObj.sindex; //获取最后一个元素的id在option数组的index 
      if(lastIdIndex > -1){
        idArr = judgeOptions[lastIdIndex].filter(sitem => {
          return sitem != lastItemId
        })
      }
      // var lastItemSameId = lastItem.same_id;
      // var lastItemSameIdArr = lastItemSameId.split(',');
      // var lastSameIdIndex = -1; //获取最后一个元素的same_id在option数组的index
      // if(lastItemSameIdArr.length > 0){
      //   var lastSameIdIndexObj = $this.getArrayIndex(lastItemSameId);
      //   lastSameIdIndex = lastSameIdIndexObj.sindex;
      // }
      
      // 查找最后一个元素的所有排斥元素
      // for(var i = 0; i < filterChoosed.length -1; i++){
      //   if(filterChoosed[i].id == lastItemSameId || filterChoosed[i].same_id == lastItemId){
      //     idArr.push(filterChoosed[i].id);
      //   }
      //   var judgeIdRes = $this.judgeOptions[lastIdIndex];
      //   var judgeSameIdRes = $this.judgeOptions[lastSameIdIndex];
      //   var judgeId = filterChoosed[i].id
      //   if((judgeIdRes && judgeIdRes.indexOf(judgeId) > -1 )|| (judgeSameIdRes && judgeSameIdRes.indexOf(judgeId) > -1)){
      //     idArr.push(filterChoosed[i].id);
      //   }
      // }
      if(idArr.length > 0){
        idArr.forEach(item=>{
          filterChoosedArr = filterChoosedArr.filter(sitem=>{
            return sitem.id != item;
          })
        })
      }
      
      filterChoosedArr.forEach(item=>{
        filterResult.push(item.id);
      })

      return filterResult;
    },
    // 单选选项选择
    qualitySingleChange(e){
      var $this = this;
      $this.qualityMultiChoosed = [];
    },
    // 查找指定元素
    getAimObj(qualityOptions, id){
      var item = qualityOptions.filter(item=>{
        return item.id == id
      })
      return item[0];
    },
    // 质量判定按钮确定
    qualityDecide(){
      var $this = this;
      if(!$this.isSaveData){        
        $this.isSaveData=true;
        var formData = {}
        formData.cid = $this.qualityId;
        if($this.qualityMultiChoosed.length > 0){
          formData.qid = $this.qualityMultiChoosed
          formData.score = $this.getQualityScore(formData.qid);
          $this.submitQualityData(formData)
        }else if($this.qualitySingleChoosed){
          var newarr = [];
          newarr.push($this.qualitySingleChoosed)
          formData.qid = newarr;
          formData.score = $this.getQualityScore(formData.qid);
          $this.submitQualityData(formData)
        }else{
          if($this.qualityHasOldData.length > 0){
            this.$confirm('您暂未选择具体情况，点击确定按钮，会清除质量判定的已有内容，确定要继续吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              formData.qid = [];
              formData.score = 0;
              $this.submitQualityData(formData);
            }).catch(() => {
              $this.isSaveData = false;
            });
          }else{
            formData.qid = [];
            formData.score = 0;
            $this.submitQualityData(formData)
          }
        }

      }
    },
    // 提交数据
    submitQualityData(formData){
      var $this = this;
      var pathUrl = "";
      if($this.isNewAdd){
        pathUrl = "chinaphone/getChinaQualityConfirm";
      }else{
        pathUrl = "chinaphone/getChinaQualityConfirmedit";
      }
      $this.$store.dispatch(pathUrl, formData).then(response=>{
          if(response.status){
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'success'
            });
            $this.isSaveData = false;
            $this.qualityDecision = false;
            $this.initCluesList();
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
      });
    },
    // 获取最终的评分
    getQualityScore(arr) {
      var $this = this;
      let options = $this.qualityOptions.concat($this.qualitySingleOptions);
      let totalNum = 0;
      arr.forEach(item => {
        let obj = $this.getAimObj(options, item);
        console.log(obj)
        totalNum += Number(obj.score);
      })
      totalNum = totalNum == 0 ? 0 : totalNum.toFixed(1);
      return totalNum;
    },
    // 获取已经选择的质量判定
    getSelectedQuality(id){
      var $this = this;
      var formData = {}
      formData.cid = id;
      $this.$store.dispatch('chinaphone/getChinaQualityHasSelect', formData).then(response=>{
        if(response){
          if(response.status){
            // 获取选中的值
            if(response.data.length>0){
                $this.isNewAdd = false;
                // 获取选中的值
                var options = [];
                response.data.forEach(item=>{
                  options.push(item.qid);
                })
                if(response.is_new == 1){
                  var checkedData = $this.getAimObj($this.qualityOptions, options[0]);
                  var status = checkedData.status;
                  if(status == 1){
                    $this.qualitySingleChoosed = 0;
                    $this.qualityMultiChoosed = options;
                  }else if(status == 2){
                    $this.qualityMultiChoosed = [];
                    $this.qualitySingleChoosed = options[0];
                  }
                  $this.showOld = false;
                  $this.typeValue = 2;
                  $this.qualityHasOldData = [];
                }else{
                  $this.qualitySingleChoosed = 0;
                  $this.qualityMultiChoosed = [];
                  $this.qualityHasOldData = response.data;
                  $this.showOld = true;
                  $this.typeValue = 1;
                }
            }else{
              $this.showOld = false;
              $this.qualitySingleChoosed = 0;
              $this.qualityMultiChoosed = [];
              $this.qualityHasOldData = [];
              $this.typeValue = 2;
            }

            $this.qualityDecision = true;
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
    // 获取已经选择的质量判定：hover事件
    getSelectedQualityText(id){
      var $this = this;
      // if($this.qualityOptions.length == 0){
      //   $this.getQualityCondition();
      // }
      var formData = {}
      formData.cid = id;
      $this.$store.dispatch('chinaphone/getChinaQualityHasSelect', formData).then(response=>{
        if(response){
          if(response.status){
            var options = [];
            var popTime = '';
            if(response.data.length>0){
                response.data.forEach((item,index)=>{
                  if(index == 0){
                    popTime = item.addtime;
                  }
                  options.push(item.content);
                })
            }
            $this.popTime = popTime;
            $this.popContent = options;
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
    popoverShow(id){
      var $this = this;
      $this.popContent = [];
      $this.popTime = "";
      if($this.menuButtonPermit.includes('Chinaphone_chinaqualityhasselect')){
        $this.getSelectedQualityText(id)
      }
    },
    // 全部选项排斥情况判断
    radioOption(data){
      var $this = this;
      var judgeOptions = [];
      var qoption = data;
      for(var i = 0; i < qoption.length; i++){
        for(var j = 0; j < qoption.length; j++){
          let i_same_ids = qoption[i].same_id.split(',');
          if(i_same_ids.indexOf('' + qoption[j].id) > -1){
            if(judgeOptions.length == 0){
              var newArr = [];
              newArr.push(qoption[i].id);
              newArr.push(qoption[j].id);
              i_same_ids.forEach(item => {
                if(newArr.indexOf(Number(item)) < 0){
                  newArr.push(Number(item))
                }
              })

              let j_same_ids = qoption[j].same_id.split(',');
              if(j_same_ids.length > 0){
                j_same_ids.forEach(item => {
                  if(newArr.indexOf(Number(item)) < 0){
                    newArr.push(Number(item))
                  }
                })
              }
              judgeOptions.push(newArr);
            }else{
              var index = $this.findArrayIndex(judgeOptions, qoption[j].id);
              var idindex = $this.findArrayIndex(judgeOptions, qoption[i].id);
              if(index > -1){
                if(idindex < 0){
                  judgeOptions[index].push(qoption[i].id);
                }
                let j_same_ids = qoption[j].same_id.split(',');
                if(j_same_ids.length > 0){
                  j_same_ids.forEach(item => {
                    if(judgeOptions[index].indexOf(Number(item)) < 0){
                      judgeOptions[index].push(Number(item))
                    }
                  })
                }
                let i_same_ids = qoption[i].same_id.split(',');
                if(i_same_ids.length > 0){
                  i_same_ids.forEach(item => {
                    if(judgeOptions[index].indexOf(Number(item)) < 0){
                      judgeOptions[index].push(Number(item))
                    }
                  })
                }
              }else{
                var newArr = [];
                newArr.push(qoption[i].id);
                newArr.push(qoption[j].id);
                let j_same_ids = qoption[j].same_id.split(',');
                if(j_same_ids.length > 0){
                  j_same_ids.forEach(item => {
                    if(newArr.indexOf(Number(item)) < 0){
                      newArr.push(Number(item))
                    }
                  })
                }
                let i_same_ids = qoption[i].same_id.split(',');
                if(i_same_ids.length > 0){
                  i_same_ids.forEach(item => {
                    if(newArr.indexOf(Number(item)) < 0){
                      newArr.push(Number(item))
                    }
                  })
                }
                judgeOptions.push(newArr)
              }
            }
          }
        }
      }
      return judgeOptions;
    },
    getArrayIndex(aimarr, item){
      var $this = this;
      var obj = {
        sindex: -1,
        slength: 0
      }
      aimarr.forEach((sitem,index)=>{
        if(sitem.indexOf(item) > -1){
          obj.sindex = index;
          obj.slength = sitem.length;
        }
      })
      return obj;
    },
    findArrayIndex(aimarr,item){
      var sindex = -1;
      aimarr.forEach((sitem,index)=>{
        if(sitem.indexOf(item) > -1){
          sindex = index
        }
      })
      return sindex;
    },
    
    // 清除选择内容
    clearSelect(){
      var $this = this;
      $this.qualityMultiChoosed = [];
      $this.qualitySingleChoosed = 0;
    }

  }
}
</script>
<style lang="scss" scoped>
.remark2{
  margin-top: 10px;
  :deep(.el-textarea__inner){
    height: 32px!important;
  }
}
.type-select{
  width: 120px;
  margin-left: 20px;
}
.top_quality_select{
  margin-bottom: 20px;
}
</style>
