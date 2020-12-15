// activity/turnplate.js
const app = getApp();
const event = require('../../utils/event.js');
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scroll_index: 0,
    isGame: true,
    info: {},
    list: [],
    light: 1,
    active_index: 0,
    win_id: 0,
    speed: 300,
    max_speed: 200,
    oRun: '',
    runs_now: 0,
    CYCLE_NUM: 5,
    roll_flag: true,
    last_index: 0,
    win_info: {},
    isShow: true,
    member_address_id: '',
    prize_type: '',
    order_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.diy_color.z_color != undefined) {
      this.setData({
        diy_color: app.globalData.diy_color
      })
    } else {
      app.app_DIY(() => {}, this)
    }
    this.data.light_scroll = setInterval(() => {
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
      this.data.member_address_id = res.member_address_id
      this.data.info.address = {
        address: res.address,
        is_default: res.is_default,
        lat: res.lat,
        lng: res.lng,
        location_address: res.location_address,
        member_address_id: res.member_address_id,
        name: res.name,
        phone: res.phone,
        province: res.province,
        city: res.city,
        area: res.area,
        street: res.street,
      }
      this.setData({
        member_address_id: res.member_address_id,
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
    clearInterval(this.data.light_scroll)
    clearInterval(this.data._scroll)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(this.data._scroll)
    clearInterval(this.data.light_scroll)
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
      http.post(app.globalData.share_activity, {}).then(res => {
        wx.showToast({
          title: res.message,
        })
        this.data.info.draw_type = 1
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
    http.post(app.globalData.activity_goods_list, {}).then(res => {
      this.setData({
        info: res,
        list: res.data.lotteryPrize
      })
      wx.setNavigationBarTitle({
        title: res.data.title
      })
    }).catch(res => {
      // wx.showToast({
      //   title: res.message,
      //   icon: 'none'
      // })
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
          scroll_index: _index
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

    // this.data.light_scroll = setInterval(() => {
    //   if (this.data.light == 1) {
    //     this.setData({
    //       light: 2
    //     })
    //   } else {
    //     this.setData({
    //       light: 1
    //     })
    //   }
    // }, 1000)
  },

  /**
   * 点击开始
   */
  start() {
    if (app.login()) {
      if (this.data.roll_flag) {
        this.setData({
          roll_flag: false
        })
        http.post(app.globalData.lottery_activity, {
          activityId: this.data.info.data.activity_id,
          updateTime: this.data.info.data.update_time
        }).then(res => {
          if (res.data.prizeType == 0) {
            app.showToast(res.message, () => {
              this.getData()
            })
            return
          }
          this.data.info.draw_type = res.data.draw_type
          this.setData({
            info: this.data.info,
            prize_type: res.data.prize_type,
            win_data: res,
          })
          for (let i = 0, len = this.data.info.data.lottery_prize.length; i < len; i++) {
            if (this.data.info.data.lottery_prize[i].prize_id == res.data.prize_id) {
              this.setData({
                win_id: i,
                win_info: this.data.info.data.lottery_prize[i],
              })
            }
          }
          this.animate()
        }).catch(res => {
          this.setData({
            roll_flag: true
          })
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
          // wx.showToast({
          //   title: res.message,
          //   icon: 'none'
          // })
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
      CYCLE_NUM: num
    })
    //初始化步数
    this.setData({
      runs_now: 0,
    })
    this.rolling();
  },
  rolling() {
    this.data.oRun = setTimeout(() => {
      this.rolling()
    }, this.data.speed)
    this.data.runs_now++;
    this.data.active_index++;
    if (this.data.active_index >= 8) {
      this.setData({
        active_index: 0
      })
    } else {
      this.setData({
        active_index: this.data.active_index
      })
    }

    let count_num = this.data.CYCLE_NUM * 8 + this.data.win_id - this.data.last_index

    //加速
    if (this.data.runs_now <= (count_num / 3) * 1) {
      this.data.speed -= 30
      if (this.data.speed <= this.data.max_speed) {
        this.data.speed = this.data.max_speed
      }
    }
    //抽奖结束
    else if (this.data.runs_now >= count_num) {
      this.setData({
        last_index: this.data.win_id,
        roll_flag: true
      })
      clearInterval(this.data.oRun)
      setTimeout(() => {
        //中奖提示
        if (this.data.prize_type == 1) {
          this.setData({
            isShow: false
          })
        } else if (this.data.prize_type == 2) {
          this.setData({
            isShow: false
          })
        } else if (this.data.prize_type == 3) {
          this.setData({
            isShow: false
          })
        } else {
          wx.showToast({
            title: this.data.win_data.message,
            icon: 'none'
          })
        }
      }, 500)
    }
    //减速
    else if (count_num - this.data.runs_now <= 10) {
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
      prize_type: '',
      win_data: {}
    })
  },
  /**
   * 确定
   */
  confirm(e) {
    http.post(app.globalData.set_addres, {
      activityOrderId: this.data.win_data.order_id,
      memberAddressId: this.data.info.address.member_address_id
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
    http.post(app.globalData.set_addres, {
      activity_order_id: this.data.win_data.order_id,
      member_address_id: this.data.info.address.member_address_id
    }).then(res => {
      this.close()
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
      wx.navigateTo({
        url: '/my/my_prize/my_prize',
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
  draw_text(e) {
    wx.navigateTo({
      url: '/my/web_view/web_view?id=draw_activity' + '&draw_id=' + e.currentTarget.dataset.id,
    })
  }
})