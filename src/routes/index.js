const newsRouter = require('./news')
const siteRouter = require('./site')
const userRouter = require('./user')
const loginRouter = require('./login')

function route(app) {
    app.use('/login', loginRouter)
    app.use('/users', userRouter)
    app.use('/news', newsRouter)
    app.use('/', siteRouter)
}

module.exports = route
