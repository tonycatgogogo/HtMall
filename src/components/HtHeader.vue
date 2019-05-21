<template>
  <header class="header">
    <div class="navbar">
      <div class="navbar-left-container">
        <a href="/">
          <img class="navbar-brand-logo" src="../../static/favicon1.png"></a>
      </div>
      <div class="navbar-right-container" style="display: flex;">
        <div class="navbar-menu-container">
          <!--<a href="/" class="navbar-link">我的账户</a>-->
          <span class="navbar-link" v-text="nickName" v-show="nickName"></span>
          <a href="javascript:void(0)" class="navbar-link" @click="loginModalFlag=true" v-if="!nickName">Login</a>
          <a href="javascript:void(0)" class="navbar-link" @click="logout" v-else>Logout</a>
          <div class="navbar-cart-container">
            <a class="navbar-link navbar-cart-link" @click="toCart">
              <span class="icon icon-cart"></span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="md-modal modal-msg md-modal-transition"
         v-bind:class="{'md-show':loginModalFlag}">
      <div class="md-modal-inner">
        <div class="md-top">
          <div class="md-title">Login in</div>
          <button class="md-close" @click="loginModalFlag=false">Close</button>
        </div>
        <div class="md-content">
          <div class="confirm-tips">
            <div class="error-wrap">
              <span class="error error-show" v-show="errorTip">用户名或密码错误</span>
            </div>
            <ul>
              <li class="regi_form_input">
                <i class="icon IconPeople"></i>
                <input type="text" tabindex="1" name="loginname" v-model="userName"
                       class="regi_login_input regi_login_input_left" placeholder="User Name" data-type="loginname">
              </li>
              <li class="regi_form_input noMargin">
                <i class="icon IconPwd"></i>
                <input type="password" tabindex="2" name="password" v-model="userPwd"
                       class="regi_login_input regi_login_input_left login-input-no input_text" placeholder="Password"
                       @keyup.enter="login">
              </li>
            </ul>
          </div>
          <div class="login-wrap">
            <a href="javascript:;" class="btn-login" @click="login">登 录</a>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-if="loginModalFlag" @click="loginModalFlag=false"></div>
  </header>
</template>
<script>
  import '@/assets/font-icon/style.css'
  import axios from 'axios'

  export default {
    data() {
      return {
        loginModalFlag: false,
        nickName: '',
        userName: '',
        userPwd: '',
        errorTip: false
      }
    },
    mounted(){
      this.checkLogin()
    },
    methods: {
      checkLogin(){
        axios.get('/users/checkLogin').then(response => {
          let res = response.data
          if(res.status === "0"){
            this.nickName = res.result
          }
        })
      },
      toCart(){
        if(this.nickName === ''){
          this.loginModalFlag = true
        }else{
          this.$router.push({ path:'/cart'})
        }
      },
      login() {
        if (!this.userName || !this.userPwd) {
          this.errorTip = true
          return
        }
        axios.post("/users/login", {
          userName: this.userName,
          userPwd: this.userPwd
        }).then((response) => {
          let res = response.data
          if (res.status === 0) {
            this.errorTip = false
            this.loginModalFlag = false
            this.nickName = res.result.userName
          } else {
            this.errorTip = true
          }
        })
      },
      logout() {
        axios.post("/users/logout").then((response) => {
          let res = response.data
          if (res.status === 0) {
            this.errorTip = false
            this.nickName = ''
            this.userName = ''
          } else {
            this.errorTip = true
          }
        })
      }
    }
  }
</script>
