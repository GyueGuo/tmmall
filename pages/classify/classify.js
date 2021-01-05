const app = getApp();
const http = require('../../utils/http.js');
const navBar = require('../../components/navBar/navBar.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //当前模板显示列表等级
    level: '',
    classify: ['', '', ''],
    brand_list: [],
    //一级列表id
    parent_id: '',
    //一级列表广告id
    adv_id: '',
    //广告信息
    adv_info: {},
    information: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      model: app.globalData.model
    })
    navBar.tabbar("tabBar", 1, this) // 1分类
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getFirstClassify()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.nextTick(() => {
      this.getMsg()
    })
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
    this.getFirstClassify()
    wx.nextTick(() => {
      this.getMsg()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  /**
   * 消息
   */
  getMsg() {
    http.post(app.globalData.message_statistics).then(res => {
      let result = res.result
      this.setData({
        information: result.activity + result.common + result.express
      })
    })
  },

  /**
   * 搜索
   */
  onSearch() {
    wx.navigateTo({
      url: '../search/search?type=1',
    })
  },

  /**
   * 消息
   */
  onMessage() {
    if (app.login()) {
      wx.navigateTo({
        url: `/my/message/message`,
      })
    }
  },

  /**
   * 获取一级列表
   */
  getFirstClassify() {
    http.post(app.globalData.classify_parent).then(res => {
      this.setData({
        level: res.level,
        first_classify: res.result,
        adv_id: res.result[0].classifyAdvId,
        parent_id: res.result[0].goodsClassifyId,
        classify_title: res.result[0].title,
      })
      if (this.data.level != 0) {
        this.getSubClassify()
      }
    })
  },

  /**
   * 点击一级分类
   */
  onFiristClassify(e) {
    let item = e.currentTarget.dataset.item
    this.setData({
      parent_id: item.goods_classify_id,
      sub_classify: [],
      brand_list: [],
      adv_id: item.classify_adv_id,
      classify_title: item.title,
      adv_info: {}
    })
    if (this.data.level != 0) {
      this.getSubClassify()
    }
  },

  /**
   * 获取下级分类
   */
  getSubClassify() {
    this.setData({
      sub_classify: [],
      brand_list: []
    })
    http.post(app.globalData.sub_classify, {
      parentId: this.data.parent_id,
      classifyAdvId: this.data.adv_id
    }).then(res => {
      this.setData({
        sub_classify: res.result,
        adv_info: res.advInfo,
        brand_list: res.brandList
      })
    })
  },

  /**
   * 跳转商品列表
   */
  onClassify(e) {
    wx.navigateTo({
      url: '/pages/search_goods/search_goods?goods_classify_id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 品牌跳转
   */
  onBandClassify(e) {
    wx.navigateTo({
      url: '/pages/search_goods/search_goods?brand_id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 点击广告
   */
  onAdv() {
    switch (this.data.adv_info.type) {
      //商品
      case 1:
        wx.navigateTo({
          url: '/nearby_shops/good_detail/good_detail?goods_id=' + this.data.adv_info.content,
          success: res => {
            http.post(app.globalData.index_adBrowseInc, {
              advId: this.data.adv_info.adv_id
            }).then(res => {})
          }
        })
        break;
        //店铺
      case 2:
        wx.navigateTo({
          url: '/nearby_shops/shop_detail/shop_detail?store_id=' + this.data.adv_info.content,
          success: res => {
            http.post(app.globalData.index_adBrowseInc, {
              advId: this.data.adv_info.adv_id
            }).then(res => {})
          }
        })
        break;
    }
  },

  /**
   * 扫一扫
   */
  onScan() {
    wx.scanCode({
      success(res) {
        console.log(res)
        // return
        let scene = decodeURIComponent(res.path.split("=")[1])
        let obj = http.scene(scene)
        console.log(obj)
        let data = scene.split("-")[0]
        console.log(data.split(",")[0])
        switch (data.split(",")[0]) {
          case 'goods':
            wx.navigateTo({
              url: '/nearby_shops/good_detail/good_detail?goods_id=' + obj.goods
            })
            break;
          case 'store':
            wx.navigateTo({
              url: '/nearby_shops/shop_detail/shop_detail?store_id=' + obj.store
            })
            break;
        }
      }
    })
  },
  route(e) {
    if (e.currentTarget.dataset.item.id == 2) {
      wx.stopPullDownRefresh()
      wx.startPullDownRefresh()
    }
  }
})