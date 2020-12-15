const app = getApp();
const http = require('../../utils/http.js');
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },
  ready() {
    this.setData({
      diy_color: app.globalData.diy_color
    })
  },

  /**
   * 组件的初始数据
   */
  data: {
    opacity: 0,
    //商品信息
    info: {},
    //图片
    good_image: '',
    //购买价格
    price: '',
    //商品数量
    num: 1,
    //购买参数文字
    attr_array: [],
    //购买尺寸id
    products_id: '',
    //购买参数文字
    attr: '请选择尺寸',
    attr_file_img: ''
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
        isShow: true,
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
        animation: animation.step(),
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
     * 关闭窗口
     */
    _close() {
      this.hiddenAnimation()
    },

    /**
     * 
     */
    show(info) {
      this.showAnimation()
      this.data.attr_array = info.goods_attr.split(',')
      this.setData({
        info: info,
        attr_file_img: info.cart_file,
        good_image: info.file,
        num: info.number,
        price: info.price,
        attr: this.data.info.inventory != null ? info.goods_attr : '请选择尺寸',
        attr_array: this.data.info.inventory != null ? this.data.attr_array : []
      })
    },

    /**
     * 选择尺码
     */
    _onAttr(e) {
      let idx = e.currentTarget.dataset.idx,
        item = e.currentTarget.dataset.item
      this.data.attr_array[idx] = item.attr_value
      this.data.attr = ''
      for (let i = 0, len = this.data.attr_array.length; i < len; i++) {
        if (this.data.attr_array[i]) {
          this.data.attr += this.data.attr_array[i] + ','
        }
      }
      this.setData({
        attr_array: this.data.attr_array,
        attr: this.data.attr.substr(0, this.data.attr.length - 1)
      })
      if (this.data.attr.split(',').length == this.data.info.attrs.length) {
        this._getGoodPrice()
      }
    },

    /**
     * 获取商品价格
     */
    _getGoodPrice() {
      http.post(app.globalData.attr_find, {
        goodsAttr: this.data.attr,
        goodsId: this.data.info.goods_id,
        type: 1
      }).then(res => {
        //图片
        this.data.good_image = res.result.attr_file_img
        //
        this.data.attr_file_img = res.result.attr_file
        //正常
        // if (res.result.is_vip == 1) {
        //   this.data.price = (res.result.attr_shop_price * res.discount * 0.01).toFixed(2)
        // } else {
        // }
        this.data.price = parseFloat(res.result.attr_shop_price).toFixed(2)

        //库存
        this.data.info.inventory = res.result.attr_goods_number

        this.data.products_id = res.result.products_id

        if (this.data.num > res.result.attr_goods_number) {
          this.data.num = res.result.attr_goods_number
        }
        this.setData({
          price: this.data.price,
          info: this.data.info,
          num: this.data.num,
          good_image: this.data.good_image
        })
      })
    },

    /**
     * 减少商品数量
     */
    _reduceNum() {
      if (this.data.num > 1) {
        this.data.num--;
        this.setData({
          num: this.data.num
        })
      }
    },

    /**
     * 增加商品数量
     */
    _increaseNum() {
      if (this.data.num < this.data.info.inventory) {
        this.data.num++
          this.setData({
            num: this.data.num
          })
      } else {
        app.showToast('已达到最大数量')
      }
    },

    /**
     * 确定
     */
    _onConfirm() {
      if (this.data.info.attrs.length != 0) {
        if (this.data.attr_array.length != this.data.info.attrs.length) {
          app.showToast('请选择商品规格')
          return
        }
      }

      if (this.data.num == 0) {
        app.showToast('购买数量不可为0')
        return
      }
      let attr_detail = ''
      if (this.data.info.attrs.length != 0) {
        for (let i = 0, len = this.data.attr_array.length; i < len; i++) {
          attr_detail += this.data.info.attrs[i].attr_name + ':' + this.data.attr_array[i] + ' '
        }
      }
      console.log(this.data.info)
      http.encPost(app.globalData.cart_update, {
        goodsId: this.data.info.goods_id,
        goodsName: this.data.info.goods_name,
        file: this.data.attr_file_img == null ? '' : this.data.attr_file_img,
        price: this.data.price,
        number: this.data.num,
        productsId: this.data.products_id,
        goodsAttr: this.data.attr,
        attr: attr_detail,
        cartId: this.data.info.cart_id
      }).then(res => {
        this.data.info.file = this.data.good_image
        this.data.info.price = this.data.price
        this.data.info.number = this.data.num
        this.data.info.goods_attr = this.data.attr
        this.data.info.attr = attr_detail
        this.hiddenAnimation()
        this.triggerEvent("confirmChange", this.data.info)
      })
    }
  }
})