<template>
    <div class="login-container flex-wrap">
        <div class="loginFr flex-content">
            <div class="loginFrTop">
                <p class="logo"><img class="logo-title" v-bind:src="logo" alt=""></p>
            </div>
            <div class="loginFrMid flex-content">
                <p class="loginFrMidIcon"><img class="logo-Icon" v-bind:src="loginImg" alt=""></p>
                <div class="loginFrMidMain">
                    <h2>欢迎登录</h2>
                    <el-form v-bind:model="loginForm" v-bind:rules="rules" ref="loginForm" class="login-form">                
                        <el-form-item prop="username">
                            <el-input 
                                v-model="loginForm.username" 
                                placeholder="用户名" 
                                clearable
                                ref='username'
                                name='username'
                                @keyup.enter.native="handleLogin('loginForm')"
                            ></el-input>
                        </el-form-item>
                        <el-tooltip v-model="capsTooltip" content="大写锁定已开启" placement="right" manual>
                            <el-form-item prop="password">
                                <el-input 
                                    placeholder="密码" 
                                    v-model="loginForm.password" 
                                    show-password
                                    ref='password'
                                    name='password'
                                    v-on:keyup.native="checkCapslock"
                                    v-on:blur="capsTooltip = false"
                                    @keyup.enter.native="handleLogin('loginForm')"
                                ></el-input>
                            </el-form-item>
                        </el-tooltip>
                        <p class="secret"><i class="svg-i" ><svg-icon icon-class="prompt" /></i>密码仅供本人知晓，不可泄漏和外传</p>
                        <el-form-item style="margin:0">
                            <el-button type="primary" :disabled="isDisabled" v-on:click.prevent="handleLogin('loginForm')">登录</el-button>
                        </el-form-item>
                        <p class="forget"><span v-on:click="resetPwd">忘记密码？</span></p>
                    </el-form>
                </div>
            </div>
            <div class="loginFrFoot" v-if='isTip'>
                 <strong>请注意！</strong>
                 <p>用人单位与劳动者可以在劳动合同中约定保守用人单位的商业秘密和与知识产权相关的保密事项</p>
                 <span class="CloseTip" v-on:click="CloseTip">关闭提示</span>
            </div>
            <el-dialog title="忘记密码" custom-class="add-edit-dialog" :visible.sync="dialogForgetPwdVisible" width="480px">
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
        </div>
    </div>
</template>
<script>
import { validEmail,isEmpty } from '@/utils/validate';
import Cookies from 'js-cookie'
import loginImg from "@/assets/images/loginImg.png";
import logo from "@/assets/logo.png";
const defaultSettings = require('@/settings.js');
export default {
    name:'Login',
    data(){
        const validateUsername = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名'));
            }else{
                callback();
            }
        };
        const validatePassword =  (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            }else{
                callback();
            }
        };
        return{
            websiteName:defaultSettings.title,
            loginImg:loginImg,
            logo:logo,
            loginForm:{
                username:'',
                password:''
            },
            rules: {
                username:[
                    {required: true, trigger: 'blur',validator: validateUsername,}
                ],
                password:[
                    {required: true, trigger: 'blur',validator: validatePassword,}
                ]
            },
            capsTooltip:false,
            redirect: undefined,
            otherQuery: {},
            formLabelWidth:"120px",
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
            isTip:true,
            isLoading:null,
            isDisplay:false,
            isDisabled:false,
        }
    },
    watch: {
        $route: {
            handler: function(route) {
                const query = route.query
                if (query) {
                this.redirect = query.redirect
                this.otherQuery = this.getOtherQuery(query)
                }
            },
            immediate: true
        }
    },
    mounted(){
        var $this = this;
        if(isEmpty($this.loginForm.username)){
            $this.$refs.username.focus();
        }else if(isEmpty($this.loginForm.password)){
             $this.$refs.password.focus();
        }
    },
    created(){
      this.loadingFun();
      this.isLoading.close();
    },
    methods:{
        getModuleList() {
        var $this = this;
        $this.$store
            .dispatch("modulelist/getPermitModuleListAction", null)
            .then((response) => {
            if (response) {
                if (response.status) {
                    $this.$message({
                        showClose: true,
                        message: response.info,
                        type: 'success'
                    });
                } else {
                $this.$message({
                    showClose: true,
                    message: response.info,
                    type: "error",
                });
                }
            }
            });
        },
        // 登录操作
        handleLogin(formName){
            var $this = this;
            var loginFormData = {};
            loginFormData.uname = $this.loginForm.username;
            loginFormData.pwd = $this.loginForm.password;
            $this.$refs[formName].validate(valid => {
                if (valid) {
                    $this.$store.dispatch('login/loginAction', loginFormData).then(response=>{
                        if(response.status==1){
                            $this.$message({
                                showClose: true,
                                message: response.info,
                                type: 'success'
                            });
                            if(response.haschtarget == 1){
                                $this.$router.push({ path: '/welcome?status=1' });
                            }else if(response.hasentarget == 1){
                                $this.$router.push({ path: '/welcome?status=2' });
                            }else{

                                var userInfo = Cookies.get('userInfo');
                                userInfo = JSON.parse(userInfo);
                                if(userInfo.issales==2){
                                    $this.$router.push({ path: $this.redirect || '/Sales/index?Status=personcount' });
                                }else{
                                    if(userInfo.id==533||userInfo.id==1112){
                                        $this.$router.push({ path: $this.redirect || '/stat/cn/targetShow' });
                                    }else{
                                        $this.$router.push({ path: $this.redirect || '/' });
                                    }
                                }

                            }
                            
                        }else if(response.loginnumber==2||response.status==4){
                            if(response.loginnumber){
                                if(response.loginnumber==2){
                                    $this.$message({
                                        showClose: true,
                                        message:'密码错误超过三次，请10分钟后再次登陆',
                                        type: 'error'
                                    });
                                }
                            }else{
                                 if(response.status==4){
                                    $this.$message({
                                        showClose: true,
                                        message: response.info,
                                        type: 'error'
                                    });
                                 }
                            }
                            $this.isDisabled=true;
                        }else{
                            $this.$message({
                                showClose: true,
                                message: response.info,
                                type: 'error'
                            });
                        }
                    });
                } else {
                    return false;
                }
            });
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
        getOtherQuery(query) {
            return Object.keys(query).reduce((acc, cur) => {
                if (cur !== 'redirect') {
                    acc[cur] = query[cur]
                }
                return acc
            }, {})
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
        //关闭提示框
        CloseTip(){
            var $this=this;
            $this.isTip=false;
        },
    }
}
</script>
<style lang="scss" scoped>
</style>
