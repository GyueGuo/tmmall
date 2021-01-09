const app = getApp();
import http from '../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webContent: ''
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
      path: '/pages/invitationWeb/invitationWeb?mid=' + app.globalData.memberId
    }
  },


  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.packetIndex, {}).then(res => {
      this.setData({
        statistics: res.statistics,
        inviteList: res.result,
      })
    })
    http.get(app.globalData.redPocketRule).then(res => {
      this.setData({
        webContent: res.content
      })
    })
  },
  /**
   * 面对面扫码
   */
  onFace() {
    wx.navigateTo({
      url: `../faceScan/faceScan?faceBgImg=${this.data.faceBgImg}`
    })
  }
})