const app = getApp();
import http from '../../utils/http';
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    opacity: 0,
    parentId: '',
    areaList: [],
    list: [],
    //当前选中的门店
    selectPick: {}
  },
  ready(){
    this.setData({
      diyColor: app.globalData.diyColor
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 弹出动画
     */
    showAnimation(anim) {
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      animation.translateY(-wx.getSystemInfoSync().windowHeight)
      this.setData({
        animation: animation.step(),
        isShow: true
      })
      this.fadeIn()
    },

    /**
     * 关闭动画
     */
    hiddenAnimation() {
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      animation.translateY(wx.getSystemInfoSync().windowHeight)
      this.setData({
        animation: animation.step(),
        isShow: false
      })
      this.fadeOut()
    },

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

    _closeBoard() {
      this.hiddenAnimation()
    },
    /**
     * id 当前自提点id
     * list 自提点列表
     * 市区id
     */
    show(id, list, parentId, selectPick) {
      this.setData({
        list,
        id,
        selectPick,
        parentId,
      })
      this.showAnimation()
    },

    getAreaList() {
      http.post(app.globalData.addressLinkage, {
        parentId: this.data.parentId
      }).then(res=> {
        this.setData({
          areaList: res.result
        })
      })
    },

    /**
     * 选择地区
     */
    selectArea(e) {
      http.post(app.globalData.takeList, {
        storeId: this.data.storeId,
        area: this.data.areaList[e.detail.value].areaName,
        lat: '0',
        lng: '0',
        keyword: ''
      }).then(res=> {
        this.setData({
          list: res.result,
          area: this.data.areaList[e.detail.value].areaName,
        })
      })
    },

    /**
     * 选择自提点
     */
    selectPick(e) {
      this.setData({
        id: e.currentTarget.dataset.id,
        selectPick: e.currentTarget.dataset.item
      })
    },

    /**
     * 确认
     */
    confirmSelect() {
      this.hiddenAnimation()
      this.triggerEvent("selectPick", this.data.selectPick)
    }
  }
})