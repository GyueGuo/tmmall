const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否是长按
    isLong: false,
    list: [],
    page: 1,
    lastPage: '',
    //当前选中item
    item: {}
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
    this.getData()
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
    this.data.page = 1
    this.getData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.page != this.data.lastPage) {
      this.data.page++;
      this.getData()
    }
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
   * 获取数据
   */
  getData() {
    http.post(app.globalData.recordGoods, {
      page: this.data.page
    }).then(res => {
      if (this.data.page == 1) {
        this.setData({
          list: res.result.data,
          lastPage: res.result.lastPage,
          discount: res.discount == null ? 100 : res.discount,
        })
      } else {
        if (this.data.list[this.data.list.length - 1].date == res.result.data[0].date) {
          this.data.list[this.data.list.length - 1].list = this.data.list[this.data.list.length - 1].list.concat(res.result.data[0].list)
          res.result.data.splice(0, 1)
        }
        this.setData({
          list: [...this.data.list, ...res.result.data]
        })
      }
    })
  },

  /**
   * 商品详情
   */
  onGoods(e) {
    if (!this.data.isLong) {
      wx.navigateTo({
        url: '/nearbyShops/goodDetail/goodDetail?goodsId=' + e.currentTarget.dataset.id,
      })
    }
    this.data.isLong = false
  },

  /**
   * 删除浏览记录
   */
  onDelectRecord(e) {
    this.data.item = e.currentTarget.dataset.item
    this.data.isLong = true
    this.selectComponent("#modal").showModal()
  },

  /**
   * 确认删除
   */
  confirmDelete() {
    http.post(app.globalData.deleteRecord, {
      recordGoodsId: this.data.item.recordGoodsId + ''
    }).then(res => {
      app.showSuccessToast('删除成功', () => {
        for (let i = 0; i < this.data.list.length; i++) {
          for (let j = 0; j < this.data.list[i].list.length; j++) {
            if (this.data.list[i].list[j].recordGoodsId == this.data.item.recordGoodsId) {
              this.data.list[i].list.splice(j, 1)
            }
          }
        }
        this.setData({
          list: this.data.list
        })
      })
    })
  },

  addCart(e) {
    if (!app.login()) {
      return
    }
    let item = e.currentTarget.dataset.item
    item['attr'] = item.attributeList
    if (item.goodsNumber == 0) {
      app.showToast('该商品已经卖光了')
      return
    }
    if (item['attr'].length == 0) {
      http.encPost(app.globalData.cartCreate, {
        storeId: item.storeId,
        goodsId: item.goodsId,
        goodsName: item.goodsName,
        file: item.cartFile,
        number: 1,
        productsId: '',
        attr: '',
        goodsAttr: ''
      }).then(res => {
        event.emit('refreshCart')
        event.emit('refreshCartNumber')
        app.showSuccessToast('添加购物车成功')
      })
    } else {
      this.selectComponent("#buy_board").resetAll()
      this.setData({
        info: item,
        buyType: 3
      })
      this.selectComponent("#buy_board").show()
    }
  },
})