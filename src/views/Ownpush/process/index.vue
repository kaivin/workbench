<template>
  <div class="page-root process-index" ref="boxPane">
    <el-card class="box-card" shadow="hover">
      <div slot="header">
        <div class="card-header" ref="headerPane">
          <div class="search-wrap" ref="searchPane" v-if="device==='desktop'">
            <div class="item-search">
              <el-date-picker
                  class="date-picker"
                  size="small"
                  v-model="searchData.date"
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
            <div class="item-search">
              <el-select v-model="searchData.account_id" size="small" filterable clearable multiple collapse-tags placeholder="请选择账户" class="select-panel">
                  <el-option
                      v-for="item in accountList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
              </el-select>
            </div>
            <div class="item-search">
              <el-select v-model="searchData.processtype" size="small" filterable clearable multiple collapse-tags placeholder="请选择渠道" class="select-panel">
                  <el-option
                      v-for="item in channelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
              </el-select>
            </div>
            <div class="item-search">
              <el-select v-model="searchData.processuserid" size="small" filterable clearable multiple collapse-tags placeholder="请选择负责人" class="select-panel">
                  <el-option
                      v-for="item in userList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
              </el-select>
            </div>
            <div class="item-search">
              <el-select v-model="searchData.brand_id" size="small" clearable multiple collapse-tags placeholder="请选择品牌" class="select-panel">
                <el-option
                  v-for="item in brandList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="item-search">
              <el-button class="item-input" type="primary" size="small" icon="el-icon-search" @click="searchResult">查询</el-button>
            </div>
          </div>
          <div class="clues-title">
            <div class="clues-title-btn">
                <el-button type="primary" size="small" class="derived" v-on:click="dialogImportVisible = true"><i class="svg-i" ><svg-icon icon-class="derived" /></i>导入数据</el-button>
                <el-button type="primary" size="small" class="derived" @click="dialogExportVisible = true"><i class="svg-i" ><svg-icon icon-class="derived" /></i>导出数据</el-button>
                <el-button type="primary" size="small" icon="el-icon-search" @click="openSearchDialog()" v-if="device==='mobile'">高级查询</el-button>
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
          show-summary
          class="SiteTable"
          style="width: 100%"
          :height="tableHeight"
          row-key="id"
          :summary-method="getSummaries"
          :default-sort = "{prop: 'addtime', order: 'descending'}"
          >
          <el-table-column
            type="index"
            label="序号"
            width="50"
            >
          </el-table-column>
          <el-table-column
            prop="addtime"
            label="日期"
            width="100"
            sortable
            >
          </el-table-column>
          <el-table-column
            prop="pushname"
            label="账户"
            min-width="120"
            sortable
            >
          </el-table-column>
          <el-table-column
            prop="pushbrand"
            label="品牌"
            min-width="60"
            >
          </el-table-column>
          <el-table-column
            prop="pushtypename"
            label="渠道"
            min-width="100"
            sortable
            >
          </el-table-column>
          <el-table-column
            prop="uname"
            label="所属人"
            width="100"
            sortable
            >
          </el-table-column>
          <el-table-column
            prop="processmoney"
            label="消费"
            width="100"
            sortable
            :sort-method="(a,b)=>{return parseFloat(a.processmoney) - parseFloat(b.processmoney)}" 
            >
          </el-table-column>
          <el-table-column
            prop="showhits"
            label="展现"
            width="100"
            sortable
            >
          </el-table-column>
          <el-table-column
            prop="hits"
            label="点击"
            width="80"
            sortable
            >
          </el-table-column>
          <el-table-column
            prop="gethits"
            label="抵达"
            width="80"
            sortable
            >
          </el-table-column>
          <el-table-column
            prop="phonenumber"
            label="电话"
            width="80"
            sortable
            >
          </el-table-column>
          <el-table-column
            prop="qqnumber"
            label="商务通"
            width="90"
            sortable
            >
          </el-table-column>
          <el-table-column
            prop="formnumber"
            label="表单"
            width="80"
            sortable
            >
          </el-table-column>
          <el-table-column
            prop="allnumber"
            label="转化总数"
            width="110"
            sortable
            >
          </el-table-column>
          <el-table-column
            prop="hitsrate"
            label="点击率"
            width="100"
            sortable
            :sort-method="(a,b)=>{return parseFloat(a.hitsrate) - parseFloat(b.hitsrate)}" 
            >
          </el-table-column>
          <el-table-column
            prop="gethitsrate"
            label="抵达率"
            width="100"
            sortable
            :sort-method="(a,b)=>{return parseFloat(a.gethitsrate) - parseFloat(b.gethitsrate)}" 
            >
          </el-table-column>
          <el-table-column
            prop="showhitsrate"
            label="转化率"
            width="100"
            sortable
            :sort-method="(a,b)=>{return parseFloat(a.showhitsrate) - parseFloat(b.showhitsrate)}" 
            >
          </el-table-column>
          <el-table-column
            prop="hitsprice"
            label="点击均价"
            width="110"
            sortable
            :sort-method="(a,b)=>{return parseFloat(a.hitsprice) - parseFloat(b.hitsprice)}" 
            >
            <template #default="scope">
              <span v-if="scope.row.hitsprice==0" style="font-weight:bold;color:red;">{{scope.row.processmoney}}</span>
              <span v-else>{{scope.row.hitsprice}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="changemoney"
            label="转化均价"
            width="110"
            sortable
            :sort-method="(a,b)=>{return parseFloat(a.changemoney) - parseFloat(b.changemoney)}" 
            >
            <template #default="scope">
              <span v-if="scope.row.changemoney==0" style="font-weight:bold;color:red;">{{scope.row.processmoney}}</span>
              <span v-else>{{scope.row.changemoney}}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="(menuButtonPermit.indexOf('Ownpush_processedit')||menuButtonPermit.includes('Ownpush_processdelete'))&&device==='desktop'"
            :width="operationsWidth"
            align="center"
            fixed="right"
            prop="operations"
            label="操作">
            <template #default="scope">
              <div class="table-button">
                <el-button size="mini" @click="editTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Ownpush_processedit')">编辑</el-button>
                <el-button size="mini" @click="deleteTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Ownpush_processdelete')" type="info" plain>删除</el-button>
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
    <el-dialog :title="dialogText" v-if="(menuButtonPermit.includes('Ownpush_processadd')||menuButtonPermit.includes('Ownpush_processedit'))&&device==='desktop'" custom-class="add-edit-dialog" :visible.sync="dialogFormVisible" :before-close="handleClose" width="760px">
      <el-form :model="dialogForm">
        <div class="item-form-group">
          <div class="item-form">
              <el-form-item label="日期：" :label-width="formLabelWidth">
                <el-date-picker
                    v-model="dialogForm.addtime"
                    align="right"
                    :default-value="dialogForm.addtime"
                    value-format = "yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
          </div>
          <div class="item-form">
              <el-form-item label="账户：" :label-width="formLabelWidth">
                  <el-select v-model="dialogForm.account_id" filterable clearable placeholder="请选择账户">
                      <el-option
                          v-for="item in accountList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                      </el-option>
                  </el-select>
              </el-form-item>
          </div>
        </div>
        <div class="item-form-group">
          <div class="item-form">
              <el-form-item label="渠道：" :label-width="formLabelWidth">
                  <el-select v-model="dialogForm.processtype" filterable clearable placeholder="请选择渠道">
                      <el-option
                          v-for="item in channelList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                      </el-option>
                  </el-select>
              </el-form-item>
          </div>
          <div class="item-form">
              <el-form-item label="所属人：" :label-width="formLabelWidth">
                  <el-select v-model="dialogForm.processuserid" filterable clearable placeholder="请选择负责人">
                      <el-option
                          v-for="item in userList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                      </el-option>
                  </el-select>
              </el-form-item>
          </div>
        </div>
        <div class="item-form-group">
          <div class="item-form">
              <el-form-item label="消费：" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.processmoney" ref="processmoney"></el-input>
              </el-form-item>
          </div>
          <div class="item-form">
              <el-form-item label="展现：" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.showhits" ref="showhits"></el-input>
              </el-form-item>
          </div>
        </div>
        <div class="item-form-group">
          <div class="item-form">
              <el-form-item label="点击：" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.hits" ref="hits"></el-input>
              </el-form-item>
          </div>
          <div class="item-form">
              <el-form-item label="抵达：" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.gethits" ref="gethits"></el-input>
              </el-form-item>
          </div>
        </div>
        <div class="item-form-group">
          <div class="item-form">
              <el-form-item label="电话：" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.phonenumber" ref="phonenumber"></el-input>
              </el-form-item>
          </div>
          <div class="item-form">
              <el-form-item label="商务通：" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.qqnumber" ref="qqnumber"></el-input>
              </el-form-item>
          </div>
        </div>
        <div class="item-form-group">
          <div class="item-form">
              <el-form-item label="表单：" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.formnumber" ref="formnumber"></el-input>
              </el-form-item>
          </div>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="saveData">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="导入" :visible.sync="dialogImportVisible">
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogImportVisible = false">取 消</el-button>
          <el-button type="primary" @click="importDataBase">上传服务器</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="导出" custom-class="export-dialog" :visible.sync="dialogExportVisible" width="400px">
      <el-form :inline="true" :model="exportForm">
        <el-form-item label="文件名称：" :label-width="formLabelWidth">
          <el-input v-model="exportForm.fileName" placeholder="请输入文件名 (默认：excel-list)" style="width:200px;" prefix-icon="el-icon-document"></el-input>
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
import { mapGetters } from 'vuex'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
export default {
  name: 'Ownpush_process',
  components: { UploadExcelComponent },
  data() {
    return {
      menuButtonPermit:[],
      operationsWidth:"",
      tableData:[],
      tableHeight:200,
      dialogFormVisible:false,
      dialogText:"",
      formLabelWidth:"110px",
      userList:[],
      accountList:[],
      channelList:[],
      dialogForm:{
        id:0,
        addtime:"",
        processmoney:"",
        showhits:"",
        hits:"",
        gethits:"",
        phonenumber:"",
        qqnumber:"",
        formnumber:'',
        processtype:'',
        account_id:'',
        processuserid:''
      },
      brandList:[
        {text:'红星',value:'红星'},
        {text:'中德',value:'中德'},
      ],
      searchData:{
          date:[],
          page:1,
          limit:50,
          account_id:"",
          processtype:"",
          processuserid:"",
          brand_id:"",
      },
      pageSizeList:[50, 500, 5000, 10000],
      totalDataNum:0,
      dialogSearchVisible:false,
      pickerOptions: {
        disabledDate(time) {
        return time.getTime() > Date.now();
        },
        shortcuts: [{
            text: '今天',
            onClick(picker) {
                picker.$emit('pick', new Date());
            }
        }, {
            text: '昨天',
            onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit('pick', date);
            }
        }, {
            text: '前天',
            onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 2);
                picker.$emit('pick', date);
            }
        }, {
            text: '三天前',
            onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 3);
                picker.$emit('pick', date);
            }
        }]
      },
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
      exportForm:{
        fileName:"",
        bookType:"xlsx"
      },
      dialogImportVisible:false,
      importData:[],
      dialogExportVisible:false,
      downloadLoading: false,
    }
  },
  computed: {
    ...mapGetters([
      'device',
      'addCnProcess'
    ]),
    isAdd() {
      return this.addCnProcess
    }
  },
  mounted(){
      const $this = this;
      this.$nextTick(function () {
        if($this.device === "desktop"){
          $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight-40-40-20;
        }else{
          $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight-40-40-20;
        }
      });
      window.onresize = () => {
          return (() => {
            if($this.device === "desktop"){
              $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight-40-40-20;
            }else{
              $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight-40-40-20;
            }
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
      isAdd(e){
        if(e){
          this.addTableRow();
        }
      },
  },
  created(){
    var $this = this;
    $this.initData();
  },
  updated(){
    this.$nextTick(() => {
      this.$refs.simpleTable.doLayout()
    })
  },
  methods:{
    // 序号列
    indexMethod(index) {
        return index+1;
    },
    // 获取昨天时间
    getYesterday(){
        var $this = this;
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24);
        var yesterday = date.getFullYear()+"-"+(date.getMonth()+1>9?date.getMonth()+1:'0'+(date.getMonth()+1))+"-"+(date.getDate()+1>9?date.getDate():'0'+(date.getDate()));
        $this.dialogForm.addtime = yesterday;
    },
    // 搜索数据
    searchResult(){
        var $this = this;
        $this.initPage();
    },
    searchDataInit(){
      var $this = this;
      var searchData = {};
      searchData.page = $this.searchData.page;
      searchData.limit = $this.searchData.limit;
      searchData.processtype = $this.searchData.processtype;
      searchData.processuserid = $this.searchData.processuserid;
      searchData.account_id = $this.searchData.account_id;
      searchData.brand = $this.searchData.brand_id;
      console.log($this.searchData.date);
      if(!$this.searchData.date||$this.searchData.date.length==0){
        searchData.starttime = "";
        searchData.endtime = "";
      }else{
        searchData.starttime = $this.searchData.date[0];
        searchData.endtime = $this.searchData.date[1];
      }
      return searchData;
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      var searchData = $this.searchDataInit();
      $this.$store.dispatch('ownpush/cnProcessListAction', searchData).then(response=>{
        if(response){
          if(response.status){
            console.log(response);
            response.data.forEach(function(item,index){
              item.processmoney = item.processmoney.toFixed(2);
              item.hitsprice = item.hitsprice.toFixed(2);
              item.changemoney = item.changemoney.toFixed(2);
            });
            $this.tableData = response.data;
            $this.totalDataNum = response.allcount;
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
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.status){
          if(res.data.length>0){
            console.log(res.data,"操作权限")
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.menuButtonPermit.includes('Ownpush_process')){
              var operationsWidth = 22;
              if($this.menuButtonPermit.includes('Ownpush_processedit')){
                operationsWidth+=66;
              }
              if($this.menuButtonPermit.includes('Ownpush_processdelete')){
                operationsWidth+=66;
              }
              $this.operationsWidth = "" + operationsWidth;
                $this.getAccountData();
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
    // 关闭添加营销流程数据弹窗
    handleClose(){
      var $this = this;
      $this.dialogFormVisible = false;
      $this.$store.dispatch('app/closeCnProcess');
    },
    // 添加表格行数据
    addTableRow(row,index){
      var $this = this;
      $this.dialogFormVisible = true;
      $this.dialogText = "添加数据";
      $this.resetFormData();
      $this.getYesterday();
    },
    // 编辑表格行数据
    editTableRow(row,index){
      var $this = this;
      $this.dialogFormVisible = true;
      $this.dialogText = "编辑数据";
      $this.resetFormData();
      $this.dialogForm.id = row.id;
      $this.dialogForm.addtime = row.addtime;
      $this.dialogForm.processmoney = row.processmoney;
      $this.dialogForm.showhits = row.showhits;
      $this.dialogForm.hits = row.hits;
      $this.dialogForm.gethits = row.gethits;
      $this.dialogForm.phonenumber = row.phonenumber;
      $this.dialogForm.qqnumber = row.qqnumber;
      $this.dialogForm.formnumber = row.formnumber;
      $this.dialogForm.processtype = row.processtype;
      $this.dialogForm.account_id = row.account_id;
      $this.dialogForm.processuserid = row.processuserid;
    },
    // 保存添加/编辑数据
    saveData(){
      var $this = this;
      if(!$this.validationForm()){
        return false;
      }
      var pathUrl = "";
      if($this.dialogText=="编辑数据"){
        pathUrl = "ownpush/cnProcessEditAction";
      }else{
        pathUrl = "ownpush/cnProcessAddAction";
      }
      $this.$store.dispatch(pathUrl, $this.dialogForm).then(response=>{
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
          }
      });
    },
    // 重置添加数据表单
    resetFormData(){
      var $this = this;
      $this.dialogForm.id = 0
      $this.dialogForm.addtime = '';
      $this.dialogForm.processmoney = '';
      $this.dialogForm.showhits = '';
      $this.dialogForm.hits = '';
      $this.dialogForm.gethits = '';
      $this.dialogForm.phonenumber = '';
      $this.dialogForm.qqnumber = '';
      $this.dialogForm.formnumber = '';
      $this.dialogForm.processtype = '';
      $this.dialogForm.account_id = '';
      $this.dialogForm.processuserid = '';
    },
    // 验证是否为空
    validationForm(){
      var $this = this;
      if($this.dialogForm.addtime == ""){
        $this.$message({
            showClose: true,
            message: '错误：日期不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.dialogForm.account_id == ""){
        $this.$message({
            showClose: true,
            message: '错误：账户不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.dialogForm.processtype == ""){
        $this.$message({
            showClose: true,
            message: '错误：渠道不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.dialogForm.processuserid == ""){
        $this.$message({
            showClose: true,
            message: '错误：所属人不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.dialogForm.processmoney == ""){
        $this.$message({
            showClose: true,
            message: '错误：消费不能为空！',
            type: 'error'
        });
        $this.$refs['processmoney'].focus();
        return false;
      }
      return true;
    },
    // 删除表格行
    deleteTableRow(row,index){
      var $this = this;
      $this.$confirm('是否确认删除该数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          $this.$store.dispatch('ownpush/cnProcessDeleteAction', {id:row.id}).then(response=>{
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
    // 获取添加数据时的账户选择数据
    getAccountData(){
      var $this = this;
      $this.$store.dispatch('ownpush/accountListAllAction', null).then(response=>{
          if(response.status){
            console.log(response,"账户数据");
            var accountList = [];
            response.data.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.pushname;
              itemData.channel = item.pushtypename;
              accountList.push(itemData);
            });
            $this.accountList = accountList;
            $this.getChannelData();
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
    },
    // 获取添加数据时的渠道选择数据
    getChannelData(){
      var $this = this;
      $this.$store.dispatch('ownpush/cnChannelListAction', null).then(response=>{
          if(response.status){
            console.log(response);
            var channelList = [];
            response.data.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.name;
              channelList.push(itemData);
            });
            $this.channelList = channelList;
            $this.getUserData();
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
    },
    // 获取添加数据是的负责人选择数据
    getUserData(){
      var $this = this;
      $this.$store.dispatch('ownpush/userListAction', null).then(response=>{
          if(response.status){
            console.log(response);
            var userList = [];
            response.data.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.name;
              userList.push(itemData);
            });
            $this.userList = userList;
            $this.initPage();
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
    // 导入文件前事件
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: '不要上传大于1M的文件',
        type: 'warning'
      })
      return false
    },
    // 导入成功事件
    handleSuccess({ results, header }) {
      var $this = this;
      var dataList = [];
      var channelList = $this.channelList;
      var userList = $this.userList;
      var accountList = $this.accountList;
      console.log(accountList,"账户数据");
      results.forEach(function(item,index){
        var itemData = {}
        itemData.processeffect = item.效果;
        itemData.addtime = $this.formatDate(item.日期);
        itemData.pushname = item.账户;
        itemData.pushbrand = item.品牌;
        itemData.pushtypename = item.渠道;
        itemData.uname = item.所属人;
        itemData.processmoney = (item.消费).toFixed(2);
        itemData.showhits = item.展现;
        itemData.hits = item.点击;
        itemData.gethits = item.抵达;
        itemData.phonenumber = item.电话;
        itemData.qqnumber = item.商务通;
        itemData.formnumber = item.表单;
        channelList.forEach(function(item1,index1){
          if(itemData.pushtypename == item1.label){
            itemData.processtype = item1.value;
          }
        });
        userList.forEach(function(item1,index1){
          if(itemData.uname == item1.label){
            itemData.processuserid = item1.value;
          }
        });
        accountList.forEach(function(item1,index1){
          if(itemData.pushname == item1.label&&item1.channel.indexOf(itemData.pushtypename)!=-1){
            itemData.account_id = item1.value;
          }
        });
        dataList.push(itemData);
      });
      $this.importData = dataList;
      console.log($this.importData,"导入数据");
      $this.$message.success({
        message: '数据导入成功！',
        type: 'success'
      });
    },
    // 上传服务器
    importDataBase(){
      var $this =this;
      $this.$store.dispatch('ownpush/cnProcessImportAction', $this.importData).then(response=>{
          if(response.status){
            console.log(response);
            $this.$message.success({
              message: '数据上传成功！',
              type: 'success'
            });
            $this.dialogImportVisible = false;
            $this.initPage();
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
    },
    
    // excel导入日期转化正常日期方法
    formatDate(numb, format='-') {
      if(typeof numb === 'number'){
        let millisecond = 0;	// 转化后的毫秒数
        if(numb>60){
          millisecond = (numb - 25569) * 60 * 60 * 24 * 1000;
        }else{
          // 对小于61的错误日期进行处理
          millisecond = (numb - 25568) * 60 * 60 * 24 * 1000;
        }
        const date = new Date(millisecond);	// 根据转化后的毫秒数获取对应的时间
        const year = date.getFullYear() + ''
        const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        return year + format + month + format + day;
      }else{
        return numb;
      }
    },
    // 获取合计数据
    getSummaries(param) {
      var $this = this;
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if(index===14){
            sums[index]=$this.toPercent(sums[8]/sums[7]);
            return;
          }
          if(index===15){
            sums[index]=$this.toPercent(sums[9]/sums[8]);
            return;
          }
          if(index===16){
            sums[index]=$this.toPercent(sums[13]/sums[8]);
            return;
          }
          if(index===17){
            sums[index]=(sums[6]/sums[8]).toFixed(2);
            return;
          }
          if(index===18){
            sums[index]=(sums[6]/sums[13]).toFixed(2);
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            if(index === 6){
              sums[index] = sums[index].toFixed(2);
            }
          } else {
            sums[index] = '-';
          }
        });
        return sums;
    },
    // 转化为百分比
    toPercent(point){
        var str=Number(point*100).toFixed(2);
        str+="%";
        return str;
    },
    // 下载/导出Excel表格
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['效果', '日期','账户','品牌','渠道','所属人', '消费', '展现', '点击','抵达','电话','商务通','表单', '转化总数', '点击率','抵达率', '转化率', '点击均价', '转化均价']
        const list = this.tableData
        const data = [];
        list.forEach(function(item,index){
          var itemData = [];
          itemData.push(item.processeffect);
          itemData.push(item.addtime);
          itemData.push(item.pushname);
          itemData.push(item.pushbrand);
          itemData.push(item.pushtypename);
          itemData.push(item.uname);
          itemData.push(item.processmoney);
          itemData.push(item.showhits);
          itemData.push(item.hits);
          itemData.push(item.gethits);
          itemData.push(item.phonenumber);
          itemData.push(item.qqnumber);
          itemData.push(item.formnumber);
          itemData.push(item.allnumber);
          itemData.push(item.hitsrate);
          itemData.push(item.gethitsrate);
          itemData.push(item.showhitsrate);
          itemData.push(item.hitsprice);
          itemData.push(item.changemoney);
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
        this.downloadLoading = false
      })
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
