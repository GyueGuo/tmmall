const app = getApp();
const http = require('../../utils/http.js');
const Base64 = require('../../utils/base64.min.js').Base64;
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    opacity: 0,
    coupon: [],
    page: 1
  },
  ready() {
    this.setData({
      diyColor: app.globalData.diyColor
    })
    let iconPath = `<svg version="1.1" id="图层_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 131 199.9" style="enable-background:new 0 0 131 199.9;" xml:space="preserve"><style type="text/css">	.st0{fill:url(#SVGID_1_);}</style><linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="126.7745" y1="199.8241" x2="12.7888" y2="2.3951">	<stop  offset="0.1" style="stop-color:#F23030"/>	<stop  offset="0.89" style="stop-color:#FE552B"/></linearGradient><path class="st0" d="M125,0H17c0,0.3,0,0.6,0,0.9c0,9-7.2,16.2-16,16.2c-0.3,0-0.7,0-1-0.1v12c2.2,0,4,2.9,4,6.5S2.2,42,0,42v12	c2.2,0,4,2.9,4,6.5S2.2,67,0,67v14c2.2,0,4,2.9,4,6.5S2.2,94,0,94v12c2.2,0,4,2.9,4,6.5S2.2,119,0,119v13c2.2,0,4,2.9,4,6.5	S2.2,145,0,145v13c2.2,0,4,2.9,4,6.5S2.2,171,0,171v12c0.3,0,0.7-0.1,1-0.1c8.8,0,16,7.3,16,16.2c0,0.3,0,0.5,0,0.8h108	c3.3,0,6-2.7,6-6V6C131,2.7,128.3,0,125,0z"/></svg>`
    let sIconPath = Base64.encode(iconPath)
    let cannotIconPath = Base64.encode(iconPath.split('url(#SVGID_1_)').join('#d9d9d9'))
    this.setData({
      iconPath: sIconPath,
      cannotIconPath: cannotIconPath
    })
  },


  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 网络请求
     */
    getCouponList(obj) {
      http.post(app.globalData.good_coupon_list, {
        goodsClassifyId: obj.goods_classify_id,
        storeId: obj.store_id,
        goodsId: obj.goods_id,
        page: this.data.page
      }).then(res => {
        let coupon = res.result.data
        for (let i of coupon) {
          i.start_time = i.start_time.replace(/-/g, '.')
          i.end_time = i.end_time.replace(/-/g, '.')
        }
        if (this.data.page == 1) {
          this.setData({
            coupon: coupon,
            total: res.result.total
          })
        } else {
          this.setData({
            coupon: [...this.data.coupon, ...coupon]
          })
        }

        // for (let i of this.data.coupon) {
        //   i.start_time = i.start_time.replace(/-/g, '.')
        //   i.end_time = i.end_time.replace(/-/g, '.')
        // }
        // this.setData({
        //   coupon: res.result.data
        // })
        this.showAnimation()
      })
    },

    /**
     * 加载更多
     */
    loadMore() {
      if (this.data.coupon.length < this.data.total) {
        this.data.page++;
        this.getCouponList()
      }
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
        animation_coupon: animation.step(),
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
        animation_coupon: animation.step(),
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
      http.post(app.globalData.get_coupon, {
        couponId: item.coupon_id,
        goodsClassifyId: item.type == 1 ? this.data.goods_classify_id : '',
        storeId: item.type == 0 ? this.data.store_id : ''
      }).then(res => {
        app.showSuccessToast(res.message)
        this.data.coupon[index].member_coupon_count++;
        this.data.coupon[index].exchange_num--;
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