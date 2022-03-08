require("dotenv").config()
const fs = require("fs")
const puppeteer = require("puppeteer")
const download = require("image-downloader")
const file = require("fs-extra/lib/ensure/file")
const linkLogin = "https://www.instagram.com/accounts/login/"
class UserController {
  get(req, res) {
    res.status(200).render("get")
  }
  async post(req, res) {
    try {
      let { url } = req.body
      url = url.toLowerCase()
      console.log(`Bật trình duyệt và mở trang ${url}`)
      const dir = __dirname.split("\\").join("/").replace("app/controllers", "public")
      if (fs.existsSync(`${dir}/image`)) {
        console.log(`có thư mục`)
        fs.rmdirSync(`${dir}/image`, { recursive: true })
        fs.mkdirSync(`${dir}/image`)
      } else {
        console.log(`không `)
        fs.mkdirSync(`${dir}/image`)
      }
      const browser = await puppeteer.launch({
        // headless: false,
         args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
                ]
      //  userDataDir: 'c:/Program Files (x86)/Google',
      //  executablePath: 'c:/Program Files/Google/Chrome/Application/chrome.exe'
      })
      const page = await browser.newPage()
      await page.goto(url, {
        waitUntil: 'networkidle0'
      })
      console.log(`Kiểm tra xem đã đăng nhập IG chưa (nếu chưa thì đăng nhập)`)
      const isLogin = await page.evaluate(() => window.location.href)
      if (isLogin.includes(linkLogin)) {
        console.log(`chưa đăng nhập và bất đầu đăng nhập`)
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
      console.log(`Đăng nhập thành công, bắt đầu tự động cuộn trang và lấy ra tất cả link ảnh `  )
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
      console.log(`lấy  ảnh thành công và đóng trình duyệt`)
      console.log(`bất đầu chính sửa lại link và gửi tới client `)
      let files = await Promise.all(image.map(x => download.image({
        url: x,
        dest: `${dir}/image`
      })))
      files = await files.map(x => ({
        url: x.filename.replace(dir, ""),
        filename: x.filename.replace(`${dir}/image/`, "")
      }))
      const viewsImages = files.slice(0, files.length >= 25 ? 25 : files.length)
      console.log(`done !`)
      res.status(201).json({
        message: "Thành Công !",
        status: true,
        images: files,
        results: viewsImages
      })
    } catch (e) {
      console.error(`Erorr: ${e.message}`)
      res.status(404).json({
        message: "Có lỗi !",
        status: false
      })
    }
  }
}

module.exports = new UserController()
