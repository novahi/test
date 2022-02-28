require("dotenv").config()
const puppeteer = require("puppeteer")
const download = require("image-downloader")
const linkLogin = "https://www.instagram.com/accounts/login/"
class UserController {
  get (req, res) {
    res.status(200).render("get")
  }
  async post(req, res) {
    try {
    let { url } = req.body
    url = url.toLowerCase()
    const browser = await puppeteer.launch({
      headless: true,
      // args: [
      //        '--no-sandbox',
      //        '--disable-setuid-sandbox'
      //        ]
      userDataDir: 'c:/Program Files (x86)/Google',
      executablePath: 'c:/Program Files/Google/Chrome/Application/chrome.exe'
    })
    const page = await browser.newPage()
    await page.goto(url, {
      waitUntil: 'networkidle0'
    })
    const isLogin = await  page.evaluate(() => window.location.href)
    if(isLogin.includes(linkLogin)) {
      await Promise.all([
         page.waitForSelector("input[name='username']"),
         page.waitForSelector("input[name='password']"),
         page.waitForSelector("button[type='submit']")
    ])
      await page.type("input[name='username']", process.env.USERNAME_IG, { delay: 200});
      await page.type("input[name='password']", process.env.PASSWORD_IG, { delay: 200 });
      await Promise.all([page.click("button[type='submit']"), page.waitForNavigation({ waitUntil: "networkidle0"})])
    }
    await page.goto(url, { waitUntil: "networkidle0" })
    const image = await page.evaluate(() => {
      let link = document.querySelectorAll("img[class='FFVAD']")
      link = [...link]
      link = link.map(x => {
        let url = x.getAttribute("srcset")
        url = url.split(",")
        url = url[url.length -1]
        url = url.split(" ")[0]
        return url
      })
      return link
    })
    console.log(image)

    await browser.close()
    const dir = "C:/Users/Administrator/test/src/public/"
    let files = await Promise.all(image.map(x => download.image({
      url: x,
      dest: `${dir}image`
    })))
    files = await files.map(x => x.filename.split("\\").join("/").replace(dir, "/"))
    res.status(201).json({
      message: "Get image successfully! ",
      status: true,
      image: files
    })
    } 
    catch (e) {
      console.log("co loi")
      console.log(e.message)
      res.status(404).json({
        message: "co loi",
        status: false
      })
    }
  }
}

module.exports = new UserController()
