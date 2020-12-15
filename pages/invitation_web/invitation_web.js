// pages/invitation_web/invitation_web.js
const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //发送验证码文字
    code_intro: '获取验证码',
    //倒计时
    countdown: 60,
    //定时器
    timer: {},
    //手机号
    phone: '',
    //验证码
    code: '',
    //密码
    password: '',
    isSubmit: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let mid = null
    if (options.mid) {
      mid = options.mid
      this.setData({
        mid: mid
      })
    }
    console.log(mid)
    // 分享二维码
    if (options.scene) {
      let obj = http.scene(options.scene)
      console.log(obj)
      //上级token
      mid = obj.token
      this.setData({
        mid: mid
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
   * 获取验证码
   */
  getCode() {
    if (this.data.code_intro != "获取验证码") {
      return
    }
    if (!app.isPoneAvailable(this.data.phone)) {
      app.showToast('请输入正确手机号码')
      return
    }
    http.encPost(app.globalData.message_send, {
      phone: this.data.phone,
      wechatOpenId: app.globalData.unionId,
      qqOpenId: '',
      type: 10
    }).then(res => {
      console.log(res)
      this.setTime()
      this.data.timer = setInterval(() => {
        this.setTime()
      }, 1000)
    })

  },

  /**
   * 手机号输入
   */
  phoneInput(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  /**
   * 验证码输入
   */
  codeInput(e) {
    this.setData({
      code: e.detail.value
    })
  },
  setTime() {
    if (this.data.countdown == 0) {
      this.data.code_intro = "获取验证码";
      this.data.countdown = 60;
      this.setData({
        code_intro: this.data.code_intro
      })
      clearInterval(this.data.timer)
      return
    } else {
      this.data.code_intro = "重新发送(" + this.data.countdown + ")";
      this.data.countdown--;
    }
    this.setData({
      code_intro: this.data.code_intro
    })
  },
  /**
   * 获取用户信息,授权
   */
  getUserInfo(e) {
    if (this.data.isSubmit == false) {
      return
    }
    this.setData({
      isSubmit: false
    })
    if (!app.isPoneAvailable(this.data.phone)) {
      app.showToast('请输入正确手机号码')
      this.setData({
        isSubmit: true
      })
      return
    }
    if (this.data.code.length != 6) {
      app.showToast('请输入6位验证码')
      this.setData({
        isSubmit: true
      })
      return
    }
    this.setData({
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
            code: code,
            nickName: info_res.userInfo.nickName,
            avatarUrl: info_res.userInfo.avatarUrl,
            encryptedData: info_res.encryptedData,
            iv: info_res.iv,
            memberId: this.data.mid,
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
            if (app.globalData.phone == '') {
              this.submit()
            } else {
              wx.switchTab({
                url: '/pages/home/home',
              })
            }
            this.setData({
              disabled: false
            })
          }).catch(() => {
            this.setData({
              disabled: false
            })
          })
        } else {
          wx.showToast({
            title: '授权失败',
            icon: 'none'
          })
          this.setData({
            disabled: false
          })
        }
      }
    })
  },

  /**
   * 关联
   */
  submit() {
    http.post(app.globalData.bind_phone, {
      phone: this.data.phone,
      code: this.data.code,
      unionId: app.globalData.unionId
    }).then(res => {
      app.showSuccessToast(res.message, () => {
        wx.setStorageSync('member_id', res.memberId)
        app.globalData.member_id = res.memberId
        wx.setStorageSync('phone', this.data.phone)
        app.globalData.phone = this.data.phone
        wx.switchTab({
          url: '/pages/home/home',
        })
      })
    }).catch(res => {
      this.setData({
        isSubmit: true
      })
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