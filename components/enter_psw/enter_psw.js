const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
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
    board: true,
    //透明度
    opacity: 0,
    //密码
    password: '',
    //弹出键盘
    focus: false,
    input_disabled: false,
    order_info: {},
    adjust_position:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 修改密码
     */
    change_psw(){
      wx.navigateTo({
        url: '/my/change_password/change_password',
      })
    },
    /**
     * 忘记密码
     */
    forget_psw() {
      wx.navigateTo({
        url: '/my/forget_psw_one/forget_psw_one',
      })
    },
    /**
     * 弹出动画
     */
    showAnimation(anim) {
      let animation = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease',
      })
      animation.translateY(-wx.getSystemInfoSync().windowHeight)
      this.setData({
        animation: animation.step(),
        focus: true,
        isShow: true
      })
      this.fadeIn()
    },

    /**
     * 关闭动画
     */
    hiddenAnimation() {
      let animation = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease',
      })
      animation.translateY(wx.getSystemInfoSync().windowHeight)
      this.setData({
        animation: animation.step(),
        focus: false,
        isShow: false
      })
      this.fadeOut()
    },
    /**
     * 淡入效果
     */
    fadeIn() {
      let interval = setInterval(()=> {
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
      let interval = setInterval(()=> {
        if (this.data.opacity <= 0) {
          clearInterval(interval)
        }
        this.setData({
          opacity: this.data.opacity - 0.1
        })
      }, 100)
    },

    /**
     * 关闭弹窗
     */
    closeBoard(){
      this.hiddenAnimation()
      this.setData({
        isShow: false
      })
    },

    /**
     * 
     */
    show(order_info) {
      this.showAnimation()
      this.setData({
        order_info: order_info
      })
    },

    /**
     * 点击输入框
     */
    enterPassword() {
      this.setData({
        focus:true
      })
    },

    /**
     * 密码输入
     */
    pswInput(e) {
      this.setData({
        password: e.detail.value
      })
      if (e.detail.value.length == 6) {
        this.setData({
          input_disabled: true,
          focus: false,
          password: e.detail.value
        })
        http.post(app.globalData.balance_exec, {
          outTradeNo: this.data.order_info.order_number == '' ? this.data.order_info.order_attach_number : this.data.order_info.order_number,
          payPassword: this.data.password,
          casePayType: 2
        }).then(res=> {
          app.showSuccessToast('支付成功', ()=> {
            this.pay_callback(res)
            // wx.navigateBack()
            event.emit('payOrder')
            event.emit('refreshCart')
            event.emit('refreshOrderDetail')
            event.emit('refreshCollageDetail')
            event.emit('refreshBargainDetail')
          })
        }).catch(res=> {
          this.setData({
            password: '',
            input_disabled: false,
            focus: true
          })
          app.showToast(res.message)
        })
      }
    },
    /**
     * 支付回调
     */
    pay_callback(res) {
      let item = {
        total_price: this.data.order_info.total_price,
        order_type: this.data.order_info.order_type,
        order_attach_id: this.data.order_info.order_attach_id,
        out_trade_no: this.data.order_info.order_number == '' ? this.data.order_info.order_attach_number : this.data.order_info.order_number,
      }
      // wx.redirectTo({
      //   url: '/nearby_shops/pay_result/pay_result?item=' + JSON.stringify(item),
      // })
      // return
      //商品类型 1正常商品 2团购 3砍价 4限时抢购
      let order_type = this.data.order_info.order_type
      console.log(order_type)
      switch (order_type) {
        case 1:
          wx.redirectTo({
            url: '/nearby_shops/pay_result/pay_result?item=' + JSON.stringify(item),
          })
          break;
        case 2:
          wx.redirectTo({
            url: '/pages/collage_detail/collage_detail?id=' + res.group_activity_attach_id,
          })
          break;
        case 3:
          wx.redirectTo({
            url: '/nearby_shops/pay_result/pay_result?item=' + JSON.stringify(item),
          })
          break;
        case 4:
          wx.redirectTo({
            url: '/nearby_shops/pay_result/pay_result?item=' + JSON.stringify(item),
          })
          break;
        case 'invoice':
          wx.redirectTo({
            url: '/nearby_shops/invoice_over/invoice_over?item=' + JSON.stringify(item),
          })
          break;
      }
    }
  }
})