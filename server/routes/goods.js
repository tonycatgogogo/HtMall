var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Goods = require('../models/goods')

//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/HtMall', {useNewUrlParser: true})

mongoose.connection.on("connected", function () {
  console.log("MongoDB connected success.")
})

mongoose.connection.on("error", function () {
  console.log("MongoDB connected fail.")
})

mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connected disconnected.")
})

router.get('/list', function (req, res, next) {
  let page = req.param("page")
  let pageSize = parseInt(req.param('pageSize'))
  let sort = req.param('sort')
  let skip = (page - 1) * pageSize
  let priceRange = req.param("priceRange")
  let priceGt = ''
  let priceLt = ''
  let param = {}
  if (priceRange !== 'all') {
    switch (priceRange) {
      case '0':
        priceGt = 0
        priceLt = 100
        break
      case '1':
        priceGt = 100
        priceLt = 500
        break
      case '2':
        priceGt = 500
        priceLt = 1000
        break
      case '3':
        priceGt = 1000
        priceLt = 5000
        break
    }
    param = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLt
      }
    }
  }
  let goodsModel = Goods.find(param).skip(skip).limit(pageSize)
  goodsModel.sort({'salePrice': sort})
  goodsModel.exec(function (err, doc) {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    } else {
      res.json({
        status: 0,
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})

router.post('/addCart', function (req, res, next) {
  let userId = '100000077', productId = req.body.productId
  let User = require('../models/user')
  console.log(productId)
  User.findOne({userId: userId}, (err, userDoc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    } else {
      if (userDoc) {
        var productItem = ''
        userDoc.cartList.forEach(function (item) {
          if(item.productId == productId){
            productItem = item;
            item.productNum ++;
          }
        });
        if (productItem) {
          userDoc.save(function (err2, doc2) {
            if (err2) {
              res.json({
                status: "1",
                msg: err2.message
              })
            } else {
              res.json({
                status: '0',
                msg: '',
                result: 'suc'
              })
            }
          })
        } else {
          Goods.findOne({productId: productId},(err1,doc) => {
            if(err1){
              res.json({
                status:"1",
                msg:err1.message
              })
            }else{
              if(doc){
                doc.productNum = 1;
                doc.checked = 1;
                userDoc.cartList.push(doc);
                userDoc.save(function (err2,doc2) {
                  if(err2){
                    res.json({
                      status:"1",
                      msg:err2.message
                    })
                  }else{
                    res.json({
                      status:'0',
                      msg:'',
                      result:'suc'
                    })
                  }
                })
              }
            }
          })
        }
      }
    }
  })
})
module.exports = router
