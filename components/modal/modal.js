// components/modal/modal.js
const app = getApp();
const http = require('../../utils/http.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String,
    content: String,
    tip: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false
  },
  ready() {
    this.setData({
      diyColor: app.globalData.diyColor
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //隐藏弹框
    hideModal() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    //展示弹框
    showModal(e) {
      console.log(e)
      this.setData({
        data: e,
        isShow: !this.data.isShow
      })
    },

    /**
     * 确定
     */
    _onConfirm() {
      this.setData({
        isShow: false
      })
      http.post(app.globalData.appletMySaveFormId, {
        microFormId: this.data.formId
      }).then(res => { })
      this.triggerEvent("confirm", this.data.data)
    },

    /**
     * 取消
     */
    _onCancel() {
      this.setData({
        isShow: false
      })
      this.triggerEvent("cancel")
    },
    formId(e) {
      this.data.formId = e.detail.formId
    }
  }
})