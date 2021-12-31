<template>
  <div class="page-root scroll-panel product-Analy" ref="boxPane">
       <div class="proStatTop"><p><i class="svg-i"><svg-icon icon-class="tips" class-name="disabled" /></i>{{userBasicInfo.pick=='enquirie'?'询盘':'积分'}}数据统计：{{userBasicInfo.name}} - {{userBasicInfo.time}}</p></div>
       <div class="proStatMid">
         <div class="proStatMidFl">
              <h3>产品{{userBasicInfo.pick=='enquirie'?'询盘个数':'成交积分'}}</h3>
              <div class="proStatMidFlBox">
                   <column-chart :chartList="chartList" v-if='chartList'></column-chart>
              </div>
         </div>
         <div class="proStatMidFr">
              <h3>产品占比</h3>
              <div class="proStatMidFrBox">
                   <pie-chart :chartList="chartList" v-if='chartList'></pie-chart>
              </div>
         </div>
       </div>
       <div class="proStatBom">
            <h3>详细报表</h3>
            <div class="proStatBomBox">
                <el-table
                    :data="xuntong"
                    border
                    style="width: 100%">
                    <el-table-column
                        prop="ranking"
                        label="排序">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="产品名">
                    </el-table-column>
                    <el-table-column
                        prop="number"
                        v-if="userBasicInfo.pick=='enquirie'"
                        label="询盘个数">
                    </el-table-column>
                    <el-table-column
                        prop="number"
                        v-if="userBasicInfo.pick=='score'"
                        label="积分">
                    </el-table-column>
                    <el-table-column
                        prop="percent"
                        label="占比">
                    </el-table-column>
                </el-table>
            </div>
       </div>
  </div>
</template>
<script>
import {sortByAsc,rankingWithTotalItem} from "@/utils/index";
import PieChart from "../../components/productAnalysis/PieChart";
import columnChart from "../../components/productAnalysis/columnChart";
export default {
  name: "personproductinfo",
  data() {
    return {
        userBasicInfo:{
            id:'',
            name:"",
            month:"",
            time:'',
            type:'',
            pick:'',
        },
        xuntong:[],
        chartList:{},
    };
  },
  components:{
    PieChart,
    columnChart,
  },
  created() {
    var $this = this;
    $this.getForRouting();
  },
  mounted(){
    const $this = this;
  },
  methods: {
    // 获取路由参数
    getForRouting(){
      var $this = this;
      $this.userBasicInfo.id=$this.$route.query.uid;
      $this.userBasicInfo.type=$this.$route.query.type;
      $this.userBasicInfo.pick=$this.$route.query.pick;
      $this.userBasicInfo.month=$this.$route.query.month;
      var time=$this.$route.query.month.split('-');
      $this.userBasicInfo.time=time[0]+'年'+time[1]+'月';
      $this.getPerproductinfo();      
    },
    // 获取个人月产品分析
    getPerproductinfo(){
      var $this = this;
      var searchData={};
      searchData.uid=$this.userBasicInfo.id;
      searchData.month=$this.userBasicInfo.month;
      searchData.type=$this.userBasicInfo.type;
      $this.$store.dispatch("api/getPersonproductinfoAction",searchData).then((res) => {
          if (res) {
            if (res.status) {
              var ChartColor=['#2368ff','#49cdff','#ffcb60','#fe443d','#49c96a','#3A71A8','#fb7d23','#E65D6E','#4c54fe','#d02c34'];
              $this.userBasicInfo.name=res.userinfo.name;
              var chartListObj={};
              var xuntong=[];
              var chartList=[];
              if($this.userBasicInfo.pick=='enquirie'){
                if(res.xuntong&&res.xuntong.length>0){
                  var tolNum=0;
                  res.xuntong.forEach(function(item,index){
                    tolNum+=item.number;
                  });
                  res.xuntong.sort(function(a,b){
                    return b.number-a.number
                  });
                  var xuntongArr = rankingWithTotalItem(res.xuntong,'number');
                  xuntongArr.forEach(function(item,index){
                    var itemObj={};
                    itemObj.name=item.keyproduct;
                    itemObj.number=item.number;
                    itemObj.ranking=item.ranking;
                    if(tolNum==0||item.number==0){
                        itemObj.percent='0%';
                    }else{
                        itemObj.percent=(item.number/tolNum*100).toFixed(2)+'%';
                    }
                    xuntong.push(itemObj)
                  });
                }
                chartListObj.pick=$this.userBasicInfo.pick;
                chartListObj.ChartColor=ChartColor;
                chartListObj.chartList=xuntong;
              }
              if($this.userBasicInfo.pick=='score'){
                if(res.score&&res.score.length>0){
                  var tolNum=0;
                  res.score.forEach(function(item,index){
                    tolNum+=item.score;
                  });
                  res.score.sort(function(a,b){
                    return b.score-a.score
                  });
                  var xuntongArr = rankingWithTotalItem(res.score,'score');
                  xuntongArr.forEach(function(item,index){
                    var itemObj={};
                    itemObj.name=item.keyproduct;
                    itemObj.number=item.score;
                    itemObj.ranking=item.ranking;
                    if(tolNum==0||item.number==0){
                        itemObj.percent='0%';
                    }else{
                        itemObj.percent=(item.score/tolNum*100).toFixed(2)+'%';
                    }
                    xuntong.push(itemObj)
                  });
                }
                chartListObj.pick=$this.userBasicInfo.pick;
                chartListObj.ChartColor=ChartColor;
                chartListObj.chartList=xuntong;
              }
              $this.xuntong=xuntong;
              $this.chartList=chartListObj;
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
  }
}
</script>



