const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null,
    countDown: {},
    //第一次进入砍价
    isFirst: false,
    isCutout: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.appDIY(() => { }, this)
    this.data.cutActivityId = options.id
    if (options.first) {
      this.data.isFirst = true
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    event.on('refreshBargainDetail', this, () => {
      this.getData()
    })
    this.getData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    event.remove('refreshBargainDetail', this)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      path: '/pages/bargain/bargain?id=' + this.data.cutActivityId
    }
  },

  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.cutDetail, {
      cutActivityId: this.data.cutActivityId
    }).then(res => {
      this.setData({
        info: res.result,
        goodList: res.recommendList,
        discount: res.discount == null ? 100 : res.discount,
      })
      let cj = parseFloat(this.data.info.presentPrice) - parseFloat(this.data.info.cutPrice)
      if (cj == 0) {
        this.setData({
          isCutout: true
        })
      } else {
        this.setData({
          isCutout: false
        })
      }
      if (this.data.isFirst) {
        this.selectComponent("#bargainModal").show(res.result.attachList[0].cutPrice, res.result.attachList[0].member.avatar)
      }
      this.data.isFirst = false
      clearInterval(this.data.countDown)
      // this.countDown()
      this.data.countDown = setInterval(()=> {
        this.countDown()
      }, 1000)
    })
  },

  /**
   * 倒计时
   */
  countDown() {
    if (this.data.info.status == 1) {
      let second = this.data.info.expirationTime
      if (second == 0) {
        this.getData()
      } else {
        this.data.info['day'] = Math.floor(second / 86400);
        this.data.info['hour'] = Math.floor(second % 86400 / 3600) < 10 ? '0' + Math.floor(second % 86400 / 3600) : Math.floor(second % 86400 / 3600);
        this.data.info['min'] = Math.floor(second % 86400 % 3600 / 60) < 10 ? '0' + Math.floor(second % 86400 % 3600 / 60) : Math.floor(second % 86400 % 3600 / 60);
        this.data.info['sec'] = Math.floor(second % 60) < 10 ? '0' + Math.floor(second % 60) : Math.floor(second % 60);
        this.data.info.expirationTime--;
      }
    }
    this.setData({
      info: this.data.info
    })
  },

  /**
   * 帮助砍价
   */
  helpBargain() {
    if (app.globalData.memberId == '') {
      wx.navigateTo({
        url: '/pages/accredit/accredit',
      })
      return
    }
    http.post(app.globalData.cutHelp, {
      cutActivityId: this.data.cutActivityId,
      goodsId: this.data.info.goodsId,
      goodsAttr: this.data.info.goodsAttr
    }).then(res => {
      this.selectComponent("#bargainModal").show(res.randomPrice, res.member.avatar)
      this.getData()
    })
  },

  /**
   * 付款
   */
  payOrder() {
    this.getData()
    setTimeout(() => {
      let obj = {
        //商品类型 1正常商品 2团购 3砍价 4限时抢购
        goodType: 3,
        //商品id
        goodsId: this.data.info.goodsId,
        //砍价id
        cutActivityId: this.data.info.cutActivityId,
        //参团id
        groupActivityId: '',
        //购买数量
        num: 1,
        //店铺id
        storeId: this.data.info.storeId,
        //店铺名称
        storeName: this.data.info.storeName,
        //价格
        shopPrice: parseFloat(this.data.info.presentPrice).toFixed(2),
        //商品名称
        goodsName: this.data.info.goods.goodsName,
        //商品规格id
        productsId: this.data.info.productsId,
        //规格展示
        attrDetail: this.data.info.attr,
        //规格
        attr: this.data.info.goodsAttr,
        //库存
        goodsNumber: 1,
        //团购价
        groupPrice: '',
        //砍价
        cutPrice: parseFloat(this.data.info.presentPrice).toFixed(2),
        //差价
        priceSpread: (parseFloat(this.data.info.originalPrice) - parseFloat(this.data.info.presentPrice)).toFixed(2),
        //限时抢购价
        limitPrice: '',
        //总金额
        subtotal: parseFloat(this.data.info.presentPrice).toFixed(2)
      }

      wx.navigateTo({
        url: '/pages/confirmOrder/confirmOrder?info=' + encodeURIComponent(JSON.stringify(obj)) + '&goodImage=' + encodeURIComponent(this.data.info.file),
      })
    }, 200)
  },

  /**
   * 参加其他
   */
  onOthers() {
    wx.navigateTo({
      url: '/pages/bargainList/bargainList',
    })
  },
  /**
   * 重砍一个
   */
  onAnother() {
    wx.redirectTo({
      url: '/nearbyShops/goodDetail/goodDetail?goodsId=' + this.data.info.goodsId,
    })
  },

  /**
   * 活动规则
   */
  onBargainRule() {
    wx.navigateTo({
      url: '/my/webView/webView?id=' + 21,
    })
  },
  onGoods(e) {
    wx.navigateTo({
      url: '/nearbyShops/goodDetail/goodDetail?goodsId=' + e.currentTarget.dataset.id,
    })
  }
})