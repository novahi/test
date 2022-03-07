require("dotenv").config()
const fs = require("fs")
const puppeteer = require("puppeteer")
const download = require("image-downloader")
const linkLogin = "https://www.instagram.com/accounts/login/"
class UserController {
  get(req, res) {
    res.status(200).render("get")
  }
  async post(req, res) {
    try {
      let { url } = req.body
      url = url.toLowerCase()
      console.log(`get ${url}`)
      const dir = "C:/Users/Administrator/test/src/public/"
      if (fs.existsSync(`${dir}image`)) {
        fs.rmdirSync(`${dir}image`, { recursive: true })
        fs.mkdirSync(`${dir}image`)
      } else {
        fs.mkdirSync(`${dir}image`)
      }
      const browser = await puppeteer.launch({
        // headless: false,
         args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
                ]
       // userDataDir: 'c:/Program Files (x86)/Google',
       // executablePath: 'c:/Program Files/Google/Chrome/Application/chrome.exe'
      })
      const page = await browser.newPage()
      await page.goto(url, {
        waitUntil: 'networkidle0'
      })
      console.log(`Login IG and goto url`)
      const isLogin = await page.evaluate(() => window.location.href)
      if (isLogin.includes(linkLogin)) {
        await Promise.all([
          page.waitForSelector("input[name='username']"),
          page.waitForSelector("input[name='password']"),
          page.waitForSelector("button[type='submit']")
        ])
        await page.type("input[name='username']", process.env.USERNAME_IG, {
          delay: 200
        });
        await page.type("input[name='password']", process.env.PASSWORD_IG, {
          delay: 200
        });
        await Promise.all([page.click("button[type='submit']"), page.waitForNavigation({
          waitUntil: "networkidle0"
        })])
      }
      await page.goto(url, {
        waitUntil: "networkidle0"
      })
      console.log(`start auto scroll page and get link all image`)
      const image = await page.evaluate(async () => {
        let array = [];
        const listImage = await new Promise((resolve, reject) => {
          let url;
          const autoScroll = setInterval(() => {
            let results = array;
            let loading = document.querySelector("svg.By4nA");
            if (!loading) {
              resolve(results);
              clearInterval(autoScroll);
            };
            window.scrollBy(0, window.innerHeight);
            let image = Array.from(document.querySelectorAll("img.FFVAD"));
            image.forEach(x => {
              url = x.getAttribute("srcset");
              if (url) {
                url = url.split(",");
                url = url[url.length - 1].split(" ")[0];
                results.includes(url) ? null : results.push(url)
              }
            });
          }, 700)
        });
        return listImage
      })
      await browser.close()
      console.log(`get success and close browser`)
      let files = await Promise.all(image.map(x => download.image({
        url: x,
        dest: `${dir}image`
      })))
      files = await files.map(x => ({
        url: x.filename.split("\\").join("/").replace(dir, "http://localhost:3000/"),
        filename: x.filename.split("\\").join("/").replace(`${dir}image/`, "")
      }))
      const viewsImages = files.slice(0, files.length >= 25 ? 25 : files.length)
      console.log(`edit path and send image to client`)
      res.status(201).json({
        message: "Get image successfully! ",
        status: true,
        images: files,
        results: viewsImages
      })
    } catch (e) {
      console.error(`Erorr: ${e.message}`)
      res.status(404).json({
        message: "co loi",
        status: false
      })
    }
  }
}

module.exports = new UserController()
