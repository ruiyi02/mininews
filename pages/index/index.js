var util = require('../../utils/util.js');  
//获取应用实例
const app = getApp()
const NEWS_TYPES=["gn", "gj", "cj", "yl", "js", "ty", "other"]

let sliderWidth = 26 // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["国内", "国际", "财经", "娱乐", "军事", "体育", "其他"],
    activeTabIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    newsList:[],
    errorMessage:''
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
      title: '加载' + this.data.tabs[this.data.activeTabIndex]+'新闻...'
    })

    this.getNewsList(NEWS_TYPES[this.data.activeTabIndex], () => {
      wx.hideLoading()
    })
  },

  //swhich news type when tap the top navbar
  onTabTap: function (e) {
    if (this.data.activeTabIndex!= e.currentTarget.id){
      this.setData({
        sliderOffset: e.currentTarget.offsetLeft,
        activeTabIndex: e.currentTarget.id
      });

      //get the news for the current type
      wx.showLoading({
        title: '加载' + this.data.tabs[this.data.activeTabIndex] + '新闻...'
      })
      this.getNewsList(NEWS_TYPES[this.data.activeTabIndex], () => {
        wx.hideLoading()
      })
    }  
  },

  onPullDownRefresh: function() {   
    this.getNewsList(NEWS_TYPES[this.data.activeTabIndex], () => {
      wx.stopPullDownRefresh()
    })
  },
  
  //function to get the news list based on news type
  getNewsList: function(newsType, callback){
    let that=this   
    //uset error message
    that.setData(
      {    
        errorMessage: ''
      }
    )

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
          item.date = util.formatTimeNew(new Date(item.date))
        });

        if (res.data.result.length>0){
           that.setData(
            {
              newsList: res.data.result,
              errorMessage: ''
            }
          )
        }else{
           that.setData(
            {
              newsList: [],
              errorMessage: '暂时没有' + that.data.tabs[that.data.activeTabIndex] + '新闻，请稍后刷新。'
            }
          )
        }
      
      },

      complete() {
         typeof callback === 'function' && callback()
      }
    })
  }

})
