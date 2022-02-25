<template>
    <div class="page-root en-phone-history flex-box no-padding EnphoneCard" ref="boxPane">
        <div class="sub-router">
          <el-scrollbar wrap-class="scrollbar-wrapper">
            <div class="sub-wrapper">
              <div class="side-button">
                <router-link v-if="menuButtonPermit.includes('Enphone_search')" :to="{path:'/Enphone/searchClues'}">
                  <el-button type="primary" plain size="mini"><i class="svg-i" ><svg-icon icon-class="serch_en" /></i>搜索数据</el-button>
                </router-link>
                <router-link v-if="menuButtonPermit.includes('Enphone_countlist')" :to="{path:'/Enphone/statisticChart'}" tag="a" target="_blank">
                  <el-button type="primary" plain size="mini"><i class="svg-i" ><svg-icon icon-class="analy_en" /></i>统计分析</el-button>
                </router-link>
                <router-link v-if="menuButtonPermit.includes('Enphone_phonecount')" :to="{path:'/Enphone/statisticClues'}">
                  <el-button type="primary" plain size="mini"><i class="svg-i" ><svg-icon icon-class="analy_en" /></i>业务员数据统计</el-button>
                </router-link>
              </div>
              <dl class="phone-list" v-if="menuButtonPermit.includes('Enphone_lookall')&&menuButtonPermit.includes('Enphone_lookwaitdealall')">
                  <dd v-bind:class="currentKey&&currentKey=='all'?'active':''" v-if="menuButtonPermit.includes('Enphone_lookall')">
                    <router-link :to="{path:'/Enphone/phoneindex',query:{key:'all'}}">
                      <span>查看所有</span><i>({{linkAll.monthNum}})</i><em>({{linkAll.yestodayNum}})</em><b>({{linkAll.todayNum}})</b>
                    </router-link>
                  </dd>
                  <dd v-bind:class="currentKey&&currentKey=='unAllot'?'active':''" v-if="menuButtonPermit.includes('Enphone_lookwaitdealall')">
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
        <div class="flex-content relative EnphoneCardFr">
            <div class="abs-panel" ref="mainPane">
              <div class="scroll-panel" ref="scrollDom" style="will-change:scroll-position">
                  <div class="true-height" ref="scrollPane">
                  <p class="breadcrumb" ref="breadcrumbPane">
                    <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
                    <template v-for="item in breadcrumbList">
                      <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
                      <span class="breadcrumb-link" v-bind:key="item.id" v-else><b>-</b><span>{{item.title}}</span></span>
                    </template>
                    <span class="breadcrumb-link"><b>-</b><span>添加|编辑询盘</span></span>
                  </p>
                  <el-card class="box-card scroll-card" shadow="hover">
                      <ul class="SaleTips" v-if="(ID&&isCustomer)||(ID&&isSalesman)">
                          <li v-if="ID&&isCustomer"><i class="svg-i tips" ><svg-icon icon-class="prompt" /></i><b>{{formData.custormselfwarn}}</b><el-button class="item-input" :class="isCustomerWarnRead?'isDisabled':''" :disabled="isCustomerWarnRead" size="mini" type="primary" @click="customerWarnRead">已了解/解决(取消提醒)</el-button><em>*注意：请先修改并点击下方保存后再点击取消提醒</em></li>
                          <li class="SaleTipRed" v-if="ID&&isSalesman"><i class="svg-i tips" ><svg-icon icon-class="prompt" /></i><b>{{formData.givecustormwarn}}</b><el-button class="item-input" :class="isSalesmanWarnRead?'isDisabled':''" :disabled="isSalesmanWarnRead" size="mini" type="primary" @click="salesmanWarnRead">已了解/解决(取消提醒)</el-button><em>*注意：请先修改并点击下方保存后再点击取消提醒</em></li>
                      </ul>        
                      <div class="card-content EnphoneAddEdit" ref="tableContent">
                          <div class="EnphoneAddEditMain">
                              <div class="en-phone-tips" v-if="ID">
                                <div class="item-input"><span class="tips-title">客服提醒</span></div>
                                <div class="item-input"><el-checkbox v-model="noRead" size="small" label="修改提醒" border></el-checkbox></div>
                                <div class="item-input"><span class="tips-title">内部提醒：</span></div>
                                <div class="item-input"><el-input v-model="formData.custormselfwarn" size="small" placeholder=""></el-input></div>
                                <div class="item-input" v-if="isCustomerSalesman"><span class="tips-title">业务员提醒：</span></div>
                                <div class="item-input" v-if="isCustomerSalesman"><el-input v-model="formData.givecustormwarn" size="small" disabled placeholder=""></el-input></div>
                                <div class="item-input"><el-button class="item-input" :class="isEditCustomerWarn?'isDisabled':''" :disabled="isEditCustomerWarn" size="small" type="primary" icon="el-icon-edit" @click="editCustomerWarn">修改</el-button></div>
                              </div>
                              <div class="EnphoneAddEditMainItem phone-list">
                                <dl>
                                  <dt>来源电话：<span>*</span></dt>
                                  <dd>
                                    <div class="clues-list customRadio">
                                      <span class="item-clues" v-for="item in phoneList" v-bind:class="item.isOn?'active':''" v-bind:key="item.id" v-on:click="phoneClick(item.id)"><i></i>{{item.phonenumber}}</span>
                                    </div>
                                  </dd>
                                </dl>
                              </div>
                              <div class="EnphoneAddEditMainItem customer-info">
                                  <dl style="width:160px;">
                                    <dt>客户姓名/称呼：</dt>
                                    <dd>
                                      <el-input
                                          placeholder="姓名"
                                          size="small"
                                          v-model="formData.custormname"
                                          clearable>
                                      </el-input>
                                    </dd>
                                  </dl>
                                  <dl style="width:160px;">
                                    <dt>分配的业务员：</dt>
                                    <dd>
                                      <el-select size="small" v-on:change="salesmanChange" :class="salesuserDefault?'salesuserDefault':''" v-model="formData.salesuserid" :placeholder="salesuserDefault">
                                        <el-option
                                          v-for="item in salesuserlist"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value">
                                        </el-option>
                                      </el-select>
                                    </dd>
                                  </dl>
                                  <dl style="width:160px;">
                                    <dt>富通天下ID</dt>
                                    <dd>
                                      <el-input
                                          placeholder="ID号"
                                          size="small"
                                          v-model="formData.ftword_id"
                                          clearable>
                                      </el-input>
                                    </dd>
                                  </dl>
                              </div>
                              <div class="EnphoneAddEditMainItem specifications">
                                  <dl style="width: 500px;">
                                    <dt>客户需求详情：<span>* (如有其他联系方式请在详情中注明)</span></dt>
                                    <dd class="spectextarea">
                                      <el-input
                                          type="textarea"
                                          size="small"
                                          v-model="formData.custormneedinfo"
                                          clearable>
                                      </el-input>
                                    </dd>
                                  </dl>
                                  <dl style="width:280px;">
                                    <dt>客户Email：<span style="font-size:12px;">(多个Email请用换行分隔)</span></dt>
                                    <dd class="spectextarea">
                                      <el-input
                                          placeholder="邮箱"
                                          type="textarea"
                                          size="small"
                                          v-model="formData.custormemail"
                                          clearable>
                                      </el-input>
                                    </dd>
                                  </dl>
                                  <dl style="width:210px;">
                                    <dt>客户电话：<span style="font-size:12px;">(多个电话请用换行分隔)</span></dt>
                                    <dd class="spectextarea">
                                      <el-input
                                          placeholder="电话"
                                          type="textarea"
                                          size="small"
                                          v-model="formData.custormphone"
                                          clearable>
                                      </el-input>
                                    </dd>
                                  </dl>
                              </div>
                              <div class="EnphoneAddEditMainItem specifications">
                                  <dl style="width:500px;">
                                    <dt>分配特别说明：<em v-if="ID&&defaultInfo.otherremark_time">(最后修改时间：{{defaultInfo.otherremark_time}})</em></dt>
                                    <dd>
                                      <el-autocomplete
                                      style="display:block;"
                                        size="small"
                                        clearable
                                        v-model="formData.otherremark"
                                        :fetch-suggestions="otherRemarkQuerySearch"
                                        placeholder="分配/特别说明"
                                        :trigger-on-focus="false"
                                        @select="otherRemarkHandleSelect"
                                      ></el-autocomplete>
                                    </dd>
                                  </dl>
                                  <dl style="width:500px;">
                                    <dt>提醒：<em v-if="ID&&defaultInfo.givesaleswarn_time">(最后修改时间：{{defaultInfo.givesaleswarn_time}})</em></dt>
                                    <dd class="flex-box">
                                      <el-autocomplete
                                        class="flex-content"
                                        size="small"
                                        clearable
                                        v-model="formData.givesaleswarn"
                                        :fetch-suggestions="noticeQuerySearch"
                                        placeholder="提醒/首页提醒"
                                        :trigger-on-focus="false"
                                        @select="noticeHandleSelect"
                                      ></el-autocomplete>
                                      <el-checkbox v-model="formData.saleswarnstatus" style="margin-left: 10px;" size="small" border>修改提醒</el-checkbox>
                                    </dd>
                                  </dl>
                              </div>
                              <div class="EnphoneAddEditMainItem specifications">
                                <dl style="margin:0 5px">
                                  <dd class="upload">
                                    <el-upload
                                        class="upload-demo"
                                        name="file"
                                        action=""
                                        accept="aplication/zip"
                                        :on-preview="handlePreview"
                                        :http-request="httpZipRequest"
                                        :limit="1"
                                        :on-exceed="handleExceed"
                                        :file-list="fileList">
                                        <el-button size="small" type="primary">点击上传</el-button>
                                        <div slot="tip" class="el-upload__tip">(上传文件大小需控制在50M以内)<em v-if="ID&&defaultInfo.custormfiles_time">(上传时间：{{defaultInfo.custormfiles_time}})</em></div>
                                    </el-upload>
                                  </dd>
                                </dl>
                              </div>
                              <div class="EnphoneAddEditMainItem customer-info">
                                  <dl style="width:190px;">
                                    <dt>信息来自具体时间：<span>*</span></dt>
                                    <dd>
                                      <el-date-picker
                                          style="display:block;width:100%;"
                                          v-model="formData.xuntime"
                                          size="small"
                                          type="datetime"
                                          placeholder="选择日期时间"
                                          value-format = "yyyy-MM-dd HH:mm"
                                          align="right"
                                          :picker-options="pickerOptions"
                                          >
                                        </el-date-picker>
                                    </dd>
                                  </dl>
                                  <dl style="width:130px;">
                                    <dt>客户当地时间：<span>*</span></dt>
                                    <dd>
                                      <el-select size="small" v-model="formData.timediff" placeholder="请选择">
                                        <el-option
                                          v-for="item in timediffList"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value">
                                        </el-option>
                                      </el-select>
                                    </dd>
                                  </dl>
                                  <dl style="width:160px;">
                                    <dt>来自大洲：</dt>
                                    <dd>
                                      <el-select size="small" v-model="formData.continent" placeholder="请选择">
                                        <el-option
                                          v-for="item in continentList"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value">
                                        </el-option>
                                      </el-select>
                                    </dd>
                                  </dl>
                                  <dl style="width:160px;">
                                    <dt>来自国家：</dt>
                                    <dd>
                                      <el-autocomplete
                                        size="small"
                                        clearable
                                        @change="countryClick"
                                        v-model="formData.country"
                                        :fetch-suggestions="countryQuerySearch"
                                        placeholder="号码归属地"
                                        :trigger-on-focus="false"
                                        @select="countryHandleSelect"
                                      ></el-autocomplete>
                                    </dd>
                                  </dl>
                                  <dl style="width:160px;">
                                    <dt>来自类型：<span>*</span></dt>
                                    <dd>
                                      <el-select v-model="formData.messagetype" size="small" clearable placeholder="请选择">
                                          <el-option
                                          v-for="item in messagetypeList"
                                          :key="item.value" 
                                          :label="item.label"
                                          :value="item.value"
                                          >
                                          </el-option>
                                      </el-select>
                                    </dd>
                                  </dl>
                                  <dl style="width:160px;">
                                    <dt>渠道：<span>*</span></dt>
                                    <dd>
                                      <el-select v-model="formData.mode" size="small" style="width:100%" clearable placeholder="请选择">
                                          <el-option
                                          v-for="item in modeList"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value">
                                          </el-option>
                                      </el-select>
                                    </dd>
                                  </dl>
                              </div>
                              <div class="EnphoneAddEditMainItem customer-info">
                                  <dl style="width:500px;">
                                    <dt>来自网页：<span>(渠道为外部链接的请备注URL)</span></dt>
                                    <dd>
                                      <el-input
                                          placeholder="网址"
                                          size="small"
                                          v-model="formData.url"
                                          @blur="urlChangePhone"
                                          clearable>
                                      </el-input>
                                    </dd>
                                  </dl>
                                  <dl style="width:160px;">
                                    <dt>IP：</dt>
                                    <dd>
                                      <el-input
                                          placeholder="IP"
                                          size="small"
                                          v-model="formData.ip"
                                          clearable>
                                      </el-input>
                                    </dd>
                                  </dl>
                                  <dl style="width:160px;">
                                    <dt>设备：</dt>
                                    <dd>
                                      <el-select v-model="formData.device" size="small" style="width:100%" clearable placeholder="请选择">
                                          <el-option
                                          v-for="item in deviceList"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value">
                                          </el-option>
                                      </el-select>
                                    </dd>
                                  </dl>
                                  <dl style="width:160px;">
                                    <dt>级别：</dt>
                                    <dd>
                                      <el-select v-model="formData.level_id" size="small" style="width:100%" clearable placeholder="请选择">
                                          <el-option
                                          v-for="item in levelList"
                                          :key="item.label"
                                          :label="item.label"
                                          :value="item.value">
                                          </el-option>
                                      </el-select>
                                    </dd>
                                  </dl>
                              </div>
                              <div class="EnphoneAddEditMainItem customer-info">
                                  <dl style="width:160px;">
                                    <dt>价值：</dt>
                                    <dd>
                                      <el-select v-model="formData.enxunprice" style="width:100%" size="small" clearable placeholder="请选择">
                                          <el-option
                                          v-for="item in priceList"
                                          :key="item.label"
                                          :label="item.label"
                                          :value="item.value">
                                          </el-option>
                                      </el-select>
                                    </dd>
                                  </dl>
                                  <dl style="width:160px;">
                                    <dt>性质：</dt>
                                    <dd>
                                      <el-select v-model="formData.ennature" style="width:100%" size="small" clearable placeholder="请选择">
                                          <el-option
                                          v-for="item in natureList"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value">
                                          </el-option>
                                      </el-select>
                                    </dd>
                                  </dl>
                              </div>
                              <div class="EnphoneAddEditMainItem IntentionEquipment">
                                  <dl>
                                    <dt>意向设备</dt>
                                    <dd>
                                      <strong>类别：</strong>
                                      <div class="clues-list">
                                        <el-checkbox-group v-model="producttypeArr" class="checkbox-custom" @change="producttypeClick">
                                          <el-checkbox v-for="item in producttypeList" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
                                        </el-checkbox-group>
                                      </div>
                                    </dd>
                                    <el-checkbox-group v-model="formData.keying" size="small" @change="productClick">
                                      <dd>
                                        <strong>砂石：</strong>
                                        <div class="clues-list">
                                            <el-checkbox class="item-checkbox" v-for="item in SandGravelList" :label="item.value" :key="item.value" border>{{item.label}}</el-checkbox>
                                        </div>
                                      </dd>
                                      <dd>
                                        <strong>选矿/建材：</strong>
                                        <div class="clues-list">
                                            <el-checkbox class="item-checkbox" v-for="item in OreDressList" :label="item.value" :key="item.value" border>{{item.label}}</el-checkbox>
                                        </div>
                                      </dd>
                                      <dd>
                                        <strong>磨粉/烘干/压球：</strong>
                                        <div class="clues-list">
                                            <el-checkbox class="item-checkbox" v-for="item in FlourList" :label="item.value" :key="item.value" border>{{item.label}}</el-checkbox>
                                        </div>
                                      </dd>
                                      <dd>
                                        <strong>其它：</strong>
                                        <div class="clues-list">
                                            <el-checkbox class="item-checkbox" v-for="item in otherList" :label="item.value" :key="item.value" border>{{item.label}}</el-checkbox>
                                        </div>
                                        <p>**请根据客户意图选择合适的产品，可多选。如果为：其它生产线、配件、其它产品请在备注中注明具体产品</p>
                                      </dd>
                                    </el-checkbox-group>
                                  </dl>
                              </div>
                              <div class="EnphoneAddEditMainItem material">
                                <dl style="width: 160px;">
                                  <dt>产量：</dt>
                                  <dd>
                                    <el-select v-model="formData.production" size="small" clearable placeholder="请选择">
                                        <el-option
                                        v-for="item in productionList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                  </dd>
                                </dl>
                                <dl style="width: 270px;">
                                  <dt>物料：</dt>
                                  <dd>
                                    <el-autocomplete
                                      style="display:block;"
                                        size="small"
                                        clearable
                                        v-model="formData.material"
                                        :fetch-suggestions="wlQuerySearch"
                                        placeholder="物料"
                                        :trigger-on-focus="false"
                                        @select="wlHandleSelect"
                                      ></el-autocomplete>
                                  </dd>
                                </dl>
                                <dl style="width: 270px;">
                                  <dt>进料：</dt>
                                  <dd>
                                    <el-autocomplete
                                      style="display:block;"
                                        size="small"
                                        clearable
                                        v-model="formData.infeed"
                                        :fetch-suggestions="jlQuerySearch"
                                        placeholder="进料"
                                        :trigger-on-focus="false"
                                        @select="jlHandleSelect"
                                      ></el-autocomplete>
                                  </dd>
                                </dl>
                                <dl style="width: 280px;">
                                  <dt>出料：</dt>
                                  <dd>
                                    <el-autocomplete
                                      style="display:block;"
                                        size="small"
                                        clearable
                                        v-model="formData.outfeed"
                                        :fetch-suggestions="clQuerySearch"
                                        placeholder="出料"
                                        :trigger-on-focus="false"
                                        @select="clHandleSelect"
                                      ></el-autocomplete>
                                  </dd>
                                </dl>
                              </div>
                              <div class="EnphoneAddEditMainItem material">
                                <dl style="width: 440px;">
                                  <dt>询盘备注：<em v-if="ID&&defaultInfo.xunremark_time">(最后修改时间：{{defaultInfo.xunremark_time}})</em></dt>
                                  <dd>
                                    <el-autocomplete
                                      style="display:block;"
                                        size="small"
                                        clearable
                                        v-model="formData.xunremark"
                                        :fetch-suggestions="xunRemarkQuerySearch"
                                        placeholder="询盘备注"
                                        :trigger-on-focus="false"
                                        @select="xunRemarkHandleSelect"
                                      ></el-autocomplete>
                                  </dd>
                                </dl>
                                <dl style="width: 560px;">
                                  <dt>客服备注：<span>(仅客服部可见)</span><em v-if="ID&&defaultInfo.custormremark_time">(最后修改时间：{{defaultInfo.custormremark_time}})</em></dt>
                                  <dd>
                                    <el-autocomplete
                                      style="display:block;"
                                        size="small"
                                        clearable
                                        v-model="formData.custormremark"
                                        :fetch-suggestions="custormRemarkQuerySearch"
                                        placeholder="客服部备注"
                                        :trigger-on-focus="false"
                                        @select="custormRemarkHandleSelect"
                                      ></el-autocomplete>
                                  </dd>
                                </dl>
                              </div>
                              <div class="EnphoneAddEditMainItem author">
                                  <dl>
                                    <dt>是否有效：</dt>
                                    <dd>
                                      <el-checkbox v-model="formData.effective" label="有效" border size="small"></el-checkbox>
                                    </dd>
                                  </dl>
                                  <dl style="width:797px;">
                                    <dt>无效原因：<span style="color:#f60;" v-if="formData.noeffectivetime">{{formData.noeffectivetime}}</span></dt>
                                    <dd>
                                      <el-input
                                          placeholder="该项只在无效情况下填写"
                                          size="small"
                                          v-model="formData.invalidcause"
                                          :disabled="formData.effective"
                                          clearable>
                                      </el-input>
                                    </dd>
                                  </dl>
                                  <dl style="width:120px;">
                                    <dt>添加人：</dt>
                                    <dd>
                                        <el-input
                                            size="small"
                                            v-model="defaultInfo.addusername"
                                            v-if="ID&&defaultInfo.addusername"
                                            disabled>
                                        </el-input>
                                        <el-input
                                            size="small"
                                            v-else
                                            v-model="userInfo.name"
                                            disabled>
                                        </el-input>
                                    </dd>
                                  </dl>
                              </div>
                          </div>
                          <div class="card-header WebServerAddEditBtn EnphoneAddEditBtn">
                              <el-button type="primary" class="updateBtn" :class="isDisabled?'isDisabled':''" :disabled="isDisabled" size="small" v-if="menuButtonPermit.includes('Enphone_add')||menuButtonPermit.includes('Enphone_edit')" @click="saveData"><i class="svg-i planeWhite" ><svg-icon icon-class="planeWhite" /></i>保存</el-button>
                              <el-button type="primary" class="resetBtn" size="small" v-on:click="resetFormData()">重置</el-button>
                          </div>
                      </div>
                  </el-card>
                  </div>
              </div>
            </div>
        </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'addEditClues',
  data() {
    return {
      defaultData:{
        custorAndsalesmwarn:[],
        custormwarn:[],
        saleswarning:[],
      },
      currentKey:null,
      linkAll:{
        todayNum:0,
        yestodayNum:0,
        monthNum:0,
        unAllotNum:0,
      },
      noRead:false,
      ID:null,
      breadcrumbList:[],
      menuButtonPermit:[],
      pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
      },
      phoneList:[],
      productList:[],
      producttypeList:[],//分类
      producttypeArr:[],
      SandGravelList:[],//沙石
      OreDressList:[],//选矿/建材
      FlourList:[],//磨粉/烘干/压球
      otherList:[],//其它
      fileList:[],//上传文件
      salesuserlist:[],//业务员
      salesuserDefault:'',
      salesuserid:'',//业务经理id员
      salesusertypeId:'',
      messagetypeList:[
        {value: '留言板',label:'留言板'},
        {value: '商务通',label:'商务通'},
        {value: '其他',label:'其他'},
        {value: 'Email',label:'Email'}
        ],
      modeList:[],
      deviceList:[
        {value: 'PC设备',label:'PC设备'},
        {value: '移动设备',label:'移动设备'},
        {value: '未知设备',label:'未知设备'}
        ],
      levelList:[],
      productionList:[
        {value: '≤5T/H',label:'≤5T/H'},
        {value: '≤10T/H',label: '≤10T/H'},
        {value: '10-50T/H',label: '10-50T/H'},
        {value: '50-100T/H',label: '50-100T/H'},
        {value: '≥100T/H',label: '≥100T/H'}
        ],
      timediffList:[
        {value: '-19',label: '-19'},
        {value: '-18',label: '-18'},
        {value: '-17',label: '-17'},
        {value: '-16',label: '-16'},
        {value: '-15',label: '-15'},
        {value: '-14',label: '-14'},
        {value: '-13',label: '-13'},
        {value: '-12',label: '-12'},
        {value: '-11',label: '-11'},
        {value: '-10',label: '-10'},
        {value: '-9',label: '-9'},
        {value: '-8',label: '-8'},
        {value: '-7',label: '-7'},
        {value: '-6',label: '-6'},
        {value: '-5',label: '-5'},
        {value: '-4',label: '-4'},
        {value: '-3',label: '-3'},
        {value: '-2',label: '-2'},
        {value: '-1',label: '-1'},
        {value: '0',label: '0'},
        {value: '+1',label: '1'},
        {value: '+2',label: '2'},
        {value: '+3',label: '3'},
        {value: '+4',label: '4'}
      ],
      continentList:[
        {value: '东南亚',label: '东南亚'},
        {value: '中亚',label: '中亚'},
        {value: '东亚',label: '东亚'},
        {value: '西亚',label: '西亚'},
        {value: '南亚',label: '南亚'},
        {value: '非洲',label: '非洲'},
        {value: '欧洲',label: '欧洲'},
        {value: '南美洲',label: '南美洲'},
        {value: '北美洲',label: '北美洲'},
        {value: '大洋洲',label: '大洋洲'}
      ],
      formData:{
        id:0,
        custormname:"",
        custormemail:"",
        custormphone:"",
        salesuserid:"",
        ftword_id:"",
        custormneedinfo:"",
        otherremark:"",
        givesaleswarn:"",
        salesownid:'',
        saleswarnstatus:false,
        noeffectivetime:"",
        custormfiles:"",
        custormfilesname:"",
        xuntime:"",
        timediff:"",
        continent:"",
        country:"",
        messagetype:"",
        mode:"",
        url:"",
        ip:"",
        device:"",
        level_id:"",
        material:"",
        production:"",
        infeed:"",
        outfeed:"",
        xunremark:"",
        custormremark:"",
        effective:true,
        invalidcause:"",
        producttype_id:"",
        phoneid:"",
        keying:[],
        ennature:"",
        enxunprice:"",
        givecustormwarn:"",
        custormselfwarn:"",
      },
      defaultInfo:{},
      priceList:[],
      natureList:[],
      isCustomer:false,
      isSalesman:false,
      isCustomerSalesman:false,
      restaurants:[],
      isDisabled:false,
      isCustomerWarnRead:false,
      isEditCustomerWarn:false,
      isSalesmanWarnRead:false,
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'sidebar',
      'menuData'
    ]),
  },
  mounted(){
    const $this = this;
    if(this.sidebar.opened){
      $this.$store.dispatch('app/toggleSideBar');
    }
  },
  created(){
    var $this = this;
    if($this.$route.query.ID){
      $this.ID = parseInt($this.$route.query.ID);
    }else{
      $this.ID = null;
      $this.currentTime();
    }
    $this.getBreadcrumbList();
    $this.initData();
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
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
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
              var brand = "";
              var brandID = null;              
              if($this.$route.query.phoneID){
                response.data.forEach(function(item,index){
                  brand = item.brandname;
                  item.phone.forEach(function(item1,index1){
                    if(item1.id == $this.phoneID&&item1.waitstatus==$this.searchData.waitstatus){
                      $this.currentID = item1.id;
                      item1.isOn = true;
                      brandID = item.id;
                      if(item1.phonenumber.indexOf("-")!=-1){
                        $this.currentPhone = item1.phonenumber;
                      }else{
                        $this.currentPhone = brand+"-"+item1.phonenumber;
                      }
                    }else{
                      item1.isOn = false;
                    }
                  });
                });
              }else{
                if($this.$route.query.key){
                  response.data.forEach(function(item,index){
                    item.phone.forEach(function(item1,index1){
                      item.isOn = false;
                    });
                  });
                  if($this.$route.query.key=="all"){
                    $this.currentPhone = "查看所有";
                  }else{
                    $this.currentPhone = "所有未分配";
                  }
                }
              }
              $this.brandID = brandID;
              $this.defaultData = response;
              $this.initPage();
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
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.getSystemData();
    },
    // 组装搜索接口所需数据
    initFormData(){
      var $this = this;
      var formData = {};
      formData.custormname = $this.formData.custormname;
      formData.custormemail = $this.formData.custormemail.replace(/\n/g,",");
      formData.custormphone = $this.formData.custormphone.replace(/\n/g,",");
      formData.noeffectivetime = $this.formData.noeffectivetime;
      if($this.formData.salesuserid!=''&&$this.formData.salesuserid!=null){
        formData.salesuserid = $this.formData.salesuserid;
      }else{
        formData.salesuserid = $this.salesuserid;
      }
      formData.production = $this.formData.production;
      formData.ftword_id = $this.formData.ftword_id;
      formData.custormneedinfo = $this.formData.custormneedinfo;
      formData.otherremark = $this.formData.otherremark;
      formData.givesaleswarn = $this.formData.givesaleswarn;
      formData.custormfiles = $this.formData.custormfiles;
      formData.custormfilesname = $this.formData.custormfilesname;
      formData.continent = $this.formData.continent;
      formData.country = $this.formData.country;
      formData.url = $this.formData.url;
      formData.ip = $this.formData.ip;
      formData.device = $this.formData.device;
      formData.level_id = $this.formData.level_id;
      formData.material = $this.formData.material;
      formData.infeed = $this.formData.infeed;
      formData.outfeed = $this.formData.outfeed;
      formData.xunremark = $this.formData.xunremark;
      formData.custormremark = $this.formData.custormremark;
      formData.invalidcause = $this.formData.invalidcause;
      formData.saleswarnstatus = $this.formData.saleswarnstatus?3:2;
      formData.effective = $this.formData.effective?1:2;
      formData.xuntime = $this.formData.xuntime;
      formData.timediff = $this.formData.timediff;
      formData.messagetype = $this.formData.messagetype;
      formData.mode = $this.formData.mode;
      formData.phoneid = $this.formData.phoneid;
      formData.producttype_id = $this.formData.producttype_id;
      formData.id = $this.formData.id;
      formData.keying = $this.formData.keying;
      formData.ennature = $this.formData.ennature;
      formData.enxunprice = $this.formData.enxunprice;
      return formData;
    },
    // 询盘编辑获取初始化询盘信息
    initCluesInfo(){
      var $this = this;
      $this.$store.dispatch('enphone/initCluesEditInfoAction', {id:$this.ID}).then(response=>{
        if(response){
          if(response.status){
            $this.defaultInfo = response.data;
            $this.isCustomer = response.custormselfwarnshow?true:false;
            $this.isSalesman = response.givecustormwarnshow?true:false;
            $this.isCustomerSalesman = response.custormwarnshow?true:false;
            if($this.defaultInfo.custormselfwarnstatus==3&&$this.defaultInfo.custormselfwarn&&$this.defaultInfo.custormselfwarn!=""){
              $this.noRead = true;
            }else{
              $this.noRead = false;
            }
            $this.setCluesInfo();
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
            setTimeout(()=>{
              $this.isDisabled=false;
              $this.isEditCustomerWarn=false;
              $this.isCustomerWarnRead=false;
              $this.isSalesmanWarnRead=false;
            },1000);
          }
        }
      });
    },
    // 分配业务员发生变化时
    salesmanChange(e){
      var $this = this;
      $this.salesuserid = e;
      $this.salesuserDefault="";
    },
    // 设置询盘初始化信息
    setCluesInfo(){
      var $this = this;
      $this.formData.id = $this.defaultInfo.id;
      $this.formData.custormname = $this.defaultInfo.custormname;
      $this.formData.custormemail = $this.defaultInfo.custormemail?$this.defaultInfo.custormemail.replace(/,/g,"\n"):'';
      $this.formData.noeffectivetime = $this.defaultInfo.noeffectivetime;
      $this.formData.custormphone = $this.defaultInfo.custormphone?$this.defaultInfo.custormphone.replace(/,/g,"\n"):'';
      if($this.defaultInfo.salesownid!=0){
         $this.formData.salesuserid="";
         $this.salesuserDefault=$this.defaultInfo.salesusername;
      }else{         
         $this.salesuserDefault="";
         $this.formData.salesuserid = $this.defaultInfo.salesuserid;   
      }
      $this.salesuserid = $this.defaultInfo.salesuserid;
      $this.formData.ftword_id = $this.defaultInfo.ftword_id;
      $this.formData.custormneedinfo = $this.defaultInfo.custormneedinfo;
      $this.formData.otherremark = $this.defaultInfo.otherremark;
      $this.formData.givesaleswarn = $this.defaultInfo.givesaleswarn;
      $this.formData.saleswarnstatus = $this.defaultInfo.saleswarnstatus==2?false:true;
      $this.formData.custormfiles = $this.defaultInfo.custormfiles;
      $this.formData.custormfilesname = $this.defaultInfo.custormfilesname;
      $this.formData.givecustormwarn = $this.defaultInfo.givecustormwarn;
      $this.formData.custormselfwarn = $this.defaultInfo.custormselfwarn;
      if($this.defaultInfo.custormfilesname&&$this.defaultInfo.custormfiles){
          var fileList={};
          $this.fileList=[];
          fileList.name=$this.defaultInfo.custormfilesname;
          fileList.url=$this.defaultInfo.custormfiles;
          $this.fileList.push(fileList);
      }
      $this.formData.xuntime = $this.defaultInfo.xuntime;
      $this.formData.timediff = $this.defaultInfo.timediff;
      $this.formData.continent = $this.defaultInfo.continent;
      $this.formData.country = $this.defaultInfo.country;
      $this.formData.messagetype = $this.defaultInfo.messagetype;
      $this.formData.mode = $this.defaultInfo.mode;
      $this.formData.url = $this.defaultInfo.url;
      $this.formData.ip = $this.defaultInfo.ip;
      $this.formData.device = $this.defaultInfo.device;
      if($this.defaultInfo.level_id!=0){
         $this.formData.level_id = $this.defaultInfo.level_id;      
      }else{
         $this.formData.level_id="";
      }
      $this.formData.material = $this.defaultInfo.material;
      $this.formData.production = $this.defaultInfo.production;
      $this.formData.infeed = $this.defaultInfo.infeed;
      $this.formData.outfeed = $this.defaultInfo.outfeed;
      $this.formData.xunremark = $this.defaultInfo.xunremark;
      $this.formData.custormremark = $this.defaultInfo.custormremark;
      $this.formData.effective = $this.defaultInfo.effective==1?true:false;
      $this.formData.invalidcause = $this.defaultInfo.invalidcause;
      $this.formData.phoneid = $this.defaultInfo.phoneid;
      $this.formData.producttype_id = $this.defaultInfo.producttype_id;
      if($this.defaultInfo.ennature&&$this.defaultInfo.ennature!=0){
         $this.formData.ennature = $this.defaultInfo.ennature;
      }
      if($this.defaultInfo.enxunprice&&$this.defaultInfo.ennature!=0){
         $this.formData.enxunprice = $this.defaultInfo.enxunprice;
      }
      $this.producttypeArr=[$this.defaultInfo.producttype_id];
      $this.formData.keying = [];
      var SandGravelArr=[],OreDressArr=[],FlourArr=[],otherArr=[],keyArr=[];
      if($this.defaultInfo.keying){
          if($this.defaultInfo.keying.indexOf(",")!=-1){
              keyArr = $this.defaultInfo.keying.split(",");              
          }else{
              keyArr = [$this.defaultInfo.keying]
          }
          keyArr.forEach(function(item,index){
            $this.formData.keying.push(parseInt(item));
            $this.SandGravelList.forEach(function(item01,index01){
              if(parseInt(item)==item01.value){
                SandGravelArr.push(parseInt(item));
              }
            });
            $this.OreDressList.forEach(function(item02,index02){
              if(parseInt(item)==item02.value){
                OreDressArr.push(parseInt(item));
              }
            });
            $this.FlourList.forEach(function(item03,index03){
              if(parseInt(item)==item03.value){
                FlourArr.push(parseInt(item));
              }
            });
            $this.otherList.forEach(function(item04,index04){
              if(parseInt(item)==item04.value){
                otherArr.push(parseInt(item));
              }
            });
          });
        $this.SandGravelArr=SandGravelArr
        $this.OreDressArr=OreDressArr;
        $this.FlourArr=FlourArr;
        $this.otherArr=otherArr;
      }else{
        $this.SandGravelArr=[];
        $this.OreDressArr=[];
        $this.FlourArr=[];
        $this.otherArr=[];
      }
      var phoneList = $this.phoneList;
      phoneList.forEach(function(item,index){
        if(item.id == $this.formData.phoneid){
          item.isOn = true;
        }else{
          item.isOn = false;
        }
      });
      $this.phoneList = phoneList;
      $this.getCurrentPhoneUser();
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
            if($this.ID){
              if(!$this.menuButtonPermit.includes('Enphone_edit')){
                $this.$message({
                  showClose: true,
                  message: "未被分配该页面的编辑权限",
                  type: 'error',
                    duration:6000
                });
                $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
              }
            }else{
              if(!$this.menuButtonPermit.includes('Enphone_add')){
                $this.$message({
                  showClose: true,
                  message: "未被分配该页面的添加权限",
                  type: 'error',
                    duration:6000
                });
                $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
              }
            }
            $this.leftPhoto();
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
    // 获取当前页面的条件数据
    getSystemData(){
      var $this = this;
      $this.$store.dispatch('enphone/cluesAddEditDataAction', null).then(response=>{
        if(response){
          if(response.status){
            var modeList = [];
            response.source.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              modeList.push(itemData);
            });
            $this.modeList = modeList;
            var levelList = [];
            response.level.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.levelname;
              itemData.value = item.id;
              levelList.push(itemData);
            });
            $this.levelList = levelList;
            response.phonelist.forEach(function(item,index){
              item.isOn = false;
            });
            var producttypeList=[];
            response.producttype.forEach(function(item,index){
                var itemChildren = {};
                itemChildren.label = item.name;
                itemChildren.value = item.id;
                producttypeList.push(itemChildren);
            });
            $this.producttypeList = producttypeList;
            var productList = [];
            response.product.forEach(function(item,index){
              item.product.forEach(function(item1,index1){
                var itemData = {};
                itemData.id = item1.id;
                itemData.name = item1.name;
                itemData.typeid = item1.typeid;
                productList.push(itemData)
              });
            });
            $this.productList = productList;
            var SandGravelList=[];
            var OreDressList=[];
            var FlourList=[];
            var otherList=[];
            productList.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              if(item.typeid==1){
                SandGravelList.push(itemData);
              }else if(item.typeid==2||item.typeid==3){
                OreDressList.push(itemData);
              }else if(item.typeid==4||item.typeid==8||item.typeid==9){
                FlourList.push(itemData);
              }else{
                otherList.push(itemData);
              }
            });
            $this.SandGravelList = SandGravelList;
            $this.OreDressList = OreDressList;
            $this.FlourList = FlourList;
            $this.otherList = otherList;  
            $this.phoneList = response.phonelist;
            var natureList = [];
            response.ennature.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              natureList.push(itemData);
            });
            $this.natureList = natureList;
            var priceList = [];
            response.price.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              priceList.push(itemData);
            });
            $this.priceList = priceList;
            var salesuserlist = [];
            var salesuserlistObj={
              label:'无',
              value:0
            }
            response.userlist.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              salesuserlist.push(itemData);
            });
              salesuserlist.push(salesuserlistObj);
            $this.salesuserlist = salesuserlist;
            if($this.ID){
              $this.initCluesInfo();
            }
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
    // 获取当前电话下的业务员经理
    getCurrentPhoneUser(){
      var $this = this;
      $this.$store.dispatch("enphone/getCurrentPhoneUserAction", {id:$this.formData.phoneid}).then(response=>{
          if(response.status){
            if(response.salesuser.length>0){
              var salesuserlist=[];
              var salesuserlistObj={
                label:'无',
                value:0
              }
              response.salesuser.forEach(function(item,index){
                  var itemChildren = {};
                  itemChildren.label = item.name;
                  itemChildren.value = item.id;
                  salesuserlist.push(itemChildren);
              });
              salesuserlist.push(salesuserlistObj);
              $this.salesuserlist = salesuserlist;
            }else{
              $this.salesuserlist=[]
            }
            setTimeout(()=>{
              $this.isDisabled=false;
              $this.isEditCustomerWarn=false;
              $this.isCustomerWarnRead=false;
              $this.isSalesmanWarnRead=false;
            },1000);
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
            setTimeout(()=>{
              $this.isDisabled=false;
              $this.isEditCustomerWarn=false;
              $this.isCustomerWarnRead=false;
              $this.isSalesmanWarnRead=false;
            },1000);
          }
      }); 
    },
    // 来源页面变化切换电话
    urlChangePhone(e){
      var $this = this;
      if($this.formData.url!=""){
        $this.$store.dispatch("enphone/cluesUrlGetPhoneAction", {url:$this.formData.url}).then(response=>{
            if(response.status){
              if(response.phone){
                var phoneList = $this.phoneList;
                phoneList.forEach(function(item,index){
                  if(item.id == response.phone.id){
                    item.isOn = true;
                    $this.formData.phoneid = response.phone.id;
                  }else{
                    item.isOn = false;
                  }
                });
                $this.phoneList = phoneList;
              }
            }else{
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
              });
            }
        });
      }
    },
    // 电话点击事件
    phoneClick(id){
      var $this = this;
      var phoneList = $this.phoneList;
      phoneList.forEach(function(item,index){
        if(item.id == id){
          if(item.isOn){
            item.isOn = false;
            $this.salesuserlist=[]
          }else{
            item.isOn = true;
            $this.formData.phoneid = id;
            $this.getCurrentPhoneUser();
          }
        }else{
          item.isOn = false;
        }
      });
      $this.phoneList = phoneList;
    },
    // 点击上传压缩包
    httpZipRequest:function(parm){
      var $this=this;
      var formData = new FormData();
      formData.append('file',parm.file);
      $this.$store.dispatch('api/fileUploadAction', formData).then(response=>{
        if(response){
          if(response.status){
            $this.$message({
              showClose: true,
              message: "上传成功！",
              type: 'success',
            }); 
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
        $this.formData.custormfiles=response.info;
        $this.formData.custormfilesname=response.name;
        var fileList={};
        fileList.name=$this.formData.custormfilesname;
        fileList.url=$this.formData.custormfiles;
        $this.fileList.push(fileList);
        var fileListArr = $this.fileList;
        if(fileListArr.length>1){
           fileListArr.shift();
        }
        $this.fileList=fileListArr;
        }
      });
    },
    handleExceed(files, fileList) {
      var $this = this;
      $this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    // 意向分类点击事件
    producttypeClick(){
      var $this = this;
      var producttypeArr = [];
      if($this.producttypeArr.length==0){
        $this.formData.producttype_id = "";
      }else{
        $this.formData.producttype_id = $this.producttypeArr[$this.producttypeArr.length-1];
        producttypeArr = [$this.formData.producttype_id];
      }
      $this.producttypeArr = producttypeArr;
    },
    // 产品点击事件
    productClick(){
      var $this = this;
      if(!$this.ID){
        var producttypeArr = [];
        if($this.formData.keying.length==0){
          $this.formData.producttype_id = "";
        }else{
          var lastProductID = $this.formData.keying[$this.formData.keying.length-1];
          $this.productList.forEach(function(item,index){
            if(item.id == lastProductID){
              $this.formData.producttype_id = item.typeid;
            }
          });
          producttypeArr = [$this.formData.producttype_id];
        }
        $this.producttypeArr = producttypeArr;
      }
    },
    // 保存添加/编辑数据
    saveData(){
      var $this = this;
      if(!$this.isDisabled){
        var formData = $this.initFormData();
        if(!$this.validationForm()){
          return false;
        }
        $this.isDisabled=true;
        var pathUrl = "";
        if($this.formData.id==0){
          pathUrl = "enphone/cluesAddAction";
        }else{
          pathUrl = "enphone/cluesEditAction";
        }
        $this.$store.dispatch(pathUrl, formData).then(response=>{
            if(response.status){
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'success'
              });
              if($this.formData.id!=0){
                $this.initCluesInfo();
              }else{
                var queryObj = {};
                queryObj.phoneID = $this.formData.phoneid;
                queryObj.waitstatus = "1";
                var routeUrl =  $this.$router.resolve({path:'/Enphone/phoneindex',query:queryObj});
                window.open(routeUrl.href,'_self');
              }
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
        });
      }
    },
    // 清空添加数据表单
    clearFormData(){
      var $this = this;
      $this.formData.id = 0;
      $this.formData.custormname="";
      $this.formData.custorm="";
      $this.formData.custormphone="";
      $this.formData.salesuserid="";
      $this.formData.ftword_id="";
      $this.formData.custormneedinfo="";
      $this.formData.otherremark="";
      $this.formData.givesaleswarn="";
      $this.formData.saleswarnstatus=false;
      $this.formData.custormfiles="";
      $this.formData.custormfilesname="";
      $this.fileList = [];
      $this.formData.xuntime="";
      $this.formData.timediff="";
      $this.formData.continent="";
      $this.formData.country="";
      $this.formData.messagetype="";
      $this.formData.mode="";
      $this.formData.url="";
      $this.formData.ip="";
      $this.formData.device="";
      $this.formData.level_id="";
      $this.formData.material="";
      $this.formData.production="";
      $this.formData.infeed="";
      $this.formData.outfeed="";
      $this.formData.xunremark="";
      $this.formData.custormremark="";
      $this.formData.effective=false;
      $this.formData.invalidcause="";
      $this.formData.phoneid = "";
      $this.formData.producttype_id = "";
      $this.formData.phoneid = "";
      $this.formData.keying = [];
      $this.formData.enxunprice = "";
      $this.formData.ennature = "";      
      var phoneList = $this.phoneList;
      phoneList.forEach(function(item,index){
        item.isOn = false;
      });
      $this.phoneList = phoneList;
      $this.producttypeArr=[];
    },
    // 验证是否为空
    validationForm(){
      var $this = this;
      if($this.formData.phoneid == ""){
        $this.$message({
            showClose: true,
            message: '错误：来源电话不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.formData.xuntime == ""||!$this.formData.xuntime){
        $this.$message({
            showClose: true,
            message: '错误：来源时间不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.formData.mode == ""||!$this.formData.mode){
        $this.$message({
            showClose: true,
            message: '错误：来源渠道不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.formData.messagetype == ""||!$this.formData.messagetype){
        $this.$message({
            showClose: true,
            message: '错误：来源类型不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.formData.producttype_id == ""||!$this.formData.producttype_id){
        $this.$message({
            showClose: true,
            message: '错误：意向产品分类不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.formData.keying.length == 0){
        $this.$message({
            showClose: true,
            message: '错误：意向产品不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.formData.mode == 6&&$this.formData.url==""){
        $this.$message({
            showClose: true,
            message: '错误：渠道为外部链接请备注来自URL！',
            type: 'error'
        });
        return false;
      }
      return true;
    },
    // 重置表单
    resetFormData(){
      var $this = this;
      if($this.formData.id==0){
        $this.clearFormData();
      }else{
        $this.setCluesInfo();
      }
    }, 
    // 修改客服内部提醒
    editCustomerWarn(){
      var $this = this;
      if(!$this.isEditCustomerWarn){
        $this.isEditCustomerWarn=true;
        var resultData = {};
        resultData.id = $this.formData.id;
        resultData.custormselfwarn = $this.formData.custormselfwarn;
        resultData.custormselfwarnstatus = $this.noRead?3:2;
        $this.$store.dispatch("enphone/customerWarnEditAction", resultData).then(response=>{
            if(response.status){
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'success'
              });
              $this.initCluesInfo();
            }else{
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
              });
              setTimeout(()=>{
                $this.isEditCustomerWarn=false;
              },1000);
            }
        });
      }
    },
    // 确认阅读客服内部提醒
    customerWarnRead(){
      var $this = this;
      if(!$this.isCustomerWarnRead){
        var resultData = {};
        resultData.id = $this.formData.id;
        $this.$store.dispatch("enphone/customerWarnIsReadAction", resultData).then(response=>{
            if(response.status){
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'success'
              });
              $this.initCluesInfo();
            }else{
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
              });
              setTimeout(()=>{
                $this.isCustomerWarnRead=false;
              },1000);
            }
        });
      }
    },
    // 确认阅读业务员提醒
    salesmanWarnRead(){
      var $this = this;
      if(!$this.isSalesmanWarnRead){
        $this.isSalesmanWarnRead=true;
        var resultData = {};
        resultData.id = $this.formData.id;
        $this.$store.dispatch("enphone/salesmanWarnIsReadAction", resultData).then(response=>{
            if(response.status){
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'success'
              });
              $this.initCluesInfo();
            }else{
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
              });
              setTimeout(()=>{
                $this.isSalesmanWarnRead=false;
              },1000);
            }
        });
      }
    },
    // 填写国家自动获取大洲和时差
    countryClick(){
      var $this=this;
      var formCountry = {};
      formCountry.name=$this.formData.country;
      if(formCountry.name!=''){
          $this.$store.dispatch("enphone/getcontientAction", formCountry).then(response=>{
              if(response.status){
                if(response.data==null||response.data==''){
                  $this.formData.continent='';
                  $this.formData.timediff='';
                }else{
                  $this.formData.continent=response.data.contient;
                  $this.formData.timediff=response.data.timecha;
                }
              }else{
                $this.$message({
                  showClose: true,
                  message: response.info,
                  type: 'error'
                });
              }
          });
      }else{
          $this.formData.continent='';
          $this.formData.timediff='';
      }
    },
    // 默认当前日期时间
    currentTime(){
      var $this=this;
      var getTime=new Date();
      var year=getTime.getFullYear();
      var month=getTime.getMonth()+1;
      if(month<10){
         month='0' + month
      }
      var day=getTime.getDate();
      if(day<10){
         day='0' + day
      }
      var hh=getTime.getHours();
      if(hh<10){
         hh='0' + hh
      }
      var mm=getTime.getMinutes();
      if(mm<10){
         mm='0' + mm
      }
      $this.formData.xuntime= year + '-' + month + '-' + day + ' ' + hh + ':' + mm;
    },
    // 搜索统计数据跳转
    searchStatisticsData(){
      var $this = this;
      var routeUrl =  $this.$router.resolve({path:'/Enphone/searchClues'});
      window.open(routeUrl.href,'_self');
    },
    // 统计分析跳转
    statisticsClues(){
      var $this = this;
      var routeUrl =  $this.$router.resolve({path:'/Enphone/statisticClues'});
      window.open(routeUrl.href,'_self');
    },
    // 电话点击跳转列表
    phoneJump(id,waitstatus){
      var $this=this;
      var queryObj = {};
      if(id==""){
        queryObj.key=waitstatus;
      }else{
        queryObj.phoneID = id;
        queryObj.waitstatus = waitstatus;
      }
      var routeUrl =  $this.$router.resolve({path:'/Enphone/phoneindex',query:queryObj});
      window.open(routeUrl.href,'_self');
    },
    // 在线查看，可下载文件
    handlePreview(file) {
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = file.url;
      link.setAttribute("download", file.url); //指定下载后的文件名，防跳转
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link)
    },
    // 特别说明下拉框
    otherRemarkQuerySearch(queryString,cb){
      var $this = this;
      var resultData = {};
      var returnData = [];
      resultData.keywork = queryString;
      resultData.status = 1;
      $this.$store.dispatch("enphone/inputKeywordListAction", resultData).then(response=>{
          if(response.status){
            if(response.data.length>0){
              response.data.forEach(function(item){
                var itemData = {};
                itemData.value = item.name;
                returnData.push(itemData);
              });
            }
            cb(returnData);
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
    },
    // 特别说明下拉框选择改变事件
    otherRemarkHandleSelect(e){
    },
    //来自国家下拉框
    countryQuerySearch(queryString,cb){
      var $this = this;
      var resultData = {};
      var returnData = [];
      resultData.keywork = queryString;
      resultData.status = 8;
      $this.$store.dispatch("enphone/countryListAction", resultData).then(response=>{
          if(response.status){
            if(response.data.length>0){
              response.data.forEach(function(item){
                var itemData = {};
                itemData.value = item.name;
                returnData.push(itemData);
              });
            }
            cb(returnData);
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
    },
    //来自国家下拉选择
    countryHandleSelect(val){
      this.formData.country = val.value;
      this.countryClick()
    },
    
    // 提醒下拉框
    noticeQuerySearch(queryString,cb){
      var $this = this;
      var resultData = {};
      var returnData = [];
      resultData.keywork = queryString;
      resultData.status = 2;
      $this.$store.dispatch("enphone/inputKeywordListAction", resultData).then(response=>{
          if(response.status){
            if(response.data.length>0){
              response.data.forEach(function(item){
                var itemData = {};
                itemData.value = item.name;
                returnData.push(itemData);
              });
            }
            cb(returnData);
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
    },
    // 提醒下拉框选择改变事件
    noticeHandleSelect(e){},
    // 物料下拉框
    wlQuerySearch(queryString,cb){
      var $this = this;
      var resultData = {};
      var returnData = [];
      resultData.keywork = queryString;
      resultData.status = 3;
      $this.$store.dispatch("enphone/inputKeywordListAction", resultData).then(response=>{
          if(response.status){
            if(response.data.length>0){
              response.data.forEach(function(item){
                var itemData = {};
                itemData.value = item.name;
                returnData.push(itemData);
              });
            }
            cb(returnData);
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
    },
    // 物料下拉框选择改变事件
    wlHandleSelect(e){
    },
    // 进料下拉框
    jlQuerySearch(queryString,cb){
      var $this = this;
      var resultData = {};
      var returnData = [];
      resultData.keywork = queryString;
      resultData.status = 4;
      $this.$store.dispatch("enphone/inputKeywordListAction", resultData).then(response=>{
          if(response.status){
            if(response.data.length>0){
              response.data.forEach(function(item){
                var itemData = {};
                itemData.value = item.name;
                returnData.push(itemData);
              });
            }
            cb(returnData);
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
    },
    // 进料下拉框选择改变事件
    jlHandleSelect(e){},
    // 出料下拉框
    clQuerySearch(queryString,cb){
      var $this = this;
      var resultData = {};
      var returnData = [];
      resultData.keywork = queryString;
      resultData.status = 5;
      $this.$store.dispatch("enphone/inputKeywordListAction", resultData).then(response=>{
          if(response.status){
            if(response.data.length>0){
              response.data.forEach(function(item){
                var itemData = {};
                itemData.value = item.name;
                returnData.push(itemData);
              });
            }
            cb(returnData);
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
    },
    // 出料下拉框选择改变事件
    clHandleSelect(e){},
    // 询盘备注下拉框
    xunRemarkQuerySearch(queryString,cb){
      var $this = this;
      var resultData = {};
      var returnData = [];
      resultData.keywork = queryString;
      resultData.status = 6;
      $this.$store.dispatch("enphone/inputKeywordListAction", resultData).then(response=>{
          if(response.status){
            if(response.data.length>0){
              response.data.forEach(function(item){
                var itemData = {};
                itemData.value = item.name;
                returnData.push(itemData);
              });
            }
            cb(returnData);
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
    },
    // 询盘备注下拉框选择改变事件
    xunRemarkHandleSelect(e){},
    // 客服备注下拉框
    custormRemarkQuerySearch(queryString,cb){
      var $this = this;
      var resultData = {};
      var returnData = [];
      resultData.keywork = queryString;
      resultData.status = 7;
      $this.$store.dispatch("enphone/inputKeywordListAction", resultData).then(response=>{
          if(response.status){
            if(response.data.length>0){
              response.data.forEach(function(item){
                var itemData = {};
                itemData.value = item.name;
                returnData.push(itemData);
              });
            }
            cb(returnData);
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
    },
    // 客服备注下拉框选择改变事件
    custormRemarkHandleSelect(e){},
  }
}
</script>
<style lang="scss" scoped>
</style>
