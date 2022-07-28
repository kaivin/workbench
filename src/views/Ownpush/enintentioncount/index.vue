<template>
  <div class="page-root flex-box no-padding cn-phone-index cn-phone-stat" ref="boxPane">
    <div class="flex-content relative">
      <div class="abs-panel" ref="mainPane">
        <div class="scroll-panel" ref="scrollPane">
          <p class="breadcrumb" ref="breadcrumbPane">
              <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
              <template v-for="item in breadcrumbList">
                <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
                <span class="breadcrumb-link" v-bind:key="item.id" v-else><b>-</b><span>{{item.title}}</span></span>
              </template>
          </p>
          <el-card class="box-card scroll-card" shadow="hover">
              <div class="card-content ChinaphoneTwoBox" ref="tableContent">

                  <div class="ChinaphoneTwo buttonTwo">
                    <div class="group-body">
                      <div class="team-panel">
                        <div class="team-header">
                          <span class="require tips">* 电话：</span>
                          <el-checkbox class="all-select" :indeterminate="isAllPhone" border size="mini" v-model="checkAllPhone" @change="handleCheckAllPhoneChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedPhone" @change="handleCheckedPhoneChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="item in phoneList" :label="item.value" :key="item.value" border>{{item.label}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </div>
                      <div class="team-panel">
                        <div class="team-header">
                            <div class="team-headerItem">
                                  <span class="require tips">* 日期：</span>
                                  <el-date-picker
                                      v-model="searchData.date"
                                      size="mini"
                                      type="monthrange"
                                      align="right"
                                      value-format = "yyyy-MM"
                                      unlink-panels
                                      range-separator="至"
                                      start-placeholder="开始日期"
                                      end-placeholder="结束日期"
                                      :picker-options="pickerRangeOptions"
                                      :class="searchData.date&&searchData.date.length>0?'el-xzstate':''">
                                  </el-date-picker>              
                            </div>
                        </div>
                      </div>
                      <div class="team-panel">
                        <div class="team-header">
                          <span class="require">渠道：</span>
                          <el-checkbox class="all-select" :indeterminate="isAllSource" border size="mini" v-model="checkAllSource" @change="handleCheckAllSourceChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedSource" @change="handleCheckedSourceChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="item in sourceList" :label="item.value" :key="item.value" border>{{item.label}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </div>
                      <div class="team-panel">
                        <div class="team-header">
                          <span class="require">大洲：</span>
                          <el-checkbox class="all-select" :indeterminate="isAllContinent" border size="mini" v-model="checkAllContinent" @change="handleCheckAllContinentChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedContinent" @change="handleCheckedContinentChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="item in continentList" :label="item.label" :key="item.value" border>{{item.label}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </div>
                      <div class="team-panel">
                        <div class="team-header">
                          <span class="require">设备：</span>
                          <el-checkbox class="all-select" :indeterminate="isAllDevice" border size="mini" v-model="checkAllDevice" @change="handleCheckAllDeviceChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedDevice" @change="handleCheckedDeviceChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="item in deviceList" :label="item.value" :key="item.value" border>{{item.label}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </div>
                      <div class="team-panel team-time">
                        <div class="team-header">
                            <div class="team-headerItem">
                                <span class="require">备注：</span>
                                <el-input
                                    size="mini"
                                    v-model="searchData.name"
                                    :class="searchData.name!=''?'el-xzstate':''"
                                    placeholder="备注1、备注2、备注3"
                                    clearable>
                                </el-input>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="ChinaphoneTwo buttonTwo">
                    <div class="group-header"><el-checkbox class="all-select" :indeterminate="isAllProduct" border size="mini" v-model="checkAllProduct" @change="handleCheckAllProductChange">产品全选</el-checkbox>
                    </div>
                    <div class="group-body">
                      <div class="team-panel" v-for="item in productList" v-bind:key="item.id">
                        <div class="team-header" v-if="item.icon=='a1'">
                          <span class="require">{{item.name}}：</span>
                          <el-checkbox class="all-select" :indeterminate="isAllA1Product" border size="mini" v-model="checkAllA1Product" @change="handleCheckAllA1ProductChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedA1Product" @change="handleCheckedA1ProductChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                        <div class="team-header" v-else-if="item.icon=='a2'">
                          <span class="require">{{item.name}}：</span>
                          <el-checkbox class="all-select" :indeterminate="isAllA2Product" border size="mini" v-model="checkAllA2Product" @change="handleCheckAllA2ProductChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedA2Product" @change="handleCheckedA2ProductChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                        <div class="team-header" v-else-if="item.icon=='a3'">
                          <span class="require">{{item.name}}：</span>
                          <el-checkbox class="all-select" :indeterminate="isAllA3Product" border size="mini" v-model="checkAllA3Product" @change="handleCheckAllA3ProductChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedA3Product" @change="handleCheckedA3ProductChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                        <div class="team-header" v-else-if="item.icon=='a4'">
                          <span class="require">{{item.name}}：</span>
                          <el-checkbox class="all-select" :indeterminate="isAllA4Product" border size="mini" v-model="checkAllA4Product" @change="handleCheckAllA4ProductChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedA4Product" @change="handleCheckedA4ProductChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                        <div class="team-header" v-else-if="item.icon=='a5'">
                          <span class="require">{{item.name}}：</span>
                          <el-checkbox class="all-select" :indeterminate="isAllA5Product" border size="mini" v-model="checkAllA5Product" @change="handleCheckAllA5ProductChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedA5Product" @change="handleCheckedA5ProductChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                        <div class="team-header" v-else-if="item.icon=='a6'">
                          <span class="require">{{item.name}}：</span>
                          <el-checkbox class="all-select" :indeterminate="isAllA6Product" border size="mini" v-model="checkAllA6Product" @change="handleCheckAllA6ProductChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedA6Product" @change="handleCheckedA6ProductChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                        <div class="team-header" v-else-if="item.icon=='a7'">
                          <span class="require">{{item.name}}：</span>
                          <el-checkbox class="all-select" :indeterminate="isAllA7Product" border size="mini" v-model="checkAllA7Product" @change="handleCheckAllA7ProductChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedA7Product" @change="handleCheckedA7ProductChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                        <div class="team-header" v-else-if="item.icon=='a8'">
                          <span class="require">{{item.name}}：</span>
                          <el-checkbox class="all-select" :indeterminate="isAllA8Product" border size="mini" v-model="checkAllA8Product" @change="handleCheckAllA8ProductChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedA8Product" @change="handleCheckedA8ProductChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                        <div class="team-header" v-else-if="item.icon=='a9'">
                          <span class="require">{{item.name}}：</span>
                          <el-checkbox class="all-select" :indeterminate="isAllA9Product" border size="mini" v-model="checkAllA9Product" @change="handleCheckAllA9ProductChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedA9Product" @change="handleCheckedA9ProductChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                        <div class="team-header" v-else-if="item.icon=='a10'">
                          <span class="require">{{item.name}}：</span>
                          <el-checkbox class="all-select" :indeterminate="isAllA10Product" border size="mini" v-model="checkAllA10Product" @change="handleCheckAllA10ProductChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedA10Product" @change="handleCheckedA10ProductChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                        <div class="team-header" v-else-if="item.icon=='a11'">
                          <span class="require">{{item.name}}：</span>
                          <el-checkbox class="all-select" :indeterminate="isAllA11Product" border size="mini" v-model="checkAllA11Product" @change="handleCheckAllA11ProductChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedA11Product" @change="handleCheckedA11ProductChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                        <div class="team-header" v-else-if="item.icon=='a12'">
                          <span class="require">{{item.name}}：</span>
                          <el-checkbox class="all-select" :indeterminate="isAllA12Product" border size="mini" v-model="checkAllA12Product" @change="handleCheckAllA12ProductChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedA12Product" @change="handleCheckedA12ProductChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                        <div class="team-header" v-else-if="item.icon=='a13'">
                          <span class="require">{{item.name}}：</span>
                          <el-checkbox class="all-select" :indeterminate="isAllA13Product" border size="mini" v-model="checkAllA13Product" @change="handleCheckAllA13ProductChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedA13Product" @change="handleCheckedA13ProductChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="ChinaphoneTwo buttonTwo">
                    <div class="group-header">
                        <el-checkbox class="all-select" :indeterminate="isAllResult" border size="mini" v-model="checkAllResult" @change="handleCheckAllResultChange">分析项全选</el-checkbox>
                    </div>
                    <div class="group-body">
                      <div class="team-panel">
                        <div class="team-header">
                          <el-checkbox-group class="team-list" v-model="checkedResult" @change="handleCheckedResultChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="item in resultShowList" :label="item.value" :key="item.id" border :disabled="item.disabled">{{item.label}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="card-header WebServerAddEditBtn ChinaphoneTwoBtn">
                      <el-button type="primary" class="updateBtn"  :class="isDisabled?'isDisabled':''" :disabled="isDisabled"  size="small" v-if="menuButtonPermit.includes('Ownpush_enintentioncount')" v-on:click="getSearchResult"><i class="svg-i planeWhite" ><svg-icon icon-class="planeWhite" /></i>生成数据</el-button>
                      <el-button type="primary" class="resetBtn" size="small" v-on:click="resetData()">重置</el-button>
                  </div>
              </div>
          </el-card>

          <el-card class="box-card scroll-card cn-phone-result depone_result" shadow="hover" v-if="isSearch">
              <div class="card-content ChinaphoneTwoBox" ref="tableContent">
                <div class="cavans-wrapper" id="canvasPane" ref="canvasPane">

                  <el-row :gutter="15" v-if="checkedResult.includes(1)">
                    <el-col :xs="24">
                      <div class="chart-wrapper">
                        <div class="chart-header"><span>询盘总数</span></div>
                        <div class="chart-body" style="height:400px;">                        
                            <div class="abs-canvas" v-if="searchResult.allInquiryCount.length>0">
                              <div id="allinquiry" class="chart-canvas"></div>
                            </div>
                            <div class="nocount" v-else>
                              暂无数据
                            </div>                     
                        </div>
                      </div>
                    </el-col>
                  </el-row>

                  <el-row :gutter="15" >
                    <el-col :md="24" :lg="12" v-if="checkedResult.includes(3)">
                      <div class="chart-wrapper">
                        <div class="chart-header"><span>意向个数</span></div>
                        <div class="chart-body" style="height:400px;">                        
                            <div class="abs-canvas" v-if="searchResult.trendInquiryCount.length>0">
                              <div id="trendinquiry" class="chart-canvas"></div>
                            </div>
                            <div class="nocount" v-else>
                              暂无数据
                            </div>                     
                        </div>
                      </div>
                    </el-col>
                    <el-col :md="24" :lg="12" v-if="checkedResult.includes(2)">
                      <div class="chart-wrapper">
                        <div class="chart-header"><span>意向分数</span></div>
                        <div class="chart-body" style="height:400px;">                        
                            <div class="abs-canvas" v-if="searchResult.trendScoreCount.length>0">
                              <div id="trendscore" class="chart-canvas"></div>
                            </div>
                            <div class="nocount" v-else>
                              暂无数据
                            </div>                     
                        </div>
                      </div>
                    </el-col>
                  </el-row>

                  <el-row :gutter="15" >
                    <el-col :md="24" :lg="12" v-if="checkedResult.includes(4)">
                      <div class="chart-wrapper">
                        <div class="chart-header"><span>产品分类询盘个数</span></div>
                        <div class="chart-body" style="height:550px;">                        
                            <div class="abs-canvas" v-if="searchResult.productInquiryCount.pronumberdata.length>0">
                              <div id="productinquiry" class="chart-canvas"></div>
                            </div>
                            <div class="nocount" v-else>
                              暂无数据
                            </div>                     
                        </div>
                      </div>
                    </el-col>

                    <el-col :md="24" :lg="12" v-if="checkedResult.includes(5)">
                      <div class="chart-wrapper">
                        <div class="chart-header"><span>产品分类意向分数</span></div>
                        <div class="chart-body" style="height:550px;">                        
                            <div class="abs-canvas" v-if="searchResult.productScoreCount.proscoredata.length>0">
                              <div id="productscore" class="chart-canvas"></div>
                            </div>
                            <div class="nocount" v-else>
                              暂无数据
                            </div>                     
                        </div>
                      </div>
                    </el-col>

                  </el-row>

                  <el-row :gutter="15" >
                    <el-col :md="24" :lg="12" v-if="checkedResult.includes(6)">
                      <div class="chart-wrapper">
                        <div class="chart-header"><span>搜索询盘个数</span></div>
                        <div class="chart-body" style="height:400px;">                        
                            <div class="abs-canvas" v-if="searchResult.searchInquiryCount.length>0">
                              <div id="searchinquiry" class="chart-canvas"></div>
                            </div>
                            <div class="nocount" v-else>
                              暂无数据
                            </div>                     
                        </div>
                      </div>
                    </el-col>

                    <el-col :md="24" :lg="12" v-if="checkedResult.includes(7)">
                      <div class="chart-wrapper">
                        <div class="chart-header"><span>搜索意向分数</span></div>
                        <div class="chart-body" style="height:400px;">                        
                            <div class="abs-canvas" v-if="searchResult.searchScoreCount.length>0">
                              <div id="searchscore" class="chart-canvas"></div>
                            </div>
                            <div class="nocount" v-else>
                              暂无数据
                            </div>                     
                        </div>
                      </div>
                    </el-col>
                  </el-row>

                  <el-row :gutter="15" >
                    <el-col :md="24" :lg="12" v-if="checkedResult.includes(8)">
                      <div class="chart-wrapper">
                        <div class="chart-header"><span>发现询盘个数</span></div>
                        <div class="chart-body" style="height:400px;">                        
                            <div class="abs-canvas" v-if="searchResult.findInquiryCount.length>0">
                              <div id="findinquiry" class="chart-canvas"></div>
                            </div>
                            <div class="nocount" v-else>
                              暂无数据
                            </div>                     
                        </div>
                      </div>
                    </el-col>
                    <el-col :md="24" :lg="12" v-if="checkedResult.includes(9)">
                      <div class="chart-wrapper">
                        <div class="chart-header"><span>发现意向分数</span></div>
                        <div class="chart-body" style="height:400px;">                        
                            <div class="abs-canvas" v-if="searchResult.findScoreCount.length>0">
                              <div id="findscore" class="chart-canvas"></div>
                            </div>
                            <div class="nocount" v-else>
                              暂无数据
                            </div>                     
                        </div>
                      </div>
                    </el-col>
                  </el-row>

                  <el-row :gutter="15" >
                    <el-col :md="24" :lg="12" v-if="checkedResult.includes(10)">
                      <div class="chart-wrapper">
                        <div class="chart-header"><span>大洲询盘个数</span></div>
                        <div class="chart-body" style="height:550px;">                        
                            <div class="abs-canvas" v-if="searchResult.continentInquiryCount.continentxundata.length>0">
                              <div id="continentinquiry" class="chart-canvas"></div>
                            </div>
                            <div class="nocount" v-else>
                              暂无数据
                            </div>                     
                        </div>
                      </div>
                    </el-col>
                    <el-col :md="24" :lg="12"  v-if="checkedResult.includes(11)">
                      <div class="chart-wrapper">
                        <div class="chart-header"><span>大洲意向分数</span></div>
                        <div class="chart-body" style="height:550px;">                        
                            <div class="abs-canvas" v-if="searchResult.continentScoreCount.continentscoredata.length>0">
                              <div id="continentscore" class="chart-canvas"></div>
                            </div>
                            <div class="nocount" v-else>
                              暂无数据
                            </div>                     
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
          </el-card>
        </div>
      </div>
    </div>
    <el-backtop target=".scroll-panel"></el-backtop>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import * as echarts from 'echarts';
export default {
  name: 'enintentioncount',
  data() {
    return {
      pickerRangeOptions: {
        shortcuts: [{
          text: '本月',
          onClick(picker) {
            picker.$emit('pick', [new Date(), new Date()]);
          }
        }, {
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
      isSearch:false,
      defaultData:{},
      breadcrumbList:[],
      menuButtonPermit:[],
      isAllPhone:false,
      checkAllPhone:false,
      checkedPhone:[],
      searchData:{
        date:[],
        name:'',
      },
      deviceList:[],
      productList:[],
      sourceList:[],
      continentList:[],
      phoneList:[],
      phoneCount:0,
      productCount:0,
      isAllProduct:false,
      checkAllProduct:false,
      isAllA1Product:false,
      checkAllA1Product:false,
      isAllA2Product:false,
      checkAllA2Product:false,
      isAllA3Product:false,
      checkAllA3Product:false,
      isAllA4Product:false,
      checkAllA4Product:false,
      isAllA5Product:false,
      checkAllA5Product:false,
      isAllA6Product:false,
      checkAllA6Product:false,
      isAllA7Product:false,
      checkAllA7Product:false,
      isAllA8Product:false,
      checkAllA8Product:false,
      isAllA9Product:false,
      checkAllA9Product:false,
      isAllA10Product:false,
      checkAllA10Product:false,
      isAllA11Product:false,
      checkAllA11Product:false,
      isAllA12Product:false,
      checkAllA12Product:false,
      isAllA13Product:false,
      checkAllA13Product:false,
      checkedA1Product:[],
      checkedA2Product:[],
      checkedA3Product:[],
      checkedA4Product:[],
      checkedA5Product:[],
      checkedA6Product:[],
      checkedA7Product:[],
      checkedA8Product:[],
      checkedA9Product:[],
      checkedA10Product:[],
      checkedA11Product:[],
      checkedA12Product:[],
      checkedA13Product:[],
      isAllSource:false,
      checkAllSource:false,
      checkedSource:[],
      isAllContinent:false,
      checkAllContinent:false,
      checkedContinent:[],
      isAllCategory:false,
      checkAllCategory:false,
      checkedCategory:[],
      isAllDevice:false,
      checkAllDevice:false,
      checkedDevice:[],
      searchResult:{
        allInquiryCount:[],
        trendScoreCount:[],
        trendInquiryCount:[],
        productScoreCount:{},
        productInquiryCount:{},
        searchInquiryCount:[],
        searchScoreCount:[],
        findInquiryCount:[],
        findScoreCount:[],
        continentInquiryCount:{},
        continentScoreCount:{},
      },
      isDisabled:false,
      chartlist:{
        allInquiryPlot:'',
        trendScorePlot:'',
        trendInquiryPlot:'',
        productScorePlot:'',
        productInquiryPlot:'',
        searchInquiryPlot:'',
        searchScorePlot:'',
        findInquiryPlot:'',
        findScorePlot:'',
        continentInquiryPlot:'',
        continentScorePlot:'',
      },
      isAllResult: false,
      checkAllResult: false,
      checkedResult: [],
      resultShowList:[
        {id:1,value:1,label:"询盘分析",disabled:false},
        {id:2,value:2,label:"意向分分析",disabled:false},
        {id:3,value:3,label:"意向个数分析",disabled:false},
        {id:4,value:4,label:"产品分类询盘分析",disabled:true},
        {id:5,value:5,label:"产品分类意向分分析",disabled:true},
        {id:6,value:6,label:"搜索询盘分析",disabled:false},
        {id:7,value:7,label:"搜索意向分分析",disabled:false},
        {id:8,value:8,label:"发现询盘分析",disabled:false},
        {id:9,value:9,label:"发现意向分分析",disabled:false},
        {id:10,value:10,label:"大洲询盘分析",disabled:true},
        {id:11,value:11,label:"大洲意向分分析",disabled:true}
      ],
      tableTitle:[],
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'sidebar',
      'menuData'
    ]),
    isCollapse() {
      return this.sidebar.opened
    }
  },
  mounted(){
    const $this = this;
    // if(this.sidebar.opened){
    //   $this.$store.dispatch('app/toggleSideBar');
    // }
    window.addEventListener('resize',this.echartsSize)
  },
  created(){
    var $this = this;
    $this.getBreadcrumbList();
    $this.initData();
  },
  watch:{
    isCollapse(){
      setTimeout(() => {
        this.echartsSize();
      }, 200)
    }
  },
  methods:{
    // 获取面包屑路径
    getBreadcrumbList(){
      var $this = this;
      var breadcrumbList = [];
      var currentID = ""+$this.$router.currentRoute.meta.id;
      var pageID = 0;
      if(currentID.indexOf('-')!=-1){
        pageID = parseInt(currentID.split("-")[1]);
      }else{
        pageID = parseInt(currentID);
      }
      $this.menuData.forEach(function(item,index){
        if(item.meta.id == pageID){
          var itemData = {};
          itemData.id = item.meta.id;
          itemData.router = item.path;
          itemData.title = item.meta.title;
          breadcrumbList.push(itemData);
        }else{
          if(item.children.length>0){
            item.children.forEach(function(item1,index1){
              if(item1.meta.id == pageID){
                var itemData = {};
                itemData.id = item.meta.id;
                itemData.router = item.path;
                itemData.title = item.meta.title;
                breadcrumbList.push(itemData);
                var itemData2 = {};
                itemData2.id = item1.meta.id;
                itemData2.router = item1.path;
                itemData2.title = item1.meta.title;
                breadcrumbList.push(itemData2);
              }else{
                if(item1.children.length>0){
                  item1.children.forEach(function(item2,index2){
                    if(item2.meta.id == pageID){
                      var itemData = {};
                      itemData.id = item.meta.id;
                      itemData.router = item.path;
                      itemData.title = item.meta.title;
                      breadcrumbList.push(itemData);
                      var itemData2 = {};
                      itemData2.id = item1.meta.id;
                      itemData2.router = item1.path;
                      itemData2.title = item1.meta.title;
                      breadcrumbList.push(itemData2);
                      var itemData3 = {};
                      itemData3.id = item2.meta.id;
                      itemData3.router = item2.path;
                      itemData3.title = item2.meta.title;
                      breadcrumbList.push(itemData3);
                    }
                  });
                }
              }
            });
          }
        }
      });
      $this.breadcrumbList = breadcrumbList;
    },

    // 重置选择项
    resetData(){
      var $this = this;
      $this.isSearch = false;
      $this.isAllPhone=false;
      $this.checkAllPhone=false;
      $this.phoneCount=0;
      $this.checkedPhone = [];
      $this.productCount=0;
      $this.isAllProduct=false;
      $this.checkAllProduct=false;
      $this.isAllA1Product=false;
      $this.checkAllA1Product=false;
      $this.isAllA2Product=false;
      $this.checkAllA2Product=false;
      $this.isAllA3Product=false;
      $this.checkAllA3Product=false;
      $this.isAllA4Product=false;
      $this.checkAllA4Product=false;
      $this.isAllA5Product=false;
      $this.checkAllA5Product=false;
      $this.isAllA6Product=false;
      $this.checkAllA6Product=false;
      $this.isAllA7Product=false;
      $this.checkAllA7Product=false;
      $this.isAllA8Product=false;
      $this.checkAllA8Product=false;
      $this.isAllA9Product=false;
      $this.checkAllA9Product=false;
      $this.isAllA10Product=false;
      $this.checkAllA10Product=false;
      $this.isAllA11Product=false;
      $this.checkAllA11Product=false;
      $this.isAllA12Product=false;
      $this.checkAllA12Product=false;
      $this.isAllA13Product=false;
      $this.checkAllA13Product=false;
      $this.checkedA1Product=[];
      $this.checkedA2Product=[];
      $this.checkedA3Product=[];
      $this.checkedA4Product=[];
      $this.checkedA5Product=[];
      $this.checkedA6Product=[];
      $this.checkedA7Product=[];
      $this.checkedA8Product=[];
      $this.checkedA9Product=[];
      $this.checkedA10Product=[];
      $this.checkedA11Product=[];
      $this.checkedA12Product=[];
      $this.checkedA13Product=[];
      $this.isAllSource=false;
      $this.checkAllSource=false;
      $this.checkedSource=[];
      $this.isAllContinent=false;
      $this.checkAllContinent=false;
      $this.checkedContinent=[];
      $this.isAllCategory=false;
      $this.checkAllCategory=false;
      $this.checkedCategory=[];
      $this.isAllDevice=false;
      $this.checkAllDevice=false;
      $this.checkedDevice=[];
      $this.isAllResult = false;
      $this.checkAllResult = false;
      $this.checkedResult = [];
      $this.searchData.date=[];
      $this.searchData.name='';
      $this.searchResult.allInquiryCount=[];
      $this.searchResult.trendScoreCount=[];
      $this.searchResult.trendInquiryCount=[];
      $this.searchResult.productScoreCount={};
      $this.searchResult.productInquiryCount={};
      $this.searchResult.searchInquiryCount=[];
      $this.searchResult.searchScoreCount=[];
      $this.searchResult.findInquiryCount=[];
      $this.searchResult.findScoreCount=[];
      $this.searchResult.continentInquiryCount={};
      $this.searchResult.continentScoreCount={};
      $this.isExportDisabled = true;
      $this.resultShowList.forEach(item=>{
        if(item.value==4 || item.value==5 || item.value==10 || item.value==11){
          item.disabled = true;
        }else{
          item.disabled = false;
        }
      })
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.getSearchSystemData();
    },
    // 组装搜索接口所需数据
    initSearchData(){
      var $this = this;
      var searchData = {};
      searchData.keyword = $this.searchData.name;
      if($this.searchData.date&&$this.searchData.date.length>0){
        searchData.starttime = $this.searchData.date[0];
        searchData.endtime = $this.searchData.date[1];
      }else{
        searchData.starttime = "";
        searchData.endtime = "";
      }
      searchData.phoneid = $this.checkedPhone;
      searchData.mode = $this.checkedSource;
      searchData.continent = $this.checkedContinent;
      searchData.device = $this.checkedDevice;
      searchData.type = $this.checkedResult;
      
      var checkedA1Product = $this.checkedA1Product;
      var checkedA2Product = $this.checkedA2Product;
      var checkedA3Product = $this.checkedA3Product;
      var checkedA4Product = $this.checkedA4Product;
      var checkedA5Product = $this.checkedA5Product;
      var checkedA6Product = $this.checkedA6Product;
      var checkedA7Product = $this.checkedA7Product;
      var checkedA8Product = $this.checkedA8Product;
      var checkedA9Product = $this.checkedA9Product;
      var checkedA10Product = $this.checkedA10Product;
      var checkedA11Product = $this.checkedA11Product;
      var checkedA12Product = $this.checkedA12Product;
      var checkedA13Product = $this.checkedA13Product;
      searchData.productid=checkedA1Product.concat(checkedA2Product).concat(checkedA3Product).concat(checkedA4Product).concat(checkedA5Product).concat(checkedA6Product).concat(checkedA7Product).concat(checkedA8Product).concat(checkedA9Product).concat(checkedA10Product).concat(checkedA11Product).concat(checkedA12Product).concat(checkedA13Product);
      return searchData;
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
            if($this.menuButtonPermit.includes('Ownpush_enintentioncount')){
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
    // 获取询盘统计的搜索条件数据
    getSearchSystemData(){
      var $this = this;
      $this.$store.dispatch('ownpush/getEnIntentionConditonAction').then(response=>{
        if(response){
          if(response.status){
            var deviceList = [];
            response.device.forEach(function(item,index){
              var itemData = {};
              if(item.name){
                itemData.label = item.name;
                itemData.value = item.name;
              }else{
                itemData.label = "未标记";
                itemData.value = "";
              }
              deviceList.push(itemData);
            });
            $this.deviceList = deviceList;
            var productList = [];
            var productCount = 0;
            response.producttype.forEach(function(item,index){
              var itemData = {};
              itemData.name = item.name;
              itemData.id = item.id;
              itemData.icon = "a"+item.id;
              itemData.children = [];
              productCount += item.product.length;
              item.product.forEach(function(item1,index1){
                var itemChildren = {};
                itemChildren.label = item1.name;
                itemChildren.value = item1.id;
                itemData.children.push(itemChildren);
              });
              productList.push(itemData);
            });
            $this.productList = productList;
            $this.productCount = productCount;

            var phoneList = [];
            var phoneCount = 0;
            response.phone.forEach(function(item,index){
                var newobj={};
                newobj.label=item.phonenumber;
                newobj.value=item.id;
                phoneList.push(newobj);
                phoneCount++;
            })
            $this.phoneList = phoneList;
            $this.phoneCount = phoneCount;

            var sourceList = [];
            response.sourcetype.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              sourceList.push(itemData);
            });
            $this.sourceList = sourceList;

            var continentList = [];
            response.continent.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.ContinentName;
              itemData.value = item.ContinentID;
              continentList.push(itemData);
            });
            $this.continentList = continentList;
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
    getSearchResult(){
      var $this = this;
      $this.gochart = true;
      $this.getCluesAnalysisData();
    },
    // 获取统计数据
    getCluesAnalysisData(){
      var $this = this;
      if(!$this.isDisabled){
        var searchData = $this.initSearchData();
        if(searchData.phoneid.length == 0){
          $this.$message({
              showClose: true,
              message: '错误：请至少选择一个电话！',
              type: 'error'
          });
          return false;
        }
        if($this.searchData.date.length == 0){
          $this.$message({
              showClose: true,
              message: '错误：请选择查询时间范围！',
              type: 'error'
          });
          return false;
        }
        $this.isDisabled=true;
        $this.$store.dispatch('ownpush/getEnIntentionCountAction', searchData).then(response=>{
          if(response){
            if(response.status){
              $this.isSearch=true;
              $this.searchResult.allInquiryCount = response.monthxuntrend ? response.monthxuntrend : [];
              $this.searchResult.trendScoreCount = response.buyscorertrend ? response.buyscorertrend : [];
              $this.searchResult.trendInquiryCount = response.buynumbertrend ? response.buynumbertrend : [];
              $this.searchResult.searchInquiryCount = response.searchxuntrend ? response.searchxuntrend : [];
              $this.searchResult.searchScoreCount = response.searchscoretrend ? response.searchscoretrend : [];
              $this.searchResult.findInquiryCount = response.lookxuntrend ? response.lookxuntrend : [];
              $this.searchResult.findScoreCount = response.lookscoretrend ? response.lookscoretrend : [];
              // 产品
              // $this.searchResult.productScoreCount = response.proscoretrend;
              // $this.searchResult.productInquiryCount = response.pronumbertrend;
              // 产品意向分
              var ChartColor=["#044bff","#fe4c46","#fdcb66","#47cbfe","#19adaf","#91cb74","#ff8d61","#9a60b4","#e522db","#59678c","#95706d","#c05050","#dc69aa","#c14089"]; 
              var proscoredate = [];
              var proscoredata = [];
              var proscorecatelist = [];
              var proscore = response.proscoretrend ? response.proscoretrend : [];
              if(proscore.length > 0){
                proscore.forEach((item,index)=>{
                  proscorecatelist.push(item[0].name);
                  var nowarr = [];
                  item.forEach(subitem=>{
                    if(index == 0){
                      proscoredate.push(subitem.date)
                    }
                    nowarr.push(subitem.score)
                  })
                  proscoredata.push(nowarr)
                })
              }
              
              var proscoretrend = {};
              proscoretrend.proscoredate = proscoredate;
              proscoretrend.proscoredata = proscoredata;
              proscoretrend.ChartColor = ChartColor;
              proscoretrend.proscorecatelist = proscorecatelist;
              $this.searchResult.productScoreCount = proscoretrend;
              // 产品询盘
              var pronumberdate = [];
              var pronumberdata = [];
              var pronumcatelist = [];
              var pronumber = response.pronumbertrend ? response.pronumbertrend : [];
              if(pronumber.length > 0){
                pronumber.forEach((item,index)=>{
                  pronumcatelist.push(item[0].name);
                  var nowarr = [];
                  item.forEach(subitem=>{
                    if(index == 0){
                      pronumberdate.push(subitem.date)
                    }
                    nowarr.push(subitem.number)
                  })
                  pronumberdata.push(nowarr)
                })
              }
              
              var pronumbertrend = {};
              pronumbertrend.pronumberdate = pronumberdate;
              pronumbertrend.pronumberdata = pronumberdata;
              pronumbertrend.ChartColor = ChartColor;
              pronumbertrend.pronumcatelist = pronumcatelist;
              $this.searchResult.productInquiryCount = pronumbertrend;

              // 大洲
              // $this.searchResult.continentInquiryCount = response.contientxuntrend ? response.contientxuntrend : [];
              // $this.searchResult.continentScoreCount = response.contientscoretrend ? response.contientscoretrend : [];
              // 大洲意向分
              var continentscoredate = [];
              var continentscoredata = [];
              var continentlist = [];
              var continentscore = response.contientscoretrend ? response.contientscoretrend : [];
              if(continentscore.length > 0){
                continentscore.forEach((item,index)=>{
                  continentlist.push(item[0].continent);
                  var nowarr = [];
                  item.forEach(subitem=>{
                    if(index == 0){
                      continentscoredate.push(subitem.date)
                    }
                    nowarr.push(subitem.score)
                  })
                  continentscoredata.push(nowarr)
                })
              }
              
              var continentscoretrend = {};
              continentscoretrend.continentscoredate = continentscoredate;
              continentscoretrend.continentscoredata = continentscoredata;
              continentscoretrend.ChartColor = ChartColor;
              continentscoretrend.continentlist = continentlist;
              $this.searchResult.continentScoreCount = continentscoretrend;
              // 大洲询盘
              var continentxundate = [];
              var continentxundata = [];
              var continentlist = [];
              var continentxun = response.contientxuntrend ? response.contientxuntrend : [];
              if(continentxun.length > 0){
                continentxun.forEach((item,index)=>{
                  continentlist.push(item[0].continent);
                  var nowarr = [];
                  item.forEach(subitem=>{
                    if(index == 0){
                      continentxundate.push(subitem.date)
                    }
                    nowarr.push(subitem.number)
                  })
                  continentxundata.push(nowarr)
                })
              }
              
              var continentxuntrend = {};
              continentxuntrend.continentxundate = continentxundate;
              continentxuntrend.continentxundata = continentxundata;
              continentxuntrend.ChartColor = ChartColor;
              continentxuntrend.continentlist = continentlist;
              $this.searchResult.continentInquiryCount = continentxuntrend;

              $this.$nextTick(()=>{
                
                document.getElementById("canvasPane").scrollIntoView({behavior: "smooth"});
                $this.isExportDisabled = false;
                if($this.checkedResult.includes(1)){
                  if($this.chartlist.allInquiryPlot){
                    $this.chartlist.allInquiryPlot.dispose();
                    $this.drawAllInquiryChart();
                  }else{
                    $this.drawAllInquiryChart();
                  }
                }

                if($this.checkedResult.includes(2)){
                  if($this.chartlist.trendScorePlot){
                    $this.chartlist.trendScorePlot.dispose();
                    $this.drawTrendScoreChart();
                  }else{
                    $this.drawTrendScoreChart();
                  }
                }

                if($this.checkedResult.includes(3)){
                  if($this.chartlist.trendInquiryPlot){
                    $this.chartlist.trendInquiryPlot.dispose();
                    $this.drawTrendInquiryChart();
                  }else{
                    $this.drawTrendInquiryChart();
                  }
                }

                if($this.checkedResult.includes(5)){
                  if($this.chartlist.productScorePlot){
                    $this.chartlist.productScorePlot.dispose();
                    $this.drawProductScoreChart();
                  }else{
                    $this.drawProductScoreChart();
                  }
                }

                if($this.checkedResult.includes(4)){
                  if($this.chartlist.productInquiryPlot){
                    $this.chartlist.productInquiryPlot.dispose();
                    $this.drawProductInquiryChart();
                  }else{
                    $this.drawProductInquiryChart();
                  }
                }
                if($this.checkedResult.includes(7)){
                  if($this.chartlist.searchScorePlot){
                    $this.chartlist.searchScorePlot.dispose();
                    $this.drawSearchScoreChart();
                  }else{
                    $this.drawSearchScoreChart();
                  }
                }

                if($this.checkedResult.includes(6)){
                  if($this.chartlist.searchInquiryPlot){
                    $this.chartlist.searchInquiryPlot.dispose();
                    $this.drawSearchInquiryChart();
                  }else{
                    $this.drawSearchInquiryChart();
                  }
                }

                if($this.checkedResult.includes(9)){
                  if($this.chartlist.findScorePlot){
                    $this.chartlist.findScorePlot.dispose();
                    $this.drawFindScoreChart();
                  }else{
                    $this.drawFindScoreChart();
                  }
                }

                if($this.checkedResult.includes(8)){
                  if($this.chartlist.findInquiryPlot){
                    $this.chartlist.findInquiryPlot.dispose();
                    $this.drawFindInquiryChart();
                  }else{
                    $this.drawFindInquiryChart();
                  }
                }

                if($this.checkedResult.includes(11)){
                  if($this.chartlist.continentScorePlot){
                    $this.chartlist.continentScorePlot.dispose();
                    $this.drawContinentScoreChart();
                  }else{
                    if($this.searchResult.continentScoreCount.continentscoredata.length > 0){
                      $this.drawContinentScoreChart();
                    } 
                  }
                }

                if($this.checkedResult.includes(10)){
                  if($this.chartlist.continentInquiryPlot){
                    $this.chartlist.continentInquiryPlot.dispose();
                    $this.drawContinentInquiryChart();
                  }else{
                    if($this.searchResult.continentInquiryCount.continentxundata.length > 0){     
                      $this.drawContinentInquiryChart();
                    }
                  }
                }

              });
              setTimeout(()=>{
                $this.isDisabled=false;
              },1000);
            }else{
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
              });
              setTimeout(()=>{
                $this.isDisabled=false;
              },1000);
            }
          }
        });
      }
    },
    // 选中所有电话事件
    handleCheckAllPhoneChange(e){
      var $this = this;
      if(e){
        var checkedItem = [];
        $this.phoneList.forEach(function(item,index){
          checkedItem.push(item.value);
        });
        $this.checkedPhone = checkedItem;
        $this.checkAllPhone= true;
      }else{
        $this.checkedPhone = [];
        $this.checkAllPhone = false;
      }
      $this.isAllPhone = false;
    },
    handleCheckedPhoneChange(e){
      var $this = this;
      var checkedCount = e.length;
       if(checkedCount === $this.phoneList.length){
          $this.checkAllPhone = true;
        }else{
          $this.checkAllPhone = false;
        }
        if(checkedCount>0&&checkedCount<$this.phoneList.length){
          $this.isAllPhone = true;
        }else{
          $this.isAllPhone = false;
        }
    },
    // 全选按钮状态事件
    allPhoneSelectedStatus(){
      var $this = this;
      var totalCheckedCount = $this.checkedPhone.length;
      if(totalCheckedCount>0&&totalCheckedCount<$this.phoneCount){
        $this.isAllPhone = true;
      }else{
        $this.isAllPhone = false;
      }
      if(totalCheckedCount == $this.phoneCount){
        $this.checkAllPhone = true;
      }else{
        $this.checkAllPhone = false;
      }
    },

    // 选中所有产品事件
    handleCheckAllProductChange(e){
      var $this = this;
      if(e){
        $this.productList.forEach(function(item,index){
          var checkedList = [];
          if(item.icon=="a1"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedA1Product = checkedList;
            $this.checkAllA1Product= true;
          }else if(item.icon=="a2"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedA2Product = checkedList;
            $this.checkAllA2Product = true;
          }else if(item.icon=="a3"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedA3Product = checkedList;
            $this.checkAllA3Product = true;
          }else if(item.icon=="a4"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedA4Product = checkedList;
            $this.checkAllA4Product = true;
          }else if(item.icon=="a5"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedA5Product = checkedList;
            $this.checkAllA5Product = true;
          }else if(item.icon=="a6"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedA6Product = checkedList;
            $this.checkAllA6Product = true;
          }else if(item.icon=="a7"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedA7Product = checkedList;
            $this.checkAllA7Product = true;
          }else if(item.icon=="a8"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedA8Product = checkedList;
            $this.checkAllA8Product = true;
          }else if(item.icon=="a9"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedA9Product = checkedList;
            $this.checkAllA9Product = true;
          }else if(item.icon=="a10"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedA10Product = checkedList;
            $this.checkAllA10Product = true;
          }else if(item.icon=="a11"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedA11Product = checkedList;
            $this.checkAllA11Product = true;
          }else if(item.icon=="a12"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedA12Product = checkedList;
            $this.checkAllA12Product = true;
          }else if(item.icon=="a13"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedA13Product = checkedList;
            $this.checkAllA13Product = true;
          }
        });

        $this.resultShowList.forEach(item=>{
          if(item.value == 4 || item.value == 5){
            item.disabled = false;
          }
        })

      }else{
        $this.checkedA1Product = [];
        $this.checkedA2Product = [];
        $this.checkedA3Product = [];
        $this.checkedA4Product = [];
        $this.checkedA5Product = [];
        $this.checkedA6Product = [];
        $this.checkedA7Product = [];
        $this.checkedA8Product = [];
        $this.checkedA9Product = [];
        $this.checkedA10Product = [];
        $this.checkedA11Product = [];
        $this.checkedA12Product = [];
        $this.checkedA13Product = [];
        $this.checkAllA1Product = false;
        $this.checkAllA2Product = false;
        $this.checkAllA3Product = false;
        $this.checkAllA4Product = false;
        $this.checkAllA5Product = false;
        $this.checkAllA6Product = false;
        $this.checkAllA7Product = false;
        $this.checkAllA8Product = false;
        $this.checkAllA9Product = false;
        $this.checkAllA10Product = false;
        $this.checkAllA11Product = false;
        $this.checkAllA12Product = false;
        $this.checkAllA13Product = false;

        $this.resultShowList.forEach(item=>{
          if(item.value == 4 || item.value == 5){
            item.disabled = true;
          }
        })

      }
      $this.isAllProduct = false;
      $this.isAllA1Product = false;
      $this.isAllA2Product = false;
      $this.isAllA3Product = false;
      $this.isAllA4Product = false;
      $this.isAllA5Product = false;
      $this.isAllA6Product = false;
      $this.isAllA7Product = false;
      $this.isAllA8Product = false;
      $this.isAllA9Product = false;
      $this.isAllA10Product = false;
      $this.isAllA11Product = false;
      $this.isAllA12Product = false;
      $this.isAllA13Product = false;
    },
    handleCheckAllA1ProductChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.productList.forEach(function(item,index){
          if(item.icon=="a1"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedA1Product = checkedList;
      }else{
        $this.checkedA1Product = [];
      }
      $this.isAllA1Product = false;
      $this.allProductSelectedStatus();
    },
    handleCheckAllA2ProductChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.productList.forEach(function(item,index){
          if(item.icon=="a2"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedA2Product = checkedList;
      }else{
        $this.checkedA2Product = [];
      }
      $this.isAllA2Product = false;
      $this.allProductSelectedStatus();
    },
    handleCheckAllA3ProductChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.productList.forEach(function(item,index){
          if(item.icon=="a3"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedA3Product = checkedList;
      }else{
        $this.checkedA3Product = [];
      }
      $this.isAllA3Product = false;
      $this.allProductSelectedStatus();
    },
    handleCheckAllA4ProductChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.productList.forEach(function(item,index){
          if(item.icon=="a4"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedA4Product = checkedList;
      }else{
        $this.checkedA4Product = [];
      }
      $this.isAllA4Product = false;
      $this.allProductSelectedStatus();
    },
    handleCheckAllA5ProductChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.productList.forEach(function(item,index){
          if(item.icon=="a5"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedA5Product = checkedList;
      }else{
        $this.checkedA5Product = [];
      }
      $this.isAllA5Product = false;
      $this.allProductSelectedStatus();
    },
    handleCheckAllA6ProductChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.productList.forEach(function(item,index){
          if(item.icon=="a6"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedA6Product = checkedList;
      }else{
        $this.checkedA6Product = [];
      }
      $this.isAllA6Product = false;
      $this.allProductSelectedStatus();
    },
    handleCheckAllA7ProductChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.productList.forEach(function(item,index){
          if(item.icon=="a7"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedA7Product = checkedList;
      }else{
        $this.checkedA7Product = [];
      }
      $this.isAllA7Product = false;
      $this.allProductSelectedStatus();
    },
    handleCheckAllA8ProductChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.productList.forEach(function(item,index){
          if(item.icon=="a8"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedA8Product = checkedList;
      }else{
        $this.checkedA8Product = [];
      }
      $this.isAllA8Product = false;
      $this.allProductSelectedStatus();
    },
    handleCheckAllA9ProductChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.productList.forEach(function(item,index){
          if(item.icon=="a9"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedA9Product = checkedList;
      }else{
        $this.checkedA9Product = [];
      }
      $this.isAllA9Product = false;
      $this.allProductSelectedStatus();
    },
    handleCheckAllA10ProductChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.productList.forEach(function(item,index){
          if(item.icon=="a10"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedA10Product = checkedList;
      }else{
        $this.checkedA10Product = [];
      }
      $this.isAllA10Product = false;
      $this.allProductSelectedStatus();
    },
    handleCheckAllA11ProductChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.productList.forEach(function(item,index){
          if(item.icon=="a11"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedA11Product = checkedList;
      }else{
        $this.checkedA11Product = [];
      }
      $this.isAllA11Product = false;
      $this.allProductSelectedStatus();
    },
    handleCheckAllA12ProductChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.productList.forEach(function(item,index){
          if(item.icon=="a12"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedA12Product = checkedList;
      }else{
        $this.checkedA12Product = [];
      }
      $this.isAllA12Product = false;
      $this.allProductSelectedStatus();
    },
    handleCheckAllA13ProductChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.productList.forEach(function(item,index){
          if(item.icon=="a13"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedA13Product = checkedList;
      }else{
        $this.checkedA13Product = [];
      }
      $this.isAllA13Product = false;
      $this.allProductSelectedStatus();
    },
    handleCheckedA1ProductChange(e){
      var $this = this;
      var checkedCount = e.length;
      $this.productList.forEach(function(item,index){
        if(item.icon=="a1"){
          if(checkedCount === item.children.length){
            $this.checkAllA1Product = true;
          }else{
            $this.checkAllA1Product = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllA1Product = true;
          }else{
            $this.isAllA1Product = false;
          }
        }
      });
      $this.allProductSelectedStatus();
    },
    handleCheckedA2ProductChange(e){
      var $this = this;
      var checkedCount = e.length;
       $this.productList.forEach(function(item,index){
        if(item.icon=="a2"){
          if(checkedCount === item.children.length){
            $this.checkAllA2Product = true;
          }else{
            $this.checkAllA2Product = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllA2Product = true;
          }else{
            $this.isAllA2Product = false;
          }
        }
      });
      $this.allProductSelectedStatus();
    },
    handleCheckedA3ProductChange(e){
      var $this = this;
      var checkedCount = e.length;
       $this.productList.forEach(function(item,index){
        if(item.icon=="a3"){
          if(checkedCount === item.children.length){
            $this.checkAllA3Product = true;
          }else{
            $this.checkAllA3Product = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllA3Product = true;
          }else{
            $this.isAllA3Product = false;
          }
        }
      });
      $this.allProductSelectedStatus();
    },
    handleCheckedA4ProductChange(e){
      var $this = this;
      var checkedCount = e.length;
       $this.productList.forEach(function(item,index){
        if(item.icon=="a4"){
          if(checkedCount === item.children.length){
            $this.checkAllA4Product = true;
          }else{
            $this.checkAllA4Product = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllA4Product = true;
          }else{
            $this.isAllA4Product = false;
          }
        }
      });
      $this.allProductSelectedStatus();
    },
    handleCheckedA5ProductChange(e){
      var $this = this;
      var checkedCount = e.length;
       $this.productList.forEach(function(item,index){
        if(item.icon=="a5"){
          if(checkedCount === item.children.length){
            $this.checkAllA5Product = true;
          }else{
            $this.checkAllA5Product = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllA5Product = true;
          }else{
            $this.isAllA5Product = false;
          }
        }
      });
      $this.allProductSelectedStatus();
    },
    handleCheckedA6ProductChange(e){
      var $this = this;
      var checkedCount = e.length;
       $this.productList.forEach(function(item,index){
        if(item.icon=="a6"){
          if(checkedCount === item.children.length){
            $this.checkAllA6Product = true;
          }else{
            $this.checkAllA6Product = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllA6Product = true;
          }else{
            $this.isAllA6Product = false;
          }
        }
      });
      $this.allProductSelectedStatus();
    },
    handleCheckedA7ProductChange(e){
      var $this = this;
      var checkedCount = e.length;
       $this.productList.forEach(function(item,index){
        if(item.icon=="a7"){
          if(checkedCount === item.children.length){
            $this.checkAllA7Product = true;
          }else{
            $this.checkAllA7Product = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllA7Product = true;
          }else{
            $this.isAllA7Product = false;
          }
        }
      });
      $this.allProductSelectedStatus();
    },
    handleCheckedA8ProductChange(e){
      var $this = this;
      var checkedCount = e.length;
       $this.productList.forEach(function(item,index){
        if(item.icon=="a8"){
          if(checkedCount === item.children.length){
            $this.checkAllA8Product = true;
          }else{
            $this.checkAllA8Product = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllA8Product = true;
          }else{
            $this.isAllA8Product = false;
          }
        }
      });
      $this.allProductSelectedStatus();
    },
    handleCheckedA9ProductChange(e){
      var $this = this;
      var checkedCount = e.length;
       $this.productList.forEach(function(item,index){
        if(item.icon=="a9"){
          if(checkedCount === item.children.length){
            $this.checkAllA9Product = true;
          }else{
            $this.checkAllA9Product = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllA9Product = true;
          }else{
            $this.isAllA9Product = false;
          }
        }
      });
      $this.allProductSelectedStatus();
    },
    handleCheckedA10ProductChange(e){
      var $this = this;
      var checkedCount = e.length;
       $this.productList.forEach(function(item,index){
        if(item.icon=="a10"){
          if(checkedCount === item.children.length){
            $this.checkAllA10Product = true;
          }else{
            $this.checkAllA10Product = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllA10Product = true;
          }else{
            $this.isAllA10Product = false;
          }
        }
      });
      $this.allProductSelectedStatus();
    },
    handleCheckedA11ProductChange(e){
      var $this = this;
      var checkedCount = e.length;
       $this.productList.forEach(function(item,index){
        if(item.icon=="a11"){
          if(checkedCount === item.children.length){
            $this.checkAllA11Product = true;
          }else{
            $this.checkAllA11Product = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllA11Product = true;
          }else{
            $this.isAllA11Product = false;
          }
        }
      });
      $this.allProductSelectedStatus();
    },
    handleCheckedA12ProductChange(e){
      var $this = this;
      var checkedCount = e.length;
       $this.productList.forEach(function(item,index){
        if(item.icon=="a12"){
          if(checkedCount === item.children.length){
            $this.checkAllA12Product = true;
          }else{
            $this.checkAllA12Product = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllA12Product = true;
          }else{
            $this.isAllA12Product = false;
          }
        }
      });
      $this.allProductSelectedStatus();
    },
    handleCheckedA13ProductChange(e){
      var $this = this;
      var checkedCount = e.length;
       $this.productList.forEach(function(item,index){
        if(item.icon=="a13"){
          if(checkedCount === item.children.length){
            $this.checkAllA13Product = true;
          }else{
            $this.checkAllA13Product = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllA13Product = true;
          }else{
            $this.isAllA13Product = false;
          }
        }
      });
      $this.allProductSelectedStatus();
    },
    // 全选按钮状态事件
    allProductSelectedStatus(){
      var $this = this;
      var totalCheckedCount = $this.checkedA1Product.length+$this.checkedA2Product.length+$this.checkedA3Product.length+$this.checkedA4Product.length+$this.checkedA5Product.length+$this.checkedA6Product.length+$this.checkedA7Product.length+$this.checkedA8Product.length+$this.checkedA9Product.length+$this.checkedA10Product.length+$this.checkedA11Product.length+$this.checkedA12Product.length+$this.checkedA13Product.length;
      if(totalCheckedCount>0&&totalCheckedCount<$this.productCount){
        $this.isAllProduct = true;
      }else{
        $this.isAllProduct = false;
      }
      if(totalCheckedCount == $this.productCount){
        $this.checkAllProduct = true;
      }else{
        $this.checkAllProduct = false;
      }
      if(totalCheckedCount > 0){
        $this.resultShowList.forEach(item=>{
          if(item.value == 4 || item.value == 5){
            item.disabled = false;
          }
        })
      }else{
        $this.resultShowList.forEach(item=>{
          if(item.value == 4 || item.value == 5){
            item.disabled = true;
          }
        })
      }
    },

    handleCheckAllSourceChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.sourceList.forEach(function(item,index){
          checkedList.push(item.value);
        });
        $this.checkedSource = checkedList;
        $this.checkAllSource= true;
      }else{
        $this.checkedSource = [];
        $this.checkAllSource = false;
      }
      $this.isAllSource = false;
    },
    handleCheckedSourceChange(e){
      var $this = this;
      var checkedCount = e.length;
       if(checkedCount === $this.sourceList.length){
          $this.checkAllSource = true;
        }else{
          $this.checkAllSource = false;
        }
        if(checkedCount>0&&checkedCount<$this.sourceList.length){
          $this.isAllSource = true;
        }else{
          $this.isAllSource = false;
        }
    },
    handleCheckAllContinentChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.continentList.forEach(function(item,index){
          checkedList.push(item.label);
        });
        $this.checkedContinent = checkedList;
        $this.checkAllContinent= true;
        $this.resultShowList.forEach(item=>{
          if(item.value == 10 || item.value == 11){
            item.disabled = false;
          }
        })
      }else{
        $this.checkedContinent = [];
        $this.checkAllContinent = false;
        $this.resultShowList.forEach(item=>{
          if(item.value == 10 || item.value == 11){
            item.disabled = true;
          }
        })
      }
      $this.isAllContinent = false;
    },
    handleCheckedContinentChange(e){
      var $this = this;
      var checkedCount = e.length;
       if(checkedCount === $this.continentList.length){
          $this.checkAllContinent = true;
        }else{
          $this.checkAllContinent = false;
        }
        if(checkedCount>0&&checkedCount<$this.continentList.length){
          $this.isAllContinent = true;
        }else{
          $this.isAllContinent = false;
        }
        if(checkedCount > 0){
          $this.resultShowList.forEach(item=>{
            if(item.value == 10 || item.value == 11){
              item.disabled = false;
            }
          })
        }else{
          $this.resultShowList.forEach(item=>{
            if(item.value == 10 || item.value == 11){
              item.disabled = true;
            }
          })
        }
    },
    handleCheckAllDeviceChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.deviceList.forEach(function(item,index){
          checkedList.push(item.value);
        });
        $this.checkedDevice = checkedList;
        $this.checkAllDevice= true;
      }else{
        $this.checkedDevice = [];
        $this.checkAllDevice = false;
      }
      $this.isAllDevice = false;
    },
    handleCheckedDeviceChange(e){
      var $this = this;
      var checkedCount = e.length;
       if(checkedCount === $this.deviceList.length){
          $this.checkAllDevice = true;
        }else{
          $this.checkAllDevice = false;
        }
        if(checkedCount>0&&checkedCount<$this.deviceList.length){
          $this.isAllDevice = true;
        }else{
          $this.isAllDevice = false;
        }
    },
    // 分析项筛选
    handleCheckAllResultChange(e){
      var $this = this;
      if(e){
        var checkedResult = [];
        $this.resultShowList.forEach(function(item,index){
          if(item.disabled == false){
             checkedResult.push(item.value);
          }
        });
        $this.checkedResult = checkedResult;
        if(checkedResult.length == $this.resultShowList.length){
          $this.checkAllResult = true;
          $this.isAllResult = false;
        }else{
           $this.checkAllResult = false;
           $this.isAllResult = true;
        }
        
      }else{
        $this.checkedResult = [];
        $this.checkAllResult = false;
        $this.isAllResult = false;
      }
      
    },
    handleCheckedResultChange(e){
      var $this = this;
      var checkedCount = e.length;
       if(checkedCount === $this.resultShowList.length){
          $this.checkAllResult = true;
        }else{
          $this.checkAllResult = false;
        }
        if(checkedCount>0&&checkedCount<$this.resultShowList.length){
          $this.isAllResult = true;
        }else{
          $this.isAllResult = false;
        }
    },
    // 图表功能
    // 所有询盘
    drawAllInquiryChart(){
      var $this = this;
      if($this.searchResult.allInquiryCount.length>0){
        var chartDom = document.getElementById('allinquiry');
        var myChart = echarts.init(chartDom);
        var option;

        option = {
          grid:{
            left: '35',
            top:'25',
            right:'15',
            bottom: '25'
          },
          tooltip:{
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "line", 
              lineStyle:{
                color: "#044bff"
              }
            },
            formatter(params){
              return `<div class="toolDiv">
                    <div class="tooltitle">${params[0].name}</div>
                    <div class="bar clearfix">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#044bff;"></span>
                      <span>${params[0].seriesName}：</span>
                      <span>${params[0].data.number}</span>
                    </div>
                  </div>`;
            }
          },
          xAxis: {
            type: 'category',
            name: "日期",
            axisLine:{
              lineStyle:{
                color: "#dedede"
              }
            },
            axisLabel:{
              color: "#888"
            }
          },
          yAxis: {
            type: 'value',
            axisLabel:{
              color: "#888"
            }
          },
          dataset:{
            source: $this.searchResult.allInquiryCount,  
          },
          animation: false,
          series: [
            {
              name: "询盘个数",
              type: 'line',
              symbol:'circle',
              symbolSize: '5',
              label:{
                show: true,
                position: 'top',
                distance: '5',
              },
              itemStyle:{
                color: '#fff',
                borderColor: "#044bff",
                borderWidth: 1
              },
              areaStyle:{
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "#044bff",
                      opacity:1
                    },
                    {
                      offset: 1,
                      color: "rgba(255, 255, 255, 0)",
                    }
                ]),
                opacity:0.3
              },
              lineStyle:{
                color: "#044bff",
                width: 1
              },
              emphasis:{
                lineStyle: {
                  width: 2,
                },
                itemStyle:{
                  borderWidth: 2
                }
              }
            }
          ]
        };

        option && myChart.setOption(option);
        $this.chartlist.allInquiryPlot = myChart;
      }
    },
    // 意向分
    drawTrendScoreChart(){
      var $this = this;
      if($this.searchResult.trendScoreCount.length>0){
        var chartDom = document.getElementById('trendscore');
        var myChart = echarts.init(chartDom);
        var option;

        option = {
          grid:{
            left: '35',
            top:'25',
            right:'15',
            bottom: '25'
          },
          tooltip:{
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "line", 
              lineStyle:{
                color: "#044bff"
              }
            },
            formatter(params){
              return `<div class="toolDiv">
                    <div class="tooltitle">${params[0].name}</div>
                    <div class="bar clearfix">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#044bff;"></span>
                      <span>${params[0].seriesName}：</span>
                      <span>${params[0].data.socre}</span>
                    </div>
                  </div>`;
            }
          },
          xAxis: {
            type: 'category',
            name: "日期",
            axisLine:{
              lineStyle:{
                color: "#dedede"
              }
            },
            axisLabel:{
              color: "#888"
            }
          },
          yAxis: {
            type: 'value',
            axisLabel:{
              color: "#888"
            }
          },
          dataset:{
            source: $this.searchResult.trendScoreCount,  
          },
          animation: false,
          series: [
            {
              name: "意向分数",
              type: 'line',
              symbol:'circle',
              symbolSize: '5',
              label:{
                show: true,
                position: 'top',
                distance: '5',
              },
              itemStyle:{
                color: '#fff',
                borderColor: "#044bff",
                borderWidth: 1
              },
              areaStyle:{
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "#044bff",
                      opacity:1
                    },
                    {
                      offset: 1,
                      color: "rgba(255, 255, 255, 0)",
                    }
                ]),
                opacity:0.3
              },
              lineStyle:{
                color: "#044bff",
                width: 1
              },
              emphasis:{
                lineStyle: {
                  width: 2,
                },
                itemStyle:{
                  borderWidth: 2
                }
              }
            }
          ]
        };

        option && myChart.setOption(option);
        $this.chartlist.trendScorePlot = myChart;
      }
    },
    // 意向询盘个数
    drawTrendInquiryChart(){
      var $this = this;
      
      if($this.searchResult.trendInquiryCount.length>0){
        var chartDom = document.getElementById('trendinquiry');
        var myChart = echarts.init(chartDom);
        var option;
       
        option = {
          grid:{
            left: '35',
            top:'25',
            right:'15',
            bottom: '25'
          },
          tooltip:{
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "line", 
              lineStyle:{
                color: "#044bff"
              }
            },
            formatter(params){
              return `<div class="toolDiv">
                    <div class="tooltitle">${params[0].name}</div>
                    <div class="bar clearfix">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#044bff;"></span>
                      <span>${params[0].seriesName}：</span>
                      <span>${params[0].data.number}</span>
                    </div>
                  </div>`;
            }
          },
          xAxis: {
            type: 'category',
            name: "日期",
            axisLine:{
              lineStyle:{
                color: "#dedede"
              }
            },
            axisLabel:{
              color: "#888"
            }
          },
          yAxis: {
            type: 'value',
            axisLabel:{
              color: "#888"
            }
          },
          dataset:{
            source: $this.searchResult.trendInquiryCount,  
          },
          animation: false,
          series: [
            {
              name: "意向个数",
              type: 'line',
              symbol:'circle',
              symbolSize: '5',
              label:{
                show: true,
                position: 'top',
                distance: '5',
              },
              itemStyle:{
                color: '#fff',
                borderColor: "#044bff",
                borderWidth: 1
              },
              areaStyle:{
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "#044bff",
                      opacity:1
                    },
                    {
                      offset: 1,
                      color: "rgba(255, 255, 255, 0)",
                    }
                ]),
                opacity:0.3
              },
              lineStyle:{
                color: "#044bff",
                width: 1
              },
              emphasis:{
                lineStyle: {
                  width: 2,
                },
                itemStyle:{
                  borderWidth: 2
                }
              }
            }
          ]
        };

        option && myChart.setOption(option);
        $this.chartlist.trendInquiryPlot = myChart;
      }
    },
    // 产品意向分
    drawProductScoreChart(){
      var $this = this;
      if($this.searchResult.productScoreCount.proscoredata.length>0){
        var chartDom = document.getElementById('productscore');
        var myChart = echarts.init(chartDom);
        var option;
        var series = [];
        $this.searchResult.productScoreCount.proscoredata.forEach((item, index)=>{
            var seriesobj = {
              name: $this.searchResult.productScoreCount.proscorecatelist[index],
              type: 'line',
              symbol:'circle',
              symbolSize: '5',
              data: item,
              label:{
                show: true,
                position: 'top',
                distance: '5',
              },
              itemStyle:{
                color: '#fff',
                borderColor: $this.searchResult.productScoreCount.ChartColor[index],
                borderWidth: 1
              },
              areaStyle:{
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color:$this.searchResult.productScoreCount.ChartColor[index],
                        opacity:1
                      },
                      {
                        offset: 1,
                        color: "rgba(255, 255, 255, 0)",
                      }
                  ]),
                  opacity:0.3
              },
              lineStyle:{
                color: $this.searchResult.productScoreCount.ChartColor[index],
                width: 1
              },
              emphasis:{
                lineStyle: {
                  width: 2,
                },
                itemStyle:{
                  borderWidth: 2
                }
              }
            }
            series.push(seriesobj)
        })

        option = {
          grid:{
            left: '35',
            top:'25',
            right:'15',
            bottom: '85'
          },
          tooltip:{
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "line", 
              lineStyle:{
                color: "#044bff"
              }
            },
            formatter(params){
              let returnData = `<div class="toolDiv">
                  <div class="tooltitle">${params[0].name}</div>`;
                  for (let i = 0; i < params.length; i++) {
                    returnData += `<div class="bar clearfix"><span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${params[i].borderColor};"></span>
                      <span class="tooltit">${params[i].seriesName}</span>
                      <span class="toolval">${params[i].value}</span></div>`;
                  }
                  returnData +=`</div>`;
                  
                return returnData;
            }
          },
          xAxis: {
            type: 'category',
            name: "日期",
            data: $this.searchResult.productScoreCount.proscoredate,
            axisLine:{
              lineStyle:{
                color: "#dedede"
              }
            },
            axisLabel:{
              color: "#888"
            }
          },
          yAxis: {
            type: 'value',
            axisLabel:{
              color: "#888"
            }
          },
          animation: false,
          series,
          legend:{
            type:'plain',
            show:true,
            bottom:0,
            orient:'horizontal',
            padding:0,
            textStyle: {
                color: "#555",
                fontSize: "12",
                lineHeight: 18,
            },
          }
        };

        option && myChart.setOption(option);
        $this.chartlist.productScorePlot = myChart;
      }
    },
    // 产品询盘个数
    drawProductInquiryChart(){
      var $this = this;
      if($this.searchResult.productInquiryCount.pronumberdata.length>0){
        var chartDom = document.getElementById('productinquiry');
        var myChart = echarts.init(chartDom);
        var option;
        var series = [];
        $this.searchResult.productInquiryCount.pronumberdata.forEach((item, index)=>{
            var seriesobj = {
              name: $this.searchResult.productInquiryCount.pronumcatelist[index],
              type: 'line',
              symbol:'circle',
              symbolSize: '5',
              data: item,
              label:{
                show: true,
                position: 'top',
                distance: '5',
              },
              itemStyle:{
                color: '#fff',
                borderColor: $this.searchResult.productInquiryCount.ChartColor[index],
                borderWidth: 1
              },
              areaStyle:{
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color:$this.searchResult.productInquiryCount.ChartColor[index],
                        opacity:1
                      },
                      {
                        offset: 1,
                        color: "rgba(255, 255, 255, 0)",
                      }
                  ]),
                  opacity:0.3
              },
              lineStyle:{
                color: $this.searchResult.productInquiryCount.ChartColor[index],
                width: 1
              },
              emphasis:{
                lineStyle: {
                  width: 2,
                },
                itemStyle:{
                  borderWidth: 2
                }
              }
            }
            series.push(seriesobj)
        })

        
        option = {
          grid:{
            left: '35',
            top:'25',
            right:'15',
            bottom: '85'
          },
          tooltip:{
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "line", 
              lineStyle:{
                color: "#044bff"
              }
            },
            formatter(params){
              let returnData = `<div class="toolDiv">
                  <div class="tooltitle">${params[0].name}</div>`;
                  for (let i = 0; i < params.length; i++) {
                    returnData += `<div class="bar clearfix"><span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${params[i].borderColor};"></span>
                      <span class="tooltit">${params[i].seriesName}</span>
                      <span class="toolval">${params[i].value}</span></div>`;
                  }
                  returnData +=`</div>`;

                return returnData;
            }
          },
          xAxis: {
            type: 'category',
            name: "日期",
            data: $this.searchResult.productInquiryCount.pronumberdate,
            axisLine:{
              lineStyle:{
                color: "#dedede"
              }
            },
            axisLabel:{
              color: "#888"
            }
          },
          yAxis: {
            type: 'value',
            axisLabel:{
              color: "#888"
            }
          },
          animation: false,
          series,
          legend:{
            type:'plain',
            show:true,
            bottom:0,
            orient:'horizontal',
            padding:0,
            textStyle: {
                color: "#555",
                fontSize: "12",
                lineHeight: 18,
            },
          }
        };

        option && myChart.setOption(option);
        $this.chartlist.productInquiryPlot = myChart;
      }
    },
    // 搜索意向分
    drawSearchScoreChart(){
      var $this = this;
      if($this.searchResult.searchScoreCount.length>0){
        var chartDom = document.getElementById('searchscore');
        var myChart = echarts.init(chartDom);
        var option;

        option = {
          grid:{
            left: '35',
            top:'25',
            right:'15',
            bottom: '25'
          },
          tooltip:{
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "line", 
              lineStyle:{
                color: "#044bff"
              }
            },
            formatter(params){
              return `<div class="toolDiv">
                    <div class="tooltitle">${params[0].name}</div>
                    <div class="bar clearfix">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#044bff;"></span>
                      <span>${params[0].seriesName}：</span>
                      <span>${params[0].data.score}</span>
                    </div>
                  </div>`;
            }
          },
          xAxis: {
            type: 'category',
            name: "日期",
            axisLine:{
              lineStyle:{
                color: "#dedede"
              }
            },
            axisLabel:{
              color: "#888"
            }
          },
          yAxis: {
            type: 'value',
            axisLabel:{
              color: "#888"
            }
          },
          dataset:{
            source: $this.searchResult.searchScoreCount,  
          },
          animation: false,
          series: [
            {
              name: "搜索意向分数",
              type: 'line',
              symbol:'circle',
              symbolSize: '5',
              label:{
                show: true,
                position: 'top',
                distance: '5',
              },
              itemStyle:{
                color: '#fff',
                borderColor: "#044bff",
                borderWidth: 1
              },
              areaStyle:{
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "#044bff",
                      opacity:1
                    },
                    {
                      offset: 1,
                      color: "rgba(255, 255, 255, 0)",
                    }
                ]),
                opacity:0.3
              },
              lineStyle:{
                color: "#044bff",
                width: 1
              },
              emphasis:{
                lineStyle: {
                  width: 2,
                },
                itemStyle:{
                  borderWidth: 2
                }
              }
            }
          ]
        };

        option && myChart.setOption(option);
        $this.chartlist.searchScorePlot = myChart;
      }
    },
    // 搜索询盘个数
    drawSearchInquiryChart(){
      var $this = this;
      if($this.searchResult.searchInquiryCount.length>0){
        var chartDom = document.getElementById('searchinquiry');
        var myChart = echarts.init(chartDom);
        var option;

        option = {
          grid:{
            left: '35',
            top:'25',
            right:'15',
            bottom: '25'
          },
          tooltip:{
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "line", 
              lineStyle:{
                color: "#044bff"
              }
            },
            formatter(params){
              return `<div class="toolDiv">
                    <div class="tooltitle">${params[0].name}</div>
                    <div class="bar clearfix">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#044bff;"></span>
                      <span>${params[0].seriesName}：</span>
                      <span>${params[0].data.number}</span>
                    </div>
                  </div>`;
            }
          },
          xAxis: {
            type: 'category',
            name: "日期",
            axisLine:{
              lineStyle:{
                color: "#dedede"
              }
            },
            axisLabel:{
              color: "#888"
            }
          },
          yAxis: {
            type: 'value',
            axisLabel:{
              color: "#888"
            }
          },
          dataset:{
            source: $this.searchResult.searchInquiryCount,  
          },
          animation: false,
          series: [
            {
              name: "搜索询盘个数",
              type: 'line',
              symbol:'circle',
              symbolSize: '5',
              label:{
                show: true,
                position: 'top',
                distance: '5',
              },
              itemStyle:{
                color: '#fff',
                borderColor: "#044bff",
                borderWidth: 1
              },
              areaStyle:{
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "#044bff",
                      opacity:1
                    },
                    {
                      offset: 1,
                      color: "rgba(255, 255, 255, 0)",
                    }
                ]),
                opacity:0.3
              },
              lineStyle:{
                color: "#044bff",
                width: 1
              },
              emphasis:{
                lineStyle: {
                  width: 2,
                },
                itemStyle:{
                  borderWidth: 2
                }
              }
            }
          ]
        };

        option && myChart.setOption(option);
        $this.chartlist.searchInquiryPlot = myChart;
      }
    },
    // 发现意向分
    drawFindScoreChart(){
      var $this = this;
      if($this.searchResult.findScoreCount.length>0){
        var chartDom = document.getElementById('findscore');
        var myChart = echarts.init(chartDom);
        var option;

        option = {
          grid:{
            left: '35',
            top:'25',
            right:'15',
            bottom: '25'
          },
          tooltip:{
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "line", 
              lineStyle:{
                color: "#044bff"
              }
            },
            formatter(params){
              return `<div class="toolDiv">
                    <div class="tooltitle">${params[0].name}</div>
                    <div class="bar clearfix">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#044bff;"></span>
                      <span>${params[0].seriesName}：</span>
                      <span>${params[0].data.score}</span>
                    </div>
                  </div>`;
            }
          },
          xAxis: {
            type: 'category',
            name: "日期",
            axisLine:{
              lineStyle:{
                color: "#dedede"
              }
            },
            axisLabel:{
              color: "#888"
            }
          },
          yAxis: {
            type: 'value',
            axisLabel:{
              color: "#888"
            }
          },
          dataset:{
            source: $this.searchResult.findScoreCount,  
          },
          animation: false,
          series: [
            {
              name: "发现意向分数",
              type: 'line',
              symbol:'circle',
              symbolSize: '5',
              label:{
                show: true,
                position: 'top',
                distance: '5',
              },
              itemStyle:{
                color: '#fff',
                borderColor: "#044bff",
                borderWidth: 1
              },
              areaStyle:{
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "#044bff",
                      opacity:1
                    },
                    {
                      offset: 1,
                      color: "rgba(255, 255, 255, 0)",
                    }
                ]),
                opacity:0.3
              },
              lineStyle:{
                color: "#044bff",
                width: 1
              },
              emphasis:{
                lineStyle: {
                  width: 2,
                },
                itemStyle:{
                  borderWidth: 2
                }
              }
            }
          ]
        };

        option && myChart.setOption(option);
        $this.chartlist.findScorePlot = myChart;
      }
    },
    // 发现询盘个数
    drawFindInquiryChart(){
      var $this = this;
      if($this.searchResult.findInquiryCount.length>0){
        var chartDom = document.getElementById('findinquiry');
        var myChart = echarts.init(chartDom);
        var option;

        option = {
          grid:{
            left: '35',
            top:'25',
            right:'15',
            bottom: '25'
          },
          tooltip:{
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "line", 
              lineStyle:{
                color: "#044bff"
              }
            },
            formatter(params){
              return `<div class="toolDiv">
                    <div class="tooltitle">${params[0].name}</div>
                    <div class="bar clearfix">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#044bff;"></span>
                      <span>${params[0].seriesName}：</span>
                      <span>${params[0].data.number}</span>
                    </div>
                  </div>`;
            }
          },
          xAxis: {
            type: 'category',
            name: "日期",
            axisLine:{
              lineStyle:{
                color: "#dedede"
              }
            },
            axisLabel:{
              color: "#888"
            }
          },
          yAxis: {
            type: 'value',
            axisLabel:{
              color: "#888"
            }
          },
          dataset:{
            source: $this.searchResult.findInquiryCount,  
          },
          animation: false,
          series: [
            {
              name: "发现询盘个数",
              type: 'line',
              symbol:'circle',
              symbolSize: '5',
              label:{
                show: true,
                position: 'top',
                distance: '5',
              },
              itemStyle:{
                color: '#fff',
                borderColor: "#044bff",
                borderWidth: 1
              },
              areaStyle:{
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "#044bff",
                      opacity:1
                    },
                    {
                      offset: 1,
                      color: "rgba(255, 255, 255, 0)",
                    }
                ]),
                opacity:0.3
              },
              lineStyle:{
                color: "#044bff",
                width: 1
              },
              emphasis:{
                lineStyle: {
                  width: 2,
                },
                itemStyle:{
                  borderWidth: 2
                }
              }
            }
          ]
        };

        option && myChart.setOption(option);
        $this.chartlist.findInquiryPlot = myChart;
      }
    },
    // 大洲意向分
    drawContinentScoreChart(){
      var $this = this;
      if($this.searchResult.continentScoreCount.continentscoredata.length>0){
        var chartDom = document.getElementById('continentscore');
        var myChart = echarts.init(chartDom);
        var option;
        var series = [];
        $this.searchResult.continentScoreCount.continentscoredata.forEach((item, index)=>{
            var seriesobj = {
              name: $this.searchResult.continentScoreCount.continentlist[index],
              type: 'line',
              symbol:'circle',
              symbolSize: '5',
              data: item,
              label:{
                show: true,
                position: 'top',
                distance: '5',
              },
              itemStyle:{
                color: '#fff',
                borderColor: $this.searchResult.continentScoreCount.ChartColor[index],
                borderWidth: 1
              },
              areaStyle:{
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color:$this.searchResult.continentScoreCount.ChartColor[index],
                        opacity:1
                      },
                      {
                        offset: 1,
                        color: "rgba(255, 255, 255, 0)",
                      }
                  ]),
                  opacity:0.3
              },
              lineStyle:{
                color: $this.searchResult.continentScoreCount.ChartColor[index],
                width: 1
              },
              emphasis:{
                lineStyle: {
                  width: 2,
                },
                itemStyle:{
                  borderWidth: 2
                }
              }
            }
            series.push(seriesobj)
        })

        option = {
          grid:{
            left: '35',
            top:'25',
            right:'15',
            bottom: '55'
          },
          tooltip:{
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "line", 
              lineStyle:{
                color: "#044bff"
              }
            },
            formatter(params){
              let returnData = `<div class="toolDiv">
                  <div class="tooltitle">${params[0].name}</div>`;
                  for (let i = 0; i < params.length; i++) {
                    returnData += `<div class="bar clearfix"><span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${params[i].borderColor};"></span>
                      <span class="tooltit">${params[i].seriesName}</span>
                      <span class="toolval">${params[i].value}</span></div>`;
                  }
                  returnData +=`</div>`;

                return returnData;
            }
          },
          xAxis: {
            type: 'category',
            name: "日期",
            data: $this.searchResult.continentScoreCount.continentscoredate,
            axisLine:{
              lineStyle:{
                color: "#dedede"
              }
            },
            axisLabel:{
              color: "#888"
            }
          },
          yAxis: {
            type: 'value',
            axisLabel:{
              color: "#888"
            }
          },
          animation: false,
          series,
          legend:{
            type:'plain',
            show:true,
            bottom:0,
            orient:'horizontal',
            padding:0,
            textStyle: {
                color: "#555",
                fontSize: "12",
                lineHeight: 18,
            },
          }
        };

        option && myChart.setOption(option);
        $this.chartlist.continentScorePlot = myChart;
      }
    },
    // 大洲询盘个数
    drawContinentInquiryChart(){
      var $this = this;
      if($this.searchResult.continentInquiryCount.continentxundata.length>0){
        var chartDom = document.getElementById('continentinquiry');
        var myChart = echarts.init(chartDom);
        var option;
        var series = [];
        $this.searchResult.continentInquiryCount.continentxundata.forEach((item, index)=>{
            var seriesobj = {
              name: $this.searchResult.continentInquiryCount.continentlist[index],
              type: 'line',
              symbol:'circle',
              symbolSize: '5',
              data: item,
              label:{
                show: true,
                position: 'top',
                distance: '5',
              },
              itemStyle:{
                color: '#fff',
                borderColor: $this.searchResult.continentInquiryCount.ChartColor[index],
                borderWidth: 1
              },
              areaStyle:{
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color:$this.searchResult.continentInquiryCount.ChartColor[index],
                        opacity:1
                      },
                      {
                        offset: 1,
                        color: "rgba(255, 255, 255, 0)",
                      }
                  ]),
                  opacity:0.3
              },
              lineStyle:{
                color: $this.searchResult.continentInquiryCount.ChartColor[index],
                width: 1
              },
              emphasis:{
                lineStyle: {
                  width: 2,
                },
                itemStyle:{
                  borderWidth: 2
                }
              }
            }
            series.push(seriesobj)
        })

        option = {
          grid:{
            left: '35',
            top:'25',
            right:'15',
            bottom: '55'
          },
          tooltip:{
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "line", 
              lineStyle:{
                color: "#044bff"
              }
            },
            formatter(params){
              let returnData = `<div class="toolDiv">
                  <div class="tooltitle">${params[0].name}</div>`;
                  for (let i = 0; i < params.length; i++) {
                    returnData += `<div class="bar clearfix"><span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${params[i].borderColor};"></span>
                      <span class="tooltit">${params[i].seriesName}</span>
                      <span class="toolval">${params[i].value}</span></div>`;
                  }
                  returnData +=`</div>`;

                return returnData;
            }
          },
          xAxis: {
            type: 'category',
            name: "日期",
            data: $this.searchResult.continentInquiryCount.continentxundate,
            axisLine:{
              lineStyle:{
                color: "#dedede"
              }
            },
            axisLabel:{
              color: "#888"
            }
          },
          yAxis: {
            type: 'value',
            axisLabel:{
              color: "#888"
            }
          },
          animation: false,
          series,
          legend:{
            type:'plain',
            show:true,
            bottom:0,
            orient:'horizontal',
            padding:0,
            textStyle: {
                color: "#555",
                fontSize: "12",
                lineHeight: 18,
            },
          }
        };

        option && myChart.setOption(option);
        $this.chartlist.continentInquiryPlot = myChart;
      }
    },

    echartsSize(){
      var $this = this;
      if($this.chartlist.allInquiryPlot){
        $this.chartlist.allInquiryPlot.resize();
      }
      if($this.chartlist.trendScorePlot){
        $this.chartlist.trendScorePlot.resize();
      }
      if($this.chartlist.trendInquiryPlot){
        $this.chartlist.trendInquiryPlot.resize();
      }
      if($this.chartlist.productScorePlot){
        $this.chartlist.productScorePlot.resize();
      }
      if($this.chartlist.productInquiryPlot){
        $this.chartlist.productInquiryPlot.resize();
      }
      if($this.chartlist.searchInquiryPlot){
        $this.chartlist.searchInquiryPlot.resize();
      }
      if($this.chartlist.searchScorePlot){
        $this.chartlist.searchScorePlot.resize();
      }
      if($this.chartlist.findInquiryPlot){
        $this.chartlist.findInquiryPlot.resize();
      }
      if($this.chartlist.findScorePlot){
        $this.chartlist.findScorePlot.resize();
      }
      if($this.chartlist.continentScorePlot){
        $this.chartlist.continentScorePlot.resize();
      }
      if($this.chartlist.continentInquiryPlot){
        $this.chartlist.continentInquiryPlot.resize();
      }
    },
  },
  destroyed(){
      window.removeEventListener('resize',this.echartsSize);
  }
}
</script>
<style lang="scss" scoped>
.numspan{
  i{
    font-size: 12px;
    font-style: normal;
  }
}
.el-table .cell{
  text-align:center;
}
</style>