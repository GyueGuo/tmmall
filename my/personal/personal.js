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
    event.on('refresh_info', this, () => {
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
    event.remove('refresh_info', this)
  },

  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.my_info, {}).then(res => {
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
      head_board: true
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
            let member_info = wx.getStorageSync('member_info')
            member_info.avatar = JSON.parse(data.data).avatar
            wx.setStorageSync('member_info', member_info)
          })
      }
    })
    // wx.chooseImage({
    //   count: 1,
    //   success: res => {
    //     http.uploadFile(app.globalData.avatar, res.tempFilePaths[0], 'image', {},
    //       data => {
    //         this.data.info.avatar = JSON.parse(data.data).avatar
    //         this.setData({
    //           info: this.data.info
    //         })
    //         let member_info = wx.getStorageSync('member_info')
    //         member_info.avatar = JSON.parse(data.data).avatar
    //         wx.setStorageSync('member_info', member_info)
    //       })
    //   }
    // })
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
      url: '/my/vip_card/vip_card',
    })
  },

  /**
   * 选择性别
   */
  chooseSex() {
    this.setData({
      sex_board: true
    })
  },

  /**
   * 确认性别
   */
  confirmSex(e) {
    http.post(app.globalData.my_other, {
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