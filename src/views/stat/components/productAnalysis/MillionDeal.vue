<template>
  <div class="millionDeal" v-if="millionDeal.length > 0">
      <div class="memberTit">
          <h3>百万成交榜单</h3>
          <p><span>全部产品年度排行</span>(单位：个)</p>
      </div>
    <div class="milRank">

        <div class="inquiryUl" :style="'height:'+ millionDealSet.boxHeight">
              <el-table
                class="dataShowtable"
                :data="millionDeal"
                style="width: 100%"
                >
                <el-table-column
                    width="62"
                    prop="ranking"
                    align="center"
                    label="排序">
                    <template slot-scope="scope">
                        <router-link :to="{path: lang == 'ch'?'/stat/cn/productAnalysis/ProAccount':'/stat/en/productAnalysis/ProAccount',query:{starttime:scope.row.starttime,endtime:scope.row.endtime,productname:scope.row.productname,typeid:scope.row.typeid}}" tag="a" target="_blank"> 
                            <div class="proSort">
                              <div class="numTop" v-if="scope.row.ranking<4" :class="'numTop0'+(scope.row.ranking)">
                                <span class="inrank">0{{scope.row.ranking}}</span>
                              </div>
                              <div class="numTop" v-if="scope.row.ranking>3 && scope.row.ranking <= 9">
                                  0{{scope.row.ranking}}
                              </div>
                              <div class="numTop" v-if="scope.row.ranking > 9">
                                  {{scope.row.ranking}}
                              </div>
                            </div>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column
                    label="产品名"
                    prop="xunproduct"
                    >
                    <template slot-scope="scope">
                        <router-link :to="{path: lang == 'ch'?'/stat/cn/productAnalysis/ProAccount':'/stat/en/productAnalysis/ProAccount',query:{starttime:scope.row.starttime,endtime:scope.row.endtime,productname:scope.row.productname,typeid:scope.row.typeid}}" tag="a" target="_blank"> 
                          <div class="proName">
                            <span>
                              {{scope.row.xunproduct}}
                            </span>
                          </div>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column
                    label="百万个数"
                    width="100"
                    align="center"
                    prop="number">
                    <template slot-scope="scope">
                      <router-link :to="{path: lang == 'ch'?'/stat/cn/productAnalysis/ProAccount':'/stat/en/productAnalysis/ProAccount',query:{starttime:scope.row.starttime,endtime:scope.row.endtime,productname:scope.row.productname,typeid:scope.row.typeid}}" tag="a" target="_blank"> 
                        <div class="proNum"><span>{{scope.row.number}}个</span></div>
                      </router-link>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="percentNum"
                    width="112"
                    align="center"
                    label="产品占比">
                    <template slot-scope="scope">
                      <router-link :to="{path: lang == 'ch'?'/stat/cn/productAnalysis/ProAccount':'/stat/en/productAnalysis/ProAccount',query:{starttime:scope.row.starttime,endtime:scope.row.endtime,productname:scope.row.productname,typeid:scope.row.typeid}}" tag="a" target="_blank"> 
                        <div class="proPie">
                          <span>{{scope.row.percentNum}}%</span>
                        </div>
                      </router-link>
                    </template>
                </el-table-column>
              </el-table>
          </div>

        <div class="milMore" v-if="millionDealSet.ifFold" :class="!millionDealSet.isFold? 'inRotate' : 'rowRotate' "  @click="showAll" ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MillionDeal",
  data() {
    return {

    };
  },
  created(){
  },
  props: {
    millionDeal: {
      type: Array,
      default: function () {
        return [];
      },
    },
    lang:{
      type: String,
      default: function () {
        return "";
      },
    },
    //折叠情况
    millionDealSet: {
      type: Object,
      default: function () {
        return {};
      },
    }
  },
  methods:{
    showAll(){
        var $this = this;
        var isFold = !$this.millionDealSet.isFold;
        var boxHeight = '';
        if(isFold){
          boxHeight = "auto";
        }else{
          boxHeight = '616px'
        }
        
        $this.$emit("changeSet", $this.millionDealSet, isFold, boxHeight);
    },
  }
}
</script>

<style></style>