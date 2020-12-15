// components/load_more/load_more.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type:Boolean,
      observer: function () {
        this.setData({
          showing:this.data.show
        })
      }
    }
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
   
  }
})