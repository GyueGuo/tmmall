// pages/search_order/search_order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: '',
    //历史搜索
    history_list: [],
    distribution_type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.distribution_type = options.distribution_type
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({
      history_list: wx.getStorageSync('order_history').length == 0 ? [] : wx.getStorageSync('order_history')
    })
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
   * 历史搜索
   */
  setHistroy() {
    for (let i = 0, len = this.data.history_list.length; i < len; i++) {
      if (this.data.key == this.data.history_list[i]) {
        this.data.history_list.splice(i, 1)
      }
    }
    this.data.history_list.splice(0, 0, this.data.key)
    wx.setStorageSync('order_history', this.data.history_list)
    this.setData({
      history_list: this.data.history_list
    })
  },

  /**
   * 清空历史搜索
   */
  onClearHistory() {
    wx.removeStorageSync('order_history')
    this.setData({
      history_list: []
    })
  },

  /**
   * 搜索
   */
  searchInput(e) {
    this.setData({
      key: e.detail.value.replace(/(^\s+)|(\s+$)/g, "")
    })
  },

  onClearKey() {
    this.setData({
      key: ''
    })
  },


  /**
   * 搜索
   */
  onSearch(e) {
    if (e.currentTarget.dataset.item) {
      this.setData({
        key: e.currentTarget.dataset.item
      })
    }
    if (this.data.key.length == 0) {
      wx.showToast({
        title: '请输入搜索关键字',
        icon: 'none'
      })
      return
    }
    this.setHistroy()
    wx.navigateTo({
      url: '../search_order_result/search_order_result?keyword=' + this.data.key + '&distribution_type=' + this.data.distribution_type,
    })
  },

})