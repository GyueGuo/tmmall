const app = getApp();
import http from '../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    total: '',
    page: 1,
    //当前选中的
    index: ''
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
    this.getList()
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
    this.setData({
      page: 1,
      list: []
    })
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.total > this.data.list.length) {
      this.data.page++;
      this.getList()
    }
  },

  /**
   * 获取数据
   */
  getList() {
    http.postList(app.globalData.articleList, {
      page: this.data.page
    }).then(res => {
      if (this.data.page == 1) {
        this.setData({
          total: res.result.total,
          list: res.result.data
        })
      } else {
        this.setData({
          list: [...this.data.list, ...res.result.data]
        })
      }
    })
  },

  /**
   * 内容详情
   */
  onDetail(e) {
    if (!this.data.isLong) {
      wx.navigateTo({
        url: '/pages/infoDetail/infoDetail?articleId=' + e.currentTarget.dataset.id,
      })
    }
    this.data.isLong = false
  },

  /**
   * 删除
   */
  deleteShop(e) {
    this.data.isLong = true
    this.selectComponent("#modal").showModal()
    this.data.index = e.currentTarget.dataset.index
  },

  /**
   * 确认删除
   */
  deleteConfirm() {
    http.post(app.globalData.collectArticleDelete, {
      collectArticleId: this.data.list[this.data.index].collectArticleId + '',
      articleId: this.data.list[this.data.index].collectArticleId + '',
    }).then(() => {
      this.data.list.splice(this.data.index, 1)
      this.setData({
        list: this.data.list
      })
      app.showSuccessToast('取消收藏成功')
    })
  }
})