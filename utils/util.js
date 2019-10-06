const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
var app = getApp()
//弹出框管理
function CusAlert() {

}
CusAlert.info = function (msg,callback) {
    wx.showModal({
        title: '提示',
        content: msg,
        showCancel:false,
        success:callback
    })

}
CusAlert.error = function (msg, callback) {

    wx.showModal({
        title: '提示',
        content: msg,
        showCancel:false,
        success:callback

    })
}
CusAlert.warning = function (msg, kwargs) {
    wx.showModal({
        title: '提示',
        content: msg,
        showCancel:false

    })
}
CusAlert.debug = function (msg, kwargs) {
    wx.showModal({
        title: '提示',
        content: msg,
        showCancel:false

    })
}
CusAlert.confirm = function (msg, suc_cb) {
    wx.showModal({
        title: '提示',
        content: msg,
        showCancel:true,
        success:suc_cb

    })
}
CusAlert.toast = function (msg,icon, duration) {
    if (!duration){
        duration=1000
    }
    if (!icon){
        icon='success'
    }

    wx.showToast({
        title: msg,
        icon: icon,
        duration: duration
    })
}

var app = getApp()
var DOMAIN = app.domain
//用户登录
// function login(callback){
//     wx.getUserInfo({
//         success: function(res) {
//             app.user_info = res.userInfo
//             var nickName = res.userInfo.nickName
//             var avatarUrl = res.userInfo.avatarUrl
//             // 登录
//             wx.login({
//                 success: function(res) {
//                     console.info(res.code)
//                     sin_post('/four/v1/user/wxa/login',{
//                         code: res.code,
//                         nickname: nickName,
//                         img_url: avatarUrl
//                     },function(res){
//                         app.session_id=res.data.session_id
//                         app.user_id=res.data.user_id
//                         callback()
//                     },{},1)
//                 }
//             });
//         }
//     })
//
// }
function to_login_page() {
    //跳转到登陆的页面
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var options = currentPage.options
    // cus_debug(currentPage,options)
    var back_url = '/' + currentPage.route + '?' + make_url_param(options)
    cus_debug('back_url',back_url)
    wx.redirectTo({
        // url: "../login/login?b=" + back_url
        url: "../login/login?b=" + encodeURIComponent(back_url)
    })
}
// HTTP
function request(method, uri, data, callback_func, header, uncheck_login) {

    if (!uncheck_login && app.session_id.length <= 0) {
       to_login_page()
        // login(function(){
        //     request(method, uri, data, callback_func, header, 0)
        // })
    }
    else {

        cus_debug("HTTP ", method, uri, data)
        // return
        var url = DOMAIN + uri
        if (header == undefined)
            header = {}
        header['content-type'] = 'application/x-www-form-urlencoded'
        header['client-type'] = 'wxa'
        header['session'] = app.session_id

        wx.request({
            url    : url, //仅为示例，并非真实的接口地址
            method : method,
            data   : data,
            header : header,
            success: function (response) {
                if (response.statusCode == 200 || response.statusCode == 400) {
                    if (response.data.code==10003){
                        app.session_id=''
                        to_login_page()
                        // CusAlert.error(response.data.msg+',即将重新登录',function(){
                        //     request(method, uri, data, callback_func, header, uncheck_login)
                        // })

                    }else if(response.data.code==10018){
                        CusAlert.confirm('余额不足，差'+response.data.need_money+'元，是否充值？',function(res){
                            if (res.confirm)
                                wx.navigateTo({
                                    url: "../balance/balance?need_money="+response.data.need_money
                                })
                        })
                    }else{
                        callback_func(response.data)
                    }
                } else {
                    CusAlert.error("服务器开小差，请稍后再试.")
                }
            },
            error  : function (response) {
                CusAlert.error("服务器开小差，请稍后再试")
            }
        })
    }
}
function sin_get(url, data, callback, auth_type, is_raw, header) {
  request("GET", url, data, function (response) {
    if (response.code != 0) {
      CusAlert.error(response.msg)
    } else {
      callback(response)
    }
  }, auth_type, is_raw, header)
}

function sin_post(url, data, callback, auth_type, is_raw, header, err_callback) {
    request("POST", url, data, function (response) {
        if (response.code != 0) {
            CusAlert.error(response.msg)
            err_callback(response)
        } else {
            callback(response)
        }
  }, auth_type, is_raw, header)
}
//debug使用
function cus_debug(i1, i2, i3, i4) {
    console.info(i1, i2, i3, i4)
}

//字典转换为url params格式
function make_url_param(obj){
    var param=''
    for (var v in obj){
        param+=v+'='+obj[v]+'&'
    }
    return param
}
function fix(n,l){
    if (!l)
        l=2
    if (typeof(n)=='string')
        n=parseFloat(n)
    return n.toFixed(l)
}
function submit_form_id(e,callback){
    sin_post('/ktask/v1/formid/add', {
        form_id: e.detail.formId,
    }, function (res) {
        callback(res)
    })
}
function get_img_size(canvasWidth, canvasHeight) {
    var max_size=400
    if (canvasWidth >= canvasHeight && canvasWidth > max_size) {

        canvasHeight = Math.trunc(max_size / (canvasWidth / canvasHeight))
        canvasWidth = max_size
    } else if (canvasHeight >= canvasWidth && canvasHeight > max_size) {

        canvasWidth = Math.trunc(max_size / (canvasHeight / canvasWidth))
        canvasHeight = max_size
    }
    return [canvasWidth, canvasHeight]
}

function common_share(res) {
    return {
        title  : '班务小广播',
        path   : '/pages/task_list/task_list',
        success: function (res) {
            // util.CusAlert.info('分享成功')
        },
        fail   : function (res) {
        }
    }
}


module.exports = {
  formatTime: formatTime,
    sin_get: sin_get,
    sin_post: sin_post,
    request: request,
    cus_debug: cus_debug,
    CusAlert:CusAlert,
    make_url_param:make_url_param,
    fix:fix,
    submit_form_id:submit_form_id,
    get_img_size:get_img_size,
    common_share:common_share,
}
