// nearby_shops/shop_credential/shop_credential.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    list: [],
    tip:'注：以上证照均由商家提供，信息以证照所示为准'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      info: JSON.parse(options.data)
    })
    let list = [{
      name: '营业执照',
      path: this.data.info.business_file
    }, 
    // {
    //   name: '行政许可证',
    //   img: this.data.info.licence_file
    // }
    ]
    this.setData({
      list: list
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 预览
   */
  previewImage(e) {
    let list = this.data.list.map((val) => {
      return val = val.path
    })
    wx.previewImage({
      current: e.currentTarget.dataset.path,
      urls: list
    })
  }
})