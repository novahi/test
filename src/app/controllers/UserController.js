require("dotenv").config()
const puppeteer = require("puppeteer")

class UserController {
  get (req, res) {
    res.status(200).render("get")
  }
  async post(req, res) {
    try {
      let { url } = req.body
      url = url.toLowerCase()
      if (!url) {
        return res.status(404).json({
          message: "URL  không hợp lệ"
        })
      }
     const browser = await puppeteer.launch({
       headless: true,
       args: [
         '--no-sandbox',
         '--disable-setuid-sandbox'
         ]
     })
     const page = await browser.newPage()
     await page.goto(url)
     const title = await page.evaluate(() => document.querySelector("title"))
     res.status(200).json({
       message: title,
       status: true
     })
      
    } catch (e) {
      console.log(e.message)
      res.status(404).json({
        message: e.message,
        status: false,
      })
    }
  }
}

module.exports = new UserController()
