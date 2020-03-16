const http = require("./http.js")

function login(username,rememberMe,password) {
  return http.getPost({
    url: `/api/login`,
    data: {
      username,
      rememberMe,
      password
    }
  }).then(res=>{
    if (res.cookies.join(";").includes("JSESSIONID")) {
      wx.setStorageSync(
        "loginCookies",
        res.cookies.join(";")
      )
    }
    return res;
  })
}

module.exports = {
  login
}