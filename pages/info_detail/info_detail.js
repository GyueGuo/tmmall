const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    article_id: '',
    info: {
      web_content:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color,
      article_id: options.article_id
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
    http.post(app.globalData.hot_view, {
      articleId: this.data.articleId,
    }).then(res => {
      this.setData({
        info: res.result,
        attention_state: res.result.attention_state
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
    http.post(app.globalData.collect_article, {
      articleId: this.data.info.articleId
    }).then(res => {
      this.setData({
        attention_state: 1
      })
      app.showSuccessToast('收藏成功')
    })
  },

  /**
   * 取消收藏商品
   */
  onCancelCollect() {
    http.post(app.globalData.view_collect_article_delete, {
      articleId: this.data.info.articleId
    }).then(res => {
      this.setData({
        attention_state: null
      })
      app.showToast('取消收藏成功')
    })
  }
})