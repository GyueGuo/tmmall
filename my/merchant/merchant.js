const app = getApp();
import http from '../../utils/http';
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
let qqmapsdk = new QQMapWX({
  key: app.globalData.MapKey
});
let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
let re = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryId: '',
    category: '请选择主营类目',
    province: [],
    city: [],
    area: [],
    name: '',
    address: '',
    create: false,
    phone: '',
    formId: [],
    pswInput: '',
    isSubmit: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      configSwitch: app.globalData.configSwitch,
      phone: app.globalData.phone
    })
    this.setData({
      show: app.globalData.configSwitch.versionInfo.oneMore == 0 && app.globalData.configSwitch ? false : true
    })
    wx.setNavigationBarTitle({
      title: app.globalData.configSwitch.versionInfo.oneMore == 0 && app.globalData.configSwitch ? '' : '创建店铺',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // this.location()
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
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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
   * 正则验证
   */
  bindblur(e) {
    let val = e.detail.value
    if (!reg.test(val)) {
      wx.showToast({
        title: '只允许输入字母数字汉字',
        icon: 'none',
        mask: true,
        duration: 2000
      })
    }
  },

  /**
   * 店铺名称
   */
  nameInput(e) {
    this.data.name = e.detail.value.replace(/ /g, '')
    this.createWhether()
  },

  /**
   * 详细地址
   */
  addressInput(e) {
    this.data.address = e.detail.value.replace(/ /g, '')
    this.createWhether()
  },

  /**
   * 选择主营类目
   */
  onCategory() {
    wx.navigateTo({
      url: '../merchantCategory/merchantCategory',
    })
  },

  /**
   * 选择所在地区
   */
  onArea() {
    let obj
    if (this.data.area.length != 0) {
      obj = {
        province: this.data.province,
        city: this.data.city,
        area: this.data.area,
      }
    }
    wx.navigateTo({
      url: this.data.area.length == 0 ? '../merchantRegion/merchantRegion' : '../merchantRegion/merchantRegion?data=' + JSON.stringify(obj),
    })
  },
  /**
   * 店铺密码
   */
  pswInput(e) {
    this.setData({
      pswInput: e.detail.value
    })
  },

  /**
   * 检验是否可以创建
   */
  createWhether() {
    if (this.data.categoryId != '' && this.data.area.areaName != undefined && this.data.name != '' && this.data.address != '' && reg.test(this.data.address)) {
      this.setData({
        create: true
      })
    } else {
      this.setData({
        create: false
      })
    }
  },

  /**
   * 创建店铺
   */
  createShop(e) {
    if (!this.data.isSubmit) {
      return
    }
    this.setData({
      isSubmit: false
    })
    setTimeout(() => {
      this.setData({
        isSubmit: true
      })
    }, 5000)
    this.data.formId.push(e.detail.formId)
    if (this.data.name == '') {
      wx.showToast({
        title: '请输入店铺名称',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      return
    }
    if (!reg.test(this.data.name)) {
      wx.showToast({
        title: '只允许输入字母数字汉字',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      return
    }
    if (this.data.categoryId == '') {
      wx.showToast({
        title: '请选择主营类目',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      return
    }
    if (this.data.area.length == 0) {
      wx.showToast({
        title: '请选择所在地区',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      return
    }
    if (this.data.address == '') {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      return
    }
    if (!reg.test(this.data.address)) {
      wx.showToast({
        title: '只允许输入字母数字汉字',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      return
    }
    if (this.data.pswInput != '' && !re.test(this.data.pswInput)) {
      wx.showToast({
        title: '请输入6位-20位字母数字组合密码',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      return
    }
    if (this.data.pswInput == '' && this.data.info.passwordState == 0) {
      wx.showToast({
        title: '请输入店铺密码',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      return
    }
    http.post(app.globalData.appletMySaveFormId, {
      microFormId: this.data.formId.join()
    }).then(res => {})
    if (this.data.create) {
      http.post(app.globalData.createStore, {
        storeName: this.data.name,
        category: this.data.categoryId,
        province: this.data.province.areaName,
        city: this.data.city.areaName,
        area: this.data.area.areaName,
        address: this.data.address,
        phone: this.data.phone,
        shop: '1',
        password: this.data.pswInput
      }).then(res => {
        app.showSuccessToast(res.message, () => {
          wx.navigateBack()
        })
      })
    }
  },
  saveFormId1(e) {
    this.data.formId.push(e.detail.formId)
  },

  /**
   * web页
   */
  onWeb(e) {
    if (e.currentTarget.dataset.id == 1) {
      wx.navigateTo({
        url: '/my/webView/webView?id=34',
      })
    } else {
      wx.navigateTo({
        url: '/my/webView/webView?id=35',
      })
    }
  },
  /**
   * 定位
   */
  location() {
    qqmapsdk.reverseGeocoder({
      success: res => {
        console.log(res)
        let data = res.result
        this.setData({
          province: {
            areaName: data.addressComponent.province
          },
          city: {
            areaName: data.addressComponent.city
          },
          area: {
            areaName: data.addressComponent.district
          }
        })
      }
    })
  },
  /**
   * 平台电话
   */
  callPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.configSwitch.appInfo.contact,
    })
  },
  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.safety, {}).then(res => {
      this.setData({
        info: res.result
      })
    })
  },
})