const  User = require('../models/User')
const  Account = require('../models/Account')
const jwt = require('jsonwebtoken')

class Login {
  async get(req, res) {
    return res.render("sign_in")
  }
  async post(req, res, next) {
    const formData = req.body
    if(!formData) {
      return res.json("vui lòng đăng nhập")
    }
    const data = await Account.findOne({username: formData.username})
    if(!data) {
      return res.json({"Vui lòng nhập đúng tài khoản !"})
    }
    const password = data.password
    if(password != formData.password) {
      return res.json("Vui lòng nhập đúng mật khoản !")
    }
    if(data.username == formData.username && data.password == formData.password) {
      const accessToken = jwt.sign({
        id: data.id
      },
      process.env.JWT_ACCESS_KEY,
      {
        expiresIn: "120s"
      })
      return res.cookie("AccessToken",accessToken, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        secure: false
      })
    }
    
  }
}