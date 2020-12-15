// my/fx_withdrawal/fx_withdrawal.js
const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //提现方式
    way_index: 1,
    way_type: '',
    way_list: [],
    //注意事项
    notice_list: [],
    //提现金额
    withdrawal_price: 0,
    tx_price: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      diy_color: app.globalData.diy_color
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.card_details()
    this.getData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 选择提现方式
   */
  way(e) {
    if (e.currentTarget.dataset.index == 3 && this.data.card_details == null) {
      this.showModal()
      return
    }
    this.setData({
      way_index: e.currentTarget.dataset.index,
      way_type: e.currentTarget.dataset.index
    })
  },

  /**
   * bindinput
   */
  bindinput(e) {
    this.setData({
      withdrawal_price: e.detail.value
    })
  },

  /**
   * 立即提现
   */
  submit() {
    if (parseFloat(this.data.withdrawal_price) < parseFloat(this.data.info.rule.min_price)) {
      wx.showToast({
        title: '提现金额不可低于' + this.data.info.rule.min_price + '元',
        icon: 'none'
      })
      return
    }
    if (parseFloat(this.data.withdrawal_price) > parseFloat(this.data.tx_price)) {
      wx.showToast({
        title: '提现金额不可大于当前收益',
        icon: 'none'
      })
      return
    }
    if (this.data.withdrawal_price=='') {
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none'
      })
      return
    }
    if (this.data.way_type == 3 && this.card_details == null) {
      this.showModal()
      return
    }
    http.post(app.globalData.distribution_withdrawal_to_apply, {
      distributionId: app.globalData.distribution.cur.distribution_id,
      price: this.data.withdrawal_price,
      distributionType: this.data.way_type,
      cardId: this.data.way_type != 3 ? 1 : this.data.card_details.card_id
    }).then(res => {
      wx.redirectTo({
        url: '/my/fx_tx_over/fx_tx_over',
      })
    })
  },

  /**
   * 提现记录
   */
  record() {
    wx.navigateTo({
      url: '/my/fx_record_list/fx_record_list',
    })
  },
  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.distribution_withdrawal_index, {
      distributionId: app.globalData.distribution.cur.distribution_id
    }).then(res => {
      this.setData({
        info: res.data,
        withdrawal_price: res.data.close_brokerage,
        tx_price: res.data.close_brokerage,
        notice_list: res.data.notify_explain,
        way_index: res.data.rule.type[0],
        way_type: res.data.rule.type[0],
      })
      let way_list = [],
        yue = {
          way_type: 1,
          way_img: app.globalData.HTTP + 'mobile/small/image/syt-qb.png',
          title: '余额'
        },
        wx = {
          way_type: 2,
          way_img: app.globalData.HTTP + 'mobile/small/image/syt-wx.png',
          title: '微信'
        },
        bank = {
          way_type: 3,
          way_img: app.globalData.HTTP + 'mobile/small/image/bank/bank_1.png',
          title: '银行卡'
        }
      for (let i = 0, len = res.data.rule.type.length; i < len; i++) {
        switch (res.data.rule.type[i]) {
          case '1':
            way_list.push(yue)
            break;
          case '2':
            way_list.push(wx)
            break;
          case '3':
            way_list.push(bank)
            break;
        }
      }
      this.setData({
        way_list: way_list
      })
    })
  },
  /**
   * 获取银行卡
   */
  card_details() {
    http.post(app.globalData.card_details, {
      id: 0
    }).then(res => {
      this.setData({
        card_details: res.result
      })
    })
  },

  /**
   * 选择银行卡
   */
  bankcard() {
    wx.navigateTo({
      url: '/my/bank_list/bank_list?select=1',
    })
  },
  showModal() {
    this.selectComponent("#modal").showModal()
  },
})