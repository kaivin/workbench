<template>
    <div class="ComparePerson">
        <div class="compareTitle">
            <h3>年度成交100万个数</h3>
            <span>（单位：个）</span>
        </div>
        <div class="compareMain">
            <div class="leftTable">
                <el-table
                    :data="inquirydata"
                    border
                    style="width: 100%">
                    <el-table-column
                        prop="name"
                        label="姓名">
                        <template slot-scope="scope">
                            <span :class="'name'+(scope.$index+1)">{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="number"
                        label="年度100万个数">
                        <template slot-scope="scope">
                            <div class="milnum" v-if="scope.row.number > 0">×{{scope.row.number}}</div>
                            <div v-else class="milnone"></div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="avarage"
                        label="月平均值">
                    </el-table-column>
                    <el-table-column
                        prop="most"
                        label="历史峰值">
                    </el-table-column>
                </el-table>
            </div>
            <div class="rightLines">
                <div class="personNote">
                    <span class="noteitem" v-for="(item,index) in inquiryPerson" :key="index" :class="'noteitem'+(index+1)">
                        {{item.name}}
                    </span>
                </div>
                <div id="millionLine"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { Column } from '@antv/g2plot';
export default {
  name: "CompareMillion",
  data() {
    return {
        inquirydata:[
            {
                name:"袁丹丹",
                number:200,
                avarage: 240,
                most:600
            },
            {
                name:"赵雪伟",
                number:0,
                avarage: 240,
                most:600
            },
            {
                name:"袁丹丹",
                number:200,
                avarage: 240,
                most:600
            },
            {
                name:"赵雪伟",
                number:200,
                avarage: 240,
                most:600
            }
        ],
        inquiryPerson:[
            {
                name: "袁丹丹",
                queryData:[
                    {
                        month:'1',
                        number: 100
                    },
                    {
                        month:'2',
                        number: 130
                    },
                    {
                        month:'3',
                        number: 80
                    },
                    {
                        month:'4',
                        number: 40
                    },
                    {
                        month:'5',
                        number: 160
                    },
                    {
                        month:'6',
                        number: 120
                    },
                    {
                        month:'7',
                        number: 180
                    },
                    {
                        month:'8',
                        number: 220
                    },
                    {
                        month:'9',
                        number: 225
                    },
                    {
                        month:'10',
                        number: 230
                    },
                    {
                        month:'11',
                        number: 240
                    },
                    {
                        month:'12',
                        number: 255
                    }
                ]
            },
            {
                name: "赵雪伟",
                queryData:[
                    {
                        month:'1',
                        number: 80
                    },
                    {
                        month:'2',
                        number: 100
                    },
                    {
                        month:'3',
                        number: 110
                    },
                    {
                        month:'4',
                        number: 60
                    },
                    {
                        month:'5',
                        number: 150
                    },
                    {
                        month:'6',
                        number: 140
                    },
                    {
                        month:'7',
                        number: 140
                    },
                    {
                        month:'8',
                        number: 180
                    },
                    {
                        month:'9',
                        number: 200
                    },
                    {
                        month:'10',
                        number: 220
                    },
                    {
                        month:'11',
                        number: 220
                    },
                    {
                        month:'12',
                        number: 235
                    }
                ],
            },
            {
                name: "高艳蕊",
                queryData:[
                    {
                        month:'1',
                        number: 60
                    },
                    {
                        month:'2',
                        number: 80
                    },
                    {
                        month:'3',
                        number: 100
                    },
                    {
                        month:'4',
                        number: 120
                    },
                    {
                        month:'5',
                        number: 140
                    },
                    {
                        month:'6',
                        number: 120
                    },
                    {
                        month:'7',
                        number: 100
                    },
                    {
                        month:'8',
                        number: 160
                    },
                    {
                        month:'9',
                        number: 220
                    },
                    {
                        month:'10',
                        number: 230
                    },
                    {
                        month:'11',
                        number: 250
                    },
                    {
                        month:'12',
                        number: 205
                    }
                ],
            }
        ]
      }
  },
  created(){
      
  },
  mounted(){
      var $this = this;
      $this.drawLine();
  },
  props: {
    payMember: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  methods:{
      drawLine(){
        var $this = this;
        var plots = [];
        var inquiryPerson = $this.inquiryPerson;
        var maxnum = 0;
        const colorArr = ["#8fb2f3","#ffc544","#77e5b3","#fa9472"];
        var resdata = [];
        for(var i=0;i<inquiryPerson.length;i++){
            for(var j=0;j<inquiryPerson[i].queryData.length;j++){
                if(inquiryPerson[i].queryData[j].number > maxnum){
                    maxnum = inquiryPerson[i].queryData[j].number;
                }
                var item={
                    name: inquiryPerson[i].name,
                    month: inquiryPerson[i].queryData[j].month,
                    number: inquiryPerson[i].queryData[j].number
                }
                resdata.push(item);
            }
        }

        const plot = new Column('millionLine', {
            tooltip: { 
                shared: true
            },
            data: resdata,
            xField: 'month',
            yField: 'number',
            color: colorArr,
            isGroup: true,
            seriesField: 'name',
            meta: {
                month: {
                    formatter:(item)=>{
                        return item+"月"
                    }
                },
            },
            yAxis: {
                grid: {
                    line: {
                        style: {
                            stroke: '#f2f2f2',
                            lineWidth: 1,
                            lineDash: [3, 2],    
                        },
                    },
                },
                tickCount: 5,
                max:maxnum,
                label:{
                    style:{
                        fontSize: 12,
                        fill: "#b3b3b3"
                    }
                }
            },
            xAxis: {
                label:{
                    style:{
                        fontSize: 12,
                        fill: "#b3b3b3"
                    }
                }
            }
        });
        plot.render();
      }
  }
}
</script>

<style>

</style>