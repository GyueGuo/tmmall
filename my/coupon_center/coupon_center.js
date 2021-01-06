const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //选项卡
    tabList: [{
      goodsClassifyId: '',
      title: '精选'
    }],
    currentTab: '',
    page: 1,
    list: [],
    total: '',
    countDown: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      configSwitch: app.globalData.configSwitch
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getClassify()
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
    clearInterval(this.data.countDown)
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
    if (this.data.total > this.data.list.length) {
      this.data.page++
        this.getConponList()
    }
  },

  /**
   * 换券
   */
  onChangeCoupon() {
    wx.redirectTo({
      url: '../changeCoupon/changeCoupon',
    })
  },

  /**
   * 获取一级列表
   */
  getClassify() {
    http.post(app.globalData.classifyParent).then(res => {
      this.setData({
        classify: this.data.tabList.concat(res.result)
      })
      this.getConponList()
    })
  },

  /**
   * 点击分类
   */
  onClassify(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.id,
      page: 1
    })
    this.getConponList()
  },

  /**
   * 分类更多
   */
  onMore() {
    this.setData({
      moreBoard: true
    })
  },

  /**
   *  关闭更多
   */
  closeBoard() {
    this.setData({
      moreBoard: false
    })
  },

  /**
   * 点击更多选项
   */
  onTabMoreItem(e) {
    this.closeBoard()
    this.setData({
      srollId: 'a-' + e.currentTarget.dataset.index,
      currentTab: e.currentTarget.dataset.id,
      page: 1
    })
    this.getConponList()
  },

  /**
   * 获取优惠券列表
   */
  getConponList() {
    http.post(app.globalData.couponCenter, {
      category: this.data.currentTab,
      page: this.data.page
    }).then(res => {
      if (this.data.page == 1) {
        this.setData({
          list: res.result.data,
          total: res.result.total
        })
      } else {
        this.setData({
          list: [...this.data.list, ...res.result.data]
        })
      }
      this.countDown()
      clearInterval(this.data.countDown)
      this.data.countDown = setInterval(() => {
        this.countDown()
      }, 1000)
    })
  },

  /**
   * 倒计时
   */
  countDown() {
    for (let i = 0, len = this.data.list.length; i < len; i++) {
      if (this.data.list[i].distanceStartTime > 0) {
        let second = this.data.list[i].distanceStartTime
        this.data.list[i]['hour'] = Math.floor((second) % (24 * 3600) / 3600) < 10 ? '0' + Math.floor((second) % (24 * 3600) / 3600) : Math.floor((second) % (24 * 3600) / 3600)
        this.data.list[i]['min'] = Math.floor(second / 60 % 60) < 10 ? '0' + Math.floor(second / 60 % 60) : Math.floor(second / 60 % 60)
        this.data.list[i]['sec'] = Math.floor(second % 60) < 10 ? '0' + Math.floor(second % 60) : Math.floor(second % 60)
        this.data.list[i].distanceStartTime--
      }
    }
    this.setData({
      list: this.data.list
    })
  },

  /**
   * 立即领取
   */
  onGetCoupon(e) {
    if (!app.login()) {
      return
    }
    let item = e.currentTarget.dataset.item,
      index = e.currentTarget.dataset.index
    http.post(app.globalData.getCoupon, {
      couponId: item.couponId,
      goodsClassifyId: item.type == 1 ? item.classifyStr : '',
      storeId: item.type == 0 ? item.classifyStr : '',
    }).then(res => {
      this.data.list[index].memberState = 1
      this.setData({
        list: this.data.list
      })
      app.showSuccessToast('领取成功')
    })
  },

  goUse(e) {
    let item = e.currentTarget.dataset.item
    if (this.data.configSwitch.versionInfo.oneMore == 0) {
      wx.navigateTo({
        url: '/pages/searchGoods/searchGoods',
      })
      return
    }
    if (item.type == 0) {
      wx.navigateTo({
        url: '/nearbyShops/shopDetail/shopDetail?storeId=' + item.classifyStr,
      })
    } else {
      wx.navigateTo({
        url: '/pages/searchGoods/searchGoods?goodsClassifyId=' + item.classifyStr,
      })
    }
  }

})