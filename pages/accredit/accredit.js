const app = getApp();
import http from '../../utils/http';
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSubmit: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      configSwitch: app.globalData.configSwitch
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
   * 获取用户信息,授权
   */
  getUserInfo(e) {
    this.setData({
      loading: true,
      disabled: true
    })
    if (e.detail.encryptedData) {
      wx.login({
        success: loginRes => {
          if (loginRes.code) {
            wx.getUserInfo({
              success: (infoRes) => {
                this.Login(loginRes.code, infoRes)
              }
            })
          } else {
            this.setData({
              loading: false,
              disabled: false
            })
            wx.showToast({
              title: '登录失败',
              icon: 'none'
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '授权失败',
        icon: 'none'
      })
      this.setData({
        loading: false,
        disabled: false
      })
    }
  },
  /**
   * 登录
   */
  Login(code, infoRes) {
    wx.getSetting({
      success: setRes => {
        if (setRes.authSetting['scope.userInfo']) {
          let supId = app.globalData.supId
          http.post(app.globalData.login, {
            code,
            nickName: infoRes.userInfo.nickName,
            avatarUrl: infoRes.userInfo.avatarUrl,
            encryptedData: infoRes.encryptedData,
            iv: infoRes.iv,
            memberId: '',
            supId,
            devType: 3
          }).then(res => {
            wx.hideLoading()
            //绑定代言关系
            if (supId != '') {
              this.getDistributionData(supId)
            }
            wx.setStorageSync('memberId', res.member.memberId)
            wx.setStorageSync('phone', res.member.phone == null ? '' : res.member.phone)
            wx.setStorageSync('openid', res.openid)
            wx.setStorageSync('unionId', res.unionId)
            app.globalData.memberId = res.member.memberId
            app.globalData.phone = res.member.phone == null ? '' : res.member.phone
            app.globalData.openid = res.openid
            app.globalData.unionId = res.unionId
            app.globalData.PASTLOGIN = false
            wx.setStorageSync('memberInfo', res.member)
            app.showSuccessToast('登录成功', () => {
              if (app.globalData.phone == '') {
                wx.redirectTo({
                  url: '../bindPhone/bindPhone',
                })
              } else {
                let page = getCurrentPages()
                let route = page[page.length - 2].route //上一页地址
                switch (route) {
                  case 'nearbyShops/goodDetail/goodDetail': //是否是商品详情
                    page[page.length - 2].getData()
                    break;
                  case 'my/integralGoodDetail/integralGoodDetail':
                    page[page.length - 2].getData()
                    break;
                }

                wx.navigateBack()
                wx.nextTick(() => {
                  event.emit('refreshCart')
                  event.emit('refreshHome')
                })
              }
            })
            this.setData({
              loading: false,
              disabled: false
            })
          }).catch(() => {
            this.setData({
              loading: false,
              disabled: false
            })
          })
        } else {
          wx.showToast({
            title: '授权失败',
            icon: 'none'
          })
          this.setData({
            loading: false,
            disabled: false
          })
        }
      }
    })
  },

  //获取代言信息
  getDistributionData(superior) {
    http.post(app.globalData.distributionShareInfo, {
      distributionId: 0
    }).then(res => {
      if (res.data.cur == null) {
        this.distributionBindDistribution(superior)
      }
      app.globalData.distribution = res.data
      let memberInfo = wx.getStorageSync('memberInfo')
      if (memberInfo.distributionRecord == null) {
        let distributionRecord = {
          distributionId: res.data.cur.distributionId,
          auditStatus: res.data.cur.auditStatus
        }
        memberInfo.distributionRecord = distributionRecord
      } else {
        memberInfo.distributionRecord.distributionId = res.data.cur.distributionId
        memberInfo.distributionRecord.auditStatus = res.data.cur.auditStatus
      }
      wx.setStorageSync('memberInfo', memberInfo)
      this.setData({
        distribution: res.data
      })

    })
  },
  //绑定代言关系
  distributionBindDistribution(superior) {
    http.post(app.globalData.distributionBindDistribution, {
      superior,
    })
  }
})