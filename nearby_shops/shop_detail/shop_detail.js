const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    store_id: '',
    current_tab: 1,
    discount: '',
    //全部商品中的选项卡
    all_tab: 2,
    //两排一排显示
    columns: 1,
    //是否显示首页
    home_view: true,
    //店铺信息
    store_head: {},
    //搜索内容
    key: '',
    //首页分页
    index_page: 1,
    //首页推荐列表
    recommand_list: [],
    //首页推荐列表长度
    recommand_total: '',
    //全部商品分类
    all_page: 1,
    //全部商品列表
    all_list: [],
    //全部商品分类
    classify: [],
    //一级分类
    first_classify: '',
    //二级分类
    second_classify: '',
    //全部商品列表个数
    all_total: '',
    cart_total: 0,
    cart_list: [],
    cart_num: 0,
    cartNum: 0,
    //当前操作的plan b item id
    goods_id: '',
    //全部商品 价格排序
    rank: '',
    //新品
    new_page: 1,
    //新品列表
    new_list: [],
    //最后一页
    last_page: '',
    //动态
    article_page: 1,
    //动态列表
    article_list: [],
    //动态列表长度
    article_total: '',
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
        store_id: obj.store
      })
    } else {
      this.setData({
        store_id: options.store_id
      })
    }
    app.app_DIY(() => {}, this)
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
        this.data.goods_id = data.goods_id
      }
      console.log(this.data.goods_id)
      for (let i = 0, len = this.data.all_list.length; i < len; i++) {
        if (this.data.all_list[i].goods_id == this.data.goods_id) {
          this.data.all_list[i].cart_number += data.number
        }
      }
      this.setData({
        all_list: this.data.all_list
      })
      this.getCartList()
    })

    event.on('shopReduceCart', this, goods_id => {
      if (goods_id) {
        this.data.goods_id = goods_id
      }
      for (let i = 0, len = this.data.all_list.length; i < len; i++) {
        if (this.data.all_list[i].goods_id == this.data.goods_id) {
          this.data.all_list[i].cart_number--;
        }
      }
      this.setData({
        all_list: this.data.all_list
      })
      this.getCartList()
    })

    event.on('clearCart', this, () => {
      for (let i = 0, len = this.data.all_list.length; i < len; i++) {
        this.data.all_list[i].cart_number = 0
      }
      this.setData({
        cart_list: [],
        cartNum: 0,
        all_list: this.data.all_list
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
    switch (this.data.current_tab) {
      case 1:
        this.data.index_page = 1
        this.getStoreIndex()
        break;
      case 2:
        this.data.all_page = 1
        this.getAllGoods()
        break;
      case 3:
        this.data.new_page = 1
        this.getNewGoods()
        break;
      case 4:
        this.data.article_page = 1
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
      title: this.data.store_head.store_name,
      path: '/nearby_shops/shop_detail/shop_detail?store_id=' + this.data.store_id
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
    if (e.detail.scrollTop > 50 && (this.data.current_tab != 2 && this.data.store_head.goods_style != 1)) {
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
        b_left_scroll: true
      })
    } else {
      this.setData({
        b_left_scroll: false
      })
    }
  },

  bRightScroll(e) {
    if (e.detail.scrollTop > 0) {
      this.setData({
        b_right_scroll: true
      })
    } else {
      this.setData({
        b_right_scroll: false
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
      classify_board: false
    })
    wx.navigateTo({
      url: '/nearby_shops/search_in_shop/search_in_shop?classify_id=' + this.data.id + '&store_id=' + this.data.store_id + '&key=' + this.data.key,
    })
  },

  /**
   * 分类
   */
  onClassify() {
    wx.navigateTo({
      url: '/nearby_shops/shop_classify/shop_classify?store_id=' + this.data.store_id,
    })
  },

  /**
   * 首页
   */
  onHome() {
    this.setData({
      current_tab: 1,
      home_view: true,
      all_view: false,
      new_view: false,
      dynamic_view: false,
    })
  },

  /**
   * 全部商品
   */
  onAllGood() {
    this.setData({
      current_tab: 2,
      home_view: false,
      all_view: true,
      new_view: false,
      dynamic_view: false,
    })
    if (this.data.all_list.length == 0) {
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
    http.post(app.globalData.store_classify_list, {
      storeId: this.data.store_id
    }).then(res => {
      this.data.classify.push({
        store_goods_classify_id: '',
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
        if (item.store_goods_classify_id == this.data.classify[i].store_goods_classify_id) {
          this.data.classify[i]['select'] = true
        } else {
          this.data.classify[i]['select'] = false
        }
      }

    } else {
      // for (let i = 0, len = this.data.classify.length; i < len; i++) {
      //   this.data.classify[i]['select'] = false
      // }
    }
    this.setData({
      first_classify: item.store_goods_classify_id,
      second_classify: '',
      all_page: 1,
      all_list: [],
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
      second_classify: id,
      all_list: [],
      all_page: 1,
    })
    this.getAllGoods()
  },

  /**
   * 获取店铺购物车
   */
  getCartList() {
    http.post(app.globalData.cart_index, {
      storeId: this.data.store_id
    }, true).then(res => {
      if (res.result.length == 0) {
        this.setData({
          cart_list: [],
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
        cart_list: res.result[0].list,
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
    this.data.goods_id = dataset.item.goods_id
    if (dataset.item.attribute_list.length == 0) {
      http.encPost(app.globalData.cart_create, {
        storeId: this.data.store_id,
        goodsId: dataset.item.goods_id,
        goodsName: dataset.item.goods_name,
        file: dataset.item.cart_file,
        number: 1,
        productsId: '',
        attr: '',
        goodsAttr: '',
      }, true).then(res => {
        app.showToast('添加成功', () => {})
        this.data.all_list[dataset.index].cart_number++
          // for (let i = 0, len = this.data.all_list.length; i < len; i++) {
          //   if (this.data.all_list[i].goods_id == dataset.item.goods_id) {
          //     this.data.all_list[i].cart_number++
          //   }
          // }
          this.setData({
            all_list: this.data.all_list
          })
        this.getCartList()
        event.emit('refreshCart')
      })
    } else {
      dataset.item['attr'] = dataset.item.attribute_list
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
    this.data.goods_id = dataset.item.goods_id
    if (dataset.item.attribute_list.length != 0) {
      app.showToast('多规格商品请在购物车中减少')
      return
    }
    let cart_id = ''
    for (let i = 0, len = this.data.cart_list.length; i < len; i++) {
      if (this.data.cart_list[i].goods_id == dataset.item.goods_id) {
        cart_id = this.data.cart_list[i].cart_id
      }
    }
    if (dataset.item.cart_number > 1) {
      http.post(app.globalData.cart_reduce, {
        cartId: cart_id,
        number: 1
      }, true).then(res => {
        this.data.all_list[dataset.index].cart_number--;
        // for (let i = 0, len = this.data.all_list.length; i < len; i++) {
        //   if (this.data.all_list[i].goods_id == dataset.item.goods_id) {
        //     this.data.all_list[i].cart_number--
        //   }
        // }
        this.setData({
          all_list: this.data.all_list
        })
        this.getCartList()
        event.emit('refreshCart')
      })
    } else if (dataset.item.cart_number == 1) {
      console.log(cart_id)
      this.cart_delete(cart_id, dataset)
    }

  },

  /**
   * 删除商品
   */
  cart_delete(cart_id, dataset) {
    console.log(dataset)
    // return
    http.post(app.globalData.cart_delete, {
      cartId: cart_id
    }, true).then(res => {
      // this.data.all_list[dataset.index].cart_number = 0
      for (let i = 0, len = this.data.all_list.length; i < len; i++) {
        if (this.data.all_list[i].goods_id == dataset.item.goods_id) {
          this.data.all_list[i].cart_number = 0
          break;
        }
      }
      // for (let j = 0, len = this.data.cart_list.length; j < len; j++) {
      //   if (this.data.cart_list[j].goods_id == dataset.item.goods_id) {
      //     this.data.cart_list.splice(j, 1)
      //   }
      // }
      // let cart_list = this.data.cart_list.filter((val) => val.goods_id == dataset.item.goods_id)
      this.setData({
        all_list: this.data.all_list,
        // cart_list: cart_list
      })
      this.getCartList()
      this.triggerEvent("changeNum", this.data.change_num)
      event.emit('refreshCartNumber')
    })
  },

  /**
   * 监听结算列表删除
   */
  event_cart_delete(e) {
    let item = e.detail
    this.cart_delete(item.cart_id, item.item)
  },


  /**
   * 计算购物车价格
   */
  cartCalculate(e) {
    this.setData({
      cart_total: e.detail
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
    if (this.data.cart_list.length == 0) {
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
      current_tab: 3,
      home_view: false,
      all_view: false,
      new_view: true,
      dynamic_view: false,
    })
    if (this.data.new_list.length == 0) {
      this.getNewGoods()
    }
  },

  /**
   * 动态
   */
  onDynamic() {
    this.setData({
      current_tab: 4,
      home_view: false,
      all_view: false,
      new_view: false,
      dynamic_view: true,
    })
    if (this.data.article_list.length == 0) {
      this.getArticle()
    }
  },

  /**
   * 热门分类
   */
  onHotClassify() {
    if (this.data.classify_board) {
      this.setData({
        classify_board: false
      })
      return
    }
    http.post(app.globalData.store_hot_classify_list, {
      storeId: this.data.store_id
    }).then(res => {
      if (res.result.length == 0) {
        app.showToast('暂无热门分类')
        return
      }
      this.setData({
        hot_classify: res.result,
        classify_board: true
      })
    })

  },

  /**
   * 关闭分类
   */
  closeClassify() {
    this.setData({
      classify_board: false
    })
  },

  /**
   * 领取优惠券
   */
  receiveCoupon(e) {
    if (app.login()) {
      http.post(app.globalData.get_coupon, {
        couponId: e.currentTarget.dataset.id,
        storeId: this.data.store_id
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
      all_tab: 1,
      rank: '',
      all_page: 1
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
        all_tab: 2,
        rank: '',
        all_page: 1
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
        all_tab: 3,
        rank: this.data.rank,
        all_page: 1
      })
      this.getAllGoods()
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
   * 店铺详情
   */
  onShopIntro() {
    wx.navigateTo({
      url: '/nearby_shops/shop_intro/shop_intro?id=' + this.data.store_id,
    })
  },

  /**
   * 店铺头部
   */
  getStoreHead() {
    http.post(app.globalData.store_head, {
      storeId: this.data.store_id
    }).then(res => {
      this.setData({
        store_head: res.result,
        show: true
      })
      wx.setNavigationBarTitle({
        title: res.result.store_name,
      })
    })
  },

  /**
   * 获取店铺首页
   */
  getStoreIndex() {
    http.post(app.globalData.store_index, {
      storeId: this.data.store_id,
      page: this.data.index_page
    }).then(res => {
      if (this.data.index_page == 1) {
        this.setData({
          store_index: res.result,
          recommand_list: res.result.recommend.data,
          recommand_total: res.result.recommend.total,
        })
      } else {
        this.setData({
          recommand_list: [...this.data.recommand_list, ...res.result.recommend.data]
        })
      }
    })
  },

  /**
   * 获取全部商品
   */
  getAllGoods() {
    let recommend = this.data.all_tab == 1 ? 1 : '',
      parameter = ''
    if (this.data.all_tab == 2) {
      parameter = 'sales_volume'
    } else if (this.data.all_tab == 3) {
      parameter = 'shop_price'
    }
    http.postList(app.globalData.store_goods_list, {
      page: this.data.all_page,
      recommend: recommend,
      parameter: parameter,
      rank: this.data.rank,
      storeId: this.data.store_id,
      classifyId: this.data.second_classify == '' ? this.data.first_classify : this.data.second_classify,
    }).then(res => {
      if (this.data.all_page == 1) {
        this.setData({
          discount: res.discount == null ? 100 : res.discount,
          all_list: res.result.data,
          all_total: res.result.total,
        })
      } else {
        this.setData({
          all_list: [...this.data.all_list, ...res.result.data]
        })
      }
      // for (let i = 0, len = this.data.all_list.length; i < len; i++) {
      //   if (this.data.all_list[i].is_vip == 1) {
      //     this.data.all_list[i].shop_price = parseFloat(parseFloat(this.data.all_list[i].shop_price) * 0.01 * res.discount).toFixed(2)
      //   } else {
      //     this.data.all_list[i].shop_price = this.data.all_list[i].shop_price
      //   }
      // }
      this.setData({
        all_list: this.data.all_list
      })
    })
  },

  /**
   * 获取新品
   */
  getNewGoods() {
    http.post(app.globalData.new_product_list, {
      page: this.data.new_page,
      storeId: this.data.store_id,
    }).then(res => {
      if (this.data.new_page == 1) {
        this.setData({
          discount: res.discount == null ? 100 : res.discount,
          new_list: res.result.data,
          last_page: res.result.lastPage,
        })
      } else {
        if (this.data.new_list[this.data.new_list.length - 1].date == res.result.data[0].date) {
          this.data.new_list[this.data.new_list.length - 1].list = this.data.new_list[this.data.new_list.length - 1].list.concat(res.result.data[0].list)
          res.result.data.splice(0, 1)
        }
        this.setData({
          new_list: [...this.data.new_list, ...res.result.data]
        })
      }
    })
  },

  /**
   * 跳转商品
   */
  onGoods(e) {
    wx.navigateTo({
      url: '/nearby_shops/good_detail/good_detail?goods_id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 获取动态
   */
  getArticle() {
    http.post(app.globalData.store_article_list, {
      storeId: this.data.store_id,
      page: this.data.article_page
    }).then(res => {
      if (this.data.article_page == 1) {
        this.setData({
          article_list: res.result.data,
          atricle_total: res.result.total
        })
      } else {
        this.setData({
          article_list: [...this.data.article_list, ...res.result.data]
        })
      }
    })
  },

  /**
   * 动态详情
   */
  onArticleDetail(e) {
    wx.navigateTo({
      url: '/nearby_shops/dynamic_detail/dynamic_detail?id=' + e.currentTarget.dataset.id + '&store_id=' + this.data.store_id,
    })
  },

  /**
   * 关注店铺
   */
  collectStore() {
    let url = ''
    if (this.data.store_head.state == 0) {
      url = app.globalData.collect_store
    } else {
      url = app.globalData.store_index_delete
    }
    http.post(url, {
      storeId: this.data.store_id
    }).then(res => {
      if (this.data.store_head.state == 0) {
        this.data.store_head.state = 1
        this.data.store_head.collect++;
      } else {
        this.data.store_head.state = 0
        this.data.store_head.collect--;
      }
      this.setData({
        store_head: this.data.store_head
      })
      app.showSuccessToast(res.message)
    })
  },

  /**
   * 加载更多
   */
  loadMore() {
    switch (this.data.current_tab) {
      case 1:
        if (this.data.recommand_total > this.data.recommand_list.length) {
          this.data.index_page++;
          this.getStoreIndex()
        }
        break;
      case 2:
        if (this.data.all_total > this.data.all_list.length) {
          this.data.all_page++;
          this.getAllGoods()
        }
        break;
      case 3:
        if (this.data.last_page > this.data.new_page) {
          this.data.new_page++;
          this.getNewGoods()
        }
        break;
      case 4:
        if (this.data.article_total > this.data.article_list.length) {
          this.data.article_page++;
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
      phoneNumber: this.data.store_head.store_phone,
    })
    // let service_info = {
    //   store_title: this.data.store_head.store_name,
    //   TARGET_ID: this.data.store_id,
    //   DIVERSION_ID: '1002'
    // }
    // wx.navigateTo({
    //   url: '/my/service/service?service_info=' + JSON.stringify(service_info),
    // })
  },
  onLabel(e) {
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: `/nearby_shops/good_detail/good_detail?goods_id=${e.currentTarget.dataset.goods_id}&label=${e.currentTarget.dataset.id}`,
    })
  }

})