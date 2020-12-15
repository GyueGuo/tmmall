const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    distribution_type: '',
    page: 1,
    total: '',
    order_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color,
      distribution_type: options.distribution_type
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
    http.post(app.globalData.order_fter_sale_ist, {}).then(res => {
      if (this.data.page == 1) {
        this.setData({
          order_list: res.result.data,
          total: res.result.total
        })
      } else {
        this.setData({
          order_list: [...this.data.order_list, ...res.result.data]
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
      url: `/pages/return_detail/return_detail?id=${item.order_goods_id}&status=${item.order_attach_status}`,
    })
  }
})