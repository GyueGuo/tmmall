const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    common: 0,
    express: 0,
    activity: 0,
    service_list: [] //聊天列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color
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
    this.getData()
    app.socketOnMessage('serviceMsgList', this)
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
   * 获取数据
   */
  getData() {
    http.post(app.globalData.message_statistics, {}).then(res => {
      this.setData({
        common: res.result.common,
        express: res.result.express,
        activity: res.result.activity,
      })
    })
    //客服消息
    http.post(app.globalData.getCustomerList, {
      memberId: app.globalData.member_id
    }).then(res => {
      console.log(res)
      this.setData({
        service_list: res.data
      })
    })
  },

  onMessage(e) {
    wx.navigateTo({
      url: '../message_list/message_list?tab=' + e.currentTarget.dataset.index,
    })
  },
  /**
   * 平台客服
   */
  service_pt(e) {
    let service_info = {
      TARGET_ID: '0',
      DIVERSION_ID: '5000'
    }
    wx.navigateTo({
      url: '/my/service/service?service_info=' + JSON.stringify(service_info),
    })
  },

  /**
   * 客服列表
   */
  goService(e) {
    console.log(e)
    let data = e.currentTarget.dataset.data
    let service_info
    if (data.store_id != '0') {
      service_info = {
        store_title: data.store_name,
        form_type: 'platform',
        TARGET_ID: data.store_id,
        DIVERSION_ID: '1000'
      }
    } else if (data.store_id == '0') {
      service_info = {
        store_title: '平台客服',
        form_type: 'platform',
        TARGET_ID: data.store_id,
        DIVERSION_ID: '5000'
      }
    }
    wx.navigateTo({
      url: '/my/service/service?service_info=' + JSON.stringify(service_info),
    })
  }
})