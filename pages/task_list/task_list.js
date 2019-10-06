// pages/project_list.js
var app = getApp()
var util = require('../../utils/util.js')
var WxParse = require('../../wxParse/wxParse.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        img_base : app.img_base,
        task_list: [],

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.load_data()
        //test
        // util.cus_debug('500,400',util.get_img_size(500,400))
        // util.cus_debug('1100,400',util.get_img_size(1100,400))
        // util.cus_debug('500,1100',util.get_img_size(500,1100))
        // util.cus_debug('3000,3000',util.get_img_size(3000,3000))
        // util.cus_debug('3000,2000',util.get_img_size(3000,2000))
    },

    load_data: function () {
        var page = this
        util.sin_get('/ktask/v1/tasklist', {}, function (res) {
            page.setData({task_list: res.data.data,})
        })
    },

    to_new_task2 : function (e) {
        wx.navigateTo({
            url: "../new_task/new_task"
        })
    },
    to_my1       : function (e) {
        wx.navigateTo({
            url: "../my/my"
        })
    },
    to_task_test: function (e) {
        wx.navigateTo({
            // url: "../task/task?task_id=18&pwd=RU7pIxWC"
            // url: "../task/task?task_id=22&pwd=G9FBRwOf",
            // url: "../task/task?task_id=23&pwd=2vNJ5Hd3"
            // url: "../task/task?task_id=26&pwd=UH5w1udl"
            // url: "../task/task?task_id=27&pwd=BiZMJxjE"
            // url: "../task/task?task_id=28&pwd=DVzYMjmn"
            url: "../task/task?task_id=29&pwd=hUeGzRct"
        })
    },
    to_task     : function (e) {
        var task_id = e.currentTarget.dataset.taskid
        var pwd = e.currentTarget.dataset.pwd
        wx.navigateTo({
            url: "../task/task?task_id=" + task_id + "&pwd=" + pwd
        })
    },

    share: function () {
        // this.onShareAppMessage()
        wx.showShareMenu({
            withShareTicket: true
        })
    },
    to_my:function(e){
        util.submit_form_id(e,function(res){
            wx.navigateTo({
                url: "../my/my"
            })
        })

    },
    to_intro:function(){
            wx.navigateTo({
                url: "../intro/intro"
            })

    },

    to_new_task:function(e){
        util.submit_form_id(e,function(res){
            wx.navigateTo({
                url: "../new_task/new_task"
            })
        })

    },
    onShareAppMessage: util.common_share
        // return (res)
            // var p = '/pages/task/task?task_id=' + this.data.task_id+'&pwd='+this.data.pwd
            // return {
            //     title  : this.data.task.title,
            //     path   : p,
            //     success: function (res) {
            //         util.CusAlert.info('分享成功')
            //     },
            //     fail   : function (res) {
            //     }
            // }

    // }
})