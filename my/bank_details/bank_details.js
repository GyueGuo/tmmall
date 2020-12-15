// my/bank_details/bank_details.js
const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color,
      card_id: options.card_id
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
   * 
   */
  getData() {
    http.post(app.globalData.card_details, {
      id: this.data.card_id
    }).then(res => {
      this.setData({
        card_details: res.result
      })
    })
  },
  /**
   * 
   */
  /**
   * 获取银行卡
   */
  card_del() {
    http.post(app.globalData.card_destroy, {
      id: this.data.card_details.card_id
    }).then(res => {
      app.showSuccessToast('解绑成功',()=>{
        wx.navigateBack({})
      })
    })
  },
})