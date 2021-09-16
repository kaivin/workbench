<template>
  <div class="page-root website-log" ref="boxPane">
      <div class="abs-panel" ref="mainPane">
          <div class="scroll-panel" ref="scrollDom" style="will-change:scroll-position">
              <div class="true-height" ref="scrollPane">
                  <el-card class="box-card" shadow="hover">
                    <div slot="header">
                      <div class="card-header" ref="headerPane">
                          <h2 class="clues-title">{{website}} 工作日志</h2>
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
                              :style="'min-height:'+tableHeight+'px;'"
                              row-key="id"
                              >
                              <el-table-column
                                prop="createname"
                                label="添加人"
                                width="120"
                                >
                                <template #default="scope">
                                    <div class="table-title">
                                    <span v-if="scope.row.is_hidename==0">{{scope.row.createname}}</span>
                                    <span v-else>匿名</span>
                                    </div>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="title"
                                label="标题"
                                min-width="240"
                                >
                                <template #default="scope">
                                    <div class="table-title" v-on:click="jumpArticle(scope.row.id)">
                                        <i class="svg-i"><svg-icon v-if="scope.row.is_top" icon-class="top" class-name="disabled" /></i><span :style="{color:scope.row.titlecolor?scope.row.titlecolor:''}">{{scope.row.title}}</span>
                                    </div>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="tags"
                                label="标签"
                                min-width="160"
                                >
                                <template #default="scope">
                                    <div class="table-tag">
                                    <el-tag :style="{background:item.color,borderColor:item.color,color:'#ffffff'}" size="small" v-for="item in scope.row.tagList" v-bind:key="item.tag">{{item.tag}}</el-tag>
                                    </div>
                                </template>
                                </el-table-column>
                                <el-table-column
                                    prop="remarks"
                                    label="备注"
                                    min-width="180"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="hits"
                                    label="点击"
                                    width="80"
                                    >
                                    <template #default="scope">
                                        <div class="table-hit">
                                        <span>{{scope.row.hits==0?'':scope.row.hits}}</span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="commentnumber"
                                    label="评论"
                                    width="100"
                                    >
                                    <template #default="scope">
                                        <div class="table-comment">
                                        <span>{{scope.row.commentnumber==0?'':scope.row.commentnumber+"条评论"}}</span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="addtime"
                                    label="添加时间"
                                    width="160"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="updatetime"
                                    label="修改时间"
                                    width="160"
                                    >
                                </el-table-column>
                              <el-table-column
                                v-if="(menuButtonPermit.includes('Website_logedit')||menuButtonPermit.includes('Website_logdelete'))&&device==='desktop'"
                                :width="operationsWidth"
                                align="center"
                                fixed="right"
                                prop="operations"
                                label="操作">
                                <template #default="scope">
                                    <el-button size="mini" v-if="menuButtonPermit.includes('Website_logedit')" @click="editTableRow(scope.row,scope.$index)">编辑</el-button>
                                    <el-button size="mini" v-if="menuButtonPermit.includes('Website_logdelete')&&scope.row.deleteshow" @click="deleteTableRow(scope.row,scope.$index)" type="info" plain>删除</el-button>
                                </template>
                              </el-table-column>
                            </el-table>
                        </div>
                        <div class="out_box fixed" v-if="scrollPosition.maxScrollWidth>0&&scrollPosition.isPC" :style="'left:'+scrollPosition.left+'px;width:'+scrollPosition.width+'px;bottom:'+scrollPosition.fixedBottom+'px;'" ref="out_box">
                            <div class="in_box" @mousedown="mouseDownHandler" :style="'left:'+scrollPosition.insetLeft+'px;width:'+scrollPosition.insetWidth+'px;'" ref="in_box" ></div>
                        </div>
                    </div>
                    <div v-if="totalDataNum>50" class="pagination-panel" ref="pagePane">
                        <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page"
                        :page-sizes="pageSizeList"
                        :page-size="limit"
                        :pager-count="pagerCount"
                        :layout="device==='mobile'?'prev, pager, next':'total, sizes, prev, pager, next, jumper'"
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
import { mapGetters } from 'vuex'
export default {
  name: 'websiteLogList',
  data() {
    return {
      menuButtonPermit:[],
      operationsWidth:"",
      tableData:[],
      tableHeight:200,
      page:1,
      limit:50,
      pagerCount:5,
      pageSizeList:[50, 100, 150, 200],
      totalDataNum:0,
      formLabelWidth:"110px",
      dialogForm:{
        fid:"",
        id:0,
        typename:"",
        sort:"",
      },
      dialogRoleVisible:false,
      websiteID:0,
      website:"",
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
    }
  },
  computed: {
    ...mapGetters([
      'device',
      'addWebsiteLog',
      'sidebar'
    ]),
    isOpen() {
      return this.sidebar.opened;
    },
    isAdd(){
      return this.addWebsiteLog
    }
  },
  mounted(){
      const $this = this;
      this.$nextTick(function () {
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
        if(e>0){
          this.addTableRow();
        }
      },
      isOpen(e){
        this.setTableHeight();
      },
  },
  created(){
    var $this = this;
    $this.initData();
  },
  updated(){
    this.$nextTick(() => {
      this.$refs.simpleTable.doLayout();
      // 监听竖向滚动条滚动事件
      window.addEventListener('scroll',this.handleScroll,true);
    })
  },
  methods:{
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
      var headerHeight = $this.$refs.headerPane.offsetHeight+15;
      var screenHeight = $this.$refs.boxPane.offsetHeight;
      $this.tableHeight = screenHeight-headerHeight-30;
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
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        console.log(res);
        if(res.status){
            console.log(res,"权限")
            if(res.data.length>0){
                res.data.forEach(function(item,index){
                    $this.menuButtonPermit.push(item.action_route);
                });
                if($this.menuButtonPermit.includes('Website_loglist')){
                  var operationsWidth = 20;
                  if($this.menuButtonPermit.includes("Website_logedit")){
                    operationsWidth+=66;
                  }
                  if($this.menuButtonPermit.includes("Website_logdelete")){
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
      if($this.$route.query.websiteID){
          $this.websiteID = $this.$route.query.websiteID;
          $this.website = $this.$route.query.website;
          var formData = {};
          formData.limit = $this.limit;
          formData.page = $this.page;
          formData.website_id = $this.$route.query.websiteID;
          $this.$store.dispatch('website/websiteLogListAction', formData).then(response=>{
              if(response){
                  console.log(response,"日志数据");
                  if(response.status){
                      response.data.forEach(function(item,index){
                          item.tagList = [];
                          if(item.tags != ""){
                              if(item.tags.indexOf("|")!=-1){
                              var tagArr = item.tags.split("|");
                              tagArr.forEach(function(item1,index1){
                                  var itemData = {};
                                  if(item1.indexOf("-")!=-1){
                                  itemData.tag = item1.split("-")[0];
                                  itemData.color = item1.split("-")[1];
                                  }else{
                                  itemData.tag = item1;
                                  itemData.color = "#1b3f75";
                                  }
                                  item.tagList.push(itemData);
                              });
                              }else{
                              var itemData = {};
                              if(item.tags.indexOf("-")!=-1){
                                  itemData.tag = item.tags.split("-")[0];
                                  itemData.color = item.tags.split("-")[1];
                              }else{
                                  itemData.tag = item.tags;
                                  itemData.color = "#1b3f75";
                              }
                              item.tagList.push(itemData);
                              }
                          }
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
      }else{
        $this.$router.push({path:`/404?redirect=${$this.$router.currentRoute.fullPath}`});
      }
    },
    // 添加表格行数据
    addTableRow(){
      var $this = this;
      var routeUrl =  $this.$router.resolve({path:'/Website/logAddEdit',query:{websiteID:$this.websiteID,website:$this.website}});
      window.open(routeUrl.href,'_blank');
    },
    // 编辑表格行数据
    editTableRow(row,index){
      var $this = this;
      if($this.device=="desktop"){
        var routeUrl =  $this.$router.resolve({path:'/Website/logAddEdit',query:{logID:row.id,websiteID:$this.websiteID,website:$this.website}});
        window.open(routeUrl.href,'_blank');
      }else{
        $this.$router.push({path:'/Website/logAddEdit',query:{logID:row.id,websiteID:$this.websiteID,website:$this.website}});
      }
    },
    // 删除表格行
    deleteTableRow(row,index){
      var $this = this;
      $this.$confirm('是否确认删除该日志?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          $this.$store.dispatch('website/websiteLogDeleteAction', {id:row.id}).then(response=>{
            if(response.status){
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'success'
              });
              $this.initData();
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
      console.log(`每页 ${val} 条`);
      this.limit = val;
      this.initData();
    },
    // 当前页改变事件
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.initData();
    },
    // 跳转到文章详情
    jumpArticle(id){
      var $this = this;
      if($this.device=="desktop"){
        var routeUrl =  $this.$router.resolve({path:'/Website/logInfo',query:{logID:id,websiteID:$this.websiteID,website:$this.website}});
        window.open(routeUrl.href,'_blank');
      }else{
        $this.$router.push({path:'/Website/logInfo',query:{logID:id,websiteID:$this.websiteID,website:$this.website}});
      }
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
        $this.scrollTable.fixedTopHeight = $this.$refs.headerPane.offsetHeight+15;
      }else{
         $this.scrollTable.fixedTopHeight=15;
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
      if($this.totalDataNum>50){
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
        if($this.totalDataNum>50){
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
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
