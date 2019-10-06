// pages/project_list.js
var app = getApp()
var util = require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        img_base:app.img_base,
      user_data:{}

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.load_data()
    },

    load_data      : function () {
        var page = this
        util.sin_get('/four/v1/user/index', {
        }, function (res) {
            page.setData({user_data: res.data})
        })
    },
    to_balance    : function (e) {
        wx.navigateTo({
            url: "../balance/balance"
        })
    },
    to_coupon    : function (e) {
        wx.navigateTo({
            url: "../coupon_list/coupon_list"
        })
    },
    to_gorder    : function (e) {
        wx.navigateTo({
            url: "../gorder_list/gorder_list"
        })
    }

})