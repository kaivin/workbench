<template>
  <div class="page-root" ref="boxPane">
    <div class="abs-panel" ref="mainPane">
      <div class="scroll-panel" ref="scrollDom" style="will-change:scroll-position">
        <div class="true-height" ref="scrollPane">
          <p class="breadcrumb" ref="breadcrumbPane">
            <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
            <template v-for="item in breadcrumbList">
              <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
              <span v-else class="breadcrumb-link" v-bind:key="'last-' + item.id"><b>-</b><span>{{item.title}}</span></span>
            </template>
          </p>
          <el-card class="box-card" shadow="hover">
            <div slot="header">
              <div class="card-header" ref="headerPane">
                <div class="search-wrap" ref="searchPane">
                  <div class="item-search">
                    <el-select v-model="searchData.my_level" size="small" clearable placeholder="关键词等级" class="select-panel" @change="searchResult">
                        <el-option
                            v-for="item in levelList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                  </div>
                  <div class="item-search">
                      <el-input
                          class="input-panel"
                          size="small"
                          placeholder="请输入搜索词"
                          v-model="searchData.keyword"
                          @keyup.enter.native="searchResult"
                          @clear="searchResult"
                          clearable>
                      </el-input>
                  </div>
                  <div class="item-search">
                    <el-button class="item-input" :class="isSearchResult?'isDisabled':''" :disabled="isSearchResult" type="primary" size="small" icon="el-icon-search" @click="searchResult">查询</el-button>
                    <el-button type="info" class="resetBtn" size="small" v-on:click="resetData()">重置</el-button>
                    <el-button v-if="menuButtonPermit.includes('Douyin_wordadd')" type="success" size="small" icon="el-icon-plus" v-on:click="addTableRow()">新增关键词</el-button>
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
                      class="SiteTable"
                      style="width: 100%"
                      :style="'min-height:'+tableHeight+'px;'"
                      row-key="id"
                      >
                      <el-table-column
                        prop="name"
                        label="关键词"
                        min-width="180"
                        >
                      </el-table-column>
                      <el-table-column
                        prop="my_level"
                        label="关键词等级"
                        min-width="120"
                        align="center"
                        >
                      </el-table-column>
                      <el-table-column
                        v-if="menuButtonPermit.includes('Douyin_worddel')"
                        :width="operationsWidth"
                        align="center"
                        fixed="right"
                        prop="operations"
                        label="操作" >
                        <template #default="scope">
                          <div class="table-button">
                            <el-button size="mini" @click="deleteTableRow(scope.row, scope.$index)" type="info" plain >删除</el-button>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                </div>
                <div class="out_box fixed" v-if="scrollPosition.maxScrollWidth>0&&scrollPosition.isPC" :style="'left:'+scrollPosition.left+'px;width:'+scrollPosition.width+'px;bottom:'+scrollPosition.fixedBottom+'px;'" ref="out_box">
                    <div class="in_box" @mousedown="mouseDownHandler" :style="'left:'+scrollPosition.insetLeft+'px;width:'+scrollPosition.insetWidth+'px;'" ref="in_box" ></div>
                </div>
            </div>
            <div class="pagination-panel" v-if="totalDataNum>50" ref="pagePane">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="searchData.page"
                :page-sizes="pageSizeList"
                :page-size="searchData.limit"
                :pager-count="pagerCount"
                :layout="'total, sizes, prev, pager, next, jumper'"
                :total="totalDataNum">
              </el-pagination>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <el-backtop target=".scroll-panel"></el-backtop>
    <el-dialog :title="dialogText" v-if="menuButtonPermit.includes('Douyin_wordadd')" custom-class="add-edit-dialog" :visible.sync="visible" :before-close="handleClose" width="500px">
      <el-form :model="dialogForm">
        <el-form-item label="关键词：" :label-width="formLabelWidth">
          <el-input v-model="dialogForm.name" ref="name" placeholder="请输入关键词"></el-input>
        </el-form-item>
        <el-form-item label="关键词等级：" :label-width="formLabelWidth">
          <el-select v-model="dialogForm.my_level" size="small" clearable placeholder="请选择关键词等级" class="select-panel">
            <el-option
                v-for="item in levelList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" :class="isSaveData?'isDisabled':''" :disabled="isSaveData" @click="saveData">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Douyin_wordlist',
  data() {
    return {
      breadcrumbList:[],
      menuButtonPermit:[],
      operationsWidth: "",
      formLabelWidth:"100px",
      pagerCount:5,
      pageSizeList:[50, 100, 150, 200],
      totalDataNum:0,
      tableData:[],
      tableHeight:200,
      productTypeList: [],
      searchData:{
        keyword:"",
        my_level: "",
        page:1,
        limit:50,
      },
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
      visible: false,
      dialogText: "",
      dialogForm: {
        name: "",
        my_level: ""
      },
      levelList: [
        {
          label: "A",
          value: "A"
        },{
          label: "B",
          value: "B"
        },{
          label: "C",
          value: "C"
        },{
          label: "D",
          value: "D"
        },
      ]
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'menuData'
    ]),
    isOpen() {
      return this.sidebar.opened;
    },
  },
  mounted(){
    const $this = this;
    if(!$this.sidebar.opened){
      $this.$store.dispatch('app/toggleSideBar');
    }
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
  },
  created(){
    var $this = this;
    $this.getBreadcrumbList();
    $this.initData();
  },
  updated(){
    var $this = this;
    $this.$nextTick(() => {
      $this.$refs.simpleTable.doLayout();
    });
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
    setTableHeight(){
      var $this = this;
      $this.tableHeight = 0;      
      var headerHeight = $this.$refs.headerPane.offsetHeight;
      var breadcrumbHeight = $this.$refs.breadcrumbPane.offsetHeight;
      var screenHeight = $this.$refs.boxPane.offsetHeight;
      $this.tableHeight = screenHeight-headerHeight-breadcrumbHeight-40 - 45;
      $this.getBrowserType();
        setTimeout(function() {
          $this.setScrollDom();
      }, 400);
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
        $this.searchData.keyword='';
        $this.searchData.page=1;
        $this.searchData.limit=50;
        $this.searchData.my_level='';
        $this.searchResult();
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
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
            if($this.menuButtonPermit.includes('Douyin_wordlist')){
                var operationsWidth = 22;
                if($this.menuButtonPermit.includes('Douyin_wordedit')){
                  operationsWidth+=66;
                }
                if($this.menuButtonPermit.includes('Douyin_worddel')){
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
    // 初始化页面信息
    initPage(){
      var $this = this;
      var formData = {}
      formData.page = $this.searchData.page;
      formData.limit = $this.searchData.limit;
      formData.keyword = $this.searchData.keyword;
      formData.my_level = $this.searchData.my_level;
      document.getElementsByClassName("scroll-panel")[0].scrollTop = 0;
      $this.$store.dispatch('douyin/getDouyinKeywordList',formData).then(response=>{
        if(response){
          if(response.status){
            if(response.data){
              $this.tableData = response.data;
              $this.totalDataNum = response.allcount;
              setTimeout(()=>{
                $this.isSearchResult=false;
                $this.isSaveData=false;
              },1000);
              $this.$nextTick(function () {
                $this.setTableHeight();
              })
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
              setTimeout(()=>{
                $this.isSearchResult=false;
                $this.isSaveData=false;
              },1000);
            }
          }
        }
      });
    },
    // 重置搜索数据
    resetSearchData(){
      var $this = this;
      $this.searchData.keyword = "";
      $this.searchData.page = 1;
      $this.searchData.limit = 50;
      $this.searchData.my_level = "";
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
    // 关闭添加菜单弹窗
    handleClose(){
      var $this = this;
      $this.visible = false;
    },
    // 添加表格行数据
    addTableRow() {
      this.visible = true;
      this.dialogText = "新增关键词";
      this.resetFormData();
    },
    // 保存添加/编辑数据
    saveData() {
      var $this = this;
      if(!$this.isSaveData){
        if (!$this.validationForm()) {
          return false;
        }
        $this.isSaveData=true;
        const result = {}
        result.name = $this.dialogForm.name
        result.my_level = $this.dialogForm.my_level
        $this.$store.dispatch('douyin/douyinKeywordAdd',result).then(response=>{
          if (response.status) {
            $this.$message({
              showClose: true,
              message: response.info,
              type: "success",
            });
            $this.handleClose();
            $this.initPage();
          } else {
            $this.$message({
              showClose: true,
              message: response.info,
              type: "error",
            });
            setTimeout(()=>{
              $this.isSaveData=false;
            },1000);
          }
        });
      }
    },
    // 重置添加数据表单
    resetFormData() {
      var $this = this;
      $this.dialogForm.name = "";
      $this.dialogForm.my_level = "";
    },
    // 验证是否为空
    validationForm() {
      var $this = this;
      if ($this.dialogForm.name == "") {
        $this.$message({
          showClose: true,
          message: "错误：关键词名称不能为空！",
          type: "error",
        });
        $this.$refs["name"].focus();
        return false;
      }
      if ($this.dialogForm.my_level == "") {
        $this.$message({
          showClose: true,
          message: "错误：关键词等级不能为空！",
          type: "error",
        });
        return false;
      }
      return true;
    },
    // 删除表格行
    deleteTableRow(row, index) {
      var $this = this;
      $this.$confirm('是否确认删除该数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        $this.$store.dispatch('douyin/douyinKeywordDel',{ id: row.id }).then(response=>{
          if (response.status) {
            $this.$message({
              showClose: true,
              message: response.info,
              type: "success",
            });
            $this.initPage();
          } else {
            $this.$message({
              showClose: true,
              message: response.info,
              type: "error",
            });
          }
        });
      });
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
      if($this.totalDataNum>50){
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
        if($this.totalDataNum>50){
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
.search-wrap{
  .item-search{
    float:left;
    padding: 10px 10px 10px 0;
  }
  .input-panel{
    width: 190px;
  }
  .select-panel{
    width: 120px;
  }
}
.item-text{
  color: #606266;
  display: flex;
  align-items: center;
  line-height: 0;
  &.keyword{
    justify-content: center;
    span{
      justify-content: center;
    }
  }
  span{
    flex: 1;
    display: flex;
    align-items: center;
    line-height: 24px;
  }
  .icon-other{
    font-size: 16px;
    color: #f65252;
    margin-right: 6px;
  }
  &.red{
    color: #f65252;
  }
  &.green{
    color: #26bf6a;
  }
}
</style>