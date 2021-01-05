const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    first: true,
    member_address_id: '',
    //购物车id
    cart_id: '',
    //列表
    list: [],
    //地址
    address: null,
    //运费
    freight: 0.00,
    //优惠券列表
    coupon: [],
    //红包
    redpacket: [],
    //合计价格
    total: 0,
    //红包价格
    packet_price: '0.00',
    //红包id
    member_packet_id: '',
    //支付方式
    pay_way: '在线支付',
    invoice: {
      is_invoice: 0
    },
    delivery_method: [{
        isSupport: 0,
        title: '快递邮寄',
        text: 'is_express'
      },
      {
        isSupport: 0,
        title: '同城配送',
        text: 'is_city'
      }, {
        isSupport: 0,
        title: '预约自提',
        text: 'is_shop'
      }
    ],
    delivery_method_type: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      configSwitch: app.globalData.configSwitch,
      cart_id: options.cart_id,
      first: false
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    event.on('changeAddress', this, () => {
      this.data.member_address_id = this.data.address.member_address_id
      this.getData()
    })
    this.getData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!this.data.first && (app.globalData.addressSelect.member_address_id == null || this.data.address.member_address_id != app.globalData.addressSelect.member_address_id)) {
      this.setData({
        address: {}
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    event.remove('changeAddress', this)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.cart_confirm_order, {
      cartId: this.data.cart_id,
      memberAddressId: this.data.member_address_id
    }).then(res => {
      app.globalData.addressSelect.member_address_id = res.address.memberAddressId ? res.address.memberAddressId : null
      let freight = 0
      let ways = []
      for (let i = 0, len = res.result.length; i < len; i++) {
        if (res.result[i].freight != null) {
          res.result[i]['deliveryMethod'] = []
          //显示配送方式
          if (res.result[i].freight.express_freight_sup == 1) {
            res.result[i]['deliveryMethod'].push({
              title: '快递邮寄',
              text: 'is_express',
              type: 0
            })
          }
          if (res.result[i].freight.city_freight_sup == 1) {
            res.result[i]['deliveryMethod'].push({
              title: '同城配送',
              text: 'is_city',
              type: 1
            })
          }
          if (res.result[i].freight.take_freight_sup == 1) {
            res.result[i]['deliveryMethod'].push({
              title: '预约自提',
              text: 'is_shop',
              type: 2
            })
          }

          let delivery_method_every = res.result[i]['deliveryMethod'].some((item) => {
            return item.type + 1 == res.result[i].freight.default_express_type
          })
          if (!delivery_method_every && res.result[i]['deliveryMethod'].length != 0) {
            //如果默认配送方式不支持
            switch (res.result[i]['deliveryMethod'][0].type) {
              case 0:
                res.result[i].freight.defaultExpressType = 1
                break;
              case 1:
                res.result[i].freight.defaultExpressType = 2
                break;
              case 2:
                res.result[i].freight.defaultExpressType = 3
                break;
            }
          }

          //默认配送方式
          if (res.result[i].freight.defaultExpressType == 1) {
            res.result[i]['deliveryMethodType'] = 0
            res.result[i]['distributionType'] = '3'
            res.result[i]['way'] = 1
            //运费
            freight += parseFloat(res.result[i].freight.expressFreightPrice)
          } else if (res.result[i].freight.defaultExpressType == 2) {
            res.result[i]['deliveryMethodType'] = 1
            res.result[i]['distributionType'] = '1'
            res.result[i]['way'] = 1
            //运费
            freight += parseFloat(res.result[i].freight.cityFreightPrice)
          } else if (res.result[i].freight.defaultExpressType == 3) {
            res.result[i]['deliveryMethodType'] = 2
            res.result[i]['distributionType'] = '2'
            res.result[i]['way'] = 1
            //运费
            freight += 0
          }
          //门店自提点
          if (res.result[i].freight.takeFreightSup == 1) {
            res.result[i]['takeFreight'] = res.result[i].freight.takeFreightList[0]
            res.result[i]['takeFreightId'] = res.result[i].freight.takeFreightList[0].takeId
          } else {
            res.result[i]['takeFreight'] = ''
            res.result[i]['takeFreightId'] = ''
          }
        }
        ways[i] = res.result[i].way
        res.result[i]['invoice'] = {
          is_invoice: 0,
          is_added_value_tax: res.result[i].isAddedValueTax
        }
        //优惠券
        res.result[i]['couponId'] = ''
        //留言
        res.result[i]['message'] = ''
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

      for (let i = 0, len = res.coupon.length; i < len; i++) {
        //购物券列表
        res.coupon[i].select = true
      }
      //获取红包
      if (res.packet.length != 0) {
        res.packet[0].select = true
      }

      for (let i = 0, len = res.result.length; i < len; i++) {
        //支付方式 1在线支付 2货到付款
        res.result[i].way = 1
      }
      this.setData({
        address: res.address,
        member_address_id: res.address == null ? '' : res.address.member_address_id,
        list: res.result,
        coupon_price: res.couponPrice,
        coupon: res.coupon,
        packet_price: res.packet.length == 0 ? '0.00' : res.packet[0].actualPrice,
        member_packet_id: res.packet.length == 0 ? '' : res.packet[0].memberPacketId,
        freight: freight.toFixed(2),
        redpacket: res.packet
      })
      if (res.address == null || res.address.name == undefined) {
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
    let array = []
    for (let i = 0, len = this.data.list.length; i < len; i++) {
      let images = []
      for (let j = 0, j_len = this.data.list[i].list.length; j < j_len; j++) {
        images.push(this.data.list[i].list[j].file)
      }
      let is_pay_delivery = this.data.list[i].freight.is_pay_delivery
      let city_freight_sup = this.data.list[i].freight.city_freight_sup
      let obj = {
        images: images,
        is_pay_delivery: is_pay_delivery,
        city_freight_sup: city_freight_sup,
        way: this.data.list[i].way, //支付方式 1在线 2货到
        delivery_method: this.data.list[i].distribution_type
      }
      array.push(obj)
    }
    this.selectComponent("#pay_way").show(array)
  },

  /**
   * 确定支付方式
   */
  confirmWay(e) {
    let ways = []
    for (let i = 0, len = this.data.list.length; i < len; i++) {
      this.data.list[i].way = e.detail[i].way
      ways[i] = e.detail[i].way
      if (e.detail[i].way == 1) {
        this.data.list[i].distribution_type = '3'
        this.data.list[i].delivery_method_type = 1
        // this.data.list[i].delivery_method = 'is_express'
      }
      if (e.detail[i].way == 2) {
        this.data.list[i].distribution_type = '1'
        this.data.list[i].delivery_method_type = 1
      }
    }
    if (ways.indexOf(1) > -1 && ways.indexOf(2) > -1) {
      this.data.pay_way = "在线支付 + 货到付款"
    } else if (ways.indexOf(1) > -1) {
      this.data.pay_way = "在线支付"
    } else if (ways.indexOf(2) > -1) {
      this.data.pay_way = "货到付款"
    }
    this.setData({
      list: this.data.list,
      pay_way: this.data.pay_way
    })
    this.calculate()
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
    let idx = e.currentTarget.dataset.idx
    let item = e.currentTarget.dataset.item
    this.data.list[index].delivery_method_type = item.type
    if (this.data.list[index].way == 2) {
      return
    }

    //判断配送方式
    if (item.type == 2) {
      //预约自提
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
    } else if (item.type == 1) {
      //同城速递
      this.data.list[index].distribution_type = '1'
    } else if (item.type == 0) {
      //快递邮寄
      this.data.list[index].distribution_type = '3'
    }

    this.calculate()
    this.setData({
      list: this.data.list
    })
    // ---------------------------------------
    // return
    // let index = e.currentTarget.dataset.index
    // if (this.data.list[index].way == 2) {
    //   return
    // }
    // this.data.list[index].delivery_method = e.currentTarget.dataset.method

    // //预约自提
    // if (e.currentTarget.dataset.method == 'is_shop') {
    //   this.data.list[index].distribution_type = '2'

    //   if (this.data.list[index].way == 2) {
    //     this.data.list[index].way = 1
    //   }
    //   //更改支付方式
    //   let ways = []
    //   for (let i = 0, len = this.data.list.length; i < len; i++) {
    //     ways[i] = this.data.list[i].way
    //   }
    //   if (ways.indexOf(1) > -1 && ways.indexOf(2) > -1) {
    //     this.data.pay_way = "在线支付 + 货到付款"
    //   } else if (ways.indexOf(1) > -1) {
    //     this.data.pay_way = "在线支付"
    //   } else if (ways.indexOf(2) > -1) {
    //     this.data.pay_way = "货到付款"
    //   }
    //   this.setData({
    //     pay_way: this.data.pay_way
    //   })
    // } else if (e.currentTarget.dataset.method == 'is_city') {
    //   //同城速递
    //   this.data.list[index].distribution_type = '1'
    // } else if (e.currentTarget.dataset.method == 'is_express') {
    //   //快递邮寄
    //   this.data.list[index].distribution_type = '3'
    // }
    // this.calculate()
    // this.setData({
    //   list: this.data.list
    // })

  },

  /**
   * 修改自提点
   */
  changeTake(e) {
    let list = this.data.list[e.currentTarget.dataset.index].freight.take_freight_list,
      id = this.data.list[e.currentTarget.dataset.index].freight.take_freight_list[0].take_id,
      parent_id = this.data.list[e.currentTarget.dataset.index].freight.store_city_id,
      select_pick = this.data.list[e.currentTarget.dataset.index].freight.take_freight_list[0],
      newobj = {};
    for (let attr in select_pick) {
      newobj[attr] = select_pick[attr];
    }
    this.selectComponent("#self_pick").show(id, list, parent_id, newobj)
  },

  /**
   * 确定自提点
   */
  selectPick(e) {
    let select_pick = e.detail
    for (let i = 0, len = this.data.list.length; i < len; i++) {
      if (select_pick.store_id == this.data.list[i].store_id) {
        this.data.list[i]['take_freight'] = select_pick
        this.data.list[i]['take_freight_id'] = select_pick.take_id
      }
    }
    this.setData({
      list: this.data.list
    })
  },

  /**
   * 买家留言
   */
  messageInput(e) {
    this.data.list[e.currentTarget.dataset.index]['message'] = e.detail.value
  },

  /**
   * 选择优惠券
   */
  chooseCoupon() {
    if (this.data.coupon.length == 0) {
      app.showToast('暂无可使用优惠券')
      return
    }
    this.selectComponent("#choose_coupon").show()
  },

  /**
   * 确定优惠券
   */
  confirmCoupon(e) {
    this.data.coupon = e.detail
    let coupon_price = 0
    for (let i = 0, len = this.data.coupon.length; i < len; i++) {
      if (this.data.coupon[i].select) {
        coupon_price += parseFloat(this.data.coupon[i].actual_price)
      }
    }
    this.setData({
      coupon_price: coupon_price.toFixed(2)
    })
    this.calculate()
  },

  /**
   * 选择红包
   */
  chooseRacket() {
    if (this.data.redpacket.length == 0) {
      app.showToast('暂无可用红包')
    } else {
      this.selectComponent("#choose_packet").show(this.data.redpacket)
    }
  },
  /**
   * 确认红包
   */
  choosepacket(e) {
    if (e.detail.length == 0) {
      return
    }
    let price = 0,
      member_packet_id
    this.data.redpacket = e.detail
    for (let i = 0, len = e.detail.length; i < len; i++) {
      if (e.detail[i].select) {
        price = parseFloat(e.detail[i].actual_price)
        member_packet_id = e.detail[i].member_packet_id
      } else {
        member_packet_id = ''
      }
    }
    this.setData({
      packet_price: price,
      member_packet_id: member_packet_id
    })
    this.calculate()
  },

  /**
   * 计算总价
   */
  calculate() {
    let total = 0,
      origin_total = 0,
      freight = 0,
      discount_price = 0;
    for (let i = 0; i < this.data.list.length; i++) {
      this.data.list[i].total_price = 0;
      for (let j = 0; j < this.data.list[i].list.length; j++) {
        this.data.list[i].total_price += parseFloat(this.data.list[i].list[j].price) * parseFloat(this.data.list[i].list[j].number)
        discount_price += parseFloat(this.data.list[i].list[j].discount_price) * parseFloat(this.data.list[i].list[j].number)
        total += parseFloat(this.data.list[i].list[j].price) * parseFloat(this.data.list[i].list[j].number)
        origin_total += parseFloat(this.data.list[i].list[j].price) * parseFloat(this.data.list[i].list[j].number)
      }
      // total += parseFloat(this.data.list[i].total_price)
      // origin_total += parseFloat(this.data.list[i].total_price)
      if (this.data.list[i].distribution_type == 1) {
        //同城
        freight += parseFloat(this.data.list[i].freight.city_freight_price);
      } else if (this.data.list[i].distribution_type == 2) {
        //预约自提
        freight += 0;
      } else if (this.data.list[i].distribution_type == 3) {
        //快递邮寄
        freight += parseFloat(this.data.list[i].freight.express_freight_price);
      }
    }

    total = total - parseFloat(this.data.coupon_price) - parseFloat(this.data.packet_price) - parseFloat(discount_price);
    if (total <= 0) {
      total = parseFloat(freight) > 0 ? 0 : 0.1;
    }
    if (parseFloat(total) + parseFloat(freight) > 0) {
      total += parseFloat(freight)
    } else {
      total = parseFloat(freight) + 0.1
    }
    this.setData({
      total: total > 0 ? total : '0.00',
      origin_total: origin_total,
      freight: freight.toFixed(2),
      list: this.data.list
    })
  },

  /**
   * 提交订单
   */
  confirmOrder() {
    //地址是否为空
    if (this.data.address == null || this.data.address.name == undefined) {
      this.selectComponent("#modal").showModal()
      return
    }

    let member_platform_coupon_id = ''
    for (let i = 0, len = this.data.list.length; i < len; i++) {
      this.data.list[i]['coupon_id'] = ''
      //配送是否为空
      if (this.data.list[i].freight.city_freight_msg != '' && this.data.list[i].distribution_type == 1) {
        app.showToast(this.data.list[i].freight.city_freight_msg)
        break
        return
      }
    }
    for (let i = 0, len = this.data.coupon.length; i < len; i++) {
      //店铺优惠券
      for (let j = 0, j_len = this.data.list.length; j < j_len; j++) {
        if (this.data.coupon[i].store_id == this.data.list[j].store_id && this.data.coupon[i].select) {
          this.data.list[j]['coupon_id'] = this.data.coupon[i].member_coupon_id
        }
      }

      //平台优惠券
      if (this.data.coupon[i].state == "platform") {
        member_platform_coupon_id = this.data.coupon[i].member_coupon_id
      } else {
        member_platform_coupon_id = ''
      }
    }

    let store_set = []
    let total_order = 0
    for (let i = 0, len = this.data.list.length; i < len; i++) {
      let store = {
        store_id: this.data.list[i].store_id,
        products_id: '',
        goods_attr: '',
        quantity: '',
        member_shop_coupon_id: this.data.list[i].coupon_id,
        message: this.data.list[i].message,
        distribution_type: this.data.list[i].distribution_type,
        pay_type: this.data.list[i].way,
        take_id: this.data.list[i].distribution_type == 2 ? this.data.list[i].take_freight_id : '',
        //是否开发票 0不开 1开
        invoice_set: this.data.list[i].invoice.is_invoice == 1 ? {
          //发票
          account: this.data.list[i].invoice.account, //开户账户
          bank: this.data.list[i].invoice.bank, //开户银行
          //company: this.data.invoice.company,//发票抬头内容
          detail_type: this.data.list[i].invoice.detail_type, //发票类型
          taxer_number: this.data.list[i].invoice.taxer_number, //纳税人识别号
          address: this.data.list[i].invoice.address, //注册地址
          phone: this.data.list[i].invoice.phone, //注册电话
          invoice_type: this.data.list[i].invoice.invoice_type, //发票类型：1电子发票 2普通纸质发票 3增值税纸质发票
          rise: this.data.list[i].invoice.rise, //发票抬头：1个人或事业单位 2企业
          rise_name: this.data.list[i].invoice.rise == 1 ? this.data.list[i].invoice.rise_name : this.data.list[i].invoice.company, //发票抬头内容（抬头为企业时将公司名称传进来）发票抬头：1个人 2公司
          consignee_name: this.data.list[i].invoice.consignee_name,
          consignee_phone: this.data.list[i].invoice.consignee_phone,
          address_province: this.data.list[i].invoice.address_province,
          address_city: this.data.list[i].invoice.address_city,
          address_area: this.data.list[i].invoice.address_area,
          address_street: this.data.list[i].invoice.address_street,
          address_details: this.data.list[i].invoice.address_details
        } : '',
      }
      if (this.data.list[i].way == 1) {
        total_order += Number(this.data.list[i].total_price)
      }
      store_set.push(store)
    }
    this.setData({
      total_order: total_order
    })
    http.post(app.globalData.order_confirm, {
      memberAddressId: this.data.member_address_id,
      payChannel: 2,
      orderType: 1,
      cutActivityId: null,
      groupActivityid: null,
      usedIntegral: 0,
      memberPacketId: this.data.member_packet_id,
      memberPlatformCoupon_id: member_platform_coupon_id,
      idSet: this.data.cart_id,
      storeSet: store_set,
      invoiceAttr: 1,
      originType: 2
    }).then(res => {
      event.emit('refreshCart')
      event.emit('clearCart')
      if (this.data.total_order == 0) {
        let item = {
          total_price: res.result.total_price,
          order_type: 1,
          order_attach_id: res.result.order_attach_id,
          distribution_id: '',
          out_trade_no: res.result.order_number,
        }
        wx.redirectTo({
          url: '/nearby_shops/pay_result/pay_result?item=' + JSON.stringify(item),
        })
        return
      }
      if (this.data.total == '0.00') {
        app.showSuccessToast('提交成功', () => {
          let item = {
            total_price: res.result.total_price,
            order_type: this.data.info.good_type,
            order_attach_id: res.result.order_attach_id,
            distribution_id: ''
          }
          wx.redirectTo({
            url: '/nearby_shops/pay_result/pay_result?item=' + JSON.stringify(item),
          })
        })
        return
      }
      let order_info = {
        total_price: res.result.total_price,
        order_number: res.result.order_number,
        order_type: 1,
        order_attach_number: '',
        order_attach_id: res.result.order_attach_id,
        distribution_id: '',
        type: 1
      }
      http.post(app.globalData.applet_my_saveFormId, {
        microFormId: this.data.formId
      }).then(res => {})
      wx.redirectTo({
        url: '../cashier_desk/cashier_desk?order_info=' + JSON.stringify(order_info),
      })
    })
  },

  /**
   * 发票
   */
  invoice(e) {
    let idx = e.currentTarget.dataset.index,
      item = e.currentTarget.dataset.item;
    this.setData({
      popupIdx: idx
    })
    this.selectComponent("#popup").show(item.invoice, idx, item.store_id, 0, this.data.address.member_address_id != undefined ? this.data.address : '')
  },
  /**
   * 确定发票方式
   */
  popup_invoice(e) {
    let item = e.detail
    let data = {
      account: item.account,
      bank: item.bank,
      company: item.company,
      detail_type: item.detail_type,
      taxer_number: item.taxer_number,
      address: item.address,
      phone: item.phone,
      invoice_type: item.invoice_type,
      is_invoice: item.is_invoice,
      rise: item.rise,
      rise_name: item.rise_name,
      consignee_name: item.consignee_name,
      consignee_phone: item.consignee_phone,
      address_province: item.address_province,
      address_city: item.address_city,
      address_area: item.address_area,
      address_street: item.address_street,
      address_details: item.address_details
    }
    this.data.list[item.idx].invoice = data
    this.setData({
      list: this.data.list
    })
  },
  createWhether(idx) {
    this.data.list[idx].invoice.address_province = this.data.province.area_name
    this.data.list[idx].invoice.address_city = this.data.city.area_name
    this.data.list[idx].invoice.address_area = this.data.area.area_name
    this.setData({
      list: this.data.list
    })
  },
  formId(e) {
    this.data.formId = e.detail.formId
  }
})