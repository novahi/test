require("dotenv").config()
const puppeteer = require("puppeteer")

class UserController {
  get (req, res) {
    res.status(200).render("get")
  }
  post(req, res) {
    let { url } = req.body
    ;(async () => {
      const browser = await puppeteer.launch({
        args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                          ]
      })
      const page = await browser.newPage()
      await page.goto(url)
      const title = await page.value(() => document.querySelector("title").textContent)
      return res.status(200).json({
        message: "success",
        status: true,
        title
      })
    })()
  }
}

module.exports = new UserController()
