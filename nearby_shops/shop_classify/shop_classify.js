const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    store_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.store_id = options.store_id
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

  getData() {
    http.post(app.globalData.store_classify_list, {
      storeId: this.data.store_id
    }).then(res => {
      this.setData({
        list: res.result
      })
    })
  },

  /**
   * 跳转搜索
   */
  onSearch(e) {
    wx.navigateTo({
      url: '../search_in_shop/search_in_shop?store_id=' + this.data.store_id + '&classify_id=' + e.currentTarget.dataset.id,
    })
  }
})