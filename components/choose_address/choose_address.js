const app = getApp();
import http from '../../utils/http';
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
            provinceId: this.data.address.provinceId,
            city: this.data.address.city,
            cityId: this.data.address.cityId,
            area: this.data.address.area,
            areaId: this.data.address.areaId,
            street: this.data.address.street,
            streetId: this.data.address.streetId,
            parentId: this.data.address.areaId,
            tab: 4
          })
          this._getData()
        }
      }
    }
  },
  ready(){
    this.setData({
      diyColor: app.globalData.diyColor
    })
  },

  /**
   * 组件的初始数据
   */
  data: {
    //透明度
    opacity: 0,
    province: '请选择',
    provinceId: '',
    city: '',
    cityId: '',
    area: '',
    areaId: '',
    street: '',
    streetId: '',
    tab: 1,
    parentId: 0,
    currentId: 'id'
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
      http.post(app.globalData.addressLinkage, {
        parentId: this.data.parentId
      }).then(res=> {
        wx.hideLoading()
        if (this.data.tab == 4) {
          let obj = [{
            areaName: '暂不选择',
            areaId: null
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
            currentId: 'id-' + this.data.provinceId,
          })
        } else if (this.data.tab == 2) {
          this.setData({
            city: this.data.city == '请选择' || this.data.city == '' ? '请选择' : this.data.city,
            currentId: 'id-' + this.data.cityId,
          })
        } else if (this.data.tab == 3) {
          this.setData({
            area: this.data.area == '请选择' || this.data.area == '' ? '请选择' : this.data.area,
            currentId: 'id-' + this.data.areaId,
          })
        } else if (this.data.tab == 4) {
          this.setData({
            street: this.data.street == '请选择' || this.data.street == '' ? '请选择' : this.data.street,
            currentId: 'id-' + this.data.streetId,
          })
        }
      })
    },

    /**
     * 点击
     */
    _onItem(e) {
      let item = e.currentTarget.dataset.item
      this.data.parentId = item.areaId
      wx.showLoading({
        title: '加载中',
        mask:true
      })
      if (this.data.tab == 1) {
        this.setData({
          province: item.areaName,
          provinceId: item.areaId,
          city: '请选择',
          area: '',
          street: '',
          tab: 2
        })
        this._getData()
      } else if (this.data.tab == 2) {
        this.setData({
          city: item.areaName,
          cityId: item.areaId,
          area: '请选择',
          street: '',
          tab: 3
        })
        this._getData()
      } else if (this.data.tab == 3) {
        this.setData({
          area: item.areaName,
          areaId: item.areaId,
          street: '请选择',
          tab: 4
        })
        this._getData()
      } else if (this.data.tab == 4) {
        this.setData({
          street: item.areaName,
          streetId: item.areaId,
        })
        this.closeBoard()
        let address = {
          province: this.data.province,
          provinceId: this.data.provinceId,
          city: this.data.city,
          cityId: this.data.cityId,
          area: this.data.area,
          areaId: this.data.areaId,
          street: item.areaId != null ? this.data.street : '',
          streetId: item.areaId != null ? this.data.streetId : '',
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
        parentId: 0,
      })
      this._getData()
    },

    /**
     * 重新选择市
     */
    _chooseCity() {
      this.setData({
        tab: 2,
        parentId: this.data.provinceId,
      })
      this._getData()
    },

    /**
     * 重新选择区域
     */
    _chooseArea() {
      this.setData({
        tab: 3,
        parentId: this.data.cityId,
      })
      this._getData()
    },

    /**
     * 重新选择街道
     */
    _chooseDetail() {
      this.setData({
        tab: 4,
        parentId: this.data.areaId,
      })
      this._getData()
    },
  }
})