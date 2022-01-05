<template>
  <div class="fold-button" :class="{'is-fold':isFold}" @click="toggleClick"><i class="svg-i"><svg-icon icon-class="menu-fold" /></i></div>
</template>
<script>
export default {
  name: 'Hamburger',
  props: {
    isFold: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    }
  }
}
</script>
<style scoped>

</style>
