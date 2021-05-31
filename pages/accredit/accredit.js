const app = getApp();
import http from '../../utils/http';
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSubmit: true,
    disabled: false,
    loading: false,
    canIUseGetUserProfile: !!wx.getUserProfile,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
      diyColor: app.globalData.diyColor,
      configSwitch: app.globalData.configSwitch
    })
  },
  getLoginCode() {
    return new Promise((resolve) => {
      wx.login({
        success: ({ code }) => {
          wx.checkSession({
            success() {
              resolve(code);
            },
            fail() {
              wx.login({
                success: ({ code }) => {
                  resolve(code);
                },
                fail: () => {
                  resolve('');
                }
              });
            }
          })
        },
      });
    })
  },
  handleAuthFail(title = '获取授权失败') {
    this.setData({
      loading: false,
      disabled: false,
    })
    wx.showToast({
      title,
      icon: 'none'
    })
  },
  handleGetUserInfo (e) {
    this.setData({
      loading: true,
      disabled: true
    });
    if (e.detail.encryptedData) {
      this
        .getLoginCode()
        .then((code) => {
          if (code) {
            wx.getUserInfo({
              success: (infoRes) => {
                if (infoRes.userInfo) {
                  this.Login(code, infoRes)
                } else {
                  this.handleAuthFail();
                }
              }
            })
            return;
          }
          this.handleAuthFail();
        });
      return;
    }
    this.handleAuthFail();
  },
  /**
   * 获取用户信息,授权
   */
   handleGetUserProfile() {
    if (!this.data.canIUseGetUserProfile) {
      wx.showToast({
        icon: 'none',
        title: '请升级微信到最新版本后使用'
      });
      return;
    }
    this.setData({
      loading: true,
      disabled: true,
    });
    wx.getUserProfile({
      lang: 'zh_CN',
      desc: "用于登录天牧神羊小程序",
      success: (infoRes) => {
        this
          .getLoginCode()
          .then((code) => {
            if (code && infoRes.userInfo) {
              this.Login(code, infoRes)
            } else {
              this.handleAuthFail();
            }
          })
      },
      fail: () => {
        this.handleAuthFail();
      }
    })
  },
  /**
   * 登录
   */
  Login(code, infoRes) {
    const { supId, login } = app.globalData;
    http.post(login, {
      code,
      nickName: infoRes.userInfo.nickName,
      avatarUrl: infoRes.userInfo.avatarUrl,
      encryptedData: infoRes.encryptedData,
      iv: infoRes.iv,
      memberId: '',
      supId,
      devType: 3
    }).then((res) => {
      wx.hideLoading();
      //绑定代言关系
      if (supId) {
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
        disabled: false,
      })
    }).catch(() => {
      this.setData({
        loading: false,
        disabled: false,
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