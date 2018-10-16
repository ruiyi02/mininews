// pages/detail/detail.js
//获取应用实例
//use moment.js for date format
const moment = require("../../utils/moment.min.js")
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
     news:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let newsId = options.id;
    this.getNewsDetail(newsId)
  },

  //function to get the news list based on news type
  getNewsDetail(newsId) {
    let that = this
    wx.showLoading({
      title: '加载新闻...'
    })
    //get news list for newsType from API
    wx.request({
      url: app.globalData.api_base_url + '/detail',
      data: {
        'id': newsId
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },

      success(res) {
        let result = res.data.result
        //format date using moment lib  
        result.date = moment(result.date).format('h:mm')    
    
        that.setData(
          {
             news: result
          }
        )

        console.log(that.data.news)      
      },

      complete(res) {
        wx.hideLoading()
      }
    })
  }
})