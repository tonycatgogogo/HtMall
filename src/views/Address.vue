<template>
  <div>
    <ht-header></ht-header>
    <ht-bread>
      <span>Address</span>
    </ht-bread>
    <div class="checkout-page">
      <svg style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1"
           xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
          <symbol id="icon-add" viewBox="0 0 31 32">
            <title>add</title>
            <path class="path1"
                  d="M30.745 15.152h-14.382v-14.596c0-0.308-0.243-0.557-0.543-0.557s-0.543 0.249-0.543 0.557v14.596h-14.665c-0.3 0-0.543 0.249-0.543 0.557s0.243 0.557 0.543 0.557h14.665v15.177c0 0.307 0.243 0.557 0.543 0.557s0.543-0.249 0.543-0.557v-15.177h14.382c0.3 0 0.543-0.249 0.543-0.557s-0.243-0.557-0.543-0.557z"></path>
          </symbol>
        </defs>
      </svg>
      <div class="container">
        <div class="checkout-addr">
          <div class="page-title-normal">
            <h2 class="page-title-h2"><span>check out</span></h2>
          </div>
          <!-- process step -->
          <div class="check-step">
            <ul>
              <li class="cur"><span>Confirm</span> address</li>
              <li><span>View your</span> order</li>
              <li><span>Make</span> payment</li>
              <li><span>Order</span> confirmation</li>
            </ul>
          </div>

          <!-- address list -->
          <div class="page-title-normal checkout-title">
            <h2><span>Shipping address</span></h2>
          </div>
          <div class="addr-list-wrap">
            <div class="addr-list">
              <ul>
                <li v-for="(item,index) in addressListFilter" @click="checkAddress=index" :class="{'check':index === checkAddress}">
                  <dl>
                    <dt>{{item.userName}}</dt>
                    <dd class="address">{{item.streetName}}</dd>
                    <dd class="tel">{{item.tel}}</dd>
                  </dl>
                  <div class="addr-opration addr-del">
                    <a href="javascript:;" class="addr-del-btn">
                      <span class="icon icon-bin"></span>
                    </a>
                  </div>
                  <div class="addr-opration addr-set-default">
                    <a href="javascript:;" class="addr-set-default-btn" v-if="item.isDefault" @click="setDefault"><i>Set default</i></a>
                  </div>
                  <div class="addr-opration addr-default" v-if="item.isDefault">Default address</div>
                </li>
                <li class="addr-new">
                  <div class="add-new-inner">
                    <i class="icon-add">
                      <svg class="icon icon-add">
                        <use xlink:href="#icon-add"></use>
                      </svg>
                    </i>
                    <p>Add new address</p>
                  </div>
                </li>
              </ul>
            </div>

            <div class="shipping-addr-more">
              <a class="addr-more-btn up-down-btn" href="javascript:;" @click="moreAddress" :class="{'open': limit>3}">
                more
                <i class="i-up-down">
                  <i class="i-up-down-l"></i>
                  <i class="i-up-down-r"></i>
                </i>
              </a>
            </div>
          </div>

          <!-- shipping method-->
          <div class="page-title-normal checkout-title">
            <h2><span>Shipping method</span></h2>
          </div>
          <div class="shipping-method-wrap">
            <div class="shipping-method">
              <ul>
                <li class="check">
                  <div class="name">Standard shipping</div>
                  <div class="price">Free</div>
                  <div class="shipping-tips">
                    <p>Once shipped，Order should arrive in the destination in 1-7 business days</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="next-btn-wrap">
            <a class="btn btn--m btn--red">Next</a>
          </div>
        </div>
      </div>
    </div>
    <model :mdShow="isMdShow" @close="closeModal">
      <p slot="message">
        您是否确认要删除此地址?
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;">确认</a>
        <a class="btn btn--m btn--red" href="javascript:;">取消</a>
      </div>
    </model>
    <ht-footer></ht-footer>
  </div>
</template>
<script>
  import HtHeader from '@/components/HtHeader'
  import HtFooter from '@/components/HtFooter'
  import HtBread from '@/components/HtBread'
  import Model from '@/components/Model'
  import axios from 'axios'
  import '@/assets/css/checkout.css'

  export default {
    data() {
      return {
        addressList: [],
        isMdShow: false,
        limit:3,
        checkAddress: 0
      }
    },
    mounted(){
      this.init()
    },
    computed:{
      addressListFilter(){
        return this.addressList.slice(0,this.limit)
      }
    },
    methods: {
      init(){
        axios.get('/users/addressList').then(response => {
          var res = response.data
          if(res.status == "0"){
            this.addressList = res.result
          }
        })
      },
      closeModal(){
        this.isMdShow = false
      },
      moreAddress(){
        if(this.limit === 3){
          this.limit = this.addressList.length
        }else{
          this.limit = 3
        }
      },
      setDefault(){

      }
    },
    components: {
      HtHeader,
      HtFooter,
      HtBread,
      Model
    }
  }
</script>
