const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //订单id
    id: '',
    //订单索引
    index: '',
    info: {},
    modalConfirm: [{
      title: '提示',
      content: '确认已收到货?',
      tip: '',
      callback: 'confirmReceipt'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id,
      index: options.index,
      diyColor: app.globalData.diyColor
    })
    event.on('changeAddress', this, res => {
      this.setData({
        memberAddressId: res.address.memberAddressId,
      })
      http.post(app.globalData.setAddres, {
        activityOrderId: this.data.id,
        memberAddressId: res.memberAddressId
      }).then(res => {
        this.getData()
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
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
  onHide: function() {

  },

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
    http.post(app.globalData.lotteryActivityOrderInfo, {
      orderId: this.data.id
    }).then(res => {
      this.setData({
        info: res.data
      })
    })
  },

  /**
   * 确认收货
   */
  confirmReceipt() {
    http.post(app.globalData.confirmTake, {
      orderId: this.data.id
    }).then(res => {
      this.setData({
        'info.status': 3
      })
    })
  },

  onLogistics() {
    let info = {
      expressNumber: this.data.info.expressNumber,
      expressValue: this.data.info.expressValue,
      orderAttachId: this.data.id,
      type: 'draw'
    }
    wx.navigateTo({
      url: '../logisticsDetail/logisticsDetail?info=' + JSON.stringify(info),
    })
  },

  /**
   * 复制订单号
   */
  copyOrder() {
    wx.setClipboardData({
      data: this.data.info.orderNumber,
    })
  },
  /**
   * 选择地址
   */
  address() {
    wx.navigateTo({
      url: '/my/address/address?choose=true',
    })
  },
  showModal(e) {
    console.log(e.currentTarget.dataset)
    this.setData({
      showModal: e.currentTarget.dataset.confirmtype
    })
    this.selectComponent("#modal").showModal(e.currentTarget.dataset)
  },
})