<template>
  <div class="memberDeal">
      <div class="memberTit">
          <h3 v-if="type==4">成交个数榜单</h3>
          <h3 v-else>成交积分榜单</h3>
          <p><span>全部产品年度排行</span><i v-if="type==4">(单位：个)</i><i v-else>(单位：分)</i></p>
          <div class="btn-group" v-if="lang =='en'">
            <div @click="changeType(4)" class="btn-item" :class="type == 4?'active':''">个数</div>
            <div @click="changeType(5)" class="btn-item" :class="type == 5?'active':''">积分</div>
          </div>
      </div>
      <div class="dealRank">

          <div class="inquiryUl" :style="'height:'+ dealScoreSet.boxHeight">
              <el-table
                class="dataShowtable"
                key="1"
                :data="dealScore"
                style="width: 100%"
                v-if="type==4"
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
                    prop="keyproduct"
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
                    label="个数"
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
              <el-table
                class="dataShowtable"
                :data="dealScore"
                style="width: 100%"
                v-if="type==5"
                key="2"
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
                    prop="keyproduct"
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
                      label="积分"
                      width="100"
                      align="center"
                      prop="scorenumber">
                      <template slot-scope="scope">
                        <router-link :to="{path: lang == 'ch'?'/stat/cn/productAnalysis/ProAccount':'/stat/en/productAnalysis/ProAccount',query:{starttime:scope.row.starttime,endtime:scope.row.endtime,productname:scope.row.productname,typeid:scope.row.typeid}}" tag="a" target="_blank"> 
                          <div class="proNum"><span>{{scope.row.scorenumber}}分</span></div>
                        </router-link>
                      </template>
                </el-table-column>
                <el-table-column
                      prop="percentScore"
                      width="112"
                      align="center"
                      label="积分占比">
                      <template slot-scope="scope">
                        <router-link :to="{path: lang == 'ch'?'/stat/cn/productAnalysis/ProAccount':'/stat/en/productAnalysis/ProAccount',query:{starttime:scope.row.starttime,endtime:scope.row.endtime,productname:scope.row.productname,typeid:scope.row.typeid}}" tag="a" target="_blank"> 
                          <div class="proPie">
                            <span>{{scope.row.percentScore}}%</span>
                          </div>
                        </router-link>
                      </template>
                </el-table-column>
              </el-table>
          </div>

          <div class="deMore" v-if="dealScoreSet.ifFold" :class="!dealScoreSet.isFold? 'inRotate' : 'rowRotate' "  @click="showAll" ></div>
      </div>
  </div>
</template>
<script>
export default {
      name: "UnpayDeal",
  data() {
    return {
        type:5,//4 询盘  5 成交积分
    };
  },
  created(){
  },
  props: {
    dealScore: {
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
    dealScoreSet: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  methods:{
    changeType(val){
      var $this = this;
      $this.type = val;
    },
    showAll(){
        var $this = this;
        var isFold = !$this.dealScoreSet.isFold;
        var boxHeight = '';
        if(isFold){
          boxHeight = "auto";
        }else{
          boxHeight = '616px'
        }
        
        $this.$emit("changeSet", $this.dealScoreSet, isFold, boxHeight);
    },
  }
}
</script>

<style></style>