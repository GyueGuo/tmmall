const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeId: '',
    currentTab: 1,
    discount: '',
    //全部商品中的选项卡
    allTab: 2,
    //两排一排显示
    columns: 1,
    //是否显示首页
    homeView: true,
    //店铺信息
    storeHead: {},
    //搜索内容
    key: '',
    //首页分页
    indexPage: 1,
    //首页推荐列表
    recommandList: [],
    //首页推荐列表长度
    recommandTotal: '',
    //全部商品分类
    allPage: 1,
    //全部商品列表
    allList: [],
    //全部商品分类
    classify: [],
    //一级分类
    firstClassify: '',
    //二级分类
    secondClassify: '',
    //全部商品列表个数
    allTotal: '',
    cartTotal: 0,
    cartList: [],
    cartNum: 0,
    //当前操作的plan b item id
    goodsId: '',
    //全部商品 价格排序
    rank: '',
    //新品
    newPage: 1,
    //新品列表
    newList: [],
    //最后一页
    lastPage: '',
    //动态
    articlePage: 1,
    //动态列表
    articleList: [],
    //动态列表长度
    articleTotal: '',
    oCart: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if (options.scene) {
      let obj = http.scene(options.scene)
      console.log(obj)
      this.setData({
        storeId: obj.store
      })
    } else {
      this.setData({
        storeId: options.storeId
      })
    }
    app.appDIY(() => {}, this)
    this.getCartList()
    this.setData({
      configSwitch: app.globalData.configSwitch,
    })
    // if (options.onAllGood == 0) {
    //   this.onAllGood()
    // }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getStoreHead()
    this.getStoreIndex()

    event.on('collect', this, () => {
      this.getStoreHead()
    })

    event.on('shopAddCart', this, data => {
      console.log(data)
      if (data) {
        this.data.goodsId = data.goodsId
      }
      console.log(this.data.goodsId)
      for (let i = 0, len = this.data.allList.length; i < len; i++) {
        if (this.data.allList[i].goodsId == this.data.goodsId) {
          this.data.allList[i].cartNumber += data.number
        }
      }
      this.setData({
        allList: this.data.allList
      })
      this.getCartList()
    })

    event.on('shopReduceCart', this, goodsId => {
      if (goodsId) {
        this.data.goodsId = goodsId
      }
      for (let i = 0, len = this.data.allList.length; i < len; i++) {
        if (this.data.allList[i].goodsId == this.data.goodsId) {
          this.data.allList[i].cartNumber--;
        }
      }
      this.setData({
        allList: this.data.allList
      })
      this.getCartList()
    })

    event.on('clearCart', this, () => {
      for (let i = 0, len = this.data.allList.length; i < len; i++) {
        this.data.allList[i].cartNumber = 0
      }
      this.setData({
        cartList: [],
        cartNum: 0,
        allList: this.data.allList
      })
      // app.showToast('删除成功', () => {})
    })
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
    event.remove('collect', this)
    event.remove('shopAddCart', this)
    event.remove('clearCart', this)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    switch (this.data.currentTab) {
      case 1:
        this.data.indexPage = 1
        this.getStoreIndex()
        break;
      case 2:
        this.data.allPage = 1
        this.getAllGoods()
        break;
      case 3:
        this.data.newPage = 1
        this.getNewGoods()
        break;
      case 4:
        this.data.articlePage = 1
        this.getArticle()
        break;
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    if (res.from === 'button') {

    } else {

    }
    return {
      title: this.data.storeHead.storeName,
      path: '/nearbyShops/shopDetail/shopDetail?storeId=' + this.data.storeId
    }
  },

  onPageScroll(e) {
    //固定状态栏
    if (e.scrollTop > 100) {
      this.selectComponent("#go_top").rise()
    } else {
      this.selectComponent("#go_top").decline()
    }
    let query = wx.createSelectorQuery().in(this)
    query.select('#bar').boundingClientRect(res => {
      if (e.scrollTop > res.height - 10) {
        this.setData({
          fixed: true
        })
      } else {
        this.setData({
          fixed: false
        })
      }
    }).exec()
  },

  /**
   * 页面滑动 返回顶部是否显示
   */
  scroll(e) {
    console.log(e.detail.scrollTop)
    if (e.detail.scrollTop > 50 && (this.data.currentTab != 2 && this.data.storeHead.goodsStyle != 1)) {
      this.selectComponent("#go_top").rise()
    } else {
      this.selectComponent("#go_top").decline()
    }
  },

  /**
   * 返回顶部
   */
  onBackTop() {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },

  bLeftScroll(e) {
    if (e.detail.scrollTop > 0) {
      this.setData({
        bLeftScroll: true
      })
    } else {
      this.setData({
        bLeftScroll: false
      })
    }
  },

  bRightScroll(e) {
    if (e.detail.scrollTop > 0) {
      this.setData({
        bRightScroll: true
      })
    } else {
      this.setData({
        bRightScroll: false
      })
    }
  },

  /**
   * 搜索内容
   */
  searchInput(e) {
    this.data.key = e.detail.value
  },

  /**
   * 搜索
   */
  onSearch(e) {
    if (e.currentTarget.dataset.id) {
      this.data.id = e.currentTarget.dataset.id
    }
    this.setData({
      classifyBoard: false
    })
    wx.navigateTo({
      url: '/nearbyShops/searchInShop/searchInShop?classifyId=' + this.data.id + '&storeId=' + this.data.storeId + '&key=' + this.data.key,
    })
  },

  /**
   * 分类
   */
  onClassify() {
    wx.navigateTo({
      url: '/nearbyShops/shopClassify/shopClassify?storeId=' + this.data.storeId,
    })
  },

  /**
   * 首页
   */
  onHome() {
    this.setData({
      currentTab: 1,
      homeView: true,
      allView: false,
      newView: false,
      dynamicView: false,
    })
  },

  /**
   * 全部商品
   */
  onAllGood() {
    this.setData({
      currentTab: 2,
      homeView: false,
      allView: true,
      newView: false,
      dynamicView: false,
    })
    if (this.data.allList.length == 0) {
      this.getAllGoods()
    }
    if (this.data.classify.length == 0) {
      this.getClassify()
    }
    this.getCartList()
  },

  /**
   * 获取分类
   */
  getClassify() {
    http.post(app.globalData.storeClassifyList, {
      storeId: this.data.storeId
    }).then(res => {
      this.data.classify.push({
        storeGoodsClassifyId: '',
        subset: [],
        select: true,
        title: '全部商品'
      })
      this.setData({
        classify: [...this.data.classify, ...res.result]
      })
    })
  },

  /**
   * 商品分类
   */
  onStoreClassify(e) {
    let item = e.currentTarget.dataset.item
    console.log(item)
    if (!item.select) {
      for (let i = 0, len = this.data.classify.length; i < len; i++) {
        if (item.storeGoodsClassifyId == this.data.classify[i].storeGoodsClassifyId) {
          this.data.classify[i]['select'] = true
        } else {
          this.data.classify[i]['select'] = false
        }
      }

    }
    this.setData({
      firstClassify: item.storeGoodsClassifyId,
      secondClassify: '',
      allPage: 1,
      allList: [],
      classify: this.data.classify
    })
    this.getAllGoods()
  },

  /**
   * 商品二级分类
   */
  onSecondClassify(e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      secondClassify: id,
      allList: [],
      allPage: 1,
    })
    this.getAllGoods()
  },

  /**
   * 获取店铺购物车
   */
  getCartList() {
    http.post(app.globalData.cartIndex, {
      storeId: this.data.storeId
    }, true).then(res => {
      if (res.result.length == 0) {
        this.setData({
          cartList: [],
          cartNum: 0
        })
        return
      }
      let cartNum = 0
      for (let i = 0, len = res.result[0].list.length; i < len; i++) {
        res.result[0].list[i]['select'] = true
        cartNum += res.result[0].list[i].number
      }
      this.setData({
        cartList: res.result[0].list,
        cartNum: cartNum
      })
    })
  },

  /**
   * 加入购物车
   */
  addCartNumber(e) {
    if (!app.login()) {
      return
    }
    let dataset = e.currentTarget.dataset
    this.data.goodsId = dataset.item.goodsId
    if (dataset.item.attributeList.length == 0) {
      http.encPost(app.globalData.cartCreate, {
        storeId: this.data.storeId,
        goodsId: dataset.item.goodsId,
        goodsName: dataset.item.goodsName,
        file: dataset.item.cartFile,
        number: 1,
        productsId: '',
        attr: '',
        goodsAttr: '',
      }, true).then(res => {
        app.showToast('添加成功', () => {})
        this.data.allList[dataset.index].cartNumber++
          this.setData({
            allList: this.data.allList
          })
        this.getCartList()
        event.emit('refreshCart')
      })
    } else {
      dataset.item['attr'] = dataset.item.attributeList
      this.setData({
        info: dataset.item
      })
      this.selectComponent("#buy_board").show()
    }
  },

  /**
   * 减少购物车
   */
  subtractCart(e) {
    console.log(e)
    // let item = e.currentTarget.dataset.item
    let dataset = e.currentTarget.dataset
    this.data.goodsId = dataset.item.goodsId
    if (dataset.item.attributeList.length != 0) {
      app.showToast('多规格商品请在购物车中减少')
      return
    }
    let cartId = ''
    for (let i = 0, len = this.data.cartList.length; i < len; i++) {
      if (this.data.cartList[i].goodsId == dataset.item.goodsId) {
        cartId = this.data.cartList[i].cartId
      }
    }
    if (dataset.item.cartNumber > 1) {
      http.post(app.globalData.cartReduce, {
        cartId: cartId,
        number: 1
      }, true).then(res => {
        this.data.allList[dataset.index].cartNumber--;
        this.setData({
          allList: this.data.allList
        })
        this.getCartList()
        event.emit('refreshCart')
      })
    } else if (dataset.item.cartNumber == 1) {
      this.cartDelete(cartId, dataset)
    }

  },

  /**
   * 删除商品
   */
  cartDelete(cartId, dataset) {
    console.log(dataset)
    // return
    http.post(app.globalData.cartDelete, {
      cartId,
    }, true).then(res => {
      // this.data.allList[dataset.index].cartNumber = 0
      for (let i = 0, len = this.data.allList.length; i < len; i++) {
        if (this.data.allList[i].goodsId == dataset.item.goodsId) {
          this.data.allList[i].cartNumber = 0
          break;
        }
      }
      this.setData({
        allList: this.data.allList,
      })
      this.getCartList()
      this.triggerEvent("changeNum", this.data.changeNum)
      event.emit('refreshCartNumber')
    })
  },

  /**
   * 监听结算列表删除
   */
  eventCartDelete(e) {
    let item = e.detail
    this.cartDelete(item.cartId, item.item)
  },


  /**
   * 计算购物车价格
   */
  cartCalculate(e) {
    this.setData({
      cartTotal: e.detail
    })
  },


  oCart() {
    if (!this.data.oCart) {
      this.setData({
        oCart: !this.data.oCart
      })
      this.showCart()
    } else {
      this.setData({
        oCart: !this.data.oCart
      })
      this.selectComponent("#cart-list")._close()
    }
  },
  showCart() {
    if (this.data.cartList.length == 0) {
      app.showToast('购物车中暂无商品')
      return
    }
    this.selectComponent("#cart-list").show()
  },

  settleDown() {
    this.selectComponent("#cart-list").settleDown()
  },

  /**
   * 新品
   */
  onNew() {
    this.setData({
      currentTab: 3,
      homeView: false,
      allView: false,
      newView: true,
      dynamicView: false,
    })
    if (this.data.newList.length == 0) {
      this.getNewGoods()
    }
  },

  /**
   * 动态
   */
  onDynamic() {
    this.setData({
      currentTab: 4,
      homeView: false,
      allView: false,
      newView: false,
      dynamicView: true,
    })
    if (this.data.articleList.length == 0) {
      this.getArticle()
    }
  },

  /**
   * 热门分类
   */
  onHotClassify() {
    if (this.data.classifyBoard) {
      this.setData({
        classifyBoard: false
      })
      return
    }
    http.post(app.globalData.storeHotClassifyList, {
      storeId: this.data.storeId
    }).then(res => {
      if (res.result.length == 0) {
        app.showToast('暂无热门分类')
        return
      }
      this.setData({
        hotClassify: res.result,
        classifyBoard: true
      })
    })

  },

  /**
   * 关闭分类
   */
  closeClassify() {
    this.setData({
      classifyBoard: false
    })
  },

  /**
   * 领取优惠券
   */
  receiveCoupon(e) {
    if (app.login()) {
      http.post(app.globalData.getCoupon, {
        couponId: e.currentTarget.dataset.id,
        storeId: this.data.storeId
      }).then(res => {
        app.showSuccessToast('领取成功')
      })
    }
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
    //点击综合
    this.setData({
      allTab: 1,
      rank: '',
      allPage: 1
    })
    //列表框
    this.getAllGoods()
  },

  /**
   * 销量
   */
  onSaleClick() {
    //关闭综合列表框
    if (!this.closeSynthesisList()) {
      this.setData({
        allTab: 2,
        rank: '',
        allPage: 1
      })
      this.getAllGoods()
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
        rank: this.data.rank,
        allPage: 1
      })
      this.getAllGoods()
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
   * 店铺详情
   */
  onShopIntro() {
    wx.navigateTo({
      url: '/nearbyShops/shopIntro/shopIntro?id=' + this.data.storeId,
    })
  },

  /**
   * 店铺头部
   */
  getStoreHead() {
    http.post(app.globalData.storeHead, {
      storeId: this.data.storeId
    }).then(res => {
      this.setData({
        storeHead: res.result,
        show: true
      })
      wx.setNavigationBarTitle({
        title: res.result.storeName,
      })
    })
  },

  /**
   * 获取店铺首页
   */
  getStoreIndex() {
    http.post(app.globalData.storeIndex, {
      storeId: this.data.storeId,
      page: this.data.indexPage
    }).then(res => {
      if (this.data.indexPage == 1) {
        this.setData({
          storeIndex: res.result,
          recommandList: res.result.recommend.data,
          recommandTotal: res.result.recommend.total,
        })
      } else {
        this.setData({
          recommandList: [...this.data.recommandList, ...res.result.recommend.data]
        })
      }
    })
  },

  /**
   * 获取全部商品
   */
  getAllGoods() {
    let recommend = this.data.allTab == 1 ? 1 : '',
      parameter = ''
    if (this.data.allTab == 2) {
      parameter = 'salesVolume'
    } else if (this.data.allTab == 3) {
      parameter = 'shopPrice'
    }
    http.postList(app.globalData.storeGoodsList, {
      page: this.data.allPage,
      recommend: recommend,
      parameter: parameter,
      rank: this.data.rank,
      storeId: this.data.storeId,
      classifyId: this.data.secondClassify == '' ? this.data.firstClassify : this.data.secondClassify,
    }).then(res => {
      if (this.data.allPage == 1) {
        this.setData({
          discount: res.discount == null ? 100 : res.discount,
          allList: res.result.data,
          allTotal: res.result.total,
        })
      } else {
        this.setData({
          allList: [...this.data.allList, ...res.result.data]
        })
      }
      this.setData({
        allList: this.data.allList
      })
    })
  },

  /**
   * 获取新品
   */
  getNewGoods() {
    http.post(app.globalData.newProductList, {
      page: this.data.newPage,
      storeId: this.data.storeId,
    }).then(res => {
      if (this.data.newPage == 1) {
        this.setData({
          discount: res.discount == null ? 100 : res.discount,
          newList: res.result.data,
          lastPage: res.result.lastPage,
        })
      } else {
        if (this.data.newList[this.data.newList.length - 1].date == res.result.data[0].date) {
          this.data.newList[this.data.newList.length - 1].list = this.data.newList[this.data.newList.length - 1].list.concat(res.result.data[0].list)
          res.result.data.splice(0, 1)
        }
        this.setData({
          newList: [...this.data.newList, ...res.result.data]
        })
      }
    })
  },

  /**
   * 跳转商品
   */
  onGoods(e) {
    wx.navigateTo({
      url: '/nearbyShops/goodDetail/goodDetail?goodsId=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 获取动态
   */
  getArticle() {
    http.post(app.globalData.storeArticleList, {
      storeId: this.data.storeId,
      page: this.data.articlePage
    }).then(res => {
      if (this.data.articlePage == 1) {
        this.setData({
          articleList: res.result.data,
          atricleTotal: res.result.total
        })
      } else {
        this.setData({
          articleList: [...this.data.articleList, ...res.result.data]
        })
      }
    })
  },

  /**
   * 动态详情
   */
  onArticleDetail(e) {
    wx.navigateTo({
      url: '/nearbyShops/dynamicDetail/dynamicDetail?id=' + e.currentTarget.dataset.id + '&storeId=' + this.data.storeId,
    })
  },

  /**
   * 关注店铺
   */
  collectStore() {
    let url = ''
    if (this.data.storeHead.state == 0) {
      url = app.globalData.collectStore
    } else {
      url = app.globalData.storeIndexDelete
    }
    http.post(url, {
      storeId: this.data.storeId
    }).then(res => {
      if (this.data.storeHead.state == 0) {
        this.data.storeHead.state = 1
        this.data.storeHead.collect++;
      } else {
        this.data.storeHead.state = 0
        this.data.storeHead.collect--;
      }
      this.setData({
        storeHead: this.data.storeHead
      })
      app.showSuccessToast(res.message)
    })
  },

  /**
   * 加载更多
   */
  loadMore() {
    switch (this.data.currentTab) {
      case 1:
        if (this.data.recommandTotal > this.data.recommandList.length) {
          this.data.indexPage++;
          this.getStoreIndex()
        }
        break;
      case 2:
        if (this.data.allTotal > this.data.allList.length) {
          this.data.allPage++;
          this.getAllGoods()
        }
        break;
      case 3:
        if (this.data.lastPage > this.data.newPage) {
          this.data.newPage++;
          this.getNewGoods()
        }
        break;
      case 4:
        if (this.data.articleTotal > this.data.articleList.length) {
          this.data.articlePage++;
          this.getArticle()
        }
        break;
    }
  },

  addCart(e) {
    this.setData({
      info: e.detail,
    })
    this.selectComponent("#buy_board").show()
  },
  buyCallback(e) {
    console.log(e)
  },
  /**
   * 客服
   */
  service() {
    wx.makePhoneCall({
      phoneNumber: this.data.storeHead.storePhone,
    })
  },
  onLabel(e) {
    wx.navigateTo({
      url: `/nearbyShops/goodDetail/goodDetail?goodsId=${e.currentTarget.dataset.goodsId}&label=${e.currentTarget.dataset.id}`,
    })
  }

})