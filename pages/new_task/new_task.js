// pages/project_list.js
var app = getApp()
var util = require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data               : {
        img_base     : app.img_base,
        task_type    : [
            {name: '作业', value: '0', checked: 'true'},
            {name: '通知', value: '1',},
            {name: '接龙', value: '2'},

        ],
        work_type    : [
            {name: '语文', value: '语文', checked: 'true'},
            {name: '数学', value: '数学',},
            {name: '英语', value: '英语'},
            {name: '其他', value: '其他'},
        ],
        cur_work_type:'语文',
        cur_task_type: 0,
        ddl          : [
            {name: '一天', value: '0', checked: 'true'},
            {name: '一周', value: '1',},
            {name: '一月', value: '2'},
        ],
        c_type_radio : [
            {name: '文本', value: '0', checked: 'true'},
            {name: '图片', value: '1',},
            {name: '语音', value: '2'},
        ],

        cur_ddl   : 0,
        title     : '',
        c_type    : 0,
        content   : '',
        img_uri   : '',
        audio_uri : '',
        img_path  : '',
        audio_path: '',
        //录音相关
        status:'未录音',
        valid_end:0,
        valid_start:1,
        valid_play:0,
        valid_add:1,

    },
    task_type_radio_chg: function (e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value)
        this.setData({cur_task_type: e.detail.value})
    },
    ddl_radio_chg      : function (e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value)
        this.setData({cur_ddl: e.detail.value})
    },
    c_type_chg         : function (e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value)
        this.setData({c_type: e.detail.value})
    },
    work_type_chg         : function (e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value)
        this.setData({cur_work_type: e.detail.value,})
    },

    input_title  : function (e) {
        this.setData({
            title: e.detail.value
        })
        // util.cus_debug(e.detail.value)
    },
    input_content: function (e) {
        this.setData({
            content: e.detail.value
        })
        // util.cus_debug(e.detail.value)
    },
    add_task_chk : function () {
        if (this.data.cur_task_type == 0) {
            this.setData({title: this.data.cur_work_type + '作业'})
        }
        var d = this.data
        if (d.title == '') {
            util.CusAlert.error('请输入名称')
            return 0
        } else if (d.c_type == 0 && d.content == '') {
            util.CusAlert.error('请输入文本内容')
            return 0
        } else if (d.c_type == 1 && d.img_path == '') {
            util.CusAlert.error('请选择图片')
            return 0
        } else if (d.c_type == 2 && d.audio_path == '') {
            util.CusAlert.error('请录音')
            return 0
        }
        else {
            return 1
        }
    },
    post_task: function () {
        var page = this
        util.sin_post('/ktask/v1/task', {
                title    : this.data.title,
                c_type   : this.data.c_type,
                type     : this.data.cur_task_type,
                ddl      : this.data.cur_ddl,
                content  : this.data.content,
                img_uri  : this.data.img_uri,
                audio_uri: this.data.audio_uri,
            }, function (res) {
                // util.CusAlert.info('发布成功')
                page.setData({valid_add: 1})
                wx.navigateTo({
                    url: "../task/task?task_id=" + res.data.task_id + '&pwd=' + res.data.pwd
                })
            }, undefined, undefined, undefined, function (res) {
                page.setData({valid_add: 1})
            }
        )
    },
    onShareAppMessage: util.common_share,

    add_task     : function () {
        var page = this
        var chk_ret = this.add_task_chk()
        if (chk_ret != 1) {
            return 0
        }
        this.setData({valid_add: 0})

        if (this.data.c_type == 1) {
            this.upload_file(this.data.img_path, function (data) {
                page.setData({img_uri: data.data})
                page.post_task()
            })
        } else if (this.data.c_type == 2) {
            this.upload_file(this.data.audio_path, function (data) {
                page.setData({audio_uri: data.data})
                page.post_task()
            })
        }else if(this.data.c_type == 0){
            page.post_task()
        }

    },

    select_img(){
        var _this = this;
        wx.chooseImage({
            count   : 1,
            sizeType: ['compressed'],
            success : function (photo) {

                wx.getImageInfo({
                    src    : photo.tempFilePaths[0],

                    success: function (res) {
                        var ctx = wx.createCanvasContext('photo_canvas');
                        var ratio = 10;
                        var canvasWidth = res.width
                        var canvasHeight = res.height;
                        _this.setData({
                            aaa          : photo.tempFilePaths[0],
                            canvasWidth2 : res.width,
                            canvasHeight2: res.height
                        })
                        // 保证宽高均在200以内
                        // while (canvasWidth > 1000 || canvasHeight > 1000) {
                        //     //比例取整
                        //     canvasWidth = Math.trunc(res.width / ratio)
                        //     canvasHeight = Math.trunc(res.height / ratio)
                        //     ratio++;
                        // }
                        var ret = util.get_img_size(canvasWidth, canvasHeight)
                        canvasWidth = ret[0]
                        canvasHeight = ret[1]
                        util.cus_debug(canvasWidth, canvasHeight)
                        _this.setData({
                            canvasWidth : canvasWidth,
                            canvasHeight: canvasHeight
                        })//设置canvas尺寸
                        ctx.drawImage(photo.tempFilePaths[0], 0, 0, canvasWidth, canvasHeight)  //将图片填充在canvas上
                        ctx.draw()
                        //下载canvas图片
                        setTimeout(function () {
                            wx.canvasToTempFilePath({
                                canvasId: 'photo_canvas',
                                success : function (res) {
                                    console.log(res.tempFilePath)
                                    _this.setData({
                                        img_path: res.tempFilePath
                                    })
                                },
                                fail    : function (error) {
                                    util.CusAlert.error('压缩文件错误')
                                }
                            })
                        }, 1000)
                    },
                    fail   : function (error) {
                        util.CusAlert.error('不支持文件格式')
                    }
                })

            },
            error   : function (res) {
                console.log(res);
            }
        })
    },
    start_record    : function () {
        var page = this
        const recorderManager = wx.getRecorderManager()
        this.setData({valid_start:0,valid_end:1,valid_play:0,status:'录音中……'})
        recorderManager.onStop((res) => {
            page.setData({valid_start:1,valid_end:0,valid_play:1,status:'已录音'})
            page.setData({audio_path:res.tempFilePath})
            console.log('停止录音', res.tempFilePath)
        })
        recorderManager.start({
            duration: 60000,//指定录音的时长，单位 ms
            format: 'mp3',//音频格式，有效值 aac/mp3
        })
        this.setData({recorderManager:recorderManager})
    },
    end_record      : function () {
        this.data.recorderManager.stop();
        // wx.stopRecord();
    },
    play_record     : function () {
        var page=this
        this.setData({valid_start:0,valid_end:0,valid_play:0,status:'录音播放中……'})

        // wx.playVoice({
        //     filePath: this.data.audio_path
        // })
        var innerAudioContext = wx.createInnerAudioContext()
        util.cus_debug(this.data.audio_path)
        innerAudioContext.src = this.data.audio_path

        innerAudioContext.onEnded(() => {
            this.setData({valid_start:1,valid_end:0,valid_play:1,status:'已录音'})
        })
        innerAudioContext.play()

    },
    upload_file     : function (file_path, callback) {

        wx.uploadFile({
            url     : app.domain + '/ktask/v1/upload',
            filePath: file_path,
            name    : 'file',
            header  : {
                'SESSION' : app.session_id,
                'FILEPATH': file_path
            },
            success (res){
                // util.cus_debug(res)
                var data = JSON.parse(res.data);
                if (res.statusCode == 200)
                    callback(data)
                else {
                    this.setData({valid_add: 1})
                    util.CusAlert.error(data.msg)
                }

            }
        })
    },
    upload_file_test: function () {
        this.upload_file(this.data.audio_path, function (res) {
            util.cus_debug(res)
        })
    }


})