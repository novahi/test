require("dotenv").config()
const puppeteer = require("puppeteer")

class UserController {
  get (req, res) {
    res.status(200).render("get")
  }
  post(req, res) {
    const { url } = req.body
    if(!url) { 
      return res.status(404).json({
      message: "Link does not exist or is incorrect",
      status: false
    }) 
    }
    if(url.includes("https://")) {
      const findIdFb =  (link) => {
        let data
        const id = async (link) => {
          try {
            const browser = await puppeteer.launch({
              args: [
                         '--no-sandbox',
                         '--disable-setuid-sandbox',
                       ],
            })
            const page = await browser.newPage()
            await page.goto(link)
            const fb = await page.evaluate(() => window.location.href)
            data = fb.split("/")[2]
          } catch (e) {
            console.log(e.message)
          }
        }
        return data
      }
      let id = findIdFb(url)
      console.log(id)
      res.status(201).json({
        message: `ID: ${id}`,
        status: true
      })
    }
  }
}

module.exports = new UserController()
