const app = getApp();
const event = require('../../utils/event.js');
import http from '../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //兑换 换购
    exchangeTab: 1,
    //个人信息
    memberInfo: null,
    //广告
    adv: null,
    classifyId: '',
    //积分不足弹框
    lackIntegral: false,
    page: 1,
    total: '',
    result: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      configSwitch: app.globalData.configSwitch,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getGoods()
    event.on('refreshIntegral', this, () => {
      this.getData()
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (app.globalData.memberId != '' && app.globalData.phone != '') {
      this.getUserData()
    }
    this.getData()
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
    event.remove('refreshIntegral', this)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.result.length < this.data.total) {
      this.data.page++;
      this.getGoods()
    }
  },

  /**
   * 获取用户数据
   */
  getUserData() {
    http.post(app.globalData.integralIndex, {}).then(res => {
      this.setData({
        memberInfo: res.memberInfo,
        adv: this.data.adv == undefined ? res.adv : this.data.adv,
      })
    })
  },

  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.integralClassify, {}).then(res => {
      let classify = [{
        integralClassify: '',
        title: '全部'
      }]
      this.setData({
        classify: [...classify, ...res.result]
      })
    })
  },

  /**
   *  获取列表
   */
  getGoods() {
    http.post(app.globalData.integralGoods, {
      type: this.data.exchangeTab == 1 ? 0 : 1,
      integralClassifyId: this.data.classifyId,
      page: this.data.page
    }).then(res => {
      if (this.data.page == 1) {
        this.setData({
          result: res.result.data,
          total: res.result.total,
          ratio: res.integralRatio,
        })
      } else {
        this.setData({
          result: [...this.data.result, ...res.result.data]
        })
      }
    })
  },

  /**
   * 签到
   */
  signIn() {
    if (app.login()) {
      http.post(app.globalData.sign, {}).then(() => {
        this.getUserData()
      })
    }
  },

  /**
   * 积分详情
   */
  onDetail() {
    wx.navigateTo({
      url: '../integralDetail/integralDetail',
    })
  },

  onHelp() {
    wx.navigateTo({
      url: '../webView/webView?src=' + app.globalData.integralHelp,
    })
  },

  /**
   * 赚积分
   */
  onTask() {
    if (app.login()) {
      wx.navigateTo({
        url: '../integralTask/integralTask',
      })
    }
  },

  /**
   * 换好券
   */
  onChangeCoupon() {
    wx.navigateTo({
      url: '../changeCoupon/changeCoupon',
    })
  },

  /**
   * 兑换记录
   */
  onRecord() {
    if (app.login()) {
      wx.navigateTo({
        url: '../integralRecord/integralRecord',
      })
    }
  },

  /**
   * 积分兑换
   */
  creditsExchange() {
    this.setData({
      exchangeTab: 1,
      classifyId: 0,
      page: 1,
      result: []
    })
    this.getGoods()
  },

  /**
   * 积分换购
   */
  pointRedemption() {
    this.setData({
      exchangeTab: 2,
      classifyId: 0,
      page: 1,
      result: []
    })
    this.getGoods()
  },

  /**
   * 兑换商品
   */
  onGood(e) {
    wx.navigateTo({
      url: '/my/integralGoodDetail/integralGoodDetail?id=' + e.currentTarget.dataset.id
    })
  },

  /**
   * 点击选项卡
   */
  onTab(e) {
    this.setData({
      classifyId: e.currentTarget.dataset.id,
      page: 1
    })
    this.getGoods()
  },

  /**
   * 积分不足关闭
   */
  closeBoard() {
    this.setData({
      lackIntegral: false
    })
  },
  /**
   * 游戏
   */
  game() {
    wx.navigateTo({
      url: '/activity/turnplate/turnplate',
    })
  },
  /**
   * 登录
   */
  loginStatus() {
    app.login()
  },

  adv() {
    switch (this.data.adv.type) {
      case 0:
        break;
      case 1:
        wx.navigateTo({
          url: `/nearbyShops/goodGetail/goodGetail?goodsId=${this.data.adv.content}`,
          success: () => {
            http.post(app.globalData.indexAdBrowseInc, {
              advId: this.data.adv.advId
            }).then(res => {})
          }
        })
        break;
      case 2:
        wx.navigateTo({
          url: `/nearbyShops/shopDetail/shopDetail?storeId=${this.data.adv.content}`,
          success: () => {
            http.post(app.globalData.indexAdBrowseInc, {
              advId: this.data.adv.advId
            }).then(res => {})
          }
        })
        break;
    }

  }
})