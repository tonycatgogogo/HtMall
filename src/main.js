// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import lazyLoad from 'vue-lazyload'
import infiniteScroll from  'vue-infinite-scroll'
Vue.use(lazyLoad,{
  loading:'./static/loading-svg/loading-bars.svg',
  try:3
})
Vue.use(infiniteScroll)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
