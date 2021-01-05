const app = getApp();
const http = require('../../utils/http.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  ready(){
    this.setData({
      zColor: app.globalData.diyColor
    })
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    show(price,avatar) {
      this.setData({
        show: true,
        price:price,
        avatar:avatar
      })
    },
    closeBoard() {
      this.setData({
        show: false
      })
      http.post(app.globalData.appletMySaveFormId, {
        microFormId: this.data.formId
      })
    },
    formId(e) {
      this.data.formId = e.detail.formId
    }
  }
})