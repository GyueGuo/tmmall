const app = getApp();
import http from '../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      show: app.globalData.configSwitch.versionInfo.oneMore == 0 && app.globalData.configSwitch ? false : true
    })
    wx.setNavigationBarTitle({
      title: app.globalData.configSwitch.versionInfo.oneMore == 0 && app.globalData.configSwitch ? '' : '商家入驻',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 立即入驻
   */
  settle() {
    if (app.login()) {
      http.post(app.globalData.myGetInState, {}).then(res => {
        let data = res.result
        switch (data.inState) {
          case -1:
            wx.navigateTo({
              url: '/my/merchant/merchant',
            })
            break;
          case 0:
            app.showToast(data.stateMsg, () => {})
            break;
          case 1:
            app.showToast(data.stateMsg, () => {})
            break;
          case 2:
            app.showToast(data.stateMsg, () => {
              wx.navigateTo({
                url: '/my/merchant/merchant',
              })
            })
            break;
          case 3:
            app.showToast(data.stateMsg, () => {})
            break;
          case 4:
            app.showToast(data.stateMsg, () => {})
            break;
          case 5:
            app.showToast(data.stateMsg, () => {})
            break;
          case 6:
            app.showToast(data.stateMsg, () => {})
            break;
        }
      })
    }
  }
})