<template>
    <div class="page-root en-phone-search  flex-box no-padding EnphoneCard" ref="boxPane">
        <div class="sub-router">
          <el-scrollbar wrap-class="scrollbar-wrapper">
            <div class="sub-wrapper">
              <div class="side-button">
                <el-button type="primary" plain size="mini" v-if="menuButtonPermit.includes('Enphone_search')" v-on:click="searchStatisticsData()"><i class="svg-i" ><svg-icon icon-class="serch_en" /></i>搜索数据</el-button>
                <el-button type="primary" plain size="mini" v-if="menuButtonPermit.includes('Enphone_phonecount')" v-on:click="statisticsClues()"><i class="svg-i" ><svg-icon icon-class="analy_en" /></i>业务员数据统计</el-button>
              </div>
              <dl class="phone-list" v-if="menuButtonPermit.includes('Enphone_lookall')&&menuButtonPermit.includes('Enphone_lookwaitdealall')">
                  <dd v-on:click="phoneJump('','all')" v-bind:class="currentKey&&currentKey=='all'?'active':''" v-if="menuButtonPermit.includes('Enphone_lookall')"><span>查看所有</span><i>({{linkAll.monthNum}})</i><em>({{linkAll.yestodayNum}})</em><b>({{linkAll.todayNum}})</b></dd>
                  <dd v-on:click="phoneJump('','unAllot')" v-bind:class="currentKey&&currentKey=='unAllot'?'active':''" v-if="menuButtonPermit.includes('Enphone_lookwaitdealall')"><span>未分配</span><i>({{linkAll.unAllotNum}})</i></dd>
              </dl>
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
                <div class="scroll-panel" ref="scrollDom" style="will-change:scroll-position">
                    <div class="true-height" ref="scrollPane">
                        <p class="breadcrumb" ref="breadcrumbPane">
                          <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
                          <template v-for="item in breadcrumbList">
                            <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
                            <span class="breadcrumb-link" v-bind:key="item.id" v-else><b>-</b><span>{{item.title}}</span></span>
                          </template>
                          <span class="breadcrumb-link"><b>-</b><span>搜索数据</span></span>
                        </p>
                        <el-card class="box-card scroll-card" shadow="hover">
                            <div slot="header">
                                <div class="card-header EnphoneCardHeader" ref="headerPane">
                                    <div class="search-wrap">
                                        <div class="item-search EnphoneSearchOne ">
                                            <div class="item flex-wrap" v-for="item in depart" :key="item.dept_id">
                                                <strong>{{item.departname}}</strong>
                                                <el-checkbox class="all-select" :indeterminate="item.isOnshow" border size="mini" v-model="item.isOn" @change="handleCheckAllOneChange(item.dept_id)">全选</el-checkbox>
                                                <el-checkbox-group class="team-list flex-content" v-model="deptOneId" @change="handleCheckedOneChange" size="mini">
                                                    <el-checkbox class="item-checkbox" v-for="items in item.child" :key="items.value" :label="items.value" border>{{items.label}}</el-checkbox>
                                                </el-checkbox-group>                                   
                                            </div>
                                        </div>
                                        <div class="item-search EnphoneSearchThree">
                                            <el-date-picker
                                                v-model="searchData.date"
                                                size="mini"
                                                type="daterange"
                                                align="right"
                                                style="width:250px;margin-right:10px;margin-bottom:10px;vertical-align: top;"
                                                value-format = "yyyy-MM-dd"
                                                unlink-panels
                                                range-separator="至"
                                                start-placeholder="开始日期"
                                                end-placeholder="结束日期"
                                                :picker-options="pickerRangeOptions">
                                            </el-date-picker>
                                            <el-select v-model="searchData.timeing" clearable placeholder="时段" style="width:70px;margin-right:10px;margin-bottom:10px;" size="mini">
                                                <el-option
                                                    v-for="item in timeList"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                            <el-select v-model="searchData.mode" clearable placeholder="渠道" style="width:125px;margin-right:10px;margin-bottom:10px;" size="mini">
                                                <el-option
                                                    v-for="item in sourceList"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                            <el-select v-model="searchData.device" clearable placeholder="设备" style="width:90px;margin-right:10px;margin-bottom:10px;" size="mini">
                                                <el-option
                                                    v-for="item in deviceList"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                            <el-select v-model="searchData.producttype_id" clearable placeholder="产品分类" style="width:100px;margin-right:10px;margin-bottom:10px;" @change="currentCateChange" size="mini">
                                                <el-option
                                                    v-for="item in cateList"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                            <el-select v-model="searchData.productid" clearable placeholder="产品" style="width:130px;margin-right:10px;margin-bottom:10px;" size="mini">
                                                <el-option
                                                    v-for="item in productList"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                            <el-select v-model="searchData.feedback" clearable placeholder="反馈" style="width:100px;margin-right:10px;margin-bottom:10px;" size="mini">
                                                <el-option
                                                    v-for="item in feedbackList"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                            <el-select v-model="searchData.level_id" clearable placeholder="首次级别" style="width:90px;margin-right:10px;margin-bottom:10px;" size="mini">
                                                <el-option
                                                    v-for="item in levelList"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                            <el-select v-model="searchData.erroring" clearable placeholder="异常" style="width:160px;margin-right:10px;margin-bottom:10px;" size="mini">
                                                <el-option
                                                    v-for="item in errorList"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                            <el-input
                                                size="mini"
                                                placeholder="国家"
                                                style="width:100px;margin-right:10px;margin-bottom:10px;"
                                                v-model="searchData.country"
                                                clearable>
                                            </el-input>
                                            <el-input
                                                size="mini"
                                                placeholder="备注"
                                                style="width:150px;margin-right:10px;margin-bottom:10px;"
                                                v-model="searchData.anymessage"
                                                clearable>
                                            </el-input>
                                            <el-input
                                                size="mini"
                                                placeholder="域名"
                                                style="width:150px;margin-right:10px;margin-bottom:10px;"
                                                v-model="searchData.domain"
                                                clearable>
                                            </el-input>
                                            <el-input
                                                size="mini"
                                                placeholder="URL"
                                                style="width:200px;margin-right:10px;margin-bottom:10px;"
                                                v-model="searchData.url"
                                                clearable>
                                            </el-input>
                                            <el-checkbox class="item-checkbox" v-model="searchData.is_url" size="mini" border>精确</el-checkbox>
                                            <el-input
                                                size="mini"
                                                placeholder="ID"
                                                style="width:80px;margin-right:10px;margin-bottom:10px;"
                                                v-model="searchData.messageid"
                                                clearable>
                                            </el-input>
                                            <el-input
                                                size="mini"
                                                placeholder="客户姓名/称呼"
                                                style="width:100px;margin-right:10px;margin-bottom:10px;"
                                                v-model="searchData.custormname"
                                                clearable>
                                            </el-input>
                                            <el-input
                                                size="mini"
                                                placeholder="Email"
                                                style="width:150px;margin-right:10px;margin-bottom:10px;"
                                                v-model="searchData.custormemail"
                                                clearable>
                                            </el-input>
                                            <el-input
                                                size="mini"
                                                placeholder="电话"
                                                style="width:110px;margin-right:10px;margin-bottom:10px;"
                                                v-model="searchData.custormphone"
                                                clearable>
                                            </el-input>
                                            <el-input
                                                size="mini"
                                                placeholder="来自IP"
                                                style="width:150px;margin-right:10px;margin-bottom:10px;"
                                                v-model="searchData.ip"
                                                clearable>
                                            </el-input>
                                            <el-checkbox class="item-checkbox" v-model="searchData.effective" size="mini" border>只显示有效</el-checkbox>
                                            <el-checkbox class="item-checkbox" v-model="searchData.is_adduser" size="mini" border>只显示我添加的（客服）</el-checkbox>
                                            <div class="search-panelThree" style="display:inline-block">
                                                <span style="float:left;line-height:28px;font-size:12px;">显示条数：</span>
                                                <el-input
                                                    size="mini"
                                                    style="width:40px;"
                                                    v-model="searchData.limit"
                                                    clearable>
                                                </el-input>
                                            </div>
                                        </div> 
                                        <div class="item-search  EnphoneSearchTwo flex-wrap">
                                            <el-checkbox class="item-checkbox" v-model="searchData.is_group" size="mini" border>分组</el-checkbox>
                                            <div class="team-list customRadio small">
                                                <span class="item-clues" v-for="item in groupurlproductList" v-bind:class="item.isOn?'active':''" v-bind:key="item.value" v-on:click="groupurlproductClick(item.value)"><i></i>{{item.label}}</span>
                                            </div>
                                            <div class="search-panelThree flex-content">
                                                <span style="float:left;line-height:28px;font-size:12px;">排序：</span>
                                                <el-radio-group class="team-list" v-model="searchData.sort" size="mini">
                                                    <el-radio class="item-radio" label="asc" border>升序</el-radio>
                                                    <el-radio class="item-radio" label="desc" border>降序</el-radio>
                                                </el-radio-group>
                                            </div>
                                        </div> 
                                        <div class="clues-info flex-wrap">
                                            <div class="clues-infoFl flex-content">
                                                <p v-if="isClues"> <span class="item-span-1">共找到： <strong>{{infoData.allcount}}</strong> 条，有效 <strong>{{infoData.effectivecount}}</strong> 条， 已反馈 <strong>{{infoData.hassaycountscore}}</strong> 分，意向客户 <strong>{{infoData.meancustormscore}}</strong> 分 ，未反馈 <strong>{{infoData.nosaycount}}</strong> 条，共计 <strong>{{infoData.nosaycountscore}}</strong> 分，总分 <strong>{{infoData.allcountscore}}</strong> 分 ！ [A]砂石：<strong>{{infoData.producttypecount1}}</strong>条，  [B]选矿/建材：<strong>{{infoData.producttypecount2}}</strong>条，  [C]磨粉/烘干/压球：<strong>{{infoData.producttypecount3}}</strong>条，  [其他]：<strong>{{infoData.producttypecount4}}</strong>条</span></p>
                                                
                                                <p v-if="isUrl"><span class="item-span-1">共计：<strong>{{infoData.groupCount}}</strong>条URL，数量：<strong>{{infoData.totalCount}}</strong>个询盘。</span></p>
                                                <p v-if="isProduct"><span class="item-span-1">共计：<strong>{{infoData.groupCount}}</strong>种产品，数量：<strong>{{infoData.totalCount}}</strong>个询盘。</span></p>
                                                <p v-if="isCountry"><span class="item-span-1">共计：<strong>{{infoData.groupCount}}</strong>个国家，数量：<strong>{{infoData.totalCount}}</strong>个询盘。</span></p>
                                                <p v-if="isContinent"><span class="item-span-1">共计：<strong>{{infoData.groupCount}}</strong>个州，数量：<strong>{{infoData.totalCount}}</strong>个询盘。</span></p>
                                                <p v-if="isGroup"><span class="item-span-1">共计：<strong>{{infoData.groupCount}}</strong>个小组，数量：<strong>{{infoData.totalCount}}</strong>个询盘。</span></p>
                                                <p v-if="isProducttype"><span class="item-span-1">共计：<strong>{{infoData.groupCount}}</strong>种产品分类，数量：<strong>{{infoData.totalCount}}</strong>个询盘。</span></p>
                                            </div>
                                            <div class="clues-title-btn">
                                                <el-button type="primary" class="updateBtn" size="small" v-if="menuButtonPermit.includes('Enphone_search')" v-on:click="enCluesSearchData"><i class="svg-i" ><svg-icon icon-class="planeWhite" /></i>搜索</el-button>
                                                <el-button type="info" class="resetBtn" size="small" v-on:click="resetData()">重置</el-button>
                                                <el-button type="primary" size="small" class="derived" :disabled="isExportDisabled"  @click="dialogExportVisible = true"><i class="svg-i" ><svg-icon icon-class="derived" /></i>导出数据</el-button>
                                            </div>
                                        </div> 
                                    </div>
                                </div>
                            </div>
                            <div class="card-content" ref="tableContent">
                                <div class="table-wrapper" v-bind:class="scrollPosition.isFixed?'fixed-table':''">
                                    <div class="table-mask"></div>                       
                                    <el-table
                                        v-if="isClues"
                                        key="a"
                                        ref="simpleTable"
                                        :data="tableData"
                                        tooltip-effect="dark"
                                        stripe
                                        class="SiteTable EntableColor"
                                        style="width: 100%"
                                        :style="'min-height:'+minHeight+'px;'"
                                        @selection-change="handleSelectionChange"
                                      >
                                      <el-table-column
                                        prop="xuntime"
                                        label="ID/品牌/小组"
                                        width="120"
                                        >
                                        <template slot-scope="scope">
                                          <div class="table-text">
                                            <p>{{scope.row.id}}</p>
                                            <p>{{scope.row.brandname}}</p>
                                            <p>{{scope.row.phonenumber}}</p>
                                          </div>
                                        </template>
                                      </el-table-column>
                                      <el-table-column
                                        prop="xuntime"
                                        label="时间"
                                        width="190"
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
                                        label="来源网站"
                                        width="110"
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
                                        width="110"
                                        >
                                        <template slot-scope="scope">
                                          <div class="table-text">
                                            <p><span class="EnColor05">大洲：</span>{{scope.row.continent}}</p>
                                            <p><span class="EnColor05">国家：</span>{{scope.row.country}}</p>
                                            <p><span class="EnColor05">轨迹：</span><a :href="'https://www.ip138.com/iplookup.asp?ip='+scope.row.ip+'&action=2'" target="_blank" v-if="scope.row.ip" :title="scope.row.ip">IP</a></p>
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
                                        width="90"
                                        >
                                        <template slot-scope="scope">
                                          <div class="table-tag" style="text-align:center;"><el-checkbox v-model="scope.row.isEffective" disabled></el-checkbox></div>
                                          <div class="table-text" v-if="!scope.row.isEffective">{{scope.row.invalidcause}}<span class="redTip">{{scope.row.noeffectivetime}}</span></div>
                                        </template>
                                      </el-table-column>
                                      <el-table-column
                                        prop="levelname"
                                        label="首次级别/二次判定"
                                        min-width="140"
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
                                        min-width="80"
                                        >
                                      </el-table-column>
                                      <el-table-column
                                        prop="addusername"
                                        label="添加人"
                                        width="100"
                                        >
                                        <template slot-scope="scope">
                                          <div class="table-text">
                                            <p>{{scope.row.addusername}}</p>
                                          </div>
                                        </template>
                                      </el-table-column>
                                      <el-table-column
                                        prop="hassale"
                                        label="业务员"
                                        width="80"
                                        >
                                      </el-table-column>
                                      <el-table-column
                                        prop="addtime"
                                        label="添/分/改/业务时间"
                                        width="150"
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
                                        label="积分"
                                        min-width="70"
                                        >
                                        <template slot-scope="scope">
                                          <div class="table-score"><span class="EnColor06">{{scope.row.score}}</span></div>
                                        </template>
                                      </el-table-column>
                                      <el-table-column
                                        key="d"
                                        prop="searchword"
                                        label="备注"
                                        min-width="90"
                                        >
                                        <template slot-scope="scope">
                                          <div class="table-input">
                                            <el-input size="small" class="tips-input-2" disabled v-model="scope.row.remark1"></el-input>
                                            <el-input size="small" class="tips-input-3" disabled v-model="scope.row.remark2"></el-input>
                                            <el-input size="small" class="tips-input-4" disabled v-model="scope.row.remark3"></el-input>
                                          </div>
                                        </template>
                                      </el-table-column>
                                      <el-table-column
                                        v-if="menuButtonPermit.includes('Enphone_edit')"
                                        width="90"
                                        align="center"
                                        prop="operations"
                                        fixed="right"
                                        label="操作">
                                        <template #default="scope">
                                          <div class="table-button">
                                            <el-button size="mini" @click="editTableRow(scope.row,scope.$index)" v-if="scope.row.writepermit&&menuButtonPermit.includes('Enphone_edit')">修改</el-button>
                                          </div>
                                        </template>
                                      </el-table-column>
                                    </el-table>
                                    <el-table
                                        v-if="isUrl"
                                        key="b"
                                        ref="simpleTable"
                                        :data="tableData"
                                        class="SiteTable"
                                        tooltip-effect="dark"
                                        stripe
                                        style="width: 100%"
                                        :style="'min-height:'+minHeight+'px;'"
                                        >
                                        <el-table-column
                                            prop="url"
                                            label="按URL"
                                            min-width="200"
                                            >
                                        </el-table-column>
                                        <el-table-column
                                            prop="number"
                                            label="数量"
                                            min-width="120"
                                            >
                                        </el-table-column>
                                        <el-table-column
                                            prop="allscore"
                                            label="积分"
                                            min-width="120"
                                            >
                                        <template slot-scope="scope">
                                          <div class="table-text">
                                            <p>{{scope.row.allscore}}</p>
                                          </div>
                                        </template>
                                        </el-table-column>
                                    </el-table>
                                    <el-table
                                        v-if="isProduct"
                                        key="c"
                                        ref="simpleTable"
                                        :data="tableData"
                                        class="SiteTable"
                                        tooltip-effect="dark"
                                        stripe
                                        style="width: 100%"
                                        :style="'min-height:'+minHeight+'px;'"
                                        >
                                        <el-table-column
                                            prop="keyproduct"
                                            label="按产品"
                                            min-width="200"
                                            >
                                        </el-table-column>
                                        <el-table-column
                                            prop="number"
                                            label="数量"
                                            min-width="120"
                                            >
                                        </el-table-column>
                                        <el-table-column
                                            prop="allscore"
                                            label="积分"
                                            min-width="120"
                                            >
                                        </el-table-column>
                                    </el-table>
                                    <el-table
                                        v-if="isCountry"
                                        key="d"
                                        ref="simpleTable"
                                        :data="tableData"
                                        class="SiteTable"
                                        tooltip-effect="dark"
                                        stripe
                                        style="width: 100%"
                                        :style="'min-height:'+minHeight+'px;'"
                                        >
                                        <el-table-column
                                            prop="country"
                                            label="按国家"
                                            min-width="200"
                                            >
                                        </el-table-column>
                                        <el-table-column
                                            prop="number"
                                            label="数量"
                                            min-width="120"
                                            >
                                        </el-table-column>
                                        <el-table-column
                                            prop="allscore"
                                            label="积分"
                                            min-width="120"
                                            >
                                        </el-table-column>
                                    </el-table>
                                    <el-table
                                        v-if="isContinent"
                                        key="e"
                                        ref="simpleTable"
                                        :data="tableData"
                                        class="SiteTable"
                                        tooltip-effect="dark"
                                        stripe
                                        style="width: 100%"
                                        :style="'min-height:'+minHeight+'px;'"
                                        >
                                        <el-table-column
                                            prop="continent"
                                            label="按大洲"
                                            min-width="200"
                                            >
                                        </el-table-column>
                                        <el-table-column
                                            prop="number"
                                            label="数量"
                                            min-width="120"
                                            >
                                        </el-table-column>
                                        <el-table-column
                                            prop="allscore"
                                            label="积分"
                                            min-width="120"
                                            >
                                        </el-table-column>
                                    </el-table>
                                    <el-table
                                        v-if="isGroup"
                                        key="f"
                                        ref="simpleTable"
                                        :data="tableData"
                                        class="SiteTable"
                                        tooltip-effect="dark"
                                        stripe
                                        style="width: 100%"
                                        :style="'min-height:'+minHeight+'px;'"
                                        >
                                        <el-table-column
                                            prop="phoneid"
                                            label="按组别"
                                            min-width="200"
                                            >
                                        </el-table-column>
                                        <el-table-column
                                            prop="number"
                                            label="数量"
                                            min-width="120"
                                            >
                                        </el-table-column>
                                        <el-table-column
                                            prop="allscore"
                                            label="积分"
                                            min-width="120"
                                            >
                                        </el-table-column>
                                    </el-table>
                                    <el-table
                                        v-if="isProducttype"
                                        key="g"
                                        ref="simpleTable"
                                        :data="tableData"
                                        class="SiteTable"
                                        tooltip-effect="dark"
                                        stripe
                                        style="width: 100%"
                                        :style="'min-height:'+minHeight+'px;'"
                                        >
                                        <el-table-column
                                            prop="producttypename"
                                            label="按产品分类"
                                            min-width="200"
                                            >
                                        </el-table-column>
                                        <el-table-column
                                            prop="number"
                                            label="数量"
                                            min-width="120"
                                            >
                                        </el-table-column>
                                        <el-table-column
                                            prop="allscore"
                                            label="积分"
                                            min-width="120"
                                            >
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
                                    :page-sizes="pageSizeList"
                                    @current-change="handleCurrentChange"
                                    :current-page="searchData.page"
                                    :layout="'total, sizes, prev, pager, next, jumper'"
                                    :total="totalDataNum">
                                </el-pagination>
                            </div>
                        </el-card>  
                    </div> 
                </div>
            </div>     
            <el-backtop target=".scroll-panel"></el-backtop>
        </div>
        <el-dialog title="导出" custom-class="export-dialog" :visible.sync="dialogExportVisible" width="400px">
            <el-form :inline="true" :model="exportForm">
                <el-form-item label="文件名称：" :label-width="formLabelWidth">
                <el-input v-model="exportForm.fileName" placeholder="文件名 (默认：excel-list)" prefix-icon="el-icon-document"></el-input>
                </el-form-item>
                <el-form-item label="文件类型：" :label-width="formLabelWidth">
                <el-select v-model="exportForm.bookType" placeholder="请选择导出文件类型">
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
  name: 'searchEnClues',
  data() {
    return {
      breadcrumbList:[],
      defaultData:{
        custorAndsalesmwarn:[],
        custormwarn:[],
        saleswarning:[],
      },
      currentKey:null,
      linkAll:{
        todayNum:0,
        yestodayNum:0,
        monthNum:0,
        unAllotNum:0,
      },
        minHeight:0,
        menuButtonPermit:[],
        tableData:[],
        searchData:{
            date:[],
            page:1,
            limit:20,
            messageid:"",
            custormname:"",
            custormemail:"",
            custormphone:"",
            ip:"",
            phoneid:[],
            timeing:"",
            device:"",
            mode:"",
            producttype_id:"",
            productid:"",
            feedback:"",
            level_id:"",
            erroring:"",
            country:"",
            anymessage:"",
            domain:"",
            url:"",
            is_url:false,
            effective:false,
            is_adduser:false,
            is_group:false,
            groupurlproduct:"1",
            sort:"asc",
        },
        pageSizeList:[20],
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
        phoneList:[],
        cateList:[],
        levelList:[],
        sourceList:[],
        productList:[],
        depart:[],
        deptOneId:[],
        deviceList:[
            {label:"PC设备",value:"PC设备"},
            {label:"移动设备",value:"移动设备"},
            {label:"未知设备",value:"未知设备"},
        ],
        groupurlproductList:[
            {label:"按URL",value:1,isOn:false},
            {label:"按产品",value:2,isOn:false},
            {label:"按国家",value:3,isOn:false},
            {label:"按大洲",value:4,isOn:false},
            {label:"按组别",value:5,isOn:false},
            {label:"按产品分类",value:6,isOn:false},
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
        effectiveList:[
            {label:"只显示有效",value:1},
            {label:"只显示无效",value:2},
        ],
        feedbackList:[
            {label:"已反馈",value:1},
            {label:"未反馈",value:2},
            {label:"意向客户",value:3},
            {label:"非意向客户",value:4},
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
            invalidCount:0,
            levelTwoCount:0,

            allcount:0,
            allcountscore:0,
            effectivecount:0,
            hassaycount:0,
            hassaycountscore:0,
            nosaycount:0,
            nosaycountscore:0,
            meancustormscore:0,
            noeffectivecount:0,
            producttypecount1:0,
            producttypecount2:0,
            producttypecount3:0,
            producttypecount4:0
        },
        formLabelWidth:"110px",
        exportForm:{
            fileName:"",
            bookType:"xlsx"
        },
        dialogExportVisible:false,
        downloadLoading: false,
        permitField:[],
        isExportDisabled:true,
        isDisabled:true,
        pageSizeList:[20],
        isUrl:false,
        isProduct:false,
        isCountry:false,
        isContinent:false,
        isGroup:false,
        isProducttype:false,
        isClues:true,
        levelPop:[],  
        levelPopBool:false,
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
        $this.setTableHeight();
    });
    window.onresize = () => {
      return (() => {
           $this.setTableHeight();
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
      isOpen(e){
        this.setTableHeight();
      },
  },
  created(){
    var $this = this;
    $this.getBreadcrumbList();
    $this.initData();
    document.onkeydown = function(e) {
    var key = window.event.keyCode;
      if (key == 13) {
        $this.enCluesSearchData();
      }
    }
  },
  updated(){
    var $this =this;
    $this.$nextTick(() => {
      $this.$refs.simpleTable.doLayout();
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
      $this.minHeight = 0;      
      var headerHeight = $this.$refs.headerPane.offsetHeight+45;
      var breadcrumbHeight = $this.$refs.breadcrumbPane.offsetHeight;
      var screenHeight = $this.$refs.boxPane.offsetHeight;
      $this.minHeight = screenHeight-headerHeight-breadcrumbHeight-30;
      $this.getBrowserType();
        setTimeout(function() {
          $this.setScrollDom();
      }, 400);
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.loadingFun();
      $this.getUserMenuButtonPermit();
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
              $this.initPage();
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
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.$store.dispatch('enphone/cluesSearchSelectDataAction', null).then(response=>{
        if(response){
          if(response.status){
              var departData=response.phone;
              //数组去重然后放在一个新的数组里面
              var newStrArr = [];
              departData.forEach(function(item, index) {
                var newStr=item.dept_id;
                if(newStrArr.indexOf(newStr)==-1){
                    newStrArr.push(newStr);
                  }
              });
              var newObjArr=[];
              newStrArr.forEach(function(item, index) {
                  var itemData = {};
                  itemData.dept_id = item;
                  itemData.isOn = false;
                  itemData.isOnshow = false;
                  itemData.departname = '';
                  itemData.child = [];
                  newObjArr.push(itemData);
              });
              departData.map(function(item, index) {
                newObjArr.map(function(item1, index1) {
                  if (item.dept_id == item1.dept_id) {
                    var itemData = {};
                    itemData.label = item.phonenumber;
                    itemData.value = item.id;
                    itemData.isOn = false;
                    item1.departname = item.departname;
                    item1.child.push(itemData);
                  }
                });
              });
              $this.depart=newObjArr;
              var levelList = [];
              response.xunlevel.forEach(function(item,index){
                  var itemData = {};
                  itemData.label = item.levelname;
                  itemData.value = item.id;
                  levelList.push(itemData);
              });
              $this.levelList = levelList;
              var sourceList = [];
              response.sourcetype.forEach(function(item,index){
                  var itemData = {};
                  itemData.label = item.name;
                  itemData.value = item.id;
                  sourceList.push(itemData);
              });
              $this.sourceList = sourceList;
              var cateList = [];
              response.producttype.forEach(function(item,index){
                  var itemData = {};
                  itemData.label = item.name;
                  itemData.value = item.id;
                  cateList.push(itemData);
              });
              $this.cateList = cateList;
              $this.$nextTick(function () {
                $this.setTableHeight();
              })
              $this.isLoading.close();
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
        if(res.status){
          if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.menuButtonPermit.includes('Enphone_phoneindex')&&$this.menuButtonPermit.includes('Enphone_search')){
                $this.leftPhoto();
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
    // 电商全选
    handleCheckAllOneChange(dept_id){
      var $this = this;
      var deptOneId=$this.deptOneId;
      $this.depart.forEach(function(item,index){
        if(dept_id==item.dept_id){
          if(item.isOn){
            var checkedList = [];
            item.child.forEach(function(items,indexs){
                checkedList.push(items.value);
            });  
            checkedList.forEach(function(item,index){
                if(deptOneId.indexOf(item)==-1){  
                    deptOneId.push(item);   
                }
            }); 
            item.isOnshow =true;
            $this.deptOneId=deptOneId;
          }else{
            var checkedList = [];
            item.child.forEach(function(items,indexs){
                checkedList.push(items.value);
            });
            var newArr=[];
            deptOneId.forEach(function(item,index){
                if(checkedList.indexOf(item)==-1){  
                   newArr.push(item);
                }
            });
            $this.deptOneId=newArr;
            item.isOnshow =false;
          }          
        }        
      });
    },
    // 电商一部选择改变事件
    handleCheckedOneChange(e){
      var $this = this;
      var deptOneId=e;
      if(deptOneId.length>0){
        $this.depart.forEach(function(item,index){
          var TNum=0;
          item.child.forEach(function(items,indexs){
              if(deptOneId.indexOf(items.value)>-1){
                  TNum=TNum+1;       
              }
              if(TNum>0&&TNum<indexs+1){
                item.isOnshow=true;
              }else{
                item.isOnshow = false;
              }
              if(TNum>indexs){
                item.isOn=true;
              }else{
                item.isOn=false;
              }
          });
        });
      }else{
        $this.depart.forEach(function(item,index){
          item.isOn=false;
          item.isOnshow = false;
        });
      }
    },
    // 组装搜索需要的条件数据
    getSearchResultData(){
        var $this = this;
        var resultData = {};
        resultData.page = $this.searchData.page;
        resultData.limit = $this.searchData.limit;
        resultData.messageid = $this.searchData.messageid;
        resultData.custormname = $this.searchData.custormname;
        resultData.custormemail = $this.searchData.custormemail;
        resultData.custormphone = $this.searchData.custormphone;
        resultData.ip = $this.searchData.ip;
        if($this.searchData.date&&$this.searchData.date.length>0){
            resultData.starttime = $this.searchData.date[0];
            resultData.endtime = $this.searchData.date[1];
        }else{
            resultData.starttime = "";
            resultData.endtime = "";
        }
        resultData.timeing = $this.searchData.timeing;
        resultData.mode = $this.searchData.mode;
        resultData.device = $this.searchData.device;
        resultData.producttype_id = $this.searchData.producttype_id;
        resultData.productid = $this.searchData.productid;
        resultData.feedback = $this.searchData.feedback;
        resultData.level_id = $this.searchData.level_id;
        resultData.erroring = $this.searchData.erroring;
        resultData.country = $this.searchData.country;
        resultData.anymessage = $this.searchData.anymessage;
        resultData.domain = $this.searchData.domain;
        resultData.url = $this.searchData.url;
        resultData.is_url = $this.searchData.is_url?1:0;
        resultData.effective = $this.searchData.effective?1:0;
        resultData.is_adduser = $this.searchData.is_adduser?1:0;
        resultData.is_group = $this.searchData.is_group?1:0;
        resultData.sort = $this.searchData.sort;
        resultData.groupurlproduct = $this.searchData.groupurlproduct;        
        resultData.phoneid = $this.searchData.phoneid;
        return resultData;
    },
    // 搜索确认
    enCluesSearchData(){
        var $this = this;
        $this.searchData.phoneid= $this.deptOneId;
        var resultData = $this.getSearchResultData();
        $this.loadingFun();
        document.getElementsByClassName("scroll-panel")[0].scrollTop = 0;
        $this.$store.dispatch('enphone/getCurrentCluesSearchListAction', resultData).then(response=>{
        if(response){
          if(response.status){
            var infoData = {};
            infoData.totalCount = response.allcount;
            if($this.searchData.is_group){
                $this.isClues=false;
                infoData.groupCount = response.countgroup;
                if($this.searchData.groupurlproduct == 1){
                    $this.isUrl=true;
                    $this.isProduct=false;
                    $this.isCountry=false;
                    $this.isContinent=false;
                    $this.isGroup=false;
                    $this.isProducttype=false;
                    if(response.data.length>0){
                      var searArr=[];
                      response.data.forEach(function(item){
                          var obj={
                            allscore:0,
                            number:0,
                            url: ""
                          }
                          obj.allscore=parseFloat(item.allscore).toFixed(2);
                          obj.number=item.number;
                          obj.url=item.url;
                          searArr.push(obj);
                      });
                      $this.tableData = searArr;
                    }
                }
                if($this.searchData.groupurlproduct == 2){
                    $this.isUrl=false;
                    $this.isProduct=true;
                    $this.isCountry=false;
                    $this.isContinent=false;
                    $this.isGroup=false;
                    $this.isProducttype=false;
                    if(response.data.length>0){
                      var searArr=[];
                      response.data.forEach(function(item){
                          var obj={
                            allscore:0,
                            number:0,
                            keying: "",
                            keyproduct: "",
                          }
                          obj.allscore=parseFloat(item.allscore).toFixed(2);
                          obj.number=item.number;
                          obj.keying=item.keying;
                          obj.keyproduct=item.keyproduct;
                          searArr.push(obj);
                      });
                      $this.tableData = searArr;
                    }
                }
                if($this.searchData.groupurlproduct == 3){
                    $this.isUrl=false;
                    $this.isProduct=false;
                    $this.isCountry=true;
                    $this.isContinent=false;
                    $this.isGroup=false;
                    $this.isProducttype=false;
                    if(response.data.length>0){
                      var searArr=[];
                      response.data.forEach(function(item){
                          var obj={
                            allscore:0,
                            number:0,
                            country: "",
                            percenter: "",
                          }
                          obj.allscore=parseFloat(item.allscore).toFixed(2);
                          obj.number=item.number;
                          obj.country=item.country;
                          obj.percenter=item.percenter;
                          searArr.push(obj);
                      });
                      $this.tableData = searArr;
                    }
                }
                if($this.searchData.groupurlproduct == 4){
                    $this.isUrl=false;
                    $this.isProduct=false;
                    $this.isCountry=false;
                    $this.isContinent=true;
                    $this.isGroup=false;
                    $this.isProducttype=false;
                    if(response.data.length>0){
                      var searArr=[];
                      response.data.forEach(function(item){
                          var obj={
                            allscore:0,
                            number:0,
                            continent: "",
                            percenter: "",
                          }
                          obj.allscore=parseFloat(item.allscore).toFixed(2);
                          obj.number=item.number;
                          obj.continent=item.continent;
                          obj.percenter=item.percenter;
                          searArr.push(obj);
                      });
                      $this.tableData = searArr;
                    }
                }
                if($this.searchData.groupurlproduct == 5){
                    $this.isUrl=false;
                    $this.isProduct=false;
                    $this.isCountry=false;
                    $this.isContinent=false;
                    $this.isGroup=true;
                    $this.isProducttype=false;
                    if(response.data.length>0){
                      var searArr=[];
                      response.data.forEach(function(item){
                          var obj={
                            allscore:0,
                            number:0,
                            phoneid: "",
                            percenter: "",
                          }
                          obj.allscore=parseFloat(item.allscore).toFixed(2);
                          obj.number=item.number;
                          obj.phoneid=item.phoneid;
                          obj.percenter=item.percenter;
                          searArr.push(obj);
                      });
                      $this.tableData = searArr;
                    }
                }
                if($this.searchData.groupurlproduct == 6){
                    $this.isUrl=false;
                    $this.isProduct=false;
                    $this.isCountry=false;
                    $this.isContinent=false;
                    $this.isGroup=false;
                    $this.isProducttype=true;
                    if(response.data.length>0){
                      var searArr=[];
                      response.data.forEach(function(item){
                          var obj={
                            allscore:0,
                            number:0,
                            producttype_id: "",
                            producttypename: "",
                          }
                          obj.allscore=parseFloat(item.allscore).toFixed(2);
                          obj.number=item.number;
                          obj.producttype_id=item.producttype_id;
                          obj.producttypename=item.producttypename;
                          searArr.push(obj);
                      });
                      $this.tableData = searArr;
                    }
                }
            }else{
                infoData.allcount = response.allcount;
                infoData.allcountscore = response.allcountscore;
                infoData.effectivecount = response.effectivecount;
                infoData.hassaycount = response.hassaycount;
                infoData.hassaycountscore = response.hassaycountscore;
                infoData.nosaycount = response.nosaycount;
                infoData.nosaycountscore = response.nosaycountscore;
                infoData.meancustormscore = response.meancustormscore;
                infoData.noeffectivecount = response.noeffectivecount;
                infoData.producttypecount1 = response.producttypecount1;
                infoData.producttypecount2 = response.producttypecount2;
                infoData.producttypecount3 = response.producttypecount3;
                infoData.producttypecount4 = response.producttypecount4;
                $this.isUrl=false;
                $this.isProduct=false;
                $this.isCountry=false;
                $this.isContinent=false;
                $this.isGroup=false;
                $this.isProducttype=false;
                $this.isClues=true;
                response.data.forEach(function(item,index){
                  item.isEffective = item.effective==1?true:false;
                  if(item.remark1==''||item.remark1==null||item.remark1==undefined){
                     item.isRemark1=true;
                  }else{
                     item.isRemark1=false;
                  }
                  if(item.remark2==''||item.remark2==null||item.remark2==undefined){
                     item.isRemark2=true;
                  }else{
                     item.isRemark2=false;
                  }
                  if(item.remark3==''||item.remark3==null||item.remark3==undefined){
                     item.isRemark3=true;
                  }else{
                     item.isRemark3=false;
                  }
                });
                $this.tableData = response.data;
            }
            if(response.data.length>0){
              $this.isExportDisabled = false;
            }else{
              $this.isExportDisabled = true;
            }
            $this.infoData = infoData;
            $this.totalDataNum = response.allcount;
            $this.pageSizeList;            
            var pageSizeListArr = [$this.pageSizeList];
            if (pageSizeListArr.length > 1) {
              pageSizeListArr.shift();
            }
            pageSizeListArr = [$this.searchData.limit];
            $this.pageSizeList = pageSizeListArr;
            $this.$nextTick(function () {
              $this.setTableHeight();
            })  
            $this.isLoading.close();         
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
    // 重置表单
    resetData(){
        var $this = this;
        $this.searchData.date=[];
        $this.searchData.page=1;
        $this.searchData.limit=20;
        $this.searchData.messageid="";
        $this.searchData.custormname="";
        $this.searchData.custormemail="";
        $this.searchData.custormphone="";
        $this.searchData.ip="";
        $this.searchData.phoneid=[];
        $this.deptOneId=[];        
        $this.depart.forEach(function(item,index){
          item.isOn=false;
          item.isOnshow=false;          
          item.child.forEach(function(items,indexs){
             items.isOn=false;
          });      
        });
        $this.searchData.timeing="";
        $this.searchData.device="";
        $this.searchData.mode="";
        $this.searchData.producttype_id="";
        $this.searchData.productid="";
        $this.searchData.feedback="";
        $this.searchData.level_id="";
        $this.searchData.erroring="";
        $this.searchData.country="";
        $this.searchData.anymessage="";
        $this.searchData.domain="";
        $this.searchData.url="";
        $this.searchData.is_url=false;
        $this.searchData.effective=false;
        $this.searchData.is_adduser=false;
        $this.searchData.is_group=false;
        $this.searchData.groupurlproduct="1";
        $this.searchData.sort="asc";
        $this.isAllTeam=false;
        $this.checkAllTeam=false;
        $this.pageSizeList=[20];
    },
    // 表格多选改变事件
    handleSelectionChange(val) {
        var $this = this;
        $this.selectedData = val;
        if($this.selectedData.length>0){
          $this.isDisabled = false;
        }else{
          $this.isDisabled = true;
        }
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
    //分组选择点击事件
    groupurlproductClick(id){
      var $this = this;
      var groupurlproductList = $this.groupurlproductList;
      groupurlproductList.forEach(function(item,index){
        if(item.value == id){
          if(item.isOn){
            item.isOn = false;
          }else{
            item.isOn = true;
            $this.searchData.groupurlproduct = id;
          }
        }else{
          item.isOn = false;
        }
      });
      $this.groupurlproductList = groupurlproductList;
    },
    // 导出当前页数据
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID','电话','询盘时间','星期','域名','渠道','地区','城市','意向设备','有效','添加人','添加时间','等级','备注','原因','域名','链接','平台','关键词','备注','提供者','设备']
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
          itemData.push(item.invalidcause);
          itemData.push(item.addusername);
          itemData.push(item.addtime);
          itemData.push(item.levelname);
          itemData.push(item.custormcause);
          itemData.push(item.custormremark);
          itemData.push(item.domain);
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
    // 每页显示条数改变事件
    handleSizeChange(val) {
      this.searchData.limit = val;
      this.searchData.page = 1;
      this.enCluesSearchData();
    },
    // 当前页改变事件
    handleCurrentChange(val) {
      this.searchData.page = val;
      this.enCluesSearchData();
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
    // 修改询盘
    editTableRow(row,index){
      var $this = this;
      var routeUrl =  $this.$router.resolve({path:'/Enphone/addEditClues',query:{ID:row.id}});
      window.open(routeUrl.href,'_blank');
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
      if($this.totalDataNum>20){
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
        if($this.totalDataNum>20){
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
    // 搜索统计数据跳转
    searchStatisticsData(){
      var $this = this;
      var routeUrl =  $this.$router.resolve({path:'/Enphone/searchClues'});
    },
    // 统计分析跳转
    statisticsClues(){
      var $this = this;
      var routeUrl =  $this.$router.resolve({path:'/Enphone/statisticClues'});
      window.open(routeUrl.href,'_self');
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
      var routeUrl =  $this.$router.resolve({path:'/Enphone/phoneindex',query:queryObj});
      window.open(routeUrl.href,'_self');
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
