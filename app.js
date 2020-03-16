//app.js
const info = require('./api/info.js')
const login = require('./api/login.js')
const storageKey = require('./constants/storage-key.js')


App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 检验一下登录状态
    info.info().then(res => {
      if (res.data.code == 0) {
        // 已经登录
        if (this.globalData.loginCallback){
          this.globalData.loginCallback(true)
        }
        this.globalData.isLogin = true;
      } else {
        // 未登录
        // 判断是否记住账号和密码
        if (wx.getStorageSync(storageKey.IS_REMEBER)) {
          // 执行登录操作
          login.login(wx.getStorageSync(storageKey.USER_NAME), true, wx.getStorageSync(storageKey.PASSWORD))
            .then(res => {
              if(res.data.code ==0){
             
                // 登录成功
                if (this.globalData.loginCallback) {
                  this.globalData.loginCallback(true)
                }
                this.globalData.isLogin = true;
              }else{
                // 登录失败
                //弹窗 登录状态已失效，请重新登录
                wx.showToast({
                  title: '登录状态已失效，请重新登录',
                })
                wx.clearStorage()
              }
            })  
        }
      }
    })


    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    loginCallback:null,
    isLogin: false
  }
})