<template>
  <div class="page-root" ref="boxPane">
    <el-card class="box-card scroll-card" shadow="hover">
        <div slot="header">
          <div class="card-header" ref="headerPane">
              <el-button type="primary" size="small" icon="el-icon-refresh-left" v-on:click="resetFormData()">重置</el-button>
              <el-button type="primary" size="small" icon="el-icon-finished" v-if="menuButtonPermit.includes('Enphone_add')||menuButtonPermit.includes('Enphone_edit')" @click="saveData">保存</el-button>
          </div>
        </div>
        <div class="card-content" ref="tableContent">
          <div class="scroll-panel" v-bind:style="{height:scrollHeight+'px'}">
            <div class="item-form">
              <div class="item-panel">
                <dl>
                  <dt>来源电话：<span>*</span></dt>
                  <dd>
                    <div class="clues-list phone-list">
                      <span class="item-clues" v-for="item in phoneList" v-bind:class="item.isOn?'active':''" v-bind:key="item.id" v-on:click="phoneClick(item.id)">{{item.phonenumber}}</span>
                    </div>
                  </dd>
                </dl>
              </div>
              <div class="item-panel">
                <dl style="width: 240px;">
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
                <dl style="width: 240px;">
                  <dt>客户Email：</dt>
                  <dd>
                    <el-input
                        placeholder="邮箱"
                        size="small"
                        v-model="formData.custormemail"
                        clearable>
                    </el-input>
                  </dd>
                </dl>
                <dl style="width: 240px;">
                  <dt>客户电话：</dt>
                  <dd>
                    <el-input
                        placeholder="电话"
                        size="small"
                        v-model="formData.custormphone"
                        clearable>
                    </el-input>
                  </dd>
                </dl>
                <dl style="width: 240px;">
                  <dt>分配的业务员：</dt>
                  <dd>
                    <el-select size="small" v-model="formData.salesuserid" placeholder="请选择">
                      <el-option
                        v-for="item in salesuserlist"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </dd>
                </dl>
                <dl style="width: 240px;">
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
              <div class="item-panel">
                <dl style="width:480px;">
                  <dt>客户需求详情：*如有其他联系方式请在详情中注明</dt>
                  <dd>
                    <el-input
                        type="textarea"
                        :autosize="{minRows:4,maxRows:8}"
                        size="small"
                        v-model="formData.custormneedinfo"
                        clearable>
                    </el-input>
                  </dd>
                </dl>
                <dl style="width:480px;">
                  <dt>备注与提醒：</dt>
                  <dd>
                    <span>分配/特别说明：</span>
                    <el-input
                        size="small"
                        v-model="formData.otherremark"
                        clearable>
                    </el-input>
                  </dd>
                  <dd>
                    <span>提醒/首页提醒：</span>
                    <el-input
                        size="small"
                        v-model="formData.givesaleswarn"
                        clearable>
                    </el-input>
                  </dd>
                  <dd>
                  <el-checkbox 
                        v-model="formData.saleswarnstatus"
                        clearable>修改提醒</el-checkbox>
                  </dd>
                  <dd>
                     <el-upload
                        class="upload-demo"
                        name="file"
                        action=""
                        accept="aplication/zip"
                        :http-request="httpZipRequest"
                        :limit="1"
                        :on-exceed="handleExceed"
                        :file-list="fileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                     </el-upload>
                  </dd>
                </dl>
              </div>
              <div class="item-panel">
                <dl style="width: 240px;">
                  <dt>信息来自具体时间：<span>*</span></dt>
                  <dd>
                     <el-date-picker
                        style="display:block;width:100%;"
                        v-model="formData.xuntime"
                        size="small"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format = "yyyy-MM-dd HH:mm:ss"
                        align="right"
                        :picker-options="pickerOptions">
                      </el-date-picker>
                  </dd>
                </dl>
                <dl style="width: 240px;">
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
                <dl style="width: 240px;">
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
                <dl style="width: 240px;">
                  <dt>来自国家：</dt>
                  <dd>
                    <el-input
                        placeholder="号码归属地"
                        size="small"
                        v-model="formData.country"
                        clearable>
                    </el-input>
                  </dd>
                </dl>
                <dl style="width: 240px;">
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
                <dl style="width: 240px;">
                  <dt>来自渠道：<span>*外部链接请备注来自URL</span></dt>
                  <dd>
                    <el-select v-model="formData.mode" size="small" clearable placeholder="请选择">
                        <el-option
                        v-for="item in modeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                  </dd>
                </dl>
                <dl style="width: 240px;">
                  <dt>来自网页：</dt>
                  <dd>
                    <el-input
                        placeholder="网址"
                        size="small"
                        v-model="formData.url"
                        clearable>
                    </el-input>
                  </dd>
                </dl>
                <dl style="width: 240px;">
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
                <dl style="width: 240px;">
                  <dt>设备：</dt>
                  <dd>
                    <el-select v-model="formData.device" size="small" clearable placeholder="请选择">
                        <el-option
                        v-for="item in deviceList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                  </dd>
                </dl>
                <dl style="width: 240px;">
                  <dt>级别：</dt>
                  <dd>
                    <el-select v-model="formData.level_id" size="small" clearable placeholder="请选择">
                        <el-option
                        v-for="item in level_idList"
                        :key="item.label"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                  </dd>
                </dl>
              </div>
              <div class="item-panel">
                <dl>
                  <dt>意向设备：<span>*</span></dt>
                  <dd>
                    <strong>类别</strong>
                    <div class="clues-list product-list">
                      <el-checkbox-group v-model="producttypeArr" @change="producttypeClick">
                        <el-checkbox v-for="item in producttypeList" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </dd>
                  <dd>
                    <strong>砂石：</strong>
                    <div class="clues-list product-list">
                      <el-checkbox-group v-model="SandGravelArr">
                        <el-checkbox v-for="item in SandGravelList" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </dd>
                  <dd>
                    <strong>选矿/建材：</strong>
                    <div class="clues-list product-list">
                      <el-checkbox-group v-model="OreDressArr">
                        <el-checkbox v-for="item in OreDressList" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </dd>
                  <dd>
                    <strong>磨粉/烘干/压球：</strong>
                    <div class="clues-list product-list">
                      <el-checkbox-group v-model="FlourArr">
                        <el-checkbox v-for="item in FlourList" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </dd>
                  <dd>
                    <strong>其它：</strong>
                    <div class="clues-list product-list">
                      <el-checkbox-group v-model="otherArr">
                        <el-checkbox v-for="item in otherList" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <p>**请根据客户意图选择合适的产品，可多选。如果位：其它生产线、配件、其它产品请在备注中注明具体产品</p>
                  </dd>
                </dl>
              </div>
              <div class="item-panel">
                <dl style="width: 240px;">
                  <dt>物料/产量：</dt>
                  <dd>
                     <span>物料：</span>
                      <el-input
                        placeholder="物料"
                        type="textarea"
                        resize="none"
                        :rows="4"
                        size="small"
                        v-model="formData.material"
                        clearable>
                      </el-input>
                  </dd>
                  <dd>
                     <span>产量：</span>
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
                <dl style="width: 240px;">
                  <dt>进出料：</dt>
                  <dd>
                     <span>进料：</span>
                      <el-input
                        placeholder="进料"
                        size="small"
                        v-model="formData.infeed"
                        clearable>
                      </el-input>
                  </dd>
                  <dd>
                     <span>出料：</span>
                      <el-input
                        placeholder="出料"
                        size="small"
                        v-model="formData.outfeed"
                        clearable>
                      </el-input>
                  </dd>
                </dl>
                <dl style="width: 240px;">
                  <dt>备注：</dt>
                  <dd>
                     <span>询盘备注：</span>
                      <el-input
                        placeholder="备注"
                        size="small"
                        v-model="formData.xunremark"
                        clearable>
                      </el-input>
                  </dd>
                  <dd>
                     <span>客服备注：</span>
                      <el-input
                        placeholder="客服部备注"
                        size="small"
                        v-model="formData.custormremark"
                        clearable>
                      </el-input>
                      <i>此备注仅客服部可见</i>
                  </dd>
                </dl>
              </div>
              <div class="item-panel">
                <dl style="width: 240px;">
                  <dt>是否有效：</dt>
                  <dd>
                    <el-checkbox v-model="formData.effective" label="有效" border size="small"></el-checkbox>
                  </dd>
                </dl>
                <dl style="width: 240px;">
                  <dt>无效原因：</dt>
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
                <dl style="width: 240px;">
                  <dt>添加人：</dt>
                  <dd><p>{{userInfo.name}}</p></dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'addEditClues',
  data() {
    return {
      scrollHeight:200,
      ID:null,
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
      producttypeList:[],//分类
      producttypeArr:[],
      SandGravelList:[],//沙石
      SandGravelArr:[],
      OreDressList:[],//选矿建材
      OreDressArr:[],
      FlourList:[],//磨粉
      FlourArr:[],
      otherList:[],//其它
      otherArr:[],
      fileList:[],//上传文件
      salesuserlist:[],//业务员
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
      level_idList:[],
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
        {value: '大洋洲',label: 'label'}
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
        saleswarnstatus:false,
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
      },
      defaultInfo:{},
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'device'
    ]),
  },
  mounted(){
      const $this = this;
      this.$nextTick(function () {
        $this.scrollHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-30-23;
        // 30：page-root上下内边距；20：按钮父级上下内边距；
      });
      window.onresize = () => {
          return (() => {
            $this.scrollHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-30-23;
            // 30：page-root上下内边距；20：按钮父级上下内边距；
          })()
      };
  },
  watch: {
      scrollHeight(val) {
        if (!this.timer) {
          this.scrollHeight = val
          this.timer = true
          const $this = this
          setTimeout(function() {
            $this.timer = false
          }, 400)
        }
      },
  },
  created(){
    var $this = this;
    if($this.$route.query.ID){
      $this.ID = parseInt($this.$route.query.ID);
    }else{
      $this.ID = null;
    }
    $this.initData();
  },
  methods:{
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
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
      formData.custormemail = $this.formData.custormemail;
      formData.custormphone = $this.formData.custormphone;
      formData.salesuserid = $this.formData.salesuserid;
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
      formData.production = $this.formData.production;
      formData.infeed = $this.formData.infeed;
      formData.outfeed = $this.formData.outfeed;
      formData.xunremark = $this.formData.xunremark;
      formData.custormremark = $this.formData.custormremark;
      formData.invalidcause = $this.formData.invalidcause;
      formData.saleswarnstatus = $this.formData.saleswarnstatus?2:3;
      formData.effective = $this.formData.effective?1:2;
      formData.xuntime = $this.formData.xuntime;
      formData.timediff = $this.formData.timediff;
      formData.messagetype = $this.formData.messagetype;
      formData.mode = $this.formData.mode;
      formData.phoneid = $this.formData.phoneid;
      formData.producttype_id = $this.formData.producttype_id;
      formData.id = $this.formData.id;
      var keying=[];
      keying=keying.concat($this.SandGravelArr,$this.OreDressArr,$this.FlourArr,$this.otherArr);
      formData.keying = $this.formData.keying = keying;
      return formData;
    },
    // 询盘编辑获取初始化询盘信息
    initCluesInfo(){
      var $this = this;
      $this.$store.dispatch('enphone/initCluesEditInfoAction', {id:$this.ID}).then(response=>{
        if(response){
          if(response.status){
            console.log(response,"询盘信息");
            $this.defaultInfo = response.data;
            $this.setCluesInfo();
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
    // 设置询盘初始化信息
    setCluesInfo(){
      var $this = this;
      $this.formData.id = $this.defaultInfo.id;
      $this.formData.custormname = $this.defaultInfo.custormname;
      $this.formData.custormemail = $this.defaultInfo.custormemail;
      $this.formData.custormphone = $this.defaultInfo.custormphone;
      if($this.defaultInfo.salesuserid!=0){
         $this.formData.salesuserid = $this.defaultInfo.salesuserid;
      }else{
        $this.formData.salesuserid="";
      }
      $this.formData.ftword_id = $this.defaultInfo.ftword_id;
      $this.formData.custormneedinfo = $this.defaultInfo.custormneedinfo;
      $this.formData.otherremark = $this.defaultInfo.otherremark;
      $this.formData.givesaleswarn = $this.defaultInfo.givesaleswarn;
      $this.formData.saleswarnstatus = $this.defaultInfo.saleswarnstatus==2?true:false;
      $this.formData.custormfiles = $this.defaultInfo.custormfiles;
      $this.formData.custormfilesname = $this.defaultInfo.custormfilesname;
      var fileList={};
      $this.fileList=[];
      fileList.name=$this.defaultInfo.custormfilesname;
      fileList.url=$this.defaultInfo.custormfiles;
      $this.fileList.push(fileList);
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
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        console.log(res);
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
            console.log(response,"条件信息01");
            var modeList = [];
            response.source.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              modeList.push(itemData);
            });
            $this.modeList = modeList;
            var level_idList = [];
            response.level.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.levelname;
              itemData.value = item.id;
              level_idList.push(itemData);
            });
            $this.level_idList = level_idList;
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
            var SandGravelList=[];
            response.product[0].product.forEach(function(item,index){
                var itemChildren = {};
                itemChildren.label = item.name;
                itemChildren.value = item.id;
                SandGravelList.push(itemChildren);
            });
            $this.SandGravelList = SandGravelList;
            var OreDressList=[];
            response.product[1].product.forEach(function(item,index){
                var itemChildren = {};
                itemChildren.label = item.name;
                itemChildren.value = item.id;
                OreDressList.push(itemChildren);
            });
            $this.OreDressList = OreDressList;
            var FlourList=[];
            response.product[2].product.forEach(function(item,index){
                var itemChildren = {};
                itemChildren.label = item.name;
                itemChildren.value = item.id;
                FlourList.push(itemChildren);
            });
            $this.FlourList = FlourList;
            if(response.userlist.length>0){
              var salesuserlist=[];
              response.userlist.forEach(function(item,index){
                  var itemChildren = {};
                  itemChildren.label = item.name;
                  itemChildren.value = item.id;
                  salesuserlist.push(itemChildren);
              });
              $this.salesuserlist = salesuserlist;
            }else{
              $this.salesuserlist=[{label:"",value:0}]
            }
            var otherList=[];
            response.product[3].product.forEach(function(item,index){
                var itemChildren = {};
                itemChildren.label = item.name;
                itemChildren.value = item.id;
                otherList.push(itemChildren);
            });
            $this.otherList = otherList;
            $this.levelList = response.level;
            $this.priceList = response.price;
            $this.phoneList = response.phonelist;
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
    // 判断字符串是否为链接
    isURL(str) {
      var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      return pattern.test(str);
    },
    // 来源页面变化切换电话
    urlChangePhone(e){
      var $this = this;
      if($this.formData.url!=""&&$this.isURL($this.formData.url)){
        $this.$store.dispatch("enphone/cluesUrlGetPhoneAction", {url:$this.formData.url}).then(response=>{
            if(response.status){
              console.log(response);
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
          }else{
            item.isOn = true;
            $this.formData.phoneid = id;
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
        console.log(response,"文件信息");
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
        if(fileListArr.length>0){
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
      var producttypeArr = $this.producttypeArr;
      if (producttypeArr.length > 1) {
        producttypeArr.shift();
      }
      $this.producttypeArr = producttypeArr;
      $this.formData.producttype_id = $this.producttypeArr[0];
    },
    // 保存添加/编辑数据
    saveData(){
      var $this = this;
      var formData = $this.initFormData();
      if(!$this.validationForm()){
        return false;
      }
      console.log(formData,"formData 添加保存")
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
              $this.clearFormData();
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
      var phoneList = $this.phoneList;
      phoneList.forEach(function(item,index){
        item.isOn = false;
      });
      $this.phoneList = phoneList;
      $this.SandGravelArr=[];
      $this.OreDressArr=[];
      $this.FlourArr=[];
      $this.otherArr=[];
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
      if($this.formData.timediff == ""||!$this.formData.timediff){
        $this.$message({
            showClose: true,
            message: '错误：客户当地时间不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.formData.keying.length == 0 || $this.formData.producttype_id == ""||!$this.formData.producttype_id){
        $this.$message({
            showClose: true,
            message: '错误：意向设备不能为空！',
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
  }
}
</script>
<style lang="scss" scoped>
.el-select{
  display: block;
}
.item-form{
  .item-panel{
    position: relative;
    margin-bottom: 20px;
    dl{
      float: left;
      dt{
        line-height: 24px;
        font-size: 14px;
        span{
          color:red;
        }
      }
      dd{
        margin-top: 5px;
        .clues-list{
          margin: 0 -2px;
          &.phone-list,&.price-list{
            .item-clues{
              width: 147px;
            }
          }
          &.product-list{
            .item-clues{
              width: 160px;
            }
          }
          &.level-list{
            .item-clues{
              width: 104px;
            }
          }
          .item-clues{
            display: block;
            float:left;
            margin: 2px;
            border: 1px solid #e6e6e6;
            height: 34px;
            line-height: 32px;
            font-size: 14px;
            text-align: center;
            cursor: pointer;
            &:hover{
              color: #19aa8d;
              background: #e8f7f4;
              border-color: #a3ddd1;
            }
          }
          .item-clues.active{
            color: #FFFFFF;
            background-color: #19aa8d;
            border-color: #19aa8d;
            &:hover{
              color: #FFFFFF;
              background-color: #19aa8d;
              border-color: #19aa8d;
            }
          }
        }
        p{
          line-height: 32px;
          font-size: 12px;
        }
      }
    }
    dl+dl{
      margin-left: 15px;
    }
  }
}
</style>
