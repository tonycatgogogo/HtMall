<template>
  <div>
    <ht-header></ht-header>
    <ht-bread>
      <span>My Cart</span>
    </ht-bread>
    <div class="container">
      <div class="cart">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>My Cart</span></h2>
        </div>
        <div class="item-list-wrap">
          <div class="cart-item">
            <div class="cart-item-head">
              <ul>
                <li>Items</li>
                <li>Price</li>
                <li>Quantity</li>
                <li>Subtotal</li>
                <li>Edit</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for="item in cartList">
                <div class="cart-tab-1">
                  <div class="cart-item-check">
                    <a href="javascipt:;" class="checkbox-btn item-check-btn" @click="editCart('checked',item)">
                      <span class="icon icon-checkmark" v-show="item.checked == 1 ? true: false"></span>
                    </a>
                  </div>
                  <div class="cart-item-pic">
                    <img v-lazy="'/static/'+item.productImage" v-bind:alt="item.productName">
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">{{item.productName}}</div>
                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{item.salePrice | currency('¥')}}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self select-self-open">
                      <div class="select-self-area">
                        <a class="input-sub" @click="editCart('sub',item)">-</a>
                        <span class="select-ipt">{{item.productNum}}</span>
                        <a class="input-add" @click="editCart('add',item)">+</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{(item.productNum*item.salePrice) | currency('¥')}}</div>
                </div>
                <div class="cart-tab-5">
                  <div class="cart-item-opration">
                    <a href="javascript:;" class="item-edit-btn" @click="delCartItem(item.productId)">
                      <span class="icon icon-bin"></span>
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="cart-foot-wrap">
          <div class="cart-foot-inner">
            <div class="cart-foot-l">
              <div class="item-all-check">
                <a href="javascipt:;" @click="checkAll">
                  <span class="checkbox-btn item-check-btn">
                    <i class="icon icon-checkmark" v-show="checkAllFlag"></i>
                  </span>
                  <span>Select all</span>
                </a>
              </div>
            </div>
            <div class="cart-foot-r">
              <div class="item-total">
                Item total: <span class="total-price">{{totalPrice | currency('¥')}}</span>
              </div>
              <div class="btn-wrap">
                <a class="btn btn--red" v-bind:class="{'btn--dis':checkedCount==0}" @click="checkOut">Checkout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Model :mdShow = mdShowFlag @close="closeModal">
      <p slot="message">你确认要删除此条数据吗?</p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="delConfirm">确认</a>
        <a class="btn btn--m btn--red" href="javascript:;" @click="mdShowFlag = false">关闭</a>
      </div>
    </Model>
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
  import {currency} from "../utils/currency"
  export default {
    data(){
      return{
        cartList: [],
        mdShowFlag:false,
        productDelId:''
      }
    },
    mounted(){
      this.init()
    },
    computed:{
      checkedCount(){
        let i = 0
        this.cartList.forEach(item => {
          if(item.checked == "1") i++
        })
        return i
      },
      checkAllFlag(){
        return this.checkedCount === this.cartList.length
      },
      totalPrice(){
        let total = 0
        this.cartList.forEach(item => {
          if(item.checked == "1"){
            total += parseFloat(item.salePrice)* parseInt(item.productNum)
          }
        })
        return total
      }
    },
    methods:{
      init(){
        axios("/users/cartList").then(response => {
          let res = response.data
          if(res.status == "0"){
            this.cartList = res.result
          }
        })
      },
      closeModal(){
        this.mdShowFlag = false
      },
      delCartItem(id){
        this.productDelId = id
        this.mdShowFlag = true
      },
      delConfirm(){
        axios.post('/users/cartDel',{
          productId: this.productDelId
        }).then(response => {
          let res = response.data
          if(res.status == "0"){
            this.mdShowFlag = false
            this.init()
          }
        })
      },
      editCart(type,item){
        if(type === "sub"){
          if(item.productNum <= 1){
            return
          }
          item.productNum--
        }else if(type === 'add'){
          item.productNum++
        }else if(type === 'checked'){
          item.checked = item.checked == '1'? '0':'1'
        }
        axios.post('/users/cartEdit',{
          productId:item.productId,
          productNum:item.productNum,
          checked:item.checked
        }).then(response => {
          let res = response.data
          if(res.status == '0'){
          }
        })
      },
      checkAll(){
        let flag = !this.checkAllFlag
        this.cartList.forEach(item => {
          item.checked = flag? '1' : '0'
        })
        axios.post('/users/checkAll',{
          checkAll:flag
        }).then(response => {
          let res = response.data
          if(res.status=='0'){
            console.log("update suc");
          }
        })
      },
      checkOut(){
        if(this.checkedCount>0){
          this.$router.push({path:'/address'})
        }
      }
    },
    components:{
      HtHeader,
      HtFooter,
      HtBread,
      Model
    },
    filters:{
      currency
    }
  }
</script>
<style scoped>
  .input-add, .input-sub {
    min-width: 40px;
    height: 100%;
    border: 0;
    color: #605f5f;
    text-align: center;
    font-size: 16px;
    overflow: hidden;
    display: inline-block;
    background: #f0f0f0;
  }
  .item-quantity .select-self-area .select-ipt {
    display: inline-block;
    padding: 0 3px;
    width: 30px;
    min-width: 30px;
    text-align: center;
    background-color: white;
  }
  .item-quantity .select-self-area {
    background: none;
    border: 1px solid #f0f0f0;
  }
  .select-self-area {
    width: auto;
    background: #f0f0f0;
    border-radius: 3px;
    min-width: 50px;
    max-width: 240px;
    height: 30px;
    line-height: 30px;
  }
  .item-edit-btn {
    font-size: 20px;
  }
  .item-all-check .item-check-btn {
    position: relative;
  }
  .item-all-check .item-check-btn .icon-checkmark {
    position: absolute;
    top: 2px;
    left: 2px;
  }
</style>
