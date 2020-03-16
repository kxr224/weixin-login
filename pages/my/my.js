// pages/my/my.js
const app = getApp()
const loginApi = require("../../api/login.js")
const logoutApi = require("../../api/logout.js")
const storageKey=require('../../constants/storage-key.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:"登录",
    isLogin:false,
    userName:"",
    password:"",
    rememberMe:false,
    avatar:"",
    name:"",
    isRemember:true,
  },
  onLoad(){
    if (app.globalData.isLogin){
      this.setData({
        isLogin:true
      })
    }else{
      // 第一种真的没登录
      // 第二种还没来得及校验登录状态，就加载了这里
      app.globalData.loginCallback = (isLogin)=>{
        // 如果是没来得及的话，也可会执行这个函数进行状态的设置
        this.setData({
          isLogin
        })
      }
    }
  },
  // 登录
  login: function (e) {
    loginApi.login(this.data.userName,this.data.rememberMe,this.data.password).then(res => {
      if(res.data.code === 0){
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        })
        this.setData({
          msg: "ok",
          isLogin: true,
          avatar: res.data.data.avatar,
          name: res.data.data.userName
        })
        if(this.data.isRemember){
           // 保存用户名和密码
          wx.setStorage({
            key: storageKey.USER_NAME,
            data: this.data.userName,
          })
          wx.setStorage({
            key: storageKey.PASSWORD,
            data: this.data.password,
          })
          wx.setStorage({
            key: storageKey.IS_REMEBER,
            data: true,
          })
        }else{
          wx.setStorage({
            key: storageKey.IS_REMEBER,
            data: false,
          })
        }

        app.globalData.isLogin = true
      }else{
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        })
        app.globalData.isLogin = false
      }
    })
  },
  // 获取用户名
  getUserName:function(e){
    this.setData({
      userName: e.detail.value
    })
  },
  // 获取密码
  getPassword: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  // 修改个人信息
  update:function(e){
    wx.navigateTo({
      url: '/pages/update/update',
    })
  },
  // 查看个人信息
  look:function(e){
    wx.navigateTo({
      url: '/pages/info/info',
    })
  },
  // 退出
  logout:function(e){
    logoutApi.logout().then(res => {
      if(res.data.code === 0){
        return
      }else{
       wx.removeStorageSync("loginCookies")
        this.setData({
          msg: "登录",
          isLogin: false
        })
      }
    })
  },
  onRemeberChange(e){
    this.setData({
      isRemember:e.detail
    })
  }
 
})