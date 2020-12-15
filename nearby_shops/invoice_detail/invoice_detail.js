// nearby_shops/invoice_detail/invoice_detail.js
const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invoice_info: {},
    diy_color: app.globalData.diy_color,
    order_attach_id: null,
    status: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      order_attach_id: options.order_attach_id,
      status: options.status
    })
    this.getData()
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.invoice_detail, {
      orderAttachId: this.data.order_attach_id
    }).then(res => {
      this.setData({
        invoice_info: res.result
      })
    })
  },
  /**
   * 修改发票
   * show(invoice_info发票详情,0,店铺id传'',0确认订单用 1发票信息用)
   */
  submit() {
    this.selectComponent("#popup").show(this.data.invoice_info, 0, '', 1)
    // wx.redirectTo({
    //   url: '/nearby_shops/invoice_info/invoice_info?order_attach_id=' + this.data.order_attach_id + '&is_anew=1' + '&store_id=' + this.data.invoice_info.store_id,
    // })
  },
  /**
   * 查看物流
   */
  logistics() {
    let info = {
      express_number: this.data.invoice_info.express_number,
      express_value: this.data.invoice_info.express_value,
      order_attach_id: this.data.invoice_info.order_attach_id,
      type: 'invoice'
    }
    wx.navigateTo({
      url: '/my/logistics_detail/logistics_detail?info=' + JSON.stringify(info),
    })
  },
  /**
   * 复制链接
   */
  copylink() {
    if (this.data.invoice_info.download_links == '' || this.data.invoice_info.download_links == null || this.data.invoice_info.download_links == undefined) {
      return
    }
    // wx.downloadFile({
    //   url: this.data.invoice_info.download_links,
    //   success: res => {
    //     app.showSuccessToast('下载成功', () => {})
    //   }
    // })
    wx.setClipboardData({
      data: this.data.invoice_info.download_links,
      success: res => {
        app.showToast('复制成功,请去浏览器打开', res => {})
      }
    })
  },
  /**
   * 
   */
  popup_invoice(e) {
    this.setData({
      invoice: e.detail
    })
  },
  createWhether() {
    this.setData({
      'invoice.province': this.data.province.area_name,
      'invoice.city': this.data.city.area_name,
      'invoice.area': this.data.area.area_name,
    })
  },
  refresh_invoice(e) {
    this.getData()
  }
})