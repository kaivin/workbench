<template>
	<el-dialog title="添加设备相关广告数据" :visible.sync="isDialogShow" :before-close="handleClose" width="500px">
        <div class="form_box">
            <el-form ref="ruleForm" :model="form" label-width="80px">
                <el-form-item label="日期">
                    <el-select v-model="form.ads_time" placeholder="请选择日期" clearable>
                        <el-option v-for="item in timeList" :key="item.ads_time" :label="item.ads_time" :value="item.ads_time"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设备">
                    <el-select v-model="form.ads_device" placeholder="请选择设备">
                        <el-option v-for="item in deviceList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="点击次数">
                    <el-input-number v-model="form.clicknumber" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="费用">
                    <el-input-number v-model="form.price" :min="0"></el-input-number>
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
	export default {
		name: 'AddUrl',
		data(){
			return {
                isDialogShow: false,
                isSaveData: false,
				form: {
                    clicknumber: 0,
                    ads_time: "",
                    price: 0,
                    ads_device: ""
				},
                timeList: [],
                deviceList:[
                    {label: "PC", value: 1},
                    {label: "移动", value: 2},
                    {label: "未知", value: 3},
                ]
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
                $this.timeList = v.timeList;
            },
			submitForm(){
				var $this = this;
                if(!$this.checkForm()){
                    return false;
                }
                var formData = {};
                formData.clicknumber = $this.form.clicknumber;
                formData.ads_time = $this.form.ads_time;
                formData.price = $this.form.price;
                formData.ads_device = $this.form.ads_device;
                $this.isSaveData = true;
                $this.$store.dispatch('depfive/depfiveUrlAction',formData).then(res=>{
                    if(res.status){
                        $this.$message({
                            showClose: true,
                            message: res.info,
                            type: 'success'
                        });
                        $this.isSaveData = false;
                        $this.handleClose();
                        $this.$emit("saveSuccess");
                    }else{
                        $this.$message({
                            showClose: true,
                            message: res.info,
                            type: 'error'
                        });
                    }
                });
			},
            checkForm(){
                var $this = this;
                if(!$this.form.ads_time){
                    $this.$message({
                        showClose: true,
                        message: "请选择日期",
                        type: 'error'
                    });
                    return false
                }
                if(!$this.form.ads_device){
                    $this.$message({
                        showClose: true,
                        message: "请选择设备",
                        type: 'error'
                    });
                    return false
                }
                if(!$this.form.clicknumber){
                    $this.$message({
                        showClose: true,
                        message: "请添加点击次数",
                        type: 'error'
                    });
                    return false
                }
                if(!$this.form.price){
                    $this.$message({
                        showClose: true,
                        message: "请添加费用",
                        type: 'error'
                    });
                    return false
                }
                return true;
            },
			resetForm(){
				var $this = this;
                $this.form.clicknumber = 0;
                $this.form.ads_time = "";
                $this.form.price = 0;
                $this.form.ads_device = "";
			},
            handleClose(){
                var $this = this;
                $this.resetForm();
                $this.isDialogShow = false;
            },
		}
	}
</script>
<style lang="scss" scoped>
    .form_box{
        padding-right: 10px;
    }
    .el-select{
        width: 100%;
    }
</style>