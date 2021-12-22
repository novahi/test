const  User = require('../models/User')

class SiteController {
    // [GET] /
    async home(req, res, next) {
      await res.render('home')
    }

    // [GET] /search
    async search(req, res) {
        await res.render('search')
    }
}

module.exports = new SiteController()
