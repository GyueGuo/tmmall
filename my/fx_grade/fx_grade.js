// my/fx_grade/fx_grade.js
const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: '',
    level: [],
    info: {},
    rule_index: 0,
    level_index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
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
   * 获取数据
   */
  getData() {
    http.post(app.globalData.distribution_my_level, {
      distributionId: app.globalData.distribution.cur.distribution_id
    }).then(res => {
      this.setData({
        data: {
          avatar: res.data.avatar,
          nickname: res.data.nickname
        },
        levelList: res.data.level,
        info: res.data
      })
      // 获取当前等级索引
      let levelarr = res.data.level
      for (let i = 0, len = res.data.level.length; i < len; i++) {
        levelarr[i].level = `V${i+1}`
        if (res.data.level[i].distribution_level_id == res.data.distribution_level_id) {
          levelarr[i].newlevel = 1
          this.setData({
            rule_index: i
          })
        } else {
          levelarr[i].newlevel = 0
        }
      }
      if (res.data.level.length > 4 && res.data.level.length - this.data.rule_index >= 4) {
        levelarr = levelarr.slice(this.data.rule_index, this.data.rule_index + 4)
      } else if (res.data.level.length > 4 && res.data.level.length - this.data.rule_index < 4) {
        levelarr = levelarr.slice(res.data.level.length - 4)
      }
      for (let i = 0, len = levelarr.length; i < len; i++) {
        if (levelarr[i].newlevel == 1) {
          this.setData({
            level_index: i
          })
        }
      }
      this.setData({
        level: levelarr
      })
    })
  },
  /**
   * 升降记录
   */
  gorecord() {
    wx.navigateTo({
      url: '/my/fx_change_record/fx_change_record',
    })
  },
  /**
   * 去邀请
   */
  goYq() {
    wx.navigateTo({
      url: '/my/fx_invitation/fx_invitation',
    })
  },
  /**
   * 去购买
   */
  goShop() {
    wx.navigateTo({
      url: '/my/fx_goods_list/fx_goods_list',
    })
  },
})