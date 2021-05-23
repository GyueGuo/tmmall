const app = getApp();
import http from '../../utils/http';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    invoice: {
      type: Object,
      observer: function() {
        this.setData({
          addressProvince: this.data.invoice.addressProvince ? this.data.invoice.addressProvince : '',
          addressCity: this.data.invoice.addressCity ? this.data.invoice.addressCity : '',
          addressArea: this.data.invoice.addressArea ? this.data.invoice.addressArea : '',
        })
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    opacity: 0,
    //发票类型
    invoiceCon: [{
      name: '普通发票',
      type: '0'
    }, {
      name: '增值税专用发票',
      type: '1'
    }],
    invoiceType: '0', //发票类型下标
    //发票抬头
    riseCon: [{
      name: '个人',
      type: '1'
    }, {
      name: '公司',
      type: '2'
    }],
    rise: '1',
    //发票内容
    detailCon: [{
      name: '商品明细',
      type: '0'
    }],
    detailType: '0', //发票内容下标
    addressProvince: '',
    addressCity: '',
    addressArea: '',
    addressStreet: '',
    isHistory: true, //是否隐藏历史
    adjustPosition: false
  },
  ready() {
    this.setData({
      diyColor: app.globalData.diyColor
    })

  },

  /**
   * 组件的方法列表
   */
  methods: {
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
        animationCoupon: animation.step(),
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
        animationCoupon: animation.step(),
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
     * 显示
     */
    show(data, idx, storeId, iTypa = 0, address = '') {
      let obj = null

      if (data != undefined && data.isInvoice == 1) {
        obj = {
          detailType: data.detailType,
          invoiceType: data.invoiceType,
          rise: data.rise,
          riseName: data.riseName,
          idx: idx,
          storeId: storeId,
          isInvoice: data.isInvoice,
          isAddedValueTax: data.isAddedValueTax,
          iTypa: iTypa,
          invoiceId: data.invoiceId ? data.invoiceId : ''
        }
      } else {
        obj = {
          detailType: 0,
          invoiceType: 0,
          rise: 1,
          riseName: null,
          idx: idx,
          storeId: storeId,
          isInvoice: data.isInvoice,
          isAddedValueTax: data.isAddedValueTax,
          iTypa: iTypa,
          invoiceId: data.invoiceId ? data.invoiceId : ''
        }
      }
      if (address != '' && this.data.addressArea == '') {
        obj.addressProvince = address.province
        obj.addressCity = address.city
        obj.addressArea = address.area
        obj.addressDetails = address.address
      }
      this.setData(obj)
      this.showAnimation()
      this.getRiseHistory()
    },

    /**
     * 关闭
     */
    close() {
      this.hiddenAnimation()
      if (this.data.isInvoice == 0) {
        this.setData({
          invoiceType: 0,
          rise: 1,
          riseCon: [{
            name: '个人',
            type: '1'
          }, {
            name: '公司',
            type: '2'
          }]
        })
      }
    },

    /**
     * 选择发票类型
     */
    invoiceClick(e) {
      let type = e.currentTarget.dataset.type
      console.log(type)
      this.setData({
        invoiceType: type
      })
      if (type == 1) {
        this.setData({
          riseCon: [{
            name: '公司',
            type: '2'
          }],
          rise: '2',
        })
      } else {
        this.setData({
          riseCon: [{
            name: '个人',
            type: '1'
          }, {
            name: '公司',
            type: '2'
          }]
        })
      }
    },
    /**
     * 选择发票抬头
     */
    riseClick(e) {
      let type = e.currentTarget.dataset.type
      this.setData({
        rise: type
      })
    },
    /**
     * 选择发票内容
     */
    detailClick(e) {
      let type = e.currentTarget.dataset.type
      this.setData({
        detailType: type
      })
    },
    /**
     * 个人发票抬头
     */
    riseName(e) {
      let val = e.detail.value
      this.setData({
        riseName: val
      })
    },
    /**
     * 企业名称
     */
    company(e) {
      let val = e.detail.value
      this.setData({
        company: val
      })
    },
    /**
     * 纳税人识别号
     */
    taxerNumber(e) {
      let val = e.detail.value
      this.setData({
        taxerNumber: val
      })
    },
    /**
     * 注册地址
     */
    address(e) {
      let val = e.detail.value
      this.setData({
        address: val
      })
    },
    /**
     * 注册电话
     */
    phone(e) {
      let val = e.detail.value
      this.setData({
        phone: val
      })
    },
    /**
     * 开户银行
     */
    bank(e) {
      let val = e.detail.value
      this.setData({
        bank: val
      })
    },
    /**
     * 银行账户
     */
    account(e) {
      let val = e.detail.value
      this.setData({
        account: val
      })
    },
    /**
     * 收票人姓名
     */
    consigneeName(e) {
      let val = e.detail.value
      this.setData({
        consigneeName: val
      })
    },
    /**
     * 收票人手机
     */
    consigneePhone(e) {
      console.log(e)
      let val = e.detail.value
      this.setData({
        consigneePhone: val
      })
    },
    /**
     * 详细地址
     */
    addressDetails(e) {
      console.log(e)
      let val = e.detail.value
      this.setData({
        addressDetails: val
      })
    },
    /**
     * 所在地区
     */
    addressInfo() {
      wx.navigateTo({
        url: '/my/merchantRegion/merchantRegion?popupIdx=' + this.data.idx,
      })
    },

    /**
     * 确定
     */
    submit() {
      if (this.data.invoiceType == 0 && this.data.rise == 1 && (this.data.riseName == '' || this.data.riseName == undefined)) {
        app.showToast('请填写抬头名称', res => {})
        return
      }
      if ((this.data.invoiceType == 0 || this.data.invoiceType == 1) && this.data.rise == 2 && (this.data.company == '' || this.data.company == undefined)) {
        app.showToast('请填写企业名称', res => {})
        return
      }
      if ((this.data.invoiceType == 0 || this.data.invoiceType == 1) && this.data.rise == 2 && (this.data.taxerNumber == '' || this.data.taxerNumber == undefined)) {
        app.showToast('请填写纳税人识别码', res => {})
        return
      }
      if (this.data.invoiceType == 1 && this.data.rise == 2 && (this.data.address == '' || this.data.address == undefined)) {
        app.showToast('请填写注册地址', res => {})
        return
      }
      if (this.data.invoiceType == 1 && this.data.rise == 2 && (this.data.phone == '' || this.data.phone == undefined)) {
        app.showToast('请填写注册地址', res => {})
        return
      }
      if (this.data.invoiceType == 1 && this.data.rise == 2 && (this.data.bank == '' || this.data.bank == undefined)) {
        app.showToast('请填写开户银行', res => {})
        return
      }
      if (this.data.invoiceType == 1 && this.data.rise == 2 && (this.data.account == '' || this.data.account == undefined)) {
        app.showToast('请填写银行账号', res => {})
        return
      }
      if (this.data.consigneeName == '' || this.data.consigneeName == undefined) {
        app.showToast('请输入收票人姓名', res => {})
        return
      }
      if (!this.data.consigneePhone) {
        app.showToast('请输入收票人手机', res => {})
        return
      }
      if (!app.isPoneAvailable(this.data.consigneePhone)) {
        app.showToast('请输入正确的收票人手机', res => {})
        return
      }
      if (this.data.addressArea == '' || this.data.addressArea == undefined) {
        app.showToast('请输入所在地区', res => {})
        return
      }
      if (this.data.addressDetails == '' || this.data.addressDetails == undefined) {
        app.showToast('请输入详细地址', res => {})
        return
      }

      // if (this.data.invoiceType == 1 && this.data.rise == 2 && (this.data.consigneeName == '' || this.data.consigneeName == undefined)) {
      //   app.showToast('请输入收票人姓名', res => { })
      //   return
      // }
      // if (this.data.invoiceType == 1 && this.data.rise == 2 && !app.isPoneAvailable(this.data.consigneePhone)) {
      //   app.showToast('请输入收票人手机', res => { })
      //   return
      // }
      // if (this.data.invoiceType == 1 && this.data.rise == 2 && (this.data.addressArea == '' || this.data.addressArea == undefined)) {
      //   app.showToast('请输入所在地区', res => { })
      //   return
      // }
      // if (this.data.invoiceType == 1 && this.data.rise == 2 && (this.data.addressDetails == '' || this.data.addressDetails == undefined)) {
      //   app.showToast('请输入详细地址', res => { })
      //   return
      // }
      let data = {
        invoiceType: this.data.invoiceType, //发票类型：0普通发票 1增值税发票
        rise: this.data.rise, //发票抬头：1个人 2公司
        riseName: this.data.rise == 1 ? this.data.riseName : '', //发票抬头内容[单位名称]
        detailType: this.data.detailType, //发票内容明细类型：0商品明细
        company: this.data.rise == 2 ? this.data.company : '', //发票抬头内容[单位名称]
        taxerNumber: this.data.rise == 2 ? this.data.taxerNumber : '', //纳税人识别号[针对公司]
        address: this.data.rise == 2 ? this.data.address : '', //注册地址
        phone: this.data.rise == 2 ? this.data.phone : '', //注册电话
        bank: this.data.rise == 2 ? this.data.bank : '', //开户银行
        account: this.data.rise == 2 ? this.data.account : '', //开户账户
        isInvoice: '1', //是否开发票 0不开 1开
        idx: this.data.idx, //店铺下标
        consigneeName: this.data.consigneeName, //收货人姓名
        consigneePhone: this.data.consigneePhone, //收货人联系方式
        addressProvince: this.data.addressProvince, //省
        addressCity: this.data.addressCity, //市
        addressArea: this.data.addressArea, //区
        addressStreet: this.data.addressStreet, //街道
        addressDetails: this.data.addressDetails, //详细地址

        // consigneeName: this.data.invoiceType == 1 ? this.data.consigneeName : '', //收货人姓名
        // consigneePhone: this.data.invoiceType == 1 ? this.data.consigneePhone : '', //收货人联系方式
        // addressProvince: this.data.invoiceType == 1 ? this.data.addressProvince : '', //省
        // addressCity: this.data.invoiceType == 1 ? this.data.addressCity : '', //市
        // addressArea: this.data.invoiceType == 1 ? this.data.addressArea : '', //区
        // addressStreet: this.data.invoiceType == 1 ? this.data.addressStreet : '', //街道
        // addressDetails: this.data.invoiceType == 1 ? this.data.addressDetails : '', //详细地址
      }
      this.close()

      if (this.data.iTypa == 0) {
        this.triggerEvent("confirmWay", data)
      } else if (this.data.iTypa == 1) {
        let obj1 = {
          //发票
          account: this.data.account ? this.data.account : '', //开户账户
          bank: this.data.bank ? this.data.bank : '', //开户银行
          detailType: this.data.detailType, //发票类型
          taxerNumber: this.data.taxerNumber ? this.data.taxerNumber : '', //纳税人识别号
          address: this.data.address ? this.data.address : '', //注册地址
          phone: this.data.phone ? this.data.phone : '', //注册电话
          invoiceType: this.data.invoiceType, //发票类型：1电子发票 2普通纸质发票 3增值税纸质发票
          rise: this.data.rise, //发票抬头：1个人或事业单位 2企业
          riseName: this.data.rise == 1 ? this.data.riseName : this.data.company, //发票抬头内容（抬头为企业时将公司名称传进来）发票抬头：1个人 2公司
          consigneeName: this.data.consigneeName ? this.data.consigneeName : '',
          consigneePhone: this.data.consigneePhone ? this.data.consigneePhone : '',
          addressProvince: this.data.addressProvince ? this.data.addressProvince : '',
          addressCity: this.data.addressCity ? this.data.addressCity : '',
          addressArea: this.data.addressArea ? this.data.addressArea : '',
          addressStreet: this.data.addressStreet ? this.data.addressStreet : '',
          addressDetails: this.data.addressDetails ? this.data.addressDetails : '',
          invoiceId: this.data.invoiceId
        }
        http.post(app.globalData.invoiceExplainEditInvoice, obj1).then(res => {
          this.triggerEvent("refresh", data)
        })
      }
    },
    /**
     * 不开发票
     */
    cancel() {
      let data = {
        isInvoice: '0',
        idx: this.data.idx
      }
      this.setData({
        invoiceType: 0,
        rise: 1,
        riseCon: [{
          name: '个人',
          type: '1'
        }, {
          name: '公司',
          type: '2'
        }]
      })
      this.close()
      this.triggerEvent("confirmWay", data)
    },
    /**
     * 显示历史记录
     */
    historyShow() {
      this.setData({
        isHistory: false
      })
    },
    /**
     * 隐藏历史记录
     */
    historyClose() {
      // setTimeout(()=>{
      //   this.setData({
      //     isHistory: true
      //   })
      // },300)
      this.setData({
        isHistory: true
      })
    },
    /**
     * 历史提交数据
     */
    getRiseHistory() {
      http.post(app.globalData.distributionGetRiseHistory, {}).then(res => {
        this.setData({
          riseHistory: res.data
        })
      })
    },
    /**
     * 选择历史数据
     */
    onHistory(e) {
      console.log(e.currentTarget.dataset.item)
      let data = e.currentTarget.dataset
      let obj = {}
      if (data.type == 'personal') { //普通个人发票
        obj = {
          riseName: data.item.riseName
        }
      } else if (data.type == 'company') { //普通公司发票
        obj = {
          company: data.item.riseName,
          taxerNumber: data.item.taxerNumber
        }
      } else if (data.type == 'tax') { //增值发票
        obj = {
          company: data.item.riseName,
          taxerNumber: data.item.taxerNumber,
          account: data.item.account,
          bank: data.item.bank,
          address: data.item.address,
          phone: data.item.phone
        }
      }
      obj.isHistory = true
      this.setData(obj)
      return
      // let data = {
      //   riseName: this.data.rise == 1 ? this.data.riseName : '', //发票抬头内容[单位名称]
      //   company: this.data.rise == 2 ? this.data.company : '', //发票抬头内容[单位名称]
      //   taxerNumber: this.data.rise == 2 ? this.data.taxerNumber : '', //纳税人识别号[针对公司]
      //   address: this.data.rise == 2 ? this.data.address : '', //注册地址
      //   phone: this.data.rise == 2 ? this.data.phone : '', //注册电话
      //   bank: this.data.rise == 2 ? this.data.bank : '', //开户银行
      //   account: this.data.rise == 2 ? this.data.account : '', //开户账户
      // }
    }
  }
})