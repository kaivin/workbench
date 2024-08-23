<template>
  <div class="page-root deal-page" ref="boxPane">
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
                            <div class="card-header" ref="headerPane">
                                <div class="search-wrap" ref="searchPane">
                                    <div class="item-search">
                                      <el-date-picker
                                          style="width: 240px;"
                                          v-model="searchData.date"
                                          type="monthrange"
                                          format="yyyy-MM"
                                          value-format="yyyy-MM"
                                          key="b"
                                          size="small"
                                          class="date-range"
                                          :clearable="false"
                                          @change="searchResult"
                                          range-separator="～"
                                          start-placeholder="开始日期"
                                          end-placeholder="结束日期"
                                          :picker-options="pickerMonthRangeOptions">
                                        </el-date-picker>
                                    </div>
                                    <div class="item-search">
                                        <el-button class="item-input" type="primary" size="small" :disabled="isSearchResult" icon="el-icon-search" @click="searchResult">查询</el-button>
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
                                    row-key="id"
                                    :span-method="objectSpanMethod"
                                    :tree-props="{children: 'children'}"
                                    >
                                    <el-table-column
                                      prop="time"
                                      label="成交时间"
                                      align="center"
                                      >
                                    </el-table-column>
                                    <el-table-column
                                      prop="starttime"
                                      label="询盘时间"
                                      align="center"
                                      >
                                      <template #default="scope">
                                        {{scope.row.starttime+" ~ " + scope.row.time}}
                                      </template>
                                    </el-table-column>
                                    <el-table-column
                                      prop="buyproduct"
                                      label="询盘产品"
                                      align="center"
                                      >
                                    </el-table-column>
                                    <el-table-column
                                      prop="number"
                                      label="成交个数"
                                      align="center"
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
  </div>
</template>
<script>
import { mapGetters,mapActions} from 'vuex'
export default {
  name: 'encount_productDeal',
  data() {
    return {
      breadcrumbList:[],                             //面包屑导航
      menuButtonPermit:[],                           //网页权限字段
      tableData:[],                                  //列表数据
      tableHeight:200,                               //列表默认高度
      formLabelWidth:"120px",                        //导出项目宽度
      searchData:{                                   //搜索数据条件
        date: [],
        page:1,
        limit:20,
      },
      pageSizeList:[20, 50, 100, 200, 500],           //分页每页条数
      totalDataNum:0,
      pagerCount:5,
      pickerMonthRangeOptions: {
        disabledDate(time) {
          var end = new Date();
          end.setMonth(end.getMonth() - 1);
          var start = new Date("2022-01-01 00:00:00");
          var date = end.getDate();
          if(date < 15){
            end.setMonth(end.getMonth() - 1);
          }
          return time.getTime() > end || time.getTime() < start;
        },
      },                                    //默认今天数据
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
      // window.addEventListener('scroll',this.handleScroll,true);
      // $this.$nextTick(function () {
      //   $this.setTableHeight();
      // });
      // window.onresize = () => {
      //   return (() => {
      //     $this.setTableHeight();
      //   })()
      // }
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
      // isOpen(e){
      //   this.setTableHeight();
      // },
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
      var breadcrumbHeight = $this.$refs.breadcrumbPane.offsetHeight;
      var screenHeight = $this.$refs.boxPane.offsetHeight;
      $this.tableHeight = screenHeight-headerHeight-breadcrumbHeight-40;
      $this.getBrowserType();
        setTimeout(function() {
          $this.setScrollDom();
      }, 400);
    },
    // 搜索数据
    searchResult(){
        var $this = this;
        if(!$this.isSearchResult){
          $this.isSearchResult=true; 
          $this.initPage();
        }
    },
    // 组装搜索数据
    searchDataInit(){
      var $this = this;
      var searchData = {};
      if($this.searchData.date&&$this.searchData.date.length>0){
        searchData.time = $this.searchData.date[0];
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
      document.getElementsByClassName("scroll-panel")[0].scrollTop = 0;
      $this.$store.dispatch('endeal/dealProductData', searchData).then(res=>{
        if(res){
          if(res.status){
              if(res.data && res.data.length > 0){
                var resList = [];
                res.data.forEach(function(item,index){
                  if(item.product && item.product.length > 0){
                    let prolist = item.product.sort(function(a, b){
                      return b.number - a.number;
                    });
                    var childList = [];
                    prolist.forEach(function(sitem, sindex){
                      let newObj = {};
                      newObj.id = (index+1)+"-"+sindex;
                      newObj.time = item.time;
                      newObj.starttime = item.starttime;
                      newObj.buyproduct = sitem.buyproduct;
                      newObj.number = sitem.number;
                      childList.push(newObj);
                    })
                    var resItem = childList[0].buyproduct === "配件" ? childList[1] : childList[0];
                    var newResItem = {};
                    newResItem.id = index+1;
                    newResItem.time = resItem.time;
                    newResItem.starttime = resItem.starttime;
                    newResItem.buyproduct = resItem.buyproduct;
                    newResItem.number = resItem.number;
                    newResItem.children = childList;
                    resList.push(newResItem);
                  }else{
                    item.id = index+1;
                    resList.push(item);
                  }
                })
                $this.tableData = resList;
              }else{
                $this.tableData = [];
              }
              setTimeout(()=>{
                $this.isSearchResult=false;
              },500);
              // $this.$nextTick(function () {
              //   $this.setTableHeight();
              // })
          }else{
            if(res.permitstatus&&res.permitstatus==2){
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
                message: res.info,
                type: 'error'
              });
              setTimeout(()=>{
                $this.isSearchResult=false;
              },500);
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
           
            if($this.menuButtonPermit.includes('Encount_cjcountthree')){
              var nowData = $this.getNowMonth();
              $this.searchData.date = nowData;
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
            message: res.info,
            type: 'error'
          });
        }
      });
    },
    getNowMonth(){
      var now = new Date();
      var year = now.getFullYear();
      var month = now.getMonth(); //成交统计至上月，不+1
      var date = now.getDate();
      if(date < 15){
        month = month -1;
      }
      var endDate = month < 10 ? year+"-"+ "0"+month : year+"-"+month;
      var startDate = "";
      if(month < 3){
        var startYear = year-1;
        var startMonth = month+12-2;
        startDate = startMonth < 10 ? startYear+"-"+ "0"+startMonth : startYear+ "-"+ startMonth;
      }else{
        var startMonth = month - 2;
        startDate = startMonth < 10 ? year+"-"+ "0"+startMonth : year+ "-"+ startMonth;
      }

      return [startDate, endDate];
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 如果是第一行
      var $this = this;
      if (columnIndex === 0 || columnIndex === 1) {
        const _row = $this.filterSpan($this.tableData, 'time')[rowIndex] // 这里需要修改
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    // 处理数据
    filterSpan(arr, condition) {
      var $this = this;
      const spanOneArr = []
      let concatOne = 0
      var newArr = []
      arr.map((item, index) => {
        spanOneArr.push(1)
        
        if(item.children && item.children.length>0){
          item.children.map((sitem, sindex) => {
            // 第一列需合并相同内容的判断条件
            if (sindex === 0) {
              spanOneArr.push(1)
              concatOne = $this.getRealIndex(arr, sitem.id)
            } else {
              if (sitem[condition] === item.children[sindex - 1][condition]) {
                spanOneArr[concatOne] += 1
                spanOneArr.push(0)
              } else {
                spanOneArr.push(1)
                concatOne = $this.getRealIndex(arr, sitem.id)
              }
            }
          })
        }
      })
      return spanOneArr
    },
    // 获取真实的index
    getRealIndex(data,id){
      var inx = 0;
      var resIndex = 0;
      data.forEach(function(item,index){
        inx++;
        if(item.id==id){
          resIndex = inx;
        }
        if(item.children && item.children.length>0){
          item.children.forEach(function(sitem,sindex){
            inx++;
            if(sitem.id==id){
              resIndex = inx;
            }
          })
        }
      })
      return resIndex-1;
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
</style>
