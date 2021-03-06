const app = getApp();
import http from '../../utils/http';
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
    http.post(app.globalData.helpCenter).then(res=> {
      this.setData({
        list: res.result
      })
    })
  },

  onItem(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/infoDetail/infoDetail?articleId=${item.articleId}&source=helpCenter`,
      // url: '/my/helpWeb/helpWeb?item=' + encodeURIComponent(JSON.stringify({
      //   title: item.title,
      //   content: item.content,
      // })),
    })
  }
})