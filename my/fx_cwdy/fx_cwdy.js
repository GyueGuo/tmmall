// my/fx_cwdy/fx_cwdy.js
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
      url: '/my/fx_apply_dy/fx_apply_dy',
    })
  },
  /**
   * 代言专区
   */
  goDyzq() {
    const page = getCurrentPages()
    for (let i = 0, len = page.length; i < len; i++) {
      if (page[i].route == 'my/fx_goods_list/fx_goods_list') {
        console.log(i)
        wx.navigateBack({
          delta: page.length - i - 1
        })
        return
        break;
      }
    }
    wx.navigateTo({
      url: '/my/fx_goods_list/fx_goods_list',
    })
  },
  /**
   * 去逛逛
   */
  goHome() {
    let page = getCurrentPages()
    for (let i of page) {
      if (i.route == 'my/fx_goods_list/fx_goods_list') {
        wx.navigateBack({
          delta: i
        })
        return
        break;
      }
    }
    wx.navigateTo({
      url: '/my/fx_goods_list/fx_goods_list',
    })
  },
  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.tobe_distributor_rule, {}).then(res => {
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
    http.post(app.globalData.distribution_share_info, {
      distributionId: 0
    }).then(res => {
      app.globalData.distribution = res.data
      this.setData({
        distribution: res.data
      })
      let member_info = wx.getStorageSync('member_info')
      if (member_info.distribution_record == null) {
        let distribution_record = {
          distribution_id: res.data.cur == null ? null : res.data.cur.distribution_id,
          audit_status: res.data.cur == null ? null : res.data.cur.audit_status
        }
        member_info.distribution_record = distribution_record
      } else {
        member_info.distribution_record.distribution_id = res.data.cur == null ? null : res.data.cur.distribution_id,
          member_info.distribution_record.audit_status = res.data.cur == null ? null : res.data.cur.audit_status
      }
      wx.setStorageSync('member_info', member_info)

    })
  },
  /**
   * 会员成为代言人
   */
  vipTurnDist() {
    http.post(app.globalData.distribution_vipTurnDist, {}).then(res => {
      let obj = {
        distribution_id: res.data.distribution_id
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