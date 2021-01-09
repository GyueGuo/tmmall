const app = getApp();
import http from '../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //发送验证码文字
    codeIntro: '获取验证码',
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
    if (this.data.codeIntro != "获取验证码") {
      return
    }
    if (!app.isPoneAvailable(this.data.phone)) {
      app.showToast('请输入正确手机号码')
      return
    }
    http.encPost(app.globalData.messageSend, {
      phone: this.data.phone,
      wechatOpenId: app.globalData.unionId,
      qqOpenId: '',
      type: 10
    }).then(res => {
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
      this.data.codeIntro = "获取验证码";
      this.data.countdown = 60;
      this.setData({
        codeIntro: this.data.codeIntro
      })
      clearInterval(this.data.timer)
      return
    } else {
      this.data.codeIntro = "重新发送(" + this.data.countdown + ")";
      this.data.countdown--;
    }
    this.setData({
      codeIntro: this.data.codeIntro
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
        success: loginRes => {
          if (loginRes.code) {
            wx.getUserInfo({
              success: infoRes => {
                this.Login(loginRes.code, infoRes)
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
  Login(code, infoRes) {
    wx.getSetting({
      success: setRes => {
        if (setRes.authSetting['scope.userInfo']) {
          let supId = app.globalData.supId
          http.post(app.globalData.login, {
            code: code,
            nickName: infoRes.userInfo.nickName,
            avatarUrl: infoRes.userInfo.avatarUrl,
            encryptedData: infoRes.encryptedData,
            iv: infoRes.iv,
            memberId: this.data.mid,
            supId: supId,
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
    http.post(app.globalData.bindPhone, {
      phone: this.data.phone,
      code: this.data.code,
      unionId: app.globalData.unionId
    }).then(res => {
      app.showSuccessToast(res.message, () => {
        wx.setStorageSync('memberId', res.memberId)
        app.globalData.memberId = res.memberId
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