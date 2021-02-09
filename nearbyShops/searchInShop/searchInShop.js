const app = getApp();
import http from '../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //店铺id
    storeId: '',
    //分类id
    classifyId: '',
    //关键字
    searchKey: '',
    //一列 两列
    columns: 2,
    //选项卡
    allTab: 1,
    //综合排序
    compreType: 1,
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
      diyColor: app.globalData.diyColor,
      searchKey: options.key ? options.key : '',
      storeId: options.storeId,
      classifyId: options.classifyId ? options.classifyId : '',
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
    this.data.searchKey = e.detail.value
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
      searchKey: ''
    })
  },

  onClassify() {
    wx.redirectTo({
      url: '../shopClassify/shopClassify?storeId=' + this.data.storeId,
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
    if (this.data.allTab == 1) {
      this.setData({
        classifyBoard: !this.data.classifyBoard,
      })
    } else {
      //点击综合
      this.setData({
        allTab: 1,
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
        allTab: 2,
        page: 1,
        rank: '',
        compreType: 2,
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
        allTab: 3,
        page: 1,
        rank: this.data.rank,
        compreType: 3,
      })
      this.getGoodList()
    }
  },

  /**
   * 关闭综合列表
   */
  closeSynthesisList() {
    if (this.data.classifyBoard) {
      this.setData({
        classifyBoard: false
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
      compreType: 1,
      classifyBoard: false,
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
      compreType: 2,
      classifyBoard: false,
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
      scrollTop: this.data.scrollTop ? 0 : -1
    })
  },

  /**
   * 获取商品列表
   */
  getGoodList() {
    let parameter = ""
    if (this.data.compreType == 2 && this.data.allTab == 1) {
      parameter = "createTime"
    } else if (this.data.allTab == 2) {
      parameter = "salesVolume"
    } else if (this.data.allTab == 3) {
      parameter = "shopPrice"
    }
    http.post(app.globalData.storeGoodsList, {
      recommend: this.data.compreType == 1 ? 1 : '',
      parameter: parameter,
      rank: this.data.rank,
      storeId: this.data.storeId,
      keyword: this.data.searchKey,
      classifyId: this.data.classifyId != 'undefined' ? this.data.classifyId : '',
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