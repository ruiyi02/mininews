//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    newsList:[],
    newsType:"gn"

  },
 
  onLoad: function () {
    this.getNewsList(this.data.newsType)
  },

  getNewsList(newsType){
    let that=this
    wx.showLoading({
      title:'加载新闻...'
    })
    wx.request({
      url: app.globalData.api_base_url + '/list',
      data:{
        'type': newsType
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' 
      },
      success(res) {
        that.setData(
          {
            newsList: res.data.result
          }
        )
      },
      complete(res) {
        wx.hideLoading()
      }
    })
  }

})
