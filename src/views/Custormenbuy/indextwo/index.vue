<template>
  <div class="page-root SaleCard" ref="boxPane">
      <div class="abs-panel" ref="mainPane">
          <div class="scroll-panel" ref="scrollDom" style="will-change:scroll-position">
              <div class="true-height" ref="scrollPane">
                  <p class="breadcrumb" ref="breadcrumbPane">
                    <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
                    <template v-for="item in breadcrumbList">
                      <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
                      <span class="breadcrumb-link" v-bind:key="item.id" v-else><b>-</b><span>{{item.title}}</span></span>
                    </template>
                  </p>
                  <el-card class="box-card" shadow="hover">
                    <div slot="header">      
                      <div class="card-header SaleCard" ref="headerPane">
                          <div class="search-wrap Compart-search-wrap" ref="searchPane">          
                              <div class="item-search" style="width:140px;">                              
                                    <el-date-picker v-model="searchData.time" format="yyyy 年 MM 月" value-format="yyyy-MM" type="month" size="small" placeholder="选择成交时间"></el-date-picker>
                              </div>
                              <div class="item-search" style="width:120px;">
                                <el-select v-model="searchData.dept_id" size="small" clearable placeholder="请选择部门">
                                  <el-option
                                      v-for="item in deptList"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                  </el-option>
                              </el-select>
                              </div>
                              <div class="item-search">
                                <el-button class="item-input" :class="isSearchResult?'isDisabled':''" :disabled="isSearchResult" size="small" type="primary" icon="el-icon-search" @click="searchResult">查询</el-button>
                                <el-button type="info" class="resetBtn" size="small" v-on:click="resetData()">重置</el-button>
                                <el-button type="primary" plain class="resetBtn" size="small" v-if="menuButtonPermit.includes('Custormenbuy_exportlinktwo')">
                                  <label>
                                    <span class="button-font">导入excel</span>
                                    <input style="display:none;" type="file" accept=".xlsx, .xls" @change="custormbuyFileUp"/>
                                  </label>
                                </el-button>
                                <el-link target="_blank" tag='a' href='https://mgl.hxjq.org/hxindex/Custormenbuy/gettemplatetwo' class="ImportTemplate">下载导入模板</el-link> 
                                
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
                              >
                              <el-table-column
                              prop="id"
                              label="ID"
                              width="50"
                              align="center"
                              >
                              </el-table-column>
                              <el-table-column
                              prop="mtime"
                              label="成交时间"
                              min-width="100"
                              >
                              </el-table-column>
                              <el-table-column
                              prop="departname"
                              label="部门"
                              min-width="80"
                              >
                              </el-table-column>
                              <el-table-column
                              prop="groupname"
                              label="组别"
                              min-width="100"
                              >
                              </el-table-column>
                              <el-table-column
                              prop="price"
                              label="价值"
                              min-width="100"
                              >
                              </el-table-column>
                              <el-table-column
                              prop="cj_score"
                              label="成交积分"
                              min-width="80"
                              align="center"
                              >
                              </el-table-column>
                              <el-table-column
                              prop="xunproduct"
                              label="产品"
                              min-width="80"
                              >
                              </el-table-column>
                              <el-table-column
                              prop="url"
                              label="来自网站/电话"
                              min-width="300"
                              >
                              </el-table-column>
                              <el-table-column
                              prop="ownuser"
                              label="所属人"
                              min-width="90"
                              >
                              </el-table-column>
                              <el-table-column
                              prop="source"
                              label="渠道"
                              min-width="120"
                              >
                              </el-table-column>
                              <el-table-column
                              prop="level"
                              label="初始级别"
                              min-width="80"
                              align="center"
                              >
                              </el-table-column>
                              <el-table-column
                              prop="addtime"
                              label="添加时间"
                              min-width="100"
                              >
                              </el-table-column>
                              <el-table-column
                              prop="province"
                              label="省份"
                              min-width="120"
                              >
                              </el-table-column>
                              <el-table-column
                              prop="buyproduct"
                              label="成交设备"
                              min-width="160"
                              >
                              </el-table-column>
                          </el-table>
                      </div>
                      <div class="out_box fixed" v-if="scrollPosition.maxScrollWidth>0&&scrollPosition.isPC" :style="'left:'+scrollPosition.left+'px;width:'+scrollPosition.width+'px;bottom:'+scrollPosition.fixedBottom+'px;'" ref="out_box">
                          <div class="in_box" @mousedown="mouseDownHandler" :style="'left:'+scrollPosition.insetLeft+'px;width:'+scrollPosition.insetWidth+'px;'" ref="in_box" ></div>
                      </div>
                    </div>
                    <div class="pagination-panel" v-if="totalDataNum>15" ref="pagePane">
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
</template>
<script>
import { deparDealEdit,deparDealListAdd,deparDealDel } from '@/api/Compare';
import { getCustormenbuyListTwo,setExportLinkenTwo } from '@/api/Custormbuy';
import { mapGetters} from 'vuex';
export default {
  name: 'Custormbuy_index',
  data() {
    return {
      
      breadcrumbList:[],
      menuButtonPermit:[],
      operationsWidth:"",
      tableData:[],
      tableHeight:200,
      dialogFormVisible:false,
      dialogText:"",
      formLabelWidth:"120px",
      dialogForm:{
        id:0,
        dept_id:"",
        mtime:"",
        snumber:"",
        score:"",
        level:"",
        passnumber:"",
        mediumnumber:"",
        goodnumber:"",
        a_number:"",
        allmoney:"",
        personmoney:"",
        paymoney:"",
        personnumber:"",
      },
      pageSizeList:[15,30,60,120],
      totalDataNum:0,
      searchData:{
        page:1,
        limit:15,
        time:"",
        dept_id:'',
      },
      deptList:[],
      levelList:[
        {label:'不及格',value:'不及格'},
        {label:'合格',value:'合格'},
        {label:'中等',value:'中等'},
        {label:'优秀',value:'优秀'},
      ],
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
      isSearchResult:false,
      isSaveData:false,
    }
  },
  computed: {
    ...mapGetters([
      'addCompareList',
      'sidebar',
      'menuData'
    ]),
    isOpen() {
      return this.sidebar.opened;
    },
    isAdd() {
      return this.addCompareList
    }
  },
  mounted(){
      const $this = this;
      if(!$this.sidebar.opened){
        $this.$store.dispatch('app/toggleSideBar');
      }
      // 监听竖向滚动条滚动事件
      window.addEventListener('scroll',this.handleScroll,true);
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
      isOpen(e){
        this.setTableHeight();
      },
  },
  created(){
    var $this = this;
    $this.getBreadcrumbList();
    $this.initData();
  },
  updated(){
    this.$nextTick(() => {
      this.$refs.simpleTable.doLayout();
    })
  },
  destroyed(){
    window.removeEventListener('scroll', this.handleScroll,true);//监听页面滚动事件
  },
  methods:{
    //英文详情导入
    custormbuyFileUp(e){
       var $this = this;
      let filedata = e.target.files[0];
      var formData = new FormData();
      formData.append('filename',filedata);
      setExportLinkenTwo(formData).then(res=>{
        $this.$message({
          showClose: true,
          message: res.info,
          type: res.status?'success':'error',
        });
        $this.isSearchResult=true;      
        $this.searchData.page = 1;
        $this.initPage();
      })
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
    setTableHeight(){
      var $this = this;
      $this.tableHeight = 0;      
      var headerHeight = $this.$refs.headerPane.offsetHeight+45;
      var screenHeight = $this.$refs.boxPane.offsetHeight;
      var breadcrumbHeight = $this.$refs.breadcrumbPane.offsetHeight;
      $this.tableHeight = screenHeight-headerHeight-breadcrumbHeight-40;
      $this.getBrowserType();
        setTimeout(function() {
          $this.setScrollDom();
      }, 400);
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 搜索点击事件
    searchResult(){
      var $this = this;
      if(!$this.isSearchResult){  
        $this.isSearchResult=true;      
        $this.searchData.page = 1;
        $this.initPage();
      }
    },
    // 重置表单
    resetData(){
        var $this = this;
        $this.searchData.page=1;
        $this.searchData.limit=15;
        $this.searchData.time='';
        $this.searchData.dept_id='';
        $this.searchResult();
    },
    
    // 重组搜索数据
    restearch(){
      var $this = this;
      var formData = {};
      formData.page = $this.searchData.page;
      formData.limit = $this.searchData.limit;
      if($this.searchData.time&&$this.searchData.time!=''){
        formData.time = $this.searchData.time;
      }
      formData.dept_id = $this.searchData.dept_id;
      return formData;
    },
    // 初始化部门数据
    dealData(){
      var $this = this;
      $this.$store.dispatch('Encompare/EndeparDealListChooseAction', null).then(response=>{
        if(response){
          if(response.status){
            if(response.data.length>0){
                var deptList = [];
                response.data.forEach(function(item,index){
                  var itemData = {};
                  itemData.value = item.id;
                  itemData.label = item.name;
                  deptList.push(itemData);
                });
                $this.deptList = deptList;
            }else{
              $this.deptList=[]
            }
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
              setTimeout(()=>{
                $this.isSearchResult=false;
              },1000);
            }
          }
        }
      });
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      var formData = $this.restearch();
      document.getElementsByClassName("scroll-panel")[0].scrollTop = 0;
      getCustormenbuyListTwo(formData).then(response=>{
        if(response){
          if(response.status){
            if(response.data.length>0){
                             
                $this.tableData = response.data;
                $this.totalDataNum = response.allcount;
            }else{
              $this.tableData = [];
            }
            setTimeout(()=>{
              $this.isSearchResult=false;
              $this.isSaveData=false;
            },1000);
            $this.$nextTick(function () {
              $this.setTableHeight();
            })
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
                $this.isSearchResult=false;
                $this.isSaveData=false;
              },1000);
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
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.menuButtonPermit.includes('Custormenbuy_indextwo')){
              $this.dealData();
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
    // 关闭添加分类弹窗
    handleClose(){
      var $this = this;
      $this.dialogFormVisible = false;
      $this.$store.dispatch('app/closeCompareList');
    },
    // 添加表格行数据
    addTableRow(row,index){
      var $this = this;
      $this.dialogFormVisible = true;
      $this.dialogText = "添加部门成交";
      $this.resetFormData();
    },
    // 编辑表格行数据
    editTableRow(row,index){
      var $this = this;
      $this.dialogFormVisible = true;
      $this.dialogText = "编辑部门成交";
      $this.resetFormData();
      $this.dialogForm.id = row.id;
      $this.dialogForm.dept_id = row.dept_id;
      $this.dialogForm.mtime = row.mtime;
      $this.dialogForm.level = row.level;
      $this.dialogForm.snumber = row.snumber;
      $this.dialogForm.score = row.score;
      $this.dialogForm.passnumber = row.passnumber;
      $this.dialogForm.mediumnumber = row.mediumnumber;
      $this.dialogForm.goodnumber = row.goodnumber;
      $this.dialogForm.a_number = row.a_number;
      $this.dialogForm.allmoney = row.allmoney;
      $this.dialogForm.personmoney = row.personmoney;
      $this.dialogForm.paymoney = row.paymoney;
      $this.dialogForm.personnumber = row.personnumber;
    },
    // 保存添加/编辑数据
    saveData(){
      var $this = this;
      if(!$this.isSaveData){
        if(!$this.validationForm()){
          return false;
        }
        $this.isSaveData=true;
        var formData = {}
        if($this.dialogForm.id&&$this.dialogForm.id!=0){
            formData.id = $this.dialogForm.id;
        }
        formData.dept_id = $this.dialogForm.dept_id;
        formData.mtime = $this.dialogForm.mtime;
        formData.level = $this.dialogForm.level;
        formData.snumber = $this.dialogForm.snumber;
        formData.score = $this.dialogForm.score;
        formData.passnumber = $this.dialogForm.passnumber;
        formData.mediumnumber = $this.dialogForm.mediumnumber;
        formData.goodnumber = $this.dialogForm.goodnumber;
        formData.a_number = $this.dialogForm.a_number;
        formData.allmoney = $this.dialogForm.allmoney;
        formData.personmoney = $this.dialogForm.personmoney;
        formData.paymoney = $this.dialogForm.paymoney;
        formData.personnumber = $this.dialogForm.personnumber;
        var pathUrl = "";
        if($this.dialogText=="编辑部门成交"){
          deparDealEdit(formData).then(response=>{
            $this.saveDataPlug(response);
          });
        }else{
          deparDealListAdd(formData).then(response=>{
            $this.saveDataPlug(response);
          });
        }
      }
    },
    saveDataPlug(arrData){
      var $this = this;
      if(arrData.status){
        $this.$message({
          showClose: true,
          message: arrData.info,
          type: 'success'
        });
        $this.handleClose();
        $this.initPage();
      }else{
        $this.$message({
          showClose: true,
          message: arrData.info,
          type: 'error'
        });
        setTimeout(()=>{
          $this.isSaveData=false;
        },1000);
      }
    },
    // 重置添加数据表单
    resetFormData(){
      var $this = this;
      $this.dialogForm.id = 0;
      $this.dialogForm.dept_id = "";
      $this.dialogForm.mtime = "";
      $this.dialogForm.level = "";
      $this.dialogForm.snumber = "";
      $this.dialogForm.score = "";
      $this.dialogForm.passnumber = "";
      $this.dialogForm.mediumnumber = "";
      $this.dialogForm.goodnumber = "";
      $this.dialogForm.a_number = "";
      $this.dialogForm.allmoney = "";
      $this.dialogForm.personmoney = "";
      $this.dialogForm.paymoney = "";
      $this.dialogForm.personnumber = "";
    },
    // 验证是否为空
    validationForm(){
      var $this = this;
      if($this.dialogForm.mtime == ""){
        $this.$message({
            showClose: true,
            message: '错误：添加时间不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.dialogForm.dept_id == ""){
        $this.$message({
            showClose: true,
            message: '错误：部门不能为空！',
            type: 'error'
        });
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
          deparDealDel({id:row.id}).then(response=>{
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
         $this.scrollTable.fixedTopHeight = $this.$refs.headerPane.offsetHeight+$this.$refs.breadcrumbPane.offsetHeight+15+20+44;
      }else{
         $this.scrollTable.fixedTopHeight=$this.$refs.breadcrumbPane.offsetHeight+15+20+44;
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
      $this.scrollTable.tableBottom = tableObj.height+$this.scrollTable.fixedTopHeight+$this.scrollTable.tableheaderHeight+54+20;
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
      if($this.totalDataNum>15){
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
        if($this.totalDataNum>15){
          if(scrTop+$this.scrollTable.clientHeight>=$this.scrollTable.tableBottom-20){
            $this.scrollPosition.fixedBottom = scrTop+$this.scrollTable.clientHeight-$this.scrollTable.tableBottom-10;
          }else{
            $this.scrollPosition.fixedBottom = 20;
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
    }
  }
}
</script>
<style lang="scss" scoped>
.resetBtn{
  label{
    display: block;
    cursor: pointer;
  }
}
</style>