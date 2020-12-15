// components/image-loader/image-loader.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    original: String, //原图片
    default: String, //默认图片
    width: String, //图片宽度
    height: String, //图片高度
    mode: String, //图片剪裁
    default_mode: String //默认图片剪裁
  },

  /**
   * 组件的初始数据
   */
  data: {
    default_mode:'',
    loading: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loader() {
      this.setData({
        loading: true
      })
    }
  }
})