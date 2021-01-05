const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: [],
    interval_id: 0,
    page: 1,
    total: '',
    limit_list: [],
    //计时器
    count_down: {},
    time: ''
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
    this.getLimitTime()
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
    clearInterval(this.data.count_down)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.data.page = 1
    this.getLimitList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.total > this.data.limit_list.length) {
      this.data.page++;
      this.getLimitList()
    }
  },

  /**
   * 选项卡
   */
  onTab(e) {
    this.setData({
      interval_id: e.currentTarget.dataset.id,
      page: 1,
      list: []
    })
    this.getLimitList()
  },

  /**
   * 商品详情
   */
  onGood(e) {
    if (this.data.interval_id == this.data.tab[0].limit_interval_id) {
      wx.navigateTo({
        url: '/nearby_shops/good_detail/good_detail?goods_id=' + e.currentTarget.dataset.id,
      })
    } else {
      wx.showToast({
        title: '即将开抢哦~',
        icon: 'none'
      })
    }
  },

  /**
   * 抢购时间
   */
  getLimitTime() {
    http.post(app.globalData.time_limit).then(res => {
      this.setData({
        tab: res.result,
        interval_id: res.result[0].limitIntervalId
      })
      this.getLimitList()
    })
  },

  /**
   * 抢购列表
   */
  getLimitList() {
    http.post(app.globalData.limit_list, {
      intervalId: this.data.interval_id,
      page: this.data.page
    }).then(res => {
      if (this.data.page == 1) {
        this.setData({
          finish: true,
          total: res.result.total,
          limit_list: res.result.data,
          state: res.when.state,
          time: res.when.time
        })
        clearInterval(this.data.count_down)
        this.countDown()
        this.data.count_down = setInterval(() => {
          this.countDown()
        }, 1000)
      } else {
        this.setData({
          limit_list: [...this.data.limit_list, ...res.result.data]
        })
      }
    })
  },

  /**
   * 倒计时
   */
  countDown() {
    if (this.data.time == 0) {
      this.getLimitTime()
      return
    }
    let hour = Math.floor(this.data.time / 3600) < 10 ? '0' + Math.floor(this.data.time / 3600) : Math.floor(this.data.time / 3600),
      min = Math.floor(this.data.time / 60 % 60) < 10 ? '0' + Math.floor(this.data.time / 60 % 60) : Math.floor(this.data.time / 60 % 60),
      sec = Math.floor(this.data.time % 60) < 10 ? '0' + Math.floor(this.data.time % 60) : Math.floor(this.data.time % 60)
    this.data.time--;
    this.setData({
      hour: hour,
      min: min,
      sec: sec
    })
  },
  /**
   * 页面滑动 返回顶部是否显示
   */
  scroll(e) {
    if (e.detail.scrollTop > 100) {
      this.selectComponent("#go_top").rise()
    } else {
      this.selectComponent("#go_top").decline()
    }
  },

  /**
   * 返回顶部
   */
  onBackTop() {
    this.setData({
      scroll_top: 0
    })
  },

})