const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
const navBar = require('../../components/navBar/navBar.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_edit_state: false, //是否是编辑状态 true 编辑 false未编辑
    is_login: true, //是否登录 true 已登陆 false未登录
    cart_list: [], //购物车列表
    lost_list: [], //失效宝贝
    lost_count: 0, //失效商品数量
    cart_info: { //购物车信息
      total: '0.00', //选中购物车总价
      count: 0, //选中购物车总数量
      totalNum: 0 //合计数量
    },
    select_all: false, //全选状态
    shop_index: '', //当前店铺索引
    good_index: '', //当前商品索引
    address: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      configSwitch: app.globalData.configSwitch,
      model: app.globalData.model
    })
    navBar.tabbar("tabBar", app.globalData.isShops == 0 && this.data.configSwitch.version_info.one_more == 1 ? 3 : 2, this) // 3购物车 多店3，单店2
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    event.on('refreshCart', this, () => {
      this.getCartList()
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getCartList()
    //是否登录
    if (app.globalData.member_id == '' || app.globalData.phone == '') {
      this.setData({
        is_login: false
      })
    } else {
      this.setData({
        is_login: true
      })
    }
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
    event.remove('refreshCart', this)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getCartList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 登录
   */
  login() {
    app.login()
  },

  /**
   * 页面滑动
   */
  onPageScroll(e) {
    //返回顶部
    if (e.scrollTop > 100) {
      this.selectComponent("#go_top").rise()
    } else {
      this.selectComponent("#go_top").decline()
    }
  },

  /**
   * 回到顶部
   */
  onBackTop() {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },

  /**
   * 获取购物车数据
   */
  getCartList() {
    http.postList(app.globalData.cart_index, {
      storeId: ''
    }).then(res => {
      let totalNum = 0
      for (let i = 0, len = res.result.length; i < len; i++) {
        res.result[i]['select'] = false
        for (let j = 0, j_len = res.result[i].list.length; j < j_len; j++) {
          res.result[i].list[j]['select'] = false
          totalNum++;
        }
      }
      this.setData({
        cart_list: res.result,
        lost_count: res.lostCount,
        lost_list: res.lost,
        recommend_list: res.recommendList,
        discount: res.discount == null ? 100 : res.discount,
        select_all: false,
        'cart_info.totalNum': totalNum
      })

      if (this.data.cart_list.length == 0) {
        this.setData({
          is_edit_state: false
        })
      }

      this.onCalculate()
    })
  },

  /**
   * 添加数量
   */
  onAddNumber(e) {
    let cart_id = e.currentTarget.dataset.id,
      shop_index = e.currentTarget.dataset.shopdex,
      good_index = e.currentTarget.dataset.gooddex;
    http.post(app.globalData.cart_add, {
      cartId: cart_id,
      number: 1
    }).then(res => {
      this.data.cart_list[shop_index].list[good_index].number++
        this.setData({
          cart_list: this.data.cart_list
        })
      this.onCalculate()
    })
  },

  /**
   * 减少数量
   */
  onMinusNumber(e) {
    let cart_id = e.currentTarget.dataset.id,
      shop_index = e.currentTarget.dataset.shopdex,
      good_index = e.currentTarget.dataset.gooddex
    if (this.data.cart_list[shop_index].list[good_index].number > 1) {
      http.post(app.globalData.cart_reduce, {
        cartId: cart_id,
        number: 1
      }).then(res => {
        this.data.cart_list[shop_index].list[good_index].number--;
        this.setData({
          cart_list: this.data.cart_list
        })
        this.onCalculate()
      })
    }
  },

  /**
   * 选中店铺
   */
  onSelectShop(e) {
    let index = e.currentTarget.dataset.index
    //是否选中
    this.data.cart_list[index]['select'] = !this.data.cart_list[index]['select']
    for (let i = 0, len = this.data.cart_list[index].list.length; i < len; i++) {
      if (this.data.cart_list[index].list[i].inventory != 0) {
        this.data.cart_list[index].list[i]['select'] = this.data.cart_list[index]['select']
      }
    }
    this.setData({
      cart_list: this.data.cart_list
    })
    this.selectStatus()
    this.onCalculate()
  },

  /**
   * 选中商品
   */
  onSelectGood(e) {
    let shop_index = e.currentTarget.dataset.shopdex,
      good_index = e.currentTarget.dataset.gooddex
    this.data.cart_list[shop_index].list[good_index]['select'] = !this.data.cart_list[shop_index].list[good_index]['select']
    let select = this.data.cart_list[shop_index].list[0].select
    for (let i = 0, len = this.data.cart_list[shop_index].list.length; i < len; i++) {
      select = select && this.data.cart_list[shop_index].list[i].select
    }
    this.data.cart_list[shop_index].select = select
    this.setData({
      cart_list: this.data.cart_list
    })
    this.selectStatus()
    this.onCalculate()
  },

  /**
   * 全选
   */
  onSelectAll() {
    for (let i = 0, len = this.data.cart_list.length; i < len; i++) {
      this.data.cart_list[i].select = !this.data.select_all
      for (let j = 0, j_len = this.data.cart_list[i].list.length; j < j_len; j++) {
        this.data.cart_list[i].list[j].select = !this.data.select_all
      }
    }
    this.setData({
      cart_list: this.data.cart_list,
      select_all: !this.data.select_all
    })
    this.onCalculate()
  },

  /**
   * 判断是否全选
   */
  selectStatus() {
    let select = this.data.cart_list[0].select
    for (let i = 0, len = this.data.cart_list.length; i < len; i++) {
      select = select && this.data.cart_list[i].select
    }
    this.setData({
      select_all: select
    })
  },

  /**
   * 优惠券
   */
  onCoupon(e) {
    let item = e.currentTarget.dataset.item
    let goods_classify_id_arr = item.list.map((val) => val = val.goods_classify_id).filter((item, idx, val) => val.indexOf(item) === idx)
    let goods_id_arr = item.list.map((val) => val = val.goods_id).filter((item, idx, val) => val.indexOf(item) === idx)
    let obj = {
      store_id: item.store_id,
      goods_classify_id: goods_classify_id_arr.join(','),
      goods_id: goods_id_arr.join(',')
    }
    this.selectComponent("#receive_coupon").getCouponList(item.store_id, goods_classify_id_arr.join(','))
    // this.selectComponent("#receive_coupon").getCouponList(obj)
  },
  /**
   * 编辑商品
   */
  onEdit() {
    if (this.data.is_edit_state) {
      this.setData({
        is_edit_state: false
      })
    } else {
      this.setData({
        is_edit_state: true
      })
    }
  },
  onRedact(e) {
    let goods_id = e.currentTarget.dataset.goodid,
      shop_index = e.currentTarget.dataset.shopdex,
      good_index = e.currentTarget.dataset.gooddex;
    http.post(app.globalData.cart_attr, {
      goodsId: goods_id
    }).then(res => {
      let good_info = this.data.cart_list[shop_index].list[good_index]
      good_info['attrs'] = res.result.attr;
      this.selectComponent("#change_attr").show(good_info)
      this.setData({
        edit_state: false,
        cart_list: this.data.cart_list
      })
    })
  },

  /**
   * 删除购物车商品
   */
  onDelGood(e) {
    let cart_id = []
    for (let i = 0, len = this.data.cart_list.length; i < len; i++) {
      for (let j = 0, j_len = this.data.cart_list[i].list.length; j < j_len; j++) {
        if (this.data.cart_list[i].list[j].select) {
          cart_id.push(this.data.cart_list[i].list[j].cart_id)
        }
      }
    }
    if (cart_id.length == 0) {
      app.showToast('请选择商品')
      return
    }
    this.onCartDelete(cart_id.join())
  },

  /**
   * 确定修改
   */
  confirmChange(e) {
    this.setData({
      cart_list: this.data.cart_list
    })
    let info = e.detail
    //合并购物车
    for (let i = 0, len = this.data.cart_list.length; i < len; i++) {
      for (let j = 0, j_len = this.data.cart_list[i].list.length; j < j_len; j++) {
        if (this.data.cart_list[i].list[j].cart_id != info.cart_id && this.data.cart_list[i].list[j].goods_id == info.goods_id && this.data.cart_list[i].list[j].goods_attr == info.goods_attr) {
          this.onCartDelete(this.data.cart_list[i].list[j].cart_id)
        }
      }
    }
    this.onCalculate()
  },
  /**
   * 移入收藏
   */
  collect() {
    let goods_id = []
    let cart_id = []
    for (let i = 0, len = this.data.cart_list.length; i < len; i++) {
      for (let j = 0, j_len = this.data.cart_list[i].list.length; j < j_len; j++) {
        if (this.data.cart_list[i].list[j].select) {
          goods_id.push(this.data.cart_list[i].list[j].goods_id)
          cart_id.push(this.data.cart_list[i].list[j].cart_id)
        }
      }
    }
    if (goods_id.length == 0) {
      app.showToast('请选择商品')
      return
    }
    http.post(app.globalData.cart_collect, {
      goodsId: goods_id.join(),
      cartId: cart_id.join()
    }).then(res => {
      app.showSuccessToast('收藏成功')
      this.getCartList()
      if (this.data.cart_list.length == 0) {
        this.setData({
          is_edit_state: false
        })
      }
    })
  },

  /**
   * 删除购物车
   */
  onCartDelete(cart_id) {
    http.post(app.globalData.cart_delete, {
      cartId: cart_id
    }).then(res => {
      app.showSuccessToast('删除成功')
      event.emit('refreshCartNumber')
      this.getCartList()
    })
  },

  /**
   * 计算价格
   */
  onCalculate() {
    let total = 0,
      num = 0,
      cart_num = 0
    for (let i = 0, len = this.data.cart_list.length; i < len; i++) {
      for (let j = 0, j_len = this.data.cart_list[i].list.length; j < j_len; j++) {
        if (this.data.cart_list[i].list[j].select) {
          total += this.data.cart_list[i].list[j].price * this.data.cart_list[i].list[j].number
          num++;
          cart_num += this.data.cart_list[i].list[j].number
        }
      }
    }
    this.data.cart_info.total = total.toFixed(2)
    this.data.cart_info.count = num
    this.data.cart_info.cart_num = cart_num
    this.setData({
      cart_info: this.data.cart_info
    })
  },
  /**
   * 去首页
   */
  onHome() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },

  /**
   * 店铺详情
   */
  onShop(e) {
    wx.navigateTo({
      url: '/nearby_shops/shop_detail/shop_detail?store_id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 商品详情
   */
  onGood(e) {
    if (!this.data.is_edit_state) {
      wx.navigateTo({
        url: '/nearby_shops/good_detail/good_detail?goods_id=' + e.currentTarget.dataset.id,
      })
    }
  },

  /**
   * 去结算
   */
  settleAccount() {
    let cart_id = []
    for (let i = 0, len = this.data.cart_list.length; i < len; i++) {
      for (let j = 0, j_len = this.data.cart_list[i].list.length; j < j_len; j++) {
        if (this.data.cart_list[i].list[j].select) {
          cart_id.push(this.data.cart_list[i].list[j].cart_id)
        }
      }
    }
    if (cart_id.length == 0) {
      app.showToast('请选择结算商品')
      return
    }
    wx.navigateTo({
      url: '/pages/cart_confirm_order/cart_confirm_order?cart_id=' + cart_id.join(),
    })
  },

  /**
   * 清空失效宝贝
   */
  clearLostGoods() {
    let cart_id = ''
    for (let i = 0, len = this.data.lost_list.length; i < len; i++) {
      cart_id += this.data.lost_list[i].cart_id
      if (i != this.data.lost_list.length - 1) {
        cart_id += ','
      }
    }
    http.post(app.globalData.cart_delete, {
      cartId: cart_id
    }).then(res => {
      app.showSuccessToast('清空成功')
      this.setData({
        lost_list: [],
        lost_count: 0
      })
    })
  },

  addCart(e) {
    console.log(e)
    this.setData({
      info: e.detail,
    })
    let obj = {
      order_type: 1
    }
    this.selectComponent("#buy_board").show(obj)
  },
  route(e) {
    if (e.currentTarget.dataset.item.id == 4) {
      wx.stopPullDownRefresh()
      wx.startPullDownRefresh()
    }
  }
})