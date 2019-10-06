// pages/project_list.js
var app = getApp()
var util = require('../../utils/util.js')
var WxParse = require('../../wxParse/wxParse.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        img_base: app.img_base,
        my      : {},

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.load_data()

    },

    load_data: function () {
        var page = this
        util.sin_get('/ktask/v1/task/my_index', {}, function (res) {
            page.setData({my: res.data})
        })
    },


    to_task : function (e) {
        var task_id = e.currentTarget.dataset.taskid
        var pwd = e.currentTarget.dataset.pwd
        wx.navigateTo({
            url: "../task/task?task_id=" + task_id + "&pwd=" + pwd
        })
    },
    del_task: function (e) {
        util.CusAlert.confirm('确定删除该任务？', function () {
            var task_id = e.currentTarget.dataset.taskid
            var pwd = e.currentTarget.dataset.pwd
            util.sin_post('/ktask/v1/task/del', {
                task_id: task_id,
                pwd    : pwd
            }, function (res) {
                util.CusAlert.info('删除成功')
            })
        })

    },
    onShareAppMessage: util.common_share,

})