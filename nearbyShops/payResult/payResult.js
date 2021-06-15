const app = getApp();
import http from '../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {},
    shareInfo: {
      isFirstTobe: 0
    },
    recommendList: [],
    discount: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      item: JSON.parse(decodeURIComponent(options.item)),
      diyColor: app.globalData.diyColor
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
    // this.getDataShareInfo()
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
  getDataShareInfo() {
    http.post(app.globalData.distributionQueryPoint, {
      outTradeNo: this.data.item.outTradeNo
    }).then(res => {
      this.setData({
        shareInfo: res.data
      })
      this.getGoods()
    })
  },

  /**
   * 获取商品列表
   */
  getGoods() {
    let isDistribution
    if (this.data.shareInfo.hasDistribution == 1) {
      isDistribution = 1
    } else {
      isDistribution = 0
    }
    http.post(app.globalData.distributionGoodsList, {
      isDistribution: isDistribution,
      isDistributor: isDistribution
    }).then(res => {
      this.setData({
        recommendList: res.result.data,
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
      url: '/my/fxGoodsList/fxGoodsList',
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