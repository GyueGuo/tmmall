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
    advertisingIndex: 0,
    popularityIndex: 0,
    popularitySpace: 105,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    advertising(e) {
      console.log(e)
      this.setData({
        advertisingIndex: e.detail.current
      })
    },

    popularityStart(e) {
      this.setData({
        touchStart: e.touches["0"].pageX
      })
    },
    popularityMove(e) {
      this.setData({
        touchMove: e.touches["0"].pageX
      })
    },
    popularityEnd(e) {
      if (this.data.touchStart - this.data.touchMove > 40) {
        if (this.data.popularityIndex >= this.data.popularity.length - 1) {
          this.data.popularityIndex++
          setTimeout(() => {
            this.data.popularityIndex = 0
            this.setData({
              popularityIndex: this.data.popularityIndex
            })
          }, 500)
        } else {
          this.data.popularityIndex++
        }
      } else if (this.data.touchMove - this.data.touchStart > 40) {
        if (this.data.popularityIndex == 0) {
        } else {
          this.data.popularityIndex--
        }
      }

      this.setData({
        popularityIndex: this.data.popularityIndex
      })
    }
  }
})
