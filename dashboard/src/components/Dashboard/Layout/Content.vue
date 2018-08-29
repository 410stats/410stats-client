<template>
<div class="content">
  <div class="container-fluid">
    <div class="alert alert-danger" role="alert">
      <strong>Attention:</strong> L'IP du bot surveillant les topics est régulièrement bannie ces derniers jours. Il risque donc de manquer une partie des topics dans les statistiques et le live peut s'arreter.
    </div>
    <transition name="fade" mode="out-in">
      <!-- your content here -->
      <router-view></router-view>
    </transition>
  </div>
</div>
</template>
<script>
export default {}
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .1s
}

.fade-enter,
.fade-leave-to
/* .fade-leave-active in <2.1.8 */

  {
  opacity: 0
}
</style>
