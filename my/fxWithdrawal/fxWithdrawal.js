const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //提现方式
    wayIndex: 1,
    wayType: '',
    wayList: [],
    //注意事项
    noticeList: [],
    //提现金额
    withdrawalPrice: 0,
    txPrice: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      diyColor: app.globalData.diyColor
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.cardDetails()
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
    if (e.currentTarget.dataset.index == 3 && this.data.cardDetails == null) {
      this.showModal()
      return
    }
    this.setData({
      wayIndex: e.currentTarget.dataset.index,
      wayType: e.currentTarget.dataset.index
    })
  },

  /**
   * bindinput
   */
  bindinput(e) {
    this.setData({
      withdrawalPrice: e.detail.value
    })
  },

  /**
   * 立即提现
   */
  submit() {
    if (parseFloat(this.data.withdrawalPrice) < parseFloat(this.data.info.rule.minPrice)) {
      wx.showToast({
        title: '提现金额不可低于' + this.data.info.rule.minPrice + '元',
        icon: 'none'
      })
      return
    }
    if (parseFloat(this.data.withdrawalPrice) > parseFloat(this.data.txPrice)) {
      wx.showToast({
        title: '提现金额不可大于当前收益',
        icon: 'none'
      })
      return
    }
    if (this.data.withdrawalPrice=='') {
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none'
      })
      return
    }
    if (this.data.wayType == 3 && this.cardDetails == null) {
      this.showModal()
      return
    }
    http.post(app.globalData.distributionWithdrawalToApply, {
      distributionId: app.globalData.distribution.cur.distributionId,
      price: this.data.withdrawalPrice,
      distributionType: this.data.wayType,
      cardId: this.data.wayType != 3 ? 1 : this.data.cardDetails.cardId
    }).then(res => {
      wx.redirectTo({
        url: '/my/fxTxOver/fxTxOver',
      })
    })
  },

  /**
   * 提现记录
   */
  record() {
    wx.navigateTo({
      url: '/my/fxRecordList/fxRecordList',
    })
  },
  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.distributionWithdrawalIndex, {
      distributionId: app.globalData.distribution.cur.distributionId
    }).then(res => {
      this.setData({
        info: res.data,
        withdrawalPrice: res.data.closeBrokerage,
        txPrice: res.data.closeBrokerage,
        noticeList: res.data.notifyExplain,
        wayIndex: res.data.rule.type[0],
        wayType: res.data.rule.type[0],
      })
      let wayList = [],
        yue = {
          wayType: 1,
          wayImg: app.globalData.HTTP + 'mobile/small/image/syt-qb.png',
          title: '余额'
        },
        wx = {
          wayType: 2,
          wayImg: app.globalData.HTTP + 'mobile/small/image/syt-wx.png',
          title: '微信'
        },
        bank = {
          wayType: 3,
          wayImg: app.globalData.HTTP + 'mobile/small/image/bank/bank_1.png',
          title: '银行卡'
        }
      for (let i = 0, len = res.data.rule.type.length; i < len; i++) {
        switch (res.data.rule.type[i]) {
          case '1':
            wayList.push(yue)
            break;
          case '2':
            wayList.push(wx)
            break;
          case '3':
            wayList.push(bank)
            break;
        }
      }
      this.setData({
        wayList: wayList
      })
    })
  },
  /**
   * 获取银行卡
   */
  cardDetails() {
    http.post(app.globalData.cardDetails, {
      id: 0
    }).then(res => {
      this.setData({
        cardDetails: res.result
      })
    })
  },

  /**
   * 选择银行卡
   */
  bankcard() {
    wx.navigateTo({
      url: '/my/bankList/bankList?select=1',
    })
  },
  showModal() {
    this.selectComponent("#modal").showModal()
  },
})