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
    modal_confirm: [{
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
      diy_color: app.globalData.diy_color
    })
    event.on('changeAddress', this, res => {
      this.setData({
        member_address_id: res.address.member_address_id,
      })
      http.post(app.globalData.set_addres, {
        activity_order_id: this.data.id,
        member_address_id: res.member_address_id
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
    http.post(app.globalData.lottery_activity_order_info, {
      orderId: this.data.id
    }).then(res => {
      console.log(res)
      this.setData({
        info: res.data
      })
    })
  },

  /**
   * 确认收货
   */
  confirmReceipt() {
    http.post(app.globalData.confirm_take, {
      orderId: this.data.id
    }).then(res => {
      this.setData({
        'info.status': 3
      })
    })
    // http.post(app.globalData.confirm_receipt, {
    //   integral_order_id: this.data.id,
    //   status: 2
    // }).then(res => {
    //   this.data.info.status = 3
    //   this.setData({
    //     info: this.data.info
    //   })
    // })
  },

  onLogistics() {
    let info = {
      express_number: this.data.info.express_number,
      express_value: this.data.info.express_value,
      order_attach_id: this.data.id,
      type: 'draw'
    }
    wx.navigateTo({
      url: '../logistics_detail/logistics_detail?info=' + JSON.stringify(info),
    })
  },

  /**
   * 复制订单号
   */
  copyOrder() {
    wx.setClipboardData({
      data: this.data.info.order_number,
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