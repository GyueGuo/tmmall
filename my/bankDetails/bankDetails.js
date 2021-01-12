const app = getApp();
import http from '../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      cardId: options.cardId
    })
    this.getData()
  },
  getData() {
    http.post(app.globalData.cardDetails, {
      id: this.data.cardId
    }).then(res => {
      this.setData({
        cardDetails: res.result
      })
    })
  },
  /**
   * 
   */
  /**
   * 获取银行卡
   */
  cardDel() {
    http.post(app.globalData.cardDestroy, {
      id: this.data.cardDetails.cardId
    }).then(res => {
      app.showSuccessToast('解绑成功', () => {
        wx.navigateBack({})
      })
    })
  },
})