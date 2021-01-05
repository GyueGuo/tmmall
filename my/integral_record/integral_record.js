const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    total: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getData()
    event.on('changeIntegralRecord', this, id => {
      for (let i = 0, len = this.data.list.length; i < len; i++) {
        if (this.data.list[i].integral_order_id == id) {
          this.data.list[i].status = 2
        }
      }
      this.setData({
        list: this.data.list
      })
    })
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
    event.remove('changeIntegralRecord', this)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.data.page = 1;
    this.getData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.total > this.data.list.length) {
      this.data.page++;
      this.getData()
    }
  },

  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.integral_record, {
      page: this.data.page
    }).then(res => {
      if (this.data.page == 1) {
        this.setData({
          total: res.result.total,
          list: res.result.data
        })
      } else {
        this.setData({
          list: [...this.data.list, ...res.result.data]
        })
      }
    })
  },

  /**
   * 
   */
  onDelete(e) {
    let item = e.currentTarget.dataset.item,
      index = e.currentTarget.dataset.index
    http.post(app.globalData.conversion_record_delete, {
      integralOrderId: item.integralOrderId
    }).then(res => {
      app.showSuccessToast(res.message, () => {
        this.data.page = 1
        this.getData()
      })
    })
  },

  /**
   * 兑换详情
   */
  onDetail(e) {
    wx.navigateTo({
      url: '../integral_order/integral_order?id=' + e.currentTarget.dataset.id + '&index=' + e.currentTarget.dataset.index,
    })
  },

  onLogistics(e) {
    let item = e.currentTarget.dataset.item,
      info = {
        express_number: item.express_number,
        express_value: item.express_value,
        order_attach_id: item.integral_order_id,
        type: 'integral'
      }
    wx.navigateTo({
      url: '../logistics_detail/logistics_detail?info=' + JSON.stringify(info),
    })
  },

  /**
   * 确认收货
   */
  // confirmReceipt(e) {
  //   let item = e.currentTarget.dataset.item,
  //     index = e.currentTarget.dataset.index;
  //   http.post(app.globalData.confirm_receipt, {
  //     integral_order_id: item.integral_order_id,
  //     status: 2
  //   }).then(res => {
  //     app.showSuccessToast(res.message, () => {
  //       this.data.list[index].status = 2
  //       this.setData({
  //         list: this.data.list
  //       })
  //     })
  //   })
  // },

  confirmReceipt(e) {
    let item = e.currentTarget.dataset.item,
      index = e.currentTarget.dataset.index;
    app.showModal('', '是否确定确认收货?', () => {
      http.post(app.globalData.confirm_receipt, {
        integralOrderId: item.integral_order_id,
        status: 2
      }).then(res => {
        app.showSuccessToast(res.message, () => {
          this.data.list[index].status = 2
          this.setData({
            list: this.data.list
          })
        })
      })
    }, this.data.diyColor.zColor)
  },


})