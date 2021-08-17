<template>
  <div class="page-root flex-box no-padding EnphoneCard" ref="boxPane">
    <div class="sub-router">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <div class="sub-wrapper">
          <div class="side-button">
            <el-button type="primary" plain size="mini" v-if="menuButtonPermit.includes('Chinaphone_search')" v-on:click="searchStatisticsData()"><i class="svg-i" ><svg-icon icon-class="serch_en" /></i>搜索数据</el-button>
            <el-button type="primary" plain size="mini" v-if="menuButtonPermit.includes('Chinaphone_countlist')" v-on:click="statisticsClues()"><i class="svg-i" ><svg-icon icon-class="analy_en" /></i>统计分析</el-button>
          </div>
          <dl class="phone-list" v-for="(item,index) in defaultData.data" v-bind:key="index">
            <dt><span>{{item.name}}</span></dt>
            <dd v-for="phone in item.phone" :key="phone.id" :title="phone.phonenumber+phone.othername" v-on:click="phoneJump(phone.id)"><span>{{phone.phonenumber}}</span><i>({{phone.nowmonthnumber}})</i><em>({{phone.lastdaynumber}})</em><b>({{phone.nownumber}})</b></dd>
          </dl>
        </div>
      </el-scrollbar>
    </div>
    <div class="flex-content EnphoneCardFr">
      <div class="abs-panel">
        <div class="scroll-panel" ref="scrollPane">
          <div class="phone-index flex-box flex-column" v-if="!phoneID">
            <div class="num-box">
              <el-row :gutter="15" v-if="defaultData.show==2">
                <el-col :xs="24" :sm="12">
                  <el-card class="box-card" shadow="hover">
                    <div slot="header">
                        <div class="card-header">
                          <span>部门总计</span>
                        </div>
                      </div>
                      <div class="card-content flex-box">
                        <div class="flex-panel item-num">
                          <dl>
                            <dt>今天</dt>
                            <dd>{{defaultData.allgrouptodaynumber}}</dd>
                          </dl>
                        </div>
                        <div class="flex-panel item-num">
                          <dl>
                            <dt>昨天</dt>
                            <dd>{{defaultData.allgrouplastnumber}}</dd>
                          </dl>
                        </div>
                        <div class="flex-panel item-num">
                          <dl>
                            <dt>本月</dt>
                            <dd>{{defaultData.allgroupnumber}}</dd>
                          </dl>
                        </div>
                      </div>
                  </el-card>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <el-card class="box-card" shadow="hover">
                    <div slot="header">
                      <div class="card-header">
                        <span>中文总计</span>
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
                </el-col>
              </el-row>
              <el-row :gutter="15" v-else>
                <el-col :span="24">
                  <el-card class="box-card" shadow="hover">
                    <div slot="header">
                      <div class="card-header">
                        <span>中文总计</span>
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
                </el-col>
              </el-row>
            </div>
            <div class="flex-panel">
              <el-card class="box-card canvas-card" shadow="hover">
                <div slot="header">
                  <div class="card-header">
                    <span v-if="defaultData.show==2">本部门询盘月度趋势</span>
                    <span v-else>中文询盘月度趋势</span>
                  </div>
                </div>
                <div class="card-content flex-box">
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
              <div class="card-header" ref="headerPane">
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
                  <div class="clues-info">
                    <p>
                        <span class="item-span-1">共有<strong>{{infoData.totalCount}}</strong>条。</span>
                        <span class="item-span-2">有效：<strong>{{infoData.effectiveCount}}</strong>条。</span>
                        <span class="item-span-2">无效：<strong>{{infoData.invalidCount}}</strong>条。</span>
                        <span class="item-span-3">其中：一类产品<strong>{{infoData.levelOneCount}}</strong>个，二类产品<b>{{infoData.levelTwoCount}}</b>个。</span>
                    </p>
                    <p>
                        <span class="item-span-1">本月共有<strong>{{infoData.totalCountMonth}}</strong>条信息。</span>
                        <span class="item-span-2">有效：<strong>{{infoData.effectiveCountMonth}}</strong>条。</span>
                        <span class="item-span-2">无效：<strong>{{infoData.invalidCountMonth}}</strong>条。</span>
                        <span class="item-span-3">其中：一类产品<strong>{{infoData.levelOneCountMonth}}</strong>个，二类产品<b>{{infoData.levelTwoCountMonth}}</b>个。</span>
                    </p>
                  </div>
                  <div class="clues-title">
                      <h2><i class="svg-i" ><svg-icon icon-class="telBlue" /></i>{{currentPhone}}</h2>
                      <div class="clues-title-btn">
                          <el-button type="primary" size="small" class="derived" :disabled="isDisabled" v-if="menuButtonPermit.includes('Chinaphone_listexport')" @click="dialogExportVisible = true"><i class="svg-i" ><svg-icon icon-class="derived" /></i>导出数据</el-button>
                          <el-button type="primary" size="small" class="editorNote" :disabled="isDisabled" v-if="menuButtonPermit.includes('Chinaphone_othereditall')" v-on:click="editPageNote()"><i class="svg-i" ><svg-icon icon-class="editorNote" /></i>修改当前页备注</el-button>
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
                      <p>{{scope.row.province}}/{{scope.row.city}}</p>
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
                    <div class="table-tag"><span class="level" :class="'level-'+scope.row.level_id">{{scope.row.levelname}}</span></div>
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
import { Column } from '@antv/g2plot';
export default {
  name: 'Chinaphone_phoneindex',
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
        $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight-30-20-25-20-5;
      }else{
        $this.drawChart();
      }
    });
    if($this.$route.query.phoneID){
      window.onresize = () => {
          return (() => {
            $this.EnphoneCardFrWidth = $this.$refs.boxPane.offsetWidth-$this.$refs.EnphoneCardFl.offsetWidth-40-15;
            $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight-30-20-25-20-5;
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
        $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight-30-20-25-20-5;
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
      $this.$store.dispatch('chinaphone/cluesPhoneIndexDataAction', null).then(response=>{
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
            }else{
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
      if(this.columnPlot&&this.columnPlot.chart.destroyed){
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
      this.$router.push({path:'/Chinaphone/addEditClues',query:{ID:row.id}});
    },
    // 搜索统计数据跳转
    searchStatisticsData(){
      this.$router.push({path:'/Chinaphone/searchClues'});
    },
    // 统计分析跳转
    statisticsClues(){
      this.$router.push({path:'/Chinaphone/statisticChart'});
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
  }
}
</script>
<style lang="scss" scoped>
.form-title{
  width: 110px;
  display: inline-block;
  text-align: right;
  vertical-align: middle;
  font-size: 14px;
  color: #606266;
  line-height: 36px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
}
.item-form.icon{
  padding-right: 76px;
}
.item-form{
    padding-right: 30px;
    position: relative;
    .icon-button{
      width: 36px;
      height: 36px;
      position: absolute;
      top:0;
      right: 30px;
      border: 1px solid #C0C4CC;
      border-radius: 4px;
      text-align: center;
      line-height: 34px;
      font-size: 18px;
      color: #999;
      cursor: pointer;
    }
    >span{
      display: block;
      width: 30px;
      height: 36px;
      position: absolute;
      right:0;
      top:0;
      text-align: center;
      line-height: 36px;
      font-size: 14px;
      cursor: pointer;
      color: #bbb;
    }
    &:before,
    &:after {
      content: "";
      display: table;
    }
    &:after {
      clear: both;
    }
  }
.item-form-group{
  width: 100%;
  &:before,
  &:after {
    content: "";
    display: table;
  }
  &:after {
    clear: both;
  }
  .item-form-3{
    width: 180px;
    float:left;
    padding-right: 30px;
    position: relative;
    &:before,
    &:after {
      content: "";
      display: table;
    }
    &:after {
      clear: both;
    }
    >span{
      display: block;
      width: 30px;
      height: 36px;
      position: absolute;
      right:0;
      top:0;
      text-align: center;
      line-height: 36px;
      font-size: 14px;
      cursor: pointer;
      color: #bbb;
    }
  }
  .item-form{
    width: 50%;
    float:left;
    }
}
.clues-panel{
  position: relative;
}
.phone-index{
  height: 100%;
  .card-header{
    padding: 5px;
  }
}
.num-box{
  .box-card{
    margin-bottom: 15px;
    .item-num{
      font-size:0;
      line-height:0;
      text-align: center;
      overflow: hidden;
      padding: 60px 0;
      dl{
        display: inline-block;
        vertical-align: top;
        overflow: hidden;
        dt,dd{
          display: block;
          width: 100%;
          text-align: right;
        }
        dt{
          font-size: 16px;
          line-height: 1.5;
        }
        dd{
          font-size: 48px;
          line-height: 1;
          color: #fc5457;
        }
      }
    }
  }
}
.canvas-card{
  ::v-deep .el-card__body{
    padding:0;
    position: relative;
  }
  .canvas-wrap{
    position: absolute;
    left:0;
    top:0;
    width: 100%;
    height: 100%;
    padding: 15px;
    .chart-canvas{
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
.product-span{
    i{
        font-style: normal;
        font-weight: bold;
    }
    &.level_1{
        i{color:#B3315F};
    }
    &.level_2{
        i{
            color: #130CB7;
        }
    }
    &.level_3{
        i{
            color: #6a6a6b;
        }
    }
}
.absolute-panel{
  position: absolute;
  left:0;
  top:0;
  width: 100%;
  height: 100%;
}
.table-input{
  .el-input+.el-input{
    margin-top: 10px;
  }
  .el-input{
    ::v-deep .el-input__inner{
      padding: 0 10px!important;
    }
  }
  .el-textarea{
    ::v-deep .el-textarea__inner{
      padding: 5px 10px!important;
    }
  }
}
.table-text{
  p{
    a{
      color: $--color-primary;
      &:hover{
        text-decoration: underline;
      }
    }
  }
}
.table-tag{
  text-align: center;
  .level{
    display: inline-block;
    border-radius: 4px;
    padding: 0 5px;
    color: #fff;
  }
  .level-1{
    background: #ff0000;
  }
  .level-2{
    background: #eab905;
  }
  .level-3{
    background: #293cfc;
  }
  .level-4{
    background: #1acfda;
  }
  .level-5{
    background: #f6b37f;
  }
  .level-6{
    background: #7e84fd;
  }
}
.export-dialog{
  .el-form-item{
    margin-right:0!important;
    width: 100%;
    ::v-deep .el-form-item__content{
      width: 240px;
      .el-select,.el-input{
        width: 100%;
      }
    }
  }
}
</style>
