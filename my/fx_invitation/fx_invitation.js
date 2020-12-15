// my/fx_invitation/fx_invitation.js
const http = require('../../utils/http.js');
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
    if (options.d_scene) {
      this.setData({
        d_scene: JSON.parse(options.d_scene)
      })
      app.globalData.sup_id = JSON.parse(options.d_scene).sup_id
      if (app.globalData.member_id != '') {
        this.distribution_bindDistribution(JSON.parse(options.d_scene).sup_id)
      }
    }
    //scene:1个人 2店铺 3平台
    if (options.scene) {
      let obj = http.scene(options.scene)
      //上级代言id
      if (obj.sup_id) {
        app.globalData.sup_id = obj.sup_id
        if (app.globalData.member_id != '') {
          this.distribution_bindDistribution(obj.sup_id)
        }
        this.setData({
          d_scene: obj
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
    let sup_id = {
      scene: this.data.d_scene != undefined ? this.data.d_scene.scene : '1',
      sup_id: this.data.d_scene != undefined ? this.data.d_scene.sup_id : app.globalData.distribution.cur.distribution_id
    }
    if (res.from === 'button') {} else {}
    return {
      title: this.data.info.goods_name,
      path: '/my/fx_invitation/fx_invitation?d_scene=' + JSON.stringify(sup_id)
    }
  },

  share(e) {
    this.setData({
      share_type: e.currentTarget.dataset.type == 'distribution' ? e.currentTarget.dataset.type : null
    })
    this.selectComponent("#share").fadeIn()
    this.selectComponent("#share").share_btn()
  },

  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.distribution_yq, {
      distributionId: this.data.d_scene == undefined ? app.globalData.distribution.cur.distribution_id : this.data.d_scene.sup_id,
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
    http.post(app.globalData.distribution_share_info, {
      distributionId: this.data.d_scene == undefined ? 0 : this.data.d_scene.sup_id
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
      if (this.data.info.is_self == 1) {
        wx.navigateTo({
          url: '/my/fx_goods_list/fx_goods_list',
        })
      } else {
        wx.navigateTo({
          url: '/my/fx_cwdy/fx_cwdy',
        })
      }
    }

    // http.post(app.globalData.distribution_jumpSign, {}).then(res => {
    //   wx.redirectTo({
    //     url: res.data.path
    //   })
    // })
  },
  /**
   * 绑定代言关系
   */
  distribution_bindDistribution(superior) {
    http.post(app.globalData.distribution_bindDistribution, {
      superior,
    })
  }
})