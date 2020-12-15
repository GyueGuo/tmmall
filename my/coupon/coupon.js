const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //选项卡
    tab_list: [{
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
    current_status: 0,
    list: [],
    total: '',
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color,
      configSwitch: app.globalData.configSwitch
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getCouponList()
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
      current_status: e.currentTarget.dataset.status,
      page: 1,
      list: []
    })
    this.getCouponList()
  },

  goUse(e) {
    let item = e.currentTarget.dataset.item
    if (item.type == 0) {
      if (this.data.configSwitch.version_info.one_more == 1 && app.globalData.isShops == 0) {
        wx.navigateTo({
          url: '/nearby_shops/shop_detail/shop_detail?store_id=' + item.store_id,
        })
      } else {
        wx.navigateTo({
          url: '/pages/search_goods/search_goods'
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/search_goods/search_goods?goods_classify_id=' + item.goods_classify_id,
      })
    }
  },

  /**
   * 领券中心
   */
  onCouponCenter() {
    wx.navigateTo({
      url: '../coupon_center/coupon_center',
    })
  },

  /**
   * 换券中心
   */
  onChangeCoupon() {
    wx.navigateTo({
      url: '../change_coupon/change_coupon',
    })
  },

  /**
   * 获取数据
   */
  getCouponList() {
    http.post(app.globalData.member_coupon, {
      status: this.data.current_status + '',
      page: this.data.page
    }).then(res => {
      for (let i of res.result.data) {
        i.start_time = i.start_time.replace(/-/g, '.')
        i.end_time = i.end_time.replace(/-/g, '.')
      }
      if (this.data.page == 1) {
        this.data.tab_list[0].title = '未使用(' + res.statistics.unused + ')'
        this.data.tab_list[1].title = '已使用(' + res.statistics.been_used + ')'
        this.data.tab_list[2].title = '已过期(' + res.statistics.have_expired + ')'
        this.setData({
          list: res.result.data,
          total: res.result.total,
          tab_list: this.data.tab_list
        })
      } else {
        this.setData({
          list: [...this.data.list, ...res.result.data]
        })
      }
    })
  }
})