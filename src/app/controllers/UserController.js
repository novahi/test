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
      console.log(`Bật trình duyệt và mở trang ${url}`)
      const dir = __dirname.split("\\").join("/").replace("app/controllers", "public")
      if (fs.existsSync(`${dir}/image`)) {
        console.log(`tạo `)
        fs.rmdir(`${dir}/image`, { recursive: true }, (err) => {
          if(err) {
            return console.log(err)
          }
          fs.mkdir(`${dir}/image`, { recursive: true }, (err) => {
            if(err) {
              return console.log(err)
            }
            console.log(`tạo lại thành công`)
          })
        })
        
      } else {
        fs.mkdir(`${dir}/image`, { recursive: true }, (err) => {
          if(err) {
            return console.log(err)
          }
          console.log(`tạo thành công !`)
        })
      }
      const browser = await puppeteer.launch({
        // headless: false,
        // args: [
        //         '--no-sandbox',
        //         '--disable-setuid-sandbox'
        //         ]
        userDataDir: 'c:/Program Files (x86)/Google',
        executablePath: 'c:/Program Files/Google/Chrome/Application/chrome.exe'
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
      const imgData = await page.evaluate(async () => {
        async function loopImg(selectorAll) {
  try {
    let storage = [];
    let allImg = document.querySelectorAll(selectorAll);
    if (allImg) {
      return await new Promise((resolve, reject) => {
        let store = storage;
        const interval = setInterval(() => {
          let loading = document.querySelector("svg.By4nA");
          if(!loading) {
          resolve(store);
          clearInterval(interval)
          };
          let loop = [...document.querySelectorAll(selectorAll)];
          loop.forEach(x => {
            let url = x.getAttribute("srcset");
            if(url) {
              url = url.split(",");
              url = url[url.length - 1].split(" ")[0];
              store.includes(url) ? null : store.push(url);
            }
          });
          window.scrollBy(0, window.innerHeight)
        })
      })
    }
  } catch (e) {
    console.log(`Error loopImg: ${e.message}`)
  }
};
async function getBase64(listImg) {
  try {
    let imgs = listImg;
    let storage = [];
    if(imgs) {
      return await new Promise((resolve, reject) => {
        let store = storage;
        imgs.forEach(x => {
          let img = new Image();
          img.crossOrigin = "Anonymous";
          img.onload = () => {
            let canvas = document.createElement("canvas");
            canvas.height = img.height;
            canvas.width = img.width;
            let ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            let dataUrl = canvas.toDataURL("image/jpeg");
            store.includes(dataUrl) ? null : store.push(dataUrl);
            store.length == imgs.length ? resolve(store) : null
          };
          img.src = x
        })
      })
      .then(data => {
        console.log(`Convert success ${data.length} image to base64`);
        return data
      })
    }
  } catch (e) {
    console.log(`Error base64: ${e.message}`)
  }
}
  const allImage = await loopImg("img.FFVAD");
  const base64 = await getBase64(allImage);
  return base64
      })
      await browser.close()
      console.log(`lấy  ảnh thành công và đóng trình duyệt`)
      console.log(`bất đầu chính sửa lại link và gửi tới client `)
      
      let infoImage = await imgData(x => {
        let newData = x.split(",")[1]
        return {
          imgData: newData,
          name: `Qiz_IG_${newData.slice(0, x.length >= 0 ? 10 : x.length)}.jpg`
        }
      })
      const viewsImages = infoImage.slice(0, infoImage.length >= 25 ? 25 : infoImage.length)
      console.log(`done !`)
      res.status(201).json({
        message: "Thành Công !",
        status: true,
        images: infoImage,
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
