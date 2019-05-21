<template>
  <div class="accessory-result-page accessory-page">
    <div class="container">
      <div class="filter-nav">
        <span class="sortby">Sort by:</span>
        <a href="javascript:void(0)" class="default" @click="sortDefault" :class="{'cur': sortOptions === 'default'}">Default</a>
        <a href="javascript:void(0)" class="price" @click="sortUp" :class="{'cur': sortOptions === 'price'}">Price
          <span :class="'icon icon-arrow-'+ priceSort"></span>
        </a>
        <a href="javascript:void(0)" class="filterby stopPop" @click="filterShow">Filter by</a>
      </div>
      <div class="accessory-result">
        <!-- filter -->
        <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
          <dl class="filter-price">
            <dt>Price:</dt>
            <dd><a href="javascript:void(0)" @click="setPriceRange('all')" :class="{'cur': priceChecked === 'all'}">All</a></dd>
            <dd v-for="(item,index) in priceList">
              <a href="javascript:void(0)" @click="setPriceRange(index)" :class="{'cur': priceChecked === index}">{{item.startPrice}} - {{item.endPrice}}</a>
            </dd>
          </dl>
        </div>

        <!-- search result accessories list -->
        <div class="accessory-list-wrap">
          <div class="accessory-list col-4">
            <ul>
              <li v-for="item in imageList">
                <div class="pic">
                  <a href="#"><img v-lazy="'static/' + item.productImage" alt=""></a>
                </div>
                <div class="main">
                  <div class="name">{{item.productName}}</div>
                  <div class="price">{{item.salePrice}}</div>
                  <div class="btn-area" @click="addCart(item.productId)">
                    <a href="javascript:;" class="btn btn--m">加入购物车</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="view-more-normal"
               v-infinite-scroll="loadMore"
               infinite-scroll-disabled="busy"
               infinite-scroll-distance="20">
            <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
          </div>
        </div>
        <model v-bind:mdShow="mdShow" v-on:close="closeModal">
          <p slot="message">
            请先登录,否则无法加入到购物车中!
          </p>
          <div slot="btnGroup">
            <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
          </div>
        </model>
        <model v-bind:mdShow="mdShowCart" v-on:close="closeModal">
          <p slot="message">
            <span>加入购物车成功!</span>
          </p>
          <div slot="btnGroup">
            <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
            <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart" >查看购物车</router-link>
          </div>
        </model>
        <div class="md-overlay" v-show="overLayFlag" @click.stop="closePop"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import '@/assets/font-icon/style.css'
  import Model from '@/components/Model'
  import axios from 'axios'
  export default {
    data() {
      return {
        priceList: [
          {
            startPrice: 0,
            endPrice: 100
          },
          {
            startPrice: 100,
            endPrice: 500
          },
          {
            startPrice: 500,
            endPrice: 1000
          },
          {
            startPrice: 1000,
            endPrice: 2000
          }
        ],
        imageList:[
          {
          "productId":"10001",
          "productName":"小米6",
          "productPrice":"2499",
          "productImg":"mi6.jpg"
        },
          {
            "productId":"10002",
            "productName":"小米笔记本",
            "productPrice":"3999",
            "productImg":"note.jpg"
          },
          {
            "productId":"10003",
            "productName":"小米6",
            "productPrice":"2499",
            "productImg":"mi6.jpg"
          },
          {
            "productId":"10004",
            "productName":"小米6",
            "productPrice":"2499",
            "productImg":"1.jpg"
          },
          {
            "productId":"10005",
            "productName":"小米6",
            "productPrice":"2499",
            "productImg":"2.jpg"
          },
          {
            "productId":"10006",
            "productName":"小米6",
            "productPrice":"2499",
            "productImg":"3.jpg"
          },
          {
            "productId":"10007",
            "productName":"小米6",
            "productPrice":"2499",
            "productImg":"4.jpg"
          },
          {
            "productId":"10008",
            "productName":"小米6",
            "productPrice":"2499",
            "productImg":"5.jpg"
          }],
        priceChecked: 'all',
        priceSort:'down2',
        filterBy: false,
        overLayFlag: false,
        sortOptions: 'default',
        page:1,
        pageSize:8,
        sort:true,
        loading:false,
        busy:true,
        mdShow:false,
        mdShowCart:false,
      }
    },
    mounted(){
      this.getGoodsList()
    },
    methods:{
      getGoodsList(flag){
        let param = {
          page:this.page,
          pageSize: this.pageSize,
          sort:this.sort? 1 : -1,
          priceRange:this.priceChecked
        }
        this.loading = true
        axios.get('/goods/list',{
          params:param
        }).then(response => {
          let res = response.data
          if(res.status === 0){
            if(flag){
              this.imageList = this.imageList.concat(res.result.list)
              if(res.result.count < 8){
                this.busy = true
                this.loading = false
              }else{
                this.busy = false
              }
            }else{
              this.imageList = res.result.list
              this.busy = false
            }
          }else if(res.status === 1){

          }
        })
      },
      loadMore(){
        this.busy = true;
        this.page++;
        setTimeout(() =>{
          this.getGoodsList(true)
        },500)
      },
      setPriceRange(index){
        this.priceChecked = index
        this.closePop()
        this.page = 1
        this.getGoodsList()
      },
      sortUp(){
        if(this.priceSort === 'down2'){
          this.priceSort = 'up2'
          this.sortOptions = 'price'
          this.sort = !this.sort
          this.page = 1
          this.getGoodsList()
        } else  if (this.priceSort === 'up2') {
          this.priceSort = 'down2'
          this.sortOptions = 'price'
          this.sort = !this.sort
          this.page = 1
          this.getGoodsList()
        }
      },
      filterShow(){
        this.filterBy = true
        this.overLayFlag = true
      },
      closePop(){
        this.filterBy = false
        this.overLayFlag = false
      },
      sortDefault(){
        this.sortOptions = 'default'
      },
      addCart(id){
        axios.post('/goods/addCart',{
          productId:id
        }).then(response => {
          let res = response.data
          if(res.status == '0'){
            this.mdShowCart = true;
          }else{
            this.mdShow = true;
          }
        })
      },
      closeModal(){
        this.mdShow=false
        this.mdShowCart=false
      }
    },
    components:{
      Model
    }
  }
</script>
