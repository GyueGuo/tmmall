const app = getApp();
import http from '../../utils/http';
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleId: '',
    info: {
      webContent:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      articleId: options.articleId
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
    http.post(app.globalData.hotView, {
      articleId: this.data.articleId,
    }).then(res => {
      this.setData({
        info: res.result,
        attentionState: res.result.attentionState
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
   * 收藏商品
   */
  onCollect() {
    if (!app.login()) {
      return
    }
    http.post(app.globalData.collectArticle, {
      articleId: this.data.info.articleId
    }).then(res => {
      this.setData({
        attentionState: 1
      })
      app.showSuccessToast('收藏成功')
    })
  },

  /**
   * 取消收藏商品
   */
  onCancelCollect() {
    http.post(app.globalData.viewCollectArticleDelete, {
      articleId: this.data.info.articleId
    }).then(res => {
      this.setData({
        attentionState: null
      })
      app.showToast('取消收藏成功')
    })
  }
})