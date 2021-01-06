const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    //轮播图
    banner: [],
    currentBanner: 1,
    info: {
      webContent:''
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      id: options.id
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

  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.integralView, {
      integralId: this.data.id
    }).then(res => {
      if (res.result.video != null) {
        this.setData({
          video: res.result.video
        })
      }
      let image = {}
      for (let i = 0, len = res.result.multipleFile.length; i < len; i++) {
        image = {
          type: 'image',
          content: res.result.multipleFile[i]
        }
        this.data.banner.push(image)
      }
      wx.nextTick(() => {
        this.setData({
          finish: true,
          info: res.result,
          banner: this.data.banner,
          bannerLength: res.result.video != null ? res.result.multipleFile.length + 1 : res.result.multipleFile.length
        })
      })
    })
  },

  /**
   * 兑换
   */
  exchange() {
    if (app.login()) {
      if (this.data.info.integral > this.data.info.payPoints) {
        this.selectComponent("#modal").showModal()
        return
      }
      http.post(app.globalData.appletMySaveFormId, {
        microFormId: this.data.formId
      }).then(res => { })
      wx.navigateTo({
        url: `/my/integralConfirm/integralConfirm?id=${this.data.id}`,
      })
    }
  },
  /**
   * 赚积分
   */
  onTask() {
    if (app.login()) {
      wx.navigateTo({
        url: '/my/integralTask/integralTask',
      })
    }
  },
  formId(e) {
    this.data.formId = e.detail.formId
  }
})