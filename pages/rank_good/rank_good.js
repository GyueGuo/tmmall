const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //选项卡
    tab_list: [],
    //二级列表
    sub_list: [{
      goods_classify_id: '',
      title: '总榜'
    }],
    //当前一级分类
    current_tab: 0,
    first_goods_classify_id: '',
    //当前二级分类
    sub_tab: '',
    page: 1,
    good_list: [],
    total: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      diy_color: app.globalData.diy_color,
      configSwitch: app.globalData.configSwitch,
      first_goods_classify_id: options.first_goods_classify_id != undefined ? options.first_goods_classify_id : ''
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
      first_goods_classify_id: ''
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
    http.post(app.globalData.classify_parent).then(res=> {
      this.setData({
        classify: res.result,
        level: res.level,
        current_tab: this.data.firstGoodsClassifyId == '' ? res.result[0].goodsClassifyId : this.data.firstGoodsClassifyId,
      })
      this.getGoodList(this.data.firstGoodsClassifyId == '' ? res.result[0].goodsClassifyId : this.data.firstGoodsClassifyId)
      this.getSub(this.data.firstGoodsClassifyId == '' ? res.result[0].goodsClassifyId : this.data.firstGoodsClassifyId)
    })
  },

  /**
   * 获取二级列表
   */
  getSub(parent_id) {
    http.post(app.globalData.sub_classify, {
      parentId: parent_id,
      goodList: [],
      classifyAdvId: ''
    }).then(res=> {
      this.data.sub_list = [{
        goods_classify_id: '',
        title: '总榜'
      }]
      this.setData({
        sub_list: [...this.data.sub_list,...res.result]
      })
    })
  },

  /**
   * 点击分类
   */
  onClassify(e) {
    this.setData({
      current_tab: e.currentTarget.dataset.id,
      good_list: [],
      sub_tab: '',
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
      sub_tab: '',
      good_list: []
    })
    this.getGoodList(e.currentTarget.dataset.id)
    this.getSub(e.currentTarget.dataset.id)
  },

  /**
   * 点击二级分类
   */
  onSubClassify(e) {
    this.setData({
      sub_tab: e.currentTarget.dataset.id,
      page: 1,
      good_list: [],
    })
    this.getGoodList(e.currentTarget.dataset.id)
  },

  /**
   * 获取商品列表
   */
  getGoodList(id) {
    http.postList(app.globalData.goods_ranking, {
      goodsClassifyId: id == '' ? this.data.current_tab : id,
      page: this.data.page
    }).then(res=> {
      if (this.data.page == 1) {
        this.setData({
          good_list: res.result.data,
          total: res.result.total,
          discount: res.discount == null ? 100 : res.discount,
        })
      } else {
        this.setData({
          good_list: [...this.data.good_list,...res.result.data],
        })
      }
    })
  },

  /**
   * 加载更多
   */
  loadMore() {
    if (this.data.total > this.data.good_list.length) {
      this.data.page++
      this.getGoodList(this.data.sub_tab)
    }
  },

  /**
   * 商品详情
   */
  onGood(e) {
    wx.navigateTo({
      url: '/nearby_shops/good_detail/good_detail?goods_id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 店铺榜
   */
  onRankShop() {
    wx.redirectTo({
      url: '../rank_shop/rank_shop',
    })
  },

  addCart(e) {
    this.setData({
      info: e.detail,
      buy_type: 3
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
      scroll_top: 0
    })
  },
})