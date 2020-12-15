const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //店铺id
    store_id: '',
    //分类id
    classify_id: '',
    //关键字
    search_key: '',
    //一列 两列
    columns: 2,
    //选项卡
    all_tab: 1,
    //综合排序
    compre_type: 1,
    //排序
    rank: '',
    //综合排序
    composite: '推荐',
    page: 1,
    total: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color,
      search_key: options.key ? options.key : '',
      store_id: options.store_id,
      classify_id: options.classify_id ? options.classify_id : '',
    })
    this.getGoodList()
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
   * 监听输入
   */
  searchInput(e) {
    this.data.search_key = e.detail.value
  },

  /**
   * 搜索
   */
  onSearch() {
    this.data.page = 1
    this.getGoodList()
  },

  /**
   * 清空关键字搜索
   */
  onClearKey() {
    this.setData({
      search_key: ''
    })
  },

  onClassify() {
    wx.redirectTo({
      url: '../shop_classify/shop_classify?store_id=' + this.data.store_id,
    })
  },

  /**
   * 改变单列双列
   */
  changeColums() {
    if (!this.closeSynthesisList()) {
      this.setData({
        columns: this.data.columns == 1 ? 2 : 1
      })
    }
  },

  /**
   * 综合
   */
  onComposite() {
    //列表框
    if (this.data.all_tab == 1) {
      this.setData({
        classify_board: !this.data.classify_board,
      })
    } else {
      //点击综合
      this.setData({
        all_tab: 1,
        page: 1,
        rank: ''
      })
      this.getGoodList()
    }
  },

  /**
   * 销量
   */
  onSaleClick() {
    //关闭综合列表框
    if (!this.closeSynthesisList()) {
      this.setData({
        all_tab: 2,
        page: 1,
        rank: '',
        compre_type: 2,
      })
      this.getGoodList()
    }
  },

  /**
   * 价格
   */
  onPriceClick() {
    if (!this.closeSynthesisList()) {
      //价格正序倒序
      if (this.data.rank == 'asc') {
        this.data.rank = 'desc'
      } else {
        this.data.rank = 'asc'
      }
      this.setData({
        all_tab: 3,
        page: 1,
        rank: this.data.rank,
        compre_type: 3,
      })
      this.getGoodList()
    }
  },

  /**
   * 关闭综合列表
   */
  closeSynthesisList() {
    if (this.data.classify_board) {
      this.setData({
        classify_board: false
      })
      return true;
    }
    return false;
  },

  /**
   * 推荐排序
   */
  onCompreRank() {
    this.setData({
      compre_type: 1,
      classify_board: false,
      page: 1,
      composite: '推荐'
    })
    this.getGoodList()
  },

  /**
   * 新品推荐
   */
  onNew() {
    this.setData({
      compre_type: 2,
      classify_board: false,
      page: 1,
      composite: '新品'
    })
    this.getGoodList()
  },

  /**
   * 加载更多
   */
  loadMore() {
    if (this.data.list.length < this.data.total) {
      this.data.page++;
      this.getGoodList()
    }
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

  /**
   * 获取商品列表
   */
  getGoodList() {
    let parameter = ""
    if (this.data.compre_type == 2 && this.data.all_tab == 1) {
      parameter = "create_time"
    } else if (this.data.all_tab == 2) {
      parameter = "sales_volume"
    } else if (this.data.all_tab == 3) {
      parameter = "shop_price"
    }
    http.post(app.globalData.store_goods_list, {
      recommend: this.data.compre_type == 1 ? 1 : '',
      parameter: parameter,
      rank: this.data.rank,
      storeId: this.data.store_id,
      keyword: this.data.search_key,
      classifyId: this.data.classify_id != 'undefined' ? this.data.classify_id : '',
      page: this.data.page
    }).then(res => {
      if (this.data.page == 1) {
        this.setData({
          list: res.result.data,
          total: res.result.total,
          discount: res.discount == null ? 100 : res.discount,
        })
      } else {
        this.setData({
          list: [...this.data.list, ...res.result.data]
        })
      }
    })
  },

  addCart(e) {
    this.setData({
      info: e.detail,
    })
    this.selectComponent("#buy_board").show()
  }
})