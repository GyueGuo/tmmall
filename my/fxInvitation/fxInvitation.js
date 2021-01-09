import http from '../../utils/http';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    random: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if (options.dScene) {
      this.setData({
        dScene: JSON.parse(options.dScene)
      })
      app.globalData.supId = JSON.parse(options.dScene).supId
      if (app.globalData.memberId != '') {
        this.distributionBindDistribution(JSON.parse(options.dScene).supId)
      }
    }
    //scene:1个人 2店铺 3平台
    if (options.scene) {
      let obj = http.scene(options.scene)
      //上级代言id
      if (obj.supId) {
        app.globalData.supId = obj.supId
        if (app.globalData.memberId != '') {
          this.distributionBindDistribution(obj.supId)
        }
        this.setData({
          dScene: obj
        })
      }
    }
    this.getDistributionData()
    this.getData()
    let timestamp = new Date().getTime()
    this.setData({
      random: `?id=${timestamp}`
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
  onShareAppMessage: function(res) {
    let supId = {
      scene: this.data.dScene != undefined ? this.data.dScene.scene : '1',
      supId: this.data.dScene != undefined ? this.data.dScene.supId : app.globalData.distribution.cur.distributionId
    }
    if (res.from === 'button') {} else {}
    return {
      title: this.data.info.goodsName,
      path: '/my/fxInvitation/fxInvitation?dScene=' + JSON.stringify(supId)
    }
  },

  share(e) {
    this.setData({
      shareType: e.currentTarget.dataset.type == 'distribution' ? e.currentTarget.dataset.type : null
    })
    this.selectComponent("#share").fadeIn()
    this.selectComponent("#share").shareBtn()
  },

  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.distributionYq, {
      distributionId: this.data.dScene == undefined ? app.globalData.distribution.cur.distributionId : this.data.dScene.supId,
      type: 0
    }).then(res => {
      this.setData({
        info: res.data
      })
    })
  },

  /**
   * 获取代言信息
   */
  getDistributionData() {
    http.post(app.globalData.distributionShareInfo, {
      distributionId: this.data.dScene == undefined ? 0 : this.data.dScene.supId
    }).then(res => {
      app.globalData.distribution = res.data
      this.setData({
        distribution: res.data
      })
    })
  },

  /**
   * 我要代言
   */
  goDistribution() {
    if (app.login()) {
      if (this.data.info.isSelf == 1) {
        wx.navigateTo({
          url: '/my/fxGoodsList/fxGoodsList',
        })
      } else {
        wx.navigateTo({
          url: '/my/fxCwdy/fxCwdy',
        })
      }
    }
  },
  /**
   * 绑定代言关系
   */
  distributionBindDistribution(superior) {
    http.post(app.globalData.distributionBindDistribution, {
      superior,
    })
  }
})