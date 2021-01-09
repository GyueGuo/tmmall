const app = getApp();
import http from '../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.storeId = options.storeId
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
    http.post(app.globalData.storeClassifyList, {
      storeId: this.data.storeId
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
      url: '../searchInShop/searchInShop?storeId=' + this.data.storeId + '&classifyId=' + e.currentTarget.dataset.id,
    })
  }
})