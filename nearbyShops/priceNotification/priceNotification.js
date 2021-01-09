const app = getApp();
import http from '../../utils/http';
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsId: '',
    price: '',
    expectPrice: '',
    storeId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      price: options.price,
      goodsId: options.goodsId,
      storeId: options.storeId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
   * 监听输入
   */
  priceInput(e) {
    if (e.detail.value == '.') {
      this.setData({
        expectPrice: '0.'
      })
    }
    this.data.expectPrice = e.detail.value
  },

  /**
   * 确定
   */
  submit() {
    let re = /^[0-9]+([.][0-9]+){0,1}$/
    if (!re.test(this.data.expectPrice)) {
      app.showToast('请输入正确的价格')
      return
    }
    if (this.data.expectPrice == '') {
      app.showToast('请输入期望价格')
      return
    }
    if (parseFloat(this.data.expectPrice) > parseFloat(this.data.price)) {
      app.showToast('期望价格不可超过当前价格')
      return
    }

    http.post(app.globalData.depreciateGoods, {
      goodsId: this.data.goodsId,
      storeId: this.data.storeId,
      price: this.data.expectPrice,
      goodsPrice: this.data.price
    }).then(res => {
      app.showSuccessToast('订阅成功', () => {
        wx.navigateBack()
        event.emit('notifyPrice', parseFloat(this.data.expectPrice).toFixed(2))
      })
    })
  }
})