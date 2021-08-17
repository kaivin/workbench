<template>
    <div class="page-root flex-box no-padding web-msg" ref="boxPane">
        <div class="sub-router">
            <el-scrollbar wrap-class="scrollbar-wrapper">
                <ul class="sub-router-list">
                    <li v-bind:class="currentStatus === 'All'?'active':''" v-on:click="jumpLink('All')"><span>全部</span><b>(215)</b></li>
                    <li v-bind:class="currentStatus === 'Untreated'?'active':''" v-on:click="jumpLink('Untreated')"><span>未处理</span><b>(215)</b></li>
                    <li v-bind:class="currentStatus === 'Pending'?'active':''" v-on:click="jumpLink('Pending')"><span>个人待处理</span><b>(215)</b></li>
                    <li v-bind:class="currentStatus === 'Processed'?'active':''" v-on:click="jumpLink('Processed')"><span>已处理</span><b>(215)</b></li>
                    <li v-bind:class="currentStatus === 'Starred'?'active':''" v-on:click="jumpLink('Starred')"><span>加星标</span><b>(215)</b></li>
                    <li v-bind:class="currentStatus === 'Spam'?'active':''" v-on:click="jumpLink('Spam')"><span>垃圾信息</span><b>(215)</b></li>
                    <li v-bind:class="currentStatus === 'Test'?'active':''" v-on:click="jumpLink('Test')"><span>测试数据</span><b>(215)</b></li>
                    <li v-bind:class="currentStatus === 'PromotePending'?'active':''" v-on:click="jumpLink('PromotePending')" style="margin-top:32px;"><span>推广待处理</span><b>(215)</b></li>
                    <li v-bind:class="currentStatus === 'PromoteProcessed'?'active':''" v-on:click="jumpLink('PromoteProcessed')"><span>推广已处理</span><b>(215)</b></li>
                    <li v-bind:class="currentStatus === 'Filter'?'active':''" v-on:click="jumpLink('Filter')" style="margin-top:32px;"><span>已过滤垃圾信息</span><b>(215)</b></li>
                    <li v-bind:class="currentStatus === 'Recycle'?'active':''" v-on:click="jumpLink('Recycle')" style="margin-top:32px;"><span>回收站</span><b>(215)</b></li>
                </ul>
            </el-scrollbar>
        </div>
        <div class="flex-content relative">
            <div class="abs-panel" ref="mainPane">
                <div class="scroll-panel" ref="scrollPane">
                    <el-card class="box-card scroll-card" shadow="hover">
                        <div slot="header">
                            <div class="card-header" ref="headerPane">
                                <div class="search-wrap" v-if="device==='desktop'">
                                    <div class="item-search">
                                        <el-select v-model="searchData.msgtype" size="small" clearable placeholder="请选择">
                                            <el-option
                                                v-for="item in msgTypeList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <div class="item-search">
                                        <el-select v-model="searchData.language" size="small" clearable placeholder="请选择">
                                            <el-option
                                                v-for="item in languageList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <div class="item-search">
                                        <el-select v-model="searchData.brand_id" size="small" clearable placeholder="请选择">
                                            <el-option
                                                v-for="item in brandList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <div class="item-search">
                                        <el-input
                                            style="width: 229px;"
                                            placeholder="请输入搜索关键词"
                                            v-model="searchData.keyword"
                                            size="small"
                                            clearable>
                                        </el-input>
                                    </div>
                                    <div class="item-search">
                                        <el-button class="item-input" size="small" type="primary" icon="el-icon-search" @click="searchResult">查询</el-button>
                                    </div>
                                    <div class="item-search">
                                        <el-button class="item-input" size="small" type="primary" @click="getAPIData">获取API数据</el-button>
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
                                class="SiteTable"
                                style="width: 100%"
                                :height="tableHeight"
                                row-key="id"
                                @selection-change="handleSelectionChange"
                                >
                                <el-table-column
                                    type="selection"
                                    align="center"
                                    width="48">
                                </el-table-column>
                                <el-table-column
                                    prop="id"
                                    label="类型"
                                    width="50"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="phonenumber"
                                    label="电话"
                                    min-width="160"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="departname"
                                    label="部门"
                                    width="120"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="typename"
                                    label="分类"
                                    width="90"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="othername"
                                    label="别名"
                                    min-width="120"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="user"
                                    label="负责人"
                                    min-width="160"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="sort"
                                    label="排序"
                                    width="80"
                                    >
                                </el-table-column>
                                <el-table-column
                                    v-if="(menuButtonPermit.includes('Enphone_getenphonereadrole')||menuButtonPermit.includes('Enphone_getenphonewriterole')||menuButtonPermit.includes('Enphone_getphonedomain')||menuButtonPermit.indexOf('Enphone_phoneedit')||menuButtonPermit.indexOf('Enphone_phonedelete'))&&device==='desktop'"
                                    :width="operationsWidth"
                                    align="center"
                                    fixed="right"
                                    prop="operations"
                                    label="操作">
                                    <template #default="scope">
                                    <div class="table-button">
                                        <el-button size="mini" @click="allotReadRole(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Enphone_getenphonereadrole')">分配可读角色</el-button>
                                        <el-button size="mini" @click="allotWriteRole(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Enphone_getenphonewriterole')">分配可写角色</el-button>
                                        <el-button size="mini" @click="allotDomain(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Enphone_getphonedomain')">绑定域名</el-button>
                                        <el-button size="mini" @click="editTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Enphone_phoneedit')">编辑</el-button>
                                        <el-button size="mini" @click="deleteTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Enphone_phonedelete')" type="info" plain>{{scope.row.is_delete?'激活':'禁用'}}</el-button>
                                    </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
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
                    </el-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Webmsg_allmsg',
  data() {
    return {
        currentStatus:"Untreated",
        lastDate:"",
        currentDate:"",
        status:1,
        menuButtonPermit:[],
        tableHeight:0,
        pageHeight:0,
        tableData:[],
        page:1,
        limit:50,
        pageSizeList:[50, 100, 150, 200],
        totalDataNum:0,
        brandList:[
            {label:"红星",value:1},
            {label:"中德",value:2},
            {label:"富特",value:3},
        ],
        languageList:[
            {label:"中文",value:1},
            {label:"英文",value:2},
            {label:"俄文",value:3},
            {label:"法文",value:3},
            {label:"阿拉伯语",value:3},
            {label:"西班牙语",value:3},
        ],
        msgTypeList:[
            {label:"后台留言",value:1},
            {label:"商务通留言",value:2},
            {label:"email留言",value:3},
        ],
        searchData:{
            msgtype:"",
            language:0,
            brand_id:0,
            keyword:"",
        },
        isDisabled:true,
        selectedData:[],
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
      $this.tableHeight = document.documentElement.clientHeight-$this.$refs.headerPane.offsetHeight-64-30-30-30;
      $this.pageHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-30-30-30;
    });
    window.onresize = () => {
        return (() => {
            $this.tableHeight = document.documentElement.clientHeight-$this.$refs.headerPane.offsetHeight-64-30-30-30;
            $this.pageHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-30-30-30;
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
            var $this = this;
            if($this.$route.query.Status){
                $this.currentStatus = $this.$route.query.Status;
            }else{
                $this.$message({
                    showClose: true,
                    message: "未找到对应页面或页面缺失参数",
                    type: 'error',
                    duration:6000
                });
                $this.$router.push({path:`/404?redirect=${$this.$router.currentRoute.fullPath}`});
            }
            $this.initData();
        },
    },
  created(){
    var $this = this;
    if($this.$route.query.Status){
        $this.currentStatus = $this.$route.query.Status;
    }else{
        $this.$message({
            showClose: true,
            message: "未找到对应页面或页面缺失参数",
            type: 'error',
            duration:6000
        });
        $this.$router.push({path:`/404?redirect=${$this.$router.currentRoute.fullPath}`});
    }
    $this.initData();
  },
  methods:{
    // 搜索结果
    searchResult(){
      var $this = this;
      $this.initPage();
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      var searchData = {};
      searchData.page = $this.page;
      searchData.limit = $this.limit;
      searchData.msgtype = $this.searchData.msgtype;
      searchData.language = $this.searchData.language;
      searchData.brand_id = $this.searchData.brand_id;
      searchData.keyword = $this.searchData.keyword;
      $this.$store.dispatch('webmsg/webMsgListAction', {status:$this.status}).then(response=>{
        if(response){
          if(response.status){
            $this.tableData = response.data;
            console.log(response,"留言数据");
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
        console.log(res);
        if(res.status){
          if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.menuButtonPermit.includes('Webmsg_allmsg')){
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
      this.limit = val;
      this.initData();
    },
    // 当前页改变事件
    handleCurrentChange(val) {
      this.page = val;
      this.initData();
    },
    // 页面自跳转
    jumpLink(status){
        var $this = this;
        $this.$router.push({path:'/Webmsg/allmsg',query:{Status:status}});
    },
    // 获取API数据
    getAPIData(){},
    // 表格多选改变事件
    handleSelectionChange(val) {
        var $this = this;
        $this.selectedData = val;
        if($this.selectedData.length>0){
          $this.isDisabled = false;
        }else{
          $this.isDisabled = true;
        }
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
