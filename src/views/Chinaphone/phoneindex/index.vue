<template>
  <div class="page-root flex-box no-padding cn-phone-index" ref="boxPane">
    <div class="sub-router">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <div class="sub-wrapper">
          <div class="side-button">
            <el-button type="primary" plain size="mini" v-if="menuButtonPermit.includes('Chinaphone_search')" v-on:click="searchStatisticsData()"><i class="svg-i" ><svg-icon icon-class="serch_en" /></i>搜索数据</el-button>
            <el-button type="primary" plain size="mini" v-if="menuButtonPermit.includes('Chinaphone_countlist')" v-on:click="statisticsClues()"><i class="svg-i" ><svg-icon icon-class="analy_en" /></i>统计分析</el-button>
          </div>
          <dl class="phone-list" v-for="(item,index) in defaultData.phoneArr" v-bind:key="index">
            <dt><span>{{item.name}}</span></dt>
            <dd v-for="phone in item.phone" v-bind:class="phone.isOn?'active':''" :key="phone.id" :title="phone.phonenumber+phone.othername" v-on:click="phoneJump(phone.id)"><span>{{phone.shortPhonenumber}}</span><i>({{phone.nowmonthnumber}})</i><em>({{phone.lastdaynumber}})</em><b>({{phone.nownumber}})</b></dd>
          </dl>
        </div>
      </el-scrollbar>
    </div>
    <div class="flex-content relative">
      <div class="abs-panel" ref="mainPane">
        <div class="scroll-panel" ref="scrollPane">
          <div class="phone-index" v-if="!phoneID">
            <div class="ChinaphoneNum" ref="numPane">
              <el-card class="box-card" shadow="hover">
                  <div class="card-header">
                        <h2>{{currentTeam}}</h2>
                        <p class="ChinaphoneNumTag">
                            <span class="item-clues" v-for="item in topdepart" v-bind:class="item.isOn?'active':''" v-bind:key="item.id" v-on:click="topdepartClick(item.id,item.name)">{{item.name}}</span>
                        </p>
                  </div>
                  <div class="card-content ChinaphoneNumBom" >
                    <div class="flex-content ChinaphoneNumItem">
                        <dl>
                          <dt>今天</dt>
                          <dd>{{defaultData.alltodaynumber}}</dd>
                        </dl>
                        <dl>
                          <dt>昨天</dt>
                          <dd>{{defaultData.alllastnumber}}</dd>
                        </dl>
                        <dl>
                          <dt>本月</dt>
                          <dd>{{defaultData.allnumber}}</dd>
                        </dl>
                    </div>
                  </div>
              </el-card>
            </div>
            <div class="ChinaphoneMap" v-bind:style="'min-height:'+minHeight+'px;'">
              <el-card class="box-card canvas-card flex-box" shadow="hover" v-bind:style="'min-height:'+(minHeight-60)+'px;'">
                <div class="card-header">
                     <h2>中文询盘趋势</h2>
                     <div class="ChinaphoneMapDate">
                        <el-select v-model="deptChart" size="small" @change="handleCheckTopdepartChange" clearable placeholder="中文总计">
                            <el-option
                            v-for="item in department"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>                        
                        <el-date-picker
                          v-model="timeChart"
                          type="daterange"
                          align="right"
                          size="small"
                          unlink-panels
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          value-format = "yyyy-MM-dd"
                          @change="handleCheckTopdepartChange"
                          :picker-options="pickerOptions">
                        </el-date-picker>
                     </div>
                </div>
                <div class="card-content ChinaphoneMapChart">
                  <div class="canvas-wrap" v-if="device==='desktop'">
                    <div id="cluesChart" class="chart-canvas"></div>
                  </div>
                  <div class="canvas-wrap" v-else>
                    <canvas id="cluesChart" class="chart-canvas"></canvas>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
          <el-card class="box-card scroll-card EnphoneCardFrDate" v-else shadow="hover">
            <div slot="header">
              <div class="card-header EnphoneCardHeader" ref="headerPane">
                  <h2 class="clues-title">当前信息：{{currentPhone}}</h2>
                  <div class="search-wrap" v-if="device==='desktop'">
                    <el-date-picker
                        v-model="searchData.date"
                        type="daterange"
                        align="right"
                        value-format = "yyyy-MM-dd"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        style="float:left;margin: 5px;"
                        :picker-options="pickerRangeOptions">
                    </el-date-picker>
                    <el-input
                      style="width: 150px;margin: 5px;float:left;"
                      placeholder="域名、备注等"
                      v-model="searchData.name"
                      clearable>
                    </el-input>
                    <el-select v-model="searchData.mode" clearable placeholder="渠道" style="width:120px;margin: 5px;float:left;">
                        <el-option
                            v-for="item in sourceList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="searchData.typekey" clearable placeholder="分类" style="width:100px;margin: 5px;float:left;">
                        <el-option
                            v-for="item in productTypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="searchData.level_id" clearable placeholder="级别" style="width:100px;margin: 5px;float:left;">
                        <el-option
                            v-for="item in levelList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="searchData.productlevel" clearable placeholder="类别" style="width:100px;margin: 5px;float:left;">
                      <el-option
                        v-for="item in categoryList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-select v-model="searchData.userid" clearable placeholder="提供者" style="width:100px;margin: 5px;float:left;">
                      <el-option
                        v-for="item in userList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-select v-model="searchData.device" clearable placeholder="设备" style="width:80px;margin: 5px;float:left;">
                      <el-option
                        v-for="item in deviceList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-select v-model="searchData.effective" clearable placeholder="价值" style="width:80px;margin: 5px;float:left;">
                      <el-option
                        v-for="item in effectiveList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-button class="item-input" type="primary" icon="el-icon-search" @click="searchResult" style="margin: 5px;float:left;">查询</el-button>
                  </div>
                  <div class="clues-info flex-wrap">
                       <div class="clues-infoFl flex-content">
                            <p>
                                <span class="item-span-1">共有<strong>{{infoData.totalCount}}</strong>条信息</span>|
                                <span class="item-span-2">有效：<strong>{{infoData.effectiveCount}}</strong>条，</span>
                                <span class="item-span-2">无效：<strong>{{infoData.invalidCount}}</strong>条</span>|
                                <span class="item-span-3">一类产品<strong>{{infoData.levelOneCount}}</strong>个，二类产品<b>{{infoData.levelTwoCount}}</b>个</span>
                                <span class="item-span-1">本月共有<strong>{{infoData.totalCountMonth}}</strong>条信息</span>|
                                <span class="item-span-2">有效：<strong>{{infoData.effectiveCountMonth}}</strong>条</span>|
                                <span class="item-span-2">无效：<strong>{{infoData.invalidCountMonth}}</strong>条。</span>
                                <span class="item-span-3">一类产品<strong>{{infoData.levelOneCountMonth}}</strong>个，二类产品<b>{{infoData.levelTwoCountMonth}}</b>个</span>
                            </p>
                       </div>
                       <div class="clues-title-btn">
                          <el-button type="primary" size="small" class="derived" :disabled="isDisabled" v-if="menuButtonPermit.includes('Chinaphone_listexport')" @click="dialogExportVisible = true"><i class="svg-i" ><svg-icon icon-class="derived" /></i>导出数据</el-button>
                          <el-button type="primary" size="small" class="editorNote" :disabled="isDisabled" v-if="menuButtonPermit.includes('Chinaphone_othereditall')" v-on:click="editPageNote()"><i class="svg-i" ><svg-icon icon-class="editorNote" /></i>修改当前页备注</el-button>
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
                row-key="id"
                v-bind:style="'min-height:'+minHeight+'px;'"
                >
                <el-table-column
                  prop="id"
                  label="ID"
                  width="80"
                  >
                </el-table-column>
                <el-table-column
                  prop="phoneText"
                  label="电话"
                  width="80"
                  >
                </el-table-column>
                <el-table-column
                  prop="xuntime"
                  label="时间"
                  width="150"
                  >
                  <template slot-scope="scope">
                    <div class="table-text">
                      <p>{{scope.row.xuntime}}</p>
                      <p>{{scope.row.weekday}}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="sourcename"
                  label="域名/渠道"
                  width="100"
                  >
                  <template slot-scope="scope">
                    <div class="table-text">
                      <p><a :href="scope.row.url" target="_blank">{{scope.row.domain}}</a></p>
                      <p>{{scope.row.sourcename}}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="sourcename"
                  label="地区/归属地"
                  width="100"
                  >
                  <template slot-scope="scope">
                    <div class="table-text">
                      <p>{{scope.row.province}}<span v-if="scope.row.province&&scope.row.city">/</span>{{scope.row.city}}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="keyproduct"
                  label="意向设备"
                  width="100"
                  >
                  <template slot-scope="scope">
                    <span class="product-span" v-bind:class="'level_'+scope.row.productlevel"><i>[{{scope.row.productlevel}}]</i>{{scope.row.keyproduct}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="effective"
                  label="有效"
                  width="60"
                  >
                  <template slot-scope="scope">
                    <div class="table-tag"><el-checkbox v-model="scope.row.isEffective" disabled></el-checkbox></div>
                    <div class="table-text" v-if="!scope.row.isEffective"><p>{{scope.row.invalidcause}}</p></div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="addusername"
                  label="添加人"
                  width="80"
                  >
                </el-table-column>
                <el-table-column
                  prop="addtime"
                  label="添加时间"
                  width="150"
                  >
                </el-table-column>
                <el-table-column
                  prop="levelname"
                  label="等级"
                  min-width="60"
                  >
                  <template slot-scope="scope">
                    <div class="table-tag"><span class="level" @click="handleCustormeditlogClick(scope.row.id)" :class="'level-'+scope.row.level_id">{{scope.row.levelname}}</span></div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="levelname"
                  label="备注/原因"
                  min-width="120"
                  >
                  <template slot-scope="scope">
                    <div class="table-text">
                      <p>{{scope.row.custormcause}}</p>
                      <p>{{scope.row.custormremark}}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="writepermit&&(permitField.includes('domain')||permitField.includes('url'))"
                  key="a"
                  fixed="right"
                  prop="url"
                  label="域名/链接"
                  min-width="150"
                  >
                  <template slot-scope="scope">
                    <div class="table-input">
                      <el-input size="small" v-model="scope.row.domain" v-if="permitField.includes('domain')"></el-input>
                      <el-input size="small" v-model="scope.row.url" v-if="permitField.includes('url')"></el-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="writepermit&&(permitField.includes('search')||permitField.includes('searchword'))"
                  key="b"
                  fixed="right"
                  prop="searchword"
                  label="平台/关键词"
                  min-width="110"
                  >
                  <template slot-scope="scope">
                    <div class="table-input">
                      <el-input size="small" v-model="scope.row.search" v-if="permitField.includes('search')"></el-input>
                      <el-input size="small" v-model="scope.row.searchword" v-if="permitField.includes('searchword')"></el-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="writepermit&&permitField.includes('remark')"
                  key="c"
                  fixed="right"
                  prop="remark"
                  label="备注"
                  min-width="140"
                  >
                  <template slot-scope="scope">
                    <div class="table-input">
                      <el-input size="small" type="textarea" rows="3" resize="none" v-model="scope.row.remark" v-if="permitField.includes('remark')"></el-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="writepermit&&(permitField.includes('userid')||permitField.includes('device'))"
                  key="d"
                  fixed="right"
                  prop="searchword"
                  label="提供者/设备"
                  min-width="100"
                  >
                  <template slot-scope="scope">
                    <div class="table-input">
                      <el-input size="small" v-model="scope.row.useridname" v-if="permitField.includes('userid')"></el-input>
                      <el-input size="small" v-model="scope.row.device" v-if="permitField.includes('device')"></el-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="writepermit&&(menuButtonPermit.includes('Chinaphone_otheredit'))&&device==='desktop'"
                  width="88"
                  fixed="right"
                  align="center"
                  prop="operations"
                  label="修改">
                  <template #default="scope">
                    <div class="table-button">
                      <el-button size="mini" @click="editTableInputRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Chinaphone_otheredit')">修改</el-button>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="writepermit&&(menuButtonPermit.includes('Chinaphone_edit')||menuButtonPermit.includes('Chinaphone_delete'))&&device==='desktop'"
                  :width="operationsWidth"
                  align="center"
                  fixed="right"
                  prop="operations"
                  label="操作">
                  <template #default="scope">
                    <div class="table-button">
                      <el-button size="mini" @click="editTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Chinaphone_edit')">修改</el-button>
                      <el-button size="mini" @click="deleteTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Chinaphone_delete')">删除</el-button>
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
import { Column } from '@antv/g2plot';
export default {
  name: 'Chinaphone_phoneindex',
  data() {
    return {
      minHeight:0,
      phoneID:null,
      currentPhone:'',
      writepermit:false,
      menuButtonPermit:[],
      defaultData:{},
      operationsWidth:"",
      tableData:[],      
      maxDate:[],
      minDate:[],
      maxNum:0,
      searchData:{
        date:[],
        name:"",
        page:1,
        limit:20,
        mode:"",
        typekey:'',
        level_id:'',
        productlevel:'',
        userid:'',
        device:'',
        effective:'',
      },
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
      deviceList:[],
      productTypeList:[],
      sourceList:[],
      userList:[],
      levelList:[],
      categoryList:[],
      effectiveList:[
        {label:"有效",value:1},
        {label:"无效",value:2},
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
      columnPlot:null,
      formLabelWidth:"110px",
      exportForm:{
        fileName:"",
        bookType:"xlsx"
      },
      dialogExportVisible:false,
      downloadLoading: false,
      permitField:[],
      isDisabled:true,
      topdepart:[],
      topdepartChartList:[],      
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
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
      chartData:{
         dept_id:[],
         starttime:"",
         endtime:"",
      },
      department:[],
      timeChart:"",
      deptChart:"0",
      tableShow:true,      
      levelPop:[],  
      levelPopBool:false,
      currentTeam:"中文总计",
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
      }else{
        $this.minHeight = $this.$refs.mainPane.offsetHeight-$this.$refs.numPane.offsetHeight-45; 
        $this.drawChart();
      }
    });
    window.onresize = () => {
      return (() => {
        if($this.$route.query.phoneID){
          $this.minHeight = $this.$refs.mainPane.offsetHeight-$this.$refs.headerPane.offsetHeight-75; 
        }else{
          $this.minHeight = $this.$refs.mainPane.offsetHeight-$this.$refs.numPane.offsetHeight-45; 
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
    $this.$nextTick(() => {
      if($this.phoneID){
          $this.minHeight = $this.$refs.mainPane.offsetHeight-$this.$refs.headerPane.offsetHeight-75; 
          $this.$refs.simpleTable.doLayout();
      }else{
        $this.minHeight = $this.$refs.mainPane.offsetHeight-$this.$refs.numPane.offsetHeight-45; 
      }
    })
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
      $this.$store.dispatch('chinaphone/cluesPhoneIndexDataAction', $this.chartData).then(response=>{
        if(response){
          if(response.status){
            var numArr = [];
            response.groupmonthtrend.forEach(function(item,index){
              item.date = item.date+"\n"+item.week;
              numArr.push(item.xunnumber);
            });
            var maxNum = Math.max(...numArr);
            var minNum = Math.min(...numArr);
            var maxDate = [];
            var minDate = [];
            response.groupmonthtrend.forEach(function(item,index){
              if(item.xunnumber === maxNum){
                maxDate.push(item.date)
              }else if(item.xunnumber === minNum){
                minDate.push(item.date);
              }
            });
            $this.maxNum = maxNum;
            $this.maxDate = maxDate;
            $this.minDate = minDate;
            var phoneArr=response.data;
            phoneArr.forEach(function(item,index){
               item.phone.forEach(function(item01,index01){
                   var tagphone='-';
                　　if(item01.phonenumber.indexOf(tagphone)!=-1){
                       item01.shortPhonenumber=item01.phonenumber.split("-")[1];
                　　}else{
                      item01.shortPhonenumber=item01.phonenumber;
                    }
               });
            });
            $this.defaultData = response;
            $this.defaultData.phoneArr=phoneArr;
            console.log($this.defaultData,"电话信息");
            if($this.$route.query.phoneID){
              $this.defaultData.data.forEach(function(item,index){
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
            }else{              
              var topdepart=[];
              var topdepartObj = {
                id:'0',
                name:'中文总计',
                alllastday:response.allgrouplastnumber,
                allnumber:response.allgroupnumber,
                alltoday:response.allgrouptodaynumber,
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
                itemData.isOn=false;
                topdepart.push(itemData);
              });
              $this.topdepart=topdepart;
              console.log($this.topdepart,'topdepart');
              var topdepartChartList=[];
              $this.topdepart.forEach(function(item,index){
                var itemData = {};
                itemData.value = item.id;
                itemData.label = item.name;
                topdepartChartList.push(itemData);
              });
              $this.topdepartChartList=topdepartChartList;
              $this.departmentData();
              $this.drawChart();
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
    // 获取搜索部门
    departmentData(){
      var $this = this;
      $this.$store.dispatch('chinaphone/cluesdepartmentDataAction', null).then(response=>{
        if(response){
          if(response.status){
              var departmentList = response.data;
              var department=[];
              var DepartmentObj = {
                value:'0',
                label:'中文总计',
              };
              department.push(DepartmentObj);
              departmentList.forEach(function(item,index){
                var itemData = {};
                itemData.value = item.id;
                itemData.label = item.name;
                department.push(itemData);
              });
              $this.department=department;
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
    // 组装搜索接口所需数据
    initSearchData(){
      var $this = this;
      var searchData = {};
      searchData.page = $this.searchData.page;
      searchData.limit = $this.searchData.limit;
      searchData.phoneid = $this.phoneID;
      if($this.searchData.mod&&$this.searchData.mode!=''){
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
      if($this.searchData.userid&&$this.searchData.userid!=''){
        searchData.userid = $this.searchData.userid;
      }
      if($this.searchData.device&&$this.searchData.device!=''){
        searchData.device = $this.searchData.device;
      }
      if($this.searchData.effective&&$this.searchData.effective!=''){
        searchData.effective = $this.searchData.effective;
      }
      if($this.searchData.name&&$this.searchData.name!=''){
        searchData.name = $this.searchData.name;
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
      $this.$store.dispatch('chinaphone/cluesCurrentPhoneDataAction', searchData).then(response=>{
        if(response){
          if(response.status){
            var infoData = {};
            infoData.totalCount=response.allcount;
            infoData.effectiveCount=response.effectivecount;
            infoData.invalidCount=response.noeffectivecount;
            infoData.levelOneCount=response.productonecount;
            infoData.levelTwoCount=response.producttwocount;
            infoData.totalCountMonth=response.nowmonthnumber;
            infoData.effectiveCountMonth=response.noweffectivenumber;
            infoData.invalidCountMonth=response.nownoeffectivenumber;
            infoData.levelOneCountMonth=response.nowmonthone;
            infoData.levelTwoCountMonth=response.nowmonthtwo;
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
    // 图表功能
    drawChart(){
      var $this = this;
      if($this.defaultData.groupmonthtrend){
        if($this.device == "desktop"){
          const maxColor = '#FF4500';
          const minColor = '#1CC25E';
          const defaultColor = '#5B8FF9';
          const columnPlot = new Column('cluesChart', {
            data:$this.defaultData.groupmonthtrend,    
            xField: 'date',
            yField: 'xunnumber',
            appendPadding:[15,15,15,15],
            seriesField: '',
            color: ({ date }) => {
              var currentColor = defaultColor;
              $this.maxDate.forEach(function(item,index){
                if(date == item){
                  currentColor = maxColor;
                }
              });
              $this.minDate.forEach(function(item,index){
                if(date == item){
                  currentColor = minColor;
                }
              });
              return currentColor;
            },
            xAxis:{
              label:{
                autoHide:true
              },
            },
            label:{
              position:'top',
              offsetY:8,
              style: {
                fill: '#000',
                opacity:1
              },
            },
            tooltip: {
              formatter: (datum) => {
                return { name: "询盘个数", value: datum.xunnumber };
              },
              title:(e)=>{
                return e.replace(/\n/g," ")
              }
            },
            meta: {
              date: {
                alias: '日期',
              },
              xunnumber: {
                alias: '询盘个数',
                max: $this.maxNum,
                min: 0,
              },
            },
            annotations: [
              // 平均值
              {
                type: 'line',
                start: ['min', $this.defaultData.avgnumber],
                end: ['max', $this.defaultData.avgnumber],
                top:true,
                offsetY: -2,
                offsetX: -22,
                text: {
                  position:['max','max'],
                  content: '平均值：'+$this.defaultData.avgnumber,
                  autoAdjust:true,
                  style: {
                    textAlign: 'center',
                    fontSize: 12,
                    fill: '#025DF4',
                    textBaseline: 'bottom',
                  },
                },
                style: {
                  stroke: '#025DF4',
                  lineDash: [2, 2],
                },
              },
            ],
          });
          $this.columnPlot = columnPlot;
          columnPlot.render();
        }else{
          // Step 1: 创建 Chart 对象
          const chart = new $this.$F2.Chart({
            id: 'cluesChart',
            pixelRatio: window.devicePixelRatio // 指定分辨率
          });
          // Step 2: 载入数据源
          chart.source($this.defaultData.groupmonthtrend, {
            date: {
              tickCount: 11
            }
          });
          chart.legend(true);
          //配置对应方式
          chart.axis('date', {
            label: function label(text, index, total) {
              var textCfg = {};
              if (index === 0) {
                textCfg.textAlign = 'left';
              } else if (index === total - 1) {
                textCfg.textAlign = 'right';
              }
              return textCfg;
            }
          });
          // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
          chart.interval().position('date*xunnumber');
    
          // Step 4: 渲染图表
          chart.render();

          // 绘制柱状图文本
          var offset = -5;
          var canvas = chart.get('canvas');
          var group = canvas.addGroup();
          var shapes = {};
          $this.defaultData.groupmonthtrend.forEach(function(obj) {
            var point = chart.getPosition(obj);
            var text = group.addShape('text', {
              attrs: {
                x: point.x,
                y: point.y + offset,
                text: obj.xunnumber,
                textAlign: 'center',
                textBaseline: 'bottom',
                fill: '#808080'
              }
            });
            shapes[obj.date] = text; // 缓存该 shape, 便于后续查找
          });
        }
      }
    },
    // 电话点击跳转列表
    phoneJump(id){
      if(this.columnPlot&&!this.columnPlot.chart.destroyed){
        this.columnPlot.destroy();
      }
      var queryObj = {};
      queryObj.phoneID = id;
      this.$router.push({page:'Chinaphone/phoneindex',query:queryObj});
    },
    // 获取当前电话的搜索条件数据
    getCurrentPhoneSearchData(){
      var $this = this;
      $this.$store.dispatch('chinaphone/cluesCurrentPhoneSearchDataAction', {phoneid:$this.phoneID}).then(response=>{
        if(response){
          if(response.status){
            console.log(response,"搜索条件信息");
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
            var categoryList = [];
            response.xuntype.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              categoryList.push(itemData);
            });
            $this.categoryList = categoryList;
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
      var routeUrl =  $this.$router.resolve({path:'/Chinaphone/addEditClues',query:{ID:row.id}});
      window.open(routeUrl.href,'_blank');
    },
    // 搜索统计数据跳转
    searchStatisticsData(){
      var $this = this;
      if($this.device==='desktop'){
        var routeUrl =  $this.$router.resolve({path:'/Chinaphone/searchClues'});
        window.open(routeUrl.href,'_blank');
      }else{
        $this.$router.push({path:'/Chinaphone/searchClues'});
      }
    },
    // 统计分析跳转
    statisticsClues(){
      var $this = this;
      if($this.device==='desktop'){
        var routeUrl =  $this.$router.resolve({path:'/Chinaphone/statisticChart'});
        window.open(routeUrl.href,'_blank');
      }else{
        $this.$router.push({path:'/Chinaphone/statisticChart'});
      }
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
    // 部门点击事件
    topdepartClick(Tid,name){
      var $this = this;
      var topdepart = $this.topdepart;
      $this.currentTeam = name;
      topdepart.forEach(function(item){
        if(item.id == Tid){
          item.isOn = true;
          $this.defaultData.alltodaynumber=item.alltoday;
          $this.defaultData.alllastnumber=item.alllastday;
          $this.defaultData.allnumber=item.allnumber;
        }else{
          item.isOn = false;
        }
      });
      $this.topdepart=topdepart;
      console.log($this.topdepart,'$this.topdepart');
    },   
    // 部门选择图表点击事件 
    handleCheckTopdepartChange(){
      var $this = this;
      if($this.columnPlot&&!$this.columnPlot.chart.destroyed){
        $this.columnPlot.destroy();
      }
      if($this.timeChart&&$this.timeChart.length>0){
        $this.chartData.starttime = $this.timeChart[0];
        $this.chartData.endtime = $this.timeChart[1];
      }else{
        $this.chartData.starttime='';
        $this.chartData.endtime='';
      }
      if($this.deptChart&&$this.deptChart!=''&&$this.deptChart!='0'){
        $this.chartData.dept_id=[$this.deptChart];
      }else{
        $this.chartData.dept_id=[];
      }
      $this.initPage();
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
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
