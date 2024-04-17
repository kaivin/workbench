<template>
	<el-dialog title="下载模板" :visible.sync="isDialogShow" :before-close="handleClose" width="500px">
        <div class="down_list">
            <div class="down_item">
                <el-link tag="a" target="_blank" type="primary" :href='wordLink' class="mb_link">搜索词导入模板</el-link>
            </div>
            <div class="down_item">
                <el-link tag="a" target="_blank" type="primary" :href='adsLink' class="mb_link">广告导入模板</el-link>
            </div>
            <div class="down_item">
                <el-link tag="a" target="_blank" type="primary" :href='urlLink' class="mb_link">网址导入模板</el-link>
            </div>
        </div>
	</el-dialog>
</template>

<script>
    import { mapGetters } from 'vuex';
	export default {
		name: 'DownTemplate',
		data(){
			return {
                isDialogShow: false,
                isSaveData: false,
			}
		},
        computed: {
            ...mapGetters([
                'sidebar',
                'menuData',
                'userInfo',
            ]),
            adsLink(){
                return process.env.VUE_APP_BASE_API+"/ads.xlsx"
            },
            wordLink(){
                return process.env.VUE_APP_BASE_API+"/word.xlsx"
            },
            urlLink(){
                return process.env.VUE_APP_BASE_API+"/urls.xlsx"
            },
        },
		methods: {
            showDialog(v) {
                var $this = this;
                $this.isDialogShow = true;
            },
            handleClose(){
                var $this = this;
                $this.isDialogShow = false;
            },
		}
	}
</script>
<style lang="scss" scoped>
.down_list{
    padding: 10px 0 20px;
    text-align: center;
    .down_item{
        display: inline-block;
    }
    .down_item+.down_item{
        margin-left: 50px;
    }
}
</style>