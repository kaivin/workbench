<template>
  <div class="page-root works-index" ref="boxPane">
    <el-card class="box-card" shadow="hover">
        <div slot="header">
            <div class="card-header" ref="headerPane">
                <div class="search-wrap" v-if="device==='desktop'">
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
                            size="small"
                            :picker-options="pickerRangeOptions">
                        </el-date-picker>
                    </div>
                    <div class="item-search" style="width: 140px;">
                      <el-select v-model="searchData.dept_id" size="small" clearable placeholder="部门">
                          <el-option
                              v-for="item in departList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                          </el-option>
                      </el-select>
                    </div>
                    <div class="item-search">
                      <el-button class="item-input" size="small" type="primary" icon="el-icon-search" @click="searchResult">查询</el-button>
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
            row-key="id">
              <el-table-column
                    prop="name"
                    label="姓名"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="depart"
                    align="left"
                    label="部门"
                    width="160"
                    >
                </el-table-column>
                <el-table-column
                    prop="departgroup"
                    align="left"
                    label="小组"
                    min-width="160"
                    >
                </el-table-column>
                <el-table-column
                    prop="waitcount"
                    label="待接单工单数"
                    width="150"
                    >
                </el-table-column>
                <el-table-column
                    prop="timeingcount"
                    label="进行中工单数"
                    width="150"
                    >
                </el-table-column>
                <el-table-column
                    prop="waitcheck"
                    label="待审核工单数"
                    width="150"
                    >
                </el-table-column>
                <el-table-column
                    prop="finishcount"
                    label="已完成工单数"
                    width="150"
                    >
                </el-table-column>
                <el-table-column
                    prop="outimecount"
                    label="已逾期工单数"
                    width="150"
                    >
                </el-table-column>
                <el-table-column
                    prop="allcount"
                    label="总工单数"
                    width="150"
                    >
                </el-table-column>
                <el-table-column
                    prop="allscorre"
                    label="总积分"
                    width="120"
                    >
                </el-table-column>
            </el-table>
        </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Works_worklist',
  data() {
    return {
      operationsWidth:"",
      menuButtonPermit:[],
      tableData:[],
      tableHeight:"auto",
      dialogForm:{
        id:0,
        name:"",
        sort:"",
        namecolor:'#17997f',
      },
      departList:[],
      searchData:{
        date:[],
        dept_id:"",
      },
      pickerRangeOptions: {
        shortcuts: [{
          text: '最近一旬',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 9);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  computed: {
    ...mapGetters([
      'device',
    ]),
  },
  mounted(){
      const $this = this;
      this.$nextTick(function () {
        if($this.device==="desktop"){
          $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-75;
        }else{
          $this.tableHeight = $this.$refs.boxPane.offsetHeight;
        }
      });
      window.onresize = () => {
          return (() => {
            if($this.device==="desktop"){
                $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-75;
            }else{
              $this.tableHeight = $this.$refs.boxPane.offsetHeight;
            }
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
    $this.initData();
  },
  updated(){
    this.$nextTick(() => {
      this.$refs.simpleTable.doLayout()
    })
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
      var $this =this;
      var searchData = $this.initSearchData();
      $this.$store.dispatch('works/workOrderStatInfoAction', searchData).then(response=>{
        if(response){
          console.log(response,"工单列表");
          if(response.status){
            $this.tableData = response.data;
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
    // 组装搜索接口所需数据
    initSearchData(){
      var $this = this;
      var searchData = {};
      if($this.searchData.date&&$this.searchData.date.length>0){
        searchData.starttime = $this.searchData.date[0];
        searchData.endtime = $this.searchData.date[1];
      }else{
        searchData.starttime = "";
        searchData.endtime = "";
      }
      searchData.dept_id = $this.searchData.dept_id?$this.searchData.dept_id:'';
      return searchData;
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
            if($this.menuButtonPermit.includes('Works_workcount')){
              $this.getDepartData();
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
    // 获取部门数据
    getDepartData(){
      var $this = this;
      $this.$store.dispatch('works/departListAction', null).then(response=>{
        if(response){
          console.log(response,"发布人数据");
          if(response.status){
            var departList = [];
            response.data.forEach(function(item,index){
              var itemData = {};
              itemData.label= item.name;
              itemData.value = item.id;
              departList.push(itemData);
            });
            $this.departList = departList;
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
    // 每页显示条数改变事件
    handleSizeChange(val) {
      this.searchData.limit = val;
      this.initPage();
    },
    // 当前页改变事件
    handleCurrentChange(val) {
      this.searchData.page = val;
      this.initPage();
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
