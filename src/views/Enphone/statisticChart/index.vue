<template>
  <div class="page-root flex-box no-padding cn-phone-index cn-phone-stat" ref="boxPane">
    <div class="sub-router">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <div class="sub-wrapper">
          <div class="side-button">
            <router-link v-if="menuButtonPermit.includes('Enphone_search')" :to="{path:'/Enphone/searchClues'}" tag="a" target="_blank">
              <el-button type="primary" plain size="mini"><i class="svg-i" ><svg-icon icon-class="serch_en" /></i>搜索数据</el-button>
            </router-link>
            <router-link v-if="menuButtonPermit.includes('Enphone_countlist')" :to="{path:'/Enphone/statisticChart'}" tag="a" target="_blank">
              <el-button type="primary" plain size="mini"><i class="svg-i" ><svg-icon icon-class="analy_en" /></i>统计分析</el-button>
            </router-link>
            <router-link v-if="menuButtonPermit.includes('Enphone_phonecount')" :to="{path:'/Enphone/statisticClues'}" tag="a" target="_blank">
              <el-button type="primary" plain size="mini"><i class="svg-i" ><svg-icon icon-class="analy_en" /></i>业务员数据统计</el-button>
            </router-link>
          </div>
          <dl class="phone-list" v-if="menuButtonPermit.includes('Enphone_lookall')&&menuButtonPermit.includes('Enphone_lookwaitdealall')">
              <dd v-if="menuButtonPermit.includes('Enphone_lookall')">
                <router-link :to="{path:'/Enphone/phoneindex',query:{key:'all'}}">
                  <span>查看所有</span><i>({{linkAll.monthNum}})</i><em>({{linkAll.yestodayNum}})</em><b>({{linkAll.todayNum}})</b>
                </router-link>
              </dd>
              <dd v-if="menuButtonPermit.includes('Enphone_lookwaitdealall')">
                <router-link :to="{path:'/Enphone/phoneindex',query:{key:'unAllot'}}">
                  <span>未分配</span><i>({{linkAll.unAllotNum}})</i>
                </router-link>
              </dd>
          </dl>
          <template v-for="(item,index) in defaultData.data">
            <dl class="phone-list" v-if="item.phone.length>0" v-bind:key="index">
              <dt><span>{{item.brandname}}</span></dt>
              <dd v-for="(phone,index) in item.phone" v-bind:class="phone.isOn?'active':''" :key="index" :title="phone.phonenumber+phone.othername">
                <router-link :to="{path:'/Enphone/phoneindex',query:{phoneID:phone.id, waitstatus:phone.waitstatus}}">
                  <span>{{phone.phonenumber}}</span><i>({{phone.nowmonthnumber}})</i><em>({{phone.lastdaynumber}})</em><b>({{phone.nownumber}})</b>
                </router-link>
              </dd>
            </dl>
          </template>
        </div>
      </el-scrollbar>
    </div>
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
                          <el-checkbox class="all-select" :indeterminate="isAllSeoPhone" border size="mini" v-model="checkAllSeoPhone" @change="handleCheckAllSeoPhoneChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedSeo" @change="handleCheckedSeoChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="phone in item.children" :label="phone.value" :key="phone.value" border>{{phone.label}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                        <div class="team-header" v-else-if="item.icon=='i3'">
                          <span class="require">{{item.name}}：</span>
                          <el-checkbox class="all-select" :indeterminate="isAllMediaPhone" border size="mini" v-model="checkAllMediaPhone" @change="handleCheckAllMediaPhoneChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedMedia" @change="handleCheckedMediaChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="phone in item.children" :label="phone.value" :key="phone.value" border>{{phone.label}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                        <div class="team-header" v-else-if="item.icon=='i4'">
                          <span class="require">{{item.name}}：</span>
                          <el-checkbox class="all-select" :indeterminate="isAllSnsPhone" border size="mini" v-model="checkAllSnsPhone" @change="handleCheckAllSnsPhoneChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedSns" @change="handleCheckedSnsChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="phone in item.children" :label="phone.value" :key="phone.value" border>{{phone.label}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                        <div class="team-header" v-else>
                          <span class="require">{{item.name}}：</span>
                          <el-checkbox class="all-select" :indeterminate="isAllOtherPhone" border size="mini" v-model="checkAllOtherPhone" @change="handleCheckAllOtherPhoneChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedOther" @change="handleCheckedOtherChange" size="mini">
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
                                  <span class="require">国家：</span>
                                  <el-input
                                      size="mini"
                                      v-model="searchData.country"
                                      :class="searchData.country!=''?'el-xzstate':''"
                                      clearable>
                                  </el-input>
                            </div>
                            <div class="team-headerItem">
                                  <span class="require">大洲：</span>
                                  <el-input
                                      size="mini"
                                      v-model="searchData.continent"
                                      :class="searchData.continent!=''?'el-xzstate':''"
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
                                      v-model="searchData.remark1"
                                      :class="searchData.remark1!=''?'el-xzstate row-input':'row-input'"
                                      placeholder="备注1"
                                      clearable>
                                  </el-input>
                                  <el-input
                                      size="mini"
                                      v-model="searchData.remark2"
                                      :class="searchData.remark2!=''?'el-xzstate row-input':'row-input'"
                                      placeholder="备注2"
                                      clearable>
                                  </el-input>
                                  <el-input
                                      size="mini"
                                      v-model="searchData.remark3"
                                      :class="searchData.remark3!=''?'el-xzstate row-input':'row-input'"
                                      placeholder="备注3"
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
                      <div class="team-panel">
                        <div class="team-header">
                          <span class="require">性质：</span>                          
                          <el-select v-model="searchData.ennature" size="small" clearable placeholder="性质" :class="searchData.ennature!=''?'el-xzstate':''" style="width:320px;margin:5px 10px 5px 5px;">
                              <el-option
                                  v-for="item in natureList"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                              </el-option>
                          </el-select>
                        </div>
                      </div>
                      <div class="team-panel">
                        <div class="team-header">
                          <span class="require">有效：</span>                          
                          <el-checkbox class="item-checkbox" v-model="searchData.effective" size="mini" border>只显示有效</el-checkbox>
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
                    <div class="group-header"><el-checkbox class="all-select" :indeterminate="isAllItem" border size="mini" v-model="checkAllItem" @change="handleCheckAllItemChange">分析项全选</el-checkbox>
                    </div>
                    <div class="group-body">
                        <div class="team-panel">
                          <div class="team-header">
                            <el-checkbox-group class="team-list" v-model="checkedItem" @change="handleCheckedItemChange" size="mini">
                              <el-checkbox class="item-checkbox" v-for="item in resaultShowList" :label="item.value" :key="item.id" border>{{item.label}}</el-checkbox>
                            </el-checkbox-group>
                          </div>
                        </div>
                    </div>
                  </div>

                  <div class="card-header WebServerAddEditBtn ChinaphoneTwoBtn">
                      <el-button type="primary" class="updateBtn"  :class="isDisabled?'isDisabled':''" :disabled="isDisabled"  size="small" v-if="menuButtonPermit.includes('Enphone_countlist')" v-on:click="getCluesAnalysisData"><i class="svg-i planeWhite" ><svg-icon icon-class="planeWhite" /></i>生成数据</el-button>
                      <el-button type="primary" class="resetBtn" size="small" v-on:click="resetData()">重置</el-button>
                      <el-button type="primary" size="small" class="exportBtn" :disabled="isExportDisabled"  @click="dialogExportVisible = true"><i class="svg-i" ><svg-icon icon-class="derived" /></i>导出数据</el-button>
                  </div>
              </div>
          </el-card>
          <el-card class="box-card scroll-card cn-phone-result" shadow="hover" v-if="isSearch">
              <div class="card-content ChinaphoneTwoBox" ref="tableContent">
                <div class="cavans-wrapper" id="canvasPane" ref="canvasPane">
                  <el-row :gutter="15">
                    <el-col :md="24" :lg="12">
                      <div class="chart-wrapper" style="margin-bottom:15px">
                        <div class="chart-header"><span>询盘总数（{{searchResult.phoneTotalNum}}）</span></div>
                        <div class="chart-body" style="height:640px;">                        
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
                      <div class="chart-wrapper" style="margin-bottom:15px">
                        <div class="chart-header"><span>有效询盘（{{searchResult.phoneEffectiveNum}}）</span></div>
                        <div class="chart-body" style="height:640px;">                              
                            <div class="abs-canvas" v-if="searchResult.phoneEffectiveCount.length>0">
                              <div id="cluesChart2" class="chart-canvas"></div>
                            </div>
                            <div class="nocount" v-else>
                              暂无数据
                            </div> 
                        </div>
                      </div>
                    </el-col>
                    <el-col :md="24" :lg="12" v-if="checkedItem.includes(1)">
                      <div class="chart-wrapper" style="margin-bottom:15px">
                        <div class="chart-header"><span>使用设备</span></div>
                        <div class="chart-body" style="height:400px;">                                              
                            <div class="abs-canvas" v-if="searchResult.deviceCount.length>0">
                              <div id="cluesChart3" class="chart-canvas"></div>
                            </div>
                            <div class="nocount" v-else>
                              暂无数据
                            </div>
                        </div>
                      </div>
                    </el-col>
                    <el-col :md="24" :lg="12" v-if="checkedItem.includes(2)">
                      <div class="chart-wrapper" style="margin-bottom:15px">
                        <div class="chart-header"><span>产品分类</span></div>
                        <div class="chart-body" style="height:400px;">
                          <div class="abs-canvas" v-if="searchResult.productTypeCount.length>0"><div id="cluesChart4" class="chart-canvas"></div></div>
                          <div class="nocount" v-else>
                            暂无数据
                          </div>
                        </div>
                      </div>
                    </el-col>
                    <el-col :md="24" :lg="12" v-if="checkedItem.includes(3)">
                      <div class="chart-wrapper" style="margin-bottom:15px">
                        <div class="chart-header"><span>平均星期询盘量</span></div>
                        <div class="chart-body" style="height:400px;">
                            <div class="abs-canvas" v-if="searchResult.weekCount.length>0">
                              <div id="cluesChart5" class="chart-canvas"></div>
                            </div>
                            <div class="nocount" v-else>
                              暂无数据
                            </div>
                        </div>
                      </div>
                    </el-col>
                    <el-col :md="24" :lg="12" v-if="checkedItem.includes(4)">
                      <div class="chart-wrapper" style="margin-bottom:15px">
                        <div class="chart-header"><span>来源渠道</span></div>
                        <div class="chart-body" style="height:400px;">
                          <div class="abs-canvas" v-if="searchResult.sourceCount.length>0"><div id="cluesChart6" class="chart-canvas"></div></div>
                          <div class="nocount" v-else>
                            暂无数据
                          </div>
                        </div>
                      </div>
                    </el-col>
                    <el-col :md="24" :lg="12" v-if="checkedItem.includes(9)">
                      <div class="chart-wrapper" style="margin-bottom:15px">
                        <div class="chart-header"><span>月询盘趋势</span></div>
                        <div class="chart-body" style="height:400px;">
                            <div class="abs-canvas" v-if="searchResult.monthCount.length>0">
                              <div id="cluesChart12" class="chart-canvas"></div>
                            </div>
                            <div class="nocount" v-else>
                              暂无数据
                            </div>
                        </div>
                      </div>
                    </el-col>
                    <el-col :md="24" :lg="12" v-if="checkedItem.includes(10)">
                      <div class="chart-wrapper" style="margin-bottom:15px">
                        <div class="chart-header"><span>季度询盘趋势</span></div>
                        <div class="chart-body" style="height:400px;">
                            <div class="abs-canvas" v-if="searchResult.seasonCount.length>0">
                              <div id="cluesChart13" class="chart-canvas"></div>
                            </div>
                            <div class="nocount" v-else>
                              暂无数据
                            </div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="15" v-if="checkedItem.includes(11)">
                    <el-col :xs="24">
                      <div class="chart-wrapper" style="margin-bottom:15px">
                        <div class="chart-header"><span>周询盘趋势</span></div>
                        <div class="chart-body" style="height:400px;">
                          <div class="abs-canvas" v-if="searchResult.weekListCount.length > 0"><div id="cluesChart14" class="chart-canvas"></div></div>
                          <div class="nocount" v-else>
                              暂无数据
                          </div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="15" v-if="checkedItem.includes(5)">
                    <el-col :xs="24">
                      <div class="chart-wrapper">
                        <div class="chart-header"><span>每天询盘量</span></div>
                        <div class="chart-body" style="height:400px;">
                          <div class="abs-canvas" v-if="searchResult.dayCount.length"><div id="cluesChart7" class="chart-canvas"></div></div>
                          <div class="nocount" v-else>
                              暂无数据
                          </div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="15" v-if="checkedItem.includes(6)">
                    <el-col :xs="24">
                      <div class="chart-wrapper">
                        <div class="chart-header"><span>平均小时询盘量</span></div>
                        <div class="chart-body" style="height:400px;">
                            <div class="abs-canvas" v-if="searchResult.hoursCount.length>0">
                              <div id="cluesChart8" class="chart-canvas"></div>
                            </div>
                            <div class="nocount" v-else>
                              暂无数据
                            </div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="15" v-if="checkedItem.includes(7)">
                    <el-col :xs="24">
                      <div class="chart-wrapper">
                        <div class="chart-header"><span>热门产品</span></div>
                        <div class="chart-body" style="height:400px;">
                            <div class="abs-canvas" v-if="searchResult.productCount.length>0">
                              <div id="cluesChart9" class="chart-canvas"></div>
                            </div>
                            <div class="nocount" v-else>
                              暂无数据
                            </div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="15" v-if="checkedItem.includes(8)">
                    <el-col :xs="24">
                      <div class="chart-wrapper">
                        <div class="chart-header"><span>热门国家</span></div>
                        <div class="chart-body chartmap-body" style="height:540px;text-align:center;">
                          <div class="map-panel flex-box">
                            <div class="map-chart enmap-chart">
                                <div id="cluesChart10" class="chart-canvas" ></div>
                            </div>
                            <div class="flex-content table-panel">
                              <div class="table-chart">
                                <el-table
                                  border
                                  ref="simpleTable"
                                  :data="searchResult.regionCount"
                                  tooltip-effect="dark"
                                  stripe
                                  height="480"
                                  style="width: 100%;"
                                  row-key="id"
                                  show-summary
                                  :summary-method="getSummaries"
                                  :default-sort = "{prop: 'number', order: 'descending'}"
                                  >
                                  <el-table-column
                                    prop="country"
                                    label="地区"
                                    >
                                  </el-table-column>
                                  <el-table-column
                                    prop="number"
                                    label="数量"
                                    sortable
                                    >
                                  </el-table-column>
                                </el-table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="15">
                    <el-col :md="24" :lg="12" v-if="checkedItem.includes(7)">
                      <div class="chart-wrapper">
                        <div class="chart-header"><span>产品</span></div>
                        <div class="chart-body">
                          <div class="table-chart">
                            <el-table
                              border
                              ref="simpleProductTable"
                              :data="searchResult.productCount"
                              tooltip-effect="dark"
                              stripe
                              style="width: 100%"
                              height="540"
                              row-key="id"
                              show-summary
                              :summary-method="getSummaries"
                              :default-sort = "{prop: 'number', order: 'descending'}"
                              >
                              <el-table-column
                                prop="name"
                                label="产品"
                                >
                              </el-table-column>
                              <el-table-column
                                prop="number"
                                label="数量"
                                sortable
                                >
                              </el-table-column>
                            </el-table>
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
    <el-dialog title="导出" custom-class="export-dialog" :visible.sync="dialogExportVisible" width="440px">
        <el-form :inline="true" :model="exportForm">
            <el-form-item label="文件名称：" :label-width="formLabelWidth">
            <el-input v-model="exportForm.fileName" placeholder="文件名 (默认：excel-list)" prefix-icon="el-icon-document"></el-input>
            </el-form-item>
            <el-form-item label="文件类型：" :label-width="formLabelWidth">
            <el-select v-model="exportForm.bookType" placeholder="请选择导出文件类型">
                <el-option label="xlsx" value="xlsx"></el-option>
                <el-option label="csv" value="csv"></el-option>
                <el-option label="txt" value="txt"></el-option>
            </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
            <el-button @click="dialogExportVisible = false">取 消</el-button>
            <el-button :loading="downloadLoading" type="primary" icon="el-icon-document" @click="handleDownload">导 出</el-button>
            </span>
        </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import * as echarts from 'echarts';
import {MapInterval} from "@/utils/MapColor";
import {sortByDesc,pickerDayRangeOptions} from "@/utils/index";
import { worldCountry } from "@/utils/worldCountry";
export default {
  name: 'enstatisticChart',
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
      isAllSeoPhone:false,
      checkAllSeoPhone:false,
      isAllMediaPhone:false,
      checkAllMediaPhone:false,
      isAllSnsPhone:false,
      checkAllSnsPhone:false,
      isAllOtherPhone:false,
      checkAllOtherPhone:false,
      checkedSem:[],
      checkedSeo:[],
      checkedMedia:[],
      checkedSns:[],
      checkedOther:[],
      searchData:{
        date:[],
        ennature:'',
        effective:false,
        country:'',
        continent:'',
        material:'',
        domain:'',
        remark1:'',
        remark2: '',
        remark3: '',
        url:''
      },
      pickerRangeOptions: pickerDayRangeOptions,
      natureList:[],
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
        hoursCount:[],
        deviceCount:[],
        dayCount:[],
        productCount:[],
        sourceCount:[],
        phoneCount:[],
        phoneEffectiveCount:[],
        phoneTotalNum:0,
        phoneEffectiveNum:0,
        productTypeCount:[],
        regionCount:[],
        regionMap:[],
        searchWordCount:[],
        weekCount:[],
        materlist:[],
        monthCount:[],
        seasonCount:[],
        weekListCount:[]
      },
      maxWeek:[],
      minWeek:[],
      maxWeekNum:0,
      minWeekNum:0,
      maxHours:[],
      minHours:[],
      maxHoursNum:0,
      minHoursNum:0,
      maxProduct:[],
      minProduct:[],
      maxProductNum:0,
      minProductNum:0,
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
        chart:'',
        monthPlot:'',
        seasonPlot:'',
        weekPlot: ''
      },
      formLabelWidth:"120px",
      exportForm:{
          fileName:"",
          bookType:"xlsx"
      },
      dialogExportVisible:false,
      downloadLoading: false,
      isExportDisabled:true,
      resaultShowList:[
        {id:1,value:1,label:"使用设备"},
        {id:2,value:2,label:"产品分类"},
        {id:3,value:3,label:"平均星期询盘量"},
        {id:4,value:4,label:"来源渠道"},
        {id:5,value:5,label:"每天询盘量"},
        {id:6,value:6,label:"平均小时询盘量"},
        {id:7,value:7,label:"热门产品"},
        {id:8,value:8,label:"热门国家"},
        {id:11, value: 11, label: "询盘周趋势"},
        {id:9,value:9,label:"询盘月趋势"},
        {id:10,value:10,label:"询盘季度趋势"}
      ],
      isAllItem:false,
      checkAllItem:false,
      checkedItem:[],
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
    if(this.sidebar.opened){
      $this.$store.dispatch('app/toggleSideBar');
    }
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
    // 右侧标题-左侧电话括号小数字
    leftPhoto(){
      var $this=this;
      $this.$store.dispatch('enphone/getLeftPhotoAction', null).then(response=>{
        if(response){
          if(response.status){
              $this.linkAll.todayNum = response.alltodaynumber;
              $this.linkAll.yestodayNum = response.alllastnumber;
              $this.linkAll.monthNum = response.allnumber;
              $this.linkAll.unAllotNum = response.nodealcount;
              var brandID = null;              
              $this.brandID = brandID;
              $this.defaultData = response;
              $this.getSearchSystemData();
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
      $this.searchData.continent="";
      $this.searchData.material="";
      $this.searchData.domain='';
      $this.searchData.remark1='';
      $this.searchData.remark2='';
      $this.searchData.remark3='';
      $this.searchData.url='';
      $this.searchData.ennature='';
      $this.searchData.effective=false;
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
      $this.searchResult.monthCount=[];
      $this.searchResult.seasonCount=[];
      $this.searchResult.weekListCount = [];
      $this.isExportDisabled = true;
      $this.isAllItem=false;
      $this.checkAllItem=false;
      $this.checkedItem=[];
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.leftPhoto();
    },
    // 组装搜索接口所需数据
    initSearchData(){
      var $this = this;
      var searchData = {};
      if($this.searchData.country&&$this.searchData.country!=''){
        searchData.country = $this.searchData.country;
      }
      if($this.searchData.continent&&$this.searchData.continent!=''){
        searchData.continent = $this.searchData.continent;
      }
      if($this.searchData.material&&$this.searchData.material!=''){
        searchData.material = $this.searchData.material;
      }
      if($this.searchData.domain&&$this.searchData.domain!=''){
        searchData.domain = $this.searchData.domain;
      }
      if($this.searchData.remark1&&$this.searchData.remark1!=''){
        searchData.remark1 = $this.searchData.remark1;
      }
      if($this.searchData.remark2&&$this.searchData.remark2!=''){
        searchData.remark2 = $this.searchData.remark2;
      }
      if($this.searchData.remark3&&$this.searchData.remark3!=''){
        searchData.remark3 = $this.searchData.remark3;
      }
      if($this.searchData.url&&$this.searchData.url!=''){
        searchData.url = $this.searchData.url;
      }
      if($this.searchData.ennature&&$this.searchData.ennature!=''){
        searchData.ennature = $this.searchData.ennature;
      }
      searchData.effective = $this.searchData.effective?1:0;
      if($this.searchData.date&&$this.searchData.date.length>0){
        searchData.starttime = $this.searchData.date[0];
        searchData.endtime = $this.searchData.date[1];
      }else{
        searchData.starttime = "";
        searchData.endtime = "";
      }
      searchData.type = $this.checkedItem;
      var checkedSem = $this.checkedSem;
      var checkedSeo = $this.checkedSeo;
      var checkedMedia = $this.checkedMedia;
      var checkedSns = $this.checkedSns;
      var checkedOther = $this.checkedOther;
      searchData.phoneid = checkedSem.concat(checkedSeo).concat(checkedMedia).concat(checkedSns).concat(checkedOther);
      if($this.checkedSource&&$this.checkedSource!=''){
        searchData.mode = $this.checkedSource;
      }
      if($this.checkedLevel&&$this.checkedLevel!=''){
        searchData.level_id = $this.checkedLevel;
      }
      if($this.checkedDevice&&$this.checkedDevice!=''){
        searchData.device = $this.checkedDevice;
      }
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
            if($this.menuButtonPermit.includes('Enphone_countlist')){
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
      $this.$store.dispatch('enphone/inquiryItemAction').then(response=>{
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
            var natureList=[];
            response.ennature.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              natureList.push(itemData);
            });
            $this.natureList = natureList;
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
    // 电话点击跳转列表
    phoneJump(id){
      var $this=this;
      var queryObj = {};
      queryObj.phoneID = id;
      $this.$router.push({path:'/Chinaphone/phoneindex',query:queryObj});
    },
    // 搜索统计数据跳转
    searchStatisticsData(){
      var $this = this;
      $this.$router.push({path:'/Enphone/searchClues'});
    },
    // 统计分析跳转
    statisticsClues(){
      var $this = this;
      $this.$router.push({path:'/Enphone/statisticChart'});
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
        $this.$store.dispatch('enphone/inquirySearchAction', searchData).then(response=>{
          if(response){
            if(response.status){
              $this.isSearch=true;
              $this.searchResult.hoursCount = response.avghourscount ? response.avghourscount : [];
              var deviceCount=[];
              if(response.devicecount){
                if(response.devicecount.length>0){
                  response.devicecount.forEach(function(item){
                      item.count="count";
                      deviceCount.push(item);
                  });
                }
              }
              $this.searchResult.deviceCount = deviceCount;
              $this.searchResult.dayCount = response.everydaycount ? response.everydaycount : [];
              $this.searchResult.productCount = response.hotproductcount ? response.hotproductcount : [];
              $this.searchResult.sourceCount = response.modecount ? response.modecount : [];
              $this.searchResult.phoneCount = response.phonecount ? response.phonecount : [];
              $this.searchResult.phoneEffectiveCount = response.phonecounteffective ? response.phonecounteffective : [];
              $this.searchResult.phoneTotalNum = response.phonenumber ? response.phonenumber : [];
              $this.searchResult.phoneEffectiveNum = response.phonenumbereffective ? response.phonenumbereffective : [];
              $this.searchResult.productTypeCount = response.producttypecount ? response.producttypecount : [];
              $this.searchResult.regionCount = response.provincecoun ? response.provincecoun : [];
              $this.searchResult.regionMap = response.provincecountmap ? response.provincecountmap : [];
              $this.searchResult.materlist = response.materlist ? response.materlist : [];
              $this.searchResult.monthCount = response.monthtrend ? response.monthtrend : [];
              $this.searchResult.seasonCount = response.quartertrend ? response.quartertrend : [];
              $this.searchResult.weekListCount = response.weektrend ? response.weektrend : [];
              // $this.searchResult.searchWordCount = response.searchwordcount;
              var numArr = [];
              if(response.weekdaycount){
                if(response.weekdaycount.length>0){
                  response.weekdaycount.forEach(function(item,index){
                    numArr.push(item.number);
                  });
                }
              }
              var maxWeekNum = Math.max(...numArr);
              var minWeekNum = Math.min(...numArr);
              var maxWeek = [];
              var minWeek = [];
              if(response.weekdaycount){
                if(response.weekdaycount.length>0){
                  response.weekdaycount.forEach(function(item,index){
                    if(item.number === maxWeekNum){
                      maxWeek.push(item.weekday)
                    }else if(item.number === minWeekNum){
                      minWeek.push(item.weekday);
                    }
                  });
                }
              }
              $this.maxWeekNum = maxWeekNum;
              $this.minWeekNum = minWeekNum;
              $this.maxWeek = maxWeek;
              $this.minWeek = minWeek;
              $this.searchResult.weekCount = response.weekdaycount ? response.weekdaycount : [];
              var numHoursArr = [];
              if(response.avghourscount){
                if(response.avghourscount.length>0){
                  response.avghourscount.forEach(function(item,index){
                    numHoursArr.push(item.number);
                  });
                }
              }
              var maxHoursNum = Math.max(...numHoursArr);
              var minHoursNum = Math.min(...numHoursArr);
              var maxHours = [];
              var minHours = [];
              if(response.avghourscount){
                if(response.avghourscount.length>0){
                  response.avghourscount.forEach(function(item,index){
                    if(item.number === maxHoursNum){
                      maxHours.push(item.hours)
                    }else if(item.number === minHoursNum){
                      minHours.push(item.hours);
                    }
                  });
                }
              }
              $this.maxHoursNum = maxHoursNum;
              $this.minHoursNum = minHoursNum;
              $this.maxHours = maxHours;
              $this.minHours = minHours;
              var numProductArr = [];
              if(response.hotproductcount){
                if(response.hotproductcount.length>0){
                  response.hotproductcount.forEach(function(item,index){
                    numProductArr.push(item.number);
                  });
                }
              }
              var maxProductNum = Math.max(...numProductArr);
              var minProductNum = Math.min(...numProductArr);
              var maxProduct = [];
              var minProduct = [];
              if(response.hotproductcount){
                if(response.hotproductcount.length>0){
                  response.hotproductcount.forEach(function(item,index){
                    if(item.number === maxProductNum){
                      maxProduct.push(item.name)
                    }else if(item.number === minProductNum){
                      minProduct.push(item.name);
                    }
                  });
                }
              }
              $this.maxProductNum = maxProductNum;
              $this.minProductNum = minProductNum;
              $this.maxProduct = maxProduct;
              $this.minProduct = minProduct;
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
                if($this.chartlist.pieDevicePlot){
                  $this.chartlist.pieDevicePlot.dispose();
                }
                if($this.checkedItem.includes(1)){
                  $this.drawChart3();
                }
                if($this.chartlist.pieProductTypePlot){
                  $this.chartlist.pieProductTypePlot.dispose();
                }
                if($this.checkedItem.includes(2)){
                  $this.drawChart4();
                }
                if($this.chartlist.columnWeekPlot){
                  $this.chartlist.columnWeekPlot.dispose();
                }
                if($this.checkedItem.includes(3)){
                  $this.drawChart5();
                }
                if($this.chartlist.pieSourcePlot){
                  $this.chartlist.pieSourcePlot.dispose();
                }
                if($this.checkedItem.includes(4)){
                  $this.drawChart6();
                }
                if($this.chartlist.lineDayPlot){
                  $this.chartlist.lineDayPlot.dispose();
                }
                if($this.checkedItem.includes(5)){
                  $this.drawChart7();
                }
                if($this.chartlist.columnHoursPlot){
                  $this.chartlist.columnHoursPlot.dispose();
                }
                if($this.checkedItem.includes(6)){
                  $this.drawChart8();
                }
                if($this.chartlist.columnProductPlot){
                  $this.chartlist.columnProductPlot.dispose();
                }
                if($this.checkedItem.includes(7)){
                  $this.drawChart9();
                }
                if($this.chartlist.chart){
                  $this.chartlist.chart.dispose();
                }
                if($this.checkedItem.includes(8)){
                  $this.drawChart10();
                }
                if($this.chartlist.monthPlot){
                  $this.chartlist.monthPlot.dispose();
                }
                if($this.checkedItem.includes(9)){
                  $this.drawChart12();
                }
                if($this.chartlist.seasonPlot){
                  $this.chartlist.seasonPlot.dispose();
                }
                if($this.checkedItem.includes(10)){
                  $this.drawChart13();
                }
                if($this.checkedItem.includes(11)){
                  $this.drawChart14();
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
    // 选中所有电话事件 注！sem->i1;seo->i2;we-media->i3;sns->i4;other未修改
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
            $this.checkedSeo = checkedList;
            $this.checkAllSeoPhone = true;
          }else if(item.icon=="i3"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedMedia = checkedList;
            $this.checkAllMediaPhone = true;
          }else if(item.icon=="i4"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedSns = checkedList;
            $this.checkAllSnsPhone = true;
          }
          // else{
          //   item.children.forEach(function(item1,index1){
          //     checkedList.push(item1.value);
          //   });
          //   $this.checkedOther = checkedList;
          //   $this.checkAllOtherPhone = true;
          // }
        });
      }else{
        $this.checkedSem = [];
        $this.checkedSeo = [];
        $this.checkedMedia = [];
        $this.checkedSns = [];
        // $this.checkedOther = [];
        $this.checkAllSemPhone = false;
        $this.checkAllSeoPhone = false;
        $this.checkAllMediaPhone = false;
        $this.checkAllSnsPhone = false;
        // $this.checkAllOtherPhone = false;
      }
      $this.isAllPhone = false;
      $this.isAllSemPhone = false;
      $this.isAllSeoPhone = false;
      $this.isAllMediaPhone = false;
      $this.isAllSnsPhone = false;
      // $this.isAllOtherPhone = false;
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
    handleCheckAllSeoPhoneChange(e){
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
        $this.checkedSeo = checkedList;
      }else{
        $this.checkedSeo = [];
      }
      $this.isAllSeoPhone = false;
      $this.allPhoneSelectedStatus();
    },
    handleCheckAllMediaPhoneChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.phoneList.forEach(function(item,index){
          if(item.icon=="i3"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedMedia = checkedList;
      }else{
        $this.checkedMedia = [];
      }
      $this.isAllMediaPhone = false;
      $this.allPhoneSelectedStatus();
    },
    handleCheckAllSnsPhoneChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.phoneList.forEach(function(item,index){
          if(item.icon=="i4"){
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
    handleCheckAllOtherPhoneChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.phoneList.forEach(function(item,index){
          if(item.icon=="other"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedOther = checkedList;
      }else{
        $this.checkedOther = [];
      }
      $this.isAllOtherPhone = false;
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
    handleCheckedSeoChange(e){
      var $this = this;
      var checkedCount = e.length;
      $this.phoneList.forEach(function(item,index){
        if(item.icon=="i2"){
          if(checkedCount === item.children.length){
            $this.checkAllSeoPhone = true;
          }else{
            $this.checkAllSeoPhone = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllSeoPhone = true;
          }else{
            $this.isAllSeoPhone = false;
          }
        }
      });
      $this.allPhoneSelectedStatus();
    },
    handleCheckedMediaChange(e){
      var $this = this;
      var checkedCount = e.length;
      $this.phoneList.forEach(function(item,index){
        if(item.icon=="i3"){
          if(checkedCount === item.children.length){
            $this.checkAllMediaPhone = true;
          }else{
            $this.checkAllMediaPhone = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllMediaPhone = true;
          }else{
            $this.isAllMediaPhone = false;
          }
        }
      });
      $this.allPhoneSelectedStatus();
    },
    handleCheckedSnsChange(e){
      var $this = this;
      var checkedCount = e.length;
      $this.phoneList.forEach(function(item,index){
        if(item.icon=="i4"){
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
    handleCheckedOtherChange(e){
      var $this = this;
      var checkedCount = e.length;
      $this.phoneList.forEach(function(item,index){
        if(item.icon=="other"){
          if(checkedCount === item.children.length){
            $this.checkAllOtherPhone = true;
          }else{
            $this.checkAllOtherPhone = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllOtherPhone = true;
          }else{
            $this.isAllOtherPhone = false;
          }
        }
      });
      $this.allPhoneSelectedStatus();
    },
    // 全选按钮状态事件
    allPhoneSelectedStatus(){
      var $this = this;
      var totalCheckedCount = $this.checkedSem.length+$this.checkedSeo.length+$this.checkedMedia.length+$this.checkedSns.length;
      // +$this.checkedOther.length;
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
    // 分析项筛选
    handleCheckAllItemChange(e){
      var $this = this;
      if(e){
        var checkedItem = [];
        $this.resaultShowList.forEach(function(item,index){
          checkedItem.push(item.value);
        });
        $this.checkedItem = checkedItem;
        $this.checkAllItem= true;
      }else{
        $this.checkedItem = [];
        $this.checkAllItem = false;
      }
      $this.isAllItem = false;
    },
    handleCheckedItemChange(e){
      var $this = this;
      var checkedCount = e.length;
       if(checkedCount === $this.resaultShowList.length){
          $this.checkAllItem = true;
        }else{
          $this.checkAllItem = false;
        }
        if(checkedCount>0&&checkedCount<$this.resaultShowList.length){
          $this.isAllItem = true;
        }else{
          $this.isAllItem = false;
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
          animation: false,
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
          animation: false,
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
    drawChart3(){
      var $this = this;
      if($this.searchResult.deviceCount.length>0){
        var newData = [];
        $this.searchResult.deviceCount.forEach(function(item,index){
          var objitem={};
          objitem.value= item.number;
          objitem.name = item.devicename;
          newData.push(objitem);
        });
        var chartDom = document.getElementById('cluesChart3');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          tooltip: {
            trigger: 'item',
            formatter(items){
              var tooltext = `<div class="counttoolTip">
              <div class="title">${items.name}</div>
              <div class="bar clearfix">
                ${items.marker}
                <span class="name">${items.seriesName}：</span>
                <span class="num">${items.value}</span>
              </div>
              `;
              return tooltext;
            }
          },
          legend: {
            orient: 'vertical',
            right: 'right',
            top: 'middle',
            itemWidth: 8,
            itemHeight: 8,
            icon: "circle",
          },
          color: ["#6395f9","#62daab","#5d7092","#f6bd16","#7666f9"],
          animation: false,
          series: [
            {
              name: '询盘个数',
              type: 'pie',
              radius: '75%',
              data: newData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              label:{
                  normal:{
                      formatter: function(params){
                          var str = '';
                          str = params.name+":"+params.percent.toFixed(1)+"%";
                          return str
                      },
                      position: 'outside',
                      fontSize: 13,
                      color: "#666",
                  }
                },
            }
          ]
        };
        option && myChart.setOption(option);
        $this.chartlist.pieDevicePlot = myChart;
      }
    },
    // 图表功能
    drawChart4(){
      var $this = this;
      if($this.searchResult.productTypeCount.length>0){
        var newData = [];
        $this.searchResult.productTypeCount.forEach(function(item,index){
          var objitem={};
          objitem.value= item.number;
          objitem.name = item.name;
          newData.push(objitem);
        });

        var chartDom = document.getElementById('cluesChart4');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          tooltip: {
            trigger: 'item',
            formatter(items){
              var tooltext = `<div class="counttoolTip">
              <div class="title">${items.name}</div>
              <div class="bar clearfix">
                ${items.marker}
                <span class="name">${items.seriesName}：</span>
                <span class="num">${items.value}</span>
              </div>
              `;
              return tooltext;
            }
          },
          legend: {
            orient: 'vertical',
            right: 'right',
            top: 'middle',
            itemWidth: 8,
            itemHeight: 8,
            icon: "circle",
          },
          color: ["#6395f9","#62daab","#5d7092","#f6bd16","#7666f9"],
          animation: false,
          series: [
            {
              name: '询盘个数',
              type: 'pie',
              radius: '75%',
              data: newData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              label:{
                  normal:{
                      formatter: function(params){
                          var str = '';
                          str = params.name+":"+params.percent.toFixed(1)+"%";
                          return str
                      },
                      position: 'outside',
                      fontSize: 13,
                      color: "#666",
                  }
                },
            }
          ]
        };
        option && myChart.setOption(option);
        $this.chartlist.pieProductTypePlot = myChart;

      }
    },
    // 图表功能
    drawChart5(){
      var $this = this;
      if($this.searchResult.weekCount.length>0){
        const maxColor = '#FF4500';
        const minColor = '#1CC25E';
        const defaultColor = '#5B8FF9';      
        var datalist = [];
        var daylist = [];
        $this.searchResult.weekCount.forEach(function(item,index){
          datalist.push(item.number);
          daylist.push(item.weekday);
        });

        var chartDom = document.getElementById('cluesChart5');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          tooltip:{
            trigger: 'axis',
            axisPointer:{
              type: 'shadow'
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
            position: 'top',
            color: "#000",
            distance: 8,
          },
          xAxis: {
            type: 'category',
            axisLine:{
              lineStyle:{
                color: "#dedede"
              }
            },
            data: daylist,
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
          series: [
            {
              name: '询盘个数',
              type: 'bar',
              data: datalist,
              barMaxWidth: '60',
              itemStyle:{
                normal:{
                  color:function(params){
                    var currentColor = defaultColor;
                    $this.maxWeek.forEach(function(item,index){
                      if(item == params.name){
                        currentColor = maxColor;
                      }
                    });
                    $this.minWeek.forEach(function(item,index){
                      if(item == params.name){
                        currentColor = minColor;
                      }
                    });
                    return currentColor;
                  }
                }
              }
            }
          ]
        };

        option && myChart.setOption(option);
        $this.chartlist.columnWeekPlot = myChart;

      }
    },
    // 图表功能
    drawChart6(){
      var $this = this;
      if($this.searchResult.sourceCount.length>0){

        var newData = [];
        $this.searchResult.sourceCount.forEach(function(item,index){
          var objitem={};
          objitem.value= item.number;
          objitem.name = item.name;
          newData.push(objitem);
        });

        var chartDom = document.getElementById('cluesChart6');
        var myChart = echarts.init(chartDom);
        var totalnum = $this.searchResult.sourceCount.reduce((a, b) => a + b.number, 0);
        var option;
        var title = '总计';
        option = {
          title:{
            text: title,
            textStyle:{
              fontSize: 20,
              fontWeight: 'normal',
              color: '#000'
            },
            subtext: totalnum,
            subtextStyle:{
              fontSize: 28,
              fontWeight: 'bold',
              color: '#000'
            },
            left: 'center',
            top: '42%'
          },
          legend: {
            orient: 'vertical',
            right: 'right',
            top: 'middle',
            itemWidth: 8,
            itemHeight: 8,
            icon: 'circle',
          },
          color: ["#6395f9","#62daab","#5d7092","#f6bd16","#7666f9"],
          animation: false,
          series: [
            {
              name: '询盘个数',
              type: 'pie',
              radius: ['55%','85%'],
              data: newData,
              label: {
                show: true,
                position: 'inner',
                fontSize: 13,
                color:"#fff",
                formatter(item){
                  if(item.percent > 4){
                    return item.percent+"%"
                  }else{
                    return ""
                  }
                }
              },
              emphasis: {
                label: {
                  show: true,
                }
              },
              labelLine: {
                show: false
              },
            }
          ]
        };
        option && myChart.setOption(option);
        $this.chartlist.pieSourcePlot = myChart;

        myChart.on("mouseover",function(item){
          myChart.setOption({
            title:{
              text: item.data.name,
              subtext: item.data.value
            } 
          });
        })
        myChart.on("mouseout",function(item){
          myChart.setOption({
            title:{
              text: title,
              subtext: totalnum
            } 
          });
        })

      }
    },
    renderStatistic(containerWidth, text, style) {
      const { width: textWidth, height: textHeight } = measureTextWidth(text, style);
      const R = containerWidth / 2;
      // r^2 = (w / 2)^2 + (h - offsetY)^2
      var scale = 1;
      if (containerWidth < textWidth) {
        scale = Math.min(Math.sqrt(Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)))), 1);
      }
      const textStyleStr = `width:${containerWidth}px;`;
      return `<div style="${textStyleStr};font-size:${scale}em;line-height:${scale < 1 ? 1 : 'inherit'};">${text}</div>`;
    },
    // 图表功能
    drawChart7(){
      var $this = this;
      if($this.searchResult.dayCount.length>0){
        var chartDom = document.getElementById('cluesChart7');
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
                color: "#5b8ff9"
              }
            },
            formatter(params){
              return `<div class="toolDiv">
                    <div class="tooltitle">${params[0].name}</div>
                    <div class="bar clearfix">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#0970ff;"></span>
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
            source: $this.searchResult.dayCount,  
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
                borderColor: "#0970ff",
                borderWidth: 1
              },
              lineStyle:{
                color: "#0970ff",
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
        $this.chartlist.lineDayPlot = myChart;
      }
    },
    // 图表功能
    drawChart8(){
      var $this = this;
      if($this.searchResult.hoursCount.length>0){

        const maxColor = '#FF4500';
        const minColor = '#1CC25E';
        const defaultColor = '#5B8FF9';      
        var datalist = [];
        var daylist = [];
        $this.searchResult.hoursCount.forEach(function(item,index){
          datalist.push(item.number);
          daylist.push(item.hours);
        });

        var chartDom = document.getElementById('cluesChart8');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          tooltip:{
            trigger: 'axis',
            axisPointer:{
              type: 'shadow'
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
            position: 'top',
            color: "#000",
            distance: 8,
          },
          xAxis: {
            type: 'category',
            axisLine:{
              lineStyle:{
                color: "#dedede"
              }
            },
            data: daylist,
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
          series: [
            {
              name: '询盘个数',
              type: 'bar',
              data: datalist,
              barMaxWidth: 40,
              itemStyle:{
                normal:{
                  color:function(params){
                    var currentColor = defaultColor;
                    $this.maxHours.forEach(function(item,index){
                      if(item == params.name){
                        currentColor = maxColor;
                      }
                    });
                   $this.minHours.forEach(function(item,index){
                      if(item == params.name){
                        currentColor = minColor;
                      }
                    });
                    return currentColor;
                  }
                }
              }
            }
          ]
        };

        option && myChart.setOption(option);
        $this.chartlist.columnHoursPlot = myChart;

      }
    },
    // 图表功能
    drawChart9(){
      var $this = this;
      if($this.searchResult.productCount.length>0){ 
         
        const maxColor = '#FF4500';
        const minColor = '#1CC25E';
        const defaultColor = '#5B8FF9';      
        var numberlist = [];
        var namelist = [];
        $this.searchResult.productCount.forEach(function(item,index){
          numberlist.push(item.number);
          namelist.push(item.name);
        });

        var chartDom = document.getElementById('cluesChart9');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          tooltip:{
            trigger: 'axis',
            axisPointer:{
              type: 'shadow'
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
            position: 'top',
            color: "#000",
            distance: 8,
          },
          xAxis: {
            type: 'category',
            name: '日期',
            axisLine:{
              lineStyle:{
                color: "#dedede"
              }
            },
            data: namelist,
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
          series: [
            {
              name: '询盘个数',
              type: 'bar',
              data: numberlist,
              barMaxWidth: 40,
              itemStyle:{
                normal:{
                  color:function(params){
                    var currentColor = defaultColor;
                    $this.maxProduct.forEach(function(item,index){
                      if(item == params.name){
                        currentColor = maxColor;
                      }
                    });
                    $this.minProduct.forEach(function(item,index){
                      if(item == params.name){
                        currentColor = minColor;
                      }
                    });
                    return currentColor;
                  }
                }
              }
            }
          ]
        };

        option && myChart.setOption(option);
        $this.chartlist.columnProductPlot = myChart;

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
          animation: false,
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
    // 月趋势
    drawChart12(){
      var $this = this;
      if($this.searchResult.monthCount.length>0){
        var chartDom = document.getElementById('cluesChart12');
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
                color: "#5b8ff9"
              }
            },
            formatter(params){
              return `<div class="toolDiv">
                    <div class="tooltitle">${params[0].name}</div>
                    <div class="bar clearfix">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#0970ff;"></span>
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
            source: $this.searchResult.monthCount,  
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
                borderColor: "#0970ff",
                borderWidth: 1
              },
              lineStyle:{
                color: "#0970ff",
                width: 1
              },
              areaStyle:{
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                    offset: 0,
                    color:'#0970ff',
                    opacity:1
                    },
                    {
                    offset: 1,
                    color: "rgba(255, 255, 255, 0)",
                    }
                ]),
                opacity:0.3
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
        $this.chartlist.monthPlot = myChart;
      }
    },
    // 季度趋势
    drawChart13(){
      var $this = this;
      if($this.searchResult.seasonCount.length>0){
        var chartDom = document.getElementById('cluesChart13');
        var myChart = echarts.init(chartDom);
        var option;
        var numberlist = [];
        $this.searchResult.seasonCount.forEach(function(item,index){
          var data = {};
          data.name=item.name;
          data.number=item.number;
          data.startDate=item.startDate;
          data.endDate=item.endDate;
          numberlist.push(data);
        });
        option = {
          grid:{
            left: '45',
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
                color: "#5b8ff9"
              }
            },
            formatter(params){
              return `<div class="toolDiv">
                    <div class="tooltitle">${params[0].name}</div>
                    <div class="bar clearfix">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#0970ff;"></span>
                      <span>开始时间：</span>
                      <span>${params[0].data.startDate}</span>
                    </div>
                    <div class="bar clearfix">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#0970ff;"></span>
                      <span>结束时间：</span>
                      <span>${params[0].data.endDate}</span>
                    </div>
                    <div class="bar clearfix">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#0970ff;"></span>
                      <span>${params[0].seriesName}：</span>
                      <span>${params[0].data.number}</span>
                    </div>
                  </div>`;
            }
          },
          xAxis: {
            type: 'category',
            name: "季度",
            // data: titlelist,
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
            // source: $this.searchResult.seasonCount
            source: numberlist
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
                borderColor: "#0970ff",
                borderWidth: 1
              },
              lineStyle:{
                color: "#0970ff",
                width: 1
              },
              areaStyle:{
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                    offset: 0,
                    color:'#0970ff',
                    opacity:1
                    },
                    {
                    offset: 1,
                    color: "rgba(255, 255, 255, 0)",
                    }
                ]),
                opacity:0.3
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
        $this.chartlist.seasonPlot = myChart;
      }
    },

    // 周趋势
    drawChart14(){
      var $this = this;
      if($this.searchResult.weekListCount.length>0){
        var chartDom = document.getElementById('cluesChart14');
        var myChart = echarts.init(chartDom);
        var option;
        var numberlist = [];
        $this.searchResult.weekListCount.forEach(function(item,index){
          var data = {};
          data.name=item.name;
          data.number=item.number;
          data.startDate=item.startDate;
          data.endDate=item.endDate;
          numberlist.push(data);
        });
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
                color: "#5b8ff9"
              }
            },
            formatter(params){
              return `<div class="toolDiv">
                    <div class="tooltitle">${params[0].name}</div>
                    <div class="bar clearfix">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#0970ff;"></span>
                      <span>开始时间：</span>
                      <span>${params[0].data.startDate}</span>
                    </div>
                    <div class="bar clearfix">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#0970ff;"></span>
                      <span>结束时间：</span>
                      <span>${params[0].data.endDate}</span>
                    </div>
                    <div class="bar clearfix">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#0970ff;"></span>
                      <span>${params[0].seriesName}：</span>
                      <span>${params[0].data.number}</span>
                    </div>
                  </div>`;
            }
          },
          xAxis: {
            type: 'category',
            name: "季度",
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
            source: numberlist
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
                borderColor: "#0970ff",
                borderWidth: 1
              },
              lineStyle:{
                color: "#0970ff",
                width: 1
              },
              areaStyle:{
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                    offset: 0,
                    color:'#0970ff',
                    opacity:1
                    },
                    {
                    offset: 1,
                    color: "rgba(255, 255, 255, 0)",
                    }
                ]),
                opacity:0.3
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
        $this.chartlist.weekPlot = myChart;
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
    // 导出当前页数据
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID','域名','物料','url'];
        const list = this.searchResult.materlist;
        const data = [];
        list.forEach(function(item,index){
          var itemData = [];
          itemData.push(item.id);
          itemData.push(item.domain);
          itemData.push(item.material);
          itemData.push(item.url);
          data.push(itemData);
        });
        // const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.exportForm.fileName,
          autoWidth: true,
          bookType: this.exportForm.bookType
        })
        this.downloadLoading = false;
        this.dialogExportVisible = false;
        this.exportForm.fileName = "";
      })
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
      if($this.chartlist.weekPlot){
        $this.chartlist.weekPlot.resize();
      }
    }
  },
  destroyed(){
      window.removeEventListener('resize',this.echartsSize);
  }
}
</script>
<style lang="scss" scoped>
.ChinaphoneTwo .group-body .team-panel .team-header .team-headerItem .row-input{
  margin-left: 5px;
}
.ChinaphoneTwo .group-body .team-panel .team-header .team-headerItem .row-input+.row-input{
  margin-left: 8px;
}
</style>