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
    //商品信息
    info: {},
    //店铺信息
    store: {},
    //商品图片
    goodImage: '',
    //地址
    address: {},
    //买家留言
    message: '',
    //平台优惠券id
    memberPlatformCouponId: '',
    //当前优惠券价格
    couponPrice: '0.00',
    //当前红包价格
    packet: '0.00',
    //红包id
    memberPacketId: '',
    //红包
    redpacket: [],
    //运费
    freightPrice: '0.00',
    //
    takeId: '',
    //
    takeItem: {},
    //支付方式
    payWay: 1,
    //优惠券
    coupon: [],
    invoice: {
      isInvoice: 0 //是否开发票
    },
    deliveryMethod: [],
    deliveryMethodType: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let info = JSON.parse(decodeURIComponent(options.info))
    info.goodsName = decodeURIComponent(info.goodsName)
    info.storeName = decodeURIComponent(info.storeName)
    this.setData({
      diyColor: app.globalData.diyColor,
      configSwitch: app.globalData.configSwitch,
      info: info,
      first: false,
      goodImage: decodeURIComponent(options.goodImage)
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
    if (!this.data.first && (app.globalData.addressSelect.memberAddressId == null || this.data.address.memberAddressId != app.globalData.addressSelect.memberAddressId)) {
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
    http.post(app.globalData.commonConfirmOrder, {
      storeId: this.data.info.storeId,
      price: this.data.info.shopPrice,
      goodsId: this.data.info.goodsId,
      memberAddressId: this.data.memberAddressId,
      number: this.data.info.num,
      productsId: this.data.info.productsId,
      isOriginal: this.data.info.isOriginal
    }).then(res => {

      for (let i = 0; i < res.coupon.length; i++) {
        // res.coupon[i].select = true
      }
      if (res.packet.length != 0) {
        // res.packet[0].select = true
      }
      if (res.freight.length != 0) {
        this.setData({
          deliveryMethod: []
        })
        //显示配送方式
        if (res.freight[0].expressFreightSup == 1) {
          this.data.deliveryMethod.push({
            title: '快递邮寄',
            text: 'isExpress',
            type: 0
          })
        }
        if (res.freight[0].cityFreightSup == 1) {
          this.data.deliveryMethod.push({
            title: '同城配送',
            text: 'isCity',
            type: 1
          })
        }
        if (res.freight[0].takeFreightSup == 1) {
          this.data.deliveryMethod.push({
            title: '预约自提',
            text: 'isShop',
            type: 2
          })
        }
        if (res.freight[0].takeFreightSup == 1) {
          this.data.takeId = res.freight[0].takeFreighList[0].takeId
          this.data.takeItem = res.freight[0].takeFreighList[0]
        }

        let deliveryMethodEvery = this.data.deliveryMethod.some((item) => {
          return item.type + 1 == res.freight[0].defaultExpressType
        })
        if (!deliveryMethodEvery && this.data.deliveryMethod.length != 0) {
          //如果默认配送方式不支持
          switch (this.data.deliveryMethod[0].type) {
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
          this.data.info.deliveryMethod = 3
          this.data.deliveryMethodType = 0
          this.data.payWay = 1
          this.data.freightPrice = res.freight[0].expressFreightPrice
        } else if (res.freight[0].defaultExpressType == 2) {
          this.data.info.deliveryMethod = 1
          this.data.deliveryMethodType = 1
          this.data.freightPrice = res.freight[0].cityFreightPrice
          this.data.payWay = 1
        } else if (res.freight[0].defaultExpressType == 3) {
          this.data.info.deliveryMethod = 2
          this.data.deliveryMethodType = 2
          this.data.freightPrice = 0
          this.data.payWay = 1
        }

        app.globalData.addressSelect.memberAddressId = res.address.memberAddressId ? res.address.memberAddressId : null
        if ((res.address == null || res.address.name == undefined) && this.data.deliveryMethodType != 2) {
          this.selectComponent("#modal").showModal()
        }
      }
      let couponPrice = '0.00';
      if (res.coupon.length) {
        couponPrice = res.couponPrice
        res.coupon.selected;
      }
      let packet = '0.00';
      let memberPacketId = '';
      if (res.packet.length) {
        res.packet[0].select = 1;
        packet = res.packet[0].actualPrice;
        memberPacketId = res.packet[0].memberPacketId;
      }
      this.setData({
        finish: true,
        address: res.address,
        store: res.result,
        coupon: res.coupon,
        couponPrice,
        packet,
        memberPacketId,
        freight: res.freight == null ? null : res.freight[0],
        takeId: this.data.takeId,
        takeItem: this.data.takeItem,
        freightPrice: this.data.freightPrice,
        info: this.data.info,
        goodsAttr: res.result.goodsAttr || '',
        redpacket: res.packet,
        payWay: this.data.payWay,
        discountPrice: res.discountPrice,
        'invoice.isAddedValueTax': res.result.isAddedValueTax,
        deliveryMethod: this.data.deliveryMethod,
        deliveryMethodType: this.data.deliveryMethodType
      })
      this.calcTotal()
    })
  },

  /**
   * 弹出修改窗口
   */
  onChangeNum() {
    this.selectComponent("#change_num").show(this.data.info.num, this.data.info.goodsNumber)
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
    if (this.data.info.goodType == 1) {
      //普通商品
      this.data.info.subtotal = parseFloat(this.data.info.num * this.data.info.shopPrice)
      this.data.info.total = parseFloat(this.data.info.num) * parseFloat(this.data.info.shopPrice) - parseFloat(this.data.couponPrice) - parseFloat(this.data.packet) - (this.data.discountPrice * this.data.info.num) > 0 ? parseFloat(this.data.info.num) * parseFloat(this.data.info.shopPrice) - parseFloat(this.data.couponPrice) - parseFloat(this.data.packet) - (this.data.discountPrice * this.data.info.num) : parseFloat(this.data.freightPrice) > 0 ? 0 : 0.10;
    } else if (this.data.info.goodType == 2) {
      //团购
      this.data.info.subtotal = parseFloat(this.data.info.num * this.data.info.groupPrice) > 0 ? parseFloat(this.data.info.num * this.data.info.groupPrice).toFixed(2) : parseFloat(this.data.freightPrice) > 0 ? 0 : 0.10;
      this.data.info.total = parseFloat(this.data.info.subtotal)
    } else if (this.data.info.goodType == 3) {
      //砍价
      this.data.info.subtotal = parseFloat(this.data.info.num * this.data.info.cutPrice) > 0 ? parseFloat(this.data.info.num * this.data.info.cutPrice).toFixed(2) : parseFloat(this.data.freightPrice) > 0 ? 0 : 0.10;
      this.data.info.total = parseFloat(this.data.info.subtotal)
    } else if (this.data.info.goodType == 4) {
      this.data.info.subtotal = parseFloat(this.data.info.num * this.data.info.timeLimitPrice) > 0 ? parseFloat(this.data.info.num * this.data.info.timeLimitPrice).toFixed(2) : parseFloat(this.data.freightPrice) > 0 ? 0 : 0.10;
      this.data.info.total = parseFloat(this.data.info.subtotal)
    }

    //判断合计是否等于0
    this.data.info.total = (parseFloat(this.data.info['total']) + parseFloat(this.data.freightPrice)).toFixed(2) > 0 ? (parseFloat(this.data.info['total']) + parseFloat(this.data.freightPrice)).toFixed(2) : parseFloat(this.data.freightPrice) + 0.1
    this.setData({
      info: this.data.info
    })
  },

  /**
   * 支付方式
   */
  onPayWay() {
    let array = [],
      images = [this.data.goodImage],
      obj = {
        images: images,
        isPayDelivery: this.data.freight.isPayDelivery,
        cityFreightSup: this.data.freight.cityFreightSup,
        way: this.data.payWay,
        deliveryMethod: this.data.info.deliveryMethod
      }
    array.push(obj)
    this.selectComponent("#payWay").show(array)
  },

  /**
   * 确定支付方式
   */
  confirmWay(e) {
    let deliveryMethod, type
    if (e.detail[0].deliveryMethod == 3 && this.data.deliveryMethodType != 1) {
      deliveryMethod = 0
    } else if (e.detail[0].deliveryMethod == 2 && this.data.deliveryMethodType == 1) {
      deliveryMethod = 2
    } else if (e.detail[0].deliveryMethod == 1 && this.data.deliveryMethodType != 1) {
      deliveryMethod = 1
    }
    setTimeout(() => {
      if (deliveryMethod = 0) {
        type = 3
      } else if (deliveryMethod = 1) {
        type = 1
      } else if (deliveryMethod = 2) {
        type = 2
      }
      this.setData({
        'info.deliveryMethod': type,
        payWay: e.detail[0].way,
        deliveryMethodType: deliveryMethod,
        freightPrice: e.detail[0].way == 2 || this.data.info.deliveryMethod == 1 ? this.data.freight.cityFreightPrice : this.data.freight.expressFreightPrice
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

    if (this.data.payWay == 2) {
      return
    }
    this.setData({
      deliveryMethodType: item.type
    })
    //判断配送方式
    if (item.type == 2) {
      this.data.info.deliveryMethod = 2
      this.setData({
        info: this.data.info,
        freightPrice: 0.00,
      })
    } else if (item.type == 1) {
      //同城速递
      this.data.info.deliveryMethod = 1
      this.setData({
        info: this.data.info,
        freightPrice: this.data.freight.cityFreightPrice
      })
    } else if (item.type == 0) {
      //快递邮寄
      this.data.info.deliveryMethod = 3
      this.setData({
        info: this.data.info,
        freightPrice: this.data.freight.expressFreightPrice
      })
    }

    this.calcTotal()
  },

  /**
   * 同城速递
   */
  onCityWide() {
    this.data.info.deliveryMethod = 1
    this.setData({
      info: this.data.info,
      // payWay: 2,
      freightPrice: this.data.freight.cityFreightPrice
    })
    this.calcTotal()
  },

  /**
   * 预约自提
   */
  onPickup() {
    if (this.data.payWay == 2) {
      return
    }
    this.data.info.deliveryMethod = 2
    this.setData({
      info: this.data.info,
      freightPrice: 0.00,
      // payWay: 1
    })
    this.calcTotal()
  },

  /**
   * 快递邮寄
   */
  onExpress() {
    if (this.data.payWay == 2) {
      return
    }
    this.data.info.deliveryMethod = 3
    this.setData({
      info: this.data.info,
      freightPrice: this.data.freight.expressFreightPrice,
      // payWay: 1
    })
    this.calcTotal()
  },

  /**
   * 修改自提点
   */
  changeTake() {
    let list = this.data.freight.takeFreightList
    if (this.data.takeId == '') {
      this.data.takeId = this.data.freight.takeFreightList[0].takeId
    }
    let parentId = this.data.freight.storeCityId,
      selectPick = this.data.freight.takeFreightList[0],
      newobj = {};
    for (let attr in selectPick) {
      newobj[attr] = selectPick[attr];
    }
    this.selectComponent("#self_pick").show(this.data.takeId, list, parentId, newobj)
  },

  /**
   * 确定自提点
   */
  selectPick(e) {
    let selectPick = e.detail
    this.setData({
      takeItem: selectPick,
      takeId: selectPick.takeId
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
    let storeSet = [],
      memberShopCouponId = '';
    //如果没有地址弹出
    if ((this.data.address == null || this.data.address.name == undefined) && this.data.info.deliveryMethod != 2) {
      this.selectComponent("#modal").showModal()
      return
    }
    if (this.data.freight.expressFreightSup == 0 && this.data.freight.cityFreightSup == 0 && this.data.freight.takeFreightSup == 0 && this.data.freight.cityFreightMsg != '') {
      app.showToast(this.data.freight.cityFreightMsg)
      return
    }
    // for (let i = 0, len = this.data.coupon.length; i < len; i++) {
      // if (this.data.coupon[i].select && this.data.coupon[i].state == "store") {
      //   memberShopCouponId = this.data.coupon[i].memberCouponId
      // }
      // if (this.data.coupon[i].state == "platform" && this.data.coupon[i].select) {
      //   this.data.memberPlatformCouponId = this.data.coupon[i].memberCouponId
      // } else {
      //   this.data.memberPlatformCouponId = ''
      // }
    // }
    let store = {
      storeId: this.data.info.storeId,
      payType: this.data.payWay,
      productsId: this.data.info.productsId,
      goodsAttr: this.data.goodsAttr,
      goodsId: this.data.info.goodsId,
      quantity: this.data.info.num,
      memberShopCouponId: this.data.info.goodType == 1 ? memberShopCouponId : '',
      message: this.data.message,
      distributionType: this.data.info.deliveryMethod,
      takeId: this.data.info.deliveryMethod == 2 ? this.data.takeId : '',
      //是否开发票 0不开 1开
      invoiceSet: this.data.invoice.isInvoice == 1 ? {
        //发票
        account: this.data.invoice.account, //开户账户
        bank: this.data.invoice.bank, //开户银行
        //company: this.data.invoice.company,//发票抬头内容
        detailType: this.data.invoice.detailType, //发票类型
        taxerNumber: this.data.invoice.taxerNumber, //纳税人识别号
        address: this.data.invoice.address, //注册地址
        phone: this.data.invoice.phone, //注册电话
        invoiceType: this.data.invoice.invoiceType, //发票类型：1电子发票 2普通纸质发票 3增值税纸质发票
        rise: this.data.invoice.rise, //发票抬头：1个人或事业单位 2企业
        riseName: this.data.invoice.rise == 1 ? this.data.invoice.riseName : this.data.invoice.company, //发票抬头内容（抬头为企业时将公司名称传进来）发票抬头：1个人 2公司
        consigneeName: this.data.invoice.consigneeName,
        consigneePhone: this.data.invoice.consigneePhone,
        addressProvince: this.data.invoice.addressProvince,
        addressCity: this.data.invoice.addressCity,
        addressArea: this.data.invoice.addressArea,
        addressStreet: this.data.invoice.addressStreet,
        addressDetails: this.data.invoice.addressDetails
      } : null,
    }
    storeSet.push(store);
    const dataJson = {
      memberAddressId: this.data.info.deliveryMethod != 2 ? this.data.address.memberAddressId : '',
      payChannel: 1,
      orderType: this.data.info.goodType,
      cutActivityId: this.data.info.cutActivityId,
      groupActivityId: this.data.info.groupActivityId,
      usedIntegral: 0,
      memberPacketId: this.data.memberPacketId || '',
      memberPlatformCouponId: this.data.memberPlatformCouponId || '',
      idSet: this.data.info.goodsId,
      storeSet: storeSet,
      originType: 2,
    };
    if (this.data.invoice.isInvoice) {
      dataJson.invoiceAttr = 1;
    }
    http.post(app.globalData.orderConfirm, dataJson).then(res => {
      event.emit('refreshBargain', this.data.info.cutActivityId)
      event.emit('refreshBargainDetail')
      if (this.data.info['total'] == 0) {
        app.showSuccessToast('提交成功', () => {
          let item = {
            totalPrice: res.result.totalPrice,
            orderType: this.data.info.goodType,
            orderAttachId: res.result.orderAttachId,
            fxType: this.data.info.fxType,
            outTradeNo: res.result.orderNumber,
          }
          wx.redirectTo({
            url: '/nearbyShops/payResult/payResult?item=' + encodeURIComponent(JSON.stringify(item))
          })
        })
        return
      }
      if (this.data.payWay == 2) {
        app.showSuccessToast('提交成功', () => {
          let item = {
            totalPrice: res.result.totalPrice,
            orderType: this.data.info.goodType,
            fxType: this.data.info.fxType,
            orderAttachId: res.result.orderAttachId,
            distributionId: this.data.info.distributionId,
            outTradeNo: res.result.orderNumber,
          }
          wx.redirectTo({
            url: '/nearbyShops/payResult/payResult?item=' + encodeURIComponent(JSON.stringify(item))
          })
        })
      } else {
        let orderInfo = {
          totalPrice: res.result.totalPrice,
          orderNumber: res.result.orderNumber,
          orderType: this.data.info.goodType,
          orderAttachNumber: '',
          fxType: this.data.info.fxType,
          orderAttachId: res.result.orderAttachId,
          distributionId: this.data.info.distributionId,
          type: 1
        }
        wx.redirectTo({
          url: '../cashierDesk/cashierDesk?orderInfo=' + JSON.stringify(orderInfo),
        })
      }
      http.post(app.globalData.appletMySaveFormId, {
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
    if (e.detail.length) {
      this.data.coupon = e.detail;
      let couponPrice = 0;
      let memberPlatformCouponId = '';
      const target = e.detail.find(({ select }) => (!!select)); 
      if (target) {
        couponPrice = target.actualPrice;
        memberPlatformCouponId = target.memberCouponId;
      }
      this.setData({
        couponPrice,
        memberPlatformCouponId,
      }, this.calcTotal);
    }
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
    if (e.detail.length) {
      let packet = 0;
      let memberPacketId = '';
      const target = e.detail.find(({ select }) => (!!select)); 
      if (target) {
        packet = parseFloat(target.actualPrice);
        memberPacketId = target.memberPacketId;
      }
      this.setData({
        packet,
        memberPacketId,
      }, this.calcTotal)
    }
  },

  /**
   * 发票
   */
  invoice() {
    this.selectComponent("#popup").show(this.data.invoice, 0, this.data.store.storeId, 0, this.data.address.memberAddressId != undefined ? this.data.address : '')
  },
  /**
   * 
   */
  popupInvoice(e) {
    this.setData({
      invoice: e.detail
    })
  },
  createWhether() {
    this.setData({
      'invoice.addressProvince': this.data.province.areaName,
      'invoice.addressCity': this.data.city.areaName,
      'invoice.addressArea': this.data.area.areaName,
    })
  },
  formId(e) {
    this.data.formId = e.detail.formId
  },
  changeAddress(e) {
    this.data.memberAddressId = this.data.address.memberAddressId
    this.getData()
  }
})