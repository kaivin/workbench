<template>
  <div class="page-root scroll-panel personAnalysis" ref="boxPane">
        <div class="memberTopTab">
            <div class="chooseDepart flex-box">
                  <span class="choosetit">部门：</span>
                  <div class="departList">
                       <span v-bind:class="departAll?'active':''" v-on:click="departChangeAll">全部</span>                       
                       <span v-bind:class="item.isOn?'active':''" v-for="(item,index) in department" :key="index" v-on:click="departChange(item.id)">{{item.name}}</span>
                  </div>
                  <span class="choosetit" style="margin-left:20px">时间：</span>
                  <div class="departItems">
                      <el-date-picker
                        v-model="searchData.data"
                        @change="handleData"
                        type="monthrange"
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        key="b"
                        size="mini"
                        class="date-range"
                        range-separator="～"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerMonthRangeOptions">
                      </el-date-picker>
                  </div>
                  <span class="choosetit" style="margin-left:20px">入职时间：</span>
                  <div class="departList">
                      <span v-bind:class="item.isOn?'active':''" v-for="(item,index) in ustatusList" :key="index" v-on:click="inTimePlug(item.id)">{{item.name}}</span>
                  </div>
                  <i class="departItemBtn" v-on:click="departItemBtn">重置</i>
            </div>
        </div>
      <div class="flex-content dealRankMain" :class="searchData.dept_id==''?'':'active'">
            <award-rank
              :RankData="tableDate"
              :defaultTagData="defaultTag"
              :lang="ch"
            ></award-rank>
      </div>
  </div>
</template>
<script>
import AwardRank from "../../components/memberCompare/AwardRank";
import {sortByDesc} from "@/utils/index";
import { mapGetters } from 'vuex';
export default {
  name: "cnMemberAnalysis",
  data() {
    return {
      department:[],//部门列表
      departAll:false,
      tableDate:[],
      defaultTime:[],
      defaultTag:'当月数据',
      isAwardBool:false,
      ch:'ch',
      searchData:{
        id:'',
        data:[],
        dept_id:[],
        ustatus:'',
      },
      ustatusList:[
        {id:0,name:"全部",isOn:true},
        {id:1,name:"试用期",isOn:false},
        {id:2,name:"一年/一年内",isOn:false},
        {id:3,name:"一年以上",isOn:false}
      ],
      scoretime:'',
      moneytime: '',
      Inquirytime: '',
      Paytime: '',
      pickerMonthRangeOptions: {
        shortcuts: [{
          text: '今年至今',
          onClick(picker) {
            const end = new Date();
            const start = new Date(new Date().getFullYear(), 0);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 6);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    };
  },
  computed: {
    ...mapGetters([
      'sidebar',
    ]),
    monthTime(){
        return new Date().getMonth() + 1;
    }
  },
  components:{
    AwardRank,
  },
  created() {
    var $this = this;
    $this.getNearMonth();
    $this.getUserMenuButtonPermit();
  },
  mounted(){
    const $this = this;
    if(!$this.sidebar.opened){
      $this.$store.dispatch('app/toggleSideBar');
    }
  },
  methods: {
    //获取部门信息
    getCnDepartList(){
      var $this = this;
      $this.$store.dispatch("api/getCnDepartAction").then((res) => {
          if (res) {
            if (res.status) {
                if(res.data&&res.data.length>0){
                    var department=[];
                    res.data.forEach(function(item,index){
                        var objItem={};
                        objItem.name=item.name;
                        objItem.id=item.id;
                        objItem.isOn=false;
                        department.push(objItem);
                    });
                    $this.department=department;
                }
            } else {
              $this.$message({
                showClose: true,
                message: response.info,
                type: "error",
                duration: 6000
              });
            }
          }
      });
    },
    // 清除搜索数据
    departItemBtn(){
        var $this=this;
        $this.departAll=false;
        $this.department.forEach(function(item,index){
            item.isOn=false;
        });
        $this.searchData.dept_id=[];
        $this.ustatusList.forEach(function(item,index){
            item.isOn=false;
            if(item.id==0){
              item.isOn=true;
            }
        });
        $this.searchData.ustatus='';
        $this.getNearMonth();
        $this.GetInquiryResult();
    },
    // 点击获取全部部门ID
    departChangeAll(){
        var $this=this;
        var dept_id=[];
        var department=$this.department;
        $this.departAll=!$this.departAll;
        if($this.departAll){
          department.forEach(function(item,index){
            item.isOn=true;
            dept_id.push(item.id);
          });
        }else{
          department.forEach(function(item,index){
            item.isOn=false
          });
        }
        $this.searchData.dept_id=dept_id;
        $this.department=department;
        $this.GetInquiryResult();
    },
    // 点击部门获取部门ID
    departChange(valData){
        var $this=this;
        var dept_id=[];
        var department=$this.department;
        if($this.departAll){
          $this.departAll=false;
          department.forEach(function(item,index){
              if(item.id==valData){
                item.isOn=!item.isOn;
              }
              if(item.isOn){
                dept_id.push(item.id)
              }
          });
        }else{
          department.forEach(function(item,index){
              if(item.id==valData){
                item.isOn=!item.isOn;
              }
              if(item.isOn){
                dept_id.push(item.id)
              }
          });
          if(dept_id.length==department.length){
            $this.departAll=true;
          }
        }
        $this.searchData.dept_id=dept_id;
        $this.department=department;
        $this.GetInquiryResult();
    },
    // 点击入职时间ID
    inTimePlug(valData){
        var $this=this;  
        if(valData!=0){
          $this.searchData.ustatus=valData;
        }else{
          $this.searchData.ustatus='';
        }    
        var ustatusList=$this.ustatusList;
        ustatusList.forEach(function(item,index){
            item.isOn=false;
              if(item.id==valData){
                item.isOn=true;
              }
        });
        $this.ustatusList=ustatusList;
        $this.GetInquiryResult();
    },
    //点击时间搜索
    handleData(){
      var $this=this;
      $this.GetInquiryResult();
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.data.length>0){
          var permitData = [];
          res.data.forEach(function(item,index){
            permitData.push(item.action_route);
          });
          if(permitData.includes('Api_chinapersoncountdefault')){
            $this.initData()
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
      });
    },
    // 初始化数据
    initData() {
      var $this = this;
      $this.getCnDepartList();
      $this.GetInquiryResult();  
    },
    //重组搜索数据
    initsearch(){
      var $this = this;
      var searchData={};
      if($this.searchData.dept_id&&$this.searchData.dept_id.length>0){
        searchData.dept_id=$this.searchData.dept_id;
      }
      if($this.searchData.data&&$this.searchData.data.length>0){
        searchData.starttime=$this.searchData.data[0];
        searchData.endtime=$this.searchData.data[1];
        var timeOne= $this.searchData.data.toString();
        var timeTwo= $this.defaultTime.toString();
        if(timeOne==timeTwo){
          $this.defaultTag='当月数据';
        }else{
          $this.defaultTag=$this.searchData.data[0]+' ~ '+$this.searchData.data[1]+'数据';
        }
      }else{
        $this.defaultTag='当月数据';
      }
      if($this.searchData.ustatus&&$this.searchData.ustatus!=''){
        searchData.ustatus=$this.searchData.ustatus;
      }
      console.log(searchData,'searchData')
      return searchData;
    },
    // 清空数据
    emptyData(){
        var $this=this;
        $this.tableDate=[];
    },
    // 获取中文询盘、成交等情况
    GetInquiryResult(){
      var $this = this;
      var searchData={};
      searchData=$this.initsearch();
      $this.emptyData();
      $this.$store.dispatch("memberCompare/getChinapersoncountdefaultAction",searchData).then((response) => {
          if (response) {
            if (response.status) {
              var tableDate=[];
              if(response.monthselectuser&&response.monthselectuser.length>0){
                response.monthselectuser.forEach(function(item){
                  var itemObj={};
                  itemObj.id=item.id;
                  itemObj.name=item.name;
                  itemObj.dept_id=item.dept_id;
                  if(item.postionname==''||item.postionname==null){
                      itemObj.postionname='普通';
                  }else{
                      itemObj.postionname=item.postionname;
                  }
                  itemObj.todaynumber=item.todayxunnumber;
                  itemObj.yesterdaynumber=item.lastdayxunnumber;
                  itemObj.departname=item.departname;
                  itemObj.comtime=item.comtime;
                  itemObj.comtimeShow=$this.dateCompare(item.comtime);
                  itemObj.monthnumber=item.number;
                  itemObj.monthscore=item.score;
                  itemObj.monthallmoney=item.allmoney;
                  itemObj.monthAnumber=item.Anumber;
                  if(response.yearuser&&response.yearuser.length>0){
                    response.yearuser.forEach(function(items){
                      if(item.id==items.id){
                          itemObj.yearnumber=items.number;
                          itemObj.ranknumber=items.number;
                          itemObj.yearAvgnumber=(items.number/$this.monthTime).toFixed(2)*1
                          itemObj.yearscore=items.score;
                          itemObj.yearallmoney=items.allmoney;
                          itemObj.yearAnumber=items.Anumber;
                      }
                    });
                  }
                  tableDate.push(itemObj);
                });
              }              
              tableDate.sort(sortByDesc("monthnumber"));
              $this.tableDate=tableDate;
            } else {
              $this.$message({
                showClose: true,
                message: response.info,
                type: "error",
                duration: 6000
              });
              $this.$router.push({path: `/login?redirect=${$this.$router.currentRoute.fullPath}`})
            }
          }
      });
    },
    
    // 时间对比数据封装函数
    dateCompare(dataArr){
      var $this = this;
      var InTime = new Date(dataArr);
      var InTimeYear = InTime.getFullYear();
      var InTimeMonth = InTime.getMonth() + 4;
      if(InTimeMonth>12){
        InTimeYear++
        InTimeMonth=InTimeMonth-12;
      }
      InTimeMonth = InTimeMonth<10?'0'+InTimeMonth:InTimeMonth;                  
      var InTimeday = InTime.getDate();
      //转正时间
      var PositiveTime=parseInt(InTimeYear.toString()+InTimeMonth.toString()+InTimeday.toString());
      //当前时间
      var myDate = new Date();
      var myDateyear = myDate.getFullYear();
      var myDatemon = myDate.getMonth() + 1;
      myDatemon = myDatemon<10?'0'+myDatemon:myDatemon; 
      var myDatedate = myDate.getDate();
      var currentTime=parseInt(myDateyear.toString()+myDatemon.toString()+myDatedate.toString());
      var timeBool=true;
      if (PositiveTime > currentTime){
        timeBool=false
      }
      return timeBool;
    },
    //默认时间周期
    getNearMonth(){
      var $this=this;
      var end = new Date();
      var endYear = end.getFullYear();
      var endMonth = end.getMonth() + 1;
      endMonth = endMonth<10?'0'+endMonth:endMonth;
      var endDate = endYear+"-"+endMonth;
      $this.searchData.data=[endDate,endDate];
      $this.searchData.starttime=endDate;
      $this.searchData.endtime=endDate;
      $this.defaultTime=[endDate,endDate];
    },
  }
}


</script>



