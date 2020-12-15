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
    info: {}
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
    http.post(app.globalData.integral_order, {
      integralOrderId: this.data.id
    }).then(res => {
      this.setData({
        info: res.result
      })
    })
  },

  /**
   * 确认收货
   */
  confirmReceipt() {
    http.post(app.globalData.confirm_receipt, {
      integralOrderId: this.data.id,
      status: 2
    }).then(res => {
      this.data.info.status = 2
      this.setData({
        info: this.data.info
      })
      app.showSuccessToast(res.message, () => {
        event.emit('changeIntegralRecord', this.data.id)
      })
    })
  },

  onLogistics() {
    let info = {
      file: encodeURIComponent(this.data.info.file),
      goods_name: this.data.info.integral_name,
      subtotal_price: this.data.info.price,
      express_number: this.data.info.express_number,
      express_value: this.data.info.express_value,
      order_attach_id: this.data.id,
      type: 'integral'
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
})