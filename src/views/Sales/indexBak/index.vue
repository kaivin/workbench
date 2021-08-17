<template>
  <div class="page-root flex-box SalesCard" ref="boxPane">
    <div class="flex-panel">
      <div class="absolute-panel">
        <el-card class="box-card EnphoneCardFrDate" shadow="hover">
          <div slot="header">
            <div class="card-header" ref="headerPane">
                <div class="search-wrap" v-if="device==='desktop'">
                     <div class="SalesCardOne">
                       <span>搜索：[</span>
                        <el-select v-model="searchData.timetype" size="small" clearable placeholder="分配时间" style="width:140px;margin:5px 10px;float:left;">
                            <el-option
                                v-for="item in timetypelist"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
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
                            style="float:left;margin:5px 10px 5px 0px; width:280px;"
                            :picker-options="pickerRangeOptions">
                        </el-date-picker>
                       <span>]</span>
                     </div>
                    <el-select v-model="searchData.continent" size="small" clearable placeholder="大洲" style="width:100px;margin:5px 10px 5px 0px;float:left;">
                        <el-option
                            v-for="item in continentlist"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="searchData.producttype_id" size="small" clearable placeholder="产品类型" style="width:120px;margin:5px 10px 5px 0px;float:left;">
                        <el-option
                            v-for="item in producttype_idList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="searchData.productid" size="small" clearable placeholder="产品名" style="width:120px;margin:5px 10px 5px 0px;float:left;">
                        <el-option
                            v-for="item in productidList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="searchData.managestatus" size="small" clearable placeholder="处理" style="width:100px;margin:5px 10px 5px 0px;float:left;">
                        <el-option
                            v-for="item in managestatusList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="searchData.replystatus" size="small" clearable placeholder="回复情况" style="width:100px;margin:5px 10px 5px 0px;float:left;">
                        <el-option
                            v-for="item in replystatusList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="searchData.ennature" size="small" clearable placeholder="性质" style="width:150px;margin:5px 10px 5px 0px;float:left;">
                        <el-option
                            v-for="item in ennatureList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="searchData.enxunprice" size="small" clearable placeholder="需求" style="width:100px;margin:5px 10px 5px 0px;float:left;">
                        <el-option
                            v-for="item in enxunpriceList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-checkbox-group v-model="feedbackArr" class="SalesCardcheckbox" @change="feedbackClick">
                      <el-checkbox v-for="item in feedbackList" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                    <div class="SalesCardInput">
                        <span>关键词：</span>
                        <el-input
                            style="width: 150px;margin:5px 10px 5px 0px;float:left;" size="small"
                            placeholder=""
                            v-model="searchData.keyword"
                            clearable>
                        </el-input>
                    </div>
                    <div class="SalesCardInput">
                        <span>富通ID/分配ID：</span>
                        <el-input
                            style="width: 100px;margin:5px 10px 5px 0px;float:left;" size="small"
                            placeholder="备注2"
                            v-model="searchData.ftword_id"
                            clearable>
                        </el-input>
                    </div>
                    <el-button class="item-input" size="small" type="primary" icon="el-icon-search" @click="searchResult" style="margin:5px 10px 5px 0px;float:left;">查询</el-button>
                </div>
                <div class="clues-info">
                  <p>                  
                      <span class="item-span-1">当前结果集状态：共有<strong>{{infoData.totalCount}}</strong>条。</span>                  
                  </p>
                </div>
                <div class="clues-title">
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
                label="咨询时间与说明"
                width="180"
                >
                <template slot-scope="scope">
                  <div class="table-text">
                    <p>星期：</p>
                    <p>业务员：</p>
                    <p>特别说明：</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="sourcename"
                label="大州/地区"
                width="150"
                >
                <template slot-scope="scope">
                  <div class="table-text">
                    <p>大州：</p>
                    <p>国家：</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="sourcename"
                label="类型/产品"
                width="150"
                >
                <template slot-scope="scope">
                  <div class="table-text">
                    <p><span>类型：</span></p>
                    <p><span>产品：</span></p>
                    <p><span>富通：</span></p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="keyproduct"
                label="联系方式"
                min-width="150"
                >
                <template slot-scope="scope">
                  <div class="table-text">
                    <p><span>称呼：</span></p>
                    <p><span>邮箱：</span></p>
                    <p><span>电话：</span></p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="effective"
                label="需求详情"
                width="100"
                >
                <template slot-scope="scope">
                  <div class="table-text">
                    <p>需求详情</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="xunremark"
                label="处理/回复"
                min-width="100"
                >
                <template slot-scope="scope">
                  <div class="table-text">
                    <p>处理</p>
                    <p>回复</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="addusername"
                label="客户性质"
                width="120"
                >
                <template slot-scope="scope">
                  <div class="table-text">
                    <p>客户性质</p>
                    <p>客户性质</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="hassale"
                label="个人备注"
                width="100"
                >
                <template slot-scope="scope">
                  <div class="table-text">
                    <p>个人备注</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="addtime"
                label="添加/修改时间"
                width="140"
                >
                <template slot-scope="scope">
                  <div class="table-text">
                    <p>时间</p>
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
  name: 'sales Index',
  data() {
    return {
      writepermit:false,
      menuButtonPermit:[],
      operationsWidth:"",
      tableData:[],
      tableHeight:200,
      searchData:{
        page:1,
        limit:15,
        timetype:1,
        date:[],
        starttime: "",
        endtime: "",
        continent: "",
        producttype_id:"",
        productid: "",
        managestatus: "",
        replystatus: "",
        ennature: "",
        enxunprice: "",
        feedback:"",
        keyword: "",
        ftword_id: ""
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
        {label:"待处理",value:1},
        {label:"已处理",value:2},
      ],
      replystatusList:[
        {label:"未标记",value:1},
        {label:"已回复",value:2},
        {label:"未回复",value:3},
      ],
      ennatureList:[],
      enxunpriceList:[],
      feedbackArr:[],
      feedbackList:[
        {label:"已反馈",value:1},
        {label:"未反馈",value:2},
      ],
      pageSizeList:[15],
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
        totalCount:0,
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
    });
    window.onresize = () => {
        return (() => {
          // 49: 分割线高度；30：page-root上下内边距；30：el-card__body上下内边距；20：按钮父级上下内边距；3：上下border
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
        this.initData();
      },
  },
  created(){
    var $this = this;
    $this.initData();
  },
  updated(){
    var $this =this;
    $this.$nextTick(() => {
      $this.$refs.simpleTable.doLayout();
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
      $this.$store.dispatch('Sales/getSalesSearchListAction', null).then(response=>{
        if(response){
          if(response.status){
            console.log(response,"response-01");
            var producttype_idList=[];
            response.producttype.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              producttype_idList.push(itemData);
            });
            $this.producttype_idList=producttype_idList;
            var productidList=[];
            response.producttype.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              productidList.push(itemData);
            });
            $this.productidList=productidList;
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
    // 组装搜索接口所需数据
    initSearchData(){
      var $this = this;
      var searchData = {};
      searchData.page = $this.searchData.page;
      searchData.limit = $this.searchData.limit;
      searchData.timetype = $this.searchData.timetype;
      if($this.searchData.date&&$this.searchData.date.length>0){
        searchData.starttime = $this.searchData.date[0];
        searchData.endtime = $this.searchData.date[1];
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
      if($this.searchData.managestatus&&$this.searchData.managestatus!=''){
        searchData.managestatus = $this.searchData.managestatus;
      }
      if($this.searchData.replystatus&&$this.searchData.replystatus!=''){
        searchData.replystatus = $this.searchData.replystatus;
      }
      if($this.searchData.ennature&&$this.searchData.ennature!=''){
        searchData.ennature = $this.searchData.ennature;
      }
      if($this.searchData.enxunprice&&$this.searchData.enxunprice!=''){
        searchData.enxunprice = $this.searchData.enxunprice;
      }
      if($this.searchData.feedback&&$this.searchData.feedback!=''){
        searchData.feedback = $this.searchData.feedback;
      }
      if($this.searchData.keyword!=''){
        searchData.keyword = $this.searchData.keyword;
      }
      if($this.searchData.ftword_id!=''){
        searchData.ftword_id = $this.searchData.ftword_id;
      }
      return searchData;
    },
    // 初始化询盘列表数据
    initCluesList(){
      var $this = this;
      var searchData = $this.initSearchData();
      $this.$store.dispatch('Sales/getSalesListAction', searchData).then(response=>{
        if(response){
          if(response.status){
            console.log(response,"询盘信息01");
            $this.tableData = response.data;
            $this.totalDataNum = response.allcount;
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
            if($this.menuButtonPermit.includes('Sales_index')){
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
    // 反馈点击事件
    feedbackClick(){
      var $this = this;
      var feedbackArr = $this.feedbackArr;
      if (feedbackArr.length > 1) {
        feedbackArr.shift();
        $this.feedbackArr = feedbackArr;
        $this.searchData.feedback = $this.feedbackArr.toString();
      }else{
        $this.searchData.feedback = '';
      }
    },
  }
}
</script>
<style lang="scss" scoped>
</style>

