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
    change_num: '',
    inventory: ''
  },
  ready() {
    this.setData({
      diy_color: app.globalData.diy_color
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show(change_num, inventory) {
      this.setData({
        show: true,
        change_num: change_num,
        inventory: inventory
      })
    },

    /**
     * 减少数量
     */
    onChangeMinus() {
      if (this.data.change_num > 1) {
        this.data.change_num--;
        this.setData({
          change_num: this.data.change_num
        })
      }
    },

    /**
     * 增加数量
     */
    onChangeAdd() {
      if (this.data.change_num == this.data.inventory) {
        app.showToast('最大库存为' + this.data.inventory)
        return
      }
      if (this.data.change_num == 99) {
        app.showToast('已达到最大购买数量')
        return
      }
      this.data.change_num++;
      this.setData({
        change_num: this.data.change_num
      })
    },

    /**
     * 数量
     */
    numInput(e) {
      this.setData({
        change_num: e.detail.value
      })
    },

    /**
     * 确认修改
     */
    onChangeSubmit() {
      if (this.data.change_num > this.data.inventory) {
        app.showToast('最大库存为' + this.data.inventory)
        return
      }
      if (this.data.change_num > 99) {
        app.showToast('已超过到最大购买数量')
        return
      }
      if (this.data.change_num == 0) {
        app.showToast('商品数量不可为0')
        return
      }
      this.triggerEvent("changeNum", this.data.change_num)
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