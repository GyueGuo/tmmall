const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    store_article_id: '',
    article_id: '',
    info: null,
    web_content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color,
      article_id: options.id,
      store_id: options.store_id
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
    http.post(app.globalData.article_view, {
      articleId: this.data.article_id,
      storeId: this.data.store_id
    }).then(res => {
      this.setData({
        info: res,
        web_content: res.result.web_content
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
      url = app.globalData.collect_store
    } else {
      url = app.globalData.store_index_delete
    }
    http.post(url, {
      store_id: this.data.store_id
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