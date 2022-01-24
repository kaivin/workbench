
<template>
    <div class="page-root en-phone-history flex-box no-padding EnphoneCard" ref="boxPane">
        <div class="sub-router">
          <el-scrollbar wrap-class="scrollbar-wrapper">
            <div class="sub-wrapper">
              <div class="side-button">
                <router-link v-if="menuButtonPermit.includes('Enphone_search')" :to="{path:'/Enphone/searchClues'}" tag="a" target="_blank">
                  <el-button type="primary" plain size="mini"><i class="svg-i" ><svg-icon icon-class="serch_en" /></i>搜索数据</el-button>
                </router-link>
                <router-link v-if="menuButtonPermit.includes('Enphone_countlist')" :to="{path:'/Enphone/statisticChart'}" tag="a" target="_blank">
                  <el-button type="primary" plain size="mini"><i class="svg-i" ><svg-icon icon-class="analy_en" /></i>统计分析</el-button>
                </router-link>
                <router-link v-if="menuButtonPermit.includes('Enphone_phonecount')" :to="{path:'/Enphone/statisticClues'}" tag="a" target="_blank">
                  <el-button type="primary" plain size="mini"><i class="svg-i" ><svg-icon icon-class="analy_en" /></i>业务员数据统计</el-button>
                </router-link>
              </div>
              <dl class="phone-list" v-if="menuButtonPermit.includes('Enphone_lookall')&&menuButtonPermit.includes('Enphone_lookwaitdealall')">
                  <dd v-bind:class="currentKey&&currentKey=='all'?'active':''" v-if="menuButtonPermit.includes('Enphone_lookall')">
                    <router-link :to="{path:'/Enphone/phoneindex',query:{key:'all'}}">
                      <span>查看所有</span><i>({{linkAll.monthNum}})</i><em>({{linkAll.yestodayNum}})</em><b>({{linkAll.todayNum}})</b>
                    </router-link>
                  </dd>
                  <dd v-bind:class="currentKey&&currentKey=='unAllot'?'active':''" v-if="menuButtonPermit.includes('Enphone_lookwaitdealall')">
                    <router-link :to="{path:'/Enphone/phoneindex',query:{key:'unAllot'}}">
                      <span>未分配</span><i>({{linkAll.unAllotNum}})</i>
                    </router-link>
                  </dd>
              </dl>
              <template v-for="(item,index) in defaultData.data">
                <dl class="phone-list" v-if="item.phone.length>0" v-bind:key="index">
                  <dt><span>{{item.brandname}}</span></dt>
                  <dd v-for="(phone,index) in item.phone" v-bind:class="phone.isOn?'active':''" :key="index" :title="phone.phonenumber+phone.othername">
                    <router-link :to="{path:'/Enphone/phoneindex',query:{phoneID:phone.id, waitstatus:phone.waitstatus}}">
                      <span>{{phone.phonenumber}}</span><i>({{phone.nowmonthnumber}})</i><em>({{phone.lastdaynumber}})</em><b>({{phone.nownumber}})</b>
                    </router-link>
                  </dd>
                </dl>
              </template>
            </div>
          </el-scrollbar>
        </div>
        <div class="flex-content relative EnphoneCardFr">
            <div class="abs-panel" ref="mainPane">
              <div class="scroll-panel" ref="scrollDom" style="will-change:scroll-position">
                  <div class="true-height" ref="scrollPane">
                      <p class="breadcrumb" ref="breadcrumbPane">
                        <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
                        <template v-for="item in breadcrumbList">
                          <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
                          <span class="breadcrumb-link" v-bind:key="item.id" v-else><b>-</b><span>{{item.title}}</span></span>
                        </template>
                        <span class="breadcrumb-link"><b>-</b><span>询盘修改日志</span></span>
                      </p>
                      <el-card class="box-card scroll-card no-padding" shadow="hover">
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
                                            prop="id"
                                            label="ID"
                                            width="90"
                                            >
                                        </el-table-column>
                                        <el-table-column
                                            prop="bname"
                                            label="用户"
                                            width="100"
                                            >
                                        </el-table-column>
                                        <el-table-column
                                            prop="ip"
                                            label="IP"
                                            width="100"
                                            >
                                        </el-table-column>
                                        <el-table-column
                                            prop="enid"
                                            label="修改信息ID"
                                            width="110"
                                            >
                                        </el-table-column>
                                        <el-table-column
                                            prop="loginfo"
                                            label="详细记录"
                                            min-width="140"
                                            >
                                            <template slot-scope="scope">
                                                <div class="table-text" v-if="scope.row.newinfo">
                                                    <h3>原始数据：</h3>
                                                    <p><span v-for="(item,index) in scope.row.oldinfo" v-bind:key="index">{{item}}</span></p>
                                                    <div class="line"></div>
                                                    <h3>修改数据：</h3>
                                                    <p><span v-bind:style="item.isEdit?'color:red;':''" v-for="(item,index) in scope.row.editInfoList" v-bind:key="index">{{item.title}}</span></p>
                                                </div>
                                                <div class="table-text" v-else>
                                                  <p>{{scope.row.loginfo}}</p>
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            prop="addtime"
                                            label="时间"
                                            width="160"
                                            >
                                        </el-table-column>
                                    </el-table>
                                </div>
                                <div class="out_box fixed" v-if="scrollPosition.maxScrollWidth>0&&scrollPosition.isPC" :style="'left:'+scrollPosition.left+'px;width:'+scrollPosition.width+'px;bottom:'+scrollPosition.fixedBottom+'px;'" ref="out_box">
                                    <div class="in_box" @mousedown="mouseDownHandler" :style="'left:'+scrollPosition.insetLeft+'px;width:'+scrollPosition.insetWidth+'px;'" ref="in_box" ></div>
                                </div>
                          </div>
                      </el-card>
                  </div>
              </div>
            </div>
            <el-backtop target=".scroll-panel"></el-backtop>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'editHistoryLog',
  data() {
    return {
        breadcrumbList:[],
      defaultData:{
        custorAndsalesmwarn:[],
        custormwarn:[],
        saleswarning:[],
      },
      currentKey:null,
      linkAll:{
        todayNum:0,
        yestodayNum:0,
        monthNum:0,
        unAllotNum:0,
      },
        menuButtonPermit:[],
        tableHeight:0,
        tableData:[],
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
    if(this.sidebar.opened){
      $this.$store.dispatch('app/toggleSideBar');
    }
    $this.$nextTick(function () {   
        $this.setTableHeight();
        // 监听竖向滚动条滚动事件
        window.addEventListener('scroll',this.handleScroll,true);
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
    // loading自定义
    loadingFun(){
      var $this = this;
      $this.isLoading = $this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
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
      var breadcrumbHeight = $this.$refs.breadcrumbPane.offsetHeight;
      var screenHeight = $this.$refs.boxPane.offsetHeight;
      $this.tableHeight = screenHeight-breadcrumbHeight-40;
      $this.getBrowserType();      
      setTimeout(function() {
          $this.setScrollDom();
      }, 400);
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.loadingFun();
      $this.getUserMenuButtonPermit();
    },
    // 右侧标题-左侧电话括号小数字
    leftPhoto(){
      var $this=this;
      $this.$store.dispatch('enphone/getLeftPhotoAction', null).then(response=>{
        if(response){
          if(response.status){
              $this.linkAll.todayNum = response.alltodaynumber;
              $this.linkAll.yestodayNum = response.alllastnumber;
              $this.linkAll.monthNum = response.allnumber;
              $this.linkAll.unAllotNum = response.nodealcount;
              var brand = "";
              var brandID = null;              
              if($this.$route.query.phoneID){
                response.data.forEach(function(item,index){
                  brand = item.brandname;
                  item.phone.forEach(function(item1,index1){
                    if(item1.id == $this.phoneID&&item1.waitstatus==$this.searchData.waitstatus){
                      $this.currentID = item1.id;
                      item1.isOn = true;
                      brandID = item.id;
                      if(item1.phonenumber.indexOf("-")!=-1){
                        $this.currentPhone = item1.phonenumber;
                      }else{
                        $this.currentPhone = brand+"-"+item1.phonenumber;
                      }
                    }else{
                      item1.isOn = false;
                    }
                  });
                });
              }else{
                if($this.$route.query.key){
                  response.data.forEach(function(item,index){
                    item.phone.forEach(function(item1,index1){
                      item.isOn = false;
                    });
                  });
                  if($this.$route.query.key=="all"){
                    $this.currentPhone = "查看所有";
                  }else{
                    $this.currentPhone = "所有未分配";
                  }
                }
              }
              $this.brandID = brandID;
              $this.defaultData = response;
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
            }
          }
        }
      });
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.$store.dispatch('enphone/customerEditHistoryLogAction', {id:$this.$route.query.ID}).then(response=>{
        if(response){
          if(response.status){
            var tableData = response.data;
            tableData.forEach(function(item,index){
                item.editInfoList = [];
                if(item.newinfo){
                  item.editinfo.forEach(function(item1,index1){
                    var itemData = {};
                    itemData.title = item1;
                    if(item1!==item.oldinfo[index1]){
                      itemData.isEdit = true;
                    }else{
                      itemData.isEdit = false;
                    }
                    item.editInfoList.push(itemData);
                  });
                }
            });
            $this.tableData = tableData;
            $this.isLoading.close();
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
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.menuButtonPermit.includes('Enphone_phoneindex')&&$this.menuButtonPermit.includes('Enphone_enxunlog')){
                if($this.$route.query.ID){
                    $this.leftPhoto();
                }else{
                    $this.$message({
                        showClose: true,
                        message: "未找到对应页面或页面缺失参数",
                        type: 'error',
                        duration:6000
                    });
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
      if($this.$route.query.phoneID||$this.$route.query.key){
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
    // 搜索统计数据跳转
    searchStatisticsData(){
      var $this = this;
      var routeUrl =  $this.$router.resolve({path:'/Enphone/searchClues'});
    },
    // 统计分析跳转
    statisticsClues(){
      var $this = this;
      var routeUrl =  $this.$router.resolve({path:'/Enphone/statisticClues'});
      window.open(routeUrl.href,'_self');
    },
    // 电话点击跳转列表
    phoneJump(id,waitstatus){
      var $this=this;
      var queryObj = {};
      if(id==""){
        queryObj.key=waitstatus;
      }else{
        queryObj.phoneID = id;
        queryObj.waitstatus = waitstatus;
      }
      var routeUrl =  $this.$router.resolve({path:'/Enphone/phoneindex',query:queryObj});
      window.open(routeUrl.href,'_self');
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
