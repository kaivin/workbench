<template>
    <div class="page-root bbs-panel" ref="boxPane">
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
            <el-card class="box-card scroll-card ArticleMain" shadow="hover">
                <div slot="header">
                    <div class="card-header" ref="headerPane">
                        <div class="header-search">
                          <el-input placeholder="请输入您想搜索的内容" v-model="keyword" @keypress.native.enter="searchResult" size="small" class="article-search">
                            <el-button slot="append" @click="searchResult"><span class="search-icon"><svg-icon icon-class="search1" class-name="disabled" /></span><span class="search-text">搜索</span></el-button>
                          </el-input>
                        </div>
                        <div class="border-wrap post-class ArticleOne" v-if="postTypeData.length>0">
                            <div class="border-row flex-wrap" v-for="item in postTypeData" v-bind:key="item.id" v-bind:class="item.id==isArticleTit?'active':''">
                                <div class="border-cell txt-font" v-on:click="handArticleTit(item.id)">
                                    <span>{{item.typename}}</span>
                                </div>
                                <div class="border-cell flex-content" style="left:0px;">
                                    <div class="tag-panel">
                                       <template v-if="item.id==602 && item.children.length > 23">
                                            <template v-for="(type,index) in item.children"  >
                                                <el-button type="primary" plain v-bind:class="type.plain?'is-active':''" size="small" v-bind:key="index" v-if="index<23 && !isAll" v-on:click="linkTo(type.id,type.typename)" >{{type.typename}}</el-button>
                                            </template>
                                            <template v-for="type in item.children" >
                                                <el-button type="primary" plain v-bind:class="type.plain?'is-active':''" size="small" v-bind:key="type.id" v-if="isAll" v-on:click="linkTo(type.id,type.typename)">{{type.typename}}</el-button>
                                            </template>
                                            <el-button type="primary" class="btn_more" v-if="!isAll" @click="showAll()">更多</el-button>
                                            <el-button type="primary" class="btn_more btn_more2" v-if="isAll" @click="showAll()">收起</el-button>
                                        </template>
                                        <template v-else>
                                          <el-button type="primary" plain v-bind:class="type.plain?'is-active':''" size="small" v-for="type in item.children" v-bind:key="type.id" v-on:click="linkTo(type.id,type.typename)">{{type.typename}}</el-button>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="border-wrap post-tag ArticleTwo clearfix" v-if="tagData.length>0&&isList">
                            <div class="border-row flex-wrap" v-if="tags.systemList.length>0">
                                <div class="border-cell txt-font">系统标签</div>
                                <div class="border-cell flex-content">
                                    <div class="tag-panel">
                                        <el-tag v-bind:class="item.plain?'is-active':''" size="small" v-for="item in tags.systemList" v-bind:key="item.id" v-on:click="clickTagHandle(item.id,item.name)">{{item.name}}</el-tag>
                                    </div>
                                </div>
                            </div>
                            <div class="border-row flex-wrap" v-if="tags.customList.length>0">
                                <div class="border-cell txt-font">自定义标签</div>
                                <div class="border-cell flex-content">
                                    <div class="tag-panel">
                                        <el-tag v-bind:class="item.plain?'is-active':''" size="small" v-for="(item,index) in tags.customList" v-bind:key="index" v-on:click="clickTagHandle(item.id,item.name)">{{item.name}}</el-tag>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-content ArticleThree" ref="cardContent" v-if="isDefault&&departUser.length>0">
                    <div class="card-wrap ArticleThreeDefault">
                        <ul class="depart-ul">
                            <li class="item-depart" v-for="item in departUser" v-bind:key="item.id">
                                <h4>{{item.name}}</h4>
                                <div class="clerk-ul" v-if="item.departuser.length>0">
                                    <dl class="item-clerk" v-for="user in item.departuser" v-bind:key="user.id">
                                        <dt>{{user.name}}<span>[{{user.id}}]</span></dt>
                                        <dd><span v-bind:class="'JobLevel_'+user.level"></span></dd>
                                    </dl>
                                </div>
                                <div class="clerk-ul" v-else>
                                    <dl class="item-clerk">
                                        <dt><span></span></dt>
                                        <dd><span></span></dd>
                                    </dl>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="card-content ArticleThree" ref="cardContent" v-if="isList">
                    <div class="card-wrap ArticleThreeList">
                      <div class="table-wrapper" v-bind:class="scrollPosition.isFixed?'fixed-table':''">
                          <div class="table-mask"></div>
                          <el-table
                              ref="simpleTable"
                              :data="tableData"
                              stripe
                              class="SiteTable"
                              style="width: 100%"
                              :style="'min-height:'+minHeight+'px;'"
                              key="a"
                              >
                              <el-table-column
                              prop="createname"
                              align="center"
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
                              align="left"
                              label="标题"
                              min-width="240"
                              >
                              <template #default="scope">
                                  <router-link class="table-title" :to="{path:'/Article/info',query:{id:scope.row.id}}">
                                  <i class="svg-i"><svg-icon v-if="scope.row.is_top" icon-class="top" class-name="disabled" /></i><span :style="{color:scope.row.titlecolor?scope.row.titlecolor:''}">{{scope.row.title}}</span>
                                  </router-link>
                              </template>
                              </el-table-column>
                              <el-table-column
                              prop="mytags"
                              align="left"
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
                              prop="readpermit"
                              align="center"
                              label="阅读权限"
                              width="100"
                              >
                              <template slot-scope="scope">
                                  <div class="table-permit">
                                  <el-popover trigger="hover" placement="top" v-if="scope.row.authorization.length>0">
                                      <p v-for="(item,index) in scope.row.authorization" v-bind:key="index">{{item}}</p>
                                      <i slot="reference" class="svg-i"><svg-icon :icon-class="scope.row.authorization[0]!='默认权限'?'peoples':'unlock'" /></i>
                                  </el-popover>
                                  </div>
                              </template>
                              </el-table-column>
                              <el-table-column
                              prop="hits"
                              align="center"
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
                              align="center"
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
                              align="left"
                              label="添加时间"
                              width="160"
                              >
                              </el-table-column>
                              <el-table-column
                              v-if="(menuButtonPermit.includes('Article_edit')||menuButtonPermit.includes('Article_delete'))"
                              :width="operationsWidth"
                              fixed="right"
                              prop="operations"
                              align="center"
                              label="操作">
                              <template #default="scope">
                                  <router-link class="newBtn" v-if="scope.row.editshow&&menuButtonPermit.includes('Article_edit')" :to="{path:'/Article/addEdit',query:{id:scope.row.id}}">
                                    <el-button size="mini" >修改</el-button>
                                  </router-link>
                                  <el-button size="mini" v-if="scope.row.deleteshow&&menuButtonPermit.includes('Article_delete')" @click="deleteTableRow(scope.row,scope.$index)" type="info" plain>删除</el-button>
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
                        :layout="'total, sizes, prev, pager, next, jumper'"
                        :total="totalDataNum">
                        </el-pagination>
                    </div>
                </div>
                <div class="card-content ArticleThree" ref="cardContent" v-if="isSearch&&menuButtonPermit.includes('Article_search')">
                    <div class="card-wrap search-content">
                      <h2 ref="searchTit">搜索关键词：<span>{{searchKey}}</span>，共找到：<span>{{totalDataNum}}</span>条</h2>
                      <div class="table-wrapper" v-bind:class="scrollPosition.isFixed?'fixed-table':''">
                        <div class="table-mask"></div>
                        <el-table
                            ref="searchTable"
                            :data="searchData"
                            stripe
                            class="SiteTable"
                            style="width: 100%"                            
                            :style="'min-height:'+minHeight+'px;'"
                            key="b"
                            >
                            <el-table-column
                            prop="typename"
                            label="论坛栏目"
                            width="120"
                            >
                            </el-table-column>
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
                                <router-link class="table-title" :to="{path:'/Article/info',query:{id:scope.row.id}}">
                                <span v-html="scope.row.title"></span>
                                </router-link>
                            </template>
                            </el-table-column>
                            <el-table-column
                            prop="mytags"
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
                            prop="addtime"
                            label="添加时间"
                            width="160"
                            >
                            </el-table-column>
                            <el-table-column
                            v-if="(menuButtonPermit.includes('Article_edit')||menuButtonPermit.includes('Article_delete'))"
                            :width="operationsWidth"
                            align="center"
                            fixed="right"
                            prop="operations"
                            label="操作">
                            <template #default="scope">
                                <div class="table-button">
                                  <router-link v-if="scope.row.editshow&&menuButtonPermit.includes('Article_edit')" :to="{path:'/Article/addEdit',query:{id:scope.row.id}}">
                                    <el-button size="mini">修改</el-button>
                                  </router-link>
                                <el-button size="mini" v-if="scope.row.deleteshow&&menuButtonPermit.includes('Article_delete')" @click="deleteTableRow(scope.row,scope.$index)" type="info" plain>删除</el-button>
                                </div>
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
                        :layout="'total, sizes, prev, pager, next, jumper'"
                        :total="totalDataNum">
                        </el-pagination>
                    </div>
                </div>
            </el-card>
          </div>
        </div>
      </div>
      <el-backtop target=".scroll-panel"></el-backtop>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Article_index',
  data() {
    return {
      minHeight:"auto",
      breadcrumbList:[],
      menuButtonPermit:[],
      operationsWidth:"",
      tableData:[],
      departUser:[],
      postTypeData:[],
      searchData:[],
      tagData:[],
      currentID:0,
      currentPost:"",
      currentTagID:0,
      currentTagName:"",
      keyword:"",
      searchKey:"",
      page:1,
      limit:50,
      pagerCount:5,
      pageSizeList:[50, 100, 150, 200],
      totalDataNum:0,
      isDefault:true,
      isList:false,
      isSearch:false,
      isArticleTit:0,
      isArticleTitId:0,
      tags:{
        systemList:[],
        customList:[],
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
      isAll: false,
      scrolltop: 0
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

  activated(){
      const $this = this;
      if(!$this.sidebar.opened){
        $this.$store.dispatch('app/toggleSideBar');
      }
      this.$nextTick(function () {
        if($this.isSearch||$this.isList){
          $this.setHeight();
        }
      });
      window.addEventListener('scroll', $this.handleScroll,true);
      // 监听竖向滚动条滚动事件
      if($this.scroll > 0){
        document.querySelector(".scroll-panel").scrollTo(0, $this.scroll);
        this.scroll = 0;
      }
      
      window.onresize = () => {
          return (() => {
            if($this.isSearch||$this.isList){
                $this.setHeight();
            }
          })()
      };
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
        if(to.name===from.name){
          this.initData();
        }else if(to.name == "Article_index"){
          this.scrollPosition.isFixed=false;
          if(document.querySelector(".el-table.SiteTable .el-table__body-wrapper")){
            document.querySelector(".el-table.SiteTable .el-table__body-wrapper").style="padding-top:0"
          }
        }
      },
      // isOpen(e){
      //   if(this.isSearch||this.isList){
      //     this.setHeight();
      //   }
      // },
  },
  created(){
    var $this = this;
    $this.getBreadcrumbList();
    $this.initData();
  },
  updated(){
    var $this = this;
    this.$nextTick(() => {
      if($this.isList){
        $this.$refs.simpleTable.doLayout();
      }
      if($this.isSearch){
        $this.$refs.searchTable.doLayout();
      }
    });
  },
  deactivated(){
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
    setHeight(){
      var $this = this;
      $this.minHeight = 0;
      var headerHeight = $this.$refs.headerPane.offsetHeight+45;
      var breadcrumbHeight = $this.$refs.breadcrumbPane.offsetHeight;      
      var screenHeight = $this.$refs.boxPane.offsetHeight;
      if($this.isSearch){
         var searchTit = $this.$refs.searchTit.offsetHeight; 
         $this.minHeight = screenHeight-headerHeight-searchTit-breadcrumbHeight-40;       
      }else{
         $this.minHeight = screenHeight-headerHeight-breadcrumbHeight-40;
      }
      $this.getBrowserType();
      setTimeout(function() {
          $this.setScrollDom();
      }, 400);
    },
    // 搜索结果点击事件
    searchResult(){
      var $this = this;
      if($this.keyword!=""){
        $this.$router.push({path:'/Article/index',query:{keyword:$this.keyword}});
      }else{
        $this.$router.push({path:'/Article/index'});
      }
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 树形菜单
    dataToTree(data,$this){
        var parents = data.filter(function (item) {
            return item.fid == 0;
        });
        var children = data.filter(function (item) {
            return item.fid != 0;
        });
        $this.convert(parents, children,$this);
        return parents;
    },
    // 树形菜单转化
    convert(parents,children,$this){
      parents.forEach(function (item) {
        item.plain = false;
        item.children = [];
        children.forEach(function (current, index) {
            if (current.fid === item.id) {
                var temp = JSON.parse(JSON.stringify(children));// 将获得的子集json格式化
                temp.splice(index, 1);// 删除子集中已匹配项
                item.children.push(current);
                $this.convert([current], temp,$this);// 递归
            }
        });
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
            if($this.menuButtonPermit.includes('Article_index')){
              if(!$this.menuButtonPermit.includes('Article_search')&&$this.$route.query.keyword){
                $this.$message({
                  showClose: true,
                  message: "未被分配该页面的搜索权限",
                  type: 'error',
                  duration:6000
                });
                $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
              }
              if(!$this.menuButtonPermit.includes('Article_lists')&&$this.$route.query.id){
                $this.$message({
                  showClose: true,
                  message: "未被分配该页面的文章访问权限",
                  type: 'error',
                  duration:6000
                });
                $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
              }
              var operationsWidth = 22;
              if($this.menuButtonPermit.includes('Article_edit')){
                operationsWidth+=66;
              }
              if($this.menuButtonPermit.includes('Article_delete')){
                operationsWidth+=66;
              }
              $this.operationsWidth = "" + operationsWidth;
              $this.getPostTypeData();
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
    // 获取当前登录用户可看到的论坛栏目数据
    getPostTypeData(){
      var $this = this;
      $this.$store.dispatch('article/userCanReadPostAction', null).then(response=>{
        if(response){
          if(response.status){
            $this.postTypeData = $this.dataToTree(response.data,$this);
            $this.initPage();
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
    // 获取当前登录用户可看到的部门成员信息
    getUserCanReadDepartUser(){
      var $this = this;
      document.getElementsByClassName("scroll-panel")[0].scrollTop = 0;
      $this.$store.dispatch('article/postArticleAction', null).then(response=>{
        if(response){
          if(response.status){
            $this.departUser = response.data;
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
    // 初始化页面
    initPage(){
      var $this = this;
      if($this.$route.query.id){
          $this.currentID = $this.$route.query.id;
          $this.isDefault = false;
          $this.isList = true;
          $this.isSearch = false;
          $this.keyword = "";
          $this.searchKey = "";
          $this.searchData = [];
          $this.limit = 50;
          $this.page = 1;
          if($this.$route.query.tagName){// 标签切换
            $this.currentTagName = $this.$route.query.tagName;
            if($this.$route.query.tagID){
              $this.currentTagID = $this.$route.query.tagID;
            }else{
              $this.currentTagID = 0;
            }
          }else{// 分类切换
            $this.currentTagID = 0;
            $this.currentTagName = "";
          }
          $this.getPostTagList();
        }else if($this.$route.query.keyword){
          $this.keyword = $this.$route.query.keyword;
          $this.searchKey = $this.$route.query.keyword;
          $this.currentID = 0;
          $this.currentPost = "";
          $this.currentTagID = 0;
          $this.currentTagName = "";
          $this.tableData = [];
          $this.isDefault = false;
          $this.isList = false;
          $this.isSearch = true;
          $this.limit = 50;
          $this.page = 1;
          $this.getPostSearchList();
        }else{
          $this.currentID = 0;
          $this.currentPost = "";
          $this.currentTagID = 0;
          $this.currentTagName = "";
          $this.searchData = [];
          $this.tableData = [];
          $this.isDefault = true;
          $this.isList = false;
          $this.isSearch = false;
          $this.keyword = "";
          $this.searchKey = "";
          $this.limit = 50;
          $this.page = 1;
          $this.getUserCanReadDepartUser();
        }
        $this.changePostType($this.postTypeData,$this.currentID,$this);
    },
    // 页面跳转当前选中论坛栏目
    linkTo(id){
      var $this = this;
      $this.isArticleTit=0;
      $this.isArticleTitId=0;
      $this.$router.push({path:'/Article/index',query:{id:id}});
    },
    // 论坛栏目选中状态切换
    changePostType(data,id,$this){
      data.forEach(function(item,index){
        if(item.id == id){
          item.plain = true;
          $this.currentPost = item.typename;
        }else{
          item.plain = false;
        }
        if(item.children.length>0){
          $this.changePostType(item.children,id,$this);
        }
      });
    },
    // 编辑表格行数据
    editTableRow(row,index){
      var $this = this;
      var routeUrl =  $this.$router.resolve({path:'/Article/addEdit',query:{id:row.id}});
      window.open(routeUrl.href,'_blank');
    },
    // 删除表格行
    deleteTableRow(row,index){
      var $this = this;
      $this.$confirm('是否确认删除该文章?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          $this.$store.dispatch('article/postArticleDeleteAction', {id:row.id}).then(response=>{
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
      this.limit = val;
      this.page = 1;
      if(this.$route.query.id){
        this.getPostList();
      }else{
        this.getPostSearchList();
      }
    },
    // 当前页改变事件
    handleCurrentChange(val) {
      this.page = val;
      this.scrollPosition.isFixed=false;
      document.querySelector(".el-table.SiteTable .el-table__body-wrapper").style="padding-top:0"
      if(this.$route.query.id){
        this.getPostList();
      }else{
        this.getPostSearchList();
      }
    },
    // 获取文章列表数据
    getPostList(){
      var $this = this;
      var dataParam = {};
      dataParam.page = $this.page;
      dataParam.limit = $this.limit;
      dataParam.typeid = $this.currentID;
      dataParam.tags = $this.currentTagName;
      dataParam.tagsid = $this.currentTagID;
      document.getElementsByClassName("scroll-panel")[0].scrollTop = 0;
      $this.$store.dispatch('article/postListAction',dataParam).then(res=>{
        if(res.status){
          if(res.data.length>0){
            res.data.forEach(function(item,index){
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
              item.authorization = [];
              if(item.readpermitname!=""){
                if(item.readpermitname.indexOf("|")!= -1){
                  var permitArr = item.readpermitname.split("|");
                  permitArr.forEach(function(item1,index1){
                    if(item1!=""){
                      var itemData = "授权"+item1;
                      item.authorization.push(itemData);
                    }
                  })
                }else{
                  if(item.readpermitname.indexOf("默认权限")!= -1){
                    item.authorization.push(item.readpermitname);
                  }else{
                    var itemData = "授权"+item.readpermitname;
                    item.authorization.push(itemData);
                  }
                }
              }
            });
          }
          $this.tableData = res.data;
          $this.totalDataNum = res.allcount;
          if($this.isSearch||$this.isList){
            $this.$nextTick(() => {
              $this.setHeight();
            });
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
    // 获取文章标签数据
    getPostTagList(){
      var $this = this;
      var dataParam = {}
      dataParam.id = $this.currentID;
      $this.$store.dispatch('article/postTagListAction',dataParam).then(res=>{
        if(res.status){
          if(res.data.length>0){
            $this.changeTagType(res.data,$this.currentTagID,$this.currentTagName,$this);
          }else{
            $this.tags = [];
            $this.tagData = [];
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
    // 获取论文文章搜索结果数据
    getPostSearchList(){
      var $this = this;
      var dataParam = {};
      dataParam.page = $this.page;
      dataParam.limit = $this.limit;
      dataParam.keywords = $this.keyword;
      document.getElementsByClassName("scroll-panel")[0].scrollTop = 0;
      $this.$store.dispatch('article/postSearchListAction',dataParam).then(res=>{
        if(res.status){
          if(res.data.length>0){
            var keywordList = $this.keyword.split(" ");
            res.data.forEach(function(item,index){
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
              keywordList.forEach(function(item1,index1){
                item.title = item.title.replace(eval("/"+item1+"/g"),'<b>'+item1+'</b>');
              });
            });
          }
          $this.searchData = res.data;
          $this.totalDataNum = res.allcount;
          $this.$nextTick(() => {
            $this.setHeight();
          });
        }else{
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'error'
          });
        }
      });
    },
    // 文章标签分类
    tagAllot(data){
      var tags= {};
      tags.systemList = [];
      tags.customList = [];
      data.forEach(function(item,index){
        if(item.id == 0){
          tags.customList.push(item);
        }else{
          tags.systemList.push(item);
        }
      });
      return tags;
    },
    // 页面跳转当前选中文章标签
    clickTagHandle(id,name){
      var $this = this;
      if(id == 0){
        $this.$router.push({path:'/Article/index',query:{id:$this.currentID,tagName:name}});
      }else{
        $this.$router.push({path:'/Article/index',query:{id:$this.currentID,tagID:id,tagName:name}});
      }
    },
    // 标签分类切换状态
    changeTagType(data,id,name,$this){
      data.forEach(function(item,index){
        if(item.name==name&&item.id==id){
          item.plain = true;
        }else{
          item.plain = false;
        }
      });
      $this.tags = $this.tagAllot(data);
      $this.tagData = data;
      $this.getPostList();
    },
    // 跳转到文章详情
    jumpArticle(id){
      var $this = this;
      var routeUrl =  $this.$router.resolve({path:'/Article/info',query:{id:id}});
      window.open(routeUrl.href,'_blank');
    },
    //移动端导航切换
    handArticleTit(Nt){
       var $this=this;
       if($this.isArticleTitId==Nt){
         $this.isArticleTit=0;
         $this.isArticleTitId=0;
       }else{
         $this.isArticleTit=Nt;
         $this.isArticleTitId=Nt;
       }
    },
    // 设置横向滚动条相关DOM数据
    setScrollDom(){
      var $this = this;
      $this.scrollPosition.insetLeft = 0;
      $this.scrollPosition.oldInsetLeft = 0;
      if($this.isList){
        // 表格真实宽度（可能超出屏幕）
        var scrollWidth = $this.$refs.simpleTable.bodyWrapper.scrollWidth;
        // 表格可见宽度（屏幕内宽度）
        var maxWidth = $this.$refs.simpleTable.bodyWrapper.clientWidth;
        // 获取表格的位置信息（距离视窗左边的位置信息）
        var rectOBJ = $this.$refs.simpleTable.$el.getBoundingClientRect();
      }
      if($this.isSearch){
        // 表格真实宽度（可能超出屏幕）
        var scrollWidth = $this.$refs.searchTable.bodyWrapper.scrollWidth;
        // 表格可见宽度（屏幕内宽度）
        var maxWidth = $this.$refs.searchTable.bodyWrapper.clientWidth;
        // 获取表格的位置信息（距离视窗左边的位置信息）
        var rectOBJ = $this.$refs.searchTable.$el.getBoundingClientRect();
      }
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
        $this.scrollTable.fixedTopHeight = $this.$refs.headerPane.offsetHeight+$this.$refs.breadcrumbPane.offsetHeight+15+20+53;
      }else{
         $this.scrollTable.fixedTopHeight=$this.$refs.breadcrumbPane.offsetHeight+15+20+59;
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
      // console.log("滚动事件");
      this.scroll  = document.querySelector(".scroll-panel").scrollTop;
      var $this = this;
      if($this.isSearch||$this.isList){
        if(!$this.scrollPosition.isMouseDown&&event.target.className=="scroll-panel"){// 非鼠标按下状态，为竖向滚动条触发的滚动事件
          var scrTop = event.target.scrollTop;
          var tableFixedRightDom = document.querySelector(".SiteTable .el-table__fixed-right");
          if(scrTop!=0&&$this.scrollTable.fixedTopHeight!=0){
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
    // 点击站开全部栏目
    showAll(){
      var $this = this;
      $this.isAll = !$this.isAll;
    }
  }
}
</script>
<style lang="scss" scoped>
</style>