const http = require('../../utils/http.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
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
   * 申请代言
   */
  goDY() {
    wx.navigateTo({
      url: '/my/fxApplyDy/fxApplyDy',
    })
  },
  /**
   * 代言专区
   */
  goDyzq() {
    const page = getCurrentPages()
    for (let i = 0, len = page.length; i < len; i++) {
      if (page[i].route == 'my/fxGoodsList/fxGoodsList') {
        console.log(i)
        wx.navigateBack({
          delta: page.length - i - 1
        })
        return
        break;
      }
    }
    wx.navigateTo({
      url: '/my/fxGoodsList/fxGoodsList',
    })
  },
  /**
   * 去逛逛
   */
  goHome() {
    let page = getCurrentPages()
    for (let i of page) {
      if (i.route == 'my/fxGoodsList/fxGoodsList') {
        wx.navigateBack({
          delta: i
        })
        return
        break;
      }
    }
    wx.navigateTo({
      url: '/my/fxGoodsList/fxGoodsList',
    })
  },
  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.tobeDistributorRule, {}).then(res => {
      this.setData({
        info: res.data
      })
      if (res.data.length == 0) {
        this.getDistributionData()
      }
    })
  },

  /**
   * 获取代言信息
   */
  getDistributionData() {
    http.post(app.globalData.distributionShareInfo, {
      distributionId: 0
    }).then(res => {
      app.globalData.distribution = res.data
      this.setData({
        distribution: res.data
      })
      let memberInfo = wx.getStorageSync('memberInfo')
      if (memberInfo.distributionRecord == null) {
        let distributionRecord = {
          distributionId: res.data.cur == null ? null : res.data.cur.distributionId,
          auditStatus: res.data.cur == null ? null : res.data.cur.auditStatus
        }
        memberInfo.distributionRecord = distributionRecord
      } else {
        memberInfo.distributionRecord.distributionId = res.data.cur == null ? null : res.data.cur.distributionId,
          memberInfo.distributionRecord.auditStatus = res.data.cur == null ? null : res.data.cur.auditStatus
      }
      wx.setStorageSync('memberInfo', memberInfo)

    })
  },
  /**
   * 会员成为代言人
   */
  vipTurnDist() {
    http.post(app.globalData.distributionVipTurnDist, {}).then(res => {
      let obj = {
        distributionId: res.data.distributionId
      }
      this.data.distribution.cur = obj
      this.setData({
        distribution: this.data.distribution
      })
    })
  },
  /**
   * 去代言
   */
  // goDyzq() {
  //   wx.navigateBack({})
  // }
})