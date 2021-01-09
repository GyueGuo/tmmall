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
    distribution: '',
    distributionType: 0 //0正常列表 1购买指定列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor,
    })
    let obj = {}
    //搜索关键字
    if (options.key) {
      obj.searchKey = options.key
    }
    if (options.goodsClassifyId) {
      obj.goodsClassifyId = options.goodsClassifyId
    }
    if (options.brandId) {
      obj.brandId = options.brandId
    }
    this.setData(obj)
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
    this.setData({
      supId: app.globalData.supId
    })
    this.getDistributionData()
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
      scrollTop: 0
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
    console.log('get')
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
      parameter: parameter,
      rank: this.data.rank,
      shop: this.data.shop,
      freightStatus: this.data.freightStatus,
      keyword: this.data.searchKey,
      goodsNumber: this.data.goodsNumber,
      minimumPrice: this.data.minimumPrice,
      topPrice: this.data.topPrice,
      isFreight: this.data.isFreight,
      isDistributor: this.data.distributionType == 1 ? 2 : 0,
      isDistribution: this.data.distributionType == 1 ? 2 : 2,
      page: this.data.page
    }).then(res => {
      if (this.data.page == 1) {
        this.onBackTop()
        this.setData({
          goodList: res.result.data,
          total: res.result.total,
          discount: res.discount == null ? 100 : res.discount,
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
      url: '/nearbyShops/goodDetail/goodDetail?goodsId=' + e.currentTarget.dataset.id,
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
   * 成为代言人
   */
  goFx() {
    if (app.login()) {
      wx.navigateTo({
        url: '/my/fxCwdy/fxCwdy',
      })
    }
  },

  /**
   * 获取代言信息
   */
  getDistributionData() {
    http.post(app.globalData.distributionShareinfo, {
      distributionId: app.globalData.supId == '' ? 0 : app.globalData.supId
    }).then(res => {
      try {
        this.setData({
          distribution: res.data,
          distributionType: res.data.click != "appointSpeaker" ? 0 : 1
        })
        this.getData()
        app.globalData.distribution = res.data
        let memberInfo = wx.getStorageSync('memberInfo')
        if (memberInfo.distributionRecord == null) {
          let distributionRecord = {
            distributionId: res.data.cur == null ? null : res.data.cur.distributionId,
            auditStatus: res.data.cur == null ? null : res.data.cur.auditStatus
          }
          memberInfo.distributionRecord = distributionRecord
        } else {
          memberInfo.distributionRecord.distributionId = res.data.cur == null ? null : res.data.cur.distributionId
          memberInfo.distributionRecord.auditStatus = res.data.cur == null ? null : res.data.cur.auditStatus
        }
        wx.setStorageSync('memberInfo', memberInfo)
      } catch (e) {}
    })
  },
})