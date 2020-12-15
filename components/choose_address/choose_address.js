const app = getApp();
const http = require('../../utils/http.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: {
      type: Boolean,
      observer: function() {
        if (this.data.isShow) {
          this.fadeIn()
        } else {
          this.fadeOut()
        }
      }
    },
    address: {
      type: Object,
      observer: function() {
        if (this.data.address != null) {
          this.setData({
            province: this.data.address.province,
            province_id: this.data.address.province_id,
            city: this.data.address.city,
            city_id: this.data.address.city_id,
            area: this.data.address.area,
            area_id: this.data.address.area_id,
            street: this.data.address.street,
            street_id: this.data.address.street_id,
            parent_id: this.data.address.area_id,
            tab: 4
          })
          this._getData()
        }
      }
    }
  },
  ready(){
    this.setData({
      diy_color: app.globalData.diy_color
    })
  },

  /**
   * 组件的初始数据
   */
  data: {
    //透明度
    opacity: 0,
    province: '请选择',
    province_id: '',
    city: '',
    city_id: '',
    area: '',
    area_id: '',
    street: '',
    street_id: '',
    tab: 1,
    parent_id: 0,
    current_id: 'id'
  },

  attached: function() {
    this._getData()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 淡入效果
     */
    fadeIn() {
      let interval = setInterval(()=> {
        if (this.data.opacity >= 0.3) {
          clearInterval(interval)
        }
        this.setData({
          opacity: this.data.opacity + 0.01
        })
      }, 10)
    },

    /**
     * 淡出效果
     */
    fadeOut() {
      let interval = setInterval(()=> {
        if (this.data.opacity <= 0) {
          clearInterval(interval)
        }
        this.setData({
          opacity: this.data.opacity - 0.1
        })
      }, 100)
    },

    /**
     * 关闭弹窗
     */
    closeBoard() {
      this.setData({
        isShow: false
      })
    },
    /**
     * 获取数据
     */
    _getData() {
      http.post(app.globalData.address_linkage, {
        parentId: this.data.parent_id
      }).then(res=> {
        wx.hideLoading()
        if (this.data.tab == 4) {
          let obj = [{
            area_name: '暂不选择',
            area_id: null
          }]
          this.setData({
            list: [...obj, ...res.result]
          })
        } else {
          this.setData({
            list: res.result
          })
        }
        if (this.data.tab == 1) {
          this.setData({
            current_id: 'id-' + this.data.province_id,
          })
        } else if (this.data.tab == 2) {
          this.setData({
            city: this.data.city == '请选择' || this.data.city == '' ? '请选择' : this.data.city,
            current_id: 'id-' + this.data.city_id,
          })
        } else if (this.data.tab == 3) {
          this.setData({
            area: this.data.area == '请选择' || this.data.area == '' ? '请选择' : this.data.area,
            current_id: 'id-' + this.data.area_id,
          })
        } else if (this.data.tab == 4) {
          this.setData({
            street: this.data.street == '请选择' || this.data.street == '' ? '请选择' : this.data.street,
            current_id: 'id-' + this.data.street_id,
          })
        }
      })
    },

    /**
     * 点击
     */
    _onItem(e) {
      let item = e.currentTarget.dataset.item
      this.data.parent_id = item.area_id
      wx.showLoading({
        title: '加载中',
        mask:true
      })
      if (this.data.tab == 1) {
        this.setData({
          province: item.area_name,
          province_id: item.area_id,
          city: '请选择',
          area: '',
          street: '',
          tab: 2
        })
        this._getData()
      } else if (this.data.tab == 2) {
        this.setData({
          city: item.area_name,
          city_id: item.area_id,
          area: '请选择',
          street: '',
          tab: 3
        })
        this._getData()
      } else if (this.data.tab == 3) {
        this.setData({
          area: item.area_name,
          area_id: item.area_id,
          street: '请选择',
          tab: 4
        })
        this._getData()
      } else if (this.data.tab == 4) {
        this.setData({
          street: item.area_name,
          street_id: item.area_id,
        })
        this.closeBoard()
        let address = {
          province: this.data.province,
          province_id: this.data.province_id,
          city: this.data.city,
          city_id: this.data.city_id,
          area: this.data.area,
          area_id: this.data.area_id,
          street: item.area_id != null ? this.data.street : '',
          street_id: item.area_id != null ? this.data.street_id : '',
        }
        this.triggerEvent('confirmAddress', address)
      }
    },

    /**
     * 重新选择省份
     */
    _chooseProvince() {
      this.setData({
        tab: 1,
        parent_id: 0,
      })
      this._getData()
    },

    /**
     * 重新选择市
     */
    _chooseCity() {
      this.setData({
        tab: 2,
        parent_id: this.data.province_id,
      })
      this._getData()
    },

    /**
     * 重新选择区域
     */
    _chooseArea() {
      this.setData({
        tab: 3,
        parent_id: this.data.city_id,
      })
      this._getData()
    },

    /**
     * 重新选择街道
     */
    _chooseDetail() {
      this.setData({
        tab: 4,
        parent_id: this.data.area_id,
      })
      this._getData()
    },
  }
})