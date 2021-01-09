const app = getApp();
import http from '../../utils/http';
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeArticleId: '',
    articleId: '',
    info: null,
    webContent: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      articleId: options.id,
      storeId: options.storeId
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
    //动态详情
    http.post(app.globalData.articleView, {
      articleId: this.data.articleId,
      storeId: this.data.storeId
    }).then(res => {
      this.setData({
        info: res,
        webContent: res.result.webContent
      })
    })
  },

  /**
   * 选择商品
   */
  onGoods() {
    this.setData({
      isShow: true
    })
  },

  /**
   * 关注店铺
   */
  collectStore() {
    let url = ''
    if (this.data.info.result.shop.state == 0) {
      url = app.globalData.collectStore
    } else {
      url = app.globalData.storeIndexDelete
    }
    http.post(url, {
      storeId: this.data.storeId
    }).then(res => {
      if (this.data.info.result.shop.state == 0) {
        this.data.info.result.shop.state = 1
      } else {
        this.data.info.result.shop.state = 0
      }
      this.setData({
        info: this.data.info
      })
      event.emit('collect')
      app.showSuccessToast(res.message)
    })
  },
})