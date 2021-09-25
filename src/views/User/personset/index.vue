<template>
  <div class="page-root scroll-panel user-center" ref="boxPane">
    <table class="table-panel">
        <tr>
            <th colspan="2">基本信息</th>
        </tr>
        <tr>
            <td style="min-width: 100px;width: 100px;"><span>姓名：</span></td>
            <td>{{userData.name}}</td>
        </tr>
        <tr v-if="userData.workname&&userData.workname!=''">
            <td><span>职位：</span></td>
            <td>{{userData.workname}}</td>
        </tr>
        <tr v-if="userData.postionname&&userData.postionname!=''">
            <td><span>职称：</span></td>
            <td>{{userData.postionname}}</td>
        </tr>
        <tr v-if="userData.depart&&userData.depart!=''">
            <td><span>部门：</span></td>
            <td>{{userData.depart}}</td>
        </tr>
        <tr>
            <td><span>用户名：</span></td>
            <td>{{userData.username}}<el-button style="margin-left: 15px;" type="primary" size="mini" icon="el-icon-edit" v-on:click="editName" v-if="(menuButtonPermit.includes('User_personuser'))&&device==='desktop'">修改用户名</el-button></td>
        </tr>
        <tr v-if="device==='desktop'">
            <td><span>密码：</span></td>
            <td><el-button type="primary" size="mini" icon="el-icon-edit" v-on:click="editPwd" v-if="menuButtonPermit.includes('User_personpwd')">修改密码</el-button><el-button style="margin-left: 15px;" type="primary" size="mini" icon="el-icon-edit" v-on:click="resetPwd">忘记密码</el-button></td>
        </tr>
        <tr>
            <th colspan="2">联系方式<el-button style="margin-left: 15px;" type="primary" size="mini" icon="el-icon-edit" v-on:click="editPhone" v-if="(menuButtonPermit.includes('User_personset'))&&device==='desktop'">修改联系方式</el-button></th>
        </tr>
        <tr>
            <td><span>手机号：</span></td>
            <td>{{userData.phone}}</td>
          </tr>
        <tr>
            <td><span>邮箱：</span></td>
            <td>{{userData.email}}</td>
          </tr>
    </table>
    <el-dialog title="修改用户名" v-if="(menuButtonPermit.includes('User_personuser'))&&device==='desktop'" custom-class="add-edit-dialog" :visible.sync="dialogNameVisible" width="480px">
      <el-form :model="dialogNameForm">
          <el-form-item label="原用户名：" :label-width="formLabelWidth">
            <el-input v-model="dialogNameForm.username" ref="username"></el-input>
          </el-form-item>
          <el-form-item label="新用户名：" :label-width="formLabelWidth">
            <el-input v-model="dialogNameForm.username1" ref="username1"></el-input>
          </el-form-item>
          <el-form-item label="确认新用户名：" :label-width="formLabelWidth">
            <el-input v-model="dialogNameForm.username2" ref="username2"></el-input>
          </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogNameVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveNameData">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="修改密码" v-if="(menuButtonPermit.includes('User_personpwd'))&&device==='desktop'" custom-class="add-edit-dialog" :visible.sync="dialogPwdVisible" width="480px">
      <el-form :model="dialogPwdForm">
          <el-tooltip v-model="capsTooltip" content="大写锁定已开启" placement="right" manual>
            <el-form-item label="原密码：" :label-width="formLabelWidth">
                <el-input type="password" v-model="dialogPwdForm.password"  v-on:keyup.native="checkCapslock"
                        v-on:blur="capsTooltip = false" ref="password" show-password></el-input>
            </el-form-item>
          </el-tooltip>
          <el-tooltip v-model="capsTooltip1" content="大写锁定已开启" placement="right" manual>
            <el-form-item label="新密码：" :label-width="formLabelWidth">
                <el-input type="password" v-model="dialogPwdForm.newpassword"  v-on:keyup.native="checkCapslock1"
                        v-on:blur="capsTooltip1 = false" ref="newpassword" show-password></el-input>
            </el-form-item>
          </el-tooltip>
          <el-tooltip v-model="capsTooltip2" content="大写锁定已开启" placement="right" manual>
            <el-form-item label="确认新密码：" :label-width="formLabelWidth">
                <el-input type="password" v-model="dialogPwdForm.newpassword1"  v-on:keyup.native="checkCapslock2"
                        v-on:blur="capsTooltip2 = false" ref="newpassword1" show-password></el-input>
            </el-form-item>
          </el-tooltip>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogPwdVisible = false">取 消</el-button>
          <el-button type="primary" @click="savePwdData">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="忘记密码" v-if="device==='desktop'" custom-class="add-edit-dialog" :visible.sync="dialogForgetPwdVisible" width="480px">
      <el-form :model="dialogForgetPwdForm">
          <el-form-item label="用户名：" :label-width="formLabelWidth">
            <el-input v-model="dialogForgetPwdForm.username" ref="username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" :label-width="formLabelWidth">
            <el-input v-model="dialogForgetPwdForm.email" ref="email"></el-input>
          </el-form-item>
          <div class="item-form">
              <el-form-item label="验证码：" :label-width="formLabelWidth">
                    <el-input v-model="dialogForgetPwdForm.code" ref="code"></el-input>
                </el-form-item>
                <el-button class="btn-code" :type="isSend?'info':'primary'" v-bind:disabled="isSend" @click="getCode">{{txtCode}}</el-button>
          </div>
          <el-tooltip v-model="capsTooltip1" content="大写锁定已开启" placement="right" manual>
            <el-form-item label="新密码：" :label-width="formLabelWidth">
                <el-input type="password" 
                    v-model="dialogForgetPwdForm.newpassword" 
                    v-on:keyup.native="checkCapslock1"
                    v-on:blur="capsTooltip1 = false" ref="newpassword" show-password></el-input>
            </el-form-item>
          </el-tooltip>
          <el-tooltip v-model="capsTooltip2" content="大写锁定已开启" placement="right" manual>
          <el-form-item label="确认新密码：" :label-width="formLabelWidth">
            <el-input type="password" v-model="dialogForgetPwdForm.newpassword1"  v-on:keyup.native="checkCapslock2"
                    v-on:blur="capsTooltip2 = false" ref="newpassword1" show-password></el-input>
          </el-form-item>
          </el-tooltip>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogForgetPwdVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveForgetPwdData">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="修改联系方式" v-if="(menuButtonPermit.includes('User_personset'))&&device==='desktop'" custom-class="add-edit-dialog" :visible.sync="dialogPhoneVisible" width="480px">
      <el-form :model="dialogPhoneForm">
          <el-form-item label="手机号：" :label-width="formLabelWidth">
            <el-input v-model="dialogPhoneForm.phone" ref="phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" :label-width="formLabelWidth">
            <el-input v-model="dialogPhoneForm.email" ref="email"></el-input>
          </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogPhoneVisible = false">取 消</el-button>
          <el-button type="primary" @click="savePhoneData">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { validEmail,validPhone } from '@/utils/validate';
import Cookies from 'js-cookie'
import { mapGetters } from 'vuex'
export default {
  name: 'userPersonset',
  data() {
    return {
        menuButtonPermit:[],
        userData:{},
        formLabelWidth:"110px",
        dialogNameVisible:false,
        dialogNameForm:{
          id:0,
          username:"",
          username1:"",
          username2:""
        },
        dialogPwdVisible:false,
        dialogPwdForm:{
          password:"",
          newpassword:"",
          newpassword1:"",
        },
        dialogPhoneVisible:false,
        dialogPhoneForm:{
          id:0,
          phone:"",
          email:"",
        },
        dialogForgetPwdVisible:false,
        dialogForgetPwdForm:{
          username:"",
          email:"",
          code:"",
          newpassword:"",
          newpassword1:"",
        },
        txtCode:"获取验证码",
        isSend: false,
        timer:null,
        seconds:60,
        capsTooltip1:false,
        capsTooltip2:false,
        capsTooltip:false,
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'device'
    ]),
  },
  created(){
    var $this = this;
    $this.initData();
  },
  methods:{
    // 获取用户初始化数据
    initData(){
        var $this = this;
        $this.getUserMenuButtonPermit();
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.$store.dispatch('api/userInfoAction', {id:$this.userInfo.id}).then(response=>{
          if(response){
            if(response.status){
                $this.userData = response.data;
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
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.status){
          if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.menuButtonPermit.includes('User_personset')){
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
        }else{
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'error'
          });
        }
      });
    },
    // 修改用户名
    editName(){
      this.dialogNameVisible = true;
      this.resetNameFormData();
      this.dialogNameForm.id = this.userData.id;
      this.dialogNameForm.username = this.userData.username;
    },
    // 保存用户名修改
    saveNameData(){
      var $this = this;
      if(!$this.validationNameForm()){
        return false;
      }
      var formData = {};
      formData.username = $this.dialogNameForm.username;
      formData.newusername = $this.dialogNameForm.username1;
      formData.id = $this.dialogNameForm.id;
      $this.$store.dispatch('user/userNameEditAction', formData).then(response=>{
        if(response.status){
            $this.$message({
                showClose: true,
                message: response.info,
                type: 'success'
            });
            $this.dialogNameVisible = false;
            $this.initData();
        }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
        }
    });
    },
    // 重置用户名修改表单
    resetNameFormData(){
      var $this = this;
      $this.dialogNameForm.id = 0;
      $this.dialogNameForm.username = "";
      $this.dialogNameForm.username1 = "";
      $this.dialogNameForm.username2 = "";
    },
    // 验证用户名修改合法性
    validationNameForm(){
      var $this = this;
      if($this.dialogNameForm.username == ""){
        $this.$message({
            showClose: true,
            message: '错误：原用户名不能为空！',
            type: 'error'
        });
        $this.$refs['username'].focus();
        return false;
      }
      if($this.dialogNameForm.username !== $this.userData.username){
        $this.$message({
            showClose: true,
            message: '错误：原用户名不正确！',
            type: 'error'
        });
        $this.$refs['username'].focus();
        return false;
      }
      if(!$this.checkeUsername($this.dialogNameForm.username)){
        $this.$message({
            showClose: true,
            message: '错误：用户名格式错误！',
            type: 'error'
        });
        $this.$refs['username'].focus();
        return false;
      }
      if($this.dialogNameForm.username1 == ""){
        $this.$message({
            showClose: true,
            message: '错误：新用户名不能为空！',
            type: 'error'
        });
        $this.$refs['username1'].focus();
        return false;
      }
      if(!$this.checkeUsername($this.dialogNameForm.username1)){
        $this.$message({
            showClose: true,
            message: '错误：新用户名格式错误！',
            type: 'error'
        });
        $this.$refs['username1'].focus();
        return false;
      }
      if($this.dialogNameForm.username2 == ""){
        $this.$message({
            showClose: true,
            message: '错误：请确认新用户名！',
            type: 'error'
        });
        $this.$refs['username2'].focus();
        return false;
      }
      if(!$this.checkeUsername($this.dialogNameForm.username2)){
        $this.$message({
            showClose: true,
            message: '错误：确认新用户名格式错误！',
            type: 'error'
        });
        $this.$refs['username2'].focus();
        return false;
      }
      if($this.dialogNameForm.username1 !== $this.dialogNameForm.username2){
        $this.$message({
            showClose: true,
            message: '错误：两次输入的用户名不一样！',
            type: 'error'
        });
        $this.$refs['username2'].focus();
        return false;
      }
      return true;
    },
    // 修改密码
    editPwd(){
      this.dialogPwdVisible = true;
      this.resetPwdFormData();
    },
    // 保存密码修改
    savePwdData(){
      var $this = this;
      if(!$this.validationPwdForm()){
        return false;
      }
      var formData = {};
      formData.password = $this.dialogPwdForm.password;
      formData.newpassword = $this.dialogPwdForm.newpassword;
      $this.$store.dispatch('user/pwdEditAction', formData).then(response=>{
        if(response.status){
            $this.$message({
                showClose: true,
                message: response.info,
                type: 'success'
            });
            $this.dialogPwdVisible = false;
            $this.initData();
        }else{
            $this.$message({
            showClose: true,
            message: response.info,
            type: 'error'
            });
        }
    });
    },
    // 重置密码修改表单
    resetPwdFormData(){
      var $this = this;
      $this.dialogPwdForm.password = "";
      $this.dialogPwdForm.newpassword = "";
      $this.dialogPwdForm.newpassword1 = "";
    },
    // 验证密码修改合法性
    validationPwdForm(){
      var $this = this;
      if($this.dialogPwdForm.password == ""){
        $this.$message({
            showClose: true,
            message: '错误：原密码不能为空！',
            type: 'error'
        });
        $this.$refs['password'].focus();
        return false;
      }
      if(!$this.checkePassword($this.dialogPwdForm.password)){
        $this.$message({
            showClose: true,
            message: '错误：原密码格式错误！',
            type: 'error'
        });
        $this.$refs['password'].focus();
        return false;
      }
      if($this.dialogPwdForm.newpassword == ""){
        $this.$message({
            showClose: true,
            message: '错误：新密码不能为空！',
            type: 'error'
        });
        $this.$refs['newpassword'].focus();
        return false;
      }
      if(!$this.checkePassword($this.dialogPwdForm.newpassword)){
        $this.$message({
            showClose: true,
            message: '错误：新密码格式错误！',
            type: 'error'
        });
        $this.$refs['newpassword'].focus();
        return false;
      }
      if($this.dialogPwdForm.newpassword1 == ""){
        $this.$message({
            showClose: true,
            message: '错误：请确认新密码！',
            type: 'error'
        });
        $this.$refs['newpassword1'].focus();
        return false;
      }
      if(!$this.checkePassword($this.dialogPwdForm.newpassword1)){
        $this.$message({
            showClose: true,
            message: '错误：确认新密码格式错误！',
            type: 'error'
        });
        $this.$refs['newpassword1'].focus();
        return false;
      }
      if($this.dialogPwdForm.newpassword !== $this.dialogPwdForm.newpassword1){
        $this.$message({
            showClose: true,
            message: '错误：两次输入的新密码不一样！',
            type: 'error'
        });
        $this.$refs['newpassword1'].focus();
        return false;
      }
      return true;
    },
    
    // 修改联系方式
    editPhone(){
      this.dialogPhoneVisible = true;
      this.resetPhoneFormData();
      this.dialogPhoneForm.id = this.userData.id;
      this.dialogPhoneForm.phone = this.userData.phone;
      this.dialogPhoneForm.email = this.userData.email;
    },
    // 保存联系方式修改
    savePhoneData(){
      var $this = this;
      if(!$this.validationPhoneForm()){
        return false;
      }
      var formData = {};
      formData.id = $this.dialogPhoneForm.id;
      formData.phone = $this.dialogPhoneForm.phone;
      formData.email = $this.dialogPhoneForm.email;
      $this.$store.dispatch('user/contactEditAction', formData).then(response=>{
        if(response.status){
            $this.$message({
                showClose: true,
                message: response.info,
                type: 'success'
            });
            var userInfo = Cookies.get('userInfo');      
            userInfo = JSON.parse(userInfo);
            userInfo.phone=$this.dialogPhoneForm.phone;
            userInfo.email=$this.dialogPhoneForm.email;
            userInfo = JSON.stringify(userInfo);
            Cookies.set('userInfo', userInfo);
            $this.dialogPhoneVisible = false;            
            $this.initData();
        }else{
            $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
            });
        }
    });
    },
    // 重置联系方式修改表单
    resetPhoneFormData(){
      var $this = this;
      $this.dialogPhoneForm.id = 0;
      $this.dialogPhoneForm.phone = "";
      $this.dialogPhoneForm.email = "";
    },
    // 验证联系方式修改合法性
    validationPhoneForm(){
      var $this = this;
      if($this.dialogPhoneForm.phone == ""){
        $this.$message({
            showClose: true,
            message: '错误：手机号不能为空！',
            type: 'error'
        });
        $this.$refs['phone'].focus();
        return false;
      }
      if(!validPhone($this.dialogPhoneForm.phone)){
        $this.$message({
            showClose: true,
            message: '错误：手机号格式不正确！',
            type: 'error'
        });
        $this.$refs['phone'].focus();
        return false;
      }
      if($this.dialogPhoneForm.email == ""){
        $this.$message({
            showClose: true,
            message: '错误：邮箱不能为空！',
            type: 'error'
        });
        $this.$refs['email'].focus();
        return false;
      }
      if(!validEmail($this.dialogPhoneForm.email)){
        $this.$message({
            showClose: true,
            message: '错误：邮箱格式不正确！',
            type: 'error'
        });
        $this.$refs['email'].focus();
        return false;
      }
      return true;
    },

    // 忘记密码重置密码
    resetPwd(){
      this.dialogForgetPwdVisible = true;
      this.resetForgetPwdFormData();
    },
    // 保存密码修改(忘记密码)
    saveForgetPwdData(){
      var $this = this;
      if(!$this.validationForgetPwdForm()){
        return false;
      }
      var formData = {};
      formData.username = $this.dialogForgetPwdForm.username;
      formData.email = $this.dialogForgetPwdForm.email;
      formData.code = $this.dialogForgetPwdForm.code;
      formData.newpassword = $this.dialogForgetPwdForm.newpassword;
      $this.$store.dispatch('login/userForgetPwdAction', formData).then(response=>{
        if(response.status){
            $this.$message({
                showClose: true,
                message: response.info,
                type: 'success'
            });
            $this.dialogForgetPwdVisible = false;
            $this.initData();
        }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
        }
    });
    },
    // 重置忘记密码修改表单
    resetForgetPwdFormData(){
      var $this = this;
      $this.dialogForgetPwdForm.username = "";
      $this.dialogForgetPwdForm.email = "";
      $this.dialogForgetPwdForm.code = "";
      $this.dialogForgetPwdForm.newpassword = "";
      $this.dialogForgetPwdForm.newpassword1 = "";
    },
    // 验证忘记密码修改合法性
    validationForgetPwdForm(){
      var $this = this;
      if($this.dialogForgetPwdForm.username == ""){
        $this.$message({
            showClose: true,
            message: '错误：用户名不能为空！',
            type: 'error'
        });
        $this.$refs['username'].focus();
        return false;
      }
      if(!$this.checkeUsername($this.dialogForgetPwdForm.username)){
        $this.$message({
            showClose: true,
            message: '错误：用户名格式错误！',
            type: 'error'
        });
        $this.$refs['username'].focus();
        return false;
      }
      if($this.dialogForgetPwdForm.email == ""){
        $this.$message({
            showClose: true,
            message: '错误：邮箱不能为空！',
            type: 'error'
        });
        $this.$refs['email'].focus();
        return false;
      }
      if(!validEmail($this.dialogForgetPwdForm.email)){
        $this.$message({
            showClose: true,
            message: '错误：邮箱格式不正确！',
            type: 'error'
        });
        $this.$refs['email'].focus();
        return false;
      }
      if($this.dialogForgetPwdForm.code == ""){
        $this.$message({
            showClose: true,
            message: '错误：验证码不能为空！',
            type: 'error'
        });
        $this.$refs['code'].focus();
        return false;
      }
      if($this.dialogForgetPwdForm.newpassword == ""){
        $this.$message({
            showClose: true,
            message: '错误：新密码不能为空！',
            type: 'error'
        });
        $this.$refs['newpassword'].focus();
        return false;
      }
      if(!$this.checkePassword($this.dialogForgetPwdForm.newpassword)){
        $this.$message({
            showClose: true,
            message: '错误：新密码格式错误！',
            type: 'error'
        });
        $this.$refs['newpassword'].focus();
        return false;
      }
      if($this.dialogForgetPwdForm.newpassword1 == ""){
        $this.$message({
            showClose: true,
            message: '错误：请确认新密码！',
            type: 'error'
        });
        $this.$refs['newpassword1'].focus();
        return false;
      }
      if(!$this.checkePassword($this.dialogForgetPwdForm.newpassword1)){
        $this.$message({
            showClose: true,
            message: '错误：确认新密码格式错误！',
            type: 'error'
        });
        $this.$refs['newpassword1'].focus();
        return false;
      }
      if($this.dialogForgetPwdForm.newpassword !== $this.dialogForgetPwdForm.newpassword1){
        $this.$message({
            showClose: true,
            message: '错误：两次输入的新密码不一样！',
            type: 'error'
        });
        $this.$refs['newpassword1'].focus();
        return false;
      }
      return true;
    },
    // 获取验证码
    getCode(){
        var $this = this;
        if($this.dialogForgetPwdForm.username == ""){
            $this.$message({
                showClose: true,
                message: '错误：用户名不能为空！',
                type: 'error'
            });
            $this.$refs['username'].focus();
            return false;
        }
        if($this.dialogForgetPwdForm.email == ""){
            $this.$message({
                showClose: true,
                message: '错误：邮箱不能为空！',
                type: 'error'
            });
            $this.$refs['email'].focus();
            return false;
        }
        var formData = {};
        formData.username = $this.dialogForgetPwdForm.username;
        formData.email = $this.dialogForgetPwdForm.email;
        $this.$store.dispatch('login/userGetCodeAction', formData).then(response=>{
            if(response.status){
                var txt = "验证码已发送到邮箱："+$this.dialogForgetPwdForm.email+"，您可以前往邮箱获取验证码";
                $this.$alert(txt,"提示",{
                    confirmButtonText: '确定',
                });
                $this.isSend = true;
                $this.timer = setInterval(function(){
                    if($this.seconds==0){
                        clearInterval($this.timer);
                        $this.seconds = 60;
                        $this.isSend = false;
                        $this.txtCode = "获取验证码";
                    }else{
                        $this.seconds--;
                        $this.txtCode = $this.seconds+"s";
                    }
                },1000);
            }else{
                $this.$message({
                    showClose: true,
                    message: response.info,
                    type: 'error'
                });
            }
        });
    },
    // 验证大写是否开启
    checkCapslock(e) {
        const { key } = e
        this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    // 验证大写是否开启
    checkCapslock1(e) {
        const { key } = e
        this.capsTooltip1 = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    // 验证大写是否开启
    checkCapslock2(e) {
        const { key } = e
        this.capsTooltip2 = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    // 验证用户名是否由3-10位的字母、数字和下划线组成
    checkeUsername(username){
        var str=username;
        //在JavaScript中，正则表达式只能使用"/"开头和结束，不能使用双引号
        var Expression=/^(\w){3,20}$/; 
        var objExp=new RegExp(Expression);          //创建正则表达式对象
        if(objExp.test(str)==true){                   //通过正则表达式验证
            return true;
        }else{
            return false;
        }
    },
    // 验证密码是否由6-20位的字母、数字、下划线和点“.”组成，并且只能以英文字符做开头
    checkePassword(password){
        var str=password;
        //在JavaScript中，正则表达式只能使用"/"开头和结束，不能使用双引号
        //var Expression=/^[A-Za-z]{1}([A-Za-z0-9]|[._]){5,19}$/; 
        var Expression=/([A-Za-z0-9]|[._]){6,32}$/; 
        var objExp=new RegExp(Expression);          //创建正则表达式对象
        if(objExp.test(str)==true){                   //通过正则表达式验证
            return true;
        }else{
            return false;
        }
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
