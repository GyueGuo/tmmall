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
    this.setData({
      configSwitch: app.globalData.configSwitch
    })
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  callPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.configSwitch.appInfo.contact,
    })
  },
  /**
   * 平台客服
   */
  servicePt() {
    let serviceInfo = {
      TARGETID: '0',
      DIVERSIONID: '5001'
    }
    wx.navigateTo({
      url: '/my/service/service?serviceInfo=' + JSON.stringify(serviceInfo),
    })
  },
})