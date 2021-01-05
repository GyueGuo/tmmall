const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      observer: function() {
        this.setData({
          list: this.data.list,
          all_select: true,
          num: this.data.list.length
        })
        this.calculate()
      }
    }
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
    all_select: true,
    num: 0,
    modal_confirm: [{
      title: '提示',
      content: '确认清空购物车商品吗?',
      tip: '',
      callback: 'deleteAll'
    }],
    showModal: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 显示
     */
    show() {
      this.showAnimation()
    },
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

    calculate() {
      let total = 0,
        num = 0,
        all_select = true
      for (let i = 0, len = this.data.list.length; i < len; i++) {
        all_select = all_select && this.data.list[i].select
        if (this.data.list[i].select) {
          total += parseFloat(this.data.list[i].price * this.data.list[i].number)
          num++
        }
      }
      this.setData({
        all_select: all_select,
        num: num
      })
      this.triggerEvent('calculate', total.toFixed(2))
    },

    addCart(e) {
      let item = e.currentTarget.dataset.item
      http.post(app.globalData.cart_add, {
        cartId: item.cart_id,
        number: 1
      }).then(res => {
        event.emit('shopAddCart', item.goods_id)
      })
    },

    reduceCart(e) {
      let dataset = e.currentTarget.dataset
      dataset.item.cart_number = dataset.item.number
      console.log(dataset)
      // return
      // let item = e.currentTarget.dataset.item
      if (dataset.item.number > 1) {
        http.post(app.globalData.cart_reduce, {
          cartId: dataset.item.cart_id,
          number: 1
        }).then(res => {
          event.emit('shopReduceCart', dataset.item.goods_id)
        })
      } else if (dataset.item.number == 1) {
        this.triggerEvent('cart_delete', {
          cart_id: dataset.item.cart_id,
          item: dataset
        })
      }
    },
    changeSelect(e) {
      return
      let index = e.currentTarget.dataset.index
      this.data.list[index].select = !this.data.list[index].select
      this.setData({
        list: this.data.list
      })
      this.calculate()
    },

    selectAll() {
      this.data.all_select = !this.data.all_select
      for (let i = 0, len = this.data.list.length; i < len; i++) {
        this.data.list[i].select = this.data.all_select
      }
      this.calculate()
      this.setData({
        all_select: this.data.all_select,
        list: this.data.list
      })
    },

    showModal() {
      this.selectComponent("#modal").showModal()
    },

    deleteAll() {
      let list = this.data.list.map((val) => val = val.cart_id)
      http.post(app.globalData.cart_delete, {
        cartId: list.join(',')
      }).then(res => {
        this.setData({
          list: []
        })
        event.emit('clearCart')
        this.hiddenAnimation()
      })
    },

    settleDown() {
      let id = ''
      for (let i = 0, len = this.data.list.length; i < len; i++) {
        if (this.data.list[i].select) {
          id += this.data.list[i].cart_id + ','
        }
      }
      if (id == '') {
        app.showToast('请选择商品结算')
        return
      }
      id = id.substr(0, id.length - 1)
      wx.navigateTo({
        url: '/pages/cart_confirm_order/cart_confirm_order?cart_id=' + id,
      })
    }
  },
})