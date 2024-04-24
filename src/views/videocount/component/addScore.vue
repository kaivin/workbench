<template>
	<el-dialog title="分配积分" :visible.sync="isDialogShow" :before-close="handleClose" width="500px">
        <div class="form_box">
            <el-form ref="ruleForm" :model="form" label-width="50px">
                <el-form-item label="员工" prop="uid">
                    <el-select v-model="form.uid" multiple filterable placeholder="请选择">
                        <el-option v-for="item in userList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <div class="row_col">
                    <div class="row_item">
                        <el-form-item label="类型" prop="type_id">
                            <el-select v-model="form.type_id" placeholder="请选择">
                                <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="row_item">
                        <el-form-item label="积分" prop="score">
                            <el-input-number v-model="form.score" :min="0" :step="0.1"></el-input-number>
                        </el-form-item>
                    </div>
                </div>
                <el-form-item label="备注" prop="score">
                    <el-input v-model="form.remark" placeholder="请输入备注" type="textarea" :rows="2"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <span class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" :class="isSaveData?'isDisabled':''" :disabled="isSaveData" @click="submitForm">保 存</el-button>
            </span>
        </template>
	</el-dialog>
</template>

<script>
    import { mapGetters } from 'vuex';
    import scFormTable from './scTable';
	export default {
		name: 'addScore',
        components: {
          scFormTable
        },
		data(){
			return {
                isDialogShow: false,
                isSaveData: false,
				form: {
                    uid: [],
                    type_id: "",
                    score: "",
                    remark: ""
				},
                typeList: [],
                userList: [],
                isGetType: false,
                isGetUser: false
			}
		},
        computed: {
            ...mapGetters([
                'sidebar',
                'menuData',
                'userInfo',
            ]),
        },
		methods: {
            showDialog(v) {
                var $this = this;
                $this.isDialogShow = true;
                if(!$this.isGetUser){
                    if(v.type == "edit"){
                        $this.getUserList(v.data.uid);
                    }else{
                        $this.getUserList(); 
                    }
                }else{
                    if(v.type == "edit"){
                        $this.form.uid = v.data.uid;
                    }
                }
                if(!$this.isGetType){
                    if(v.type == "edit"){
                        $this.getTypeList(v.data.type_id);
                    }else{
                        $this.getTypeList();
                    }
                }else{
                    if(v.type == "edit"){
                        $this.form.type_id = v.data.type_id;
                    }
                }
                if(v.type == 'edit'){
                    $this.form.score = v.data.score;
                    $this.form.remark = v.data.remark;
                }
            },
			submitForm(){
				var $this = this;
                if(!$this.checkForm()){
                    return false;
                }
                var formData = {};
                formData.uid = $this.form.uid;
                formData.type_id = $this.form.type_id;
                formData.score = $this.form.score;
                formData.remark = $this.form.remark;
                $this.isSaveData = true;
                $this.$store.dispatch('videocount/seprateUserScore',formData).then(res=>{
                    if(res.code == 200){
                        $this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'success'
                        });
                        $this.resetForm();
                        $this.isSaveData = false;
                        $this.$emit("saveSuccess");
                        $this.isDialogShow = false;
                    }else{
                        $this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'error'
                        });
                    }
                });
			},
            checkForm(){
                var $this = this;
                if($this.form.uid.length == 0){
                    $this.$message({
                        showClose: true,
                        message: "请选择要分配的人员",
                        type: 'error'
                    });
                    return false
                }
                if(!$this.form.type_id){
                    $this.$message({
                        showClose: true,
                        message: "请选择工作类型",
                        type: 'error'
                    });
                    return false
                }
                if(!$this.form.score){
                    $this.$message({
                        showClose: true,
                        message: "请添加积分",
                        type: 'error'
                    });
                    return false
                }
                return true;
            },
			resetForm(){
				var $this = this;
                $this.form.uid = [];
                $this.form.type_id = "";
                $this.form.score = "";
                $this.form.remark = "";
			},
            handleClose(){
                var $this = this;
                $this.resetForm();
                $this.isDialogShow = false;
            },
            getUserList(uid){
                var $this = this;
                $this.$store.dispatch('videocount/userListData',null).then(res=>{
                    if(res.code == 200){
                        var resData = [];
                        if(res.data && res.data.length > 0){
                            res.data.forEach(item => {
                                var obj = {};
                                obj.label = item.name;
                                obj.value = item.id;
                                resData.push(obj);
                            })
                        }
                        $this.userList = resData;
                        $this.isGetUser = true;
                        if(uid && uid.length > 0){
                            $this.form.uid = uid;
                        }
                    }else{
                        $this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'error'
                        });
                    }
                });
            },
            // 获取工作类型
            getTypeList(typeid){
                var $this = this;
                $this.$store.dispatch('videocount/getVideoTypeData',null).then(res=>{
                    if(res.code == 200){
                        var resData = [];
                        if(res.data && res.data.length > 0){
                            res.data.forEach(item => {
                                var obj = {};
                                obj.label = item.name;
                                obj.value = item.id;
                                obj.disabled = false;
                                resData.push(obj);
                            })
                        }
                        $this.typeList = resData;
                        $this.isGetType = true;
                        if(typeid){
                            $this.form.type_id = typeid;
                        }
                    }else{
                        $this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'error'
                        });
                    }
                });
            },
		}
	}
</script>
<style lang="scss" scoped>
	.el-input-number{
		width: 100%;
	}
    .form_box{
        padding-right: 10px;
    }
    .el-select{
        width: 100%;
    }
    .row_col{
        &:after{
            content: "";
            display: block;
            clear: both;
        }
        .row_item{
            width: 46%;
            float: left;
        }
        .row_item+.row_item{
            float: right;
        }
    }
</style>