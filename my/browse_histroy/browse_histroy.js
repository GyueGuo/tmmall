const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否是长按
    is_long: false,
    list: [],
    page: 1,
    last_page: '',
    //当前选中item
    item: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color
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
    if (this.data.page != this.data.last_page) {
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
    http.post(app.globalData.record_goods, {
      page: this.data.page
    }).then(res => {
      if (this.data.page == 1) {
        this.setData({
          list: res.result.data,
          last_page: res.result.lastPage,
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
    if (!this.data.is_long) {
      wx.navigateTo({
        url: '/nearby_shops/good_detail/good_detail?goods_id=' + e.currentTarget.dataset.id,
      })
    }
    this.data.is_long = false
  },

  /**
   * 删除浏览记录
   */
  onDelectRecord(e) {
    this.data.item = e.currentTarget.dataset.item
    this.data.is_long = true
    this.selectComponent("#modal").showModal()
  },

  /**
   * 确认删除
   */
  confirmDelete() {
    http.post(app.globalData.delete_record, {
      recordGoodsId: this.data.item.record_goods_id + ''
    }).then(res => {
      app.showSuccessToast('删除成功', () => {
        for (let i = 0; i < this.data.list.length; i++) {
          for (let j = 0; j < this.data.list[i].list.length; j++) {
            if (this.data.list[i].list[j].record_goods_id == this.data.item.record_goods_id) {
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
    item['attr'] = item.attribute_list
    if (item.goods_number == 0) {
      app.showToast('该商品已经卖光了')
      return
    }
    if (item['attr'].length == 0) {
      http.encPost(app.globalData.cart_create, {
        storeId: item.store_id,
        goodsId: item.goods_id,
        goodsName: item.goods_name,
        file: item.cart_file,
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
        buy_type: 3
      })
      this.selectComponent("#buy_board").show()
    }
  },
})