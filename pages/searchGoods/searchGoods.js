const app = getApp();
import http from '../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //搜索关键字
    searchKey: '',
    //单列 1 双列2
    columns: 1,
    //选项卡
    currentTab: 1,
    //价格 高低
    rank: '',
    //综合列表框
    classifyBoard: false,
    //选中综合
    compreType: 1,
    //选中综合文字
    compre: '综合',
    //筛选列表显示
    filtrateBoard: false,
    //筛选状态
    isFiltrate: false,
    //参数
    goodsClassifyId: '',
    brandId: '',
    shop: '',
    freightStatus: '',
    isFreight: '',
    goodsNumber: '',
    minimumPrice: '',
    topPrice: '',
    //数据
    goodList: [],
    total: '',
    page: 1,
    loading: true,
    scrollTop: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      configSwitch: app.globalData.configSwitch
    })
    //搜索关键字
    if (options.key) {
      this.setData({
        searchKey: options.key
      })
    }
    if (options.goodsClassifyId) {
      this.setData({
        goodsClassifyId: options.goodsClassifyId
      })
    }
    if (options.brandId) {
      this.setData({
        brandId: options.brandId
      })
    }
    if (options.type =='new') {
      this.onNew()
    } else if (options.type == 'evaluate'){
      this.onComment()
    }else {
      this.getData()
    }
    this.blendent()
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
      scrollTop: this.data.scrollTop ? 0 : 1,
    })
  },

  /**
   * 搜索框输入
   */
  searchInput(e) {
    this.data.searchKey = e.detail.value
  },

  /**
   *搜索框聚焦 
   */
  inputFocus() {
    this.closeSynthesisList()
  },

  /**
   * 清空输入框
   */
  onClearKey() {
    this.setData({
      searchKey: ''
    })
  },

  /**
   * 搜索
   */
  onSearch() {
    this.setData({
      shop: '',
      freightStatus: '',
      isFreight: '',
      goodsNumber: '',
      minimumPrice: '',
      topPrice: '',
      page: 1
    })
    this.getData()
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
   * 获取数据
   */
  getData() {
    let parameter = '';
    //综合排序    
    if (this.data.currentTab == 1) {
      switch (this.data.compreType) {
        //综合
        case 1:
          parameter = ''
          break;
        case 2:
          //新品
          parameter = 'createTime'
          break;
        case 3:
          //评论
          parameter = 'commentsNumber'
          break;
      }
    } else if (this.data.currentTab == 2) {
      //销量
      parameter = 'salesVolume'

    } else {
      //价格
      parameter = 'shopPrice'
    }
    http.postList(app.globalData.goodList, {
      goodsClassifyId: this.data.goodsClassifyId,
      brandId: this.data.brandId,
      parameter,
      rank: this.data.rank,
      shop: this.data.shop,
      freightStatus: this.data.freightStatus,
      keyword: this.data.searchKey,
      goodsNumber: this.data.goodsNumber,
      minimumPrice: this.data.minimumPrice,
      topPrice: this.data.topPrice,
      isFreight: this.data.isFreight,
      page: this.data.page,
      isDistributor: 0
    }).then(res => {
      if (this.data.page == 1) {
        this.onBackTop()
        this.setData({
          goodList: res.result.data,
          total: res.result.total,
          discount: res.discount == null ? 100 : res.discount
        })
      } else {
        this.setData({
          goodList: [...this.data.goodList, ...res.result.data]
        })
      }
    })
  },

  /**
   * 综合
   */
  onComposite() {
    //列表框
    if (this.data.currentTab == 1) {
      this.setData({
        classifyBoard: !this.data.classifyBoard,
      })
    } else {
      //点击综合
      this.setData({
        currentTab: 1,
        rank: ''
      })
      this.data.page = 1
      this.getData()
    }

  },

  /**
   * 销量
   */
  onSaleClick() {
    //关闭综合列表框
    if (!this.closeSynthesisList()) {
      this.setData({
        currentTab: 2,
        rank: 'desc'
      })
      this.data.page = 1
      this.getData()
    }
  },

  /**
   * 价格
   */
  onPriceClick() {
    if (!this.closeSynthesisList()) {
      //价格正序倒序
      if (this.data.rank == 'desc') {
        this.data.rank = 'asc'
      } else {
        this.data.rank = 'desc'
      }
      this.setData({
        parameter: '',
        currentTab: 3,
        rank: this.data.rank
      })
      this.data.page = 1
      this.getData()
    }
  },

  /**
   * 筛选
   */
  OnChangeFilter() {
    if (!this.closeSynthesisList()) {
      this.setData({
        filtrateBoard: true
      })
    }
  },

  /**
   * 综合排序
   */
  onCompreRank() {
    this.setData({
      compreType: 1,
      compre: '综合'
    })
    this.closeSynthesisList()
    this.data.page = 1
    this.getData()
  },

  /**
   * 新品优先
   */
  onNew() {
    this.setData({
      compreType: 2,
      compre: '新品',
      rank: 'desc'
    })
    this.closeSynthesisList()
    this.data.page = 1
    this.getData()
  },

  /**
   * 评论数
   */
  onComment() {
    this.setData({
      compreType: 3,
      compre: '评论'
    })
    this.closeSynthesisList()
    this.data.page = 1
    this.getData()
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
   * 关闭弹出窗
   */
  closeTrans() {
    this.setData({
      classifyBoard: false,
      filtrateBoard: false
    })
  },

  /**
   * 筛选重置
   */
  onFiltrateReset() {
    this.setData({
      filtrateBoard: false,
      isFiltrate: false,
      parameter: '',
      rank: '',
      shop: '',
      freightStatus: '',
      isFreight: '',
      goodsNumber: '',
      minimumPrice: '',
      topPrice: '',
      page: 1
    })
    this.getData()
  },

  /**
   * 筛选确定
   */
  onFiltrateConfirm(e) {
    this.setData({
      filtrateBoard: false,
      isFiltrate: true,
      page: 1
    })
    this.data.shop = e.detail.shop
    this.data.freightStatus = e.detail.freightStatus
    this.data.goodsNumber = e.detail.goodsNumber
    this.data.isFreight = e.detail.isFreight
    this.data.minimumPrice = e.detail.minimumPrice
    this.data.topPrice = e.detail.topPrice
    this.getData()
  },

  /**
   * 加载更多
   */
  loadMore() {
    if (this.data.total > this.data.goodList.length) {
      this.data.page++;
      this.getData()
    }
  },

  /**
   * 商品详情
   */
  onGoods(e) {
    wx.navigateTo({
      url: '../goodDetail/goodDetail?goodsId=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 店铺详情
   */
  onShop(e) {
    wx.navigateTo({
      url: '/pages/shopDetail/shopDetail?storeId=' + e.currentTarget.dataset.id,
    })
  },

  addCart(e) {
    this.setData({
      info: e.detail,
    })
    this.selectComponent("#buy_board").show()
  },
  /**
   * DIY配色
   */
  blendent() {
    let obj = {
      diyColor: app.globalData.diyColor
    }
    this.selectComponent("#cart").blendent(obj)
    this.selectComponent("#buy_board").blendent(obj)
    this.selectComponent("#good_list").blendent(obj)
  }
})