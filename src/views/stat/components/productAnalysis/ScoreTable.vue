<template>
  <div class="cpScore" v-if="scoretableData.length > 0">
    <div class="inTitle">
        <h3 class="in-h3">成交积分 - 组员占比</h3>
    </div>
    <div class="rowMain" :style="isshow?'height:546px':''">
        <el-table
            :data="scoretableData"
            ref="table"
            :key="time"
            style="width: 100%"
            border
            class="cpTableShow"
            @filter-change="filterChanged"
            >
            <el-table-column
                type="index"
                width="60"
                label="序号">
            </el-table-column>
            <el-table-column
                prop="ownuser"
                label="组员">
            </el-table-column>
            <el-table-column
                label="所属小组"
                prop="groupname"
                :filters="departName"
                :filter-method="filterDepart"
                :filtered-value="filterdep"
                >
                <template  slot-scope="scope">
                    <span class="tabledepart">
                        {{scope.row.groupname}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="number"
                sortable
                label="成交积分">
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
    name: "ScoreTable",
    data() {
        return {
            isshow: true,
            nowheight:"auto",
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
        scoretableData: {
            type: Array,
            default: function () {
                return [];
            },
        },
        lang:{
            type:String,
            default:""
        },
        chooseData: {
            type: Object,
            default: function () {
                return {};
            },
        },
    },
    created(){
    
    },
    mounted(){
        if(this.scoretableData.length>10){
            this.isMoreShow = true;
            // this.nowheight = '546px';
        }else{
            this.isMoreShow = false;
        }
        var newdepart = [];
        var newdepname = [];
        var $this = this;
        for(var i=0;i< $this.scoretableData.length;i++){
            var obj={};
            if(newdepname.indexOf($this.scoretableData[i].groupname) == -1 ){
                newdepname.push($this.scoretableData[i].groupname);
                obj.text = $this.scoretableData[i].groupname;
                obj.value= $this.scoretableData[i].groupname;
                newdepart.push(obj);     
            }
        }
        $this.departName = newdepart;
    },
    watch:{
        chooseData:{
            handler(val,oldval){
                var $this = this;
                if(val.chooseDepart){
                    $this.nowLength = 0;
                    if($this.$refs.table){
                        $this.$refs.table.clearFilter();
                    }
                    if(val.tag == "score"){
                        $this.filterdep = [val.chooseDepart];
                        $this.scoretableData.forEach(function(item,index){
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
                }else{
                    if($this.$refs.intable){
                        $this.$refs.intable.clearFilter();
                    }
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
            if(this.filteredNum===0 && !this.isJump){
                this.nowLength = 0;
            }
            this.filteredNum +=1;
            if(this.isJump){
                this.filterdep = [];
                if(this.filteredNum === this.scoretableData.length){
                    this.filteredNum = 0;
                    this.isJump = false;
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
                this.isMoreShow = true;
            }else{
                this.isMoreShow = false;
            }
            this.isJump = false;
            this.nowLength = 0;
        }
    }
}
</script>

<style></style>