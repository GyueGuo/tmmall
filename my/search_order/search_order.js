Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: '',
    //历史搜索
    historyList: [],
    distributionType: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.distributionType = options.distributionType
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({
      historyList: wx.getStorageSync('orderHistory').length == 0 ? [] : wx.getStorageSync('orderHistory')
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
    for (let i = 0, len = this.data.historyList.length; i < len; i++) {
      if (this.data.key == this.data.historyList[i]) {
        this.data.historyList.splice(i, 1)
      }
    }
    this.data.historyList.splice(0, 0, this.data.key)
    wx.setStorageSync('orderHistory', this.data.historyList)
    this.setData({
      historyList: this.data.historyList
    })
  },

  /**
   * 清空历史搜索
   */
  onClearHistory() {
    wx.removeStorageSync('orderHistory')
    this.setData({
      historyList: []
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
      url: '../searchOrderResult/searchOrderResult?keyword=' + this.data.key + '&distributionType=' + this.data.distributionType,
    })
  },

})