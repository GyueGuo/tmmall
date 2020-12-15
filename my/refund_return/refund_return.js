// pages/refund_return/refund_return.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //1快递至商家 2 送货至自提门店
    state: 1,
    //快递公司名称
    dhl: '请选择快递公司',
    //凭证
    pic_list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
   * 快递至商家
   */
  onMerchant() {
    this.setData({
      state: 1
    })
  },

  /**
   * 送至自提门店
   */
  selfStore() {
    this.setData({
      state: 2
    })
  },

  /**
   * 选择图片
   */
  choosePic() {
    wx.chooseImage({
      count: 3 - this.data.pic_list.length,
      success: res => {
        this.setData({
          pic_list: [...this.data.pic_list, ...res.tempFilePaths]
        })
      },
    })
  },

  /**
   * 删除图片
   */
  delectPic(e) {
    this.data.pic_list.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      pic_list: this.data.pic_list
    })
  }
})