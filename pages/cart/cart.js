const app = getApp();
import http from '../../utils/http';
const event = require('../../utils/event.js');
const navBar = require('../../components/navBar/navBar.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEditState: false, //是否是编辑状态 true 编辑 false未编辑
    isLogin: true, //是否登录 true 已登陆 false未登录
    cartList: [], //购物车列表
    lostList: [], //失效宝贝
    lostCount: 0, //失效商品数量
    cartInfo: { //购物车信息
      total: '0.00', //选中购物车总价
      count: 0, //选中购物车总数量
      totalNum: 0 //合计数量
    },
    selectAll: false, //全选状态
    shopIndex: '', //当前店铺索引
    goodIndex: '', //当前商品索引
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
    navBar.tabbar("tabBar", app.globalData.isShops == 0 && this.data.configSwitch.versionInfo.oneMore == 1 ? 3 : 2, this) // 3购物车 多店3，单店2
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
    if (app.globalData.memberId == '' || app.globalData.phone == '') {
      this.setData({
        isLogin: false
      })
    } else {
      this.setData({
        isLogin: true
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
    http.postList(app.globalData.cartIndex, {
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
        cartList: res.result,
        lostCount: res.lostCount,
        lostList: res.lost,
        recommendList: res.recommendList,
        discount: res.discount == null ? 100 : res.discount,
        selectAll: false,
        'cartInfo.totalNum': totalNum
      })

      if (this.data.cartList.length == 0) {
        this.setData({
          isEditState: false
        })
      }

      this.onCalculate()
    })
  },

  /**
   * 添加数量
   */
  onAddNumber(e) {
    let cartId = e.currentTarget.dataset.id,
      shopIndex = e.currentTarget.dataset.shopdex,
      goodIndex = e.currentTarget.dataset.gooddex;
    http.post(app.globalData.cartAdd, {
      cartId: cartId,
      number: 1
    }).then(res => {
      this.data.cartList[shopIndex].list[goodIndex].number++
        this.setData({
          cartList: this.data.cartList
        })
      this.onCalculate()
    })
  },

  /**
   * 减少数量
   */
  onMinusNumber(e) {
    let cartId = e.currentTarget.dataset.id,
      shopIndex = e.currentTarget.dataset.shopdex,
      goodIndex = e.currentTarget.dataset.gooddex
    if (this.data.cartList[shopIndex].list[goodIndex].number > 1) {
      http.post(app.globalData.cartReduce, {
        cartId: cartId,
        number: 1
      }).then(res => {
        this.data.cartList[shopIndex].list[goodIndex].number--;
        this.setData({
          cartList: this.data.cartList
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
    this.data.cartList[index]['select'] = !this.data.cartList[index]['select']
    for (let i = 0, len = this.data.cartList[index].list.length; i < len; i++) {
      if (this.data.cartList[index].list[i].inventory != 0) {
        this.data.cartList[index].list[i]['select'] = this.data.cartList[index]['select']
      }
    }
    this.setData({
      cartList: this.data.cartList
    })
    this.selectStatus()
    this.onCalculate()
  },

  /**
   * 选中商品
   */
  onSelectGood(e) {
    let shopIndex = e.currentTarget.dataset.shopdex,
      goodIndex = e.currentTarget.dataset.gooddex
    this.data.cartList[shopIndex].list[goodIndex]['select'] = !this.data.cartList[shopIndex].list[goodIndex]['select']
    let select = this.data.cartList[shopIndex].list[0].select
    for (let i = 0, len = this.data.cartList[shopIndex].list.length; i < len; i++) {
      select = select && this.data.cartList[shopIndex].list[i].select
    }
    this.data.cartList[shopIndex].select = select
    this.setData({
      cartList: this.data.cartList
    })
    this.selectStatus()
    this.onCalculate()
  },

  /**
   * 全选
   */
  onSelectAll() {
    for (let i = 0, len = this.data.cartList.length; i < len; i++) {
      this.data.cartList[i].select = !this.data.selectAll
      for (let j = 0, j_len = this.data.cartList[i].list.length; j < j_len; j++) {
        this.data.cartList[i].list[j].select = !this.data.selectAll
      }
    }
    this.setData({
      cartList: this.data.cartList,
      selectAll: !this.data.selectAll
    })
    this.onCalculate()
  },

  /**
   * 判断是否全选
   */
  selectStatus() {
    let select = this.data.cartList[0].select
    for (let i = 0, len = this.data.cartList.length; i < len; i++) {
      select = select && this.data.cartList[i].select
    }
    this.setData({
      selectAll: select
    })
  },

  /**
   * 优惠券
   */
  onCoupon(e) {
    let item = e.currentTarget.dataset.item
    let goodsClassifyIdArr = item.list.map((val) => val = val.goodsClassifyId).filter((item, idx, val) => val.indexOf(item) === idx)
    this.selectComponent("#receive_coupon").getCouponList(item.storeId, goodsClassifyIdArr.join(','))
  },
  /**
   * 编辑商品
   */
  onEdit() {
    if (this.data.isEditState) {
      this.setData({
        isEditState: false
      })
    } else {
      this.setData({
        isEditState: true
      })
    }
  },
  onRedact(e) {
    let goodsId = e.currentTarget.dataset.goodid,
      shopIndex = e.currentTarget.dataset.shopdex,
      goodIndex = e.currentTarget.dataset.gooddex;
    http.post(app.globalData.cartAttr, {
      goodsId: goodsId
    }).then(res => {
      let goodInfo = this.data.cartList[shopIndex].list[goodIndex]
      goodInfo['attrs'] = res.result.attr;
      this.selectComponent("#change_attr").show(goodInfo)
      this.setData({
        editState: false,
        cartList: this.data.cartList
      })
    })
  },

  /**
   * 删除购物车商品
   */
  onDelGood(e) {
    let cartId = []
    for (let i = 0, len = this.data.cartList.length; i < len; i++) {
      for (let j = 0, j_len = this.data.cartList[i].list.length; j < j_len; j++) {
        if (this.data.cartList[i].list[j].select) {
          cartId.push(this.data.cartList[i].list[j].cartId)
        }
      }
    }
    if (cartId.length == 0) {
      app.showToast('请选择商品')
      return
    }
    this.onCartDelete(cartId.join())
  },

  /**
   * 确定修改
   */
  confirmChange(e) {
    this.setData({
      cartList: this.data.cartList
    })
    let info = e.detail
    //合并购物车
    for (let i = 0, len = this.data.cartList.length; i < len; i++) {
      for (let j = 0, j_len = this.data.cartList[i].list.length; j < j_len; j++) {
        if (this.data.cartList[i].list[j].cartId != info.cartId && this.data.cartList[i].list[j].goodsId == info.goodsId && this.data.cartList[i].list[j].goodsAttr == info.goodsAttr) {
          this.onCartDelete(this.data.cartList[i].list[j].cartId)
        }
      }
    }
    this.onCalculate()
  },
  /**
   * 移入收藏
   */
  collect() {
    let goodsId = []
    let cartId = []
    for (let i = 0, len = this.data.cartList.length; i < len; i++) {
      for (let j = 0, j_len = this.data.cartList[i].list.length; j < j_len; j++) {
        if (this.data.cartList[i].list[j].select) {
          goodsId.push(this.data.cartList[i].list[j].goodsId)
          cartId.push(this.data.cartList[i].list[j].cartId)
        }
      }
    }
    if (goodsId.length == 0) {
      app.showToast('请选择商品')
      return
    }
    http.post(app.globalData.cartCollect, {
      goodsId: goodsId.join(),
      cartId: cartId.join()
    }).then(res => {
      app.showSuccessToast('收藏成功')
      this.getCartList()
      if (this.data.cartList.length == 0) {
        this.setData({
          isEditState: false
        })
      }
    })
  },

  /**
   * 删除购物车
   */
  onCartDelete(cartId) {
    http.post(app.globalData.cartDelete, {
      cartId: cartId
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
      cartNum = 0
    for (let i = 0, len = this.data.cartList.length; i < len; i++) {
      for (let j = 0, j_len = this.data.cartList[i].list.length; j < j_len; j++) {
        if (this.data.cartList[i].list[j].select) {
          total += this.data.cartList[i].list[j].price * this.data.cartList[i].list[j].number
          num++;
          cartNum += this.data.cartList[i].list[j].number
        }
      }
    }
    this.data.cartInfo.total = total.toFixed(2)
    this.data.cartInfo.count = num
    this.data.cartInfo.cartNum = cartNum
    this.setData({
      cartInfo: this.data.cartInfo
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
      url: '/nearbyShops/shopDetail/shopDetail?storeId=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 商品详情
   */
  onGood(e) {
    if (!this.data.isEditState) {
      wx.navigateTo({
        url: '/nearbyShops/goodDetail/goodDetail?goodsId=' + e.currentTarget.dataset.id,
      })
    }
  },

  /**
   * 去结算
   */
  settleAccount() {
    let cartId = []
    for (let i = 0, len = this.data.cartList.length; i < len; i++) {
      for (let j = 0, j_len = this.data.cartList[i].list.length; j < j_len; j++) {
        if (this.data.cartList[i].list[j].select) {
          cartId.push(this.data.cartList[i].list[j].cartId)
        }
      }
    }
    if (cartId.length == 0) {
      app.showToast('请选择结算商品')
      return
    }
    wx.navigateTo({
      url: '/pages/cartConfirmOrder/cartConfirmOrder?cartId=' + cartId.join(),
    })
  },

  /**
   * 清空失效宝贝
   */
  clearLostGoods() {
    let cartId = ''
    for (let i = 0, len = this.data.lostList.length; i < len; i++) {
      cartId += this.data.lostList[i].cartId
      if (i != this.data.lostList.length - 1) {
        cartId += ','
      }
    }
    http.post(app.globalData.cartDelete, {
      cartId: cartId
    }).then(res => {
      app.showSuccessToast('清空成功')
      this.setData({
        lostList: [],
        lostCount: 0
      })
    })
  },

  addCart(e) {
    this.setData({
      info: e.detail,
    })
    let obj = {
      orderType: 1
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