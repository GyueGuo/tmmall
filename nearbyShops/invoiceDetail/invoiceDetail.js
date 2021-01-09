const app = getApp();
import http from '../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invoiceInfo: {},
    diyColor: app.globalData.diyColor,
    orderAttachId: null,
    status: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      orderAttachId: options.orderAttachId,
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
    http.post(app.globalData.invoiceDetail, {
      orderAttachId: this.data.orderAttachId
    }).then(res => {
      this.setData({
        invoiceInfo: res.result
      })
    })
  },
  /**
   * 修改发票
   * show(invoiceInfo发票详情,0,店铺id传'',0确认订单用 1发票信息用)
   */
  submit() {
    this.selectComponent("#popup").show(this.data.invoiceInfo, 0, '', 1)
  },
  /**
   * 查看物流
   */
  logistics() {
    let info = {
      expressNumber: this.data.invoiceInfo.expressNumber,
      expressValue: this.data.invoiceInfo.expressValue,
      orderAttachId: this.data.invoiceInfo.orderAttachId,
      type: 'invoice'
    }
    wx.navigateTo({
      url: '/my/logisticsDetail/logisticsDetail?info=' + JSON.stringify(info),
    })
  },
  /**
   * 复制链接
   */
  copylink() {
    if (this.data.invoiceInfo.downloadLinks == '' || this.data.invoiceInfo.downloadLinks == null || this.data.invoiceInfo.downloadLinks == undefined) {
      return
    }
    wx.setClipboardData({
      data: this.data.invoiceInfo.downloadLinks,
      success: res => {
        app.showToast('复制成功,请去浏览器打开', res => {})
      }
    })
  },
  /**
   * 
   */
  popupInvoice(e) {
    this.setData({
      invoice: e.detail
    })
  },
  createWhether() {
    this.setData({
      'invoice.province': this.data.province.areaName,
      'invoice.city': this.data.city.areaName,
      'invoice.area': this.data.area.areaName,
    })
  },
  refreshInvoice(e) {
    this.getData()
  }
})