<template>
    <div class="login-container">
        <Particles />
        <el-form v-bind:model="loginForm" v-bind:rules="rules" ref="loginForm" class="login-form">
            <div class="login-title"><img class="logo-img" v-bind:src="logo" alt=""> <span>{{websiteName}}</span></div>
            <el-form-item prop="username">
                <el-input 
                    v-model="loginForm.username" 
                    placeholder="用户名" 
                    clearable
                    ref='username'
                    name='username'
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
                        v-on:keyup.enter="handleLogin('loginForm')"
                    ></el-input>
                </el-form-item>
            </el-tooltip>
            <el-form-item>
                <el-button type="primary" v-on:click.prevent="handleLogin('loginForm')">登录</el-button>
            </el-form-item>
            <p v-if="device==='desktop'"><span v-on:click="resetPwd">忘记密码？</span></p>
        </el-form>
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
    </div>
</template>
<script>
import Particles from '@/components/Particles/index.vue';
import { validEmail,isEmpty } from '@/utils/validate';
import { mapGetters } from 'vuex'
import logo from "@/assets/logo.png";
const defaultSettings = require('@/settings.js');
export default {
    name:'Login',
    components: {
        Particles
    },
    data(){
        const validateUsername = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名'));
            }else if(!this.checkeUsername(this.loginForm.username)){
                callback(new Error('用户名格式错误'));
            }else{
                callback();
            }
        };
        const validatePassword =  (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            }else if(!this.checkePassword(this.loginForm.password)){
                callback(new Error('密码格式错误'));
            }else{
                callback();
            }
        };
        return{
            websiteName:defaultSettings.title,
            logo: logo,
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
            formLabelWidth:"110px",
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
        }
    },
    computed: {
        ...mapGetters([
        'device'
        ]),
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
    methods:{
        // 登录操作
        handleLogin(formName){
            var $this = this;
            var loginFormData = {};
            loginFormData.uname = $this.loginForm.username;
            loginFormData.pwd = $this.loginForm.password;
            $this.$refs[formName].validate(valid => {
                if (valid) {
                    $this.$store.dispatch('login/loginAction', loginFormData).then(response=>{
                        if(response.status){
                            $this.$message({
                                showClose: true,
                                message: response.info,
                                type: 'success'
                            });
                            $this.$router.push({ path: $this.redirect || '/' });
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
    }
}
</script>
<style lang="scss" scoped>
.login-container{
    width:100%;
    height:100%;
    overflow: hidden;
    position: relative;
}
.add-edit-dialog{
    .el-form{
        padding-right: 20px;
    }
    .item-form{
        position: relative;
        padding-right: 130px;
        .btn-code{
            position: absolute;
            right:0;
            top:0;
            width: 112px;
        }
    }
}
.login-form{
    position: absolute;
    width:280px;
    text-align:center;
    left:50%;
    top:50%;
    margin-left:-140px;
    transform: translateY(-50%);
    >p{
        width: 100%;
        height: 20px;
        text-align: right;
        color: #fff;
        margin: -12px 0 0;
        span{
            font-size: 14px;
            line-height: 20px;
            cursor: pointer;
            opacity: .7;
            transition: all .3s;
            &:hover{
                opacity: 1;
            }
        }
    }
    .login-title{
        width:100%;
        text-align: center;
        line-height: 0;
        font-size:0;
        margin-bottom:20px;
        .logo-img{
            display: inline-block;
            height:48px;
            vertical-align: middle;
            margin-right: 20px;
        }
        span{
            display: inline-block;
            height:48px;
            line-height: 48px;
            font-size:24px;
            color: $--color-primary;
            vertical-align: middle;
        }
    }
    ::v-deep .el-input{
        input.el-input__inner{
            width:100%;
            height:50px;
            line-height:50px;
            background:#2d2d2d;
            background:rgba(45,45,45,.15);
            border-radius:6px;
            border:1px solid #3d3d3d;
            border:1px solid rgba(255,255,255,.15);
            box-shadow:0 2px 3px 0 rgba(0,0,0,.1) inset;
            font-size:14px;
            color:#fff;
            text-shadow:0 1px 2px rgba(0,0,0,.1);
            transition:all .2s;
        }
        ::v-deep input:-moz-placeholder{color:#fff}
        ::v-deep input:-ms-input-placeholder{color:#fff}
        ::v-deep input::-webkit-input-placeholder{color:#fff}
        ::v-deep input:focus{
            outline:0;
            box-shadow:0 2px 3px 0 rgba(0,0,0,.1) inset,0 2px 7px 0 rgba(0,0,0,.2)
        }
    }
    button.el-button{
        cursor:pointer;
        width:100%;
        height:48px;
        padding:0;
        border-radius:6px;
        border:0;
        box-shadow:0 15px 30px 0 rgba(255,255,255,.25) inset,0 2px 7px 0 rgba(0,0,0,.2);
        font-size:14px;
        font-weight:700;
        color:#fff;
        text-shadow:0 1px 2px rgba(0,0,0,.1);
        transition:all .2s;
    }
    button.el-button:hover{
        box-shadow:0 15px 30px 0 rgba(255,255,255,.15) inset,0 2px 7px 0 rgba(0,0,0,.2)
    }
    button.el-button:active{
        box-shadow:0 5px 8px 0 rgba(0,0,0,.1) inset,0 1px 4px 0 rgba(0,0,0,.1);
        border:0;
    }
}
</style>
