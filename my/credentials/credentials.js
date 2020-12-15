// my/credentials/credentials.js
const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    list: [],
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.license, {}).then(res => {
      let list = [{
        name: '营业执照',
        path: res.data.business_license
      }]
      let obj = res.data.other_licence
      this.setData({
        list: [...list, ...obj],
      })
    })
  },
  /**
   * 预览
   */
  previewImage(e) {
    let list = this.data.list.map((val) => {
      return val = val.path
    })
    if (list.length == 1 && list[0] == '') {
      return
    }
    wx.previewImage({
      current: e.currentTarget.dataset.path,
      urls: list
    })
  }
})