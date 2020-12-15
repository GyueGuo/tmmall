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
    current_banner: 1,
    info: {
      web_content:''
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color,
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
    http.post(app.globalData.integral_view, {
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
          banner_length: res.result.video != null ? res.result.multiple_file.length + 1 : res.result.multipleFile.length
        })
      })
    })
  },

  /**
   * 兑换
   */
  exchange() {
    if (app.login()) {
      if (this.data.info.integral > this.data.info.pay_points) {
        this.selectComponent("#modal").showModal()
        return
      }
      http.post(app.globalData.applet_my_saveFormId, {
        microFormId: this.data.formId
      }).then(res => { })
      wx.navigateTo({
        url: `/my/integral_confirm/integral_confirm?id=${this.data.id}`,
      })
    }
  },
  /**
   * 赚积分
   */
  onTask() {
    if (app.login()) {
      wx.navigateTo({
        url: '/my/integral_task/integral_task',
      })
    }
  },
  formId(e) {
    this.data.formId = e.detail.formId
  }
})