const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exchange_board: false,
    page: 1,
    total: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color
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
   * 获取数据
   */
  getCouponList() {
    http.post(app.globalData.coupon_exchange_list, {
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
   * 立即兑换
   */
  onExchange(e) {
    let item = e.currentTarget.dataset.item
    if (app.login()) {
      if (item.exchange_num == 0) {
        wx.showToast({
          title: '已被抢光~',
          icon: 'none'
        })
        return
      }
      http.post(app.globalData.coupon_exchange_view, {
        couponId: item.coupon_id
      }).then(res => {
        this.setData({
          exchange_board: true,
          info: res.result
        })
      })
    }
  },

  /**
   * 兑换商品
   */
  changeCoupon() {
    http.post(app.globalData.exchange_coupon, {
      couponId: this.data.info.coupon_id,
      goodsClassifyId: this.data.info.type == 1 ? this.data.info.classifyStr : '',
      storeId: this.data.info.type == 0 ? this.data.info.classify_str : '',
    }).then(res => {
      this.onCloseExchange()
      app.showSuccessToast('换取成功')
    })
  },

  /**
   * 查看全部商品
   */
  onChangeCouponList(e) {
    let item = e.currentTarget.dataset.data;
    if (item.type == 0 && app.globalData.isShops == 0) {
      wx.navigateTo({
        url: '/nearby_shops/shop_detail/shop_detail?store_id=' + item.classify_str,
      })
    } else if (app.globalData.isShops == 1) {
      wx.navigateTo({
        url: '/pages/search_goods/search_goods',
      })
    } else {
      wx.navigateTo({
        url: '/pages/search_goods/search_goods?goods_classify_id=' + item.classify_str,
      })
    }
  },

  /**
   * 关闭弹窗
   */
  onCloseExchange() {
    this.setData({
      exchange_board: false
    })
  },

  /**
   * 领券
   */
  onCouponCenter() {
    wx.redirectTo({
      url: '../coupon_center/coupon_center',
    })
  },

  /**
   * 积分商城
   */
  onIntegral() {
    wx.navigateTo({
      url: '/my/integral/integral',
    })
  },
  /**
   * 
   */
  goUse(e) {
    let item = e.currentTarget.dataset.item
    if (this.data.configSwitch.version_info.one_more == 0) {
      wx.navigateTo({
        url: '/pages/search_goods/search_goods',
      })
      return
    }
    if (item.type == 0) {
      wx.navigateTo({
        url: '/nearby_shops/shop_detail/shop_detail?store_id=' + item.classify_str,
      })
    } else {
      wx.navigateTo({
        url: '/pages/search_goods/search_goods?goods_classify_id=' + item.classify_str,
      })
    }
  }
})