<template>
    <div class="header">
        <div class="nav-center">
            <hamburger id="hamburger-container" v-bind:is-active="sidebar.opened" class="hamburger-container" v-on:toggleClick="toggleSideBar" />
        </div>
        <div class="nav-right">
            <div class="item-nav"><a href="javascript:void(0);" v-on:click="linkTo">{{userInfo.name}}</a></div>
            <div class="item-nav"><a href="javascript:void(0);" v-on:click="logout">退出</a></div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
export default {
    data(){
        return{
        }
    },
    components: {
        Hamburger,
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'userInfo'
      ]),
    },
    methods:{
        // 退出登录
        async logout() {
            var $this = this;
            await $this.$store.dispatch('login/logoutAction').then(response=>{
              if(response.status){
                $this.$router.push(`/login?redirect=${$this.$route.fullPath}`)
              }else{
                $this.$message({
                  showClose: true,
                  message: response.info,
                  type: 'error'
                });
              }
            });
        },
        // 侧边导航伸缩
        toggleSideBar() {
            this.$store.dispatch('app/toggleSideBar')
        },
        // 跳转到个人中心
        linkTo(){
          var $this = this;
          $this.$router.push(`/User/personset`);
        }
    }
}
</script>

<style lang="scss" scoped>
.header{
    width:100%;
    height:50px;
    border-bottom:1px solid #f6f6f6;
    background: #fff;
    position: relative;
    z-index: 1100;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
    .nav-right{
        display: flex;
        -webkit-box-align: center;
        align-items: center;
    }
    .nav-center{
        flex: 1;
        height: 100%;
    }
    .nav-right{
        .item-nav{
            display: inline-block;
            >a{
                display: block;
                height: 50px;
                line-height: 50px;
                padding: 0 10px;
                color: #333;
                transition: all .28s ease-out;
                position: relative;
                font-size: 14px;
                &:before{
                    content:'';
                    display: block;
                    width:0;
                    left:0;
                    top:0;
                    height: 3px;
                    background: $menuActiveText;
                    transition: all .28s ease-out;
                    position: absolute;
                }
                &:hover{
                    &:before{
                        width: 100%;
                    }
                }
            }
        }
    }
}
.hamburger-container {
    display: inline-block;
    line-height: 50px;
    height: 100%;
    padding: 0 15px;
    cursor: pointer;
    background:#fff;
    transition: background .3s;
    font-size: 0;
    text-align: center;
    position: relative;
    ::v-deep .hamburger{
        path{
            fill: $menuActiveText;
        }
    }
    &:before{
        content:'';
        display: block;
        width:0;
        left:0;
        top:0;
        height: 3px;
        background: $menuActiveText;
        transition: all .28s ease-out;
        position: absolute;
    }
    &:hover{
        &:before{
            width: 100%;
        }
    }
}
@keyframes rotateMove
{
  0%{
    transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
  }
  80%{
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
  }
  100%{
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
  }
}

@-webkit-keyframes rotateMove /*Safari and Chrome*/
{
  0%{
    transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
  }
  80%{
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
  }
  100%{
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
  }
}

@keyframes opacityMove1
{
  0%{
    opacity: .4;
  }
  50%{
    opacity: 1;
  }
  100%{
    opacity: .4;
  }
}

@-webkit-keyframes opacityMove1
{
    0%{
        opacity: .4;
    }
    50%{
        opacity: 1;
    }
    100%{
        opacity: .4;
    }
}
@keyframes opacityMove2
{
  0%{
    opacity: .6;
  }
  50%{
    opacity: 1;
  }
  100%{
    opacity: .6;
  }
}

@-webkit-keyframes opacityMove2
{
    0%{
        opacity: .6;
    }
    50%{
        opacity: 1;
    }
    100%{
        opacity: .6;
    }
}
@keyframes opacityMove3
{
  0%{
    opacity: .8;
  }
  50%{
    opacity: .4;
  }
  100%{
    opacity: .8;
  }
}

@-webkit-keyframes opacityMove3
{
    0%{
        opacity: .8;
    }
    50%{
        opacity: .4;
    }
    100%{
        opacity: .8;
    }
}
@keyframes opacityMove4
{
  0%{
    opacity: 1;
  }
  50%{
    opacity: .4;
  }
  100%{
    opacity: 1;
  }
}

@-webkit-keyframes opacityMove4
{
    0%{
        opacity: 1;
    }
    50%{
        opacity: .4;
    }
    100%{
        opacity: 1;
    }
}
</style>


