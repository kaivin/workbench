<template>
    <div class="breadcrumb-wrap">
        <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'

export default {
  components: {
    Breadcrumb
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
    .breadcrumb-wrap{
        width: 100%;
        background-color: #fff;
        font-size:0;
    }
    
    .el-breadcrumb{
        height: 48px;
        line-height: 48px;
        padding: 0 16px;
        :deep(.el-breadcrumb__item){
            :deep(.el-breadcrumb__inner){
                color:#97a8be;
            }
            :deep(.el-breadcrumb__inner.is-link){
                color:$menuBg;
                &:hover{
                    color: $menuActiveText;
                }
            }
        }
    }
</style>