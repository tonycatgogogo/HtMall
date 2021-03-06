var express = require('express')
var router = express.Router()

var User = require('../models/user')
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

router.post("/login", function (req, res, next) {
  var params = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(params, function (err, doc) {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    } else {
      if (doc) {
        res.cookie('userId', doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        res.cookie('userName', doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        res.json({
          status: 0,
          msg: '',
          result: {
            userName: doc.userName
          }
        })
      }
    }
  })
})

//登出接口
router.post("/logout", function (req, res, next) {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })
  res.json({
    status: 0,
    msg: '',
    result: ''
  })
})

router.get("/checkLogin", function (req,res,next) {
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName || ''
    });
  }else{
    res.json({
      status:'1',
      msg:'未登录',
      result:''
    });
  }
})

//查询当前用户的购物车数据
router.get("/cartList", function (req,res,next) {
  var userId = req.cookies.userId;
  User.findOne({userId:userId}, function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:doc.cartList
        });
      }
    }
  });
});
//删除商品
router.post("/cartDel", function (req,res,next) {
  let userId = req.cookies.userId,productId = req.body.productId;
  User.update({
    userId:userId
  },{
    $pull:{
      'cartList':{
        'productId':productId
      }
    }
  }, function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      });
    }
  });
});
//修改商品数量
router.post("/cartEdit", function (req,res,next) {
  var userId = req.cookies.userId,
    productId = req.body.productId,
    productNum = req.body.productNum,
    checked = req.body.checked;
  User.update({"userId":userId,"cartList.productId":productId},{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked,
  }, function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      });
    }
  })
});
//将所有的商品勾选
router.post('/checkAll',function (req,res,next) {
  var userId = req.cookies.userId,
    checkAll = req.body.checkAll ? '1' : '0'
  User.findOne({userId:userId},function (err,user) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if(user){
        user.cartList.forEach(item => {
          item.checked = checkAll
        })
      }
      user.save(function (err1,doc) {
        if(err1){
          res.json({
            status:'1',
            msg:err1,message,
            result:''
          });
        }else{
          res.json({
            status:'0',
            msg:'',
            result:'suc'
          });
        }
      })
    }
  })
});
//获取地址
router.get("/addressList", function (req,res,next) {
  var userId = req.cookies.userId;
  User.findOne({userId:userId}, function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:doc.addressList
      });
    }
  })
});
module.exports = router
