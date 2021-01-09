const app = getApp();
import http from '../../utils/http';
const navBar = require('../../components/navBar/navBar.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //当前模板显示列表等级
    level: '',
    classify: ['', '', ''],
    brandList: [],
    //一级列表id
    parentId: '',
    //一级列表广告id
    advId: '',
    //广告信息
    advInfo: {},
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
    http.post(app.globalData.messageStatistics).then(res => {
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
    http.post(app.globalData.classifyParent).then(res => {
      this.setData({
        level: res.level,
        firstClassify: res.result,
        advId: res.result[0].classifyAdvId,
        parentId: res.result[0].goodsClassifyId,
        classifyTitle: res.result[0].title,
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
      parentId: item.goodsClassifyId,
      subClassify: [],
      brandList: [],
      advId: item.classifyAdvId,
      classifyTitle: item.title,
      advInfo: {}
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
      subClassify: [],
      brandList: []
    })
    http.post(app.globalData.subClassify, {
      parentId: this.data.parentId,
      classifyAdvId: this.data.advId
    }).then(res => {
      this.setData({
        subClassify: res.result,
        advInfo: res.advInfo,
        brandList: res.brandList
      })
    })
  },

  /**
   * 跳转商品列表
   */
  onClassify(e) {
    wx.navigateTo({
      url: '/pages/searchGoods/searchGoods?goodsClassifyId=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 品牌跳转
   */
  onBandClassify(e) {
    wx.navigateTo({
      url: '/pages/searchGoods/searchGoods?brandId=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 点击广告
   */
  onAdv() {
    switch (this.data.advInfo.type) {
      //商品
      case 1:
        wx.navigateTo({
          url: '/nearbyShops/goodDetail/goodDetail?goodsId=' + this.data.advInfo.content,
          success: res => {
            http.post(app.globalData.indexAdBrowseInc, {
              advId: this.data.advInfo.advId
            }).then(res => {})
          }
        })
        break;
        //店铺
      case 2:
        wx.navigateTo({
          url: '/nearbyShops/shopDetail/shopDetail?storeId=' + this.data.advInfo.content,
          success: res => {
            http.post(app.globalData.indexAdBrowseInc, {
              advId: this.data.advInfo.advId
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
              url: '/nearbyShops/goodDetail/goodDetail?goodsId=' + obj.goods
            })
            break;
          case 'store':
            wx.navigateTo({
              url: '/nearbyShops/shopDetail/shopDetail?storeId=' + obj.store
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