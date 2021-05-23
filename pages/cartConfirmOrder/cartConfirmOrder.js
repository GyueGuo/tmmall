const app = getApp();
import http from '../../utils/http';
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    first: true,
    memberAddressId: '',
    //购物车id
    cartId: '',
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
    packetPrice: '0.00',
    //红包id
    memberPacketId: '',
    //支付方式
    payWay: '在线支付',
    invoice: {
      isInvoice: 0
    },
    deliveryMethod: [{
        isSupport: 0,
        title: '快递邮寄',
        text: 'isExpress'
      },
      {
        isSupport: 0,
        title: '同城配送',
        text: 'isCity'
      }, {
        isSupport: 0,
        title: '预约自提',
        text: 'isShop'
      }
    ],
    deliveryMethodType: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      configSwitch: app.globalData.configSwitch,
      cartId: options.cartId,
      first: false
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    event.on('changeAddress', this, () => {
      this.data.memberAddressId = this.data.address.memberAddressId
      this.getData()
    })
    this.getData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!this.data.first && (app.globalData.addressSelect.memberAddressId == null || this.data.address.memberAddressId != app.globalData.addressSelect.memberAddressId)) {
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
    http.post(app.globalData.cartConfirmOrder, {
      cartId: this.data.cartId,
      memberAddressId: this.data.memberAddressId
    }).then(res => {
      app.globalData.addressSelect.memberAddressId = res.address.memberAddressId ? res.address.memberAddressId : null
      let freight = 0
      let ways = []
      for (let i = 0, len = res.result.length; i < len; i++) {
        if (res.result[i].freight != null) {
          res.result[i]['deliveryMethod'] = []
          //显示配送方式
          if (res.result[i].freight.expressFreightSup == 1) {
            res.result[i]['deliveryMethod'].push({
              title: '快递邮寄',
              text: 'isExpress',
              type: 0
            })
          }
          if (res.result[i].freight.cityFreightSup == 1) {
            res.result[i]['deliveryMethod'].push({
              title: '同城配送',
              text: 'isCity',
              type: 1
            })
          }
          if (res.result[i].freight.takeFreightSup == 1) {
            res.result[i]['deliveryMethod'].push({
              title: '预约自提',
              text: 'isShop',
              type: 2
            })
          }

          let deliveryMethodEvery = res.result[i]['deliveryMethod'].some((item) => {
            return item.type + 1 == res.result[i].freight.defaultExpressType
          })
          if (!deliveryMethodEvery && res.result[i]['deliveryMethod'].length != 0) {
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
          isInvoice: 0,
          isAddedValueTax: res.result[i].isAddedValueTax
        }
        //优惠券
        res.result[i]['couponId'] = ''
        //留言
        res.result[i]['message'] = ''
      }
      if (ways.indexOf(1) > -1 && ways.indexOf(2) > -1) {
        this.data.payWay = "在线支付 + 货到付款"
      } else if (ways.indexOf(1) > -1) {
        this.data.payWay = "在线支付"
      } else if (ways.indexOf(2) > -1) {
        this.data.payWay = "货到付款"
      }
      this.setData({
        payWay: this.data.payWay
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
        memberAddressId: res.address == null ? '' : res.address.memberAddressId,
        list: res.result,
        couponPrice: res.couponPrice,
        coupon: res.coupon,
        packetPrice: res.packet.length == 0 ? '0.00' : res.packet[0].actualPrice,
        memberPacketId: res.packet.length == 0 ? '' : res.packet[0].memberPacketId,
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
      let isPayDelivery = this.data.list[i].freight.isPayDelivery
      let cityFreightSup = this.data.list[i].freight.cityFreightSup
      let obj = {
        images: images,
        isPayDelivery: isPayDelivery,
        cityFreightSup: cityFreightSup,
        way: this.data.list[i].way, //支付方式 1在线 2货到
        deliveryMethod: this.data.list[i].distributionType
      }
      array.push(obj)
    }
    this.selectComponent("#payWay").show(array)
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
        this.data.list[i].distributionType = '3'
        this.data.list[i].deliveryMethodType = 1
        // this.data.list[i].deliveryMethod = 'isExpress'
      }
      if (e.detail[i].way == 2) {
        this.data.list[i].distributionType = '1'
        this.data.list[i].deliveryMethodType = 1
      }
    }
    if (ways.indexOf(1) > -1 && ways.indexOf(2) > -1) {
      this.data.payWay = "在线支付 + 货到付款"
    } else if (ways.indexOf(1) > -1) {
      this.data.payWay = "在线支付"
    } else if (ways.indexOf(2) > -1) {
      this.data.payWay = "货到付款"
    }
    this.setData({
      list: this.data.list,
      payWay: this.data.payWay
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
    this.data.list[index].deliveryMethodType = item.type
    if (this.data.list[index].way == 2) {
      return
    }

    //判断配送方式
    if (item.type == 2) {
      //预约自提
      this.data.list[index].distributionType = '2'
      if (this.data.list[index].way == 2) {
        this.data.list[index].way = 1
      }
      //更改支付方式
      let ways = []
      for (let i = 0, len = this.data.list.length; i < len; i++) {
        ways[i] = this.data.list[i].way
      }
      if (ways.indexOf(1) > -1 && ways.indexOf(2) > -1) {
        this.data.payWay = "在线支付 + 货到付款"
      } else if (ways.indexOf(1) > -1) {
        this.data.payWay = "在线支付"
      } else if (ways.indexOf(2) > -1) {
        this.data.payWay = "货到付款"
      }
      this.setData({
        payWay: this.data.payWay
      })
    } else if (item.type == 1) {
      //同城速递
      this.data.list[index].distributionType = '1'
    } else if (item.type == 0) {
      //快递邮寄
      this.data.list[index].distributionType = '3'
    }

    this.calculate()
    this.setData({
      list: this.data.list
    })
  },

  /**
   * 修改自提点
   */
  changeTake(e) {
    let list = this.data.list[e.currentTarget.dataset.index].freight.takeFreightList,
      id = this.data.list[e.currentTarget.dataset.index].freight.takeFreightList[0].takeId,
      parentId = this.data.list[e.currentTarget.dataset.index].freight.storeCityId,
      selectPick = this.data.list[e.currentTarget.dataset.index].freight.takeFreightList[0],
      newobj = {};
    for (let attr in selectPick) {
      newobj[attr] = selectPick[attr];
    }
    this.selectComponent("#self_pick").show(id, list, parentId, newobj)
  },

  /**
   * 确定自提点
   */
  selectPick(e) {
    let selectPick = e.detail
    for (let i = 0, len = this.data.list.length; i < len; i++) {
      if (selectPick.storeId == this.data.list[i].storeId) {
        this.data.list[i]['takeFreight'] = selectPick
        this.data.list[i]['takeFreightId'] = selectPick.takeId
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
    let couponPrice = 0
    for (let i = 0, len = this.data.coupon.length; i < len; i++) {
      if (this.data.coupon[i].select) {
        couponPrice += parseFloat(this.data.coupon[i].actualPrice)
      }
    }
    this.setData({
      couponPrice: couponPrice.toFixed(2)
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
      memberPacketId
    this.data.redpacket = e.detail
    for (let i = 0, len = e.detail.length; i < len; i++) {
      if (e.detail[i].select) {
        price = parseFloat(e.detail[i].actualPrice)
        memberPacketId = e.detail[i].memberPacketId
      } else {
        memberPacketId = ''
      }
    }
    this.setData({
      packetPrice: price,
      memberPacketId: memberPacketId
    })
    this.calculate()
  },

  /**
   * 计算总价
   */
  calculate() {
    let total = 0,
      originTotal = 0,
      freight = 0,
      discountPrice = 0;
    for (let i = 0; i < this.data.list.length; i++) {
      this.data.list[i].totalPrice = 0;
      for (let j = 0; j < this.data.list[i].list.length; j++) {
        this.data.list[i].totalPrice += parseFloat(this.data.list[i].list[j].price) * parseFloat(this.data.list[i].list[j].number)
        discountPrice += parseFloat(this.data.list[i].list[j].discountPrice) * parseFloat(this.data.list[i].list[j].number)
        total += parseFloat(this.data.list[i].list[j].price) * parseFloat(this.data.list[i].list[j].number)
        originTotal += parseFloat(this.data.list[i].list[j].price) * parseFloat(this.data.list[i].list[j].number)
      }
      if (this.data.list[i].distributionType == 1) {
        //同城
        freight += parseFloat(this.data.list[i].freight.cityFreightPrice);
      } else if (this.data.list[i].distributionType == 2) {
        //预约自提
        freight += 0;
      } else if (this.data.list[i].distributionType == 3) {
        //快递邮寄
        freight += parseFloat(this.data.list[i].freight.expressFreightPrice);
      }
    }

    total = total - parseFloat(this.data.couponPrice) - parseFloat(this.data.packetPrice) - parseFloat(discountPrice);
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
      originTotal: originTotal,
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

    let memberPlatformCouponId = ''
    for (let i = 0, len = this.data.list.length; i < len; i++) {
      this.data.list[i]['couponId'] = ''
      //配送是否为空
      if (this.data.list[i].freight.cityFreightMsg != '' && this.data.list[i].distributionType == 1) {
        app.showToast(this.data.list[i].freight.cityFreightMsg)
        break
        return
      }
    }
    for (let i = 0, len = this.data.coupon.length; i < len; i++) {
      //店铺优惠券
      for (let j = 0, j_len = this.data.list.length; j < j_len; j++) {
        if (this.data.coupon[i].storeId == this.data.list[j].storeId && this.data.coupon[i].select) {
          this.data.list[j]['couponId'] = this.data.coupon[i].memberCouponId
        }
      }

      //平台优惠券
      if (this.data.coupon[i].state == "platform") {
        memberPlatformCouponId = this.data.coupon[i].memberCouponId
      } else {
        memberPlatformCouponId = ''
      }
    }

    let storeSet = []
    let totalOrder = 0
    for (let i = 0, len = this.data.list.length; i < len; i++) {
      let store = {
        storeId: this.data.list[i].storeId,
        productsId: '',
        goodsAttr: '',
        quantity: '',
        memberShopCouponId: this.data.list[i].couponId,
        message: this.data.list[i].message,
        distributionType: this.data.list[i].distributionType,
        payType: this.data.list[i].way,
        takeId: this.data.list[i].distributionType == 2 ? this.data.list[i].takeFreightId : '',
        //是否开发票 0不开 1开
        invoiceSet: this.data.list[i].invoice.isInvoice == 1 ? {
          //发票
          account: this.data.list[i].invoice.account, //开户账户
          bank: this.data.list[i].invoice.bank, //开户银行
          //company: this.data.invoice.company,//发票抬头内容
          detailType: this.data.list[i].invoice.detailType, //发票类型
          taxerNumber: this.data.list[i].invoice.taxerNumber, //纳税人识别号
          address: this.data.list[i].invoice.address, //注册地址
          phone: this.data.list[i].invoice.phone, //注册电话
          invoiceType: this.data.list[i].invoice.invoiceType, //发票类型：1电子发票 2普通纸质发票 3增值税纸质发票
          rise: this.data.list[i].invoice.rise, //发票抬头：1个人或事业单位 2企业
          riseName: this.data.list[i].invoice.rise == 1 ? this.data.list[i].invoice.riseName : this.data.list[i].invoice.company, //发票抬头内容（抬头为企业时将公司名称传进来）发票抬头：1个人 2公司
          consigneeName: this.data.list[i].invoice.consigneeName,
          consigneePhone: this.data.list[i].invoice.consigneePhone,
          addressProvince: this.data.list[i].invoice.addressProvince,
          addressCity: this.data.list[i].invoice.addressCity,
          addressArea: this.data.list[i].invoice.addressArea,
          addressStreet: this.data.list[i].invoice.addressStreet,
          addressDetails: this.data.list[i].invoice.addressDetails
        } : null,
      }
      if (this.data.list[i].way == 1) {
        totalOrder += Number(this.data.list[i].totalPrice)
      }
      storeSet.push(store)
    }
    this.setData({
      totalOrder: totalOrder
    })
    http.post(app.globalData.orderConfirm, {
      memberAddressId: this.data.memberAddressId,
      payChannel: 2,
      orderType: 1,
      cutActivityId: null,
      groupActivityid: null,
      usedIntegral: 0,
      memberPacketId: this.data.memberPacketId,
      memberPlatformCouponId: memberPlatformCouponId,
      idSet: this.data.cartId,
      storeSet: storeSet,
      invoiceAttr: 1,
      originType: 2
    }).then(res => {
      event.emit('refreshCart')
      event.emit('clearCart')
      if (this.data.totalOrder == 0) {
        let item = {
          totalPrice: res.result.totalPrice,
          orderType: 1,
          orderAttachId: res.result.orderAttachId,
          distributionId: '',
          outTradeNo: res.result.orderNumber,
        }
        wx.redirectTo({
          url: '/nearbyShops/payResult/payResult?item=' + encodeURIComponent(JSON.stringify(item))
        })
        return
      }
      if (this.data.total == '0.00') {
        app.showSuccessToast('提交成功', () => {
          let item = {
            totalPrice: res.result.totalPrice,
            orderType: this.data.info.goodType,
            orderAttachId: res.result.orderAttachId,
            distributionId: ''
          }
          wx.redirectTo({
            url: '/nearbyShops/payResult/payResult?item=' + encodeURIComponent(JSON.stringify(item))
          })
        })
        return
      }
      let orderInfo = {
        totalPrice: res.result.totalPrice,
        orderNumber: res.result.orderNumber,
        orderType: 1,
        orderAttachNumber: '',
        orderAttachId: res.result.orderAttachId,
        distributionId: '',
        type: 1
      }
      http.post(app.globalData.appletMySaveFormId, {
        microFormId: this.data.formId
      }).then(res => {})
      wx.redirectTo({
        url: '../cashierDesk/cashierDesk?orderInfo=' + JSON.stringify(orderInfo),
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
    this.selectComponent("#popup").show(item.invoice, idx, item.storeId, 0, this.data.address.memberAddressId != undefined ? this.data.address : '')
  },
  /**
   * 确定发票方式
   */
  popupInvoice(e) {
    let item = e.detail
    let data = {
      account: item.account,
      bank: item.bank,
      company: item.company,
      detailType: item.detailType,
      taxerNumber: item.taxerNumber,
      address: item.address,
      phone: item.phone,
      invoiceType: item.invoiceType,
      isInvoice: item.isInvoice,
      rise: item.rise,
      riseName: item.riseName,
      consigneeName: item.consigneeName,
      consigneePhone: item.consigneePhone,
      addressProvince: item.addressProvince,
      addressCity: item.addressCity,
      addressArea: item.addressArea,
      addressStreet: item.addressStreet,
      addressDetails: item.addressDetails
    }
    this.data.list[item.idx].invoice = data
    this.setData({
      list: this.data.list
    })
  },
  createWhether(idx) {
    this.data.list[idx].invoice.addressProvince = this.data.province.areaName
    this.data.list[idx].invoice.addressCity = this.data.city.areaName
    this.data.list[idx].invoice.addressArea = this.data.area.areaName
    this.setData({
      list: this.data.list
    })
  },
  formId(e) {
    this.data.formId = e.detail.formId
  }
})