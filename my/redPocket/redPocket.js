const app = getApp();
import http from '../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: ['未使用', '已使用', '已过期'],
    tab: 0,
    page: 1,
    total: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor
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
    this.data.page = 1
    this.getData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.total > this.data.list.length) {
      this.data.page++;
      this.getData()
    }
  },

  /**
   * 选项卡
   */
  onTab(e) {
    this.setData({
      tab: e.currentTarget.dataset.index,
      page: 1,
      list: []
    })
    this.getData()
  },

  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.memberPacket, {
      status: this.data.tab + '',
      page: this.data.page
    }).then(res => {
      if (this.data.page == 1) {
        this.data.tabList = ['未使用(' + res.statistics.unused + ')', '已使用(' + res.statistics.beenUsed + ')', '已过期(' + res.statistics.haveExpired + ')'],
          this.setData({
            tabList: this.data.tabList,
            list: res.result.data,
            total: res.result.total
          })
      } else {
        this.setData({
          list: [...this.data.list, ...res.result.data]
        })
      }
    })
  }
})