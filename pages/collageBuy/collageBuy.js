const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //一级分类
    classify: [{
      groupClassifyId: -1,
      title: '精选',
      subset: [{
        groupClassifyId: ''
      }]
    }],
    currentTab: -1,
    //二级分类
    subList: [],
    subTab: -1,
    goodList: [],
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getClassify() 
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
   * 获取分类
   */
  getClassify() {
    http.post(app.globalData.groupClassIndex).then(res=> {
      this.setData({
        classify: [...this.data.classify,...res.result]
      })
      this.getGoodList()
    })
  },

  /**
   * 点击分类
   */
  onClassify(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.id,
      goodList: [],
      subset: e.currentTarget.dataset.subset,
      subTab: e.currentTarget.dataset.id,
      page: 1
    })
    this.getGoodList()
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
      subset: e.currentTarget.dataset.subset,
      subTab: e.currentTarget.dataset.id,
      // subTab: e.currentTarget.dataset.subset[0].groupClassifyId,
      page: 1,
      goodList: []
    })
    this.getGoodList()
  },

  /**
   * 点击二级分类
   */
  onSubClassify(e) {
    this.setData({
      subTab: e.currentTarget.dataset.id,
      page: 1
    })
    this.getGoodList()
  },

  /**
   * 获取列表
   */
  getGoodList() {
    http.post(app.globalData.groupIndex, {
      isBest: this.data.currentTab == -1 ? 1 : '',
      groupClassifyId: this.data.currentTab == -1 ? '' : this.data.subTab,
      page: this.data.page
    }).then(res=> {
      if (this.data.page == 1) {
        this.setData({
          total: res.result.total,
          goodList: res.result.data
        })
      } else {
        this.setData({
          goodList: [...this.data.goodList,...res.result.data]
        })
      }
    })
  },

  /**
   * 加载更多
   */
  loadMore() {
    if (this.data.goodList.length < this.data.total) {
      this.data.page++
      this.getGoodList()
    }
  },
  /**
   * 跳转商品
   */
  onGood(e) {
    wx.navigateTo({
      url: '/nearbyShops/goodDetail/goodDetail?goodsId=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 点击拼团
   */
  onMyCollage() {
    if (app.login()) {
      wx.redirectTo({
        url: '/my/myCollage/myCollage',
      })
    }
  },
})