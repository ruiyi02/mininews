//index.js
//use moment.js for date format
const moment = require("../../utils/moment.min.js")
//获取应用实例
const app = getApp()
const NEWS_TYPE=["gn", "gj", "cj", "yl", "js", "ty", "other"]

let sliderWidth = 26 // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["国内", "国际", "财经", "娱乐", "军事", "体育", "其他"],
    activeTabIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    topNews:{},
    newsList:[],
  },
 
  onLoad: function () {
    let that = this
    //caculate navbar slider position
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeTabIndex
        });
      }
    })

    wx.showLoading({
      title: '加载新闻...'
    })

    this.getNewsList(NEWS_TYPE[this.data.activeTabIndex], () => {
      wx.hideLoading()
    })
  },

  //swhich news type when tap the top navbar
  tabTap: function (e) {
    if (this.data.activeTabIndex!= e.currentTarget.id){
      this.setData({
        sliderOffset: e.currentTarget.offsetLeft,
        activeTabIndex: e.currentTarget.id
      });

      //get the news for the current type
      wx.showLoading({
        title: '加载新闻...'
      })
      this.getNewsList(NEWS_TYPE[this.data.activeTabIndex], () => {
        wx.hideLoading()
      })
    }  
  },

  onPullDownRefresh() {   
    this.getNewsList(NEWS_TYPE[this.data.activeTabIndex], () => {
      wx.stopPullDownRefresh()
    })
  },

  //function to get the news list based on news type
  getNewsList(newsType, callback){
    let that=this   
    //get news list for newsType from API
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
        let result = res.data.result
        //format date using moment lib
        result.forEach(function (item) {
          item.date = moment(item.date).format('h:mm')
        });

        if (res.data.result.length>0){
          let first = res.data.result.shift(); //remove the first news
          that.setData(
            {
              topNews: first,   //use the first news as top one
              newsList: res.data.result 
            }
          )
        }
      
      },

      complete() {
        callback && callback()
      }
    })
  }

})
