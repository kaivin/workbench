<template>
  <div class="page-root scroll-panel personAnalysis" ref="boxPane">
      <div class="personTopTab">
           <div class="chooseDepart flex-box">
                <span class="choosetit">添加对比：</span>
                <div class="departItems flex-content">
                  <span v-bind:class="item.isOn?'active':''" v-for="(item,index) in department" :key="index" v-on:click="departChange(item.id)">{{item.name}}</span>
                  <p class="departItemsYear">                
                      <span @click="changeType(1)" class="btn-item" :class="type == 1?'hover':''">{{prevYear}}年</span>
                      <span @click="changeType(2)" class="btn-item" :class="type == 2?'hover':''">{{nowYear}}年</span>
                  </p>
                </div>
           </div>
           <div class="multiSelect">
                <div class="departItems">
                    <p class="item-checkbox" v-bind:class="item.isOn?'active':''" v-for="(item,index) in choosePerson" :key="index" v-on:click="PersonChange(item.id)"><i></i><span>{{item.name}}</span></p>
                </div>
           </div>
      </div>      
      <div class="compareWho">
          <div class="compareWhoItem" v-for="(item,index) in comapreuser" :key='index'>
              <div class="user_img">
                  <img :src="item.headimg" alt="" />
              </div>
              <div class="user_name">
                  <h4>{{item.name}}</h4>
                  <p>{{item.depart}}</p>
              </div>
              <span class="delIt" v-on:click="handlePerson(parseInt(item.id))"><svg-icon icon-class="error" /></span>
          </div>
      </div>
      <template v-if="defaultChartData.length>0" v-for="item in defaultChartData">
        <default-chart :item-data="item"></default-chart>
      </template>
  </div>
</template>
<script>
import defaultChart from "../../components/memberDetail/defaultChart.vue";
import {numSeparate} from "@/utils/index";
import { mapGetters } from 'vuex';
export default {
  name: "cnComparePerson",
  data() {
    return {
        department:[],//部门列表
        choosePerson:[], //组员列表
        deptArr:[],
        teamArr:[],
        defaultChartData:[],//趋势数据
        comapreuser:[],//对比用户
        searchData:{
            dept_id:'',
            id:'',
        },
        type: 2,//默认展示今年的数据
    };
  },
  computed: {
    ...mapGetters([
      'sidebar',
    ]),
    nowYear(){
      return new Date().getFullYear();
    },
    prevYear(){
      return new Date().getFullYear()-1;
    }
  },
  mounted(){
    const $this = this;
    if(!$this.sidebar.opened){
      $this.$store.dispatch('app/toggleSideBar');
    }
  },
  components:{
    defaultChart
  },
  created() {
    var $this = this;
    $this.searchData.dept_id = parseInt($this.$route.query.deptId);
    $this.searchData.id = parseInt($this.$route.query.itemId);

    var deptArr=[];
    deptArr.push(parseInt($this.$route.query.deptId));
    $this.deptArr=deptArr;

    var teamArr=[];
    teamArr.push(parseInt($this.$route.query.itemId));
    $this.teamArr=teamArr;
    $this.initData();
  },
  methods: {
    // 初始化数据
    initData() {
      var $this = this;
      if($this.searchData.id&&$this.searchData.id!=''){
        $this.getCnDepartList();
        $this.getPersoncountCompare();
      }else{
        $this.$message({
            showClose: true,
            message:'请选择组员！',
            type: "error",
            duration: 6000
        });
        $this.$router.push({path:"/stat/cn/memberAnalysis"});
      }
    },
    // 获取组员对比信息
    getPersoncountCompare(){
      var $this = this;
      $this.defaultChartData=[];
      var searchData={};
      searchData.userid=$this.teamArr;
      if($this.type == 1){
        searchData.year = $this.prevYear
      }else{
        searchData.year = $this.nowYear
      }
      var ChartColor=['#91b4f3','#ffc545','#8feac0','#fa9b7c'];
      $this.$store.dispatch("api/getCnPersoncountCompareAction",searchData).then((res) => {
          if (res) {
            if (res.status) {
              //对比用户
              $this.comapreuser=res.comapreuser;
              //年度询盘趋势
              var yearcount = {};
              yearcount.Mobtitle='年度询盘趋势（对比）';
              yearcount.unit='（单位：个）';
              yearcount.chartType = "area";
              yearcount.chartClass = "enquirie";
              yearcount.ChartColor = ChartColor;
              yearcount.ChartData = [];
              if(res.yearcountcompare&&res.yearcountcompare.length>0){
                res.yearcountcompare.forEach(function(item,index){
                    var itemArr=[];      
                    item.forEach(function(items,indexs){
                      var objItem={};        
                      objItem.name=items.name;
                      objItem.date=items.date;
                      objItem.value=items.xunnumber;
                      objItem.color=ChartColor[index];
                      itemArr.push(objItem);
                    });
                    yearcount.ChartData.push(itemArr);
                });
              }
              if(res.leftyearcountcompare&&res.leftyearcountcompare.length>0){
                var leftChartData=[];
                res.leftyearcountcompare.forEach(function(item,index){        
                    var objItem={};        
                    objItem.name=item.name;
                    objItem.totalnum=numSeparate(item.xunnumber);
                    objItem.avgnum=numSeparate(item.avgnumber.toFixed(2)*1);
                    objItem.historynum=numSeparate((item.maxmonthnumber&&item.maxmonthnumber!=null)?item.maxmonthnumber:0);
                    objItem.color=ChartColor[index];
                    leftChartData.push(objItem);
                });
                yearcount.leftChartData=leftChartData;
              }
              //年度成交积分趋势
              var yearscore = {};
              yearscore.Mobtitle='年度成交积分趋势（对比）';
              yearscore.unit='（单位：分）';
              yearscore.chartType = "line";
              yearscore.chartClass = "score";
              yearscore.ChartColor = ChartColor;
              yearscore.ChartData = [];
              if(res.yearscorecompare&&res.yearscorecompare.length>0){
                res.yearscorecompare.forEach(function(item,index){     
                    var itemArr=[];              
                    item.forEach(function(items,indexs){
                      var objItem={};        
                      objItem.name=items.name;
                      objItem.date=items.date;
                      objItem.value=items.score;
                      objItem.color=ChartColor[index];
                      itemArr.push(objItem);
                    });
                    yearscore.ChartData.push(itemArr);
                });
              }
              if(res.leftyearscorecompare&&res.leftyearscorecompare.length>0){
                var leftChartData=[];
                res.leftyearscorecompare.forEach(function(item,index){        
                    var objItem={};        
                    objItem.name=item.name;
                    objItem.totalnum=numSeparate(item.score.toFixed(2)*1);
                    objItem.avgnum=numSeparate(item.avgscore.toFixed(2)*1);
                    objItem.historynum=numSeparate((item.maxmonthscore&&item.maxmonthscore!=null)?item.maxmonthscore:0);
                    objItem.color=ChartColor[index];
                    leftChartData.push(objItem);
                });
                yearscore.leftChartData=leftChartData;
              }
              //年度成交100万个数
              var yearanumber = {};
              yearanumber.Mobtitle='年度成交100万个数（对比）';
              yearanumber.unit='（单位：个）';
              yearanumber.chartType = "column";
              yearanumber.chartClass = "clinch";
              yearanumber.ChartColor = ChartColor;
              yearanumber.ChartData = [];
              if(res.yearanumbercompare&&res.yearanumbercompare.length>0){
                res.yearanumbercompare.forEach(function(item,index){ 
                    var itemArr=[]; 
                    item.forEach(function(items,indexs){
                      var objItem={};        
                      objItem.name=items.name;
                      objItem.date=items.date;
                      objItem.value=items.anumber;
                      objItem.color=ChartColor[index];
                      itemArr.push(objItem);
                    });
                    yearanumber.ChartData.push(itemArr);
                });
              }
              if(res.leftyearanumbercompare&&res.leftyearanumbercompare.length>0){
                var leftChartData=[];
                res.leftyearanumbercompare.forEach(function(item,index){   
                  var objItem={};     
                  var max=0;
                  var totalnum=0;                  
                  item.forEach(function(items,indexs){
                    objItem.name=items.name;
                    if(max<items.anumber){
                      max=items.anumber;
                    }
                    totalnum=totalnum+items.anumber;
                  });
                  objItem.totalnum=numSeparate(totalnum);
                  objItem.avgnum=numSeparate((totalnum/item.length).toFixed(2)*1);
                  objItem.historynum=numSeparate(max);
                  objItem.color=ChartColor[index];
                  leftChartData.push(objItem);
                });
                yearanumber.leftChartData=leftChartData;
              }
              //年度总奖金趋势
              var yearmoney = {};
              yearmoney.Mobtitle='年度总奖金趋势（对比）';
              yearmoney.unit='（单位：元）';
              yearmoney.chartType = "area";
              yearmoney.chartClass = "money";
              yearmoney.ChartColor = ChartColor;
              yearmoney.ChartData = [];
              if(res.yearmoneycompare&&res.yearmoneycompare.length>0){
                res.yearmoneycompare.forEach(function(item,index){ 
                    var itemArr=[]; 
                    item.forEach(function(items,indexs){
                      var objItem={};        
                      objItem.name=items.name;
                      objItem.date=items.date;
                      objItem.value=items.money;
                      objItem.color=ChartColor[index];
                      itemArr.push(objItem);
                    });
                    yearmoney.ChartData.push(itemArr);
                });
              }
              if(res.leftyearmoneycompare&&res.leftyearmoneycompare.length>0){
                var leftChartData=[];
                res.leftyearmoneycompare.forEach(function(item,index){        
                    var objItem={};        
                    objItem.name=item.name;
                    objItem.totalnum=numSeparate(item.money.toFixed(2)*1);
                    objItem.avgnum=numSeparate(item.avgmoney.toFixed(2)*1);
                    objItem.historynum=numSeparate(item.maxmonthmoney);
                    objItem.color=ChartColor[index];
                    leftChartData.push(objItem);
                });
                yearmoney.leftChartData=leftChartData;
              }
              $this.defaultChartData = [yearcount,yearscore,yearanumber,yearmoney];
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
                        if($this.searchData.dept_id==item.id){
                            objItem.isOn=true;
                        }
                        department.push(objItem);
                    });
                    $this.department=department;
                }
                $this.getCnPersonlist();
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
    //获取部门下组员信息
    getCnPersonlist(){
      var $this = this;
      var searchData={};
      searchData.dept_id=$this.searchData.dept_id;
      $this.$store.dispatch("api/getCnPersonlistAction",searchData).then((res) => {
          if (res) {
            if (res.status) {
                if(res.ulist&&res.ulist.length>0){
                    var choosePerson=[];
                    res.ulist.forEach(function(item,index){
                        var objItem={};
                        objItem.name=item.name;
                        objItem.id=item.id;
                        objItem.isOn=false;
                        choosePerson.push(objItem);
                    });
                    choosePerson.forEach(function(item,index){
                        item.isOn=false;
                        $this.teamArr.forEach(function(items,indexs){
                          if(item.id==parseInt(items)){
                            item.isOn=true;
                          }
                        });
                    });
                    $this.choosePerson=choosePerson;
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
    // 点击部门获取部门ID
    departChange(valData){
        var $this=this;        
        $this.department.forEach(function(item,index){
            item.isOn=false;
            if(item.id==valData){
              item.isOn=true;
              $this.searchData.dept_id=valData;
            }
        });
        $this.getCnPersonlist();
    },
    // 点击组员获取组员ID
    PersonChange(valData){
        var $this=this;
        var teamData=$this.teamArr;
        if(teamData.indexOf(valData)>=0){
            if(valData!=$this.searchData.id){
                var newTeamData=[];
                teamData.forEach(function(item,index){
                  if(item!=valData){
                    newTeamData.push(item);
                  }
                });
                $this.choosePerson.forEach(function(item,index){
                    item.isOn=false;
                    newTeamData.forEach(function(items,indexs){
                      if(item.id==parseInt(items)){
                        item.isOn=true;
                      }
                    });
                });
                $this.teamArr=newTeamData;
                $this.getPersoncountCompare();
            }
        }else{
          if(teamData.length<4){
            teamData.push(valData);
            $this.choosePerson.forEach(function(item,index){
                item.isOn=false;
                teamData.forEach(function(items,indexs){
                  if(item.id==parseInt(items)){
                    item.isOn=true;
                  }
                });
            });
            $this.teamArr=teamData;
            $this.getPersoncountCompare();
          }
        }
    },
    // 点击关闭对比用户
    handlePerson(valData){
      var $this=this;
      $this.PersonChange(valData);
    },
    changeType(val){
      this.type = val;
      this.getPersoncountCompare()
    },
  }
}
</script>