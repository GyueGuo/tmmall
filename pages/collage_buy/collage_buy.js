const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //一级分类
    classify: [{
      group_classify_id: -1,
      title: '精选',
      subset: [{
        group_classify_id: ''
      }]
    }],
    current_tab: -1,
    //二级分类
    sub_list: [],
    sub_tab: -1,
    good_list: [],
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
    http.post(app.globalData.group_class_index).then(res=> {
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
      current_tab: e.currentTarget.dataset.id,
      good_list: [],
      subset: e.currentTarget.dataset.subset,
      sub_tab: e.currentTarget.dataset.id,
      page: 1
    })
    this.getGoodList()
  },

  /**
   * 分类更多
   */
  onMore() {
    this.setData({
      more_board: true
    })
  },

  /**
   *  关闭更多
   */
  closeBoard() {
    this.setData({
      more_board: false
    })
  },

  /**
   * 点击更多选项
   */
  onTabMoreItem(e) {
    this.closeBoard()
    this.setData({
      sroll_id: 'a-' + e.currentTarget.dataset.index,
      current_tab: e.currentTarget.dataset.id,
      subset: e.currentTarget.dataset.subset,
      sub_tab: e.currentTarget.dataset.id,
      // sub_tab: e.currentTarget.dataset.subset[0].group_classify_id,
      page: 1,
      good_list: []
    })
    this.getGoodList()
  },

  /**
   * 点击二级分类
   */
  onSubClassify(e) {
    this.setData({
      sub_tab: e.currentTarget.dataset.id,
      page: 1
    })
    this.getGoodList()
  },

  /**
   * 获取列表
   */
  getGoodList() {
    http.post(app.globalData.group_index, {
      isBest: this.data.current_tab == -1 ? 1 : '',
      groupClassify_id: this.data.current_tab == -1 ? '' : this.data.sub_tab,
      page: this.data.page
    }).then(res=> {
      if (this.data.page == 1) {
        this.setData({
          total: res.result.total,
          good_list: res.result.data
        })
      } else {
        this.setData({
          good_list: [...this.data.good_list,...res.result.data]
        })
      }
    })
  },

  /**
   * 加载更多
   */
  loadMore() {
    if (this.data.good_list.length < this.data.total) {
      this.data.page++
      this.getGoodList()
    }
  },
  /**
   * 跳转商品
   */
  onGood(e) {
    wx.navigateTo({
      url: '/nearby_shops/good_detail/good_detail?goods_id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 点击拼团
   */
  onMyCollage() {
    if (app.login()) {
      wx.redirectTo({
        url: '/my/my_collage/my_collage',
      })
    }
  },
})