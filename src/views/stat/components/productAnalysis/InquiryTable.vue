<template>
  <div class="cpInquiry" v-if="intableData.length > 0">
    <div class="inTitle">
        <h3 class="in-h3">询盘个数 - 组员占比</h3>
    </div>
    <div class="rowMain" :style="isshow?'height:546px':''">
        <el-table
            ref="table"
            :key="time"
            :data="intableData"
            style="width: 100%"
            border
            class="cpTableShow"
            @filter-change="filterChanged"
            >
            <el-table-column
                width="60"
                type="index"
                label="序号">
            </el-table-column>
            <el-table-column
                label="组员">
                <template  slot-scope="scope">
                    <span v-if="lang=='ch'">
                        {{scope.row.useridname}}
                    </span>
                    <span v-else>
                        {{scope.row.remark1}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                label="所属小组"
                prop="depart"
                :filters="departName"
                :filter-method="filterDepart"
                :filtered-value="filterdep"
                >
                <template  slot-scope="scope">
                    <span class="tabledepart">
                        {{scope.row.depart}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="number"
                sortable
                label="询盘个数">
            </el-table-column>
            <el-table-column
                prop="percent"
                label="个人占比">
            </el-table-column>
        </el-table>
    </div>
    <div class="row-more" v-if="isMoreShow" @click="showAll">
        <span v-if="isshow">查看更多</span>
        <span v-else>收起</span>
    </div>
  </div>
</template>

<script>
export default {
    name: "InquiryTable",
    data() {
        return {
            isshow: true,
            nowheight: "auto",
            departName: [],
            nowLength:0,
            isMoreShow:true,
            filterdep:[],
            time: new Date().valueOf(),
            filteredNum:0,
            isJump:false,
        }
    },
    props:{
        intableData: {
            type: Array,
            default: function () {
                return [];
            },
        },
        chooseData: {
            type: Object,
            default: function () {
                return {};
            },
        },
        lang:{
            type:String,
            default:""
        },
    },
    created(){
    },
    mounted(){
        if(this.intableData.length>10){
            this.isshow=true;
            this.isMoreShow = true;
        }else{
            this.isshow=false;
            this.isMoreShow = false;
        }
        var newdepart = [];
        var newdepname = [];
        var $this = this;
        for(var i=0;i< $this.intableData.length;i++){
            var obj={};
            if(newdepname.indexOf($this.intableData[i].depart) == -1 ){
                newdepname.push($this.intableData[i].depart);
                obj.text = $this.intableData[i].depart;
                obj.value= $this.intableData[i].depart;
                newdepart.push(obj);
            }
        }
        $this.departName = newdepart;
    },
    watch:{
        chooseData:{
            handler(val,oldval){
                var $this = this;
                $this.nowLength = 0;
                if($this.$refs.table){
                    $this.$refs.table.clearFilter();
                }
                if(val.tag == "enquirie"){
                    $this.filterdep = [val.chooseDepart];
                    $this.intableData.forEach(function(item,index){
                        if(item.depart == val.chooseDepart){
                            $this.nowLength +=1;
                        }
                    });
                    if($this.nowLength>10){
                        $this.isshow=true;
                        $this.isMoreShow = true;
                    }else{
                        $this.isshow=false;
                        $this.isMoreShow = false;
                    }
                    $this.nowLength = 0;
                    $this.isJump = true;
                    $this.filteredNum = 0;
                    $this.time = new Date().valueOf();
                }
            },
            deep:true,
            immediate: true
        }
    },
    methods:{
        showAll(){
            var $this = this;
            $this.isshow = !$this.isshow;
        },
        filterDepart(value, row, column){
            const property = column['property'];
            if(this.filteredNum===0){
                this.nowLength = 0;
            }
            this.filteredNum +=1;
            if(this.isJump){
                this.filterdep = [];
                if(this.filteredNum === this.intableData.length){
                    this.filteredNum = 0;
                }
            }
            if(row[property] === value){
                this.nowLength += 1;
            }
            if(this.nowLength>10){
                this.isshow=true;
                this.isMoreShow = true;
            }else{
                this.isshow=false;
                this.isMoreShow = false;
            }
            return row[property] === value;
        },
        filterChanged(filters){
            if(this.nowLength>10){
                this.isshow=true;
                this.isMoreShow = true;
            }else{
                this.isshow=false;
                this.isMoreShow = false;
            }
            this.isJump = false;
            this.nowLength = 0;
        }
    }
}
</script>

<style></style>