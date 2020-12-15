// components/banner_swiper/banner_swiper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    popularity:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    advertising_index: 0,
    popularity_index: 0,
    popularity_space: 105,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    advertising(e) {
      console.log(e)
      this.setData({
        advertising_index: e.detail.current
      })
    },

    popularity_start(e) {
      this.setData({
        touch_start: e.touches["0"].pageX
      })
    },
    popularity_move(e) {
      this.setData({
        touch_move: e.touches["0"].pageX
      })
    },
    popularity_end(e) {
      if (this.data.touch_start - this.data.touch_move > 40) {
        if (this.data.popularity_index >= this.data.popularity.length - 1) {
          this.data.popularity_index++
          setTimeout(() => {
            this.data.popularity_index = 0
            this.setData({
              popularity_index: this.data.popularity_index
            })
          }, 500)
        } else {
          this.data.popularity_index++
        }
      } else if (this.data.touch_move - this.data.touch_start > 40) {
        if (this.data.popularity_index == 0) {
        } else {
          this.data.popularity_index--
        }
      }

      this.setData({
        popularity_index: this.data.popularity_index
      })
    }
  }
})
