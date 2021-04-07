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
    stars: [0, 0, 0, 0, 0],
    level: 5
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
    onStar(e) {
      const index = e.target.dataset.index;
      const level = index + 1;
      this.triggerEvent("changeStar", level);
      this.setData({
        level,
      });
    },
  }
})