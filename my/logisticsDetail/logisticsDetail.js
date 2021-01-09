const app = getApp();
import http from '../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    list: [],
    state: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      obj: JSON.parse(options.info),
      diyColor: app.globalData.diyColor
    })
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

  getData() {
    http.post(app.globalData.expressView, {
      expressValue: this.data.obj.expressValue,
      expressNumber: this.data.obj.expressNumber,
      orderId: this.data.obj.orderAttachId,
      type: this.data.obj.type
    }).then(res => {
      let obj = {
        info: res.goodsView,
        address: res.address,
        state: res.result.state ? res.result.state : res.result.message
      }
      if (res.result.status == '200') {
        for (let i = 0, len = res.result.data.length; i < len; i++) {
          res.result.data[i]['date'] = res.result.data[i].time.substring(5, 10)
          res.result.data[i]['timer'] = res.result.data[i].time.substring(11, 16)
        }
        obj.list = res.result.data
      }
      this.setData(obj)
    })
  }
})