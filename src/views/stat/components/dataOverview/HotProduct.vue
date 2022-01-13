<template>
  <div class="hxpage btm_prochart">
      <div class="title-view">
        <div class="title">热门产品TOP10<span v-if="type==2 && language=='中文'">（单位：分）</span><span v-else>（单位：个）</span></div>
        <router-link :to="{path:language == '中文'?'/stat/cn/departAnalysis':'/stat/en/departAnalysis',query:{type:6,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}}" tag="a" target="_blank" class="more">更多分析 <i class="svg-i"><svg-icon icon-class="rt-more"></svg-icon></i></router-link>
        <div class="btn-group">
          <div @click="changeType(1)" class="btn-item" :class="type == 1?'active':''">询盘个数</div>
          <div @click="changeType(2)" class="btn-item" :class="type == 2?'active':''">成交{{language=='中文'?'积分':'个数'}}</div>
        </div>
      </div>
      <div class="chart-bottom" id="HotProductChart"></div>
      <div class="productChart" v-if="!hasData">暂无数据</div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { mapGetters } from 'vuex'
export default {
    name:'demo',
    data(){
      return {
        type: 1,
        myChart:null,
        startTime:"",
        endTime:"",
        baseDepart:"",
        contrastDepart:"",
        hasData: true,
      }
    },
    props:{
      producttop10:{
        type:Object,
        default:function(){
          return {}
        }
      },
      departList:{
        type:Array,
        default:function(){
          return []
        }
      },
      language:{
        type:String,
        default:"中文"
      },
      year:{
        type: Number,
        default: new Date().getFullYear()
      },
    },
    watch:{
      type:function(val,oldval){
        this.setChartBottom()
      },
      producttop10:{
        handler(val,oldval){
          this.goPage();
          this.setChartBottom()
        },
        deep:true
      },
      isCollapse(){
        setTimeout(() => {
          this.echartsSize();
        }, 400)
      }
    },
    computed:{
      ...mapGetters([
        'sidebar',
      ]),
      isCollapse() {
        return this.sidebar.opened
      }
    },
    mounted(){
      window.addEventListener('resize',this.echartsSize)
    },
    methods:{
      changeType(val){
        this.type = val;
      },
      setChartBottom(){
        var $this = this;
        let chartBotData = [];
        let xAxisData = [];
        let seriesData = [];
        let picData=[];
        let bgData = [];
        let showchart = 0;
        if($this.myChart){
          $this.myChart.dispose();
        }
        if($this.type == 1){
            // 询盘个数
            chartBotData = JSON.parse(JSON.stringify($this.producttop10.productxuntop10));
            if(chartBotData.length > 0){
              $this.hasData = true;
              showchart = 1;
              for(let i = 0;i<chartBotData.length;i++){
                xAxisData.push(chartBotData[i].aliasname);
                seriesData.push(chartBotData[i].number);
                var obj = {};
                obj.value= chartBotData[i].number;
                obj.symbol = 'image://' + chartBotData[i].pimg;
                obj.symbolPosition = 'start';
                obj.symbolSize = [68,68];
                obj.symbolOffset= [0, 82];
                obj.symbolBorderRadius= "50%";
                picData.push(obj);

                var obj2 = {};
                obj2.value= chartBotData[i].number;
                obj2.symbol = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFYAAABaCAYAAAAilKGMAAAdkElEQVR4nMWdaYxlx3Xf/6fuW3qd6Vl6doockjP0DCkORVEUzSi0ZVG0qIVyHEVyEllB4MBQFidIFAcwEMOwPkQBAn8IYiRCEiCAbEOG4Fh2EpIySZmJaMmiNcow4jI0Z4az9yzdM93Ty1vvrZMPdU5V3Xr3dfdschGX776716/+9a9TVff1EDND01eO9rGexAxYOS0D8MBW4I6NwEQD6OTA8XngrVmgYMAQkNUBUwOKHIBd8/IEgNc8StKvHaiv67gDH/glsLVgZjBbgBnvvPY7673NdafaLbmIcQA19QtHhsgtJgPYAmAQAANglAjN0Yn8MWY8Aea7AbubwTvZ2klmHmVbjBXMQGFX8oKXbWGvsuV3i8K+Y3P7l5bp8Oj4lte/chQ53O0YWD/o251uCdi6gCU4NedBlcZkaIJQtwUOZjX+YJbxR8A4COLdnZV8pLfSRXepheVLc1g4fwndpTb67S56yy0UeQ7KaBzg8axZ296YHDvQ2DD+icbkGEY2b0Rjw/Jlm9uXi4JfJKr9zz1333NFap2CZg+ayD2kZbgnvb3ppsFm5BQrj0oWyPoWBoTNtQz7a3U8Yer8t7IM+7jASK/Vp5XZeVw7exnLs/PotzrIO10U/R6KvADbArYowNZV16KbwxaFwJ+HLdx3W1iYem3b2I6tn5vYveNzYzt39I/+8P89VxT2vxS5ff7Q4+9nAPjK0T4BABExM+HHARUAal/46oz/cuCnpq/7AgU7aRjC6LUupuY7uAMG+zZswBNUx8eIeFe/U9SuXVjA7NvnsDR7FUW3B7YMLgpYa8G2AAAQUTBXGgYgwMk7XSycOIOrx04CRPWxXTs/PbF376drkxv/8vt/8uf/Ni/s7z77pZ/OAeBm3TTmtJ50S6ygX6A228K+HPRMo05P79nM+0Zy3jy72M8unZjDleOX0Lm2hLzThWULAoEH2ifxEjVmEEAGrrVLIOsxehgINi+wdOo0Ft89ifrUpvvG7t7/37INm37tI7/5wq98+zeeeoFAICIQGVjY62gebyzdNFgGstMrOLB5nP7ullH6+akm3T2zkptjP7qEc29fQH+5jbzfd1UbNBxq5cWj4zzM1SC7fd2rV9Ce+zPUpqb3N/ce+JPHf/V//cHE45/654vf+x/nmMRjb7Mj3DBYQwADEybDe5cJv9Aw/Nmm5e3nz7ToR4dPY/7CPPr9PlAwtIIrUGYGOOBVfjzAm+KaP6BUBelOo4Glf/UyeldnYbbd9RkzfeeTjfc9/cuHHnrsD179r79+m/V6E2DJYFNm8MH6CH6xMcrPrPTsxMzbc7h47BJWFpZQ9HIhxWCG81RmsC3nif0xDnZoz3mQdGm/6t+AYAFyVZ3lk+AKgQuLYuY48qsXp+yO+7/x6ne/89v1Bz/5qw8/+sEubqMh3ChYA+DBegP/rFHnD/eWu80Lb8xg8dwV9Fsd2LyQwwSqBLGOkwAGKiSqoOMN0RKki/LpVCLkDiWAI/voLIFO/QWKzfv/Sbe55eFXXnr5576AD88BwNe+uOuWAzY3cE6TDB6p1fgfk+GPriy0mif+7BiuHJ9BZ3EZRZ5L70YV6sKmsjKDghEfG1kF86ATB8AAVJG6CuNAehWHxsp9NyBr0Zg9CrNw7vFuq//Ky89++z0A8IWvztAXvjpzS133esEaALuI7DNA8amVuaXs9PfewdL5WeTtjusyWgtmG9bBsDZA9l1KcKkAtJr774BAj0QrIvSJWbSrUXTUuBGBmaQLiNL+5tIp1JdO39dp9f73i9988Q494lYCvl6wGZF9kpD/05UryyMX3ziF9pUF2CIP4GK4sWIV6gBkXeDVXAaa+q5agCqW/DpEpQqQDIGM8QvEe4kIo90ZjLbO3NVd6b740h99e1uEH7cC7vWAHQXsY8y932xda03OHj2FxZlZ9DodcKFAOVqsBP/6yYmaQ2Om2xFZADO7EHbAPF1l92sa80I+OEAGDFjglwpALGIsv4iR/PL+1mLrjw//nx82EcUgNwv3esBO2aL1662rSzsvvnYMC6cvoN9qe4Vaa2FtES0xbLeNo22WrSsQBWpjy1Dvdaq2rA2fgxvcGALb1XdCDJWCQiFeS8bvU+VOFufQtAuPXjhz4bcQmcbNwl0v2LG8v/j3uq3ORy++fhLLl+aQ93pgW4ALUWRRuCWyA1vYCCgL/KBkVa8tNWTWN24+aTThyQZ4OmDGXrUkIS5F4W60zRjXo5OFiLDRnoWx3X/47O899zeFyU0rdz1gqdtZuLfT7vzrS6+fxOK5GXSXV/xAiUL10GSAxBZuDKCs5qDSoHQuKdlbBIL3+lCNXYNUViuglsAkkQFlYBi3kPsEZWDK/LGqYCKDDAU25qdgi/w/v/jfX9LG7KbgrieOHem02/9u6czs+OK5S8i7PckLw7IByPoqSFF3k30Vlf9b67dZywBXQPVV34bGzGrDlsS4jKBSvy1EBb4RgwGMKySyFqAMgItWiIx0tQ0a3MZ4cWnjSmvnfwTwTMJAY4t1x7trKZbmZ2c+2bq6/NSVoyfRXlhE0e+LKmV4r4gaqXg7R94rKtZj3NBgHEE4qFYgwjdogI3irZCruJ9rfGcgxK1hEEd9VX0WxvjtDFVtBjIGE5hFZjsfe/73v/VplFVb7pncLNhetzPSbbe/cuWtk+gsueDfV/3CurFRGT8tosUWBWyeD4C2RQFrWaByKVqw2mAV1jdW6rPWx7Xl3lYZrgkKVWC6Hn0Sgs96OzC6TthgL6Lo87+5dO5y/WbgrgbWzM6c/9uLF+bvWTx7Ab1W28WrESybqNRKA5bu82rWRk4810EMlmCt9QoNsa0DaiOgHOcx6hA4wBDIWYBnMpDJAOPWQZkHSeK7MG5bk5bRtMv73vju659FuSG7LrhDPbbX6dZaK90vzb9zSiIAC2IGiMW/LMgakAn38wPVREJE+/TxqBZCw5R2a0W1Tr3hOG8FHnQEl8t5JDIASSkY469PbAFrYJlBxHDNAwHEYCaQFCQRYxyXsdKb+pfdVvcbzbEmEKZAY69d1XOHKZZOvX386dbs/MH2xcvIe10fTpXVmqPIC6dkmypV9kd24aODwoZOhYD00YCA8N7qx6TjvikQYlUVldgB0nBKfTbzXhp8VRaKemcmQ4NaaHD7/h8+94Onod5SVuyaaZhiTWul+/nlk+eQ9/sgIlhiEDOIrHtQZokGrDyoZlbzTb7B0aJNlQsgeKvvynIUDWgvDC7MYnbAOJlVILEAG2YnpK7IOgOkkYA8jLVgcvchIzVMPxlo4iqK7sa/A+BbUamWRiqwimorwb75F29MdVY6n+xcvAhb5MHk5SHIsMuEZIjICktTgqpdTN/nBwJAfbSo5WcEyLG/lqIsBpyAWLLpUEKhA9A5inBndru8jQhMN0TkjhcTJzBggDovwBb8iTM/PLnpPe/fOx/hid+MuC4roMWry59pX5gdybsdqdZRVS8K2FwjgbxkDf57LtU/d1W/0I6CdBqstYBEB1Y7C77TUO51aQH4gZe43w83ROgtALEFhNiapDFz0YCzBBgDQmQNJosGa1wNrNNic+HduZ/D6nZQaQ+pYgkAtVu9j3cvX4LNC5AhGMpguXAPygQiBkoPri2zERGR772nRcscNWgE2KKsZF0PDZ08FgXAof6RNFQaHZQtICQbVGzUtPWCCHahT2oIzBaZXQL1d3wcwO/C168Bs1+fFRx77XS90+o/kS/MgYocxNLKsvEQFWw8FQLxW80k+UdV6O5/LGOo7PJbqupM5LwVZYAEClB9wKFg3D7y7DkCDHl29U4Gwc3SEsvz6gXZuuNsVFC0BNOnv9Zb6jYak00da9MlhjrgtQNgT7x54v7etcUp9LogIhgGLLkbk5FgmxjGSJWUd4vIx5Cuevo7UhJ3MjuALBhUwSDfKClodQQnXpLTXcGylev5RjPkVaw9hFBgsDS+LvSSNoALKeioHTLWFxajQEbdDXOvnrt/15P3vAYfp8AAKIJqBlVbAjt3ukWtpc77i2sLqBWu6lsjrb/EeqTy0BEmqwrV+JbA8i4AEekadDgvNESJj0aZczD0HrFC5QiWRtMjCXGACpBkIMd9Z3EM10gRucYXVINhlhdGyDEjAnMBWOkamzZ4pfcwgNcjqLEdVKq2BHb21Ap32/kD1FqEsYUzdWYZdjPuoYxckzWGhPS7EXUWqKRU9lYhn76ek7uMPBdrp4JI1BpVSw7WEr8xE+C647UMglvovVzDSMYKAePAex9ylsFsXSEYV4Mo6yCzOAD3YqWNluBUqVJSsADQ6+T3NtotcGGdP5EbhXeAXU+GiGDVoyCeCzg/jjKv4L3vCmz1TH2cYFrkFQaOQrdSlY8b5kDQ51LLrQRVQjFpK1zMquZuRYMC1spjS41k00WN6G5hVSBECKnfllIMlgCg3y321PttWFWstLrEptRoaQzrIgHnv1xw8FgCCEUAA/LK1U9fdwQMyMW03q9l/NUXlBaKgA5qVRsgX/BAgCptIkhDUJJhRNaGjTxYgkC11lEzOWoZ7YJTbBbBtT5jFXYwEG71e/k25D1Ya2GMqMAY17XUCIAI+qoOqarZelX5AvAQSNQOt49dnBj6T/F7AWIPjFLVDyrVSUE5Wm1IIScVkwWuIXbeLEOURHA+qzyI4SJKqd3GtR9MFjWizRFYhUvJEt21wgryrh23eR+GGLYofIyqYx3GGK8ykIGJIAe1WrFFEwG1si4NlAkwYqsKoMlBNKIoE2yFPWwH2vVEtQYE9WtE4O0AcM+mgy56bYVt1Je41EzVamZMWOUIVqCqrUwKVp8SRd9OwvadmlSd0qI6b2WXSWZXqJF/upJmd0+RnYNMsGwErgNGVsYfpKXxD+DvR34fpEDUt/2MhRaAeiyRaxYUMIV6ACshF9QX2Fd/MAdvtS6q0RcdGYx6zYwLqwyDvbBKOxiwgjyXyT/NJJGHypB5emm9rZEqz5lTLZEbSoQV20A4B+7JrXQwXHU0olw3WVKu8gI1qSEKk2LYUnVJxMBRXYCKNQOMTP34qRp3VwA2FIK87RdAW9RqBly2ghSsB5oq1qvW5rxkLU0SFe7BDUFzTwQ3fGgkg7pfMq42wAqBWAajWDhJg2FCwO/UQ1LtdIBEIwJRvpExAZDYi6jeiGq1K40IqkQVwXctmDJQhVq12jOTmxeDfLdAltXQaJpWt6zWKtVGvYwKj+WCVyybScN9Oc7IQ0XjAla7gsE/ARn1QiZ3EtUXBmRkWNDA2YMPaeKylt68wJRN4pgyb0UE1nUBquuhEYMrBD9e4fG6QlQf1c6ARD/+QWLnJCAzNdQbWbtbtoJUrQOpahBmtmCzI5MxO1fiYvJEYEMyfiAPFynaPWvhMkwClCQwl86GtvQ6PKiAXYMTRRL6/OqlRKHQ9PoeduTzqvoocgBIOjcC2cesBdxIl+TPFmBkLvCwri1pZA3Um9k1lG2gymMHrKBEnYjOWTTey7wsACyYCUY6B/5wadjIShSg4wMaKxH7DIZgRGJFEx0X7SrFqhrzImwjwP22SbcZqTFGlRs8G1C1uw6HFyXLGKzGslqDILisC1NZnm2kPoraSDaLQRtYbVaBBqyAiE700UTDsq8WrjcjK5Z9FfWaYKlC8kAuurFuTsm48QWGelmoikSZn1XQAMA/h+9RkVdogB599wNDpM/vseoF3Sa9OosFSMvP1vsp+RvD531ydAzZSO0ChqsVVXDTxovI0Bs5jZWmT4ItszQkUpXIxYUg9+4pGZIJR/hoQofj1BaIMzdIQ1noHEUFVepUyKdv/aPXg0LoJb08VbvWkDAIETLBYm4iEq1lqlbWgreQHhthamwSGK2fHgI1hTu88WqONI90e5MyGKEta+gASH131QnaWmvjYGXEzUgV0xbf+Zqv+d6zwxOFWVflohYQz6dpvhwJVWroYod8xm/lhDwALvL2vhD+77vCMqYgDeX0xo1ojTVOrAIUybo8XZIOPfbgm4UZXSxQL79L5Sf54FpXnaJmThZICBOPHLmMxdPdmlWdKPQNiofqazf82y7q6wLRDSOUoZasI17StoFMad2/LBdZzUi9gU0bJloLI/UzGG4BlZHBANjpXdNFZmrf6WdTbh4K5Wlp936VBcNG2wWwRfTKUFACQxwB2mMkZQuoA3v1qhlEA+RS1Ym1txWAKiCC8UBJOie6uMN1X3ROtK42El7kIOyY2gSM1o7a0IUbCnJNsABQr9Wey7Npl3GvzkSZUJi6yLuuSBWsClVVilqlMMCQvjuUtAOfKIzZhVysmU9rpYcT8q9vHOr3MIUUU49Vrvbk9t25bSs6zdqRCqBrAq4Eu+fu3X9sa9u6OgXHSEEpcOvCMVWvnM9a9TkCqD4sq5olt0mm8/xgNocM6rAe+XahBKT0KeeEN7gRjqcy3HBOGbJCrWc17N0x3T9n6odXA3hdYA8+enCxXms+Z2s7g8qixVtEyKqvcx5i6RwExcf/aUFpYxrVOB1MUch+6ie+qWch4xIcRr6qlhJcVWeiO+1Y3LNzGjxaf73N1EL5rqj4vj6wADA2Nvp1buwNvpguFcBLIJPEoQSgk3Xhu8IP2/0EtofpzivFqaI87zADabUaG/fy4kjCLYfu2Y05qr2KMsQ1gWoaBpYf+cSjL9Xqm49StsXdtkq5pZa9KkKIVRk/l6oaoXFLn5hpaDbiHlXpZeRSiDVknapBxx3gPVs3Ynp6w8XjHXoD4Scm8U9N1gRdBZYBoNao8fj42L+vNQ/EMq1e1ijI8k+OEocIByXXHJ4GgN7i9KEH78JMnr3MbqZAJw/1ceN1/0jpNUyys1QSDzx96I8ajR0nTG17yVP9gavBHlArkrMZkF/MxCCr1vyWyKcr08C9KtaHFIhe8+6dm7B755YrbyzyayiDTQGniirBHqpYAFwbqReTmyd+Y3zkYfixy+TA1ZaBy5YKYjiAGG7Vrxnju/OQu1XkdWBfakKGgI89tg/HW/yiZfTgwMZLFdw0E+5aQ+7sT7z34w/86djolucnRh6QPUMUau3wfbEyK/PJ/sP/doHlvVm5pysTHjxNCiuORob6vI+hq7wI+OuH7sTIhvF3X79q34Sb39KlSrlVluCfLFVsKjoLwG45sP3LG8cPLTdrW6uoROUWFWCiSB/byn+W9U3DpINRulakytK1uQRTlTcQ6iG6FpePKZ3DjD3Tk/iZR+/qvXKxeB5APwGrcIepdgDw0HArPmHToZ3nJ6Ynv7x944dBprFq9bdcsa2clZLyQmyR3LaqgUzi6IHjYrjQmhIYVMbYYDSbGT7/sfvx1gJenmvZKwI2hruWFQyktPEqAY0uZKefuvcPJ6a2/OHuTU/A96AiOKVLMHwGtCqXlRRnnoMFxFU3OSb+UV3YFv8GV9ft4LXUo/2+cA7Y4hc++hPoNkbefvV8/0cAerKkcKssIQXsqVRZQRXcAkAx9cSdX94yde8be7Y8ngBNL8FhrweRHKajZP4WoTDSqEIB6BL/qDkAis8pHx/DTs/5zEfuw967ts09+073TwF0I7Ap3LQRGwo1BltRFwdUW5iJRmvs4R2/smPLe8/u2vQQyg1T8uA2qorJupteL6tqQM0lKAFYUGxQn19sCjJWaLlQmC2e/OB78IGH7lj65ludZ3sFrwjYKrhVih3mrxyDrUolK9DSynZMXG4+sO2Le/c8fmHP1vfJkakcU5VGPTRvF2lVT2HEcbCAtqliB6t16Y9QpEt0zFOP3YmP/9R9K9/4Uev5hY5dANCJFoXbj5bUZ+Oe2EBKZxCqrICji+YActo1OUM184/uG/nQfxgdGdtz/PyfB1+FG6lyA00CjSBTNm6aBswy7iIq9fP8XNrG/i1rRHVLpsb9K0AsMxRUHtBG1PWN8k/M+Pkn9+NDH9i7/PUjKy/Mrdi5Cqixaqsig5TPQEOWHfrkl+LvVaPj8RJmKMcbbWwceWU7bX5oanx6enbhtPtjZX60KYwi+eES/7IFwjBdeTQ6GeILo01hWI/9NfUhw2coGP/dRwQWY80afvmzD+GBg7vnf+fwyktXV+wVACvR0pKlLUuVeqsiBE1+fRjYqkFdgwQuN2v9fMv4d6bN+NRdW+/df3XxAtq9lh/BdzjN4LBdPLQXASzBTeCTflW4MdU4SwrVe49b7tq9Ef/ql34S/ebEya8fXnml1eNrCdQUbKreGGrcgFWmKrDpepVyPWw2xO1NY0cmao1LB3cdeMgQ1efmL0htj0btFaDfVgYHvw8RcIqehMpPNUg0eH0EtGYIz/zMfvyDz74v/+6Z/MgLR9uvF4xlARgD1c9YrR2s3oDpAwwALoH92hd34ZuHl6oUGwNOJ9UMANMea57PRxuv3rtlz/b9d+zbtbxyDYvLC9CB5fiPjA2qVu+QqhUDcP3LbqRjF+Vq7ycwwXjwJ7bjX/z9x7D9ju2Xvn545dV3LvXPYVClMdz1QFWPHWoDwPCffOpBhPB+sEYG8TuiGVxVMQDMSqN+7kSj/lu7JpqPfmrH5z4/O3t2+vuvfQ/nLp7zAT/pzzXjxkmQ6TsIDLgfjegLIzrnTwjvyVoHnXW4Q1+BAuH+fdvwmaffiz13bG2/8GbrzdfOLp0VYFrVVwAsrwK1i+reVzw2G0qzItEv/qfz/svXvrgLgP9THakq9d2lGoC6LE0AI7KMAhiTZdwAk/eY/Kd31OxHr165tPXIm0fw1rF30M9zwP+NAPcDYeh69CtBUNW2MLXtG0L5HGnW8ZPv34uffeI+bN021fr+u52T3z3ePllYDysFu5a/VgEe1kEYgLvany5JZa6aiV8TH/p2iAVwzNa+fbyHV++Z3vO+p35292N/4+n+vndOvmvePn4Cx06exnK740qXXYVwtdgp1zdRGlZZBC82ADNjw+QoDh28A48ceg8eOXQnX1rmK4dPd86+dmR+xrJveBRqDDb21NWigOvpGJRSpWKBoaqtUm4DTrmq3tFoUQWPAhibqGHrvkl6cNso3b1pJLtjYf7K6NkLF3Fhdg6zcwu4em0Jy60uOt0cvbxArVbDyEgTE+NjGB1tYHrLRuzeuRl37t6Cffdsx9atm/ozi8X8qbne3P89051ZbNs2yr2mOD6NwabrKdgU7lojWwNprT+2E59kk30p+PS8uEtcACiWc+RH5vka5vkHBDuya3Jq1669m3c/ctBs3jBiNm0YNRtGatQcqZt6vUaZ/Ggmzxl5wZQvdm1roWVbV1bsyrfezRfO/uDqNY46LgJCocaKjVVbtVT1uKrGB9Y1sgUkiq3an0CMX2FU1caem6o39t/4Uxc9thFdQ6+pNUPvGyfNYKlHiOCHVWAVbvxZ1dsa1mhVDW6vu0u7WooVeD3HxtFEqiotiNsFVu0gBdxFdfd1NahrqjRO67ECSj41Y5BteXJ8agM2esgYbBcBagpWa0PcOKbPNezaqR3E6lWg8b6qUawca6t0VcjrUWwKVVOs3Dw6dsBbETKfqrWLarUO++kPsHptqIKbQqxSaOypeXTdYQ3VmspdrxWsBbdqVGxgyDHJiHryMKjXA3Y1uDHkeNuw6Ze1Wv912cH1euxayq0aSkszr5mroxpqqta1rKBKtTHcGGDVdEtVOHVTUIHr/xvd16vcGKpmvoag2BTmampNFTtMtVXqTUFWKTQdA7hhqMCN/fHz1eAOq65p5jO4DA8DGv+eSiOC+Np6v7jwVgOcbq9SaBXQG4IK3PhflU/h6vcqVaXKUoB5tJ4CHabW+P7DCi+tJVXKrAJ6Q63/sHQz/3LHaqGYftcHNtGnwo07GsN+Q5WqNb633iuFm0JeL8xbBhW4+X8SZZgtxNv1NSYFq3CHgawa1AEGrWBYragCne4fptA4HzcMFbg1/4iPQtT1NMWjYZqhdMB82HrVgHua+SpQ61lHxToq1m8o3ZJ/HQnhQVL1ptBjL7YYVOZqSh12z6oGZ7UFFevpNW863SqwmtYCnDZyVRBToOsBq59VsKv2xZ/p+i1JtxqspmGAdd8weOuFmt5nvZ+rrd/SdLvAaloNsO6n5DhUrK/nHutdr/p+y9PtBqspzshaPhwfd73Xvt5tty39uMDGqQre7QLxY4UZp78KsHGqyvh6lbqea/2Vpf8PERH0oGsOO4EAAAAASUVORK5CYII=';
                obj2.symbolPosition = 'start';
                obj2.symbolSize = [86,90];
                obj2.symbolOffset= [4, 102];
                bgData.push(obj2);

              }
            }else{
              $this.hasData = false;
            }        
            
        }else if($this.type == 2 && $this.language == "中文"){
          // 中文成交积分
            chartBotData = JSON.parse(JSON.stringify($this.producttop10.productscoretop10));
            if(chartBotData.length > 0){
              $this.hasData = true;
              showchart = 1;
              for(let i = 0;i<chartBotData.length;i++){
                  xAxisData.push(chartBotData[i].aliasname);
                  seriesData.push(chartBotData[i].score);
                  var obj = {};
                  obj.value= chartBotData[i].score;
                  obj.symbol = 'image://' + chartBotData[i].pimg;
                  obj.symbolPosition = 'start';
                  obj.symbolSize = [68,68];
                  obj.symbolOffset= [0, 82];
                  picData.push(obj);

                  var obj2 = {};
                  obj2.value= chartBotData[i].score;
                  obj2.symbol = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFYAAABaCAYAAAAilKGMAAAdkElEQVR4nMWdaYxlx3Xf/6fuW3qd6Vl6doockjP0DCkORVEUzSi0ZVG0qIVyHEVyEllB4MBQFidIFAcwEMOwPkQBAn8IYiRCEiCAbEOG4Fh2EpIySZmJaMmiNcow4jI0Z4az9yzdM93Ty1vvrZMPdU5V3Xr3dfdschGX776716/+9a9TVff1EDND01eO9rGexAxYOS0D8MBW4I6NwEQD6OTA8XngrVmgYMAQkNUBUwOKHIBd8/IEgNc8StKvHaiv67gDH/glsLVgZjBbgBnvvPY7673NdafaLbmIcQA19QtHhsgtJgPYAmAQAANglAjN0Yn8MWY8Aea7AbubwTvZ2klmHmVbjBXMQGFX8oKXbWGvsuV3i8K+Y3P7l5bp8Oj4lte/chQ53O0YWD/o251uCdi6gCU4NedBlcZkaIJQtwUOZjX+YJbxR8A4COLdnZV8pLfSRXepheVLc1g4fwndpTb67S56yy0UeQ7KaBzg8axZ296YHDvQ2DD+icbkGEY2b0Rjw/Jlm9uXi4JfJKr9zz1333NFap2CZg+ayD2kZbgnvb3ppsFm5BQrj0oWyPoWBoTNtQz7a3U8Yer8t7IM+7jASK/Vp5XZeVw7exnLs/PotzrIO10U/R6KvADbArYowNZV16KbwxaFwJ+HLdx3W1iYem3b2I6tn5vYveNzYzt39I/+8P89VxT2vxS5ff7Q4+9nAPjK0T4BABExM+HHARUAal/46oz/cuCnpq/7AgU7aRjC6LUupuY7uAMG+zZswBNUx8eIeFe/U9SuXVjA7NvnsDR7FUW3B7YMLgpYa8G2AAAQUTBXGgYgwMk7XSycOIOrx04CRPWxXTs/PbF376drkxv/8vt/8uf/Ni/s7z77pZ/OAeBm3TTmtJ50S6ygX6A228K+HPRMo05P79nM+0Zy3jy72M8unZjDleOX0Lm2hLzThWULAoEH2ifxEjVmEEAGrrVLIOsxehgINi+wdOo0Ft89ifrUpvvG7t7/37INm37tI7/5wq98+zeeeoFAICIQGVjY62gebyzdNFgGstMrOLB5nP7ullH6+akm3T2zkptjP7qEc29fQH+5jbzfd1UbNBxq5cWj4zzM1SC7fd2rV9Ce+zPUpqb3N/ce+JPHf/V//cHE45/654vf+x/nmMRjb7Mj3DBYQwADEybDe5cJv9Aw/Nmm5e3nz7ToR4dPY/7CPPr9PlAwtIIrUGYGOOBVfjzAm+KaP6BUBelOo4Glf/UyeldnYbbd9RkzfeeTjfc9/cuHHnrsD179r79+m/V6E2DJYFNm8MH6CH6xMcrPrPTsxMzbc7h47BJWFpZQ9HIhxWCG81RmsC3nif0xDnZoz3mQdGm/6t+AYAFyVZ3lk+AKgQuLYuY48qsXp+yO+7/x6ne/89v1Bz/5qw8/+sEubqMh3ChYA+DBegP/rFHnD/eWu80Lb8xg8dwV9Fsd2LyQwwSqBLGOkwAGKiSqoOMN0RKki/LpVCLkDiWAI/voLIFO/QWKzfv/Sbe55eFXXnr5576AD88BwNe+uOuWAzY3cE6TDB6p1fgfk+GPriy0mif+7BiuHJ9BZ3EZRZ5L70YV6sKmsjKDghEfG1kF86ATB8AAVJG6CuNAehWHxsp9NyBr0Zg9CrNw7vFuq//Ky89++z0A8IWvztAXvjpzS133esEaALuI7DNA8amVuaXs9PfewdL5WeTtjusyWgtmG9bBsDZA9l1KcKkAtJr774BAj0QrIvSJWbSrUXTUuBGBmaQLiNL+5tIp1JdO39dp9f73i9988Q494lYCvl6wGZF9kpD/05UryyMX3ziF9pUF2CIP4GK4sWIV6gBkXeDVXAaa+q5agCqW/DpEpQqQDIGM8QvEe4kIo90ZjLbO3NVd6b740h99e1uEH7cC7vWAHQXsY8y932xda03OHj2FxZlZ9DodcKFAOVqsBP/6yYmaQ2Om2xFZADO7EHbAPF1l92sa80I+OEAGDFjglwpALGIsv4iR/PL+1mLrjw//nx82EcUgNwv3esBO2aL1662rSzsvvnYMC6cvoN9qe4Vaa2FtES0xbLeNo22WrSsQBWpjy1Dvdaq2rA2fgxvcGALb1XdCDJWCQiFeS8bvU+VOFufQtAuPXjhz4bcQmcbNwl0v2LG8v/j3uq3ORy++fhLLl+aQ93pgW4ALUWRRuCWyA1vYCCgL/KBkVa8tNWTWN24+aTThyQZ4OmDGXrUkIS5F4W60zRjXo5OFiLDRnoWx3X/47O899zeFyU0rdz1gqdtZuLfT7vzrS6+fxOK5GXSXV/xAiUL10GSAxBZuDKCs5qDSoHQuKdlbBIL3+lCNXYNUViuglsAkkQFlYBi3kPsEZWDK/LGqYCKDDAU25qdgi/w/v/jfX9LG7KbgrieOHem02/9u6czs+OK5S8i7PckLw7IByPoqSFF3k30Vlf9b67dZywBXQPVV34bGzGrDlsS4jKBSvy1EBb4RgwGMKySyFqAMgItWiIx0tQ0a3MZ4cWnjSmvnfwTwTMJAY4t1x7trKZbmZ2c+2bq6/NSVoyfRXlhE0e+LKmV4r4gaqXg7R94rKtZj3NBgHEE4qFYgwjdogI3irZCruJ9rfGcgxK1hEEd9VX0WxvjtDFVtBjIGE5hFZjsfe/73v/VplFVb7pncLNhetzPSbbe/cuWtk+gsueDfV/3CurFRGT8tosUWBWyeD4C2RQFrWaByKVqw2mAV1jdW6rPWx7Xl3lYZrgkKVWC6Hn0Sgs96OzC6TthgL6Lo87+5dO5y/WbgrgbWzM6c/9uLF+bvWTx7Ab1W28WrESybqNRKA5bu82rWRk4810EMlmCt9QoNsa0DaiOgHOcx6hA4wBDIWYBnMpDJAOPWQZkHSeK7MG5bk5bRtMv73vju659FuSG7LrhDPbbX6dZaK90vzb9zSiIAC2IGiMW/LMgakAn38wPVREJE+/TxqBZCw5R2a0W1Tr3hOG8FHnQEl8t5JDIASSkY469PbAFrYJlBxHDNAwHEYCaQFCQRYxyXsdKb+pfdVvcbzbEmEKZAY69d1XOHKZZOvX386dbs/MH2xcvIe10fTpXVmqPIC6dkmypV9kd24aODwoZOhYD00YCA8N7qx6TjvikQYlUVldgB0nBKfTbzXhp8VRaKemcmQ4NaaHD7/h8+94Onod5SVuyaaZhiTWul+/nlk+eQ9/sgIlhiEDOIrHtQZokGrDyoZlbzTb7B0aJNlQsgeKvvynIUDWgvDC7MYnbAOJlVILEAG2YnpK7IOgOkkYA8jLVgcvchIzVMPxlo4iqK7sa/A+BbUamWRiqwimorwb75F29MdVY6n+xcvAhb5MHk5SHIsMuEZIjICktTgqpdTN/nBwJAfbSo5WcEyLG/lqIsBpyAWLLpUEKhA9A5inBndru8jQhMN0TkjhcTJzBggDovwBb8iTM/PLnpPe/fOx/hid+MuC4roMWry59pX5gdybsdqdZRVS8K2FwjgbxkDf57LtU/d1W/0I6CdBqstYBEB1Y7C77TUO51aQH4gZe43w83ROgtALEFhNiapDFz0YCzBBgDQmQNJosGa1wNrNNic+HduZ/D6nZQaQ+pYgkAtVu9j3cvX4LNC5AhGMpguXAPygQiBkoPri2zERGR772nRcscNWgE2KKsZF0PDZ08FgXAof6RNFQaHZQtICQbVGzUtPWCCHahT2oIzBaZXQL1d3wcwO/C168Bs1+fFRx77XS90+o/kS/MgYocxNLKsvEQFWw8FQLxW80k+UdV6O5/LGOo7PJbqupM5LwVZYAEClB9wKFg3D7y7DkCDHl29U4Gwc3SEsvz6gXZuuNsVFC0BNOnv9Zb6jYak00da9MlhjrgtQNgT7x54v7etcUp9LogIhgGLLkbk5FgmxjGSJWUd4vIx5Cuevo7UhJ3MjuALBhUwSDfKClodQQnXpLTXcGylev5RjPkVaw9hFBgsDS+LvSSNoALKeioHTLWFxajQEbdDXOvnrt/15P3vAYfp8AAKIJqBlVbAjt3ukWtpc77i2sLqBWu6lsjrb/EeqTy0BEmqwrV+JbA8i4AEekadDgvNESJj0aZczD0HrFC5QiWRtMjCXGACpBkIMd9Z3EM10gRucYXVINhlhdGyDEjAnMBWOkamzZ4pfcwgNcjqLEdVKq2BHb21Ap32/kD1FqEsYUzdWYZdjPuoYxckzWGhPS7EXUWqKRU9lYhn76ek7uMPBdrp4JI1BpVSw7WEr8xE+C647UMglvovVzDSMYKAePAex9ylsFsXSEYV4Mo6yCzOAD3YqWNluBUqVJSsADQ6+T3NtotcGGdP5EbhXeAXU+GiGDVoyCeCzg/jjKv4L3vCmz1TH2cYFrkFQaOQrdSlY8b5kDQ51LLrQRVQjFpK1zMquZuRYMC1spjS41k00WN6G5hVSBECKnfllIMlgCg3y321PttWFWstLrEptRoaQzrIgHnv1xw8FgCCEUAA/LK1U9fdwQMyMW03q9l/NUXlBaKgA5qVRsgX/BAgCptIkhDUJJhRNaGjTxYgkC11lEzOWoZ7YJTbBbBtT5jFXYwEG71e/k25D1Ya2GMqMAY17XUCIAI+qoOqarZelX5AvAQSNQOt49dnBj6T/F7AWIPjFLVDyrVSUE5Wm1IIScVkwWuIXbeLEOURHA+qzyI4SJKqd3GtR9MFjWizRFYhUvJEt21wgryrh23eR+GGLYofIyqYx3GGK8ykIGJIAe1WrFFEwG1si4NlAkwYqsKoMlBNKIoE2yFPWwH2vVEtQYE9WtE4O0AcM+mgy56bYVt1Je41EzVamZMWOUIVqCqrUwKVp8SRd9OwvadmlSd0qI6b2WXSWZXqJF/upJmd0+RnYNMsGwErgNGVsYfpKXxD+DvR34fpEDUt/2MhRaAeiyRaxYUMIV6ACshF9QX2Fd/MAdvtS6q0RcdGYx6zYwLqwyDvbBKOxiwgjyXyT/NJJGHypB5emm9rZEqz5lTLZEbSoQV20A4B+7JrXQwXHU0olw3WVKu8gI1qSEKk2LYUnVJxMBRXYCKNQOMTP34qRp3VwA2FIK87RdAW9RqBly2ghSsB5oq1qvW5rxkLU0SFe7BDUFzTwQ3fGgkg7pfMq42wAqBWAajWDhJg2FCwO/UQ1LtdIBEIwJRvpExAZDYi6jeiGq1K40IqkQVwXctmDJQhVq12jOTmxeDfLdAltXQaJpWt6zWKtVGvYwKj+WCVyybScN9Oc7IQ0XjAla7gsE/ARn1QiZ3EtUXBmRkWNDA2YMPaeKylt68wJRN4pgyb0UE1nUBquuhEYMrBD9e4fG6QlQf1c6ARD/+QWLnJCAzNdQbWbtbtoJUrQOpahBmtmCzI5MxO1fiYvJEYEMyfiAPFynaPWvhMkwClCQwl86GtvQ6PKiAXYMTRRL6/OqlRKHQ9PoeduTzqvoocgBIOjcC2cesBdxIl+TPFmBkLvCwri1pZA3Um9k1lG2gymMHrKBEnYjOWTTey7wsACyYCUY6B/5wadjIShSg4wMaKxH7DIZgRGJFEx0X7SrFqhrzImwjwP22SbcZqTFGlRs8G1C1uw6HFyXLGKzGslqDILisC1NZnm2kPoraSDaLQRtYbVaBBqyAiE700UTDsq8WrjcjK5Z9FfWaYKlC8kAuurFuTsm48QWGelmoikSZn1XQAMA/h+9RkVdogB599wNDpM/vseoF3Sa9OosFSMvP1vsp+RvD531ydAzZSO0ChqsVVXDTxovI0Bs5jZWmT4ItszQkUpXIxYUg9+4pGZIJR/hoQofj1BaIMzdIQ1noHEUFVepUyKdv/aPXg0LoJb08VbvWkDAIETLBYm4iEq1lqlbWgreQHhthamwSGK2fHgI1hTu88WqONI90e5MyGKEta+gASH131QnaWmvjYGXEzUgV0xbf+Zqv+d6zwxOFWVflohYQz6dpvhwJVWroYod8xm/lhDwALvL2vhD+77vCMqYgDeX0xo1ojTVOrAIUybo8XZIOPfbgm4UZXSxQL79L5Sf54FpXnaJmThZICBOPHLmMxdPdmlWdKPQNiofqazf82y7q6wLRDSOUoZasI17StoFMad2/LBdZzUi9gU0bJloLI/UzGG4BlZHBANjpXdNFZmrf6WdTbh4K5Wlp936VBcNG2wWwRfTKUFACQxwB2mMkZQuoA3v1qhlEA+RS1Ym1txWAKiCC8UBJOie6uMN1X3ROtK42El7kIOyY2gSM1o7a0IUbCnJNsABQr9Wey7Npl3GvzkSZUJi6yLuuSBWsClVVilqlMMCQvjuUtAOfKIzZhVysmU9rpYcT8q9vHOr3MIUUU49Vrvbk9t25bSs6zdqRCqBrAq4Eu+fu3X9sa9u6OgXHSEEpcOvCMVWvnM9a9TkCqD4sq5olt0mm8/xgNocM6rAe+XahBKT0KeeEN7gRjqcy3HBOGbJCrWc17N0x3T9n6odXA3hdYA8+enCxXms+Z2s7g8qixVtEyKqvcx5i6RwExcf/aUFpYxrVOB1MUch+6ie+qWch4xIcRr6qlhJcVWeiO+1Y3LNzGjxaf73N1EL5rqj4vj6wADA2Nvp1buwNvpguFcBLIJPEoQSgk3Xhu8IP2/0EtofpzivFqaI87zADabUaG/fy4kjCLYfu2Y05qr2KMsQ1gWoaBpYf+cSjL9Xqm49StsXdtkq5pZa9KkKIVRk/l6oaoXFLn5hpaDbiHlXpZeRSiDVknapBxx3gPVs3Ynp6w8XjHXoD4Scm8U9N1gRdBZYBoNao8fj42L+vNQ/EMq1e1ijI8k+OEocIByXXHJ4GgN7i9KEH78JMnr3MbqZAJw/1ceN1/0jpNUyys1QSDzx96I8ajR0nTG17yVP9gavBHlArkrMZkF/MxCCr1vyWyKcr08C9KtaHFIhe8+6dm7B755YrbyzyayiDTQGniirBHqpYAFwbqReTmyd+Y3zkYfixy+TA1ZaBy5YKYjiAGG7Vrxnju/OQu1XkdWBfakKGgI89tg/HW/yiZfTgwMZLFdw0E+5aQ+7sT7z34w/86djolucnRh6QPUMUau3wfbEyK/PJ/sP/doHlvVm5pysTHjxNCiuORob6vI+hq7wI+OuH7sTIhvF3X79q34Sb39KlSrlVluCfLFVsKjoLwG45sP3LG8cPLTdrW6uoROUWFWCiSB/byn+W9U3DpINRulakytK1uQRTlTcQ6iG6FpePKZ3DjD3Tk/iZR+/qvXKxeB5APwGrcIepdgDw0HArPmHToZ3nJ6Ynv7x944dBprFq9bdcsa2clZLyQmyR3LaqgUzi6IHjYrjQmhIYVMbYYDSbGT7/sfvx1gJenmvZKwI2hruWFQyktPEqAY0uZKefuvcPJ6a2/OHuTU/A96AiOKVLMHwGtCqXlRRnnoMFxFU3OSb+UV3YFv8GV9ft4LXUo/2+cA7Y4hc++hPoNkbefvV8/0cAerKkcKssIQXsqVRZQRXcAkAx9cSdX94yde8be7Y8ngBNL8FhrweRHKajZP4WoTDSqEIB6BL/qDkAis8pHx/DTs/5zEfuw967ts09+073TwF0I7Ap3LQRGwo1BltRFwdUW5iJRmvs4R2/smPLe8/u2vQQyg1T8uA2qorJupteL6tqQM0lKAFYUGxQn19sCjJWaLlQmC2e/OB78IGH7lj65ludZ3sFrwjYKrhVih3mrxyDrUolK9DSynZMXG4+sO2Le/c8fmHP1vfJkakcU5VGPTRvF2lVT2HEcbCAtqliB6t16Y9QpEt0zFOP3YmP/9R9K9/4Uev5hY5dANCJFoXbj5bUZ+Oe2EBKZxCqrICji+YActo1OUM184/uG/nQfxgdGdtz/PyfB1+FG6lyA00CjSBTNm6aBswy7iIq9fP8XNrG/i1rRHVLpsb9K0AsMxRUHtBG1PWN8k/M+Pkn9+NDH9i7/PUjKy/Mrdi5Cqixaqsig5TPQEOWHfrkl+LvVaPj8RJmKMcbbWwceWU7bX5oanx6enbhtPtjZX60KYwi+eES/7IFwjBdeTQ6GeILo01hWI/9NfUhw2coGP/dRwQWY80afvmzD+GBg7vnf+fwyktXV+wVACvR0pKlLUuVeqsiBE1+fRjYqkFdgwQuN2v9fMv4d6bN+NRdW+/df3XxAtq9lh/BdzjN4LBdPLQXASzBTeCTflW4MdU4SwrVe49b7tq9Ef/ql34S/ebEya8fXnml1eNrCdQUbKreGGrcgFWmKrDpepVyPWw2xO1NY0cmao1LB3cdeMgQ1efmL0htj0btFaDfVgYHvw8RcIqehMpPNUg0eH0EtGYIz/zMfvyDz74v/+6Z/MgLR9uvF4xlARgD1c9YrR2s3oDpAwwALoH92hd34ZuHl6oUGwNOJ9UMANMea57PRxuv3rtlz/b9d+zbtbxyDYvLC9CB5fiPjA2qVu+QqhUDcP3LbqRjF+Vq7ycwwXjwJ7bjX/z9x7D9ju2Xvn545dV3LvXPYVClMdz1QFWPHWoDwPCffOpBhPB+sEYG8TuiGVxVMQDMSqN+7kSj/lu7JpqPfmrH5z4/O3t2+vuvfQ/nLp7zAT/pzzXjxkmQ6TsIDLgfjegLIzrnTwjvyVoHnXW4Q1+BAuH+fdvwmaffiz13bG2/8GbrzdfOLp0VYFrVVwAsrwK1i+reVzw2G0qzItEv/qfz/svXvrgLgP9THakq9d2lGoC6LE0AI7KMAhiTZdwAk/eY/Kd31OxHr165tPXIm0fw1rF30M9zwP+NAPcDYeh69CtBUNW2MLXtG0L5HGnW8ZPv34uffeI+bN021fr+u52T3z3ePllYDysFu5a/VgEe1kEYgLvany5JZa6aiV8TH/p2iAVwzNa+fbyHV++Z3vO+p35292N/4+n+vndOvmvePn4Cx06exnK740qXXYVwtdgp1zdRGlZZBC82ADNjw+QoDh28A48ceg8eOXQnX1rmK4dPd86+dmR+xrJveBRqDDb21NWigOvpGJRSpWKBoaqtUm4DTrmq3tFoUQWPAhibqGHrvkl6cNso3b1pJLtjYf7K6NkLF3Fhdg6zcwu4em0Jy60uOt0cvbxArVbDyEgTE+NjGB1tYHrLRuzeuRl37t6Cffdsx9atm/ozi8X8qbne3P89051ZbNs2yr2mOD6NwabrKdgU7lojWwNprT+2E59kk30p+PS8uEtcACiWc+RH5vka5vkHBDuya3Jq1669m3c/ctBs3jBiNm0YNRtGatQcqZt6vUaZ/Ggmzxl5wZQvdm1roWVbV1bsyrfezRfO/uDqNY46LgJCocaKjVVbtVT1uKrGB9Y1sgUkiq3an0CMX2FU1caem6o39t/4Uxc9thFdQ6+pNUPvGyfNYKlHiOCHVWAVbvxZ1dsa1mhVDW6vu0u7WooVeD3HxtFEqiotiNsFVu0gBdxFdfd1NahrqjRO67ECSj41Y5BteXJ8agM2esgYbBcBagpWa0PcOKbPNezaqR3E6lWg8b6qUawca6t0VcjrUWwKVVOs3Dw6dsBbETKfqrWLarUO++kPsHptqIKbQqxSaOypeXTdYQ3VmspdrxWsBbdqVGxgyDHJiHryMKjXA3Y1uDHkeNuw6Ze1Wv912cH1euxayq0aSkszr5mroxpqqta1rKBKtTHcGGDVdEtVOHVTUIHr/xvd16vcGKpmvoag2BTmampNFTtMtVXqTUFWKTQdA7hhqMCN/fHz1eAOq65p5jO4DA8DGv+eSiOC+Np6v7jwVgOcbq9SaBXQG4IK3PhflU/h6vcqVaXKUoB5tJ4CHabW+P7DCi+tJVXKrAJ6Q63/sHQz/3LHaqGYftcHNtGnwo07GsN+Q5WqNb633iuFm0JeL8xbBhW4+X8SZZgtxNv1NSYFq3CHgawa1AEGrWBYragCne4fptA4HzcMFbg1/4iPQtT1NMWjYZqhdMB82HrVgHua+SpQ61lHxToq1m8o3ZJ/HQnhQVL1ptBjL7YYVOZqSh12z6oGZ7UFFevpNW863SqwmtYCnDZyVRBToOsBq59VsKv2xZ/p+i1JtxqspmGAdd8weOuFmt5nvZ+rrd/SdLvAaloNsO6n5DhUrK/nHutdr/p+y9PtBqspzshaPhwfd73Xvt5tty39uMDGqQre7QLxY4UZp78KsHGqyvh6lbqea/2Vpf8PERH0oGsOO4EAAAAASUVORK5CYII=';
                  obj2.symbolPosition = 'start';
                  obj2.symbolSize = [86,90];
                  obj2.symbolOffset= [4, 102];
                  bgData.push(obj2);
              }
            }else{
              $this.hasData = false;
            }
        }else if($this.type == 2 && $this.language == "英文"){
          // 英文成交个数
            chartBotData = JSON.parse(JSON.stringify($this.producttop10.productscoretop10));
            if(chartBotData.length > 0){
              $this.hasData = true;
              showchart = 1;
              for(let i = 0;i<chartBotData.length;i++){
                  xAxisData.push(chartBotData[i].aliasname);
                  seriesData.push(chartBotData[i].number);

                  var obj = {};
                  obj.value= chartBotData[i].number;
                  obj.symbol = 'image://' + chartBotData[i].pimg;
                  obj.symbolPosition = 'start';
                  obj.symbolSize = [68,68];
                  obj.symbolOffset= [0, 82];
                  obj.symbolBorderRadius= "50%";
                  picData.push(obj);

                  var obj2 = {};
                  obj2.value= chartBotData[i].number;
                  obj2.symbol = 'image://data:image/png;base64,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';
                  obj2.symbolPosition = 'start';
                  obj2.symbolSize = [86,90];
                  obj2.symbolOffset= [4, 102];
                  bgData.push(obj2);

              }
            }else{
              $this.hasData = false;
            }
          }
        
        if(showchart == 1){
          var chartDom = document.getElementById('HotProductChart');
          var myChart = echarts.init(chartDom);

          const CubeLeft = echarts.graphic.extendShape({
              shape: {
                  x: 0,
                  y: 0,
              },
              buildPath: function (ctx, shape) {
                  
                  const xAxisPoint = shape.xAxisPoint;
                  const c0 = [shape.x+3, shape.y]; //+9
                  const c1 = [shape.x - 15, shape.y]; //-9
                  const c2 = [xAxisPoint[0] -15, xAxisPoint[1]]; //-9
                  const c3 = [xAxisPoint[0]+3, xAxisPoint[1]]; //+9
                  ctx.moveTo(c0[0], c0[1]).lineTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).closePath();
              },
          });
          const CubeRight = echarts.graphic.extendShape({
              shape: {
                  x: 0,
                  y: 0,
              },
              buildPath: function (ctx, shape) {
                  const xAxisPoint = shape.xAxisPoint;
                  const c1 = [shape.x+3, shape.y]; //+9
                  const c2 = [xAxisPoint[0]+3 , xAxisPoint[1]]; //+9
                  const c3 = [xAxisPoint[0] + 15, xAxisPoint[1]]; //+21
                  const c4 = [shape.x + 15, shape.y - 6]; //-6
                  ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath();
              },
          });
          const CubeTop = echarts.graphic.extendShape({
              shape: {
                  x: 0,
                  y: 0,
              },
              buildPath: function (ctx, shape) {
                  const c1 = [shape.x+3, shape.y]; //+9
                  const c2 = [shape.x -15, shape.y]; //-10
                  const c3 = [shape.x -3, shape.y - 6]; //-6
                  const c4 = [shape.x+15, shape.y - 6]; //-6
                  ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath();
              },
          });
          echarts.graphic.registerShape('CubeLeft', CubeLeft);
          echarts.graphic.registerShape('CubeRight', CubeRight);
          echarts.graphic.registerShape('CubeTop', CubeTop);

          var option = {
              tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                      type: 'shadow',
                  },
                  formatter: function (params) {
                      let returnData = '';
                      let name = "";
                      if($this.type == 1){
                          name="询盘个数"
                      }else if($this.type == 2&&$this.language == "中文"){  
                        name="成交积分"
                      }else if($this.type == 2&&$this.language == "英文"){
                        name="成交个数"
                      }
                      for (let i = 0; i < params.length; i++) {
                          returnData = params[i].name + '<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background:#1e4acd"></span>'
                          +name + '<span style="padding-left:13px">' 
                          + params[i].value + '</span>';
                      }
                      return returnData;
                  },
              },
              grid: {
                  left: '50',
                  right: '1',
                  bottom: '5',
                  top: '24',
                  containLabel: true
              },
              xAxis: {
                  type: "category",
                  data: xAxisData,
                  axisTick: {
                      show: false
                  },
                  axisLine: {
                      show:true,
                      lineStyle:{
                        color: "#323958",
                        type: "solid"
                      },
                  },
                  axisLabel: {
                      rotate: 0,
                      interval: 0,
                      margin: 94,
                      formatter: function (value) {
                        var num = value.split("").length;
                        var str = value;
                        // if(num>6){
                        //   str = str.split("").slice(0,5).join("\n");
                        //   str = str + '\n…';
                        // }else{
                        //   str = str.split("").join("\n");
                        // }
                        if(num>6){
                          str = str.slice(0,5);
                          str = str + '…';
                        }
                        return str;
                      },
                      rich:{
                        addtext:{
                        }
                      },
                      textStyle: {
                          padding: [2,0,0,0],
                          fontSize: 13,
                          color: "#ccc",
                      }
                  },
                  splitLine:{
                      show: true,
                      lineStyle:{
                          type: [4, 3],
                          dashOffset: 3,
                          color: '#ebebeb',
                          opacity: 0.1,
                          shadowColor: null,
                          shadowBlur: 0,
                          shadowOffsetX: 0,
                          shadowOffsetY: 0,
                      }
                  },
              },
              yAxis: {
                  name: "",
                  type: "value",
                  triggerEvent: true,
                  splitLine:{
                      lineStyle:{
                          type: [4, 3],
                          dashOffset: 3,
                          color: '#ebebeb',
                          opacity: 0.1,
                          shadowColor: null,
                          shadowBlur: 0,
                          shadowOffsetX: 0,
                          shadowOffsetY: 0,
                      }
                  },
                  axisTick: {
                      show: false
                  },
                  axisLine: {
                      show: true,
                      lineStyle: {
                          type: [4, 3],
                          dashOffset: 3,
                          color: '#ebebeb',
                          opacity: 0.01,
                          shadowColor: null,
                          shadowBlur: 0,
                          shadowOffsetX: 0,
                          shadowOffsetY: 0,
                      }
                  },
                  axisLabel: {
                      show: true,
                      color: "#ccc",
                      fontSize: 13,
                      inside:true,        // 标签刻度朝内
                      margin:0,           // 清除默认间距
                      padding:[0,10,0,0], // 右边内边距10
                      textStyle:{
                          align:'right'   // 文字右对齐
                      }
                  },
                  splitNumber:4,
              },
              series: [
                    {
                        z: 3,
                        type: "pictorialBar",
                        data: bgData,
                    },
                    {
                        z: 4,
                        type: "pictorialBar",
                        data: picData,
                        
                    },
                    {
                        type: 'custom',
                        name: $this.type == 2 && $this.language == "中文" ? "积分" : "个数",
                        renderItem: (params, api) => {
                            const location = api.coord([api.value(0), api.value(1)]);
                            return {
                                type: 'group',
                                children: [
                                    {
                                        type: 'CubeLeft',
                                        shape: {
                                            api,
                                            xValue: api.value(0),
                                            yValue: api.value(1),
                                            x: location[0],
                                            y: location[1],
                                            xAxisPoint: api.coord([api.value(0), 0]),
                                        },
                                        style: {
                                            fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                                {
                                                    offset: 0,
                                                    color: '#a4fdf9',
                                                },{
                                                    offset: 0.5,
                                                    color: '#87d8fa',
                                                },{
                                                    offset: 1,
                                                    color: '#5496fd',
                                                },
                                            ]),
                                        },
                                    },
                                    {
                                        type: 'CubeRight',
                                        shape: {
                                            api,
                                            xValue: api.value(0),
                                            yValue: api.value(1),
                                            x: location[0],
                                            y: location[1],
                                            xAxisPoint: api.coord([api.value(0), 0]),
                                        },
                                        style: {
                                            fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                                {
                                                    offset: 0,
                                                    color: '#4785fe',
                                                },
                                                {
                                                    offset: 1,
                                                    color: '#1e4acd',
                                                },
                                            ]),
                                        },
                                    },
                                    {
                                        type: 'CubeTop',
                                        shape: {
                                            api,
                                            xValue: api.value(0),
                                            yValue: api.value(1),
                                            x: location[0],
                                            y: location[1],
                                            xAxisPoint: api.coord([api.value(0), 0]),
                                        },
                                        style: {
                                            fill: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                                {
                                                    offset: 0,
                                                    color: '#c8b6ff',
                                                },
                                                {
                                                    offset: 1,
                                                    color: '#a385fc',
                                                },
                                            ]),
                                        },
                                    },
                                ],
                            };
                        },
                        data: seriesData,
                    },
                    {
                        type: 'bar',
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                color: '#ccc',
                                offset: [5, -5],
                                fontSize: 13,
                            },
                        },
                        itemStyle: {
                            color: 'transparent',
                        },
                        tooltip: {
                          show: false
                        },
                        data: seriesData,
                    },
                    // { //shadow
                    //     name: "",
                    //     type: "pictorialBar",
                    //     symbolSize: [17, 4],
                    //     symbolOffset: [3, -5],
                    //     z: 1,
                    //     itemStyle: {
                    //       color: "#1c2042",
                    //       shadowBlur: 9,
                    //       shadowColor: 'rgba(85, 149, 253, 1)',
                    //       shadowOffsetY: 8,
                    //       shadowOffsetX: 0,
                    //       opacity: 1
                    //     },
                    //     data: shadowData,
                    //     tooltip:{
                    //         show: false
                    //     }
                    // },
              ]
          };
          
          this.myChart = myChart;
          // 使用刚指定的配置项和数据显示图表。
          myChart.setOption(option);
          this.echartsResize = this.myChart.resize();

          myChart.on('click', function (params) {
            let dataIndex = params.dataIndex;
            let id = chartBotData[dataIndex].typeid;
            let productname = '';
            if($this.type==1){
              productname = chartBotData[dataIndex].productname;
            }else{
              productname = chartBotData[dataIndex].xunproduct;
            }
            console.log(chartBotData)
            var date = new Date();
            var endDate = '';
            var endYear = date.getFullYear();
            var endMonth = date.getMonth() + 1;
            var startYear;
            var startMonth;
            var startDate = '';
            if(endMonth>6){
              startMonth = endMonth-6;
              startYear = endYear;
            }else{
              startMonth = endMonth+6;
              startYear = endYear-1;
            }
            startMonth = startMonth<10?'0'+startMonth:startMonth;
            endMonth = endMonth<10?'0'+endMonth:endMonth; 
            startDate = startYear+"-"+startMonth;
            endDate = endYear+"-"+endMonth;
            if($this.language == '中文'){
              $this.$router.push({path:'/stat/cn/productAnalysis/ProAccount',query:{starttime:startDate,endtime:endDate,productname:productname,typeid:id}});
            }else{
              $this.$router.push({path:'/stat/en/productAnalysis/ProAccount',query:{starttime:startDate,endtime:endDate,productname:productname,typeid:id}});
            }
          })
        }

      },

      echartsSize(){
        if(this.myChart){
          this.myChart.resize();
        }
      },
      goPage(){
        var $this = this;
        var newDate = new Date();
        // var newYear = newDate.getFullYear();
        var newYear = $this.year;
        var startTime = newYear + "/01";
        var endTime = newYear + "/12";
        var baseDepart = "";
        var contrastDepartArr = [];
        this.departList.forEach(function(item,index){
          if(index == 0){
            baseDepart = item.id;
          }else{
            contrastDepartArr.push(item.id);
          }
        });
        var contrastDepart = "";
        if(contrastDepartArr.length>0){
          contrastDepart = contrastDepartArr.join(",");
        }
        $this.startTime = startTime;
        $this.endTime = endTime;
        $this.baseDepart = baseDepart;
        $this.contrastDepart = contrastDepart;
      },
    },
    destroyed(){
      window.removeEventListener('resize',this.echartsSize);
      if(this.myChart){
        this.myChart.dispose();
      }
    }
}
</script>
<style lang="scss">
</style>