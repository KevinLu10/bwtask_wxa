//app.js
var VER = 'prod' //prod
if (VER == 'test') {
    // var DOMAIN = 'https://weixin.ttsharing.com/fourtest-bxYwsE7o'
    // var DOMAIN = 'http://www.ktask_test.com'
    var DOMAIN = 'https://api.test.cn'
} else {
    var DOMAIN = 'https://api.test.cn'
}
App({
    page_size : 20, //每页的数量 
    user_info : {},

    session_id: '',
    user_id   : 0,
    // domain:"http://www.four_test.com/",//域名
    // domain    : "https://weixin.ttsharing.com/",//域名
    domain    : DOMAIN,//测试环境
    img_base  : DOMAIN + "/front/", //图片的域名
    onLaunch  : function () {
        // 关闭调试
        wx.setEnableDebug({
            enableDebug: false
        })


    },
    globalData: {
        userInfo: null
    }
    ,
})

