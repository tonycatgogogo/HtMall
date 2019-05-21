import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/home'
import Cart from '../views/Cart'
import Address from '../views/Address'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    },
    {
      path: '/address',
      name: 'Address',
      component: Address
    }
  ]
})
