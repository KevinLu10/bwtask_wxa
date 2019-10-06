// pages/project_list.js
var app = getApp()
var util = require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        img_base         : app.img_base,
        task_id          : 0,
        is_show_reply_box: 0,
        pwd              : '',
        task             : {},
        reply_content    : '',
        audio            : null,
        audio_status:'unplay',
        user_id:app.user_id
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({task_id: options.task_id, pwd: options.pwd,user_id:app.user_id})
        this.load_data()

        util.cus_debug('aaa',this.data.user_id,app.user_id,app.session_id)

    }
    ,

    load_data      : function () {
        var page = this
        util.request('GET','/ktask/v1/task', {
            task_id: this.data.task_id,
            pwd    : this.data.pwd,
        }, function (res) {
            if (res.code != 0) {
                util.CusAlert.error(res.msg,function(){
                    wx.reLaunch({
                        url: "../task_list/task_list"
                    })
                })
            } else {
                page.setData({task: res.data})
                page.read()
            }



        })
    }
    ,
    read           : function () {
        var page = this
        util.sin_post('/ktask/v1/read', {
            task_id: this.data.task_id,
            pwd    : this.data.pwd,
        }, function (res) {
            if (res.data.read_suc == 1) {
                page.load_data()
            }
        })
    }
    ,
    show_reply_box : function () {
        if (this.data.task.reply_type == 1)
            this.setData({
                is_show_reply_box: 1
            })
        else {
            util.CusAlert.info('你已参与')
        }
    }
    ,
    close_reply_box: function () {
        this.setData({
            is_show_reply_box: 0
        })
    }
    ,

    reply : function (e) {
        var page = this
        util.submit_form_id(e,function(res){
            if (page.data.task.reply_type!=1){
                util.CusAlert.error('您已参与')
                return
            }

            util.sin_post('/ktask/v1/reply', {
                task_id  : page.data.task_id,
                pwd      : page.data.pwd,
                c_type   : "0",
                content  : page.data.reply_content,
                img_uri  : '',
                audio_uri: '',
            }, function (res) {
                page.load_data()
            })
        })

    }
    ,
    attend: function (e) {
        var page = this
        util.submit_form_id(e,function(res){
            util.sin_post('/ktask/v1/attend', {
                to_id: page.data.task.user_id,
            }, function (res) {
                page.load_data()
            })
        })

    }
    ,

    input_content: function (e) {
        this.setData({
            reply_content: e.detail.value
        })
        // util.cus_debug(e.detail.value)
    }
    ,
    play_record  : function () {
        var page=this
        if (this.data.audio == null) {
            var innerAudioContext = wx.createInnerAudioContext()
            innerAudioContext.src = this.data.task.audio_uri
            util.cus_debug(this.data.task.audio_uri)

            innerAudioContext.onEnded(() => {
                page.setData({audio_status: 'unplay'})
            })

            this.setData({audio: innerAudioContext})
            innerAudioContext.play()
        }
        this.data.audio.play()
        this.setData({audio_status: 'play'})

    },
    pause_record:function(){
        this.data.audio.pause()
        this.setData({audio_status: 'unplay'})
    },
    onShareAppMessage: function (res) {
        var p = '/pages/task/task?task_id=' + this.data.task_id+'&pwd='+this.data.pwd
        return {
            title  : this.data.task.title,
            path   : p,
            success: function (res) {
                // util.CusAlert.info('分享成功')
            },
            fail   : function (res) {
            }
        }
    },
    to_index:function(e){
        // util.submit_form_id(e,function(res){
            wx.reLaunch({
                url: "../task_list/task_list"
            })
        // })

    },
    to_share          : function (e) {
        // this.onShareAppMessage()
        wx.showShareMenu({
            withShareTicket: true
        })
    },
    del_reply: function (e) {
        var page = this
        var userid = e.currentTarget.dataset.userid
        if (userid != this.data.user_id) {
            return
        }
        util.CusAlert.confirm('确定删除该接龙？', function (res) {
            if (res.confirm) {
                var reply_id = e.currentTarget.dataset.replyid
                util.sin_post('/ktask/v1/reply/del', {
                    task_id : page.data.task_id,
                    pwd     : page.data.pwd,
                    reply_id: reply_id
                }, function (res) {
                    util.CusAlert.info('删除成功')
                    page.load_data()
                })
            }
        })

    },
    del_task : function () {
        var page=this
        util.CusAlert.confirm('确定删除该任务？', function (res) {
            if (res.confirm) {
                util.sin_post('/ktask/v1/task/del', {
                    task_id: page.data.task_id,
                    pwd    : page.data.pwd
                }, function (res) {
                    util.CusAlert.info('删除成功',function(){
                        wx.reLaunch({
                            url: "../task_list/task_list"
                        })
                    })

                })
            }
        })

    },
})