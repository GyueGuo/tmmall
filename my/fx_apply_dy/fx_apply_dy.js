const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    sex_text: '请选择性别',
    referrer_id: '',
    name: '',
    sex: '',
    phone: '',
    weChatNo: '',
    sex_arr: ['男', '女'],
    input_address: '',
    idcard: '',
    isSubmit: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('asdfadsf')
    this.setData({
      diy_color: app.globalData.diy_color
    })
    this.getData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 提交申请
   */
  subtap() {
    if (this.data.name == '' && this.data.info.real_name.require == '1') {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return
    }
    if (!app.isPoneAvailable(this.data.phone) && this.data.info.phone.require == '1') {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
      return
    }
    if (this.data.sex == '' && this.data.info.sex.require == '1') {
      wx.showToast({
        title: '请选择性别',
        icon: 'none'
      })
      return
    }
    if (this.data.input_address == '' && this.data.info.address.require == '1') {
      wx.showToast({
        title: '请输入地址',
        icon: 'none'
      })
      return
    }
    let idcard_reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    if (this.data.info.id_card.require == '1' && !idcard_reg.test(this.data.idcard)) {
      wx.showToast({
        title: '请输入身份证号码',
        icon: 'none'
      })
      return
    }
    if (this.data.weChatNo == '' && this.data.info.wechat_no.require == '1') {
      wx.showToast({
        title: '请输入微信号',
        icon: 'none'
      })
      return
    }
    http.post(app.globalData.distribution_become_apply, {
      idCard: this.data.idcard,
      realName: this.data.name,
      sex: this.data.sex,
      phone: this.data.phone,
      wechatNo: this.data.weChatNo,
      address: this.data.input_address
    }).then(res => {
      wx.redirectTo({
        url: '/my/fx_apply_sh/fx_apply_sh',
      })
    })

  },

  /**
   * 姓名
   */
  input_name(e) {
    this.setData({
      name: e.detail.value
    })
    this.verify()
  },
  /**
   * 手机号
   */
  input_phone(e) {
    this.setData({
      phone: e.detail.value
    })
    this.verify()
  },
  /**
   * 性别
   */
  sex(e) {
    this.setData({
      sex_text: this.data.sex_arr[e.detail.value],
      sex: parseInt(e.detail.value) + 1
    })
    this.verify()
  },
  /**
   * 微信号
   */
  wx_code(e) {
    this.setData({
      weChatNo: e.detail.value
    })
    this.verify()
  },
  /**
   * 地址
   */
  input_address(e) {
    this.setData({
      input_address: e.detail.value
    })
    this.verify()
  },
  /**
   * 身份证
   */
  idcard(e) {
    this.setData({
      idcard: e.detail.value
    })
    this.verify()
  },
  /**
   * 获取数据
   */
  getData() {
    http.get(app.globalData.distribution_form_set, {}).then(res => {
      this.setData({
        info: res.data
      })
      console.log(this.data.info)
    })
  },

  /**
   * 验证表单
   */
  verify() {
    if (this.data.name == '' && this.data.info.real_name.require == '1') {
      this.setData({
        isSubmit: false
      })
      return
    }
    if (!app.isPoneAvailable(this.data.phone) && this.data.info.phone.require == '1') {
      this.setData({
        isSubmit: false
      })
      return
    }
    if (this.data.sex == '' && this.data.info.sex.require == '1') {
      this.setData({
        isSubmit: false
      })
      return
    }
    if (this.data.input_address == '' && this.data.info.address.require == '1') {
      this.setData({
        isSubmit: false
      })
      return
    }
    if (this.data.idcard == '' && this.data.info.id_card.require == '1') {
      this.setData({
        isSubmit: false
      })
      return
    }
    if (this.data.weChatNo == '' && this.data.info.wechat_no.require == '1') {
      this.setData({
        isSubmit: false
      })
      return
    }
    this.setData({
      isSubmit: true
    })
  },

  
})