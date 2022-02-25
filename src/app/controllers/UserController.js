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
    const browser = await puppeteer.launch({
      args: [
             '--no-sandbox',
             '--disable-setuid-sandbox'
             ]
    })
    const linkLogin = "https://www.instagram.com/accounts/login/"
    const page = await browser.newPage()
    await page.goto(linkLogin, {
      waitUntil: 'networkidle0
    })
    await page.type("input[name='username']", process.env.USERNAME_IG);
    await page.type("input[name='password']", process.env.PASSWORD_IG);
    await page.click("button[type='submit']")
    await page.waitForNavigation({
      waitUntil: 'networkidle0',
    });
    await page.goto(url, { waitUntil: "networkidle0" })
    let dir = __dirname.split("/")
    dir = `${dir[2]}/public/image`
    await page.screenshot({ path: `${dir}/image.png`})
    console.log(dir)
    await browser.close()
    res.status(201).json({
      message: "success",
      status: true,
    })
    } 
    catch (e) {
      console.log("co loi")
      console.log(e.messgase)
      res.status(404).json({
        message: "co loi",
        status: false
      })
    }
  }
}

module.exports = new UserController()
