const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //选项卡
    tabList: [{
      goodsClassifyId: 0,
      title: '推荐'
    }],
    currentTab: 0,
    page: 1,
    goodList: [],
    total: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      diyColor: app.globalData.diyColor
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getClassify()
    this.getChoiceness()
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
    http.post(app.globalData.classifyParent).then(res => {
      this.setData({
        tabList: [...this.data.tabList, ...res.result]
      })
    })
  },

  /**
   * 点击分类
   */
  onClassify(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.id,
      page: 1
    })
    if (this.data.currentTab == 0) {
      this.getChoiceness()
    } else {
      this.getGoodList()
    }
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
      currentTab: e.currentTarget.dataset.id
    })
    if (this.data.currentTab == 0) {
      this.getChoiceness()
    } else {
      this.getGoodList()
    }
  },

  /**
   * 获得精选列表
   */
  getChoiceness() {
    http.post(app.globalData.choicenessList, {}).then(res => {
      this.setData({
        discount: res.discount == null ? 100 : res.discount,
        choiceness: res.result
      })
    })
  },

  /**
   * 获取商品
   */
  getGoodList() {
    http.post(app.globalData.goodRecommendList, {
      goodsClassifyId: this.data.currentTab,
      page: this.data.page
    }).then(res => {
      if (this.data.page == 1) {
        this.setData({
          discount: res.discount == null ? 100 : res.discount,
          goodList: res.result.data,
          total: res.result.total
        })
      } else {
        this.setData({
          goodList: [...this.data.goodList, ...res.result.data]
        })
      }
    })
  },

  /**
   * 商品详情
   */
  onGoods(e) {
    wx.navigateTo({
      url: '/nearbyShops/goodDetail/goodDetail?goodsId=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 加入购物车
   */
  addCart(e) {
    if (!app.login()) {
      return
    }
    let item = e.currentTarget.dataset.item
    item.addCartType = 2
    item['attr'] = item.attributeList
    if (item.goodsNumber == 0) {
      app.showToast('该商品已经卖光了')
      return
    }
    if (item['attr'].length == 0) {
      http.encPost(app.globalData.cartCreate, {
        storeId: item.storeId,
        goodsId: item.goodsId,
        goodsName: item.goodsName,
        file: item.cartFile,
        number: 1,
        productsId: '',
        attr: '',
        goodsAttr: '',
      }).then(res => {
        event.emit('refreshCart')
        event.emit('refreshCartNumber')
        app.showSuccessToast('添加购物车成功')
      })
    } else {
      this.setData({
        info: item
      })
      this.selectComponent("#buy_board").show()
    }
  },

})