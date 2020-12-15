const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    http.post(app.globalData.platform_classify).then(res=> {
      this.setData({
        list: res.result
      })
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

  onClassify(e) {
    let item = e.currentTarget.dataset.item
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      category_id: item.store_classify_id,
      category: item.title
    })
    prevPage.createWhether()
    wx.navigateBack()
  }
})