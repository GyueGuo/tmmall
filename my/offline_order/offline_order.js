const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    total: '',
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
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
    this.data.page = 1
    this.getData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.total > this.data.list.length) {
      this.data.page++;
      this.getData()
    }
  },

  /**
   * 商品详情
   */
  onDetail(e) {
    wx.navigateTo({
      url: '/my/offline_detail/offline_detail?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.order_under_line_list, {
      page: this.data.page
    }).then(res=> {
      if (this.data.page == 1) {
        this.setData({
          total: res.result.total,
          list: res.result.data,
        })
      } else {
        this.setData({
          list: [...this.data.list,...res.result.data]
        })
      }
    })
  }
})