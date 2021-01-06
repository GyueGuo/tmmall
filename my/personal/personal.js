const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {}
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
    event.on('refreshInfo', this, () => {
      this.getData()
    })
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
    event.remove('refreshInfo', this)
  },

  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.myInfo, {}).then(res => {
      this.setData({
        info: res.result
      })
    })
  },
  /**
   * 更换头像
   */
  chooseHead() {
    this.setData({
      headBoard: true
    })
  },
  /**
   * 选择头像图片来源
   */
  confirmAvatar(e) {
    console.log(e.detail)
    let sourceType = e.detail==0?['album']:['camera']
    wx.chooseImage({
      count: 1,
      sourceType: sourceType,
      success: res => {
        http.uploadFile(app.globalData.avatar, res.tempFilePaths[0], 'image', {},
          data => {
            this.data.info.avatar = JSON.parse(data.data).avatar
            this.setData({
              info: this.data.info
            })
            let memberInfo = wx.getStorageSync('memberInfo')
            memberInfo.avatar = JSON.parse(data.data).avatar
            wx.setStorageSync('memberInfo', memberInfo)
          })
      }
    })
  },

  /**
   * 昵称
   */
  onNickname() {
    wx.navigateTo({
      url: '../nickname/nickname?name=' + this.data.info.nickname,
    })
  },

  onMemberCode() {
    wx.navigateTo({
      url: '/my/vipCard/vipCard',
    })
  },

  /**
   * 选择性别
   */
  chooseSex() {
    this.setData({
      sexBoard: true
    })
  },

  /**
   * 确认性别
   */
  confirmSex(e) {
    http.post(app.globalData.myOther, {
      other: 'sex',
      sex: e.detail
    }).then(res => {
      app.showSuccessToast(res.message)
      this.data.info.sex = e.detail
      this.setData({
        info: this.data.info
      })
    })
  }
})