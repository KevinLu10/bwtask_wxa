var app = getApp()
var util = require('../../utils/util.js')
Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        disabled: true,
        back_url:'/page/project_list/project_list'
    },
    get_code: function () {
        // 登录
        wx.login({
            success: function (res) {
                if (res.code) {
                    return res.code
                } else {
                    util.CusAlert.info('登录失败！' + res.errMsg)
                }

            },
            fail: function () {
                util.CusAlert.info('登陆失败')
            }
        });
    },
    login_suc: function (res) {
        var page = this
        app.session_id = res.data.session_id
        app.user_id = res.data.user_id
        util.CusAlert.info('登陆成功', function () {
            // wx.navigateBack({ //返回上一个页面
            //     delta: 1
            // })
            wx.redirectTo({url: page.data.back_url})
        })
    },
    post_server: function (nickname, img_url, iv, encrypted_data) {
        var page=this
        wx.login({
            success: function (res) {
                if (res.code) {
                    util.request("POST", '/ktask/v1/user/wxa/login', {
                        code: res.code,
                        nickname: nickname,
                        img_url: img_url,
                        iv: iv,
                        encrypted_data: encrypted_data,
                    }, function (response) {
                        if (response.code != 0) {
                            util.CusAlert.error(response.msg)
                            page.setData({disabled: false})
                        } else {
                            page.login_suc(response)
                        }
                    }, {}, 1)
                    // util.sin_post(,, function (res) {
                    //
                    //
                    //
                    // }, {}, 1)
                } else {
                    util.CusAlert.info('登录失败！' + res.errMsg)
                }

            },
            fail: function () {
                util.CusAlert.info('登陆失败')
            }
        });

    },
    onLoad: function (option) {
        // 查看是否授权
        this.setData({'back_url':decodeURIComponent(option.b)})
        util.cus_debug('login back_url',this.data.back_url,option.b,option)
        var page = this
        // var suc=0
        // return
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.getUserInfo({
                        success: function (res) {
                            // var code = page.get_code()
                            page.post_server(res.userInfo.nickName, res.userInfo.avatarUrl, res.iv, res.encryptedData)
                            // suc = 1
                            // console.log(res.userInfo)
                            // console.log(res.encryptedData)
                            // console.log(res.iv)
                            // var nickName = res.userInfo.nickName
                            // var  = res.userInfo.avatarUrl
                        },
                        fail: function () {
                            page.setData({disabled: false})
                        }
                    })
                } else {
                    page.setData({disabled: false})
                }
            },
            fail: function () {
                page.setData({disabled: false})
            }
        })

    },
    bindGetUserInfo: function (e) {
        if (e.detail.userInfo) {
            var page = this
            var res = e.detail
            page.post_server(res.userInfo.nickName, res.userInfo.avatarUrl, res.iv, res.encryptedData)
        } else {
            util.CusAlert.error('必须允许微信授权才能登陆')
        }
    }
})