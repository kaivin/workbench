import {EnscoreList,EnscoreSearch,EnscoreAdd,EnscoreEdit,EnscoreDel,} from '@/api/Enuserscore'

const state = {
    language:null,
    targetScore:{
        daymaxnumber:[],
        historymaxnumber:[],
        DistanceTarget:0,
        isDistanceTarget:false,
      },
      currentCluesData:{
        departName:"中文",
        departID:[],
        chartData:[],
        avgChartNum:0,
        targetNum:0,
        alltodaynumber:0,
        alltodaynumberPercent:0,
        alllastdaynumber:0,
        alllastdaynumberPercent:0,
        allmonthnumber:0,
        monthGrowth:0,
        monthGrowthTxt:0,
        DeparData:null,
        groupcountArr:[],//部门数据
        targetData:null,
        targetDataLine:null,
        departScoreData:null,
        userscoreNum:null,//月成交TOP5
        yearuserscoreNum:null,//年度成交Top5
        zugoupmonthArr:null,//年询盘
        zugroupdayArr:[],//日询盘
        monthtongArr:[],//月询盘
        //zusuercountArr:[],//组员成绩
        checkedDeparData:[],
        cluesRegionData:[],//地图
        topTenRegionData:[],//前10
        yeartongArr:[],//年度询盘对比
        registerArr:[],//年度同期询盘对比
        registerGrowth:'',//同比增长量
        registerRate:'',//同比增长率
        yearscoretongArr:[],//年度成交积分对比
        sametimeArr:[],//年度同期成交积分对比
        sametimeGrowth:'',//同比增长量
        sametimeRate:'',//同比增长率
        yeardepartscoreArr:[],//中文年度成交积分
        totalNumscore:'',//总成交积分
        departmentCost:[],//部门成本
        costAverage:[],//成本均价排行
      },
}
const mutations = {
    ["SET_LANGUAGE"](state,payload){
        state.language = payload.language
    },
    ["SET_TARGETSCORE"](state,payload){
        state.targetScore = payload.targetScore
    },
    ["SET_CURRENTCLUESDATA"](state,payload){
        state.currentCluesData = payload.currentCluesData
    },
}
const actions = {
    
    
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
