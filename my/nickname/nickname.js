const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color,
      nickname: options.name
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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
   * 昵称 
   */
  nameInput(e) {
    this.setData({
      nickname: e.detail.value.replace(/(^\s+)|(\s+$)/g, "")
    })
  },

  /**
   * 清空输入框
   */
  clearInput() {
    this.setData({
      nickname: ''
    })
  },

  /**
   * 保存
   */
  save() {
    let reg = '^[a-zA-Z0-9_\u4e00-\u9fa5]+$'
    if (this.data.nickname == '') {
      app.showToast('请输入昵称')
      return
    }
    // if(){

    // }
    http.post(app.globalData.my_other, {
      other: 'nickname',
      nickname: this.data.nickname
    }).then(res => {
      event.emit('refresh_info')
      let member_info = wx.getStorageSync('member_info')
      member_info.nickname = this.data.nickname
      wx.setStorageSync('member_info', member_info)
      app.showSuccessToast(res.message, () => {
        wx.navigateBack()
      })
    })
  }
})