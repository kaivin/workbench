<template>
	<el-dialog :visible.sync="isDialogShow" :before-close="handleClose" width="1000px">
        <el-form ref="ruleForm" :model="form" label-width="100px">
            <el-form-item label="员工" prop="uid">
                <el-select v-model="form.uid" multiple filterable placeholder="请选择">
                    <el-option v-for="item in userList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="类型" prop="type_id">
                <el-select v-model="form.type_id" placeholder="请选择">
                    <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="积分" prop="score">
                <el-input-number v-model="form.score" :min="0" :step="0.1"></el-input-number>
            </el-form-item>
            <el-form-item label="备注" prop="score">
                <el-input v-model="form.remark" placeholder="请输入备注" type="textarea" :rows="2"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">保存</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
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
				form: {
                    uid: [],
                    type_id: "",
                    score: "",
                    remark: ""
				},
                typeList: [],
                userList: [],
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
                $this.typeList = v.typeList;
                $this.isDialogShow = true;
                $this.getUserList();
            },
			submitForm(){
				var $this = this;
                $this.checkForm();
                var formData = {};
                formData.uid = $this.form.uid;
                formData.type_id = $this.form.type_id;
                formData.score = $this.form.score;
                formData.remark = $this.form.remark;
                console.log(formData)
                // $this.$store.dispatch('videocount/seprateUserScore',formData).then(res=>{
                //     if(res.code == 200){
                //         $this.$message({
                //             showClose: true,
                //             message: res.msg,
                //             type: 'success'
                //         });
                //         $this.$emit("saveSuccess");
                //         $this.isDialogShow = false;
                //     }else{
                //         $this.$message({
                //             showClose: true,
                //             message: res.msg,
                //             type: 'error'
                //         });
                //     }
                // });
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
            getUserList(){
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
		width: 140px;
	}
</style>