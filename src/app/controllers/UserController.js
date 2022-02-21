require("dotenv").config()
const puppeteer = require("puppeteer")

class UserController {
  get (req, res) {
    res.status(200).render("get")
  }
  post(req, res) {
    let { url } = req.body
    url = url.toLowerCase()
    if(!url) { 
      return res.status(404).json({
      message: "Link does not exist or is incorrect",
      status: false
    }) 
    }
    let image
    const screenshot = (link) => {
      const getScreenshot = async (link) => {
        try {
          const browser = await puppeteer.launch({
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
                    ]
          })
          const page = await browser.newPage()
          await page.goto(link)
          await page.screenshot({ 
            path: "/app/src/public/image/"+ "image.png"
          })
          
        } catch (e) {
          console.log(e.message)
        }
      }
      getScreenshot(link)
    }
    screenshot(url)
    console.log(__dirname)
    return res.status(201).json({
      message: "Success",
      status: true,
      image: "./image/image.png"
    })
  }
}

module.exports = new UserController()
