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
    //商品信息
    info: {},
    //店铺信息
    store: {},
    //商品图片
    good_image: '',
    //地址
    address: {},
    //买家留言
    message: '',
    //平台优惠券id
    member_platform_coupon_id: '',
    //当前优惠券价格
    coupon_price: '0.00',
    //当前红包价格
    packet: '0.00',
    //红包id
    member_packet_id: '',
    //红包
    redpacket: [],
    //运费
    freight_price: '0.00',
    //
    take_id: '',
    //
    take_item: {},
    //支付方式
    pay_way: 1,
    //优惠券
    coupon: [],
    invoice: {
      is_invoice: 0 //是否开发票
    },
    delivery_method: [],
    delivery_method_type: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let info = JSON.parse(decodeURIComponent(options.info))
    info.goods_name = decodeURIComponent(info.goods_name)
    info.store_name = decodeURIComponent(info.store_name)
    this.setData({
      diy_color: app.globalData.diy_color,
      configSwitch: app.globalData.configSwitch,
      info: info,
      first: false,
      good_image: decodeURIComponent(options.good_image)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
    http.post(app.globalData.common_confirm_order, {
      storeId: this.data.info.store_id,
      price: this.data.info.shop_price,
      goodsId: this.data.info.goods_id,
      memberAddressId: this.data.member_address_id,
      number: this.data.info.num,
      productsId: this.data.info.products_id,
      isOriginal: this.data.info.is_original
    }).then(res => {

      for (let i = 0; i < res.coupon.length; i++) {
        res.coupon[i].select = true
      }
      if (res.packet.length != 0) {
        res.packet[0].select = true
      }
      if (res.freight.length != 0) {
        this.setData({
          delivery_method: []
        })
        //显示配送方式
        if (res.freight[0].expressFreightSup == 1) {
          this.data.delivery_method.push({
            title: '快递邮寄',
            text: 'is_express',
            type: 0
          })
        }
        if (res.freight[0].cityFreightSup == 1) {
          this.data.delivery_method.push({
            title: '同城配送',
            text: 'is_city',
            type: 1
          })
        }
        if (res.freight[0].takeFreightSup == 1) {
          this.data.delivery_method.push({
            title: '预约自提',
            text: 'is_shop',
            type: 2
          })
        }
        if (res.freight[0].takeFreightSup == 1) {
          this.data.take_id = res.freight[0].takeFreighList[0].take_id
          this.data.take_item = res.freight[0].takeFreighList[0]
        }

        let delivery_method_every = this.data.delivery_method.some((item) => {
          return item.type + 1 == res.freight[0].defaultExpressType
        })
        if (!delivery_method_every && this.data.delivery_method.length != 0) {
          //如果默认配送方式不支持
          switch (this.data.delivery_method[0].type) {
            case 0:
              res.freight[0].defaultExpressType = 1
              break;
            case 1:
              res.freight[0].defaultExpressType = 2
              break;
            case 2:
              res.freight[0].defaultExpressType = 3
              break;
          }
        }
        //默认配送方式
        if (res.freight[0].defaultExpressType == 1) {
          this.data.info.delivery_method = 3
          this.data.delivery_method_type = 0
          this.data.pay_way = 1
          this.data.freight_price = res.freight[0].expressFreightPrice
        } else if (res.freight[0].defaultExpressType == 2) {
          this.data.info.delivery_method = 1
          this.data.delivery_method_type = 1
          this.data.freight_price = res.freight[0].cityFreightPrice
          this.data.pay_way = 1
        } else if (res.freight[0].defaultExpressType == 3) {
          this.data.info.delivery_method = 2
          this.data.delivery_method_type = 2
          this.data.freight_price = 0
          this.data.pay_way = 1
        }

        app.globalData.addressSelect.member_address_id = res.address.member_address_id ? res.address.member_address_id : null
        if ((res.address == null || res.address.name == undefined) && this.data.delivery_method_type != 2) {
          this.selectComponent("#modal").showModal()
        }
      }

      this.setData({
        finish: true,
        address: res.address,
        store: res.result,
        coupon: res.coupon,
        coupon_price: res.coupon.length == 0 ? '0.00' : res.coupon_price,
        packet: res.packet.length == 0 ? '0.00' : res.packet[0].actual_price,
        member_packet_id: res.packet.length == 0 ? '' : res.packet[0].member_packet_id,
        freight: res.freight == null ? null : res.freight[0],
        take_id: this.data.take_id,
        take_item: this.data.take_item,
        freight_price: this.data.freight_price,
        info: this.data.info,
        redpacket: res.packet,
        pay_way: this.data.pay_way,
        discount_price: res.discount_price,
        'invoice.is_added_value_tax': res.result.is_added_value_tax,
        delivery_method: this.data.delivery_method,
        delivery_method_type: this.data.delivery_method_type
      })
      this.calcTotal()
    })
  },

  /**
   * 弹出修改窗口
   */
  onChangeNum() {
    this.selectComponent("#change_num").show(this.data.info.num, this.data.info.goods_number)
  },

  /**
   * 选择地址
   */
  chooseAddress() {
    wx.navigateTo({
      url: '/my/address/address?choose=true',
    })
  },

  /**
   * 减少购买数量
   */
  onMinus() {
    let num = this.data.info.num;
    if (num > 1) {
      num--;
      this.data.info.num = num;
      this.setData({
        info: this.data.info
      })
      this.getData()
    }
  },

  /**
   * 增加购买数量
   */
  onAdd() {
    let num = this.data.info.num;
    num++;
    this.data.info.num = num;
    this.getData()
  },

  /**
   * 确定修改数量
   */
  confirmNum(e) {
    this.data.info.num = e.detail;
    this.getData()
  },

  /**
   * 计算总价
   */
  calcTotal() {
    if (this.data.info.good_type == 1) {
      //普通商品
      this.data.info.subtotal = parseFloat(this.data.info.num * this.data.info.shop_price)
      this.data.info['total'] = parseFloat(this.data.info.num) * parseFloat(this.data.info.shop_price) - parseFloat(this.data.coupon_price) - parseFloat(this.data.packet) - (this.data.discount_price * this.data.info.num) > 0 ? parseFloat(this.data.info.num) * parseFloat(this.data.info.shop_price) - parseFloat(this.data.coupon_price) - parseFloat(this.data.packet) - (this.data.discount_price * this.data.info.num) : parseFloat(this.data.freight_price) > 0 ? 0 : 0.10;
    } else if (this.data.info.good_type == 2) {
      //团购
      this.data.info.subtotal = parseFloat(this.data.info.num * this.data.info.group_price) > 0 ? parseFloat(this.data.info.num * this.data.info.group_price).toFixed(2) : parseFloat(this.data.freight_price) > 0 ? 0 : 0.10;
      this.data.info['total'] = parseFloat(this.data.info.subtotal)
    } else if (this.data.info.good_type == 3) {
      //砍价
      this.data.info.subtotal = parseFloat(this.data.info.num * this.data.info.cut_price) > 0 ? parseFloat(this.data.info.num * this.data.info.cut_price).toFixed(2) : parseFloat(this.data.freight_price) > 0 ? 0 : 0.10;
      this.data.info['total'] = parseFloat(this.data.info.subtotal)
    } else if (this.data.info.good_type == 4) {
      this.data.info.subtotal = parseFloat(this.data.info.num * this.data.info.time_limit_price) > 0 ? parseFloat(this.data.info.num * this.data.info.time_limit_price).toFixed(2) : parseFloat(this.data.freight_price) > 0 ? 0 : 0.10;
      this.data.info['total'] = parseFloat(this.data.info.subtotal)
    }

    //判断合计是否等于0
    this.data.info['total'] = (parseFloat(this.data.info['total']) + parseFloat(this.data.freight_price)).toFixed(2) > 0 ? (parseFloat(this.data.info['total']) + parseFloat(this.data.freight_price)).toFixed(2) : parseFloat(this.data.freight_price) + 0.1
    this.setData({
      info: this.data.info
    })
  },

  /**
   * 支付方式
   */
  onPayWay() {
    let array = [],
      images = [this.data.good_image],
      obj = {
        images: images,
        is_pay_delivery: this.data.freight.is_pay_delivery,
        city_freight_sup: this.data.freight.city_freight_sup,
        way: this.data.pay_way,
        delivery_method: this.data.info.delivery_method
      }
    array.push(obj)
    this.selectComponent("#pay_way").show(array)
  },

  /**
   * 确定支付方式
   */
  confirmWay(e) {
    let delivery_method, type
    if (e.detail[0].delivery_method == 3 && this.data.delivery_method_type != 1) {
      delivery_method = 0
    } else if (e.detail[0].delivery_method == 2 && this.data.delivery_method_type == 1) {
      delivery_method = 2
    } else if (e.detail[0].delivery_method == 1 && this.data.delivery_method_type != 1) {
      delivery_method = 1
    }
    setTimeout(() => {
      if (delivery_method = 0) {
        type = 3
      } else if (delivery_method = 1) {
        type = 1
      } else if (delivery_method = 2) {
        type = 2
      }
      this.setData({
        'info.delivery_method': type,
        pay_way: e.detail[0].way,
        delivery_method_type: delivery_method,
        freight_price: e.detail[0].way == 2 || this.data.info.delivery_method == 1 ? this.data.freight.city_freight_price : this.data.freight.express_freight_price
      })
      this.calcTotal()
    }, 50)
  },

  /**
   * 配送方式
   */
  onDeliveryWay(e) {
    let item = e.currentTarget.dataset.item
    if (this.data.address == null) {
      app.showToast('请选择收货地址')
      return
    }

    if (this.data.pay_way == 2) {
      return
    }
    this.setData({
      delivery_method_type: item.type
    })
    //判断配送方式
    if (item.type == 2) {
      this.data.info.delivery_method = 2
      this.setData({
        info: this.data.info,
        freight_price: 0.00,
      })
    } else if (item.type == 1) {
      //同城速递
      this.data.info.delivery_method = 1
      this.setData({
        info: this.data.info,
        freight_price: this.data.freight.city_freight_price
      })
    } else if (item.type == 0) {
      //快递邮寄
      this.data.info.delivery_method = 3
      this.setData({
        info: this.data.info,
        freight_price: this.data.freight.express_freight_price
      })
    }

    this.calcTotal()
  },

  /**
   * 同城速递
   */
  onCityWide() {
    this.data.info.delivery_method = 1
    this.setData({
      info: this.data.info,
      // pay_way: 2,
      freight_price: this.data.freight.city_freight_price
    })
    this.calcTotal()
  },

  /**
   * 预约自提
   */
  onPickup() {
    if (this.data.pay_way == 2) {
      return
    }
    this.data.info.delivery_method = 2
    this.setData({
      info: this.data.info,
      freight_price: 0.00,
      // pay_way: 1
    })
    this.calcTotal()
  },

  /**
   * 快递邮寄
   */
  onExpress() {
    if (this.data.pay_way == 2) {
      return
    }
    this.data.info.delivery_method = 3
    this.setData({
      info: this.data.info,
      freight_price: this.data.freight.express_freight_price,
      // pay_way: 1
    })
    this.calcTotal()
  },

  /**
   * 修改自提点
   */
  changeTake() {
    let list = this.data.freight.take_freight_list
    if (this.data.take_id == '') {
      this.data.take_id = this.data.freight.take_freight_list[0].take_id
    }
    let parent_id = this.data.freight.store_city_id,
      select_pick = this.data.freight.take_freight_list[0],
      newobj = {};
    for (let attr in select_pick) {
      newobj[attr] = select_pick[attr];
    }
    this.selectComponent("#self_pick").show(this.data.take_id, list, parent_id, newobj)
  },

  /**
   * 确定自提点
   */
  selectPick(e) {
    let select_pick = e.detail
    this.setData({
      take_item: select_pick,
      take_id: select_pick.take_id
    })
  },

  /**
   * 买家留言
   */
  messageInput(e) {
    this.setData({
      message: e.detail.value
    })
  },

  /**
   * 提交订单
   */
  submit() {
    let store_set = [],
      member_shop_coupon_id = '';
    //如果没有地址弹出
    if ((this.data.address == null || this.data.address.name == undefined) && this.data.info.delivery_method != 2) {
      this.selectComponent("#modal").showModal()
      return
    }
    if (this.data.freight.express_freight_sup == 0 && this.data.freight.city_freight_sup == 0 && this.data.freight.take_freight_sup == 0 && this.data.freight.city_freight_msg != '') {
      app.showToast(this.data.freight.city_freight_msg)
      return
    }
    for (let i = 0, len = this.data.coupon.length; i < len; i++) {
      if (this.data.coupon[i].select && this.data.coupon[i].state == "store") {
        member_shop_coupon_id = this.data.coupon[i].member_coupon_id
      }
      if (this.data.coupon[i].state == "platform" && this.data.coupon[i].select) {
        this.data.member_platform_coupon_id = this.data.coupon[i].member_coupon_id
      } else {
        this.data.member_platform_coupon_id = ''
      }
    }
    let store = {
      store_id: this.data.info.store_id,
      pay_type: this.data.pay_way,
      products_id: this.data.info.products_id,
      goods_attr: this.data.info.attr == '请选择尺寸' ? '' : this.data.info.attr,
      quantity: this.data.info.num,
      member_shop_coupon_id: this.data.info.good_type == 1 ? member_shop_coupon_id : '',
      message: this.data.message,
      distribution_type: this.data.info.delivery_method,
      take_id: this.data.info.delivery_method == 2 ? this.data.take_id : '',
      //是否开发票 0不开 1开
      invoice_set: this.data.invoice.is_invoice == 1 ? {
        //发票
        account: this.data.invoice.account, //开户账户
        bank: this.data.invoice.bank, //开户银行
        //company: this.data.invoice.company,//发票抬头内容
        detail_type: this.data.invoice.detail_type, //发票类型
        taxer_number: this.data.invoice.taxer_number, //纳税人识别号
        address: this.data.invoice.address, //注册地址
        phone: this.data.invoice.phone, //注册电话
        invoice_type: this.data.invoice.invoice_type, //发票类型：1电子发票 2普通纸质发票 3增值税纸质发票
        rise: this.data.invoice.rise, //发票抬头：1个人或事业单位 2企业
        rise_name: this.data.invoice.rise == 1 ? this.data.invoice.rise_name : this.data.invoice.company, //发票抬头内容（抬头为企业时将公司名称传进来）发票抬头：1个人 2公司
        consignee_name: this.data.invoice.consignee_name,
        consignee_phone: this.data.invoice.consignee_phone,
        address_province: this.data.invoice.address_province,
        address_city: this.data.invoice.address_city,
        address_area: this.data.invoice.address_area,
        address_street: this.data.invoice.address_street,
        address_details: this.data.invoice.address_details
      } : ''
    }
    store_set.push(store)
    http.post(app.globalData.order_confirm, {
      member_address_id: this.data.info.delivery_method != 2 ? this.data.address.member_address_id : '',
      pay_channel: 1,
      order_type: this.data.info.good_type,
      cut_activity_id: this.data.info.cut_activity_id,
      group_activity_id: this.data.info.group_activity_id,
      used_integral: 0,
      member_packet_id: this.data.info.good_type == 1 ? this.data.member_packet_id : '',
      member_platform_coupon_id: this.data.info.good_type == 1 ? this.data.member_platform_coupon_id : '',
      id_set: this.data.info.goods_id,
      store_set: store_set,
      origin_type: 2,
    }).then(res => {
      event.emit('refreshBargain', this.data.info.cut_activity_id)
      event.emit('refreshBargainDetail')
      if (this.data.info['total'] == 0) {
        app.showSuccessToast('提交成功', () => {
          let item = {
            total_price: res.result.total_price,
            order_type: this.data.info.good_type,
            order_attach_id: res.result.order_attach_id,
            fx_type: this.data.info.fx_type,
            out_trade_no: res.result.order_number,
          }
          wx.redirectTo({
            url: '/nearby_shops/pay_result/pay_result?item=' + JSON.stringify(item),
          })
        })
        return
      }
      if (this.data.pay_way == 2) {
        app.showSuccessToast('提交成功', () => {
          let item = {
            total_price: res.result.total_price,
            order_type: this.data.info.good_type,
            fx_type: this.data.info.fx_type,
            order_attach_id: res.result.order_attach_id,
            distribution_id: this.data.info.distribution_id,
            out_trade_no: res.result.order_number,
          }
          wx.redirectTo({
            url: '/nearby_shops/pay_result/pay_result?item=' + JSON.stringify(item),
          })
        })
      } else {
        let order_info = {
          total_price: res.result.total_price,
          order_number: res.result.order_number,
          order_type: this.data.info.good_type,
          order_attach_number: '',
          fx_type: this.data.info.fx_type,
          order_attach_id: res.result.order_attach_id,
          distribution_id: this.data.info.distribution_id,
          type: 1
        }
        wx.redirectTo({
          url: '../cashier_desk/cashier_desk?order_info=' + JSON.stringify(order_info),
        })
      }
      http.post(app.globalData.applet_my_saveFormId, {
        microFormId: this.data.formId
      })
    })

  },
  createWhether(e) {
    console.log(e)
  },

  /**
   * 选择优惠券
   */
  chooseCoupon() {
    if (this.data.coupon.length == 0) {
      app.showToast('暂无可用优惠券')
    } else {
      this.selectComponent("#choose_coupon").show(this.data.coupon)
    }
  },

  /**
   * 确认优惠券
   */
  confirmCoupon(e) {
    if (e.detail.length == 0) {
      return
    }
    let price = 0
    this.data.coupon = e.detail
    for (let i = 0, len = e.detail.length; i < len; i++) {
      if (e.detail[i].select) {
        price += parseFloat(e.detail[i].actual_price)
      }
    }
    this.setData({
      coupon_price: price
    })
    this.calcTotal()
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
      packet: price,
      member_packet_id: member_packet_id
    })
    this.calcTotal()
  },

  /**
   * 发票
   */
  invoice() {
    this.selectComponent("#popup").show(this.data.invoice, 0, this.data.store.store_id, 0, this.data.address.member_address_id != undefined ? this.data.address : '')
  },
  /**
   * 
   */
  popup_invoice(e) {
    this.setData({
      invoice: e.detail
    })
  },
  createWhether() {
    this.setData({
      'invoice.address_province': this.data.province.area_name,
      'invoice.address_city': this.data.city.area_name,
      'invoice.address_area': this.data.area.area_name,
    })
  },
  formId(e) {
    this.data.formId = e.detail.formId
  },
  changeAddress(e) {
    this.data.member_address_id = this.data.address.member_address_id
    this.getData()
  }
})