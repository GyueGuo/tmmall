const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //选项卡
    tabList: [],
    //二级列表
    subList: [{
      goodsClassifyId: '',
      title: '总榜'
    }],
    //当前一级分类
    currentTab: 0,
    firstGoodsClassifyId: '',
    //当前二级分类
    subTab: '',
    page: 1,
    goodList: [],
    total: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      configSwitch: app.globalData.configSwitch,
      firstGoodsClassifyId: options.firstGoodsClassifyId != undefined ? options.firstGoodsClassifyId : ''
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getClassify()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      firstGoodsClassifyId: ''
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 获取一级列表
   */
  getClassify() {
    http.post(app.globalData.classifyParent).then(res=> {
      this.setData({
        classify: res.result,
        level: res.level,
        currentTab: this.data.firstGoodsClassifyId == '' ? res.result[0].goodsClassifyId : this.data.firstGoodsClassifyId,
      })
      this.getGoodList(this.data.firstGoodsClassifyId == '' ? res.result[0].goodsClassifyId : this.data.firstGoodsClassifyId)
      this.getSub(this.data.firstGoodsClassifyId == '' ? res.result[0].goodsClassifyId : this.data.firstGoodsClassifyId)
    })
  },

  /**
   * 获取二级列表
   */
  getSub(parentId) {
    http.post(app.globalData.subClassify, {
      parentId: parentId,
      goodList: [],
      classifyAdvId: ''
    }).then(res=> {
      this.data.subList = [{
        goodsClassifyId: '',
        title: '总榜'
      }]
      this.setData({
        subList: [...this.data.subList,...res.result]
      })
    })
  },

  /**
   * 点击分类
   */
  onClassify(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.id,
      goodList: [],
      subTab: '',
      page: 1
    })
    this.getGoodList(e.currentTarget.dataset.id)
    this.getSub(e.currentTarget.dataset.id)
  },



  /**
   * 分类更多
   */
  onMore() {
    this.setData({
      moreBoard: true
    })
  },

  /**
   *  关闭更多
   */
  closeBoard() {
    this.setData({
      moreBoard: false
    })
  },

  /**
   * 点击更多选项
   */
  onTabMoreItem(e) {
    this.closeBoard()
    this.setData({
      srollId: 'a-' + e.currentTarget.dataset.index,
      currentTab: e.currentTarget.dataset.id,
      subTab: '',
      goodList: []
    })
    this.getGoodList(e.currentTarget.dataset.id)
    this.getSub(e.currentTarget.dataset.id)
  },

  /**
   * 点击二级分类
   */
  onSubClassify(e) {
    this.setData({
      subTab: e.currentTarget.dataset.id,
      page: 1,
      goodList: [],
    })
    this.getGoodList(e.currentTarget.dataset.id)
  },

  /**
   * 获取商品列表
   */
  getGoodList(id) {
    http.postList(app.globalData.goodsRanking, {
      goodsClassifyId: id == '' ? this.data.currentTab : id,
      page: this.data.page
    }).then(res=> {
      if (this.data.page == 1) {
        this.setData({
          goodList: res.result.data,
          total: res.result.total,
          discount: res.discount == null ? 100 : res.discount,
        })
      } else {
        this.setData({
          goodList: [...this.data.goodList,...res.result.data],
        })
      }
    })
  },

  /**
   * 加载更多
   */
  loadMore() {
    if (this.data.total > this.data.goodList.length) {
      this.data.page++
      this.getGoodList(this.data.subTab)
    }
  },

  /**
   * 商品详情
   */
  onGood(e) {
    wx.navigateTo({
      url: '/nearbyShops/goodDetail/goodDetail?goodsId=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 店铺榜
   */
  onRankShop() {
    wx.redirectTo({
      url: '../rankShop/rankShop',
    })
  },

  addCart(e) {
    this.setData({
      info: e.detail,
      buyType: 3
    })
    this.selectComponent("#buy_board").show()
  },
  /**
 * 页面滑动 返回顶部是否显示
 */
  scroll(e) {
    if (e.detail.scrollTop > 100) {
      this.selectComponent("#go_top").rise()
    } else {
      this.selectComponent("#go_top").decline()
    }
  },

  /**
   * 返回顶部
   */
  onBackTop() {
    this.setData({
      scrollTop: 0
    })
  },
})