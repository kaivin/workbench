<template>
  <div class="page-root" ref="boxPane">
    <el-card class="box-card scroll-card" shadow="hover">
        <div class="card-content" ref="cardContent">
          <div class="scroll-panel" v-bind:style="{height:scrollHeight+'px'}">
               <ul class="WebServerAddEditPost clearfix">
                   <li>
                       <div class="AddEditPostItem flex-wrap clearfix">
                            <label>别名：</label>
                            <el-input
                              v-model="formData.name"
                              size="small"
                              class="EditPostInput flex-content"
                              clearable>
                            </el-input>
                            <el-popover
                              placement="left"
                              width="200"
                              class="EditPostTag"
                              trigger="hover"
                              content="服务器别名">
                              <i slot="reference" class="el-icon-s-opportunity"></i>
                            </el-popover>
                       </div>
                   </li>
                   <li>
                       <div class="AddEditPostItem flex-wrap clearfix">
                            <label>语言：</label>
                            <el-select 
                              v-model="formData.languageid" 
                              size="small"
                              class="EditPostSelect flex-content"
                              clearable 
                              placeholder="请选择品牌">
                              <el-option
                                v-for="item in languageList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                            <el-popover
                              placement="left"
                              width="200"
                              class="EditPostTag"
                              trigger="hover"
                              content="网站所属品牌">
                              <i slot="reference" class="el-icon-s-opportunity"></i>
                            </el-popover>
                       </div>
                       <div class="AddEditPostItem flex-wrap clearfix">
                            <label>用途：</label>
                            <el-select 
                              v-model="formData.useringid" 
                              size="small" 
                              class="EditPostSelect flex-content"
                              clearable 
                              placeholder="请选择语言">
                              <el-option
                                v-for="item in useingList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                            <el-popover
                              placement="left"
                              width="200"
                              class="EditPostTag"
                              trigger="hover"
                              content="网站所属语种">
                              <i slot="reference" class="el-icon-s-opportunity"></i>
                            </el-popover>
                       </div>
                       <div class="AddEditPostItem flex-wrap clearfix">
                            <label>系统：</label>
                            <el-select 
                              v-model="formData.systemid" 
                              size="small" 
                              class="EditPostSelect flex-content"
                              clearable 
                              placeholder="请选择系统">
                              <el-option
                                v-for="item in serverList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                            <el-popover
                              placement="left"
                              width="200"
                              class="EditPostTag"
                              trigger="hover"
                              content="网站所属部门">
                              <i slot="reference" class="el-icon-s-opportunity"></i>
                            </el-popover>
                       </div>
                   </li>
                   <li>
                       <div class="AddEditPostItem flex-wrap AddEditPostItemIp clearfix">
                            <label>IP：</label>
                            <el-input
                              v-model="formData.ip"
                              size="small"
                              class="EditPostInput flex-content"
                              clearable>
                            </el-input>
                       </div>
                      <div class="item-column flex AddEditPostItemIpTxt">
                        <div class="item-wrap flex-box">
                          <a :href="'http://ip.chinaz.com/?IP='+formData.ip" v-if="formData.ip!=''" target="_blank" class="link">IP查询</a>
                          <a :href="'https://whoer.net/checkwhois?IP='+formData.ip" v-if="formData.ip!=''" target="_blank" class="link">IP查询2</a>
                          <a :href="'http://ping.chinaz.com/'+formData.ip" v-if="formData.ip!=''" target="_blank" class="link">PING国内检测</a>
                          <a :href="'https://asm.ca.com/zh_cn/ping.php?IP='+formData.ip" v-if="formData.ip!=''" target="_blank" class="link">PING全球检测</a>
                          <a class="link" v-on:click="linkPage" v-if="formData.ip!=''">该IP网站查询</a>
                        </div>
                      </div>
                   </li>
                   <li>
                       <div class="AddEditPostItem flex-wrap AddEditPostItemAllip clearfix">
                            <label>全部IP：</label>
                            <el-input
                              type="textarea"
                              :autosize="{ minRows:3, maxRows:6}"
                              placeholder="多个IP以逗号分隔"
                              v-model="formData.allip"
                              size="small"
                              class="EditPostTextareaIp flex-content"
                              clearable>
                            </el-input>
                       </div>
                   </li>
                   <li>
                       <div class="AddEditPostItem flex-wrap clearfix">
                            <label>帐号：</label>
                            <el-input
                              v-model="formData.servername"
                              size="small"
                              class="EditPostInput flex-content"
                              clearable>
                            </el-input>
                            <el-popover
                              placement="left"
                              width="210"
                              class="EditPostTag"
                              trigger="hover"
                              content="服务器登陆账号">
                              <i slot="reference" class="el-icon-s-opportunity"></i>
                            </el-popover>
                       </div>
                       <div class="AddEditPostItem flex-wrap clearfix">
                            <label>密码：</label>
                            <el-input
                              v-model="formData.serverpwd"
                              size="small"
                              class="EditPostInput flex-content"
                              clearable>
                            </el-input>
                            <el-popover
                              placement="left"
                              width="210"
                              class="EditPostTag"
                              trigger="hover"
                              content="服务器登陆密码">
                              <i slot="reference" class="el-icon-s-opportunity"></i>
                            </el-popover>
                       </div>
                   </li>
                   <li>
                       <div class="AddEditPostItem flex-wrap EditPostTextareaNote clearfix">
                            <label>备注：</label>                            
                            <el-input
                              type="textarea"
                              :autosize="{ minRows:7, maxRows: 20}"
                              placeholder="请输入备注"
                              v-model="formData.remarks"
                              size="small"
                              class="EditPostTextarea flex-content"
                              clearable>
                            </el-input>
                       </div>
                   </li>
                   <li>
                       <div class="AddEditPostItem flex-wrap clearfix">
                            <label>负责人：</label>
                            <el-select 
                              v-model="formData.adminuserid" 
                              size="small" 
                              filterable 
                              multiple 
                              class="EditPostSelect flex-content"
                              clearable 
                              placeholder="请选择服务器负责人">
                              <el-option
                                v-for="item in userList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                            <el-popover
                              placement="left"
                              width="200"
                              class="EditPostTag"
                              trigger="hover"
                              content="该服务器具体负责人">
                              <i slot="reference" class="el-icon-s-opportunity"></i>
                            </el-popover>
                       </div>
                       <div class="AddEditPostItem flex-wrap clearfix">
                            <label>排序：</label>
                            <el-input
                              v-model="formData.sort"
                              class="EditPostInput flex-content"
                              clearable
                              size="small">
                            </el-input>
                            <el-popover
                              placement="left"
                              width="200"
                              class="EditPostTag"
                              trigger="hover"
                              content="服务器列表中可进行排序">
                              <i slot="reference" class="el-icon-s-opportunity"></i>
                            </el-popover>
                       </div>
                   </li>
                   <li v-if="formData.updatetime!=''">
                       <div class="AddEditPostItem flex-wrap clearfix">
                            <label>更新时间：</label>
                            <div class="font">{{formData.updatetime}}</div>
                       </div>
                   </li>
               </ul>
          </div>
          <div class="card-header WebServerAddEditBtn" ref="headerPane">
            <el-button type="primary" class="updateBtn" size="small" v-on:click="updateWebserverInfo()" v-if="menuButtonPermit.includes('Webserver_add')||menuButtonPermit.includes('Webserver_edit')"><i class="svg-i planeWhite" ><svg-icon icon-class="planeWhite" /></i>更新</el-button>
            <el-button type="primary" class="resetBtn" size="small" v-on:click="resetFormData()">重置</el-button>
          </div>
        </div>
    </el-card>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
export default {
  name: 'webserverAddEdit',
  data() {
    return {
      scrollHeight:200,
      menuButtonPermit:[],
      formData:{
        id:0,
        languageid:"",
        name:"",
        useringid:"",
        allip:"",
        systemid:"",
        ip:"",
        servername:"",
        serverpwd:"",
        adminuserid:[],
        remarks:"",
        sort:"",
        updatetime:"",
      },
      webserverInfo:null,
      languageList:[],
      serverList:[],
      useingList:[],
      userList:[],
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
        $this.scrollHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-30-50;
        // 30：page-root上下内边距；20：按钮父级上下内边距；
      });
      window.onresize = () => {
          return (() => {
            $this.scrollHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-30-50;
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
    $this.initData();
  },
  methods:{
    // 刷新页面
    refreshPage(){
      var $this = this;
      $this.clearForm();
      $this.initData();
    },
    // 初始化数据
    initData(){
        var $this = this;
        $this.getUserMenuButtonPermit();
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.status){
          if(res.data.length>0){
            console.log(res.data,"操作权限");
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.$route.query.werberverID){
              if(!$this.menuButtonPermit.includes('Webserver_edit')){
                $this.$message({
                  showClose: true,
                  message: "未被分配服务器修改权限",
                  type: 'error',
                  duration:6000
                });
                $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
              }else{
                if($this.device==="desktop"){
                  $this.getSearchItemData();
                }else{
                  $this.$message({
                    showClose: true,
                    message: "请前往PC端做修改操作",
                    type: 'error',
                    duration:6000
                  });
                  $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
                }
              }
            }else{
              if(!$this.menuButtonPermit.includes('Webserver_add')){
                $this.$message({
                  showClose: true,
                  message: "未被分配服务器添加权限",
                  type: 'error',
                  duration:6000
                });
                $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
              }else{
                if($this.device==="desktop"){
                  $this.getSearchItemData();
                }else{
                  $this.$message({
                    showClose: true,
                    message: "请前往PC端做添加操作",
                    type: 'error',
                    duration:6000
                  });
                  $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
                }
              }
            }
          }else{
            $this.$message({
              showClose: true,
              message: "未被分配文章发布修改权限",
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
    // 获取系统展示数据
    getSearchItemData(){
      var $this = this;
      $this.$store.dispatch('webserver/webserverSelectDataAction', null).then(response=>{
        if(response){
          if(response.status){
            var languageList = [];
            response.language.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.languagename;
              languageList.push(itemData);
            });
            $this.languageList = languageList;
            var serverList = [];
            response.server.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.name;
              serverList.push(itemData);
            });
            $this.serverList = serverList;
            var useingList = [];
            response.usering.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.name;
              useingList.push(itemData);
            });
            $this.useingList = useingList;
            var userList = [];
            response.userlist.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.name+"["+item.id+"]";
              userList.push(itemData);
            });
            $this.userList = userList;
            $this.getWebserverInfo();
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
    // 获取编辑服务器详情
    getWebserverInfo(){
      var $this = this;
      if($this.$route.query.webserverID){
          $this.formData.id = $this.$route.query.webserverID;
          $this.$store.dispatch('webserver/webserverEditInfoAction', {id:$this.formData.id}).then(response=>{
              if(response){
                if(response.status){
                  $this.webserverInfo = response.data;
                  $this.initWebserverInfo($this.webserverInfo);
                }else{
                  if(response.permitstatus&&response.permitstatus==2){
                    $this.$message({
                      showClose: true,
                      message: "未被分配该服务器修改权限",
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
      }
    },
    // 初始化网站信息
    initWebserverInfo(data){
      var $this = this;
      $this.formData.id = data.id;
      $this.formData.name = data.name;
      $this.formData.useringid = data.useringid;
      $this.formData.languageid = data.languageid;
      $this.formData.systemid = data.systemid;
      $this.formData.allip = data.allip;
      $this.formData.ip = data.ip;
      $this.formData.servername = data.servername;
      $this.formData.serverpwd = data.serverpwd;
      $this.formData.remarks = data.remarks;
      $this.formData.sort = data.sort;
      if(data.adminuserid.indexOf(",")!=-1){
        var strArr = data.adminuserid.split(",");
        strArr.forEach(function(item,index){
          $this.formData.adminuserid.push(parseInt(item));
        });
      }else{
        $this.formData.adminuserid = [parseInt(data.adminuserid)]
      }
    },
    // 清空信息
    clearForm(){
      var $this = this;
      $this.formData.id=0,
      $this.formData.languageid="";
      $this.formData.name="";
      $this.formData.useringid="";
      $this.formData.systemid="";
      $this.formData.allip="";
      $this.formData.ip="";
      $this.formData.servername="";
      $this.formData.serverpwd="";
      $this.formData.remarks="";
      $this.formData.sort="";
      $this.formData.adminuserid=[];
      $this.formData.updatetime="";
    },
    // 重置服务器基本信息
    resetFormData(){
      var $this = this;
      $this.clearForm();
      $this.initWebserverInfo($this.webserverInfo);
    },
    // 更新服务器信息
    updateWebserverInfo(){
      var $this = this;
      var actionPath = "";
      var formData = {}
      formData.id = $this.formData.id;
      formData.name = $this.formData.name;
      formData.languageid = $this.formData.languageid;
      formData.useringid = $this.formData.useringid;
      formData.systemid = $this.formData.systemid;
      formData.ip = $this.formData.ip;
      formData.allip = $this.formData.allip;
      formData.servername = $this.formData.servername;
      formData.serverpwd = $this.formData.serverpwd;
      formData.remarks = $this.formData.remarks;
      formData.sort = $this.formData.sort;
      formData.adminuserid = $this.formData.adminuserid;
      if(formData.id==0){
        actionPath = 'webserver/webserverAddAction';
      }else{
        actionPath = 'webserver/webserverEditAction';
      }
      $this.$store.dispatch(actionPath, formData).then(response=>{
          if(response.status){
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'success'
            });
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
    },
    // 跳转到服务器管理
    linkPage(){
      var $this = this;
      $this.$router.push({name:'Website_lists',query:{key:$this.formData.ip}});
    },
  }
}
</script>
<style lang="scss" scoped>
.el-popover--plain{padding:10px 20px;}
.table-post{
  width: 100%;
  overflow: hidden;
  tr{
    td{
      padding: 5px 10px;
      vertical-align: middle;
    }
    td.type-title{
      width: 140px;
      text-align: right;
      span{
        display: inline-block;
        line-height: 32px;
        vertical-align: middle;
      }
    }
  }
}
.flex-box{display:flex;flex-wrap:wrap;}
.item-form-content{
  display: flex;
  .item-column{
    &.flex{
      flex: 1;
    }
    display: flex;
    padding: 5px 0;
    ::v-deep .el-select{
      display: block;
    }
    .item-tag{
      margin: 5px;
      &:focus{
        background: #47bba4;
        border-color: #47bba4;
        color: #FFFFFF;
      }
      &.is-plain:focus{
        color: #19aa8d;
        background: #e8f7f4;
        border-color: #a3ddd1;
      }
    }
    .font{
      display: block;
      padding: 0 5px;
      margin: 0 5px;
      height: 32px;
      font-size: 14px;
      line-height: 32px;
      color: #333;
    }
    .text{
      display: block;
      padding: 0 5px;
      margin: 0 5px;
      height: 32px;
      font-size: 12px;
      line-height: 32px;
      color: $--color-primary;
    }
    .link{
      display: block;
      padding: 0 5px;
      margin: 0 5px;
      height: 32px;
      font-size: 14px;
      line-height: 32px;
      color: $--color-primary;
    }
    .icon-title{
      margin: 0 5px;
      font-size: 14px;
      color: $--color-primary;
      cursor: pointer;
      .svg-i{
        color: $--color-primary;
      }
    }
    >strong{
      display: block;
      width:100px;
      text-align: right;
      height: 32px;
      line-height: 32px;
      font-weight: normal;
      padding: 0 10px 0 0;
    }
    >span{
      display: block;
      width: 30px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      font-size: 14px;
      cursor: pointer;
      color: #bbb;
    }
    .item-wrap{
      flex:1;
    }
  }
}
.item-form-panel{
  margin: 5px 0;
  em{
    font-style: normal;
    font-weight: normal;
    margin-left: 10px;
    line-height: 32px;
  }
}
.item-form-group.flex-box{
  display: flex;
  .flex-content{
    flex: 1;
  }
}
.item-form{
    padding-right: 30px;
    position: relative;
    &.inline-item.title-color{
      padding-left: 115px;
      &:before{
        display: none;
      }
      >strong{
        width: 105px;
      }
    }
    &.inline-item.other-title{
      padding-left: 115px;
      >strong{
        width: 105px;
      }
    }
    &.other-title+&.other-title{
      >strong{
        &:before{
          display: none;
        }
      }
    }
    &.inline-item.other-td{
      padding-left: 140px;
      >strong{
        width: 130px;
        &:before{
          display: none;
        }
      }
    }
    &.inline-item{
      padding-left: 130px;
      &:before{
        content:'';
        display: block;
        width: 1px;
        background: $border;
        position: absolute;
        top: -5px;
        height: 52px;
        right:0;
      }
      ::v-deep .el-color-picker{
        vertical-align: top;
      }
      >strong{
        display: block;
        position: absolute;
        left:0;
        top:0;
        width: 120px;
        text-align: right;
        font-weight: normal;
        padding: 0 10px;
        height: 42px;
        line-height: 42px;
        &:before,&:after{
          content:'';
          display: block;
          width: 1px;
          background: $border;
          position: absolute;
          top: -5px;
          height: 52px;
        }
        &:before{
          left:0;
        }
        &:after{
          right:0;
        }
      }
    }
    >span{
      display: block;
      width: 30px;
      height: 42px;
      position: absolute;
      right:0;
      top:0;
      text-align: center;
      line-height: 42px;
      font-size: 14px;
      cursor: pointer;
      color: #bbb;
    }
    &:before,
    &:after {
      content: "";
      display: table;
    }
    &:after {
      clear: both;
    }
}
.tag-panel{
    width: 100%;
    overflow: hidden;
    font-size:0;
    .el-button{
        margin-right: 10px;
        margin-bottom: 5px;
        margin-top: 5px;
        vertical-align: top;
    }
    .el-button+.el-button{
      margin-left:0!important;
    }
}
.checkbox-panel{
  .el-checkbox{
    margin: 5px 10px 5px 0!important;
  }
}
.tab-card{
  margin: 5px 0;
}
.btn-back{
  cursor: pointer;
}
.remarks-content{
  p{
    line-height: 2;
    font-size: 14px;
  }
}
.table-icon{
  line-height:0;
  transition: all .3s;
  .svg-i{
    display: inline-block;
    vertical-align: middle;
    margin: 3px;
    cursor: pointer;
    color: #333;
    &.link{
      &:hover{
        color: $--color-primary;
      }
    }
    &.offline{
      color: #909399;
    }
    &.online{
      color: #42d885;
    }
    &.abnormal{
      color: #ff4949;
    }
    &.timeout{
      color: #ffc833;
    }
  }
  .svg-icon{
    width: 20px;
    height: 20px;
  }
  span{
    vertical-align: middle;
    line-height: 24px;
  }
}
</style>