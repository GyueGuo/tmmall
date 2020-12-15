// nearby_shops/pay_result/pay_result.js
const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {},
    share_info: {
      is_first_tobe: 0
    },
    recommend_list: [],
    discount: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      item: JSON.parse(options.item),
      diy_color: app.globalData.diy_color
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getData_share_info()
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 获取邀请人信息
   */
  getData_share_info() {
    http.post(app.globalData.distribution_query_point, {
      outTradeNo: this.data.item.out_trade_no
    }).then(res => {
      this.setData({
        share_info: res.data
      })
      this.getGoods()
    })
  },

  /**
   * 获取商品列表
   */
  getGoods() {
    let is_distribution
    if (this.data.share_info.has_distribution == 1) {
      is_distribution = 1
    } else {
      is_distribution = 0
    }
    http.post(app.globalData.distribution_goods_list, {
      isDistribution: is_distribution,
      isDistributor: is_distribution
    }).then(res => {
      this.setData({
        recommend_list: res.result.data,
        discount: res.discount == null ? 100 : res.discount,
      })
    })
  },

  /**
   * 去首页
   */
  goHome() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },
  /**
   * 去我的
   */
  goOrder(e) {
    wx.switchTab({
      url: '/pages/my/my',
    })
  },
  /**
   * 去我的
   */
  goMy() {
    wx.redirectTo({
      url: '/my/fx_goods_list/fx_goods_list',
    })
  },
  /**
   * 加入购物车
   */
  addCart(e) {
    this.setData({
      info: e.detail,
    })
    this.selectComponent("#buy_board").show()
  },
})