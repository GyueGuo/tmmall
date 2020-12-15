const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    id: '',
    result: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color
    })
    this.data.id = options.id
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
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
   * 获取数据
   */
  getData() {
    http.post(app.globalData.integral_conversion, {
      integralId: this.data.id
    }).then(res => {
      this.setData({
        finish: true,
        address: res.address,
        result: res.result
      })
      if (res.address == null) {
        this.selectComponent("#modal").showModal()
      }
    })
  },

  /**
   * 选择地址
   */
  chooseAddress() {
    wx.navigateTo({
      url: '../address/address?choose=1',
    })
  },

  /**
   * 确认兑换
   */
  confirm() {
    if (this.data.address == null) {
      this.selectComponent("#modal").showModal()
      return
    }
    if (Number(this.data.result.price) > 0) {
      http.post(app.globalData.integral_preOrder, {
        integralId: this.data.id,
        number: 1,
        province: this.data.address.province,
        city: this.data.address.city,
        area: this.data.address.area,
        street: this.data.address.street,
        address: this.data.address.address,
        lat: this.data.address.lat,
        lng: this.data.address.lng,
        name: this.data.address.name,
        phone: this.data.address.phone,
        from: '2'
      }).then(res => {
        let data = {
          total_price: this.data.result.price,
          address: this.data.address,
          id: this.data.id,
          order_number: res.data.orderNumber
        }
        wx.redirectTo({
          url: `/pages/integral_cashier_desk/integral_cashier_desk?data=${JSON.stringify(data)}`,
        })
      })
    } else {
      http.encPost(app.globalData.integral_confirm, {
        integralId: this.data.id,
        number: 1,
        province: this.data.address.province,
        city: this.data.address.city,
        area: this.data.address.area,
        street: this.data.address.street,
        address: this.data.address.address,
        lat: this.data.address.lat,
        lng: this.data.address.lng,
        name: this.data.address.name,
        phone: this.data.address.phone,
        from: 2
      }).then(res => {
        event.emit('refreshIntegral')
        app.showSuccessToast(res.message, () => {
          wx.redirectTo({
            url: '/my/integral_record/integral_record',
          })
        })
      })
    }

  }
})