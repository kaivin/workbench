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
              <span class="breadcrumb-link"><b>-</b><span>统计分析</span></span>
          </p>
          <el-card class="box-card scroll-card" shadow="hover">
              <div class="card-content ChinaphoneTwoBox" ref="tableContent">
                  <div class="ChinaphoneTwo buttonTwo">
                    <div class="group-header">
                        <el-checkbox class="all-select" :indeterminate="isAllPhone" border size="mini" v-model="checkAllPhone" @change="handleCheckAllPhoneChange">电话全选<span class="require tips">(* 至少选择一个电话)</span></el-checkbox>
                    </div>
                    <div class="group-body">
                      <div class="team-panel" v-for="item in phoneList" v-bind:key="item.id">
                        <div class="team-header" v-if="item.icon=='i1'">
                          <span class="require">{{item.name}}：</span>
                          <el-checkbox class="all-select" :indeterminate="isAllSemPhone" border size="mini" v-model="checkAllSemPhone" @change="handleCheckAllSemPhoneChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedSem" @change="handleCheckedSemChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="phone in item.children" :label="phone.value" :key="phone.value" border>{{phone.label}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                        <div class="team-header" v-else-if="item.icon=='i2'">
                          <span class="require">{{item.name}}：</span>
                          <el-checkbox class="all-select" :indeterminate="isAllSnsPhone" border size="mini" v-model="checkAllSnsPhone" @change="handleCheckAllSnsPhoneChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedSns" @change="handleCheckedSnsChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="phone in item.children" :label="phone.value" :key="phone.value" border>{{phone.label}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="ChinaphoneTwo buttonTwo">
                    <div class="group-body">
                      <div class="team-panel">
                        <div class="team-header">
                            <div class="team-headerItem">
                                  <span class="require tips">* 时间：</span>
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
                                      :picker-options="pickerRangeOptions"
                                      :class="searchData.date&&searchData.date.length>0?'el-xzstate':''">
                                  </el-date-picker>              
                            </div>
                            <div class="team-headerItem">
                                  <span class="require">域名：</span>
                                  <el-input
                                      size="mini"
                                      v-model="searchData.domain"
                                      :class="searchData.domain!=''?'el-xzstate':''"
                                      clearable>
                                  </el-input>
                            </div>
                            <div class="team-headerItem">
                                  <span class="require">url：</span>
                                  <el-input
                                      size="mini"
                                      v-model="searchData.url"
                                      :class="searchData.url!=''?'el-xzstate':''"
                                      clearable>
                                  </el-input>
                            </div>
                            <div class="team-headerItem">
                                  <span class="require">地区：</span>
                                  <el-input
                                      size="mini"
                                      v-model="searchData.country"
                                      :class="searchData.country!=''?'el-xzstate':''"
                                      clearable>
                                  </el-input>
                            </div>
                            <div class="team-headerItem">
                                  <span class="require">物料：</span>
                                  <el-input
                                      size="mini"
                                      v-model="searchData.material"
                                      :class="searchData.material!=''?'el-xzstate':''"
                                      clearable>
                                  </el-input>
                            </div>
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
                          <span class="require">级别：</span>
                          <el-checkbox class="all-select" :indeterminate="isAllLevel" border size="mini" v-model="checkAllLevel" @change="handleCheckAllLevelChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedLevel" @change="handleCheckedLevelChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="item in levelList" :label="item.value" :key="item.value" border>{{item.label}}</el-checkbox>
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
                  <div class="card-header WebServerAddEditBtn ChinaphoneTwoBtn">
                      <el-button type="primary" class="updateBtn"  :class="isDisabled?'isDisabled':''" :disabled="isDisabled"  size="small" v-if="menuButtonPermit.includes('Depsix_statisticChart')" v-on:click="getCluesAnalysisData"><i class="svg-i planeWhite" ><svg-icon icon-class="planeWhite" /></i>生成数据</el-button>
                      <el-button type="primary" class="resetBtn" size="small" v-on:click="resetData()">重置</el-button>
                  </div>
              </div>
          </el-card>
          <el-card class="box-card scroll-card cn-phone-result" shadow="hover" v-if="isSearch">
              <div class="card-content ChinaphoneTwoBox" ref="tableContent">
                <div class="cavans-wrapper" id="canvasPane" ref="canvasPane">
                  <el-row :gutter="15">
                    <el-col :md="24" :lg="12">
                      <div class="chart-wrapper">
                        <div class="chart-header"><span>询盘总数（{{searchResult.phoneTotalNum}}）</span></div>
                        <div class="chart-body" style="height:400px;">                        
                            <div class="abs-canvas" v-if="searchResult.phoneCount.length>0">
                              <div id="cluesChart1" class="chart-canvas"></div>
                            </div>
                            <div class="nocount" v-else>
                              暂无数据
                            </div>                     
                        </div>
                      </div>
                    </el-col>
                    <el-col :md="24" :lg="12">
                      <div class="chart-wrapper">
                        <div class="chart-header"><span>有效询盘（{{searchResult.phoneEffectiveNum}}）</span></div>
                        <div class="chart-body" style="height:400px;">                              
                            <div class="abs-canvas" v-if="searchResult.phoneEffectiveCount.length>0">
                              <div id="cluesChart2" class="chart-canvas"></div>
                            </div>
                            <div class="nocount" v-else>
                              暂无数据
                            </div> 
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="15">
                    <el-col :xs="24">
                      <div class="chart-wrapper">
                        <div class="chart-header"><span>热门国家</span></div>
                        <div class="chart-body chartmap-body" style="height:540px;text-align:center;">
                          <div class="map-panel flex-box">
                            <div class="map-chart enmap-chart">
                                <div id="cluesChart10" class="chart-canvas" ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="15">
                    <el-col :xs="24">
                      <div class="chart-wrapper">
                        <div class="chart-header"><span>国家询盘</span></div>
                        <div class="chart-body chartmap-body depsix-table" style="height:540px;text-align:center;padding:30px">
                            <div class="table-panel">
                              <div class="table-chart">
                                <el-table
                                  border
                                  ref="simpleTable"
                                  :data="searchResult.regionCount"
                                  tooltip-effect="dark"
                                  stripe
                                  max-height="480"
                                  style="width: 100%;"
                                  row-key="id"
                                  show-summary
                                  :summary-method="getSummaries"
                                  :default-sort = "{prop: 'number', order: 'descending'}"
                                  >
                                  <el-table-column
                                    prop="country"
                                    label="国家"
                                    >
                                  </el-table-column>
                                  <el-table-column
                                    prop="number"
                                    label="总数量"
                                    sortable
                                    >
                                  </el-table-column>
                                  <el-table-column
                                    v-for="(item,index) in searchResult.phoneCount"
                                    :key="index"
                                    :label="item.phonenumber"
                                    >
                                    <template slot-scope="scope">
                                          <span class="numspan">{{numberSearch(scope.row.group,item.phonenumber)}}
                                            <i v-if="percentSearch(scope.row.group,item.phonenumber)">({{percentSearch(scope.row.group,item.phonenumber)+"%"}})</i>
                                          </span>
                                    </template>
                                  </el-table-column>
                                </el-table>
                              </div>
                            </div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="15">
                    <el-col :xs="24">
                      <div class="chart-wrapper">
                        <div class="chart-header"><span>地区询盘</span></div>
                        <div class="chart-body chartmap-body depsix-table" style="height:540px;text-align:center;padding:30px">
                            <div class="table-panel">
                              <div class="table-chart">
                                <el-table
                                  border
                                  ref="simpleTable"
                                  :data="searchResult.continentCount"
                                  tooltip-effect="dark"
                                  stripe
                                  max-height="480"
                                  style="width: 100%;"
                                  row-key="id"
                                  show-summary
                                  :summary-method="getSummaries"
                                  :default-sort = "{prop: 'number', order: 'descending'}"
                                  >
                                  <el-table-column
                                    prop="continent"
                                    label="地区"
                                    >
                                  </el-table-column>
                                  <el-table-column
                                    prop="number"
                                    label="总数量"
                                    sortable
                                    >
                                  </el-table-column>
                                  <el-table-column
                                    v-for="(item,index) in searchResult.phoneCount"
                                    :key="index"
                                    :label="item.phonenumber"
                                    >
                                    <template slot-scope="scope">
                                          <span class="numspan">{{numberSearch(scope.row.group,item.phonenumber)}}
                                            <i v-if="percentSearch(scope.row.group,item.phonenumber)">({{percentSearch(scope.row.group,item.phonenumber)+"%"}})</i>
                                          </span>
                                    </template>
                                  </el-table-column>
                                </el-table>
                              </div>
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
import {MapInterval} from "@/utils/MapColor";
import {sortByDesc} from "@/utils/index";
import { worldCountry } from "@/utils/worldCountry";
export default {
  name: 'statisticChart',
  data() {
    return {
      isSearch:false,
      linkAll:{
        todayNum:0,
        yestodayNum:0,
        monthNum:0,
        unAllotNum:0,
      },
      defaultData:{},
      breadcrumbList:[],
      menuButtonPermit:[],
      isAllPhone:false,
      checkAllPhone:false,
      isAllSemPhone:false,
      checkAllSemPhone:false,
      isAllSnsPhone:false,
      checkAllSnsPhone:false,
      checkedSem:[],
      checkedSns:[],
      searchData:{
        date:[],
        country:'',
        material:'',
        domain:'',
        name:'',
        url:''
      },
      pickerRangeOptions: this.$pickerRangeOptions,
      deviceList:[],
      productList:[],
      sourceList:[],
      levelList:[],
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
      isAllLevel:false,
      checkAllLevel:false,
      checkedLevel:[],
      isAllCategory:false,
      checkAllCategory:false,
      checkedCategory:[],
      isAllDevice:false,
      checkAllDevice:false,
      checkedDevice:[],
      searchResult:{
        phoneCount:[],
        phoneEffectiveCount:[],
        phoneTotalNum:0,
        phoneEffectiveNum:0,
        regionCount:[],
        regionMap:[],
        continentCount:[],
      },
      isLoading:null,
      isDisabled:false,
      chartlist:{
        barPhoneTotalPlot:'',
        barPhoneEffectivePlot:'',
        pieDevicePlot:'',
        pieProductTypePlot:'',
        columnWeekPlot:'',
        pieSourcePlot:'',
        lineDayPlot:'',
        columnHoursPlot:'',
        columnProductPlot:'',
        chart:''
      },
      isAllResault: false,
      checkAllResault: false,
      checkedResShow: [],
      resaultShowList:[
        {id:1,value:1,label:"询盘总数"},
        {id:2,value:2,label:"有效询盘"},
        {id:3,value:3,label:"使用设备"},
        {id:4,value:4,label:"产品分类"},
        {id:5,value:5,label:"平均星期询盘量"},
        {id:6,value:6,label:"来源渠道"},
        {id:7,value:7,label:"每天询盘量"},
        {id:8,value:8,label:"平均小时询盘量"},
        {id:9,value:9,label:"热门产品"},
        {id:10,value:10,label:"热门地区"},
        {id:11,value:11,label:"产品"},
        {id:12,value:12,label:"各组市场占比"}
      ],
      tableTitle:[]
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
    // loading自定义
    loadingFun(){
      var $this = this;
      $this.isLoading = $this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },

    // 重置选择项
    resetData(){
      var $this = this;
      $this.isSearch = false;
      $this.isAllPhone=false;
      $this.checkAllPhone=false;
      $this.isAllSemPhone=false;
      $this.checkAllSemPhone=false;
      $this.isAllSeoPhone=false;
      $this.checkAllSeoPhone=false;
      $this.isAllMediaPhone=false;
      $this.checkAllMediaPhone=false;
      $this.isAllSnsPhone=false;
      $this.checkAllSnsPhone=false;
      $this.isAllOtherPhone=false;
      $this.checkAllOtherPhone=false;
      $this.checkedSem=[];
      $this.checkedSeo=[];
      $this.checkedMedia=[];
      $this.checkedSns=[];
      $this.checkedOther=[];
      $this.phoneCount=0;
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
      $this.isAllLevel=false;
      $this.checkAllLevel=false;
      $this.checkedLevel=[];
      $this.isAllCategory=false;
      $this.checkAllCategory=false;
      $this.checkedCategory=[];
      $this.isAllDevice=false;
      $this.checkAllDevice=false;
      $this.checkedDevice=[];
      $this.maxWeek=[];
      $this.minWeek=[];
      $this.maxWeekNum=0;
      $this.minWeekNum=0;
      $this.maxHours=[];
      $this.minHours=[];
      $this.maxHoursNum=0;
      $this.minHoursNum=0;
      $this.maxProduct=[];
      $this.minProduct=[];
      $this.maxProductNum=0;
      $this.minProductNum=0;
      $this.searchData.date=[];
      $this.searchData.country="";
      $this.searchData.material="";
      $this.searchData.domain='';
      $this.searchData.name='';
      $this.searchData.url='';
      $this.searchResult.hoursCount=[];
      $this.searchResult.deviceCount=[];
      $this.searchResult.dayCount=[];
      $this.searchResult.productCount=[];
      $this.searchResult.sourceCount=[];
      $this.searchResult.phoneCount=[];
      $this.searchResult.phoneEffectiveCount=[];
      $this.searchResult.phoneTotalNum=0;
      $this.searchResult.phoneEffectiveNum=0;
      $this.searchResult.productTypeCount=[];
      $this.searchResult.regionCount=[];
      $this.searchResult.regionMap=[];
      $this.searchResult.searchWordCount=[];
      $this.searchResult.weekCount=[];
      $this.isExportDisabled = true;
      $this.isAllResault = false;
      $this.checkAllResault = false;
      $this.checkedResShow = [];
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.loadingFun();
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
      searchData.country = $this.searchData.country;
      searchData.material = $this.searchData.material;
      searchData.domain = $this.searchData.domain;
      searchData.name = $this.searchData.name;
      searchData.url = $this.searchData.url;
      if($this.searchData.date&&$this.searchData.date.length>0){
        searchData.starttime = $this.searchData.date[0];
        searchData.endtime = $this.searchData.date[1];
      }else{
        searchData.starttime = "";
        searchData.endtime = "";
      }
      var checkedSem = $this.checkedSem;
      var checkedSns = $this.checkedSns;
      searchData.phoneid = checkedSem.concat(checkedSns);
      searchData.mode = $this.checkedSource;
      searchData.level_id = $this.checkedLevel;
      searchData.device = $this.checkedDevice;
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
      searchData.productid=checkedA1Product.concat(checkedA2Product).concat(checkedA3Product).concat(checkedA4Product).concat(checkedA5Product).concat(checkedA6Product).concat(checkedA7Product).concat(checkedA8Product).concat(checkedA9Product).concat(checkedA10Product).concat(checkedA11Product).concat(checkedA12Product).concat(checkedA13Product)
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
            if($this.menuButtonPermit.includes('Depsix_statisticChart')){
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
      $this.$store.dispatch('depsix/inquiryItemAction').then(response=>{
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
            var newPhone = [];
            response.phone.forEach(function(item,index){
              if(newPhone.indexOf(item.departname) == -1){
                newPhone.push(item.departname);
              }
            })
            var newPhoneArr=[];
            var nowindex = 1;
            newPhone.forEach(function(item,index){
                var newobj={};
                newobj.id = nowindex;
                newobj.icon="i"+ nowindex;
                newobj.name = item;
                newobj.children=[];
                nowindex++;
                newPhoneArr.push(newobj)
            })
            response.phone.forEach(function(item,index){
              newPhoneArr.forEach(function(item1,index1){
                if(item.departname==item1.name){
                  var newobj={};
                  newobj.label=item.phonenumber;
                  newobj.value=item.id;
                  item1.children.push(newobj);
                  phoneCount++;
                }
              });
            })
            $this.phoneList = newPhoneArr;
            $this.phoneCount = phoneCount;

            var sourceList = [];
            response.sourcetype.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              sourceList.push(itemData);
            });
            $this.sourceList = sourceList;
            var levelList = [];
            response.xunlevel.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.levelname;
              itemData.value = item.id;
              levelList.push(itemData);
            });
            $this.levelList = levelList;
            $this.isLoading.close();
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
        $this.loadingFun();
        $this.$store.dispatch('depsix/inquirySearchAction', searchData).then(response=>{
          if(response){
            if(response.status){
              $this.isSearch=true;
              $this.searchResult.phoneCount = response.phonecount;
              $this.searchResult.phoneEffectiveCount = response.phonecounteffective;
              $this.searchResult.phoneTotalNum = response.phonenumber;
              $this.searchResult.phoneEffectiveNum = response.phonenumbereffective;
              $this.searchResult.regionCount = response.provincecoun;
              $this.searchResult.regionMap = response.provincecountmap;
              $this.searchResult.continentCount = response.provincecountcontient;

              $this.$nextTick(()=>{
                document.getElementById("canvasPane").scrollIntoView({behavior: "smooth"});
                $this.isExportDisabled = false;
                if($this.chartlist.barPhoneTotalPlot){
                    $this.chartlist.barPhoneTotalPlot.dispose();
                    $this.drawChart1();
                }else{
                  $this.drawChart1();
                }
                if($this.chartlist.barPhoneEffectivePlot){
                  $this.chartlist.barPhoneEffectivePlot.dispose();
                  $this.drawChart2();
                }else{
                  $this.drawChart2();
                }
                if($this.chartlist.chart){
                  $this.chartlist.chart.dispose();
                  $this.drawChart10();
                }else{
                  $this.drawChart10();
                }

                $this.isLoading.close();
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
        $this.phoneList.forEach(function(item,index){
          var checkedList = [];
          if(item.icon=="i1"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedSem = checkedList;
            $this.checkAllSemPhone = true;
          }else if(item.icon=="i2"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedSns = checkedList;
            $this.checkAllSnsPhone = true;
          }
        });
      }else{
        $this.checkedSem = [];
        $this.checkedSns = [];
        $this.checkAllSemPhone = false;
        $this.checkAllSnsPhone = false;
      }
      $this.isAllPhone = false;
      $this.isAllSemPhone = false;
      $this.isAllSnsPhone = false;
    },
    handleCheckAllSemPhoneChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.phoneList.forEach(function(item,index){
          if(item.icon=="i1"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedSem = checkedList;
      }else{
        $this.checkedSem = [];
      }
      $this.isAllSemPhone = false;
      $this.allPhoneSelectedStatus();
    },

    handleCheckAllSnsPhoneChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.phoneList.forEach(function(item,index){
          if(item.icon=="i2"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedSns = checkedList;
      }else{
        $this.checkedSns = [];
      }
      $this.isAllSnsPhone = false;
      $this.allPhoneSelectedStatus();
    },

    handleCheckedSemChange(e){
      var $this = this;
      var checkedCount = e.length;
      $this.phoneList.forEach(function(item,index){
        if(item.icon=="i1"){
          if(checkedCount === item.children.length){
            $this.checkAllSemPhone = true;
          }else{
            $this.checkAllSemPhone = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllSemPhone = true;
          }else{
            $this.isAllSemPhone = false;
          }
        }
      });
      $this.allPhoneSelectedStatus();
    },
    handleCheckedSnsChange(e){
      var $this = this;
      var checkedCount = e.length;
      $this.phoneList.forEach(function(item,index){
        if(item.icon=="i2"){
          if(checkedCount === item.children.length){
            $this.checkAllSnsPhone = true;
          }else{
            $this.checkAllSnsPhone = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllSnsPhone = true;
          }else{
            $this.isAllSnsPhone = false;
          }
        }
      });
      $this.allPhoneSelectedStatus();
    },
    // 全选按钮状态事件
    allPhoneSelectedStatus(){
      var $this = this;
      var totalCheckedCount = $this.checkedSem.length+$this.checkedSns.length;
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
    handleCheckAllLevelChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.levelList.forEach(function(item,index){
          checkedList.push(item.value);
        });
        $this.checkedLevel = checkedList;
        $this.checkAllLevel= true;
      }else{
        $this.checkedLevel = [];
        $this.checkAllLevel = false;
      }
      $this.isAllLevel = false;
    },
    handleCheckedLevelChange(e){
      var $this = this;
      var checkedCount = e.length;
       if(checkedCount === $this.levelList.length){
          $this.checkAllLevel = true;
        }else{
          $this.checkAllLevel = false;
        }
        if(checkedCount>0&&checkedCount<$this.levelList.length){
          $this.isAllLevel = true;
        }else{
          $this.isAllLevel = false;
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
    // 图表功能
    drawChart1(){
      var $this = this;
      if($this.searchResult.phoneCount.length>0){
        var phonelist = [];
        var numberlist = [];
        $this.searchResult.phoneCount.forEach(function(item,index){
          phonelist.push(item.phonenumber);
          numberlist.push(item.number);
        })
        var chartDom = document.getElementById('cluesChart1');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          tooltip: {
            trigger: 'axis',
            axisPointer:{
              type: "shadow"
            },
            formatter(items){
              var tooltext = `<div class="counttoolTip">
              <div class="title">${items[0].name}</div>
              <div class="bar clearfix">
                ${items[0].marker}
                <span class="name">${items[0].seriesName}：</span>
                <span class="num">${items[0].value}</span>
              </div>
              `;
              return tooltext;
            }
          },
          grid: {
            top: "20",
            left: '15',
            right: '15',
            bottom: '15',
            containLabel: true
          },
          label:{
            show: true,
            align: "center",
            color: "#fff",
            formatter(items){
              if(items.value > 10){
                return items.value
              }else{
                return ""
              }
            }
          },
          xAxis: {
            type: 'value',
            axisLabel:{
              color: "#888"
            }
          },
          yAxis: {
            type: 'category',
            data: phonelist,
            inverse: true,
            axisLine:{
              lineStyle:{
                color: "#dedede"
              }
            },
            axisLabel:{
              color: "#888"
            }
          },
          series: [
            {
              name: '询盘个数',
              type: 'bar',
              data: numberlist,
              barWidth: 18,
              barGap: 15,
              itemStyle:{
                normal:{
                  color:function(params){
                    var colorList = ["#299999", "#ffe2ca", "#ff9d4e", "#e0d1eb", "#9967bd", "#9967bd","#74cbed", "#d5d0fd", "#7666f9", "#fcecbd", " #f6c022", "#d0d6e0", "#657798", "#cdf3e4", "#5ad8a6","#cdddfd", "#5b8ff9", "#ffe0ed", "#ff99c3", "#a5c1fa", "#5b8ff9"];
                    return colorList[params.dataIndex]
                  }
                }
              }
            }
          ]
        };

        option && myChart.setOption(option);
        $this.chartlist.barPhoneTotalPlot = myChart;
      }
    },
    // 图表功能
    drawChart2(){
      var $this = this;
      if($this.searchResult.phoneEffectiveCount.length>0){

        var phonelist = [];
        var numberlist = [];
        $this.searchResult.phoneEffectiveCount.forEach(function(item,index){
          phonelist.push(item.phonenumber);
          numberlist.push(item.number);
        })
        var chartDom = document.getElementById('cluesChart2');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          tooltip: {
            trigger: 'axis',
            axisPointer:{
              type: "shadow"
            },
            formatter(items){
              var tooltext = `<div class="counttoolTip">
              <div class="title">${items[0].name}</div>
              <div class="bar clearfix">
                ${items[0].marker}
                <span class="name">${items[0].seriesName}：</span>
                <span class="num">${items[0].value}</span>
              </div>
              `;
              return tooltext;
            }
          },
          grid: {
            top: "20",
            left: '15',
            right: '15',
            bottom: '15',
            containLabel: true
          },
          label:{
            show: true,
            align: "center",
            color: "#fff",
            formatter(items){
              if(items.value > 10){
                return items.value
              }else{
                return ""
              }
            }
          },
          xAxis: {
            type: 'value',
            axisLabel:{
              color: "#888"
            }
          },
          yAxis: {
            type: 'category',
            data: phonelist,
            inverse: true,
            axisLine:{
              lineStyle:{
                color: "#dedede"
              }
            },
            axisLabel:{
              color: "#888"
            }
          },
          series: [
            {
              name: '询盘个数',
              type: 'bar',
              data: numberlist,
              barWidth: 18,
              barGap: 15,
              itemStyle:{
                normal:{
                  color:function(params){
                    var colorList = ["#299999", "#ffe2ca", "#ff9d4e", "#e0d1eb", "#9967bd", "#9967bd","#74cbed", "#d5d0fd", "#7666f9", "#fcecbd", " #f6c022", "#d0d6e0", "#657798", "#cdf3e4", "#5ad8a6","#cdddfd", "#5b8ff9", "#ffe0ed", "#ff99c3", "#a5c1fa", "#5b8ff9"];
                    return colorList[params.dataIndex]
                  }
                }
              }
            }
          ]
        };

        option && myChart.setOption(option);
        $this.chartlist.barPhoneEffectivePlot = myChart;

      }
    },
    // 图表功能
    drawChart10(){
      var $this = this;
      if($this.searchResult.regionMap.length>0){
        var mapData= $this.searchResult.regionMap;
        var mapCountData = worldCountry(mapData,"country","number");
        mapCountData.sort(sortByDesc("value"));
        var chartDom = document.getElementById('cluesChart10');
        var myChart = echarts.init(chartDom);
        var maxNum = mapCountData[0].value;
        let mapInterval = MapInterval(maxNum);
        var option;
         option = {
          // 提示框组件
          tooltip: {
            trigger: 'item', // 触发类型, 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用
            // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
            // 使用函数模板  传入的数据值 -> value: number | Array
            backgroundColor:'rgba(255, 255, 255, 0.9)',
            extraCssText: 'box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);',
            showDelay: 0,
            padding:[5,10],
            transitionDuration: 0.2,
            formatter: function (params) {
              if(params.data){
                return `<div class="echarts-tooltip">
                    <div class="tooltip-list">
                      <div class="item-tooltip">
                        <span class="icon" style="background:${params.color}"></span>
                        <span class="name" style="text-align:left">国家：</span>
                        <div class="num">${params.data.country}</div>
                      </div>
                      <div class="item-tooltip">
                        <span class="icon" style="background:${params.color}"></span>
                        <span class="name" style="text-align:left">英文名：</span>
                        <div class="num">${params.data.name}</div>
                      </div>
                      <div class="item-tooltip">
                        <span class="icon" style="background:${params.color}"></span>
                        <span class="name" style="text-align:left">询盘个数：</span>
                        <div class="num">${params.data.value}</div>
                      </div>
                    </div>
                  </div>`
              }
            },
            textStyle:{
              fontSize:12,
              color:'#333'
            }
          },
          // 视觉映射组件
          visualMap: {
            type: 'piecewise', // continuous 类型为连续型  piecewise 类型为分段型
            pieces: mapInterval.pieces,
            right:0,
            top:'middle',
            zlevel:1,
            // 文本样式
            textStyle: {
              height: 140,
              lineHeight:140,
              fontSize: 12,
              color: '#888'
            },
            realtime: false, // 拖拽时，是否实时更新
            calculable: true, // 是否显示拖拽用的手柄
            // 定义 在选中范围中 的视觉元素
            inRange: {
              color: mapInterval.defaultColor // 图元的颜色
            },
            inverse:false,
            orient:'vertical',
            itemWidth:9,
            itemHeight:9,
            align:'left',
            textGap:8,
            outOfRange: {
              color: '#eee'
            }
          },
          geo: {
            map: "world",
            roam: false,// 一定要关闭拖拽
            zoom: 1.2,
            label: {
              show: false // 是否显示对应地名
            },
            itemStyle: {
              borderWidth: 0.5, // 描边线宽 为 0 时无描边
              borderColor: '#999', // 图形的描边颜色 支持的颜色格式同 color，不支持回调函数
              borderType: 'solid', // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
            },
            emphasis: {
              itemStyle:{
                areaColor: "#0050b3",
                borderWidth: 0,
              }
            }
          },
          series: [
            {
              type: 'map', // 类型
              // 系列名称，用于tooltip的显示，legend 的图例筛选 在 setOption 更新数据和配置项时用于指定对应的系列
              map: 'world', // 地图类型
              // 是否开启鼠标缩放和平移漫游 默认不开启 如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move' 设置成 true 为都开启
              roam: false,
              zoom:1.2,
              label: {
                show: false, // 是否显示对应地名
              },
              // 地图区域的多边形 图形样式
              itemStyle: {
                borderWidth: 0.5, // 描边线宽 为 0 时无描边
                borderColor: '#999', // 图形的描边颜色 支持的颜色格式同 color，不支持回调函数
                borderType: 'solid' // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
              },
              // 高亮状态下的多边形和标签样式
              emphasis: {
                label: {
                  show: false, // 是否显示标签
                  color:'#fff',
                  textBorderColor:'#444',
                  textBorderWidth:2,
                  textBorderType:'solid',
                },
                itemStyle: {
                  borderWidth: 0.5, // 描边线宽 为 0 时无描边
                  borderColor: '#999', // 图形的描边颜色 支持的颜色格式同 color，不支持回调函数
                  borderType: 'solid', // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
                }
              },
              // 地图系列中的数据内容数组 数组项可以为单个数值
              data: mapCountData
            },
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        $this.chartlist.chart = myChart;
      }
    },
    getSummaries(param){
      var $this = this;
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }else if(index === 1){
          const values = data.map(item =>Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          } else {
            sums[index] = '-';
          }
        }else{
          var totalnum = 0;
          data.forEach(function(item,index){
            item.group.forEach(function(sitem,index){
              if(sitem.phonenumber == column.label){
                totalnum+=sitem.number;
              }
            })
          })
          var per = (totalnum/sums[1]*100).toFixed(2)+"%"
          sums[index]=totalnum+"("+per+")";
        }
      });
      return sums;
    },

    getSummaries2(param){
      var $this = this;
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = '-';
        }
      });
      return sums;
    },

    echartsSize(){
      var $this = this;
      if($this.chartlist.barPhoneTotalPlot){
        $this.chartlist.barPhoneTotalPlot.resize();
      }
      if($this.chartlist.barPhoneEffectivePlot){
        $this.chartlist.barPhoneEffectivePlot.resize();
      }
      if($this.chartlist.pieDevicePlot){
        $this.chartlist.pieDevicePlot.resize();
      }
      if($this.chartlist.pieProductTypePlot){
        $this.chartlist.pieProductTypePlot.resize();
      }
      if($this.chartlist.columnWeekPlot){
        $this.chartlist.columnWeekPlot.resize();
      }
      if($this.chartlist.pieSourcePlot){
        $this.chartlist.pieSourcePlot.resize();
      }
      if($this.chartlist.lineDayPlot){
        $this.chartlist.lineDayPlot.resize();
      }
      if($this.chartlist.columnHoursPlot){
        $this.chartlist.columnHoursPlot.resize();
      }
      if($this.chartlist.columnProductPlot){
        $this.chartlist.columnProductPlot.resize();
      }
      if($this.chartlist.chart){
        $this.chartlist.chart.resize();
      }
    },

    numberSearch(arr,dst){
      for(var i=0;i < arr.length;i++ ){
          if (arr[i].phonenumber == dst){
            return arr[i].number
          }
      } 
      return '-';
    },

    percentSearch(arr,dst){
      for(var i=0;i < arr.length;i++ ){
          if (arr[i].phonenumber == dst){
            return arr[i].percenter
          }
      }
    }
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