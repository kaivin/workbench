<template>
  <div class="page-root flex-box EnphoneCard" ref="boxPane">
    <div class="flex-box flex-column EnphoneCardFl"  ref="EnphoneCardFl">
      <el-card class="flex-panel" shadow="hover">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <div class="side-button">
            <el-button type="primary" plain size="mini" v-if="menuButtonPermit.includes('Enphone_search')" v-on:click="searchStatisticsData()"><i class="svg-i" ><svg-icon icon-class="serch_en" /></i>搜索数据</el-button>
            <el-button type="primary" plain size="mini" v-if="menuButtonPermit.includes('Enphone_countlist')" v-on:click="statisticsClues()"><i class="svg-i" ><svg-icon icon-class="analy_en" /></i>统计分析</el-button>
          </div>
          <template v-for="(item,index) in defaultData.data">
            <dl class="phone-list" v-if="item.phone.length>0" v-bind:key="index">
              <dt><span>{{item.brandname}}</span></dt>
              <dd v-for="(phone,index) in item.phone" :key="index" :title="phone.phonenumber+phone.othername" v-on:click="phoneJump(phone.id)"><span>{{phone.phonenumber}}</span><i>({{phone.nowmonthnumber}})</i><em>({{phone.lastdaynumber}})</em><b>({{phone.nownumber}})</b></dd>
            </dl>
          </template>
        </el-scrollbar>
      </el-card>
    </div>
    <div class="flex-panel EnphoneCardFr" :style="{width:EnphoneCardFrWidth + 'px'}">
      <div class="absolute-panel">
        <div class="phone-index flex-box flex-column" v-if="!phoneID">
          <div class="flex-box">
            <div class="item-box">
              <el-card class="box-card" shadow="hover">
                <div slot="header">
                    <div class="card-header">
                      <span>英文总计</span>
                    </div>
                  </div>
                  <div class="card-content flex-box">
                    <div class="flex-panel item-num">
                      <dl>
                        <dt>今天</dt>
                        <dd>{{defaultData.alltodaynumber}}</dd>
                      </dl>
                    </div>
                    <div class="flex-panel item-num">
                      <dl>
                        <dt>昨天</dt>
                        <dd>{{defaultData.alllastnumber}}</dd>
                      </dl>
                    </div>
                    <div class="flex-panel item-num">
                      <dl>
                        <dt>本月</dt>
                        <dd>{{defaultData.allnumber}}</dd>
                      </dl>
                    </div>
                  </div>
              </el-card>
            </div>
            <div class="item-box" v-for="(item,index) in defaultData.departnumber" v-bind:key="index">
              <el-card class="box-card" shadow="hover">
                <div slot="header">
                  <div class="card-header">
                    <span>{{item.depart}}</span>
                  </div>
                </div>
                <div class="card-content flex-box">
                  <div class="flex-panel item-num">
                    <dl>
                      <dt>今天</dt>
                      <dd>{{item.todaynumber}}</dd>
                    </dl>
                  </div>
                  <div class="flex-panel item-num">
                    <dl>
                      <dt>昨天</dt>
                      <dd>{{item.lastdaynumber}}</dd>
                    </dl>
                  </div>
                  <div class="flex-panel item-num">
                    <dl>
                      <dt>本月</dt>
                      <dd>{{item.monthnumber}}</dd>
                    </dl>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </div>
        <el-card class="box-card EnphoneCardFrDate" v-else shadow="hover">
          <div slot="header">
            <div class="card-header" ref="headerPane">
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
                <div class="clues-info">
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
                <div class="clues-title">
                     <h2><i class="svg-i" ><svg-icon icon-class="telBlue" /></i>{{currentPhone}}</h2>
                     <div class="clues-title-btn">
                          <el-button type="primary" size="small" class="derived" :disabled="isDisabled" v-if="menuButtonPermit.includes('Enphone_listexport')" @click="dialogExportVisible = true"><i class="svg-i" ><svg-icon icon-class="derived" /></i>导出结果</el-button>
                          <el-button type="primary" size="small" class="editorNote" :disabled="isDisabled" v-if="menuButtonPermit.includes('Enphone_othereditall')" v-on:click="editPageNote()"><i class="svg-i" ><svg-icon icon-class="editorNote" /></i>修改当前页备注</el-button>
                     </div>
                </div>
            </div>
          </div>
          <div class="card-content" ref="tableContent">
            <el-table
              border
              ref="simpleTable"
              :data="tableData"
              tooltip-effect="dark"
              stripe
              class="SiteTable"
              style="width: 100%"
              :height="tableHeight"
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
                width="180"
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
                    <p><span>物料：</span>{{scope.row.custormemail}}</p>
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
                    <p class="table-tag"><span>初次：</span><span class="level" :class="'level-'+scope.row.level_id">{{scope.row.levelname}}</span></p>
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
                width="140"
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
                v-if="(menuButtonPermit.includes('Enphone_otheredit'))&&device==='desktop'"
                width="88"
                align="center"
                prop="operations"
                label="修改">
                <template #default="scope">
                  <div class="table-button">
                    <el-button size="mini" @click="editTableInputRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Enphone_otheredit')">修改</el-button>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-if="(menuButtonPermit.includes('Enphone_edit')||menuButtonPermit.includes('Enphone_delete'))&&device==='desktop'"
                :width="operationsWidth"
                align="center"
                prop="operations"
                label="操作">
                <template #default="scope">
                  <div class="table-button">
                    <el-button size="mini" @click="editTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Enphone_edit')">修改</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="pagination-panel" ref="pagePane">
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Enphone_phoneindex',
  data() {
    return {
      phoneID:null,
      currentPhone:'',
      writepermit:false,
      menuButtonPermit:[],
      defaultData:{},
      operationsWidth:"",
      tableData:[],
      EnphoneCardFrWidth:200,
      tableHeight:200,
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
      $this.EnphoneCardFrWidth = $this.$refs.boxPane.offsetWidth-$this.$refs.EnphoneCardFl.offsetWidth-40-15;
      if($this.$route.query.phoneID){
        $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight-40-30-25-20-3;
      }
    });
    if($this.$route.query.phoneID){
      window.onresize = () => {
          return (() => {
            $this.EnphoneCardFrWidth = $this.$refs.boxPane.offsetWidth-$this.$refs.EnphoneCardFl.offsetWidth-40-15;
            $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight-40-30-25-20-3;
            // 49: 分割线高度；30：page-root上下内边距；30：el-card__body上下内边距；20：按钮父级上下内边距；3：上下border
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
        }else{
          this.phoneID = null;
        }
        this.initData();
      },
  },
  created(){
    var $this = this;
    if($this.$route.query.phoneID){
      $this.phoneID = parseInt($this.$route.query.phoneID);
    }else{
      $this.phoneID = null;
    }
    $this.initData();
  },
  updated(){
    var $this =this;
    if($this.phoneID){
      $this.$nextTick(() => {
        $this.$refs.simpleTable.doLayout();
        $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight-40-30-25-20-3;
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
            $this.defaultData = response;
            console.log(response,"电话信息");
            if($this.$route.query.phoneID){
              $this.defaultData.data.forEach(function(item,index){
                item.phone.forEach(function(item1,index1){
                  if(item1.id == $this.phoneID){
                    $this.currentPhone = item1.phonenumber;
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
    phoneJump(id){
      var queryObj = {};
      queryObj.phoneID = id;
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
      this.$router.push({path:'/Enphone/addEditClues',query:{ID:row.id}});
    },
    // 搜索统计数据跳转
    searchStatisticsData(){
      this.$router.push({path:'/Enphone/searchClues'});
    },
    // 统计分析跳转
    statisticsClues(){
      this.$router.push({path:'/Enphone/statisticChart'});
    },
    // 导出当前页数据
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '电话','询盘时间','星期','域名','渠道', '地区', '城市', '意向设备','有效','无效原因','添加人','添加时间', '等级', '客服备注','客服原因', '链接', '平台', '关键词', '电商备注', '提供者', '设备']
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
      resultData.phoneid = $this.phoneID;
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
                      console.log(response,"搜索条件信息");
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
  }
}
</script>
<style lang="scss" scoped>
</style>
