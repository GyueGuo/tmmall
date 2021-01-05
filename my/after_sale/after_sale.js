const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    distributionType: '',
    page: 1,
    total: '',
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      distributionType: options.distributionType
    })
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
    this.getOrderList()
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
   * 获取列表
   */
  getOrderList() {
    http.post(app.globalData.orderAfterSaleList, {}).then(res => {
      if (this.data.page == 1) {
        this.setData({
          orderList: res.result.data,
          total: res.result.total
        })
      } else {
        this.setData({
          orderList: [...this.data.orderList, ...res.result.data]
        })
      }
    })
  },

  /**
   * 查看详情
   */
  onRefundDetail(e) {
    console.log(e)
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/returnDetail/returnDetail?id=${item.orderGoodsId}&status=${item.orderAttachStatus}`,
    })
  }
})