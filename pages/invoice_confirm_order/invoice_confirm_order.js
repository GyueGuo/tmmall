const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_address_id: '',
    //地址
    address: null,
    //运费
    freight: 0.00,
    //合计价格
    total: 0,
    //支付方式
    pay_way: '在线支付',
    way: '1',
    message: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      data: JSON.parse(options.info),
      store_id: JSON.parse(options.info).store_id
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    event.on('changeAddress', this, () => {
      this.data.member_address_id = this.data.address.member_address_id
      this.getData()
    })
    this.getData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
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
   * 获取数据
   */
  getData() {
    http.post(app.globalData.invoice_order_detail, {
      storeId: this.data.store_id,
      memberAddressId: ''
    }).then(res => {
      // for (var i = 0; i < res.result.length; i++) {
      //   //支付方式 1在线支付 2货到付款
      //   res.result[i].way = 1
      // }
      this.setData({
        address: res.member_address,
        member_address_id: res.member_address == null ? '' : res.member_address.member_address_id,
        info: res.result,
        // freight: freight.toFixed(2),
        store: res.store
      })
      if (res.member_address == null) {
        this.selectComponent("#modal").showModal()
      }
      this.calculate()
    })
  },

  /**
   * 选择地址
   */
  chooseAddress() {
    wx.navigateTo({
      url: '/my/address/address?choose=1',
    })
  },

  /**
   * 支付方式
   */
  onPayWay() {
    let array = [],
      images = [this.data.info.file],
      obj = {
        images: images,
        is_pay_delivery: this.data.store.is_pay_delivery,
        way: 1,
        delivery_method: this.data.info.delivery_method
      }
    array.push(obj)
    this.selectComponent("#pay_way").show(array)
  },

  /**
   * 确定支付方式
   */
  confirmWay(e) {
    this.setData({
      pay_way: e.detail[0].way == 1 ? '1在线支付' : '货到付款',
      way: e.detail[0].way
    })
  },

  /**
   * 配送方式
   */
  onDeliveryWay(e) {
    if (this.data.address == null) {
      app.showToast('请选择收货地址')
      return
    }
    let index = e.currentTarget.dataset.index
    this.data.list[index].delivery_method = e.currentTarget.dataset.method

    //预约自提
    if (e.currentTarget.dataset.method == 'is_shop') {
      this.data.list[index].distribution_type = '2'
      if (this.data.list[index].way == 2) {
        this.data.list[index].way = 1
      }
      //更改支付方式
      let ways = []
      for (let i = 0, len = this.data.list.length; i < len; i++) {
        ways[i] = this.data.list[i].way
      }
      if (ways.indexOf(1) > -1 && ways.indexOf(2) > -1) {
        this.data.pay_way = "在线支付 + 货到付款"
      } else if (ways.indexOf(1) > -1) {
        this.data.pay_way = "在线支付"
      } else if (ways.indexOf(2) > -1) {
        this.data.pay_way = "货到付款"
      }
      this.setData({
        pay_way: this.data.pay_way
      })
    } else if (e.currentTarget.dataset.method == 'is_city') {
      //同城速递
      this.data.list[index].distribution_type = '1'
    } else if (e.currentTarget.dataset.method == 'is_express') {
      //快递邮寄
      this.data.list[index].distribution_type = '3'
    }
    this.calculate()
    this.setData({
      list: this.data.list
    })

  },

  /**
   * 修改自提点
   */
  // changeTake(e) {
  //   var list = this.data.list[e.currentTarget.dataset.index].freight.take_freight_list
  //   var id = this.data.list[e.currentTarget.dataset.index].freight.take_freight_list[0].take_id
  //   var parent_id = this.data.list[e.currentTarget.dataset.index].freight.store_city_id
  //   var select_pick = this.data.list[e.currentTarget.dataset.index].freight.take_freight_list[0]
  //   var newobj = {};
  //   for (var attr in select_pick) {
  //     newobj[attr] = select_pick[attr];
  //   }
  //   this.selectComponent("#self_pick").show(id, list, parent_id, newobj)
  // },

  /**
   * 确定自提点
   */
  // selectPick(e) {
  //   var select_pick = e.detail
  //   for (var i = 0; i < this.data.list.length; i++) {
  //     if (select_pick.store_id == this.data.list[i].store_id) {
  //       this.data.list[i]['take_freight'] = select_pick
  //       this.data.list[i]['take_freight_id'] = select_pick.take_id
  //     }
  //   }
  //   this.setData({
  //     list: this.data.list
  //   })
  // },

  /**
   * 买家留言
   */
  messageInput(e) {
    this.data.message = e.detail.value
  },

  /**
   * 选择优惠券
   */
  // chooseCoupon() {
  //   if (this.data.coupon.length == 0) {
  //     app.showToast('暂无可使用优惠券')
  //     return
  //   }
  //   this.selectComponent("#choose_coupon").show()
  // },

  /**
   * 确定优惠券
   */
  // confirmCoupon(e) {
  //   this.data.coupon = e.detail
  //   var coupon_price = 0
  //   for (var i = 0; i < this.data.coupon.length; i++) {
  //     if (this.data.coupon[i].select) {
  //       coupon_price += parseFloat(this.data.coupon[i].actual_price)
  //     }
  //   }
  //   this.setData({
  //     coupon_price: coupon_price.toFixed(2)
  //   })
  //   this.calculate()
  // },

  /**
   * 选择红包
   */
  // chooseRacket() {
  //   if (this.data.redpacket.length == 0) {
  //     app.showToast('暂无可用红包')
  //   } else {
  //     this.selectComponent("#choose_packet").show(this.data.redpacket)
  //   }
  // },
  /**
   * 确认红包
   */
  // choosepacket(e) {
  //   if (e.detail.length == 0) {
  //     return
  //   }
  //   var price = 0
  //   var member_packet_id
  //   this.data.redpacket = e.detail
  //   for (var i = 0; i < e.detail.length; i++) {
  //     if (e.detail[i].select) {
  //       price = parseFloat(e.detail[i].actual_price)
  //       member_packet_id = e.detail[i].member_packet_id
  //     } else {
  //       member_packet_id = ''
  //     }
  //   }
  //   this.setData({
  //     packet_price: price,
  //     member_packet_id: member_packet_id
  //   })
  //   this.calculate()
  // },

  /**
   * 计算总价
   */
  calculate() {
    let total = 0,
      origin_total = 0,
      freight = 0
    this.setData({
      total: this.data.info.freight_price,
      freight: this.data.info.freight_price
    })
  },

  /**
   * 提交订单
   */
  confirmOrder() {
    if (this.data.address == null) {
      this.selectComponent("#modal").showModal()
      return
    }

    let store_set = [],
      store = {
        store_id: this.data.info.store_id,
        products_id: '',
        goods_attr: '',
        quantity: '1',
        member_shop_coupon_id: '',
        message: this.data.message,
        distribution_type: 3,
        pay_type: this.data.way,
        take_id: '',
        is_invoice: 0,
        is_invoice_template: 1,
        invoice_order_id: this.data.data.order_attach_id
      }
    store_set.push(store)
    http.post(app.globalData.order_confirm, {
      member_address_id: this.data.member_address_id,
      pay_channel: 1,
      order_type: 1,
      cut_activity_id: null,
      group_activity_id: null,
      used_integral: 0,
      member_packet_id: '',
      member_platform_coupon_id: '',
      id_set: this.data.info.goods_id,
      store_set: store_set,
      origin_type: 2,
      invoice_attr: this.data.data.is_anew
    }).then(res => {
      event.emit('refreshCart')
      if (this.data.total == '0.00') {
        app.showSuccessToast('提交成功', () => {
          let item = {

          }
          wx.redirectTo({
            url: '/nearby_shops/invoice_over/invoice_over?item=' + JSON.stringify(item),
          })
        })
        return
      }
      let order_info = {
        total_price: res.result.total_price,
        order_number: res.result.order_number,
        order_type: 'invoice',
        order_attach_number: '',
        order_attach_id: res.result.order_attach_id,
        distribution_id: ''
      }
      wx.redirectTo({
        url: '../cashier_desk/cashier_desk?order_info=' + JSON.stringify(order_info),
      })
    })
  }

})