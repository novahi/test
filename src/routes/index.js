const newsRouter = require('./news')
const siteRouter = require('./site')
const userRouter = require('./user')


function route(app) {
    app.use('/users', userRouter)
    app.use('/news', newsRouter)
    app.use('/', siteRouter)
}

module.exports = route
