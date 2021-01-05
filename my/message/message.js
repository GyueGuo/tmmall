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
    serviceList: [] //聊天列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor
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
    http.post(app.globalData.messageStatistics, {}).then(res => {
      this.setData({
        common: res.result.common,
        express: res.result.express,
        activity: res.result.activity,
      })
    })
    //客服消息
    http.post(app.globalData.getCustomerList, {
      memberId: app.globalData.memberId
    }).then(res => {
      console.log(res)
      this.setData({
        serviceList: res.data
      })
    })
  },

  onMessage(e) {
    wx.navigateTo({
      url: '../messageList/messageList?tab=' + e.currentTarget.dataset.index,
    })
  },
  /**
   * 平台客服
   */
  servicePt(e) {
    let serviceInfo = {
      TARGETID: '0',
      DIVERSIONID: '5000'
    }
    wx.navigateTo({
      url: '/my/service/service?serviceInfo=' + JSON.stringify(serviceInfo),
    })
  },

  /**
   * 客服列表
   */
  goService(e) {
    console.log(e)
    let data = e.currentTarget.dataset.data
    let serviceInfo
    if (data.storeId != '0') {
      serviceInfo = {
        storeTitle: data.storeName,
        formType: 'platform',
        TARGETID: data.storeId,
        DIVERSIONID: '1000'
      }
    } else if (data.storeId == '0') {
      serviceInfo = {
        storeTitle: '平台客服',
        formType: 'platform',
        TARGETID: data.storeId,
        DIVERSIONID: '5000'
      }
    }
    wx.navigateTo({
      url: '/my/service/service?serviceInfo=' + JSON.stringify(serviceInfo),
    })
  }
})