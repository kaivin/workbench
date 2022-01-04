<template>
    <div class="page-root flex-box no-padding work-order-index" ref="boxPane">
        <div class="flex-content relative">
            <div class="abs-panel" ref="mainPane">
                <div class="scroll-panel" ref="scrollDom" style="will-change:scroll-position">
                  <div class="true-height" ref="scrollPane">
                    <p class="breadcrumb" ref="breadcrumbPane">
                      <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
                      <template v-for="item in breadcrumbList">
                        <router-link class="breadcrumb-link" :to="item.router+'?Status=alltasks'" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
                        <span class="breadcrumb-link" v-bind:key="item.id" v-else><b>-</b><span>{{item.title}}</span></span>
                      </template>
                        <span class="breadcrumb-link"><b>-</b>{{breadcrumbName}}</span>
                    </p>
                    <el-card class="box-card scroll-card" shadow="hover">
                        <div slot="header">
                            <div class="card-header" ref="headerPane">
                                <div class="search-orderThree flex-wrap" style="padding-top:0px;">
                                    <div class="search-wrap flex-content">
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
                                               @change="hanldetime()"
                                              size="small"
                                              :picker-options="pickerRangeOptions">
                                          </el-date-picker>
                                        </div>
                                        <div class="item-search commentClass" style="width: 240px;">
                                            <el-checkbox-group v-model="commentArr" class="checkbox-group" @change="commentClick"  size="small">
                                              <el-checkbox v-for="item in commentList" :label="item.value" :key="item.value" border>{{item.label}}</el-checkbox>
                                            </el-checkbox-group>
                                        </div>
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
                                key="a"
                                tooltip-effect="dark"
                                stripe
                                class="SiteTable"
                                style="width: 100%"
                                :style="'min-height:'+minHeight+'px;'"
                                row-key="id"
                                >
                                <el-table-column
                                    prop="title"
                                    label="任务标题"
                                    min-width="120"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="publishname"
                                    label="发布人"
                                    width="240"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="finishtime"
                                    label="完成时间"
                                    width="240"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="commentinfo"
                                    label="评价内容"
                                    min-width="120"
                                    >
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
                            :layout="'total, sizes, prev, pager, next, jumper'"
                            :total="totalDataNum">
                            </el-pagination>
                        </div>
                    </el-card>
                  </div>
                  <el-backtop target=".scroll-panel"></el-backtop>
                </div>
            </div>    
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Worksaccpet_goodcomment',
  data() {
    return {
        breadcrumbName:'个人好评列表',
        certinfoKey:true,//解决数据更新后表体不渲染问题
        currentId:0,
        breadcrumbList:[],
        operationsWidth:"",
        menuButtonPermit:[],
        minHeight:"auto",
        tableData:[],
        searchData:{
            page:1,
            limit:50,
            date:[],
            commentstatus:'',
        },
        commentArr:[],
        commentList:[
          {label:'好评',value:1},
          {label:'一般',value:2},
          {label:'差评',value:3},
        ],
        pageSizeList:[50, 100, 500],
        totalDataNum:0,
        pickerRangeOptions: this.$pickerRangeOptions,
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
        this.setHeight();
    });
    window.onresize = () => {
        return (() => {
            this.setHeight();
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
        var $this = this;
        $this.initData();
    },
    isOpen(e){
      this.setHeight();
    },
  },
  created(){
    var $this = this;
    $this.getBreadcrumbList();
    $this.getNearDay();
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
    // loading自定义
    loadingFun(){
      var $this = this;
      $this.isLoading = $this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
        zindex:999
      });
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
    setHeight(){
      var $this = this;
      $this.minHeight = 0;
      var breadcrumbHeight = $this.$refs.breadcrumbPane.offsetHeight;
      var screenHeight = $this.$refs.boxPane.offsetHeight;
      if($this.$refs.headerPane){
        var headerHeight = $this.$refs.headerPane.offsetHeight+45;
        $this.minHeight = screenHeight-headerHeight-breadcrumbHeight-40;
      }else{
        $this.minHeight = screenHeight-breadcrumbHeight-40;
      } 
      $this.getBrowserType();
      setTimeout(function() {
          $this.setScrollDom();
      }, 400);
    },
    // 搜索结果
    searchResult(){
      var $this = this;
      $this.loadingFun();
      $this.initPage();
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.loadingFun();
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
            if($this.$route.query.ID){
                if(!$this.menuButtonPermit.includes('Worksaccpet_goodcomment')){
                    $this.$message({
                        showClose: true,
                        message: "未被分配查看工单详情权限",
                        type: 'error',
                        duration:6000
                    });
                    $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
                }else{
                    $this.initPage();
                }
            }else{
                $this.$router.push({path:`/404?redirect=${$this.$router.currentRoute.fullPath}`});
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
    // 组装搜索接口所需数据
    initSearchData(){
      var $this = this;
      var searchData = {};
      searchData.page = $this.searchData.page;
      searchData.limit = $this.searchData.limit;
      if($this.searchData.date&&$this.searchData.date.length>0){
        searchData.starttime = $this.searchData.date[0];
        searchData.endtime = $this.searchData.date[1];
      }
      if($this.$route.query.ID&&$this.$route.query.ID!=''){
        searchData.dealuserid = $this.$route.query.ID;
      }
      if($this.searchData.commentstatus&&$this.searchData.commentstatus!=''){
        searchData.commentstatus = $this.searchData.commentstatus;
      }
      return searchData;
    },
    // 默认最近30天时间周期
    getNearDay(){
      var $this = this;
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      end.setTime(end.getTime() + 3600 * 1000 * 24 * 1);
      var startYear = start.getFullYear();
      var startMonth = start.getMonth() +1;
      var startDay = start.getDate();
      var endYear = end.getFullYear();
      var endMonth = end.getMonth() + 1;
      var endDay = end.getDate();
      startMonth = startMonth<10?'0'+startMonth:startMonth;
      startDay = startDay<10?'0'+startDay:startDay;
      endMonth = endMonth<10?'0'+endMonth:endMonth;
      endDay = endDay<10?'0'+endDay:endDay;
      var startDate = startYear+"-"+startMonth+"-"+startDay;
      var endDate = endYear+"-"+endMonth+"-"+endDay;
      $this.searchData.date=[startDate,endDate];
      $this.initData();
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      var searchData = {};
      searchData = $this.initSearchData();
      $this.$store.dispatch('worksaccpet/getGoodcommentAction', searchData).then(res=>{
        if(res){
          console.log(res,'res');
          if(res.status){
              $this.tableData=res.data;
              $this.totalDataNum = res.allcount;
              $this.isLoading.close();
          }else{
              $this.$message({
                showClose: true,
                message: res.info,
                type: 'error'
              });
          }
        }
      });
    },
    // 每页显示条数改变事件
    handleSizeChange(val) {
      this.searchData.limit = val;
      this.searchData.page = 1;
      $this.searchResult();
    },
    // 当前页改变事件
    handleCurrentChange(val) {
      this.searchData.page = val;
      $this.searchResult();
    },
    // 点击时间事件选择
    hanldetime(){
      var $this = this;
      $this.searchResult();
    },
    //点击评论事件
    commentClick(){
      var $this = this;
      var commentArr = $this.commentArr;
      if(commentArr.length > 0){
        if (commentArr.length > 1) {
          commentArr.shift();
          $this.commentArr = commentArr;
          $this.searchData.commentstatus = $this.commentArr.toString();
        }else{
          $this.searchData.commentstatus = $this.commentArr.toString();
        }
      }else{
        $this.searchData.commentstatus = '';
      }
      $this.searchResult();
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
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
