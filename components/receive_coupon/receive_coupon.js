const app = getApp();
import http from '../../utils/http';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    opacity: 0,
    coupon: []
  },
  ready() {
    this.setData({
      diyColor: app.globalData.diyColor
    })
  },


  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 网络请求
     */
    getCouponList(storeId, goodsClassifyId) {
      http.post(app.globalData.goodCouponList, {
        goodsClassifyId: goodsClassifyId,
        storeId: storeId
      }).then(res => {
        for (let i of res.result) {
          i.startTime = i.startTime.replace(/-/g, '.')
          i.endTime = i.endTime.replace(/-/g, '.')
        }
        this.setData({
          coupon: res.result
        })
        this.showAnimation()
      })
    },

    /**
     * 弹出动画
     */
    showAnimation() {
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      animation.translateY(-wx.getSystemInfoSync().windowHeight)
      this.setData({
        animationCoupon: animation.step(),
        isShow: true
      })
      this.fadeIn()
    },

    /**
     * 关闭动画
     */
    hiddenAnimation() {
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      animation.translateY(wx.getSystemInfoSync().windowHeight)
      this.setData({
        animationCoupon: animation.step(),
        isShow: false
      })
      this.fadeOut()
    },

    /**
     * 淡入效果
     */
    fadeIn() {
      let interval = setInterval(() => {
        if (this.data.opacity >= 0.3) {
          clearInterval(interval)
        }
        this.setData({
          opacity: this.data.opacity + 0.01
        })
      }, 10)
    },

    /**
     * 淡出效果
     */
    fadeOut() {
      let interval = setInterval(() => {
        if (this.data.opacity <= 0) {
          clearInterval(interval)
        }
        this.setData({
          opacity: this.data.opacity - 0.1
        })
      }, 100)
    },
    /**
     * 
     */
    none() {

    },

    /**
     * 关闭优惠券
     */
    closeCoupon() {
      this.hiddenAnimation()
    },

    /**
     * 领取优惠券
     */
    getCoupon(e) {
      if (!app.login()) {
        this.hiddenAnimation()
        return
      }
      let item = e.currentTarget.dataset.item,
        index = e.currentTarget.dataset.index
      http.post(app.globalData.getCoupon, {
        couponId: item.couponId,
        goodsClassifyId: item.type == 1 ? this.data.goodsClassifyId : '',
        storeId: item.type == 0 ? this.data.storeId : ''
      }).then(res => {
        app.showSuccessToast('领取成功')
        this.data.coupon[index].memberCouponCount++;
        this.data.coupon[index].exchangeNum--;
        this.setData({
          coupon: this.data.coupon
        })
      })
    },
    showToast() {
      wx.showToast({
        title: '不要太贪心哦~~',
        icon: 'none'
      })
    }
  }
})