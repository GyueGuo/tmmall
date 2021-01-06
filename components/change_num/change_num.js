const app = getApp();
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
    changeNum: '',
    inventory: ''
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
    show(changeNum, inventory) {
      this.setData({
        show: true,
        changeNum,
        inventory,
      })
    },

    /**
     * 减少数量
     */
    onChangeMinus() {
      if (this.data.changeNum > 1) {
        this.data.changeNum--;
        this.setData({
          changeNum: this.data.changeNum
        })
      }
    },

    /**
     * 增加数量
     */
    onChangeAdd() {
      if (this.data.changeNum == this.data.inventory) {
        app.showToast('最大库存为' + this.data.inventory)
        return
      }
      if (this.data.changeNum == 99) {
        app.showToast('已达到最大购买数量')
        return
      }
      this.data.changeNum++;
      this.setData({
        changeNum: this.data.changeNum
      })
    },

    /**
     * 数量
     */
    numInput(e) {
      this.setData({
        changeNum: e.detail.value
      })
    },

    /**
     * 确认修改
     */
    onChangeSubmit() {
      if (this.data.changeNum > this.data.inventory) {
        app.showToast('最大库存为' + this.data.inventory)
        return
      }
      if (this.data.changeNum > 99) {
        app.showToast('已超过到最大购买数量')
        return
      }
      if (this.data.changeNum == 0) {
        app.showToast('商品数量不可为0')
        return
      }
      this.triggerEvent("changeNum", this.data.changeNum)
      this.setData({
        show: false
      })
    },

    /**
     * 取消修改
     */
    onChangeCancel() {
      this.setData({
        show: false
      })
    },
  }
})