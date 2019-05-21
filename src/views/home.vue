<template>
  <div>
    <ht-header></ht-header>
    <ht-bread>
      <span>Goods</span>
    </ht-bread>
    <ht-product></ht-product>
    <ht-footer></ht-footer>
  </div>
</template>
<script>
  import '../assets/css/base.css'
  import '../assets/css/product.css'
  import '../assets/css/login.css'
  import HtHeader from '@/components/HtHeader'
  import HtFooter from '@/components/HtFooter'
  import HtBread from '@/components/HtBread'
  import HtProduct from '@/views/HtProduct'
  export default {
    components: {
      HtHeader,
      HtFooter,
      HtBread,
      HtProduct
    }
  }
</script>
