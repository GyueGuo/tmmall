const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    web_content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      token: options.token
    })
    this.getData()
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
   * 分享
   */
  onShareAppMessage: function() {
    return {
      path: '/pages/invitation_web/invitation_web?mid=' + app.globalData.member_id
    }
  },


  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.packet_index, {}).then(res => {
      this.setData({
        statistics: res.statistics,
        invite_list: res.result,
      })
    })
    http.get(app.globalData.red_pocket_rule).then(res => {
      this.setData({
        web_content: res.content
      })
    })
  },
  /**
   * 面对面扫码
   */
  onFace() {
    wx.navigateTo({
      url: `../face_scan/face_scan?face_bg_img=${this.data.face_bg_img}`
    })
  }
})