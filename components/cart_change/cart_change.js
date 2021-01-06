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
      diyColor: app.globalData.diyColor
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
    goodImage: '',
    //购买价格
    price: '',
    //商品数量
    num: 1,
    //购买参数文字
    attrArray: [],
    //购买尺寸id
    productsId: '',
    //购买参数文字
    attr: '请选择尺寸',
    attrFileImg: ''
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
      this.data.attrArray = info.goodsAttr.split(',')
      this.setData({
        info: info,
        attrFileImg: info.cartFile,
        goodImage: info.file,
        num: info.number,
        price: info.price,
        attr: this.data.info.inventory != null ? info.goodsAttr : '请选择尺寸',
        attrArray: this.data.info.inventory != null ? this.data.attrArray : []
      })
    },

    /**
     * 选择尺码
     */
    _onAttr(e) {
      let idx = e.currentTarget.dataset.idx,
        item = e.currentTarget.dataset.item
      this.data.attrArray[idx] = item.attrValue
      this.data.attr = ''
      for (let i = 0, len = this.data.attrArray.length; i < len; i++) {
        if (this.data.attrArray[i]) {
          this.data.attr += this.data.attrArray[i] + ','
        }
      }
      this.setData({
        attrArray: this.data.attrArray,
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
      http.post(app.globalData.attrFind, {
        goodsAttr: this.data.attr,
        goodsId: this.data.info.goodsId,
        type: 1
      }).then(res => {
        //图片
        this.data.goodImage = res.result.attrFileImg
        //
        this.data.attrFileImg = res.result.attrFile
        //正常
        this.data.price = parseFloat(res.result.attrShopPrice).toFixed(2)

        //库存
        this.data.info.inventory = res.result.attrGoodsNumber

        this.data.productsId = res.result.productsId

        if (this.data.num > res.result.attrGoodsNumber) {
          this.data.num = res.result.attrGoodsNumber
        }
        this.setData({
          price: this.data.price,
          info: this.data.info,
          num: this.data.num,
          goodImage: this.data.goodImage
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
        if (this.data.attrArray.length != this.data.info.attrs.length) {
          app.showToast('请选择商品规格')
          return
        }
      }

      if (this.data.num == 0) {
        app.showToast('购买数量不可为0')
        return
      }
      let attrDetail = ''
      if (this.data.info.attrs.length != 0) {
        for (let i = 0, len = this.data.attrArray.length; i < len; i++) {
          attrDetail += this.data.info.attrs[i].attrName + ':' + this.data.attrArray[i] + ' '
        }
      }
      http.encPost(app.globalData.cartUpdate, {
        goodsId: this.data.info.goodsId,
        goodsName: this.data.info.goodsName,
        file: this.data.attrFileImg == null ? '' : this.data.attrFileImg,
        price: this.data.price,
        number: this.data.num,
        productsId: this.data.productsId,
        goodsAttr: this.data.attr,
        attr: attrDetail,
        cartId: this.data.info.cartId
      }).then(res => {
        this.data.info.file = this.data.goodImage
        this.data.info.price = this.data.price
        this.data.info.number = this.data.num
        this.data.info.goodsAttr = this.data.attr
        this.data.info.attr = attrDetail
        this.hiddenAnimation()
        this.triggerEvent("confirmChange", this.data.info)
      })
    }
  }
})