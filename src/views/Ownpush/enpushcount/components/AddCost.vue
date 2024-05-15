<template>
    <el-dialog :title="dialogText" custom-class="add-edit-dialog" :before-close="handleClose" :visible.sync="dialogFormVisible" width="480px">
        <el-form :model="dialogForm">
            <div class="item-form">
                <el-form-item label="总预算金额：" :label-width="formLabelWidth">
                    <el-input v-model="dialogForm.number" ref="number"></el-input>
                </el-form-item>
            </div>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" :class="isSaveData?'isDisabled':''" :disabled="isSaveData" @click="saveData">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: "AddCost",
    data() {
        return {
            dialogFormVisible:false,
            dialogText:"",
            formLabelWidth:"120px",
            dialogForm:{
                number:"",
            },
            isSaveData:false,
        };
    },
    computed: {
        ...mapGetters([
            'addEnPushCost'
        ]),
        isAdd() {
            return this.addEnPushCost
        },
    },
    watch: {
        isAdd(e){
            if(e){
                this.setEnPushCostData();
            }
        },
    },
    methods:{
        // 关闭弹窗
        handleClose(){
            var $this = this;
            $this.dialogFormVisible = false;
            $this.$store.dispatch('app/closeEnPushCost');
        },
        // 设置总消费数据
        setEnPushCostData(){
            var $this = this;
            $this.dialogFormVisible = true;
            $this.dialogText = "设置总预算金额";
            $this.resetFormData();
        },
        // 保存添加/编辑数据
        saveData(){
            var $this = this;
            if(!$this.isSaveData){
                if(!$this.validationForm()){
                    return false;
                }
                $this.isSaveData=true;
                var pathUrl = "";
                if($this.dialogText=="编辑渠道"){
                    pathUrl = "ownpush/cnChannelEditAction";
                }else{
                    pathUrl = "ownpush/cnChannelAddAction";
                }
                $this.$store.dispatch(pathUrl, $this.dialogForm).then(response=>{
                    if(response.status){
                        $this.$message({
                            showClose: true,
                            message: response.info,
                            type: 'success'
                        });
                        $this.handleClose();
                        $this.$emit('costCountChange');
                    }else{
                        $this.$message({
                            showClose: true,
                            message: response.info,
                            type: 'error'
                        });
                        setTimeout(()=>{
                            $this.isSaveData=false;
                        },1000);
                    }
                });
            }
        },
        // 重置添加数据表单
        resetFormData(){
            var $this = this;
            $this.dialogForm.number = '';
        },
        // 验证是否为空
        validationForm(){
            var $this = this;
            if($this.dialogForm.name == ""){
            $this.$message({
                showClose: true,
                message: '错误：渠道名称不能为空！',
                type: 'error'
            });
            $this.$refs['name'].focus();
            return false;
            }
            return true;
        },
    }
};
</script>

<style>
</style>