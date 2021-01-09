// activity/turnplate.js
const app = getApp();
const event = require('../../utils/event.js');
import http from '../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollIndex: 0,
    isGame: true,
    info: {},
    list: [],
    light: 1,
    activeIndex: 0,
    winId: 0,
    speed: 300,
    maxSpeed: 200,
    oRun: '',
    runsNow: 0,
    CYCLENUM: 5,
    rollFlag: true,
    lastIndex: 0,
    winInfo: {},
    isShow: true,
    memberAddressId: '',
    prizeType: '',
    orderid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.diyColor.zColor != undefined) {
      this.setData({
        diyColor: app.globalData.diyColor
      })
    } else {
      app.appDIY(() => {}, this)
    }
    this.data.lightScroll = setInterval(() => {
      if (this.data.light == 1) {
        this.setData({
          light: 2
        })
      } else {
        this.setData({
          light: 1
        })
      }
    }, 1000)
    event.on('changeAddress', this, res => {
      console.log(res)
      this.data.memberAddressId = res.memberAddressId
      this.data.info.address = {
        address: res.address,
        isDefault: res.isDefault,
        lat: res.lat,
        lng: res.lng,
        locationAddress: res.locationAddress,
        memberAddressId: res.memberAddressId,
        name: res.name,
        phone: res.phone,
        province: res.province,
        city: res.city,
        area: res.area,
        street: res.street,
      }
      this.setData({
        memberAddressId: res.memberAddressId,
        info: this.data.info
      })
    })
    this.getData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // this.scroll()
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
    clearInterval(this.data.lightScroll)
    clearInterval(this.data._scroll)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(this.data._scroll)
    clearInterval(this.data.lightScroll)
    event.remove('changeAddress', this)
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
  onShareAppMessage: function(res) {
    if (res.from === 'button') {} else {
      http.post(app.globalData.shareActivity, {}).then(res => {
        wx.showToast({
          title: res.message,
        })
        this.data.info.drawType = 1
        this.setData({
          info: this.data.info,
        })
      }).catch(res => {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      })
    }
  },
  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.activityGoodsList, {}).then(res => {
      this.setData({
        info: res,
        list: res.data.lotteryPrize
      })
      wx.setNavigationBarTitle({
        title: res.data.title
      })
    }).catch(res => {
    })
  },
  /**
   * 
   */
  scroll() {
    let _index = 0
    this.data._scroll = setInterval(() => {
      if (_index < 14) {
        this.setData({
          scrollIndex: _index
        })
        _index++
      } else {
        _index = 0
      }
      if (this.data.light == 1) {
        this.setData({
          light: 2
        })
      } else {
        this.setData({
          light: 1
        })
      }
    }, 1500)
  },

  /**
   * 点击开始
   */
  start() {
    if (app.login()) {
      if (this.data.rollFlag) {
        this.setData({
          rollFlag: false
        })
        http.post(app.globalData.lotteryActivity, {
          activityId: this.data.info.data.activityId,
          updateTime: this.data.info.data.updateTime
        }).then(res => {
          if (res.data.prizeType == 0) {
            app.showToast(res.message, () => {
              this.getData()
            })
            return
          }
          this.data.info.drawType = res.data.drawType
          this.setData({
            info: this.data.info,
            prizeType: res.data.prizeType,
            winData: res,
          })
          for (let i = 0, len = this.data.info.data.lotteryPrize.length; i < len; i++) {
            if (this.data.info.data.lotteryPrize[i].prizeId == res.data.prizeId) {
              this.setData({
                winId: i,
                winInfo: this.data.info.data.lotteryPrize[i],
              })
            }
          }
          this.animate()
        }).catch(res => {
          this.setData({
            rollFlag: true
          })
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        })
      }
    }
  },

  /**
   * 在抽一次
   */
  draw() {
    this.close()
  },
  /**
   * 动画
   */
  animate() {
    //圈数
    let num = Math.floor(Math.random() * 2 + 3)
    this.setData({
      CYCLENUM: num
    })
    //初始化步数
    this.setData({
      runsNow: 0,
    })
    this.rolling();
  },
  rolling() {
    this.data.oRun = setTimeout(() => {
      this.rolling()
    }, this.data.speed)
    this.data.runsNow++;
    this.data.activeIndex++;
    if (this.data.activeIndex >= 8) {
      this.setData({
        activeIndex: 0
      })
    } else {
      this.setData({
        activeIndex: this.data.activeIndex
      })
    }

    let countNum = this.data.CYCLENUM * 8 + this.data.winId - this.data.lastIndex

    //加速
    if (this.data.runsNow <= (countNum / 3) * 1) {
      this.data.speed -= 30
      if (this.data.speed <= this.data.maxSpeed) {
        this.data.speed = this.data.maxSpeed
      }
    }
    //抽奖结束
    else if (this.data.runsNow >= countNum) {
      this.setData({
        lastIndex: this.data.winId,
        rollFlag: true
      })
      clearInterval(this.data.oRun)
      setTimeout(() => {
        //中奖提示
        if (this.data.prizeType == 1) {
          this.setData({
            isShow: false
          })
        } else if (this.data.prizeType == 2) {
          this.setData({
            isShow: false
          })
        } else if (this.data.prizeType == 3) {
          this.setData({
            isShow: false
          })
        } else {
          wx.showToast({
            title: this.data.winData.message,
            icon: 'none'
          })
        }
      }, 500)
    }
    //减速
    else if (countNum - this.data.runsNow <= 10) {
      this.data.speed += 20
    } else {
      this.data.speed += 10
      if (this.data.speed >= 100) {
        this.data.speed = 100
      }
    }
  },

  /**
   * 关闭
   */
  close() {
    this.data.isShow = true
    this.setData({
      isShow: true,
      prizeType: '',
      winData: {}
    })
  },
  /**
   * 确定
   */
  confirm(e) {
    http.post(app.globalData.setAddres, {
      activityOrderId: this.data.winData.orderId,
      memberAddressId: this.data.info.address.memberAddressId
    }).then(res => {
      this.close()
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
    }).catch(res => {
      // wx.showToast({
      //   title: res.message,
      //   icon: 'none'
      // })
    })
  },

  /**
   * 我的抽奖
   */
  goDraw(e) {
    http.post(app.globalData.setAddres, {
      activityOrderId: this.data.winData.orderId,
      memberAddressId: this.data.info.address.memberAddressId
    }).then(res => {
      this.close()
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
      wx.navigateTo({
        url: '/my/myPrize/myPrize',
      })
    }).catch(res => {
      // wx.showToast({
      //   title: res.message,
      //   icon: 'none'
      // })
    })
  },
  /**
   * 选择地址
   */
  address() {
    wx.navigateTo({
      url: '/my/address/address?choose=true&oType=2',
    })
  },
  /**
   * 优惠劵
   */
  coupon() {
    wx.navigateTo({
      url: '/my/coupon/coupon',
    })
  },
  /**
   * 抽奖规则
   */
  drawText(e) {
    wx.navigateTo({
      url: '/my/webView/webView?id=drawActivity' + '&drawId=' + e.currentTarget.dataset.id,
    })
  }
})