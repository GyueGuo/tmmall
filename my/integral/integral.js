const app = getApp();
const event = require('../../utils/event.js');
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //兑换 换购
    exchange_tab: 1,
    //个人信息
    member_info: null,
    //广告
    adv: null,
    classify_id: '',
    //积分不足弹框
    lack_integral: false,
    page: 1,
    total: '',
    result: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color,
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
    if (app.globalData.member_id != '' && app.globalData.phone != '') {
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
    http.post(app.globalData.integral_index, {}).then(res => {
      this.setData({
        member_info: res.memberInfo,
        adv: this.data.adv == undefined ? res.adv : this.data.adv,
      })
    })
  },

  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.integral_classify, {}).then(res => {
      let classify = [{
        integral_classify_id: '',
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
    http.post(app.globalData.integral_goods, {
      type: this.data.exchange_tab == 1 ? 0 : 1,
      integralClassifyId: this.data.classify_id,
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
      url: '../integral_detail/integral_detail',
    })
  },

  onHelp() {
    wx.navigateTo({
      url: '../web_view/web_view?src=' + app.globalData.integral_help,
    })
  },

  /**
   * 赚积分
   */
  onTask() {
    if (app.login()) {
      wx.navigateTo({
        url: '../integral_task/integral_task',
      })
    }
  },

  /**
   * 换好券
   */
  onChangeCoupon() {
    wx.navigateTo({
      url: '../change_coupon/change_coupon',
    })
  },

  /**
   * 兑换记录
   */
  onRecord() {
    if (app.login()) {
      wx.navigateTo({
        url: '../integral_record/integral_record',
      })
    }
  },

  /**
   * 积分兑换
   */
  creditsExchange() {
    this.setData({
      exchange_tab: 1,
      classify_id: 0,
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
      exchange_tab: 2,
      classify_id: 0,
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
      url: '/my/integral_good_detail/integral_good_detail?id=' + e.currentTarget.dataset.id
    })
  },

  /**
   * 点击选项卡
   */
  onTab(e) {
    this.setData({
      classify_id: e.currentTarget.dataset.id,
      page: 1
    })
    this.getGoods()
  },

  /**
   * 积分不足关闭
   */
  closeBoard() {
    this.setData({
      lack_integral: false
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
  login_status() {
    app.login()
  },

  adv() {
    switch (this.data.adv.type) {
      case 0:
        break;
      case 1:
        wx.navigateTo({
          url: `/nearby_shops/good_detail/good_detail?goods_id=${this.data.adv.content}`,
          success: () => {
            http.post(app.globalData.index_adBrowseInc, {
              advId: this.data.adv.adv_id
            }).then(res => {})
          }
        })
        break;
      case 2:
        wx.navigateTo({
          url: `/nearby_shops/shop_detail/shop_detail?store_id=${this.data.adv.content}`,
          success: () => {
            http.post(app.globalData.index_adBrowseInc, {
              advId: this.data.adv.adv_id
            }).then(res => {})
          }
        })
        break;
    }

  }
})