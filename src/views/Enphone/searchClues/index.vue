<template>
    <div class="page-root scroll-panel en-phone-search" ref="boxPane">
        <el-card class="box-card scroll-card" shadow="hover">
            <div class="card-content" ref="tableContent">
                <div class="init-style search-wrap">
                    <div class="item-search">
                        <div class="unit-search">
                            <div class="unit-title"><span>ID：</span></div>
                            <div class="unit-content">
                                <el-input
                                    size="mini"
                                    v-model="searchData.messageid"
                                    clearable>
                                </el-input>
                            </div>
                        </div>
                        <div class="unit-search">
                            <div class="unit-title"><span>客户姓名/称呼：</span></div>
                            <div class="unit-content">
                                <el-input
                                    size="mini"
                                    v-model="searchData.custormname"
                                    clearable>
                                </el-input>
                            </div>
                        </div>
                        <div class="unit-search">
                            <div class="unit-title"><span>Email：</span></div>
                            <div class="unit-content">
                                <el-input
                                    size="mini"
                                    v-model="searchData.custormemail"
                                    clearable>
                                </el-input>
                            </div>
                        </div>
                        <div class="unit-search">
                            <div class="unit-title"><span>电话：</span></div>
                            <div class="unit-content">
                                <el-input
                                    size="mini"
                                    v-model="searchData.custormphone"
                                    clearable>
                                </el-input>
                            </div>
                        </div>
                        <div class="unit-search">
                            <div class="unit-title"><span>来自IP：</span></div>
                            <div class="unit-content">
                                <el-input
                                    size="mini"
                                    v-model="searchData.ip"
                                    clearable>
                                </el-input>
                            </div>
                        </div>
                        <div class="unit-search">
                            <div class="unit-title"><span>显示条数：</span></div>
                            <div class="unit-content">
                                <el-input
                                    size="mini"
                                    v-model="searchData.limit"
                                    clearable>
                                </el-input>
                            </div>
                        </div>
                    </div>
                    <div class="item-search">
                        <div class="item-title">
                            <el-checkbox class="all-select" :indeterminate="isAllTeam" border size="mini" v-model="checkAllTeam" @change="handleCheckAllTeamChange">电话全选</el-checkbox>
                        </div>
                        <div class="unit-search">
                            <div class="unit-content">
                                <el-checkbox-group class="team-list" v-model="searchData.phoneid" @change="handleCheckedTeamChange" size="mini">
                                    <el-checkbox class="item-checkbox" v-for="item in phoneList" :label="item.value" :key="item.value" border>{{item.label}}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                    </div>
                    <div class="item-search">
                        <div class="unit-search">
                            <div class="unit-title"><span>时间：</span></div>
                            <div class="unit-content">
                                <el-date-picker
                                    v-model="searchData.date"
                                    size="mini"
                                    type="daterange"
                                    align="right"
                                    value-format = "yyyy-MM-dd"
                                    unlink-panels
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :picker-options="pickerRangeOptions">
                                </el-date-picker>
                            </div>
                        </div>
                        <div class="unit-search">
                            <div class="unit-title"><span>时段：</span></div>
                            <div class="unit-content">
                                <el-select v-model="searchData.timeing" clearable placeholder="时段" size="mini">
                                    <el-option
                                        v-for="item in timeList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="unit-search">
                            <div class="unit-title"><span>渠道：</span></div>
                            <div class="unit-content">
                                <el-select v-model="searchData.mode" clearable placeholder="渠道" size="mini">
                                    <el-option
                                        v-for="item in sourceList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="unit-search">
                            <div class="unit-title"><span>设备：</span></div>
                            <div class="unit-content">
                                <el-select v-model="searchData.device" clearable placeholder="设备" size="mini">
                                    <el-option
                                        v-for="item in deviceList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                    <div class="item-search">
                        <div class="unit-search">
                            <div class="unit-title"><span>产品分类：</span></div>
                            <div class="unit-content">
                                <el-select v-model="searchData.producttype_id" clearable placeholder="产品分类" size="mini">
                                    <el-option
                                        v-for="item in cateList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="unit-search">
                            <div class="unit-title"><span>产品：</span></div>
                            <div class="unit-content">
                                <el-select v-model="searchData.productid" clearable placeholder="产品" size="mini">
                                    <el-option
                                        v-for="item in productList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="unit-search">
                            <div class="unit-title"><span>反馈：</span></div>
                            <div class="unit-content">
                                <el-select v-model="searchData.feedback" clearable placeholder="反馈" size="mini">
                                    <el-option
                                        v-for="item in feedbackList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="unit-search">
                            <div class="unit-title"><span>级别：</span></div>
                            <div class="unit-content">
                                <el-select v-model="searchData.level_id" clearable placeholder="首次级别" size="mini">
                                    <el-option
                                        v-for="item in levelList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="unit-search">
                            <div class="unit-title"><span>异常：</span></div>
                            <div class="unit-content">
                                <el-select v-model="searchData.erroring" clearable placeholder="异常" size="mini">
                                    <el-option
                                        v-for="item in errorList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                    <div class="item-search">
                        <div class="unit-search">
                            <div class="unit-title"><span>国家：</span></div>
                            <div class="unit-content">
                                <el-input
                                    size="mini"
                                    v-model="searchData.country"
                                    clearable>
                                </el-input>
                            </div>
                        </div>
                        <div class="unit-search">
                            <div class="unit-title"><span>备注：</span></div>
                            <div class="unit-content">
                                <el-input
                                    size="mini"
                                    v-model="searchData.anymessage"
                                    clearable>
                                </el-input>
                            </div>
                        </div>
                        <div class="unit-search">
                            <div class="unit-title"><span>域名：</span></div>
                            <div class="unit-content">
                                <el-input
                                    size="mini"
                                    v-model="searchData.domain"
                                    clearable>
                                </el-input>
                            </div>
                        </div>
                        <div class="unit-search">
                            <div class="unit-title"><span>URL：</span></div>
                            <div class="unit-content">
                                <el-input
                                    size="mini"
                                    v-model="searchData.url"
                                    clearable>
                                </el-input>
                            </div>
                        </div>
                        <div class="unit-search">
                            <div class="unit-content">
                                <el-checkbox class="item-checkbox" :label="searchData.is_url" size="mini" border>精确</el-checkbox>
                            </div>
                        </div>
                        <div class="unit-search">
                            <div class="unit-content">
                                <el-checkbox class="item-checkbox" :label="searchData.effective" size="mini" border>只显示有效</el-checkbox>
                            </div>
                        </div>
                        <div class="unit-search">
                            <div class="unit-content">
                                <el-checkbox class="item-checkbox" :label="searchData.is_adduser" size="mini" border>只显示我添加的（客服）</el-checkbox>
                            </div>
                        </div>
                    </div>
                    <div class="item-search group-search">
                        <div class="unit-search">
                            <div class="unit-content">
                                <el-checkbox class="item-checkbox" :label="searchData.is_group" size="mini" border>分组</el-checkbox>
                            </div>
                        </div>
                        <div class="unit-search">
                            <div class="unit-content">
                                <el-radio-group class="team-list" v-model="searchData.groupurlproduct" size="mini">
                                    <el-radio class="item-radio" label="1" border>按URL</el-radio>
                                    <el-radio class="item-radio" label="2" border>按产品</el-radio>
                                    <el-radio class="item-radio" label="3" border>按国家</el-radio>
                                    <el-radio class="item-radio" label="4" border>按大洲</el-radio>
                                    <el-radio class="item-radio" label="5" border>按组别</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                        <div class="unit-search">
                            <div class="unit-title"><span>排序：</span></div>
                            <div class="unit-content">
                                <el-radio-group class="team-list" v-model="searchData.sort" size="mini">
                                    <el-radio class="item-radio" label="desc" border>升序</el-radio>
                                    <el-radio class="item-radio" label="asc" border>降序</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                    </div>
                    <div class="item-search button-search">
                        <el-button type="primary" class="updateBtn" size="small" v-if="menuButtonPermit.includes('Enphone_search')" v-on:click="enCluesSearchData"><i class="svg-i" ><svg-icon icon-class="planeWhite" /></i>生成数据</el-button>
                        <el-button type="info" class="resetBtn" size="small" v-on:click="resetData()">重置</el-button>
                    </div>
                </div>
                <div class="init-style result-wrap"></div>
            </div>
        </el-card>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'searchEnClues',
  data() {
    return {
        menuButtonPermit:[],
        tableHeight:0,
        tableData:[],
        searchData:{
            date:[],
            page:1,
            limit:20,
            messageid:"",
            custormname:"",
            custormemail:"",
            custormphone:"",
            ip:"",
            phoneid:[],
            timeing:"",
            device:"",
            mode:"",
            producttype_id:"",
            productid:"",
            feedback:"",
            level_id:"",
            erroring:"",
            country:"",
            anymessage:"",
            domain:"",
            url:"",
            is_url:false,
            effective:false,
            is_adduser:false,
            is_group:false,
            groupurlproduct:"1",
            sort:"desc",
        },
        pageSizeList:[20],
        totalDataNum:0,
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
        phoneList:[],
        cateList:[],
        levelList:[],
        sourceList:[],
        productList:[],
        isAllTeam:false,
        checkAllTeam:false,
        deviceList:[
            {label:"PC设备",value:"PC设备"},
            {label:"移动设备",value:"移动设备"},
            {label:"未知设备",value:"未知设备"},
        ],
        timeList:[
            {label:"0-3",value:"0-3"},
            {label:"3-6",value:"3-6"},
            {label:"6-9",value:"6-9"},
            {label:"9-12",value:"9-12"},
            {label:"12-15",value:"12-15"},
            {label:"15-18",value:"15-18"},
            {label:"18-21",value:"18-21"},
            {label:"21-24",value:"21-24"},
        ],
        effectiveList:[
            {label:"只显示有效",value:1},
            {label:"只显示无效",value:2},
        ],
        feedbackList:[
            {label:"已反馈",value:1},
            {label:"未反馈",value:2},
            {label:"意向客户",value:3},
            {label:"非意向客户",value:4},
        ],
        errorList:[
            {label:"1.信息全但联系不上",value:"1.信息全但联系不上"},
            {label:"2.信息全但客户不需要",value:"2.信息全但客户不需要"},
            {label:"3.找工作",value:"3.找工作"},
            {label:"4.找投资",value:"4.找投资"},
            {label:"5.产量过小",value:"5.产量过小"},
            {label:"6.联系方式错误",value:"6.联系方式错误"},
        ],
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
      $this.tableHeight = $this.$refs.boxPane.offsetHeight-30;
    });
    window.onresize = () => {
        return (() => {
            $this.tableHeight = $this.$refs.boxPane.offsetHeight-30;
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
  methods:{
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.$store.dispatch('enphone/cluesSearchSelectDataAction', null).then(response=>{
        if(response){
          if(response.status){
              console.log(response,"搜索条件数据")
              var phoneList = [];
              response.phone.forEach(function(item,index){
                  var itemData = {};
                  itemData.label = item.phonenumber;
                  itemData.value = item.id;
                  phoneList.push(itemData);
              });
              $this.phoneList = phoneList;
              var levelList = [];
              response.xunlevel.forEach(function(item,index){
                  var itemData = {};
                  itemData.label = item.levelname;
                  itemData.value = item.id;
                  levelList.push(itemData);
              });
              $this.levelList = levelList;
              var sourceList = [];
              response.sourcetype.forEach(function(item,index){
                  var itemData = {};
                  itemData.label = item.name;
                  itemData.value = item.id;
                  sourceList.push(itemData);
              });
              $this.sourceList = sourceList;
              var cateList = [];
              response.producttype.forEach(function(item,index){
                  var itemData = {};
                  itemData.label = item.name;
                  itemData.value = item.id;
                  cateList.push(itemData);
              });
              $this.cateList = cateList;
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
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.status){
          if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.menuButtonPermit.includes('Enphone_phoneindex')&&$this.menuButtonPermit.includes('Enphone_search')){
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
    // 搜索数据
    searchResult(){
        var $this = this;
        var searchData = {};
        $this.$store.dispatch('enphone/getCurrentCluesSearchListAction', searchData).then(response=>{
            if(response){
                if(response.status){
                    console.log(response,"搜索结果数据")
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
    // 小组全选
    handleCheckAllTeamChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.phoneList.forEach(function(item,index){
          checkedList.push(item.value);
        });
        $this.searchData.phoneid = checkedList;
        $this.checkAllTeam= true;
      }else{
        $this.searchData.phoneid = [];
        $this.checkAllTeam = false;
      }
      $this.isAllTeam = false;
    },
    // 小组选择改变事件
    handleCheckedTeamChange(e){
      var $this = this;
      var checkedCount = e.length;
       if(checkedCount === $this.phoneList.length){
          $this.checkAllTeam = true;
        }else{
          $this.checkAllTeam = false;
        }
        if(checkedCount>0&&checkedCount<$this.phoneList.length){
          $this.isAllTeam = true;
        }else{
          $this.isAllTeam = false;
        }
    },
    // 组装搜索需要的条件数据
    getSearchResultData(){
        var $this = this;
        var resultData = {};
        resultData.page = $this.searchData.page;
        resultData.limit = $this.searchData.limit;
        resultData.messageid = $this.searchData.messageid;
        resultData.custormname = $this.searchData.custormname;
        resultData.custormemail = $this.searchData.custormemail;
        resultData.custormphone = $this.searchData.custormphone;
        resultData.ip = $this.searchData.ip;
        resultData.phoneid = $this.searchData.phoneid;
        resultData.country = $this.searchData.country;
        resultData.mode = $this.searchData.mode;
        resultData.producttype_id = $this.searchData.producttype_id;
        resultData.timeing = $this.searchData.timeing;
        resultData.erroring = $this.searchData.erroring;
        resultData.productid = $this.searchData.productid;
        resultData.level_id = $this.searchData.level_id;
        resultData.anymessage = $this.searchData.anymessage;
        resultData.domain = $this.searchData.domain;
        resultData.is_adduser = $this.searchData.is_adduser?1:0;
        resultData.url = $this.searchData.url;
        resultData.is_url = $this.searchData.is_url?1:0;
        resultData.effective = $this.searchData.effective?1:0;
        resultData.is_group = $this.searchData.is_group?1:0;
        resultData.groupurlproduct = $this.searchData.groupurlproduct;
        resultData.device = $this.searchData.device;
        resultData.sort = $this.searchData.sort;
        resultData.feedback = $this.searchData.feedback;
        if($this.searchData.date&&$this.searchData.date.length>0){
            resultData.starttime = $this.searchData.date[0];
            resultData.endtime = $this.searchData.date[1];
        }else{
            resultData.starttime = "";
            resultData.endtime = "";
        }
        return resultData;
    },
    // 搜索确认
    enCluesSearchData(){
        var $this = this;
        var resultData = $this.getSearchResultData();
        console.log(resultData,"搜索条件");
        $this.$store.dispatch('enphone/getCurrentCluesSearchListAction', resultData).then(response=>{
        if(response){
          if(response.status){
              console.log(response,"搜索条件数据")
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
    // 重置表单
    resetData(){
        var $this = this;
        $this.searchData.date=[];
        $this.searchData.page=1;
        $this.searchData.limit=20;
        $this.searchData.messageid="";
        $this.searchData.custormname="";
        $this.searchData.custormemail="";
        $this.searchData.custormphone="";
        $this.searchData.ip="";
        $this.searchData.phoneid=[];
        $this.searchData.timeing="";
        $this.searchData.device="";
        $this.searchData.mode="";
        $this.searchData.producttype_id="";
        $this.searchData.productid="";
        $this.searchData.feedback="";
        $this.searchData.level_id="";
        $this.searchData.erroring="";
        $this.searchData.country="";
        $this.searchData.anymessage="";
        $this.searchData.domain="";
        $this.searchData.url="";
        $this.searchData.is_url=false;
        $this.searchData.effective=false;
        $this.searchData.is_adduser=false;
        $this.searchData.is_group=false;
        $this.searchData.groupurlproduct="1";
        $this.searchData.sort="desc";
        $this.isAllTeam=false;
        $this.checkAllTeam=false;
        $this.pageSizeList=[20];
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
