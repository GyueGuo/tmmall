const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberAddressId: '',
    //地址
    address: null,
    //运费
    freight: 0.00,
    //合计价格
    total: 0,
    //支付方式
    payWay: '在线支付',
    way: '1',
    message: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      data: JSON.parse(options.info),
      storeId: JSON.parse(options.info).storeId
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    event.on('changeAddress', this, () => {
      this.data.memberAddressId = this.data.address.memberAddressId
      this.getData()
    })
    this.getData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    event.remove('changeAddress', this)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.invoiceOrderDetail, {
      storeId: this.data.storeId,
      memberAddressId: ''
    }).then(res => {
      this.setData({
        address: res.memberAddress,
        memberAddressId: res.memberAddress == null ? '' : res.memberAddress.memberAddressId,
        info: res.result,
        store: res.store
      })
      if (res.memberAddress == null) {
        this.selectComponent("#modal").showModal()
      }
      this.calculate()
    })
  },

  /**
   * 选择地址
   */
  chooseAddress() {
    wx.navigateTo({
      url: '/my/address/address?choose=1',
    })
  },

  /**
   * 支付方式
   */
  onPayWay() {
    let array = [],
      images = [this.data.info.file],
      obj = {
        images: images,
        isPayDelivery: this.data.store.isPayDelivery,
        way: 1,
        deliveryMethod: this.data.info.deliveryMethod
      }
    array.push(obj)
    this.selectComponent("#payWay").show(array)
  },

  /**
   * 确定支付方式
   */
  confirmWay(e) {
    this.setData({
      payWay: e.detail[0].way == 1 ? '1在线支付' : '货到付款',
      way: e.detail[0].way
    })
  },

  /**
   * 配送方式
   */
  onDeliveryWay(e) {
    if (this.data.address == null) {
      app.showToast('请选择收货地址')
      return
    }
    let index = e.currentTarget.dataset.index
    this.data.list[index].deliveryMethod = e.currentTarget.dataset.method

    //预约自提
    if (e.currentTarget.dataset.method == 'isShop') {
      this.data.list[index].distributionType = '2'
      if (this.data.list[index].way == 2) {
        this.data.list[index].way = 1
      }
      //更改支付方式
      let ways = []
      for (let i = 0, len = this.data.list.length; i < len; i++) {
        ways[i] = this.data.list[i].way
      }
      if (ways.indexOf(1) > -1 && ways.indexOf(2) > -1) {
        this.data.payWay = "在线支付 + 货到付款"
      } else if (ways.indexOf(1) > -1) {
        this.data.payWay = "在线支付"
      } else if (ways.indexOf(2) > -1) {
        this.data.payWay = "货到付款"
      }
      this.setData({
        payWay: this.data.payWay
      })
    } else if (e.currentTarget.dataset.method == 'isCity') {
      //同城速递
      this.data.list[index].distributionType = '1'
    } else if (e.currentTarget.dataset.method == 'isExpress') {
      //快递邮寄
      this.data.list[index].distributionType = '3'
    }
    this.calculate()
    this.setData({
      list: this.data.list
    })

  },

  /**
   * 买家留言
   */
  messageInput(e) {
    this.data.message = e.detail.value
  },
  /**
   * 计算总价
   */
  calculate() {
    this.setData({
      total: this.data.info.freightPrice,
      freight: this.data.info.freightPrice
    })
  },

  /**
   * 提交订单
   */
  confirmOrder() {
    if (this.data.address == null) {
      this.selectComponent("#modal").showModal()
      return
    }

    let storeSet = [],
      store = {
        storeId: this.data.info.storeId,
        productsId: '',
        goodsAttr: '',
        quantity: '1',
        memberShopCouponId: '',
        message: this.data.message,
        distributionType: 3,
        payType: this.data.way,
        takeId: '',
        isInvoice: 0,
        isInvoiceTemplate: 1,
        invoiceOrderId: this.data.data.orderAttachId
      }
    storeSet.push(store)
    http.post(app.globalData.orderConfirm, {
      memberAddressId: this.data.memberAddressId,
      payChannel: 1,
      orderType: 1,
      cutActivityId: null,
      groupActivityId: null,
      usedIntegral: 0,
      memberPacketId: '',
      memberPlatformCouponId: '',
      idSet: this.data.info.goodsId,
      storeSet: storeSet,
      originType: 2,
      invoiceAttr: this.data.data.isAnew
    }).then(res => {
      event.emit('refreshCart')
      if (this.data.total == '0.00') {
        app.showSuccessToast('提交成功', () => {
          let item = {}
          wx.redirectTo({
            url: '/nearbyShops/invoiceOver/invoiceOver?item=' + JSON.stringify(item),
          })
        })
        return
      }
      let orderInfo = {
        totalPrice: res.result.totalPrice,
        orderNumber: res.result.orderNumber,
        orderType: 'invoice',
        orderAttachNumber: '',
        orderAttachId: res.result.orderAttachId,
        distributionId: ''
      }
      wx.redirectTo({
        url: '../cashierDesk/cashierDesk?orderInfo=' + JSON.stringify(orderInfo),
      })
    })
  }

})