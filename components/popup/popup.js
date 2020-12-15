const app = getApp();
const http = require('../../utils/http.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    invoice: {
      type: Object,
      observer: function() {
        this.setData({
          address_province: this.data.invoice.address_province ? this.data.invoice.address_province : '',
          address_city: this.data.invoice.address_city ? this.data.invoice.address_city : '',
          address_area: this.data.invoice.address_area ? this.data.invoice.address_area : '',
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
    invoice_con: [{
      name: '普通发票',
      type: '0'
    }, {
      name: '增值税专用发票',
      type: '1'
    }],
    invoice_type: '0', //发票类型下标
    //发票抬头
    rise_con: [{
      name: '个人',
      type: '1'
    }, {
      name: '公司',
      type: '2'
    }],
    rise: '1',
    //发票内容
    detail_con: [{
      name: '商品明细',
      type: '0'
    }],
    detail_type: '0', //发票内容下标
    address_province: '',
    address_city: '',
    address_area: '',
    address_street: '',
    isHistory: true, //是否隐藏历史
    adjust_position: false
  },
  ready() {
    this.setData({
      diy_color: app.globalData.diy_color
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
        animation_coupon: animation.step(),
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
        animation_coupon: animation.step(),
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
    show(data, idx, store_id, i_typa = 0, address = '') {
      let obj = null

      if (data != undefined && data.is_invoice == 1) {
        obj = {
          detail_type: data.detail_type,
          invoice_type: data.invoice_type,
          rise: data.rise,
          rise_name: data.rise_name,
          idx: idx,
          store_id: store_id,
          is_invoice: data.is_invoice,
          is_added_value_tax: data.is_added_value_tax,
          i_typa: i_typa,
          invoice_id: data.invoice_id ? data.invoice_id : ''
        }
      } else {
        obj = {
          detail_type: 0,
          invoice_type: 0,
          rise: 1,
          rise_name: null,
          idx: idx,
          store_id: store_id,
          is_invoice: data.is_invoice,
          is_added_value_tax: data.is_added_value_tax,
          i_typa: i_typa,
          invoice_id: data.invoice_id ? data.invoice_id : ''
        }
      }
      if (address != '' && this.data.address_area == '') {
        obj.address_province = address.province
        obj.address_city = address.city
        obj.address_area = address.area
        obj.address_details = address.address
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
      if (this.data.is_invoice == 0) {
        this.setData({
          invoice_type: 0,
          rise: 1,
          rise_con: [{
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
        invoice_type: type
      })
      if (type == 1) {
        this.setData({
          rise_con: [{
            name: '公司',
            type: '2'
          }],
          rise: '2',
        })
      } else {
        this.setData({
          rise_con: [{
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
        detail_type: type
      })
    },
    /**
     * 个人发票抬头
     */
    rise_name(e) {
      let val = e.detail.value
      this.setData({
        rise_name: val
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
    taxer_number(e) {
      let val = e.detail.value
      this.setData({
        taxer_number: val
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
    consignee_name(e) {
      let val = e.detail.value
      this.setData({
        consignee_name: val
      })
    },
    /**
     * 收票人手机
     */
    consignee_phone(e) {
      console.log(e)
      let val = e.detail.value
      this.setData({
        consignee_phone: val
      })
    },
    /**
     * 详细地址
     */
    address_details(e) {
      console.log(e)
      let val = e.detail.value
      this.setData({
        address_details: val
      })
    },
    /**
     * 所在地区
     */
    address_info() {
      wx.navigateTo({
        url: '/my/merchant_region/merchant_region?popupIdx=' + this.data.idx,
      })
    },

    /**
     * 确定
     */
    submit() {
      if (this.data.invoice_type == 0 && this.data.rise == 1 && (this.data.rise_name == '' || this.data.rise_name == undefined)) {
        app.showToast('请填写抬头名称', res => {})
        return
      }
      if ((this.data.invoice_type == 0 || this.data.invoice_type == 1) && this.data.rise == 2 && (this.data.company == '' || this.data.company == undefined)) {
        app.showToast('请填写企业名称', res => {})
        return
      }
      if ((this.data.invoice_type == 0 || this.data.invoice_type == 1) && this.data.rise == 2 && (this.data.taxer_number == '' || this.data.taxer_number == undefined)) {
        app.showToast('请填写纳税人识别码', res => {})
        return
      }
      if (this.data.invoice_type == 1 && this.data.rise == 2 && (this.data.address == '' || this.data.address == undefined)) {
        app.showToast('请填写注册地址', res => {})
        return
      }
      if (this.data.invoice_type == 1 && this.data.rise == 2 && (this.data.phone == '' || this.data.phone == undefined)) {
        app.showToast('请填写注册地址', res => {})
        return
      }
      if (this.data.invoice_type == 1 && this.data.rise == 2 && (this.data.bank == '' || this.data.bank == undefined)) {
        app.showToast('请填写开户银行', res => {})
        return
      }
      if (this.data.invoice_type == 1 && this.data.rise == 2 && (this.data.account == '' || this.data.account == undefined)) {
        app.showToast('请填写银行账号', res => {})
        return
      }
      if (this.data.consignee_name == '' || this.data.consignee_name == undefined) {
        app.showToast('请输入收票人姓名', res => {})
        return
      }
      if (!app.isPoneAvailable(this.data.consignee_phone)) {
        app.showToast('请输入收票人手机', res => {})
        return
      }
      if (this.data.address_area == '' || this.data.address_area == undefined) {
        app.showToast('请输入所在地区', res => {})
        return
      }
      if (this.data.address_details == '' || this.data.address_details == undefined) {
        app.showToast('请输入详细地址', res => {})
        return
      }

      // if (this.data.invoice_type == 1 && this.data.rise == 2 && (this.data.consignee_name == '' || this.data.consignee_name == undefined)) {
      //   app.showToast('请输入收票人姓名', res => { })
      //   return
      // }
      // if (this.data.invoice_type == 1 && this.data.rise == 2 && !app.isPoneAvailable(this.data.consignee_phone)) {
      //   app.showToast('请输入收票人手机', res => { })
      //   return
      // }
      // if (this.data.invoice_type == 1 && this.data.rise == 2 && (this.data.address_area == '' || this.data.address_area == undefined)) {
      //   app.showToast('请输入所在地区', res => { })
      //   return
      // }
      // if (this.data.invoice_type == 1 && this.data.rise == 2 && (this.data.address_details == '' || this.data.address_details == undefined)) {
      //   app.showToast('请输入详细地址', res => { })
      //   return
      // }
      let data = {
        invoice_type: this.data.invoice_type, //发票类型：0普通发票 1增值税发票
        rise: this.data.rise, //发票抬头：1个人 2公司
        rise_name: this.data.rise == 1 ? this.data.rise_name : '', //发票抬头内容[单位名称]
        detail_type: this.data.detail_type, //发票内容明细类型：0商品明细
        company: this.data.rise == 2 ? this.data.company : '', //发票抬头内容[单位名称]
        taxer_number: this.data.rise == 2 ? this.data.taxer_number : '', //纳税人识别号[针对公司]
        address: this.data.rise == 2 ? this.data.address : '', //注册地址
        phone: this.data.rise == 2 ? this.data.phone : '', //注册电话
        bank: this.data.rise == 2 ? this.data.bank : '', //开户银行
        account: this.data.rise == 2 ? this.data.account : '', //开户账户
        is_invoice: '1', //是否开发票 0不开 1开
        idx: this.data.idx, //店铺下标
        consignee_name: this.data.consignee_name, //收货人姓名
        consignee_phone: this.data.consignee_phone, //收货人联系方式
        address_province: this.data.address_province, //省
        address_city: this.data.address_city, //市
        address_area: this.data.address_area, //区
        address_street: this.data.address_street, //街道
        address_details: this.data.address_details, //详细地址

        // consignee_name: this.data.invoice_type == 1 ? this.data.consignee_name : '', //收货人姓名
        // consignee_phone: this.data.invoice_type == 1 ? this.data.consignee_phone : '', //收货人联系方式
        // address_province: this.data.invoice_type == 1 ? this.data.address_province : '', //省
        // address_city: this.data.invoice_type == 1 ? this.data.address_city : '', //市
        // address_area: this.data.invoice_type == 1 ? this.data.address_area : '', //区
        // address_street: this.data.invoice_type == 1 ? this.data.address_street : '', //街道
        // address_details: this.data.invoice_type == 1 ? this.data.address_details : '', //详细地址
      }
      this.close()

      if (this.data.i_typa == 0) {
        this.triggerEvent("confirmWay", data)
      } else if (this.data.i_typa == 1) {
        let obj1 = {
          //发票
          account: this.data.account ? this.data.account : '', //开户账户
          bank: this.data.bank ? this.data.bank : '', //开户银行
          detailType: this.data.detail_type, //发票类型
          taxerNumber: this.data.taxer_number ? this.data.taxer_number : '', //纳税人识别号
          address: this.data.address ? this.data.address : '', //注册地址
          phone: this.data.phone ? this.data.phone : '', //注册电话
          invoiceType: this.data.invoice_type, //发票类型：1电子发票 2普通纸质发票 3增值税纸质发票
          rise: this.data.rise, //发票抬头：1个人或事业单位 2企业
          riseName: this.data.rise == 1 ? this.data.rise_name : this.data.company, //发票抬头内容（抬头为企业时将公司名称传进来）发票抬头：1个人 2公司
          consigneeName: this.data.consignee_name ? this.data.consigneeName : '',
          consigneePhone: this.data.consignee_phone ? this.data.consigneePhone : '',
          addressProvince: this.data.address_province ? this.data.addressProvince : '',
          addressCity: this.data.address_city ? this.data.address_city : '',
          addressArea: this.data.address_area ? this.data.address_area : '',
          addressStreet: this.data.address_street ? this.data.addressStreet : '',
          addressDetails: this.data.address_details ? this.data.addressDetails : '',
          invoiceId: this.data.invoice_id
        }
        http.post(app.globalData.invoice_explain_editInvoice, obj1).then(res => {
          this.triggerEvent("refresh", data)
        })
      }
    },
    /**
     * 不开发票
     */
    cancel() {
      let data = {
        is_invoice: '0',
        idx: this.data.idx
      }
      this.setData({
        invoice_type: 0,
        rise: 1,
        rise_con: [{
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
      http.post(app.globalData.distribution_getRiseHistory, {}).then(res => {
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
          rise_name: data.item.rise_name
        }
      } else if (data.type == 'company') { //普通公司发票
        obj = {
          company: data.item.rise_name,
          taxer_number: data.item.taxer_number
        }
      } else if (data.type == 'tax') { //增值发票
        obj = {
          company: data.item.rise_name,
          taxer_number: data.item.taxer_number,
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
      //   rise_name: this.data.rise == 1 ? this.data.rise_name : '', //发票抬头内容[单位名称]
      //   company: this.data.rise == 2 ? this.data.company : '', //发票抬头内容[单位名称]
      //   taxer_number: this.data.rise == 2 ? this.data.taxer_number : '', //纳税人识别号[针对公司]
      //   address: this.data.rise == 2 ? this.data.address : '', //注册地址
      //   phone: this.data.rise == 2 ? this.data.phone : '', //注册电话
      //   bank: this.data.rise == 2 ? this.data.bank : '', //开户银行
      //   account: this.data.rise == 2 ? this.data.account : '', //开户账户
      // }
    }
  }
})