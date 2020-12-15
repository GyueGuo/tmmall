const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    letters: []
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
    http.post(app.globalData.area_index).then(res => {
      let [letters,arr] = [res.result,[]]
      for (let letter of letters) {
        arr.push(letter.initials)
      }
      this.setData({
        current_location: app.globalData.current_location,
        list: res.result,
        hot: res.hot,
        letters: arr
      })
    })
  },

  /**
   *  选择索引
   */
  indexEvent(e) {
    let [letterIndex, letter] = [Math.round((e.changedTouches["0"].pageY - 130) / 15),'']
    if (letterIndex == 0) {
      letter = this.data.letters[0];
    } else {
      letter = this.data.letters[letterIndex - 1];
    }
    this.setData({
      initials: 'i-' + letterIndex
    })
  },

  /**
   * 选中
   */
  selectWord(e) {
    let [letterIndex, letter] = [Math.round((e.changedTouches["0"].pageY - 130) / 15), this.data.letters[letterIndex]]
    this.setData({
      initials: 'i-' + letterIndex
    })
  },

  onCity(e) {
    let pages = getCurrentPages();
    let prePages = pages[pages.length - 2]
    prePages.setData({
      location: e.currentTarget.dataset.name
    })
    app.globalData.location = e.currentTarget.dataset.name
    event.emit('refreshNearby')
    wx.navigateBack()
  }
})