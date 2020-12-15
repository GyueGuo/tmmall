const app = getApp();
const http = require('../../utils/http.js');
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
      diy_color: app.globalData.diy_color,
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
        success: login_res => {
          if (login_res.code) {
            wx.getUserInfo({
              success: info_res => {
                this.Login(login_res.code, info_res)
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
  Login(code, info_res) {
    wx.getSetting({
      success: set_res => {
        if (set_res.authSetting['scope.userInfo']) {
          let sup_id = app.globalData.sup_id
          http.post(app.globalData.login, {
            code,
            nickName: info_res.userInfo.nickName,
            avatarUrl: info_res.userInfo.avatarUrl,
            encryptedData: info_res.encryptedData,
            iv: info_res.iv,
            memberId: '',
            supId: sup_id,
            devType: 3
          }).then(res => {
            wx.hideLoading()
            //绑定代言关系
            if (sup_id != '') {
              this.getDistributionData(sup_id)
            }
            wx.setStorageSync('member_id', res.member.memberId)
            wx.setStorageSync('phone', res.member.phone == null ? '' : res.member.phone)
            wx.setStorageSync('openid', res.openid)
            wx.setStorageSync('unionId', res.unionId)
            app.globalData.member_id = res.member.memberId
            app.globalData.phone = res.member.phone == null ? '' : res.member.phone
            app.globalData.openid = res.openid
            app.globalData.unionId = res.unionId
            app.globalData.PAST_LOGIN = false
            wx.setStorageSync('member_info', res.member)
            app.showSuccessToast('登录成功', () => {
              if (app.globalData.phone == '') {
                wx.redirectTo({
                  url: '../bind_phone/bind_phone',
                })
              } else {
                let page = getCurrentPages()
                let route = page[page.length - 2].route //上一页地址
                switch (route) {
                  case 'nearby_shops/good_detail/good_detail': //是否是商品详情
                    page[page.length - 2].getData()
                    break;
                  case 'my/integral_good_detail/integral_good_detail':
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
            // wx.nextTick(() => {
            //   //客服
            //   app.service()
            // })
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
    http.post(app.globalData.distribution_share_info, {
      distributionId: 0
    }).then(res => {
      if (res.data.cur == null) {
        this.distribution_bindDistribution(superior)
      }
      app.globalData.distribution = res.data
      let member_info = wx.getStorageSync('member_info')
      if (member_info.distribution_record == null) {
        let distribution_record = {
          distribution_id: res.data.cur.distribution_id,
          audit_status: res.data.cur.audit_status
        }
        member_info.distribution_record = distribution_record
      } else {
        member_info.distribution_record.distribution_id = res.data.cur.distribution_id
        member_info.distribution_record.audit_status = res.data.cur.audit_status
      }
      wx.setStorageSync('member_info', member_info)
      this.setData({
        distribution: res.data
      })

    })
  },
  //绑定代言关系
  distribution_bindDistribution(superior) {
    http.post(app.globalData.distribution_bindDistribution, {
      superior,
    })
  }
})