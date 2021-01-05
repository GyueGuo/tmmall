const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //选项卡
    tabList: [{
      title: '未使用',
      status: '0'
    }, {
      title: '已使用',
      status: '1'
    }, {
      title: '已过期',
      status: '2'
    }],
    //当前选项卡
    currentStatus: 0,
    list: [],
    total: '',
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
      diyColor: app.globalData.diyColor,
      configSwitch: app.globalData.configSwitch
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.getCouponList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {

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
    this.getCouponList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.total > this.data.list.length) {
      this.data.page++;
      this.getCouponList()
    }
  },

  /**
   * 点击选项卡
   */
  onTab(e) {
    this.setData({
      currentStatus: e.currentTarget.dataset.status,
      page: 1,
      list: []
    })
    this.getCouponList()
  },

  goUse(e) {
    let item = e.currentTarget.dataset.item
    if (item.type == 0) {
      if (this.data.configSwitch.versionInfo.oneMore == 1 && app.globalData.isShops == 0) {
        wx.navigateTo({
          url: '/nearbyShops/shopDetail/shopDetail?storeId=' + item.storeId,
        })
      } else {
        wx.navigateTo({
          url: '/pages/searchGoods/searchGoods'
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/searchGoods/searchGoods?goodsClassifyId=' + item.goodsClassifyId,
      })
    }
  },

  /**
   * 领券中心
   */
  onCouponCenter() {
    wx.navigateTo({
      url: '../couponCenter/couponCenter',
    })
  },

  /**
   * 换券中心
   */
  onChangeCoupon() {
    wx.navigateTo({
      url: '../changeCoupon/changeCoupon',
    })
  },

  /**
   * 获取数据
   */
  getCouponList() {
    http.post(app.globalData.memberCoupon, {
      status: this.data.currentStatus + '',
      page: this.data.page
    }).then(res => {
      for (let i of res.result.data) {
        i.startTime = i.startTime.replace(/-/g, '.')
        i.endTime = i.endTime.replace(/-/g, '.')
      }
      if (this.data.page == 1) {
        this.data.tabList[0].title = '未使用(' + res.statistics.unused + ')'
        this.data.tabList[1].title = '已使用(' + res.statistics.beenUsed + ')'
        this.data.tabList[2].title = '已过期(' + res.statistics.haveExpired + ')'
        this.setData({
          list: res.result.data,
          total: res.result.total,
          tabList: this.data.tabList
        })
      } else {
        this.setData({
          list: [...this.data.list, ...res.result.data]
        })
      }
    })
  }
})