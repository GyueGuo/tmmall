const app = getApp();
const http = require('../../utils/http.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: Object,
    store_id: String
  },
  ready() {
    this.setData({
      diyColor: app.globalData.diyColor
    })
  },

  /**
   * 组件的初始数据
   */
  data: {
    opacity: 0,
    isLoading: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 弹出动画
     */
    showAnimation(anim) {
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      animation.translateY(-wx.getSystemInfoSync().windowHeight)
      this.setData({
        animation: animation.step(),
        isShow: true
      })
      this.fadeIn()
      this.getDistributionInfo()
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
        animation: animation.step(),
        isShow: false,
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
     * 关闭
     */
    closeDelivery() {
      this.hiddenAnimation()
    },

    getDistributionInfo() {
      app.openLocation(res => {
        this.getAddressInfo()
        // this.showAnimation()
      }, () => {
        app.showToast('请开启定位权限', () => {
          wx.openSetting()
        })
      })
    },

    getAddressInfo() {
      http.post(app.globalData.shipping_instructions, {
        storeId: this.data.info.store_id,
        goodsId: this.data.info.goods_id,
        goodsPrice: this.data.info.shop_price,
        goodsNumber: 1,
        province: app.globalData.address.province,
        city: app.globalData.address.city,
        area: app.globalData.address.area,
        lat: app.globalData.lat,
        lng: app.globalData.lng
      }).then(res => {
        // that.showAnimation()
        this.setData({
          result: res.result,
          data: res.freightService[0],
          address: res.address,
          express_freight_price: res.freightService[0].expressFreightPrice,
          isLoading: true
        })
      })
    },

    /**
     * 查看附近自提点
     */
    _onPickup() {
      wx.navigateTo({
        url: '/pages/nearby_self_point/nearby_self_point?store_id=' + this.data.store_id,
      })
    }
  }
})