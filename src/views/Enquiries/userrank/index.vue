<template>
  <div class="page-root scroll-panel personAnalysis" ref="boxPane">
        <div class="memberTopTab" v-if="isTab">
            <div class="chooseDepart flex-box">
                  <span class="choosetit">部门：</span>
                  <div class="departList">
                      <span v-bind:class="item.isOn?'active':''" v-for="(item,index) in deptList" :key="index" v-on:click="departChange(item.value)">{{item.label}}</span>
                  </div>
                  <i class="departItemBtn" v-on:click="departItemBtn">重置</i>
            </div>
        </div>
      <div class="EnquirieGrades flex-box">
        <template v-for="item in tableDate">
            <enquirif-grade
              :RankData="item"
            ></enquirif-grade>
        </template>
      </div>
  </div>
</template>
<script>
import {getDepartList,Userrank} from '@/api/Enquiries';
import EnquirifGrade from "../components/EnquirifGrade";
import { mapGetters } from 'vuex';
export default {
  name: "Enquiries_userrank",
  data() {
    return {
      dept:[],
      menuButtonPermit:[],
      defaultDeptList:[],
      deptList:[],
      tableDate:[],
      searchData:{
        dept:14
      },
      isTab:false
    };
  },
  computed: {
    ...mapGetters([
      'sidebar',
    ]),
  },
  components:{
    EnquirifGrade,
  },
  created() {
    var $this = this;
    $this.getUserMenuButtonPermit();
  },
  mounted(){
    const $this = this;
    if(!$this.sidebar.opened){
      $this.$store.dispatch('app/toggleSideBar');
    }
  },
  methods: {
    // 获取部门列表
    getDeptList(){
      var $this = this;
      getDepartList().then(res=>{
        if(res){
          if(res.status){
            if(res.data.length>0){
                var defaultDeptList = [];
                res.data.forEach(function(item,index){
                  var itemData = {};
                  itemData.value = item.id;
                  itemData.label = item.name;
                  itemData.isOn=false;
                  if(item.id==14){
                      itemData.isOn=true;
                  }
                  defaultDeptList.push(itemData);
                });
                $this.defaultDeptList = defaultDeptList;
            }
            $this.GetInquiryResult(); 
          }else{
              $this.$message({
                showClose: true,
                message: res.info,
                type: 'error'
              });
          }
        }
      });
    },
    // 清除搜索数据
    departItemBtn(){
        var $this=this;
        $this.deptList.forEach(function(item,index){
            item.isOn=false;
        });
        $this.searchData.dept='';
        $this.GetInquiryResult();
    },
    // 点击部门获取部门ID    
    departChange(valData){
        var $this = this;
        var defaultDeptList=$this.defaultDeptList;
        defaultDeptList.forEach(function(item,index){
            item.isOn=false;
            if(item.value==valData){
                item.isOn=true;
            }
        });
        $this.searchData.dept=valData;
        $this.defaultDeptList=defaultDeptList;
        $this.GetInquiryResult();
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
          if($this.menuButtonPermit.includes('Enquiries_userrank')){
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
      $this.getDeptList(); 
    },
    //重组搜索数据
    initsearch(){
      var $this = this;
      var searchData={};
      if($this.searchData.dept&&$this.searchData.dept!=''){
        searchData.dept=$this.searchData.dept;
      }
      return searchData;
    },
    // 清空数据
    emptyData(){
        var $this=this;
        $this.newDate=[];
        $this.oldDate=[];
    },
    // 获取中文询盘、成交等情况
    GetInquiryResult(){
      var $this = this;
      var searchData={};
      searchData=$this.initsearch();
      $this.emptyData();      
      Userrank(searchData).then((res) => {
          if (res) {
            if (res.status) {
              if(res.dept.length>1){
                  var deptList=[];
                  $this.dept=res.dept;
                  $this.defaultDeptList.forEach(function(item,index){
                    res.dept.forEach(function(items,index){
                      if(item.value==items){
                        deptList.push(item);
                      }
                    });
                  })
                  $this.deptList=deptList;
                  $this.isTab=true;
              }
              var newHeader=[];
              if(res.newuser.length>0){
                res.newuser.forEach(function(item,index){
                  if(index==0){
                    newHeader.push(item.threemonth+' ('+item.threeuser+'人)');
                    newHeader.push(item.twomonth+' ('+item.twouser+'人)');
                    newHeader.push(item.month+' ('+item.nowuser+'人)');
                  }
                });
              }
              var oldHeader=[];
              if(res.olduser.length>0){
                res.olduser.forEach(function(item,index){
                  if(index==0){
                    oldHeader.push(item.threemonth+' ('+item.threeuser+'人)');
                    oldHeader.push(item.twomonth+' ('+item.twouser+'人)');
                    oldHeader.push(item.month+' ('+item.nowuser+'人)');
                  }
                });
              }
              var tableDate=[];
              if(res.newuser.length>0){
                var itemObj={}
                itemObj.isOld=1;
                itemObj.itemData=res.newuser;
                itemObj.tableHeader=newHeader;
                tableDate.push(itemObj);
              }
              if(res.olduser.length>0){
                var itemObj={}
                itemObj.isOld=2;
                itemObj.itemData=res.olduser;
                itemObj.tableHeader=oldHeader;
                tableDate.push(itemObj);
              }
              $this.tableDate=tableDate;
            } else {
              $this.$message({
                showClose: true,
                message: res.info,
                type: "error",
                duration: 6000
              });
              $this.$router.push({path: `/login?redirect=${$this.$router.currentRoute.fullPath}`})
            }
          }
      });
    },
  }
}
</script>