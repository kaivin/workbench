<template>
  <div class="page-root" ref="boxPane">
    <el-row>
      <el-col :span="24">
        <el-card class="box-card scroll-card" shadow="hover">
          <div slot="header">
            <div class="card-header" ref="headerPane">
              <el-button type="primary" size="small" icon="el-icon-refresh" v-on:click="refreshData()">刷新</el-button>
              <el-input
                style="width: 280px;margin-right: 10px;margin-left: 10px;"
                placeholder="输入关键词 空格分隔 如：2021 中文"
                v-model="keyword"
                size="small"
                v-if="(menuButtonPermit.includes('Article_search'))&&device==='desktop'"
                clearable>
              </el-input>
              <el-button class="item-input" size="small" type="primary" icon="el-icon-search" @click="searchResult" v-if="(menuButtonPermit.includes('Article_search'))&&device==='desktop'">搜索</el-button>
              <el-button type="success" size="small" icon="el-icon-document-add" v-on:click="addTableRow()" v-if="(menuButtonPermit.includes('Article_add'))&&device==='desktop'">发布文章</el-button>
            </div>
          </div>
          <div class="card-content" ref="cardContent">
            <div class="scroll-panel" v-bind:style="{height:scrollHeight+'px'}">
              <div class="search-panel" v-if="(menuButtonPermit.includes('Article_search'))&&device!=='desktop'">
                <el-input
                  class="search-input"
                  placeholder="输入关键词 空格分隔 如：2021 中文"
                  v-model="keyword"
                  size="mini"
                  clearable>
                </el-input>
                <el-button class="item-input" size="mini" type="primary" icon="el-icon-search" @click="searchResult">搜索</el-button>
              </div>
              <div class="border-wrap post-class" v-bind:class="device==='desktop'?'':'mobile'" v-if="postTypeData.length>0">
                <div class="border-row flex-wrap" v-for="item in postTypeData" v-bind:key="item.id">
                    <div class="border-cell txt-font">{{item.typename}}</div>
                    <div class="border-cell flex-content">
                        <div class="tag-panel">
                            <el-button type="primary" plain v-bind:class="type.plain?'is-active':''" :size="device==='desktop'?'small':'mini'" v-for="type in item.children" v-bind:key="type.id" v-on:click="linkTo(type.id,type.typename)">{{type.typename}}</el-button>
                        </div>
                    </div>
                </div>
              </div>
              <el-divider><i class="el-icon-goblet-square-full" v-if="postTypeData.length>0"></i></el-divider>
              <div v-if="isDefault&&departUser.length>0" class="card-wrap">
                <ul class="depart-ul">
                    <li class="item-depart" v-for="item in departUser" v-bind:key="item.id">
                        <h4>{{item.name}}</h4>
                        <div class="clerk-ul">
                            <dl class="item-clerk" v-for="user in item.departuser" v-bind:key="user.id">
                                <dt>{{user.name}}[{{user.id}}]</dt>
                                <dd><span v-bind:class="'JobLevel_'+user.level"></span></dd>
                            </dl>
                        </div>
                    </li>
                </ul>
              </div>
              <div v-if="isList" class="card-wrap">
                <div class="border-wrap post-tag" v-bind:class="device==='desktop'?'':'mobile'" v-if="tagData.length>0">
                  <div class="border-row flex-wrap" v-if="tags.systemList.length>0">
                      <div class="border-cell txt-font">系统标签</div>
                      <div class="border-cell flex-content">
                          <div class="tag-panel">
                              <el-tag :style="{background:item.namecolor,borderColor:item.namecolor,color:'#ffffff'}" v-bind:class="item.plain?'is-active':''" size="small" v-for="item in tags.systemList" v-bind:key="item.id" v-on:click="clickTagHandle(item.id,item.name)">{{item.name}}</el-tag>
                          </div>
                      </div>
                  </div>
                  <div class="border-row flex-wrap" v-if="tags.customList.length>0">
                      <div class="border-cell txt-font">自定义标签</div>
                      <div class="border-cell flex-content">
                          <div class="tag-panel">
                              <el-tag :style="{background:item.namecolor,borderColor:item.namecolor,color:'#ffffff'}" v-bind:class="item.plain?'is-active':''" size="small" v-for="(item,index) in tags.customList" v-bind:key="index" v-on:click="clickTagHandle(item.id,item.name)">{{item.name}}</el-tag>
                          </div>
                      </div>
                  </div>
                </div>
                <el-divider><i class="el-icon-goblet-square-full" v-if="tagData.length>0"></i></el-divider>
                <div v-if="totalDataNum>50" class="pagination-panel top-page" ref="pagePane">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page"
                    :page-sizes="pageSizeList"
                    :page-size="limit"
                    :layout="device==='mobile'?'sizes, jumper':'total, sizes, prev, pager, next, jumper'"
                    :total="totalDataNum">
                  </el-pagination>
                </div>
                <h2 v-if="currentPost!=''">{{currentPost}} <span v-if="currentTagName!=''">标签：{{currentTagName}}</span></h2>
                <el-table
                  border
                  ref="simpleTable"
                  :data="tableData"
                  stripe
                  style="width: 100%"
                  key="a"
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
                    prop="readpermit"
                    label="阅读权限"
                    width="80"
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
                    v-if="(menuButtonPermit.includes('Article_edit')||menuButtonPermit.includes('Article_delete'))&&device==='desktop'"
                    :width="operationsWidth"
                    align="center"
                    fixed="right"
                    prop="operations"
                    label="操作">
                    <template #default="scope">
                      <el-button size="mini" v-if="scope.row.editshow&&menuButtonPermit.includes('Article_edit')" @click="editTableRow(scope.row,scope.$index)">修改</el-button>
                      <el-button size="mini" v-if="scope.row.deleteshow&&menuButtonPermit.includes('Article_delete')" @click="deleteTableRow(scope.row,scope.$index)" type="info" plain>删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div v-if="totalDataNum>50" class="pagination-panel" ref="pagePane">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page"
                    :page-sizes="pageSizeList"
                    :page-size="limit"
                    :layout="device==='mobile'?'sizes, jumper':'total, sizes, prev, pager, next, jumper'"
                    :total="totalDataNum">
                  </el-pagination>
                </div>
              </div>
              <div v-if="isSearch&&menuButtonPermit.includes('Article_search')" class="card-wrap search-content">
                <div v-if="totalDataNum>50" class="pagination-panel top-page" ref="pagePane">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page"
                    :page-sizes="pageSizeList"
                    :page-size="limit"
                    :layout="device==='mobile'?'sizes, jumper':'total, sizes, prev, pager, next, jumper'"
                    :total="totalDataNum">
                  </el-pagination>
                </div>
                <h2>搜索关键词：<span>{{searchKey}}</span>，共找到：<span>{{totalDataNum}}</span>条</h2>
                <el-table
                  border
                  ref="searchTable"
                  :data="searchData"
                  stripe
                  style="width: 100%"
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
                      <div class="table-title" v-on:click="jumpArticle(scope.row.id)">
                        <span :style="{color:scope.row.titlecolor?scope.row.titlecolor:''}" v-html="scope.row.title"></span>
                      </div>
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
                    v-if="(menuButtonPermit.includes('Article_edit')||menuButtonPermit.includes('Article_delete'))&&device==='desktop'"
                    :width="operationsWidth"
                    align="center"
                    fixed="right"
                    prop="operations"
                    label="操作">
                    <template #default="scope">
                      <div class="table-button">
                        <el-button size="mini" v-if="scope.row.editshow&&menuButtonPermit.includes('Article_edit')" @click="editTableRow(scope.row,scope.$index)">修改</el-button>
                        <el-button size="mini" v-if="scope.row.deleteshow&&menuButtonPermit.includes('Article_delete')" @click="deleteTableRow(scope.row,scope.$index)" type="info" plain>删除</el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
                <div v-if="totalDataNum>50" class="pagination-panel" ref="pagePane">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page"
                    :page-sizes="pageSizeList"
                    :page-size="limit"
                    :layout="device==='mobile'?'sizes, jumper':'total, sizes, prev, pager, next, jumper'"
                    :total="totalDataNum">
                  </el-pagination>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
export default {
  name: 'articleIndex',
  data() {
    return {
      scrollHeight:200,
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
      pageSizeList:[50, 100, 150, 200],
      totalDataNum:0,
      isDefault:true,
      isList:false,
      isSearch:false,
      tags:{
        systemList:[],
        customList:[],
      }
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
      this.$nextTick(function () {
        $this.scrollHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-30-25;
        // 30：page-root上下内边距；20：按钮父级上下内边距；
      });
      window.onresize = () => {
          return (() => {
            $this.scrollHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-30-25;
            // 30：page-root上下内边距；20：按钮父级上下内边距；
          })()
      };
  },
  watch: {
      scrollHeight(val) {
        if (!this.timer) {
          this.scrollHeight = val
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
    this.$nextTick(() => {
      if(this.isList){
        this.$refs.simpleTable.doLayout();
      }
      if(this.isSearch){
        this.$refs.searchTable.doLayout();
      }
    });
  },
  methods:{
    // 搜索结果点击事件
    searchResult(){
      var $this = this;
      if($this.keyword!=""){
        $this.$router.push({path:'/Article/index',query:{keyword:$this.keyword}});
      }else{
        $this.$router.push({path:'/Article/index'});
      }
    },
    // 刷新当前页面
    refreshData(){
      var $this = this;
      $this.initPage();
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
                var temp = JSON.parse(JSON.stringify(children)); // 将获得的子集json格式化
                temp.splice(index, 1); // 删除子集中已匹配项
                item.children.push(current);
                $this.convert([current], temp,$this); // 递归
            }
        });
      });
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        console.log(res,"操作权限");
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
          $this.getPostList();
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
          $this.getUserCanReadDepartUser();
        }
        $this.changePostType($this.postTypeData,$this.currentID,$this);
    },
    // 页面跳转当前选中论坛栏目
    linkTo(id){
      var $this = this;
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
    // 添加表格行数据
    addTableRow(){
      var $this = this;
      $this.$router.push({path:'/Article/addEdit'});
    },
    // 编辑表格行数据
    editTableRow(row,index){
      var $this = this;
      $this.$router.push({path:'/Article/addEdit',query:{id:row.id}});
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
    // 获取文章列表数据
    getPostList(){
      var $this = this;
      var dataParam = {};
      dataParam.page = $this.page;
      dataParam.limit = $this.limit;
      dataParam.typeid = $this.currentID;
      dataParam.tags = $this.currentTagName;
      dataParam.tagsid = $this.currentTagID;
      $this.$store.dispatch('article/postListAction',dataParam).then(res=>{
        console.log(res);
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
        console.log(res);
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
    },
    // 跳转到文章详情
    jumpArticle(id){
      var $this = this;
      $this.$router.push({path:'/Article/info',query:{id:id}});
    }
  }
}
</script>
<style lang="scss" scoped>
.card-wrap{
  &.search-content{
    h2{
      color: #111;
      span{
        margin:0;
        color: $--color-primary;
      }
    }
  }
  h2{
    width: 100%;
    text-align: center;
    border: 1px solid $border;
    font-size: 18px;
    color: $--color-primary;
    line-height: 1.2;
    padding: 15px 0;
    border-bottom:none;
    span{
      margin-left: 15px;
    }
  }
}
.table-tag{
  .el-tag{
    margin: 2px;
  }
}
.table-hit{
  span{
    color: $--color-primary;
  }
}
.table-comment{
  span{
    color: $--color-primary;
    font-weight: bold;
  }
}
.table-title{
  cursor: pointer;
  line-height:0;
  transition: all .3s;
  .svg-i{
    color: #ff4500;
    margin-right: 5px;
    vertical-align: middle;
  }
  .svg-icon{
    width: 20px;
    height: 20px;
  }
  span{
    vertical-align: middle;
    line-height: 24px;
  }
  &:hover{
    padding-left: 5px;
  }
}
.table-permit{
  .svg-i{
    cursor: pointer;
    .svg-icon{
      width: 20px;
      height: 20px;
    }
  }
}
.el-popover{
  min-width: 100px!important;
  p{
    margin: 5px;
  }
}
.post-class.mobile{
  .flex-wrap{
    display: block;
    .txt-font{
      padding: 5px;
      text-align: center;
      width: 100%;
    }
    .flex-content{
      padding: 0 2px 10px;
    }
    .border-cell+.border-cell{
      border-left:none;
    }
    .tag-panel{
      .el-button{
        margin: 2px;
      }
      .el-button+.el-button{
        margin-left:2px!important;
      }
    }
  }
}
.post-tag.mobile{
  .flex-wrap{
    display: block;
    .txt-font{
      padding: 5px;
      text-align: center;
      width: 100%;
    }
    .flex-content{
      padding: 0 2px 10px;
    }
    .border-cell+.border-cell{
      border-left:none;
    }
  }
}
.search-panel{
  width: 100%;
  display: flex;
  margin-bottom: 15px;
  .search-input{
    display: block;
    flex: 1;
  }
  .item-input{
    margin-left: 15px;
  }
}
</style>