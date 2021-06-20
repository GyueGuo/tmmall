const app = getApp();
import http from '../../utils/http';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: Object,
    storeId: String
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
    isLoading: true,
    expressFreightPriceShow: '',
    addressShow: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
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
      const fn = () => {
        this.setData({
          addressShow: '-',
          expressFreightPriceShow: '-',
          isLoading: false,
        });
      }
      if (app.globalData.memberId && app.globalData.phone) {
        app.openLocation(() => {
          this.getAddressInfo()
        }, fn);
        return;
      }
      fn();
    },
    getAddressInfo() {
      http.post(app.globalData.shippingInstructions, {
        storeId: this.data.info.storeId,
        goodsId: this.data.info.goodsId,
        goodsPrice: this.data.info.shopPrice,
        goodsNumber: 1,
        province: app.globalData.address.province,
        city: app.globalData.address.city,
        area: app.globalData.address.area,
        lat: app.globalData.lat,
        lng: app.globalData.lng
      }).then(({ result, freightService, address }) => {
        const [data] = freightService;
        this.setData({
          result,
          data,
          addressShow: address.province ? `${address.province}>${address.city}>${address.area}` : '-',
          expressFreightPriceShow: `${data.expressFreightPrice}元`,
          isLoading: false,
        });
      });
    },

    /**
     * 查看附近自提点
     */
    _onPickup() {
      wx.navigateTo({
        url: '/pages/nearbySelfPoint/nearbySelfPoint?storeId=' + this.data.storeId,
      })
    }
  }
})