
<template>
    <div class="page-root en-phone" ref="boxPane">
        <el-card class="box-card scroll-card" shadow="hover">
            <div slot="header">
                <div class="card-header" ref="headerPane">
                    <div class="search-wrap" v-if="device==='desktop'">
                        <div class="item-search">
                            <span>属性：</span>
                            <el-radio v-for="(item,index) in statusList" size="small" v-bind:key="index" v-model="status" :label="item.value">{{item.label}}</el-radio>
                        </div>
                        <div class="item-search">
                            <el-button class="item-input" size="small" type="primary" icon="el-icon-search" @click="searchResult">查询</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-content" ref="tableContent">
                <el-table
                    border
                    ref="simpleTable"
                    :data="tableData"
                    :height="pageHeight<=tableHeight?tableHeight:false"
                    tooltip-effect="dark"
                    stripe
                    class="SiteTable"
                    :class="pageHeight<=tableHeight?'table-border':''"
                    style="width: 100%;text-align:center"
                    row-key="id"
                    >
                    <el-table-column
                        prop="id"
                        label="业务员ID"
                        width="90"
                        text-align='center'
                        >
                    </el-table-column>
                    <el-table-column
                        prop="depart"
                        label="部门"
                        width="80"
                        text-align='center'
                        >
                    </el-table-column>
                    <el-table-column
                        prop="departgroup"
                        label="小组"
                        width="80"
                        text-align='center'
                        >
                    </el-table-column>
                    <el-table-column
                        prop="permit"
                        label="权限"
                        width="90"
                        text-align='center'
                        >
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="姓名"
                        width="100"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="allcount"
                        label="询盘总数"
                        width="100"
                        >
                        <template slot-scope="scope">
                            <div class="table-text">
                                <p><b style="color:#379bff">{{scope.row.allcount}}</b></p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="countnodeal"
                        label="未处理询盘数"
                        width="110"
                        >
                        <template slot-scope="scope">
                            <div class="table-text">
                                <p><b style="color:#ed475e">{{scope.row.countnodeal}}</b></p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="countnoread"
                        :label="lastDate+'未反馈数'"
                        width="140"
                        >
                        <template slot-scope="scope">
                            <div class="table-text">
                                <p><b style="color:#f37220">{{scope.row.nofeedcount}}</b></p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="noftwordcount"
                        :label="lastDate+'未填富通'"
                        width="140"
                        >
                        <template slot-scope="scope">
                            <div class="table-text">
                                <p><b style="color:#8e4d22">{{scope.row.noftwordcount}}</b></p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="nofeednowcount"
                        :label="currentDate+'未反馈数'"
                        width="150"
                        >
                        <template slot-scope="scope">
                            <div class="table-text">
                                <p><b style="color:#7d6c15">{{scope.row.nofeednowcount}}</b></p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="noftwordnowcount"
                        :label="currentDate+'未填富通'"
                        width="150"
                        >
                        <template slot-scope="scope">
                            <div class="table-text">
                                <p><b style="color:#848c1c">{{scope.row.noftwordnowcount}}</b></p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="allotcount"
                        label="近2日分配询盘数"
                        width="140"
                        >
                        <template slot-scope="scope">
                            <div class="table-text">
                                <p><b style="color:#349b1e">{{scope.row.allotcount}}</b></p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="countnoread"
                        label="未读询盘数"
                        width="100"
                        >
                        <template slot-scope="scope">
                            <div class="table-text">
                                <p><b style="color:#791ca2">{{scope.row.countnoread}}</b></p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="countwarn"
                        label="提醒未处理"
                        width="100"
                        >
                        <template slot-scope="scope">
                            <div class="table-text">
                                <p><b style="color:#6bd416">{{scope.row.countwarn}}</b></p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="login_time"
                        label="上次登录时间"
                        min-width="160"
                        >
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Sales_phonecount',
  data() {
    return {
        lastDate:"",
        currentDate:"",
        status:1,
        menuButtonPermit:[],
        tableHeight:0,
        pageHeight:0,
        tableData:[],
        statusList:[
            {label:"所有",value:1},
            {label:"有效的（在职）",value:2},
            {label:"无效的（离职）",value:3},
            {label:"分配层的（其他）",value:4},
        ]
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
  },
  created(){
    var $this = this;
    $this.getCurrentDate()
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
      $this.$store.dispatch('Sales/getSalesSalesmanDataAction', {status:$this.status}).then(response=>{
        if(response){
          if(response.status){
            $this.tableData = response.data;
            console.log(response,"业务员数据统计");
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
            if($this.menuButtonPermit.includes('Sales_phonecount')){
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
    // 获取当前月份
    getCurrentDate(){
      var nowDate = new Date();
      const date = {
        year: nowDate.getFullYear(),
        month: nowDate.getMonth()+1,
        date: nowDate.getDate(),
      }
      const lastMonth = nowDate.getMonth()>10?nowDate.getMonth():'0'+nowDate.getMonth();
      const newmonth = date.month>10?date.month:'0'+date.month;
      const day = date.date>10?date.date:'0'+date.date;
      const lastDate = "("+lastMonth+"-16 到 "+newmonth+"-16)";
      const currentDate = "("+date.year+"-"+newmonth+"-16 至今)";
      this.lastDate = lastDate;
      this.currentDate = currentDate;
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
